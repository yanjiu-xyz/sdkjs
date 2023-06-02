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

    //------------------------------------------------------------------------------------------------------------------
	//
	// Internal
	//
	//------------------------------------------------------------------------------------------------------------------

    let FIELDS_HIGHLIGHT = {
        r: 221,
        g: 228,
        b: 255
    }
    let BUTTON_PRESSED = {
        r: 153,
        g: 193,
        b: 218
    }

    let CHECKBOX_STYLES = {
        circle:     0,
        check:      1,
        cross:      2,
        diamond:    3,
        square:     4,
        star:       5
    }
    
    let FIELD_TYPE = {
        button:         "button",
        checkbox:       "checkbox",
        combobox:       "combobox",
        listbox:        "listbox",
        radiobutton:    "radiobutton",
        signature:      "signature",
        text:           "text"
    }

    let FORMS_TRIGGERS_TYPES = {
        MouseUp:    0,
        MouseDown:  1,
        MouseEnter: 2,
        MouseExit:  3,
        OnFocus:    4,
        OnBlur:     5,
        Keystroke:  6,
        Validate:   7,
        Calculate:  8,
        Format:     9
    }

    let ACTIONS_TYPES = {
        JS:     0,
        Reset:  1,
        URI:    2,
        HS:     3, // Hide-Show
        GT:     4, // GoTo
        Named:  5
    }

    let ACTION_NAMED_TYPES = {
        NextPage:   0,
        PrevPage:   1,
        FirstPage:  2,
        LastPage:   3
    }

    let GOTO_TYPES = { // see description in pdf specification (table 151 destination syntax)
        xyz:    0,
        fit:    1,
        fitH:   2,
        fitV:   3,
        fitR:   4,
        fitB:   5,
        fitBH:  6,
        fitBV:  7
    }

    let BORDER_TYPES = {
        solid:      0,
        dashed:     1,
        beveled:    2,
        inset:      3,
        underline:  4
    }

    let LISTBOX_SELECTED_COLOR = {
        r: 153,
        g: 193,
        b: 218
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
    
    //------------------------------------------------------------------------------------------------------------------
	//
	// pdf api types
	//
	//------------------------------------------------------------------------------------------------------------------
    
    let ALIGN_TYPE = {
        left:   0,
        center: 1,
        right:  2
    }

    let APPEARANCE_TYPE = {
        normal:     0,
        rollover:   1,
        mouseDown:  2
    }

    let border = {
        "s": "solid",
        "b": "beveled",
        "d": "dashed",
        "i": "inset",
        "u": "underline"
    }

    let position = {
        "textOnly":   0,
        "iconOnly":   1,
        "iconTextV":  2,
        "textIconV":  3,
        "iconTextH":  4,
        "textIconH":  5,
        "overlay":    6
    }

    let scaleHow = {
        "proportional":   0,
        "anamorphic":     1
    }

    let scaleWhen = {
        "always":     0,
        "never":      1,
        "tooBig":     2,
        "tooSmall":   3
    }

    const CHAR_LIM_MAX = 500; // to do проверить

    let display = {
        "visible":  0,
        "hidden":   1,
        "noPrint":  2,
        "noView":   3
    }

    let color = {};
    Object.defineProperties(color, {
        "transparent":  {
            get() { return [ "T" ] }
        },
        "black": {
            get() { return [ "G", 0 ] }
        },
        "white": {
            get() { return [ "G", 1 ] }
        },
        "red": {
            get() { return [ "RGB", 1,0,0 ] }
        },  
        "green": {
            get() { return [ "RGB", 0,1,0 ] }
        },
        "blue": {
            get() { return [ "RGB", 0, 0, 1 ] }
        }, 
        "cyan": {
            get() { return [ "CMYK", 1,0,0,0 ] }
        }, 
        "magenta": {
            get() { return [ "CMYK", 0,1,0,0 ] }
        },      
        "yellow": {
            get() { return [ "CMYK", 0,0,1,0 ] }
        },       
        "dkGray": {
            get() { return [ "G", 0.25 ] }  // version 4. }
        },       
        "gray": {
            get() { return [ "G", 0.5 ] }   // version 4. }
        }, 
        "ltGray": {
            get() { return [ "G", 0.75 ] }   // version 4. }
        }
    });
    /**
	 * Converts the color space and color values specified by the color object to the specified color space:
     * Conversion to the gray color space is lossy (in the same fashion that displaying a color TV signal on a black-and-white TV is lossy).
     * The conversion of RGB to CMYK does not take into account any black generation or undercolor removal parameters.
	 * @memberof color
     * @param {Array} colorArray - Array of color values.
     * @param {string} cColorspace - The color space to which to convert.
	 * @typeofeditors ["PDF"]
	 * @returns {Array}
	 */
    color.convert = function(colorArray, cColorspace) {
        let nArrLenght = Array.isArray(colorArray) ? colorArray.length : -1;
            if (nArrLenght == -1)
                return ["T"];

        let [fromSpace, ...aComponents] = colorArray;

        // Convert from 'T' (Tint) to 'RGB'
        if (fromSpace === 'T') {
            return ["T"];
        }

        // Convert from 'RGB' to 'T' (Tint)
        if (fromSpace === 'RGB' && cColorspace === 'T') {
            return ["T"];
        }
        if (fromSpace === 'RGB' && cColorspace === 'RGB') {
            let r = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let g = typeof(aComponents[1]) == "number" && aComponents[1] > 0 ? aComponents[1] : 0;
            let b = typeof(aComponents[2]) == "number" && aComponents[2] > 0 ? aComponents[2] : 0;

            return ["RGB", r, g, b];
        }

        // Convert from 'RGB' to 'G' (Grayscale)
        if (fromSpace === 'RGB' && cColorspace === 'G') {
            let r = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let g = typeof(aComponents[1]) == "number" && aComponents[1] > 0 ? aComponents[1] : 0;
            let b = typeof(aComponents[2]) == "number" && aComponents[2] > 0 ? aComponents[2] : 0;

            return ["G", Math.round((r + g + b) / 3)];
        }

        // Convert from 'RGB' to 'CMYK'
        if (fromSpace === 'RGB' && cColorspace === 'CMYK') {
            let r = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let g = typeof(aComponents[1]) == "number" && aComponents[1] > 0 ? aComponents[1] : 0;
            let b = typeof(aComponents[2]) == "number" && aComponents[2] > 0 ? aComponents[2] : 0;

            let k = 1 - Math.max(r, g, b);
            let c = (1 - r - k) / (1 - k);
            let m = (1 - g - k) / (1 - k);
            let y = (1 - b - k) / (1 - k);
            return ["CMYK", c, m, y, k ];
        }

        // Convert from 'G' (Grayscale) to 'T' (Tint)
        if (fromSpace === 'G' && cColorspace === 'T') {
            return ["T"];
        }

        if (fromSpace === 'G' && cColorspace === 'G') {
            let color = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            return ["G", color];
        }

        // Convert from 'G' (Grayscale) to 'RGB'
        if (fromSpace === 'G' && cColorspace === 'RGB') {
            let color = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            return ["RGB", color, color, color];
        }

        // Convert from 'G' (Grayscale) to 'CMYK'
        if (fromSpace === 'G' && cColorspace === 'CMYK') {
            let color = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let k = Math.round((color) / 100);

            return ["CMYK", 0, 0, 0, k ];
        }

        // Convert from 'CMYK' to 'T' (Tint)
        if (fromSpace === 'CMYK' && cColorspace === 'T') {
            return ["T"];
        }

        if (fromSpace === 'CMYK' && cColorspace === 'CMYK') {
            let c = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let m = typeof(aComponents[1]) == "number" && aComponents[1] > 0 ? aComponents[1] : 0;
            let y = typeof(aComponents[2]) == "number" && aComponents[2] > 0 ? aComponents[2] : 0;
            let k = typeof(aComponents[3]) == "number" && aComponents[3] > 0 ? aComponents[3] : 0;

            return ["CMYK", c, m, y, k];
        }

        // Convert from 'CMYK' to 'RGB'
        if (fromSpace === 'CMYK' && cColorspace === 'RGB') {
            let c = typeof(aComponents[0]) == "number" && aComponents[0] > 0 ? aComponents[0] : 0;
            let m = typeof(aComponents[1]) == "number" && aComponents[1] > 0 ? aComponents[1] : 0;
            let y = typeof(aComponents[2]) == "number" && aComponents[2] > 0 ? aComponents[2] : 0;
            let k = typeof(aComponents[3]) == "number" && aComponents[3] > 0 ? aComponents[3] : 0;
            const r = Math.round((1 - c) * (1 - k));
            const g = Math.round((1 - m) * (1 - k));
            const b = Math.round((1 - y) * (1 - k));

            return ["RGB", r, g, b];
        }

        // Convert from 'CMYK' to 'G' (Grayscale)
        if (fromSpace === 'CMYK' && cColorspace === 'G') {
            let k = typeof(aComponents[3]) == "number" && aComponents[3] > 0 ? aComponents[3] : 0;
            let gray = Math.round(1 - k / 100);
            return ["G", gray];
        }

        return ["T"];
    };

    // For Span attributes (start)
    let FONT_STRETCH = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal",
        "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];

    let FONT_STYLE = {
        italic: "italic",
        normal: "normal"
    }

    let FONT_WEIGHT = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    // for CSpan (end)

    
    // please use copy of this object
    let DEFAULT_SPAN = {
        "alignment":        ALIGN_TYPE.left,
        "fontFamily":       ["sans-serif"],
        "fontStretch":      "normal",
        "fontStyle":        "normal",
        "fontWeight":       400,
        "strikethrough":    false,
        "subscript":        false,
        "superscript":      false,
        "text":             "",
        "color":            color["black"],
        "textSize":         12.0,
        "underline":        false
    }

    // Defines how a button reacts when a user clicks it.
    // The four highlight modes supported are:
    let highlight = {
        "n": "none",
        "i": "invert",
        "p": "push",
        "o": "outline"
    }
    
    let LINE_WIDTH = {
        "none":   0,
        "thin":   1,
        "medium": 2,
        "thick":  3
    }

    let VALID_ROTATIONS = [0, 90, 180, 270];

    // Allows the user to set the glyph style of a check box or radio button.
    // The glyph style is the graphic used to indicate that the item has been selected.
    let style = {
        "ch": "check",
        "cr": "cross",
        "di": "diamond",
        "ci": "circle",
        "st": "star",
        "sq": "square"
    }

    const MAX_TEXT_SIZE = 32767;

    // freeze objects
    Object.freeze(FIELDS_HIGHLIGHT);
    Object.freeze(FIELD_TYPE);
    Object.freeze(ALIGN_TYPE);
    Object.freeze(border);
    Object.freeze(position);
    Object.freeze(scaleHow);
    Object.freeze(scaleWhen);
    Object.freeze(FONT_STRETCH);
    Object.freeze(FONT_STYLE);
    Object.freeze(FONT_WEIGHT);
    Object.freeze(highlight);
    Object.freeze(VALID_ROTATIONS);
    Object.freeze(style);
    Object.freeze(FORMS_TRIGGERS_TYPES);

    // base form class with attributes and method for all types of forms
	function CBaseField(sName, sType, nPage, aRect)
    {
        this.type = sType;
        
        this._kids          = [];
        this._borderStyle   = BORDER_TYPES.solid;
        this._delay         = false;
        this._display       = display["visible"];
        this._doc           = null;
        this._fillColor     = [1,1,1];
        this._bgColor       = undefined;          // prop for old versions (fillColor)
        this._hidden        = false;             // This property has been superseded by the display property and its use is discouraged.
        this._lineWidth     = LINE_WIDTH.thin;  // In older versions of this specification, this property was borderWidth
        this._borderWidth   = undefined;       
        this._name          = sName;         // to do
        this._page          = nPage;        // integer | array
        this._print         = true;        // This property has been superseded by the display property and its use is discouraged.
        this._readonly      = false;
        this._rect          = aRect;         // scaled rect
        this._origRect      = [];           // orig rect as in file
        this._required      = false;       // for all except button
        this._rotation      = 0;
        this._strokeColor   = null;     // In older versions of this specification, this property was borderColor. The use of borderColor is now discouraged,
                                        // although it is still valid for backward compatibility.
        this._borderColor   = undefined;
        this._submitName    = "";
        this._textColor     = [0,0,0];
        this._fgColor       = undefined;
        this._textSize      = 10; // 0 == max text size // to do
        this._userName      = ""; // It is intended to be used as tooltip text whenever the cursor enters a field. 
        //It can also be used as a user-friendly name, instead of the field name, when generating error messages.

        this._triggers = new CFormTriggers();

        // internal
        this._id = AscCommon.g_oIdCounter.Get_NewId();

        this.contentRect = {
            X: 0,
            Y: 0,
            W: 0,
            H: 0,
            Page: nPage
        }
        this._formRect = {
            X: 0,
            Y: 0,
            W: 0,
            H: 0,
            Page: nPage
        }

        this._oldContentPos = {X: 0, Y: 0, XLimit: 0, YLimit: 0};
        this._curShiftView = { // смещение, когда мы скролим, т.е. активное смещение
            x: 0,
            y: 0
        }
        this._originShiftView = { // смещение, когда значение формы применено (т.е. форма не активна)
            x: 0,
            y: 0
        }

        this._apIdx = -1; // индекс формы на странице в исходном файле (в массиве метода getInteractiveForms), используется для получения appearance
        
        this.needCommit             = false;
        this._needDrawHighlight     = true;
        this._needDrawHoverBorder   = false;
        this._needRecalc            = true;
        this._wasChanged            = false; // была ли изменена форма
        this._bDrawFromStream       = false; // нужно ли рисовать из стрима

        private_getViewer().ImageMap = {};
        private_getViewer().InitDocument = function() {return};

        this._partialName = sName;
        this.api = this.GetFormApi();
    }
    
    /**
	 * Gets the child field by the specified partial name.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 * @returns {?CBaseField}
	 */
    CBaseField.prototype.GetField = function(sName) {
        for (let i = 0; i < this._kids.length; i++) {
            if (this._kids[i]._partialName == sName)
                return this._kids[i];
        }

        return null;
    };
    CBaseField.prototype.SetNeedCommit = function(bValue) {
        if (private_getViewer().IsOpenFormsInProgress)
            return;

        this.needCommit = bValue;
    };
    CBaseField.prototype.IsNeedCommit = function() {
        return this.needCommit;
    };
    CBaseField.prototype.GetPage = function() {
        return this._page;
    };

    /**
	 * Gets the child field by the specified partial name.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 * @returns {?CBaseField}
	 */
    CBaseField.prototype.AddKid = function(oField) {
        this._kids.push(oField);
        oField._parent = this;
    };
    /**
	 * Removes field from kids.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @param {CBaseField} oField - the field to remove.
	 * @returns {boolean} - returns false if field isn't in the field kids.
	 */
    CBaseField.prototype.RemoveKid = function(oField) {
        let nIndex = this._kids.indexOf(oField);
        if (nIndex != -1) {
            this._kids.splice(nIndex, 1);
            oField._parent = null;
            return true;
        }

        return false;
    };

    CBaseField.prototype.GetDocContent = function() {
        return this.content;
    };

    CBaseField.prototype.getFormRelRect = function()
    {
        return this.contentRect;
    };
    CBaseField.prototype.getFormRect = function()
    {
        return this._formRect;
    };
    
    CBaseField.prototype.IntersectWithRect = function(X, Y, W, H)
    {
        let oViewer     = private_getViewer();
        var arrRects    = [];
        var oBounds     = this.getFormRelRect();

        let nPageIndX = oViewer.pageDetector.pages[0].x / AscCommon.AscBrowser.retinaPixelRatio * g_dKoef_pix_to_mm;
        let nPageIndY = oViewer.pageDetector.pages[0].y / AscCommon.AscBrowser.retinaPixelRatio * g_dKoef_pix_to_mm;

        var nLeft   = Math.max(X, oBounds.X) + nPageIndX / oViewer.zoom;
        var nRight  = Math.min(X + W, oBounds.X + oBounds.W) + nPageIndX / oViewer.zoom;
        var nTop    = Math.max(Y, oBounds.Y) + nPageIndY / oViewer.zoom;
        var nBottom = Math.min(Y + H, oBounds.Y + oBounds.H) + nPageIndY / oViewer.zoom;

        if (nLeft < nRight && nTop < nBottom)
        {
            arrRects.push({
                X : nLeft,
                Y : nTop,
                W : nRight - nLeft,
                H : nBottom - nTop
            });
        }

        return arrRects;
    };
    CBaseField.prototype.GetFullName = function() {
        if (this._parent)
        {
            if (this._partialName != "")
                return `${this._parent.GetFullName()}.${this._partialName}`
            else
                return this._parent.GetFullName();
        }

        return this._partialName ? this._partialName : "";
    };
    /**
	 * Sets the action of the field for a given trigger.
     * Note: This method will overwrite any action already defined for the chosen trigger.
	 * @memberof CBaseField
     * @param {number} nTriggerType - A string that sets the trigger for the action. (FORMS_TRIGGERS_TYPES)
	 * @param {Array} aActionsInfo - array with actions info for specified trigger. (info from openForms method)
     * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetActionsOnOpen = function(nTriggerType, aActionsInfo) {
        let oDocument = this.GetDocument();
        let aActions = [];
        for (let i = 0; i < aActionsInfo.length; i++) {
            let oAction;
            let aFields = [];
            switch (aActionsInfo[i]["S"]) {
                case "JavaScript":
                    oAction = new CActionRunScript(aActionsInfo[i]["JS"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case "ResetForm":
                    oAction = new CActionReset(aFields, aActionsInfo[i]["Fields"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case "URI":
                    oAction = new CActionURI(aActionsInfo[i]["URI"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case "Hide":
                    oAction = new CActionHideShow(Boolean(aActionsInfo[i]["H"]), aActionsInfo[i]["T"]);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case "GoTo":
                    let oRect = {
                        top:    aActionsInfo[i]["top"],
                        right:  aActionsInfo[i]["right"],
                        bottom: aActionsInfo[i]["bottom"],
                        left:   aActionsInfo[i]["left"]
                    }
                    if (aActionsInfo[i]["bottom"] != null && aActionsInfo[i]["top"] != null) {
                        oRect.top = aActionsInfo[i]["bottom"];
                        oRect.bottom = aActionsInfo[i]["top"];
                    }

                    oAction = new CActionGoTo(aActionsInfo[i]["page"], aActionsInfo[i]["kind"], aActionsInfo[i]["zoom"], oRect);
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
                case "Named":
                    oAction = new CActionNamed(CActionNamed.GetInternalType(aActionsInfo[i]["N"]));
                    aActions.push(oAction);
                    oAction.SetField(this);
                    break;
            }
        }

        switch (nTriggerType) {
            case FORMS_TRIGGERS_TYPES.MouseUp:
                this._triggers.MouseUp = new CFormTrigger(FORMS_TRIGGERS_TYPES.MouseUp, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.MouseDown:
                this._triggers.MouseDown = new CFormTrigger(FORMS_TRIGGERS_TYPES.MouseDown, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.MouseEnter:
                this._triggers.MouseEnter = new CFormTrigger(FORMS_TRIGGERS_TYPES.MouseEnter, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.MouseExit:
                this._triggers.MouseExit = new CFormTrigger(FORMS_TRIGGERS_TYPES.MouseExit, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.OnFocus:
                this._triggers.OnFocus = new CFormTrigger(FORMS_TRIGGERS_TYPES.OnFocus, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.OnBlur:
                this._triggers.OnBlur = new CFormTrigger(FORMS_TRIGGERS_TYPES.OnBlur, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.Keystroke:
                this._triggers.Keystroke = new CFormTrigger(FORMS_TRIGGERS_TYPES.Keystroke, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.Validate:
                this._triggers.Validate = new CFormTrigger(FORMS_TRIGGERS_TYPES.Validate, aActions);
                break;
            case FORMS_TRIGGERS_TYPES.Calculate:
                this._triggers.Calculate = new CFormTrigger(FORMS_TRIGGERS_TYPES.Calculate, aActions);
                oDocument.GetCalculateInfo().AddToCalculateField(this); // при изменения любого поля вызывает Calculcate действие у всех полей
                break;
            case FORMS_TRIGGERS_TYPES.Format:
                this._triggers.Format = new CFormTrigger(FORMS_TRIGGERS_TYPES.Format, aActions);
                break;
        }

        aActions.forEach(function(oAction) {
            oAction.SetTrigger(nTriggerType);
        });

        return aActions;
    };
    /**
	 * Gets the JavaScript action of the field for a given trigger.
	 * @memberof CBaseField
     * @param {number} nType - A string that sets the trigger for the action. (FORMS_TRIGGERS_TYPES)
	 * @typeofeditors ["PDF"]
     * @returns {CFormTrigger}
	 */
    CBaseField.prototype.GetTrigger = function(nType) {
        switch (nType) {
            case FORMS_TRIGGERS_TYPES.MouseUp:
                return this._triggers.MouseUp;
            case FORMS_TRIGGERS_TYPES.MouseDown:
                return this._triggers.MouseDown;
            case FORMS_TRIGGERS_TYPES.MouseEnter:
                return this._triggers.MouseEnter;
            case FORMS_TRIGGERS_TYPES.MouseExit:
                return this._triggers.MouseExit;
            case FORMS_TRIGGERS_TYPES.OnFocus:
                return this._triggers.OnFocus;
            case FORMS_TRIGGERS_TYPES.OnBlur:
                return this._triggers.OnBlur;
            case FORMS_TRIGGERS_TYPES.Keystroke:
                return this._triggers.Keystroke;
            case FORMS_TRIGGERS_TYPES.Validate:
                return this._triggers.Validate;
            case FORMS_TRIGGERS_TYPES.Calculate:
                return this._triggers.Calculate;
            case FORMS_TRIGGERS_TYPES.Format:
                return this._triggers.Format;
        }

        return null;
    };

    CBaseField.prototype.GetDocument = function() {
        return this._doc;
    };

    /**
	 * Gets form value (which was commited).
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.GetApiValue = function() {
        return this._value;
    };
    /**
	 * Sets api value of form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.SetApiValue = function(value) {
        this._value = value;
    };

    /**
     * Does the actions setted for specifed trigger type.
	 * @memberof CBaseField
     * @param {number} nType - trigger type (FORMS_TRIGGERS_TYPES)
	 * @typeofeditors ["PDF"]
     * @returns {canvas}
	 */
    CBaseField.prototype.AddActionsToQueue = function(nType) {
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();
        let oTrigger        = this.GetTrigger(nType);
        
        if (oTrigger && oTrigger.Actions.length > 0) {
            oActionsQueue.AddActions(oTrigger.Actions);
            oActionsQueue.Start();
        }
    };

    /**
     * Does the actions setted for specifed trigger type.
	 * @memberof CBaseField
     * @param {number} nType - trigger type (FORMS_TRIGGERS_TYPES)
	 * @typeofeditors ["PDF"]
     * @returns {canvas}
	 */
    CBaseField.prototype.DoActions = function(nType) {
        let oTrigger = this.GetTrigger(nType);

        if (oTrigger && oTrigger.Actions.length > 0) {
            for (let i = 0; i < oTrigger.Actions.length; i++) {
                oTrigger.Actions[i].Do();
            }
        }
    };

    CBaseField.prototype.DrawHighlight = function(oCtx) {
        if (this.IsHidden() == true)
            return;

        let oViewer = private_getViewer();
        let nScale  = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

        let X       = this._pagePos.x * nScale >> 0;
        let Y       = this._pagePos.y * nScale >> 0;
        let nWidth  = (this._pagePos.w) * nScale >> 0;
        let nHeight = (this._pagePos.h) * nScale >> 0;
        
        if (this.type == "radiobutton" && this._chStyle == CHECKBOX_STYLES.circle) {
            oCtx.beginPath();
            oCtx.fillStyle = `rgb(${FIELDS_HIGHLIGHT.r}, ${FIELDS_HIGHLIGHT.g}, ${FIELDS_HIGHLIGHT.b})`;
            // выставляем в центр круга
            let centerX = X + nWidth / 2;
            let centerY = Y + nHeight / 2;
            let nRadius = Math.min(nWidth / 2, nHeight / 2);
            oCtx.arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
            oCtx.fill();
            oCtx.closePath();
        }
        else if (this.type == "button" && this._buttonPressed) {
            oCtx.beginPath();
            oCtx.fillStyle = `rgb(${BUTTON_PRESSED.r}, ${BUTTON_PRESSED.g}, ${BUTTON_PRESSED.b})`;
            oCtx.fillRect(X, Y, nWidth, nHeight);
            oCtx.closePath();
        }
        else if (this.type != "button"){
            oCtx.beginPath();
            oCtx.fillStyle = `rgb(${FIELDS_HIGHLIGHT.r}, ${FIELDS_HIGHLIGHT.g}, ${FIELDS_HIGHLIGHT.b})`;
            oCtx.fillRect(X, Y, nWidth, nHeight);
            oCtx.closePath();
        }
    };
    CBaseField.prototype.DrawBorders = function() {
        let oViewer     = private_getViewer();
        let aRect       = this.GetRect();
        let aOringRect  = this.GetOrigRect();

        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let nLineWidth  = aRect[0] / aOringRect[0] * nScale * this._lineWidth;
        let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;

        if (nLineWidth == 0) {
            return;
        }

        oGraphicsPDF.SetLineWidth(nLineWidth);

        let X       = this._pagePos.x * nScale >> 0;
        let Y       = this._pagePos.y * nScale >> 0;
        let nWidth  = this._pagePos.w * nScale >> 0;
        let nHeight = this._pagePos.h * nScale >> 0;

        let color;
        if (this._strokeColor != null) {
            color = this.GetRGBColor(this._strokeColor);
            oGraphicsPDF.SetStrokeStyle(`rgb(${color.r}, ${color.g}, ${color.b})`);
        }

        if (this.type == "radiobutton" && this._chStyle == CHECKBOX_STYLES.circle) {
            // выставляем в центр круга
            let centerX = X + nWidth / 2;
            let centerY = Y + nHeight / 2;
            let nRadius = Math.min(nWidth / 2, nHeight / 2) - nLineWidth / 2;

            // отрисовка
            switch (this._borderStyle) {
                case BORDER_TYPES.solid:
                case BORDER_TYPES.underline:
                    if (color == null)
                        break;
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.beveled:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                        oGraphicsPDF.Stroke();
                        oGraphicsPDF.ClosePath();
                    }

                    // right semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, - Math.PI / 4, 3 * Math.PI / 4, false);
                    oGraphicsPDF.SetStrokeStyle("rgb(140, 151, 192)");
                    oGraphicsPDF.Stroke();
                    oGraphicsPDF.ClosePath();
                    
                    // left semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, 3 * Math.PI / 4, - Math.PI / 4, false);
                    oGraphicsPDF.SetStrokeStyle("#fff");
                    oGraphicsPDF.Stroke();
                    oGraphicsPDF.ClosePath();
                    break;
                case BORDER_TYPES.dashed:
                    if (color == null)
                        break;

                    oGraphicsPDF.SetLineDash([5 * oViewer.zoom]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.inset:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                        oGraphicsPDF.Stroke();
                        oGraphicsPDF.ClosePath();
                    }
                    
                    // right semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, - Math.PI / 4, 3 * Math.PI / 4, false);
                    oGraphicsPDF.SetStrokeStyle("rgb(191, 191, 191)");
                    oGraphicsPDF.Stroke();
                    oGraphicsPDF.ClosePath();
                    
                    // left semicircle
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Arc(centerX, centerY, nRadius - nLineWidth, 3 * Math.PI / 4, - Math.PI / 4, false);
                    oGraphicsPDF.SetStrokeStyle("gray");
                    oGraphicsPDF.Stroke();
                    oGraphicsPDF.ClosePath();

                    break;
            }

            return;
        }
        else {
            // корректировка координат по бордеру
            switch (this._borderStyle) {
                case BORDER_TYPES.solid:
                case BORDER_TYPES.dashed:
                    Y += nLineWidth / 2;
                    X += nLineWidth / 2;
                    nWidth  -= nLineWidth;
                    nHeight -= nLineWidth;

                    break;
                case BORDER_TYPES.beveled:
                    Y += nLineWidth / 2;
                    X += nLineWidth / 2;
                    nWidth  -= nLineWidth;
                    nHeight -= nLineWidth;
                    break;
                case BORDER_TYPES.inset:
                    Y += nLineWidth / 2;
                    X += nLineWidth / 2;
                    nWidth  -= nLineWidth;
                    nHeight -= nLineWidth;
                    break;
                case BORDER_TYPES.underline:
                    Y -= nLineWidth / 2;
                    //nWidth /= 2;
                    break;
            }
            
            // отрисовка
            switch (this._borderStyle) {
                case BORDER_TYPES.solid:
                    if (color == null)
                        break;
                        
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                    oGraphicsPDF.Stroke();
                    oGraphicsPDF.ClosePath();
                    break;
                case BORDER_TYPES.beveled:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                        oGraphicsPDF.Stroke();
                        oGraphicsPDF.ClosePath();
                    }
                    
                    // left part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("#fff");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // top part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("#fff");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // bottom part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("rgb(192, 192, 192)");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // right part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);

                    oGraphicsPDF.SetFillStyle("rgb(192, 192, 192)");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    break;
                case BORDER_TYPES.dashed:
                    if (color == null)
                        break;

                    oGraphicsPDF.SetLineDash([5 * oViewer.zoom]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                    oGraphicsPDF.Stroke();
                    break;
                case BORDER_TYPES.inset:
                    if (color) {
                        oGraphicsPDF.SetLineDash([]);
                        oGraphicsPDF.BeginPath();
                        oGraphicsPDF.Rect(X, Y, nWidth, nHeight);
                        oGraphicsPDF.Stroke();
                        oGraphicsPDF.ClosePath();
                    }

                    // left part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth + nLineWidth / 2, Y + nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("gray");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // top part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("gray");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // bottom part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nLineWidth + nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth - nLineWidth / 2);

                    oGraphicsPDF.SetFillStyle("rgb(191, 191, 191)");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    // right part
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nLineWidth + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    
                    oGraphicsPDF.MoveTo(X + nWidth - nLineWidth / 2, Y + nLineWidth / 2);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth / 2, Y + nHeight - nLineWidth);
                    oGraphicsPDF.LineTo(X + nWidth - nLineWidth - nLineWidth / 2, Y + nHeight - nLineWidth);

                    oGraphicsPDF.SetFillStyle("rgb(191, 191, 191)");
                    oGraphicsPDF.ClosePath();
                    oGraphicsPDF.Fill();

                    break;
                case BORDER_TYPES.underline:
                    if (color == null)
                        break;
                        
                    oGraphicsPDF.SetLineDash([]);
                    oGraphicsPDF.BeginPath();
                    oGraphicsPDF.MoveTo(X, Y + nHeight);
                    oGraphicsPDF.LineTo(X + nWidth, Y + nHeight);
                    oGraphicsPDF.Stroke();
                    break;
            }
        }

        // draw comb cells
        if (this._borderColor != null && (this._borderStyle == BORDER_TYPES.solid || this._borderStyle == BORDER_TYPES.dashed) && (this.type == "text" && this._comb == true)) {
            let nCombWidth = (nWidth / this._charLimit);
            let nIndentX = nCombWidth;
            
            for (let i = 0; i < this._charLimit - 1; i++) {
                oGraphicsPDF.MoveTo(X + nIndentX, Y);
                oGraphicsPDF.LineTo(X + nIndentX, Y + nHeight);
                oGraphicsPDF.Stroke();
                nIndentX += nCombWidth;
            }
        }
    };
    /**
	 * Gets rgb color object from internal color array.
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
     * @returns {object}
	 */
    CBaseField.prototype.GetRGBColor = function(oInternalColor) {
        let oColor = {};

        if (oInternalColor.length == 1) {
            oColor = {
                r: oInternalColor[0] * 255,
                g: oInternalColor[0] * 255,
                b: oInternalColor[0] * 255
            }
        }
        else if (oInternalColor.length == 3) {
            oColor = {
                r: oInternalColor[0] * 255,
                g: oInternalColor[1] * 255,
                b: oInternalColor[2] * 255
            }
        }
        else if (oInternalColor.length == 4) {
            function cmykToRgb(c, m, y, k) {
                return {
                    r: Math.round(255 * (1 - c) * (1 - k)),
                    g: Math.round(255 * (1 - m) * (1 - k)),
                    b: Math.round(255 * (1 - y) * (1 - k))
                }
            }

            oColor = cmykToRgb(oInternalColor[0], oInternalColor[1], oInternalColor[2], oInternalColor[3]);
        }

        return oColor;
    };

    CBaseField.prototype.DrawHoverBorder = function() {
        return;

        let oViewer     = private_getViewer();
        let nScale      = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

        let X       = this._pagePos.x * nScale >> 0;
        let Y       = this._pagePos.y * nScale >> 0;
        let nWidth  = this._pagePos.w * nScale >> 0;
        let nHeight = this._pagePos.h * nScale >> 0;

        oCtx.globalAlpha = 1;
        oCtx.setLineDash([]);
        oCtx.strokeStyle = "rgb(0, 0, 0)";
        oCtx.lineWidth = Math.max(nScale, 1);
        
        oCtx.beginPath();
        oCtx.rect(X, Y, nWidth, nHeight);
        oCtx.stroke();
        oCtx.closePath();
    };
    
    CBaseField.prototype.Get_Id = function() {
        return this._id;
    };
    CBaseField.prototype.SetNeedRecalc = function(bRecalc) {
        if (bRecalc == false) {
            this._needRecalc = false;
        }
        else {
            this._needRecalc = true;
            this.AddToRedraw();
        }
    };
    CBaseField.prototype.IsNeedRecalc = function() {
        return this._needRecalc;
    };
    CBaseField.prototype.SetWasChanged = function(isChanged) {
        this._wasChanged = isChanged;
        this.SetDrawFromStream(!isChanged);
    };
    CBaseField.prototype.IsChanged = function() {
        return this._wasChanged;  
    };
    CBaseField.prototype.IsNeedDrawFromStream = function() {
        return this._bDrawFromStream;
    };
    CBaseField.prototype.SetDrawFromStream = function(bFromStream) {
        this._bDrawFromStream = bFromStream;
    };
    CBaseField.prototype.SetDrawHighlight = function(bDraw) {
        this._needDrawHighlight = bDraw;
    };
    CBaseField.prototype.IsNeedDrawHighlight = function() {
        return this._needDrawHighlight;
    };

    CBaseField.prototype.AddToRedraw = function() {
        let oViewer = private_getViewer();
        oViewer.pagesInfo.pages[this.GetPage()].needRedrawForms = true;
    };

    CBaseField.prototype.GetType = function() {
        return this.type;
    };

    CBaseField.prototype.SetReadOnly = function(bReadOnly) {
        this._readonly = bReadOnly;
    };
    
    CBaseField.prototype.SetRequired = function(bRequired) {
        if (this.type != "button")
            this._required = bRequired;
    };
    CBaseField.prototype.SetBorderColor = function(aColor) {
        this._strokeColor = this._borderColor = aColor;
    };
    CBaseField.prototype.SetBackgroundColor = function(aColor) {
        this._fillColor = this._bgColor = aColor;
    };
    CBaseField.prototype.SetHidden = function(bHidden) {
        if (this._hidden != bHidden) {
            this._hidden = bHidden;
        }
    };
    CBaseField.prototype.IsHidden = function() {
        return this._hidden;
    };

    CBaseField.prototype.GetDefaultValue = function() {
        return this._defaultValue;
    };
    CBaseField.prototype.SetDefaultValue = function(value) {
        this._defaultValue = value;
    };

    /**
	 * Sets default value for form.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.Reset = function() {
        if (this.GetValue() != this.GetDefaultValue()) {
            this.SetValue(this.GetDefaultValue());
            this.AddToRedraw();
        }
    };

    CBaseField.prototype.DrawBackground = function() {
        let oViewer = private_getViewer();
        let oGraphicsPDF = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;

        if (this._fillColor) {
            let nScale = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

            let X       = this._pagePos.x * nScale >> 0;
            let Y       = this._pagePos.y * nScale >> 0;
            let nWidth  = (this._pagePos.w) * nScale >> 0;
            let nHeight = (this._pagePos.h) * nScale >> 0;

            oGraphicsPDF.SetGlobalAlpha(1);
            let oColor = this.GetRGBColor(this._fillColor);
            if (oColor.r != 255 || oColor.g != 255 || oColor.b != 255) {
                oGraphicsPDF.SetFillStyle(`rgb(${oColor.r}, ${oColor.g}, ${oColor.b})`);
                oGraphicsPDF.FillRect(X, Y, nWidth, nHeight);
            }
        }
    };

    /**
	 * Gets Api class for this form.
	 * @memberof CTextField
     * @param {number} nIdx - The 0-based index of the item in the list or -1 for the last item in the list.
     * @param {boolean} [bExportValue=true] - Specifies whether to return an export value.
	 * @typeofeditors ["PDF"]
     * @returns {ApiBaseField}
	 */
    CBaseField.prototype.GetFormApi = function() {
        if (this.api)
            return this.api;

        switch (this.type) {
            case "text":
                return new AscPDFEditor.ApiTextField(this);
            case "combobox":
                return new AscPDFEditor.ApiComboBoxField(this);
            case "listbox":
                return new AscPDFEditor.ApiListBoxField(this);
            case "checkbox":
                return new AscPDFEditor.ApiCheckBoxField(this);
            case "radiobutton":
                return new AscPDFEditor.ApiRadioButtonField(this);
            case "button":
                return new AscPDFEditor.ApiPushButtonField(this);
        }
    };

    function CPushButtonField(sName, nPage, aRect)
    {
        CBaseField.call(this, sName, FIELD_TYPE.button, nPage, aRect);

        this._buttonAlignX      = 50; // must be integer
        this._buttonAlignY      = 50; // must be integer
        this._buttonFitBounds   = undefined;
        this._buttonPosition    = position["textOnly"];
        this._buttonScaleHow    = undefined;
        this._highlight         = highlight["p"];
        this._textFont          = "ArialMT";

        this._buttonCaption     = undefined;
        this._downCaption       = undefined;
        this._rollOverCaption   = undefined;

        this._buttonPressed = false;

        // internal
        TurnOffHistory();
        this.content           = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        this.content.ParentPDF = this;
        this.content.SetUseXLimit(false);
        this.content.MoveCursorToStartPos();

        this.SetAlign(ALIGN_TYPE.center);

        this._captionRun            = null;
        this._downCaptionRun        = null;
        this._rollOverCaptionRun    = null; 
    }
    CPushButtonField.prototype = Object.create(CBaseField.prototype);
	CPushButtonField.prototype.constructor = CPushButtonField;
    CPushButtonField.prototype.AddImage = function(oImgData) {
		if (!oImgData || this._buttonPosition == position["textOnly"]) {
			return;
		}
		const oHTMLImg = oImgData.Image; m
		if (!oHTMLImg || oHTMLImg.width === 0 || oHTMLImg.height === 0 || this._buttonPosition == position["textOnly"]) {
			return;
		}

        let oExistDrawing = this.GetDrawing();
        if (oExistDrawing) {
            oExistDrawing.PreDelete();
            var oParentRun = oExistDrawing.GetRun();
            oParentRun.RemoveElement(oExistDrawing);

            let oFirstRun = this.content.GetElement(0).GetElement(0);
            let oRunElm = oFirstRun.GetElement(oFirstRun.GetElementsCount() - 1);
            // удаляем таб
            if (oRunElm && true ==  oRunElm.IsTab()) {
                oFirstRun.RemoveFromContent(oFirstRun.GetElementsCount() - 1, 1);
            }
        }
        
		const dImgW = Math.max((oHTMLImg.width * AscCommon.g_dKoef_pix_to_mm), 1);
		const dImgH = Math.max((oHTMLImg.height * AscCommon.g_dKoef_pix_to_mm), 1);
		const oRect = this.getFormRelRect();
        let nContentWidth;
        switch (this._buttonPosition) {
            case position["iconTextH"]:
            case position["textIconH"]:
                nContentWidth = this.content.GetElement(0).GetContentWidthInRange();
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
		const dDrawingW = dCoef*dImgW;
		const dDrawingH = dCoef*dImgH;
		const oDrawing  = new AscCommonWord.ParaDrawing(dDrawingW, dDrawingH, null, this.content.DrawingDocument, this.content, null);
		oDrawing.Set_WrappingType(WRAPPING_TYPE_SQUARE);
        oDrawing.Set_DrawingType(drawing_Inline);
        
        let oShapeTrack = new AscFormat.NewShapeTrack("rect", 0, 0, this.content.Get_Theme(), null, null, null, 0);
		oShapeTrack.track({}, dDrawingW, dDrawingH);
		let oShape = oShapeTrack.getShape(true, this.content.DrawingDocument, null);
		oShape.setParent(oDrawing);
		oDrawing.Set_GraphicObject(oShape);
        var oBodyPr = new AscFormat.CBodyPr();
        oBodyPr.setAnchor(1);
        oShape.setBodyPr(oBodyPr);
		oShape.createTextBoxContent();
        oShape.textBoxContent.SetParagraphAlign(AscCommon.align_Center);
        oShape.textBoxContent.Content[0].Set_DocumentIndex(0);
        
        let oFill   = new AscFormat.CUniFill();
        oFill.fill  = new AscFormat.CBlipFill();
        oFill.fill.setRasterImageId(oImgData.src);
        oFill.fill.tile     = null;
        oFill.fill.srcRect  = null;
        oFill.fill.stretch  = true;
        oFill.convertToPPTXMods();
        oShape.setFill(oFill);

		//oShape.spPr.setFill(oFill.UniFill);
		oShape.spPr.setLn(new AscFormat.CreateNoFillLine());

        let oRunForImg;
        let nContentH = this.content.Get_EmptyHeight();
        let oTargetPara;
        switch (this._buttonPosition) {
            case position["iconOnly"]:
                oRunForImg = this.content.GetElement(0).GetElement(0);
                break;
            case position["iconTextV"]:
                oRunForImg = this.content.GetElement(0).GetElement(0);
                break;
            case position["textIconV"]:
                oRunForImg = this.content.GetElement(1).GetElement(0);
                break;
            case position["iconTextH"]:
                oTargetPara = this.content.GetElement(0);
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
                oTargetPara = this.content.GetElement(0);
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
                oTargetPara = this.content.GetElement(0);
                oTargetPara.Remove_FromContent(0, oTargetPara.GetElementsCount(), true);
                oTargetPara.CorrectContent();
                oRunForImg = oTargetPara.GetElement(0);

                if (this._buttonCaption) {
                    let oShapeCont = oShape.getDocContent();
                    let oCaptionRun = oShapeCont.GetElement(0).GetElement(0);
                    oCaptionRun.AddText(this._buttonCaption);
                }
                break;
        }

        oRunForImg.Add_ToContent(oRunForImg.Content.length, oDrawing);
        oDrawing.Set_Parent(oRunForImg);

        oShape.recalculate();
        oShape.recalculateText();

		this.SetNeedRecalc(true);
        this.SetWasChanged(true);

        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();
        oActionsQueue.Continue();
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
                    this.SetAlign(ALIGN_TYPE.right);
                else if (this._buttonPosition == position["textIconH"])
                    this.SetAlign(ALIGN_TYPE.left);

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

            let oContentH       = oContentBounds.Bottom - oContentBounds.Top;

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
    CPushButtonField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer = private_getViewer();
        let aRect   = this.GetRect();
        let oGraphicsWord = oViewer.pagesInfo.pages[this.GetPage()].graphics.word;
        
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

        let oMargins = this.GetMarginsFromBorders(false, false);
        
        let contentX = (X + 2 * oMargins.left) * g_dKoef_pix_to_mm;
        let contentY = (Y + 2 * oMargins.top) * g_dKoef_pix_to_mm;
        let contentXLimit = (X + nWidth - 2 * oMargins.left) * g_dKoef_pix_to_mm;
        let contentYLimit = (Y + nHeight - 2 * oMargins.bottom) * g_dKoef_pix_to_mm;
        
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

        oGraphicsWord.AddClipRect(this.content.X, this.content.Y, this.content.XLimit - this.content.X, contentYLimit - contentY);
        this.content.Draw(0, oGraphicsWord);
        // redraw target cursor if field is selected
        if (oViewer.activeForm == this && this.content.IsSelectionUse() == false && (oViewer.fieldFillingMode || this.type == "combobox"))
            this.content.RecalculateCurPos();
        
        oGraphicsWord.RemoveClip();
    };
    CPushButtonField.prototype.onMouseDown = function() {
        let oViewer         = private_getViewer();
        this._buttonPressed = true; // флаг что нужно рисовать нажатие

        oViewer._paintFormsHighlight();

        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);
        oViewer.activeForm = this;
    };
    CPushButtonField.prototype.onMouseUp = function() {
        let oViewer         = private_getViewer();
        this._buttonPressed = false; // флаг что нужно рисовать нажатие

        oViewer._paintFormsHighlight();
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseUp);
    };
    CPushButtonField.prototype.buttonImportIcon = function() {
        let Api = editor;
        let oThis = this;

        let oActionsQueue = this.GetDocument().GetActionsQueue();
        if (oActionsQueue instanceof CActionRunScript)
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
    /**
	 * Controls how the text and the icon of the button are positioned with respect to each other within the button face. The
     * convenience position object defines all of the valid alternatives..
	 * @memberof CPushButtonField
     * @param {number} nType
	 * @typeofeditors ["PDF"]
	 */
    CPushButtonField.prototype.SetLayout = function(nType) {
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
            if (this._buttonCaption) {
                oPara = this.content.GetElement(0);
                oPara.ClearContent();
                oPara.CheckParaEnd();
                oPara.GetElement(0).AddText(this._buttonCaption);
                this._captionRun = oPara.GetElement(0);
            }
        }
    };
    CPushButtonField.prototype.SetIconOnly = function() {
        if (this._buttonPosition == position["iconOnly"])
            return;

        this._buttonPosition = position["iconOnly"];

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

            let nPosInPara;
            for (let oRun of aRunForDel) {
                oRun.PreDelete();
                nPosInPara = oPara.Content.indexOf(oRun);
                oPara.Remove_FromContent(nPosInPara, 1, true);
            }
            oPara.CorrectContent();
        }
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
        }

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
        }

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

        if (this._buttonCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(this._buttonCaption);
            oPara.Add_ToContent(oPara.Content.length - 1, oTmpRun);
        }

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

        if (this._buttonCaption) {
            oTmpRun = new ParaRun(oPara, false);
            oTmpRun.AddText(this._buttonCaption);
            oPara.Add_ToContent(0, oTmpRun);
        }
        
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
        for (let oRun of aRunForDel) {
            oRun.PreDelete();
            nPosInPara = oPara.Content.indexOf(oRun);
            oPara.Remove_FromContent(nPosInPara, 1, true);
        }
        oPara.CorrectContent();

        let oDrawing = this.GetDrawing();
        if (oDrawing && this._buttonCaption) {
            let oShapeCont = oDrawing.GraphicObj.getDocContent();
            oTmpRun = oShapeCont.GetElement(0).GetElement(0);
            oTmpRun.AddText(this._buttonCaption);
        }

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

        if (true != private_getViewer().isOnUndoRedo) {
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

    function CBaseCheckBoxField(sName, sType, nPage, aRect)
    {
        CBaseField.call(this, sName, sType, nPage, aRect);

        this._value         = "Off";
        this._exportValue   = "Yes";
        this._chStyle       = CHECKBOX_STYLES.check;

        //this.content = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        //this.content.ParentPDF = this;
        //this.content.MoveCursorToStartPos();

        //this.SetAlign(ALIGN_TYPE.center);
    };
    
    CBaseCheckBoxField.prototype = Object.create(CBaseField.prototype);
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
        return this._value == this._exportValue;
    };
    CBaseCheckBoxField.prototype.DrawCheckedSymbol = function() {
        let oViewer         = private_getViewer();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;

        let X       = this._pagePos.x * nScale >> 0;
        let Y       = this._pagePos.y * nScale >> 0;
        let nWidth  = this._pagePos.w * nScale >> 0;
        let nHeight = this._pagePos.h * nScale >> 0;

        let oMargins = this.GetMarginsFromBorders(true, false);

        oGraphicsPDF.SetLineWidth(nScale);
        oGraphicsPDF.SetLineDash([]);

        switch (this._chStyle) {
            case CHECKBOX_STYLES.circle: {
                let centerX = X + nWidth / 2;
                let centerY = Y + nHeight / 2;
                let nRadius = Math.min(nWidth / 4 - oMargins.left / 2, nHeight / 4 - oMargins.top / 2);
                oGraphicsPDF.BeginPath();
                oGraphicsPDF.Arc(centerX, centerY, nRadius, 0, 2 * Math.PI, false);
                oGraphicsPDF.SetFillStyle("black");
                oGraphicsPDF.Fill();
                oGraphicsPDF.ClosePath();
                break;
            }
                
            case CHECKBOX_STYLES.cross: {
                let x = nWidth > nHeight ? X + (nWidth - nHeight) / 2 : X;
                let y = nHeight > nWidth ? Y + (nHeight - nWidth) / 2 : Y;
                let w = Math.min(nWidth, nHeight);
                oGraphicsPDF.SetStrokeStyle("black");


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

                oGraphicsPDF.SetFillStyle("black");
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
                oGraphicsPDF.SetFillStyle("black");
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
                oGraphicsPDF.SetFillStyle("black");
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

                
                // Draw the checkmark
                oGraphicsPDF.DrawImage(CHECKED_ICON, 0, 0, imgW, imgH, x, y, wScaled, hScaled);
            }
        }
    };

    /**
	 * Corrects the positions of symbol.
	 * @memberof CBaseCheckBoxField
	 * @typeofeditors ["PDF"]
	 */
    CBaseCheckBoxField.prototype.Internal_CorrectContent = function() {
        let oPara = this.content.GetElement(0);

        this.content.Recalculate_Page(0, true);

        // подгоняем размер галочки
        let nCharH = this.ProcessAutoFitContent();
        
        let oRect = this.getFormRelRect();

        oPara.Pr.Spacing.Before = (oRect.H - nCharH) / 2;
        oPara.CompiledPr.NeedRecalc = true;
    };

    CBaseCheckBoxField.prototype.ProcessAutoFitContent = function() {
        let oPara   = this.content.GetElement(0);
        let oRun    = oPara.GetElement(0);
        let oTextPr = oRun.Get_CompiledPr(true);
        let oBounds = this.getFormRelRect();

        g_oTextMeasurer.SetTextPr(oTextPr, null);
	    g_oTextMeasurer.SetFontSlot(AscWord.fontslot_ASCII);

        var nTextHeight = g_oTextMeasurer.GetHeight();
	    var nMaxWidth   = oPara.RecalculateMinMaxContentWidth(false).Max;
	    var nFontSize   = oTextPr.FontSize;

        if (nMaxWidth < 0.001 || nTextHeight < 0.001 || oBounds.W < 0.001 || oBounds.H < 0.001)
		    return nTextHeight;

	    var nNewFontSize = nFontSize;

        nNewFontSize = (oBounds.H / g_dKoef_pt_to_mm) >> 0;
        oRun.SetFontSize(nNewFontSize);

        oTextPr.FontSize    = nNewFontSize;
        oTextPr.FontSizeCS  = nNewFontSize;

        g_oTextMeasurer.SetTextPr(oTextPr, null);
        g_oTextMeasurer.SetFontSlot(AscWord.fontslot_ASCII);

        return g_oTextMeasurer.GetHeight();
    };
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

        let oViewer = private_getViewer();
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
        this._value = sValue ? sValue : "Off";
    };
    CBaseCheckBoxField.prototype.GetValue = function() {
        return this._value;
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
        if ((bChecked && this._value == this._exportValue) || (!bChecked && this._value != this._exportValue))
            return;

        if (bChecked) {
            AscCommon.History.Add(new CChangesPDFFormValue(this, this._value, this._exportValue));
            this._value = this._exportValue;
        }
        else {
            AscCommon.History.Add(new CChangesPDFFormValue(this, this._value, "Off"));
            this._value = "Off";

        }
    };
    
    function CCheckBoxField(sName, nPage, aRect)
    {
        CBaseCheckBoxField.call(this, sName, FIELD_TYPE.checkbox, nPage, aRect);

        this._style     = style.ch;
        this._caption   = undefined;
    }
    CCheckBoxField.prototype = Object.create(CBaseCheckBoxField.prototype);
	CCheckBoxField.prototype.constructor = CCheckBoxField;

    CCheckBoxField.prototype.onMouseDown = function() {
        let oViewer = private_getViewer();
        
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);

        oViewer.activeForm = this;
    };
    CCheckBoxField.prototype.onMouseUp = function() {
        let oThis = this;
        this.SetNeedCommit(true);

        CreateNewHistoryPointForField(oThis);
        if (this._value != "Off") {
            this.SetChecked(false);
        }
        else {
            this.SetChecked(true);
        }

        this.Commit();
    };
    /**
	 * Applies value of this field to all field with the same name.
	 * @memberof CCheckBoxField
	 * @typeofeditors ["PDF"]
	 */
    CCheckBoxField.prototype.Commit = function() {
        let oThis = this;
        let aFields = this._doc.GetFields(this.GetFullName());
        TurnOffHistory();

        aFields.forEach(function(field) {
            if (field == oThis) {
                return;
            }

            field.SetChecked(oThis.IsChecked());
            field.AddToRedraw();
        });
    };

    /**
	 * Synchronizes this field with fields with the same name.
	 * @memberof CCheckBoxField
	 * @typeofeditors ["PDF"]
	 */
    CCheckBoxField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        let nThisIdx = aFields.indexOf(this);
        
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {
                let oPara = this.content.GetElement(0);
                let oParaToCopy = aFields[i].content.GetElement(0);

                oPara.ClearContent();
                for (var nPos = 0; nPos < oParaToCopy.Content.length - 1; nPos++) {
                    oPara.Internal_Content_Add(nPos, oParaToCopy.GetElement(nPos).Copy());
                }
                oPara.CheckParaEnd();
                
                if (aFields[i]._value != "Off")
                    this._value = this._exportValue;
                break;
            }
        }
    };

    function CRadioButtonField(sName, nPage, aRect)
    {
        CBaseCheckBoxField.call(this, sName, FIELD_TYPE.radiobutton, nPage, aRect);
        
        this._radiosInUnison = false;
        this._noToggleToOff = true;

        this._style = style.ci;
    }
    CRadioButtonField.prototype = Object.create(CBaseCheckBoxField.prototype);
	CRadioButtonField.prototype.constructor = CRadioButtonField;
    
    /**
	 * Synchronizes this field with fields with the same name.
	 * @memberof CRadioButtonField
	 * @typeofeditors ["PDF"]
	 */
    CRadioButtonField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
                
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {
                this._radiosInUnison = aFields[i]._radiosInUnison;

                if (aFields[i]._value != "Off")
                    this._value = this._exportValue;

                if (this._radiosInUnison && this._exportValue == aFields[i]._exportValue) {
                    let oPara = this.content.GetElement(0);
                    let oParaToCopy = aFields[i].content.GetElement(0);

                    oPara.ClearContent();
                    for (var nPos = 0; nPos < oParaToCopy.Content.length - 1; nPos++) {
                        oPara.Internal_Content_Add(nPos, oParaToCopy.GetElement(nPos).Copy());
                    }
                    oPara.CheckParaEnd();
                
                    break;
                }
            }
        }
    };
    CRadioButtonField.prototype.onMouseDown = function() {
        let oViewer = private_getViewer();

        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);
        oViewer.activeForm = this;
    };
    CRadioButtonField.prototype.onMouseUp = function() {
        CreateNewHistoryPointForField(this);
        if (this._value != "Off") {
            if (this._noToggleToOff == false) {
                this.SetChecked(false);
            }
        }
        else {
            this.SetChecked(true);
        }
        
        if (AscCommon.History.Is_LastPointEmpty())
            AscCommon.History.Remove_LastPoint();
        else {
            this.SetNeedCommit(true);
            this.Commit2();
        }
    };
    /**
	 * Updates all field with this field name.
	 * @memberof CRadioButtonField
	 * @typeofeditors ["PDF"]
	 */
    CRadioButtonField.prototype.UpdateAll = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        
        if (this._radiosInUnison) {
            // отмечаем все radiobuttons с тем же экспортом, что и отмеченные
            let sExportValue;
            for (let i = 0; i < aFields.length; i++) {
                if (!sExportValue && aFields[i]._value != "Off") {
                    sExportValue = aFields[i]._exportValue;
                    break;
                }
            }
            if (!sExportValue) {
                aFields.forEach(function(field) {
                    field.SetChecked(false);
                });
            }
            else {
                aFields.forEach(function(field) {
                    if (field._exportValue != sExportValue) {
                        field.SetChecked(false);
                    }
                    else {
                        field.SetChecked(true);
                    }
                });
            }
        }
        else {
            let oCheckedFld = null;
            // оставляем активной первую отмеченную radiobutton
            for (let i = 0; i < aFields.length; i++) {
                if (!oCheckedFld && aFields[i]._value != "Off") {
                    oCheckedFld = aFields[i];
                    continue;
                }
                if (oCheckedFld) {
                    aFields[i].SetChecked(false);
                }
            }
        }
    };
    
    /**
	 * The value application logic for all fields with the same name has been changed for this field type.
     * The method was left for compatibility.
	 * @memberof CRadioButtonField
	 * @typeofeditors ["PDF"]
	 */
    CRadioButtonField.prototype.Commit = function() {
        this.SetNeedCommit(false);
    };

    /**
	 * Applies value of this field to all field with the same name
     * Note: Uses after mouseUp action.
	 * @memberof CRadioButtonField
	 * @typeofeditors ["PDF"]
	 */
    CRadioButtonField.prototype.Commit2 = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        let oThis = this;

        if (false == this._radiosInUnison) {
            aFields.forEach(function(field) {
                if (field == oThis)
                    return;

                if (field.IsChecked() == true && oThis.IsChecked()) {
                    field.SetChecked(false);
                    field.SetNeedRecalc(true);
                }
            }); 
        }
        else {
            if (this.IsChecked() == true) {
                if (this._noToggleToOff == false) {
                    this.SetChecked(false);
                    this.SetNeedRecalc(true);
                }
            }
            else {
                this.SetChecked(true);
                this.SetNeedRecalc(true);
            }

            aFields.forEach(function(field) {
                if (field == oThis)
                    return;

                if (field._exportValue != oThis._exportValue && field.IsChecked() == true) {
                    field.SetChecked(false);
                    field.SetNeedRecalc(true);
                }
                else if (field._exportValue == oThis._exportValue && oThis.IsChecked() == false) {
                    field.SetChecked(false);
                    field.SetNeedRecalc(true);
                }
                else if (field._exportValue == oThis._exportValue && field.IsChecked() == false) {
                    field.SetChecked(true);
                    field.SetNeedRecalc(true);
                }
            });

            if (AscCommon.History.Is_LastPointEmpty())
                AscCommon.History.Remove_LastPoint();
        }
    };
    
    CRadioButtonField.prototype.SetNoTogleToOff = function(bValue) {
        this._noToggleToOff = bValue;
    };
    CRadioButtonField.prototype.SetRadiosInUnison = function(bValue) {
        this._radiosInUnison = bValue;
    };

    function CTextField(sName, nPage, aRect)
    {
        CBaseField.call(this, sName, FIELD_TYPE.text, nPage, aRect);
        
        this._alignment         = ALIGN_TYPE.left;
        this._calcOrderIndex    = 0;
        this._charLimit         = 0; // to do
        this._comb              = false;
        this._defaultStyle      = Object.assign({}, DEFAULT_SPAN); // to do (must not be fileSelect flag)
        this._doNotScroll       = false;
        this._doNotSpellCheck   = false;
        this._multiline         = false;
        this._password          = false;
        this._richText          = false; // to do связанные свойства, методы
        this._richValue         = [];
        this._textFont          = "ArialMT";
        this._fileSelect        = false;

        // internal
        TurnOffHistory();
        this.content = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        this.content.ParentPDF = this;
        this.content.SetUseXLimit(false);
        this.content.MoveCursorToStartPos();

        // content for formatting value
        // Note: draw this content instead of main if form has a "format" action
        this.contentFormat = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        this.contentFormat.ParentPDF = this;
        this.contentFormat.SetUseXLimit(false);
        this.contentFormat.MoveCursorToStartPos();

        this._scrollInfo = null;
    }
    CTextField.prototype = Object.create(CBaseField.prototype);
	CTextField.prototype.constructor = CTextField;
    
    CTextField.prototype.SetComb = function(bComb) {
        if (bComb == true) {
            this._comb = true;
            this._doNotScroll = true;
        }
        else {
            this._comb = false;
        }

        this.content.GetElement(0).Content.forEach(function(run) {
            run.RecalcInfo.Measure = true;
        });
        this.contentFormat.GetElement(0).Content.forEach(function(run) {
            run.RecalcInfo.Measure = true;
        });
    };
    CTextField.prototype.SetCharLimit = function(nChars) {
        this._charLimit = nChars;
    };
    CTextField.prototype.SetDoNotScroll = function(bNot) {
        this._doNotScroll = bNot;
    };
    CTextField.prototype.SetDoNotSpellCheck = function(bNot) {
        this._doNotSpellCheck = bNot;
    };
    CTextField.prototype.SetFileSelect = function(bFileSelect) {
        if (bFileSelect === true && this._multiline != true && this._charLimit === 0
            && this.password != true && this.defaultValue == "") {
                this._fileSelect = true;
            }
        else if (bFileSelect === false) {
            this._fileSelect = false;
        }
    };
    CTextField.prototype.SetMultiline = function(bMultiline) {
        if (bMultiline == true && this.fileSelect != true) {
            this.content.SetUseXLimit(true);
            this.contentFormat.SetUseXLimit(true);
            this._multiline = true;
        }
        else if (bMultiline === false) {
            this.content.SetUseXLimit(false);
            this.contentFormat.SetUseXLimit(false);
            this._multiline = false;
        }
    };
    CTextField.prototype.SetPassword = function(bPassword) {
        if (bPassword === true && this.fileSelect != true) {
            this._password = true;
        }
        else if (bPassword === false) {
            this._password = false;
        }
    };
    CTextField.prototype.SetRichText = function(bRichText) {
        this._richText = bRichText;
    };
    CTextField.prototype.SetValue = function(sValue) {
        let oPara = this.content.GetElement(0);
        oPara.RemoveFromContent(1, oPara.GetElementsCount() - 1);
        let oRun = oPara.GetElement(0);
        oRun.ClearContent();

        let oTextFormat = new AscWord.CTextFormFormat();
        let arrBuffer = oTextFormat.GetBuffer(sValue);

        if (sValue) {
            for (let index = 0; index < arrBuffer.length; ++index) {
                let codePoint = arrBuffer[index];
                if (9 === codePoint) // \t
                    oRun.AddToContent(index, new AscWord.CRunTab(), true);
                else if (10 === codePoint || 13 === codePoint) // \n \r
                    oRun.AddToContent(index, new AscWord.CRunBreak(AscWord.break_Line), true);
                else if (AscCommon.IsSpace(codePoint)) // space
                    oRun.AddToContent(index, new AscWord.CRunSpace(codePoint), true);
                else
                    oRun.AddToContent(index, new AscWord.CRunText(codePoint), true);
            }
            
            this.content.MoveCursorToStartPos();
        }

        this.SetNeedRecalc(true);

        if (private_getViewer().IsOpenFormsInProgress)
            this.SetApiValue(sValue);
    };
    /**
	 * Gets the value of current form (can be not commited).
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
     * @returns {string | Array} - can be array of rich value
	 */
    CTextField.prototype.GetValue = function() {
        // to do обработать rich value
        let oPara = this.content.GetElement(0);
        oPara.SetApplyToAll(true);
        let sValue = oPara.GetSelectedText(true, {NewLine: true});
        oPara.SetApplyToAll(false);

        return sValue;
    };
        
    /**
	 * Applies default value to current form.
	 * @memberof CTextField
     * @param {string | Array} value - string value or array of rich value.
	 * @typeofeditors ["PDF"]
     * @returns {string}
	 */
    CTextField.prototype.CommitDefaultValue = function() {
        this.SetValue(this.GetDefaultValue());
    };

    CTextField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer = private_getViewer();
        let aRect   = this.GetRect();
        let oGraphicsWord = oViewer.pagesInfo.pages[this.GetPage()].graphics.word;

        let X       = aRect[0];
        let Y       = aRect[1];
        let nWidth  = ((aRect[2]) - (aRect[0]));
        let nHeight = ((aRect[3]) - (aRect[1]));

        // save pos in page.
        this._pagePos = {
            x: X,
            y: Y,
            w: nWidth,
            h: nHeight
        };

        this.DrawBackground();
        this.DrawBorders();
        
        let oMargins = this.GetMarginsFromBorders(false, false);
        
        let contentX = (X + oMargins.left) * g_dKoef_pix_to_mm;
        let contentY = (Y + oMargins.top) * g_dKoef_pix_to_mm;
        let contentXLimit = (X + nWidth - oMargins.left) * g_dKoef_pix_to_mm;
        let contentYLimit = (Y + nHeight - oMargins.bottom) * g_dKoef_pix_to_mm;

        let oContentToDraw = this._triggers.Format && oViewer.activeForm != this ? this.contentFormat : this.content;

        if ((this.borderStyle == "solid" || this.borderStyle == "dashed") && 
        this._comb == true && this._charLimit > 1) {
            contentX = (X) * g_dKoef_pix_to_mm;
            contentXLimit = (X + nWidth) * g_dKoef_pix_to_mm;
        }
        
        if (this._multiline == false) {
            // выставляем текст посередине
            let nContentH = this.content.GetElement(0).Get_EmptyHeight();
            contentY = (Y + nHeight / 2) * g_dKoef_pix_to_mm - nContentH / 2;
        }
        else {
            contentX        = (X + 2 * oMargins.left) * g_dKoef_pix_to_mm;
            contentY        = (Y + 2 * oMargins.top) * g_dKoef_pix_to_mm;
            contentXLimit   = (X + nWidth - 2 * oMargins.left) * g_dKoef_pix_to_mm;
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
            this.content.X      = this.contentFormat.X = this._oldContentPos.X = contentX;
            this.content.Y      = this.contentFormat.Y = this._oldContentPos.Y = contentY;
            this.content.XLimit = this.contentFormat.XLimit = this._oldContentPos.XLimit = contentXLimit;
            this.content.YLimit = this.contentFormat.YLimit = this._oldContentPos.YLimit = 20000;
            this.content.Recalculate_Page(0, true);
            this.contentFormat.Recalculate_Page(0, true);
            this.SetNeedRecalc(false);
        }
        else if (this.IsNeedRecalc()) {
            this.contentFormat.Content.forEach(function(element) {
                element.Recalculate_Page(0);
            });
            this.content.Content.forEach(function(element) {
                element.Recalculate_Page(0);
            });

            this.SetNeedRecalc(false);
        }
        
        if (this._multiline == true) {
            oContentToDraw.ResetShiftView();
            oContentToDraw.ShiftView(this._curShiftView.x, this._curShiftView.y);
        }

        if (this._bAutoShiftContentView && oViewer.activeForm == this)
            this.CheckFormViewWindow();

        oGraphicsWord.AddClipRect(oContentToDraw.X, oContentToDraw.Y, oContentToDraw.XLimit - oContentToDraw.X, contentYLimit - contentY - (oMargins.bottom / 2) * g_dKoef_pix_to_mm);
        oContentToDraw.Draw(0, oGraphicsWord);

        // redraw target cursor if field is selected
        if (oViewer.activeForm == this && oContentToDraw.IsSelectionUse() == false && oViewer.fieldFillingMode)
            oContentToDraw.RecalculateCurPos();
        
        oGraphicsWord.RemoveLastClip();
    };
    CTextField.prototype.onMouseDown = function(x, y, e) {
        let oViewer         = private_getViewer();
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        function callbackAfterFocus(x, y, e) {
            
            let {X, Y} = private_getPageCoordsMM(x, y, this.GetPage());

            editor.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            editor.WordControl.m_oDrawingDocument.m_lCurrentPage = 0;
            editor.WordControl.m_oDrawingDocument.m_lPagesCount = oViewer.file.pages.length;
            this.content.Selection_SetStart(X, Y, 0, e);
            this.content.RemoveSelection();
            this.content.RecalculateCurPos();

            if (this._doNotScroll == false && this._multiline)
                this.UpdateScroll(true);

            if (this.IsNeedDrawFromStream() == true) {
                this.SetDrawFromStream(false);
                this.AddToRedraw();
            }
        }
        
        // вызываем выставление курсора после onFocus, если уже в фокусе, тогда сразу.
        if (oViewer.activeForm != this && this._triggers.OnFocus && this._triggers.OnFocus.Actions.length > 0)
            oActionsQueue.callBackAfterFocus = callbackAfterFocus.bind(this, x, y, e);
        else
            callbackAfterFocus.bind(this, x, y, e)();

        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);

        oViewer.activeForm = this;
    };
        
    CTextField.prototype.SelectionSetStart = function(x, y, e) {
        let {X, Y} = private_getPageCoordsMM(x, y, this.GetPage());
        this.content.Selection_SetStart(X, Y, 0, e);
    };
    CTextField.prototype.SelectionSetEnd = function(x, y, e) {
        let {X, Y} = private_getPageCoordsMM(x, y, this.GetPage());
        this.content.Selection_SetEnd(X, Y, 0, e);
    };
    CTextField.prototype.MoveCursorLeft = function(isShiftKey, isCtrlKey)
    {
        this.content.MoveCursorLeft(isShiftKey, isCtrlKey);
        this._bAutoShiftContentView = true && this._doNotScroll == false;
        return this.content.RecalculateCurPos();
    };
    CTextField.prototype.MoveCursorRight = function(isShiftKey, isCtrlKey)
    {
        this.content.MoveCursorRight(isShiftKey, isCtrlKey);
        this._bAutoShiftContentView = true && this._doNotScroll == false;
        return this.content.RecalculateCurPos();
    };
    CTextField.prototype.MoveCursorDown = function(isShiftKey, isCtrlKey) {
        this.content.MoveCursorDown(isShiftKey, isCtrlKey);
        this._bAutoShiftContentView = true && this._doNotScroll == false;
        return this.content.RecalculateCurPos();
    };
    CTextField.prototype.MoveCursorUp = function(isShiftKey, isCtrlKey) {
        this.content.MoveCursorUp(isShiftKey, isCtrlKey);
        this._bAutoShiftContentView = true && this._doNotScroll == false;
        return this.content.RecalculateCurPos();
    };
    CTextField.prototype.EnterText = function(aChars)
    {
        if (aChars.length > 0)
            CreateNewHistoryPointForField(this, true);

        let oPara = this.content.GetElement(0);
        if (this.content.IsSelectionUse() && this.content.IsSelectionEmpty())
            this.content.RemoveSelection();

        let nChars = 0;
        function getCharsCount(oRun) {
            var nCurPos = oRun.Content.length;
			for (var nPos = 0; nPos < nCurPos; ++nPos)
			{
				if (para_Text === oRun.Content[nPos].Type || para_Space === oRun.Content[nPos].Type || para_Tab === oRun.Content[nPos].Type)
                    nChars++;
            }
        }
        
        if (this.content.IsSelectionUse()) {
            // Если у нас что-то заселекчено и мы вводим текст или пробел
			// и т.д., тогда сначала удаляем весь селект.
            this.content.Remove(1, true, false, true);
        }

        if (this._charLimit != 0)
            this.content.CheckRunContent(getCharsCount);

        let nMaxCharsToAdd = this._charLimit != 0 ? this._charLimit - nChars : aChars.length;
        for (let index = 0, count = Math.min(nMaxCharsToAdd, aChars.length); index < count; ++index) {
            let codePoint = aChars[index];
            if (9 === codePoint) // \t
				oPara.AddToParagraph(new AscWord.CRunTab(), true);
			else if (10 === codePoint || 13 === codePoint) // \n \r
				oPara.AddToParagraph(new AscWord.CRunBreak(AscWord.break_Line), true);
			else if (AscCommon.IsSpace(codePoint)) // space
				oPara.AddToParagraph(new AscWord.CRunSpace(codePoint), true);
			else
				oPara.AddToParagraph(new AscWord.CRunText(codePoint), true);
        }

        if (nMaxCharsToAdd == 0) {
            return false;
        }

        if (this.DoKeystrokeAction() == false) {
            return false;
        }
            
        if (aChars.length > 0) {
            this._doNotScroll == false && this.SetNeedRecalc(true);
            this.SetNeedCommit(true); // флаг что значение будет применено к остальным формам с таким именем
            this._bAutoShiftContentView = true && this._doNotScroll == false;
        }

        if (this._doNotScroll) {
            oPara.Recalculate_Page(0);
            let isOutOfForm = this.IsTextOutOfForm();
            if ((this._multiline && isOutOfForm.ver) || (isOutOfForm.hor && this._multiline == false))
                AscCommon.History.Undo();

            this.AddToRedraw();
        }

        return true;
    };
    /**
	 * Checks is text in form is out of form bounds.
     * Note: in vertical case one line always be valid even if form is very short.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
     * @returns {object} - {hor: {boolean}, ver: {boolean}}
	 */
    CTextField.prototype.IsTextOutOfForm = function() {
        let oPageBounds = this.content.GetContentBounds(0);
        let oFormBounds = this.getFormRelRect();
        let oContentW   = this.content.GetElement(0).GetContentWidthInRange();
        
        let oResult = {
            hor: false,
            ver: false
        }

        if (oContentW > oFormBounds.W) {
            oResult.hor = true;
        }

        if (this._multiline && oPageBounds.Bottom - oPageBounds.Top > oFormBounds.H) {
            oResult.ver = true;
        }

        return oResult;
    };

    /**
	 * Applies value of this field to all field with the same name.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CTextField.prototype.Commit = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        let oThisPara = this.content.GetElement(0);
        
        if (this.DoFormatAction() == false) {
            if (this.IsChanged() == false)
                this.SetDrawFromStream(true);

            return;
        }
        
        this.CorrectHistoryPoints();
        if (true != private_getViewer().isOnUndoRedo) {
            if (this.GetApiValue() != this.GetValue()) {
                if (this.GetDocument().IsNeedSkipHistory() == false) {
                    CreateNewHistoryPointForField(this);
                    AscCommon.History.Add(new CChangesPDFFormValue(this, this.GetApiValue(), this.GetValue()));
                }
                
                this.SetApiValue(this.GetValue());
            }
        }

        TurnOffHistory();
        
        if (aFields.length == 1)
            this.SetNeedCommit(false);

        // устанавливаем дефолтное значение формы
        if (this.GetValue() == "" && this.GetDefaultValue() != null) {
            this.CommitDefaultValue();
            this.SetNeedRecalc(true);
            this.AddToRedraw();
        }

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i].IsChanged() == false)
                aFields[i].SetWasChanged(true); // фиксируем, что форма была изменена

            if (aFields[i].HasShiftView()) {
                aFields[i].content.MoveCursorToStartPos();

                if (aFields[i] == this) {
                    aFields[i].AddToRedraw();
                    continue;
                }
            }
                
            if (aFields[i] == this)
                continue;

            aFields[i].SetApiValue(this.GetApiValue());

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

        let oParaFromFormat = this.contentFormat.GetElement(0);
        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] == this)
                continue;

            let oFieldPara = aFields[i].contentFormat.GetElement(0);
            let oThisRun, oFieldRun;
            for (let nItem = 0; nItem < oParaFromFormat.Content.length - 1; nItem++) {
                oThisRun = oParaFromFormat.Content[nItem];
                oFieldRun = oFieldPara.Content[nItem];
                oFieldRun.ClearContent();

                for (let nRunPos = 0; nRunPos < oThisRun.Content.length; nRunPos++) {
                    oFieldRun.AddToContent(nRunPos, AscCommon.IsSpace(oThisRun.Content[nRunPos].Value) ? new AscWord.CRunSpace(oThisRun.Content[nRunPos].Value) : new AscWord.CRunText(oThisRun.Content[nRunPos].Value));
                }
            }

            aFields[i].SetNeedRecalc(true);
        }

        this.SetNeedCommit(false);
        this.needValidate = true;
    };
    CTextField.prototype.DoFormatAction = function() {
        let oDoc = this.GetDocument();

        let oFormatTrigger = this.GetTrigger(FORMS_TRIGGERS_TYPES.Format);
        let oActionRunScript = oFormatTrigger ? oFormatTrigger.GetActions()[0] : null;

        if (!oActionRunScript)
            return;

        this.SetNeedRecalc(true);

        oActionRunScript.RunScript();
        let isValidFormat = oDoc.formsEvent["rc"];

        // проверка для форматов, не ограниченных на какие-либо символы своей функцией keystroke
        // например для даты, маски
        if (isValidFormat === false && this.GetApiValue() != "") {
            // отменяем все изменения сделанные в форме, т.к. не подходят формату 
            this.UndoNotAppliedChanges();
            editor.sendEvent("asc_onFormatErrorPdfForm", oDoc.formsEvent);
            // to do выдать предупреждение, что строка не подходит по формату
            return false;
        }

        return true;
    };
    CTextField.prototype.DoKeystrokeAction = function() {
        let oKeystrokeTrigger = this.GetTrigger(FORMS_TRIGGERS_TYPES.Keystroke);
        let oActionRunScript = oKeystrokeTrigger ? oKeystrokeTrigger.GetActions()[0] : null;

        let isCanEnter = true;
        if (oActionRunScript) {
            this.GetDocument().formsEvent = {
                "target": this.GetFormApi(),
                "value": this.GetValue(),
                "rc": true
            };

            isCanEnter = oActionRunScript.RunScript();
        }

        if (isCanEnter == false) {
            this.UndoNotAppliedChanges();
        }

        return isCanEnter;
    };
    CTextField.prototype.DoValidateAction = function(value) {
        let oDoc = this.GetDocument();
        
        if (oDoc.formsEvent["target"] != this.GetFormApi()) {
            oDoc.formsEvent = {
                "target": this.GetFormApi(),
                "rc": true
            };
        }

        oDoc.formsEvent["value"] = value;

        let oValidateTrigger = this.GetTrigger(AscPDFEditor.FORMS_TRIGGERS_TYPES.Validate);
        let oValidateScript = oValidateTrigger ? oValidateTrigger.GetActions()[0] : null;

        if (oValidateScript == null)
            return true;

        oValidateScript.RunScript();
        let isValid = oDoc.formsEvent["rc"];

        if (isValid == false) {
            if ((oDoc.formsEvent["greater"] != null || oDoc.formsEvent["less"] != null))
                editor.sendEvent("asc_onValidateErrorPdfForm", oDoc.formsEvent);
            
            return isValid;
        }

        return isValid;
    };

    CTextField.prototype.UndoNotAppliedChanges = function() {
        this.UnionLastHistoryPoints();
        let nPoint = AscCommon.History.Index;
        AscCommon.History.Undo();
        
        // удаляем точки
        AscCommon.History.Points.length = nPoint;

        this.AddToRedraw();
        this.SetNeedCommit(false);
    };
    /**
	 * Unions the last history points of this form.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CTextField.prototype.UnionLastHistoryPoints = function() {
        let oTmpPoint;
        let oResultPoint = {
            State      : undefined,
            Items      : [],
            Time       : new Date().getTime(),
            Additional : {FormFilling: this, CanUnion: false},
            Description: undefined
        };

        let i = 0;
        for (i = AscCommon.History.Points.length - 1; i >= 0 ; i--) {
            oTmpPoint = AscCommon.History.Points[i];
            if (oTmpPoint.Additional.FormFilling === this && oTmpPoint.Additional.CanUnion != false) {
                oResultPoint.Items = oTmpPoint.Items.concat(oResultPoint.Items);
            }
            else {
                break;
            }
        }

        i++; // индекс точки, в которую поместим результирующее значение.
        
        // если больше 2х точек, то заменяем
        if (i < AscCommon.History.Points.length - 1) {
            AscCommon.History.Index = i;
            AscCommon.History.Points.splice(i, AscCommon.History.Points.length - i, oResultPoint);
        }
        else if (AscCommon.History.Points[i])
            AscCommon.History.Points[i].Additional.CanUnion = false; // запрещаем объединять последнюю добавленную точку
    };
    /**
	 * Используется при применении (Apply метод) формы.
     * Удаляем все будущие точки (данной формы) на момент применения значения формы, а так же удаляем все предыдущие не объединённые точки.
     * Точки которые нельзя удалить (объединить) помечаются canUnion == false.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CTextField.prototype.CorrectHistoryPoints = function() {
        let oViewer = private_getViewer();

        if (oViewer.isOnUndoRedo != true) {
            let nCurIdx = AscCommon.History.Index;
            let nFromPoint = nCurIdx;
            let nToPoint = nCurIdx;

            if (null == AscCommon.History.Points[nCurIdx] || AscCommon.History.Points[nCurIdx].Additional.CanUnion == false)
                return;

            if (AscCommon.History.Points[nCurIdx]) {
                for (let i = nCurIdx - 1; i >= 0; i--) {
                    if (!AscCommon.History.Points[i] || AscCommon.History.Points[i].Additional.CanUnion === false) {
                        break;
                    }
                    nFromPoint--;
                }
            }

            for (let i = nCurIdx + 1; i < AscCommon.History.Points.length; i++) {
                if (!AscCommon.History.Points[i] || AscCommon.History.Points[i].Additional.CanUnion === false) {
                    break;
                }

                nToPoint++;
            }

            let nNewIdx = nFromPoint - 1;
            AscCommon.History.Points.splice(nFromPoint, Math.max((nToPoint - nFromPoint) + 1));
            AscCommon.History.Index = nNewIdx
        }
        else {
            let nToPoint = AscCommon.History.Index + 1;;

            if (!AscCommon.History.Points[nToPoint] || AscCommon.History.Points[nToPoint].Additional.CanUnion === false) {
                return;
            }

            AscCommon.History.Points.length = nToPoint;
        }
    };
    /**
	 * Removes char in current position by direction.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CTextField.prototype.Remove = function(nDirection, bWord) {
        if (this._editable == false)
            return false;

        CreateNewHistoryPointForField(this, true);

        this.content.Remove(nDirection, true, false, false, bWord);
        
        if (AscCommon.History.Is_LastPointEmpty())
            AscCommon.History.Remove_LastPoint();
        else {
            this.SetNeedRecalc(true);
            this.SetNeedCommit(true);
        }
    };
    /**
	 * Synchronizes this field with fields with the same name.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CTextField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {
                this._alignment         = aFields[i]._alignment;
                this._calcOrderIndex    = aFields[i]._calcOrderIndex;
                this._charLimit         = aFields[i]._charLimit;
                this._comb              = aFields[i]._comb;
                this._doNotScroll       = aFields[i]._doNotScroll;
                this._doNotSpellCheckl  = aFields[i]._doNotSpellCheckl;
                this._fileSelect        = aFields[i]._fileSelect;
                this._multiline         = aFields[i]._multiline;
                this._password          = aFields[i]._password;
                this._richText          = aFields[i]._richText;
                this._richValue         = aFields[i]._richValue.slice();
                this._textFont          = aFields[i]._textFont;
                this._borderStyle       = aFields[i]._borderStyle;

                this._triggers = aFields[i]._triggers ? aFields[i]._triggers.Copy(this) : null;

                if (this._multiline)
                    this.content.SetUseXLimit(true);

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
    CTextField.prototype.CheckFormViewWindow = function()
    {
        // размеры всего контента
        let oPageBounds = this.content.GetContentBounds(0);
        let oFormBounds = this.getFormRelRect();

        let oParagraph = this.content.GetElement(0);
        
        let nDx = 0, nDy = 0;

        if (oPageBounds.Right - oPageBounds.Left > oFormBounds.W)
        {
            if (oPageBounds.Left > oFormBounds.X)
                nDx = -oPageBounds.Left + oFormBounds.X;
            else if (oPageBounds.Right < oFormBounds.X + oFormBounds.W)
                nDx = oFormBounds.X + oFormBounds.W - oPageBounds.Right;
        }
        else
        {
            nDx = -this.content.ShiftViewX;
        }

        if (Math.abs(nDx) > 0.001 || Math.abs(nDy))
        {
            this.content.ShiftView(nDx, nDy);
            this._originShiftView = {
                x: this.content.ShiftViewX,
                y: this.content.ShiftViewY
            }
        }

        var oCursorPos  = oParagraph.GetCalculatedCurPosXY();
        var oLineBounds = oParagraph.GetLineBounds(oCursorPos.Internal.Line);
        var oLastLineBounds = oParagraph.GetLineBounds(oParagraph.GetLinesCount() - 1);

	    nDx = 0;
	    nDy = 0;

        var nCursorT = Math.min(oCursorPos.Y, oLineBounds.Top);
        var nCursorB = Math.max(oCursorPos.Y + oCursorPos.Height, oLineBounds.Bottom);
        var nCursorH = Math.max(0, nCursorB - nCursorT);

        if (oPageBounds.Right - oPageBounds.Left > oFormBounds.W)
        {
            if (oCursorPos.X < oFormBounds.X)
                nDx = oFormBounds.X - oCursorPos.X;
            else if (oCursorPos.X > oFormBounds.X + oFormBounds.W)
                nDx = oFormBounds.X + oFormBounds.W - oCursorPos.X;
        }

        if (this._multiline) {
            // если высота контента больше чем высота формы
            if (oParagraph.IsSelectionUse()) {
                if (oParagraph.GetSelectDirection() == 1) {
                    if (nCursorT + nCursorH > oFormBounds.Y + oFormBounds.H)
                        nDy = oFormBounds.Y + oFormBounds.H - (nCursorT + nCursorH);
                }
                else {
                    if (nCursorT < oFormBounds.Y)
                        nDy = oFormBounds.Y - nCursorT;
                }
            }
            else {
                if (oPageBounds.Bottom - oPageBounds.Top > oFormBounds.H) {
                    if (oLastLineBounds.Bottom - Math.floor(((oFormBounds.Y + oFormBounds.H) * 1000)) / 1000 < 0)
                        nDy = oFormBounds.Y + oFormBounds.H - oLastLineBounds.Bottom;
                    else if (nCursorT < oFormBounds.Y)
                        nDy = oFormBounds.Y - nCursorT;
                    else if (nCursorT + nCursorH > oFormBounds.Y + oFormBounds.H)
                        nDy = oFormBounds.Y + oFormBounds.H - (nCursorT + nCursorH);
                }
                else
                    nDy = -this.content.ShiftViewY;
            }
        }

        if (Math.abs(nDx) > 0.001 || Math.round(nDy) != 0)
        {
            this.content.ShiftView(nDx, nDy);
            this._curShiftView = {
                x: this.content.ShiftViewX,
                y: this.content.ShiftViewY
            }
        }
    };

    // pdf api methods

    /**
	 * A string that sets the trigger for the action. Values are:
	 * @typedef {"MouseUp" | "MouseDown" | "MouseEnter" | "MouseExit" | "OnFocus" | "OnBlur" | "Keystroke" | "Validate" | "Calculate" | "Format"} cTrigger
	 * For a list box, use the Keystroke trigger for the Selection Change event.
     */
    
    function CBaseListField(sName, sType, nPage, aRect)
    {
        CBaseField.call(this, sName, sType, nPage, aRect);

        this._commitOnSelChange     = false;
        this._currentValueIndices   = undefined;
        this._textFont              = "ArialMT";
        this._options               = [];
        
        this.content = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        this.content.ParentPDF = this;
        this.content.SetUseXLimit(false);
    }
    CBaseListField.prototype = Object.create(CBaseField.prototype);
	CBaseListField.prototype.constructor = CBaseListField;

    /**
	 * Unions the last history points of this form.
	 * @memberof CBaseListField
     * @param {boolean} [bForbidToUnion=true] - wheter to forbid to merge the points united by this iteration
	 * @typeofeditors ["PDF"]
	 */
    CBaseListField.prototype.UnionLastHistoryPoints = function(bForbidToUnion) {
        if (bForbidToUnion == undefined)
            bForbidToUnion = true;
            
        let oTmpPoint;
        let oResultPoint = {
            State      : undefined,
            Items      : [],
            Time       : new Date().getTime(),
            Additional : {FormFilling: this, CanUnion: !bForbidToUnion},
            Description: undefined
        };

        let i = 0;
        for (i = AscCommon.History.Points.length - 1; i >= 0 ; i--) {
            oTmpPoint = AscCommon.History.Points[i];
            if (oTmpPoint.Additional.FormFilling === this && oTmpPoint.Additional.CanUnion != false) {
                oResultPoint.Items = oTmpPoint.Items.concat(oResultPoint.Items);
            }
            else {
                break;
            }
        }

        i++; // индекс точки, в которую поместим результирующее значение.
        
        // если больше 2х точек, то заменяем
        if (i < AscCommon.History.Points.length - 1) {
            AscCommon.History.Index = i;
            AscCommon.History.Points.splice(i, AscCommon.History.Points.length - i, oResultPoint);
        }
        else if (AscCommon.History.Points[i])
            AscCommon.History.Points[i].Additional.CanUnion = !bForbidToUnion; // запрещаем объединять последнюю добавленную точку
    };

    CBaseListField.prototype.SetCommitOnSelChange = function(bValue) {
        this._commitOnSelChange = bValue;
    };
    CBaseListField.prototype.GetApiCurIdxs = function() {
        // значение здесь всегда обновлено после commit
        return this._currentValueIndices;
    };

    function CComboBoxField(sName, nPage, aRect)
    {
        CBaseListField.call(this, sName, FIELD_TYPE.combobox, nPage, aRect);

        this._calcOrderIndex    = 0;
        this._doNotSpellCheck   = false;
        this._editable          = false;

        // content for formatting value
        // Note: draw this content instead of main if form has a "format" action
        this.contentFormat = new AscWord.CDocumentContent(null, editor.WordControl.m_oDrawingDocument, 0, 0, 0, 0, undefined, undefined, false);
        this.contentFormat.ParentPDF = this;
        this.contentFormat.SetUseXLimit(false);
        this.content.MoveCursorToStartPos();

        this._markRect = null;
    };
    CComboBoxField.prototype = Object.create(CBaseListField.prototype);
	CComboBoxField.prototype.constructor = CComboBoxField;

    CComboBoxField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer     = private_getViewer();
        let aRect       = this.GetRect();
        let aOringRect  = this.GetOrigRect();

        let oGraphicsWord = oViewer.pagesInfo.pages[this.GetPage()].graphics.word;

        this.DrawMarker();
        
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

        let oMargins = this.GetBordersWidth();

        let nScaleX = aRect[0] / aOringRect[0];

        let contentX        = (X + nWidth * 0.02 + oMargins.left) * g_dKoef_pix_to_mm;
        let contentY        = (Y + nWidth * 0.02 + oMargins.top) * g_dKoef_pix_to_mm;
        let contentXLimit   = (this._markRect.x1 * nScaleX - nWidth * 0.025 ) * g_dKoef_pix_to_mm; // ограничиваем контент позицией маркера
        let contentYLimit   = (Y + nHeight - nWidth * 0.02 - oMargins.bottom) * g_dKoef_pix_to_mm;
        
        let oContentToDraw = this._triggers.Format && oViewer.activeForm != this ? this.contentFormat : this.content;

        let nContentH = this.content.GetElement(0).Get_EmptyHeight();
        contentY = (Y + nHeight / 2) * g_dKoef_pix_to_mm - nContentH / 2;

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
            this.content.X      = this.contentFormat.X      = this._oldContentPos.X        = contentX;
            this.content.Y      = this.contentFormat.Y      = this._oldContentPos.Y        = contentY;
            this.content.XLimit = this.contentFormat.XLimit = this._oldContentPos.XLimit   = contentXLimit;
            this.content.YLimit = this.contentFormat.YLimit = this._oldContentPos.YLimit   = 20000;
            this.content.Recalculate_Page(0, true);
            this.contentFormat.Recalculate_Page(0, true);
        }
        else if (this.IsNeedRecalc()) {
            this.contentFormat.Content.forEach(function(element) {
                element.Recalculate_Page(0);
            });
            this.content.Content.forEach(function(element) {
                element.Recalculate_Page(0);
            });

            this.SetNeedRecalc(false);
        }
        
        if (oViewer.activeForm == this)
            this.CheckFormViewWindow();

        oGraphicsWord.AddClipRect(oContentToDraw.X, oContentToDraw.Y, oContentToDraw.XLimit - oContentToDraw.X, contentYLimit - contentY);
        oContentToDraw.Draw(0, oGraphicsWord);
        // redraw target cursor if field is selected
        if (oViewer.activeForm == this && oContentToDraw.IsSelectionUse() == false && oViewer.fieldFillingMode)
            oContentToDraw.RecalculateCurPos();
        
        oGraphicsWord.RemoveClip();
    };
    CComboBoxField.prototype.DrawMarker = function() {
        let oViewer         = private_getViewer();
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let aRect           = this.GetRect();
        let aOringRect      = this.GetOrigRect();

        let X       = aRect[0] * nScale;
        let Y       = aRect[1] * nScale;
        let nWidth  = (aRect[2] - aRect[0]) * nScale;
        let nHeight = (aRect[3] - aRect[1]) * nScale;
        
        let oMargins = this.GetBordersWidth(true);

        let nMarkWidth  = (nWidth * 0.05);
        let nMarkX      = (X + nWidth * 0.95) - oMargins.left;
        let nMarkHeight = (nMarkWidth / 2);

        oGraphicsPDF.BeginPath();
        oGraphicsPDF.SetFillStyle("black");
        oGraphicsPDF.MoveTo(nMarkX, Y + nHeight/2 + nMarkHeight/2);
        oGraphicsPDF.LineTo(nMarkX + nMarkWidth/2, Y + nHeight/2 - nMarkHeight/2);
        oGraphicsPDF.LineTo(nMarkX - nMarkWidth/2, Y + nHeight/2 - nMarkHeight/2);
        oGraphicsPDF.Fill();

        // далее вычисляем координаты на самой странице, как origRect у field.
        if (this._markRect != null)
            return;

        let origX       = aOringRect[0];
        let origY       = aOringRect[1];
        let orignWidth  = aOringRect[2] - aOringRect[0];
        let origHeight  = aOringRect[3] - aOringRect[1]

        let origMargins = this.GetBordersWidth();

        let origMarkWidth  = (orignWidth * 0.05);
        let origMarkX      = (origX + orignWidth * 0.95) - origMargins.left / AscCommon.AscBrowser.retinaPixelRatio; // to do (разобраться почему без деления получается неверные координаты по x)

        this._markRect = {
            x1: origMarkX - origMarkWidth / 2,
            y1: origY,
            x2: origMarkX + origMarkWidth / 2,
            y2: origY + origHeight
        }
    };
    CComboBoxField.prototype.onMouseDown = function(x, y, e) {
        let oViewer         = private_getViewer();
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        function callbackAfterFocus(x, y, e) {
            let {X, Y} = private_getPageCoordsMM(x, y, this.GetPage());
            var pageObject = oViewer.getPageByCoords(x - oViewer.x, y - oViewer.y);

            editor.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            editor.WordControl.m_oDrawingDocument.m_lCurrentPage = 0;
            editor.WordControl.m_oDrawingDocument.m_lPagesCount = oViewer.file.pages.length;

            if (pageObject.x >= this._markRect.x1 && pageObject.x <= this._markRect.x2 && pageObject.y >= this._markRect.y1 && pageObject.y <= this._markRect.y2 && this._options.length != 0) {
                editor.sendEvent("asc_onShowPDFFormsActions", this, x, y);
                this.content.MoveCursorToStartPos();
            }
            else {
                this.content.Selection_SetStart(X, Y, 0, e);
                this.content.RemoveSelection();
            }
            
            this.content.RecalculateCurPos();
            if (this.IsNeedDrawFromStream() == true) {
                this.SetDrawFromStream(false);
                this.AddToRedraw();
            }
        }

        // вызываем выставление курсора после onFocus, если уже в фокусе, тогда сразу.
        if (oViewer.activeForm != this && this._triggers.OnFocus && this._triggers.OnFocus.Actions.length > 0)
            oActionsQueue.callBackAfterFocus = callbackAfterFocus.bind(this, x, y, e);
        else
            callbackAfterFocus.bind(this, x, y, e)();

        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);

        oViewer.activeForm = this;
    };
    
    /**
	 * Selects the specified option.
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
	 */
    CComboBoxField.prototype.SelectOption = function(nIdx) {
        if (this.GetCurIdxs() == nIdx)
            return;

        CreateNewHistoryPointForField(this, true);

        let oPara = this.content.GetElement(0);
        let oRun = oPara.GetElement(0);

        oRun.ClearContent();
        if (Array.isArray(this._options[nIdx])) {
            oRun.AddText(this._options[nIdx][0]);
            this._value = this._options[nIdx][0];
        }
        else {
            oRun.AddText(this._options[nIdx]);
            this._value = this._options[nIdx];
        }

        this.SetNeedRecalc(true);
        this.SetNeedCommit(true);

        this.content.MoveCursorToStartPos();
    };

    CComboBoxField.prototype.SetValue = function(sValue) {
        let sTextToAdd = "";
        let nIdx = -1;
        for (let i = 0; i < this._options.length; i++) {
            if (this._options[i][1] && this._options[i][1] == sValue) {
                sTextToAdd = this._options[i][0];
                nIdx = i;
                break;
            }
        }
        if (sTextToAdd == "") {
            for (let i = 0; i < this._options.length; i++) {
                if (this._options[i] == sValue) {
                    sTextToAdd = this._options[i];
                    nIdx = i;
                    break;
                }
            }
        }
        
        if (sTextToAdd == "")
            sTextToAdd = sValue;

        let oPara = this.content.GetElement(0);
        oPara.RemoveFromContent(1, oPara.GetElementsCount() - 1);
        let oRun = oPara.GetElement(0);
        oRun.ClearContent();

        if (sTextToAdd) {
            oRun.AddText(sTextToAdd);
            this.content.MoveCursorToStartPos();
        }

        this._currentValueIndices = nIdx;

        if (private_getViewer().IsOpenFormsInProgress)
            this.SetApiValue(sValue);
    };
    CComboBoxField.prototype.SetValueFormat = function(sValue) {
        this.contentFormat.GetElement(0).GetElement(0).AddText(sValue);
    };

    /**
	 * Synchronizes this field with fields with the same name.
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
	 */
    CComboBoxField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {

                this._calcOrderIndex    = aFields[i]._calcOrderIndex;
                this._doNotSpellCheck   = aFields[i]._doNotSpellCheck;
                this._editable          = aFields[i]._editable;

                let oPara = this.content.GetElement(0);
                let oParaToCopy = aFields[i].content.GetElement(0);

                oPara.ClearContent();
                for (var nPos = 0; nPos < oParaToCopy.Content.length - 1; nPos++) {
                    oPara.Internal_Content_Add(nPos, oParaToCopy.GetElement(nPos).Copy());
                }
                oPara.CheckParaEnd();
                
                this._options = aFields[i]._options.slice();
                break;
            }
        }
    };
    CComboBoxField.prototype.EnterText = function(aChars, bForce)
    {
        if (this._editable == false && !bForce)
            return false;

        if (aChars.length > 0)
            CreateNewHistoryPointForField(this, true);
        else
            return false;

        let oPara = this.content.GetElement(0);
        if (this.content.IsSelectionUse()) {
            // Если у нас что-то заселекчено и мы вводим текст или пробел
			// и т.д., тогда сначала удаляем весь селект.
            this.content.Remove(1, true, false, true);
        }
        
        for (let index = 0, count = aChars.length; index < count; ++index) {
            let codePoint = aChars[index];
            oPara.AddToParagraph(AscCommon.IsSpace(codePoint) ? new AscWord.CRunSpace(codePoint) : new AscWord.CRunText(codePoint));
        }

        if (this.DoKeystrokeAction() == false) {
            return false;
        }

        this.SetNeedRecalc(true);
        this.SetNeedCommit(true); // флаг что значение будет применено к остальным формам с таким именем
        
        if (this.IsChanged() == false)
            this.SetWasChanged(true);

        return true;
    };
    /**
	 * Applies value of this field to all field with the same name.
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
	 */
    CComboBoxField.prototype.Commit = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        let oThisPara = this.content.GetElement(0);
        
        if (this.DoFormatAction() == false) {
            if (this.IsChanged() == false)
                this.SetDrawFromStream(true);

            return;
        }

        this.CorrectHistoryPoints();
        if (true != private_getViewer().isOnUndoRedo) {
            if (this.GetApiValue() != this.GetValue()) {
                if (this.GetDocument().IsNeedSkipHistory() == false) {
                    CreateNewHistoryPointForField(this);
                    AscCommon.History.Add(new CChangesPDFFormValue(this, this.GetApiValue(), this.GetValue()));
                }
                this.SetApiValue(this.GetValue());
            }
        }
        
        this.UpdateIndexies();
        TurnOffHistory();

        if (aFields.length == 1)
            this.SetNeedCommit(false);

        for (let i = 0; i < aFields.length; i++) {
            aFields[i].SetWasChanged(true);

            if (this.HasShiftView())
                aFields[i].content.MoveCursorToStartPos();

            if (aFields[i] == this) {
                if (this.HasShiftView())
                    this.AddToRedraw();

                continue;
            }

            aFields[i].SetApiValue(this.GetApiValue());

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

            aFields[i]._currentValueIndices = this._currentValueIndices;
            aFields[i].SetNeedRecalc(true);
        }

        let oParaFromFormat = this.contentFormat.GetElement(0);
        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] == this)
                continue;

            let oFieldPara = aFields[i].contentFormat.GetElement(0);
            let oThisRun, oFieldRun;
            for (let nItem = 0; nItem < oParaFromFormat.Content.length - 1; nItem++) {
                oThisRun = oParaFromFormat.Content[nItem];
                oFieldRun = oFieldPara.Content[nItem];
                oFieldRun.ClearContent();

                for (let nRunPos = 0; nRunPos < oThisRun.Content.length; nRunPos++) {
                    oFieldRun.AddToContent(nRunPos, AscCommon.IsSpace(oThisRun.Content[nRunPos].Value) ? new AscWord.CRunSpace(oThisRun.Content[nRunPos].Value) : new AscWord.CRunText(oThisRun.Content[nRunPos].Value));
                }
            }

            aFields[i].SetNeedRecalc(true);
        }

        this.SetNeedCommit(false);
        this.needValidate = true;
    };
    /**
	 * Checks curValueIndex, corrects it and return.
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
     * @returns {number}
	 */
    CComboBoxField.prototype.UpdateIndexies = function() {
        let sValue = this.content.GetElement(0).GetText({ParaEndToSpace: false});
        this._value = sValue;
        let nIdx = -1;
        for (let i = 0; i < this._options.length; i++) {
            if (this._options[i][0] === sValue) {
                nIdx = i;
                break;
            }
        }
        for (let i = 0; i < this._options.length; i++) {
            if (this._options[i] === sValue) {
                nIdx = i;
                break;
            }
        }

        this._currentValueIndices = nIdx;
        return nIdx;
    };

    CComboBoxField.prototype.SetEditable = function(bValue) {
        this._editable = bValue;
    };
    CComboBoxField.prototype.SetOptions = function(aOpt) {
        let aOptToPush = [];
        for (let i = 0; i < aOpt.length; i++) {
            if (aOpt[i] == null)
                continue;
            if (typeof(aOpt[i]) == "string" && aOpt[i] != "")
                aOptToPush.push(aOpt[i]);
            else if (Array.isArray(aOpt[i]) && aOpt[i][0] != undefined && aOpt[i][1] != undefined) {
                if (aOpt[i][0].toString && aOpt[i][1].toString) {
                    aOptToPush.push([aOpt[i][0].toString(), aOpt[i][1].toString()])
                }
            }
            else if (typeof(aOpt[i]) != "string" && aOpt[i].toString) {
                aOptToPush.push(aOpt[i].toString());
            }
        }

        this._options = aOptToPush;
    };
    CComboBoxField.prototype.GetValue = function() {
        // to do обработать rich value
        let sValue = this.content.GetElement(0).GetText({ParaEndToSpace: false});
        for (let i = 0; i < this._options.length; i++) {
            if (Array.isArray(this._options[i])) {
                if (this._options[i][0] == sValue)
                    return this._options[i][1];
            }
        }
        
        return sValue;
    };
    

    /**
	 * Gets current index (can be not commited to all with the same name).
	 * @memberof CComboBoxField
	 * @typeofeditors ["PDF"]
	 */
    CComboBoxField.prototype.GetCurIdxs = function() {
        let sValue = this.content.GetElement(0).GetText({ParaEndToSpace: false});
        for (let i = 0; i < this._options.length; i++) {
            if (Array.isArray(this._options[i])) {
                if (this._options[i][0] == sValue)
                    return i;
            }
        }
        
        return -1;
    };
    
    function CListBoxField(sName, nPage, aRect)
    {
        CBaseListField.call(this, sName, FIELD_TYPE.listbox, nPage, aRect);

        this._multipleSelection = false;

        // internal
        this._scrollInfo = null;
        this._bAutoShiftContentView = true;
    };
    CListBoxField.scrollCount = 0;
    CListBoxField.prototype = Object.create(CBaseListField.prototype);
	CListBoxField.prototype.constructor = CListBoxField;

    CListBoxField.prototype.Draw = function() {
        if (this.IsHidden() == true)
            return;

        let oViewer         = private_getViewer();
        let oGraphicsWord   = oViewer.pagesInfo.pages[this.GetPage()].graphics.word;
        let aRect           = this.GetRect();

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

        let oMargins = this.GetMarginsFromBorders(false, false);

        let contentX        = (X + oMargins.left) * g_dKoef_pix_to_mm;
        let contentY        = (Y + oMargins.top) * g_dKoef_pix_to_mm;
        let contentXLimit   = (X + nWidth - oMargins.left) * g_dKoef_pix_to_mm;
        let contentYLimit   = (Y + nHeight - oMargins.bottom) * g_dKoef_pix_to_mm;
        
        this._formRect.X = X * g_dKoef_pix_to_mm;
        this._formRect.Y = Y * g_dKoef_pix_to_mm;
        this._formRect.W = nWidth * g_dKoef_pix_to_mm;
        this._formRect.H = nHeight * g_dKoef_pix_to_mm;

        this.contentRect.X = contentX;
        this.contentRect.Y = contentY;
        this.contentRect.W = contentXLimit - contentX;
        this.contentRect.H = contentYLimit - contentY;

        this.content.Content.forEach(function(para) {
            para.Pr.Ind.FirstLine = oMargins.left * g_dKoef_pix_to_mm;
            para.RecalcCompiledPr(true);
        });

        if (contentX != this._oldContentPos.X || contentY != this._oldContentPos.Y ||
        contentXLimit != this._oldContentPos.XLimit) {
            this.content.X      = this._oldContentPos.X        = contentX;
            this.content.Y      = this._oldContentPos.Y        = contentY;
            this.content.XLimit = this._oldContentPos.XLimit   = contentXLimit;
            this.content.YLimit = this._oldContentPos.YLimit   = 20000;
            this.content.Recalculate_Page(0, true);
        }
        else if (this.IsNeedRecalc()) {
            this.content.Content.forEach(function(element) {
                element.Recalculate_Page(0);
            });
            this.SetNeedRecalc(false);
        }
        
        if (this._bAutoShiftContentView)
            this.CheckFormViewWindow();
        else {
            this.content.ResetShiftView();
            this.content.ShiftView(this._curShiftView.x, this._curShiftView.y);
        }

        oGraphicsWord.AddClipRect(this.content.X, this.content.Y, this.content.XLimit - this.content.X, contentYLimit - contentY);
        this.content.Draw(0, oGraphicsWord);
        oGraphicsWord.RemoveClip();
    };

    /**
	 * Synchronizes this field with fields with the same name.
	 * @memberof CListBoxField
	 * @typeofeditors ["PDF"]
	 */
    CListBoxField.prototype.SyncField = function() {
        let aFields = this._doc.GetFields(this.GetFullName());
        
        TurnOffHistory();

        for (let i = 0; i < aFields.length; i++) {
            if (aFields[i] != this) {
                this._multipleSelection = aFields[i]._multipleSelection;
                this.content.Internal_Content_RemoveAll();
                for (let nItem = 0; nItem < aFields[i].content.Content.length; nItem++) {
                    this.content.Internal_Content_Add(nItem, aFields[i].content.Content[nItem].Copy());
                }
                
                this._options = aFields[i]._options.slice();
                this._currentValueIndices = aFields.multipleSelection ? aFields[i]._currentValueIndices.slice() : aFields[i]._currentValueIndices;

                let oPara;
                for (let i = 0; i < this.content.Content.length; i++) {
                    oPara = this.content.GetElement(i);
                    if (oPara.Pr.Shd && oPara.Pr.Shd.IsNil() == false)
                        oPara.RecalcCompiledPr(true);
                }
                break;
            }
        }
    };
    /**
	 * Applies value of this field to all field with the same name.
	 * @memberof CListBoxField
     * @param {CListBoxField} [oFieldToSkip] - field to don't be apply changes.
	 * @typeofeditors ["PDF"]
	 */
    CListBoxField.prototype.Commit = function(oFieldToSkip) {
        let aFields = this._doc.GetFields(this.GetFullName());
        let oThis = this;
        
        this.CheckFormViewWindow();
        this.RevertContentViewToOriginal();

        let oThisBounds = this.getFormRelRect();

        if (true != private_getViewer().isOnUndoRedo && this.GetApiValue() != this.GetValue()) {
            if (this.GetDocument().IsNeedSkipHistory() == false) {
                CreateNewHistoryPointForField(this);
                AscCommon.History.Add(new CChangesPDFFormValue(this, this.GetApiValue(), this.GetValue()));
            }
            this.UpdateIndexies();
            this.SetApiValue(this.GetValue());
        }
        
        TurnOffHistory();

        aFields.forEach(function(field) {
            field.SetWasChanged(true);

            field._bAutoShiftContentView = false;

            field.SetNeedRecalc(true);
            if (field.HasShiftView()) {
                if (field == oThis) {
                    field.AddToRedraw();
                    return;
                }
            }

            field.SetApiValue(oThis.GetApiValue());

            if (oThis == field || oFieldToSkip == field)
                return;

            if (oThis._multipleSelection) {
                // снимаем выделение с тех, которые не присутсвуют в поле, от которого применяем ко всем
                for (let i = 0; i < field._currentValueIndices.length; i++) {
                    if (oThis._currentValueIndices.includes(field._currentValueIndices[i]) == false) {
                        field.UnselectOption(field._currentValueIndices[i]);
                    }
                }
                
                for (let i = 0; i < oThis._currentValueIndices.length; i++) {
                    // добавляем выделение тем, которые не присутсвуют в текущем поле, но присутсвуют в том, от которого применяем
                    if (field._currentValueIndices.includes(oThis._currentValueIndices[i]) == false) {
                        field.SelectOption(oThis._currentValueIndices[i], false);
                    }
                }
                field._currentValueIndices = oThis._currentValueIndices.slice();
            }
            else {
                field._currentValueIndices = oThis._currentValueIndices;
                field.SelectOption(field._currentValueIndices, true);
            }

            let oFieldBounds = field.getFormRelRect();
            if (Math.abs(oFieldBounds.H - oThisBounds.H) > 0.001) {
                field.CheckFormViewWindow();
                field.RevertContentViewToOriginal();
            }
            else {
                field._curShiftView.x = oThis._curShiftView.x;
                field._curShiftView.y = oThis._curShiftView.y;
                field._originShiftView.x = oThis._originShiftView.x;
                field._originShiftView.y = oThis._originShiftView.y;
            }
        });
    };
    
    CListBoxField.prototype.SetMultipleSelection = function(bValue) {
        if (bValue == true) {
            this._multipleSelection = true;
            this._currentValueIndices = [this._currentValueIndices];
        }
        else {
            this._multipleSelection = false;
            this._currentValueIndices = this._currentValueIndices[0];
            this._currentValueIndices != -1 && this.SelectOption(this._currentValueIndices, true);
        }
    };

    CListBoxField.prototype.SelectOption = function(nIdx, isSingleSelect) {
        if (this.GetCurIdxs() == nIdx)
            return;
            
        let oPara = this.content.GetElement(nIdx);
        let oApiPara;
        
        this.content.Set_CurrentElement(nIdx);
        if (isSingleSelect) {
            this.content.Content.forEach(function(para) {
                oApiPara = editor.private_CreateApiParagraph(para);
                if (para.Pr.Shd && para.Pr.Shd.IsNil() == false) {
                    oApiPara.SetShd('nil');
                    para.RecalcCompiledPr(true);
                }
            });
        }

        if (oPara) {
            oApiPara = editor.private_CreateApiParagraph(oPara);
            oApiPara.SetShd('clear', LISTBOX_SELECTED_COLOR.r, LISTBOX_SELECTED_COLOR.g, LISTBOX_SELECTED_COLOR.b);
            oApiPara.Paragraph.RecalcCompiledPr(true);
        }

        this.SetNeedRecalc(true);
        this.SetNeedCommit(true);
    };
    CListBoxField.prototype.UnselectOption = function(nIdx) {
        let oApiPara = editor.private_CreateApiParagraph(this.content.GetElement(nIdx));
        oApiPara.SetShd('nil');
        oApiPara.Paragraph.RecalcCompiledPr(true);
        this.SetNeedRecalc(true);
    };
    CListBoxField.prototype.SetOptions = function(aOpt) {
        this.content.Internal_Content_RemoveAll();
        for (let i = 0; i < aOpt.length; i++) {
            if (aOpt[i] == null)
                continue;
            sCaption = "";
            if (typeof(aOpt[i]) == "string" && aOpt[i] != "") {
                sCaption = aOpt[i];
                this._options.push(aOpt[i]);
            }
            else if (Array.isArray(aOpt[i]) && aOpt[i][0] != undefined && aOpt[i][1] != undefined) {
                if (aOpt[i][0].toString && aOpt[i][1].toString) {
                    this._options.push([aOpt[i][0].toString(), aOpt[i][1].toString()]);
                    sCaption = aOpt[i][0].toString();
                }
            }
            else if (typeof(aOpt[i]) != "string" && aOpt[i].toString) {
                this._options.push(aOpt[i].toString());
                sCaption = aOpt[i].toString();
            }

            if (sCaption != "") {
                oPara = new AscCommonWord.Paragraph(this.content.DrawingDocument, this.content, false);
                oRun = new AscCommonWord.ParaRun(oPara, false);
                this.content.Internal_Content_Add(i, oPara);
                oPara.Add(oRun);
                oRun.AddText(sCaption);
            }
        }
    };
    CListBoxField.prototype.SetValue = function(value) {
        let aIndexes = [];
        if (Array.isArray(value)) {
            for (let sVal of value) {
                let isFound = false;
                for (let i = 0; i < this._options.length; i++) {
                    if (this._options[i][1] && this._options[i][1] == sVal) {
                        if (aIndexes.includes(i))
                            continue;
                        else {
                            isFound = true;
                            aIndexes.push(i);
                            break;
                        }
                    }
                }
                if (isFound == false) {
                    for (let i = 0; i < this._options.length; i++) {
                        if (this._options[i] == sVal) {
                            if (aIndexes.includes(i))
                                continue;
                            else {
                                aIndexes.push(i);
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this._options.length; i++) {
                if (this._options[i][1] && this._options[i][1] == value) {
                    aIndexes.push(i);
                    break;
                }
            }
            if (aIndexes.length == 0) {
                for (let i = 0; i < this._options.length; i++) {
                    if (this._options[i] == value) {
                        aIndexes.push(i);
                        break;
                    }
                }
            }
        }

        this._currentValueIndices = this._multipleSelection == true ? aIndexes : aIndexes[0];
        
        if (private_getViewer().IsOpenFormsInProgress)
            this.SetApiValue(sValue);

        for (let idx of aIndexes) {
            if (this._multipleSelection) {
                this.SelectOption(idx, false);
            }
            else
                this.SelectOption(idx, true);
        }
    };
    CListBoxField.prototype.InsertOption = function(sName, sExport, nIdx) {
        let optToInsert = sExport ? [sName, sExport] : sName;
        if (nIdx == -1 || nIdx > this._options.length) {
            nIdx = this._options.length;
        }

        let oIdxItem = this.content.GetElement(nIdx);

        this._options = this._options.splice(nIdx, 0, optToInsert);
        
        let oPara = new AscCommonWord.Paragraph(this.content.DrawingDocument, this.content, false);
        let oRun = new AscCommonWord.ParaRun(oPara, false);
        this.content.Internal_Content_Add(nIdx, oPara);
        oPara.Add(oRun);
        oRun.AddText(sName);
    };

    CListBoxField.prototype.onMouseDown = function(x, y, e) {
        let oViewer         = private_getViewer();
        let oDoc            = this.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        function callbackAfterFocus(x, y, e) {
            if (this._options.length == 0)
                return;
            
            let {X, Y} = private_getPageCoordsMM(x, y, this.GetPage());
            
            editor.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
            editor.WordControl.m_oDrawingDocument.m_lCurrentPage = 0;
            editor.WordControl.m_oDrawingDocument.m_lPagesCount = oViewer.file.pages.length;

            let nPos = this.content.Internal_GetContentPosByXY(X, Y, 0);
            let oPara = this.content.GetElement(nPos);
            let oShd = oPara.Pr.Shd;

            this.UpdateScroll(true);
            if (this.IsNeedDrawFromStream() == true) {
                this.SetDrawFromStream(false);
                this.AddToRedraw();
            }

            if (this._multipleSelection == true) {
                if (e.ctrlKey == true) {
                    if (oShd && oShd.IsNil() == false) {
                        this.UnselectOption(nPos);
                    }
                    else {
                        this.SelectOption(nPos, false);
                    }
                }
                else {
                    this.SelectOption(nPos, true);
                }
            }
            else {
                this.SelectOption(nPos, true);
            }

            if (this.IsNeedCommit()) {
                this._bAutoShiftContentView = true;
                this.UnionLastHistoryPoints(false);

                if (this._commitOnSelChange == true) {
                    this.Commit();
                }

                oViewer._paintForms();
            }

            oViewer.activeForm = this;
        }

        // вызываем выставление курсора после onFocus, если уже в фокусе, тогда сразу.
        if (oViewer.activeForm != this && this._triggers.OnFocus && this._triggers.OnFocus.Actions.length > 0)
            oActionsQueue.callBackAfterFocus = callbackAfterFocus.bind(this, x, y, e);
        else
            callbackAfterFocus.bind(this, x, y, e)();

        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseDown);
        if (oViewer.activeForm != this)
            this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);
    };
    CListBoxField.prototype.MoveSelectDown = function() {
        this._bAutoShiftContentView = true;
        this.content.MoveCursorDown();

        if (this._multipleSelection == true) {
            this.SelectOption(this.content.CurPos.ContentPos, true);
            this._currentValueIndices = [this.content.CurPos.ContentPos];
        }
        else {
            this.SelectOption(this.content.CurPos.ContentPos, true);
            this._currentValueIndices = this.content.CurPos.ContentPos;
        }
        
        this.AddToRedraw();
        private_getViewer()._paintForms();
        this.UpdateScroll(true);
    };
    CListBoxField.prototype.MoveSelectUp = function() {
        this._bAutoShiftContentView = true;
        this.content.MoveCursorUp();

        if (this._multipleSelection == true) {
            this.SelectOption(this.content.CurPos.ContentPos, true);
            this._currentValueIndices = [this.content.CurPos.ContentPos];
        }
        else {
            this.SelectOption(this.content.CurPos.ContentPos, true);
            this._currentValueIndices = this.content.CurPos.ContentPos;
        }

        this.AddToRedraw();
        private_getViewer()._paintForms();
        this.UpdateScroll(true);
    };
    CListBoxField.prototype.UpdateScroll = function(bShow) {
        let oContentBounds  = this.content.GetContentBounds(0);
        let oContentRect    = this.getFormRelRect();
        let oFormRect       = this.getFormRect();

        let nContentH       = oContentBounds.Bottom - oContentBounds.Top;
        let oScroll, oScrollDocElm, oScrollSettings;

        if (typeof(bShow) != "boolean" && this._scrollInfo)
            bShow = this._scrollInfo.scroll.canvas.style.display == "none" ? false : true;

        if (nContentH < oContentRect.H || this._doNotScroll) {
            
            if (bShow == false && this._scrollInfo)
                this._scrollInfo.scroll.canvas.style.display = "none";
            return;
        }

        let oViewer = private_getViewer();
        
        let oGlobalCoords1  = private_getGlobalCoordsByPageCoords(oFormRect.X, oFormRect.Y, this.GetPage());
        let oGlobalCoords2  = private_getGlobalCoordsByPageCoords(oFormRect.X + oFormRect.W, oFormRect.Y + oFormRect.H, this.GetPage());
        let oBorderWidth    = this.GetBordersWidth(true);
        
        if (this._scrollInfo == null && oContentBounds.Bottom - oContentBounds.Top > oContentRect.H) {
            CListBoxField.scrollCount++;
            oScrollDocElm = document.createElement('div');
            document.getElementById('editor_sdk').appendChild(oScrollDocElm);
            oScrollDocElm.id = "formScroll_" + CListBoxField.scrollCount;
            oScrollDocElm.style.top         = Math.round(oGlobalCoords1.Y) + 'px';
            oScrollDocElm.style.left        = Math.round(oGlobalCoords2.X) + 'px';
            oScrollDocElm.style.position    = "absolute";
            oScrollDocElm.style.display     = "block";
			oScrollDocElm.style.width       = "14px";
			oScrollDocElm.style.height      = Math.round(oGlobalCoords2.Y) - Math.round(oGlobalCoords1.Y) + "px";

            let nMaxShiftY = oContentRect.H - nContentH;

            oScrollSettings = editor.WordControl.CreateScrollSettings();
            oScrollSettings.isHorizontalScroll = false;
		    oScrollSettings.isVerticalScroll = true;
		    oScrollSettings.contentH = Math.abs(nMaxShiftY);
            oScrollSettings.screenH = 0;
            oScrollSettings.scrollerMinHeight = 5;
            
            let nScrollCoeff = this._curShiftView.y / nMaxShiftY;
            
            let oPara = this.content.GetElement(0);
            let oCurParaHeight  = oPara.Lines[0].Bottom - oPara.Lines[0].Top;

            oScrollSettings.vscrollStep = oCurParaHeight;
            oScroll = new AscCommon.ScrollObject(oScrollDocElm.id, oScrollSettings);

            let oThis = this;
            oScroll.bind("scrollvertical", function(evt) {
                oThis.ScrollVertical(evt.scrollD, evt.maxScrollY);
            });
            oScroll.bind("mouseup", function(evt) {
                if (oThis.type == "listbox")
                    oThis.ScrollVerticalEnd();
            });

            oScroll.scrollVCurrentY = oScroll.maxScrollY * nScrollCoeff;
            
            this._scrollInfo = {
                scroll:         oScroll,
                docElem:        oScrollDocElm,
                baseYPos:       parseInt(oScrollDocElm.style.top),
                oldZoom:        oViewer.zoom,
                scrollCoeff:    nScrollCoeff // проскроленная часть
            }

            oScroll.Repos(oScrollSettings, false);
        }
        else if (this._scrollInfo) {
            let nMaxShiftY = oContentRect.H - nContentH;
            let needUpdatePos = this._scrollInfo.oldZoom != oViewer.zoom || oGlobalCoords1.Y - oBorderWidth.top != this._scrollInfo.baseYPos;

            if (needUpdatePos) {
                oScrollSettings = editor.WordControl.CreateScrollSettings();
                oScrollSettings.isHorizontalScroll = false;
                oScrollSettings.isVerticalScroll = true;
                oScrollSettings.contentH = Math.abs(nMaxShiftY);
                oScrollSettings.screenH = 0;
                oScrollSettings.scrollerMinHeight = 5;
                this._scrollInfo.scroll.scrollVCurrentY = this._scrollInfo.scroll.maxScrollY * this._scrollInfo.scrollCoeff;
                this._scrollInfo.scroll.Repos(oScrollSettings, false);
                let nScrollCoeff = this.content.ShiftViewY / nMaxShiftY;
                this._scrollInfo.scrollCoeff = nScrollCoeff;

                this._scrollInfo.docElem.style.top      = Math.round(oGlobalCoords1.Y) + 'px';
                this._scrollInfo.docElem.style.left     = Math.round(oGlobalCoords2.X) + 'px';
                this._scrollInfo.docElem.style.height   = Math.round(oGlobalCoords2.Y) - Math.round(oGlobalCoords1.Y) + "px";
            
                this._scrollInfo.oldZoom = oViewer.zoom;
                this._scrollInfo.baseYPos = parseInt(this._scrollInfo.docElem.style.top);
            }

            if (bShow === true)
                this._scrollInfo.scroll.canvas.style.display = "";
            if (bShow === false)
                this._scrollInfo.scroll.canvas.style.display = "none";
        }
    };
    CListBoxField.prototype.ScrollVertical = function(scrollY, maxYscroll) {
        this._bAutoShiftContentView = false;

        let nScrollCoeff                = scrollY / maxYscroll;
        this._curShiftView.y            = -nScrollCoeff * maxYscroll;
        this._scrollInfo.scrollCoeff    = nScrollCoeff;
        this.AddToRedraw();
        private_getViewer()._paintForms();
    };
    CListBoxField.prototype.ScrollVerticalEnd = function() {
        let nHeightPerPara  = this.content.GetElement(1).Y - this.content.GetElement(0).Y;
        let nShiftCount     = this._curShiftView.y / nHeightPerPara; // количество смещений в длинах параграфов
        if (Math.abs(Math.round(nShiftCount) - nShiftCount) <= 0.001)
            return;

        let nMaxShiftY                  = this._scrollInfo.scroll.maxScrollY;
        this._curShiftView.y            = Math.round(nShiftCount) * nHeightPerPara;
        this._bAutoShiftContentView     = false;
        this._scrollInfo.scrollCoeff    = Math.abs(this._curShiftView.y / nMaxShiftY);
        
        this.AddToRedraw();
        private_getViewer()._paintForms();
    };
    /**
	 * Checks curValueIndices, corrects it and return.
	 * @memberof CListBoxField
	 * @typeofeditors ["PDF"]
     * @returns {number}
	 */
    CListBoxField.prototype.UpdateIndexies = function() {
        let nIdx;
        if (this._multipleSelection)
            nIdx = []
        else
            nIdx = -1;

        let oCurPara;
        for (let i = 0; i < this.content.Content.length; i++) {
            oCurPara = this.content.GetElement(i);
            if (oCurPara.Pr.Shd && oCurPara.Pr.Shd.IsNil() == false) {
                if (this._multipleSelection)
                    nIdx.push(i);
                else {
                    nIdx = i;
                    break;
                }
            }
        }

        this._currentValueIndices = nIdx;
        return nIdx;
    };
    /**
	 * Updates the selections according to the indices.
	 * @memberof CListBoxField
	 * @typeofeditors ["PDF"]
     * @returns {number}
	 */
    CListBoxField.prototype.UpdateSelection = function() {
        if (Array.isArray(this._currentValueIndices)) {
            for (let idx of this._currentValueIndices)
                this.SelectOption(nIdx, false);
        }
        else
            this.SelectOption(this._currentValueIndices, true);
    };
    
    CListBoxField.prototype.CheckFormViewWindow = function()
    {
        let curIdx = this.GetCurIdxs();
        let nFirstSelectedPara = Array.isArray(curIdx) ? Number(curIdx[0]) : Number(curIdx);
        let oParagraph  = this.content.GetElement(nFirstSelectedPara);

        // размеры всего контента
        let oPageBounds     = this.content.GetContentBounds(0);
        let oCurParaHeight  = oParagraph.Lines[0].Bottom - oParagraph.Lines[0].Top;

        let oFormBounds = this.getFormRelRect();
        let nDy = 0, nDx = 0;
        
        if (oPageBounds.Bottom - oPageBounds.Top > oFormBounds.H) {
            if (oParagraph.Y + oCurParaHeight > oFormBounds.Y + oFormBounds.H)
                nDy = oFormBounds.Y + oFormBounds.H - (oParagraph.Y + oCurParaHeight);
            else if (oParagraph.Y < oFormBounds.Y)
                nDy = oFormBounds.Y - oParagraph.Y;
            else if (oParagraph.Y + oCurParaHeight < oFormBounds.Y)
                nDy = oCurParaHeight;
        }

        if (Math.abs(nDx) > 0.001 || Math.abs(nDy))
        {
            this.content.ShiftView(nDx, nDy);
            this._originShiftView = {
                x: this.content.ShiftViewX,
                y: this.content.ShiftViewY
            }
            
            this._curShiftView.x = this._originShiftView.x;
            this._curShiftView.y = this._originShiftView.y;
        }
        else {
            this._originShiftView.x = this._curShiftView.x;
            this._originShiftView.y = this._curShiftView.y;
        }
    };
    /**
	 * Gets real form value (can be not commited).
	 * @memberof CListBoxField
	 * @typeofeditors ["PDF"]
	 */
    CListBoxField.prototype.GetValue = function() {
        let oPara, oShd;
        if (this._multipleSelection) {
            let aIndexes = [];
            for (let i = 0; nCount = this.content.GetElementsCount(), i < nCount; i++) {
                oPara = this.content.GetElement(i);
                oShd = oPara.Pr.Shd;
                if (oShd && oShd.IsNil() == false)
                    aIndexes.push(Array.isArray(this._options[i]) ? this._options[i][1] : this._options[i]);
            }

            return aIndexes;
        }
        else {
            for (let i = 0; nCount = this.content.GetElementsCount(), i < nCount; i++) {
                oPara = this.content.GetElement(i);
                oShd = oPara.Pr.Shd;
                if (oShd && oShd.IsNil() == false)
                    return Array.isArray(this._options[i]) ? this._options[i][1] : this._options[i];
            }
        }
    };
    CListBoxField.prototype.GetCurIdxs = function() {
        let oPara, oShd;
        if (this._multipleSelection) {
            let aIndexes = [];
            for (let i = 0; nCount = this.content.GetElementsCount(), i < nCount; i++) {
                oPara = this.content.GetElement(i);
                oShd = oPara.Pr.Shd;
                if (oShd && oShd.IsNil() == false)
                    aIndexes.push(i);
            }

            return aIndexes;
        }
        else {
            for (let i = 0; nCount = this.content.GetElementsCount(), i < nCount; i++) {
                oPara = this.content.GetElement(i);
                oShd = oPara.Pr.Shd;
                if (oShd && oShd.IsNil() == false)
                    return i;
            }
        }
    };
     
    function CSignatureField(sName, nPage, aRect)
    {
        CBaseField.call(this, sName, FIELD_TYPE.signature, nPage, aRect);
    };

    function CFormTriggers() {
        this.MouseUp = null; 
        this.MouseDown = null; 
        this.MouseEnter = null; 
        this.MouseExit = null; 
        this.OnFocus = null; 
        this.OnBlur = null; 
        this.Keystroke = null; 
        this.Validate = null; 
        this.Calculate = null; 
        this.Format = null;
    }
    CFormTriggers.prototype.Copy = function() {
        let newObj = new CFormTriggers();
        if (this.MouseUp != null)
            newObj.MouseUp = this.MouseUp.Copy(); 
        if (this.MouseDown != null)
            newObj.MouseDown = this.MouseDown.Copy(); 
        if (this.MouseEnter != null)
            newObj.MouseEnter = this.MouseEnter.Copy(); 
        if (this.MouseExit != null)
            newObj.MouseExit = this.MouseExit.Copy(); 
        if (this.OnFocus != null)
            newObj.OnFocus = this.OnFocus.Copy(); 
        if (this.OnBlur != null)
            newObj.OnBlur = this.OnBlur.Copy(); 
        if (this.Keystroke != null)
            newObj.Keystroke = this.Keystroke.Copy(); 
        if (this.Validate != null)
            newObj.Validate = this.Validate.Copy(); 
        if (this.Calculate != null)
            newObj.Calculate = this.Calculate.Copy(); 
        if (this.Format != null)
            newObj.Format = this.Format.Copy();

        return newObj;
    }

    function CFormTrigger(type, aActions) {
        this.type = type;

        // actions
        this.Actions = aActions;
    }
    CFormTrigger.prototype.Copy = function() {
        return new CFormTrigger(this.type, this.script);
    };
    CFormTrigger.prototype.GetActions = function() {
        return this.Actions;
    };

    function CActionBase(nType) {
        this.type = nType;
        this.field = null;
        this.triggerType = undefined;
    };
    CActionBase.prototype.GetType = function() {
        return this.type;
    };
    CActionBase.prototype.SetField = function(oField) {
        this.field = oField;
    };
    CActionBase.prototype.SetTrigger = function(nType) {
        this.triggerType = nType;
    };

    function CActionGoTo(nPage, nGoToType, nZoom, oRect) {
        CActionBase.call(this, ACTIONS_TYPES.GT);
        this.page       = nPage;
        this.goToType   = nGoToType;
        this.zoom       = nZoom;
        this.rect       = oRect; // top right bottom left
    };
    CActionGoTo.prototype = Object.create(CActionBase.prototype);
	CActionGoTo.prototype.constructor = CActionGoTo;

    CActionGoTo.prototype.GetZoom = function() {
        if (this.zoom != null)
            return this.zoom;

        let oViewer     = private_getViewer();
        let nNoZoomH    = oViewer.drawingPages[this.page].H / oViewer.zoom;
        let nNoZoomW    = oViewer.drawingPages[this.page].W / oViewer.zoom;

        let nScaleY = oViewer.drawingPages[this.page].H / oViewer.file.pages[this.page].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[this.page].W / oViewer.file.pages[this.page].W / oViewer.zoom;

        switch (this.goToType) {
            case GOTO_TYPES.xyz: // inherit zoom
                break;
            case GOTO_TYPES.fit:
            case GOTO_TYPES.fitB: { // fit to max of heigth/width
                let nVerZoom = ((oViewer.canvas.height / (nNoZoomH * AscCommon.AscBrowser.retinaPixelRatio)) * 100 >> 0) / 100;
                let nHorZoom = ((oViewer.canvas.width / (nNoZoomW * AscCommon.AscBrowser.retinaPixelRatio)) * 100 >> 0) / 100;

                this.zoom = Math.min(nHorZoom, nVerZoom);
                break;
            }
            case GOTO_TYPES.fitH:
            case GOTO_TYPES.fitBH: { // fit to width
                this.zoom = ((oViewer.canvas.width / (nNoZoomW * AscCommon.AscBrowser.retinaPixelRatio)) * 100 >> 0) / 100;
                break;
            }
            case GOTO_TYPES.fitV:
            case GOTO_TYPES.fitBV: { // fit to heigth
                this.zoom = ((oViewer.canvas.height / (nNoZoomH * AscCommon.AscBrowser.retinaPixelRatio)) * 100 >> 0) / 100;
                break;
            }
            case GOTO_TYPES.fitR: { // fit to rect
                let nRectW = (this.rect.right - this.rect.left) * nScaleX * AscCommon.AscBrowser.retinaPixelRatio;
                let nRectH = (this.rect.bottom - this.rect.top) * nScaleY * AscCommon.AscBrowser.retinaPixelRatio;

                let nVerZoom = ((oViewer.canvas.height / (nRectH)) * 100 >> 0) / 100;
                let nHorZoom = ((oViewer.canvas.width / (nRectW)) * 100 >> 0) / 100;

                let nMinZoom = Math.min(nHorZoom, nVerZoom);
                
                // далее вычисляем ширину с новым потенциальным зумом,
                // если при данных размерах будет добавлен скролл, то вычитаем его ширину и пересчитываем zoom
                let nNewPageW = oViewer.drawingPages[this.page].W = (oViewer.file.pages[this.page].W * 96 * nMinZoom / oViewer.file.pages[this.page].Dpi) >> 0;
                if (nNewPageW > oViewer.width) {
                    nVerZoom = (((oViewer.canvas.height - oViewer.scrollWidth) / (nRectH)) * 100 >> 0) / 100;
                }
                
                this.zoom = Math.min(nHorZoom, nVerZoom);
            }
        }

        return this.zoom;
    };

    CActionGoTo.prototype.Do = function() {
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);
        
        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm)
            oActionsQueue.Continue();

        if (this.page >= oViewer.pagesInfo.countTextPages) {
            oActionsQueue.Continue();
            return;
        }

        let nZoom = this.GetZoom();
        if (nZoom && oViewer.zoom != nZoom)
            oViewer.setZoom(nZoom, true);

        // выставляем смещения
        let yOffset;
        let xOffset;
        if (this.rect.top != null) {
            yOffset = this.rect.top + oViewer.betweenPages / (oViewer.drawingPages[this.page].H / oViewer.file.pages[this.page].H);
        }
        else
            yOffset = oViewer.betweenPages / (oViewer.drawingPages[this.page].H / oViewer.file.pages[this.page].H);

        if (this.rect.left != null) {
            xOffset = this.rect.left;
        }

        if ((nZoom && oViewer.zoom != nZoom) || yOffset != undefined && xOffset != undefined || oViewer.currentPage != this.page) {
            oViewer.disabledPaintOnScroll = true; // вырубаем отрисовку на скроле
            oViewer.navigateToPage(this.page, yOffset, xOffset);
            oViewer.disabledPaintOnScroll = false;
            oViewer.needRedraw = true; // в конце Actions выполним отрисовку
        }

        oActionsQueue.Continue();
    };

    function CActionNamed(nType) {
        CActionBase.call(this, ACTIONS_TYPES.Named);
        this.nameType = nType;
    };
    CActionNamed.prototype = Object.create(CActionBase.prototype);
	CActionNamed.prototype.constructor = CActionNamed;

    CActionNamed.prototype.GetName = function() {
        switch (sType) {
            case ACTION_NAMED_TYPES.NextPage:
                return "NextPage";
            case ACTION_NAMED_TYPES.PrevPage:
                return "PrevPage";
            case ACTION_NAMED_TYPES.FirstPage:
                return "FirstPage";
            case ACTION_NAMED_TYPES.LastPage:
                return "LastPage";
        }

        return "";
    };

    CActionNamed.GetInternalType = function(sType) {
        switch (sType) {
            case "NextPage":
                return ACTION_NAMED_TYPES.NextPage;
            case "PrevPage":
                return ACTION_NAMED_TYPES.PrevPage;
            case "FirstPage":
                return ACTION_NAMED_TYPES.FirstPage;
            case "LastPage":
                return ACTION_NAMED_TYPES.LastPage;
        }

        return -1;
    };

    CActionNamed.prototype.Do = function() {
        let Api             = editor;
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);

        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm)
            oActionsQueue.Continue();

        switch (this.nameType) {
            case ACTION_NAMED_TYPES.FirstPage:
                Api.goToPage(0);
                break;
            case ACTION_NAMED_TYPES.NextPage:
                if (oViewer.currentPage + 1 <= oViewer.pagesInfo.countTextPages)
                    Api.goToPage(oViewer.currentPage + 1);
                break;
            case ACTION_NAMED_TYPES.PrevPage:
                if (oViewer.currentPage - 1 >= 0)
                    Api.goToPage(oViewer.currentPage - 1);
                break;
            case ACTION_NAMED_TYPES.LastPage:
                if (oViewer.currentPage != oViewer.pagesInfo.countTextPages)
                    Api.goToPage(oViewer.pagesInfo.countTextPages - 1);
                break;
        }

        oActionsQueue.Continue();
    };

    function CActionURI(sURI) {
        CActionBase.call(this, ACTIONS_TYPES.URI);
        this.uri = sURI;
    };
    CActionURI.prototype = Object.create(CActionBase.prototype);
	CActionURI.prototype.constructor = CActionURI;

    CActionURI.prototype.Do = function() {
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);

        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm)
            oActionsQueue.Continue();

        editor.sendEvent("asc_onOpenLinkPdfForm", this.uri, this.OpenLink.bind(this), oActionsQueue.Continue.bind(oActionsQueue));
    };

    CActionURI.prototype.OpenLink = function() {
        window.open(this.uri, "_blank");

        this.field.GetDocument().GetActionsQueue().Continue();
    };

    function CActionHideShow(bHidden, aFields) {
        CActionBase.call(this, ACTIONS_TYPES.HS);
        this.hidden = bHidden;
        this.fields = aFields;
    };

    CActionHideShow.prototype = Object.create(CActionBase.prototype);
	CActionHideShow.prototype.constructor = CActionHideShow;

    CActionHideShow.prototype.Do = function() {
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);

        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm)
            oActionsQueue.Continue();

        oDoc.SetHiddenForms(this.hidden, this.fields);
    };

    function CActionReset(aFields) {
        CActionBase.call(this, ACTIONS_TYPES.Reset);
        this.fields = aFields;
    };
    CActionReset.prototype = Object.create(CActionBase.prototype);
	CActionReset.prototype.constructor = CActionReset;

    CActionReset.prototype.Do = function() {
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);

        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm)
            oActionsQueue.Continue();
            
        oDoc.ResetForms(this.fields);
    };

    function CActionRunScript(script) {
        CActionBase.call(this, ACTIONS_TYPES.JS);
        this.script = script;
        this.bContinueAfterEval = true; // выключаем на асинхронных операциях
    };
    CActionRunScript.prototype = Object.create(CActionBase.prototype);
	CActionRunScript.prototype.constructor = CActionRunScript;

    CActionRunScript.prototype.Do = function() {
        let oViewer         = private_getViewer();
        let oDoc            = this.field.GetDocument();
        let oActionsQueue   = oDoc.GetActionsQueue();

        oActionsQueue.SetCurAction(this);

        // если onFocus но форма не активна, то скипаем дейсвтие
        if (this.triggerType == FORMS_TRIGGERS_TYPES.OnFocus && this.field != oViewer.activeForm) {
            oActionsQueue.Continue();
            return;
        }

        if (oDoc.formsEvent["target"] != this.field.GetFormApi()) {
            oDoc.formsEvent = {
                "target": this.field.GetFormApi(),
                "rc": true
            };
        }

        let evalString = function(str) {
            let event = oDoc.formsEvent;
            try {
                return eval(str);
            }
            catch (err) {
                console.log(err);
            }
        }
          
        const boundEval = evalString.bind(oDoc.GetDocumentApi());
        try {
            boundEval.call(oDoc.GetDocumentApi(), this.script);
        }
        catch(e) {
            console.log(e);
        }

        if (this.bContinueAfterEval == true)
            oActionsQueue.Continue();
    };

    CActionRunScript.prototype.RunScript = function() {
        let oDoc = this.field.GetDocument();

        if (oDoc.formsEvent["target"] != this.field.GetFormApi()) {
            oDoc.formsEvent = {
                "target": this.field.GetFormApi(),
                "rc": true
            };
        }

        let evalString = function(str) {
            let event = oDoc.formsEvent;
            try {
                let result = eval(str);
                return result;
            }
            catch (err) {
                console.log(err);
            }
        }
          
        const boundEval = evalString.bind(oDoc.GetDocumentApi());
        try {
            return boundEval.call(oDoc.GetDocumentApi(), this.script);
        }
        catch(e) {
            console.log(e);
            return false;
        }
    };

    CBaseField.prototype.RevertContentViewToOriginal = function() {
        this.content.ResetShiftView();
        this._curShiftView.x = this._originShiftView.x;
        this._curShiftView.y = this._originShiftView.y;

        this._bAutoShiftContentView = false;
        this.content.ShiftView(this._originShiftView.x, this._originShiftView.y);

        if (this._scrollInfo) {
            let nMaxShiftY                  = this._scrollInfo.scroll.maxScrollY;
            this._scrollInfo.scrollCoeff    = Math.abs(this._curShiftView.y / nMaxShiftY);
        }
    };
    CBaseField.prototype.IsNeedRevertShiftView = function() {
        if (this._curShiftView.y != this._originShiftView.y ||
            this._curShiftView.x != this._originShiftView.x)
            return true;
    };
    CBaseField.prototype.GetBordersWidth = function(bScaled) {
        let oViewer = private_getViewer();
        let nLineWidth = bScaled == true ? 1.25 * this._lineWidth * AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom : 1.25 * this._lineWidth;

        if (nLineWidth == 0 || this._borderColor == null) {
            return {
                left:     0,
                top:      0,
                right:    0,
                bottom:   0
            }
        }

        switch (this._borderStyle) {
            case BORDER_TYPES.solid:
            case BORDER_TYPES.dashed:
                return {
                    left:     nLineWidth,
                    top:      nLineWidth,
                    right:    nLineWidth,
                    bottom:   nLineWidth
                }
            case BORDER_TYPES.beveled:
            case BORDER_TYPES.inset:
                return {
                    left:     2 * nLineWidth,
                    top:      2 * nLineWidth,
                    right:    2 * nLineWidth,
                    bottom:   2 * nLineWidth
                }
            case BORDER_TYPES.underline:
                return {
                    left:     0,
                    top:      0,
                    right:    0,
                    bottom:   nLineWidth
                }
        }
    };
    CBaseField.prototype.GetMarginsFromBorders = function(bScaled, bMM) {
        let oBorders    = this.GetBordersWidth(bScaled);
        let nKoeff      = bMM == true ? g_dKoef_pix_to_mm : 1;

        switch (this._borderStyle) {
            case BORDER_TYPES.solid:
            case BORDER_TYPES.dashed:
            case BORDER_TYPES.underline:
                return {
                    left:     oBorders.bottom * nKoeff,
                    top:      oBorders.bottom * nKoeff,
                    right:    oBorders.bottom * nKoeff,
                    bottom:   oBorders.bottom * nKoeff
                }
            case BORDER_TYPES.inset:
            case BORDER_TYPES.beveled:
                return {
                    left:     oBorders.bottom * nKoeff,
                    top:      oBorders.bottom * nKoeff,
                    right:    oBorders.bottom * nKoeff,
                    bottom:   oBorders.bottom * nKoeff
                }
        };
    };
    CBaseField.prototype.HasShiftView = function() {
        if (this.content.ShiftViewX != 0 || this.content.ShiftViewY != 0)
            return true;

        return false;
    };
    CBaseField.prototype.MoveCursorToStartPos = function() {
        this.content.MoveCursorToStartPos();
    };
    CBaseField.prototype.SetAlign = function(nAlgnType) {
        let nGlobalType;
        switch (nAlgnType) {
            case ALIGN_TYPE.left:
                nGlobalType = align_Left;
                break;
            case ALIGN_TYPE.center:
                nGlobalType = align_Center;
                break;
            case ALIGN_TYPE.right:
                nGlobalType = align_Right;
                break;
        }

        this.content.SetApplyToAll(true);
        this.content.SetParagraphAlign(nGlobalType);
        this.content.GetElement(0).RecalcCompiledPr(true);
        this.content.SetApplyToAll(false);

        if (this.contentFormat) {
            this.contentFormat.SetApplyToAll(true);
            this.contentFormat.SetParagraphAlign(nGlobalType);
            this.contentFormat.SetApplyToAll(false);
            this.contentFormat.GetElement(0).RecalcCompiledPr(true);
        }
    };
    CBaseField.prototype.SetBorderType = function(nType) {
        this._borderStyle = nType;
    };
    CBaseField.prototype.SetBorderWidth = function(nType) {
        this._borderWidth = nType;
        this._lineWidth = nType;
    };
    /**
     * Returns a canvas with origin view (from appearance stream) of current form.
	 * @memberof CBaseField
     * @param {number} nAPType - APPEARANCE_TYPE (type of AP)
	 * @typeofeditors ["PDF"]
     * @returns {canvas}
	 */
    CBaseField.prototype.GetOriginView = function(nAPType) {
        if (this._apIdx == -1)
            return null;

        let oViewer = private_getViewer();
        let oFile   = oViewer.file;
        
        let oApearanceInfo  = this.GetOriginViewInfo();
        
        if (this.originView && this.originView.width == oApearanceInfo["w"] && this.originView.height == oApearanceInfo["h"])
            return this.originView;

        let oApInfoTmp;
        let canvas  = document.createElement("canvas");
        let nWidth  = oApearanceInfo["w"];
        let nHeight = oApearanceInfo["h"];

        canvas.width    = nWidth;
        canvas.height   = nHeight;

        canvas.x    = oApearanceInfo["x"];
        canvas.y    = oApearanceInfo["y"];
        
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

        if (!oApInfoTmp)
            return null;

        let supportImageDataConstructor = (AscCommon.AscBrowser.isIE && !AscCommon.AscBrowser.isIeEdge) ? false : true;

        let ctx             = canvas.getContext("2d");
        let mappedBuffer    = new Uint8ClampedArray(oFile.memory().buffer, oApInfoTmp["retValue"], 4 * nWidth * nHeight);
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
        
        oViewer.file.free(oApInfoTmp["retValue"]);

        this.originView = canvas;
        return canvas;
    };
    /**
     * Returns AP info of this field.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @returns {Object}
	 */
    CBaseField.prototype.GetOriginViewInfo = function() {
        let oViewer     = private_getViewer();
        let oPageInfo   = oViewer.pagesInfo.pages[this.GetPage()];
        let oPage       = oViewer.drawingPages[this.GetPage()];

        // function rgbToHex(r, g, b) {
        //     return "" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        // }

        let w = (oPage.W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let h = (oPage.H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;

        if (oPageInfo.fieldsAPInfo == null || oPageInfo.fieldsAPInfo.size.w != w || oPageInfo.fieldsAPInfo.size.h != h) {
            let oFile   = oViewer.file;
           
            oPageInfo.fieldsAPInfo = {
                info: oFile.nativeFile.getInteractiveFormsAP(this.GetPage(), w, h),
                size: {
                    w: w,
                    h: h
                }
            }
        }
        
        for (let i = 0; i < oPageInfo.fieldsAPInfo.info.length; i++) {
            if (oPageInfo.fieldsAPInfo.info[i].i == this._apIdx)
                return oPageInfo.fieldsAPInfo.info[i];
        }

        return null;
    };

    CBaseField.prototype.DrawOriginView = function() {
        if (this.IsHidden() == true)
            return;
            
        let oViewer         = private_getViewer();
        let originView      = this.GetOriginView();
        let oGraphicsPDF    = oViewer.pagesInfo.pages[this.GetPage()].graphics.pdf;
        let nScale          = AscCommon.AscBrowser.retinaPixelRatio * oViewer.zoom;
        let aRect           = this.GetRect();

        let X = aRect[0];
        let Y = aRect[1];
        let nWidth = ((aRect[2]) - (aRect[0]));
        let nHeight = ((aRect[3]) - (aRect[1]));
        
        if (originView) {
            oGraphicsPDF.ClearRect(X * nScale, Y * nScale, (nWidth + 1 * nScale) * nScale, ((nHeight + 1 * nScale) * nScale));

            let x = Math.round((X * nScale));
            let y = Math.round((Y * nScale));
            let w = Math.round(((nWidth + 1) * nScale));
            let h = Math.round(((nHeight + 1) * nScale));

            oGraphicsPDF.DrawImage(originView, 0, 0, originView.width, originView.height, originView.x, originView.y, originView.width, originView.height);
            if (this.type == "combobox")
                this.DrawMarker();
        }
    };

    CBaseField.prototype.GetApiTextColor = function() {
        if (this._textColor.length == 1)
            return ["G", this._textColor[0]]
        else if (this._textColor.length == 3)
            return ["RGB", this._textColor[0], this._textColor[1], this._textColor[2]];
        else if (this._textColor.length == 4)
            return ["CMYK", this._textColor[0], this._textColor[1], this._textColor[2], this._textColor[3]];

        return ["T"];
    };
    CBaseField.prototype.SetApiTextColor = function(aColor) {
        if (["radiobutton", "checkbox"].includes(this.type))
            return;

        let oRGB        = color.convert(aColor, "RGB");
        let oPara       = this.content.GetElement(0);
        let oApiPara    = editor.private_CreateApiParagraph(oPara);

        oApiPara.SetColor(oRGB[1] * 255, oRGB[2] * 255, oRGB[3] * 255, false);
        oPara.RecalcCompiledPr(true);
        
        let oApiColor   = color.convert(oRGB, aColor[0]);
        this._textColor = oApiColor.slice(1);
    };
    /**
     * Is the field completely within the window of view.
	 * @memberof CBaseField
	 * @typeofeditors ["PDF"]
     * @returns {boolean}
	 */
    CBaseField.prototype.IsInSight = function() {
        let oViewer     = private_getViewer();
        let aOrigRect   = this.GetOrigRect();
        let nPage       = this.GetPage();

        let oPage;
        for (let i = 0; i < oViewer.pageDetector.pages.length; i++) {
            if (oViewer.pageDetector.pages[i].num == nPage) {
                oPage = oViewer.pageDetector.pages[i];
                break;
            }
        }

        if (!oPage)
            return false;

        // координаты видимой части страницы
        let x1, x2, y1, y2;

        x1 = (-oPage.x / oPage.w) * oViewer.file.pages[nPage].W;
        y1 = (-oPage.y / oPage.h) * oViewer.file.pages[nPage].H;

        x2 = x1 + oViewer.canvas.width / (oPage.w) * oViewer.file.pages[nPage].W;
        y2 = y1 + oViewer.canvas.height / (oPage.h) * oViewer.file.pages[nPage].H;
        
        if (aOrigRect[0] >= x1 && aOrigRect[1] >= y1 && aOrigRect[2] <= x2 && aOrigRect[3] <= y2)
            return true;
        else
            return false;

    };
    CBaseField.prototype.GetOrigRect = function() {
        return this._origRect;
    };
    CBaseField.prototype.GetRect = function() {
        return this._rect;
    };

    // common triggers
    CBaseField.prototype.onMouseEnter = function() {
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseEnter);
    };
    CBaseField.prototype.onMouseExit = function() {
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseExit);
    };
    CBaseField.prototype.onFocus = function() {
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.OnFocus);
    };
    CBaseField.prototype.onBlur = function() {
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.onBlur);
    };
    CBaseField.prototype.onMouseUp = function() {
        this.AddActionsToQueue(FORMS_TRIGGERS_TYPES.MouseUp);
    };
    /**
	 * Escape from form.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
	 */
    CBaseField.prototype.Blur = function() {
        let oViewer = private_getViewer();
        if (oViewer.activeForm == this) {
            oViewer.activeForm = null;
            this.onBlur();
        }
    };

    // for format

    /**
	 * Convert field value to specific number format.
	 * @memberof CTextField
     * @param {number} nDec = number of decimals
     * @param {number} sepStyle = separator style 0 = 1,234.56 / 1 = 1234.56 / 2 = 1.234,56 / 3 = 1234,56 / 4 = 1'234.56
     * @param {number} negStyle = 0 black minus / 1 red minus / 2 parens black / 3 parens red /
     * @param {number} currStyle = reserved
     * @param {string} strCurrency = string of currency to display
     * @param {boolean} bCurrencyPrepend = true = pre pend / false = post pend
	 * @typeofeditors ["PDF"]
	 */
    function AFNumber_Format(nDec, sepStyle, negStyle, currStyle, strCurrency, bCurrencyPrepend) {
        let oDoc = private_getViewer().doc;
        let oCurForm = oDoc.formsEvent["target"].field;

        let oInfoObj = {
            decimalPlaces: nDec,
            separator: true,
            symbol: null,
            type: Asc.c_oAscNumFormatType.Number
        }

        let oCultureInfo = {};
        Object.assign(oCultureInfo, AscCommon.g_aCultureInfos[oInfoObj.symbol]);
        switch (sepStyle) {
            case 0:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = ",";
                break;
            case 1:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = "";
                break;
            case 2:
                oCultureInfo.NumberDecimalSeparator = ",";
                oCultureInfo.NumberGroupSeparator = ".";
                break;
            case 3:
                oCultureInfo.NumberDecimalSeparator = ",";
                oCultureInfo.NumberGroupSeparator = "";
                break;
            case 4:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = "'";
                break;
        }

        oCultureInfo.NumberGroupSizes = [3];
        
        let aFormats = AscCommon.getFormatCells(oInfoObj);
        let oNumFormat = AscCommon.oNumFormatCache.get(aFormats[0]);
        let oTargetRun = oCurForm.contentFormat.GetElement(0).GetElement(0);

        let sCurValue;
        if (oCurForm.type == "text")
            sCurValue = oCurForm.GetValue();
        else if (oCurForm.type == "combobox") {
            let nCurIdx = oCurForm.GetCurIdxs();
            sCurValue = nCurIdx == -1 ? oCurForm.GetValue() : oCurForm.api.getItemAt(nCurIdx, false);
        }

        sCurValue = sCurValue.replace(",", ".");
        if (sCurValue == "") {
            oTargetRun.ClearContent();
            return;
        }
            
        let sRes = oNumFormat.format(sCurValue, 0, AscCommon.gc_nMaxDigCount, true, oCultureInfo, true)[0].text;

        if (!sRes) {
            oDoc.formsEvent["rc"] = false;
            return;
        }

        if (bCurrencyPrepend)
            sRes = strCurrency + sRes;
        else
            sRes = sRes + strCurrency;

        if (sRes.indexOf("-") != - 1) {
            switch (negStyle) {
                case 0:
                    oTargetRun.Pr.Color = private_GetColor(255, 255, 255, true);
                    break;
                case 1:
                    oTargetRun.Pr.Color = private_GetColor(255, 0, 0, false);
                    break;
                case 2:
                    sRes = sRes.replace("-", "");
                    oTargetRun.Pr.Color = private_GetColor(255, 255, 255, true);
                    sRes = "(" + sRes + ")";
                    break;
                case 3:
                    sRes = sRes.replace("-", "");
                    oTargetRun.Pr.Color = private_GetColor(255, 0, 0, false);
                    sRes = "(" + sRes + ")";
                    break;
            }
        }
        else {
            oTargetRun.Pr.Color = private_GetColor(255, 255, 255, true);
        }
        
        oTargetRun.RecalcInfo.TextPr = true
        oTargetRun.ClearContent();
        oTargetRun.AddText(sRes);
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {number} nDec = number of decimals
     * @param {number} sepStyle = separator style 0 = 1,234.56 / 1 = 1234.56 / 2 = 1.234,56 / 3 = 1234,56 / 4 = 1'234.56
     * @param {number} negStyle = 0 black minus / 1 red minus / 2 parens black / 3 parens red /
     * @param {number} currStyle = reserved
     * @param {string} strCurrency = string of currency to display
     * @param {boolean} bCurrencyPrepend = true = pre pend / false = post pend
	 * @typeofeditors ["PDF"]
	 */
    function AFNumber_Keystroke(nDec, sepStyle, negStyle, currStyle, strCurrency, bCurrencyPrepend) {
        let oDoc = private_getViewer().doc;
        let sValue = oDoc.formsEvent["value"];

        function isValidNumber(str) {
            return !isNaN(str) && isFinite(str);
        }

        // разделитель дробной части, который можно ввести
        switch (sepStyle) {
            case 0:
            case 1:
            case 4:
                if (sValue.indexOf(",") != -1)
                    return false;

                if (isValidNumber(sValue) == false)
                    return false;
                break;
            case 2:
            case 3:
                if (sValue.indexOf(".") != -1)
                    return false;

                sValue = sValue.replace(/\,/g, ".");
                if (isValidNumber(sValue) == false)
                    return false;
                break;
        }

        return true;
    }

    /**
	 * Convert field value to specific percent format.
	 * @memberof CTextField
     * @param {number} nDec = number of decimals
     * @param {number} sepStyle = separator style 0 = 1,234.56 / 1 = 1234.56 / 2 = 1.234,56 / 3 = 1234,56 / 4 = 1'234.56
	 * @typeofeditors ["PDF"]
	 */
    function AFPercent_Format(nDec, sepStyle) {
        let oDoc = private_getViewer().doc;
        let oCurForm = oDoc.formsEvent["target"].field;
        
        let oInfoObj = {
            decimalPlaces: nDec,
            separator: true,
            symbol: null,
            type: Asc.c_oAscNumFormatType.Number
        }

        let oCultureInfo = {};
        Object.assign(oCultureInfo, AscCommon.g_aCultureInfos[oInfoObj.symbol]);
        switch (sepStyle) {
            case 0:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = ",";
                break;
            case 1:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = "";
                break;
            case 2:
                oCultureInfo.NumberDecimalSeparator = ",";
                oCultureInfo.NumberGroupSeparator = ".";
                break;
            case 3:
                oCultureInfo.NumberDecimalSeparator = ",";
                oCultureInfo.NumberGroupSeparator = "";
                break;
            case 4:
                oCultureInfo.NumberDecimalSeparator = ".";
                oCultureInfo.NumberGroupSeparator = "'";
                break;
        }
        oCultureInfo.NumberGroupSizes = [3];

        let aFormats = AscCommon.getFormatCells(oInfoObj);
        let oNumFormat = AscCommon.oNumFormatCache.get(aFormats[0]);
        let oTargetRun = oCurForm.contentFormat.GetElement(0).GetElement(0);

        let sCurValue;
        if (oCurForm.type == "text")
            sCurValue = oCurForm.GetValue();
        else if (oCurForm.type == "combobox") {
            let nCurIdx = oCurForm.GetCurIdxs();
            sCurValue = nCurIdx == -1 ? oCurForm.GetValue() : oCurForm.api.getItemAt(nCurIdx, false);
        }

        sCurValue = sCurValue.replace(",", ".");
        if (sCurValue == "")
            sCurValue = 0;
            
        sCurValue = (parseFloat(sCurValue) * 100).toString();
        let sRes = oNumFormat.format(sCurValue, 0, AscCommon.gc_nMaxDigCount, true, oCultureInfo, true)[0].text;
        if (!sRes) {
            oDoc.formsEvent["rc"] = false;
            return;
        }

        sRes = sRes + "%";

        oTargetRun.ClearContent();
        oTargetRun.AddText(sRes);
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {number} nDec = number of decimals
     * @param {number} sepStyle = separator style 0 = 1,234.56 / 1 = 1234.56 / 2 = 1.234,56 / 3 = 1234,56 / 4 = 1'234.56
	 * @typeofeditors ["PDF"]
	 */
    function AFPercent_Keystroke(nDec, sepStyle) {
        let oDoc = private_getViewer().doc;
        let sValue = oDoc.formsEvent["value"];

        function isValidNumber(str) {
            return !isNaN(str) && isFinite(str);
        }

        // разделитель дробной части, который можно ввести
        switch (sepStyle) {
            case 0:
            case 1:
            case 4:
                if (sResultText.indexOf(",") != -1)
                    return false;

                if (isValidNumber(sValue) == false)
                    return false;
                break;
            case 2:
            case 3:
                if (sValue.indexOf(".") != -1)
                    return false;

                sValue = sValue.replace(/\,/g, ".");
                if (isValidNumber(sValue) == false)
                    return false;
                break;
        }

        return true;
    }

    /**
	 * Convert field value to specific date format.
	 * @memberof CTextField
     * @param {string} cFormat - date format
	 * @typeofeditors ["PDF"]
	 */
    function AFDate_Format(cFormat) {
        let oDoc = private_getViewer().doc;
        let oCurForm = oDoc.formsEvent["target"].field;
        oDoc.formsEvent["format"] = cFormat;
        
        let oNumFormat = AscCommon.oNumFormatCache.get(cFormat, AscCommon.NumFormatType.PDFFormDate);
        oNumFormat.oNegativeFormat.bAddMinusIfNes = false;
        
        let oTargetRun = oCurForm.contentFormat.GetElement(0).GetElement(0);

        let sCurValue;
        if (oCurForm.type == "text")
            sCurValue = oCurForm.GetValue();
        else if (oCurForm.type == "combobox") {
            let nCurIdx = oCurForm.GetCurIdxs();
            sCurValue = nCurIdx == -1 ? oCurForm.GetValue() : oCurForm.api.getItemAt(nCurIdx, false);
        }

        let oFormatParser = AscCommon.g_oFormatParser;

        function getShortPattern(aRawFormat) {
            let dayDone     = false;
            let monthDone   = false;
            let yearDone    = false;
            
            let sPattern = "";

            let numFormat_Year = 12;
            let numFormat_Month = 13;
            let numFormat_Day = 16;

            for (let obj of aRawFormat) {
                switch (obj.type) {
                    case numFormat_Day:
                        if (dayDone == false) {
                            sPattern += 1;
                            dayDone = true;
                        }
                        break;
                    case numFormat_Month:
                        if (monthDone == false) {
                            sPattern += 3;
                            monthDone = true;
                        }
                        break;
                    case numFormat_Year:
                        if (yearDone == false) {
                            if (obj.val > 2)
                                sPattern += 5;
                            else
                                sPattern += 4;
                            yearDone = true;
                        }
                        break;
                            
                }
            }
            return sPattern;
        }

        let oCultureInfo = {};
        Object.assign(oCultureInfo, AscCommon.g_aCultureInfos[9]);
        if (null == oNumFormat.oTextFormat.ShortDatePattern) {
            oNumFormat.oTextFormat.ShortDatePattern = getShortPattern(oNumFormat.oTextFormat.aRawFormat);
            oNumFormat.oTextFormat._prepareFormatDatePDF();
        }
        oCultureInfo.ShortDatePattern = oNumFormat.oTextFormat.ShortDatePattern;

        if (oCultureInfo.ShortDatePattern.indexOf("1") == -1)
            oNumFormat.oTextFormat.bDay = false;

        oCultureInfo.AbbreviatedMonthNames.length = 12;
        oCultureInfo.MonthNames.length = 12;

        let oResParsed = oFormatParser.parseDatePDF(sCurValue, oCultureInfo, oNumFormat);
                
        if (sCurValue == "")
            oTargetRun.ClearContent();
        if (!oResParsed) {
            oDoc.formsEvent["rc"] = false;
            return;
        }

        oNumFormat.oTextFormat.formatType = AscCommon.NumFormatType.PDFFormDate;
        let sRes = oNumFormat.oTextFormat.format(oResParsed.value, 0, AscCommon.gc_nMaxDigCount, oCultureInfo)[0].text;

        oTargetRun.ClearContent();
        oTargetRun.AddText(sRes);
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {string} cFormat - date format
	 * @typeofeditors ["PDF"]
	 */
    function AFDate_Keystroke(cFormat) {
        return true;
    }
    let AFDate_FormatEx = AFDate_Format;
    let AFDate_KeystrokeEx = AFDate_Keystroke;

    /**
	 * Convert field value to specific time format.
	 * @memberof CTextField
     * @param {number} ptf - time format
     *  0 = 24HR_MM [ 14:30 ]
     *  1 = 12HR_MM [ 2:30 PM ]
     *  2 = 24HR_MM_SS [ 14:30:15 ]
     *  3 = 12HR_MM_SS [ 2:30:15 PM ]
	 * @typeofeditors ["PDF"]
	 */
    function AFTime_Format(ptf) {
        let oDoc = private_getViewer().doc;
        let oCurForm = oDoc.formsEvent["target"].field;
        
        // to do сделать обработку ms 
        let oCultureInfo = {};
        Object.assign(oCultureInfo, AscCommon.g_aCultureInfos[9]);

        let sFormat;
        let fIsValidTime = null;
        switch (ptf) {
            case 0:
                sFormat = "HH:MM";
                fIsValidTime = function isValidTime(time) {
                    const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]|[0-9])\s*$/;
                    return pattern.test(time);
                }
                break;
            case 1:
                sFormat = "h:MM tt";
                fIsValidTime = function isValidTime(time) {
                    const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]|[0-9])\s*([APap][mM])?$/;
                    return pattern.test(time);
                }
                break;
            case 2:
                sFormat = "HH:MM:ss";
                fIsValidTime = function isValidTime(time) {
                    const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?\s*$/;
                    return pattern.test(time);
                }
                break;
            case 3:
                sFormat = "h:MM:ss tt";
                fIsValidTime = function isValidTime(time) {
                    const pattern = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]|[0-9])(:([0-5][0-9]|[0-9]))?\s*([APap][mM])?$/;
                    return pattern.test(time);
                }
                break;
        }

        let oNumFormat = AscCommon.oNumFormatCache.get(sFormat, AscCommon.NumFormatType.PDFFormDate);
        oNumFormat.oNegativeFormat.bAddMinusIfNes = false;
        
        let oTargetRun = oCurForm.contentFormat.GetElement(0).GetElement(0);

        let sCurValue;
        if (oCurForm.type == "text")
            sCurValue = oCurForm.GetValue();
        else if (oCurForm.type == "combobox") {
            let nCurIdx = oCurForm.GetCurIdxs();
            sCurValue = nCurIdx == -1 ? oCurForm.GetValue() : oCurForm.api.getItemAt(nCurIdx, false);
        }
        
        if (sCurValue == "")
            oTargetRun.ClearContent();
        else if (fIsValidTime(sCurValue) == false) {
            oDoc.formsEvent["rc"] = false;
            return;
        }
        
        let oFormatParser = AscCommon.g_oFormatParser;
        let oResParsed = oFormatParser.parseDatePDF(sCurValue, AscCommon.g_aCultureInfos[9]);

        if (!oResParsed) {
            oTargetRun.ClearContent();
            oDoc.formsEvent["rc"] = false;
            return;
        }
        
        oNumFormat.oTextFormat.formatType = AscCommon.NumFormatType.PDFFormDate;
        let sRes = oNumFormat.format(oResParsed.value, 0, AscCommon.gc_nMaxDigCount, true, undefined, true)[0].text;

        oTargetRun.ClearContent();
        oTargetRun.AddText(sRes);
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {string} cFormat - date format
	 * @typeofeditors ["PDF"]
	 */
    function AFTime_Keystroke(cFormat) {
        return true;
    }

    let AFTime_FormatEx = AFDate_FormatEx;
    let AFTime_KeystrokeEx = AFTime_Keystroke;

    /**
	 * Convert field value to specific special format.
	 * @memberof CTextField
     * @param {number} psf – psf is the type of formatting to use:
     *  0 = zip code
     *  1 = zip + 4
     *  2 = phone
     *  3 = SSN
	 * @typeofeditors ["PDF"]
	 */
    function AFSpecial_Format(psf) {
        let oDoc = private_getViewer().doc;
        let oCurForm = oDoc.formsEvent["target"].field;
        
        let sCurValue;
        if (oCurForm.type == "text")
            sCurValue = oCurForm.GetValue();
        else if (oCurForm.type == "combobox") {
            let nCurIdx = oCurForm.GetCurIdxs();
            sCurValue = nCurIdx == -1 ? oCurForm.GetValue() : oCurForm.api.getItemAt(nCurIdx, false);
        }

        let oTargetRun = oCurForm.contentFormat.GetElement(0).GetElement(0);

        function isValidZipCode(zipCode) {
            let regex = /^\d{5}$/;
            return regex.test(zipCode);
        }
        function isValidZipCode4(zip) {
            let regex = /^\d{5}[-\s.]?(\d{4})?$/;
            return regex.test(zip);
        }
        function isValidPhoneNumber(number) {
            let regex = /^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
            return regex.test(number);
        }
        function isValidSSN(ssn) {
            let regex = /^\d{3}[-\s.]?\d{2}[-\s.]?\d{4}$/;
            return regex.test(ssn);
        }

        if (sCurValue == "")
            oTargetRun.ClearContent();
            
        switch (psf) {
            case 0:
                if (isValidZipCode(sCurValue) == false) {
                    oDoc.formsEvent["rc"] = false;
                    return;
                }
                break;
            case 1:
                if (isValidZipCode4(sCurValue) == false) {
                    oDoc.formsEvent["rc"] = false;
                    return;
                }
                break;
            case 2:
                if (isValidPhoneNumber(sCurValue) == false) {
                    oDoc.formsEvent["rc"] = false;
                    return;
                }
                break;
            case 3:
                if (isValidSSN(sCurValue) == false) {
                    oDoc.formsEvent["rc"] = false;
                    return;
                }
                break;
        }

        sCurValue = sCurValue.replace(/\D/g, ""); // delete all except no digit chars
        let sFormatValue = "";

        oTargetRun.ClearContent();

        switch (psf) {
            case 0:
                sFormatValue = sCurValue.substring(0, 5);
                break;
            case 1:
                sFormatValue = sCurValue.substring(0, 9);
                if (sFormatValue[4])
                    sFormatValue = sCurValue.substring(0, 5) + "-" + sCurValue.substring(5);
                break;
            case 2: 
                let x = sCurValue.substring(0, 10);
                sFormatValue = x.length > 6
                    ? "(" + x.substring(0, 3) + ") " + x.substring(3, 6) + "-" + x.substring(6, 10)
                    : x.length > 3
                    ? "(" + x.substring(0, 3) + ") " + x.substring(3)
                    : x;
                break;
            case 3:
                let y = sCurValue.substring(0, 9);
                sFormatValue = y.length > 5
                ? y.substring(0, 3) + "-" + y.substring(3, 5) + "-" + y.substring(5, 9)
                : y.length > 2
                ? y.substring(0, 3) + "-" + x.substring(3)
                : x;
                break;
        }

        oTargetRun.AddText(sFormatValue);
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {number} psf – psf is the type of formatting to use:
     *  0 = zip code
     *  1 = zip + 4
     *  2 = phone
     *  3 = SSN
	 * @typeofeditors ["PDF"]
	 */
    function AFSpecial_Keystroke(psf) {
        let oDoc = private_getViewer().doc;
        let sValue = oDoc.formsEvent["value"];

        function isValidZipCode(zipCode) {
            let regex = /^\d{0,5}$/;
            return regex.test(zipCode);
        }
        function isValidZipCode4(zip) {
            let regex = /^\d{0,5}[-\s.]?(\d{0,4})?$/;
            return regex.test(zip);
        }
        function isValidPhoneNumber(number) {
            let regex = /^\(?\d{0,3}?\)?[\s.-]?\d{0,3}?[\s.-]?\d{0,4}?$/;
            return regex.test(number);
        }
        function isValidSSN(ssn) {
            let regex = /^\d{0,3}?[-\s.]?\d{0,2}?[-\s.]?\d{0,4}$/;
            return regex.test(ssn);
        }

        let canAdd;
        switch (psf) {
            case 0:
                canAdd = isValidZipCode(sValue);
                break;
            case 1:
                canAdd = isValidZipCode4(sValue);
                break;
            case 2:
                canAdd = isValidPhoneNumber(sValue);
                break;
            case 3:
                canAdd = isValidSSN(sValue);
                break;
        }

        return canAdd;
    }
    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {number} mask - the special mask
	 * @typeofeditors ["PDF"]
	 */
    function AFSpecial_KeystrokeEx(mask) {
        let oDoc = private_getViewer().doc;
        let oForm = oDoc.formsEvent["target"].field;
        let sValue = oDoc.formsEvent["value"];

        if (typeof(mask) == "string" && mask != "") {
            let oFormMask = new AscWord.CTextFormMask();
            oFormMask.Set(mask);
            
            let oTextFormat = new AscWord.CTextFormFormat();
            let arrBuffer = oTextFormat.GetBuffer(sValue);
            
            let isCanEnter = oFormMask.Check(arrBuffer);
            if (!isCanEnter) {
                let sCorrected = oFormMask.Correct(sValue);
                arrBuffer = oTextFormat.GetBuffer(sCorrected);
                isCanEnter = oFormMask.Check(arrBuffer);

                if (isCanEnter) {
                    let oDelta = AscCommon.getTextDelta(sValue, sCorrected);
                    let oRun = oForm.content.GetElement(0).GetElement(0);
                    let nAdded = 0;
                    for (let nChange = oDelta.length - 1; nChange >= 0; nChange--) {
                        for (let nChar = oDelta[nChange].insert.length - 1; nChar >= 0; nChar--) {
                            oRun.AddToContent(oDelta[nChange].pos, AscCommon.IsSpace(oDelta[nChange].insert[nChar]) ? new AscWord.CRunSpace(oDelta[nChange].insert[nChar]) : new AscWord.CRunText(oDelta[nChange].insert[nChar]));
                            nAdded++;
                        }
                    }

                    oRun.SetCursorPosition(oRun.State.ContentPos + nAdded);
                    return true;
                }
                
                return false;
            }
            else
                return true;
        }

        return false;
    }

    /**
	 * Check can the field accept the char or not.
	 * @memberof CTextField
     * @param {string} sFunction -  is one of "AVG", "SUM", "PRD", "MIN", "MAX"
     * @param {string[]} aFieldsNames - is the list of the fields to use in the calculation
	 * @typeofeditors ["PDF"]
	 */
    function AFSimple_Calculate(sFunction, aFieldsNames) {
        let oViewer = private_getViewer();
        let oDoc    = oViewer.doc;
        let oField  = oDoc.formsEvent["target"].field;

        let aFields = [];
        aFieldsNames.forEach(function(name) {
            let aTmpFields = oDoc.GetFields(name);

            // смысл в том, что одно поле из многих с таким именем может быть изменено, но еще не применено, ищем его
            // если нет, то просто берем первое из массива
            let oChangedField = aTmpFields.find(function(field) {
                return field.IsNeedCommit();
            });

            if (oChangedField)
                aFields.push(oChangedField);
            else if (aTmpFields[0])
                aFields.push(aTmpFields[0]);
        });

        function extractNumber(str) {
            let resultStr = str.replace(/^[^\d]*(\d+)/, "$1").replace(/[^0-9]+/, '.');
            return parseFloat(resultStr);
        }

        let aValues = [];
        aFields.forEach(function(field) {
            if (field.type == FIELD_TYPE.button)
                return;

            let fieldValue = field.GetValue();
            
            if (Array.isArray(fieldValue)) {
                aValues = aValues.concat(fieldValue);
            }
            else
                aValues.push(fieldValue !== "Off" ? fieldValue : "0");
        });

        let nResult;
        switch (sFunction) {
            case "SUM":
                nResult = aValues.reduce(function(sum, current) {
                    let nParsedNumber = extractNumber(current);
                    let nFracSum = sum.toString().split('.')[1] ? sum.toString().split('.')[1].length : 0;
                    let nFracCurr = nParsedNumber.toString().split('.')[1] ? nParsedNumber.toString().split('.')[1].length : 0;
                    let nMaxFrac = Math.max(nFracSum, nFracCurr);
                    
                    return Math.round((sum + nParsedNumber) * (10**nMaxFrac)) / (10**nMaxFrac); // исправляем беды с дробной частью
                }, 0);
                break;
            case "PRD":
                nResult = aValues.reduce(function(sum, current) {
                    let nParsedNumber = extractNumber(current);
                    let nFracSum = sum.toString().split('.')[1] ? sum.toString().split('.')[1].length : 0;
                    let nFracCurr = nParsedNumber.toString().split('.')[1] ? nParsedNumber.toString().split('.')[1].length : 0;
                    let nMaxFrac = Math.max(nFracSum, nFracCurr);
                    
                    return Math.round((sum * nParsedNumber) * (10**nMaxFrac)) / (10**nMaxFrac); // исправляем беды с дробной частью
                }, 1);
                break;
            case "AVG":
                nResult = aValues.reduce(function(sum, current) {
                    let nParsedNumber = extractNumber(current);
                    let nFracSum = sum.toString().split('.')[1] ? sum.toString().split('.')[1].length : 0;
                    let nFracCurr = nParsedNumber.toString().split('.')[1] ? nParsedNumber.toString().split('.')[1].length : 0;
                    let nMaxFrac = Math.max(nFracSum, nFracCurr);

                    return Math.round((sum + nParsedNumber) * (10**nMaxFrac)) / (10**nMaxFrac); // исправляем беды с дробной частью
                }, 0);
                nResult = nResult / aValues.length;
                break;
            case "MIN":
                nResult = Math.min(...aValues);
                break;
            case "MAX":
                nResult = Math.max(...aValues);
                break;
        }

        if (oField.DoValidateAction(String(nResult))) {
            oField.SetValue(String(nResult));
            oField.SetNeedCommit(true);
        }
    }

    /**
	 * Function for validation value.
	 * @memberof CTextField
	 * @typeofeditors ["PDF"]
     * @returns {boolean}
	 */
    function AFRange_Validate(bGreaterThan, nGreaterThan, bLessThan, nLessThan) {
        let oDoc = private_getViewer().doc;
        if (bGreaterThan && bLessThan) {
            oDoc.formsEvent["greater"] = nGreaterThan;
            oDoc.formsEvent["less"] = nLessThan;
            return oDoc.formsEvent["value"] >= nGreaterThan && oDoc.formsEvent["value"] <= nLessThan;
        }
        else if (bGreaterThan) {
            oDoc.formsEvent["greater"] = nGreaterThan;
            return oDoc.formsEvent["value"] >= nGreaterThan;
        }
        else if (bLessThan) {
            oDoc.formsEvent["less"] = nLessThan;
            return oDoc.formsEvent["value"] <= nLessThan;
        }
    }
    
    // private methods

    function private_GetColor(r, g, b, Auto)
	{
		return new AscCommonWord.CDocumentColor(r, g, b, Auto ? Auto : false);
	}
    
    function private_GetFieldAlign(sJc)
	{
		if ("left" === sJc)
			return align_Left;
		else if ("right" === sJc)
			return align_Right;
		else if ("center" === sJc)
			return align_Center;

		return undefined;
	}

    function private_getPageCoordsMM(x, y, nPage) {
        // конвертация из глобальных x, y к mm кординатам самой страницы
        let oViewer = private_getViewer();
        var pageObject = oViewer.getPageByCoords(x - oViewer.x, y - oViewer.y);

        let nScaleY = oViewer.drawingPages[nPage].H / oViewer.file.pages[nPage].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[nPage].W / oViewer.file.pages[nPage].W / oViewer.zoom;

        if (!pageObject) {
            return {X: 0, Y: 0}
        }

        let X = (pageObject.x) * g_dKoef_pix_to_mm * nScaleY;
        let Y = (pageObject.y) * g_dKoef_pix_to_mm * nScaleX;

        return {X, Y};
    }
    /**
	 * Converts page coords to global pix coords.
     * Note: use scaled coordinates like pagePos_ from field, and not original like _origRect from field.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} nPage
     * @param {boolean} isNotMM - coordinates in millimeters or not 
	 * @typeofeditors ["PDF"]
	 */
    function private_getGlobalCoordsByPageCoords(x, y, nPage, isNotMM) {
        let oViewer = private_getViewer();

        let nScaleY = oViewer.drawingPages[nPage].H / oViewer.file.pages[nPage].H / oViewer.zoom;
        let nScaleX = oViewer.drawingPages[nPage].W / oViewer.file.pages[nPage].W / oViewer.zoom;

        let X = isNotMM ? x / nScaleX : x * g_dKoef_mm_to_pix / nScaleX;
        let Y = isNotMM ? y / nScaleY : y * g_dKoef_mm_to_pix / nScaleY;

        let pageCoords;
        for (let i = 0; i < oViewer.pageDetector.pages.length; i++) {
            if (oViewer.pageDetector.pages[i].num == nPage)
                pageCoords = oViewer.pageDetector.pages[i];
        }

        X = (X * pageCoords.w / oViewer.file.pages[nPage].W + pageCoords.x) / AscCommon.AscBrowser.retinaPixelRatio;
        Y = (Y * pageCoords.h / oViewer.file.pages[nPage].H + pageCoords.y) / AscCommon.AscBrowser.retinaPixelRatio;

        return {X, Y};
    }


    function private_getViewer() {
        return editor.getDocumentRenderer();
    }
    function CreateNewHistoryPointForField(oField, isCanUnion) {
        if (isCanUnion == null)
            isCanUnion = false;

        if (AscCommon.History.IsOn() == false)
            AscCommon.History.TurnOn();
        AscCommon.History.Create_NewPoint();
        AscCommon.History.SetAdditionalFormFilling(oField);
        AscCommon.History.Points[AscCommon.History.Points.length - 1].Additional.CanUnion = isCanUnion;
    }

    function TurnOffHistory() {
        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();
    }

    CComboBoxField.prototype.Remove                 = CTextField.prototype.Remove;
    CComboBoxField.prototype.MoveCursorLeft         = CTextField.prototype.MoveCursorLeft;
    CComboBoxField.prototype.MoveCursorRight        = CTextField.prototype.MoveCursorRight;
    CComboBoxField.prototype.SelectionSetStart      = CTextField.prototype.SelectionSetStart;
    CComboBoxField.prototype.SelectionSetEnd        = CTextField.prototype.SelectionSetEnd;
    CComboBoxField.prototype.CheckFormViewWindow    = CTextField.prototype.CheckFormViewWindow;
    CComboBoxField.prototype.SetAlign               = CTextField.prototype.SetAlign;
    CComboBoxField.prototype.SetDoNotSpellCheck     = CTextField.prototype.SetDoNotSpellCheck;
    CComboBoxField.prototype.CorrectHistoryPoints = CTextField.prototype.CorrectHistoryPoints;
    CComboBoxField.prototype.DoValidateAction       = CTextField.prototype.DoValidateAction;
    CComboBoxField.prototype.DoKeystrokeAction      = CTextField.prototype.DoKeystrokeAction;
    CComboBoxField.prototype.DoFormatAction         = CTextField.prototype.DoFormatAction;

    CTextField.prototype.UpdateScroll   = CListBoxField.prototype.UpdateScroll;
    CTextField.prototype.ScrollVertical = CListBoxField.prototype.ScrollVertical;
    
    if (!window["AscPDFEditor"])
	    window["AscPDFEditor"] = {};
        
	window["AscPDFEditor"].FIELD_TYPE           = FIELD_TYPE;
	window["AscPDFEditor"].FORMS_TRIGGERS_TYPES = FORMS_TRIGGERS_TYPES;
	window["AscPDFEditor"].CPushButtonField     = CPushButtonField;
	window["AscPDFEditor"].CBaseField           = CBaseField;
	window["AscPDFEditor"].CTextField           = CTextField;
	window["AscPDFEditor"].CCheckBoxField       = CCheckBoxField;
	window["AscPDFEditor"].CComboBoxField       = CComboBoxField;
	window["AscPDFEditor"].CListBoxField        = CListBoxField;
	window["AscPDFEditor"].CRadioButtonField    = CRadioButtonField;
	window["AscPDFEditor"].CSignatureField      = CSignatureField;
	window["AscPDFEditor"].private_getGlobalCoordsByPageCoords  = private_getGlobalCoordsByPageCoords;

})();

