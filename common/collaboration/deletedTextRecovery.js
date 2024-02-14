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
	function DeletedTextRecovery()
	{
		/**
		 * Список всех изменений связанных с удалением текста
		 * @type {*[]}
		 */
		this.m_RewiewDelPoints		= [];
		/**
		 * Список всех изменений уже показанного удаленного текста
		 * @type {null|*[]}
		 */
		this.ShowDelLettersChanges	= null;

		this.userId					= undefined;
		this.userName				= undefined;
		this.userTime				= undefined;
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
		let arrCurrentPoint = [];
		for (let nCounter = arrInputChanges.length - 1; nCounter >= 0; nCounter--)
		{
			let arrCurrentDel = arrInputChanges[nCounter];
			for (let nIndex = arrCurrentDel.length - 1; nIndex >= 0; nIndex--)
			{
				this.RedoUndoChange(arrCurrentDel[nIndex], false, arrCurrentPoint);
			}
		}
		return arrCurrentPoint;
	};
	/**
	 * Создаем точку в истории для сбора данных об отображении удаленного текста
	 * @constructor
	 */
	DeletedTextRecovery.prototype.CheckPointInHistory = function ()
	{
		let localHistory = AscCommon.History;

		if (localHistory.Points.length === 0
			|| (localHistory.Points.length > 0
				&& localHistory.Points[localHistory.Points.length - 1].Description !== AscDFH.historydescription_Collaborative_DeletedTextRecovery)
		)
			AscCommon.History.CreateNewPointToCollectChanges(AscDFH.historydescription_Collaborative_DeletedTextRecovery);
	};
	DeletedTextRecovery.prototype.ShowDelText = function ()
	{
		this.UndoShowDelText();
		this.HandleChanges();
		this.CheckPointInHistory();

		let oLogicDocument		= editor.WordControl.m_oLogicDocument;
		let historyStore		= AscCommon.CollaborativeEditing.CoHistory.CoEditing.m_oLogicDocument.Api.VersionHistory;
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
		let arrCurrentPoint		= this.RedoUndoChanges(arrInput);
		oLogicDocument.RecalculateByChanges(arrCurrentPoint);

		// обрабатываем полученные изменения
		let arrContentForSlice	= this.ConvertArray(arrInput);
		this.SortArrChanges(arrContentForSlice);

		// применяем изменения с удаленным текстом
		this.ProceedDelTextInDocument(arrContentForSlice);
		// проверяем окрашивание ранов
		this.Check();

		this.ShowDelTextPoint	= AscCommon.History.Points[0];
		this.ShowDelLettersChanges = arrCurrentPoint;

		this.RecalculatePointFromHistory();

		return true;
	};
	DeletedTextRecovery.prototype.ProceedDelTextInDocument = function (arrContentForSlice)
	{
		let arrSplits			= [];

		for (let i = 0; i < arrContentForSlice.length; i++)
		{
			let oNextRun		= null;
			let CurrentDel		= arrContentForSlice[i];
			let nCurrentPos		= CurrentDel.nStartPos;
			let nCurrentLen		= CurrentDel.nLength;
			let oCurrentRun		= CurrentDel.class;

			if (oCurrentRun instanceof CDocument)
			{
				let oContent	= CurrentDel.content[0];
				let CurrentPos	= oContent.PosArray[0];
				let CurrentLen	= oContent.Items.length;
				let arrContent	= oContent.Class.Content;

				for (let j = CurrentPos; j < CurrentPos + CurrentLen; j++)
				{
					let oCurrentParagraph = arrContent[j];
					if (oCurrentParagraph)
						this.SetReviewInfo(oCurrentParagraph);
				}
			}
			else if (oCurrentRun instanceof Paragraph)
			{
				let oContent	= CurrentDel.content[0];
				let arrContent	= oContent.Items;

				if (arrContent.length === oContent.Class.Content.length)
				{
					this.SetReviewInfo(oContent.Class);
				}
				else
				{
					for (let i = 0; i < arrContent.length; i++)
					{
						this.SetReviewInfo(arrContent[i]);
					}
				}
			}
			else if (oCurrentRun instanceof ParaRun)
			{
				if (nCurrentPos === 0 && nCurrentLen >= oCurrentRun.Content.length)
				{
					if (oCurrentRun.Parent.Content.length === 2)
						this.SetReviewInfo(oCurrentRun.Parent);
					else
						this.SetReviewInfo(oCurrentRun);
				}
				else if (nCurrentLen === 1)
				{
					let oParent		= oCurrentRun.GetParent();
					let RunPos		= this.FindPosInParent(oCurrentRun)
					let RightRun	= oCurrentRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentPos);

					oParent.Add_ToContent(RunPos + 1, RightRun);
					let oNewer		= RightRun.Split2AndSpreadCollaborativeMark(arrSplits, 1);
					oParent.Add_ToContent(RunPos + 2, oNewer);
					oNextRun		= oNewer;
					this.SetReviewInfo(RightRun);
				}
				else
				{
					let oParent		= oCurrentRun.GetParent();
					let RunPos		= this.FindPosInParent(oCurrentRun);
					let RightRun	= oCurrentRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentPos);

					oParent.Add_ToContent(RunPos + 1, RightRun);
					oNextRun		= RightRun;

					if (RightRun.Content.length > 1 && RightRun.Content.length > nCurrentLen) {
						let oNewer	= RightRun.Split2AndSpreadCollaborativeMark(arrSplits, nCurrentLen);
						oParent.Add_ToContent(RunPos + 2, oNewer);
						oNextRun	= oNewer;
					}
					this.SetReviewInfo(RightRun);
				}
			}
		}

		for (let nSplit = 0; nSplit < arrSplits.length; nSplit++)
		{
			let oCurrentElement = arrSplits[nSplit];
			if (oCurrentElement instanceof ParaRun)
				this.ProceedParaRun(oCurrentElement);
		}
	};
	DeletedTextRecovery.prototype.SortArrChanges = function (arrInputChanges)
	{
		let arrParagraph	= [];
		let arrDocument		= [];
		// let arrMark = [];
		for (let i = 0; i < arrInputChanges.length; i++)
		{
			let oCurrent	= arrInputChanges[i];
			if (oCurrent.class instanceof Paragraph)
			{
				arrParagraph.push(oCurrent);
				arrInputChanges.splice(i, 1);
				i--;
			}
			else if (oCurrent.class instanceof CDocument)
			{
				arrDocument.push(oCurrent);
				arrInputChanges.splice(i, 1);
				i--;
			}
			// else if (oCurrent.class instanceof ParaRun && oCurrent.content.length === 1)
			// {
			// 	let cont = oCurrent.content[0];
			// 	if (cont.Items.length === 1 && cont.Items[0] instanceof AscWord.CRunParagraphMark)
			// 	{
			// 		arrMark.push(oCurrent);
			// 		array.splice(i, 1);
			// 		i--;
			// 	}
			// }
		}

		// for (let i = 0; i < arrMark.length; i++)
		// {
		// 	array.push(arrMark[i]);
		// }

		for (let i = 0; i < arrDocument.length; i++)
		{
			arrInputChanges.push(arrDocument[i]);
		}

		for (let i = 0; i < arrParagraph.length; i++)
		{
			arrInputChanges.push(arrParagraph[i]);
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
			let oCurrentReviewType			= oReviewInfoParent.GetReviewInfo().Copy();
			oCurrentReviewType.UserId		= this.userId;
			oCurrentReviewType.UserName		= this.userName;
			oCurrentReviewType.DateTime		= this.userTime;

			oReviewInfoParent.SetReviewTypeWithInfo(1, oCurrentReviewType, false);
		}
	};
	/**
	 * Формируем изменения для отображения удаленного текста
	 * @param inputArray
	 * @return {*[]}
	 * @constructor
	 */
	DeletedTextRecovery.prototype.ConvertArray = function (inputArray)
	{
		inputArray.reverse();

		let arrChangesTemp					= [];
		let nCurrentIndex					= null;
		let nClose							= null;
		let oCurrentContentProceed			= new RemoveChangesProcessor();
		let arrResult						= [];

		let isTable							= false;
		let nLastPos						= null;
		let oLastClass						= null;

		for (let nCount = 0; nCount < inputArray.length; nCount++)
		{
			let oCurrentChange = inputArray[nCount];
			if (oCurrentChange.length > 0)
			{
				for (let j = 0; j < oCurrentChange.length; j++)
				{
					arrChangesTemp.push(oCurrentChange[j]);
				}
			}
			else if (!Array.isArray(arrChangesTemp[arrChangesTemp.length - 1]))
			{
				arrChangesTemp.push([]);
			}
		}

		for (let nCount = 0; nCount < arrChangesTemp.length; nCount++)
		{
			let oChange = arrChangesTemp[nCount];

			if (Array.isArray(oChange))
			{
				if (oCurrentContentProceed.IsHastContent())
				{
					arrResult.push(oCurrentContentProceed);
					oCurrentContentProceed  = new RemoveChangesProcessor();
				}
				isTable = false;
			}
			else if (oChange instanceof CChangesParagraphRemoveItem || oChange instanceof CChangesDocumentRemoveItem)
			{
				if (oCurrentContentProceed.IsHastContent())
				{
					arrResult.push(oCurrentContentProceed);
					oCurrentContentProceed  = new RemoveChangesProcessor();
				}

				oCurrentContentProceed.AddContent(oChange);

				if (oCurrentContentProceed.IsHastContent())
				{
					arrResult.push(oCurrentContentProceed);
					oCurrentContentProceed  = new RemoveChangesProcessor();
				}
			}
			else if (oChange instanceof AscCommon.CChangesTableIdDescription)
			{
				if (isTable === false)
				{
					oCurrentContentProceed.SetIsFromEnd(oChange.StartPoint === oChange.LastPoint);
					nCurrentIndex	= oChange.StartPoint;
					nClose			= oChange.LastPoint;
					isTable			= true;
				}
			}
			else
			{
				if (nLastPos === null)
				{
					oCurrentContentProceed.AddContent(oChange);
					nLastPos	= oChange.PosArray[0];
					oLastClass	= oChange.Class;
				}
				else if ((oChange.PosArray[0] === nLastPos
							|| oChange.PosArray[0] + 1 === nLastPos
							|| oChange.PosArray[0] - 1 === nLastPos) && oLastClass === oChange.Class)
				{
					oCurrentContentProceed.AddContent(oChange);
					nLastPos = oChange.PosArray[0];
				}
				else
				{
					arrResult.push(oCurrentContentProceed);

					oCurrentContentProceed	= new RemoveChangesProcessor();
					let oTempChange			= arrChangesTemp[nCount - 1];
					let isFromEnd			= oTempChange.StartPoint === oTempChange.LastPoint;

					oCurrentContentProceed.SetIsFromEnd(isFromEnd);

					nCurrentIndex			= oTempChange.StartPoint;
					nClose					= oTempChange.LastPoint;
					isTable					= true;

					oCurrentContentProceed.AddContent(oChange);
					nLastPos				= oChange.PosArray[0];
					oLastClass				= oChange.Class;
				}
			}
		}

		if (oCurrentContentProceed.IsHastContent())
			arrResult.push(oCurrentContentProceed);

		for (let nCount = 0; nCount < arrResult.length; nCount++)
		{
			let oTempCurrentChange = arrResult[nCount];
			for (let j = nCount + 1; j < arrResult.length; j++)
			{
				let oTempNextChange = arrResult[j];
				if (oTempCurrentChange.class === oTempNextChange.class && oTempCurrentChange.nStartPos > oTempNextChange.nStartPos)
					oTempCurrentChange.nStartPos += oTempNextChange.nLength;
			}
		}

		arrResult.reverse();

		return arrResult.sort(
			function (a, b)
			{
				if (a.nStartPos > b.nStartPos) return -1;
				else if (a.nStartPos < b.nStartPos) return 1;
				return 0;
			}
		);
	};
	DeletedTextRecovery.prototype.ProceedParaRun = function (oParaRun)
	{
		let CurrentRanges		= oParaRun.CollaborativeMarks.Ranges;
		let oFirstRange			= CurrentRanges[0];

		if (oFirstRange)
			oFirstRange.PosE	= oParaRun.Content.length;
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
	// проверяем правильность окрашивания ранов
	DeletedTextRecovery.prototype.Check = function ()
	{
		let oChanged	= AscCommon.CollaborativeEditing.m_aChangedClasses;
		let arrKeys		= Object.keys(oChanged);

		for (let i = 0; i < arrKeys.length; i++)
		{
			let oCurrentEl = oChanged[arrKeys[i]];
			if (oCurrentEl instanceof ParaRun)
			{
				let oCollaborativeMarks = oCurrentEl.CollaborativeMarks;
				let arrRanges			= oCollaborativeMarks.Ranges;
				let oRange				= arrRanges[0];
				oRange.PosE				= oCurrentEl.Content.length;
			}
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
	DeletedTextRecovery.prototype.ProceedHistoryFromHistoryPoint = function (oHistoryPoint)
	{
		let arrChanges	= oHistoryPoint.Items;
		let arr			= [];

		for (let i = 0; i < arrChanges.length; i++)
		{
			if (!(arrChanges[i] instanceof AscDFH.CChangesBase))
			{
				arrChanges[i].Class.Refresh_RecalcData(arrChanges[i].Data);
				arr.push(arrChanges[i].Data);
			}
			else
			{
				arr.push(arrChanges[i]);
			}
		}

		return arr;
	};
	DeletedTextRecovery.prototype.UndoShowDelText = function ()
	{
		if (this.ShowDelTextPoint)
		{
			let oHistoryPoint	= this.ShowDelTextPoint;
			let arr				= this.ProceedHistoryFromHistoryPoint(oHistoryPoint);

			this.UndoReviewBlock(arr, [])
			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arr);
			this.ShowDelTextPoint = null;

			this.UndoArray(this.ShowDelLettersChanges.reverse());
			this.ShowDelLettersChanges = [];
			this.Check();

			return true;
		}
		return false;
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
	DeletedTextRecovery.prototype.UndoArray = function (arrInput, isRedo)
	{
		if (!arrInput || arrInput.length === 0)
			return false;

		if (arrInput)
		{
			let arrURChanges = []
			for (let i = 0; i < arrInput.length; i++)
			{
				this.RedoUndoChange(arrInput[i], !isRedo, arrURChanges);
			}

			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arrURChanges);
			return true;
		}
	};
	DeletedTextRecovery.prototype.RecalculatePointFromHistory = function ()
	{
		let oLocalHistory		= AscCommon.History;
		if (oLocalHistory.Points.length > 0 && oLocalHistory.Points[0].Items.length > 0)
		{
			let oHistoryPoint	= oLocalHistory.Points[oLocalHistory.Points.length - 1];
			let arrChanges		= this.ProceedHistoryFromHistoryPoint(oHistoryPoint);

			editor.WordControl.m_oLogicDocument.RecalculateByChanges(arrChanges);
			AscCommon.History.Remove_LastPoint();

			return true;
		}
		return false;
	};
	function RemoveChangesProcessor()
	{
		this.content		= [];
		this.isFromEnd		= false;
		this.nStartPos		= null;
		this.nEnd			= null;
		this.nStart			= null;
		this.nLength		= 0;
		this.counter		= 0;
		this.class			= null;

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
		};
		this.SetIsFromEnd = function (isFromEnd)
		{
			this.isFromEnd = isFromEnd;
		};
		this.IsHastContent = function ()
		{
			return this.content.length > 0;
		};
		this.IsAdd = function (arr)
		{
			return arr[1].Class === this.class;
		};
	}

	//--------------------------------------------------------export----------------------------------------------------
	AscCommon.DeletedTextRecovery = DeletedTextRecovery;
	AscCommon.DeletedTextRecoveryCheckRunsColor = DeletedTextRecovery.prototype.Check;
	
})(window);
