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
	const FLAG_HIGHLIGHT     = 0x0001;
	const FLAG_COLLABORATION = 0x0002;
	const FLAG_SEARCH        = 0x0004;
	const FLAG_COMMENT       = 0x0008;
	const FLAG_SHD           = 0x0010;
	const FLAG_MAILMERGE     = 0x0020;
	const FLAG_COMPLEX_FIELD = 0x0040;
	const FLAG_HYPERLINK_CF  = 0x0080;
	
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
		this.commentCounter     = 0;
		this.haveCurrentComment = false;
		this.currentCommentId   = null;
		this.comments           = []; // current list of comments
		this.runComments        = []; // comments we use for a particular run
		
		this.hyperlinkObject    = null;

		this.Comments           = [];
		this.CommentsFlag       = AscCommon.comments_NoComment;
		
		this.searchCounter = 0;
		
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
		
		this.run = null;
	}
	ParagraphHighlightDrawState.prototype.init = function(paragraph, graphics)
	{
		this.Paragraph = paragraph;
		this.Graphics  = graphics;
		
		let logicDocument = paragraph.GetLogicDocument();
		let commentManager = logicDocument && logicDocument.IsDocumentEditor() ? logicDocument.GetCommentsManager() : null;
		
		this.DrawColl           = undefined !== graphics.RENDERER_PDF_FLAG;
		this.DrawSearch         = logicDocument && logicDocument.IsDocumentEditor() && logicDocument.SearchEngine.Selection;
		this.DrawComments       = commentManager && commentManager.isUse();
		this.DrawSolvedComments = commentManager && commentManager.isUseSolved();
		this.DrawMMFields       = logicDocument && logicDocument.IsDocumentEditor() && logicDocument.isHighlightMailMergeFields();
		this.currentCommentId   = commentManager ? commentManager.getCurrentCommentId() : -1;
	};
	ParagraphHighlightDrawState.prototype.resetPage = function(page)
	{
		this.Page = page;
		
		this.CurPos = new AscWord.CParagraphContentPos();
		
		this.searchCounter = 0;
		
		this.commentCounter     = 0;
		this.haveCurrentComment = false;
		
		let pageEndInfo = this.Paragraph.GetEndInfoByPage(page - 1);
		if (pageEndInfo)
		{
			for (let index = 0, count = pageEndInfo.Comments.length; index < count; ++index)
			{
				this.addComment(pageEndInfo.Comments[index]);
			}
		}
		this.ComplexFields.ResetPage(this.Paragraph, page);
	};
	ParagraphHighlightDrawState.prototype.resetLine = function(line, top, bottom)
	{
		this.Line = line;
		this.Y0   = top;
		this.Y1   = bottom;
	};
	ParagraphHighlightDrawState.prototype.beginRange = function(range, X, spaceCount)
	{
		this.Range = range;
		this.X = X;
		this.checkNumbering();
		
		this.Spaces = spaceCount;
		this.bidiFlow.begin(this.rtl);
		
		this.InlineSdt = [];
		
		this.High.Clear();
		this.Coll.Clear();
		this.Find.Clear();
		this.Comm.Clear();
		this.Shd.Clear();
		this.MMFields.Clear();
		this.CFields.Clear();
		this.HyperCF.Clear();
		
		this.run = null;
	};
	ParagraphHighlightDrawState.prototype.endRange = function()
	{
		this.bidiFlow.end();
	}
	ParagraphHighlightDrawState.prototype.AddInlineSdt = function(oSdt)
	{
		this.InlineSdt.push(oSdt);
	};
	ParagraphHighlightDrawState.prototype.addComment = function(commentId)
	{
		let comment = this.getComment(commentId);
		if (!comment)
			return;
		
		if (commentId === this.currentCommentId)
			this.haveCurrentComment = true;
		
		this.comments.push(comment);
	};
	ParagraphHighlightDrawState.prototype.removeComment = function(commentId)
	{
		let comment = this.getComment(commentId);
		if (!comment)
			return;
		
		if (commentId === this.currentCommentId)
			this.haveCurrentComment = false;
		
		let index = this.comments.indexOf(comment);
		if (-1 !== index)
			this.comments.splice(index, 1);
	};
	ParagraphHighlightDrawState.prototype.increaseSearchCounter = function()
	{
		++this.searchCounter;
	};
	ParagraphHighlightDrawState.prototype.decreaseSearchCounter = function()
	{
		--this.searchCounter;
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
		if ((this.ComplexFields.IsHiddenFieldContent() || this.ComplexFields.IsComplexFieldCode())
			&& para_End !== element.Type
			&& para_FieldChar !== element.Type)
			return;
		
		this.bidiFlow.add([element, run, this.searchCounter > 0], element.getBidiType());
	};
	ParagraphHighlightDrawState.prototype.handleBidiFlow = function(data)
	{
		let element  = data[0];
		let run      = data[1];
		let isSearch = data[2];
		
		this.handleRun(run);
		
		

			

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
	/**
	 * @param {string} commentId
	 * @returns {CComment}
	 */
	ParagraphHighlightDrawState.prototype.getComment = function(commentId)
	{
		if (!this.DrawComments)
			return null;
		
		let comment = AscCommon.g_oTableId.GetById(commentId);
		if (comment
			&& (this.DrawSolvedComments || !comment.IsSolved())
			&& AscCommon.UserInfoParser.canViewComment(comment.GetUserName()))
			return comment;
		
		return null;
	};
	/**
	 * @param {AscWord.CRun} run
	 */
	ParagraphHighlightDrawState.prototype.handleRun = function(run)
	{
		if (this.run === run)
			return;
		
		this.run = run;
		
		// TODO: Comments
		this.runComments = this.comments.slice();
		
		// TODO: highlight
		this.highlight = highlight_None;
		
		// TODO:
		this.collaborationColor = null;

	};
	/**
	 *
	 */
	ParagraphHighlightDrawState.prototype.addHighlight = function(startX, endX, flags)
	{
		let startY = this.Y0;
		let endY   = this.Y1;
		
		let hyperlink = this.getHyperlinkObject();
		if (hyperlink)
			this.HyperCF.Add(startY, endY, startX, endX, 0, 0, 0, 0, {HyperlinkCF : hyperlink});
		
		if ((flags & FLAG_COMMENT) && this.comments.length > 0)
			this.Comm.Add(startY, endY, startX, endX, 0, 0, 0, 0, {Active : this.haveCurrentComment, CommentId : this.runComments});
		else if ((flags & FLAG_COMMENT) && (highlight_None !== this.highlight))
			this.High.Add(startY, endY, startX, endX, 0, this.highlight.r, this.highlight.g, this.highlight.b, undefined, this.highlight);
		
		if (flags & FLAG_SEARCH)
			aFind.Add(startY, endY, startX, endX, 0, 0, 0, 0);
		else if ((flags & FLAG_COLLABORATION) && this.collaborationColor)
			aColl.Add(startY, endY, startX, endX, 0, this.collaborationColor.r, this.collaborationColor.g, this.collaborationColor.b);
	};
	ParagraphHighlightDrawState.prototype.pushHyperlink = function(hyperlink)
	{
		this.hyperlinkObject.push(hyperlink)
	};
	ParagraphHighlightDrawState.prototype.popHyperlink = function()
	{
		if (!this.hyperlinkObject.length)
			return;
		
		--this.hyperlinkObject.length;
	};
	ParagraphHighlightDrawState.prototype.getHyperlinkObject = function()
	{
		if (this.hyperlinkObject.length)
			return this.hyperlinkObject[this.hyperlinkObject.length - 1];
		
		let complexField = null;
		if (this.ComplexFields.IsComplexField() && (complexField = this.ComplexFields.GetREForHYPERLINK()))
			return complexField.GetInstruction();
		
		return null;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphHighlightDrawState = ParagraphHighlightDrawState;
	
})(window);

