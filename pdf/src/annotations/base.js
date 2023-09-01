/*
 * (c) Copyright Ascensio System SIA 2010-2019
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

(function(){

    let ANNOTATIONS_TYPES = {
        Text:           0,
        Link:           1,
        FreeText:       2,
        Line:           3,
        Square:         4,
        Circle:         5,
        Polygon:        6,
        PolyLine:       7,
        Highlight:      8,
        Underline:      9,
        Squiggly:       10,
        Strikeout:      11,
        Stamp:          12,
        Caret:          13,
        Ink:            14,
        Popup:          15,
        FileAttachment: 16,
        Sound:          17,
        Movie:          18,
        Widget:         19,
        Screen:         20,
        PrinterMark:    21,
        TrapNet:        22,
        Watermark:      23,
        Type3D:         24,
        Redact:         25
    }
    
	/**
	 * Class representing a base annotation.
	 * @constructor
    */
    function CAnnotationBase(sName, nType, nPage, aRect, oDoc)
    {
        this.type = nType;

        this._author                = undefined;
        this._borderEffectIntensity = undefined;
        this._borderEffectStyle     = undefined;
        this._contents              = undefined;
        this._creationDate          = undefined;
        this._delay                 = false; // пока не используется
        this._doc                   = oDoc;
        this._hidden                = undefined;
        this._inReplyTo             = undefined;
        this._intent                = undefined;
        this._lock                  = undefined;
        this._modDate               = undefined;
        this._name                  = sName;
        this._noView                = undefined;
        this._opacity               = 1;
        this._page                  = nPage;
        this._print                 = undefined;
        this._rect                  = aRect;
        this._readOnly              = undefined;
        this._refType               = undefined;
        this._seqNum                = undefined;
        this._strokeColor           = undefined;
        this._style                 = undefined;
        this._subject               = undefined;
        this._toggleNoView          = undefined;

        
        // internal
        this._id = AscCommon.g_oIdCounter.Get_NewId();
    }
    CAnnotationBase.prototype.GetName = function() {
        return this._name;
    };
    CAnnotationBase.prototype.SetPosition = function(x, y) {
        let oViewer = editor.getDocumentRenderer();
        let oDoc    = this.GetDocument();
        let nPage = this.GetPage();

        oDoc.History.Add(new CChangesPDFAnnotPos(this, [this._rect[0], this._rect[1]], [x, y]));

        let nScaleY = oViewer.drawingPages[nPage].H / oViewer.file.pages[nPage].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[nPage].W / oViewer.file.pages[nPage].W / oViewer.zoom;

        let nWidth  = this._pagePos.w;
        let nHeight = this._pagePos.h;

        this._rect[0] = x;
        this._rect[1] = y;
        this._rect[2] = x + nWidth;
        this._rect[3] = y + nHeight;
        
        this._origRect[0] = this._rect[0] / nScaleX;
        this._origRect[1] = this._rect[1] / nScaleY;
        this._origRect[2] = this._rect[2] / nScaleX;
        this._origRect[3] = this._rect[3] / nScaleY;

        this._pagePos = {
            x: this._rect[0],
            y: this._rect[1],
            w: (this._rect[2] - this._rect[0]),
            h: (this._rect[3] - this._rect[1])
        };

        this.AddToRedraw();
    };
    CAnnotationBase.prototype.IsHighlight = function() {
        return false;
    };
    CAnnotationBase.prototype.IsTextMarkup = function() {
        return false;
    };
    CAnnotationBase.prototype.IsComment = function() {
        return false;
    };
    CAnnotationBase.prototype.IsInk = function() {
        return false;
    };
    
    CAnnotationBase.prototype.SetRect = function(aRect) {
        let oViewer = editor.getDocumentRenderer();
        let nPage = this.GetPage();

        if (this.IsInDocument() == false || oDoc.History.UndoRedoInProgress) {
            oDoc.CreateNewHistoryPoint();
            oDoc.History.Add(new CChangesPDFAnnotRect(this, this.GetRect(), aRect));
            oDoc.TurnOffHistory();
        }

        let nScaleY = oViewer.drawingPages[nPage].H / oViewer.file.pages[nPage].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[nPage].W / oViewer.file.pages[nPage].W / oViewer.zoom;

        this._rect = aRect;

        this._pagePos = {
            x: aRect[0],
            y: aRect[1],
            w: (aRect[2] - aRect[0]),
            h: (aRect[3] - aRect[1])
        };

        this._origRect[0] = this._rect[0] / nScaleX;
        this._origRect[1] = this._rect[1] / nScaleY;
        this._origRect[2] = this._rect[2] / nScaleX;
        this._origRect[3] = this._rect[3] / nScaleY;
    };
    CAnnotationBase.prototype.IsInDocument = function() {
        if (this.GetDocument().annots.indexOf(this) == -1)
            return false;

        return true;
    };
    
    CAnnotationBase.prototype.GetRect = function() {
        return this._rect;
    };
    CAnnotationBase.prototype.GetId = function() {
        return this._id;
    };
    CAnnotationBase.prototype.Get_Id = function() {
        return this.GetId();
    };
    CAnnotationBase.prototype.GetType = function() {
        return this.type;
    };
    CAnnotationBase.prototype.SetPage = function(nPage) {
        this._page = nPage;
        this.selectStartPage = nPage;
    };
    CAnnotationBase.prototype.GetPage = function() {
        return this._page;
    };
    CAnnotationBase.prototype.GetDocument = function() {
        return this._doc;
    };
    CAnnotationBase.prototype.IsHidden = function() {
        return this._hidden;
    };
    CAnnotationBase.prototype.SetHidden = function(bHidden) {
        this._hidden = bHidden;
    };
    CAnnotationBase.prototype.onMouseUp = function() {
        let oViewer = editor.getDocumentRenderer();
        // oViewer.onUpdateOverlay();
        let {X, Y} = AscPDF.GetGlobalCoordsByPageCoords(this._pagePos.x + this._pagePos.w, this._pagePos.y + this._pagePos.h / 2, this.GetPage(), true);
        editor.sync_ShowComment([this.GetId()], X, Y)
    };
    CAnnotationBase.prototype._AddReplyOnOpen = function(oReplyInfo) {
        let oReply = new AscPDF.CAnnotationText(oReplyInfo["UniqueName"], this.GetPage(), [], this.GetDocument());

        oReply.SetContents(oReplyInfo["Contents"]);
        oReply.SetModDate((new Date().getTime()).toString());
        oReply.SetAuthor(oReplyInfo["User"]);
        oReply.SetHidden(false);

        this._contents._replies.push(oReply);
    };
    CAnnotationBase.prototype._OnAfterSetContents = function() {
        let oAscCommData = this._contents.GetAscCommentData();
        editor.sendEvent("asc_onAddComment", this.GetId(), oAscCommData);
    };
    CAnnotationBase.prototype.SetContents = function(contents) {
        if (this.GetContents() == contents)
            return;

        let oViewer         = editor.getDocumentRenderer();
        let oDoc            = this.GetDocument();
        let oCurContents    = this.GetContents();
        let oNewContents;

        if (typeof(contents) == "string") {
            let oTextAnnot = new AscPDF.CAnnotationText(this.GetName(), this.GetPage(), [], this.GetDocument());
        
            oTextAnnot.SetContents(contents);
            oTextAnnot.SetModDate((new Date().getTime()).toString());
            oTextAnnot.SetAuthor(this.GetAuthor());
            oTextAnnot.SetHidden(false);

            this._contents  = oTextAnnot;
            oNewContents    = oTextAnnot;
        }
        else {
            oNewContents    = contents;
            this._contents  = contents;
            
            if (contents)
                this._OnAfterSetContents();
        }

        if (oDoc.History.UndoRedoInProgress == false && oViewer.IsOpenAnnotsInProgress == false) {
            oDoc.CreateNewHistoryPoint();
            oDoc.History.Add(new CChangesPDFAnnotContents(this, oCurContents, oNewContents));
            oDoc.TurnOffHistory();
        }
        
        if (oNewContents == null)
            editor.sync_RemoveComment(this.GetId());
    };
    CAnnotationBase.prototype.AddReply = function(CommentData) {
        this._contents.AddReply(CommentData);
    };
    CAnnotationBase.prototype.GetAscCommentData = function() {
        if (this._contents)
            return this._contents.GetAscCommentData();

        return null;
    };
    CAnnotationBase.prototype.EditCommentData = function(CommentData) {
        if (this._contents)
            this._contents.EditCommentData(CommentData);
    };
    CAnnotationBase.prototype.GetContents = function() {
        return this._contents;
    };
    CAnnotationBase.prototype.SetModDate = function(sDate) {
        this._modDate = sDate;
    };
    CAnnotationBase.prototype.GetModDate = function() {
        return this._modDate;
    };
    CAnnotationBase.prototype.SetCreationDate = function(sDate) {
        this._creationDate = sDate;
    };
    CAnnotationBase.prototype.GetCreationDate = function() {
        return this._creationDate;
    };
    
    CAnnotationBase.prototype.SetAuthor = function(sAuthor) {
        this._author = sAuthor;
    };
    CAnnotationBase.prototype.GetAuthor = function() {
        return this._author;
    };
    CAnnotationBase.prototype.IsAnnot = function() {
        return true;
    };
    CAnnotationBase.prototype.SetApIdx = function(nIdx) {
        this._apIdx = nIdx;
    };
    CAnnotationBase.prototype.AddToRedraw = function() {
        let oViewer = editor.getDocumentRenderer();
        if (oViewer.pagesInfo.pages[this.GetPage()])
            oViewer.pagesInfo.pages[this.GetPage()].needRedrawAnnots = true;
    };
    /**
	 * Gets rgb color object from internal color array.
	 * @memberof CAnnotationBase
	 * @typeofeditors ["PDF"]
     * @returns {object}
	 */
    CAnnotationBase.prototype.GetRGBColor = function(aInternalColor) {
        let oColor = {};

        if (aInternalColor.length == 1) {
            oColor = {
                r: aInternalColor[0] * 255,
                g: aInternalColor[0] * 255,
                b: aInternalColor[0] * 255
            }
        }
        else if (aInternalColor.length == 3) {
            oColor = {
                r: aInternalColor[0] * 255,
                g: aInternalColor[1] * 255,
                b: aInternalColor[2] * 255
            }
        }
        else if (aInternalColor.length == 4) {
            function cmykToRgb(c, m, y, k) {
                return {
                    r: Math.round(255 * (1 - c) * (1 - k)),
                    g: Math.round(255 * (1 - m) * (1 - k)),
                    b: Math.round(255 * (1 - y) * (1 - k))
                }
            }

            oColor = cmykToRgb(aInternalColor[0], aInternalColor[1], aInternalColor[2], aInternalColor[3]);
        }

        return oColor;
    };
    CAnnotationBase.prototype.onMouseDown = function() {
        return;
    };
    
    CAnnotationBase.prototype.SetStrokeColor = function(aColor) {
        this._strokeColor = aColor;
    };
    CAnnotationBase.prototype.GetStrokeColor = function() {
        return this._strokeColor;
    };

    // аналоги методов Drawings
    CAnnotationBase.prototype.getObjectType = function() {
        return -1;
    };
    CAnnotationBase.prototype.hitInTextRect = function() {
        let oViewer = editor.getDocumentRenderer();

        if (oViewer.getPageAnnotByMouse() == this)
            return true;

        return false;
    };

    // // заглушки для трекинга
    // CAnnotationBase.prototype.canChangeAdjustments = function() {
    //     return true;
    // };
    // CAnnotationBase.prototype.hitToAdjustment = function () {
    //     return {hit: false, adjPolarFlag: null, adjNum: null, warp: false};
    // };
    // CAnnotationBase.prototype.getObjectType = function() {
    //     return -1;
    // };

    function ConvertPt2Px(pt) {
        return (96 / 72) * pt;
    }
    function ConvertPx2Pt(px) {
        return px / (96 / 72);
    }
	window["AscPDF"].CAnnotationBase    = CAnnotationBase;
	window["AscPDF"].ANNOTATIONS_TYPES  = ANNOTATIONS_TYPES;
	window["AscPDF"].ConvertPt2Px       = ConvertPt2Px;
	window["AscPDF"].ConvertPx2Pt       = ConvertPx2Pt;

})();

