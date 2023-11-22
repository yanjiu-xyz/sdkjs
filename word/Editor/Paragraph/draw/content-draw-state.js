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
	 * Class for holding the current state of paragraph content (text, images) drawing
	 * @param {AscWord.ParagraphDrawState} drawState - reference to the main state
	 * @constructor
	 */
	function ParagraphContentDrawState(drawState)
	{
		this.Paragraph = undefined;
		this.Graphics  = undefined;
		this.BgColor   = undefined;
		
		this.Theme     = undefined;
		this.ColorMap  = undefined;
		
		this.CurPos = new AscWord.CParagraphContentPos();
		
		this.VisitedHyperlink = false;
		this.Hyperlink = false;
		
		this.Page   = 0;
		this.Line   = 0;
		this.Range  = 0;
		
		this.X = 0;
		this.Y = 0;
		
		this.LineTop    = 0;
		this.LineBottom = 0;
		this.BaseLine   = 0;
		
		this.ComplexFields = new CParagraphComplexFieldsInfo();
	}
	ParagraphContentDrawState.prototype.init = function(paragraph, graphics)
	{
		this.Paragraph = paragraph;
		this.Graphics  = graphics;
	};
	ParagraphContentDrawState.prototype.Reset = function(BgColor, Theme, ColorMap)
	{
		this.BgColor  = BgColor;
		this.Theme    = Theme;
		this.ColorMap = ColorMap;
		
		this.VisitedHyperlink = false;
		this.Hyperlink        = false;
		
		this.CurPos = new AscWord.CParagraphContentPos();
	};
	ParagraphContentDrawState.prototype.Reset_Range = function(Page, Line, Range, X, Y)
	{
		this.Page  = Page;
		this.Line  = Line;
		this.Range = Range;
		
		this.X = X;
		this.Y = Y;
	};
	ParagraphContentDrawState.prototype.Set_LineMetrics = function(BaseLine, Top, Bottom)
	{
		this.LineTop    = Top;
		this.LineBottom = Bottom;
		this.BaseLine   = BaseLine;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphContentDrawState = ParagraphContentDrawState;
	
})(window);

