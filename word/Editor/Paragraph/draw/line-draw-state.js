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

(function(window)
{
	/**
	 * Class for storing the current draw state of various lines in the paragraph (underline/spelling/etc.)
	 * @param {AscWord.ParagraphDrawState} drawState
	 * @constructor
	 */
	function ParagraphLineDrawState(drawState)
	{
		this.drawState = drawState;
		
		this.Paragraph = undefined;
		this.Graphics  = undefined;
		this.BgColor   = undefined;
		
		this.CurPos   = new AscWord.CParagraphContentPos();
		this.CurDepth = 0;
		
		this.VisitedHyperlink = false;
		this.Hyperlink = false;
		
		this.UlTrailSpace = false;
		
		this.Strikeout  = new CParaDrawingRangeLines();
		this.DStrikeout = new CParaDrawingRangeLines();
		this.Underline  = new CParaDrawingRangeLines();
		this.Spelling   = new CParaDrawingRangeLines();
		this.RunReview  = new CParaDrawingRangeLines();
		this.CollChange = new CParaDrawingRangeLines();
		this.DUnderline = new CParaDrawingRangeLines();
		this.FormBorder = new CParaDrawingRangeLines();
		
		this.Page  = 0;
		this.Line  = 0;
		this.Range = 0;
		
		this.X               = 0;
		this.BaseLine        = 0;
		this.UnderlineOffset = 0;
		this.Spaces          = 0;
		
		this.ComplexFields = new CParagraphComplexFieldsInfo();
	}
	
	ParagraphLineDrawState.prototype.init = function(paragraph, graphics)
	{
		this.Paragraph = paragraph;
		this.Graphics  = graphics;
	};
	ParagraphLineDrawState.prototype.Reset = function(BgColor)
	{
		this.BgColor = BgColor;
		
		this.VisitedHyperlink = false;
		this.Hyperlink        = false;
		
		this.CurPos   = new AscWord.CParagraphContentPos();
		this.CurDepth = 0;
		
		
		let oLogicDocument = this.GetLogicDocument();
		if (oLogicDocument && oLogicDocument.IsDocumentEditor())
		{
			this.UlTrailSpace = oLogicDocument.IsUnderlineTrailSpace();
		}
	};
	ParagraphLineDrawState.prototype.Reset_Line = function(Page, Line, Baseline, UnderlineOffset)
	{
		this.Page = Page;
		this.Line = Line;
		
		this.Baseline        = Baseline;
		this.UnderlineOffset = UnderlineOffset;
		
		this.Strikeout.Clear();
		this.DStrikeout.Clear();
		this.Underline.Clear();
		this.Spelling.Clear();
		this.RunReview.Clear();
		this.CollChange.Clear();
		this.DUnderline.Clear();
		this.FormBorder.Clear();
	};
	ParagraphLineDrawState.prototype.Reset_Range = function(Range, X, Spaces)
	{
		this.Range  = Range;
		this.X      = X;
		this.Spaces = Spaces;
	};
	/**
	 * Получаем количество орфографических ошибок в данном месте
	 * @returns {number}
	 */
	ParagraphLineDrawState.prototype.GetSpellingErrorsCounter = function()
	{
		var nCounter = 0;
		var oSpellChecker = this.Paragraph.GetSpellChecker();
		for (var nIndex = 0, nCount = oSpellChecker.GetElementsCount(); nIndex < nCount; ++nIndex)
		{
			var oSpellElement = oSpellChecker.GetElement(nIndex);
			
			if (false !== oSpellElement.Checked || oSpellElement.CurPos)
				continue;
			
			var oStartPos = oSpellElement.GetStartPos();
			var oEndPos   = oSpellElement.GetEndPos();
			
			if (this.CurPos.Compare(oStartPos) > 0 && this.CurPos.Compare(oEndPos) < 0)
				nCounter++;
		}
		
		return nCounter;
	};
	ParagraphLineDrawState.prototype.GetLogicDocument = function()
	{
		return this.Paragraph.GetLogicDocument();
	};
	ParagraphLineDrawState.prototype.IsUnderlineTrailSpace = function()
	{
		return this.UlTrailSpace;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphLineDrawState = ParagraphLineDrawState;
	
})(window);

