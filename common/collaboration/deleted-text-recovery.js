/*
 * (c) Copyright Ascensio System SIA 2010-2023
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";

(function (window)
{

	/**
	 * Класс, восстанавливающий удаленные части документа
	 * @param {AscWord.Document} logicDocument
	 * @constructor
	 */
	function DeletedTextRecovery(logicDocument)
	{
		this.document = logicDocument;
		
		/**
		 * Список всех изменений связанных с удалением текста
		 * @type {*[]}
		 */
		this.m_RewiewDelPoints		= [];
		this.userId					= undefined;
		this.userName				= undefined;
		this.userTime				= undefined;

		this.oCollaborativeMarksData		= {};
		this.oCollabColor					= {};
		this.oRunSplits						= {};
		this.oClasses						= {};
		this.oCollaborativeMarksDataDefault	= {};
		this.oDefaultChangedClasses			= AscCommon.CollaborativeEditing.m_aChangedClasses;
	}
	DeletedTextRecovery.prototype.GetDataForProceedMarks = function (isDefault)
	{
		let oMarksClasses	= AscCommon.CollaborativeEditing.m_aChangedClasses;
		let arrKeys			= Object.keys(oMarksClasses);

		for (let nKey = 0; nKey < arrKeys.length; nKey++)
		{
			let strCurrentKey	= arrKeys[nKey];
			let oCurrentRun		= oMarksClasses[strCurrentKey];

			if (!oCurrentRun instanceof ParaRun)
				continue;

			let oCurrentMarks	= oCurrentRun.CollaborativeMarks;
			let arrContentRun	= oCurrentRun.Content;

			if (!oCurrentMarks)
				continue;

			let arrRanges	= oCurrentMarks.Ranges;
			let arrContent	= [];
			let arrColor	= [];

			for (let i = 0; i < arrRanges.length; i++)
			{
				let oCurrentRange	= arrRanges[i];
				let nStart			= oCurrentRange.PosS;
				let nEnd			= oCurrentRange.PosE;
				let oColor			= oCurrentRange.Color;
				arrColor.push(oColor);

				for (let nContent = nStart; nContent < nEnd; nContent++)
				{
					let oCurrentEl = arrContentRun[nContent];
					arrContent.push(oCurrentEl);
				}
			}

			this.oCollaborativeMarksData[strCurrentKey]		= arrContent;

			if (isDefault)
				this.oCollaborativeMarksDataDefault[strCurrentKey] = arrContent;

			this.oCollabColor[strCurrentKey]				= arrColor;
		}
	}
	DeletedTextRecovery.prototype.GetPositionsOfCollaborativeMarks = function (isDefault)
	{
		let oOutput			= {}
		let oMarksClasses	= this.oDefaultChangedClasses;
		let arrKeys			= Object.keys(oMarksClasses);

		for (let nKey = 0; nKey < arrKeys.length; nKey++)
		{
			let strCurrentKey	= arrKeys[nKey];
			let oCurrentRun		= oMarksClasses[strCurrentKey];

			if (!oCurrentRun instanceof ParaRun)
				continue;

			let arrCollaborativeData = isDefault
				? this.oCollaborativeMarksDataDefault[strCurrentKey]
				: this.oCollaborativeMarksData[strCurrentKey];

			if (!arrCollaborativeData)
				continue;

			let arrPositions = [];

			for (let i = 0; i < arrCollaborativeData.length; i++)
			{
				let oCurrentEl = arrCollaborativeData[i];
				let nPos = this.FindPosInTextClass(oCurrentRun, oCurrentEl);

				if (nPos || nPos === 0)
					arrPositions.push(nPos);
			}

			if (arrPositions.length === 0)
			{
				let oNewRun = this.oRunSplits[oCurrentRun.Id];
				if (!oNewRun)
				{
					oCurrentRun.CollaborativeMarks.Clear();
					continue;
				}

				let strNewCurrentKey						= oNewRun.Id;
				this.oCollaborativeMarksData[oNewRun.Id]	= oNewRun;

				for (let i = 0; i < arrCollaborativeData.length; i++)
				{
					let oCurrentEl	= arrCollaborativeData[i];
					let nPos		= this.FindPosInTextClass(oNewRun, oCurrentEl);

					if (nPos || nPos === 0)
						arrPositions.push(nPos);
				}

				if (arrPositions > 0)
				{
					this.oCollabColor[oNewRun.Id]	= this.oCollabColor[oCurrentRun.Id];
					oCurrentRun						= oNewRun;
					oOutput[strNewCurrentKey]		= arrPositions;
					this.oClasses[strNewCurrentKey]	= oNewRun;
				}
				continue;
			}
			oOutput[strCurrentKey]			= arrPositions;
			this.oClasses[strCurrentKey]	= oCurrentRun;
		}
		return oOutput;
	}
	DeletedTextRecovery.prototype.ApplyCollaborativeMarks = function (isDefault)
	{
		let oCollaborative	= this.GetPositionsOfCollaborativeMarks(isDefault);

		AscCommon.CollaborativeEditing.Clear_CollaborativeMarks(true);

		let oCollaborativeMarks	= CollapsePositions(oCollaborative);
		let arrKeys				= Object.keys(oCollaborativeMarks);

		for (let nKey = 0; nKey < arrKeys.length; nKey++)
		{
			let strCurrentKey	= arrKeys[nKey];
			let arrCurrentRules	= oCollaborativeMarks[strCurrentKey];

			for (let i = 0; i < arrCurrentRules.length; i++)
			{
				let oCurrentRule	= arrCurrentRules[i];
				let oColor			= this.oCollabColor[strCurrentKey][i];
				oCurrentRule.Color	= oColor;
			}
		}

		for (let strId in oCollaborativeMarks)
		{
			let arrRules	= oCollaborativeMarks[strId];
			let oRun		= this.oClasses[strId];
			oRun.CollaborativeMarks.Ranges.length = 0;

			for (let nCount = 0; nCount < arrRules.length; nCount++)
			{
				let oCurrentRule	= arrRules[nCount];
				let nStart			= oCurrentRule.nStart;
				let nEnd			= oCurrentRule.nEnd + 1;
				let oColor			= oCurrentRule.Color;

				if (!oColor)
					continue;

				oRun.CollaborativeMarks.Add(nStart, nEnd, oColor);
			}
		}
	}
	/**
	 * Инициализация и создание промежуточных данных для отображения удаленного текста в текущей ревизии
	 */
	DeletedTextRecovery.prototype.HandleChanges = function()
	{
		AscCommon.CollaborativeEditing.CoHistory.SplitChangesByPoints();
		
		let oCoHistory			= AscCommon.CollaborativeEditing.CoHistory;
		let arrChangesList		= oCoHistory.Changes;
		let arrPointsList		= AscCommon.CollaborativeEditing.CoHistory.ChangesSplitByPoints;
		let nIndex				= AscCommon.CollaborativeEditing.CoHistory.curChangeIndex;
		let arrChanges			= arrChangesList.slice(0, arrPointsList[nIndex]);

		if (!arrChanges || !arrChanges.length)
			return;

		let arrDelChanges	= [];

		// разделяем по типу изменений
		for (let i = 0; i < arrChanges.length; i++)
		{
			let oCurrentChange = arrChanges[i];

			if (oCurrentChange instanceof AscCommon.CChangesTableIdDescription)
			{
				if (arrDelChanges.length > 0 && arrDelChanges[arrDelChanges.length - 1].length === 1)
					arrDelChanges.length = arrDelChanges.length - 1;

				arrDelChanges.push([oCurrentChange]);
			}

			if (oCurrentChange instanceof CChangesRunRemoveItem || oCurrentChange instanceof CChangesParagraphRemoveItem || oCurrentChange instanceof CChangesDocumentRemoveItem)
			{
				if (arrDelChanges.length > 0)
				{
					let oLast = arrDelChanges[arrDelChanges.length - 1];
					oLast.push(oCurrentChange);
				} else
				{
					arrDelChanges.push([oCurrentChange]);
				}
			} else if (oCurrentChange instanceof CChangesRunAddItem || oCurrentChange instanceof CChangesParagraphAddItem || oCurrentChange instanceof CChangesDocumentAddItem)
			{
				if (arrDelChanges.length > 0)
				{
					let oLast = arrDelChanges[arrDelChanges.length - 1];
					oLast.push(oCurrentChange);
				}
				else
				{
					arrDelChanges.push([oCurrentChange]);
				}
			}
		}

		// если блок изменений состоит только из CChangesTableIdDescription, убираем этот блок
		for (let i = 0; i < arrDelChanges.length; i++)
		{
			if (arrDelChanges[i].length === 1 && arrDelChanges[i][0] instanceof AscCommon.CChangesTableIdDescription)
				arrDelChanges[i].length = 0;
		}

		this.m_RewiewDelPoints = arrDelChanges;
	};
	/**
	 * Отображаем удаленный текст в текущей точки истории ревизии
	 * @return {boolean}
	 * @constructor
	 */
	DeletedTextRecovery.prototype.RecoverDeletedText = function()
	{
		return this.ShowDelText();
	};
	/**
	 * Получаем подготовленные данные, разбитые по точкам
	 * @return {*[]}
	 * @constructor
	 */
	DeletedTextRecovery.prototype.GetChanges = function()
	{
		let arrInput = [];

		for (let nCounter = 0; nCounter < this.m_RewiewDelPoints.length; nCounter++)
		{
			let arrCurr = this.m_RewiewDelPoints[nCounter];
			if (nCounter + 1 < AscCommon.CollaborativeEditing.CoHistory.curChangeIndex)
			{
				let arrTemp = [];
				for (let j = 0; j < arrCurr.length; j++)
				{
					arrTemp.push(arrCurr[j]);
				}

				if (arrTemp.length > 0)
					arrInput.push(arrTemp);
			}
		}

		return arrInput;
	};
	/**
	 * Отменяем заданные изменения
	 * @param arrInputChanges
	 * @return {*[]}
	 * @constructor
	 */
	DeletedTextRecovery.prototype.RedoUndoChanges = function (arrInputChanges)
	{
		let oAddText	= new AddTextPositions();
		let oRemoveText	= new RemoveTextPositions();
		arrInputChanges	= arrInputChanges.reverse();

		let delChanges	= [];

		for (let i = 0; i < arrInputChanges.length; i++)
		{
			let arrChanges = arrInputChanges[i].reverse();

			for (let y = 0; y < arrChanges.length; y++)
			{
				let oCurChange = arrChanges[y];

				if (oCurChange instanceof AscCommon.CChangesTableIdDescription)
					continue;

				oCurChange = oCurChange.Copy();

				if (oCurChange.ConvertToSimpleChanges && oCurChange.PosArray.length > 1)
					oCurChange = oCurChange.ConvertToSimpleChanges();

				if (!Array.isArray(oCurChange))
					oCurChange = [oCurChange];

				for (let k = 0; k < oCurChange.length; k++)
				{
					let oCur = oCurChange[k];
					if (arrChanges[y].PosArray.length > 1)
						oCur.Pos += k;

					oRemoveText.ProceedChange(oCur)

					if (oCur instanceof CChangesRunAddItem || oCur instanceof CChangesParagraphAddItem || oCur instanceof CChangesDocumentAddItem)
					{
						if (oAddText.Check(oCur, oRemoveText))
							oAddText.AddChange(oCur)
					}
					else if (oCur instanceof CChangesRunRemoveItem || oCur instanceof CChangesParagraphRemoveItem || oCur instanceof CChangesDocumentRemoveItem)
					{
						if (oCur.UseArray)
						{
							oRemoveText.AddToClass(oCur.Class, oCur, oCur.PosArray[0]);
						}
						else
						{
							oRemoveText.AddToClass(oCur.Class, oCur, oCur.Pos);
						}

						let oCurrentRun = oCur.Class;
						if (oCurrentRun.CollaborativeMarks)
						{
							let arrMarks = oCurrentRun.CollaborativeMarks.Ranges;
							for (let p = 0; p < arrMarks.length; p++)
							{
								let oCurrentMark = arrMarks[p];
								if (oCurrentMark.PosS >= oCur.PosArray[0])
								{
									oCurrentMark.PosS++;
									oCurrentMark.PosE++;
								}
							}
						}
					}
				}
			}
		}

		let arr = oRemoveText.GetLinear();
		for (let i = 0; i < arr.length; i++)
		{
			this.RedoUndoChange(arr[i], false, delChanges);
		}

		let result = {
			data: oRemoveText.ProceedPositions(this),
			classes: oRemoveText.oClasses
		};

		return [delChanges, result];
	};
	/**
	 * Создаем точку в истории для сбора данных об отображении удаленного текста
	 * @constructor
	 */
	DeletedTextRecovery.prototype.CheckPointInHistory = function ()
	{
		let localHistory = AscCommon.History;

		if (localHistory.Points.length === 0 ||
			(localHistory.Points.length > 0 && localHistory.Points[localHistory.Points.length - 1].Description !== AscDFH.historydescription_Collaborative_DeletedTextRecovery))
			AscCommon.History.Create_NewPoint(AscDFH.historydescription_Collaborative_DeletedTextRecovery);
	};
	DeletedTextRecovery.prototype.ShowDelText = function ()
	{
		let nTempGlobalLock = AscCommon.CollaborativeEditing.m_bGlobalLock;
		AscCommon.CollaborativeEditing.m_bGlobalLock = 0;

		this.UndoShowDelText()
		this.HandleChanges();
		this.CheckPointInHistory();

		let historyStore		= AscCommon.CollaborativeEditing.CoHistory.CoEditing.m_oLogicDocument.Api.VersionHistory;

		if (!historyStore)
			return false;

		let strUserId			= historyStore.userId;
		let strUserName			= historyStore.userName;
		let strDateOFRevision	= historyStore.dateOfRevision;
		let timeOfRevision		= new Date(strDateOFRevision).getTime();
		let arrInput			= this.GetChanges();

		if (arrInput.length === 0)
			return false;

		this.userId				= strUserId;
		this.userName			= strUserName;
		this.userTime			= timeOfRevision;

		// отменяем изменения до нужного места (необходимо для перемещения по истории)
		let arrCurrentPoint	= this.RedoUndoChanges(arrInput);
		let delChanges = arrCurrentPoint[0];
		let arrResult  = arrCurrentPoint[1];

		for (let i = 0; i < delChanges.length; i++)
		{
			this.document.History.Add(delChanges[i]);
		}
		this.Split(arrResult);
		this.document.RecalculateByChanges(delChanges);

		this.ApplyCollaborativeMarks(true);
		AscCommon.CollaborativeEditing.m_bGlobalLock = nTempGlobalLock;
		return true;
	};
	DeletedTextRecovery.prototype.Split = function (arrInput)
	{
		let data	= arrInput.data;
		let classes	= arrInput.classes;
		let arrKeys	= Object.keys(data);

		for (let nKey = 0; nKey < arrKeys.length; nKey++)
		{
			let strCurrentKey		= arrKeys[nKey];
			let arrCurrentRunData	= data[strCurrentKey];
			let oCurrentRun			= classes[strCurrentKey];

			arrCurrentRunData.sort(function (a, b) { return a.nStart - b.nStart })

			for (let j = arrCurrentRunData.length - 1; j >= 0; j--)
			{
				let oCurrentRule = arrCurrentRunData[j];
				let nStart = oCurrentRule.nStart;
				let nEnd = oCurrentRule.nEnd;

				if (oCurrentRun instanceof CDocument)
				{
					let arrContent	= oCurrentRun.Content;

					for (let j = nStart; j <= nEnd; j++)
					{
						let oCurrentParagraph = arrContent[j];
						if (oCurrentParagraph)
							this.SetReviewInfo(oCurrentParagraph);
					}
				}
				else if (oCurrentRun instanceof Paragraph)
				{
					let arrContent	= oCurrentRun.Content;

					if (nStart === 0 && arrContent.length === nEnd)
					{
						this.SetReviewInfo(oCurrentRun);
					}
					else
					{
						for (let i = nStart; i <= nEnd; i++)
						{
							this.SetReviewInfo(arrContent[i]);
						}
					}
				}
				else if (oCurrentRun instanceof ParaRun)
				{
					let newCollab = [];

					if (oCurrentRun.Content.length === 0 || (nEnd + 1 - nStart) === oCurrentRun.Content.length)
					{
						this.SetReviewInfo(oCurrentRun);
						continue;
					}

					for (let i = 0; i < oCurrentRun.CollaborativeMarks.Ranges.length; i++)
					{
						newCollab[i] = oCurrentRun.CollaborativeMarks.Ranges[i];
					}
					let oParent		= oCurrentRun.GetParent();
					let RunPos		= this.FindPosInParent(oCurrentRun);
					let RightRun	= oCurrentRun.SplitForSpreadCollaborativeMark(nStart);

					let nNewStartPos
					let nCount, oColor;

					oParent.Add_ToContent(RunPos + 1, RightRun);
					let oNewer = RightRun.SplitForSpreadCollaborativeMark(nEnd - nStart + 1);

					this.oRunSplits[oCurrentRun.Id] = oNewer;

					oParent.Add_ToContent(RunPos + 2, oNewer);
					this.SetReviewInfo(RightRun);

					for (let i = 0; i < newCollab.length; i++)
					{
						let oCurCollaborativeMark	= newCollab[i];
						let nStartPos				= oCurCollaborativeMark.PosS;
						let nEndPos					= oCurCollaborativeMark.PosE;

						oColor						= oCurCollaborativeMark.Color;

						let nCurrentCount			= oCurrentRun.Content.length;
						let nDelCount				= RightRun.Content.length;

						if (nEndPos > nCurrentCount)
						{
							// Вычислите новые позиции относительно oNewer
							nNewStartPos = nStartPos - nCurrentCount - nDelCount;
							nCount = nEndPos - nCurrentCount - nDelCount;
							oNewer.CollaborativeMarks.Add(nNewStartPos, nCount, oColor);
						}
					}
				}
			}
		}
	}
	DeletedTextRecovery.prototype.SetReviewInfo = function (oReviewInfoParent)
	{
		if (!oReviewInfoParent === undefined)
			return;

		if (!oReviewInfoParent || !oReviewInfoParent.ReviewInfo)
		{
			if (oReviewInfoParent instanceof ParaMath)
			{
				let oRootContent = oReviewInfoParent.Root.Content;
				for (let i = 0; i < oRootContent.length; i++)
				{
					let oCurrentContent = oRootContent[i];
					this.SetReviewInfo(oCurrentContent);
				}
			}
			else if (oReviewInfoParent.Content.length > 0)
			{
				for (let i = 0; i < oReviewInfoParent.Content.length; i++)
				{
					let oCurrentContent = oReviewInfoParent.Content[i];
					this.SetReviewInfo(oCurrentContent);
				}
			}
			return;
		}

		if (oReviewInfoParent.ReviewType !== 1)
		{
			let oCurrentReviewType			= oReviewInfoParent.GetReviewInfo().Copy();
			oCurrentReviewType.UserId		= this.userId;
			oCurrentReviewType.UserName		= this.userName;
			oCurrentReviewType.DateTime		= this.userTime;

			oReviewInfoParent.SetReviewTypeWithInfo(1, oCurrentReviewType, false);
		}
	};
	DeletedTextRecovery.prototype.FindPosInParent = function(oClass)
	{
		let oParent				= oClass.GetParent();
		let arrParentContent	= oParent.Content;

		for (let i = 0; i < arrParentContent.length; i++)
		{
			if (arrParentContent[i] === oClass)
				return i;
		}
	};
	DeletedTextRecovery.prototype.FindPosInTextClass = function (oClass, oItem)
	{
		let arrParentContent	= oClass.Content;

		for (let nPos = 0; nPos < arrParentContent.length; nPos++)
		{
			if (arrParentContent[nPos] === oItem)
				return nPos;
		}
	}
	DeletedTextRecovery.prototype.Check = function (isDefault)
	{
		// проверяем правильность окрашивания ранов
		this.ApplyCollaborativeMarks(isDefault);
	};
	DeletedTextRecovery.prototype.RedoUndoChange = function (oChange, isRedo, arrToSave)
	{
		if (!oChange)
			return;

		if (oChange.IsContentChange())
		{
			let arrSimpleChanges = oChange.ConvertToSimpleChanges();

			for (let simpleIndex = arrSimpleChanges.length - 1; simpleIndex >= 0; simpleIndex--)
			{
				if (isRedo)
					arrSimpleChanges[simpleIndex].Redo();
				else
					arrSimpleChanges[simpleIndex].Undo();


				let oRevChange = arrSimpleChanges[simpleIndex];

				if (!isRedo)
					oRevChange = oRevChange.CreateReverseChange();

				if (oRevChange)
					arrToSave.push(oRevChange);
			}
		}
		else
		{
			if (isRedo)
				oChange.Redo();
			else
				oChange.Undo();

			let oRevChange = oChange;

			if (!isRedo)
				oRevChange = oRevChange.CreateReverseChange();

			if (oRevChange)
				arrToSave.push(oRevChange);
		}
	};
	DeletedTextRecovery.prototype.UndoShowDelText = function (isNavigation)
	{

		let localHistory	= AscCommon.History;
		let oLastPoint		= localHistory.Points[localHistory.Points.length - 1];

		if ((isNavigation && oLastPoint && oLastPoint.Description === AscDFH.historydescription_Collaborative_MoveByHistory)
			|| (!isNavigation && oLastPoint && oLastPoint.Description === AscDFH.historydescription_Collaborative_DeletedTextRecovery))
		{
			let arrChanges = localHistory.UndoLastPoint();
			this.document.RecalculateByChanges(arrChanges);
			localHistory.Remove_LastPoint();
			return true
		}
	};

	function AddTextPositions()
	{
		this.data = {};
		this.wait = {};

		this.Check = function (oCurChange, oRemove)
		{
			if (oCurChange.Class)
			{
				let strCurrentId	= oCurChange.Class.Id;
				let arrRemData		= oRemove.data[strCurrentId];
				if (!arrRemData)
					return true;

				let addItem			= oCurChange.Items[0];

				for (let i = 0; i < arrRemData.length; i++)
				{
					let oCurrentRemItem = arrRemData[i];

					if (oCurChange.UseArray && oCurChange.PosArray[0] === oCurrentRemItem.pos && addItem.Value === oCurrentRemItem.item.Items[0].Value)
					{
						if (oRemove.data[strCurrentId])
						{
							let currentArr = oRemove.data[strCurrentId];
							for (let i = 0; i < currentArr.length; i++)
							{
								if (oCurChange.UseArray)
								{
									if (oCurChange.PosArray[0] < currentArr[i].pos)
									{
										if (oCurChange.UseArray)
											oCurChange.PosArray[0]--
										else
											oCurChange.Pos--;
									}
								}
							}
						}

						let addArr = this.data[strCurrentId];
						if (addArr && addArr.length > 0)
						{
							for (let j = 0; j < addArr.length; j++)
							{
								let oCur = addArr[j];

								if (oCurChange.PosArray[0] < oCur.pos)
								{
									if (oCurChange.UseArray)
										oCur.change.PosArray[0]--
									else
										oCur.change.Pos--;

									oCur.pos--;
								}
							}
						}

						arrRemData.splice(i, 1);
						return false;
					}
					else if (!oCurChange.UseArray && oCurChange.Pos === oCurrentRemItem.pos && addItem.Value === oCurrentRemItem.item.Items[0].Value)
					{
						if (oRemove.data[strCurrentId])
						{
							let currentArr = oRemove.data[strCurrentId];
							for (let i = 0; i < currentArr.length; i++)
							{
								if (oCurChange.UseArray)
								{
									if (oCurChange.PosArray[0] < currentArr[i].pos)
									{
										if (oCurChange.UseArray)
											oCurChange.PosArray[0]--
										else
											oCurChange.Pos--;
									}
								}
							}
						}

						arrRemData.splice(i, 1);
						return false;
					}
				}
			}

			return true;
		}
		this.AddChange = function (oChange)
		{
			let strCurrentId = oChange.Class.Id;

			if (strCurrentId)
			{
				if (!this.data[strCurrentId])
					this.data[strCurrentId] = []

				let oWait;

				if (this.wait[strCurrentId])
					oWait = this.wait[strCurrentId].filter( function (oItem) { return oItem.pos === oChange.pos});

				let nChange = oChange.PosArray ? oChange.PosArray[0] : oChange.Pos;

				// repeat for PosArray array

				if (oWait)
					this.data[strCurrentId][oWait.nCount] = {change: oChange, pos: nChange}
				else
					this.data[strCurrentId].push({change: oChange, pos: nChange});
			}
		}
	}
	function RemoveTextPositions()
	{
		this.data		= {};
		this.oClasses	= {};
		this.arrClasses	= [];

		this.AddToClass = function (oClass, oItem, Pos)
		{
			if (!this.data[oClass.Id])
				this.data[oClass.Id] = [];

			this.data[oClass.Id].push({item: oItem, pos: Pos});
		}
		this.GetLinear = function ()
		{
			let arrOutput = []
			let arrKeys = Object.keys(this.data);

			for (let nKey = 0; nKey < arrKeys.length; nKey++)
			{
				let strCurrentKey = arrKeys[nKey];
				let arrCurrentRunData = this.data[strCurrentKey];


				for (let i = 0; i < arrCurrentRunData.length; i++)
				{
					arrOutput.push(arrCurrentRunData[i].item);
				}
			}

			return arrOutput;
		}
		this.ProceedChange = function (oChange)
		{
			if (oChange.Class && !this.oClasses[oChange.Class.Id])
			{
				this.oClasses[oChange.Class.Id] = oChange.Class;
				if (-1 === this.arrClasses.indexOf(oChange.Class.Id))
				{
					this.arrClasses.push(oChange.Class.Id);
				}
			}
		}
		this.FindInParent = function (oClass, oItem)
		{
			let arrParentContent	= oClass.Content;

			for (let nPos = 0; nPos < arrParentContent.length; nPos++)
			{
				if (arrParentContent[nPos] === oItem)
					return nPos;
			}
		}
		this.ProceedPositions = function ()
		{
			for (let nKey = 0; nKey < this.arrClasses.length; nKey++)
			{
				let strCurrentKey			= this.arrClasses[nKey];
				let arrCurrentRunData		= this.data[strCurrentKey];
				if (!arrCurrentRunData)
					continue;
				let oClass					= this.oClasses[strCurrentKey];
				let newArrCurrentRunData	= [];

				for (let i = 0; i < arrCurrentRunData.length; i++)
				{
					let oItem = arrCurrentRunData[i];

					let nPos = this.FindInParent(oClass, oItem.item.Items[0]);
					newArrCurrentRunData.push(nPos);
				}

				let nCurrentPos;
				let nPrevPos;
				let nTempPrevPos;

				for (let nPos = 1; nPos < newArrCurrentRunData.length; nPos++)
				{
					nPrevPos = newArrCurrentRunData[nPos - 1];
					nCurrentPos = newArrCurrentRunData[nPos];

					if (nTempPrevPos === nCurrentPos || nCurrentPos === nPrevPos)
					{
						if (nTempPrevPos)
						{
							nTempPrevPos = undefined;
							newArrCurrentRunData[nPos] = nPrevPos + 1;
							nTempPrevPos = nCurrentPos;
						}
						else
						{
							newArrCurrentRunData[nPos] = nCurrentPos + 1;
							nTempPrevPos = nCurrentPos;
						}
					}
				}
				this.data[strCurrentKey] = newArrCurrentRunData;
			}
			const transformedObject = CollapsePositions(this.data);
			return transformedObject
		}
	}
	function CollapsePositions (oInput)
	{
		const transformedObject = {};
		for (const key in oInput)
		{
			if (oInput.hasOwnProperty(key))
			{
				const values = oInput[key];
				const pairs = [];
				let nStart = null;
				let nEnd = null;
				let decreasingSequence = false;

				for (let i = 0; i < values.length; i++)
				{
					const value = values[i];

					if (nStart === null)
					{
						nStart = value;
						nEnd = value;
					}
					else if (value === nEnd + 1)
					{
						nEnd = value;
						decreasingSequence = false;
					}
					else if (value === nEnd - 1)
					{
						nStart = value;
						decreasingSequence = true;
					}
					else
					{
						pairs.push({ nStart, nEnd });
						nStart = value;
						nEnd = value;
						decreasingSequence = false;
					}
				}

				if (nStart !== null && nEnd !== null)
					pairs.push({ nStart, nEnd });

				transformedObject[key] = pairs;
			}
		}
		return transformedObject;
	}
	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.DeletedTextRecovery = DeletedTextRecovery;

})(window);
