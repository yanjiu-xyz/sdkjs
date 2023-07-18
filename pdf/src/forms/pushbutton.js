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
        
    // api objects
    let position    = AscPDF.Api.Objects.position;
    let scaleWhen   = AscPDF.Api.Objects.scaleWhen;
    let scaleHow    = AscPDF.Api.Objects.scaleHow;
    let highlight   = AscPDF.Api.Objects.highlight;

    // internal types
    let BUTTON_HIGHLIGHT_TYPES = {
        none:       0,
        invert:     1,
        outline:    2,
        push:       3
    }

    /**
	 * Class representing a button field.
	 * @constructor
     * @extends {CBaseField}
	 */
    function CPushButtonField(sName, nPage, aRect, oDoc)
    {
        AscPDF.CBaseField.call(this, sName, AscPDF.FIELD_TYPES.button, nPage, aRect, oDoc);

        this._buttonAlignX      = 0.5; // must be integer
        this._buttonAlignY      = 0.5; // must be integer
        this._buttonFitBounds   = false;
        this._buttonPosition    = position["textOnly"];
        this._buttonScaleHow    = scaleHow["proportional"];
        this._buttonScaleWhen   = scaleWhen["always"];
        this._highlight         = BUTTON_HIGHLIGHT_TYPES.invert;
        this._textFont          = "ArialMT";

        this._buttonCaption     = undefined;
        this._downCaption       = undefined;
        this._rollOverCaption   = undefined;

        this._buttonPressed = false;

        this._images = {
            normal:    undefined,
            mouseDown: undefined,
            rollover:  undefined
        }

        // internal
        TurnOffHistory();
		this.content = new AscPDF.CTextBoxContent(this, oDoc);
		this.content.SetAlign(AscPDF.ALIGN_TYPE.center);

        this._captionRun            = null;
        this._downCaptionRun        = null;
        this._rollOverCaptionRun    = null; 
    }
    CPushButtonField.prototype = Object.create(AscPDF.CBaseField.prototype);
    CPushButtonField.prototype.constructor = CPushButtonField;
    CPushButtonField.prototype.AddImage = function(oImgData, nAPType) {
        if (!oImgData) {
            return;
        }
        const oHTMLImg = oImgData.Image;
        if (!oHTMLImg || oHTMLImg.width === 0 || oHTMLImg.height === 0) {
            return;
        }

        let oDoc = this.GetDocument();
        let aFields = editor.getDocumentRenderer().IsOpenFormsInProgress == false ? oDoc.GetFields(this.GetFullName()) : [this];

        aFields.forEach(function(field) {
            if (field._buttonPosition == position["textOnly"])
                return;

            if (nAPType == AscPDF.APPEARANCE_TYPE.rollover) {
                field._images.rollover = oImgData.src;
                return;
            }
            else if (nAPType == AscPDF.APPEARANCE_TYPE.mouseDown) {
                field._images.mouseDown = oImgData.src;
                return;
            }
            else
                field._images.normal = oImgData.src;

            let oExistDrawing = field.GetDrawing();
            if (oExistDrawing) {
                oExistDrawing.PreDelete();
                var oParentRun = oExistDrawing.GetRun();
                oParentRun.RemoveElement(oExistDrawing);

                let oFirstRun = field.content.GetElement(0).GetElement(0);
                let oRunElm = oFirstRun.GetElement(oFirstRun.GetElementsCount() - 1);
                // удаляем таб
                if (oRunElm && true ==  oRunElm.IsTab()) {
                    oFirstRun.RemoveFromContent(oFirstRun.GetElementsCount() - 1, 1);
                }
            }
            
            const dImgW = Math.max((oHTMLImg.width * AscCommon.g_dKoef_pix_to_mm), 1);
            const dImgH = Math.max((oHTMLImg.height * AscCommon.g_dKoef_pix_to_mm), 1);
            const oRect = field.getFormRelRect();
            let nContentWidth;
            switch (field._buttonPosition) {
                case position["iconTextH"]:
                case position["textIconH"]:
                    nContentWidth = field.content.GetElement(0).GetContentWidthInRange();
                    break;
                default:
                    nContentWidth = 0;
                    break;
            }

            
            const dFrmW = oRect.W;
            const dFrmH = oRect.H;
            const dCW   = (dFrmW - nContentWidth)/dImgW;
            const dCH   = dFrmH/dImgH;
            const dCoef = Math.min(dCW, dCH);
            let dDrawingW;
            let dDrawingH;

            let nScaleWhen = field.GetScaleWhen();
            switch (nScaleWhen) {
                case scaleWhen["always"]: {
                    dDrawingW = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                    dDrawingH = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                    break;
                }
                    
                case scaleWhen["never"]: {
                    dDrawingW = dImgW;
                    dDrawingH = dImgH;
                    break;
                }
                    
                case scaleWhen["tooBig"]: {
                    if (dFrmW < dImgW || dFrmH < dImgH) {
                        dDrawingW = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                        dDrawingH = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                    }
                    else {
                        dDrawingW = dImgW;
                        dDrawingH = dImgH;
                    }
                    break;
                }

                case scaleWhen["tooSmall"]: {
                    if (dImgW < dFrmW) {
                        dDrawingW = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgW : dCW * dImgW;
                        dDrawingH = field.GetScaleHow() == scaleHow["proportional"] ? dCoef*dImgH : dCH * dImgH;
                    }
                    else {
                        dDrawingW = dImgW;
                        dDrawingH = dImgH;
                    }
                    break;
                }
            }

            const oDrawing  = new AscCommonWord.ParaDrawing(dDrawingW, dDrawingH, null, field.content.DrawingDocument, field.content, null);
            oDrawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
            oDrawing.Set_DrawingType(drawing_Inline);
            
            let oShapeTrack = new AscFormat.NewShapeTrack("rect", 0, 0, field.content.Get_Theme(), null, null, null, 0);
            oShapeTrack.track({}, dDrawingW, dDrawingH);
            let oShape = oShapeTrack.getShape(true, field.content.DrawingDocument, null);
            oShape.setParent(oDrawing);
            oDrawing.Set_GraphicObject(oShape);
            var oBodyPr = new AscFormat.CBodyPr();
            oBodyPr.setAnchor(1);
            oShape.setBodyPr(oBodyPr);
            
            let oFill   = new AscFormat.CUniFill();
            oFill.fill  = new AscFormat.CBlipFill();
            oFill.fill.setRasterImageId(oImgData.src);
            oFill.fill.tile     = null;
            oFill.fill.srcRect  = null;
            oFill.fill.stretch  = true;
            oFill.convertToPPTXMods();
            oShape.setFill(oFill);

            oShape.spPr.setLn(new AscFormat.CreateNoFillLine());

            let oRunForImg;
            let nContentH = field.content.Get_EmptyHeight();
            let oTargetPara;
            switch (field._buttonPosition) {
                case position["iconOnly"]:
                    oRunForImg = field.content.GetElement(0).GetElement(0);
                    break;
                case position["iconTextV"]:
                    oRunForImg = field.content.GetElement(0).GetElement(0);
                    break;
                case position["textIconV"]:
                    oRunForImg = field.content.GetElement(1).GetElement(0);
                    break;
                case position["iconTextH"]:
                    oTargetPara = field.content.GetElement(0);
                    if (oTargetPara.GetElementsCount() == 1) {
                        let oRun = new ParaRun(oTargetPara, false);
                        oTargetPara.Add_ToContent(oTargetPara.Content.length - 1, oRun);
                    }

                    oRunForImg = oTargetPara.GetElement(0);
                    oRunForImg.Pr.Position = -(dDrawingH / 2 - nContentH / 4);
                    oRunForImg.RecalcInfo.TextPr = true;
                    oRunForImg.Get_CompiledPr();
                    break;
                case position["textIconH"]:
                    oTargetPara = field.content.GetElement(0);
                    if (oTargetPara.GetElementsCount() == 1) {
                        let oRun = new ParaRun(oTargetPara, false);
                        oTargetPara.Add_ToContent(oTargetPara.Content.length - 1, oRun);
                    }

                    oRunForImg = oTargetPara.GetElement(1);
                    oRunForImg.Pr.Position = -(dDrawingH / 2 - nContentH / 4);
                    oRunForImg.RecalcInfo.TextPr = true;
                    oRunForImg.Get_CompiledPr();
                    break;
                case position["overlay"]:
                    oTargetPara = field.content.GetElement(0);
                    oRunForImg = oTargetPara.GetElement(0);
                    oRunForImg.ClearContent();

                    if (field._buttonCaption) {
                        let oCaptionRun = oTargetPara.GetElement(1);
                        if (oCaptionRun && oCaptionRun.IsParaEndRun() == false) {
                            oCaptionRun.ClearContent();
                        }
                        else {
                            oCaptionRun = new ParaRun(oTargetPara, false);
                            oTargetPara.Add_ToContent(oTargetPara.Content.length - 1, oCaptionRun);
                        }

                        oCaptionRun.AddText(field._buttonCaption);
                        field._captionRun = oCaptionRun;
                    }

                    oDrawing.Set_DrawingType(drawing_Anchor);
                    oDrawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                    oDrawing.Set_BehindDoc(true);
                    break;
            }

            let nPosX = -(dDrawingW - dFrmW) * field._buttonAlignX;
            let nPosY = (dDrawingH - dFrmH) * (field._buttonAlignY - 1);
            oDrawing.Set_PositionH(Asc.c_oAscRelativeFromH.Column, Asc.c_oAscXAlign.Outside, nPosX, false);
            oDrawing.Set_PositionV(Asc.c_oAscRelativeFromH.Page, Asc.c_oAscXAlign.Outside, nPosY, false);

            oRunForImg.Add_ToContent(oRunForImg.Content.length, oDrawing);
            oDrawing.Set_Parent(oRunForImg);
            oShape.recalculate();
        });
        
        
        if (editor.getDocumentRenderer().IsOpenFormsInProgress == false) {
            aFields.forEach(function(field) {
                field.SetNeedRecalc(true);
                field.SetWasChanged(true);
            });
            
            let oDoc            = this.GetDocument();
            let oActionsQueue   = oDoc.GetActionsQueue();
            oActionsQueue.Continue();   
        }
    };
    
    /**
     * Defines how a button reacts when a user clicks it. The four highlight modes supported are:
     * none — No visual indication that the button has been clicked.
     * invert — The region encompassing the button’s rectangle inverts momentarily.
     * push — The down face for the button (if any) is displayed momentarily.
     * outline — The border of the rectangleinverts momentarily.
     * @memberof CPushButtonField
     * @param {number} nType - BUTTON_HIGHLIGHT_TYPES
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetHighlight = function(nType) {
        this._highlight = nType;
    };
    CPushButtonField.prototype.GetHighlight = function() {
        return this._highlight;
    };
    /**
     * Corrects the positions of the caption and image.
     * @memberof CPushButtonField
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.Internal_CorrectContentPos = function() {
        let oRect = this.getFormRelRect();

        // выставляем положение текста с картинкой
        if (this.GetDrawing()) {
            let oPara1                      = this.content.GetElement(0);
            let oRun                        = oPara1.GetElement(0);
            oPara1.Pr.Spacing.Before        = 0;
            oPara1.Pr.Spacing.After         = 0;
            oPara1.CompiledPr.NeedRecalc    = true;

            this.content.Recalculate_Page(0, true);
            let oContentBounds  = this.content.GetContentBounds(0);
            
            if ((this._buttonPosition == position["iconTextH"] || this._buttonPosition == position["textIconH"])  && this.content.GetElementsCount() == 1) {
                
                if (this._buttonPosition == position["iconTextH"])
                    this.content.SetAlign(AscPDF.ALIGN_TYPE.right);
                else if (this._buttonPosition == position["textIconH"])
                    this.content.SetAlign(AscPDF.ALIGN_TYPE.left);

                let nFreeHorSpace = oRect.W - (oContentBounds.Right - oContentBounds.Left);
                if (nFreeHorSpace > 0) {
                    let oTabs = new CParaTabs();
                    oTabs.Add(new CParaTab(Asc.c_oAscTabType.Left, this.content.X + oRun.GetContentWidthInRange() + nFreeHorSpace / 2, undefined));
                    oRun.Add_ToContent(oRun.GetElementsCount(), new AscWord.CRunTab());

                    oPara1.SetParagraphTabs(oTabs);
                }
            }

            let nFreeVerSpace = oRect.H - (oContentBounds.Bottom - oContentBounds.Top);

            if (oPara1.GetAllDrawingObjects().length != 0) {
                oPara1.Pr.Spacing.Before = nFreeVerSpace / 2;
            }

            oPara1.Pr.Spacing.After = nFreeVerSpace / 2;
            oPara1.CompiledPr.NeedRecalc = true;

            return;
        }
        
        // центрируем текст если картинки нет
        if (this.content.GetElementsCount() == 1) {
            let oPara = this.content.GetElement(0);
            oPara.Pr.Spacing.Before = 0;
            oPara.Pr.Spacing.After  = 0;
            oPara.CompiledPr.NeedRecalc = true;

            this.content.Recalculate_Page(0, true);
            let oContentBounds  = this.content.GetContentBounds(0);
            let oContentH       = oContentBounds.Bottom - oContentBounds.Top;

            oPara.Pr.Spacing.Before = (oRect.H - oContentH) / 2;
            oPara.CompiledPr.NeedRecalc = true;
        }
        else if (this.content.GetElementsCount() == 2) {
            let oPara1 = this.content.GetElement(0);
            let oPara2 = this.content.GetElement(1);
            oPara1.Pr.Spacing.Before = 0;
            oPara2.Pr.Spacing.Before = 0;
            oPara1.Pr.Spacing.After  = 0;
            oPara2.Pr.Spacing.After  = 0;

            oPara1.CompiledPr.NeedRecalc = true;
            oPara2.CompiledPr.NeedRecalc = true;

            this.content.Recalculate_Page(0, true);
            let oContentBounds  = this.content.GetContentBounds(0);

            let oContentH  = oContentBounds.Bottom - oContentBounds.Top;

            if (this._buttonPosition == position["iconTextV"]) {
                oPara1.Pr.Spacing.Before = (oRect.H - oContentH - oContentH / 2) / 2;
                oPara1.CompiledPr.NeedRecalc = true;
            }
            else if (this._buttonPosition == position["textIconV"]) {
                oPara1.Pr.Spacing.Before = (oRect.H - oContentH / 2) / 2;
                oPara1.CompiledPr.NeedRecalc = true;
            }
        }
    };

    /**
     * Gets the caption associated with a button.
     * @memberof CPushButtonField
     * @param {number} [nFace=0] - (optional) If specified, gets a caption of the given type:
     * 0 — (default) normal caption
     * 1 — down caption
     * 2 — rollover caption
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.GetCaption = function(nFace) {
        if (nFace == null)
            nFace = 0;

        switch (nFace) {
            case 0:
                return this._buttonCaption;
            case 1:
                return this._downCaption;
            case 2:
                return this._rollOverCaption;
        }

        return undefined;
    };
    /**
     * Gets the caption associated with a button.
     * @memberof CPushButtonField
     * @param {string} cCaption - The caption associated with the button.
     * @param {number} [nFace=0] - (optional) If specified, gets a caption of the given type:
     * 0 — (default) normal caption
     * 1 — down caption
     * 2 — rollover caption
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetCaption = function(cCaption, nFace) {
        if (nFace == null)
            nFace = 0;

        if (cCaption == "" || typeof(cCaption) != "string")
            return false;
            
        switch (nFace) {
            case 0:
                this._buttonCaption = cCaption;
                let oCaptionRun;
                let oPara = this.content.GetElement(0);

                switch (this._buttonPosition) {
                    case position["textIconV"]:
                    case position["textOnly"]:
                    case position["textIconH"]:
                        oCaptionRun = oPara.GetElement(0);
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this._captionRun = oCaptionRun;
                        break;
                    case position["iconOnly"]:
                        this._captionRun = null;
                        break;
                    case position["iconTextV"]:
                        oCaptionRun = this.content.GetElement(1).GetElement(0);
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this._captionRun = oCaptionRun;
                        break;
                    case position["iconTextH"]:
                        oCaptionRun = oPara.GetElement(1);
                        if (oCaptionRun.IsParaEndRun()) {
                            oCaptionRun = new ParaRun(oPara, false);
                            oCaptionRun.AddText(cCaption);
                            oPara.AddToContent(1, oCaptionRun);
                        }
                        else {
                            oCaptionRun.ClearContent();
                            oCaptionRun.AddText(cCaption);
                        }
                        
                        this._captionRun = oCaptionRun;
                        break;
                    case position["overlay"]:
                        let oDrawing = this.GetDrawing();
                        if (oDrawing) {
                            let oShapeCont = oDrawing.GraphicObj.getDocContent();
                            oCaptionRun = oShapeCont.GetElement(0).GetElement(0);
                        }
                        else {
                            oCaptionRun = oPara.GetElement(0);
                        }
                        
                        oCaptionRun.ClearContent();
                        oCaptionRun.AddText(cCaption);
                        this._captionRun = oCaptionRun;
                        break;
                }
                break;
            case 1:
                this._downCaption = cCaption;
                break;
            case 2:
                this._rollOverCaption = cCaption;
                break;
        }
    };
    CPushButtonField.prototype.SetValue = function() {
        return;
    };
    CPushButtonField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer = editor.getDocumentRenderer();
        let oGraphicsWord = oViewer.pagesInfo.pages[this.GetPage()].graphics.word;
        
        this.Recalculate();
        this.DrawBackground();
        if (this._buttonPressed) {
            this.DrawBorders()
        }

        oGraphicsWord.AddClipRect(this.contentRect.X, this.contentRect.Y, this.contentRect.W, this.contentRect.H);

        // draw behind doc
        if (this.GetButtonPosition() == position["overlay"]) {
            let oDrawing = this.GetDrawing();
            if (oDrawing)
                oDrawing.GraphicObj.draw(oGraphicsWord);
        }

        this.content.Draw(0, oGraphicsWord);
        oGraphicsWord.RemoveClip();

        if (false == this._buttonPressed) {
            this.GetButtonFitBounds() == false && this.DrawBorders();
        }
    };
    CPushButtonField.prototype.DrawPressed = function() {
        let oViewer     = editor.getDocumentRenderer();
        let oCtx        = oViewer.canvasForms.getContext("2d");
        
        let aRect       = this.GetRect();
        let aOringRect  = this.GetOrigRect();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let nLineWidth  = aRect[0] / aOringRect[0] * nScale * this._lineWidth;
        oCtx.lineWidth  = nLineWidth;

        let X;
        let Y;
        let nWidth;
        let nHeight;

        let originView = this.IsChanged() == false ? this.GetOriginView(AscPDF.APPEARANCE_TYPE.mouseDown) : null;
        //let originView = null;
        if (this.IsNeedDrawFromStream()) {
            X = originView.x;
            Y = originView.y;
            nWidth = originView.width;
            nHeight = originView.height;
            nLineWidth += 1;
        }
        else {
            X = this._pagePos.x * nScale;
            Y = this._pagePos.y * nScale;
            nWidth = this._pagePos.w * nScale;
            nHeight = this._pagePos.h * nScale;
        }

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
        
        // Create a new canvas element for the cropped area
        var croppedCanvas       = document.createElement('canvas');
        var oCroppedCtx         = croppedCanvas.getContext("2d");
        croppedCanvas.width     = nWidth;
        croppedCanvas.height    = nHeight;

        let highlightType = this.GetHighlight();
        switch (highlightType) {
            case AscPDF.BUTTON_HIGHLIGHT_TYPES.none:
                return;
            case AscPDF.BUTTON_HIGHLIGHT_TYPES.invert: {
                oCroppedCtx.drawImage(oViewer.canvasForms, X + indLeft, Y + indTop, nWidth, nHeight, 0, 0, nWidth, nHeight);
                oCroppedCtx.globalCompositeOperation='difference';
                oCroppedCtx.fillStyle='white';
                oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                oCtx.clearRect(X + indLeft, Y + indTop, nWidth, nHeight);
                oCtx.drawImage(croppedCanvas, X + indLeft, Y + indTop);
                break;
            }
            case AscPDF.BUTTON_HIGHLIGHT_TYPES.outline: {
                if (originView) {
                    oCroppedCtx.drawImage(originView, 0, 0);
                }
                else {
                    oCroppedCtx.drawImage(oViewer.canvasForms, X + indLeft, Y + indTop, nWidth, nHeight, 0, 0, nWidth, nHeight);
                }

                oCroppedCtx.globalCompositeOperation='difference';
                oCroppedCtx.fillStyle='white';
                oCroppedCtx.fillRect(0, 0, croppedCanvas.width,croppedCanvas.height);
                oCroppedCtx.clearRect(nLineWidth, nLineWidth, croppedCanvas.width - 2 * nLineWidth, croppedCanvas.height - 2 * nLineWidth);
                oCtx.clearRect(X + indLeft, Y + indTop, nWidth, nHeight);
                oCtx.drawImage(croppedCanvas, X + indLeft, Y + indTop);
                break;
            }
            case AscPDF.BUTTON_HIGHLIGHT_TYPES.push: {
                // to do в печать
                if (originView) {
                    oCroppedCtx.drawImage(originView, 0, 0);
                    oCtx.clearRect(X + indLeft, Y + indTop, nWidth, nHeight);
                    oCtx.drawImage(croppedCanvas, X + indLeft, Y + indTop);
                }
                else {
                    let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
                    let oGraphicsCanvas = oGraphicsPDF.context.canvas;
                    oGraphicsPDF.ClearRect(0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height);
                    let oDrawing = this.GetDrawing();
                    if (oDrawing && this._images.mouseDown) {
                        let oFill   = new AscFormat.CUniFill();
                        oFill.fill  = new AscFormat.CBlipFill();
                        oFill.fill.setRasterImageId(this._images.mouseDown);
                        oFill.fill.tile     = null;
                        oFill.fill.srcRect  = null;
                        oFill.fill.stretch  = true;
                        oFill.convertToPPTXMods();
                        oDrawing.GraphicObj.setFill(oFill);
                        oDrawing.GraphicObj.recalculate();
                    }

                    this.SetNeedRecalc(true);
                    this.Draw();

                    oCtx.drawImage(oGraphicsCanvas, 0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height, indLeft, indTop, w, h);
                }
                
                break;
            }
        }
    };
    CPushButtonField.prototype.DrawRollover = function() {
        let oViewer = editor.getDocumentRenderer();
        let oCtx    = oViewer.canvasForms.getContext("2d");

        let aRect       = this.GetRect();
        let aOringRect  = this.GetOrigRect();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let nLineWidth  = aRect[0] / aOringRect[0] * nScale * this._lineWidth;
        oCtx.lineWidth  = nLineWidth;

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

        let X;
        let Y;
        let nWidth;
        let nHeight;

        if (this.IsNeedDrawFromStream() == true) {
            let originView = this.GetOriginView(AscPDF.APPEARANCE_TYPE.rollover);

            X = originView.x;
            Y = originView.y;
            nWidth = originView.width;
            nHeight = originView.height;
            nLineWidth += 1;

            oCtx.clearRect(X + indLeft, Y + indTop, nWidth, nHeight);
            oCtx.drawImage(originView, X + indLeft, Y + indTop);
        }
        else {
            let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
            let oGraphicsCanvas = oGraphicsPDF.context.canvas;
            oGraphicsPDF.ClearRect(0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height);
            let oDrawing = this.GetDrawing();
            if (oDrawing && this._images.rollover) {
                let oFill   = new AscFormat.CUniFill();
                oFill.fill  = new AscFormat.CBlipFill();
                oFill.fill.setRasterImageId(this._images.rollover);
                oFill.fill.tile     = null;
                oFill.fill.srcRect  = null;
                oFill.fill.stretch  = true;
                oFill.convertToPPTXMods();
                oDrawing.GraphicObj.setFill(oFill);
                oDrawing.GraphicObj.recalculate();
            }

            this.SetNeedRecalc(true);
            this.Draw();

            oCtx.drawImage(oGraphicsCanvas, 0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height, indLeft, indTop, w, h);
        }
    };
    CPushButtonField.prototype.OnEndRollover = function() {
        let oViewer = editor.getDocumentRenderer();
        let oCtx    = oViewer.canvasForms.getContext("2d");

        let aRect       = this.GetRect();
        let aOringRect  = this.GetOrigRect();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let nLineWidth  = aRect[0] / aOringRect[0] * nScale * this._lineWidth;
        oCtx.lineWidth  = nLineWidth;

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

        let X;
        let Y;
        let nWidth;
        let nHeight;

        if (this.IsNeedDrawFromStream() == true) {
            let originView = this.GetOriginView(AscPDF.APPEARANCE_TYPE.normal);

            X = originView.x;
            Y = originView.y;
            nWidth = originView.width;
            nHeight = originView.height;
            nLineWidth += 1;

            oCtx.clearRect(X + indLeft, Y + indTop, nWidth, nHeight);
            oCtx.drawImage(originView, X + indLeft, Y + indTop);
        }
        else {
            let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
            let oGraphicsCanvas = oGraphicsPDF.context.canvas;
            oGraphicsPDF.ClearRect(0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height);
            let oDrawing = this.GetDrawing();
            if (oDrawing && this._images.rollover && this._images.normal) {
                let oFill   = new AscFormat.CUniFill();
                oFill.fill  = new AscFormat.CBlipFill();
                oFill.fill.setRasterImageId(this._images.normal);
                oFill.fill.tile     = null;
                oFill.fill.srcRect  = null;
                oFill.fill.stretch  = true;
                oFill.convertToPPTXMods();
                oDrawing.GraphicObj.setFill(oFill);
                oDrawing.GraphicObj.recalculate();
            }

            this.SetNeedRecalc(true);
            this.Draw();

            oCtx.drawImage(oGraphicsCanvas, 0, 0, oGraphicsCanvas.width, oGraphicsCanvas.height, indLeft, indTop, w, h);
        }
    };
    CPushButtonField.prototype.Recalculate = function() {
        if (this.IsNeedRecalc() == false)
            return;

        let oViewer = editor.getDocumentRenderer();
        let aRect   = this.GetRect();
        
        let X = aRect[0];
        let Y = aRect[1];
        let nWidth = (aRect[2] - aRect[0]);
        let nHeight = (aRect[3] - aRect[1]);

        // save pos in page.
        this._pagePos = {
            x: X,
            y: Y,
            w: nWidth,
            h: nHeight
        };

        let oMargins = this.GetMarginsFromBorders(false, false);
        
        let contentX;
        let contentY;
        let contentXLimit;
        let contentYLimit;
        
        if (this.GetButtonFitBounds() == false) {
            contentX = (X + 2 * oMargins.left) * g_dKoef_pix_to_mm;
            contentY = (Y + 2 * oMargins.top) * g_dKoef_pix_to_mm;
            contentXLimit = (X + nWidth - 2 * oMargins.left) * g_dKoef_pix_to_mm;
            contentYLimit = (Y + nHeight - 2 * oMargins.bottom) * g_dKoef_pix_to_mm;
        }
        else {
            contentX = (X) * g_dKoef_pix_to_mm;
            contentY = (Y) * g_dKoef_pix_to_mm;
            contentXLimit = (X + nWidth) * g_dKoef_pix_to_mm;
            contentYLimit = (Y + nHeight) * g_dKoef_pix_to_mm;
        }

        if (this._buttonPressed) {
            contentX += oMargins.left * g_dKoef_pix_to_mm / 2;
            contentY += oMargins.top * g_dKoef_pix_to_mm / 2;
            contentXLimit += oMargins.left * g_dKoef_pix_to_mm / 2;
            contentYLimit += oMargins.top * g_dKoef_pix_to_mm / 2;
        }

        this._formRect.X = X * g_dKoef_pix_to_mm;
        this._formRect.Y = Y * g_dKoef_pix_to_mm;
        this._formRect.W = nWidth * g_dKoef_pix_to_mm;
        this._formRect.H = nHeight * g_dKoef_pix_to_mm;
        
        this.contentRect.X = contentX;
        this.contentRect.Y = contentY;
        this.contentRect.W = contentXLimit - contentX;
        this.contentRect.H = contentYLimit - contentY;

        if (contentX != this._oldContentPos.X || contentY != this._oldContentPos.Y ||
            contentXLimit != this._oldContentPos.XLimit) {
            this.content.X      = this._oldContentPos.X        = contentX;
            this.content.Y      = this._oldContentPos.Y        = contentY;
            this.content.XLimit = this._oldContentPos.XLimit   = contentXLimit;
            this.content.YLimit = this._oldContentPos.YLimit   = 20000;
            this.Internal_CorrectContentPos();
            this.content.Recalculate_Page(0, true);
        }
        else if (this.IsNeedRecalc()) {
            this.Internal_CorrectContentPos();
            this.content.Recalculate_Page(0, false);
        }

        this.SetNeedRecalc(false);
    };
    CPushButtonField.prototype.onMouseDown = function() {
        let oViewer         = editor.getDocumentRenderer();
        this._buttonPressed = true; // флаг что нужно рисовать нажатие
        this.SetDrawHighlight(true);

        if (this.GetHighlight() != BUTTON_HIGHLIGHT_TYPES.none) {
            this.DrawPressed();
        }

        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.OnFocus);
        oViewer.activeForm = this;
    };
    CPushButtonField.prototype.onMouseUp = function() {
        let oViewer         = editor.getDocumentRenderer();
        this._buttonPressed = false; // флаг что нужно рисовать нажатие
        this.SetDrawHighlight(false);
        this.SetNeedRecalc(true);

        oViewer._paintFormsHighlight();
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseUp);
    };
    CPushButtonField.prototype.onMouseEnter = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter);

        this._buttonHovered = true;
        this.DrawRollover();
    };
    CPushButtonField.prototype.onMouseExit = function() {
        this.AddActionsToQueue(AscPDF.FORMS_TRIGGERS_TYPES.MouseExit);

        this._buttonHovered = false;
        this.OnEndRollover();
    };
    CPushButtonField.prototype.buttonImportIcon = function() {
        let Api = editor;
        let oThis = this;

        let oActionsQueue = this.GetDocument().GetActionsQueue();
        if (oActionsQueue instanceof AscPDF.CActionRunScript)
            oActionsQueue.bContinueAfterEval = false;
        
        Api.oSaveObjectForAddImage = this;
        AscCommon.ShowImageFileDialog(Api.documentId, Api.documentUserId, undefined, function(error, files)
        {
            if (error.canceled == true) {
                let oDoc            = oThis.GetDocument();
                let oActionsQueue   = oDoc.GetActionsQueue();
                oActionsQueue.Continue();
            }
            else
                Api._uploadCallback(error, files, oThis);

        }, function(error)
        {
            if (c_oAscError.ID.No !== error)
            {
                Api.sendEvent("asc_onError", error, c_oAscError.Level.NoCritical);
            }
            if (obj && obj.sendUrlsToFrameEditor && Api.isOpenedChartFrame)
            {
                Api.sendStartUploadImageActionToFrameEditor();
            }
            Api.sync_StartAction(c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.UploadImage);
        });
    };
    CPushButtonField.prototype.GetDrawing = function() {
        return this.content.GetAllDrawingObjects()[0];
    };
    CPushButtonField.prototype.SetButtonFitBounds = function(bValue) {
        if (this._buttonFitBounds != bValue) {
            this._buttonFitBounds = bValue;
            this.SetWasChanged(true);

            this.SetNeedRecalc(true);
        }
    };
    CPushButtonField.prototype.GetButtonFitBounds = function() {
        return this._buttonFitBounds;
    };
    CPushButtonField.prototype.SetScaleWhen = function(nType) {
        this._buttonScaleWhen = nType;
        this.SetWasChanged(true);
    };
    CPushButtonField.prototype.GetScaleWhen = function() {
        return this._buttonScaleWhen;
    };
    CPushButtonField.prototype.SetScaleHow = function(nType) {
        this._buttonScaleHow = nType;
        this.SetWasChanged(true);
    };
    CPushButtonField.prototype.GetScaleHow = function() {
        return this._buttonScaleHow;
    };
    /**
     * Controls how the text and the icon of the button are positioned with respect to each other within the button face. The
     * convenience position object defines all of the valid alternatives..
     * @memberof CPushButtonField
     * @param {number} nType
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SetButtonPosition = function(nType) {
        switch (nType) {
            case position["textOnly"]:
                this.SetTextOnly();
                break;
            case position["iconOnly"]:
                this.SetIconOnly();
                break;
            case position["iconTextV"]:
                this.SetIconTextV();
                break;
            case position["textIconV"]:
                this.SetTextIconV();
                break;
            case position["iconTextH"]:
                this.SetIconTextH();
                break;
            case position["textIconH"]:
                this.SetTextIconH();
                break;
            case position["overlay"]:
                this.SetOverlay();
                break;
        }
    };
    CPushButtonField.prototype.GetButtonPosition = function() {
        return this._buttonPosition;
    };
    CPushButtonField.prototype.SetIconPosition = function(X, Y) {
        let oViewer = editor.getDocumentRenderer();

        if (X != null)
            this._buttonAlignX = X;
        if (Y != null)
            this._buttonAlignY = Y;

        if (oViewer.IsOpenFormsInProgress == false)
            this.SetNeedRecalc(true);

        let oDrawing = this.GetDrawing();
        if (oDrawing) {
            let oRect = this.getFormRelRect();
            let dFrmW = oRect.W;
            let dFrmH = oRect.H;
            let dDrawingW = oDrawing.Width;
            let dDrawingH = oDrawing.Height;

            let nPosX = -(dDrawingW - dFrmW) * this._buttonAlignX;
            let nPosY = (dDrawingH - dFrmH) * (this._buttonAlignY - 1);
            oDrawing.Set_PositionH(Asc.c_oAscRelativeFromH.Column, Asc.c_oAscXAlign.Outside, nPosX, false);
            oDrawing.Set_PositionV(Asc.c_oAscRelativeFromH.Page, Asc.c_oAscXAlign.Outside, nPosY, false);
        }
    };
    CPushButtonField.prototype.GetIconPosition = function() {
        return {X: this._buttonAlignX, Y: this._buttonAlignY};
    };
    CPushButtonField.prototype.SetTextOnly = function() {
        if (this._buttonPosition == position["textOnly"])
            return;

        this._buttonPosition = position["textOnly"];

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
    
                if (oPara.GetAllDrawingObjects().length > 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }
        else {
            oPara = this.content.GetElement(0);
            oPara.RemoveFromContent(1, oPara.GetElementsCount() - 1, false);
            let oTargetRun = oPara.GetElement(0);
            oTargetRun.ClearContent();

            if (this._buttonCaption) {
                oTargetRun.AddText(this._buttonCaption);
                this._captionRun = oTargetRun;
            }
        }

        this.SetWasChanged(true);
        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetIconOnly = function() {
        if (this._buttonPosition == position["iconOnly"])
            return;

        this._buttonPosition = position["iconOnly"];
        this._buttonCaption  = undefined;

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
    
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }
        else {
            oPara = this.content.GetElement(0);
            
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara.Content.length - 1; i++) {
                oTmpRun = oPara.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            if (this._captionRun) {
                this._captionRun.ClearContent()
                this._captionRun = null;
            }

            let nPosInPara;
            for (let oRun of aRunForDel) {
                oRun.PreDelete();
                nPosInPara = oPara.Content.indexOf(oRun);
                oPara.Remove_FromContent(nPosInPara, 1, true);
            }
            oPara.CorrectContent();
        }

        this.SetNeedRecalc(true);
    };
    CPushButtonField.prototype.SetIconTextV = function() {
        if (this._buttonPosition == position["iconTextV"])
            return;

        let oPara1;
        let oPara2;
        if (this.content.Content.length == 2) {
            oPara1 = this.content.GetElement(0);
            oPara2 = this.content.GetElement(1);

            if (oPara2.GetAllDrawingObjects().length != 0) {
                [this.content.Content[0], this.content.Content[1]] = [this.content.Content[1], this.content.Content[0]];
                oPara1.Set_DocumentIndex(1);
                oPara2.Set_DocumentIndex(0);
            }
        }
        else {
            oPara1 = this.content.GetElement(0);
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara1.Content.length - 1; i++) {
                oTmpRun = oPara1.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            let nPosInPara;
            for (let oRun of aRunForDel) {
                oRun.PreDelete();
                nPosInPara = oPara1.Content.indexOf(oRun);
                oPara1.Remove_FromContent(nPosInPara, 1, true);
            }

            let oNewPara = new AscCommonWord.Paragraph(oPara1.DrawingDocument, this.content, false);
            oNewPara.CorrectContent();
            this.content.AddToContent(1, oNewPara);
            oNewPara.Set_Align(align_Center);
            oNewPara.RecalcCompiledPr(true);

            if (this._captionRun) {
                this._captionRun.ClearContent();
                this._captionRun = null;
            }

            if (this._buttonCaption) {
                let oCaptionRun = oNewPara.GetElement(0);
                oCaptionRun.AddText(this._buttonCaption);
                this._captionRun = oCaptionRun;
            }
        }

        this.SetNeedRecalc(true);
        this._buttonPosition = position["iconTextV"];
    };
    CPushButtonField.prototype.SetTextIconV = function() {
        if (this._buttonPosition == position["textIconV"])
            return;

        let oPara1;
        let oPara2;
        if (this.content.Content.length == 2) {
            oPara1 = this.content.GetElement(0);
            oPara2 = this.content.GetElement(1);

            if (oPara1.GetAllDrawingObjects().length != 0) {
                [this.content.Content[0], this.content.Content[1]] = [this.content.Content[1], this.content.Content[0]];
                oPara1.Set_DocumentIndex(1);
                oPara2.Set_DocumentIndex(0);
            }
        }
        else {
            oPara1 = this.content.GetElement(0);
            let aRunForDel = [];
            let oTmpRun;
            for (let i = 0; i < oPara1.Content.length - 1; i++) {
                oTmpRun = oPara1.GetElement(i);
                if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                    aRunForDel.push(oTmpRun);
                }
            }

            let nPosInPara;
            for (let oRun of aRunForDel) {
                oRun.PreDelete();
                nPosInPara = oPara1.Content.indexOf(oRun);
                oPara1.Remove_FromContent(nPosInPara, 1, true);
            }

            let oNewPara = new AscCommonWord.Paragraph(oPara1.DrawingDocument, this.content, false);
            oNewPara.CorrectContent();
            this.content.AddToContent(0, oNewPara);
            oNewPara.Set_Align(align_Center);
            oNewPara.RecalcCompiledPr(true);

            if (this._captionRun) {
                this._captionRun.ClearContent();
                this._captionRun = null;
            }

            if (this._buttonCaption) {
                let oCaptionRun = oNewPara.GetElement(0);
                oCaptionRun.AddText(this._buttonCaption);
                this._captionRun = oCaptionRun;
            }
        }

        this.SetNeedRecalc(true);
        this._buttonPosition = position["textIconV"];
    };
    CPushButtonField.prototype.SetIconTextH = function() {
        if (this._buttonPosition == position["iconTextH"])
            return;

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        for (let oRun of aRunForDel) {
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        if (this._captionRun) {
            this._captionRun.ClearContent();
            this._captionRun = null;
        }

        if (this._buttonCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(this._buttonCaption);
            this._captionRun = oTmpRun;

            oPara.Add_ToContent(oPara.Content.length - 1, oTmpRun);
        }

        this.SetNeedRecalc(true);
        this._buttonPosition = position["iconTextH"];
    };
    CPushButtonField.prototype.SetTextIconH = function() {
        if (this._buttonPosition == position["textIconH"])
            return;

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0 && oTmpRun.Content.length != 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        for (let oRun of aRunForDel) {
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        if (this._captionRun) {
            this._captionRun.ClearContent();
            this._captionRun = null;
        }

        if (this._buttonCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(this._buttonCaption);
            oPara.Add_ToContent(0, oTmpRun);

            this._captionRun = oTmpRun;
        }
        
        this.SetNeedRecalc(true);
        this._buttonPosition = position["textIconH"];
    };
    CPushButtonField.prototype.SetOverlay = function() {
        if (this._buttonPosition == position["overlay"])
            return;

        let oPara;
        if (this.content.Content.length == 2) {
            for (let i = 0; i < this.content.Content.length; i++) {
                oPara = this.content.GetElement(i);
                if (oPara.GetAllDrawingObjects().length == 0) {
                    this.content.RemoveFromContent(i, 1, false);
                    break;
                }
            }
        }

        oPara = this.content.GetElement(0);
        let aRunForDel = [];
        let oTmpRun;
        
        for (let i = 0; i < oPara.Content.length - 1; i++) {
            oTmpRun = oPara.GetElement(i);
            if (oTmpRun.GetAllDrawingObjects().length == 0) {
                aRunForDel.push(oTmpRun);
            }
        }

        let nPosInPara;
        if (this._captionRun) {
            this._captionRun.ClearContent();
            this._captionRun = null;
        }

        for (let oRun of aRunForDel) {
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        let oDrawing = this.GetDrawing();
        if (oDrawing && this._buttonCaption) {
            let oShapeCont      = oDrawing.GraphicObj.getDocContent();
            oTmpRun             = oShapeCont.GetElement(0).GetElement(0);
            this._captionRun    = oTmpRun;

            oTmpRun.AddText(this._buttonCaption);

            oDrawing.GraphicObj.recalcInfo.recalculateTxBoxContent = true;
            oDrawing.GraphicObj.recalculateText();
        }

        this.SetNeedRecalc(true);
        this._buttonPosition = position["overlay"];
    };

    /**
     * Synchronizes this field with fields with the same name.
     * @memberof CPushButtonField
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {
                this._buttonAlignX      = aFields[i]._buttonAlignX;
                this._buttonAlignY      = aFields[i]._buttonAlignY;
                this._buttonFitBounds   = aFields[i]._buttonFitBounds;
                this._buttonPosition    = Object.assign(this._buttonPosition, aFields[i]._buttonPosition);
                this._buttonScaleHow    = aFields[i]._buttonScaleHow;
                this._highlight         = aFields[i]._highlight;
                this._textFont          = aFields[i]._textFont;

                this._triggers = aFields[i]._triggers ? aFields[i]._triggers.Copy(this) : null;

                let oPara = this.content.GetElement(0);
                let oParaToCopy = aFields[i].content.GetElement(0);

                oPara.ClearContent();
                for (var nPos = 0; nPos < oParaToCopy.Content.length - 1; nPos++) {
                    oPara.Internal_Content_Add(nPos, oParaToCopy.GetElement(nPos).Copy());
                }
                oPara.CheckParaEnd();

                // format content
                oPara = this.contentFormat.GetElement(0);
                oParaToCopy = aFields[i].contentFormat.GetElement(0);

                oPara.ClearContent();
                for (var nPos = 0; nPos < oParaToCopy.Content.length - 1; nPos++) {
                    oPara.Internal_Content_Add(nPos, oParaToCopy.GetElement(nPos).Copy());
                }
                oPara.CheckParaEnd();
                
                break;
            }
        }
    };
    /**
     * Applies value of this field to all field with the same name.
     * @memberof CPushButtonField
     * @typeofeditors ["PDF"]
     */
    CPushButtonField.prototype.Commit = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        let oThisPara = this.content.GetElement(0);
        
        TurnOffHistory();

        if (true != editor.getDocumentRenderer().isOnUndoRedo) {
            this.UnionLastHistoryPoints();
        }

        if (aFields.length == 1)
            this.SetNeedCommit(false);

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] == this)
                continue;

            let oFieldPara = aFields[i].content.GetElement(0);
            let oThisRun, oFieldRun;
            for (let nItem = 0; nItem < oThisPara.Content.length - 1; nItem++) {
                oThisRun = oThisPara.Content[nItem];
                oFieldRun = oFieldPara.Content[nItem];
                oFieldRun.ClearContent();

                for (let nRunPos = 0; nRunPos < oThisRun.Content.length; nRunPos++) {
                    oFieldRun.AddToContent(nRunPos, AscCommon.IsSpace(oThisRun.Content[nRunPos].Value) ? new AscWord.CRunSpace(oThisRun.Content[nRunPos].Value) : new AscWord.CRunText(oThisRun.Content[nRunPos].Value));
                }
            }

            aFields[i].SetNeedRecalc(true);
        }
    };

    CPushButtonField.prototype.Reset = function() {
    };
	
    function TurnOffHistory() {
        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();
    }

    if (!window["AscPDF"])
	    window["AscPDF"] = {};

	window["AscPDF"].CPushButtonField = CPushButtonField;
	window["AscPDF"].BUTTON_HIGHLIGHT_TYPES = BUTTON_HIGHLIGHT_TYPES;
})();

