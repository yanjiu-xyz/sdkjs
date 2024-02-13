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

$(function () {
	let logicDocument = AscTest.CreateLogicDocument();

	let versionHistory = logicDocument.Api.VersionHistory = new Asc.asc_CVersionHistory();
	versionHistory.asc_SetUserId(0);
	versionHistory.asc_SetUserName("AnonymousUser");
	versionHistory.asc_SetDateOfRevision(new Date().getTime());

	let oCurDelRecover = null;
	let arr = [];

	function AddParagraph(pos)
	{
		let p = AscTest.CreateParagraph();
		logicDocument.AddToContent(pos, p);
		return p;
	}
	function CreateRun(text)
	{
		let r = AscTest.CreateRun();
		r.AddText(text);
		return r;
	}
	function DelLast(nCount)
	{
		for (let i = 0; i < nCount; i++)
			AscTest.PressKey(AscTest.Key.backspace);
	}

	function Init()
	{
		UpdateChanges();
		logicDocument.CollaborativeEditing.CoHistory.initTextRecover();
		oCurDelRecover = AscCommon.CollaborativeEditing.CoHistory.textRecovery;
	}

	function UpdateChanges ()
	{
		arr = [];
		let nLengthOfPoints = AscCommon.History.Points.length - 1;

		for (let i = 0; i <= nLengthOfPoints; i++)
		{
			AscCommon.History.GetChangesFromPoint(i, arr);
		}

		AscCommon.CollaborativeEditing.CoHistory.Changes = arr;
	}

	function ShowDelText()
	{
		oCurDelRecover.RecoverDeletedText();
	}

	function Prev()
	{
		oCurDelRecover.NavigationRevisionHistoryByStep(oCurDelRecover.GetCurrentIndexNavigationPoint() - 1, true);
	}

	function Next()
	{
		oCurDelRecover.NavigationRevisionHistoryByStep(oCurDelRecover.GetCurrentIndexNavigationPoint() + 1, true);
	}

	function CheckRuns(assert, paragraph, arr)
	{
		for (let i = 0; i < paragraph.Content.length - 1; i++)
		{
			if (!arr[i])
				return;

			let name = arr[i][1] === reviewtype_Common ? "reviewtype_Common" : "reviewtype_Remove";
			let str ="\"" + arr[i][0] + "\"" + " is " + name
			let oCurrentRun = paragraph.Content[i];
				assert.strictEqual(oCurrentRun.ReviewType, arr[i][1], str);
		}
	}

	QUnit.testStart(function (){
		AscCommon.History.Clear();
		AscTest.ClearDocument();
		AscCommon.CollaborativeEditing.CoHistory.textRecovery = null;
	})

	QUnit.module("Unit-tests for recover deleted text");

	QUnit.test("Delete one letter", function (assert)
	{
		let strStartText = "abc";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with 'abc' text.");

		DelLast(1);
		assert.ok(true, "Delete one last letter");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "ab", "Text in run is 'ab'");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let recoverRun = p.Content[1];
		assert.strictEqual(recoverRun.ReviewType, reviewtype_Remove, "New ParaRun ReviewType is delete");
		assert.strictEqual(run.ReviewType, reviewtype_Common, "Old ParaRun ReviewType is common");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "abc", "Text in run is 'abc'");

		CheckRuns(assert, p, [
			["ab", reviewtype_Common],
			[" c", reviewtype_Remove],
		]);
	});

	QUnit.test("Delete letter block (with selection)", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");

		DelLast(6);
		assert.ok(true, "Delete ' World'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hello", "Text in run is 'Hello'");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		CheckRuns(assert, p, [
			["Hello", reviewtype_Common],
			[" World", reviewtype_Remove],
		]);
	});

	QUnit.test("Delete many letter as one block", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");

		AscTest.MoveCursorLeft(false, false, 6);
		DelLast(4);
		assert.ok(true, "Delete 'llo'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "H World", "Text in run is 'H World'");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		CheckRuns(assert, p, [
			["He", reviewtype_Common],
			["llo", reviewtype_Remove],
			[" World", reviewtype_Common],
		]);
	});

	QUnit.test("Delete letter blocks (from left to right)", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");

		AscTest.MoveCursorLeft(false, false, 8);
		DelLast(2);
		assert.ok(true, "Delete 'el'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo World", "Text in run is 'Hlo World'");

		AscTest.MoveCursorRight(false, false, 6);
		DelLast(2);
		assert.ok(true, "Delete 'or'");
		strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo Wld", "Text in run is 'Hlo Wld'");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		CheckRuns(assert, p, [
			["H", reviewtype_Common],
			["el", reviewtype_Remove],
			["lo W", reviewtype_Common],
			["or", reviewtype_Remove],
			["ld", reviewtype_Common],
		]);
	});

	QUnit.test("Delete letter blocks (from right to left)", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");
		AscTest.MoveCursorToParagraph(p, false);

		AscTest.MoveCursorLeft(false, false, 2);
		AscTest.MoveCursorLeft(true, false, 2);
		DelLast(1);
		assert.ok(true, "Delete 'or'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hello Wld", "Text in run is 'Hello Wld'");

		AscTest.MoveCursorLeft(false, false, 4);
		AscTest.MoveCursorLeft(true, false, 2);
		DelLast(1);
		assert.ok(true, "Delete 'el'");
		strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo Wld", "Text in run is 'Hlo Wld'");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		CheckRuns(assert, p, [
			["H", reviewtype_Common],
			["el", reviewtype_Remove],
			["lo W", reviewtype_Common],
			["or", reviewtype_Remove],
			["ld", reviewtype_Common],
		]);
	});

	QUnit.test("Delete paragraph", function (assert)
	{
		let strOne = "One";
		let p = AddParagraph(0);
		let run = CreateRun(strOne);
		p.AddToContentToEnd(run);

		DelLast(5);
		assert.ok(true, "Delete 'One'");

		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "", "Text in document is ''");

		Init();
		ShowDelText()
		assert.ok(true, "Recover deleted text");
		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "One", "Text in run is 'One'");

		CheckRuns(assert, p, [
			["One", reviewtype_Remove],
		]);
	});



	QUnit.test("Going back and forth through history - one letter", function (assert)
	{
		let strStartText = "abc";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with 'abc' text.");

		DelLast(1);
		assert.ok(true, "Delete one last letter");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "ab", "Text in run is 'ab'");

		Init();
		Prev();
		assert.ok(true, "Prev in history");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "abc", "Text in run is 'abc'");

		Next();
		assert.ok(true, "Next in history");

		let strResultText2 = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText2, "ab", "Text in run is 'ab'");
	});

	QUnit.test("Going back and forth through history - letter block", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");

		DelLast(6);
		assert.ok(true, "Delete ' World'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hello", "Text in run is 'Hello'");

		Init();
		Prev();
		assert.ok(true, "Prev in history");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		Next();
		assert.ok(true, "Next in history");

		let strResultText2 = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText2, "Hello", "Text in run is 'Hello'");
	});

	QUnit.test("Going back and forth through history - letter blocks (deleted from left to right)", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");

		AscTest.MoveCursorLeft(false, false, 8);
		DelLast(2);
		assert.ok(true, "Delete 'el'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo World", "Text in run is 'Hlo World'");

		AscTest.MoveCursorRight(false, false, 6);
		DelLast(2);
		assert.ok(true, "Delete 'or'");
		strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo Wld", "Text in run is 'Hlo Wld'");

		Init();
		Prev();
		assert.ok(true, "Prev in history");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		Next();
		assert.ok(true, "Next in history");

		let strResultText2 = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText2, "Hlo Wld", "Text in run is 'Hlo Wld'");

	});

	QUnit.test("Going back and forth through history - letter blocks (from right to left)", function (assert)
	{
		let strStartText = "Hello World";
		let p = AddParagraph(0);
		let run = CreateRun(strStartText);
		p.AddToContentToEnd(run);
		assert.ok(true, "Create run with '" + strStartText+"' text.");
		AscTest.MoveCursorToParagraph(p, false);

		AscTest.MoveCursorLeft(false, false, 2);
		AscTest.MoveCursorLeft(true, false, 2);
		DelLast(1);
		assert.ok(true, "Delete 'or'");
		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hello Wld", "Text in run is 'Hello Wld'");

		AscTest.MoveCursorLeft(false, false, 4);
		AscTest.MoveCursorLeft(true, false, 2);
		DelLast(1);
		assert.ok(true, "Delete 'el'");
		strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "Hlo Wld", "Text in run is 'Hlo Wld'");

		Init();
		Prev();
		assert.ok(true, "Prev in history");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "Hello World", "Text in run is 'Hello World'");

		Next();
		assert.ok(true, "Next in history");

		let strResultText2 = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText2, "Hlo Wld", "Text in run is 'Hlo Wld'");
	});

	QUnit.test("Going back and forth through history - paragraph", function (assert)
	{
		let strOne = "One";
		let p = AddParagraph(0);
		let run = CreateRun(strOne);
		p.AddToContentToEnd(run);

		DelLast(5);
		assert.ok(true, "Delete 'One'");

		let strDeletedText = AscTest.GetParagraphText(p);
		assert.strictEqual(strDeletedText, "", "Text in document is ''");

		Init();
		Prev();
		assert.ok(true, "Prev in history");

		let strResultText = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText, "One", "Text in run is 'One'");

		Next();
		assert.ok(true, "Next in history");

		let strResultText2 = AscTest.GetParagraphText(p);
		assert.strictEqual(strResultText2, "", "Text in run is ''");
	});

});
