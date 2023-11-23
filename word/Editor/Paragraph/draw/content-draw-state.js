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
	 * Class for storing the current draw state of paragraph content (text, images)
	 * @param {AscWord.ParagraphDrawState} drawState - reference to the main state
	 * @constructor
	 */
	function ParagraphContentDrawState(drawState)
	{
		this.drawState = drawState;
		
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
		
		this.rtl = false;
		
		this.LineTop    = 0;
		this.LineBottom = 0;
		this.BaseLine   = 0;
		
		this.ComplexFields = new CParagraphComplexFieldsInfo();
		
		// TODO:
		this.yOffset        = 0;
		this.textPr         = null;
		this.reviewColor    = null;
		this.themeColor     = null; // aka RGBA
		this.autoColor      = null;
		this.reviewType     = reviewtype_Common;
		this.isHiddenCFPart = false;
		this.tempY          = 0;
		
		// for Math
		this.mathTextInfo = null; // InfoMathText
		this.paraMath     = null;
		
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
	/**
	 * @param element {AscWord.CRunElementBase}
	 */
	ParagraphContentDrawState.prototype.handleRunElement = function(element)
	{
		switch (element.Type)
		{
			case para_Text:
				this.handleText(element);
				break;
			case para_Drawing:
				this.handleDrawing(element);
				break;
			case para_End:
				this.handleParagraphMark(element);
				break;
			case para_Math_Ampersand:
			case para_Math_Text:
			case para_Math_BreakOperator:
			case para_Math_Placeholder:
				this.handleMathElement(element);
				break;
			case para_FieldChar:
				this.handleFieldChar(element);
				break;
			default:
				this.handleRegularElement(element);
				break;
		}
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @param textPr {AscWord.CTextPr}
	 */
	ParagraphContentDrawState.prototype.updateGraphicsState = function(textPr)
	{
		this.textPr = textPr;
		
		this.Graphics.SetTextPr(this.textPr, this.Theme);
		
		let color = this.getTextColor();
		this.Graphics.b_color1(color.r, color.g, color.b, 255);
		this.Graphics.p_color(color.r, color.g, color.b, 255);
	};
	ParagraphContentDrawState.prototype.getTextColor = function()
	{
		if (reviewtype_Add === this.reviewType || reviewtype_Remove === this.reviewType)
			return this.reviewColor;
		else if (this.themeColor)
			return this.themeColor;
		else if (this.textPr.Color.IsAuto())
			return this.autoColor;
		
		return this.textPr.Color;
	};
	/**
	 * @param text {AscWord.CRunText}
	 */
	ParagraphContentDrawState.prototype.handleText = function(text)
	{
		text.Draw(this.X, this.Y - this.yOffset, this.Graphics, this, this.textPr);
		this.X += text.GetWidthVisible();
	};
	/**
	 * @param drawing {ParaDrawing}
	 */
	ParagraphContentDrawState.prototype.handleDrawing = function(drawing)
	{
		if (!drawing.IsInline())
			return;
		
		drawing.Draw(this.X, this.Y - this.yOffset, this.Graphics, this, this.textPr);
		this.X += drawing.GetWidthVisible();
		
		// Внутри отрисовки инлайн-автофигур могут изменится цвета и шрифт, поэтому восстанавливаем настройки
		this.updateGraphicsState();
	};
	/**
	 * @param element {AscWord.CRunElementBase}
	 */
	ParagraphContentDrawState.prototype.handleRegularElement = function(element)
	{
		element.Draw(this.X, this.Y - this.yOffset, this.Graphics, this, this.textPr);
		this.X += element.GetWidthVisible();
		
		if (element.IsTab())
			this.updateGraphicsState();
	};
	/**
	 * @param paraMark {AscWord.CRunParagraphMark}
	 */
	ParagraphContentDrawState.prototype.handleParagraphMark = function(paraMark)
	{
		if (this.Paragraph.IsInFixedForm())
			return;
		
		let sectPr = this.Paragraph.Get_SectionPr();
		let logicDocument = this.Paragraph.GetLogicDocument();
		if (!logicDocument)
			return;
		
		if (logicDocument !== this.Paragraph.GetParent())
			sectPr = undefined;
		
		let editor = logicDocument.GetApi();
		if ((!editor || !editor.ShowParaMarks) && (sectPr || reviewtype_Common === this.reviewType))
			return;
		
		let y = this.Y;
		if (!sectPr)
		{
			let endTextPr = true !== this.Graphics.m_bIsTextDrawer ? this.Paragraph.GetParaEndCompiledPr() : this.textPr;
			this.updateGraphicsState(endTextPr);
			
			y = this.tempY;
			switch (endTextPr.VertAlign)
			{
				case AscCommon.vertalign_SubScript:
				{
					Y -= AscCommon.vaKSub * endTextPr.FontSize * g_dKoef_pt_to_mm;
					break;
				}
				case AscCommon.vertalign_SuperScript:
				{
					Y -= AscCommon.vaKSuper * endTextPr.FontSize * g_dKoef_pt_to_mm;
					break;
				}
			}
		}
		
		paraMark.Draw(this.X, y - this.yOffset, this.Graphics);
		this.X += paraMark.GetWidth();
	};
	/**
	 * @param element {CMathText | CMathAmp}
	 */
	ParagraphContentDrawState.prototype.handleMathElement = function(element)
	{
		if (para_Math_Placeholder === element.Type && this.Graphics.RENDERER_PDF_FLAG)
			return;
		
		let linePos = this.paraMath.GetLinePosition(this.Line, this.Range);
		element.Draw(linePos.x, linePos.y, this.Graphics, this.mathTextInfo);
		this.X += element.GetWidthVisible();
	};
	/**
	 * @param fieldChar {ParaFieldChar}
	 */
	ParagraphContentDrawState.prototype.handleFieldChar = function(fieldChar)
	{
		this.ComplexFields.ProcessFieldChar(fieldChar);
		this.isHiddenCFPart = this.ComplexFields.IsComplexFieldCode();
		
		if (!fieldChar.IsNumValue())
			return;
		
		// Draw the auto-calculated pageNum in the header/footer
		let complexField = fieldChar.GetComplexField();
		
		// We can't use textPr of the current run, since the properties of the actual text
		// may be different
		let textPr = complexField.GetFieldValueTextPr();
		this.updateGraphicsState(textPr);
		
		
		// OldVariant:
		
		// var oParent = this.GetParent();
		// var nRunPos = this.private_GetPosInParent(oParent);
		//
		// // Заглушка на случай, когда настройки текущего рана не совпадают с настройками рана, где расположен текст
		// if (Pos >= this.Content.length - 1 && oParent && oParent.Content[nRunPos + 1] instanceof ParaRun)
		// {
		// 	var oNumPr = oParent.Content[nRunPos + 1].Get_CompiledPr(false);
		//
		// 	pGraphics.SetTextPr(oNumPr, PDSE.Theme);
		// 	if (oNumPr.Unifill)
		// 	{
		// 		oNumPr.Unifill.check(PDSE.Theme, PDSE.ColorMap);
		// 		RGBA = oNumPr.Unifill.getRGBAColor();
		// 		pGraphics.b_color1(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
		// 	}
		// 	else
		// 	{
		// 		if (true === oNumPr.Color.Auto)
		// 			pGraphics.b_color1(AutoColor.r, AutoColor.g, AutoColor.b, 255);
		// 		else
		// 			pGraphics.b_color1(oNumPr.Color.r, oNumPr.Color.g, oNumPr.Color.b, 255);
		// 	}
		// }
		
		this.handleRegularElement(element);
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphContentDrawState = ParagraphContentDrawState;
	
})(window);

