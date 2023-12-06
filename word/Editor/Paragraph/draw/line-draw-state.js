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
	const WHITE_COLOR = new AscWord.CDocumentColor(255, 255, 255);
	const BLACK_COLOR = new AscWord.CDocumentColor(0, 0, 0);
	
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
		
		this.logicDocument = null;
		
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
		
		this.run = null;
		
		this.isFormPlaceholder = false;
		
		this.Y = 0;
		this.yOffset = 0;
		this.strikeoutY = 0;
		this.underlineY = 0;
		this.color      = null;
		
		this.form       = null;
		this.formBorder = null;
		this.combMax    = -1;
		
		this.rtl      = false;
		this.bidiFlow = new AscWord.BidiFlow(this);
	}
	
	ParagraphLineDrawState.prototype.init = function()
	{
		this.Paragraph = this.drawState.getParagraph();
		this.Graphics  = this.drawState.getGraphics();
		this.BgColor   = this.drawState.getBgColor();
		
		this.logicDocument = this.GetLogicDocument();
		if (this.logicDocument && this.logicDocument.IsDocumentEditor())
			this.UlTrailSpace = this.logicDocument.IsUnderlineTrailSpace();
	};
	ParagraphLineDrawState.prototype.resetPage = function(page)
	{
		this.Page = page;
		
		this.VisitedHyperlink = false;
		this.Hyperlink        = false;
		
		this.CurPos   = new AscWord.CParagraphContentPos();
		this.CurDepth = 0;
		
		this.ComplexFields.ResetPage(this.Paragraph, page);
	};
	ParagraphLineDrawState.prototype.resetLine = function(Line, Baseline, UnderlineOffset)
	{
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
	ParagraphLineDrawState.prototype.beginRange = function(range, x, spaces)
	{
		this.run = null;
		
		this.Range  = range;
		this.X      = x;
		this.Spaces = spaces;
		
		this.bidiFlow.begin(this.rtl)
	};
	ParagraphLineDrawState.prototype.endRange = function()
	{
		this.bidiFlow.end();
	};
	/**
	 * @param element {AscWord.CRunElementBase}
	 * @param run {AscWord.CRun}
	 * @param inRunPos {number}
	 * @param misspell {boolean}
	 */
	ParagraphLineDrawState.prototype.handleRunElement = function(element, run, inRunPos, misspell)
	{
		this.bidiFlow.add([element, run, inRunPos, misspell], element.isRtl());
	};
	ParagraphLineDrawState.prototype.handleBidiFlow = function(data)
	{
		let element  = data[0];
		let run      = data[1];
		let inRunPos = data[2];
		let misspell = data[3];
		
		this.handleRun(run);
		
		this.handleFormBorder(element, run, inRunPos);
		
		if (this.isFormPlaceholder)
		{
			this.X += element.GetWidthVisible();
			return;
		}
		

		
		this.X += element.GetWidthVisible();
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
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * @param run {AscWord.CRun}
	 */
	ParagraphLineDrawState.prototype.handleRun = function(run)
	{
		if (run === this.run)
			return;
		
		this.run = run;
		
		this.isFormPlaceholder = false;
		
		let form       = run.GetParentForm();
		let formBorder = null;
		let combMax    = -1;
		if (form)
		{
			if (form.IsFormRequired() && this.logicDocument.IsHighlightRequiredFields() && !this.Graphics.isPrintMode)
				formBorder= this.logicDocument.GetRequiredFieldsBorder();
			else if (form.GetFormPr().GetBorder())
				formBorder = form.GetFormPr().GetBorder();
			
			if (form.IsTextForm() && form.GetTextFormPr().IsComb())
				combMax = form.GetTextFormPr().GetMaxCharacters();
			
			this.isFormPlaceholder = (form.IsPlaceHolder() && this.Graphics.isPrintMode);
			
			let isForceDrawPlaceHolders = this.logicDocument.ForceDrawPlaceHolders;
			if (true === isForceDrawPlaceHolders)
				this.isFormPlaceholder = false;
			else if (false === isForceDrawPlaceHolders && form.IsPlaceHolder())
				this.isFormPlaceholder = true;
		}
		
		this.form       = form;
		this.formBorder = formBorder;
		this.combMax    = combMax;
		
		this.yOffset = run.getYOffset();
		
		let textPr = run.getCompiledPr();
		
		this.updateStrikeoutUnderlinePos(run, textPr.FontSize, textPr.VertAlign);
		this.updateColor(textPr);
		this.updateReviewState(run);
		
		
		this.isHiddenCFPart = this.ComplexFields.IsComplexFieldCode();
		
		
	};
	ParagraphLineDrawState.prototype.handleFormBorder = function(item, run, inRunPos)
	{
		let itemWidth = element.GetWidthVisible();
		if (!this.formBorder || itemWidth <= 0.001)
			return;
		
		let borderW     = this.formBorder.GetWidth();
		let borderColor = this.formBorder.GetColor();
		
		let Y = this.Y;
		let X = this.X;
		
		let formBounds = this.form.GetRangeBounds(this.Line, this.Range);
		let additional = {
			Form    : this.form,
			Comb    : nCombMax,
			Y       : formBounds.Y,
			H       : formBounds.H,
			BorderL : 0 === inRunPos
				|| item.IsSpace()
				|| (item.IsText() && !item.IsCombiningMark()),
			BorderR : run.Content.length - 1 === inRunPos
				|| item.IsSpace()
				|| (item.IsText()
					&& inRunPos < run.Content.length - 1
					&& (run.Content[inRunPos + 1].IsSpace()
						|| (run.Content[inRunPos + 1].IsText() && !run.Content[inRunPos + 1].IsCombiningMark())))
		};
		
		if (item.RGapCount)
		{
			var nGapEnd = X + itemWidth;
			aFormBorder.Add(Y, Y, X, nGapEnd - item.RGapCount * item.RGapShift,
				borderW,
				borderColor.r,
				borderColor.g,
				borderColor.b,
				additional
			);
			
			for (var nGapIndex = 0; nGapIndex < item.RGapCount; ++nGapIndex)
			{
				aFormBorder.Add(Y, Y, nGapEnd - (item.RGapCount - nGapIndex) * item.RGapShift, nGapEnd - (item.RGapCount - nGapIndex - 1) * item.RGapShift,
					borderW,
					borderColor.r,
					borderColor.g,
					borderColor.b,
					additional
				);
			}
		}
		else
		{
			aFormBorder.Add(Y, Y, X, X + itemWidth,
				borderW,
				borderColor.r,
				borderColor.g,
				borderColor.b,
				additional
			);
		}
	};
	ParagraphLineDrawState.prototype.updateStrikeoutUnderlinePos = function(run, fontSize, vertAlign)
	{
		let fontSizeMM = fontSize * g_dKoef_pt_to_mm;
		if (run.IsMathRun())
			fontSizeMM *= MatGetKoeffArgSize(fontSize, run.Compiled_ArgSz.value);
		
		let strikeoutShift = 0.27;
		if (AscCommon.vertalign_SubScript === vertAlign)
			strikeoutShift = AscCommon.vaKSize * 0.27 + AscCommon.vaKSub;
		else if (AscCommon.vertalign_SuperScript === vertAlign)
			strikeoutShift = AscCommon.vaKSize * 0.27 + AscCommon.vaKSuper;
		
		this.strikeoutY = this.Y - this.yOffset - fontSizeMM * strikeoutShift;
		this.underlineY = this.Y - this.yOffset + this.UnderlineOffset;
		
		if (AscCommon.vertalign_SubScript === vertAlign)
			this.underlineY -= AscCommon.vaKSub * fontSizeMM;
	};
	ParagraphLineDrawState.prototype.updateColor = function(textPr)
	{
		if (this.VisitedHyperlink)
		{
			AscFormat.G_O_VISITED_HLINK_COLOR.check(Theme, ColorMap);
			let RGBA = AscFormat.G_O_VISITED_HLINK_COLOR.getRGBAColor();
			this.color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
		}
		else if (textPr.Color.IsAuto() && !textPr.Unifill)
		{
			if (textPr.FontRef && textPr.FontRef.Color)
			{
				textPr.FontRef.Color.check(this.Paragraph.getTheme(), this.Paragraph.getColorMap());
				let RGBA   = textPr.FontRef.Color.RGBA;
				this.color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
			}
			else
			{
				let bgColor = this.drawState.getBgColor();
				if (textPr.Shd && !textPr.Shd.IsNil())
					bgColor = CurTextPr.Shd.GetSimpleColor(this.Paragraph.getTheme(), this.Paragraph.getColorMap());
				
				this.color = bgColor && !bgColor.isBlackAutoColor() ? WHITE_COLOR : BLACK_COLOR;
			}
		}
		else
		{
			if (this.isSlideEditor() && this.Hyperlink)
			{
				AscFormat.G_O_HLINK_COLOR.check(this.Paragraph.getTheme(), this.Paragraph.getColorMap());
				let RGBA   = AscFormat.G_O_HLINK_COLOR.getRGBAColor();
				this.color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, RGBA.A);
			}
			else if (textPr.Unifill)
			{
				textPr.Unifill.check(this.Paragraph.getTheme(), this.Paragraph.getColorMap());
				let RGBA   = textPr.Unifill.getRGBAColor();
				this.color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B);
			}
			else
			{
				this.color = textPr.Color;
			}
		}
	};
	ParagraphLineDrawState.prototype.updateReviewState = function(run)
	{
		this.addReview    = false;
		this.remReview    = false;
		this.remAddReview = false;
		
		this.reviewColor       = REVIEW_COLOR;
		this.reviewRemAddColor = REVIEW_COLOR;
		this.reviewPrColor     = REVIEW_COLOR;
		
		let reviewType = run.GetReviewType();
		if (reviewType !== reviewtype_Common)
		{
			this.addReview   = reviewtype_Add === reviewType;
			this.remReview   = reviewtype_Remove === reviewType;
			this.reviewColor = run.GetReviewColor();
			
			let prevInfo = run.GetReviewInfo().GetPrevAdded();
			if (prevInfo)
			{
				this.remAddReview = true;
				this.reviewRemAddColor = prevInfo.GetColor();
			}
		}
	};
	ParagraphLineDrawState.prototype.isSlideEditor = function()
	{
		return this.Paragraph && !this.Paragraph.bFromDocument;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphLineDrawState = ParagraphLineDrawState;
	
})(window);

