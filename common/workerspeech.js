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

		// { num: 1 }
		SlideSelected : 3,

		// { altText: "text" }
		DrawingSelected : 4,

		// { text: "text", cell: "A1" }
		CellSelected : 5,

		// { start: { text: "text", cell: "A1" }, end: { text: "text", cell: "A2" }] } }
		CellRangeSelected : 6,

		// { start: { text: "text", cell: "A1" }, end: { text: "text", cell: "A2" }] } }
		CellRangeUnselected : 7,

		// { text: "text", cell: "A1" }
		CellRangeSelectedChangeOne : 8,

		// { text: "text", cell: "A1" }
		CellRangeUnselectedChangeOne : 9,

		// { name: "sheet 1", cell: "A1", text: "text", cellEnd: "D5", cellsCount: 10, objectsCount: 5 }
		SheetSelected : 10

	};

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

			let translateManager = AscCommon.translateManager;
			switch (type)
			{
				case SpeechWorkerType.Text:
				{
					this.speechElement.innerHTML = obj;
					break;
				}
				case SpeechWorkerType.TextSelected:
				{
					if (obj.isBefore)
						this.speechElement.innerHTML = (translateManager.getValue("select ") + obj.text);
					else
						this.speechElement.innerHTML = (obj.text + translateManager.getValue(" select"));
					break;
				}
				case SpeechWorkerType.TextUnselected:
				{
					if (obj.isBefore)
						this.speechElement.innerHTML = (translateManager.getValue("unselected") + obj.text ? (" " + obj.text) : "");
					else
						this.speechElement.innerHTML = ((obj.text ? (obj.text + " ") : "") + translateManager.getValue("unselected"));
					break;
				}
				case SpeechWorkerType.SlideSelected:
				{
					this.speechElement.innerHTML = (translateManager.getValue("slide ") + obj.num);
					break;
				}
				case SpeechWorkerType.DrawingSelected:
				{
					this.speechElement.innerHTML = (translateManager.getValue("drawing select") + (obj.altText ? (" " + obj.altText) : ""));
					break;
				}
				case SpeechWorkerType.CellSelected:
				{
					this.speechElement.innerHTML = ((obj.text ? obj.text : translateManager.getValue("empty cell")) + " " + obj.cell);
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
					break;
				}
				case SpeechWorkerType.CellRangeSelectedChangeOne:
				{
					let result = translateManager.getValue("select ");
					result += obj.text ? obj.text : translateManager.getValue("empty");
					result += (" " + obj.cell);

					this.speechElement.innerHTML = result;
					break;
				}
				case SpeechWorkerType.CellRangeUnselectedChangeOne:
				{
					let result = translateManager.getValue("unselected ");
					result += obj.text ? obj.text : translateManager.getValue("empty");
					result += (" " + obj.cell);

					this.speechElement.innerHTML = result;
					break;
				}
				case SpeechWorkerType.SheetSelected:
				{
					let isEmpty = (0 === obj.cellsCount && 0 === obj.objectsCount) ? true : false;
					let result = "";
					if (isEmpty)
					{
						result = obj.name + " " + translateManager.getValue("empty sheet ") + obj.cell;
					}
					else
					{
						result = obj.name + " " + translateManager.getValue("end of sheet ") + obj.cellEnd + " " +
							obj.cellsCount + " " + translateManager.getValue("cells") +
							obj.objectsCount + " " + translateManager.getValue("objects") +
							obj.text + " " + obj.cell;
					}
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
