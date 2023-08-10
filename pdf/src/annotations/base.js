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
        Caret:          0,
        Circle:         1,
        FileAttachment: 2,
        FreeText:       3,
        Highlight:      4,
        Ink:            5,
        Line:           6,
        Polygon:        7,
        PolyLine:       8,
        Redact:         9,
        Sound:          10,
        Square:         11,
        Squiggly:       12,
        Stamp:          13,
        StrikeOut:      14,
        Text:           15,
        Underline:      16
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
        this._opacity               = undefined;
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
    
    CAnnotationBase.prototype.SetPosition = function(x, y) {
        let oViewer = editor.getDocumentRenderer();
        let nPage = this.GetPage();

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
    };
    CAnnotationBase.prototype.SetRect = function(aRect) {
        let oViewer = editor.getDocumentRenderer();
        let nPage = this.GetPage();

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
    CAnnotationBase.prototype.SetContents = function(sText) {
        this._contents = sText;
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
    CAnnotationBase.prototype.SetAuthor = function(sAuthor) {
        this._author = sAuthor;
    };
    CAnnotationBase.prototype.GetAuthor = function() {
        return this._author;
    };
    CAnnotationBase.prototype.IsAnnot = function() {
        return true;
    };
    CAnnotationBase.prototype.AddToRedraw = function() {
        let oViewer = editor.getDocumentRenderer();
        if (oViewer.pagesInfo.pages[this.GetPage()])
            oViewer.pagesInfo.pages[this.GetPage()].needRedrawAnnots = true;
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
	window["AscPDF"].CAnnotationBase    = CAnnotationBase;
	window["AscPDF"].ANNOTATIONS_TYPES  = ANNOTATIONS_TYPES;
})();

