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
	 * Class for storing the current draw state of paragraph highlight (text/paragraph/field/etc. background)
	 * @param {AscWord.ParagraphDrawState} drawState
	 * @constructor
	 */
	function ParagraphHighlightDrawState(drawState)
	{
		this.drawState = drawState;
		
		this.Page   = 0;
		this.Line   = 0;
		this.Range  = 0;
		
		this.CurPos = new AscWord.CParagraphContentPos();
		
		this.DrawColl     = false;
		this.DrawMMFields = false;
		
		this.High     = new CParaDrawingRangeLines();
		this.Coll     = new CParaDrawingRangeLines();
		this.Find     = new CParaDrawingRangeLines();
		this.Comm     = new CParaDrawingRangeLines();
		this.Shd      = new CParaDrawingRangeLines();
		this.MMFields = new CParaDrawingRangeLines();
		this.CFields  = new CParaDrawingRangeLines();
		this.HyperCF  = new CParaDrawingRangeLines();
		
		this.DrawComments       = true;
		this.DrawSolvedComments = true;
		this.Comments           = [];
		this.CommentsFlag       = AscCommon.comments_NoComment;
		
		this.SearchCounter = 0;
		
		this.Paragraph = undefined;
		this.Graphics  = undefined;
		
		this.X  = 0;
		this.Y0 = 0;
		this.Y1 = 0;
		
		this.Spaces = 0;
		
		this.InlineSdt = [];
		this.CollectFixedForms = false;
		
		this.ComplexFields = new CParagraphComplexFieldsInfo();
		
		this.rtl = false;
		this.bidiFlow = new AscWord.BidiFlow(this);
	}
	ParagraphHighlightDrawState.prototype.init = function(paragraph, graphics)
	{
		this.Paragraph = paragraph;
		this.Graphics  = graphics;
	};
	ParagraphHighlightDrawState.prototype.Reset = function(DrawColl, DrawFind, DrawComments, DrawMMFields, PageEndInfo, DrawSolvedComments)
	{
		this.DrawColl     = DrawColl;
		this.DrawFind     = DrawFind;
		this.DrawMMFields = DrawMMFields;
		
		this.CurPos = new AscWord.CParagraphContentPos();
		
		this.SearchCounter = 0;
		
		this.DrawComments       = DrawComments;
		this.DrawSolvedComments = DrawSolvedComments;
		
		this.Comments = [];
		if (null !== PageEndInfo)
		{
			for (var nIndex = 0, nCount = PageEndInfo.Comments.length; nIndex < nCount; ++nIndex)
			{
				this.AddComment(PageEndInfo.Comments[nIndex]);
			}
		}
		
		if (Paragraph.LogicDocument)
			this.Check_CommentsFlag();
	};
	ParagraphHighlightDrawState.prototype.beginRange = function(range, X, spaceCount)
	{
		this.X = X;
		this.checkNumbering();
		
		this.Spaces = spaceCount;
		this.bidiFlow.begin(this.rtl);
	};
	ParagraphHighlightDrawState.prototype.endRange = function()
	{
		this.bidiFlow.end();
	}
	ParagraphHighlightDrawState.prototype.Reset_Range = function(Page, Line, Range, X, Y0, Y1, SpacesCount)
	{
		this.Page  = Page;
		this.Line  = Line;
		this.Range = Range;
		
		this.High.Clear();
		this.Coll.Clear();
		this.Find.Clear();
		this.Comm.Clear();
		this.Shd.Clear();
		this.MMFields.Clear();
		this.CFields.Clear();
		this.HyperCF.Clear();
		
		this.X  = X;
		this.Y0 = Y0;
		this.Y1 = Y1;
		
		this.Spaces = SpacesCount;
		
		this.InlineSdt = [];
	};
	ParagraphHighlightDrawState.prototype.AddInlineSdt = function(oSdt)
	{
		this.InlineSdt.push(oSdt);
	};
	ParagraphHighlightDrawState.prototype.AddComment = function(Id)
	{
		if (!this.DrawComments)
			return;
		
		var oComment = AscCommon.g_oTableId.Get_ById(Id);
		if (!oComment || (!this.DrawSolvedComments && oComment.IsSolved()) || !AscCommon.UserInfoParser.canViewComment(oComment.GetUserName()))
			return;
		
		this.Comments.push(Id);
		this.Check_CommentsFlag();
	};
	ParagraphHighlightDrawState.prototype.RemoveComment = function(Id)
	{
		if (!this.DrawComments)
			return;
		
		var oComment = AscCommon.g_oTableId.Get_ById(Id);
		if (!oComment || (!this.DrawSolvedComments && oComment.IsSolved()) || !AscCommon.UserInfoParser.canViewComment(oComment.GetUserName()))
			return;
		
		for (var nIndex = 0, nCount = this.Comments.length; nIndex < nCount; ++nIndex)
		{
			if (this.Comments[nIndex] === Id)
			{
				this.Comments.splice(nIndex, 1);
				break;
			}
		}
		
		this.Check_CommentsFlag();
	};
	ParagraphHighlightDrawState.prototype.Check_CommentsFlag = function()
	{
		let logicDocument = this.Paragraph.LogicDocument;
		if (!logicDocument || !logicDocument.IsDocumentEditor())
			return;
		
		// Проверяем флаг
		var Para             = this.Paragraph;
		var DocumentComments = Para.LogicDocument.Comments;
		var CurComment       = DocumentComments.Get_CurrentId();
		var CommLen          = this.Comments.length;
		
		// Сначала проверим есть ли вообще комментарии
		this.CommentsFlag = ( CommLen > 0 ? AscCommon.comments_NonActiveComment : AscCommon.comments_NoComment );
		
		// Проверим является ли какой-либо комментарий активным
		for (var CurPos = 0; CurPos < CommLen; CurPos++)
		{
			if (CurComment === this.Comments[CurPos])
			{
				this.CommentsFlag = AscCommon.comments_ActiveComment;
				break
			}
		}
	};
	ParagraphHighlightDrawState.prototype.Save_Coll = function()
	{
		var Coll  = this.Coll;
		this.Coll = new CParaDrawingRangeLines();
		return Coll;
	};
	ParagraphHighlightDrawState.prototype.Save_Comm = function()
	{
		var Comm  = this.Comm;
		this.Comm = new CParaDrawingRangeLines();
		return Comm;
	};
	ParagraphHighlightDrawState.prototype.Load_Coll = function(Coll)
	{
		this.Coll = Coll;
	};
	ParagraphHighlightDrawState.prototype.Load_Comm = function(Comm)
	{
		this.Comm = Comm;
	};
	ParagraphHighlightDrawState.prototype.IsCollectFixedForms = function()
	{
		return this.CollectFixedForms;
	};
	ParagraphHighlightDrawState.prototype.SetCollectFixedForms = function(isCollect)
	{
		this.CollectFixedForms = isCollect;
	};
	ParagraphHighlightDrawState.prototype.handleRunElement = function(element, run)
	{
	
	};
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Private area
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	ParagraphHighlightDrawState.prototype.checkNumbering = function()
	{
		let paraNumbering = this.Paragraph.Numbering;
		if (!paraNumbering.checkRange(this.Range, this.Line))
			return;
		
		let x = this.X;
		this.X += paraNumbering.WidthVisible;
		
		let numPr = this.drawState.getParagraphCompiledPr().ParaPr.NumPr;
		let paraParent = this.Paragraph.GetParent();

		if (para_Numbering !== paraNumbering.Type
			|| !numPr
			|| !numrPr.IsValid()
			|| !paraParent
			|| !paraParent.IsEmptyParagraphAfterTableInTableCell(this.Paragraph.GetIndex()))
			return;
		
		let numManager = paraParent.GetNumbering();
		let numLvl     = numManager.GetNum(numPr.NumId).GetLvl(numPr.Lvl);
		let numJc      = numLvl.GetJc();
		let numTextPr  = this.Paragraph.GetNumberingTextPr();
		
		if (AscCommon.align_Right === numJc)
			x -= paraNumbering.WidthNum;
		else if (AscCommon.align_Center === numJc)
			x -= paraNumbering.WidthNum / 2;
		
		if (highlight_None !== numTextPr.HighLight)
			this.High.Add(this.Y0, this.Y1, x, x + paraNumbering.WidthNum + paraNumbering.WidthSuff, 0, numTextPr.HighLight.r, numTextPr.HighLight.g, numTextPr.HighLight.b, undefined, numTextPr);
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphHighlightDrawState = ParagraphHighlightDrawState;
	
})(window);

