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

    let LINE_CAP_STYLES = {
        Butt:       0,
        Round:      1,
        Projecting: 2
    }

    let LINE_INTENT_TYPE = {
        Dimension:  0,
        Arrow:      1
    }

    let LINE_END_TYPE = {
        Square:         0,
        Circle:         1,
        Diamond:        2,
        OpenArrow:      3,
        ClosedArrow:    4,
        None:           5,
        Butt:           6,
        ROpenArrow:     7,
        RClosedArrow:   8,
        Slash:          9
    }

    let CAPTION_POSITIONING = {
        Inline: 0,
        Top:    1
    }
    /**
	 * Class representing a Ink annotation.
	 * @constructor
    */
    function CAnnotationLine(sName, nPage, aRect, oDoc)
    {
        AscPDF.CAnnotationBase.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Line, nPage, aRect, oDoc);

        this._popupOpen     = false;
        this._popupRect     = undefined;
        this._richContents  = undefined;
        this._rotate        = undefined;
        this._state         = undefined;
        this._stateModel    = undefined;
        this._width         = undefined;
        this._points        = undefined;
        this._doCaption     = undefined;
        this._intent        = undefined;
        this._lineStart     = undefined;
        this._lineEnd       = undefined;
        this._leaderLength  = undefined; // LL
        this._leaderExtend  = undefined; // LLE
        this._leaderLineOffset  = undefined; // LLO
        this._captionPos        = CAPTION_POSITIONING.Inline; // CP
        this._captionOffset     = undefined;  // CO

        // internal
        TurnOffHistory();
        this.content        = new AscPDF.CTextBoxContent(this, oDoc);
    }
    CAnnotationLine.prototype = Object.create(AscPDF.CAnnotationBase.prototype);
	CAnnotationLine.prototype.constructor = CAnnotationLine;

    CAnnotationLine.prototype.SetCaptionOffset = function(array) {
        this._captionOffset = array;
    };
    CAnnotationLine.prototype.GetCaptionOffset = function() {
        return this._captionOffset;
    };

    CAnnotationLine.prototype.SetCaptionPos = function(nPosType) {
        this._captionPos = nPosType;
    };
    CAnnotationLine.prototype.GetCaptionPos = function() {
        return this._captionPos;
    };

    CAnnotationLine.prototype.SetLeaderLineOffset = function(nValue) {
        this._leaderLineOffset = nValue;
    };
    CAnnotationLine.prototype.GetLeaderLineOffset = function() {
        return this._leaderLineOffset;
    };
    CAnnotationLine.prototype.SetLeaderLength = function(nValue) {
        this._leaderLength = nValue;
    };
    CAnnotationLine.prototype.GetLeaderLength = function() {
        return this._leaderLength;
    };
    CAnnotationLine.prototype.SetLeaderExtend = function(nValue) {
        this._leaderExtend = nValue;
    };
    CAnnotationLine.prototype.GetLeaderExtend = function() {
        return this._leaderExtend;
    };
    CAnnotationLine.prototype.SetLinePoints = function(aPoints) {
        this._points = aPoints;
        
        let oViewer         = editor.getDocumentRenderer();
        let oDoc            = oViewer.getPDFDoc();
        let oDrDoc          = oDoc.GetDrawingDocument();

        let nScaleY = oViewer.drawingPages[this.GetPage()].H / oViewer.file.pages[this.GetPage()].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[this.GetPage()].W / oViewer.file.pages[this.GetPage()].W / oViewer.zoom;

        let aLinePoints = [];
        for (let i = 0; i < aPoints.length - 1; i += 2) {
            aLinePoints.push({
                x: aPoints[i] * g_dKoef_pix_to_mm * nScaleX,
                y: (aPoints[i + 1])* g_dKoef_pix_to_mm * nScaleY
            });
        }
        
        let aShapeRectInMM = this.GetRect().map(function(measure) {
            return measure * g_dKoef_pix_to_mm;
        });
        let shape = generateShapeByPoints(aLinePoints, aShapeRectInMM, this);

        let drawing = new ParaDrawing(shape.spPr.xfrm.extX, shape.spPr.xfrm.extY, shape, oDrDoc, oDoc, null);
        drawing.Set_DrawingType(drawing_Anchor);
        drawing.Set_GraphicObject(shape);
        shape.setParent(drawing);
        drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        drawing.Set_Distance( 3.2,  0,  3.2, 0 );

        drawing.CheckWH();
        
        this.SetDrawing(drawing);
        shape.recalculate();

        let aRelPointsPos = [];

        let aAllPoints = [];
        for (let i = 0; i < aLinePoints.length; i++)
            aAllPoints = aAllPoints.concat(aLinePoints[i]);

        let aMinRect = getMinRect(aAllPoints);
        let xMin = aMinRect[0];
        let yMin = aMinRect[1];
        let xMax = aMinRect[2];
        let yMax = aMinRect[3];

        // считаем относительное положение точек внутри фигуры
        for (let nPath = 0; nPath < aLinePoints.length; nPath++) {
            let aPoints         = aLinePoints[nPath]
            let aTmpRelPoints   = [];
            
            for (let nPoint = 0; nPoint < aPoints.length; nPoint++) {
                let oPoint = aPoints[nPoint];

                let nIndX = oPoint.x - xMin;
                let nIndY = oPoint.y - yMin;

                aTmpRelPoints.push({
                    relX: nIndX / (xMax - xMin),
                    relY: nIndY / (yMax - yMin)
                });
            }
            
            aRelPointsPos.push(aTmpRelPoints);
        }
        
        this._relativePaths = aRelPointsPos;
        this._gestures = aLinePoints;
    };
    CAnnotationLine.prototype.RefillGeometry = function(oGeometry, aBounds) {
        let aRelPointsPos   = this._relativePaths;
        let aShapePaths     = [];
        
        let nLineW = this.GetWidth() * g_dKoef_pt_to_mm;

        let xMin = aBounds[0] + nLineW;
        let yMin = aBounds[1] + nLineW;
        let xMax = aBounds[2] - nLineW;
        let yMax = aBounds[3] - nLineW;

        let nWidthMM    = (xMax - xMin);
        let nHeightMM   = (yMax - yMin);

        for (let nPath = 0; nPath < aRelPointsPos.length; nPath++) {
            let aPath       = aRelPointsPos[nPath];
            let aShapePath  = [];

            for (let nPoint = 0; nPoint < aPath.length; nPoint++) {
                aShapePath.push({
                    x: (nWidthMM) * aPath[nPoint].relX + xMin,
                    y: (nHeightMM) * aPath[nPoint].relY + yMin
                });
            }
            
            aShapePaths.push(aShapePath);
        }
        
        let geometry = generateGeometry(aShapePaths, aBounds, oGeometry);
        this.GetDrawing().GraphicObj.recalcTransform()
        var transform = this.GetDrawing().GraphicObj.getTransform();
        
        geometry.Recalculate(transform.extX, transform.extY);

        return geometry;
    };
    CAnnotationLine.prototype.SetDrawing = function(oDrawing) {
        let oRun = this.content.GetElement(0).GetElement(0);
        oRun.Add_ToContent(oRun.Content.length, oDrawing);
    };
    CAnnotationLine.prototype.SetStrokeColor = function(aColor) {
        this._strokeColor = aColor;

        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oRGB    = this.GetRGBColor(aColor);
            let oFill   = AscFormat.CreateSolidFillRGBA(oRGB.r, oRGB.g, oRGB.b, 255);
            let oLine   = oDrawing.GraphicObj.pen;
            oLine.setFill(oFill);
        }
    };
    CAnnotationLine.prototype.SetOpacity = function(value) {
        this._opacity = value;
        this.SetWasChanged(true);

        let oDrawing = this.GetDrawing();
        if (oDrawing) {
           oDrawing.GraphicObj.pen.Fill.transparent = value * 100 * 2.55;
        }
    };
    CAnnotationLine.prototype.GetDrawing = function() {
        return this.content.GetAllDrawingObjects()[0];
    };
    CAnnotationLine.prototype.SetWidth = function(nWidthPt) {
        this._width = nWidthPt; 

        nWidthPt = nWidthPt > 0 ? nWidthPt : 0.5;
        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oLine = oDrawing.GraphicObj.pen;
            oLine.setW(nWidthPt * g_dKoef_pt_to_mm * 36000.0);
        }
    };
    CAnnotationLine.prototype.IsNeedDrawFromStream = function() {
        return false;
    };
    CAnnotationLine.prototype.GetLinePoints = function() {
        return this._points;
    };
    CAnnotationLine.prototype.SetDoCaption = function(nType) {
        this._doCaption = nType;
    };
    CAnnotationLine.prototype.GetDoCaption = function() {
        return this._doCaption;
    };
    CAnnotationLine.prototype.SetLineStart = function(nType) {
        this._lineStart = nType;

        this.SetWasChanged(true);
        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oLine = oDrawing.GraphicObj.pen;
            oLine.setHeadEnd(new AscFormat.EndArrow());
            let nLineEndType;
            switch (nType) {
                case LINE_END_TYPE.None:
                    nLineEndType = AscFormat.LineEndType.None;
                    break;
                case LINE_END_TYPE.OpenArrow:
                    nLineEndType = AscFormat.LineEndType.Arrow;
                    break;
                case LINE_END_TYPE.Diamond:
                    nLineEndType = AscFormat.LineEndType.Diamond;
                    break;
                case LINE_END_TYPE.Circle:
                    nLineEndType = AscFormat.LineEndType.Oval;
                    break;
                default:
                    nLineEndType = AscFormat.LineEndType.Arrow;
                    break;
            }

            oLine.headEnd.setType(nLineEndType);
            oLine.headEnd.setLen(AscFormat.LineEndSize.Mid);
        }
    };
    CAnnotationLine.prototype.SetLineEnd = function(nType) {
        this._lineEnd = nType;
        
        this.SetWasChanged(true);
        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oLine = oDrawing.GraphicObj.pen;
            oLine.setTailEnd(new AscFormat.EndArrow());
            let nLineEndType;
            switch (nType) {
                case LINE_END_TYPE.None:
                    nLineEndType = AscFormat.LineEndType.None;
                    break;
                case LINE_END_TYPE.OpenArrow:
                    nLineEndType = AscFormat.LineEndType.Arrow;
                    break;
                case LINE_END_TYPE.Diamond:
                    nLineEndType = AscFormat.LineEndType.Diamond;
                    break;
                case LINE_END_TYPE.Circle:
                    nLineEndType = AscFormat.LineEndType.Oval;
                    break;
                default:
                    nLineEndType = AscFormat.LineEndType.Arrow;
                    break;
            }

            oLine.tailEnd.setType(nLineEndType);
            oLine.tailEnd.setLen(AscFormat.LineEndSize.Mid);
        }
    };
    CAnnotationLine.prototype.GetLineStart = function() {
        return this._lineStart;
    };
    CAnnotationLine.prototype.GetLineEnd = function() {
        return this._lineEnd;
    };

    CAnnotationLine.prototype.Draw = function(oGraphicsPDF, oGraphicsWord) {
        if (this.IsHidden() == true)
            return;

        this.Recalculate();
        // this.DrawBackground();
        let aRect   = this.GetOrigRect();

        oGraphicsPDF.CheckPoint(aRect[0], aRect[1]);
        oGraphicsPDF.CheckPoint(aRect[2], aRect[3]);
        
        let oDrawing = this.GetDrawing();
        if (oDrawing)
            oDrawing.GraphicObj.draw(oGraphicsWord);
    };
    CAnnotationLine.prototype.Recalculate = function() {
        // if (this.IsNeedRecalc() == false)
        //     return;

        let oViewer = editor.getDocumentRenderer();
        let aRect   = this.GetRect();
        
        let X = aRect[0];
        let Y = aRect[1];
        let nWidth = (aRect[2] - aRect[0]);
        let nHeight = (aRect[3] - aRect[1]);

        let contentX;
        let contentY;
        let contentXLimit;
        let contentYLimit;
        
        contentX = (X) * g_dKoef_pix_to_mm;
        contentY = (Y) * g_dKoef_pix_to_mm;
        contentXLimit = (X + nWidth) * g_dKoef_pix_to_mm;
        contentYLimit = (Y + nHeight) * g_dKoef_pix_to_mm;

        if (!this.contentRect)
            this.contentRect = {};

        this.contentRect.X = contentX;
        this.contentRect.Y = contentY;
        this.contentRect.W = contentXLimit - contentX;
        this.contentRect.H = contentYLimit - contentY;

        if (!this._oldContentPos)
            this._oldContentPos = {};

        if (contentX != this._oldContentPos.X || contentY != this._oldContentPos.Y ||
            contentXLimit != this._oldContentPos.XLimit) {
            this.content.X      = this._oldContentPos.X        = contentX;
            this.content.Y      = this._oldContentPos.Y        = contentY;
            this.content.XLimit = this._oldContentPos.XLimit   = contentXLimit;
            this.content.YLimit = this._oldContentPos.YLimit   = 20000;
            this.content.Recalculate_Page(0, true);
        }
    };

    CAnnotationLine.prototype.WriteToBinary = function(memory) {
        memory.WriteByte(AscCommon.CommandType.ctAnnotField);

        let nStartPos = memory.GetCurPosition();
        memory.Skip(4);

        this.WriteToBinaryBase(memory);
        this.WriteToBinaryBase2(memory);
        
        // line points
        let aLinePoints = this.GetLinePoints();
        for (let i = 0; i < aLinePoints.length; i++) {
            memory.WriteDouble(aLinePoints[i]);
        }

        // line ending
        let nLS = this.GetLineStart();
        let nLE = this.GetLineEnd();
        if (nLE != null && nLS != null) {
            memory.annotFlags |= (1 << 15);
            memory.WriteByte(nLS);
            memory.WriteByte(nLE);
        }

        // fill
        let aFill = this.GetFillColor();
        if (aFill != null) {
            memory.annotFlags |= (1 << 16);
            memory.WriteLong(aFill.length);
            for (let i = 0; i < aFill.length; i++)
                memory.WriteDouble(aFill[i]);
        }

        // leader leader
        let nLL = this.GetLeaderLength();
        if (nLL) {
            memory.annotFlags |= (1 << 17);
            memory.WriteDouble(nLL);
        }

        // leader extend
        let nLLE = this.GetLeaderExtend();
        if (nLLE) {
            memory.annotFlags |= (1 << 18);
            memory.WriteDouble(nLLE);
        }

        // do caption
        let bDoCaption = this.GetDoCaption();
        if (bDoCaption) {
            memory.annotFlags |= (1 << 19);
        }
        
        // intent
        let nIntent = this.GetIntent();
        if (nIntent != null) {
            memory.annotFlags |= (1 << 20);
            memory.WriteDouble(nIntent);
        }

        // leader Line Offset
        let nLLO = this.GetLeaderLineOffset();
        if (nLLO != null) {
            memory.annotFlags |= (1 << 21);
            memory.WriteDouble(nLLO);
        }

        // caption positioning
        let nCP = this.GetCaptionPos();
        if (nCP != null) {
            memory.annotFlags |= (1 << 22);
            memory.WriteByte(nCP);
        }

        // caption offset
        let aCO = this.GetCaptionOffset();
        if (aCO != null) {
            memory.annotFlags |= (1 << 23);
            memory.WriteDouble(aCO[0]);
            memory.WriteDouble(aCO[1]);
        }

        let nEndPos = memory.GetCurPosition();
        memory.Seek(memory.posForFlags);
        memory.WriteLong(memory.annotFlags);
        
        memory.Seek(nStartPos);
        memory.WriteLong(nEndPos - nStartPos);
        memory.Seek(nEndPos);

        this._replies.forEach(function(reply) {
            reply.WriteToBinary(memory); 
        });
    };

    function generateShapeByPoints(arrOfArrPoints, aShapeRect) {
        let xMin = aShapeRect[0];
        let xMax = aShapeRect[2];
        let yMin = aShapeRect[1];
        let yMax = aShapeRect[3];

        let shape = new AscFormat.CShape();
        shape.setSpPr(new AscFormat.CSpPr());
        shape.spPr.setParent(shape);
        shape.spPr.setXfrm(new AscFormat.CXfrm());
        shape.spPr.xfrm.setParent(shape.spPr);
        shape.setWordShape(true);
        shape.spPr.xfrm.setOffX(0);
        shape.spPr.xfrm.setOffY(0);
        shape.spPr.xfrm.setExtX(Math.abs(xMax - xMin));
        shape.spPr.xfrm.setExtY(Math.abs(yMax - yMin));
        // shape.spPr.xfrm.setFlipV(true);
        // shape.spPr.xfrm.setFlipH(true);

        // shape.spPr.setGeometry(AscFormat.CreateGeometry("line"));
        shape.setStyle(AscFormat.CreateDefaultShapeStyle("line"));
	    
        let geometry = generateGeometry([arrOfArrPoints], [xMin, yMin, xMax, yMax]);
        shape.spPr.setGeometry(geometry);

        shape.setBDeleted(false);
        // shape.recalculate();

        shape.x = xMin;
        shape.y = yMin;
        return shape;
    }
    
    function generateGeometry(arrOfArrPoints, aBounds, oGeometry) {
        let xMin = aBounds[0];
        let yMin = aBounds[1];
        let xMax = aBounds[2];
        let yMax = aBounds[3];
        // let xMin = Math.min(arrOfArrPoints[0][0].x, arrOfArrPoints[0][1].x);
        // let yMin = Math.min(arrOfArrPoints[0][0].y, arrOfArrPoints[0][1].y);
        // let xMax = Math.max(arrOfArrPoints[0][0].x, arrOfArrPoints[0][1].x);
        // let yMax = Math.max(arrOfArrPoints[0][0].y, arrOfArrPoints[0][1].y);

        let geometry = oGeometry ? oGeometry : new AscFormat.Geometry();
        if (oGeometry) {
            oGeometry.pathLst = [];
        }

        for (let nPath = 0; nPath < arrOfArrPoints.length; nPath++) {
            let bClosed     = false;
            let aPoints     = arrOfArrPoints[nPath];
            let min_dist    = editor.WordControl.m_oDrawingDocument.GetMMPerDot(3);
            let oLastPoint  = aPoints[aPoints.length-1];
            let nLastIndex  = aPoints.length-1;
            if(oLastPoint.bTemporary) {
                nLastIndex--;
            }
            if(nLastIndex > 1)
            {
                let dx = aPoints[0].x - aPoints[nLastIndex].x;
                let dy = aPoints[0].y - aPoints[nLastIndex].y;
                if(Math.sqrt(dx*dx +dy*dy) < min_dist)
                {
                    bClosed = true;
                }
            }
            let nMaxPtIdx = bClosed ? (nLastIndex - 1) : nLastIndex;

            let w = xMax - xMin, h = yMax-yMin;
            let kw, kh, pathW, pathH;
            if(w > 0)
            {
                pathW = 43200;
                kw = 43200/ w;
            }
            else
            {
                pathW = 0;
                kw = 0;
            }
            if(h > 0)
            {
                pathH = 43200;
                kh = 43200 / h;
            }
            else
            {
                pathH = 0;
                kh = 0;
            }
            geometry.AddPathCommand(0, undefined, bClosed ? "norm": "none", undefined, pathW, pathH);
            geometry.AddRect("l", "t", "r", "b");
            geometry.AddPathCommand(1, (((aPoints[0].x - xMin) * kw) >> 0) + "", (((aPoints[0].y - yMin) * kh) >> 0) + "");
            let i = 1;
            let aRanges = [[0, aPoints.length - 1]];
            let aRange, nRange;
            let nEnd;
            let nPtsCount = aPoints.length;
            let oPt1, oPt2, oPt3, nPt;
            for(nRange = 0; nRange < aRanges.length; ++nRange)
            {
                aRange = aRanges[nRange];
                if(aRange[0] + 1 > nMaxPtIdx) {
                    break;
                }
                nPt = aRange[0] + 1;
                nEnd = Math.min(aRange[1], nMaxPtIdx);
                while(nPt <= nEnd)
                {
                    if(nPt + 2 <= nEnd)
                    {
                        //cubic bezier curve
                        oPt1 = aPoints[nPt++];
                        oPt2 = aPoints[nPt++];
                        oPt3 = aPoints[nPt++];
                        geometry.AddPathCommand(5,
                            (((oPt1.x - xMin) * kw) >> 0) + "", (((oPt1.y - yMin) * kh) >> 0) + "",
                            (((oPt2.x - xMin) * kw) >> 0) + "", (((oPt2.y - yMin) * kh) >> 0) + "",
                            (((oPt3.x - xMin) * kw) >> 0) + "", (((oPt3.y - yMin) * kh) >> 0) + ""
                        );
                    }
                    else if(nPt + 1 <= nEnd)
                    {
                        //quad bezier curve
                        oPt1 = aPoints[nPt++];
                        oPt2 = aPoints[nPt++];
                        geometry.AddPathCommand(4,
                            (((oPt1.x - xMin) * kw) >> 0) + "", (((oPt1.y - yMin) * kh) >> 0) + "",
                            (((oPt2.x - xMin) * kw) >> 0) + "", (((oPt2.y - yMin) * kh) >> 0) + ""
                        );
                    }
                    else
                    {
                        //lineTo
                        oPt1 = aPoints[nPt++];
                        geometry.AddPathCommand(2,
                            (((oPt1.x - xMin) * kw) >> 0) + "", (((oPt1.y - yMin) * kh) >> 0) + ""
                        );
                    }
                }
            }
            if(bClosed)
            {
                geometry.AddPathCommand(6);
            }
        }
        

        return geometry;
    }

    function getMinRect(aPoints) {
        let xMax = aPoints[0].x, yMax = aPoints[0].y, xMin = xMax, yMin = yMax;
        for(let i = 1; i < aPoints.length; i++)
        {
            if(aPoints[i].x > xMax)
            {
                xMax = aPoints[i].x;
            }
            if(aPoints[i].y > yMax)
            {
                yMax = aPoints[i].y;
            }

            if(aPoints[i].x < xMin)
            {
                xMin = aPoints[i].x;
            }

            if(aPoints[i].y < yMin)
            {
                yMin = aPoints[i].y;
            }
        }

        return [xMin, yMin, xMax, yMax];
    }

    function TurnOffHistory() {
        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();
    }

    window["AscPDF"].CAnnotationLine = CAnnotationLine;
})();

