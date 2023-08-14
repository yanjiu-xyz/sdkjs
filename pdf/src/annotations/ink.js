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
	 * Class representing a Ink annotation.
	 * @constructor
    */
    function CAnnotationInk(sName, nPage, aRect, oDoc)
    {
        AscPDF.CAnnotationBase.call(this, sName, AscPDF.ANNOTATIONS_TYPES.Ink, nPage, aRect, oDoc);

        this._point         = undefined;
        this._popupOpen     = false;
        this._popupRect     = undefined;
        this._richContents  = undefined;
        this._rotate        = undefined;
        this._state         = undefined;
        this._stateModel    = undefined;
        this._width         = 1;

        // internal
        TurnOffHistory();
        this.content        = new AscPDF.CTextBoxContent(this, oDoc);
    }
    CAnnotationInk.prototype = Object.create(AscPDF.CAnnotationBase.prototype);
	CAnnotationInk.prototype.constructor = CAnnotationInk;
    Object.defineProperties(CAnnotationInk.prototype, {
        extX: {
            get() {
                return this.GetDrawing().GraphicObj.extX;
            }
        },
        extY: {
            get() {
                return this.GetDrawing().GraphicObj.extY;
            }
        },
        transform: {
            get() {
                return this.GetDrawing().GraphicObj.transform;
            }
        },
        spPr: {
            get() {
                return this.GetDrawing().GraphicObj.spPr;
            }
        },
        rot: {
            get() {
                return this.GetDrawing().GraphicObj.rot;
            }
        },
        x: {
            get() {
                return this.GetDrawing().GraphicObj.x;
            }
        },
        y: {
            get() {
                return this.GetDrawing().GraphicObj.y;
            }
        },
        brush: {
            get() {
                return this.GetDrawing().GraphicObj.brush;
            }
        },
        pen: {
            get() {
                return this.GetDrawing().GraphicObj.pen;
            }
        },
        txXfrm: {
            get() {
                return this.GetDrawing().GraphicObj.txXfrm;
            }
        },
        flipV: {
            get() {
                return this.GetDrawing().GraphicObj.flipV;
            }
        },
        flipH: {
            get() {
                return this.GetDrawing().GraphicObj.flipH;
            }
        },

    });

    CAnnotationInk.prototype.Draw = function(oGraphics) {
        if (this.IsHidden() == true)
            return;

        let oViewer         = editor.getDocumentRenderer();
        let oGraphicsWord   = oGraphics ? oGraphics : oViewer.pagesInfo.pages[this.GetPage()].graphics.word;
        
        this.Recalculate();
        // this.DrawBackground();

        let oDrawing = this.GetDrawing();
        if (oDrawing)
            oDrawing.GraphicObj.draw(oGraphicsWord);
    };
    CAnnotationInk.prototype.DrawBackground = function() {
        let oViewer = editor.getDocumentRenderer();
        let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let oBgRGBColor = {r: 255, g: 255, b: 150};

        let aRect = this.GetRect();
        if (oBgRGBColor) {
            let nScale  = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

            let X = aRect[0] * nScale;
            let Y = aRect[1] * nScale;
            let nWidth = (aRect[2] - aRect[0]) * nScale;
            let nHeight = (aRect[3] - aRect[1]) * nScale;
            
            oGraphicsPDF.SetGlobalAlpha(1);

            oGraphicsPDF.SetFillStyle(`rgb(${oBgRGBColor.r}, ${oBgRGBColor.g}, ${oBgRGBColor.b})`);
            oGraphicsPDF.FillRect(X, Y, nWidth, nHeight);
        }
    };
    CAnnotationInk.prototype.GetDrawing = function() {
        return this.content.GetAllDrawingObjects()[0];
    };
    CAnnotationInk.prototype.Recalculate = function() {
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

        // this._formRect.X = X * g_dKoef_pix_to_mm;
        // this._formRect.Y = Y * g_dKoef_pix_to_mm;
        // this._formRect.W = nWidth * g_dKoef_pix_to_mm;
        // this._formRect.H = nHeight * g_dKoef_pix_to_mm;
        
        if (!this.contentRect)
            this.contentRect = {};

        this.contentRect.X = contentX;
        this.contentRect.Y = contentY;
        this.contentRect.W = contentXLimit - contentX;
        this.contentRect.H = contentYLimit - contentY;

        if (!this._oldContentPos)
            this._oldContentPos = {};

        this.content.X      = this._oldContentPos.X        = contentX;
        this.content.Y      = this._oldContentPos.Y        = contentY;
        this.content.XLimit = this._oldContentPos.XLimit   = contentXLimit;
        this.content.YLimit = this._oldContentPos.YLimit   = 20000;
        this.content.Recalculate_Page(0, true);
    };
    CAnnotationInk.prototype.onMouseDown = function(e) {
        let oViewer         = editor.getDocumentRenderer();
        let oDrawingObjects = oViewer.DrawingObjects;
        let oDoc            = this.GetDocument();
        let oDrDoc          = oDoc.GetDrawingDocument();

        this.selectStartPage = this.GetPage();
        let {X, Y} = oDrDoc.ConvertCoordsFromCursor2(e.clientX, e.clientY);

        oDrawingObjects.OnMouseDown(e, X, Y, oViewer.currentPage);

        if (this.IsSelected()) {
            oDrawingObjects.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        }
        else {
            oDrawingObjects.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        }

        oDrawingObjects.OnMouseDown(e, X, Y, oViewer.currentPage);
    };
    CAnnotationInk.prototype.SetInkPoints = function(aPaths) {
        let oViewer         = editor.getDocumentRenderer();
        let oDoc            = oViewer.getPDFDoc();
        let oDrawingObjects = oViewer.DrawingObjects;
        let oDrDoc          = oDoc.GetDrawingDocument();

        let nScaleY = oViewer.drawingPages[this.GetPage()].H / oViewer.file.pages[this.GetPage()].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[this.GetPage()].W / oViewer.file.pages[this.GetPage()].W / oViewer.zoom;

        let aShapes     = [];
        let aPolyLines  = [];
        for (let nPath = 0; nPath < aPaths.length; nPath++) {
            let aPath       = aPaths[nPath];
            let oPolyLine   = new AscFormat.PolyLine(oDrawingObjects, oDrawingObjects.document.theme, null, null, null, this.GetPage());

            for (let i = 0; i < aPath.length - 1; i += 2) {
                oPolyLine.addPoint(aPath[i] * g_dKoef_pix_to_mm * nScaleX, (aPath[i + 1])* g_dKoef_pix_to_mm * nScaleY);
            }

            aPolyLines.push(oPolyLine);
        }
        
        let oPolyLine = aPolyLines[0];
        var shape   = oPolyLine.getShape(true, oDrDoc);
        var drawing = new ParaDrawing(shape.spPr.xfrm.extX, shape.spPr.xfrm.extY, shape, oDrDoc, oDoc, null);
        drawing.Set_DrawingType(drawing_Anchor);
        drawing.Set_GraphicObject(shape);
        shape.setParent(drawing);
        drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        drawing.Set_Distance( 3.2,  0,  3.2, 0 );

        drawing.CheckWH();
        
        this.SetDrawing(drawing);

        shape.recalculate();
    };
    CAnnotationInk.prototype.SetStrokeColor = function(aColor) {
        this._strokeColor = aColor;

        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oRGB    = this.GetRGBColor(aColor);
            let oFill   = AscFormat.CreateSolidFillRGBA(oRGB.r, oRGB.g, oRGB.b, 255);
            let oLine   = oDrawing.GraphicObj.pen;
            oLine.setFill(oFill);
        }
    };
    CAnnotationInk.prototype.SetWidth = function(nWidth) {
        this._width = nWidth;

        nWidth = nWidth > 0 ? nWidth : 0.5;
        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oLine = oDrawing.GraphicObj.pen;
            oLine.setW(nWidth * g_dKoef_pt_to_mm * 36000.0);
        }
    };
    
    CAnnotationInk.prototype.IsSelected = function() {
        let oViewer         = editor.getDocumentRenderer();
        let oDrawingObjects = oViewer.DrawingObjects;
        return oDrawingObjects.selectedObjects.includes(this);
    };
    CAnnotationInk.prototype.SetDrawing = function(oDrawing) {
        let oRun = this.content.GetElement(0).GetElement(0);
        oRun.Add_ToContent(oRun.Content.length, oDrawing);
    };
    
    CAnnotationInk.prototype.onMouseUp = function() {
        let oViewer = editor.getDocumentRenderer();
        oViewer.onUpdateOverlay();
    };
    
    // переопределения методов CShape
    CAnnotationInk.prototype.getTransformMatrix = function() {
        return this.GetDrawing().GraphicObj.getTransformMatrix();
    };
    CAnnotationInk.prototype.canRotate = function() {
        return false; // to сделать вращение
    };
    CAnnotationInk.prototype.canEdit = function() {
        true;
    };
    CAnnotationInk.prototype.canChangeAdjustments = function() {
        return this.GetDrawing().GraphicObj.canChangeAdjustments();
    };
    CAnnotationInk.prototype.hitToAdjustment = function() {
        return this.GetDrawing().GraphicObj.hitToAdjustment();
    };
    CAnnotationInk.prototype.getObjectType = function() {
        return this.GetDrawing().GraphicObj.getObjectType();
    };
    CAnnotationInk.prototype.hitToHandles = function(x, y) {
        return this.GetDrawing().GraphicObj.hitToHandles(x, y);
    };
    CAnnotationInk.prototype.hitInBoundingRect = function() {
        return this.GetDrawing().GraphicObj.hitInBoundingRect();
    };
    CAnnotationInk.prototype.getCardDirectionByNum = function(num) {
        return this.GetDrawing().GraphicObj.getCardDirectionByNum(num);
    };
    CAnnotationInk.prototype.hitInInnerArea = function(x, y) {
        return this.GetDrawing().GraphicObj.hitInInnerArea(x, y);
    };
    CAnnotationInk.prototype.hitInPath = function(x, y) {
        return this.GetDrawing().GraphicObj.hitInPath(x, y);
    };
    CAnnotationInk.prototype.hitInTextRect = function(x, y) {
        return this.GetDrawing().GraphicObj.hitInTextRect(x, y);
    };
    CAnnotationInk.prototype.getCNvProps = function(x, y) {
        return this.GetDrawing().GraphicObj.getCNvProps(x, y);
    };
    CAnnotationInk.prototype.canResize = function() {
        return true;
    };
    CAnnotationInk.prototype.select = function(drawingObjectsController, pageIndex) {
        this.selected = true;
		this.selectStartPage = pageIndex;
		var content = this.getDocContent && this.getDocContent();
		if (content)
			content.Set_StartPage(pageIndex);
		var selected_objects;
		if (!AscCommon.isRealObject(this.group))
			selected_objects = drawingObjectsController ? drawingObjectsController.selectedObjects : [];
		else
			selected_objects = this.group.getMainGroup().selectedObjects;
		for (var i = 0; i < selected_objects.length; ++i) {
			if (selected_objects[i] === this)
				break;
		}
		if (i === selected_objects.length)
			selected_objects.push(this);


		if (drawingObjectsController) {
			drawingObjectsController.onChangeDrawingsSelection();
		}
    };
    CAnnotationInk.prototype.canMove = function() {
        return true;
    };
    CAnnotationInk.prototype.createResizeTrack = function (cardDirection, oController) {
        return new AscFormat.ResizeTrackShapeImage(this, cardDirection, oController);
    };
    CAnnotationInk.prototype.getNumByCardDirection = function (cardDirection) {
        return this.GetDrawing().GraphicObj.getNumByCardDirection(cardDirection);
    };
    CAnnotationInk.prototype.getTrackGeometry = function () {
        return this.GetDrawing().GraphicObj.getTrackGeometry();
    };
    CAnnotationInk.prototype.createMoveTrack = function() {
        return new AscFormat.MoveAnnotationTrack(this);
    };
    CAnnotationInk.prototype.getResizeCoefficients = function() {
        return this.GetDrawing().GraphicObj.getResizeCoefficients(...arguments);
    };
    CAnnotationInk.prototype.isObjectInSmartArt = function() {
        return false;
    };
    CAnnotationInk.prototype.getNoChangeAspect = function() {
        return this.GetDrawing().GraphicObj.getNoChangeAspect();
    };
    CAnnotationInk.prototype.setSpPr = function(oPr) {
        return this.GetDrawing().GraphicObj.setSpPr(oPr);
    };
    CAnnotationInk.prototype.ResetParametersWithResize = function() {
        return this.GetDrawing().GraphicObj.ResetParametersWithResize();
    };
    CAnnotationInk.prototype.checkDrawingBaseCoords = function() {
        return this.GetDrawing().GraphicObj.checkDrawingBaseCoords();
    };
    CAnnotationInk.prototype.getAspect = function() {
        return this.GetDrawing().GraphicObj.getAspect();
    };
    CAnnotationInk.prototype.createRotateTrack = function() {
        return new AscFormat.RotateTrackShapeImage(this);
    };
    CAnnotationInk.prototype.getRotateAngle = function() {
        return this.GetDrawing().GraphicObj.getRotateAngle();
    };
    CAnnotationInk.prototype.getFullFlipH = function() {
        return this.GetDrawing().GraphicObj.getFullFlipH();
    };
    CAnnotationInk.prototype.getFullFlipV = function() {
        return this.GetDrawing().GraphicObj.getFullFlipV();
    };
    CAnnotationInk.prototype.changeRot = function(angle, bWord) {
        return this.GetDrawing().GraphicObj.changeRot(angle, bWord);
    };
    

    function TurnOffHistory() {
        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();
    }

    window["AscPDF"].CAnnotationInk = CAnnotationInk;
})();

