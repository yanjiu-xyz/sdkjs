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

    /**
	 * Class representing a base highlight annotation.
	 * @constructor
    */
    function CAnnotationTextMarkup(sName, nType, nPage, aRect, oDoc)
    {
        AscPDF.CAnnotationBase.call(this, sName, nType, nPage, aRect, oDoc);

        this._quads         = undefined;
        this._richContents  = undefined;
        this._rotate        = undefined;
        this._width         = undefined;
    }
    CAnnotationTextMarkup.prototype = Object.create(AscPDF.CAnnotationBase.prototype);
	CAnnotationTextMarkup.prototype.constructor = CAnnotationTextMarkup;

    CAnnotationTextMarkup.prototype.SetQuads = function(aQuads) {
        this._quads = aQuads;
    };
    CAnnotationTextMarkup.prototype.GetQuads = function() {
        return this._quads;
    };
    CAnnotationTextMarkup.prototype.SetWidth = function(nWidth) {
        this._width = nWidth;
    };
    CAnnotationTextMarkup.prototype.GetWidth = function() {
        return this._width;
    }; 
    CAnnotationTextMarkup.prototype.SetOpacity = function(value) {
        this._opacity = value;
    };
    CAnnotationTextMarkup.prototype.GetOpacity = function() {
        return this._opacity;
    };
    CAnnotationTextMarkup.prototype.IsTextMarkup = function() {
        return true;
    };
    CAnnotationTextMarkup.prototype.DrawSelected = function(overlay) {
        let oViewer     = editor.getDocumentRenderer();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let aRect       = this.GetRect();

        let X       = aRect[0] * nScale;
        let Y       = aRect[1] * nScale;
        let nWidth  = (aRect[2] - aRect[0]) * nScale;
        let nHeight = (aRect[3] - aRect[1]) * nScale;

        let xCenter = oViewer.width >> 1;
        if (oViewer.documentWidth > oViewer.width)
		{
			xCenter = (oViewer.documentWidth >> 1) - (oViewer.scrollX) >> 0;
		}
		let yPos    = oViewer.scrollY >> 0;
        let page    = oViewer.drawingPages[this.GetPage()];
        let w       = (page.W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let h       = (page.H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let indLeft = ((xCenter * AscCommon.AscBrowser.retinaPixelRatio) >> 0) - (w >> 1);
        let indTop  = ((page.Y - yPos) * AscCommon.AscBrowser.retinaPixelRatio) >> 0;


        overlay.m_oContext.beginPath();
        overlay.AddRect(X + indLeft, Y + indTop, nWidth, nHeight);
        overlay.m_oContext.lineWidth = 3;
        overlay.m_oContext.globalAlpha = 1;
        overlay.m_oContext.strokeStyle = "rgb(33, 117, 200)";
        overlay.m_oContext.closePath();
        overlay.m_oContext.stroke();

    };

    /**
	 * Class representing a highlight annotation.
	 * @constructor
    */
    function CAnnotationHighlight(sName, nPage, aRect, oDoc)
    {
        CAnnotationTextMarkup.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Ink, nPage, aRect, oDoc);
    }
    CAnnotationHighlight.prototype = Object.create(CAnnotationTextMarkup.prototype);
	CAnnotationHighlight.prototype.constructor = CAnnotationHighlight;

    CAnnotationHighlight.prototype.IsHighlight = function() {
        return true;
    };

    CAnnotationHighlight.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer         = editor.getDocumentRenderer();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom * (96 / oViewer.file.pages[this.GetPage()].Dpi);
        let oRGBFill        = this.GetRGBColor(this.GetStrokeColor());

        let aScaledQuads = this.GetQuads().map(function(measure) {
            return measure * nScale;
        });

        for (let i = 0; i < aScaledQuads.length; i+=8) {
            let aXMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 == 0)
                    return measure;
            });
            let aYMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 != 0)
                    return measure;
            });

            let MinX = Math.min(...aXMeasures);
            let MaxX = Math.max(...aXMeasures);
            let MinY = Math.min(...aYMeasures);
            let MaxY = Math.max(...aYMeasures);

            
            oGraphicsPDF.context.globalCompositeOperation = "multiply";

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetGlobalAlpha(this.GetOpacity());
            oGraphicsPDF.MoveTo(MinX - 1, MinY);
            oGraphicsPDF.LineTo(MaxX, MinY);
            oGraphicsPDF.LineTo(MaxX, MaxY);
            oGraphicsPDF.LineTo(MinX - 1, MaxY);
            oGraphicsPDF.ClosePath();
            oGraphicsPDF.SetFillStyle(`rgb(${oRGBFill.r}, ${oRGBFill.g}, ${oRGBFill.b})`);
            oGraphicsPDF.Fill();

            oGraphicsPDF.context.globalCompositeOperation = "source-over";
        }
    };
    CAnnotationHighlight.prototype.AddToRedraw = function() {
        let oViewer = editor.getDocumentRenderer();
        if (oViewer.pagesInfo.pages[this.GetPage()])
            oViewer.pagesInfo.pages[this.GetPage()].needRedrawHighlights = true;
    };
    
    /**
	 * Class representing a highlight annotation.
	 * @constructor
    */
    function CAnnotationUnderline(sName, nPage, aRect, oDoc)
    {
        CAnnotationTextMarkup.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Ink, nPage, aRect, oDoc);
    }
    CAnnotationUnderline.prototype = Object.create(CAnnotationTextMarkup.prototype);
	CAnnotationUnderline.prototype.constructor = CAnnotationUnderline;

    CAnnotationUnderline.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer         = editor.getDocumentRenderer();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom * (96 / oViewer.file.pages[this.GetPage()].Dpi);

        let aScaledQuads = this.GetQuads().map(function(measure) {
            return measure * nScale;
        });
        let oRGBFill = this.GetRGBColor(this.GetStrokeColor());
    
        for (let i = 0; i < aScaledQuads.length; i+=8) {
            let aXMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 == 0)
                    return measure;
            });
            let aYMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 != 0)
                    return measure;
            });

            let MinX = Math.min(...aXMeasures);
            let MaxX = Math.max(...aXMeasures);
            let MinY = Math.min(...aYMeasures);
            let MaxY = Math.max(...aYMeasures);

            let nLineW = nScale;

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetLineWidth(nLineW);
            oGraphicsPDF.SetGlobalAlpha(this.GetOpacity());
            oGraphicsPDF.MoveTo(MinX - 1, MaxY - nLineW * 1.5);
            oGraphicsPDF.LineTo(MaxX - 1, MaxY - nLineW * 1.5);
            oGraphicsPDF.ClosePath();
            oGraphicsPDF.SetStrokeStyle(`rgb(${oRGBFill.r}, ${oRGBFill.g}, ${oRGBFill.b})`);
            oGraphicsPDF.Stroke();
        }
    };

    /**
	 * Class representing a highlight annotation.
	 * @constructor
    */
    function CAnnotationStrikeout(sName, nPage, aRect, oDoc)
    {
        CAnnotationTextMarkup.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Ink, nPage, aRect, oDoc);
    }
    CAnnotationStrikeout.prototype = Object.create(CAnnotationTextMarkup.prototype);
	CAnnotationStrikeout.prototype.constructor = CAnnotationStrikeout;

    CAnnotationStrikeout.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer         = editor.getDocumentRenderer();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom * (96 / oViewer.file.pages[this.GetPage()].Dpi);

        let aScaledQuads = this.GetQuads().map(function(measure) {
            return measure * nScale;
        });
        let oRGBFill = this.GetRGBColor(this.GetStrokeColor());
    
        for (let i = 0; i < aScaledQuads.length; i+=8) {
            let aXMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 == 0)
                    return measure;
            });
            let aYMeasures = aScaledQuads.slice(i, i+8).filter(function(measure, index) {
                if (index % 2 != 0)
                    return measure;
            });
            
            let MinX = Math.min(...aXMeasures);
            let MaxX = Math.max(...aXMeasures);
            let MinY = Math.min(...aYMeasures);
            let MaxY = Math.max(...aYMeasures);

            let nLineW =  nScale;

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetLineWidth(nLineW);
            oGraphicsPDF.SetGlobalAlpha(this.GetOpacity());
            oGraphicsPDF.MoveTo(MinX - 1, MinY + (MaxY - MinY) / 2 + nLineW / 2);
            oGraphicsPDF.LineTo(MaxX - 1, MinY + (MaxY - MinY) / 2 + nLineW / 2);
            oGraphicsPDF.ClosePath();
            oGraphicsPDF.SetStrokeStyle(`rgb(${oRGBFill.r}, ${oRGBFill.g}, ${oRGBFill.b})`);
            oGraphicsPDF.Stroke();
        }
    };


    window["AscPDF"].CAnnotationTextMarkup  = CAnnotationTextMarkup;
    window["AscPDF"].CAnnotationHighlight   = CAnnotationHighlight;
    window["AscPDF"].CAnnotationUnderline   = CAnnotationUnderline;
    window["AscPDF"].CAnnotationStrikeout   = CAnnotationStrikeout;
})();

