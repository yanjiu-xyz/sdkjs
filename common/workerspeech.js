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

(function(window, undefined){

	window["AscCommon"] = window.AscCommon = (window["AscCommon"] || {});

	/**
	 * 1st version:
	 *
	 * 0) Вводим текст - произносим его. Copy/Paste не произносим.
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.Text, "a");
	 * 1) Ходим курсором по тексту - произносим следующую а курсором букву. Если пробел - присылаем пустой текст.
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.Text, "a");
	 * 2) Ходим по тексту по словам - произносим следующее за курсором слово. Если конец - посылаем пустой текст.
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.Text, "hello");
	 * 3) Селект/УменьшениеСелета по клавиатуре/конец селекта мышью - произносится изменение в селекте (новый текст/тот что ушел из селекта).
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.TextSelected, { text: "текст", isBefore: false });
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.TextUnselected, { text: "текст", isBefore: false });
	 * 4) Селект автофигуры/диаграммы/картинки/...
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.DrawingSelected, { altText: "текст" });
	 * 5) Селект слайда
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.SlideSelected, { num: 1 });
	 * 6) Ходим по ячейкам в Cell
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.CellSelected, { text: "cell value", cell: "A1" });
	 * 7) Селект/УменьшениеСелета по клавиатуре/конец селекта мышью - смотрим,
	 * если +/- одна ячейка, то используем CellRangeSelectedChangeOne/CellRangeUnselectedChangeOne
	 * если нет - то CellRangeSelected/CellRangeUnselected
	 * 8) Ходим по листам - даем информацию о нем
	 * --- SpeechWorker.speech(AscCommon.SpeechWorkerCommands.SheetSelected, { ... });
	 *
	 */

	// types for SpeechWorker.speech method
	var SpeechWorkerType = {

		// text
		Text : 0,

		// { text: "text", isBefore: true  }
		TextSelected : 1,

		// { text: "text", isBefore: true  }
		TextUnselected : 2,

		// { indexes: [1, 2, ..] }
		SlidesSelected : 3,

		// { indexes: [1, 2, ..] }
		SlidesUnselected : 4,

		// { altText: "text" }
		DrawingSelected : 5,

		// { text: "text", cell: "A1" }
		CellSelected : 6,

		// { start: { text: "text", cell: "A1" }, end: { text: "text", cell: "A2" }] } }
		CellRangeSelected : 7,

		// { start: { text: "text", cell: "A1" }, end: { text: "text", cell: "A2" }] } }
		CellRangeUnselected : 8,

		// { text: "text", cell: "A1" }
		CellRangeSelectedChangeOne : 9,

		// { text: "text", cell: "A1" }
		CellRangeUnselectedChangeOne : 10,

		// { text: "text", ranges: [startCell: "A1" , endCell: "A2" }] }
		MultipleRangesSelected : 11,

		// { name: "sheet 1", cell: "A1", text: "text", cellEnd: "D5", cellsCount: 10, objectsCount: 5 }
		SheetSelected : 12

	};
	
	/**
	 * @constructor
	 */
	function CWorkerSpeech()
	{
		this.isEnabled = false;
		this.speechElement = null;

		this.setEnabled = function(isEnabled)
		{
			if (this.isEnabled === isEnabled)
				return;

			if (!AscCommon.g_inputContext)
				return;

			this.isEnabled = isEnabled;
			if (this.isEnabled)
			{
				this.speechElement = document.createElement("div");
				this.speechElement.innerHTML = "";
				this.speechElement.id = "area_id_screen_reader";
				AscCommon.g_inputContext.HtmlArea.setAttribute("aria-describedby", "area_id_screen_reader");
				AscCommon.g_inputContext.HtmlDiv.appendChild(this.speechElement);
			}
			else if (this.speechElement)
			{
				AscCommon.g_inputContext.HtmlArea.removeAttribute("aria-describedby");
				AscCommon.g_inputContext.HtmlDiv.removeChild(this.speechElement);
				this.speechElement = null;
			}
		};

		this.speech = function(type, obj)
		{
			if (!this.isEnabled)
				return;

			if (undefined === obj)
				obj = {};
			
			if (obj.cancelSelection)
				console.log("Text selection has been canceled");
			
			if (obj.moveToStartOfDocument)
				console.log("Start of the document");
			else if (obj.moveToStartOfLine)
				console.log("Start of the line");
			else if (obj.moveToEndOfDocument)
				console.log("End of the document");
			else if (obj.moveToEndOfLine)
				console.log("End of the line");
			
			
			let translateManager = AscCommon.translateManager;
			switch (type)
			{
				case SpeechWorkerType.Text:
				{
					this.speechElement.innerHTML = obj;
					
					console.log("Text " + obj.text);
					break;
				}
				case SpeechWorkerType.TextSelected:
				{
					if (obj.isBefore)
						this.speechElement.innerHTML = (translateManager.getValue("select ") + obj.text);
					else
						this.speechElement.innerHTML = (obj.text + translateManager.getValue(" select"));
					
					console.log("SelectedText " + obj.text);
					break;
				}
				case SpeechWorkerType.TextUnselected:
				{
					if (obj.isBefore)
						this.speechElement.innerHTML = (translateManager.getValue("unselected") + obj.text ? (" " + obj.text) : "");
					else
						this.speechElement.innerHTML = ((obj.text ? (obj.text + " ") : "") + translateManager.getValue("unselected"));
					
					console.log("UnselectedText " + obj.text);
					break;
				}
				case SpeechWorkerType.SlidesSelected:
				{
					let aIndexes = obj.indexes;
					if(aIndexes.length === 1)
					{
						this.speechElement.innerHTML = (translateManager.getValue("slide ") + (aIndexes[0]));
					}
					else
					{
						this.speechElement.innerHTML = (aIndexes.length + " " + translateManager.getValue("slides added to selection"));
					}
					console.log("SlidesSelected " + this.speechElement.innerHTML);
					break;
				}
				case SpeechWorkerType.SlidesUnselected:
				{
					let aIndexes = obj.indexes;
					if(aIndexes.length === 1)
					{
						this.speechElement.innerHTML = (translateManager.getValue("slide ") + (aIndexes[0]) + " " + translateManager.getValue("unselected"));
					}
					else
					{
						this.speechElement.innerHTML = (aIndexes.length + " " + translateManager.getValue("slides unselected"));
					}
					console.log("SlidesUnselected " + this.speechElement.innerHTML);
					break;
				}
				case SpeechWorkerType.DrawingSelected:
				{
					this.speechElement.innerHTML = (translateManager.getValue("drawing select") + (obj.altText ? (" " + obj.altText) : ""));
					break;
				}
				case SpeechWorkerType.CellSelected:
				{
					let result = ((obj.text ? obj.text : translateManager.getValue("empty cell")) + " " + obj.cell);
					this.speechElement.innerHTML = result;
					console.log(result);
					break;
				}
				case SpeechWorkerType.CellRangeSelected:
				{
					let result = translateManager.getValue("selected range select ");
					result += obj.start.text ? obj.start.text : translateManager.getValue("empty");
					result += (" " + obj.start.cell);
					result += obj.end.text ? obj.end.text : translateManager.getValue("empty");
					result += (" " + obj.end.cell);

					this.speechElement.innerHTML = result;
					console.log(result);
					break;
				}
				case SpeechWorkerType.CellRangeUnselected:
				{
					let result = translateManager.getValue("unselected range select ");
					result += obj.start.text ? obj.start.text : translateManager.getValue("empty");
					result += (" " + obj.start.cell);
					result += obj.end.text ? obj.end.text : translateManager.getValue("empty");
					result += (" " + obj.end.cell);

					this.speechElement.innerHTML = result;
					console.log(result);
					break;
				}
				case SpeechWorkerType.CellRangeSelectedChangeOne:
				{
					let result = translateManager.getValue("select ");
					result += obj.text ? obj.text : translateManager.getValue("empty");
					result += (" " + obj.cell);

					this.speechElement.innerHTML = result;
					console.log(result);
					break;
				}
				case SpeechWorkerType.CellRangeUnselectedChangeOne:
				{
					let result = translateManager.getValue("unselected ");
					result += obj.text ? obj.text : translateManager.getValue("empty");
					result += (" " + obj.cell);

					this.speechElement.innerHTML = result;
					console.log(result);
					break;
				}
				case SpeechWorkerType.MultipleRangesSelected:
				{
					if (obj.ranges) {
						let result = translateManager.getValue("selected ");
						result += obj.ranges.length + " " + translateManager.getValue("areas ");

						for (let i = 0; i < obj.ranges.length; i++) {
							result += obj.ranges[i].startCell + "-" +  obj.ranges[i].endCell + " ";
						}
						result += obj.text ? obj.text : translateManager.getValue("empty");

						this.speechElement.innerHTML = result;
						console.log(result);
					}

					break;
				}
				case SpeechWorkerType.SheetSelected:
				{
					//ms read after "objects" only selection
					//we read selection in next command
					let isEmpty = 0 === obj.cellsCount && 0 === obj.objectsCount;
					let result = "";
					if (isEmpty)
					{
						//ms not read it, read only else
						result = obj.name + " " + translateManager.getValue("empty sheet ") /*+ obj.cell*/;
					}
					else
					{
						result = obj.name + " " + translateManager.getValue("end of sheet ") + obj.cellEnd + " " +
							obj.cellsCount + " " + translateManager.getValue("cells") + " "
							obj.objectsCount + " " + translateManager.getValue("objects") /*+
							obj.text + " " + obj.cell*/;
					}
					console.log(result);
					this.speechElement.innerHTML = result;
					break;
				}
				default:
					break;
			}
		};
	}

	window.AscCommon.SpeechWorker = new CWorkerSpeech();
	window.AscCommon.SpeechWorkerCommands = SpeechWorkerType;
	
	const SpeakerActionType = {
		unknown : 0,
		keyDown : 1,
		sheetChange : 2
	};
	
	/**
	 * @constructor
	 */
	function EditorActionSpeaker()
	{
		this.speechWorker = window.AscCommon.SpeechWorker;
		this.editor = null;
		
		this.isLanched = false;
		
		this.onSelectionChange = null;
		this.onActionStart     = null;
		this.onActionEnd       = null;
		
		this.onBeforeKeyDown = null;
		this.onKeyDown       = null;
		
		this.selectionState   = null;
		this.actionInProgress = false;
		this.isKeyDown        = false;
	}
	EditorActionSpeaker.prototype.run = function()
	{
		this.editor = Asc.editor;
		if (!this.editor || this.isLanched)
			return;
		
		this.isLanched = true;
		
		this.initEvents();
		this.editor.asc_registerCallback('asc_onSelectionEnd', this.onSelectionChange);
		this.editor.asc_registerCallback('asc_onCursorMove', this.onSelectionChange);
		this.editor.asc_registerCallback('asc_onUserActionStart', this.onActionStart);
		this.editor.asc_registerCallback('asc_onUserActionEnd', this.onActionEnd);
		
		this.editor.asc_registerCallback('asc_onBeforeKeyDown', this.onBeforeKeyDown);
		this.editor.asc_registerCallback('asc_onKeyDown', this.onKeyDown);

		//se
		this.editor.asc_registerCallback('asc_onActiveSheetChanged', this.onActiveSheetChanged);
		
		this.selectionState = this.editor.getSelectionState();
		this.actionInProgress = false;
		
		this.speechWorker.setEnabled(true);
	};
	EditorActionSpeaker.prototype.stop = function()
	{
		if (!this.isLanched)
			return;
		
		this.editor.asc_unregisterCallback('asc_onSelectionEnd', this.onSelectionChange);
		this.editor.asc_unregisterCallback('asc_onCursorMove', this.onSelectionChange);
		this.editor.asc_unregisterCallback('asc_onUserActionStart', this.onActionStart);
		this.editor.asc_unregisterCallback('asc_onUserActionEnd', this.onActionEnd);
		
		this.editor.asc_unregisterCallback('asc_onBeforeKeyDown', this.onBeforeKeyDown);
		this.editor.asc_unregisterCallback('asc_onKeyDown', this.onKeyDown);

		//se
		this.editor.asc_unregisterCallback('asc_onActiveSheetChanged', this.onActiveSheetChanged);
		
		this.selectionState = null;
		this.speechWorker.setEnabled(false);
		this.actionInProgress = false;
		this.isKeyDown = false;
		
		this.isLanched = false;
	};
	EditorActionSpeaker.prototype.initEvents = function()
	{
		let _t = this;
		
		this.onSelectionChange = function()
		{
			if (_t.actionInProgress || _t.isKeyDown)
				return;
			
			_t.handleSpeechDescription(null);
		};
		
		this.onActionStart = function()
		{
			_t.actionInProgress = true;
		};
		
		this.onActionEnd = function()
		{
			_t.actionInProgress = false;
			
			// TODO: Если нужно, то добавить описание действия
		};
		
		this.onBeforeKeyDown = function()
		{
			_t.isKeyDown = true;
		};
		
		this.onKeyDown = function(e)
		{
			_t.isKeyDown = false;
			_t.handleSpeechDescription({type: SpeakerActionType.keyDown, event : e});
		};

		this.onActiveSheetChanged = function(index)
		{
			_t.handleSpeechDescription({type: SpeakerActionType.sheetChange, index : index});
		};
		
	};
	EditorActionSpeaker.prototype.handleSpeechDescription = function(action)
	{
		let state = this.editor.getSelectionState();
		if (!this.selectionState)
		{
			this.selectionState = state;
			return;
		}
		
		let speechInfo = this.editor.getSpeechDescription(this.selectionState, action);
		this.selectionState = state;
		if (!speechInfo)
			return;
		
		this.speechWorker.speech(speechInfo.type, speechInfo.obj);
	};
	
	window.AscCommon.EditorActionSpeaker = new EditorActionSpeaker();
	window.AscCommon.SpeakerActionType = SpeakerActionType;
	
	window.AscCommon.SpeechWorker.testFunction = function()
	{
		AscCommon.SpeechWorker.setEnabled(true);
		Asc.editor.asc_registerCallback('asc_onSelectionEnd', function() {

			let text_data = {
				data:     "",
				pushData: function (format, value) {
					this.data = value;
				}
			};

			Asc.editor.asc_CheckCopy(text_data, 1);
			if (text_data.data == null)
				text_data.data = "";

			if (text_data.data === "")
				AscCommon.SpeechWorker.speech(SpeechWorkerType.TextUnselected);
			else
				AscCommon.SpeechWorker.speech(SpeechWorkerType.TextSelected, { text : text_data.data, isBefore : true });

		});
	};

})(window);
