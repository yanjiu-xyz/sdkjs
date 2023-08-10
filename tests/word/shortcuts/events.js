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

(function (window)
{
	window.AscTestShortcut = {};
	const testHotkeyActions = {
		removeBackSymbol                   : 0,
		removeBackWord                     : 1,
		removeShape                        : 2,
		removeForm                         : 3,
		moveToNextForm                     : 4,
		moveToPreviousForm                 : 5,
		handleTab                          : 6,
		moveToNextCell                     : 7,
		moveToPreviousCell                 : 8,
		selectNextObject                   : 9,
		selectPreviousObject               : 10,
		testIndent                         : 11,
		testUnIndent                       : 12,
		addTabToParagraph                  : 13,
		visitHyperlink                     : 14,
		addBreakLineInlineLvlSdt           : 15,
		createTextBoxContent               : 16,
		createTextBody                     : 17,
		addNewLineToMath                   : 18,
		moveCursorToStartPositionShapeEnter: 19,
		selectAllShapeEnter                : 20,
		selectAllInChartTitle              : 22,
		addNewParagraphContent             : 23,
		addNewParagraphMath                : 24,
		closeAllWindowsPopups              : 25,
		resetShapeSelection                : 26,
		resetStartAddShape                 : 27,
		resetFormattingByExample           : 28,
		resetMarkerFormat                  : 29,
		resetDragNDrop                     : 30,
		endEditing                         : 31,
		toggleCheckBox                     : 32,
		pageUp                             : 33,
		pageDown                           : 34,
		moveToEndDocument                  : 35,
		moveToEndLine                      : 36,
		selectToEndDocument                : 37,
		selectToEndLine                    : 38,
		selectToStartLine                  : 39,
		selectToStartDocument              : 40,
		moveToStartLine                    : 41,
		moveToStartDocument                : 42,
		selectLeftWord                     : 43,
		moveToLeftWord                     : 44,
		selectLeftChar                     : 45,
		moveToLeftChar                     : 46,
		moveToRightChar                    : 47,
		selectRightChar                    : 48,
		moveToRightWord                    : 49,
		selectRightWord                    : 50,
		moveUp                             : 51,
		selectUp                           : 52,
		previousOptionComboBox             : 53,
		moveDown                           : 54,
		selectDown                         : 55,
		nextOptionComboBox                 : 56,
		removeFrontSymbol                  : 57,
		removeFrontWord                    : 58,
		unicodeToChar                      : 59,
		showContextMenu                    : 60,
		disableNumLock                     : 61,
		disableScrollLock                  : 62,
		addSJKSpace                        : 63,
		bigMoveGraphicObjectLeft           : 64,
		littleMoveGraphicObjectLeft        : 65,
		bigMoveGraphicObjectRight          : 66,
		littleMoveGraphicObjectRight       : 67,
		bigMoveGraphicObjectDown           : 68,
		littleMoveGraphicObjectDown        : 69,
		bigMoveGraphicObjectUp             : 70,
		littleMoveGraphicObjectUp          : 71,
		moveToPreviousPage                 : 72,
		selectToPreviousPage               : 73,
		moveToStartPreviousPage            : 74,
		selectToStartPreviousPage          : 75,
		moveToPreviousHeaderFooter         : 76,
		moveToPreviousHeader               : 77,
		moveToNextPage                     : 78,
		selectToNextPage                   : 79,
		moveToStartNextPage                : 80,
		selectToStartNextPage              : 81,
		moveToNextHeaderFooter             : 82,
		moveToNextHeader                   : 83
	};

	const testHotkeyEvents = {};
	testHotkeyEvents[testHotkeyActions.bigMoveGraphicObjectLeft] = [new CTestEvent(37, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.littleMoveGraphicObjectLeft] = [new CTestEvent(37, true, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.bigMoveGraphicObjectRight] = [new CTestEvent(39, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.littleMoveGraphicObjectRight] = [new CTestEvent(39, true, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.bigMoveGraphicObjectDown] = [new CTestEvent(40, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.littleMoveGraphicObjectDown] = [new CTestEvent(40, true, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.bigMoveGraphicObjectUp] = [new CTestEvent(38, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.littleMoveGraphicObjectUp] = [new CTestEvent(38, true, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.removeBackSymbol] = [new CTestEvent(8, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.removeBackWord] = [new CTestEvent(8, true, false, false, false)];
	testHotkeyEvents[testHotkeyActions.removeShape] = [
		new CTestEvent(8, false, false, false, false, false),
		new CTestEvent(46, false, false, false, false, false)
	];
	testHotkeyEvents[testHotkeyActions.removeForm] = [
		new CTestEvent(8, false, false, false, false, false),
		new CTestEvent(46, false, false, false, false, false)
	];
	testHotkeyEvents[testHotkeyActions.moveToNextForm] = [new CTestEvent(9, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToPreviousForm] = [new CTestEvent(9, false, true, false, false, false)];
	testHotkeyEvents[testHotkeyActions.handleTab] = [new CTestEvent(9, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToNextCell] = [new CTestEvent(9, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToPreviousCell] = [new CTestEvent(9, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectNextObject] = [new CTestEvent(9, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectPreviousObject] = [new CTestEvent(9, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.testIndent] = [new CTestEvent(9, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.testUnIndent] = [new CTestEvent(9, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.addTabToParagraph] = [new CTestEvent(9, false, false, false)];
	testHotkeyEvents[testHotkeyActions.visitHyperlink] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.addBreakLineInlineLvlSdt] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.createTextBoxContent] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.createTextBody] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.addNewLineToMath] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveCursorToStartPositionShapeEnter] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectAllShapeEnter] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectAllInChartTitle] = [new CTestEvent(13, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.addNewParagraphContent] = [new CTestEvent(13, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.addNewParagraphMath] = [new CTestEvent(13, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.closeAllWindowsPopups] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.resetShapeSelection] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.resetStartAddShape] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.resetFormattingByExample] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.resetMarkerFormat] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.resetDragNDrop] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.endEditing] = [new CTestEvent(27, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.toggleCheckBox] = [new CTestEvent(32, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToEndDocument] = [new CTestEvent(35, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToEndLine] = [new CTestEvent(35, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToEndDocument] = [new CTestEvent(35, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToEndLine] = [new CTestEvent(35, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToStartLine] = [new CTestEvent(36, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToStartDocument] = [new CTestEvent(36, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToStartLine] = [new CTestEvent(36, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToStartDocument] = [new CTestEvent(36, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectLeftWord] = [new CTestEvent(37, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToLeftWord] = [new CTestEvent(37, true, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectLeftChar] = [new CTestEvent(37, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToLeftChar] = [new CTestEvent(37, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToRightChar] = [new CTestEvent(39, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectRightChar] = [new CTestEvent(39, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToRightWord] = [new CTestEvent(39, true, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectRightWord] = [new CTestEvent(39, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveUp] = [new CTestEvent(38, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectUp] = [new CTestEvent(38, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.previousOptionComboBox] = [new CTestEvent(38, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveDown] = [new CTestEvent(40, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.selectDown] = [new CTestEvent(40, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.nextOptionComboBox] = [new CTestEvent(40, false, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.removeFrontSymbol] = [new CTestEvent(46, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.removeFrontWord] = [new CTestEvent(46, true, false, false, false)];
	testHotkeyEvents[testHotkeyActions.unicodeToChar] = [
		new CTestEvent(88, false, false, true, false),
		new CTestEvent(88, true, false, true, false)
	];
	testHotkeyEvents[testHotkeyActions.showContextMenu] = [
		new CTestEvent(93, false, false, false, false),
		new CTestEvent(57351, false, false, false, false),
		new CTestEvent(121, false, true, false, false)
	];
	testHotkeyEvents[testHotkeyActions.disableNumLock] = [new CTestEvent(144, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.disableScrollLock] = [new CTestEvent(145, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.addSJKSpace] = [new CTestEvent(12288, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToStartPreviousPage] = [new CTestEvent(33, true, false, true, false)];
	testHotkeyEvents[testHotkeyActions.moveToPreviousPage] = [new CTestEvent(33, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToPreviousHeaderFooter] = [new CTestEvent(33, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToPreviousHeader] = [
		new CTestEvent(33, true, false, true, false),
		new CTestEvent(33, false, false, true, false)
	];
	testHotkeyEvents[testHotkeyActions.selectToStartPreviousPage] = [new CTestEvent(33, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToPreviousPage] = [new CTestEvent(33, false, true, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToStartNextPage] = [new CTestEvent(34, true, false, true, false)];
	testHotkeyEvents[testHotkeyActions.moveToNextPage] = [new CTestEvent(34, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToNextHeaderFooter] = [new CTestEvent(34, false, false, false, false)];
	testHotkeyEvents[testHotkeyActions.moveToNextHeader] = [
		new CTestEvent(34, true, false, true, false),
		new CTestEvent(34, false, false, true, false)
	];
	testHotkeyEvents[testHotkeyActions.selectToStartNextPage] = [new CTestEvent(34, true, true, false, false)];
	testHotkeyEvents[testHotkeyActions.selectToNextPage] = [new CTestEvent(34, false, true, false, false)];


	function CTestEvent(nKeyCode, bIsCtrl, bIsShift, bIsAlt, bIsMetaKey)
	{
		this.isDefaultPrevented = false;
		this.isPropagationStopped = false;
		this.KeyCode = nKeyCode;
		this.CtrlKey = !!bIsCtrl;
		this.ShiftKey = !!bIsShift;
		this.AltKey = !!bIsAlt;
		this.MacCmdKey = !!bIsMetaKey;
	}

	CTestEvent.prototype.preventDefault = function ()
	{
		this.isDefaultPrevented = true;
	};
	CTestEvent.prototype.stopPropagation = function ()
	{
		this.isPropagationStopped = true;
	};

	AscTestShortcut.testHotkeyActions = testHotkeyActions;
	AscTestShortcut.testHotkeyEvents = testHotkeyEvents;
})(window);
