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
        r: 201, 
        g: 200,
        b: 255
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

    let ACTION_TRIGGER_TYPES = {
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
    //------------------------------------------------------------------------------------------------------------------
	//
	// pdf api types
	//
	//------------------------------------------------------------------------------------------------------------------
    
    let ALIGN_TYPE = {
        left:   "left",
        center: "center",
        right:  "right"
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

    // For Span attributes (start)
    let FONT_STRETCH = ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal",
        "semi-expanded", "expanded", "extra-expanded", "ultra-expanded"];

    let FONT_STYLE = {
        italic: "italic",
        normal: "normal"
    }

    let FONT_WEIGHT = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    // for CSpan (end)

    
    // default availible colors
    let color = {
        "transparent":  [ "T" ],
        "black":        [ "G", 0 ],
        "white":        [ "G", 1 ],
        "red":          [ "RGB", 1,0,0 ],
        "green":        [ "RGB", 0,1,0 ],
        "blue":         [ "RGB", 0, 0, 1 ],
        "cyan":         [ "CMYK", 1,0,0,0 ],
        "magenta":      [ "CMYK", 0,1,0,0 ],
        "yellow":       [ "CMYK", 0,0,1,0 ],
        "dkGray":       [ "G", 0.25 ],  // version 4.0
        "gray":         [ "G", 0.5 ],   // version 4.0
        "ltGray":       [ "G", 0.75 ]   // version 4.0
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
    Object.freeze(color);
    Object.freeze(highlight);
    Object.freeze(VALID_ROTATIONS);
    Object.freeze(style);
    Object.freeze(ACTION_TRIGGER_TYPES);

    /**
	 * A string that sets the trigger for the action. Values are:
	 * @typedef {"MouseUp" | "MouseDown" | "MouseEnter" | "MouseExit" | "OnFocus" | "OnBlur" | "Keystroke" | "Validate" | "Calculate" | "Format"} cTrigger
	 * For a list box, use the Keystroke trigger for the Selection Change event.
     */

    // base form class with attributes and method for all types of forms
	function ApiBaseField(oField)
    {
        this.field = oField;
    }
    Object.defineProperties(ApiBaseField.prototype, {
        // private
        "_parent": {
            enumerable: false,
            writable: true,
            value: null
        },
        "_pagePos": {
            writable: true,
            enumerable: false,
            value: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        },
        "_kids": {
            enumerable: false,
            value: [],
        },
        "_partialName": {
            writable: true,
            enumerable: false
        },

        // common
        "borderStyle": {
            set(sValue) {
                if (Object.values(border).includes(sValue)) {
                    let aFields = this._doc.getWidgetsByName(this.name);
                    aFields.forEach(function(field) {
                        field._borderStyle = sValue;
                        field.SetNeedRecalc(true);
                        field._content.GetElement(0).Content.forEach(function(run) {
                            run.RecalcInfo.Measure = true;
                        });
                    });

                    editor.getDocumentRenderer()._paintForms();
                }

            },
            get() {
                return this._borderStyle;
            }
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
                    let aFields = this._doc.getWidgetsByName(this.name);
                    aFields.forEach(function(field) {
                        field._lineWidth = nValue;
                        field.SetNeedRecalc(true);
                        field._content.GetElement(0).Content.forEach(function(run) {
                            run.RecalcInfo.Measure = true;
                        });
                    });

                    editor.getDocumentRenderer()._paintForms();
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
                return this._page;
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);

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
                if (Array.isArray(aColor))
                    this._textColor = aColor;
            },
            get () {
                return this._textColor;
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
                    let aFields = this._doc.getWidgetsByName(this.name);
                    let oField;
                    for (var i = 0; i < aFields.length; i++) {
                        oField = aFields[i];
                        oField._textSize = nValue;

                        let aParas = oField._content.Content;
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
        let aFields = this.field._doc.getWidgetsByName(this.name);
        
        aFields.forEach(function(field) {
            field.SetAction(cTrigger, cScript);
        });
    };

    function ApiPushButtonField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    ApiPushButtonField.prototype = Object.create(ApiBaseField.prototype);
	ApiPushButtonField.prototype.constructor = ApiPushButtonField;
    Object.defineProperties(ApiPushButtonField.prototype, {
        "buttonAlignX": {
            set(nValue) {
                if (typeof(nValue) == "number")
                    this._buttonAlignX = Math.round(nValue);
            },
            get() {
                return this._buttonAlignX;
            },
        },
        "buttonAlignY": {
            set(nValue) {
                if (typeof(nValue) == "number")
                    this._buttonAlignY = Math.round(nValue);
            },
            get() {
                return this._buttonAlignY;
            }
        },
        "buttonFitBounds": {
            set(bValue) {
                if (typeof(bValue) == "boolean")
                    this._buttonFitBounds = bValue;
            },
            get() {
                return this._buttonFitBounds;
            }
        },
        "buttonPosition": {
            set(nValue) {
                if (Object.values(position).includes(nValue))
                    this._buttonPosition = nValue;
            },
            get() {
                return this._buttonPosition;
            }
        },
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

                let aFields = this._doc.getWidgetsByName(this.name);
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
        let aFields = this.field._doc.getWidgetsByName(this.name);
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
                let aFields = this._doc.getWidgetsByName(this.name);
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
                editor.getDocumentRenderer()._paintForms();
            },
            get() {
                return this._value;
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
                    let aFields = this._doc.getWidgetsByName(this.name);
                    aFields.forEach(function(field) {
                        field._radiosInUnison = bValue;
                    });
                    this.UpdateAll();
                }
            },
            get() {
                return this._radiosInUnison;
            }
        },
        "value": {
            set(sValue) {
                let aFields = this._doc.getWidgetsByName(this.name);
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
                this.UpdateAll();
            },
            get() {
                return this._value;
            }
        }
    });

    function ApiTextField(oField)
    {
        ApiBaseField.call(this, oField);
    }
    ApiTextField.prototype = Object.create(ApiBaseField.prototype);
	ApiTextField.prototype.constructor = ApiTextField;
    Object.defineProperties(ApiTextField.prototype, {
        "alignment": {
            set(sValue) {
                if (Object.values(ALIGN_TYPE).includes(sValue)) {
                    this._alignment = sValue;
                    var nJcType = private_GetFieldAlign(sValue);

                    let aFields = this.field._doc.getWidgetsByName(this.name);
                    aFields.forEach(function(field) {
                        field.SetAlign(nJcType);
                    });

                    editor.getDocumentRenderer()._paintForms();
                }
            },
            get() {
                return this._alignment;
            }
        },
        "calcOrderIndex": {
            set(nValue) {
                if (typeof(nValue) == "number") {
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                if (typeof(nValue) == "number" && nValue <= 500 && nValue > 0 && this.fileSelect === false) {
                    let aFields = this._doc.getWidgetsByName(this.name);
                    nValue = Math.round(nValue);
                    if (this._charLimit != nValue) {
                        let aChars = [];
                        let sText = this._content.GetElement(0).GetText({ParaEndToSpace: false});
                        for (let i = 0; i < sText.length; i++) {
                            aChars.push(sText[i].charCodeAt(0));
                        }

                        aFields.forEach(function(field) {
                            field._charLimit = nValue;
                            field._content.SelectAll();
                            field.EnterText(aChars);
                        });

                        editor.getDocumentRenderer()._paintForms();
                    }
                }
            },
            get() {
                return this._charLimit;
            }
        },
        "comb": {
            set(bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this._doc.getWidgetsByName(this.name);
                aFields.forEach(function(field) {
                    field.SetComb(bValue);
                    field.SetNeedRecalc(true);
                });
                editor.getDocumentRenderer()._paintForms();
            },
            get() {
                return this._comb;
            }
        },
        "doNotScroll": {
            set(bValue) {
                if (typeof(bValue) !== "boolean") {
                    return;
                }

                let aFields = this._doc.getWidgetsByName(this.name);
                aFields.forEach(function(field) {
                    field._doNotScroll = bValue;
                    if (editor.getDocumentRenderer().mouseDownFieldObject == field) {
                        if (bValue == true)
                            editor.getDocumentRenderer().mouseDownFieldObject.UpdateScroll(false, false);
                        else
                            editor.getDocumentRenderer().mouseDownFieldObject.UpdateScroll();
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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

                let aFields = this._doc.getWidgetsByName(this.name);
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

                let aFields = this._doc.getWidgetsByName(this.name);
                aFields.forEach(function(field) {
                    field.SetMultiline(bValue);
                });

                editor.getDocumentRenderer()._paintForms();
            },
            get() {
                return this._multiline;
            }
        },
        "password": {
            set (bValue) {
                if (typeof(bValue) != "boolean")
                    return;

                let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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

                    let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                if (value.toString)
                    value = value.toString();
                else
                    return;
                
                let oTextFormat = new AscWord.CTextFormFormat();
                let arrBuffer = oTextFormat.GetBuffer(value);
                this.content.GetElement(0).GetElement(0).ClearContent();
                let isCanEnter = this.EnterText(arrBuffer);
                if (!isCanEnter) {
                    return; // to do вызвать ошибку формата
                }
                this._value = value;
                this.ApplyValueForAll(true);

                editor.getDocumentRenderer()._paintForms();
            },
            get() {
                return this.field._content.GetElement(0).GetText({ParaEndToSpace: false});
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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

        if (this._options[nIdx]) {
            if (typeof(this._options[nIdx]) == "string")
                return this._options[nIdx];
            else {
                if (bExportValue)
                    return this._options[nIdx][1];

                return this._options[nIdx][0];
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);
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
                    let aFields = this._doc.getWidgetsByName(this.name);
                    aFields.forEach(function(field) {
                        field._currentValueIndices = value;
                    });

                    this.SelectOption(value);
                    this.ApplyValueForAll();
                }
            },
            get() {
                return this._currentValueIndices;
            }
        },
        "value": {
            set(value) {
                if (value.toString)
                    value = value.toString();
                else
                    return;
                    
                let oTextFormat = new AscWord.CTextFormFormat();
                let arrBuffer = oTextFormat.GetBuffer(value);
                this.content.GetElement(0).GetElement(0).ClearContent();
                let isCanEnter = this.EnterText(arrBuffer, true);
                if (!isCanEnter) {
                    return; // to do вызвать ошибку формата
                }
                this._value = value;
                this.ApplyValueForAll(true);
                editor.getDocumentRenderer()._paintForms();
            },
            get() {
                return this._value;
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

        let aFields = this._doc.getWidgetsByName(this.name);
        aFields.forEach(function(field) {
            field._options = aOptToPush.slice();
            if (field == oThis) {
                field.SelectOption(0, true);
                field.UnionLastHistoryPoints();
                field._needApplyToAll = false;
            }
            else
                field.SelectOption(0, false);
        });

        editor.getDocumentRenderer()._paintForms();
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

                    let aFields = this._doc.getWidgetsByName(this.name);
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
                        this.ApplyValueForAll();
                    }
                }
                else if (this.multipleSelection === false && typeof(value) === "number" && this.getItemAt(value, false) !== undefined) {
                    this._currentValueIndices = value;
                    this.SelectOption(value, true);
                    this.ApplyValueForAll();
                }
            },
            get() {
                return this._currentValueIndices;
            }
        },
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
        let aFields = this._doc.getWidgetsByName(this.name);

        aFields.forEach(function(field) {
            field._options = [];
            field._content.Internal_Content_RemoveAll();
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
                    oPara = new AscCommonWord.Paragraph(field._content.DrawingDocument, field._content, false);
                    oRun = new AscCommonWord.ParaRun(oPara, false);
                    field._content.Internal_Content_Add(i, oPara);
                    oPara.Add(oRun);
                    oRun.AddText(sCaption);
                }
            }

            field._content.Recalculate_Page(0, true);
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
            this.ApplyValueForAll(this, false);

        editor.getDocumentRenderer()._paintForms();
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
        let aFields = this.field._doc.getWidgetsByName(this.name);

        aFields.forEach(function(field) {
            field.InsertOption(cName, cExport, nIdx);
        })

        editor.getDocumentRenderer()._paintForms();
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

    if (!window["AscPDFEditor"])
	    window["AscPDFEditor"] = {};
        
	window["AscPDFEditor"].ApiTextField         = ApiTextField;
	window["AscPDFEditor"].ApiPushButtonField   = ApiPushButtonField;
	window["AscPDFEditor"].ApiCheckBoxField     = ApiCheckBoxField;
	window["AscPDFEditor"].ApiRadioButtonField  = ApiRadioButtonField;
	window["AscPDFEditor"].ApiComboBoxField     = ApiComboBoxField;
	window["AscPDFEditor"].ApiListBoxField      = ApiListBoxField;
})();
