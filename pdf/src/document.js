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

    let AscPDFEditor = window["AscPDFEditor"];

    function CCalculateInfo(oDoc) {
        this.calculateFields = [];
        this.document = oDoc;
        this.fieldsToCommit = [];
        this.isInProgress = false;
    };

    CCalculateInfo.prototype.AddToCalculateField = function(oField) {
        if (null == this.calculateFields.find(function(field) {
            return field.api.name == oField.api.name;
        })) {
            this.calculateFields.push(oField);
        }
    };
    CCalculateInfo.prototype.SetIsInProgress = function(bValue) {
        this.isInProgress = bValue;
    };
    CCalculateInfo.prototype.IsInProgress = function() {
        return this.isInProgress;
    };

    function CPDFDoc() {
        this.widgets = []; // непосредственно сами поля, которые отрисовываем (дочерние без потомков)
        this.rootFields = new Map(); // root поля форм

        this.actionsInfo = new CActionQueue(this);
        this.api = this.GetDocumentApi();
        this.CalculateInfo = new CCalculateInfo(this);
        this.fieldsToCommit = [];
        this.formsEvent = {};
    }

    CPDFDoc.prototype.CommitFields = function() {
        this.fieldsToCommit.forEach(function(field) {
            field.Commit();
        });
        
        this.ClearFieldsToCommit();
    };
    CPDFDoc.prototype.AddFieldToCommit = function(oField) {
        this.fieldsToCommit.push(oField);
    };
    CPDFDoc.prototype.ClearFieldsToCommit = function() {
        this.fieldsToCommit = [];
    };

    CPDFDoc.prototype.DoCalculateFields = function() {
        // смысл такой, что когда изменяем какое-либо поле, вызываем этот метод, который делает calculate
        // для всех необходимых полей и добавляет их в массив fieldsToCommit,
        // далее вызываем ApplyFields чтобы применить значения для всех связных полей
        let oThis = this;
        this.CalculateInfo.SetIsInProgress(true);
        this.CalculateInfo.calculateFields.forEach(function(field) {
            let oFormatTrigger = field.GetTrigger(AscPDFEditor.FORMS_TRIGGERS_TYPES.Calculate);
            let oActionRunScript = oFormatTrigger ? oFormatTrigger.GetActions()[0] : null;

            if (oActionRunScript) {
                oThis.activeForm = field;
                oActionRunScript.RunScript();
                if (field.IsNeedCommit()) {
                    field.SetNeedRecalc(true);
                    oThis.fieldsToCommit.push(field);
                }
            }
        });
        this.CalculateInfo.SetIsInProgress(false);
    };

    CPDFDoc.prototype.GetCalculateInfo = function() {
        return this.CalculateInfo;
    };

    CPDFDoc.prototype.GetActionsQueue = function() {
        return this.actionsInfo;
    };
        
    /**
	 * Adds an interactive field to document.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
     * @param {String} cName - The name of the new field to create.
     * @param {"button" | "checkbox" | "combobox" | "listbox" | "radiobutton" | "signature" | "text"} cFieldType - The type of form field to create.
     * @param {Number} nPageNum - The 0-based index of the page to which to add the field.
     * @param {Array} oCoords - An array of four numbers in rotated user space that specifies the size and placement
        of the form field. These four numbers are the coordinates of the bounding rectangle,
        in the following order: upper-left x, upper-left y, lower-right x and lower-right y 
	 * @returns {CBaseForm}
	 */
    CPDFDoc.prototype.addField = function(cName, cFieldType, nPageNum, oCoords) {
        function checkValidParams(cName, cFieldType, nPageNum, oCoords) {
            if (Object.values(AscPDFEditor.FIELD_TYPE).includes(cFieldType) == false)
                return false;
            if (typeof(nPageNum) !== "number" || nPageNum < 0)
                return false;
            if (typeof(cName) !== "string" || cName == "")
                return false;
            let isValidRect = true;
            if (Array.isArray(oCoords)) {
                for (let i = 0; i < 4; i++) {
                    if (typeof(oCoords[i]) != "number") {
                        isValidRect = false;
                        break;
                    }
                }
            }
            else
                isValidRect = false;

            if (!isValidRect)
                return false;
        }
        if (false == checkValidParams(cName, cFieldType, nPageNum, oCoords))
            return null;

        let viewer = editor.WordControl.m_oDrawingDocument.m_oDocumentRenderer;
        let oPagesInfo = viewer.pagesInfo;
        if (!oPagesInfo.pages[nPageNum])
            return null;
        
        let oField;

        while (cName.indexOf('..') != -1)
            cName = cName.replace(new RegExp("\.\.", "g"), ".");

        let oExistsWidget = this.GetField(cName);
        // если есть виджет-поле с таким именем, но другим типом, то не добавляем 
        if (oExistsWidget && oExistsWidget.type != cFieldType)
            return null; // to do add error (field with this name already exists)

        // получаем PartNames
        let aPartNames = cName.split('.').filter(function(item) {
            if (item != "")
                return item;
        })

        // по формату не больше 20 вложенностей
        if (aPartNames.length > 20)
            return null;

        // создаем родительские поля, последнее будет виджет-полем
        if (aPartNames.length > 1) {
            if (this.rootFields.get(aPartNames[0]) == null) { // если нет root поля, то создаем
                this.rootFields.set(aPartNames[0], private_createField(aPartNames[0], "", "", []));
            }

            let oParentField = this.rootFields.get(aPartNames[0]);
            
            for (let i = 1; i < aPartNames.length; i++) {
                // последним добавляем виджет-поле (то, которое рисуем)
                if (i == aPartNames.length - 1) {
                    oField = private_createField(aPartNames[i], cFieldType, nPageNum, oCoords);
                    oParentField.AddKid(oField);
                    this.widgets.push(oField);
                }
                else {
                    // если есть поле с таким именем (part name), то двигаемся дальше, если нет, то создаем
                    let oExistsField = oParentField.private_getField(aPartNames[i]);
                    if (oExistsField)
                        oParentField = oExistsField;
                    else {
                        oExistsField.AddKid(private_createField(aPartNames[i], "", "", []));
                        oParentField = oExistsField;
                    }
                }
            }
        }
        // сразу создаем виджет-поле
        else {
            oField = private_createField(aPartNames[0], cFieldType, nPageNum, oCoords);
            this.widgets.push(oField);
        }

        if (oPagesInfo.pages[nPageNum].fields == null) {
            oPagesInfo.pages[nPageNum].fields = [];
        }
        
        oPagesInfo.pages[nPageNum].fields.push(oField);

        oField._doc = this;

        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();

        oField.SyncField();
        
        for (let i = 0; i < viewer.pageDetector.pages.length; i++) {
            if (viewer.pageDetector.pages[i].num == nPageNum) {
                oField.Draw(viewer.canvasForms.getContext('2d'), viewer.pageDetector.pages[i].x, viewer.pageDetector.pages[i].y);
                if (oField.IsNeedDrawHighlight())
                    oField.DrawHighlight(viewer.canvasFormsHighlight.getContext("2d"));
                break;
            }
        }
        
        return oField;
    };

    /**
	 * Adds an interactive field to document.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
     * @param {String} cName - The name of the new field to create.
     * @param {"button" | "checkbox" | "combobox" | "listbox" | "radiobutton" | "signature" | "text"} cFieldType - The type of form field to create.
     * @param {Number} nPageNum - The 0-based index of the page to which to add the field.
     * @param {Array} oCoords - An array of four numbers in rotated user space that specifies the size and placement
        of the form field. These four numbers are the coordinates of the bounding rectangle,
        in the following order: upper-left x, upper-left y, lower-right x and lower-right y 
	 * @returns {CBaseForm}
	 */
    CPDFDoc.prototype.private_addField = function(cName, cFieldType, nPageNum, oCoords) {
        function checkValidParams(cName, cFieldType, nPageNum, oCoords) {
            if (Object.values(AscPDFEditor.FIELD_TYPE).includes(cFieldType) == false)
                return false;
            if (typeof(nPageNum) !== "number" || nPageNum < 0)
                return false;
            if (typeof(cName) !== "string" || cName == "")
                return false;
            let isValidRect = true;
            if (Array.isArray(oCoords)) {
                for (let i = 0; i < 4; i++) {
                    if (typeof(oCoords[i]) != "number") {
                        isValidRect = false;
                        break;
                    }
                }
            }
            else
                isValidRect = false;

            if (!isValidRect)
                return false;
        }
        if (false == checkValidParams(cName, cFieldType, nPageNum, oCoords))
            return null;

        let viewer = editor.WordControl.m_oDrawingDocument.m_oDocumentRenderer;
        let oPagesInfo = viewer.pagesInfo;
        if (!oPagesInfo.pages[nPageNum])
            return null;
        
        let oField;

        while (cName.indexOf('..') != -1)
            cName = cName.replace(new RegExp("\.\.", "g"), ".");

        let oExistsWidget = this.GetField(cName);
        // если есть виджет-поле с таким именем, но другим типом, то не добавляем 
        if (oExistsWidget && oExistsWidget.type != cFieldType)
            return null; // to do add error (field with this name already exists)

        // получаем PartNames
        let aPartNames = cName.split('.').filter(function(item) {
            if (item != "")
                return item;
        })

        // по формату не больше 20 вложенностей
        if (aPartNames.length > 20)
            return null;

        // создаем родительские поля, последнее будет виджет-полем
        if (aPartNames.length > 1) {
            if (this.rootFields.get(aPartNames[0]) == null) { // если нет root поля, то создаем
                this.rootFields.set(aPartNames[0], private_createField(aPartNames[0], "", "", []));
            }

            let oParentField = this.rootFields.get(aPartNames[0]);
            
            for (let i = 1; i < aPartNames.length; i++) {
                // последним добавляем виджет-поле (то, которое рисуем)
                if (i == aPartNames.length - 1) {
                    oField = private_createField(aPartNames[i], cFieldType, nPageNum, oCoords);
                    oParentField.AddKid(oField);
                    this.widgets.push(oField);
                }
                else {
                    // если есть поле с таким именем (part name), то двигаемся дальше, если нет, то создаем
                    let oExistsField = oParentField.private_getField(aPartNames[i]);
                    if (oExistsField)
                        oParentField = oExistsField;
                    else {
                        oExistsField.AddKid(private_createField(aPartNames[i], "", "", []));
                        oParentField = oExistsField;
                    }
                }
            }
        }
        // сразу создаем виджет-поле
        else {
            oField = private_createField(aPartNames[0], cFieldType, nPageNum, oCoords);
            this.widgets.push(oField);
        }

        if (oPagesInfo.pages[nPageNum].fields == null)
            oPagesInfo.pages[nPageNum].fields = [];

        oPagesInfo.pages[nPageNum].fields.push(oField);

        oField._doc = this;

        if (AscCommon.History.IsOn() == true)
            AscCommon.History.TurnOff();

        return oField;
    };

    /**
	 * Changes the interactive field name.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
     * @param {CBaseForm} oField - source field.
     * @param {String} cName - the new field name.
	 * @returns {CBaseForm}
	 */
    CPDFDoc.prototype.private_changeFieldName = function(oField, cName) {
        while (cName.indexOf('..') != -1)
            cName = cName.replace(new RegExp("\.\.", "g"), ".");

        let oExistsWidget = this.GetField(cName);
        // если есть виджет-поле с таким именем то не добавляем 
        if (oExistsWidget && oExistsWidget.type != oField.type)
            return null; // to do выдавать ошибку создания поля

        // получаем partial names
        let aPartNames = cName.split('.').filter(function(item) {
            if (item != "")
                return item;
        })

        // по формату не больше 20 вложенностей
        if (aPartNames.length > 20)
            return null;

        if (!oField._parent)
            return false;

        let oFieldParent = oField._parent;
        // удаляем поле из родителя
        oFieldParent.RemoveKid(oField);

        // создаем родительские поля, последнее будет виджет-полем
        if (aPartNames.length > 1) {
            if (this.rootFields.get(aPartNames[0]) == null) { // root поле
                this.rootFields.set(aPartNames[0], private_createField(aPartNames[0], "", "", []));
            }

            let oParentField = this.rootFields.get(aPartNames[0]);
            
            for (let i = 1; i < aPartNames.length; i++) {
                // добавляем виджет-поле (то, которое рисуем)
                if (i == aPartNames.length - 1) {
                    oParentField.AddKid(oField);
                }
                else {
                    // если есть поле с таким именем (part name), то двигаемся дальше, если нет, то создаем
                    let oExistsField = oParentField.private_getField(aPartNames[i]);
                    if (oExistsField)
                        oParentField = oExistsField;
                    else {
                        oExistsField.AddKid(private_createField(aPartNames[i], "", "", []));
                        oParentField = oExistsField;
                    }
                }
            }
        }

        this.private_checkField(oFieldParent);
        oField.SyncField();
        return oField;
    };

    /**
	 * Changes the interactive field name.
     * Note: This method used by forms actions.
	 * @memberof CPDFDoc
     * @param {CBaseField[]} aForms - array with forms to reset. If param is undefined or array is empty then resets all forms.
	 * @typeofeditors ["PDF"]
	 */
    CPDFDoc.prototype.ResetForms = function(aForms) {
        let oActionsQueue = this.GetActionsQueue();

        if (aForms.length > 0) {
            aForms.forEach(function(field) {
                field.Reset();
            });
        }
        else {
            this.widgets.forEach(function(field) {
                field.Reset();
            });
        }

        oActionsQueue.Continue();
    };
    /**
	 * Hides/shows forms by names
	 * @memberof CPDFDoc
     * @param {boolean} bHidden
     * @param {CBaseField[]} aForms - array with forms to reset. If param is undefined or array is empty then resets all forms.
	 * @typeofeditors ["PDF"]
	 * @returns {CBaseForm}
	 */
    CPDFDoc.prototype.SetHiddenForms = function(bHidden, aForms) {
        let oActionsQueue   = this.GetActionsQueue();

        if (aForms.length > 0) {
            aForms.forEach(function(field) {
                field.SetHidden(bHidden);
                field.AddToRedraw();
            });
        }
        else {
            this.widgets.forEach(function(field) {
                field.SetHidden(bHidden);
                field.AddToRedraw();
            });
        }

        oActionsQueue.Continue();
    };

    /**
	 * Checks the field for the field widget, if not then the field will be removed.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
	 */
    CPDFDoc.prototype.private_checkField = function(oField) {
        if (oField._kids.length == 0) {
            if (oField._parent) {
                oField._parent.RemoveKid(oField);
                this.private_checkField(oField._parent);
            }
            else if (this.rootFields.get(oField.name)) {
                this.rootFields.delete(oField.name);
            }
        }
    };

    /**
	 * Returns array with widjets fields by specified name.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
	 * @returns {boolean}
	 */
    CPDFDoc.prototype.GetFields = function(sName) {
        let aFields = [];
        for (let i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i].api.name == sName)
                aFields.push(this.widgets[i]);
        }

        return aFields;
    };

    /**
	 * Gets API PDF doc.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
	 * @returns {boolean}
	 */
    CPDFDoc.prototype.GetDocumentApi = function(sName) {
        if (this.api)
            return this.api;

        return new AscPDFEditor.ApiDocument(this);
    };

    /**
	 * Сhecks if the field is a widget or not.
     * Checks by full name.
	 * @memberof CPDFDoc
	 * @typeofeditors ["PDF"]
	 * @returns {?CBaseField}
	 */
    CPDFDoc.prototype.GetField = function(sName) {
        let aPartNames = sName.split('.').filter(function(item) {
            if (item != "")
                return item;
        })

        let sPartName = aPartNames[0];
        for (let i = 0; i < aPartNames.length; i++) {
            for (let j = 0; j < this.widgets.length; j++) {
                if (this.widgets[j].api.name == sPartName) // checks by fully name
                    return this.widgets[j];
            }
            sPartName += "." + aPartNames[i + 1];
        }

        return null;
    };

    function CActionQueue(oDoc) {
        this.doc            = oDoc;
        this.actions        = [];
        this.isInProgress   = false;
        this.curAction  = null;
        this.curActionIdx   = -1;
        this.callBackAfterFocus = null;
    };

    CActionQueue.prototype.AddActions = function(aActions) {
        this.actions = this.actions.concat(aActions);
    };
    CActionQueue.prototype.SetCurAction = function(oAction) {
        this.curAction = oAction;
    };
    CActionQueue.prototype.GetNextAction = function() {
        return this.actions[this.curActionIdx + 1];
    };
    CActionQueue.prototype.Clear = function() {
        this.actions = [];
        this.curActionIdx = -1;
        this.curAction = null;
        this.callBackAfterFocus = null;
    };
    CActionQueue.prototype.Stop = function() {
        this.SetInProgress(false);
    };
    CActionQueue.prototype.IsInProgress = function() {
        return this.isInProgress;
    };
    CActionQueue.prototype.SetInProgress = function(bValue) {
        this.isInProgress = bValue;
    };
    CActionQueue.prototype.SetCurActionIdx = function(nValue) {
        this.curActionIdx = nValue;
    };
    CActionQueue.prototype.Start = function() {
        if (this.IsInProgress() == false) {
            let oFirstAction = this.actions[0];
            if (oFirstAction) {
                this.SetInProgress(true);
                this.SetCurActionIdx(0);
                setTimeout(function() {
                    oFirstAction.Do();
                }, 100);
            }
        }
    };
    CActionQueue.prototype.Continue = function() {
        let oNextAction = this.GetNextAction();
        if (this.callBackAfterFocus && this.curAction.triggerType == AscPDFEditor.FORMS_TRIGGERS_TYPES.OnFocus && (!oNextAction || oNextAction.triggerType != AscPDFEditor.FORMS_TRIGGERS_TYPES.OnFocus))
            this.callBackAfterFocus();

        if (oNextAction && this.IsInProgress()) {
            this.curActionIdx += 1;
            oNextAction.Do();
        }
        else {
            this.Stop();
            editor.getDocumentRenderer().onEndFormsActions();
            this.Clear();
        }
    };

    function private_createField(cName, cFieldType, nPageNum, oCoords) {
        let oField;
        switch (cFieldType) {
            case "button":
                oField = new AscPDFEditor.CPushButtonField(cName, nPageNum, oCoords);
                break;
            case "checkbox":
                oField = new AscPDFEditor.CCheckBoxField(cName, nPageNum, oCoords);
                break;
            case "combobox":
                oField = new AscPDFEditor.CComboBoxField(cName, nPageNum, oCoords);
                break;
            case "listbox":
                oField = new AscPDFEditor.CListBoxField(cName, nPageNum, oCoords);
                break;
            case "radiobutton":
                oField = new AscPDFEditor.CRadioButtonField(cName, nPageNum, oCoords);
                break;
            case "signature":
                oField = null;
                break;
            case "text":
                oField = new AscPDFEditor.CTextField(cName, nPageNum, oCoords);
                break;
            case "": 
                oField = new AscPDFEditor.CBaseField(cName, nPageNum, oCoords);
                break;
        }

        return oField;
    }

    if (!window["AscPDFEditor"])
	    window["AscPDFEditor"] = {};

    window["AscPDFEditor"].CPDFDoc = CPDFDoc;
})();
