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
    CAnnotationTextMarkup.prototype.IsInQuads = function(x, y) {
        let oOverlayCtx = editor.getDocumentRenderer().overlay.m_oContext;
        let aQuads      = this.GetQuads();

        for (let i = 0; i < aQuads.length; i++) {
            let aPoints = aQuads[i];

            let oPoint1 = {
                x: aPoints[0],
                y: aPoints[1]
            }
            let oPoint2 = {
                x: aPoints[2],
                y: aPoints[3]
            }

            let oPoint3 = {
                x: aPoints[4],
                y: aPoints[5]
            }
            let oPoint4 = {
                x: aPoints[6],
                y: aPoints[7]
            }

            let X1 = oPoint1.x;
            let Y1 = oPoint1.y;
            let X2 = oPoint2.x;
            let Y2 = oPoint2.y;
            let X3 = oPoint3.x;
            let Y3 = oPoint3.y;
            let X4 = oPoint4.x;
            let Y4 = oPoint4.y;

            oOverlayCtx.beginPath();
            oOverlayCtx.moveTo(X1, Y1);
            oOverlayCtx.lineTo(X2, Y2);
            oOverlayCtx.lineTo(X4, Y4);
            oOverlayCtx.lineTo(X3, Y3);
            oOverlayCtx.closePath();

            if (oOverlayCtx.isPointInPath(x, y))
                return true;
        }

        return false;
    };
    CAnnotationTextMarkup.prototype.DrawSelected = function(overlay) {
        let oViewer     = editor.getDocumentRenderer();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom * (96 / oViewer.file.pages[this.GetPage()].Dpi);
        let aQuads      = this.GetQuads();

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

        overlay.m_oContext.lineWidth = 5;
        overlay.m_oContext.globalAlpha = 1;
        overlay.m_oContext.strokeStyle = "rgb(33, 117, 200)";

        for (let i = 0; i < aQuads.length; i++) {
            let aPoints = aQuads[i];
        
            let oPoint1 = {
                x: aPoints[0],
                y: aPoints[1]
            }
            let oPoint2 = {
                x: aPoints[2],
                y: aPoints[3]
            }

            let oPoint3 = {
                x: aPoints[4],
                y: aPoints[5]
            }
            let oPoint4 = {
                x: aPoints[6],
                y: aPoints[7]
            }

            let X1 = indLeft + oPoint1.x * nScale;
            let Y1 = indTop + oPoint1.y * nScale;
            let X2 = indLeft + oPoint2.x * nScale;
            let Y2 = indTop + oPoint2.y * nScale;
            let X3 = indLeft + oPoint3.x * nScale;
            let Y3 = indTop + oPoint3.y * nScale;
            let X4 = indLeft + oPoint4.x * nScale;
            let Y4 = indTop + oPoint4.y * nScale;

            overlay.CheckPoint1(X1, Y1);
            overlay.CheckPoint1(X2, Y2);
            overlay.CheckPoint2(X1, Y1);
            overlay.CheckPoint2(X2, Y2);
            overlay.CheckPoint1(X3, Y3);
            overlay.CheckPoint1(X4, Y4);
            overlay.CheckPoint2(X3, Y3);
            overlay.CheckPoint2(X4, Y4);

            overlay.m_oContext.beginPath();
            overlay.m_oContext.moveTo(X1, Y1);
            overlay.m_oContext.lineTo(X2, Y2);
            overlay.m_oContext.lineTo(X4, Y4);
            overlay.m_oContext.lineTo(X3, Y3);
            overlay.m_oContext.closePath();
            overlay.m_oContext.stroke();
        }

        for (let i = 0; i < aQuads.length; i++) {
            let aPoints = aQuads[i];
        
            let oPoint1 = {
                x: aPoints[0],
                y: aPoints[1]
            }
            let oPoint2 = {
                x: aPoints[2],
                y: aPoints[3]
            }

            let oPoint3 = {
                x: aPoints[4],
                y: aPoints[5]
            }
            let oPoint4 = {
                x: aPoints[6],
                y: aPoints[7]
            }

            let X1 = indLeft + oPoint1.x * nScale;
            let Y1 = indTop + oPoint1.y * nScale;
            let X2 = indLeft + oPoint2.x * nScale;
            let Y2 = indTop + oPoint2.y * nScale;
            let X3 = indLeft + oPoint3.x * nScale;
            let Y3 = indTop + oPoint3.y * nScale;
            let X4 = indLeft + oPoint4.x * nScale;
            let Y4 = indTop + oPoint4.y * nScale;

            overlay.m_oContext.save(); // Сохраняем текущее состояние контекста

            // Создаем область, которая будет служить маской
            overlay.m_oContext.beginPath();
            overlay.m_oContext.moveTo(X1, Y1);
            overlay.m_oContext.lineTo(X2, Y2);
            overlay.m_oContext.lineTo(X4, Y4);
            overlay.m_oContext.lineTo(X3, Y3);
            overlay.m_oContext.closePath();

            // Используем маску для очистки области
            overlay.m_oContext.clip();
            overlay.m_oContext.clearRect(0, 0, overlay.m_oContext.canvas.width, overlay.m_oContext.canvas.height);

            // Восстанавливаем исходное состояние контекста
            overlay.m_oContext.restore();
        }
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

    CAnnotationHighlight.prototype.Draw = function(oGraphicsPDF) {
        if (this.IsHidden() == true)
            return;

        let oRGBFill = this.GetRGBColor(this.GetStrokeColor());
        let nGrScale = oGraphicsPDF.GetScale();

        let aQuads = this.GetQuads();
        for (let i = 0; i < aQuads.length; i++) {
            let aPoints     = aQuads[i];
            let aMinRect    = getMinRect(aPoints);
            let MinX = aMinRect[0] - 1 / nGrScale;
            let MinY = aMinRect[1];
            let MaxX = aMinRect[2];
            let MaxY = aMinRect[3];

            oGraphicsPDF.context.globalCompositeOperation = "multiply";

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetGlobalAlpha(this.GetOpacity());
            oGraphicsPDF.SetFillStyle(oRGBFill.r, oRGBFill.g, oRGBFill.b);
            oGraphicsPDF.DrawClearRect(MinX, MinY, MaxX, MaxY);
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

    CAnnotationUnderline.prototype.Draw = function(oGraphicsPDF) {
        if (this.IsHidden() == true)
            return;

        let aQuads      = this.GetQuads();
        let oRGBFill    = this.GetRGBColor(this.GetStrokeColor());
        
        for (let i = 0; i < aQuads.length; i++) {
            let aPoints     = aQuads[i];
            
            oGraphicsPDF.SetStrokeStyle(oRGBFill.r, oRGBFill.g, oRGBFill.b);
            oGraphicsPDF.BeginPath();

            let oPoint1 = {
                x: aPoints[0],
                y: aPoints[1]
            }
            let oPoint2 = {
                x: aPoints[2],
                y: aPoints[3]
            }
            let oPoint3 = {
                x: aPoints[4],
                y: aPoints[5]
            }
            let oPoint4 = {
                x: aPoints[6],
                y: aPoints[7]
            }

            let X1 = oPoint3.x
            let Y1 = oPoint3.y;
            let X2 = oPoint4.x;
            let Y2 = oPoint4.y;

            oGraphicsPDF.SetLineWidth(1);
            

            let dx1 = oPoint2.x - oPoint1.x;
            let dy1 = oPoint2.y - oPoint1.y;
            let dx2 = oPoint4.x - oPoint3.x;
            let dy2 = oPoint4.y - oPoint3.y;
            let angle1          = Math.atan2(dy1, dx1);
            let angle2          = Math.atan2(dy2, dx2);
            let rotationAngle   = angle1;

            let nSide = findMaxSideWithRotation(oPoint1.x, oPoint1.y, oPoint2.x, oPoint2.y, oPoint3.x, oPoint3.y, oPoint4.x, oPoint4.y);

            oGraphicsPDF.SetLineWidth(nSide * 0.1 >> 0);
            let nLineW = oGraphicsPDF.GetLineWidth();
            
            let nIndentX = Math.sin(rotationAngle) * nLineW * 1.5;
            let nIndentY = Math.cos(rotationAngle) * nLineW * 1.5;

            oGraphicsPDF.MoveTo(X1 + nIndentX, Y1 - nIndentY);
            oGraphicsPDF.LineTo(X2 + nIndentX, Y2 - nIndentY);
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

    CAnnotationStrikeout.prototype.Draw = function(oGraphicsPDF) {
        if (this.IsHidden() == true)
            return;

        let aQuads      = this.GetQuads();
        let oRGBFill    = this.GetRGBColor(this.GetStrokeColor());
        let nGrScale    = oGraphicsPDF.GetScale();

        for (let i = 0; i < aQuads.length; i++) {
            let aPoints = aQuads[i];

            oGraphicsPDF.BeginPath();
            oGraphicsPDF.SetLineWidth(1);

            oGraphicsPDF.SetGlobalAlpha(this.GetOpacity());
            oGraphicsPDF.SetStrokeStyle(oRGBFill.r, oRGBFill.g, oRGBFill.b);

            let oPoint1 = {
                x: aPoints[0],
                y: aPoints[1]
            }
            let oPoint2 = {
                x: aPoints[2],
                y: aPoints[3]
            }
            let oPoint3 = {
                x: aPoints[4],
                y: aPoints[5]
            }
            let oPoint4 = {
                x: aPoints[6],
                y: aPoints[7]
            }

            let X1 = oPoint1.x + (oPoint3.x - oPoint1.x) / 2;
            let Y1 = oPoint1.y + (oPoint3.y - oPoint1.y) / 2;
            let X2 = oPoint2.x + (oPoint4.x - oPoint2.x) / 2;
            let Y2 = oPoint2.y + (oPoint4.y - oPoint2.y) / 2;

            let nSide = findMaxSideWithRotation(oPoint1.x, oPoint1.y, oPoint2.x, oPoint2.y, oPoint3.x, oPoint3.y, oPoint4.x, oPoint4.y);

            oGraphicsPDF.SetLineWidth(nSide * 0.1 >> 0);
            oGraphicsPDF.MoveTo(X1, Y1);
            oGraphicsPDF.LineTo(X2, Y2);
            oGraphicsPDF.Stroke();
        }
    };

    function getMinRect(aPoints) {
        let xMax = aPoints[0], yMax = aPoints[1], xMin = xMax, yMin = yMax;
        for(let i = 1; i < aPoints.length; i++) {
            if (i % 2 == 0) {
                if(aPoints[i] < xMin)
                {
                    xMin = aPoints[i];
                }
                if(aPoints[i] > xMax)
                {
                    xMax = aPoints[i];
                }
            }
            else {
                if(aPoints[i] < yMin)
                {
                    yMin = aPoints[i];
                }

                if(aPoints[i] > yMax)
                {
                    yMax = aPoints[i];
                }
            }
        }

        return [xMin, yMin, xMax, yMax];
    }

    function findMaxSideWithRotation(x1, y1, x2, y2, x3, y3, x4, y4) {
        // Найдите центр поворота
        const x_center = (x1 + x3) / 2;
        const y_center = (y1 + y3) / 2;
      
        // Найдите угол поворота
        const angle = Math.atan2(y3 - y1, x3 - x1);
      
        // Выполните поворот вершин прямоугольника на обратный угол
        const cosAngle = Math.cos(-angle);
        const sinAngle = Math.sin(-angle);
      
        const x1_rotated = cosAngle * (x1 - x_center) - sinAngle * (y1 - y_center) + x_center;
        const y1_rotated = sinAngle * (x1 - x_center) + cosAngle * (y1 - y_center) + y_center;
      
        const x2_rotated = cosAngle * (x2 - x_center) - sinAngle * (y2 - y_center) + x_center;
        const y2_rotated = sinAngle * (x2 - x_center) + cosAngle * (y2 - y_center) + y_center;
      
        const x3_rotated = cosAngle * (x3 - x_center) - sinAngle * (y3 - y_center) + x_center;
        const y3_rotated = sinAngle * (x3 - x_center) + cosAngle * (y3 - y_center) + y_center;
      
        const x4_rotated = cosAngle * (x4 - x_center) - sinAngle * (y4 - y_center) + x_center;
        const y4_rotated = sinAngle * (x4 - x_center) + cosAngle * (y4 - y_center) + y_center;
      
        // Найдите длины сторон
        const sideAB = Math.sqrt(Math.pow(x2_rotated - x1_rotated, 2) + Math.pow(y2_rotated - y1_rotated, 2));
        const sideBC = Math.sqrt(Math.pow(x3_rotated - x2_rotated, 2) + Math.pow(y3_rotated - y2_rotated, 2));
        const sideCD = Math.sqrt(Math.pow(x4_rotated - x3_rotated, 2) + Math.pow(y4_rotated - y3_rotated, 2));
        const sideDA = Math.sqrt(Math.pow(x1_rotated - x4_rotated, 2) + Math.pow(y1_rotated - y4_rotated, 2));
      
        // Найдите максимальную сторону
        const maxSide = Math.max(sideAB, sideBC, sideCD, sideDA);
      
        return maxSide;
    }

    window["AscPDF"].CAnnotationTextMarkup  = CAnnotationTextMarkup;
    window["AscPDF"].CAnnotationHighlight   = CAnnotationHighlight;
    window["AscPDF"].CAnnotationUnderline   = CAnnotationUnderline;
    window["AscPDF"].CAnnotationStrikeout   = CAnnotationStrikeout;
})();

