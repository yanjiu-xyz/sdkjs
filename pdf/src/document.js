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
	 * event properties.
	 * @typedef {Object} oEventPr
	 * @property {string} [change=""] - A string specifying the change in value that the user has just typed. A JavaScript may replace part or all of this string with different characters. The change may take the form of an individual keystroke or a string of characters (for example, if a paste into the field is performed).
	 * @property {boolean} [rc=true] - Used for validation. Indicates whether a particular event in the event chain should succeed. Set to false to prevent a change from occurring or a value from committing. The default is true.
	 * @property {object} [target=undefined] - The target object that triggered the event. In all mouse, focus, blur, calculate, validate, and format events, it is the Field object that triggered the event. In other events, such as page open and close, it is the Doc or this object.
	 * @property {any} value ->
     *  This property has different meanings for different field events:
     *    For the Field/Validate event, it is the value that the field contains when it is committed. For a combo box, it is the face value, not the export value.  
     *    For a Field/Calculate event, JavaScript should set this property. It is the value that the field should take upon completion of the event.    
     *    For a Field/Format event, JavaScript should set this property. It is the value used when generating the appearance for the field. By default, it contains the value that the user has committed. For a combo box, this is the face value, not the export value.   
     *    For a Field/Keystroke event, it is the current value of the field. If modifying a text field, for example, this is the text in the text field before the keystroke is applied.
     *    For Field/Blur and Field/Focus events, it is the current value of the field. During these two events, event.value is read only. That is, the field value cannot be changed by setting event.value.
     * @property {boolean} willCommit -  Verifies the current keystroke event before the data is committed. It can be used to check target form field values to verify, for example, whether character data was entered instead of numeric data. JavaScript sets this property to true after the last keystroke event and before the field is validated.
	 */

    let AscPDFEditor = window["AscPDFEditor"];

    function CCalculateInfo(oDoc) {
        this.calculateFields = [];
        this.document = oDoc;
        this.fieldsToCommit = [];
        this.isInProgress = false;
    };

    CCalculateInfo.prototype.AddToCalculateField = function(oField) {
        if (null == this.calculateFields.find(function(field) {
            return field.GetFullName() == oField.GetFullName();
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
        this.event = {};
    }

    CPDFDoc.prototype.CommitFields = function() {
        this.skipHistoryOnCommit = true;
        this.fieldsToCommit.forEach(function(field) {
            field.Commit();
        });
        
        this.ClearFieldsToCommit();
        this.skipHistoryOnCommit = false;
    };
    CPDFDoc.prototype.IsNeedSkipHistory = function() {
        return !!this.skipHistoryOnCommit;
    };
    CPDFDoc.prototype.AddFieldToCommit = function(oField) {
        this.fieldsToCommit.push(oField);
    };
    CPDFDoc.prototype.ClearFieldsToCommit = function() {
        this.fieldsToCommit = [];
    };
    CPDFDoc.prototype.SelectNextField = function() {
        let oViewer         = editor.getDocumentRenderer();
        let aWidgetForms    = this.widgets;
        let oActionsQueue   = this.GetActionsQueue();
        let isNeedRedraw    = false;

        if (aWidgetForms.length == 0)
            return;

        let nCurIdx = this.widgets.indexOf(oViewer.activeForm);
        let oCurForm = this.widgets[nCurIdx];
        let oNextForm = this.widgets[nCurIdx + 1] || this.widgets[0];

        if (oCurForm && oNextForm) {
            if (oCurForm.IsNeedCommit()) {
                isNeedRedraw = true;

                let isValid = true;
                if (["text", "combobox"].includes(oCurForm.type)) {
                    isValid = oCurForm.DoValidateAction(oCurForm.GetValue());
                }

                if (isValid) {
                    oCurForm.needValidate = false; 
                    oCurForm.Commit();
                    if (this.event["rc"] == true) {
                        this.DoCalculateFields();
                        this.AddFieldToCommit(oCurForm);
                        this.CommitFields();
                    }
                }
                else {
                    oNextForm = null;
                    oCurForm.UndoNotAppliedChanges();
                    if (oCurForm.IsChanged() == false) {
                        oCurForm.SetDrawFromStream(true);
                    }
                }

                oCurForm.SetNeedCommit(false);
            }
            else if (oCurForm.IsChanged() == false) {
                isNeedRedraw = true;
                oCurForm.SetDrawFromStream(true);
            }

            oCurForm.SetDrawHighlight(true);
        }
        
        if (!oNextForm)
            return;

        oViewer.activeForm = oNextForm;
        
        oNextForm.SetDrawHighlight(false);
        
        if (oNextForm.IsNeedDrawFromStream() == true && oNextForm.type != "button") {
            isNeedRedraw = true;
            oNextForm.SetDrawFromStream(false);
            oNextForm.AddToRedraw();
        }
        
        oNextForm.onFocus();

        let callBackAfterFocus = function() {
            switch (oNextForm.type) {
                case "text":
                case "combobox":
                    oViewer.fieldFillingMode = true;
                    oViewer.Api.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
                    oViewer.Api.WordControl.m_oDrawingDocument.m_lCurrentPage = 0;
                    oViewer.Api.WordControl.m_oDrawingDocument.m_lPagesCount = oViewer.file.pages.length;
                    oViewer.Api.WordControl.m_oDrawingDocument.showTarget(true);
                    oViewer.Api.WordControl.m_oDrawingDocument.TargetStart();
                    if (oNextForm.content.IsSelectionUse())
                        oNextForm.content.RemoveSelection();
    
                    oNextForm.content.GetElement(0).MoveCursorToStartPos();
                    oNextForm.content.RecalculateCurPos();
                    
                    break;
                default:
                    oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
                    oViewer.fieldFillingMode = false;
                    break;
            }
        };

        
        if (false == oNextForm.IsInSight())
            this.NavigateToField(oNextForm);
        else {
            // если нужна перерисовка формы и onFocus не запустил действие, тогда перерисовываем
            if (isNeedRedraw && oActionsQueue.IsInProgress() == false) {
                oViewer._paintForms();
                oViewer._paintFormsHighlight();
            }
            // если не нужна перерисовка и не запущено действие, то перерисовываем только highligt
            else if (oActionsQueue.IsInProgress() == false)
                oViewer._paintFormsHighlight();
        }
        
        if (oActionsQueue.IsInProgress() == true)
            oActionsQueue.callBackAfterFocus = callBackAfterFocus;
        else
            callBackAfterFocus();
    };
    CPDFDoc.prototype.SelectPrevField = function() {
        let oViewer         = editor.getDocumentRenderer();
        let aWidgetForms    = this.widgets;
        let oActionsQueue   = this.GetActionsQueue();
        let isNeedRedraw    = false;

        if (aWidgetForms.length == 0)
            return;

        let nCurIdx = this.widgets.indexOf(oViewer.activeForm);
        let oCurForm = this.widgets[nCurIdx];
        let oNextForm = this.widgets[nCurIdx - 1] || this.widgets[this.widgets.length - 1];

        if (oCurForm && oNextForm) {
            if (oCurForm.IsNeedCommit()) {
                isNeedRedraw = true;
                oCurForm.Commit();
            }
            else if (oCurForm.IsChanged() == false) {
                isNeedRedraw = true;
                oCurForm.SetDrawFromStream(true);
            }

            oCurForm.SetDrawHighlight(true);
        }
        
        if (!oNextForm)
            return;
        
        oViewer.activeForm = oNextForm;
        oNextForm.SetDrawHighlight(false);
        
        if (oNextForm.IsNeedDrawFromStream() == true && oNextForm.type != "button") {
            isNeedRedraw = true;
            oNextForm.SetDrawFromStream(false);
            oNextForm.AddToRedraw();
        }
        
        oNextForm.onFocus();

        let callBackAfterFocus = function() {
            switch (oNextForm.type) {
                case "text":
                case "combobox":
                    oViewer.fieldFillingMode = true;
                    oViewer.Api.WordControl.m_oDrawingDocument.UpdateTargetFromPaint = true;
                    oViewer.Api.WordControl.m_oDrawingDocument.m_lCurrentPage = 0;
                    oViewer.Api.WordControl.m_oDrawingDocument.m_lPagesCount = oViewer.file.pages.length;
                    oViewer.Api.WordControl.m_oDrawingDocument.showTarget(true);
                    oViewer.Api.WordControl.m_oDrawingDocument.TargetStart();
                    if (oNextForm.content.IsSelectionUse())
                        oNextForm.content.RemoveSelection();
    
                    oNextForm.content.GetElement(0).MoveCursorToStartPos();
                    oNextForm.content.RecalculateCurPos();
                    
                    break;
                default:
                    oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
                    oViewer.fieldFillingMode = false;
                    break;
            }
        };

        
        if (false == oNextForm.IsInSight())
            this.NavigateToField(oNextForm);
        else {
            // если нужна перерисовка формы и onFocus не запустил действие, тогда перерисовываем
            if (isNeedRedraw && oActionsQueue.IsInProgress() == false) {
                oViewer._paintForms();
                oViewer._paintFormsHighlight();
            }
            // если не нужна перерисовка и не запущено действие, то перерисовываем только highligt
            else if (oActionsQueue.IsInProgress() == false)
                oViewer._paintFormsHighlight();
        }
        
        if (oActionsQueue.IsInProgress() == true)
            oActionsQueue.callBackAfterFocus = callBackAfterFocus;
        else
            callBackAfterFocus();
    };
    CPDFDoc.prototype.NavigateToField = function(oField) {
        let oViewer = editor.getDocumentRenderer();
        let aOrigRect = oField.GetOrigRect();
        let nPage = oField.GetPage();
        
        let nBetweenPages = oViewer.betweenPages / (oViewer.drawingPages[nPage].H / oViewer.file.pages[nPage].H);

        let nPageHpx = (oViewer.drawingPages[nPage].H * AscCommon.AscBrowser.retinaPixelRatio) >> 0;
        let nPageWpx = (oViewer.drawingPages[nPage].W * AscCommon.AscBrowser.retinaPixelRatio) >> 0;

        // находим видимый размер от страницы в исходных размерах 
        let nViewedH = (oViewer.canvas.height / nPageHpx) * oViewer.file.pages[nPage].H;
        let nViewedW = (oViewer.canvas.width / nPageWpx) * oViewer.file.pages[nPage].W;
        
        // выставляем смещение до формы страницу
        let yOffset = aOrigRect[1] + (aOrigRect[3] - aOrigRect[1]) / 2 - nViewedH / 2 + nBetweenPages;
        let xOffset = aOrigRect[0] + (aOrigRect[2] - aOrigRect[0]) / 2 - nViewedW / 2;

        oViewer.navigateToPage(nPage, yOffset > 0 ? yOffset : undefined, xOffset > 0 ? xOffset : undefined);
    };
    CPDFDoc.prototype.EnterDownActiveField = function() {
        let oViewer = editor.getDocumentRenderer();
        let oField = oViewer.activeForm;

        if (["checkbox", "radiobutton"].includes(oField.type)) {
            oField.onMouseUp();
        }
        else {
            oField.SetDrawHighlight(true);
            oField.UpdateScroll && oField.UpdateScroll(false); // убираем скролл

            if (oField.IsNeedCommit()) {
                oViewer.fieldFillingMode = false;

                let isValid = true;
                if (["text", "combobox"].includes(oField.type)) {
                    isValid = oField.DoValidateAction(oField.GetValue());
                }
                if (isValid) {
                    oField.needValidate = false; 
                    oField.Commit();
                    if (this.event["rc"] == true) {
                        this.DoCalculateFields();
                        this.AddFieldToCommit(oField);
                        this.CommitFields();
                    }
                }
                else {
                    oNextForm = null;
                    oField.UndoNotAppliedChanges();
                    if (oField.IsChanged() == false) {
                        oField.SetDrawFromStream(true);
                    }
                }

                oField.SetNeedCommit(false);
                
                oViewer._paintForms();
            }
            else if (oField.GetTrigger(AscPDFEditor.FORMS_TRIGGERS_TYPES.Format) && oField.GetValue() != "") {
                oField.AddToRedraw();
                oViewer._paintForms();
            }
            
            oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd(); // убираем курсор
        }

        oViewer._paintFormsHighlight();
    };
    CPDFDoc.prototype.OnExitFieldByClick = function(bSkipRedraw) {
        let oViewer         = editor.getDocumentRenderer();
        let oActiveForm     = oViewer.activeForm;
        let oActionsQueue   = this.GetActionsQueue();

        oActiveForm.UpdateScroll && oActiveForm.UpdateScroll(false); // убираем скрол
        oActiveForm.SetDrawHighlight(true);

        // если чекбокс то выходим сразу
        if (["checkbox", "radiobutton"].includes(oActiveForm.type)) {
            oActiveForm.Blur();
            
            if (oActionsQueue.IsInProgress() == false)
                oViewer._paintFormsHighlight();

            return;
        }
        
        if (oActiveForm.IsNeedCommit()) {
            let isValid = true;
            if (["text", "combobox"].includes(oActiveForm.type)) {
                isValid = oActiveForm.DoValidateAction(oActiveForm.GetValue());
            }

            if (isValid) {
                oActiveForm.needValidate = false; 
                oActiveForm.Commit();
                if (this.event["rc"] == true) {
                    this.DoCalculateFields();
                    this.AddFieldToCommit(oActiveForm);
                    this.CommitFields();
                }
            }
            else {
                oNextForm = null;
                oActiveForm.UndoNotAppliedChanges();
                if (oActiveForm.IsChanged() == false) {
                    oActiveForm.SetDrawFromStream(true);
                }
            }

            oActiveForm.SetNeedCommit(false);
        }
        else {
            if (oActiveForm.IsChanged() == false) {
                oActiveForm.SetDrawFromStream(true);
    
                if (oActiveForm.IsNeedRevertShiftView()) {
                    oActiveForm.RevertContentViewToOriginal();
                    oActiveForm.AddToRedraw();
                }
            }

            if (oActiveForm.IsNeedRevertShiftView()) {
                oActiveForm.RevertContentViewToOriginal();
            }
            
            if (oActiveForm.curContent === oActiveForm.contentFormat) {
                oActiveForm.AddToRedraw();
            }
        }
        
        oActiveForm.Blur();
        oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
        if (oActionsQueue.IsInProgress() == false) {
            oViewer._paintForms();
            oViewer._paintFormsHighlight();
        }

        if (oActiveForm && oActiveForm.content && oActiveForm.content.IsSelectionEmpty()) {
            oActiveForm.content.RemoveSelection();
            oViewer.onUpdateOverlay();
        }
    };
    CPDFDoc.prototype.OnMouseDownField = function(oField, event) {
        let oViewer         = editor.getDocumentRenderer();
        let oActionsQueue   = this.GetActionsQueue();

        switch (oField.type)
        {
            case "text":
            case "combobox":
                oField.SetDrawHighlight(false);
                oViewer._paintFormsHighlight();
                oField.onMouseDown(AscCommon.global_mouseEvent.X, AscCommon.global_mouseEvent.Y, event);
                    
                oViewer.onUpdateOverlay();
                if (oField._editable != false)
                    oViewer.fieldFillingMode = true;
                break;
            case "listbox":
                oField.SetDrawHighlight(false);
                oViewer._paintFormsHighlight();
                oField.onMouseDown(AscCommon.global_mouseEvent.X, AscCommon.global_mouseEvent.Y, event);
                
                oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
                oViewer.onUpdateOverlay();
                break;
            case "button":
            case "radiobutton":
            case "checkbox":
                oField.onMouseDown(event);
                break;
        }

        if (oActionsQueue.IsInProgress() == false && oViewer.pagesInfo.pages[oField.GetPage()].needRedrawForms)
            oViewer._paintForms();
    };
    CPDFDoc.prototype.OnMouseUpField = function(oField, event) {
        let oViewer         = editor.getDocumentRenderer();
        let oActionsQueue   = this.GetActionsQueue();

        if (global_mouseEvent.ClickCount == 2 && (oField.type == "text" || oField.type == "combobox"))
        {
            oField.content.SelectAll();
            if (oField.content.IsSelectionEmpty() == false)
                oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
            else
                oField.content.RemoveSelection();

            oViewer.onUpdateOverlay();
        }
        else if (!oViewer.isMouseMoveBetweenDownUp && oField.content && oField.content.IsSelectionUse())
        {
            oField.content.RemoveSelection();
            oViewer.onUpdateOverlay();
        }

        switch (oField.type)
        {
            case "checkbox":
            case "radiobutton":
                oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd();
                if (oMouseUpField == oField) {
                    oField.onMouseUp();

                    if (oField.IsNeedCommit()) {
                        let oDoc = oField.GetDocument();
                        oDoc.DoCalculateFields();
                        oDoc.AddFieldToCommit(oField);
                        oDoc.CommitFields();
                        
                        oViewer._paintForms();
                    }
                }
                cursorType = "pointer";
                oViewer.fieldFillingMode = false;
                break;
            default:
                oField.onMouseUp();
                break;
        }

        if (oActionsQueue.IsInProgress() == false && oViewer.pagesInfo.pages[oField.GetPage()].needRedrawForms)
            oViewer._paintForms();
    };
    CPDFDoc.prototype.DoUndo = function() {
        let oViewer = editor.getDocumentRenderer();

        if (AscCommon.History.Can_Undo())
        {
            let oCurPoint = AscCommon.History.Points[AscCommon.History.Index];
            let nCurPoindIdx = AscCommon.History.Index;

            oViewer.isOnUndoRedo = true;
            
            AscCommon.History.Undo();
            let oParentForm = oCurPoint.Additional.FormFilling;
            if (oParentForm) {
                // если форма активна, то изменения (undo) применяются только для неё
                // иначе для всех с таким именем (для checkbox и radiobutton всегда применяем для всех)
                // так же применяем для всех, если добрались до точки, общей для всех форм, а не примененнёые изменения удаляем (для всех кроме checkbox и radiobutton)
                if ((oViewer.activeForm == null || oCurPoint.Additional && oCurPoint.Additional.CanUnion === false || nCurPoindIdx == 0) || 
                    (oParentForm.type == "checkbox" || oParentForm.type == "radiobutton")) {
                        oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd(); // убираем курсор
                        
                        if (oParentForm.type == "listbox") {
                            oParentForm.Commit(null);
                        }
                        // для радиокнопок храним все изменения, т.к. значения не идентичны для каждой формы из группы
                        // восстанавлием все состояния из истории полностью, поэтому значение формы не нужно применять.
                        else if ("radiobutton" != oParentForm.type)
                            oParentForm.Commit();

                        // вызываем calculate actions
                        let oDoc = oParentForm.GetDocument();
                        oDoc.DoCalculateFields();
                        oDoc.CommitFields();

                        // выход из формы
                        if (oViewer.activeForm)
                        {
                            oViewer.activeForm.SetDrawHighlight(true);
                            oViewer._paintFormsHighlight();
                            oViewer.activeForm = null;
                        }
                }

                oParentForm.SetNeedRecalc(true);
                oParentForm.AddToRedraw();

                // Перерисуем страницу, на которой произошли изменения
                oViewer._paintForms();
            }
            
            oViewer.isOnUndoRedo = false;
        }
    };
    CPDFDoc.prototype.DoRedo = function() {
        let oViewer = editor.getDocumentRenderer();

        if (AscCommon.History.Can_Redo())
        {
            oViewer.isOnUndoRedo = true;

            AscCommon.History.Redo();
            let nCurPoindIdx = AscCommon.History.Index;
            let oCurPoint = AscCommon.History.Points[nCurPoindIdx];

            let oParentForm = oCurPoint.Additional.FormFilling;
            if (oParentForm) {
                // если мы в форме, то изменения (undo) применяются только для неё
                // иначе для всех с таким именем
                if (oViewer.activeForm == null || oCurPoint.Additional && oCurPoint.Additional.CanUnion === false) {
                    oViewer.Api.WordControl.m_oDrawingDocument.TargetEnd(); // убираем курсор
                        
                    if (oParentForm.type == "listbox") {
                        oParentForm.Commit(null);
                    }
                    // для радиокнопок храним все изменения, т.к. значения не идентичны для каждой формы из группы
                    // восстанавлием все состояния из истории полностью, поэтому значение формы не нужно применять.
                    else if ("radiobutton" != oParentForm.type)
                        oParentForm.Commit();

                    // вызываем calculate actions
                    let oDoc = oParentForm.GetDocument();
                    oDoc.DoCalculateFields();
                    oDoc.CommitFields();

                    // выход из формы
                    if (oViewer.activeForm)
                    {
                        oViewer.activeForm.SetDrawHighlight(true);
                        oViewer._paintFormsHighlight();
                        oViewer.activeForm = null;
                    }
                }

                oParentForm.SetNeedRecalc(true);
                oParentForm.AddToRedraw()
                
                // Перерисуем страницу, на которой произошли изменения
                oViewer._paintForms();
            }

            oViewer.isOnUndoRedo = false;
        }
    };
    CPDFDoc.prototype.SetEvent = function(oEventPr) {
        if (oEventPr["target"] != null && oEventPr["target"] != this.event["target"])
            this.event["target"] = oEventPr["target"];

        if (oEventPr["rc"] != null)
            this.event["rc"] = oEventPr["rc"];
        else
            this.event["rc"] = true;

        if (oEventPr["change"] != null && oEventPr["change"] != this.event["change"])
            this.event["change"] = oEventPr["change"];
            
        if (oEventPr["value"] != null && oEventPr["value"] != this.event["value"])
            this.event["value"] = oEventPr["value"];

        if (oEventPr["willCommit"] != null)
            this.event["willCommit"] = oEventPr["willCommit"];
    };
    CPDFDoc.prototype.SetWarningInfo = function(oInfo) {
        this.warningInfo = oInfo;
    };
    CPDFDoc.prototype.GetWarningInfo = function() {
        return this.warningInfo;
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
            if (this.widgets[i].GetFullName() == sName)
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
                if (this.widgets[j].GetFullName() == sPartName) // checks by fully name
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
