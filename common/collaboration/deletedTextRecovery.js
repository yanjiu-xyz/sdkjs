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
	 * @constructor
	 */
	function DeletedTextRecovery(isDebug)
	{
		this.oCollaborativeEditingBase = AscCommon.CollaborativeEditing;
		this.oColloborativeHistory = this.oCollaborativeEditingBase.CoHistory;
		this.Changes = this.oColloborativeHistory.Changes;

		this.m_RewiewPoints 	= []; // Отсортированный по типу список изменений
		this.m_RewiewDelPoints 	= []; // Список всех изменений связанных с удалением текста
		this.m_RewiewIndex 		= 0;  // Текущая позиция в истории ревизии для отображения удаленного текста
		this.m_PreparedData 	= []; // Разбитые по ранам изменения связанные с удалением текста
		this.isShowDelText 		= true; // Нужно ли отображать удаленный текст при перемещении по истории ревизии

		this.isDebug = isDebug;
	}
	// Инициализация и создание промежуточных данных для отображения удаленного текста в текущей ревизии
	DeletedTextRecovery.prototype.InitRevision = function ()
	{
		if (!this.Changes || this.Changes.length === 0)
			return;

		let arrChanges 			= this.Changes;
		let arrCurrent		= [];
		let arrTemp			= [];
		let arrDelChanges 	= [];

		// разделяем по типу изменений
		for (let i = 0; i < arrChanges.length; i++)
		{
			let oCurrentChange = arrChanges[i];
			let oPrevChange = i === 0 ? undefined : arrChanges[i - 1];

			if (oCurrentChange instanceof CChangesRunRemoveItem
				|| oCurrentChange instanceof CChangesParagraphRemoveItem
				|| oCurrentChange instanceof CChangesDocumentRemoveItem)
			{
				arrDelChanges.push([arrCurrent.length, oCurrentChange]);
			}

			if (oPrevChange && (oPrevChange instanceof AscCommon.CChangesTableIdDescription || oPrevChange.IsDescriptionChange() === oCurrentChange.IsDescriptionChange()))
			{
				arrTemp.push(oCurrentChange);
			}
			else
			{
				if (arrTemp.length > 0)
				{
					arrCurrent.push(arrTemp);
					arrTemp = [];
				}

				arrTemp = [oCurrentChange]
			}
		}
		if (arrTemp.length > 0)
		{
			arrCurrent.push(arrTemp);
			arrTemp = [];
		}

		// убираем из массива изменения, которые добавляют удаленный текст (до того как его удалили)
		if (arrCurrent.length >= 1)
		{
			for (let i = 0; i < arrCurrent.length; i++)
			{
				let arrCurrentElement = arrCurrent[i];
				for (let j = 0; j < arrCurrentElement.length; j++)
				{
					let oCurrentChange = arrCurrentElement[j];

					if (oCurrentChange instanceof AscCommon.CChangesTableIdDescription)
						continue;

					if (true === this.IsRemovedAfter(arrCurrent, i, oCurrentChange))
					{
						arrCurrentElement.splice(j, 1);
						j--;
					}
				}
			}
		}

		// убираем изменения состоящие только из AscCommon.CChangesTableIdDescription (так как эти изменения этого блока были удалены)
		for (let i = 0; i < arrCurrent.length; i++)
		{
			let arrCurrentElement = arrCurrent[i];

			if (arrCurrentElement === undefined)
				i++;

			if (arrCurrentElement.length === 1)
				arrCurrentElement.length = 0;
		}

		this.m_RewiewPoints		= arrCurrent;
		this.m_RewiewIndex		= this.m_RewiewPoints.length;
		this.m_RewiewDelPoints	= arrDelChanges;
	}
	DeletedTextRecovery.prototype.IsRemovedAfter = function(arrCurrent, nCountInArray, oChange)
	{
		for (let i = nCountInArray + 1; i < arrCurrent.length; i++)
		{
			let arrCurrentElement = arrCurrent[i];

			for (let j = 0; j < arrCurrentElement.length; j++)
			{
				let oCurrentChange = arrCurrentElement[j];

				if (oCurrentChange.Class !== oChange.Class)
					continue;

				if (oCurrentChange instanceof AscCommon.CChangesTableIdDescription)
					continue;

				//  позиции совпадают & контент совпадает
				let isSame =	oCurrentChange.PosArray
					&& oChange.PosArray
					&& oCurrentChange.PosArray[0] 		=== oChange.PosArray[0]
					&&	oCurrentChange.Items
					&& oChange.Items.length > 0
					&& oCurrentChange.Items[0].Value 	=== oChange.Items[0].Value
					&& oCurrentChange.Class 			=== oChange.Class;

				if (isSame)
				{
					// удаляем текущее изменение
					arrCurrentElement.splice(j, 1);
					return true
				}
			}
		}
		return false;
	}
	// получаем верхнюю границу
	DeletedTextRecovery.prototype.GetCountOfNavigationPoints =  function ()
	{
		return this.m_RewiewPoints.length - 1;
	}
	// получаем текущую позицию
	DeletedTextRecovery.prototype.GetCurrentIndexNavigationPoint = function ()
	{
		return this.m_RewiewIndex;
	}
	DeletedTextRecovery.prototype.SetIsShowDelText = function (isShow)
	{
		this.isShowDelText = isShow;
	}
	DeletedTextRecovery.prototype.GetIsShowDelText = function ()
	{
		return this.isShowDelText;
	}
	// подготавливаем данные для отображения удаленного текста
	DeletedTextRecovery.prototype.PrepareDelChanges = function ()
	{
		let arr = [];
		for (let i = 0; i < this.m_RewiewDelPoints.length; i++)
		{
			arr.push(this.m_RewiewDelPoints[i][1]);
		}
		this.m_PreparedData = arr;
	};
	DeletedTextRecovery.prototype.ShowDel = function ()
	{
		this.UndoPoints();
		AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);

		this.PrepareDelChanges();
		this.ShowDelText();

		let changes = this.GetChangesFormHistory();
		editor.WordControl.m_oLogicDocument.RecalculateByChanges(changes);
	};
	DeletedTextRecovery.prototype.ShowDelText = function ()
	{
		let localHistory = AscCommon.History;
		if (localHistory.Points.length === 0)
			AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);

		let arrCurrentPoint = localHistory.Points[0].Items;
		let arrSplits = [];
		let historyStore = this.oCollaborativeEditingBase.m_oLogicDocument.Api.VersionHistory;

		if (!historyStore && !this.isDebug)
			return;

		if (this.isDebug)
		{
			historyStore = {
				userId: 0,
				userName: "DebugName",
				dateOfRevision: new Date().getTime(),
			}
		}

		let strUserId 			= historyStore.userId;
		let strUserName 		= historyStore.userName;
		let strDateOFRevision 	= historyStore.dateOfRevision;
		let timeOfRevision= new Date(strDateOFRevision).getTime();

		this.userId = strUserId;
		this.userName = strUserName;
		this.userTime = timeOfRevision

		for (let nCounter = this.m_PreparedData.length - 1; nCounter >= 0; nCounter--)
		{
			let arrCurrentDel 		= this.m_PreparedData[nCounter];
			if (arrCurrentDel.Items.length > 1)
				arrCurrentDel = arrCurrentDel.ConvertToSimpleChanges();
			else
				arrCurrentDel = [arrCurrentDel];

			for (let nCount = arrCurrentDel.length - 1; nCount >= 0; nCount--)
			{
				let oCurrDel = arrCurrentDel[nCount];
				let oDelChange 	= oCurrDel.CreateReverseChange();
				this.RedoUndoChange(oDelChange, true, arrCurrentPoint);
			}
		}

		let arr = this.ConvertArray(arrCurrentPoint);
		for (let i = 0; i < arr.length; i++)
		{
			let NextRun = null;
			let CurrentDel = arr[i];
			let nCurrentPos = CurrentDel.Start;
			let nCurrentLen = CurrentDel.Len;
			let oCurrentRun = CurrentDel.Class;

			if (oCurrentRun instanceof CDocument)
			{
				let oContent = oCurrentRun.Content;
				for (let j = nCurrentPos; j < nCurrentPos + nCurrentLen; j++)
				{
					let oCurrentParagraph = oContent[j];
					this.SetReviewInfo(oCurrentParagraph);

					let arrRunsInParagraph = oCurrentParagraph.Content;
					for (let nCounterRuns = 0; nCounterRuns < arrRunsInParagraph.length; nCounterRuns++)
					{
						let oCurrentRun = arrRunsInParagraph[nCounterRuns];
						this.SetReviewInfo(oCurrentRun);
					}
				}
			}
			else if (oCurrentRun instanceof Paragraph)
			{
				for (let i = nCurrentPos; i < nCurrentPos + nCurrentLen; i++)
					this.SetReviewInfo(oCurrentRun.Content[i]);
			}
			else if (oCurrentRun instanceof ParaRun)
			{
				for (let j = i + 1; j < arr.length; j++)
				{
					let oNextDel = arr[j];
					if (oNextDel) {
						let nNextPos = oNextDel.Start;
						let nNextLen = oNextDel.Len;
						let oNextRun = oNextDel.Class;

						if (oNextRun === oCurrentRun && nCurrentPos > nNextPos) {
							nCurrentPos += nNextLen;
						}
					}
				}

				if (nCurrentPos === 0 && nCurrentLen >= oCurrentRun.Content.length)
				{
					this.SetReviewInfo(oCurrentRun);
				}
				else if (nCurrentLen === 1)
				{
					let oParent = oCurrentRun.GetParent();
					let RunPos = this.FindPosInParent(oCurrentRun)
					let RightRun = oCurrentRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentPos);

					oParent.Add_ToContent(RunPos + 1, RightRun);
					let oNewer = RightRun.Split2AndSpreadCollaborativeMark(arrSplits, 1);
					oParent.Add_ToContent(RunPos + 2, oNewer);
					NextRun = oNewer;
					this.SetReviewInfo(RightRun);
				}
				else
				{
					let oParent 	= oCurrentRun.GetParent();
					let RunPos = this.FindPosInParent(oCurrentRun);
					let RightRun 	= oCurrentRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentPos);
					oParent.Add_ToContent(RunPos + 1, RightRun);
					NextRun = RightRun;

					if (RightRun.Content.length > 1 && RightRun.Content.length > nCurrentLen) {
						let oNewer = RightRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentLen);
						oParent.Add_ToContent(RunPos + 2, oNewer);
						NextRun = oNewer;
					}
					this.SetReviewInfo(RightRun);
				}

				for (let j = i + 1; j < arr.length; j++)
				{
					let oNextDel = arr[j];
					if (oNextDel)
					{
						let nNextPos = oNextDel.Start;
						let nNextLen = oNextDel.Len;
						let oNextRun = oNextDel.Class;

						if (oNextRun === oCurrentRun && nCurrentPos < nNextPos)
						{
							oNextDel.Start -= nCurrentLen + nCurrentPos ;
							oNextDel.Class = NextRun;
						}
					}
				}
			}
		}

		for (let i = 0; i < arrSplits.length; i++)
		{
			let oCurrentElement = arrSplits[i];

			if (oCurrentElement instanceof ParaRun)
			{
				this.ProceedParaRun(oCurrentElement);
			}
		}
	};
	DeletedTextRecovery.prototype.SetReviewInfo = function (oReviewInfoParent)
	{
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

		let oCurrentReviewType = oReviewInfoParent.GetReviewInfo().Copy();
		oCurrentReviewType.UserId 		= this.userId;
		oCurrentReviewType.UserName 	= this.userName;
		oCurrentReviewType.DateTime 	= this.userTime;
		oReviewInfoParent.SetReviewTypeWithInfo(1,oCurrentReviewType);
	}

	DeletedTextRecovery.prototype.ConvertArray = function (inputArray)
	{
		let resultArray = [];
		let currentStart = null;
		let currentClass = null;
		let currentLen = 0;

		for (let i = 0; i < inputArray.length; i++) {
			let item = inputArray[i];

			if (currentStart === null && currentClass === null)
			{
				currentStart = item.Data.Pos;
				currentClass = item.Data.Class;
				currentLen = 1;
			}
			else if (item.Data.Pos === currentStart + currentLen && item.Data.Class === currentClass)
			{
				currentLen++;
			}
			else if (item.Data.Pos === currentStart - currentLen && item.Data.Class === currentClass)
			{
				currentLen++;
			}
			else if (item.Data.Pos === currentStart && item.Data.Class === currentClass)
			{
				currentLen++;
			}
			else
			{
				resultArray.push({ Start: currentStart, Len: currentLen, Class: currentClass });
				currentStart = item.Data.Pos;
				currentClass = item.Data.Class;
				currentLen = 1;
			}
		}

		// Добавляем последний результирующий элемент
		if (currentStart !== null && currentClass !== null) {
			resultArray.push({ Start: currentStart, Len: currentLen, Class: currentClass });
		}

		return resultArray;
	}
	DeletedTextRecovery.prototype.ProceedParaRun = function (oParaRun)
	{
		let CurrentRanges = oParaRun.CollaborativeMarks.Ranges;
		let oFirstRange = CurrentRanges[0];
		if (oFirstRange)
			oFirstRange.PosE = oParaRun.Content.length;
	}
	DeletedTextRecovery.prototype.FindPosInParent = function(oClass)
	{
		let oParent = oClass.GetParent();
		let arrParentContent = oParent.Content;

		for (let i = 0; i < arrParentContent.length; i++)
		{
			if (arrParentContent[i] === oClass)
				return i;
		}
	}
	// проверяем правильность окрашивания ранов
	DeletedTextRecovery.prototype.Check = function ()
	{
		let oChanged = this.oCollaborativeEditingBase.m_aChangedClasses;
		let arrKeys = Object.keys(oChanged);

		for (let i = 0; i < arrKeys.length; i++)
		{
			let one = oChanged[arrKeys[i]];

			if (one instanceof ParaRun)
			{
				let CollaborativeMarks = one.CollaborativeMarks;
				let arrRanges = CollaborativeMarks.Ranges;
				let oRange = arrRanges[0];
				oRange.PosE = one.Content.length;
			}
		}
	};
	// перемещаемся по истории ревизии
	DeletedTextRecovery.prototype.NavigationRevisionHistory = function (isUndo)
	{
		if (this.isPrevUndo === true && isUndo === undefined)
		{
			this.m_RewiewIndex--;
		}
		else if (this.isPrevUndo === false && isUndo === true)
		{
			this.m_RewiewIndex++;
		}

		let isProceed = this.NavigationRevisionHistoryByStep(isUndo === true ? -1 : 1);

		if (isUndo === undefined)
		{
			this.isPrevUndo = false;
		}
		else if (isUndo === true)
		{
			this.isPrevUndo = true;
		}

		return isProceed;
	};
	// перемещаемся по истории ревизии на заданное количество изменений относительно текущей позиции
	DeletedTextRecovery.prototype.NavigationRevisionHistoryByStep = function (intCount, isMore)
	{
		if (this.m_RewiewIndex + intCount < 0)
		{
			return false;
		}
		else if (this.m_RewiewIndex + intCount >= this.GetCountOfNavigationPoints() + 1)
		{
			return false;
		}

		if (!isMore)
		{
			this.UndoPoints();
			AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);
		}


		let FindRules = function (context, isMore, i)
		{
			if (isMore)
			{
				for (let j = i; j < context.m_RewiewPoints.length; j++)
				{
					let arrCurrent = context.m_RewiewPoints[j];
					if (arrCurrent && arrCurrent.length !== 0)
					{
						return [arrCurrent, j]
					}

				}
			}
			else
			{
				for (let j = i; j >= 0; j--)
				{
					let arrCurrent = context.m_RewiewPoints[j];
					if (arrCurrent && arrCurrent.length !== 0)
					{
						return [arrCurrent, j]
					}
				}
			}
			return false;
		}

		let arrChange = [];

		if (intCount < 0)
		{
			intCount = this.m_RewiewIndex + intCount;

			let oRule = FindRules(this, false, intCount);
			if (oRule !== false)
			{
				let arrChanges 		= oRule[0];
				this.m_RewiewIndex 	= oRule[1];
				this.UndoReviewBlock(arrChanges, arrChange);
			}
		}
		else if (intCount > 0)
		{
			intCount = this.m_RewiewIndex + intCount;

			let oRule = FindRules(this, true, intCount);
			if (oRule !== false)
			{
				let arrChanges 		= oRule[0];
				this.m_RewiewIndex 	= oRule[1];
				this.RedoReviewBlock(arrChanges.slice(0, arrChanges.length).reverse(), arrChange);
			}
		}

		for (let i = 0; i < arrChange.length; i++)
		{
			arrChange[i] = arrChange[i].Data;
		}

		this.Check();

		if (!isMore)
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arrChange);

		if (this.GetIsShowDelText() && !isMore)
		{
			this.ShowDel();
		}

		return true;
	};
	DeletedTextRecovery.prototype.UndoReviewBlock = function(arrBlock, arrChanges)
	{
		for (let j = arrBlock.length - 1; j >= 0; j--)
		{
			let oChange = arrBlock[j];

			if (!oChange)
				continue;

			this.RedoUndoChange(oChange, false, arrChanges);
		}
	};
	DeletedTextRecovery.prototype.RedoReviewBlock = function(arrBlock, arrChanges)
	{
		for (let j = arrBlock.length - 1; j >= 0; j--)
		{
			let oChange = arrBlock[j];

			if (!oChange)
				continue;

			this.RedoUndoChange(oChange, true, arrChanges);
		}
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

				arrToSave.push({Data:arrSimpleChanges[simpleIndex]});
			}
		}
		else
		{
			if (isRedo)
				oChange.Redo();
			else
				oChange.Undo();

			arrToSave.push({Data: oChange});
		}
	};
	DeletedTextRecovery.prototype.UndoTemp = function ()
	{
		let reverseChanges = this.GetReverseTemp();
		if (reverseChanges.length <= 0)
			return [];

		return reverseChanges;
	};
	// Отменяем все изменения сделанные для показа удаленного текста
	DeletedTextRecovery.prototype.UndoPoints = function ()
	{
		let localHistory = AscCommon.History

		if (localHistory.Points.length > 0 && !this.isDebug)
		{
			let changes	= this.UndoTemp();
			let oHistoryPoint 	= localHistory.Points[localHistory.Points.length - 1];
			AscCommon.History.private_UndoPoint(oHistoryPoint, changes);
			AscCommon.History.Remove_LastPoint();
			// this.CoEditing.Clear_DCChanges();
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(changes);
			return true;
		}
	};
	// получаем изменения из текущей точки
	DeletedTextRecovery.prototype.GetChangesFormHistory = function ()
	{
		let arr = [];
		let localHistory = AscCommon.History

		if (localHistory.Points.length > 0)
		{
			let oHistoryPoint = localHistory.Points[localHistory.Points.length - 1];
			for (let i = 0; i < oHistoryPoint.Items.length; i++)
			{
				let oChange = oHistoryPoint.Items[i];
				arr.push(oChange.Data);
			}
		}
		return arr;
	};
	DeletedTextRecovery.prototype.GetReverseTemp = function()
	{
		let localHistory = AscCommon.History;
		let arrCurrentPoint = localHistory.Points[0].Items;

		if (arrCurrentPoint <= 0)
			return [];

		let arrChanges = [];
		for (let nIndex = arrCurrentPoint.length - 1; nIndex >= 0; --nIndex)
		{
			let oChange = arrCurrentPoint[nIndex].Data;
			if (!oChange)
				continue;
			else
				arrChanges.push(oChange);
		}

		let arrReverseChanges = [];
		for (let nIndex = 0, nCount = arrChanges.length; nIndex < nCount; ++nIndex)
		{
			let oReverseChange = arrChanges[nIndex].CreateReverseChange();
			if (oReverseChange)
			{
				arrReverseChanges.push(oReverseChange);
				oReverseChange.SetReverted(true);
			}
		}

		return arrReverseChanges;
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].DeletedTextRecovery = DeletedTextRecovery;
	
})(window);
