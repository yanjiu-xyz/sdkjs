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

		this.ShowDelTextPoint = null;
		this.StepTextPoint = null;

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

			if (oCurrentChange instanceof AscCommon.CChangesTableIdDescription)
			{
				if (arrDelChanges.length > 0 && arrDelChanges[arrDelChanges.length - 1].length === 1)
				{
					arrDelChanges.length = arrDelChanges.length - 1;
				}
				arrDelChanges.push([arrCurrent.length, oCurrentChange]);
			}

			if (oCurrentChange instanceof CChangesRunRemoveItem || oCurrentChange instanceof CChangesParagraphRemoveItem || oCurrentChange instanceof CChangesDocumentRemoveItem)
			{
				if (arrDelChanges.length > 0)
				{
					let oLast = arrDelChanges[arrDelChanges.length - 1];
					oLast.push(oCurrentChange);
				}
				else
				{
					let arr = [];
					arrDelChanges.push(arr);
					arr.push([arrCurrent.length, oCurrentChange]);
				}
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

		// // убираем из массива изменения, которые добавляют удаленный текст (до того как его удалили)
		// if (arrCurrent.length >= 1)
		// {
		// 	for (let i = 0; i < arrCurrent.length; i++)
		// 	{
		// 		let arrCurrentElement = arrCurrent[i];
		// 		for (let j = 0; j < arrCurrentElement.length; j++)
		// 		{
		// 			let oCurrentChange = arrCurrentElement[j];
		//
		// 			if (oCurrentChange instanceof AscCommon.CChangesTableIdDescription)
		// 				continue;
		//
		// 			if (true === this.IsRemovedAfter(arrCurrent, i, oCurrentChange))
		// 			{
		// 				arrCurrentElement.splice(j, 1);
		// 				j--;
		// 			}
		// 		}
		// 	}
		// }
		//
		// // убираем изменения состоящие только из AscCommon.CChangesTableIdDescription (так как эти изменения этого блока были удалены)
		// for (let i = 0; i < arrCurrent.length; i++)
		// {
		// 	let arrCurrentElement = arrCurrent[i];
		//
		// 	if (arrCurrentElement === undefined)
		// 		i++;
		//
		// 	if (arrCurrentElement.length === 1)
		// 		arrCurrentElement.length = 0;
		// }

		for (let i = 0; i < arrDelChanges.length; i++)
		{
			if(arrDelChanges[i].length === 2)
			{
				arrDelChanges[i].length = 1;
			}
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
				let isSame = oCurrentChange.PosArray
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
	};
	// получаем верхнюю границу
	DeletedTextRecovery.prototype.GetCountOfNavigationPoints =  function ()
	{
		return this.m_RewiewPoints.length - 1;
	};
	// получаем текущую позицию
	DeletedTextRecovery.prototype.GetCurrentIndexNavigationPoint = function ()
	{
		return this.m_RewiewIndex;
	};
	DeletedTextRecovery.prototype.SetIsShowDelText = function (isShow)
	{
		this.isShowDelText = isShow;
	};
	DeletedTextRecovery.prototype.GetIsShowDelText = function ()
	{
		return this.isShowDelText;
	};
	DeletedTextRecovery.prototype.ShowDel = function ()
	{
		this.UndoPoints();
		AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);

		this.ShowDelText();
		this.RedoPoints();
	};
	DeletedTextRecovery.prototype.UndoCurrent = function (n)
	{
		let arrCurrentPoint = [];
		let arrCurrentDel 		= this.m_RewiewDelPoints[n];

		for (let nIndex = 0; nIndex < arrCurrentDel.length; nIndex++)
		{
			let oCurrentDel = arrCurrentDel[nIndex];
			if (oCurrentDel instanceof CChangesRunRemoveItem || oCurrentDel instanceof CChangesParagraphRemoveItem || oCurrentDel instanceof CChangesDocumentRemoveItem)
			{
				if (oCurrentDel.Items && oCurrentDel.Items.length > 1)
					oCurrentDel = oCurrentDel.ConvertToSimpleChanges();
				else
					oCurrentDel = [oCurrentDel];

				for (let nCount = oCurrentDel.length - 1; nCount >= 0; nCount--)
				{
					let oCurrDel = oCurrentDel[nCount];
					let oDelChange 	= oCurrDel.CreateReverseChange();
					this.RedoUndoChange(oDelChange, true, arrCurrentPoint);
				}
			}
		}
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
		this.userTime = timeOfRevision;

		let arrInput = [];
		for (let i = 0; i < this.m_RewiewDelPoints.length; i++)
		{
			let arrCurr = this.m_RewiewDelPoints[i];
			if (arrCurr[0] <= this.m_RewiewIndex - 1)
			{
				let temp = []
				for (let j = 1; j < arrCurr.length; j++)
				{
					temp.push(arrCurr[j]);
				}
				arrInput.push(temp);
			}
		}

		if (arrInput.length === 0)
			return;

		console.log(arrInput)

		for (let nCounter = arrInput.length - 1; nCounter >= 0; nCounter--)
		{
			let arrCurrentDel 		= arrInput[nCounter];
			for (let nIndex = 0; nIndex < arrCurrentDel.length; nIndex++)
			{
				let oCurrentDel = arrCurrentDel[nIndex];
				if (oCurrentDel instanceof CChangesRunRemoveItem || oCurrentDel instanceof CChangesParagraphRemoveItem || oCurrentDel instanceof CChangesDocumentRemoveItem)
				{
					if (oCurrentDel.Items && oCurrentDel.Items.length > 1)
						oCurrentDel = oCurrentDel.ConvertToSimpleChanges();
					else
						oCurrentDel = [oCurrentDel];

					for (let nCount = oCurrentDel.length - 1; nCount >= 0; nCount--)
					{
						let oCurrDel = oCurrentDel[nCount];
						let oDelChange 	= oCurrDel.CreateReverseChange();
						this.RedoUndoChange(oDelChange, true, arrCurrentPoint);
					}
				}
			}
		}

		let arr = this.ConvertArray(arrInput.reverse());
		arr = this.QuickSort(arr);
		this.Sort(arr);

		for (let i = 0; i < arr.length; i++)
		{
			let NextRun = null;
			let CurrentDel = arr[i];
			let nCurrentPos = CurrentDel.nStartPos;
			let nCurrentLen = CurrentDel.nLength;
			let oCurrentRun = CurrentDel.class;

			if (oCurrentRun instanceof CDocument)
			{
				let oContent = CurrentDel.content[0];
				let CurrentPos = oContent.PosArray[0];
				let CurrentLen = oContent.Items.length;
				let arrContent = oContent.Class.Content;
				for (let j = CurrentPos; j < CurrentPos + CurrentLen; j++)
				{
					let oCurrentParagraph = arrContent[j];
					if (oCurrentParagraph)
						this.SetReviewInfo(oCurrentParagraph);
				}
			}
			else if (oCurrentRun instanceof Paragraph)
			{
				let oContent = CurrentDel.content[0];
				let arrContent = oContent.Items;

				for (let i = 0; i < arrContent.length; i++)
					this.SetReviewInfo(arrContent[i]);
			}
			else if (oCurrentRun instanceof ParaRun)
			{
				// for (let j = i + 1; j < arr.length; j++)
				// {
				// 	let oNextDel = arr[j];
				// 	if (oNextDel) {
				// 		let nNextPos = oNextDel.Start;
				// 		let nNextLen = oNextDel.Len;
				// 		let oNextRun = oNextDel.Class;
				//
				// 		if (oNextRun === oCurrentRun && nCurrentPos > nNextPos) {
				// 			nCurrentPos += nNextLen;
				// 		}
				// 	}
				// }

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

				// for (let j = i + 1; j < arr.length; j++)
				// {
				// 	let oNextDel = arr[j];
				// 	if (oNextDel)
				// 	{
				// 		let nNextPos = oNextDel.Start;
				// 		let nNextLen = oNextDel.Len;
				// 		let oNextRun = oNextDel.Class;
				//
				// 		if (oNextRun === oCurrentRun && nCurrentPos < nNextPos)
				// 		{
				// 			oNextDel.Start -= nCurrentLen + nCurrentPos ;
				// 			oNextDel.Class = NextRun;
				// 		}
				// 	}
				// }
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

		this.Check();

		this.ShowDelTextPoint = AscCommon.History.Points[0];
		this.RedoPoints();
	};
	DeletedTextRecovery.prototype.QuickSort = function (array)
	{
			if (array.length <= 1)
				return array;

			let pivot = array[0].nStartPos;
			let left = [];
			let right = [];

			for (let i = 1; i < array.length; i++)
			{
				array[i].nStartPos > pivot || !(array[i].class instanceof ParaRun)
					? left.push(array[i])
					: right.push(array[i]);
			}

			return this.QuickSort(left).concat(array[0], this.QuickSort(right));
	};
	DeletedTextRecovery.prototype.Sort = function (array)
	{
		let arrParagraph = [];
		let arrDocument = [];
		let arrMark = [];
		for (let i = 0; i < array.length; i++)
		{
			let oCurrent = array[i];
			if (oCurrent.class instanceof Paragraph)
			{
				arrParagraph.push(oCurrent);
				array.splice(i, 1);
				i--;
			}
			else if (oCurrent.class instanceof CDocument)
			{
				arrDocument.push(oCurrent);
				array.splice(i, 1);
				i--;
			}
			else if (oCurrent.class instanceof ParaRun && oCurrent.content.length === 1)
			{
				let cont = oCurrent.content[0];
				if (cont.Items.length === 1 && cont.Items[0] instanceof AscWord.CRunParagraphMark)
				{
					arrMark.push(oCurrent);
					array.splice(i, 1);
					i--;
				}
			}
		}

		for (let i = 0; i < arrMark.length; i++)
		{
			array.push(arrMark[i]);
		}

		for (let i = 0; i < arrDocument.length; i++)
		{
			array.push(arrDocument[i]);
		}

		for (let i = 0; i < arrParagraph.length; i++)
		{
			array.push(arrParagraph[i]);
		}
	};
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
			let oCurrentReviewType = oReviewInfoParent.GetReviewInfo().Copy();
			oCurrentReviewType.UserId 		= this.userId;
			oCurrentReviewType.UserName 	= this.userName;
			oCurrentReviewType.DateTime 	= this.userTime;
			oReviewInfoParent.SetReviewTypeWithInfo(1,oCurrentReviewType);
		}
	};
	DeletedTextRecovery.prototype.ConvertArray = function (inputArray)
	{
		function Arr()
		{
			this.content = [];
			this.isFromEnd = false;
			this.nStartPos = null;
			this.nLength = 0;
			this.counter = 0;
			this.class = null;

			this.AddContent = function (oChange)
			{
				if (oChange instanceof CChangesParagraphRemoveItem)
				{
					this.content.push(oChange);
					this.class = this.content[0].Class;
					this.nStartPos = oChange.PosArray[0];
					this.nLength++;
				}
				else if (oChange instanceof CChangesDocumentRemoveItem)
				{
					this.content.push(oChange);
					this.class = this.content[0].Class;
					this.nStartPos = oChange.PosArray[0];
					this.nLength++;
				}
				else if (oChange instanceof CChangesRunRemoveItem)
				{
					if (this.class === oChange.Class || this.class === null)
					{
						if (!isNaN(oChange.Pos) && (this.nStartPos === null || oChange.Pos < this.nStartPos))
						{
							this.nStartPos = oChange.Pos
						}
						else if (oChange.PosArray[0] < this.nStartPos || this.nStartPos === null)
						{
							this.nStartPos = oChange.PosArray[0];
						}
						this.content.push(oChange);
						this.nLength += oChange.Items.length;
						this.counter++;
					}
					else
					{
						return false;
					}

					if (this.counter === 1)
					{
						this.class = this.content[0].Class;
					}
				}
			}
			this.SetIsFromEnd = function (isFromEnd)
			{
				this.isFromEnd =  isFromEnd;
			}
			this.IsHastContent = function ()
			{
				return this.content.length > 0;
			}
			this.IsAdd = function (arr)
			{
				return arr[1].Class === this.class;
			}
		}

		let table = [];
		let nCurrentIndex = null;
		let nClose = null;
		let oCon = new Arr();

		let result = []

		for (let nCount = 0; nCount < inputArray.length; nCount++) {
			let oCur = inputArray[nCount];
			for (let j = 0; j < oCur.length; j++)
			{
				table.push(oCur[j]);
			}
		}

		for (let i = 0; i < table.length; i++)
		{
			let oChange = table[i];

			if (oChange instanceof  CChangesParagraphRemoveItem)
			{
				if (oCon.IsHastContent())
				{
					result.push(oCon);
					oCon = new Arr();
				}

				oCon.AddContent(oChange);

				if (oCon.IsHastContent())
				{
					result.push(oCon);
					oCon = new Arr();
				}

			}
			else if (oChange instanceof CChangesDocumentRemoveItem)
			{
				if (oCon.IsHastContent())
				{
					result.push(oCon);
					oCon = new Arr();
				}

				oCon.AddContent(oChange);

				if (oCon.IsHastContent())
				{
					result.push(oCon);
					oCon = new Arr();
				}
			}
			else if (oChange instanceof AscCommon.CChangesTableIdDescription)
			{
				if (oCon.IsHastContent())
				{
					result.push(oCon);
					oCon = new Arr();
				}

				oCon.SetIsFromEnd(oChange.PointIndex === oChange.LastPoint);

				nCurrentIndex = oChange.PointIndex;
				nClose = oChange.LastPoint;
				continue;
			}
			else
			{
				oCon.AddContent(oChange);
			}
		}

		if (oCon.IsHastContent())
			result.push(oCon);

		for (let i = 0; i < result.length; i++)
		{
			let oCurrentArr = result[i];
			for (let j = i + 1; j < result.length; j++)
			{
				let oNextArr = result[j];
				if (oCurrentArr.class === oNextArr.class && oCurrentArr.nStartPos > oNextArr.nStartPos)
				{
					oCurrentArr.nStartPos += oNextArr.nLength;
				}
			}
		}

		return result.reverse();
	};
	DeletedTextRecovery.prototype.ProceedParaRun = function (oParaRun)
	{
		let CurrentRanges = oParaRun.CollaborativeMarks.Ranges;
		let oFirstRange = CurrentRanges[0];
		if (oFirstRange)
			oFirstRange.PosE = oParaRun.Content.length;
	};
	DeletedTextRecovery.prototype.FindPosInParent = function(oClass)
	{
		let oParent = oClass.GetParent();
		let arrParentContent = oParent.Content;

		for (let i = 0; i < arrParentContent.length; i++)
		{
			if (arrParentContent[i] === oClass)
				return i;
		}
	};
	DeletedTextRecovery.prototype.IsDelPoint = function (nPos)
	{
		for (let i = 0; i < this.m_RewiewDelPoints.length; i++)
		{
			if (this.m_RewiewDelPoints[0] === nPos)
				return true;
		}

		return false;
	};
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
	DeletedTextRecovery.prototype.NavigationRevisionHistoryByStep = function (intCount)
	{
		if (this.m_RewiewIndex + intCount < 0)
			return false;
		else if (this.m_RewiewIndex + intCount >= this.m_RewiewPoints.length)
			return false;

		debugger

		this.UndoPoints();
		this.UndoShowDelText();
		this.UndoStepText();

		AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);

		this.m_RewiewIndex = this.m_RewiewIndex + intCount;
		let arrInput = this.m_RewiewPoints.slice(this.m_RewiewIndex, this.m_RewiewPoints.length);
		let arrCurrentPoint = [];

		if (!arrInput || arrInput.length === 0)
			return;

		for (let nCounter = arrInput.length - 1; nCounter >= 0; nCounter--)
		{
			let arrCurrentDel 		= arrInput[nCounter];
			this.UndoReviewBlock(arrCurrentDel, arrCurrentPoint);
		}

		this.RedoPoints(arrCurrentPoint);
		this.StepTextPoint = arrCurrentPoint;
		AscCommon.History.Remove_LastPoint();
		this.ShowDelText();

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

				arrToSave.push(arrSimpleChanges[simpleIndex]);
			}
		}
		else
		{
			if (isRedo)
				oChange.Redo();
			else
				oChange.Undo();

			arrToSave.push(oChange);
		}
	};
	DeletedTextRecovery.prototype.UndoShowDelText = function ()
	{
		if (this.ShowDelTextPoint)
		{
			let oHistoryPoint	= this.ShowDelTextPoint;
			let changes	= oHistoryPoint.Items;
			let arr = [];

			for (let i = 0; i < changes.length; i++)
			{
				if (!(changes[i] instanceof AscDFH.CChangesBase))
				{
					changes[i].Class.Refresh_RecalcData(changes[i].Data);
					arr.push(changes[i].Data);
				}
				else
				{
					arr.push(changes[i]);
				}
			}

			changes = []
			this.UndoReviewBlock(arr, changes)
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arr);
			this.ShowDelTextPoint = null;
			return true;
		}
	};
	DeletedTextRecovery.prototype.UndoStepText = function()
	{
		if (this.StepTextPoint)
		{
			let changes	= this.StepTextPoint;
			let arr = [];

			for (let i = 0; i < changes.length; i++)
			{
				if (!(changes[i] instanceof AscDFH.CChangesBase))
				{
					changes[i].Class.Refresh_RecalcData(changes[i].Data);
					arr.push(changes[i].Data);
				}
				else
				{
					arr.push(changes[i]);
				}
			}
			changes = []
			this.RedoReviewBlock(arr, changes)
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arr);
			this.StepTextPoint = null;
			return true;
		}
	};
	// Отменяем все изменения сделанные для показа удаленного текста
	DeletedTextRecovery.prototype.UndoPoints = function ()
	{
		let localHistory = AscCommon.History

		if (localHistory.Points.length > 0 && !this.isDebug)
		{
			let changes = []
			let oHistoryPoint = localHistory.Points[localHistory.Points.length - 1];
			AscCommon.History.private_UndoPoint(oHistoryPoint, changes);
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(changes);
			AscCommon.History.Remove_LastPoint();
			return true;
		}
	};
	DeletedTextRecovery.prototype.RedoPoints = function (array)
	{
		let localHistory = AscCommon.History;
		if (localHistory.Points.length > 0 && localHistory.Points[0].Items.length > 0 && !this.isDebug)
		{
			let oHistoryPoint 	= localHistory.Points[localHistory.Points.length - 1];
			let changes	= oHistoryPoint.Items;
			let arr = [];

			for (let i = 0; i < changes.length; i++)
			{
				if (!(changes[i] instanceof AscDFH.CChangesBase))
				{
					changes[i].Class.Refresh_RecalcData(changes[i].Data);
					arr.push(changes[i].Data);
				}
				else
				{
					arr.push(changes[i]);
				}
			}
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arr);
			AscCommon.History.Remove_LastPoint();
			return true;
		}
		else if (array !== undefined && array.length > 0)
		{
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(array);
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

		return arrChanges;
	};

	//--------------------------------------------------------export----------------------------------------------------
	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].DeletedTextRecovery = DeletedTextRecovery;
	
})(window);
