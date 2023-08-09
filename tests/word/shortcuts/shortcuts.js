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
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
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

'use strict';


(function (window)
{
	const oEvents = AscTestShortcut.oTestEvents;
	const oTestTypes = AscTestShortcut.oTestTypes;

	let logicDocument = AscTest.CreateLogicDocument();
	logicDocument.UpdateAllSectionsInfo();
	const pageWidth = 100;
	const pageHeight = 100;
	logicDocument.Set_DocumentPageSize(pageWidth, pageHeight);
	var props = new Asc.CDocumentSectionProps();
	props.put_TopMargin(0);
	props.put_LeftMargin(0);
	props.put_BottomMargin(0);
	props.put_RightMargin(0);
	logicDocument.Set_SectionProps(props);
	logicDocument.UpdateAllSectionsInfo();
	editor.WordControl.m_oDrawingDocument.GetVisibleMMHeight = function ()
	{
		return 100;
	};
	editor.WordControl.m_oDrawingDocument.SetCursorType = function ()
	{

	};
	let bStartTrackText = false;
	editor.WordControl.m_oDrawingDocument.StartTrackText  = function () {bStartTrackText = true};
	editor.WordControl.m_oDrawingDocument.EndTrackText  = function () {bStartTrackText = false};
	editor.WordControl.m_oDrawingDocument.CancelTrackText  = function () {return bStartTrackText};
	AscFormat.CHART_STYLE_MANAGER.init();



	editor.getShortcut = function (e)
	{
		if (typeof e === 'number')
		{
			return e;
		}
	};
	editor.FontSizeIn = function ()
	{
		logicDocument.IncreaseDecreaseFontSize(true);
	};
	editor.FontSizeOut = function ()
	{
		logicDocument.IncreaseDecreaseFontSize(false);
	};
	editor.StartAddShape = function ()
	{
		this.isStartAddShape = true;
	};



	function GoToHeader(nPage)
	{
		logicDocument.SetDocPosType(AscCommonWord.docpostype_HdrFtr);
		const oEvent = new AscCommon.CMouseEventHandler();
		oEvent.ClickCount = 1;
		oEvent.Button = 0;
		oEvent.Type = AscCommon.g_mouse_event_type_down;

		logicDocument.OnMouseDown(oEvent, 0, 0, nPage);

		oEvent.Type = AscCommon.g_mouse_event_type_up;
		logicDocument.OnMouseUp(oEvent, 0, 0, nPage);
		logicDocument.MoveCursorLeft();
	}

	function GoToFooter(nPage)
	{
		logicDocument.SetDocPosType(AscCommonWord.docpostype_HdrFtr);
		const oEvent = new AscCommon.CMouseEventHandler();
		oEvent.ClickCount = 1;
		oEvent.Button = 0;
		oEvent.Type = AscCommon.g_mouse_event_type_down;

		logicDocument.OnMouseDown(oEvent, 0, pageHeight, nPage);

		oEvent.Type = AscCommon.g_mouse_event_type_up;
		logicDocument.OnMouseUp(oEvent, 0, pageHeight, nPage);
		logicDocument.MoveCursorLeft();
	}

	function RemoveHeader(nPage)
	{
		logicDocument.RemoveHdrFtr(nPage, true);
	}

	function RemoveFooter(nPage)
	{
		logicDocument.RemoveHdrFtr(nPage, false);
	}

	AscFonts.FontPickerByCharacter.checkText = function (text, _this, _callback, isCodes, isOnlyAsync, isCheckSymbols)
	{
		_callback.call(_this);
	}

	editor.WordControl.m_oApi = editor;
	editor.retrieveFormatPainterData = Asc.asc_docs_api.prototype.retrieveFormatPainterData.bind(editor);
	editor.get_ShowParaMarks = Asc.asc_docs_api.prototype.get_ShowParaMarks.bind(editor);
	editor.put_ShowParaMarks = Asc.asc_docs_api.prototype.put_ShowParaMarks.bind(editor);
	editor.sync_ShowParaMarks = Asc.asc_docs_api.prototype.sync_ShowParaMarks.bind(editor);
	editor.private_GetLogicDocument = Asc.asc_docs_api.prototype.private_GetLogicDocument.bind(editor);
	editor.asc_AddTableOfContents  = Asc.asc_docs_api.prototype.asc_AddTableOfContents.bind(editor);
	editor.asc_registerCallback  = Asc.asc_docs_api.prototype.asc_registerCallback.bind(editor);
	editor.asc_unregisterCallback  = Asc.asc_docs_api.prototype.asc_unregisterCallback.bind(editor);
	editor.sendEvent  = Asc.asc_docs_api.prototype.sendEvent.bind(editor);
	editor.sync_DialogAddHyperlink   = Asc.asc_docs_api.prototype.sync_DialogAddHyperlink.bind(editor);
	editor.sync_ParaStyleName   = Asc.asc_docs_api.prototype.sync_ParaStyleName.bind(editor);
	editor.sync_MouseMoveStartCallback    = Asc.asc_docs_api.prototype.sync_MouseMoveStartCallback.bind(editor);
	editor.sync_MouseMoveCallback    = Asc.asc_docs_api.prototype.sync_MouseMoveCallback .bind(editor);
	editor.sync_MouseMoveEndCallback     = Asc.asc_docs_api.prototype.sync_MouseMoveEndCallback.bind(editor);
	editor.sync_HideComment      = Asc.asc_docs_api.prototype.sync_HideComment .bind(editor);
	editor.sync_ContextMenuCallback      = Asc.asc_docs_api.prototype.sync_ContextMenuCallback .bind(editor);
	editor.asc_AddMath  = Asc.asc_docs_api.prototype.asc_AddMath2.bind(editor);
	editor._onEndLoadSdk  = Asc.asc_docs_api.prototype._onEndLoadSdk.bind(editor);
	editor.sync_StartAddShapeCallback   = Asc.asc_docs_api.prototype.sync_StartAddShapeCallback .bind(editor);
	editor.SetPaintFormat   = Asc.asc_docs_api.prototype.SetPaintFormat.bind(editor);
	editor.SetMarkerFormat    = Asc.asc_docs_api.prototype.SetMarkerFormat .bind(editor);
	editor.sync_MarkerFormatCallback     = Asc.asc_docs_api.prototype.sync_MarkerFormatCallback.bind(editor);
	editor.sync_PaintFormatCallback     = Asc.asc_docs_api.prototype.sync_PaintFormatCallback.bind(editor);
	editor.sync_EndAddShape    = function () {};

	editor.isDocumentEditor = true;

	function ExecuteShortcut(type)
	{
		return logicDocument.OnKeyDown(type);
	}
	function ExecuteShortcut2(nType, nEventIndex)
	{
		const oEvent = oEvents[nType][nEventIndex || 0];
		return ExecuteShortcut(oEvent);
	}


	AscCommon.CDocsCoApi.prototype.askSaveChanges = function(callback)
	{
		window.setTimeout(function() {
				callback({"saveLock": false});
		}, 0);
	};
	function ClearDocumentAndAddParagraph(text)
	{
		logicDocument.RemoveSelection();
		AscTest.ClearDocument();
		const p = CreateParagraphWithText(text);
		logicDocument.AddToContent(0, p);
		return p;
	}

	function CreateParagraphWithText(text)
	{
		let p = AscTest.CreateParagraph();

		if (text)
		{
			let run = AscTest.CreateRun();
			run.AddText(text);
			p.AddToContentToEnd(run);
		}

		return p;
	}

	logicDocument.Start_SilentMode();

	function TurnOnRecalculate()
	{
		logicDocument.TurnOn_Recalculate();
	}

	function TurnOffRecalculate()
	{
		logicDocument.TurnOff_Recalculate();
	}

	function TurnOnRecalculateCurPos()
	{
		logicDocument.TurnOn_RecalculateCurPos();
	}

	function TurnOffRecalculateCurPos()
	{
		logicDocument.TurnOff_RecalculateCurPos();
	}

	function ApplyTextPrToDocument(textPr)
	{
		logicDocument.AddToParagraph(new AscCommonWord.ParaTextPr(textPr));
	}

	function GetDirectTextPr()
	{
		return logicDocument.GetDirectTextPr();
	}

	function GetDirectParaPr()
	{
		return logicDocument.GetDirectParaPr();
	}

	$(function ()
	{
		let fOldGetShortcut;
		QUnit.module("Test shortcut actions", {
			before    : function ()
			{
				editor.initDefaultShortcuts();
			},
			beforeEach: function ()
			{
				fOldGetShortcut = editor.getShortcut;
			},
			afterEach : function ()
			{
				editor.getShortcut = fOldGetShortcut;
			},
			after     : function ()
			{
				editor.Shortcuts = new AscCommon.CShortcuts();
			}
		});

		QUnit.test('Check page break shortcut', (assert) =>
		{
			TurnOnRecalculate();
			ClearDocumentAndAddParagraph();
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertPageBreak);
			assert.strictEqual(logicDocument.GetPagesCount(), 2, 'Check page break shortcut');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertPageBreak);
			assert.strictEqual(logicDocument.GetPagesCount(), 3, 'Check page break shortcut');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertPageBreak);
			assert.strictEqual(logicDocument.GetPagesCount(), 4, 'Check page break shortcut');
			TurnOffRecalculate();
		});

		QUnit.test('Check line break shortcut', (assert) =>
		{
			TurnOnRecalculate();
			let p = ClearDocumentAndAddParagraph();
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertLineBreak);
			assert.strictEqual(p.GetLinesCount(), 2, 'Check line break shortcut');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertLineBreak);
			assert.strictEqual(p.GetLinesCount(), 3, 'Check line break shortcut');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertLineBreak);
			assert.strictEqual(p.GetLinesCount(), 4, 'Check line break shortcut');
			TurnOffRecalculate();
		});

		QUnit.test('Check column break shortcut', (assert) =>
		{
			TurnOnRecalculate();
			let p = ClearDocumentAndAddParagraph();
			let sectionPr = AscTest.GetFinalSection();
			sectionPr.SetColumnsNum(3);
			AscTest.Recalculate();

			function CheckColumns(colCount)
			{
				assert.strictEqual(logicDocument.GetPagesCount(), 1, 'Check logic document page count');
				assert.strictEqual(p.GetPagesCount(), colCount, 'Check paragraph page count');
				for (let i = 0; i < colCount; ++i)
				{
					assert.strictEqual(p.GetAbsoluteColumn(i), i, 'Check paragraph column index');
					assert.strictEqual(p.GetAbsolutePage(i), 0, 'Check paragraph page index');
				}
			}

			CheckColumns(1);
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertColumnBreak);
			CheckColumns(2);
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertColumnBreak);
			CheckColumns(3);

			sectionPr.SetColumnsNum(1);
			TurnOffRecalculate();
		});

		QUnit.test('Check reset char shortcut', (assert) =>
		{
			ClearDocumentAndAddParagraph('Hello world');
			logicDocument.SelectAll();
			ApplyTextPrToDocument({Bold: true, Italic: true, Underline: true});

			let textPr = GetDirectTextPr();
			assert.true(true === textPr.GetBold() && true === textPr.GetItalic() && true === textPr.GetUnderline(), 'Check before reset');
			ExecuteShortcut(c_oAscDocumentShortcutType.ResetChar);
			textPr = GetDirectTextPr();
			assert.true(undefined === textPr.GetBold() && undefined === textPr.GetItalic() && undefined === textPr.GetUnderline(), 'Check after reset');
		});

		QUnit.test('Check adding various characters', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph();

			ExecuteShortcut(c_oAscDocumentShortcutType.NonBreakingSpace);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0), 'Check add non breaking space');
			ExecuteShortcut(c_oAscDocumentShortcutType.CopyrightSign);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9), 'Check add CopyrightSign');
			ExecuteShortcut(c_oAscDocumentShortcutType.EuroSign);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC), 'Check add EuroSign');
			ExecuteShortcut(c_oAscDocumentShortcutType.RegisteredSign);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE), 'Check add RegisteredSign');
			ExecuteShortcut(c_oAscDocumentShortcutType.TrademarkSign);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122), 'Check add TrademarkSign');
			ExecuteShortcut(c_oAscDocumentShortcutType.EnDash);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122, 0x2013), 'Check add EnDash');
			ExecuteShortcut(c_oAscDocumentShortcutType.EmDash);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122, 0x2013, 0x2014), 'Check add EmDash');
			ExecuteShortcut(c_oAscDocumentShortcutType.NonBreakingHyphen);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122, 0x2013, 0x2014, 0x002D), 'Check add NonBreakingHyphen');
			ExecuteShortcut(c_oAscDocumentShortcutType.HorizontalEllipsis);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122, 0x2013, 0x2014, 0x002D, 0x2026), 'Check add HorizontalEllipsis');
			ExecuteShortcut2(oTestTypes.addSJKSpace);
			assert.strictEqual(AscTest.GetParagraphText(p), String.fromCharCode(0x00A0, 0x00A9, 0x20AC, 0x00AE, 0x2122, 0x2013, 0x2014, 0x002D, 0x2026, 0x0020), 'Check add HorizontalEllipsis');
		});

		QUnit.test('Check text property change', (assert) =>
		{
			ClearDocumentAndAddParagraph('Hello world');
			logicDocument.SelectAll();

			ExecuteShortcut(c_oAscDocumentShortcutType.Bold);
			assert.strictEqual(GetDirectTextPr().GetBold(), true, 'Check turn on bold');
			ExecuteShortcut(c_oAscDocumentShortcutType.Bold);
			assert.strictEqual(GetDirectTextPr().GetBold(), false, 'Check turn off bold');

			ExecuteShortcut(c_oAscDocumentShortcutType.Italic);
			assert.strictEqual(GetDirectTextPr().GetItalic(), true, 'Check turn on italic');
			ExecuteShortcut(c_oAscDocumentShortcutType.Italic);
			assert.strictEqual(GetDirectTextPr().GetItalic(), false, 'Check turn off italic');

			ExecuteShortcut(c_oAscDocumentShortcutType.Strikeout);
			assert.strictEqual(GetDirectTextPr().GetStrikeout(), true, 'Check turn on strikeout');
			ExecuteShortcut(c_oAscDocumentShortcutType.Strikeout);
			assert.strictEqual(GetDirectTextPr().GetStrikeout(), false, 'Check turn off strikeout');

			ExecuteShortcut(c_oAscDocumentShortcutType.Underline);
			assert.strictEqual(GetDirectTextPr().GetUnderline(), true, 'Check turn on underline');
			ExecuteShortcut(c_oAscDocumentShortcutType.Underline);
			assert.strictEqual(GetDirectTextPr().GetUnderline(), false, 'Check turn off underline');

			ExecuteShortcut(c_oAscDocumentShortcutType.Superscript);
			assert.strictEqual(GetDirectTextPr().GetVertAlign(), AscCommon.vertalign_SuperScript, 'Check turn on superscript');
			ExecuteShortcut(c_oAscDocumentShortcutType.Superscript);
			assert.strictEqual(GetDirectTextPr().GetVertAlign(), AscCommon.vertalign_Baseline, 'Check turn off superscript');

			ExecuteShortcut(c_oAscDocumentShortcutType.Subscript);
			assert.strictEqual(GetDirectTextPr().GetVertAlign(), AscCommon.vertalign_SubScript, 'Check turn on subscript');
			ExecuteShortcut(c_oAscDocumentShortcutType.Subscript);
			assert.strictEqual(GetDirectTextPr().GetVertAlign(), AscCommon.vertalign_Baseline, 'Check turn off subscript');

			// defaultSize = 10
			// 10 -> 11 -> 12 -> 14 -> 16 -> 14 -> 12 -> 11 -> 10
			ExecuteShortcut(c_oAscDocumentShortcutType.IncreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 11, 'Check increase font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.IncreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 12, 'Check increase font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.IncreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 14, 'Check increase font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.IncreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 16, 'Check increase font size');

			ExecuteShortcut(c_oAscDocumentShortcutType.DecreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 14, 'Check decrease font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.DecreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 12, 'Check decrease font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.DecreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 11, 'Check decrease font size');
			ExecuteShortcut(c_oAscDocumentShortcutType.DecreaseFontSize);
			assert.strictEqual(GetDirectTextPr().GetFontSize(), 10, 'Check decrease font size');
		});

		QUnit.test('Check select all shortcut', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph('Hello world');
			let table = AscTest.CreateTable(2, 2);
			logicDocument.AddToContent(1, table);
			assert.strictEqual(logicDocument.IsSelectionUse(), false, 'Check document selection');
			ExecuteShortcut(c_oAscDocumentShortcutType.EditSelectAll);
			assert.strictEqual(logicDocument.IsSelectionUse(), true, 'Check document selection');
			assert.strictEqual(p.IsSelectedAll(), true, 'Check paragraph selection');
			assert.strictEqual(table.IsSelectedAll(), true, 'Check table selection');
		});

		QUnit.test('Check paragraph property change', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph('Hello world');

			function GetStyleName()
			{
				return logicDocument.GetStyleManager().GetName(p.GetParagraphStyle());
			}

			assert.strictEqual(GetStyleName(), "", "Check style");
			ExecuteShortcut(c_oAscDocumentShortcutType.ApplyHeading1);
			assert.strictEqual(GetStyleName(), "Heading 1", "Check apply heading 1");
			ExecuteShortcut(c_oAscDocumentShortcutType.ApplyHeading2);
			assert.strictEqual(GetStyleName(), "Heading 2", "Check apply heading 2");
			ExecuteShortcut(c_oAscDocumentShortcutType.ApplyHeading3);
			assert.strictEqual(GetStyleName(), "Heading 3", "Check apply heading 3");

			assert.strictEqual(GetDirectParaPr().GetJc(), undefined, "Check justification");
			ExecuteShortcut(c_oAscDocumentShortcutType.CenterPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Center, "Check turn on center para");
			ExecuteShortcut(c_oAscDocumentShortcutType.CenterPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Left, "Check turn off center para");

			ExecuteShortcut(c_oAscDocumentShortcutType.JustifyPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Justify, "Check turn on justify para");
			ExecuteShortcut(c_oAscDocumentShortcutType.JustifyPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Left, "Check turn off justify para");

			ExecuteShortcut(c_oAscDocumentShortcutType.JustifyPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Justify, "Check turn on justify para");
			ExecuteShortcut(c_oAscDocumentShortcutType.LeftPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Left, "Check turn on left para");
			ExecuteShortcut(c_oAscDocumentShortcutType.LeftPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Justify, "Check turn off left para");

			ExecuteShortcut(c_oAscDocumentShortcutType.RightPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Right, "Check turn on right para");
			ExecuteShortcut(c_oAscDocumentShortcutType.RightPara);
			assert.strictEqual(GetDirectParaPr().GetJc(), AscCommon.align_Left, "Check turn off right para");

			ExecuteShortcut(c_oAscDocumentShortcutType.Indent);
			assert.strictEqual(GetDirectParaPr().GetIndLeft(), 12.5);

			ExecuteShortcut(c_oAscDocumentShortcutType.UnIndent);
			assert.strictEqual(GetDirectParaPr().GetIndLeft(), 0);

			const p2 = CreateParagraphWithText('Hello');

			logicDocument.SelectAll();

			ExecuteShortcut2(oTestTypes.testIndent);
			assert.strictEqual(GetDirectParaPr().GetIndLeft(), 12.5);

			ExecuteShortcut2(oTestTypes.testUnIndent);
			assert.strictEqual(GetDirectParaPr().GetIndLeft(), 0);
		});

		QUnit.test('Check insert document elements', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph('');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertFootnoteNow);
			const arrFootnotes = logicDocument.GetFootnotesList();
			assert.equal(arrFootnotes.length, 1, 'Check insert footnote shortcut');

			p.SetThisElementCurrent();
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertEndnoteNow);
			const arrEndNotes = logicDocument.GetEndnotesList();
			assert.equal(arrEndNotes.length, 1, 'Check insert endnote shortcut');
			logicDocument.MoveCursorToStartPos();
		});


		QUnit.test('Check shortcuts with sending event to interface', (assert) =>
		{
			function checkSendingEvent(sSendEvent, oEvent, fCustomCheck, customExpectedValue)
			{
				let bCheck = false;
				const fCheck = function (...args)
				{
					if (fCustomCheck)
					{
						bCheck = fCustomCheck(...args);
					} else
					{
						bCheck = true;
					}
				}
				editor.asc_registerCallback(sSendEvent, fCheck);

				ExecuteShortcut(oEvent);
				assert.strictEqual(bCheck, customExpectedValue === undefined ? true : customExpectedValue, 'Check catch ' + sSendEvent + ' event');
				editor.asc_unregisterCallback(sSendEvent, fCheck);
			}

			checkSendingEvent("asc_onDialogAddHyperlink", c_oAscDocumentShortcutType.InsertHyperlink);
			checkSendingEvent("asc_onPrint", c_oAscDocumentShortcutType.PrintPreviewAndPrint);

			checkSendingEvent('asc_onMouseMoveStart', oEvents[oTestTypes.closeAllWindowsPopups][0]);
			checkSendingEvent('asc_onMouseMove', oEvents[oTestTypes.closeAllWindowsPopups][0]);
			checkSendingEvent('asc_onMouseMoveEnd', oEvents[oTestTypes.closeAllWindowsPopups][0]);

			checkSendingEvent('asc_onContextMenu', oEvents[oTestTypes.showContextMenu][0]);
			AscCommon.AscBrowser.isOpera = true;
			checkSendingEvent('asc_onContextMenu', oEvents[oTestTypes.showContextMenu][1]);
			AscCommon.AscBrowser.isOpera = false;
			checkSendingEvent('asc_onContextMenu', oEvents[oTestTypes.showContextMenu][2]);
		});

		QUnit.test('Check insert equation shortcut', (assert) =>
		{
			ClearDocumentAndAddParagraph('');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertEquation);
			const oMath = logicDocument.GetCurrentMath();
			assert.true(!!oMath, 'Check insert equation shortcut');
		});

		QUnit.test('Check insert elements shortcut', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('');
			ExecuteShortcut(c_oAscDocumentShortcutType.InsertPageNumber);

			const r = p.Content[0];
			assert.strictEqual(r.Content[0].Type, para_PageNum);
		});

		QUnit.test('Check bullet list shortcut', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('');
			assert.false(p.IsBulletedNumbering(), 'check apply bullet list');
			ExecuteShortcut(c_oAscDocumentShortcutType.ApplyListBullet);
			assert.true(p.IsBulletedNumbering(), 'check apply bullet list');
		});

		QUnit.test('Check copy/paste format shortcuts', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph('Hello');
			ApplyTextPrToDocument({Bold: true, Italic: true, Underline: true});
			GetDirectTextPr();
			ExecuteShortcut(c_oAscDocumentShortcutType.CopyFormat);
			let tPr = editor.getFormatPainterData().TextPr;
			assert.true(tPr.Get_Bold());
			assert.true(tPr.Get_Italic());
			assert.true(tPr.Get_Underline());

			p = ClearDocumentAndAddParagraph('');
			ExecuteShortcut(c_oAscDocumentShortcutType.PasteFormat);
			tPr = GetDirectTextPr();
			assert.true(tPr.Get_Bold());
			assert.true(tPr.Get_Italic());
			assert.true(tPr.Get_Underline());
		});

		QUnit.test('Check history shortcuts', (assert) =>
		{
			let p = ClearDocumentAndAddParagraph('Hello');
			p.MoveCursorToEndPos();
			logicDocument.AddTextWithPr(' World');
			ExecuteShortcut(c_oAscDocumentShortcutType.EditUndo);
			assert.strictEqual(AscTest.GetParagraphText(p), 'Hello');

			ExecuteShortcut(c_oAscDocumentShortcutType.EditRedo);
			assert.strictEqual(AscTest.GetParagraphText(p), 'Hello World');
		});

		QUnit.test('Check show paramarks shortcut', (assert) =>
		{
			ExecuteShortcut(c_oAscDocumentShortcutType.ShowAll);
			assert.true(editor.ShowParaMarks, 'Check show non printing characters shortcut');
		});

		QUnit.test('Check save shortcut', (assert) =>
		{
			assert.timeout(100);
			const done = assert.async();

			const fOldSave = editor._onSaveCallbackInner;
			editor._onSaveCallbackInner = function ()
			{
				assert.true(true, 'Check save shortcut');
				done();
				editor._onSaveCallbackInner = fOldSave;
			};
			editor._saveCheck  = () => true;
			editor.asc_isDocumentCanSave = () => true;
			ExecuteShortcut(c_oAscDocumentShortcutType.Save);
		});

		//todo
		// QUnit.test.todo('Check update fields shortcut', (assert) =>
		// {
		// 	const p = ClearDocumentAndAddParagraph('Hello');
		// 	const p2 = CreateParagraphWithText('Hello');
		// 	const p3 = CreateParagraphWithText('Hello');
		// 	logicDocument.AddToContent(logicDocument.Content.length, p2);
		// 	logicDocument.AddToContent(logicDocument.Content.length, p3);
		// 		for (let i = 0; i < logicDocument.Content.length; i += 1)
		// 		{
		// 			logicDocument.Set_CurrentElement(i, true);
		// 			logicDocument.SetParagraphStyle("Heading 1");
		// 		}
		// 		logicDocument.MoveCursorToStartPos();
		// 		const props = new Asc.CTableOfContentsPr();
		// 		props.put_OutlineRange(1, 9);
		// 		props.put_Hyperlink(true);
		// 		props.put_ShowPageNumbers(true);
		// 		props.put_RightAlignTab(true);
		// 		props.put_TabLeader(Asc.c_oAscTabLeader.Dot);
		// 		editor.asc_AddTableOfContents(null, props);
		//
		// 		logicDocument.MoveCursorToEndPos();
		// 		const p4 = CreateParagraphWithText('Hello');
		// 		logicDocument.AddToContent(logicDocument.Content.length, p4);
		// 		p4.SetThisElementCurrent(true);
		// 		logicDocument.SetParagraphStyle("Heading 1");
		//
		// 		logicDocument.Content[0].SetThisElementCurrent();
		// 		logicDocument.Content[0].MoveCursorToEndPos();
		//
		// 		ExecuteShortcut(c_oAscDocumentShortcutType.UpdateFields);
		// 		assert.strictEqual(logicDocument.Content[0].Content.Content.length, 5, 'Check update fields shortcut');
		// });

		QUnit.test('Check remove hotkeys', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('Hello Hello Hello Hello');

			ExecuteShortcut2(oTestTypes.removeBackSymbol);
			assert.strictEqual(AscTest.GetParagraphText(p), 'Hello Hello Hello Hell');

			ExecuteShortcut2(oTestTypes.removeBackWord);
			assert.strictEqual(AscTest.GetParagraphText(p), 'Hello Hello Hello ');

			logicDocument.MoveCursorToStartPos();
			ExecuteShortcut2(oTestTypes.removeFrontSymbol);
			assert.strictEqual(AscTest.GetParagraphText(p), 'ello Hello Hello ');
			ExecuteShortcut2(oTestTypes.removeFrontWord);
			assert.strictEqual(AscTest.GetParagraphText(p), 'Hello Hello ');
		});
		QUnit.test('Check move/select in text hotkeys', (assert) =>
		{
			function CheckCursorPosition(nExpected)
			{
				const pos = logicDocument.GetContentPosition();
				assert.strictEqual(pos[pos.length - 1].Position, nExpected);
			}

			const p = ClearDocumentAndAddParagraph(
				'Hello World Hello ' +
				'World Hello World ' +
				'Hello World Hello ' +
				'World Hello World ' +
				'Hello World Hello ' +
				'Hello World Hello ' +
				'Hello World Hello ' +
				'Hello World Hello ' +
				'World Hello World');

			logicDocument.MoveCursorToStartPos();
			TurnOnRecalculate();
			TurnOnRecalculateCurPos();
			AscTest.Recalculate();
			TurnOffRecalculate();
			TurnOffRecalculateCurPos();

			ExecuteShortcut2(oTestTypes.moveToEndLine);
			CheckCursorPosition(18);

			ExecuteShortcut2(oTestTypes.moveToRightChar);
			CheckCursorPosition(19);

			ExecuteShortcut2(oTestTypes.moveToLeftChar);
			CheckCursorPosition(18);

			ExecuteShortcut2(oTestTypes.moveToLeftWord);
			CheckCursorPosition(12);

			ExecuteShortcut2(oTestTypes.moveToRightWord);
			CheckCursorPosition(18);

			ExecuteShortcut2(oTestTypes.moveToRightWord);
			CheckCursorPosition(24);


			ExecuteShortcut2(oTestTypes.moveToStartLine);
			CheckCursorPosition(18);

			ExecuteShortcut2(oTestTypes.moveDown);
			CheckCursorPosition(36);

			ExecuteShortcut2(oTestTypes.moveUp);
			CheckCursorPosition(18);

			ExecuteShortcut2(oTestTypes.moveToEndDocument);
			CheckCursorPosition(161);

			ExecuteShortcut2(oTestTypes.moveToStartDocument);
			CheckCursorPosition(0);

			AscTest.MoveCursorRight();

			ExecuteShortcut2(oTestTypes.moveToNextPage);
			CheckCursorPosition(91);

			ExecuteShortcut2(oTestTypes.moveToPreviousPage);
			CheckCursorPosition(1);

			ExecuteShortcut2(oTestTypes.moveToStartNextPage);
			CheckCursorPosition(90);

			ExecuteShortcut2(oTestTypes.moveToStartPreviousPage);
			CheckCursorPosition(0);

			function CheckSelectedText(sExpectedText)
			{
				const sSelectedText = logicDocument.GetSelectedText();
				assert.strictEqual(sSelectedText, sExpectedText);
			}

			ExecuteShortcut2(oTestTypes.selectToEndLine);
			CheckSelectedText('Hello World Hello ');


			ExecuteShortcut2(oTestTypes.selectRightChar);
			CheckSelectedText('Hello World Hello W');

			ExecuteShortcut2(oTestTypes.selectLeftChar);
			CheckSelectedText('Hello World Hello ');

			ExecuteShortcut2(oTestTypes.selectLeftWord);
			CheckSelectedText('Hello World ');

			ExecuteShortcut2(oTestTypes.selectRightWord);
			CheckSelectedText('Hello World Hello ');

			ExecuteShortcut2(oTestTypes.selectRightWord);
			CheckSelectedText('Hello World Hello World ');

			ExecuteShortcut2(oTestTypes.selectRightWord);
			CheckSelectedText('Hello World Hello World Hello ');

			ExecuteShortcut2(oTestTypes.selectToStartLine);
			CheckSelectedText('Hello World Hello ');

			ExecuteShortcut2(oTestTypes.selectDown);
			CheckSelectedText('Hello World Hello World Hello World ');

			ExecuteShortcut2(oTestTypes.selectUp);
			CheckSelectedText('Hello World Hello ');

			ExecuteShortcut2(oTestTypes.selectToEndDocument);
			CheckSelectedText('Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello Hello World Hello Hello World Hello Hello World Hello World Hello World');

			ExecuteShortcut2(oTestTypes.selectToStartDocument);
			CheckSelectedText('');

			logicDocument.MoveCursorToEndPos();
			ExecuteShortcut2(oTestTypes.selectLeftChar);
			CheckSelectedText('d');

			ExecuteShortcut2(oTestTypes.selectLeftWord);
			CheckSelectedText('World');

			logicDocument.MoveCursorToStartPos();
			AscTest.MoveCursorRight();
			ExecuteShortcut2(oTestTypes.selectToNextPage);
			CheckSelectedText('ello World Hello World Hello World Hello World Hello World Hello World Hello World Hello H');
			AscTest.MoveCursorRight();

			ExecuteShortcut2(oTestTypes.selectToPreviousPage);
			CheckSelectedText('ello World Hello World Hello World Hello World Hello World Hello World Hello World Hello H');
			AscTest.MoveCursorLeft();
			ExecuteShortcut2(oTestTypes.selectToStartNextPage);
			CheckSelectedText('ello World Hello World Hello World Hello World Hello World Hello World Hello World Hello ');
			AscTest.MoveCursorRight();
			ExecuteShortcut2(oTestTypes.selectToStartPreviousPage);
			CheckSelectedText('Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello ');
		});

		function createShape(x, y, h, w)
		{
			const oDrawing = new ParaDrawing(w, h, null, logicDocument.GetDrawingDocument(), logicDocument, null);
			const oShapeTrack = new AscFormat.NewShapeTrack('rect', 0, 0, logicDocument.theme, null, null, null, 0);
			oShapeTrack.track({}, x, y);
			const oShape = oShapeTrack.getShape(true, logicDocument.GetDrawingDocument(), null);
			oShape.spPr.xfrm.setExtX(w);
			oShape.spPr.xfrm.setExtY(h);
			oShape.setBDeleted(false);

			oShape.setParent(oDrawing);
			oDrawing.Set_GraphicObject(oShape);
			oDrawing.Set_DrawingType(drawing_Anchor);
			oDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
			oDrawing.Set_Distance(0, 0, 0, 0);
			const oNearestPos = logicDocument.Get_NearestPos(0, oShape.x, oShape.y, true, oDrawing);
			oDrawing.Set_XYForAdd(oShape.x, oShape.y, oNearestPos, 0);
			oDrawing.AddToDocument(oNearestPos);
			AscTest.Recalculate();
			return oDrawing;
		}

		function selectDrawing(arrDrawings)
		{
			logicDocument.SelectDrawings(arrDrawings, logicDocument);
		}

		function GetDrawingObjects()
		{
			return logicDocument.DrawingObjects;
		}

		function round(nNumber, nAmount)
		{
			const nPower = Math.pow(10, nAmount);
			return Math.round(nNumber * nPower) / nPower;
		}
		QUnit.test('Check move/select drawings', (assert) =>
		{
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph('');
			p.SetThisElementCurrent();
			AscTest.Recalculate();
			const drawing1 = createShape(0, 0, 100, 200);

			const dotsPerMM = logicDocument.DrawingDocument.GetDotsPerMM();
			function CheckShapePosition(X, Y)
			{
				assert.deepEqual([round(drawing1.X * dotsPerMM, 10), round(drawing1.Y * dotsPerMM, 10), drawing1.Extent.W, drawing1.Extent.H], [X, Y, 200, 100]);
			}

			selectDrawing([drawing1]);

			ExecuteShortcut2(oTestTypes.bigMoveGraphicObjectLeft);
			CheckShapePosition(-5, 0);

			ExecuteShortcut2(oTestTypes.littleMoveGraphicObjectLeft);
			CheckShapePosition(-6, 0);

			ExecuteShortcut2(oTestTypes.bigMoveGraphicObjectRight);
			CheckShapePosition(-1, 0);

			ExecuteShortcut2(oTestTypes.littleMoveGraphicObjectRight);
			CheckShapePosition(0, 0);

			ExecuteShortcut2(oTestTypes.bigMoveGraphicObjectDown);
			CheckShapePosition(0, 5);

			ExecuteShortcut2(oTestTypes.littleMoveGraphicObjectDown);
			CheckShapePosition(0, 6);

			ExecuteShortcut2(oTestTypes.bigMoveGraphicObjectUp);
			CheckShapePosition(0, 1);

			ExecuteShortcut2(oTestTypes.littleMoveGraphicObjectUp);
			CheckShapePosition(0, 0);


			function CheckSelectedObjects(arrOfDrawings)
			{
				const nLength = Math.max(arrOfDrawings.length, GetDrawingObjects().selectedObjects.length);
				for (let i = 0; i < nLength; i++)
				{
					assert.true(GetDrawingObjects().selectedObjects[i] === arrOfDrawings[i].GraphicObj);
				}
			}

			const drawing2 = createShape(0, 0, 10, 10);
			const drawing3 = createShape(0, 0, 10, 10);
			selectDrawing([drawing3]);

			ExecuteShortcut2(oTestTypes.selectNextObject);
			CheckSelectedObjects([drawing1]);

			ExecuteShortcut2(oTestTypes.selectNextObject);
			CheckSelectedObjects([drawing2]);

			ExecuteShortcut2(oTestTypes.selectNextObject);
			CheckSelectedObjects([drawing3]);

			ExecuteShortcut2(oTestTypes.selectPreviousObject);
			CheckSelectedObjects([drawing2]);

			ExecuteShortcut2(oTestTypes.selectPreviousObject);
			CheckSelectedObjects([drawing1]);

			ExecuteShortcut2(oTestTypes.selectPreviousObject);
			CheckSelectedObjects([drawing3]);
			TurnOffRecalculate();
		});

		QUnit.test('Check actions with selected shape', (assert) =>
		{
			TurnOnRecalculate();
			const p = CreateParagraphWithText('');
			AscTest.Recalculate();
			let sp = createShape(0, 0, 10, 10);
			selectDrawing([sp]);

			ExecuteShortcut2(oTestTypes.createTextBoxContent);
			assert.true(!!sp.GraphicObj.textBoxContent);

			sp = createShape(0, 0, 10, 10);
			sp.GraphicObj.setWordShape(false);
			selectDrawing([sp]);

			ExecuteShortcut2(oTestTypes.createTextBody);
			assert.true(!!sp.GraphicObj.txBody);

			selectDrawing([sp]);
			ExecuteShortcut2(oTestTypes.moveCursorToStartPositionShapeEnter);
			assert.true(sp.GraphicObj.getDocContent().IsCursorAtBegin());

			AscTest.EnterText('Hello');
			selectDrawing([sp]);

			ExecuteShortcut2(oTestTypes.selectAllShapeEnter);
			assert.strictEqual(logicDocument.GetSelectedText(), 'Hello');
			TurnOffRecalculate();
		});


		QUnit.test('Check move in headers/footers', (assert) =>
		{
			TurnOnRecalculate();
			TurnOnRecalculateCurPos();
			const p = ClearDocumentAndAddParagraph("Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World");
			AscTest.Recalculate();


			logicDocument.GoToPage(2);
			GoToFooter(2);
			GoToHeader(2);
			TurnOffRecalculateCurPos();
			TurnOffRecalculate();

			ExecuteShortcut2(oTestTypes.moveToPreviousHeaderFooter);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[1].Footer);
			ExecuteShortcut2(oTestTypes.moveToPreviousHeaderFooter);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[1].Header);

			ExecuteShortcut2(oTestTypes.moveToNextHeaderFooter);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[1].Footer);
			ExecuteShortcut2(oTestTypes.moveToNextHeaderFooter);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[2].Header);

			ExecuteShortcut2(oTestTypes.moveToPreviousHeader);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[1].Header);
			ExecuteShortcut2(oTestTypes.moveToPreviousHeader);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[0].Header);

			ExecuteShortcut2(oTestTypes.moveToNextHeader);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[1].Header);
			ExecuteShortcut2(oTestTypes.moveToNextHeader);
			assert.true(logicDocument.Controller.HdrFtr.CurHdrFtr === logicDocument.Controller.HdrFtr.Pages[2].Header);

			RemoveHeader(2);
			RemoveFooter(2);
		});

		QUnit.test('Check reset selection shortcut', (assert) =>
		{
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph("");
			AscTest.Recalculate();

			const dr1 = createShape(0, 0, 10, 10);
			const dr2 = createShape(0, 0, 10, 10);

			selectDrawing([dr1, dr2]);

			const group = GetDrawingObjects().groupSelectedObjects();
			group.GraphicObj.selectObject(dr1.GraphicObj, 0);
			GetDrawingObjects().selection.groupSelection = group.GraphicObj;

			ExecuteShortcut2(oTestTypes.resetShapeSelection);
			assert.strictEqual(GetDrawingObjects().selectedObjects.length, 0);
			TurnOffRecalculate();
		});

		QUnit.test('Check reset actions shortcut', (assert) =>
		{
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph("");
			AscTest.Recalculate()
			editor.StartAddShape('rect');
			ExecuteShortcut2(oTestTypes.resetStartAddShape);
			assert.strictEqual(editor.isStartAddShape, false, "Test reset add shape");
			TurnOffRecalculate();
			editor.SetPaintFormat(AscCommon.c_oAscFormatPainterState.kOn);
			ExecuteShortcut2(oTestTypes.resetFormattingByExample);
			assert.strictEqual(editor.isFormatPainterOn(), false, "Test reset formatting by example");

			editor.SetMarkerFormat(true, true, 0, 0, 0);
			ExecuteShortcut2(oTestTypes.resetMarkerFormat);
			assert.strictEqual(editor.isMarkerFormat, false, "Test reset marker");
		});

		QUnit.test('Check disable shortcuts', (assert) =>
		{
			assert.strictEqual(ExecuteShortcut2(oTestTypes.disableNumLock) & keydownresult_PreventAll, keydownresult_PreventAll);
			assert.strictEqual(ExecuteShortcut2(oTestTypes.disableScrollLock) & keydownresult_PreventAll, keydownresult_PreventAll);
		});

		let nKeyId = 0;
		function AddCheckBox()
		{
			const oCheckBox = logicDocument.AddContentControlCheckBox();
			var specProps = new AscCommon.CSdtCheckBoxPr();
			oCheckBox.ApplyCheckBoxPr(specProps);
			oCheckBox.SetFormPr(new AscCommon.CSdtFormPr('key' + nKeyId++, '', '', false));
			return oCheckBox;
		}

		function AddComboBox(arrItems)
		{
			const oComboBox = logicDocument.AddContentControlComboBox();
			var specProps = new AscCommon.CSdtComboBoxPr();
			specProps.clear();
			for (let i = 0; i < arrItems.length; i++)
			{
				specProps.add_Item(arrItems[i], arrItems[i]);
			}

			oComboBox.ApplyComboBoxPr(specProps);
			oComboBox.SetFormPr(new AscCommon.CSdtFormPr('key' + nKeyId++, '', '', false));

			return oComboBox;
		}

		QUnit.test('Check boxes shortcuts', (assert) =>
		{
			AscTest.SetFillingFormMode(false);
			let p = ClearDocumentAndAddParagraph('');

			const checkBox = AddCheckBox();
			AscTest.SetFillingFormMode(true);
			ExecuteShortcut2(oTestTypes.toggleCheckBox);
			assert.true(checkBox.IsCheckBoxChecked());

			ExecuteShortcut2(oTestTypes.toggleCheckBox);
			assert.false(checkBox.IsCheckBoxChecked());
			AscTest.SetFillingFormMode(false);

			ClearDocumentAndAddParagraph('');
			const oComboBox = AddComboBox(['Hello', 'World', 'yo']);
			AscTest.SetFillingFormMode(true);
			ExecuteShortcut2(oTestTypes.nextOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'Hello');

			ExecuteShortcut2(oTestTypes.nextOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'World');

			ExecuteShortcut2(oTestTypes.nextOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'yo');

			ExecuteShortcut2(oTestTypes.previousOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'World');

			ExecuteShortcut2(oTestTypes.previousOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'Hello');

			ExecuteShortcut2(oTestTypes.previousOptionComboBox);
			assert.strictEqual(logicDocument.GetSelectedText(), 'yo');
			AscTest.SetEditingMode();
		});

		QUnit.test('Check remove objects shortcut', (assert) =>
		{
			console.log(!!(editor.restrictions & Asc.c_oAscRestrictionType.OnlyForms))
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph('');
			AscTest.Recalculate();
			let dr = createShape(0, 0 , 10, 10);
			selectDrawing([dr]);

			ExecuteShortcut2(oTestTypes.removeShape, 0);
			assert.strictEqual(p.GetRunByElement(dr), null, 'Test remove shape');

			dr = createShape(0, 0 , 10, 10);
			selectDrawing([dr]);

			ExecuteShortcut2(oTestTypes.removeShape, 1);
			assert.strictEqual(p.GetRunByElement(dr), null, 'Test remove shape');
			TurnOffRecalculate();
		});

		QUnit.test('Check move on forms', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('');
			let oCC1 = AddCheckBox();
			AscTest.MoveCursorRight();
			let oCC2 = AddCheckBox();
			AscTest.MoveCursorRight();
			let oCC3 = AddCheckBox();
			AscTest.SetFillingFormMode(true);


			ExecuteShortcut2(oTestTypes.moveToNextForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC1, 'Test move to next form');

			ExecuteShortcut2(oTestTypes.moveToNextForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC2, 'Test move to next form');

			ExecuteShortcut2(oTestTypes.moveToNextForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC3, 'Test move to next form');

			ExecuteShortcut2(oTestTypes.moveToPreviousForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC2, 'Test move to previous form');
			ExecuteShortcut2(oTestTypes.moveToPreviousForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC1, 'Test move to previous form');
			ExecuteShortcut2(oTestTypes.moveToPreviousForm);
			assert.true(logicDocument.GetSelectedElementsInfo().GetInlineLevelSdt() === oCC3, 'Test move to previous form');

			AscTest.SetEditingMode();
		});

		function AddTable(row, column)
		{
			let table = AscTest.CreateTable(row, column);
			logicDocument.PushToContent(table);
			return table;
		}

		QUnit.test('Check move in table shortcuts', (assert) =>
		{
			ClearDocumentAndAddParagraph();
			const table = AddTable(3, 4);
			table.Document_SetThisElementCurrent();
			table.MoveCursorToStartPos();
			ExecuteShortcut2(oTestTypes.moveToNextCell);
			assert.strictEqual(table.CurCell.Index, 1);
			ExecuteShortcut2(oTestTypes.moveToNextCell);
			assert.strictEqual(table.CurCell.Index, 2);
			ExecuteShortcut2(oTestTypes.moveToNextCell);
			assert.strictEqual(table.CurCell.Index, 3);

			ExecuteShortcut2(oTestTypes.moveToPreviousCell);
			assert.strictEqual(table.CurCell.Index, 2);
			ExecuteShortcut2(oTestTypes.moveToPreviousCell);
			assert.strictEqual(table.CurCell.Index, 1);
			ExecuteShortcut2(oTestTypes.moveToPreviousCell);
			assert.strictEqual(table.CurCell.Index, 0);
		});

		function AddChart()
		{
				const oDrawingDocument = editor.WordControl.m_oDrawingDocument;
				const oDrawing = new ParaDrawing(100, 100, null, oDrawingDocument, null, null);
				const oChartSpace = logicDocument.GetChartObject(Asc.c_oAscChartTypeSettings.lineNormal);
				oChartSpace.spPr.setXfrm(new AscFormat.CXfrm());
				oChartSpace.spPr.xfrm.setOffX(0);
				oChartSpace.spPr.xfrm.setOffY(0);
				oChartSpace.spPr.xfrm.setExtX(100);
				oChartSpace.spPr.xfrm.setExtY(100);

				oChartSpace.setParent(oDrawing);
				oDrawing.Set_GraphicObject(oChartSpace);
				oDrawing.setExtent(oChartSpace.spPr.xfrm.extX, oChartSpace.spPr.xfrm.extY);

				oDrawing.Set_DrawingType(drawing_Anchor);
				oDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
				oDrawing.Set_Distance(0, 0, 0, 0);
			const oNearestPos = logicDocument.Get_NearestPos(0, oChartSpace.x, oChartSpace.y, true, oDrawing);
			oDrawing.Set_XYForAdd(oChartSpace.x, oChartSpace.y, oNearestPos, 0);
			oDrawing.AddToDocument(oNearestPos);
			AscTest.Recalculate();
				return oDrawing;
		}
		QUnit.test('Check Select all in chart title', (assert) =>
		{
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph('');
			AscTest.Recalculate();
			const dr = AddChart();

			const oChart = dr.GraphicObj;
			selectDrawing([dr]);
			const oTitles = oChart.getAllTitles();
			const oController = GetDrawingObjects();
			oController.selection.chartSelection = oChart;
			oChart.selectTitle(oTitles[0], 0);

			ExecuteShortcut2(oTestTypes.selectAllInChartTitle);
			assert.strictEqual(logicDocument.GetSelectedText(), 'Diagram Title', 'Check select all title');
			TurnOffRecalculate();
		});

		QUnit.test('add new paragraph content', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('Hello text');
			ExecuteShortcut2(oTestTypes.addNewParagraphContent);
			assert.strictEqual(logicDocument.Content.length, 2);
		});

		QUnit.test('Check add new paragraph math', (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('Hello text');
			logicDocument.AddParaMath();
			AscTest.EnterText('abcd');
			AscTest.MoveCursorLeft();
			ExecuteShortcut2(oTestTypes.addNewParagraphMath)
			assert.strictEqual(logicDocument.Content.length, 2, 'Test add new paragraph with math');
		});

		QUnit.test("Test add new line to math", (oAssert) =>
		{
				const p = ClearDocumentAndAddParagraph('');
				logicDocument.AddParaMath(c_oAscMathType.FractionVertical);
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();
				AscTest.EnterText('Hello');
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();
				ExecuteShortcut2(oTestTypes.addNewLineToMath);
				const oParaMath = p.GetAllParaMaths()[0];
				const oFraction = oParaMath.Root.GetFirstElement();
				const oNumerator = oFraction.getNumerator();
				const oEqArray = oNumerator.GetFirstElement();
				oAssert.strictEqual(oEqArray.getRowsCount(), 2, 'Check add new line math');
		});

		function AddComplexForm()
		{
			let complexForm = logicDocument.AddComplexForm();
			const formPr = new AscWord.CSdtFormPr();
			var formTextPr = new AscCommon.CSdtTextFormPr();
			formTextPr.put_MultiLine(true);
			complexForm.SetFormPr(formPr);
			complexForm.SetTextFormPr(formTextPr);
			return complexForm;
		}

		// todo
		// QUnit.test("Test remove form", (assert) =>
		// {
		// 	AscTest.SetFillingFormMode(false)
		// 	const p = ClearDocumentAndAddParagraph('');
		// 	const form = AddComboBox(['hdfh']);
		// 	ExecuteShortcut2(oTestTypes.removeForm);
		// 	assert.strictEqual(p.GetPosByElement(form), null, 'Check add new line math');
		// 	AscTest.SetEditingMode()
		// });

		QUnit.test("Add tab to paragraph", (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('');
			ExecuteShortcut2(oTestTypes.addTabToParagraph);
			assert.true(p.GetPrevRunElement().IsTab());
		});


		QUnit.test("Test add break line to inlinelvlsdt", (assert) =>
		{
			TurnOnRecalculate();
			const p = ClearDocumentAndAddParagraph('');
			const oInlineSdt = AddComplexForm();
			ExecuteShortcut2(oTestTypes.addBreakLineInlineLvlSdt);
			assert.strictEqual(oInlineSdt.Lines[0], 2);
			TurnOffRecalculate();
		});

		QUnit.test("Test visit hyperlink", (assert) =>
		{
			TurnOnRecalculate()
			const p = ClearDocumentAndAddParagraph('');

			logicDocument.AddToParagraph(new AscWord.CRunBreak(AscWord.break_Page))
			logicDocument.AddHyperlink(new Asc.CHyperlinkProperty({Anchor: '_top', Text: "Beginning of document"}));
			AscTest.MoveCursorLeft();
			AscTest.MoveCursorLeft();
			ExecuteShortcut2(oTestTypes.visitHyperlink);
			AscTest.Recalculate()
			assert.strictEqual(logicDocument.GetCurrentParagraph(), logicDocument.Content[0]);
			assert.strictEqual(logicDocument.Get_CurPage(), 0);
			TurnOffRecalculate();
		});

		QUnit.test("Test handle tab in math", (oAssert) =>
		{

				const p = ClearDocumentAndAddParagraph('');
				logicDocument.AddParaMath();
				AscTest.EnterText('abcd+abcd+abcd');
				logicDocument.MoveCursorToEndPos();
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();
				AscTest.MoveCursorLeft();

			const oProps = new CMathMenuBase();
			oProps.insert_ManualBreak();
			logicDocument.Set_MathProps(oProps);
			ExecuteShortcut2(oTestTypes.handleTab);
			AscTest.MoveCursorRight();
			const oContentPosition = logicDocument.GetContentPosition();
			const oCurRun = oContentPosition[oContentPosition.length - 1].Class;
			oAssert.strictEqual(oCurRun.MathPrp.Get_AlnAt(), 1, 'Test move to next form');
		});

		// todo
		// QUnit.test("Test end editing", (assert) =>
		// {
		// 	TurnOnRecalculate();
		// 	AscTest.SetFillingFormMode(false);
		// 		const p = ClearDocumentAndAddParagraph('');
		// 		const oCheckBox = AddCheckBox();
		// 	AscTest.SetFillingFormMode(true);
		// 		oCheckBox.MoveCursorToContentControl(true);
		// 		ExecuteShortcut2(oTestTypes.endEditing);
		// 		const oSelectedInfo = logicDocument.GetSelectedElementsInfo();
		// 		assert.strictEqual(!!oSelectedInfo.GetInlineLevelSdt(), false, "Test end editing form");
		// 	AscTest.SetEditingMode();
		//
		// 		GoToHeader(0);
		// 		ExecuteShortcut2(oTestTypes.endEditing);
		// 		assert.strictEqual(logicDocument.GetDocPosType(), AscCommonWord.docpostype_Content, "Test end editing footer");
		// 		RemoveHeader(0);
		//
		// 		GoToFooter(0);
		// 		ExecuteShortcut2(oTestTypes.endEditing);
		// 		assert.strictEqual(logicDocument.GetDocPosType(), AscCommonWord.docpostype_Content, "Test end editing footer");
		// 		RemoveFooter(0);
		// 	TurnOffRecalculate();
		// });

		QUnit.test("Test unicode to char hotkeys", (assert) =>
		{
			const p = ClearDocumentAndAddParagraph('2601');
			AscTest.MoveCursorLeft(true, true);
			ExecuteShortcut2(oTestTypes.unicodeToChar);
			assert.strictEqual(logicDocument.GetSelectedText(), '☁', 'Test replace unicode code to symbol');
		});
		function mouseDown(x, y, page, isRight, count)
		{
			if (!logicDocument)
				return;

			let e = new AscCommon.CMouseEventHandler();

			e.Button = isRight ? AscCommon.g_mouse_button_right : AscCommon.g_mouse_button_left;
			e.ClickCount = count ? count : 1;

			e.Type = AscCommon.g_mouse_event_type_down;
			logicDocument.OnMouseDown(e, x, y, page);
		}

		function mouseUp(x, y, page, isRight, count)
		{
			if (!logicDocument)
				return;

			let e = new AscCommon.CMouseEventHandler();

			e.Button = isRight ? AscCommon.g_mouse_button_right : AscCommon.g_mouse_button_left;
			e.ClickCount = count ? count : 1;

			e.Type = AscCommon.g_mouse_event_type_up;
			logicDocument.OnMouseUp(e, x, y, page);
		}

		function mouseMove(x, y, page, isRight, count)
		{
			if (!logicDocument)
				return;

			let e = new AscCommon.CMouseEventHandler();

			e.Button = isRight ? AscCommon.g_mouse_button_right : AscCommon.g_mouse_button_left;
			e.ClickCount = count ? count : 1;

			e.Type = AscCommon.g_mouse_event_type_move;
			logicDocument.OnMouseMove(e, x, y, page);
		}
		// todo
		// QUnit.test("Test reset drag'n'drop", (oAssert) =>
		// {
		// 	TurnOnRecalculate();
		// 		const p = ClearDocumentAndAddParagraph('Hello Hello');
		// 		AscTest.Recalculate();
		// 		logicDocument.MoveCursorToStartPos();
		// 		AscTest.MoveCursorRight(true, true);
		// 		mouseDown(5, 10, 0, false, 1);
		// 		mouseMove(15, 10, 0, false, 1);
		// 		//ExecuteShortcut2(oTestTypes.resetDragNDrop);
		// 	mouseUp(15, 10, 0, false, 1);
		// 		logicDocument.SelectAll()
		// 		oAssert.strictEqual(logicDocument.GetSelectedText(), 'Hello Hello', "Test reset drag'n'drop");
		// 	TurnOffRecalculate();
		//
		// });

		// QUnit.test("test visit hyperlink", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['']);
		// 		addBreakPage();
		// 		createHyperlink();
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetCurrentParagraph(), logicContent()[0]);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Get_CurPage(), 0);
		// 	}, oTestTypes.visitHyperlink);
		// });


		// QUnit.test("Test add new paragraph", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['']);
		// 		createMath();
		// 		addText('abcd');
		// 		moveCursorLeft();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(logicContent().length, 2, 'Test add new paragraph with math');
		// 	}, oTestTypes.addNewParagraphMath);
		// });

		// QUnit.test("Test add new paragraph", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello Text']);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(logicContent().length, 2, 'Test add new paragraph to content');
		// 	}, oTestTypes.addNewParagraphContent);
		// });

		//
		// QUnit.test('Check show non printing characters shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.ShowAll};
		// 	editor.put_ShowParaMarks(false);
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.true(editor.get_ShowParaMarks(), 'Check show non printing characters shortcut');
		// });
		//
		//
		//
		// QUnit.test('Check copy format shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.CopyFormat};
		// 	const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 	oParagraph.SetThisElementCurrent();
		// 	oGlobalLogicDocument.SelectAll();
		// 	addPropertyToDocument({Bold: true, Italic: true, Underline: true});
		//
		// 	onKeyDown(createNativeEvent());
		// 	const oCopyParagraphTextPr = new AscCommonWord.CTextPr();
		// 	oCopyParagraphTextPr.SetUnderline(true);
		// 	oCopyParagraphTextPr.SetBold(true);
		// 	oCopyParagraphTextPr.BoldCS = true;
		// 	oCopyParagraphTextPr.SetItalic(true);
		// 	oCopyParagraphTextPr.ItalicCS = true;
		// 	oAssert.deepEqual(editor.getFormatPainterData().TextPr, oCopyParagraphTextPr, 'Check copy format shortcut');
		// });
		//
		//
		// QUnit.test('Check insert endnote shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.InsertEndnoteNow};
		// 	const {oLogicDocument} = getLogicDocumentWithParagraphs(['Hello']);
		// 	oLogicDocument.SelectAll();
		// 	onKeyDown(createNativeEvent());
		// 	const arrEndnotes = oLogicDocument.GetEndnotesList();
		// 	oAssert.deepEqual(arrEndnotes.length, 1, 'Check insert endnote shortcut');
		// });
		//
		//
		// QUnit.test('Check bullet list shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.ApplyListBullet};
		// 	const {oLogicDocument, oParagraph} = getLogicDocumentWithParagraphs(['Hello']);
		// 	oLogicDocument.SelectAll();
		// 	onKeyDown(createNativeEvent());
		//
		// 	oAssert.true(oParagraph.IsBulletedNumbering(), 'check apply bullet list');
		// });
		//
		//
		// QUnit.test('Check indent shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.Indent};
		// 	const {oParagraph} = getLogicDocumentWithParagraphs(['Hello']);
		// 	oParagraph.Pr.SetInd(0, 0, 0);
		// 	moveToParagraph(oParagraph, true);
		//
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.strictEqual(directParaPr().GetIndLeft(), 12.5, 'Check increase indent');
		// });
		//
		// QUnit.test('Check unindent shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.UnIndent};
		// 	const {oParagraph} = getLogicDocumentWithParagraphs(['Hello']);
		// 	oParagraph.Pr.SetInd(0, 12.5, 0);
		// 	moveToParagraph(oParagraph, true);
		//
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.true(AscFormat.fApproxEqual(directParaPr().GetIndLeft(), 0), 'Check decrease indent');
		// });
		//
		// QUnit.test('Check insert page number shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.InsertPageNumber};
		// 	checkInsertElementByType(para_PageNum, 'Check insert page number shortcut', oAssert, createNativeEvent());
		// });
		//
		//
		//
		//
		// QUnit.test('Check paste format shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.PasteFormat};
		// 	const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 	oParagraph.SetThisElementCurrent();
		// 	oGlobalLogicDocument.SelectAll();
		// 	addPropertyToDocument({Bold: true, Italic: true});
		// 	oGlobalLogicDocument.Document_Format_Copy();
		// 	remove();
		// 	addParagraphToDocumentWithText('Hello');
		// 	oGlobalLogicDocument.SelectAll();
		// 	onKeyDown(createNativeEvent());
		// 	const oDirectTextPr = directTextPr();
		// 	oAssert.true(oDirectTextPr.Get_Bold() && oDirectTextPr.Get_Italic(), 'Check paste format shortcut');
		// });
		//
		// QUnit.test('Check redo shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.EditRedo};
		// 	const {oLogicDocument} = getLogicDocumentWithParagraphs(['Hello World']);
		// 	oLogicDocument.SelectAll();
		// 	oLogicDocument.Remove(undefined, undefined, true);
		// 	oLogicDocument.Document_Undo();
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.strictEqual(AscTest.GetParagraphText(logicContent()[0]), '', 'Check redo shortcut');
		// });
		//
		// QUnit.test('Check undo shortcut', (oAssert) =>
		// {
		// 	getLogicDocumentWithParagraphs(['Hello World']);
		// 	selectAll();
		// 	editor.asc_Remove();
		//
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.EditUndo};
		// 	onKeyDown(createNativeEvent());
		// 	selectAll();
		// 	oAssert.strictEqual(getSelectedText(), 'Hello World', 'Check redo shortcut');
		// });
		//
		//
		// QUnit.test('Check update fields shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.UpdateFields};
		// 	const {oLogicDocument} = getLogicDocumentWithParagraphs(['Hello', 'Hello', 'Hello'], true);
		// 	for (let i = 0; i < logicContent().length; i += 1)
		// 	{
		// 		oLogicDocument.Set_CurrentElement(i, true);
		// 		oLogicDocument.SetParagraphStyle("Heading 1");
		// 	}
		// 	oLogicDocument.MoveCursorToStartPos();
		// 	const props = new Asc.CTableOfContentsPr();
		// 	props.put_OutlineRange(1, 9);
		// 	props.put_Hyperlink(true);
		// 	props.put_ShowPageNumbers(true);
		// 	props.put_RightAlignTab(true);
		// 	props.put_TabLeader(Asc.c_oAscTabLeader.Dot);
		// 	editor.asc_AddTableOfContents(null, props);
		//
		// 	oLogicDocument.MoveCursorToEndPos();
		// 	const oParagraph = createParagraphWithText('Hello');
		// 	oLogicDocument.AddToContent(logicContent().length, oParagraph);
		// 	moveToParagraph(oParagraph);
		// 	oLogicDocument.SetParagraphStyle("Heading 1");
		//
		// 	logicContent()[0].SetThisElementCurrent();
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.strictEqual(logicContent()[0].Content.Content.length, 5, 'Check update fields shortcut');
		// });
		//
		//
		// QUnit.test('Check show hyperlink menu shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.InsertHyperlink};
		// 	executeTestWithCatchEvent('asc_onDialogAddHyperlink', () => true, true, createNativeEvent(), oAssert, () =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 		moveToParagraph(oParagraph);
		// 		oGlobalLogicDocument.SelectAll();
		// 	});
		// });
		//
		// QUnit.test('Check print shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.PrintPreviewAndPrint};
		// 	executeTestWithCatchEvent('asc_onPrint', () => true, true, createNativeEvent(), oAssert);
		// });
		//
		// QUnit.test('Check save shortcut', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.Save};
		// 	const fOldSave = editor._onSaveCallbackInner;
		// 	let bCheck = false;
		// 	editor._onSaveCallbackInner = function ()
		// 	{
		// 		bCheck = true;
		// 		editor.canSave = true;
		// 	};
		// 	onKeyDown(createNativeEvent());
		// 	oAssert.strictEqual(bCheck, true, 'Check save shortcut');
		// 	editor._onSaveCallbackInner = fOldSave;
		// });
		//
		//
		//
		// QUnit.test('Check insert footnotes now', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.InsertFootnoteNow};
		// 	const {oLogicDocument} = getLogicDocumentWithParagraphs(['Hello']);
		// 	oLogicDocument.SelectAll();
		// 	onKeyDown(createNativeEvent());
		// 	const arrFootnotes = oLogicDocument.GetFootnotesList();
		// 	oAssert.deepEqual(arrFootnotes.length, 1, 'Check insert footnote shortcut');
		// });
		//
		// QUnit.test('Check insert equation', (oAssert) =>
		// {
		// 	editor.getShortcut = function () {return c_oAscDocumentShortcutType.InsertEquation};
		// 	const {oLogicDocument} = getLogicDocumentWithParagraphs(['']);
		// 	onKeyDown(createNativeEvent());
		// 	const oMath = oLogicDocument.GetCurrentMath();
		// 	oAssert.true(!!oMath, 'Check insert equation shortcut');
		// });
		//
		// QUnit.module("Test getting desired action by event")
		// QUnit.test("Test getting common desired action by event", (oAssert) =>
		// {
		// 	editor.initDefaultShortcuts();
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(13, true, false, false, false, false, false)), c_oAscDocumentShortcutType.InsertPageBreak, 'Check getting c_oAscDocumentShortcutType.InsertPageBreak action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(13, false, true, false, false, false, false)), c_oAscDocumentShortcutType.InsertLineBreak, 'Check getting c_oAscDocumentShortcutType.InsertLineBreak action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(13, true, true, false, false, false, false)), c_oAscDocumentShortcutType.InsertColumnBreak, 'Check getting c_oAscDocumentShortcutType.InsertColumnBreak action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(32, true, false, false, false, false, false)), c_oAscDocumentShortcutType.ResetChar, 'Check getting c_oAscDocumentShortcutType.ResetChar action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(32, true, true, false, false, false, false)), c_oAscDocumentShortcutType.NonBreakingSpace, 'Check getting c_oAscDocumentShortcutType.NonBreakingSpace action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(53, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Strikeout, 'Check getting c_oAscDocumentShortcutType.Strikeout action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(56, true, true, false, false, false, false)), c_oAscDocumentShortcutType.ShowAll, 'Check getting c_oAscDocumentShortcutType.ShowAll action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(65, true, false, false, false, false, false)), c_oAscDocumentShortcutType.EditSelectAll, 'Check getting c_oAscDocumentShortcutType.EditSelectAll action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(66, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Bold, 'Check getting c_oAscDocumentShortcutType.Bold action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(67, true, false, true, false, false, false)), c_oAscDocumentShortcutType.CopyFormat, 'Check getting c_oAscDocumentShortcutType.CopyFormat action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(71, true, false, true, false, false, false)), c_oAscDocumentShortcutType.CopyrightSign, 'Check getting c_oAscDocumentShortcutType.CopyrightSign action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(68, true, false, true, false, false, false)), c_oAscDocumentShortcutType.InsertEndnoteNow, 'Check getting c_oAscDocumentShortcutType.InsertEndnoteNow action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(69, true, false, false, false, false, false)), c_oAscDocumentShortcutType.CenterPara, 'Check getting c_oAscDocumentShortcutType.CenterPara action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(69, true, false, true, false, false, false)), c_oAscDocumentShortcutType.EuroSign, 'Check getting c_oAscDocumentShortcutType.EuroSign action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(73, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Italic, 'Check getting c_oAscDocumentShortcutType.Italic action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(74, true, false, false, false, false, false)), c_oAscDocumentShortcutType.JustifyPara, 'Check getting c_oAscDocumentShortcutType.JustifyPara action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(75, true, false, false, false, false, false)), c_oAscDocumentShortcutType.InsertHyperlink, 'Check getting c_oAscDocumentShortcutType.InsertHyperlink action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(76, true, true, false, false, false, false)), c_oAscDocumentShortcutType.ApplyListBullet, 'Check getting c_oAscDocumentShortcutType.ApplyListBullet action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(76, true, false, false, false, false, false)), c_oAscDocumentShortcutType.LeftPara, 'Check getting c_oAscDocumentShortcutType.LeftPara action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(77, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Indent, 'Check getting c_oAscDocumentShortcutType.Indent action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(77, true, true, false, false, false, false)), c_oAscDocumentShortcutType.UnIndent, 'Check getting c_oAscDocumentShortcutType.UnIndent action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(80, true, false, false, false, false, false)), c_oAscDocumentShortcutType.PrintPreviewAndPrint, 'Check getting c_oAscDocumentShortcutType.PrintPreviewAndPrint action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(80, true, true, false, false, false, false)), c_oAscDocumentShortcutType.InsertPageNumber, 'Check getting c_oAscDocumentShortcutType.InsertPageNumber action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(82, true, false, false, false, false, false)), c_oAscDocumentShortcutType.RightPara, 'Check getting c_oAscDocumentShortcutType.RightPara action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(82, true, false, true, false, false, false)), c_oAscDocumentShortcutType.RegisteredSign, 'Check getting c_oAscDocumentShortcutType.RegisteredSign action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(83, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Save, 'Check getting c_oAscDocumentShortcutType.Save action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(84, true, false, true, false, false, false)), c_oAscDocumentShortcutType.TrademarkSign, 'Check getting c_oAscDocumentShortcutType.TrademarkSign action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(85, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Underline, 'Check getting c_oAscDocumentShortcutType.Underline action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(86, true, false, true, false, false, false)), c_oAscDocumentShortcutType.PasteFormat, 'Check getting c_oAscDocumentShortcutType.PasteFormat action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(89, true, false, false, false, false, false)), c_oAscDocumentShortcutType.EditRedo, 'Check getting c_oAscDocumentShortcutType.EditRedo action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(90, true, false, false, false, false, false)), c_oAscDocumentShortcutType.EditUndo, 'Check getting c_oAscDocumentShortcutType.EditUndo action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(109, true, false, false, false, false, false)), c_oAscDocumentShortcutType.EnDash, 'Check getting c_oAscDocumentShortcutType.EnDash action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(109, true, false, true, false, false, false)), c_oAscDocumentShortcutType.EmDash, 'Check getting c_oAscDocumentShortcutType.EmDash action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(120, false, false, false, false, false, false)), c_oAscDocumentShortcutType.UpdateFields, 'Check getting c_oAscDocumentShortcutType.UpdateFields action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(188, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Superscript, 'Check getting c_oAscDocumentShortcutType.Superscript action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(189, true, true, false, false, false, false)), c_oAscDocumentShortcutType.NonBreakingHyphen, 'Check getting c_oAscDocumentShortcutType.NonBreakingHyphen action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(190, true, false, true, false, false, false)), c_oAscDocumentShortcutType.HorizontalEllipsis, 'Check getting c_oAscDocumentShortcutType.HorizontalEllipsis action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(190, true, false, false, false, false, false)), c_oAscDocumentShortcutType.Subscript, 'Check getting c_oAscDocumentShortcutType.Subscript action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(219, true, false, false, false, false, false)), c_oAscDocumentShortcutType.DecreaseFontSize, 'Check getting c_oAscDocumentShortcutType.DecreaseFontSize action');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(221, true, false, false, false, false, false)), c_oAscDocumentShortcutType.IncreaseFontSize, 'Check getting c_oAscDocumentShortcutType.IncreaseFontSize action');
		// 	editor.Shortcuts = new AscCommon.CShortcuts();
		// });
		//
		// QUnit.test("Test getting windows desired action by event", (oAssert) =>
		// {
		// 	editor.initDefaultShortcuts();
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(49, false, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading1, 'Check getting c_oAscDocumentShortcutType.ApplyHeading1 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(50, false, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading2, 'Check getting c_oAscDocumentShortcutType.ApplyHeading2 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(51, false, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading3, 'Check getting c_oAscDocumentShortcutType.ApplyHeading3 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(70, true, false, true, false, false, false)), c_oAscDocumentShortcutType.InsertFootnoteNow, 'Check getting c_oAscDocumentShortcutType.InsertFootnoteNow shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(187, false, false, true, false, false, false)), c_oAscDocumentShortcutType.InsertEquation, 'Check getting c_oAscDocumentShortcutType.InsertEquation shortcut type');
		// 	editor.Shortcuts = new AscCommon.CShortcuts();
		// });
		//
		// QUnit.test("Test getting macOs desired action by event", (oAssert) =>
		// {
		// 	const bOldMacOs = AscCommon.AscBrowser.isMacOs;
		// 	AscCommon.AscBrowser.isMacOs = true;
		// 	editor.initDefaultShortcuts();
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(49, true, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading1, 'Check getting c_oAscDocumentShortcutType.ApplyHeading1 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(50, true, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading2, 'Check getting c_oAscDocumentShortcutType.ApplyHeading2 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(51, true, false, true, false, false, false)), c_oAscDocumentShortcutType.ApplyHeading3, 'Check getting c_oAscDocumentShortcutType.ApplyHeading3 shortcut type');
		// 	oAssert.strictEqual(editor.getShortcut(createEvent(187, true, false, true, false, false, false)), c_oAscDocumentShortcutType.InsertEquation, 'Check getting c_oAscDocumentShortcutType.InsertEquation shortcut type');
		// 	editor.Shortcuts = new AscCommon.CShortcuts();
		// 	AscCommon.AscBrowser.isMacOs = bOldMacOs;
		// });
		//
		// QUnit.module('Test hotkeys module', {
		// 	afterEach: function ()
		// 	{
		// 		resetLogicDocument(oGlobalLogicDocument);
		// 	}
		// })
		// QUnit.test("test remove back symbol", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		selectAll();
		// 		oAssert.strictEqual(getSelectedText(), 'Hello Worl', 'Test remove back symbol');
		// 	}, oTestTypes.removeBackSymbol);
		// });
		//
		// QUnit.test("test remove back word", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		selectAll();
		// 		oAssert.strictEqual(getSelectedText(), 'Hello ', 'Test remove back word');
		// 	}, oTestTypes.removeBackWord);
		// });
		//
		// QUnit.test("test remove shape", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs([''], true);
		// 		moveToParagraph(oParagraph);
		// 		const oDrawing = createShape();
		// 		selectParaDrawing(oDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oParagraph.GetRunByElement(oDrawing), null, 'Test remove shape');
		// 	}, oTestTypes.removeShape);
		// });
		//
		// QUnit.test("test remove form", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['']);
		// 		moveToParagraph(oParagraph);
		// 		const oInlineLvlSdt = createComboBox();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oParagraph.GetPosByElement(oInlineLvlSdt), null, 'Test remove form');
		// 	}, oTestTypes.removeForm);
		// });
		//
		//
		// QUnit.test("test move to next form", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['']);
		// 		const oInlineSdt1 = createComboBox();
		// 		moveCursorRight();
		// 		const oInlineSdt2 = createComboBox();
		// 		moveCursorRight();
		// 		const oInlineSdt3 = createComboBox();
		// 		setFillingFormsMode(true);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt1, 'Test move to next form');
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt2, 'Test move to next form');
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt3, 'Test move to next form');
		//
		// 		setFillingFormsMode(false);
		// 	}, oTestTypes.moveToNextForm);
		// });
		//
		//
		// QUnit.test("test move to previous form", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['']);
		// 		const oInlineSdt1 = createComboBox();
		// 		moveCursorRight();
		// 		const oInlineSdt2 = createComboBox();
		// 		moveCursorRight();
		// 		const oInlineSdt3 = createComboBox();
		// 		setFillingFormsMode(true);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt2, 'Test move to next form');
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt1, 'Test move to next form');
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetSelectedElementsInfo().GetInlineLevelSdt(), oInlineSdt3, 'Test move to next form');
		//
		// 		setFillingFormsMode(false);
		// 	}, oTestTypes.moveToPreviousForm);
		// });
		//
		//
		//
		// QUnit.test("Test handle tab in math", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs([''], true);
		// 		createMath();
		// 		addText('abcd+abcd+abcd');
		// 		moveToParagraph(oParagraph);
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		insertManualBreak();
		// 		onKeyDown(oEvent);
		// 		moveCursorRight();
		// 		const oContentPosition = oGlobalLogicDocument.GetContentPosition();
		// 		const oCurRun = oContentPosition[oContentPosition.length - 1].Class;
		//
		// 		oAssert.strictEqual(oCurRun.MathPrp.Get_AlnAt(), 1, 'Test move to next form');
		// 	}, oTestTypes.handleTab);
		// });
		//
		// QUnit.test("test move to cell", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const oTable = createTable(3, 3);
		// 		moveToTable(oTable, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oTable.CurCell.Index, 1, 'Test move to next cell');
		// 	}, oTestTypes.moveToNextCell);
		// });
		//
		// QUnit.test("test move to cell", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const oTable = createTable(3, 3);
		// 		moveToTable(oTable, true);
		// 		moveCursorRight();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oTable.CurCell.Index, 0, 'Test move to previous cell');
		// 	}, oTestTypes.moveToPreviousCell);
		// });
		//
		// QUnit.test("test select next object", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oFirstParaDrawing = createShape();
		// 		const oSecondParaDrawing = createShape();
		// 		selectParaDrawing(oFirstParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(drawingObjects().selectedObjects.length === 1 && drawingObjects().selectedObjects[0] === oSecondParaDrawing.GraphicObj, true, 'Test select next object');
		//
		// 	}, oTestTypes.selectNextObject);
		// });
		//
		// QUnit.test("test select previous object", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oFirstParaDrawing = createShape();
		// 		const oSecondParaDrawing = createShape();
		// 		const oThirdParaDrawing = createShape();
		// 		selectParaDrawing(oFirstParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(drawingObjects().selectedObjects.length === 1 && drawingObjects().selectedObjects[0] === oThirdParaDrawing.GraphicObj, true, 'Test select previous object');
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(drawingObjects().selectedObjects.length === 1 && drawingObjects().selectedObjects[0] === oSecondParaDrawing.GraphicObj, true, 'Test select previous object');
		// 	}, oTestTypes.selectPreviousObject);
		// });
		//
		// QUnit.test("test indent", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['Hello world', "Hello world"]);
		// 		const oFirstParagraph = logicContent()[0];
		// 		const oSecondParagraph = logicContent()[1];
		// 		selectAll();
		// 		onKeyDown(oEvent);
		// 		let arrSteps = [];
		// 		moveToParagraph(oFirstParagraph);
		// 		arrSteps.push(directParaPr().GetIndLeft());
		// 		moveToParagraph(oSecondParagraph);
		// 		arrSteps.push(directParaPr().GetIndLeft());
		// 		oAssert.deepEqual(arrSteps, [12.5, 12.5], 'Test indent');
		//
		// 		moveToParagraph(oFirstParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual();
		// 	}, oTestTypes.testIndent);
		// });
		//
		// QUnit.test("test unindent", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['hello', 'hello']);
		// 		const oFirstParagraph = logicContent()[0];
		// 		const oSecondParagraph = logicContent()[1];
		// 		oFirstParagraph.Set_Ind({Left: 12.5});
		// 		oSecondParagraph.Set_Ind({Left: 12.5});
		// 		selectAll();
		// 		onKeyDown(oEvent);
		//
		// 		const arrSteps = [];
		// 		moveToParagraph(oFirstParagraph);
		// 		arrSteps.push(directParaPr().GetIndLeft());
		// 		moveToParagraph(oSecondParagraph);
		// 		arrSteps.push(directParaPr().GetIndLeft());
		//
		// 		oAssert.deepEqual(arrSteps, [0, 0], 'Test unindent');
		// 	}, oTestTypes.testUnIndent);
		// });
		//
		//
		// QUnit.test("test add tab to paragraph", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello World']);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorRight();
		// 		onKeyDown(oEvent);
		// 		selectAll();
		//
		// 		oAssert.strictEqual(getSelectedText(), 'H\tello World', 'Test indent');
		// 	}, oTestTypes.addTabToParagraph);
		// });
		//
		// QUnit.test("test visit hyperlink", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['']);
		// 		addBreakPage();
		// 		createHyperlink();
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetCurrentParagraph(), logicContent()[0]);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Get_CurPage(), 0);
		// 	}, oTestTypes.visitHyperlink);
		// });
		//
		// QUnit.test("Test add break line to inlinelvlsdt", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oInlineSdt = createComplexForm();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oInlineSdt.Lines[0], 2);
		// 	}, oTestTypes.addBreakLineInlineLvlSdt);
		// });
		//
		// QUnit.test("Test create textBoxContent", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const oParaDrawing = createShape();
		// 		selectParaDrawing(oParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(!!oParaDrawing.GraphicObj.textBoxContent, true);
		// 	}, oTestTypes.createTextBoxContent);
		// });
		//
		// QUnit.test("Test create txBody", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const oParaDrawing = createShape();
		// 		oParaDrawing.GraphicObj.setWordShape(false);
		// 		selectParaDrawing(oParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(!!oParaDrawing.GraphicObj.txBody, true);
		// 	}, oTestTypes.createTextBody);
		// });
		//
		// QUnit.test("Test add new line to math", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['']);
		// 		createMath(c_oAscMathType.FractionVertical);
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		addText('Hello');
		// 		moveCursorLeft();
		// 		moveCursorLeft();
		// 		onKeyDown(oEvent);
		// 		const oParaMath = oParagraph.GetAllParaMaths()[0];
		// 		const oFraction = oParaMath.Root.GetFirstElement();
		// 		const oNumerator = oFraction.getNumerator();
		// 		const oEqArray = oNumerator.GetFirstElement();
		// 		oAssert.strictEqual(oEqArray.getRowsCount(), 2, 'Check add new line math');
		// 	}, oTestTypes.addNewLineToMath);
		// });
		//
		// QUnit.test("Test move cursor to start position shape", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oParaDrawing = createShape();
		// 		const oShape = oParaDrawing.GraphicObj;
		// 		oShape.createTextBoxContent();
		// 		selectParaDrawing(oParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oShape.getDocContent().IsCursorAtBegin(), true);
		// 	}, oTestTypes.moveCursorToStartPositionShapeEnter);
		// });
		//
		// QUnit.test("Test select all in shape", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true)
		// 		const oParaDrawing = createShape();
		// 		const oShape = oParaDrawing.GraphicObj;
		// 		oShape.createTextBoxContent();
		// 		moveToParagraph(oShape.getDocContent().Content[0]);
		// 		addText('Hello');
		// 		selectParaDrawing(oParaDrawing);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Hello');
		// 	}, oTestTypes.selectAllShapeEnter);
		// });
		//
		// QUnit.test("Test move cursor to start position chart title", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const oParaDrawing = createChart();
		// 		const oChart = oParaDrawing.GraphicObj;
		// 		const oTitles = oChart.getAllTitles();
		// 		const oContent = AscFormat.CreateDocContentFromString('', drawingObjects().getDrawingDocument(), oTitles[0].txBody);
		// 		oTitles[0].txBody.content = oContent;
		// 		selectParaDrawing(oParaDrawing);
		//
		// 		const oController = drawingObjects();
		// 		oController.selection.chartSelection = oChart;
		// 		oChart.selectTitle(oTitles[0], 0);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.true(oContent.IsCursorAtBegin(), 'Check move cursor to begin pos in title');
		// 	}, oTestTypes.moveCursorToStartPositionTitleEnter);
		// });
		//
		// QUnit.test("Test select all in chart title", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oParaDrawing = createChart();
		// 		const oChart = oParaDrawing.GraphicObj;
		// 		selectParaDrawing(oParaDrawing);
		// 		const oTitles = oChart.getAllTitles();
		// 		const oController = drawingObjects();
		// 		oController.selection.chartSelection = oChart;
		// 		oChart.selectTitle(oTitles[0], 0);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Diagram Title', 'Check select all title');
		// 	}, oTestTypes.selectAllInChartTitle);
		// });
		//
		// QUnit.test("Test add new paragraph", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello Text']);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(logicContent().length, 2, 'Test add new paragraph to content');
		// 	}, oTestTypes.addNewParagraphContent);
		// });
		//
		// QUnit.test("Test add new paragraph", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['']);
		// 		createMath();
		// 		addText('abcd');
		// 		moveCursorLeft();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(logicContent().length, 2, 'Test add new paragraph with math');
		// 	}, oTestTypes.addNewParagraphMath);
		// });
		//
		// QUnit.test("Test close all window popups", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		executeTestWithCatchEvent('asc_onMouseMoveStart', () => true, true, oEvent, oAssert);
		// 		executeTestWithCatchEvent('asc_onMouseMove', () => true, true, oEvent, oAssert);
		// 		executeTestWithCatchEvent('asc_onMouseMoveEnd', () => true, true, oEvent, oAssert);
		// 	}, oTestTypes.closeAllWindowsPopups);
		// });
		//
		// QUnit.test("Test reset shape selection", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const arrDrawings = [createShape(), createShape()];
		// 		const oGroup = createGroup(arrDrawings);
		// 		const oChart = createChart();
		// 		selectOnlyObjects([oChart, oGroup, arrDrawings[0]]);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(drawingObjects().getSelectedArray().length, 0, "Test reset shape selection");
		// 	}, oTestTypes.resetShapeSelection);
		// });
		//
		// QUnit.test("Test reset add shape", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		editor.StartAddShape('rect');
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(editor.isStartAddShape, false, "Test reset add shape");
		// 	}, oTestTypes.resetStartAddShape);
		// });
		//
		// QUnit.test("Test reset formatting by example", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		editor.SetPaintFormat(AscCommon.c_oAscFormatPainterState.kOn);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(editor.isFormatPainterOn(), false, "Test reset formatting by example");
		// 	}, oTestTypes.resetFormattingByExample);
		// });
		//
		// QUnit.test("Test reset", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		editor.SetMarkerFormat(true, true, 0, 0, 0);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(editor.isMarkerFormat, false, "Test reset marker");
		// 	}, oTestTypes.resetMarkerFormat);
		//
		// });
		//
		// QUnit.test("Test reset drag'n'drop", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(['Hello Hello'], true);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorRight(true, true);
		// 		mouseDown(5, 10, 0, false, 1);
		// 		mouseMove(35, 10, 0, false, 1);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(editor.WordControl.m_oDrawingDocument.IsTrackText(), false, "Test reset drag'n'drop");
		// 		mouseUp(35, 10, 0, false, 1);
		// 	}, oTestTypes.resetDragNDrop);
		// });
		//
		// QUnit.test("Test end editing form", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs([''], true);
		// 		const oCheckBox = createCheckBox();
		// 		oCheckBox.MoveCursorToContentControl(true);
		// 		setFillingFormsMode(true);
		// 		onKeyDown(oEvent);
		// 		const oSelectedInfo = oGlobalLogicDocument.GetSelectedElementsInfo();
		// 		oAssert.strictEqual(!!oSelectedInfo.GetInlineLevelSdt(), false, "Test end editing form");
		// 		setFillingFormsMode(false);
		//
		// 		editor.GoToHeader(0);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), AscCommonWord.docpostype_Content, "Test end editing footer");
		// 		editor.asc_RemoveHeader(0);
		//
		// 		editor.GoToFooter(0);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), AscCommonWord.docpostype_Content, "Test end editing footer");
		// 		editor.asc_RemoveFooter(0);
		// 	}, oTestTypes.endEditing);
		// });
		//
		// QUnit.test("Test toggle checkbox", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		getLogicDocumentWithParagraphs(['']);
		// 		const oInlineSdt = createCheckBox();
		// 		setFillingFormsMode(true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oInlineSdt.IsCheckBoxChecked(), true);
		// 		setFillingFormsMode(false);
		// 	}, oTestTypes.toggleCheckBox);
		// });
		//
		// QUnit.test("Test actions to page up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		//
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 125);
		// 	}, oTestTypes.moveToPreviousPage);
		// });
		//
		// QUnit.test("Test actions to page up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 90);
		// 	}, oTestTypes.moveToStartPreviousPage);
		// });
		//
		// QUnit.test("Test move to previous header or footer", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		editor.GoToHeader(2);
		// 		editor.GoToFooter(2);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[2].Header);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[1].Footer);
		// 	}, oTestTypes.moveToPreviousHeaderFooter);
		// 	editor.asc_RemoveHeader(2);
		// 	editor.asc_RemoveFooter(2);
		// });
		//
		// QUnit.test("Test actions to page up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		//
		// 		editor.GoToHeader(2);
		// 		editor.GoToFooter(2);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[1].Header);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[0].Header);
		// 	}, oTestTypes.moveToPreviousHeader);
		// 	editor.asc_RemoveHeader(2);
		// 	editor.asc_RemoveFooter(2);
		// });
		// function drawingDocument()
		// {
		// 	return editor.WordControl.m_oDrawingDocument;
		// }
		// QUnit.test("Test select to previous page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		//
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), ' World Hello World Hello World Hello World Hello World Hello World Hello World Hello World');
		// 	}, oTestTypes.selectToPreviousPage);
		// });
		//
		//
		// QUnit.test("Test select to start previous page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World');
		// 	}, oTestTypes.selectToStartPreviousPage);
		// });
		//
		// QUnit.test("Test select to start of next page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello ', "Test select to begin of next page");
		// 	}, oTestTypes.selectToStartNextPage);
		// });
		// QUnit.test("Test move to start of next page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 90, "Test move to begin of next page");
		// 	}, oTestTypes.moveToStartNextPage);
		// });
		// QUnit.test("Test select to next page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		//
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorRight();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'ello World Hello World Hello World Hello World Hello World Hello World Hello World Hello W', "Test select to next page");
		// 	}, oTestTypes.selectToNextPage);
		// });
		// QUnit.test("Test move to next page", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorRight();
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 91, "Test move to next page");
		// 	}, oTestTypes.moveToNextPage);
		// });
		// QUnit.test("Test move to next header/footer", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		editor.GoToFooter(0);
		// 		editor.GoToHeader(0);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[0].Footer);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[1].Header);
		// 	}, oTestTypes.moveToNextHeaderFooter);
		// });
		// QUnit.test("Test move to next header", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		editor.GoToFooter(0);
		// 		editor.GoToHeader(0);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[1].Header);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oGlobalLogicDocument.GetDocPosType(), docpostype_HdrFtr);
		// 		oAssert.strictEqual(oGlobalLogicDocument.Controller.HdrFtr.CurHdrFtr, oGlobalLogicDocument.Controller.HdrFtr.Pages[2].Header);
		// 	}, oTestTypes.moveToNextHeader);
		// });
		//
		// QUnit.test("Test actions to end", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 107, "Test move to end of document");
		// 	}, oTestTypes.moveToEndDocument);
		// });
		//
		// QUnit.test("Test actions to end", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 18, "Test move to end of line");
		// 	}, oTestTypes.moveToEndLine);
		// });
		//
		// QUnit.test("Test actions to end", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World", "Test select to end of document");
		//
		// 	}, oTestTypes.selectToEndDocument);
		// });
		//
		// QUnit.test("Test actions to end", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), "Hello World Hello ", "Test select to end of line");
		// 	}, oTestTypes.selectToEndLine);
		// });
		//
		// QUnit.test("Test actions to home", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), "World Hello World", "Test select to home of line");
		// 	}, oTestTypes.selectToStartLine);
		// });
		//
		// QUnit.test("Test actions to home", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World", "Test select to home of document");
		//
		// 	}, oTestTypes.selectToStartDocument);
		//
		// });
		//
		// QUnit.test("Test actions to home", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 90, "Test move to home of line");
		// 	}, oTestTypes.moveToStartLine);
		// });
		//
		// QUnit.test("Test actions to home", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 0, "Test move to home of document");
		// 	}, oTestTypes.moveToStartDocument);
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'World', "Test select to previous word");
		// 	}, oTestTypes.selectLeftWord);
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 18, "Test move to previous word");
		// 	}, oTestTypes.moveToLeftWord);
		// 	let oEvent;
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'd', "Test select to previous symbol");
		// 	}, oTestTypes.selectLeftSymbol);
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph);
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 22, "Test move to previous symbol");
		// 	}, oTestTypes.moveToLeftChar);
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(-1, 0, oAssert, oEvent);
		// 	}, oTestTypes.littleMoveGraphicObjectLeft);
		// });
		//
		// QUnit.test("Test actions to left", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(-5, 0, oAssert, oEvent);
		// 	}, oTestTypes.bigMoveGraphicObjectLeft);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(1, 0, oAssert, oEvent);
		// 	}, oTestTypes.littleMoveGraphicObjectRight);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(5, 0, oAssert, oEvent);
		// 	}, oTestTypes.bigMoveGraphicObjectRight);
		// });
		//
		// QUnit.test("Test actions to up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(0, -1, oAssert, oEvent);
		// 	}, oTestTypes.littleMoveGraphicObjectUp);
		// });
		//
		// QUnit.test("Test actions to up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(0, -5, oAssert, oEvent);
		// 	}, oTestTypes.bigMoveGraphicObjectUp);
		// });
		//
		// QUnit.test("Test actions to down", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(0, 1, oAssert, oEvent);
		// 	}, oTestTypes.littleMoveGraphicObjectDown);
		// });
		//
		// QUnit.test("Test actions to down", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		moveShapeHelper(0, 5, oAssert, oEvent);
		// 	}, oTestTypes.bigMoveGraphicObjectDown);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(contentPosition(), 1, "Test move to next symbol");
		// 	}, oTestTypes.moveToRightChar);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), "H", "Test select to next symbol");
		// 	}, oTestTypes.selectRightChar);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.deepEqual(contentPosition(), 6, "Test move to next word");
		// 	}, oTestTypes.moveToRightWord);
		// });
		//
		// QUnit.test("Test actions to right", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Hello ', "Test select to next word");
		// 	}, oTestTypes.selectRightWord);
		// });
		//
		// QUnit.test("Test actions to up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorDown();
		// 		onKeyDown(oEvent);
		// 		oAssert.deepEqual(contentPosition(), 0, "Test move to upper line");
		// 	}, oTestTypes.moveUp);
		// });
		//
		// QUnit.test("Test actions to up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorDown();
		// 		oEvent = createNativeEvent(38, false, true, false, false);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Hello World Hello ', "Test select to upper line");
		// 	}, oTestTypes.selectUp);
		// });
		//
		// QUnit.test("Test actions to up", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		clean();
		// 		getLogicDocumentWithParagraphs(['']);
		// 		createComboBox();
		// 		setFillingFormsMode(true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(AscTest.GetParagraphText(logicContent()[0]), 'Hello', "Test select previous option in combo box");
		//
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(AscTest.GetParagraphText(logicContent()[0]), 'yo', "Test select previous option in combo box");
		// 		setFillingFormsMode(false);
		// 	}, oTestTypes.previousOptionComboBox);
		// });
		//
		// QUnit.test("Test actions to down", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.deepEqual(contentPosition(), 18, "Test move to down line");
		// 	}, oTestTypes.moveDown);
		// });
		//
		// QUnit.test("Test actions to down", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World"], true);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), 'Hello World Hello ', "Test select to down line");
		// 	}, oTestTypes.selectDown);
		// });
		//
		// QUnit.test("Test actions to down", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		clean();
		// 		getLogicDocumentWithParagraphs(['']);
		// 		createComboBox();
		// 		setFillingFormsMode(true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(AscTest.GetParagraphText(logicContent()[0]), 'Hello', "Test select next option in combo box");
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(AscTest.GetParagraphText(logicContent()[0]), 'World', "Test select next option in combo box");
		// 		setFillingFormsMode(false);
		// 	}, oTestTypes.nextOptionComboBox);
		// });
		//
		// QUnit.test("Test remove front", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World"]);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		selectAll();
		// 		oAssert.strictEqual(getSelectedText(), 'ello World', 'Test remove front symbol');
		// 	}, oTestTypes.removeFrontSymbol);
		// });
		//
		// QUnit.test("Test remove front", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello World"]);
		// 		moveToParagraph(oParagraph, true);
		// 		onKeyDown(oEvent);
		// 		selectAll();
		// 		oAssert.strictEqual(getSelectedText(), 'World', 'Test remove front word');
		// 	}, oTestTypes.removeFrontWord);
		// });
		//
		// QUnit.test("Test replace unicode code to symbol", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["2601"]);
		// 		moveToParagraph(oParagraph, true);
		// 		moveCursorRight(true, true);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(getSelectedText(), '☁', 'Test replace unicode code to symbol');
		// 	}, oTestTypes.unicodeToChar);
		// });
		//
		// QUnit.test("Test show context menu", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		const {oParagraph} = getLogicDocumentWithParagraphs(["Hello Text"]);
		// 		moveToParagraph(oParagraph, true);
		//
		// 		oEvent = createNativeEvent(93, false, false, false, false);
		// 		executeTestWithCatchEvent('asc_onContextMenu', () => true, true, oEvent, oAssert);
		//
		// 		AscCommon.AscBrowser.isOpera = true;
		// 		oEvent = createNativeEvent(57351, false, false, false, false);
		// 		executeTestWithCatchEvent('asc_onContextMenu', () => true, true, oEvent, oAssert);
		// 		AscCommon.AscBrowser.isOpera = false;
		//
		// 		oEvent = createNativeEvent(121, false, true, false, false);
		// 		executeTestWithCatchEvent('asc_onContextMenu', () => true, true, oEvent, oAssert);
		// 	}, oTestTypes.showContextMenu);
		//
		// });
		//
		// QUnit.test("Test disable numlock", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		oEvent = createNativeEvent(144, false, false, false, false);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oEvent.isDefaultPrevented, true, 'Test prevent default on numlock');
		// 	}, oTestTypes.disableNumLock);
		// });
		//
		// QUnit.test("Test disable scroll lock", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		oEvent = createNativeEvent(145, false, false, false, false);
		// 		onKeyDown(oEvent);
		// 		oAssert.strictEqual(oEvent.isDefaultPrevented, true, 'Test prevent default on scroll lock');
		// 	}, oTestTypes.disableScrollLock);
		// });
		//
		// QUnit.test("Test add SJK test", (oAssert) =>
		// {
		// 	startTest((oEvent) =>
		// 	{
		// 		checkTextAfterKeyDownHelperEmpty(' ', oEvent, oAssert, 'Check add space after SJK space');
		// 	}, oTestTypes.addSJKSpace);
		// });
	});
})(window);
