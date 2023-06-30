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

    let CHECKBOX_STYLES = {
        circle:     0,
        check:      1,
        cross:      2,
        diamond:    3,
        square:     4,
        star:       5
    }
    
    let CHECK_SVG = `<svg
    width="97.462692"
    height="115.98789"
    viewBox="0 0 97.462692 115.98789"
    version="1.1"
    id="svg5"
    xml:space="preserve"
    inkscape:version="1.2.2 (732a01da63, 2022-12-09)"
    sodipodi:docname="check.svg"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview
      id="namedview7"
      pagecolor="#505050"
      bordercolor="#eeeeee"
      borderopacity="1"
      inkscape:showpageshadow="0"
      inkscape:pageopacity="0"
      inkscape:pagecheckerboard="0"
      inkscape:deskcolor="#505050"
      inkscape:document-units="px"
      showgrid="false"
      inkscape:zoom="4.7376154"
      inkscape:cx="23.9572"
      inkscape:cy="41.476562"
      inkscape:window-width="1920"
      inkscape:window-height="991"
      inkscape:window-x="-9"
      inkscape:window-y="-9"
      inkscape:window-maximized="1"
      inkscape:current-layer="layer1" /><defs
      id="defs2" /><g
      inkscape:label="Слой 1"
      inkscape:groupmode="layer"
      id="layer1"
      transform="translate(-12.371013,-2.0611684)"><path
        style="fill:#000000"
        d="M 7.9153744,45.38148 32.083651,34.827647"
        id="path242" /><path
        style="fill:#000000"
        d="M 35.671954,51.71378 33.139034,41.159947"
        id="path244" /><path
        style="opacity:1;fill:#000000"
        d="m 12.371013,70.085234 c 0,0 9.268432,-8.566213 14.850746,-7.164179 5.582313,1.402033 13.115672,18.376865 13.115672,18.376865 0,0 6.937138,-13.800058 22.55597,-38.451492 C 78.512233,18.194994 88.548233,6.6826273 93.639669,4.3389654 101.74823,0.60647342 109.8337,2.585234 109.8337,2.585234 c 0,0 -6.6792,8.287321 -13.467357,17.858073 -6.788164,9.570753 -12.946529,20.002783 -14.96548,23.447897 -3.218556,5.492106 -23.582089,41.492537 -23.582089,41.492537 0,0 -15.314483,31.188889 -15.877804,32.317949 -0.56332,1.12906 -4.295322,-0.76079 -6.062495,-1.87019 -1.31002,-0.82241 -4.040457,-3.13776 -4.08637,-4.24678 C 31.723555,109.92887 27.50151,99.448458 22.663375,89.487549 17.82524,79.526641 12.371013,70.085234 12.371013,70.085234 Z"
        id="path300"
        sodipodi:nodetypes="czczscssczsssc" /></g></svg>`;

    const CHECKED_ICON = new Image();
    CHECKED_ICON.src = `data:image/svg+xml;utf8,${encodeURIComponent(CHECK_SVG)}`;
    
    /**
	 * Class representing a base checkbox class.
	 * @constructor
     * @extends {CBaseField}
	 */
    function CBaseCheckBoxField(sName, sType, nPage, aRect)
    {
        AscPDF.CBaseField.call(this, sName, sType, nPage, aRect);

        this._value         = "Off";
        this._exportValue   = "Yes";
        this._chStyle       = CHECKBOX_STYLES.check;
        this._checked       = false;
    };
    
    CBaseCheckBoxField.prototype = Object.create(AscPDF.CBaseField.prototype);
    CBaseCheckBoxField.prototype.constructor = CBaseCheckBoxField;

    CBaseCheckBoxField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let aRect = this.GetRect();

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

        this.DrawBackground();
        this.DrawBorders();

        if (true == this.IsChecked())
            this.DrawCheckedSymbol();
    };
    CBaseCheckBoxField.prototype.IsChecked = function() {
        return this._checked;
    };
    CBaseCheckBoxField.prototype.DrawCheckedSymbol = function() {
        let oViewer         = editor.getDocumentRenderer();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

        let X       = this._pagePos.x * nScale;
        let Y       = this._pagePos.y * nScale;
        let nWidth  = this._pagePos.w * nScale;
        let nHeight = this._pagePos.h * nScale;

        let oMargins = this.GetMarginsFromBorders(true, false);
        let oRGB = this.GetRGBColor(this._textColor);

        oGraphicsPDF.SetGlobalAlpha(1);
        oGraphicsPDF.SetStrokeStyle(`rgb(${oRGB.r}, ${oRGB.g}, ${oRGB.b})`);
        oGraphicsPDF.SetFillStyle(`rgb(${oRGB.r}, ${oRGB.g}, ${oRGB.b})`);
        oGraphicsPDF.SetLineWidth(nScale);
        oGraphicsPDF.SetLineDash([]);

        switch (this._chStyle) {
            case CHECKBOX_STYLES.circle: {
                let centerX = X + nWidth / 2;
                let centerY = Y + nHeight / 2;
                let nRadius = Math.min(nWidth / 4 - oMargins.left / 2, nHeight / 4 - oMargins.top / 2);
                oGraphicsPDF.BeginPath();
                oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                oGraphicsPDF.Fill();
                oGraphicsPDF.ClosePath();
                break;
            }
                
            case CHECKBOX_STYLES.cross: {
                let x = nWidth > nHeight ? X + (nWidth - nHeight) / 2 : X;
                let y = nHeight > nWidth ? Y + (nHeight - nWidth) / 2 : Y;
                let w = Math.min(nWidth, nHeight);


                // left to right
                oGraphicsPDF.BeginPath();
                oGraphicsPDF.MoveTo(x + (oMargins.left + w * 0.05), y + (oMargins.top + w * 0.05));
                oGraphicsPDF.LineTo(x + w - (oMargins.left + w * 0.05), y + w - (oMargins.top + w * 0.05));
                oGraphicsPDF.Stroke();
                oGraphicsPDF.ClosePath();

                // right to left
                oGraphicsPDF.BeginPath();
                oGraphicsPDF.MoveTo(x + w - (oMargins.left + w * 0.05), y + (oMargins.top + w * 0.05));
                oGraphicsPDF.LineTo(x + (oMargins.left + w * 0.05), y + w - (oMargins.top + w * 0.05));
                oGraphicsPDF.Stroke();
                oGraphicsPDF.ClosePath();
                break;
            }
                
            case CHECKBOX_STYLES.diamond: {
                let nDiamondWidth = Math.min(nWidth - oMargins.left * 1.5, nHeight - oMargins.top * 1.5) / 2;
                let nCenterX = X + nWidth / 2;
                let nCenterY = Y + nHeight / 2;

                // set the position of the top-left corner of the rhombus
                let x = nCenterX;
                let y = nCenterY - nDiamondWidth / 2;

                // create a path for the rhombus
                oGraphicsPDF.BeginPath();
                oGraphicsPDF.MoveTo(x, y);
                oGraphicsPDF.LineTo(x + nDiamondWidth/2, y + nDiamondWidth/2);
                oGraphicsPDF.LineTo(x, y + nDiamondWidth);
                oGraphicsPDF.LineTo(x - nDiamondWidth/2, y + nDiamondWidth/2);
                oGraphicsPDF.ClosePath();

                oGraphicsPDF.Fill();
                break;
            }
                
            case CHECKBOX_STYLES.square: {
                let nDelta = Math.abs(nHeight - nWidth);
                let nMaxW = Math.min(nWidth, nHeight) * 0.8 - oMargins.bottom * 2;

                let x = (nWidth > nHeight ? X + nDelta / 2 : X) + oMargins.bottom + Math.min(nWidth, nHeight) * 0.1;
                let y = (nHeight > nWidth ? Y + nDelta / 2 : Y) + oMargins.bottom + Math.min(nWidth, nHeight) * 0.1;

                oGraphicsPDF.BeginPath();
                oGraphicsPDF.Rect(x, y, nMaxW, nMaxW);
                oGraphicsPDF.Fill();
                oGraphicsPDF.ClosePath();
                break;
            }
                
            case CHECKBOX_STYLES.star: {
                // set the position of the center of the star
                let nCenterX = X + nWidth / 2;
                let nCenterY = Y + nHeight / 2;

                // set the outer and inner radius of the star
                let outerRadius = Math.min(nWidth, nHeight) / 2 - oMargins.bottom - Math.min(nWidth, nHeight) / 20;
                let innerRadius = outerRadius / 2.5;

                // set the number of points of the star
                let numPoints = 5;

                // create a path for the star
                oGraphicsPDF.BeginPath();
                for (let i = 0; i < numPoints * 2; i++) {
                    let radius = i % 2 === 0 ? outerRadius : innerRadius;
                    let angle = Math.PI / numPoints * i;
                    let pointX = nCenterX + radius * Math.sin(angle);
                    let pointY = nCenterY - radius * Math.cos(angle);
                    if (i === 0) {
                    oGraphicsPDF.MoveTo(pointX, pointY);
                    } else {
                    oGraphicsPDF.LineTo(pointX, pointY);
                    }
                }
                oGraphicsPDF.ClosePath();

                // fill the star with a color
                oGraphicsPDF.Fill();
                break;
            }

            case CHECKBOX_STYLES.check: {
                let imgW = CHECKED_ICON.width;
                let imgH = CHECKED_ICON.height;

                let nInsideW = nWidth - 2 * oMargins.bottom;
                let nInsideH = nHeight - 2 * oMargins.bottom;

                let nScale = Math.min((nInsideW - nInsideW * 0.2) / imgW, (nInsideH - nInsideW * 0.2) / imgH);

                let wScaled = imgW * nScale ;
                let hScaled = imgH * nScale ;

                let x = X + oMargins.bottom + (nInsideW - wScaled)/2;
                let y = Y + oMargins.bottom + (nInsideH - hScaled)/2;


                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                // Set the canvas dimensions to match the image
                canvas.width = wScaled;
                canvas.height = hScaled;

                // Draw the image onto the canvas
                context.drawImage(CHECKED_ICON, 0, 0, imgW, imgH, 0, 0, wScaled, hScaled);

                // Get the pixel data of the canvas
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                var data = imageData.data;

                // Loop through each pixel
                for (let i = 0; i < data.length; i += 4) {
                    const red = data[i];
                    const green = data[i + 1];
                    const blue = data[i + 2];

                    // Check if the pixel is black (R = 0, G = 0, B = 0)
                    if (red === 0 && green === 0 && blue === 0) {
                        // Change the pixel color to red (R = 255, G = 0, B = 0)
                        data[i] = oRGB.r; // Red
                        data[i + 1] = oRGB.g; // Green
                        data[i + 2] = oRGB.b; // Blue
                        // Note: The alpha channel (transparency) remains unchanged
                    }
                }

                // Put the modified pixel data back onto the canvas
                context.putImageData(imageData, 0, 0);

                // Draw the checkmark
                oGraphicsPDF.DrawImage(canvas, x, y);
            }
        }
    };

    // /**
    //  * Corrects the positions of symbol.
    //  * @memberof CBaseCheckBoxField
    //  * @typeofeditors ["PDF"]
    //  */
    // CBaseCheckBoxField.prototype.Internal_CorrectContent = function() {
    //     let oPara = this.content.GetElement(0);

    //     this.content.Recalculate_Page(0, true);

    //     // подгоняем размер галочки
    //     let nCharH = this.ProcessAutoFitContent();
        
    //     let oRect = this.getFormRelRect();

    //     oPara.Pr.Spacing.Before = (oRect.H - nCharH) / 2;
    //     oPara.CompiledPr.NeedRecalc = true;
    // };

    // CBaseCheckBoxField.prototype.ProcessAutoFitContent = function() {
    //     let oPara   = this.content.GetElement(0);
    //     let oRun    = oPara.GetElement(0);
    //     let oTextPr = oRun.Get_CompiledPr(true);
    //     let oBounds = this.getFormRelRect();

    //     g_oTextMeasurer.SetTextPr(oTextPr, null);
    //     g_oTextMeasurer.SetFontSlot(AscWord.fontslot_ASCII);

    //     var nTextHeight = g_oTextMeasurer.GetHeight();
    //     var nMaxWidth   = oPara.RecalculateMinMaxContentWidth(false).Max;
    //     var nFontSize   = oTextPr.FontSize;

    //     if (nMaxWidth < 0.001 || nTextHeight < 0.001 || oBounds.W < 0.001 || oBounds.H < 0.001)
    // 	    return nTextHeight;

    //     var nNewFontSize = nFontSize;

    //     nNewFontSize = (oBounds.H / g_dKoef_pt_to_mm) >> 0;
    //     oRun.SetFontSize(nNewFontSize);

    //     oTextPr.FontSize    = nNewFontSize;
    //     oTextPr.FontSizeCS  = nNewFontSize;

    //     g_oTextMeasurer.SetTextPr(oTextPr, null);
    //     g_oTextMeasurer.SetFontSlot(AscWord.fontslot_ASCII);

    //     return g_oTextMeasurer.GetHeight();
    // };
    /**
     * Returns a canvas with origin view (from appearance stream) of current form.
     * @memberof CBaseCheckBoxField
     * @param {boolean} isChecked - wheter to retuns view when checkbox is checked
     * @typeofeditors ["PDF"]
     * @returns {canvas}
     */
    CBaseCheckBoxField.prototype.GetOriginView = function(nAPType, isChecked) {
        if (this._apIdx == -1)
            return null;

        let oViewer = editor.getDocumentRenderer();
        let oFile   = oViewer.file;
        
        let oApearanceInfo  = this.GetOriginViewInfo();

        let canvas  = document.createElement("canvas");
        let nWidth  = oApearanceInfo["w"];
        let nHeight = oApearanceInfo["h"];
        
        canvas.width    = nWidth;
        canvas.height   = nHeight;

        canvas.x    = oApearanceInfo["x"];
        canvas.y    = oApearanceInfo["y"];
        
        let nRetValue, oApInfoTmp;

        switch (nAPType) {
            case APPEARANCE_TYPE.normal:
                oApInfoTmp = oApearanceInfo["N"];
                break;
            case APPEARANCE_TYPE.rollover:
                oApInfoTmp = oApearanceInfo["R"] ? oApearanceInfo["R"] : oApearanceInfo["N"];
                break;
            case APPEARANCE_TYPE.mouseDown:
                oApInfoTmp = oApearanceInfo["D"] ? oApearanceInfo["D"] : oApearanceInfo["N"];
                break;
            default:
                oApInfoTmp = oApearanceInfo["N"];
                break;
        }

        nRetValue = isChecked ? oApInfoTmp["Yes"]["retValue"] : oApInfoTmp["Off"]["retValue"];

        let supportImageDataConstructor = (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isIeEdge) ? false : true;

        let ctx             = canvas.getContext("2d");
        let mappedBuffer    = new Uint8ClampedArray(oFile.memory().buffer, nRetValue, 4 * nWidth * nHeight);
        let imageData       = null;

        if (supportImageDataConstructor)
        {
            imageData = new ImageData(mappedBuffer, nWidth, nHeight);
        }
        else
        {
            imageData = ctx.createImageData(nWidth, nHeight);
            imageData.data.set(mappedBuffer, 0);                    
        }
        if (ctx)
            ctx.putImageData(imageData, 0, 0);
        
        oViewer.file.free(nRetValue);

        return canvas;
    };
    CBaseCheckBoxField.prototype.SetExportValue = function(sValue) {
        this._exportValue = sValue;
    };
    /**
     * Sets the checkbox style
     * @memberof CBaseCheckBoxField
     * @param {number} nType - checkbox style type (CHECKBOX_STYLES)
     * @typeofeditors ["PDF"]
     */
    CBaseCheckBoxField.prototype.SetStyle = function(nType) {
        this._chStyle = nType;
    };
    CBaseCheckBoxField.prototype.SetValue = function(sValue) {
        if (this._exportValue == sValue)
            this.SetChecked(true);
        else
            this.SetChecked(false);
        
        if (editor.getDocumentRenderer().IsOpenFormsInProgress && this.GetParent() == null)
            this.SetApiValue(sValue);
    };
    CBaseCheckBoxField.prototype.GetValue = function() {
        return this.IsChecked() ? this._exportValue : "Off";
    };
    CBaseCheckBoxField.prototype.SetDrawFromStream = function() {
        return;
    };

    /**
     * Set checked to this field (not for all with the same name).
     * @memberof CBaseCheckBoxField
     * @typeofeditors ["PDF"]
     */
    CBaseCheckBoxField.prototype.SetChecked = function(bChecked) {
        if (bChecked == this.IsChecked())
            return;

        this.AddToRedraw();

        if (bChecked) {
            !editor.getDocumentRenderer().isOnUndoRedo && AscCommon.History.Add(new CChangesPDFFormValue(this, this.GetValue(), this._exportValue));
            this._checked = true;
        }
        else {
            !editor.getDocumentRenderer().isOnUndoRedo && AscCommon.History.Add(new CChangesPDFFormValue(this, this.GetValue(), "Off"));
            this._checked = false;
        }
    };
	
    if (!window["AscPDF"])
	    window["AscPDF"] = {};
        
	window["AscPDF"].CBaseCheckBoxField = CBaseCheckBoxField;
	window["AscPDF"].CHECKBOX_STYLES = CHECKBOX_STYLES;
})();

