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
	 * Controls how the icon is scaled (if necessary) to fit inside the button face. The convenience scaleHow object defines all
     * of the valid alternatives:
	 * @typedef {Object} scaleHow
	 * @property {number} proportional
	 * @property {number} anamorphic
	 */

    /**
	 * Controls when an icon is scaled to fit inside the button face. The convenience scaleWhen object defines all of the valid
     * alternatives:
	 * @typedef {Object} scaleWhen
	 * @property {number} always
	 * @property {number} never
	 * @property {number} tooBig
	 * @property {number} tooSmall
	 */

    //------------------------------------------------------------------------------------------------------------------
	//
	// Internal
	//
	//------------------------------------------------------------------------------------------------------------------

    // types without source object
    let ALIGN_TYPE = {
        left:   "left",
        center: "center",
        right:  "right"
    }

    let LINE_WIDTH = {
        "none":   0,
        "thin":   1,
        "medium": 2,
        "thick":  3
    }

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
        "color":            AscPDF.Api.Objects.color["black"],
        "textSize":         12.0,
        "underline":        false
    }

    /**
	 * A string that sets the trigger for the action. Values are:
	 * @typedef {"MouseUp" | "MouseDown" | "MouseEnter" | "MouseExit" | "OnFocus" | "OnBlur" | "Keystroke" | "Validate" | "Calculate" | "Format"} cTrigger
	 * For a list box, use the Keystroke trigger for the Selection Change event.
     */

    
    // main class (this) in JS PDF scripts
    function ApiDocument(oDoc) {
        this.doc = oDoc;
    };

    /**
	 * Returns an interactive field by name.
	 * @memberof ApiDocument
     * @param {string} sName - field name.
	 * @typeofeditors ["PDF"]
	 * @returns {ApiBaseField}
	 */
    ApiDocument.prototype.getField = function(sName) {
        sName = sName != null && sName.toString ? sName.toString() : undefined;
        if (!sName)
            return null;

        let aPartNames = sName.split('.').filter(function(item) {
            if (item != "")
                return item;
        })

        let oRootField = this.doc.rootFields.get(aPartNames[0]);
        if (oRootField) {
            for (let i = 1; i < aPartNames.length; i++) {
                if (!oRootField)
                    return null;
                
                oRootField = oRootField.GetField(aPartNames[i]);
            }
    
            return oRootField.GetFormApi();
        }
        else {
            for (let i = 0; i < this.doc.widgets.length; i++) {
                if (this.doc.widgets[i].GetFullName() == sName)
                    return this.doc.widgets[i].GetFormApi();
            }
        }
            
        return null;        
    };

    // base form class with attributes and method for all types of forms
	function ApiBaseField(oField)
    {
        this.field = oField;
    }

    /**
	 * The border style for a field. Valid border styles are solid/dashed/beveled/inset/underline.
	 * @memberof ApiBaseField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiBaseField.prototype, "borderStyle", {
        set(sValue) {
            if (Object.values(border).includes(sValue)) {
                if (this.field.IsAnnot()) {
                    let aFields = this.field.GetDocument().GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetBorderStyle(private_GetIntBorderStyle(sValue));
                    });
                }
                else {
                    this.field.GetKids().forEach(function(field) {
                        field.GetFormApi()["borderStyle"] = sValue;
                    });
                }
            }
        },
        get() {
            if (this.IsAnnot())
                return private_GetStrBorderStyle(this.field.GetBorderStyle());
            else
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
        }
	});

    Object.defineProperties(ApiBaseField.prototype, {
        // private
        "parent": {
            enumerable: false,
            writable: true,
            value: null
        },
        "pagePos": {
            writable: true,
            enumerable: false,
            value: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        },
        "kids": {
            enumerable: false,
            value: [],
        },
        "partialName": {
            writable: true,
            enumerable: false
        },

        
        "delay": {
            set(bValue) {
                if (typeof(bValue) == "boolean")
                    this._delay = bValue;
            },
            get() {
                return this._delay;
            }
        },
        "display": {
            set(nValue) {
                if (Object.values(display).includes(nValue))
                    this._display = nValue;
            },
            get() {
                return this._display;
            }
        },
        "doc": {
            get() {
                return this._doc;
            }
        },
        "fillColor": {
            set (aColor) {
                if (Array.isArray(aColor))
                    this._fillColor = aColor;
            },
            get () {
                return this._fillColor;
            }
        },
        "bgColor": {
            set (aColor) {
                if (Array.isArray(aColor))
                    this._bgColor = aColor;
            },
            get () {
                return this._bgColor;
            }
        },
        "hidden": {
            set(bValue) {
                if (typeof(bValue) == "boolean")
                    this._hidden = bValue;
            },
            get() {
                return this._hidden;
            }
        },
        "lineWidth": {
            set(nValue) {
                nValue = parseInt(nValue);
                if (Object.values(LINE_WIDTH).includes(nValue)) {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._lineWidth = nValue;
                        field.SetNeedRecalc(true);
                        field.content.GetElement(0).Content.forEach(function(run) {
                            run.RecalcInfo.Measure = true;
                        });
                    });
                }
            },
            get() {
                return this._lineWidth;
            }
        },
        "borderWidth": {
            set(nValue) {
                this.lineWidth = nValue;
            },
            get() {
                return this.lineWidth;
            }
        },
        "name": {
            get() {
                return this.field.GetFullName();
            }
        },
        "page": {
            get() {
                return this.GetPage();
            }
        },
        "print": {
            set(bValue) {
                if (typeof(bValue) == "boolean")
                    this._print = bValue;
            },
            get() {
                return this._print;
            }
        },
        "readonly": {
            set(bValue) {
                if (typeof(bValue) == "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetReadOnly(bValue);
                    })
                }
                    
            },
            get() {
                return this._readonly;
            }
        },
        "rect": {
            set(aRect) {
                if (Array.isArray(aRect)) {
                    let isValidRect = true;
                    for (let i = 0; i < 4; i++) {
                        if (typeof(aRect[i]) != "number") {
                            isValidRect = false;
                            break;
                        }
                    }
                  
                    if (isValidRect)
                        this._rect = aRect;
                }
            },
            get() {
                return this._rect;
            }
        },
        "required": {
            set(bValue) {
                if (typeof(bValue) == "boolean" && this.type != "button") {
                    let aFields = this._doc.GetFields(this.name);

                    aFields.forEach(function(field) {
                        field.SetRequired(bValue);
                    })
                }
            },
            get() {
                if (this.type != "button")
                    return this._required;

                return undefined;
            }
        },
        "rotation": {
            set(nValue) {
                if (VALID_ROTATIONS.includes(nValue))
                    this._rotation = nValue;
            },
            get() {
                return this._rotation;
            }
        },
        "strokeColor": {
            set(aColor) {
                if (Array.isArray(aColor))
                    this._strokeColor = aColor;
            },
            get() {
                return this._strokeColor;
            }
        },
        "borderColor": {
            set(aColor) {
                if (Array.isArray(aColor))
                    this._borderColor = aColor;
            },
            get() {
                return this._borderColor;
            }
        },
        "submitName": {
            set(sValue) {
                if (typeof(sValue) == "string")
                    this._submitName = sValue;
            },
            get() {
                return this._submitName;
            }
        },
        "textColor": {
            set (aColor) {
                if (Array.isArray(aColor)) {
                    let aFields = this.field.GetDocument().GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetApiTextColor(aColor);
                    });
                }
            },
            get () {
                return this.field.GetApiTextColor();
            }
        },
        "fgColor": {
            set (aColor) {
                if (Array.isArray(aColor))
                    this._fgColor = aColor;
            },
            get () {
                return this._fgColor;
            }
        },
        "textSize": {
            set(nValue) {
                if (typeof(nValue) == "number" && nValue >= 0 && nValue < MAX_TEXT_SIZE) {
                    let aFields = this._doc.GetFields(this.name);
                    let oField;
                    for (var i = 0; i < aFields.length; i++) {
                        oField = aFields[i];
                        oField._textSize = nValue;

                        let aParas = oField.content.Content;
                        aParas.forEach(function(para) {
                           para.SetApplyToAll(true);
                           para.Add(new AscCommonWord.ParaTextPr({FontSize : nValue}));
                           para.SetApplyToAll(false);
                           para.private_CompileParaPr(true);
                        });
                    }
                }
                    
            },
            get() {
                return 
            }
        },
        "userName": {
            set(sValue) {
                if (typeof(sValue) == "string")
                    this._userName = sValue;
            },
            get() {
                return this._userName;
            }
        }
    });

    /**
	 * Sets the JavaScript action of the field for a given trigger.
     * Note: This method will overwrite any action already defined for the chosen trigger.
	 * @memberof ApiBaseField
     * @param {cTrigger} cTrigger - A string that sets the trigger for the action.
     * @param {string} cScript - The JavaScript code to be executed when the trigger is activated.
	 * @typeofeditors ["PDF"]
	 */
    ApiBaseField.prototype.setAction = function(cTrigger, cScript) {
        let aFields = this.field._doc.GetFields(this.name);
        let nInternalType;
        switch (cTrigger) {
            case "MouseUp":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.MouseUp;
                break;
            case "MouseDown":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.MouseDown;
                break;
            case "MouseEnter":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.MouseEnter;
                break;
            case "MouseExit":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.MouseExit;
                break;
            case "OnFocus":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.OnFocus;
                break;
            case "OnBlur":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.OnBlur;
                break;
            case "Keystroke":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.Keystroke;
                break;
            case "Validate":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.Validate;
                break;
            case "Calculate":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.Calculate;
                break;
            case "Format":
                nInternalType = AscPDF.FORMS_TRIGGERS_TYPES.Format;
                break;
        }

        if (nInternalType != null) {
            aFields.forEach(function(field) {
                field.SetAction(nInternalType, cScript);
            });
        }
    };

    function ApiPushButtonField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    ApiPushButtonField.prototype = Object.create(ApiBaseField.prototype);
	ApiPushButtonField.prototype.constructor = ApiPushButtonField;

    /**
	 * Controls how space is distributed from the left of the button face with respect to the icon. It is expressed as a percentage
     * between 0 and 100, inclusive. The default value is 50.
     * If the icon is scaled anamorphically (which results in no space differences), this property is not used.
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonAlignX", {
        set(nValue) {
            if (typeof(nValue) == "number") {
                nValue = Math.round(nValue);
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetIconPosition(nValue, field.GetIconPosition().Y);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetIconPosition().X;
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});
    /**
	 * Controls how unused space is distributed from the bottom of the button face with respect to the icon. It is expressed as a
     * percentage between 0 and 100, inclusive. The default value is 50.
     * If the icon is scaled anamorphically (which results in no space differences), this property is not used.
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonAlignY", {
        set(nValue) {
            if (typeof(nValue) == "number") {
                nValue = Math.round(nValue);
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetIconPosition(field.GetIconPosition().X, nValue);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetIconPosition().Y;
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    /**
	 * If true, the extent to which the icon may be scaled is set to the bounds of the button field. The additional icon
     * placement properties are still used to scale and position the icon within the button face.
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonFitBounds", {
        set(bValue) {
            if (typeof(bValue) == "boolean") {
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetButtonFitBounds(bValue);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetButtonFitBounds();
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    /**
	 * Controls how the text and the icon of the button are positioned with respect to each other within the button face. The
     * convenience position object defines all of the valid alternatives.
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonPosition", {
        set(bValue) {
            if (typeof(bValue) == "boolean") {
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetButtonPosition(bValue);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetButtonPosition();
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    /**
	 * Controls how the icon is scaled (if necessary) to fit inside the button face. he convenience scaleHow object defines all
     * of the valid alternatives:
     * Proportionally:      scaleHow.proportional
     * Non-proportionally:  scaleHow.anamorphic
     * @param {number}
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonScaleHow", {
        set(nType) {
            if (typeof(nType) == "number") {
                nType = Math.round(nType);
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetScaleHow(nType);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetScaleHow();
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    /**
	 * Controls when an icon is scaled to fit inside the button face. The convenience scaleWhen object defines all of the valid 
     * alternatives:
     * Always:                  scaleWhen.always
     * Never:                   scaleWhen.never
     * If icon is too big:      scaleWhen.tooBig
     * If icon is too small:    scaleWhen.tooSmall
     * @param {number} - scaleHow.proportional or scaleHow.anamorphic
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "buttonScaleWhen", {
        set(nType) {
            if (typeof(nType) == "number") {
                nType = Math.round(nType);
                let aFields = this.field.GetDocument().GetField(this.name);

                if (aFields[0].IsAnnot()) {
                    aFields.forEach(function(field) {
                        field.SetScaleWhen(nType);
                    });
                }
                else {
                    throw Error("InvalidSetError: Set not possible, invalid or unknown.");
                }
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return this.field.GetScaleWhen();
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    Object.defineProperties(ApiPushButtonField.prototype, {
        "buttonScaleHow": {
            set(nValue) {
                if (Object.values(scaleHow).includes(nValue))
                    this._buttonScaleHow = nValue;
            },
            get() {
                return this._buttonScaleHow;
            }
                
        },
        "buttonScaleWhen": {
            set(nValue) {
                if (Object.values(scaleWhen).includes(nValue))
                    this._buttonScaleWhen = nValue;
            },
            get() {
                return this._buttonScaleWhen;
            }
                
        },
        "highlight": {
            set(sValue) {
                if (Object.values(highlight).includes(sValue))
                    this._highlight = sValue;
            },
            get() {
                return this._highlight;
            }
        },
        "textFont": {
            set(sValue) {
                if (typeof(sValue) == "string" && sValue !== "")
                    this._textFont = sValue;
            },
            get() {
                return this.textFont;
            }
        },
        "value": {
            get() {
                return undefined;
            }
        }
    });

    ApiPushButtonField.prototype.buttonImportIcon = function() {
        this.field.buttonImportIcon();
    };

    function ApiBaseCheckBoxField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    
    ApiBaseCheckBoxField.prototype = Object.create(ApiBaseField.prototype);
	ApiBaseCheckBoxField.prototype.constructor = ApiBaseCheckBoxField;
    Object.defineProperties(ApiBaseCheckBoxField.prototype, {
        "exportValues": {
            set(arrValues) {
                for (let i = 0; i < arrValues.length; i++)
                    if (typeof(arrValues[i]) !== "string")
                        arrValues[i] = String(arrValues[i]);
                    else if (arrValues[i] === "")
                        arrValues[i] = "Yes";

                let aFields = this._doc.GetFields(this.name);
                for (var i = 0; i < aFields.length; i++) {
                    aFields[i]._exportValues = arrValues;
                    if (arrValues[i])
                        aFields[i]._exportValue = arrValues[i];
                    else
                        aFields[i]._exportValue = "Yes";
                }
            },
            get() {
                return this._exportValues;
            }
        },
        "style": {
            set(sStyle) {
                if (Object.values(style).includes(sStyle))
                    this._style = sStyle;
            },
            get() {
                return this._style;
            }
        }
        
    });

    /**
	 * Determines whether the specified widget is checked.
     * Note: For a set of radio buttons that do not have duplicate export values, you can get the value, which is equal to the
     * export value of the individual widget that is currently checked (or returns an empty string, if none is).
	 * @memberof ApiBaseCheckBoxField
     * @param {number} nWidget - The 0-based index of an individual radio button or check box widget for this field.
     * The index is determined by the order in which the individual widgets of this field
     * were created (and is unaffected by tab-order).
     * Every entry in the Fields panel has a suffix giving this index, for example, MyField #0.
	 * @typeofeditors ["PDF"]
     * @returns {string}
	 */
    ApiBaseCheckBoxField.prototype.isBoxChecked = function(nWidget) {
        let aFields = this.field._doc.GetFields(this.name);
        let oField = aFields[nWidget];
        if (!oField)
            return false;

        if (oField._exportValue == oField._value)
            return true;

        return false;
    };

    // for radiobutton
    const CheckedSymbol   = 0x25C9;
	const UncheckedSymbol = 0x25CB;

    function ApiCheckBoxField(oField)
    {
        ApiBaseCheckBoxField.call(this, oField);
    }
    ApiCheckBoxField.prototype = Object.create(ApiBaseCheckBoxField.prototype);
	ApiCheckBoxField.prototype.constructor = ApiCheckBoxField;
    Object.defineProperties(ApiCheckBoxField.prototype, {
        "value": {
            set(sValue) {
                let oDoc = this.field.GetDocument();
                let oCalcInfo = oDoc.GetCalculateInfo();
                let oSourceField = oCalcInfo.GetSourceField();

                if (oCalcInfo.IsInProgress() && oSourceField && oSourceField.GetFullName() == this.name)
                    throw Error('InvalidSetError: Set not possible, invalid or unknown.');;

                if (oDoc.isOnValidate)
                    return;

                let aFields = this.field.GetDocument().GetFields(this.name);
                if (this._exportValues.includes(sValue)) {
                    aFields.forEach(function(field) {
                        field._value = sValue;
                    });
                }
                else {
                    aFields.forEach(function(field) {
                        field._value = "Off";
                    });
                }

                if (oCalcInfo.IsInProgress() == false) {
                    oDoc.DoCalculateFields(this.field);
                    oDoc.CommitFields();
                }
            },
            get() {
                return this.field._value;
            }
        }
    });

    function ApiRadioButtonField(oField)
    {
        ApiBaseCheckBoxField.call(this, oField);
    }
    ApiRadioButtonField.prototype = Object.create(ApiBaseCheckBoxField.prototype);
	ApiRadioButtonField.prototype.constructor = ApiRadioButtonField;
    Object.defineProperties(ApiRadioButtonField.prototype, {
        "radiosInUnison": {
            set(bValue) {
                if (typeof(bValue) == "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._radiosInUnison = bValue;
                    });
                }
            },
            get() {
                return this._radiosInUnison;
            }
        },
        "value": {
            set(sValue) {
                let oDoc = this.field.GetDocument();
                let oCalcInfo = oDoc.GetCalculateInfo();
                let oSourceField = oCalcInfo.GetSourceField();

                if (oCalcInfo.IsInProgress() && oSourceField && oSourceField.GetFullName() == this.name)
                    throw Error('InvalidSetError: Set not possible, invalid or unknown.');
 
                if (oDoc.isOnValidate)
                    return;

                let aFields = this._doc.GetFields(this.name);
                if (this._exportValues.includes(sValue)) {
                    aFields.forEach(function(field) {
                        field._value = sValue;
                    });
                }
                else {
                    aFields.forEach(function(field) {
                        field._value = "Off";
                    });
                }

                if (oCalcInfo.IsInProgress() == false) {
                    oDoc.DoCalculateFields(this.field);
                    oDoc.CommitFields();
                }
            },
            get() {
                let aFields = this.field.GetDocument().GetFields(this.name);
                for (let i = 0; i < aFields.length; i++) {
                    if (aFields[i]._value != "Off" && aFields[i].IsNeedCommit()) {
                        return aFields[i]._value;
                    }
                }
                for (let i = 0; i < aFields.length; i++) {
                    if (aFields[i]._value != "Off") {
                        return aFields[i]._value;
                    }
                }
                return "Off";
            }
        }
    });

    function ApiTextField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    ApiTextField.prototype = Object.create(ApiBaseField.prototype);
	ApiTextField.prototype.constructor = ApiTextField;

    /**
	 * Controls how the text is laid out within the text field. Values are left/center/right.
	 * @memberof ApiTextField
	 * @typeofeditors ["PDF"]
	 */
    Object.defineProperty(ApiTextField.prototype, "alignment", {
        set(sValue) {
            if (Object.values(ALIGN_TYPE).includes(sValue) == false)
                return;

            let aFields = this.field.GetDocument().GetField(this.name);

            if (aFields[0].IsAnnot()) {
                var nJcType = private_GetIntAlign(sValue);
                aFields.forEach(function(field) {
                    field.SetAlign(nJcType);
                });
            }
            else {
                throw Error("InvalidSetError: Set not possible, invalid or unknown.");
            }
        },
        get() {
            if (this.field.IsAnnot()) {
                return private_GetStrAlign(this.field.GetAlign());
            }
            else {
                throw Error("InvalidGetError: Get not possible, invalid or unknown.");
            }
        }
	});

    Object.defineProperties(ApiTextField.prototype, {
       
        "calcOrderIndex": {
            set(nValue) {
                if (typeof(nValue) == "number") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._calcOrderIndex = nValue;
                    });
                }
            },
            get() {
                return this._calcOrderIndex;
            }
        },
        "charLimit": {
            set(nValue) {
                let aFields = this.field.GetDocument().GetFields(this.name);

                aFields.forEach(function(field) {
                    field.SetCharLimit(nValue);
                });
            },
            get() {
                return this.field.GetCharLimit();
            }
        },
        "comb": {
            set(bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this.field.GetDocument().GetFields(this.name);
                aFields.forEach(function(field) {
                    field.SetComb(bValue);
                });
            },
            get() {
                return this.field.IsComb();
            }
        },
        "doNotScroll": {
            set(bValue) {
                if (typeof(bValue) !== "boolean") {
                    return;
                }

                let aFields = this._doc.GetFields(this.name);
                aFields.forEach(function(field) {
                    field._doNotScroll = bValue;
                    if (editor.getDocumentRenderer().activeForm == field) {
                        if (bValue == true)
                            editor.getDocumentRenderer().activeForm.UpdateScroll(false, false);
                        else
                            editor.getDocumentRenderer().activeForm.UpdateScroll();
                    }
                });
            },
            get() {
                return this._doNotScroll;
            }
        },
        "doNotSpellCheck": {
            set(bValue) {
                if (typeof(bValue) === "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._doNotSpellCheck = bValue;
                    });
                }
            },
            get() {
                return this._doNotSpellCheckl;
            }
        },
        "fileSelect": {
            set(bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this._doc.GetFields(this.name);
                aFields.forEach(function(field) {
                    field.SetFileSelect(bValue);
                });
            },
            get() {
                return this._fileSelect;
            }
        },
        "multiline": {
            set(bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this._doc.GetFields(this.name);
                aFields.forEach(function(field) {
                    field.SetMultiline(bValue);
                });
            },
            get() {
                return this._multiline;
            }
        },
        "password": {
            set (bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this._doc.GetFields(this.name);
                aFields.forEach(function(field) {
                    field.SetPassword(bValue);
                });
            },
            get() {
                return this._password;
            }
        },
        "richText": {
            set(bValue) {
                if (typeof(bValue) == "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetRichText(bValue);
                    });
                }
            },
            get() {
                return this._richText;
            }
        },
        "richValue": {
            set(aSpans) {
                if (Array.isArray(aSpans)) {
                    let aCorrectVals = aSpans.filter(function(item) {
                        if (Array.isArray(item) == false && typeof(item) == "object" && item != null)
                            return item;
                    });

                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._richValue = aCorrectVals;
                    });
                }
            },
            get() {
                return this._richValue;
            }
        },
        "textFont": {
            set(sValue) {
                if (typeof(sValue) == "string" && sValue !== "") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._textFont = sValue;
                    });
                }
            },
            get() {
                return this.textFont;
            }
        },
        "value": {
            set(value) {
                let oDoc = this.field.GetDocument();
                let oCalcInfo = oDoc.GetCalculateInfo();
                let oSourceField = oCalcInfo.GetSourceField();

                if (oCalcInfo.IsInProgress() && oSourceField && oSourceField.GetFullName() == this.name)
                    throw Error('InvalidSetError: Set not possible, invalid or unknown.');

                if (oDoc.isOnValidate)
                    return;

                if (value != null && value.toString)
                    value = value.toString();
                    
                if (this.value == value)
                    return;

                isValid = this.field.DoValidateAction(value);

                if (isValid) {
                    this.field.SetValue(value);
                    if (this.field.IsAnnot() == false)
                        return;

                    this.field.needValidate = false; 
                    this.field.Commit();
                    if (oCalcInfo.IsInProgress() == false) {
                        if (oDoc.event["rc"] == true) {
                            oDoc.DoCalculateFields(this.field);
                            oDoc.AddFieldToCommit(this.field);
                            oDoc.CommitFields();
                        }
                    }
                }
            },
            get() {
                let value = this.field.GetApiValue();
                let isNumber = !isNaN(value) && isFinite(value) && value != "";
                return isNumber ? parseFloat(value) : value;
            }
        },
        "defaultValue": {
            set(value) {
                this.field._defaultValue = value;
            },
            get() {
                return this.field._defaultValue = value;
            }
        }
    });
    
    function ApiBaseListField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    ApiBaseListField.prototype = Object.create(ApiBaseField.prototype);
	ApiBaseListField.prototype.constructor = ApiBaseListField;
    Object.defineProperties(ApiBaseListField.prototype, {
        "commitOnSelChange": {
            set(bValue) {
                if (typeof(bValue) == "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetCommitOnSelChange(bValue);
                    })
                }
            },
            get() {
                return this._commitOnSelChange;
            }
        },
        "numItems": {
            get() {
                return this._options.length;
            }
        },
        "textFont": {
            set(sValue) {
                if (typeof(sValue) == "string" && sValue !== "")
                    this._textFont = sValue;
            },
            get() {
                return this.textFont;
            }
        }
    });

    /**
	 * Gets the internal value of an item in a combo box or a list box.
	 * @memberof CTextField
     * @param {number} nIdx - The 0-based index of the item in the list or -1 for the last item in the list.
     * @param {boolean} [bExportValue=true] - Specifies whether to return an export value.
	 * @typeofeditors ["PDF"]
     * @returns {string}
	 */
    ApiBaseListField.prototype.getItemAt = function(nIdx, bExportValue) {
        if (typeof(bExportValue) != "boolean")
            bExportValue = true;

        if (this.field._options[nIdx]) {
            if (typeof(this.field._options[nIdx]) == "string")
                return this.field._options[nIdx];
            else {
                if (bExportValue)
                    return this.field._options[nIdx][1];

                return this.field._options[nIdx][0];
            } 
        }
    };

    function ApiComboBoxField(oField)
    {
        ApiBaseListField.call(this, oField);
    };
    ApiComboBoxField.prototype = Object.create(ApiBaseListField.prototype);
	ApiComboBoxField.prototype.constructor = ApiComboBoxField;
    Object.defineProperties(ApiComboBoxField.prototype, {
        "calcOrderIndex": {
            set(nValue) {
                if (typeof(nValue) == "number") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._calcOrderIndex = nValue;
                    });
                }
            },
            get() {
                return this._calcOrderIndex;
            }
        },
        "doNotSpellCheck": {
            set(bValue) {
                if (typeof(bValue) === "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetDoNotSpellCheck(bValue);
                    });
                }
            },
            get() {
                return this._doNotSpellCheckl;
            }
        },
        "editable": {
            set(bValue) {
                if (typeof(bValue) === "boolean") {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        this.SetEditable(bValue);
                    });
                }
            },
            get() {
                return this._editable;
            }
        },
        "currentValueIndices": {
            set(value) {
                if (typeof(value) === "number" && this.getItemAt(value, false) !== undefined) {
                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field._currentValueIndices = value;
                    });

                    this.SelectOption(value);
                    this.Commit();
                }
            },
            get() {
                return this.field._currentValueIndices;
            }
        },
        "value": {
            set(value) {
                let oDoc = this.field.GetDocument();
                let oCalcInfo = oDoc.GetCalculateInfo();
                let oSourceField = oCalcInfo.GetSourceField();

                if (oCalcInfo.IsInProgress() && oSourceField && oSourceField.GetFullName() == this.name)
                    throw Error('InvalidSetError: Set not possible, invalid or unknown.');;

                if (oDoc.isOnValidate)
                    return;

                if (value != null && value.toString)
                    value = value.toString();
                    
                if (this.value == value)
                    return;
                    
                isValid = this.field.DoValidateAction(value);

                if (isValid) {
                    this.field.SetValue(value);
                    if (this.field.IsAnnot() == false)
                        return;

                    this.field.needValidate = false; 
                    this.field.Commit();
                    if (oCalcInfo.IsInProgress() == false) {
                        if (oDoc.event["rc"] == true) {
                            oDoc.DoCalculateFields(this.field);
                            oDoc.AddFieldToCommit(this.field);
                            oDoc.CommitFields();
                        }
                    }
                }
            },
            get() {
                let value = this.field.GetApiValue();
                let isNumber = !isNaN(value) && isFinite(value) && value != "";
                return isNumber ? parseFloat(value) : value;
            }
        }
    });

    /**
	 * Sets the list of items for a combo box.
	 * @memberof ApiComboBoxField
     * @param {string[]} values - An array in which each element is either an object convertible to a string or another array:
        For an element that can be converted to a string, the user and export values for the list item are equal to the string.
        For an element that is an array, the array must have two subelements convertible to strings, where the first is the user value and the second is the export value.
	 * @typeofeditors ["PDF"]
	 */
    ApiComboBoxField.prototype.setItems = function(values) {
        let aOptToPush = [];
        let oThis = this;

        for (let i = 0; i < values.length; i++) {
            if (values[i] == null)
                continue;
            if (typeof(values[i]) == "string" && values[i] != "")
                aOptToPush.push(values[i]);
            else if (Array.isArray(values[i]) && values[i][0] != undefined && values[i][1] != undefined) {
                if (values[i][0].toString && values[i][1].toString) {
                    aOptToPush.push([values[i][0].toString(), values[i][1].toString()])
                }
            }
            else if (typeof(values[i]) != "string" && values[i].toString) {
                aOptToPush.push(values[i].toString());
            }
        }

        let aFields = this._doc.GetFields(this.name);
        aFields.forEach(function(field) {
            field._options = aOptToPush.slice();
            if (field == oThis) {
                field.SelectOption(0, true);
                field.UnionLastHistoryPoints();
                field.SetNeedCommit(false);
            }
            else
                field.SelectOption(0, false);
        });
    };

    function ApiListBoxField(oField)
    {
        ApiBaseListField.call(this, oField);
    };
    
    ApiListBoxField.prototype = Object.create(ApiBaseListField.prototype);
	ApiListBoxField.prototype.constructor = ApiListBoxField;
    Object.defineProperties(ApiListBoxField.prototype, {
        "multipleSelection": {
            set(bValue) {
                if (typeof(bValue) == "boolean") {
                    if (bValue == this.multipleSelection)
                        return;

                    let aFields = this._doc.GetFields(this.name);
                    aFields.forEach(function(field) {
                        field.SetMultipleSelection(bValue);
                    });
                }
            },
            get() {
                return this._multipleSelection;
            }
        },
        "currentValueIndices": {
            set(value) {
                if (Array.isArray(value) && this.multipleSelection === true)
                {
                    let isValid = true;
                    for (let i = 0; i < value.length; i++) {
                        if (typeof(value[i]) != "number" || this.getItemAt(value[i], false) === undefined) {
                            isValid = false;
                            break;
                        }
                    }

                    if (isValid) {
                        this._bAutoShiftContentView = true;

                        // снимаем выделение с тех, которые не присутсвуютв новых значениях (value)
                        for (let i = 0; i < this._currentValueIndices.length; i++) {
                            if (value.includes(this._currentValueIndices[i]) == false) {
                                this.UnselectOption(this._currentValueIndices[i]);
                            }
                        }
                        
                        for (let i = 0; i < value.length; i++) {
                            // добавляем выделение тем, которые не присутсвуют в текущем поле
                            if (this._currentValueIndices.includes(value[i]) == false) {
                                this.SelectOption(value[i], false);
                            }
                        }
                        this._currentValueIndices = value.sort();
                        this.Commit();
                    }
                }
                else if (this.multipleSelection === false && typeof(value) === "number" && this.getItemAt(value, false) !== undefined) {
                    this._currentValueIndices = value;
                    this.SelectOption(value, true);
                    this.Commit();
                }
            },
            get() {
                return this.field._currentValueIndices;
            }
        },
        "value": {
            set(value) {
                let oDoc = this.field.GetDocument();
                let oCalcInfo = oDoc.GetCalculateInfo();
                let oSourceField = oCalcInfo.GetSourceField();

                if (oCalcInfo.IsInProgress() && oSourceField && oSourceField.GetFullName() == this.name)
                    throw Error('InvalidSetError: Set not possible, invalid or unknown.');;

                if (oDoc.isOnValidate)
                    return;

                if (value != null && value.toString)
                    value = value.toString();
                
                if (this.value == value)
                    return;
                
                this.field.SetValue(value);
                this.field.Commit();

                if (oCalcInfo.IsInProgress() == false) {
                    oDoc.DoCalculateFields(this.field);
                    oDoc.CommitFields();
                }
            },
            get() {
                let value = this.field.GetApiValue();
                let isNumber = !isNaN(value) && isFinite(value) && value != "";
                return isNumber ? parseFloat(value) : value;
            }
        }
    });

    /**
	 * Sets the list of items for a list box.
	 * @memberof ApiListBoxField
     * @param {string[]} values - An array in which each element is either an object convertible to a string or another array:
        For an element that can be converted to a string, the user and export values for the list item are equal to the string.
        For an element that is an array, the array must have two subelements convertible to strings, where the first is the user value and the second is the export value.
	 * @typeofeditors ["PDF"]
	 */
    ApiListBoxField.prototype.setItems = function(values) {
        let aFields = this._doc.GetFields(this.name);

        aFields.forEach(function(field) {
            field._options = [];
            field.content.Internal_Content_RemoveAll();
            let sCaption, oPara, oRun;
            
            for (let i = 0; i < values.length; i++) {
                if (values[i] == null)
                    continue;
                sCaption = "";
                if (typeof(values[i]) == "string" && values[i] != "") {
                    sCaption = values[i];
                    field._options.push(values[i]);
                }
                else if (Array.isArray(values[i]) && values[i][0] != undefined && values[i][1] != undefined) {
                    if (values[i][0].toString && values[i][1].toString) {
                        field._options.push([values[i][0].toString(), values[i][1].toString()]);
                        sCaption = values[i][0].toString();
                    }
                }
                else if (typeof(values[i]) != "string" && values[i].toString) {
                    field._options.push(values[i].toString());
                    sCaption = values[i].toString();
                }

                if (sCaption != "") {
                    oPara = new AscCommonWord.Paragraph(field.content.DrawingDocument, field.content, false);
                    oRun = new AscCommonWord.ParaRun(oPara, false);
                    field.content.Internal_Content_Add(i, oPara);
                    oPara.Add(oRun);
                    oRun.AddText(sCaption);
                }
            }

            field.content.Recalculate_Page(0, true);
            field._curShiftView.x = 0;
            field._curShiftView.y = 0;
        });

        this.SelectOption(0, true);
        this.UnionLastHistoryPoints();

        if (this._multipleSelection)
            this._currentValueIndices = [0];
        else
            this._currentValueIndices = 0;

        if (aFields.length > 1)
            this.Commit(this);
    };
    /**
	 * Inserts a new item into a list box
	 * @memberof ApiListBoxField
     * @param {string} cName - The item name that will appear in the form.
     * @param {string} cExport - (optional) The export value of the field when this item is selected. If not provided, the
     * cName is used as the export value.
     * @param {number} nIdx - (optional) The index in the list at which to insert the item. If 0 (the default), the new
     *  item is inserted at the top of the list. If –1, the new item is inserted at the end of the
     *  list.
	 * @typeofeditors ["PDF"]
	 */
    ApiListBoxField.prototype.insertItemAt = function(cName, cExport, nIdx) {
        let aFields = this.field._doc.GetFields(this.name);

        aFields.forEach(function(field) {
            field.InsertOption(cName, cExport, nIdx);
        })
    };

    function ApiSignatureField(oField)
    {
        ApiBaseField.call(this, oField);
    };

    function CSpan()
    {
        this._alignment = ALIGN_TYPE.left;
        this._fontFamily = ["sans-serif"];
        this._fontStretch = "normal";
        this._fontStyle = "normal";
        this._fontWeight = 400;
        this._strikethrough = false;
        this._subscript = false;
        this._superscript = false;

        Object.defineProperties(this, {
            "alignment": {
                set(sValue) {
                    if (Object.values(ALIGN_TYPE).includes(sValue))
                        this._alignment = sValue;
                },
                get() {
                    return this._alignment;
                }
            },
            "fontFamily": {
                set(arrValue) {
                    if (Array.isArray(arrValue))
                    {
                        let aCorrectFonts = [];

                        if (arrValue[0] !== undefined && typeof(arrValue[0]) == "string" && arrValue[0] === "")
                            aCorrectFonts.push(arrValue[0]);
                        if (arrValue[1] !== undefined && typeof(arrValue[1]) == "string" && arrValue[1] === "")
                            aCorrectFonts.push(arrValue[1]);

                        this._fontFamily = aCorrectFonts;
                    }
                }
            },
            "fontStretch": {
                set(sValue) {
                    if (FONT_STRETCH.includes(sValue))
                        this._fontStretch = sValue;
                },
                get() {
                    return this._fontStretch;
                }
            },
            "fontStyle": {
                set(sValue) {
                    if (Object.values(FONT_STYLE).includes(sValue))
                        this._fontStyle = sValue;
                },
                get() {
                    return this._fontStyle;
                }
            },
            "fontWeight": {
                set(nValue) {
                    if (FONT_WEIGHT.includes(nValue))
                        this._fontWeight = nValue;
                },
                get() {
                    return this._fontWeight;
                }
            },
            "strikethrough": {
                set(bValue) {
                    if (typeof(bValue) == "boolean")
                        this._strikethrough = bValue;
                },
                get() {
                    return this._strikethrough;
                }
            },
            "subscript": {
                set(bValue) {
                    if (typeof(bValue) == "boolean")
                        this._subscript = bValue;
                },
                get() {
                    return this._subscript;
                }
            },
            "superscript": {
                set(bValue) {
                    if (typeof(bValue) == "boolean")
                        this._superscript = bValue;
                },
                get() {
                    return this._superscript;
                }
            },

        });
    }

    function private_GetIntAlign(sType)
	{
		if ("left" === sType)
			return AscPDF.ALIGN_TYPE.left;
		else if ("right" === sType)
			return AscPDF.ALIGN_TYPE.right;
		else if ("center" === sType)
			return AscPDF.ALIGN_TYPE.center;

		return undefined;
	}
    function private_GetStrAlign(nType) {
        if (AscPDF.ALIGN_TYPE.left === nType)
            return "left";
        else if (AscPDF.ALIGN_TYPE.right === nType)
            return "right";
        else if (AscPDF.ALIGN_TYPE.center === nType)
            return "center";

        return undefined;
    }

    function private_GetIntBorderStyle(sType) {
        switch (sType) {
            case "solid":
                return AscPDF.BORDER_TYPES.solid;
            case "dashed":
                return AscPDF.BORDER_TYPES.dashed;
            case "beveled":
                return AscPDF.BORDER_TYPES.beveled;
            case "inset":
                return AscPDF.BORDER_TYPES.inset;
            case "underline":
                return AscPDF.BORDER_TYPES.underline;
            
        }
    }
    function private_GetStrBorderStyle(nType) {
        switch (nType) {
            case AscPDF.BORDER_TYPES.solid:
                return "solid";
            case AscPDF.BORDER_TYPES.dashed:
                return "dashed";
            case AscPDF.BORDER_TYPES.beveled:
                return "beveled";
            case AscPDF.BORDER_TYPES.inset:
                return "inset";
            case AscPDF.BORDER_TYPES.underline:
                return "underline";
            
        }
    }

    if (!window["AscPDF"])
	    window["AscPDF"] = {};
        
	window["AscPDF"].ApiDocument          = ApiDocument;
	window["AscPDF"].ApiTextField         = ApiTextField;
	window["AscPDF"].ApiPushButtonField   = ApiPushButtonField;
	window["AscPDF"].ApiCheckBoxField     = ApiCheckBoxField;
	window["AscPDF"].ApiRadioButtonField  = ApiRadioButtonField;
	window["AscPDF"].ApiComboBoxField     = ApiComboBoxField;
	window["AscPDF"].ApiListBoxField      = ApiListBoxField;
})();
