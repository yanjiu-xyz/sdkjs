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
	 * Class for calculating the current position of the cursor
	 * @param {AscWord.Paragraph} paragraph
	 * @constructor
	 */
	function ParagraphPositionCalculator(paragraph)
	{
		this.paragraph = paragraph
		
		this.page = 0;
		this.line = 0;
		this.range = 0;
		
		this.x = 0;
		this.y = 0;
		
		this.mathY = -1;
		
		this.bidi = new AscWord.BidiFlow(this);
		this.rtl  = false;
		
		this.posInfo = {
			x : 0,
			y : 0,
			run : null
		};
	}
	ParagraphPositionCalculator.prototype.reset = function(page, line, range)
	{
		this.page  = page;
		this.line  = line;
		this.range = range;
		
		let p = this.paragraph;
		
		this.x = p.Lines[line].Ranges[range].XVisible;
		this.y = p.Pages[page].Y + p.Lines[line].Y;
		
		if (p.Numbering.checkRange(range, line))
			this.x += p.Numbering.WidthVisible;
		
		this.bidi.begin();
	};
	ParagraphPositionCalculator.prototype.handleRunElement = function(element, run, isCurrent, isNearFootnoteRef)
	{
		if (para_Drawing === element.Type && !element.IsInline())
			return;
		
		this.bidi.add([element, run, isCurrent, isNearFootnoteRef], element.getBidiType());
	};
	ParagraphPositionCalculator.prototype.handleBidiFlow = function(data)
	{
		let element   = data[0];
		let run       = data[1];
		let isCurrent = data[2];
		
		let w = element.GetWidthVisible();
		if (isCurrent)
		{
			this.posInfo.x = this.x;
			this.posInfo.y = this.y;
			
			if (element.getBidiType() === AscWord.BidiType.rtl)
				this.posInfo.x += w;
			
			this.posInfo.run = run;
		}
		
		this.x += w;

		// TODO: Position in form
		// if (Pos === this.Content.length)
		// {
		// 	var Item = this.Content[Pos - 1];
		// 	if (Item.RGap)
		// 	{
		// 		if (Item.RGapCount)
		// 		{
		// 			X -= Item.RGapCount * Item.RGapShift - (Item.RGapShift - Item.RGapCharWidth) / 2;
		// 		}
		// 		else
		// 		{
		// 			X -= Item.RGap;
		// 		}
		// 	}
		// }
		// else if (this.Content[Pos].LGap)
		// {
		// 	X += this.Content[Pos].LGap;
		// }
	};
	ParagraphPositionCalculator.prototype.handleMathRun = function(run, currentPos)
	{
		this.bidi.end();
		this.bidi.begin(this.rtl);
		
		if (-1 === currentPos)
			return;
		
		let paraMathLocation = run.ParaMath.GetLinePosition(this.line, this.range);
		
		this.x = paraMathLocation.x;
		this.y = paraMathLocation.y;
		
		let mathY = this.y;
		let elementLocation = run.Content[currentPos].GetLocationOfLetter();
		this.x += elementLocation.x;
		this.y += elementLocation.y;
		
		// TODO: Пометить данное место, как текущее
		this.posInfo.x     = this.x;
		this.posInfo.y     = this.y;
		this.posInfo.mathY = mathY;
		
	};
	ParagraphPositionCalculator.prototype.getXY = function()
	{
		this.bidi.end();
		return {x : this.posInfo.x, y : this.posInfo.y};
	};
	ParagraphPositionCalculator.prototype.getTargetXY = function()
	{
		this.bidi.end();
		let run = this.posInfo.run;
		if (!run)
			return {x : this.posInfo.x, y : this.posInfo.y, h : 0};
		
		let textPr = run.getCompiledPr();
		let isNearFootnoteRef = run.IsCurPosNearFootEndnoteReference();
		
		let fontCoef = isNearFootnoteRef ? 1 : textPr.getFontCoef();
		AscCommon.g_oTextMeasurer.SetTextPr(textPr, this.paragraph.getTheme());
		AscCommon.g_oTextMeasurer.SetFontSlot(AscWord.fontslot_ASCII, fontCoef);
		
		let textHeight = AscCommon.g_oTextMeasurer.GetHeight();
		let descent    = Math.abs(AscCommon.g_oTextMeasurer.GetDescender());
		let ascent     = textHeight - descent;
		
		let y = this.posInfo.y - ascent - run.getYOffset();
		if (!isNearFootnoteRef)
		{
			if (AscCommon.vertalign_SubScript === textPr.VertAlign)
				y -= textPr.FontSize * g_dKoef_pt_to_mm * AscCommon.vaKSub;
			else if (AscCommon.vertalign_SuperScript === textPr.VertAlign)
				y -= textPr.FontSize * g_dKoef_pt_to_mm * AscCommon.vaKSuper;
		}
		
		return {x : this.posInfo.x, y : y, h : textHeight};
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphPositionCalculator = ParagraphPositionCalculator;
	
})(window);


