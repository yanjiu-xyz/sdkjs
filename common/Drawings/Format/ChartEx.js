"use strict";

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
    function(window, undefined) {

    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    var drawingContentChanges = window['AscDFH'].drawingContentChanges;

    var CChangesDrawingsBool = AscDFH.CChangesDrawingsBool;
    var CChangesDrawingsLong = AscDFH.CChangesDrawingsLong;
    var CChangesDrawingsString = AscDFH.CChangesDrawingsString;
    var CChangesDrawingsContent = AscDFH.CChangesDrawingsContent;
    var CChangesDrawingsObject = AscDFH.CChangesDrawingsObject;
    var CChangesDrawingsObjectNoId = AscDFH.CChangesDrawingsObjectNoId;
    var CChangesDrawingsDouble2 = AscDFH.CChangesDrawingsDouble2;

    // CAddress
    drawingsChangesMap[AscDFH.historyitem_Address_SetAddress1] = function(oClass, value) {
        oClass.address1 = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetCountryRegion] = function(oClass, value) {
        oClass.countryRegion = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetAdminDistrict1] = function(oClass, value) {
        oClass.adminDistrict1 = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetAdminDistrict2] = function(oClass, value) {
        oClass.adminDistrict2 = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetPostalCode] = function(oClass, value) {
        oClass.postalCode = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetLocality] = function(oClass, value) {
        oClass.locality = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Address_SetISOCountryCode] = function(oClass, value) {
        oClass.isoCountryCode = value;
    };

    // CAddress
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetAddress1] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetCountryRegion] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetAdminDistrict1] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetAdminDistrict2] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetPostalCode] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetLocality] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetISOCountryCode] = window['AscDFH'].CChangesDrawingsString;

// Import
    const History = AscCommon.History;
    var InitClass = AscFormat.InitClass;
    var CBaseChartObject = AscFormat.CBaseChartObject;
    
    function CAddress() {
        CBaseChartObject.call(this);
        this.address1 = null;
        this.countryRegion = null;
        this.adminDistrict1 = null;
        this.adminDistrict2 = null;
        this.postalCode = null;
        this.locality = null;
        this.isoCountryCode = null;
    }

    InitClass(CAddress, CBaseChartObject, AscDFH.historyitem_type_Address);

    CAddress.prototype.setAddress1 = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetAddress1, this.address1, pr));
        this.address1 = pr;
    };
    CAddress.prototype.setCountryRegion = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetCountryRegion, this.countryRegion, pr));
        this.countryRegion = pr;
    };
    CAddress.prototype.setAdminDistrict1 = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetAdminDistrict1, this.adminDistrict1, pr));
        this.adminDistrict1 = pr;
    };
    CAddress.prototype.setAdminDistrict2 = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetAdminDistrict2, this.adminDistrict2, pr));
        this.adminDistrict2 = pr;
    };
    CAddress.prototype.setPostalCode = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetPostalCode, this.postalCode, pr));
        this.postalCode = pr;
    };
    CAddress.prototype.setLocality = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetLocality, this.locality, pr));
        this.locality = pr;
    };
    CAddress.prototype.setISOCountryCode = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetISOCountryCode, this.isoCountryCode, pr));
        this.isoCountryCode = pr;
    };

    // Axis
    drawingsChangesMap[AscDFH.historyitem_Axis_SetCatScaling] = function(oClass, value) {
        oClass.catScaling = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetValScaling] = function(oClass, value) {
        oClass.valScaling = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetTitle] = function(oClass, value) {
        oClass.title = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetUnits] = function(oClass, value) {
        oClass.units = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetMajorGridlines] = function(oClass, value) {
        oClass.majorGridlines = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetMinorGridlines] = function(oClass, value) {
        oClass.minorGridlines = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetMajorTickMarks] = function(oClass, value) {
        oClass.majorTickMarks = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetMinorTickMarks] = function(oClass, value) {
        oClass.minorTickMarks = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetTickLabels] = function(oClass, value) {
        oClass.tickLabels = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetNumFmt] = function(oClass, value) {
        oClass.numFmt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetId] = function(oClass, value) {
        oClass.id = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Axis_SetHidden] = function(oClass, value) {
        oClass.hidden = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetCatScaling] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetValScaling] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTitle] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetUnits] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMajorGridlines] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMinorGridlines] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMajorTickMarks] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMinorTickMarks] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTickLabels] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetNumFmt] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetSpPr] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTxPr] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetExtLst] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetId] = window['AscDFH'].CChangesDrawingsLong;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetHidden] = window['AscDFH'].CChangesDrawingsBool;

    function CAxis() {
        CBaseChartObject.call(this);
        this.catScaling = null;
        this.valScaling = null;
        this.title = null;
        this.units = null;
        this.majorGridlines = null;
        this.minorGridlines = null;
        this.majorTickMarks = null;
        this.minorTickMarks = null;
        this.tickLabels = null;
        this.numFmt = null;
        this.spPr = null;
        this.txPr = null;
        this.extLst = null;
        this.id = null;
        this.hidden = null;
    }

    InitClass(CAxis, CBaseChartObject, AscDFH.historyitem_type_Axis);

    CAxis.prototype.setCatScaling = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetCatScaling, this.catScaling, pr));
        this.catScaling = pr;
    };
    CAxis.prototype.setValScaling = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetValScaling, this.valScaling, pr));
        this.valScaling = pr;
    };
    CAxis.prototype.setTitle = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetTitle, this.title, pr));
        this.title = pr;
    };
    CAxis.prototype.setUnits = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetUnits, this.units, pr));
        this.units = pr;
    };
    CAxis.prototype.setMajorGridlines = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
    };
    CAxis.prototype.setMinorGridlines = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetMinorGridlines, this.minorGridlines, pr));
        this.minorGridlines = pr;
    };
    CAxis.prototype.setMajorTickMarks = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetMajorTickMarks, this.majorTickMarks, pr));
        this.majorTickMarks = pr;
    };
    CAxis.prototype.setMinorTickMarks = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetMinorTickMarks, this.minorTickMarks, pr));
        this.minorTickMarks = pr;
    };
    CAxis.prototype.setTickLabels = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Axis_SetTickLabels, this.tickLabels, pr));
        this.tickLabels = pr;
    };
    CAxis.prototype.setNumFmt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    };
    CAxis.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CAxis.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CAxis.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Axis_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CAxis.prototype.setId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Axis_SetId, this.id, pr));
        this.id = pr;
    };
    CAxis.prototype.setHidden = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Axis_SetHidden, this.hidden, pr));
        this.hidden = pr;
    };
    window['AscFormat'].CAxis = CAxis;

    // Title
    drawingsChangesMap[AscDFH.historyitem_Title_SetTx] = function(oClass, value) {
        oClass.tx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetPos] = function(oClass, value) {
        oClass.pos = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetAlign] = function(oClass, value) {
        oClass.align = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Title_SetOverlay] = function(oClass, value) {
        oClass.overlay = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetTx] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetSpPr] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetTxPr] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetExtLst] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetPos] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetAlign] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_Title_SetOverlay] = window['AscDFH'].CChangesDrawingsBool;
    function CTitle() {
        CBaseChartObject.call(this);
        this.tx = null;
        this.spPr = null;
        this.txPr = null;
        this.extLst = null;

        //for chart title only (but not axis title)
        this.pos = null;
        this.align = null;
        this.overlay = null;
    }

    InitClass(CTitle, CBaseChartObject, AscDFH.historyitem_type_Title);

    CTitle.prototype.setTx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetTx, this.tx, pr));
        this.tx = pr;
    };
    CTitle.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CTitle.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CTitle.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CTitle.prototype.setPos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetPos, this.pos, pr));
        this.pos = pr;
    };
    CTitle.prototype.setAlign = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_Title_SetAlign, this.align, pr));
        this.align = pr;
    };
    CTitle.prototype.setOverlay = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_Title_SetOverlay, this.overlay, pr));
        this.overlay = pr;
    };
    window['AscFormat'].CTitle = CTitle;

    // // AxisTitle (CTitle instead of CAxisTitle)
    // drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetTx] = function(oClass, value) {
    //     oClass.tx = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetSpPr] = function(oClass, value) {
    //     oClass.spPr = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetTxPr] = function(oClass, value) {
    //     oClass.txPr = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetExtLst] = function(oClass, value) {
    //     oClass.extLst = value;
    // };
    // AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetTx] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    // function CAxisTitle() {
    //     CBaseChartObject.call(this);
    //     this.tx = null;
    //     this.spPr = null;
    //     this.txPr = null;
    //     this.extLst = null;
    // }

    // InitClass(CAxisTitle, CBaseChartObject, AscDFH.historyitem_type_AxisTitle);

    // CAxisTitle.prototype.setTx = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisTitle_SetTx, this.tx, pr));
    //     this.tx = pr;
    // };
    // CAxisTitle.prototype.setSpPr = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisTitle_SetSpPr, this.spPr, pr));
    //     this.spPr = pr;
    // };
    // CAxisTitle.prototype.setTxPr = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisTitle_SetTxPr, this.txPr, pr));
    //     this.txPr = pr;
    // };
    // CAxisTitle.prototype.setExtLst = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisTitle_SetExtLst, this.extLst, pr));
    //     this.extLst = pr;
    // };
    // window['AscFormat'].CAxisTitle = CAxisTitle;

    // AxisUnits
    drawingsChangesMap[AscDFH.historyitem_AxisUnits_SetUnitsLabel] = function(oClass, value) {
        oClass.unitsLabel = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnits_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnits_SetUnit] = function(oClass, value) {
        oClass.unit = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnits_SetUnitsLabel] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnits_SetExtLst] = window['AscDFH'].CChangesDrawingsObjectNoId;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnits_SetUnit] = window['AscDFH'].CChangesDrawingsObjectNoId;
    function AxisUnits() {
        CBaseChartObject.call(this);
        this.unitsLabel = null;
        this.extLst = null;
        this.unit = null;
    }

    InitClass(AxisUnits, CBaseChartObject, AscDFH.historyitem_type_AxisUnits);

    CAxisUnits.prototype.setUnitsLabel = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnits_SetUnitsLabel, this.unitsLabel, pr));
        this.unitsLabel = pr;
    };
    CAxisUnits.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnits_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CAxisUnits.prototype.setUnit = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnits_SetUnit, this.unit, pr));
        this.unit = pr;
    };
    window['AscFormat'].CAxisUnits = CAxisUnits;

    // AxisUnitsLabel
    drawingsChangesMap[AscDFH.historyitem_AxisUnitsLabel_SetTx] = function(oClass, value) {
        oClass.tx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnitsLabel_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnitsLabel_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnitsLabel_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnitsLabel_SetTx] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnitsLabel_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnitsLabel_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnitsLabel_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CAxisUnitsLabel() {
        CBaseChartObject.call(this);
        this.tx = null;
        this.spPr = null;
        this.txPr = null;
        this.extLst = null;
    }

    InitClass(CAxisUnitsLabel, CBaseChartObject, AscDFH.historyitem_type_AxisUnitsLabel);

    CAxisUnitsLabel.prototype.setTx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnitsLabel_SetTx, this.tx, pr));
        this.tx = pr;
    };
    CAxisUnitsLabel.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnitsLabel_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CAxisUnitsLabel.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnitsLabel_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CAxisUnitsLabel.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObjectNoId(this, AscDFH.historyitem_AxisUnitsLabel_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CAxisUnitsLabel = CAxisUnitsLabel;

    // Binning
    drawingsChangesMap[AscDFH.historyitem_Binning_SetBinSize] = function(oClass, value) {
        oClass.binSize = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Binning_SetBinCount] = function(oClass, value) {
        oClass.binCount = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Binning_SetIntervalClosed] = function(oClass, value) {
        oClass.intervalClosed = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Binning_SetUnderflow] = function(oClass, value) {
        oClass.underflow = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Binning_SetOverflow] = function(oClass, value) {
        oClass.overflow = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetBinSize] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetBinCount] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetIntervalClosed] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetUnderflow] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetOverflow] = window['AscDFH'].CChangesDrawingsString;
    function CBinning() {
        CBaseChartObject.call(this);
        this.binSize = null;
        this.binCount = null;
        this.intervalClosed = null;
        this.underflow = null;
        this.overflow = null;
    }

    InitClass(CBinning, CBaseChartObject, AscDFH.historyitem_type_Binning);

    CBinning.prototype.setBinSize = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsDouble2(this, AscDFH.historyitem_Binning_SetBinSize, this.binSize, pr));
        this.binSize = pr;
    };
    CBinning.prototype.setBinCount = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_Binning_SetBinCount, this.binCount, pr));
        this.binCount = pr;
    };
    CBinning.prototype.setIntervalClosed = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Binning_SetIntervalClosed, this.intervalClosed, pr));
        this.intervalClosed = pr;
    };
    CBinning.prototype.setUnderflow = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Binning_SetUnderflow, this.underflow, pr));
        this.underflow = pr;
    };
    CBinning.prototype.setOverflow = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Binning_SetOverflow, this.overflow, pr));
        this.overflow = pr;
    };
    window['AscFormat'].CBinning = CBinning;

    // CategoryAxisScaling
    drawingsChangesMap[AscDFH.historyitem_CategoryAxisScaling_SetGapWidth] = function(oClass, value) {
        oClass.gapWidth = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_CategoryAxisScaling_SetGapWidth] = window['AscDFH'].CChangesDrawingsString;
    function CCategoryAxisScaling() {
        CBaseChartObject.call(this);
        this.gapWidth = null;
    }

    InitClass(CCategoryAxisScaling, CBaseChartObject, AscDFH.historyitem_type_CategoryAxisScaling);

    CCategoryAxisScaling.prototype.setGapWidth = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_CategoryAxisScaling_SetGapWidth, this.gapWidth, pr));
        this.gapWidth = pr;
    };
    window['AscFormat'].CCategoryAxisScaling = CCategoryAxisScaling;

    // Chart
    drawingsChangesMap[AscDFH.historyitem_Chart_SetTitle] = function(oClass, value) {
        oClass.title = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Chart_SetPlotArea] = function(oClass, value) {
        oClass.plotArea = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Chart_SetLegend] = function(oClass, value) {
        oClass.legend = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Chart_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetTitle] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetPlotArea] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetLegend] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Chart_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CChart() {
        CBaseChartObject.call(this);
        this.title = null;
        this.plotArea = null;
        this.legend = null;
        this.extLst = null;
    }

    InitClass(CChart, CBaseChartObject, AscDFH.historyitem_type_Chart);

    CChart.prototype.setTitle = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Chart_SetTitle, this.title, pr));
        this.title = pr;
    };
    CChart.prototype.setPlotArea = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Chart_SetPlotArea, this.plotArea, pr));
        this.plotArea = pr;
    };
    CChart.prototype.setLegend = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Chart_SetLegend, this.legend, pr));
        this.legend = pr;
    };
    CChart.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Chart_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CChart = CChart;

    // ChartData
    drawingsChangesMap[AscDFH.historyitem_ChartData_SetExternalData] = function(oClass, value) {
        oClass.externalData = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartData_SetData] = function(oClass, value) {
        oClass.data = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartData_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ChartData_SetExternalData] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartData_SetData] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartData_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CChartData() {
        CBaseChartObject.call(this);
        this.externalData = null;
        this.data = null;
        this.extLst = null;
    }

    InitClass(CChartData, CBaseChartObject, AscDFH.historyitem_type_ChartData);

    CChartData.prototype.setExternalData = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartData_SetExternalData, this.externalData, pr));
        this.externalData = pr;
    };
    CChartData.prototype.setData = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartData_SetData, this.data, pr));
        this.data = pr;
    };
    CChartData.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartData_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CChartData = CChartData;

    // ChartSpace
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetChartData] = function(oClass, value) {
        oClass.chartData = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetChart] = function(oClass, value) {
        oClass.chart = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetClrMapOvr] = function(oClass, value) {
        oClass.clrMapOvr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetFmtOvrs] = function(oClass, value) {
        oClass.fmtOvrs = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetPrintSettings] = function(oClass, value) {
        oClass.printSettings = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ChartSpace_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetChartData] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetChart] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetClrMapOvr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetFmtOvrs] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetPrintSettings] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ChartSpace_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CChartSpace() {
        CBaseChartObject.call(this);
        this.chartData = null;
        this.chart = null;
        this.spPr = null;
        this.txPr = null;
        this.clrMapOvr = null;
        this.fmtOvrs = null;
        this.printSettings = null;
        this.extLst = null;
    }

    InitClass(CChartSpace, CBaseChartObject, AscDFH.historyitem_type_ChartSpace);

    CChartSpace.prototype.setChartData = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetChartData, this.chartData, pr));
        this.chartData = pr;
    };
    CChartSpace.prototype.setChart = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetChart, this.chart, pr));
        this.chart = pr;
    };
    CChartSpace.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CChartSpace.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CChartSpace.prototype.setClrMapOvr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetClrMapOvr, this.clrMapOvr, pr));
        this.clrMapOvr = pr;
    };
    CChartSpace.prototype.setFmtOvrs = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetFmtOvrs, this.fmtOvrs, pr));
        this.fmtOvrs = pr;
    };
    CChartSpace.prototype.setPrintSettings = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetPrintSettings, this.printSettings, pr));
        this.printSettings = pr;
    };
    CChartSpace.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartSpace_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CChartSpace = CChartSpace;

    // // ChartTitle (CTitle instead of CChartTitle)
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetTx] = function(oClass, value) {
    //     oClass.tx = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetSpPr] = function(oClass, value) {
    //     oClass.spPr = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetTxPr] = function(oClass, value) {
    //     oClass.txPr = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetExtLst] = function(oClass, value) {
    //     oClass.extLst = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetPos] = function(oClass, value) {
    //     oClass.pos = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetAlign] = function(oClass, value) {
    //     oClass.align = value;
    // };
    // drawingsChangesMap[AscDFH.historyitem_ChartTitle_SetOverlay] = function(oClass, value) {
    //     oClass.overlay = value;
    // };
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetTx] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetPos] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetAlign] = window['AscDFH'].CChangesDrawingsString;
    // AscDFH.changesFactory[AscDFH.historyitem_ChartTitle_SetOverlay] = window['AscDFH'].CChangesDrawingsString;
    // function CChartTitle() {
    //     CBaseChartObject.call(this);
    //     this.tx = null;
    //     this.spPr = null;
    //     this.txPr = null;
    //     this.extLst = null;
    //     this.pos = null;
    //     this.align = null;
    //     this.overlay = null;
    // }

    // InitClass(CChartTitle, CBaseChartObject, AscDFH.historyitem_type_ChartTitle);

    // CChartTitle.prototype.setTx = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetTx, this.tx, pr));
    //     this.tx = pr;
    // };
    // CChartTitle.prototype.setSpPr = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetSpPr, this.spPr, pr));
    //     this.spPr = pr;
    // };
    // CChartTitle.prototype.setTxPr = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetTxPr, this.txPr, pr));
    //     this.txPr = pr;
    // };
    // CChartTitle.prototype.setExtLst = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetExtLst, this.extLst, pr));
    //     this.extLst = pr;
    // };
    // CChartTitle.prototype.setPos = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetPos, this.pos, pr));
    //     this.pos = pr;
    // };
    // CChartTitle.prototype.setAlign = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetAlign, this.align, pr));
    //     this.align = pr;
    // };
    // CChartTitle.prototype.setOverlay = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ChartTitle_SetOverlay, this.overlay, pr));
    //     this.overlay = pr;
    // };
    // window['AscFormat'].CChartTitle = CChartTitle;

    // Clear
    drawingsChangesMap[AscDFH.historyitem_Clear_SetGeoLocationQueryResults] = function(oClass, value) {
        oClass.geoLocationQueryResults = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Clear_SetGeoDataEntityQueryResults] = function(oClass, value) {
        oClass.geoDataEntityQueryResults = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Clear_SetGeoDataPointToEntityQueryResults] = function(oClass, value) {
        oClass.geoDataPointToEntityQueryResults = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Clear_SetGeoChildEntitiesQueryResults] = function(oClass, value) {
        oClass.geoChildEntitiesQueryResults = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Clear_SetGeoLocationQueryResults] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Clear_SetGeoDataEntityQueryResults] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Clear_SetGeoDataPointToEntityQueryResults] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Clear_SetGeoChildEntitiesQueryResults] = window['AscDFH'].CChangesDrawingsString;
    function CClear() {
        CBaseChartObject.call(this);
        this.geoLocationQueryResults = null;
        this.geoDataEntityQueryResults = null;
        this.geoDataPointToEntityQueryResults = null;
        this.geoChildEntitiesQueryResults = null;
    }

    InitClass(CClear, CBaseChartObject, AscDFH.historyitem_type_Clear);

    CClear.prototype.setGeoLocationQueryResults = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Clear_SetGeoLocationQueryResults, this.geoLocationQueryResults, pr));
        this.geoLocationQueryResults = pr;
    };
    CClear.prototype.setGeoDataEntityQueryResults = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Clear_SetGeoDataEntityQueryResults, this.geoDataEntityQueryResults, pr));
        this.geoDataEntityQueryResults = pr;
    };
    CClear.prototype.setGeoDataPointToEntityQueryResults = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Clear_SetGeoDataPointToEntityQueryResults, this.geoDataPointToEntityQueryResults, pr));
        this.geoDataPointToEntityQueryResults = pr;
    };
    CClear.prototype.setGeoChildEntitiesQueryResults = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Clear_SetGeoChildEntitiesQueryResults, this.geoChildEntitiesQueryResults, pr));
        this.geoChildEntitiesQueryResults = pr;
    };
    window['AscFormat'].CClear = CClear;

    // Copyrights
    drawingsChangesMap[AscDFH.historyitem_Copyrights_SetCopyright] = function(oClass, value) {
        oClass.copyright = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Copyrights_SetCopyright] = window['AscDFH'].CChangesDrawingsString;
    function CCopyrights() {
        CBaseChartObject.call(this);
        this.copyright = null;
    }

    InitClass(CCopyrights, CBaseChartObject, AscDFH.historyitem_type_Copyrights);

    CCopyrights.prototype.setCopyright = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Copyrights_SetCopyright, this.copyright, pr));
        this.copyright = pr;
    };
    window['AscFormat'].CCopyrights = CCopyrights;

    // Data
    drawingsChangesMap[AscDFH.historyitem_Data_SetNumDim] = function(oClass, value) {
        oClass.numDim = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Data_SetStrDim] = function(oClass, value) {
        oClass.strDim = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Data_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Data_SetId] = function(oClass, value) {
        oClass.id = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Data_SetNumDim] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Data_SetStrDim] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Data_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Data_SetId] = window['AscDFH'].CChangesDrawingsString;
    function CData() {
        CBaseChartObject.call(this);
        this.numDim = null;
        this.strDim = null;
        this.extLst = null;
        this.id = null;
    }

    InitClass(CData, CBaseChartObject, AscDFH.historyitem_type_Data);

    CData.prototype.setNumDim = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Data_SetNumDim, this.numDim, pr));
        this.numDim = pr;
    };
    CData.prototype.setStrDim = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Data_SetStrDim, this.strDim, pr));
        this.strDim = pr;
    };
    CData.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Data_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CData.prototype.setId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Data_SetId, this.id, pr));
        this.id = pr;
    };
    window['AscFormat'].CData = CData;

    // DataId
    drawingsChangesMap[AscDFH.historyitem_DataId_SetVal] = function(oClass, value) {
        oClass.val = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataId_SetVal] = window['AscDFH'].CChangesDrawingsString;
    function CDataId() {
        CBaseChartObject.call(this);
        this.val = null;
    }

    InitClass(CDataId, CBaseChartObject, AscDFH.historyitem_type_DataId);

    CDataId.prototype.setVal = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataId_SetVal, this.val, pr));
        this.val = pr;
    };
    window['AscFormat'].CDataId = CDataId;

    // DataLabel
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetNumFmt] = function(oClass, value) {
        oClass.numFmt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetVisibility] = function(oClass, value) {
        oClass.visibility = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetSeparator] = function(oClass, value) {
        oClass.separator = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabel_SetPos] = function(oClass, value) {
        oClass.pos = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataLabel_SetNumFmt] = window['AscDFH'].CChangesDrawingsString;
    function CDataLabel() {
        CBaseChartObject.call(this);
        this.numFmt = null;
        this.spPr = null;
        this.txPr = null;
        this.visibility = null;
        this.separator = null;
        this.extLst = null;
        this.idx = null;
        this.pos = null;
    }

    InitClass(CDataLabel, CBaseChartObject, AscDFH.historyitem_type_DataLabel);

    CDataLabel.prototype.setNumFmt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    };
    CDataLabel.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CDataLabel.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CDataLabel.prototype.setVisibility = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetVisibility, this.visibility, pr));
        this.visibility = pr;
    };
    CDataLabel.prototype.setSeparator = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetSeparator, this.separator, pr));
        this.separator = pr;
    };
    CDataLabel.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CDataLabel.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    CDataLabel.prototype.setPos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabel_SetPos, this.pos, pr));
        this.pos = pr;
    };
    window['AscFormat'].CDataLabel = CDataLabel;

    // DataLabelHidden
    drawingsChangesMap[AscDFH.historyitem_DataLabelHidden_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataLabelHidden_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CDataLabelHidden() {
        CBaseChartObject.call(this);
        this.idx = null;
    }

    InitClass(CDataLabelHidden, CBaseChartObject, AscDFH.historyitem_type_DataLabelHidden);

    CDataLabelHidden.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabelHidden_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CDataLabelHidden = CDataLabelHidden;

    // DataLabels
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetNumFmt] = function(oClass, value) {
        oClass.numFmt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetVisibility] = function(oClass, value) {
        oClass.visibility = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetSeparator] = function(oClass, value) {
        oClass.separator = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetDataLabel] = function(oClass, value) {
        oClass.dataLabel = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetDataLabelHidden] = function(oClass, value) {
        oClass.dataLabelHidden = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabels_SetPos] = function(oClass, value) {
        oClass.pos = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetNumFmt] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetVisibility] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetSeparator] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetDataLabel] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetDataLabelHidden] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabels_SetPos] = window['AscDFH'].CChangesDrawingsString;
    function CDataLabels() {
        CBaseChartObject.call(this);
        this.numFmt = null;
        this.spPr = null;
        this.txPr = null;
        this.visibility = null;
        this.separator = null;
        this.dataLabel = null;
        this.dataLabelHidden = null;
        this.extLst = null;
        this.pos = null;
    }

    InitClass(CDataLabels, CBaseChartObject, AscDFH.historyitem_type_DataLabels);

    CDataLabels.prototype.setNumFmt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    };
    CDataLabels.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CDataLabels.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CDataLabels.prototype.setVisibility = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetVisibility, this.visibility, pr));
        this.visibility = pr;
    };
    CDataLabels.prototype.setSeparator = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetSeparator, this.separator, pr));
        this.separator = pr;
    };
    CDataLabels.prototype.setDataLabel = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetDataLabel, this.dataLabel, pr));
        this.dataLabel = pr;
    };
    CDataLabels.prototype.setDataLabelHidden = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetDataLabelHidden, this.dataLabelHidden, pr));
        this.dataLabelHidden = pr;
    };
    CDataLabels.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CDataLabels.prototype.setPos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabels_SetPos, this.pos, pr));
        this.pos = pr;
    };
    window['AscFormat'].CDataLabels = CDataLabels;

    // DataLabelVisibilities
    drawingsChangesMap[AscDFH.historyitem_DataLabelVisibilities_SetSeriesName] = function(oClass, value) {
        oClass.seriesName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabelVisibilities_SetCategoryName] = function(oClass, value) {
        oClass.categoryName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataLabelVisibilities_SetValue] = function(oClass, value) {
        oClass.value = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataLabelVisibilities_SetSeriesName] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabelVisibilities_SetCategoryName] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataLabelVisibilities_SetValue] = window['AscDFH'].CChangesDrawingsString;
    function CDataLabelVisibilities() {
        CBaseChartObject.call(this);
        this.seriesName = null;
        this.categoryName = null;
        this.value = null;
    }

    InitClass(CDataLabelVisibilities, CBaseChartObject, AscDFH.historyitem_type_DataLabelVisibilities);

    CDataLabelVisibilities.prototype.setSeriesName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabelVisibilities_SetSeriesName, this.seriesName, pr));
        this.seriesName = pr;
    };
    CDataLabelVisibilities.prototype.setCategoryName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabelVisibilities_SetCategoryName, this.categoryName, pr));
        this.categoryName = pr;
    };
    CDataLabelVisibilities.prototype.setValue = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataLabelVisibilities_SetValue, this.value, pr));
        this.value = pr;
    };
    window['AscFormat'].CDataLabelVisibilities = CDataLabelVisibilities;

    // DataPoint
    drawingsChangesMap[AscDFH.historyitem_DataPoint_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataPoint_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_DataPoint_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataPoint_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataPoint_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_DataPoint_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CDataPoint() {
        CBaseChartObject.call(this);
        this.spPr = null;
        this.extLst = null;
        this.idx = null;
    }

    InitClass(CDataPoint, CBaseChartObject, AscDFH.historyitem_type_DataPoint);

    CDataPoint.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataPoint_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CDataPoint.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataPoint_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CDataPoint.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_DataPoint_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CDataPoint = CDataPoint;

    // Extension
    drawingsChangesMap[AscDFH.historyitem_Extension_SetUri] = function(oClass, value) {
        oClass.uri = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Extension_SetUri] = window['AscDFH'].CChangesDrawingsString;
    function CExtension() {
        CBaseChartObject.call(this);
        this.uri = null;
    }

    InitClass(CExtension, CBaseChartObject, AscDFH.historyitem_type_Extension);

    CExtension.prototype.setUri = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Extension_SetUri, this.uri, pr));
        this.uri = pr;
    };
    window['AscFormat'].CExtension = CExtension;

    // // ExtensionList (OOX::Drawing::COfficeArtExtensionList instead of CExtensionList)
    // drawingsChangesMap[AscDFH.historyitem_ExtensionList_SetExt] = function(oClass, value) {
    //     oClass.ext = value;
    // };
    // AscDFH.changesFactory[AscDFH.historyitem_ExtensionList_SetExt] = window['AscDFH'].CChangesDrawingsString;
    // function CExtensionList() {
    //     CBaseChartObject.call(this);
    //     this.ext = null;
    // }

    // InitClass(CExtensionList, CBaseChartObject, AscDFH.historyitem_type_ExtensionList);

    // CExtensionList.prototype.setExt = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ExtensionList_SetExt, this.ext, pr));
    //     this.ext = pr;
    // };
    // window['AscFormat'].CExtensionList = CExtensionList;

    // ExternalData
    drawingsChangesMap[AscDFH.historyitem_ExternalData_SetR] = function(oClass, value) {
        oClass.r = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ExternalData_SetAutoUpdate] = function(oClass, value) {
        oClass.autoUpdate = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ExternalData_SetR] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ExternalData_SetAutoUpdate] = window['AscDFH'].CChangesDrawingsString;
    function CExternalData() {
        CBaseChartObject.call(this);
        this.r = null;
        this.autoUpdate = null;
    }

    InitClass(CExternalData, CBaseChartObject, AscDFH.historyitem_type_ExternalData);

    CExternalData.prototype.setR = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ExternalData_SetR, this.r, pr));
        this.r = pr;
    };
    CExternalData.prototype.setAutoUpdate = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ExternalData_SetAutoUpdate, this.autoUpdate, pr));
        this.autoUpdate = pr;
    };
    window['AscFormat'].CExternalData = CExternalData;

    // FormatOverride
    drawingsChangesMap[AscDFH.historyitem_FormatOverride_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_FormatOverride_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_FormatOverride_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_FormatOverride_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_FormatOverride_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_FormatOverride_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CFormatOverride() {
        CBaseChartObject.call(this);
        this.spPr = null;
        this.extLst = null;
        this.idx = null;
    }

    InitClass(CFormatOverride, CBaseChartObject, AscDFH.historyitem_type_FormatOverride);

    CFormatOverride.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_FormatOverride_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CFormatOverride.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_FormatOverride_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CFormatOverride.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_FormatOverride_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CFormatOverride = CFormatOverride;

    // FormatOverrides
    drawingsChangesMap[AscDFH.historyitem_FormatOverrides_SetFmtOvr] = function(oClass, value) {
        oClass.fmtOvr = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_FormatOverrides_SetFmtOvr] = window['AscDFH'].CChangesDrawingsString;
    function CFormatOverrides() {
        CBaseChartObject.call(this);
        this.fmtOvr = null;
    }

    InitClass(CFormatOverrides, CBaseChartObject, AscDFH.historyitem_type_FormatOverrides);

    CFormatOverrides.prototype.setFmtOvr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_FormatOverrides_SetFmtOvr, this.fmtOvr, pr));
        this.fmtOvr = pr;
    };
    window['AscFormat'].CFormatOverrides = CFormatOverrides;

    // Formula
    drawingsChangesMap[AscDFH.historyitem_Formula_SetDir] = function(oClass, value) {
        oClass.dir = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Formula_SetDir] = window['AscDFH'].CChangesDrawingsString;
    function CFormula() {
        CBaseChartObject.call(this);
        this.dir = null;
    }

    InitClass(CFormula, CBaseChartObject, AscDFH.historyitem_type_Formula);

    CFormula.prototype.setDir = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Formula_SetDir, this.dir, pr));
        this.dir = pr;
    };
    window['AscFormat'].CFormula = CFormula;

    // GeoCache
    drawingsChangesMap[AscDFH.historyitem_GeoCache_SetBinary] = function(oClass, value) {
        oClass.binary = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoCache_SetClear] = function(oClass, value) {
        oClass.clear = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoCache_SetProvider] = function(oClass, value) {
        oClass.provider = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoCache_SetBinary] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoCache_SetClear] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoCache_SetProvider] = window['AscDFH'].CChangesDrawingsString;
    function CGeoCache() {
        CBaseChartObject.call(this);
        this.binary = null;
        this.clear = null;
        this.provider = null;
    }

    InitClass(CGeoCache, CBaseChartObject, AscDFH.historyitem_type_GeoCache);

    CGeoCache.prototype.setBinary = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoCache_SetBinary, this.binary, pr));
        this.binary = pr;
    };
    CGeoCache.prototype.setClear = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoCache_SetClear, this.clear, pr));
        this.clear = pr;
    };
    CGeoCache.prototype.setProvider = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoCache_SetProvider, this.provider, pr));
        this.provider = pr;
    };
    window['AscFormat'].CGeoCache = CGeoCache;

    // GeoChildEntities
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntities_SetGeoHierarchyEntity] = function(oClass, value) {
        oClass.geoHierarchyEntity = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntities_SetGeoHierarchyEntity] = window['AscDFH'].CChangesDrawingsString;
    function CGeoChildEntities() {
        CBaseChartObject.call(this);
        this.geoHierarchyEntity = null;
    }

    InitClass(CGeoChildEntities, CBaseChartObject, AscDFH.historyitem_type_GeoChildEntities);

    CGeoChildEntities.prototype.setGeoHierarchyEntity = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntities_SetGeoHierarchyEntity, this.geoHierarchyEntity, pr));
        this.geoHierarchyEntity = pr;
    };
    window['AscFormat'].CGeoChildEntities = CGeoChildEntities;

    // GeoChildEntitiesQuery
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntitiesQuery_SetGeoChildTypes] = function(oClass, value) {
        oClass.geoChildTypes = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntitiesQuery_SetEntityId] = function(oClass, value) {
        oClass.entityId = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntitiesQuery_SetGeoChildTypes] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntitiesQuery_SetEntityId] = window['AscDFH'].CChangesDrawingsString;
    function CGeoChildEntitiesQuery() {
        CBaseChartObject.call(this);
        this.geoChildTypes = null;
        this.entityId = null;
    }

    InitClass(CGeoChildEntitiesQuery, CBaseChartObject, AscDFH.historyitem_type_GeoChildEntitiesQuery);

    CGeoChildEntitiesQuery.prototype.setGeoChildTypes = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntitiesQuery_SetGeoChildTypes, this.geoChildTypes, pr));
        this.geoChildTypes = pr;
    };
    CGeoChildEntitiesQuery.prototype.setEntityId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntitiesQuery_SetEntityId, this.entityId, pr));
        this.entityId = pr;
    };
    window['AscFormat'].CGeoChildEntitiesQuery = CGeoChildEntitiesQuery;

    // GeoChildEntitiesQueryResult
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntitiesQuery] = function(oClass, value) {
        oClass.geoChildEntitiesQuery = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntities] = function(oClass, value) {
        oClass.geoChildEntities = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntitiesQuery] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntities] = window['AscDFH'].CChangesDrawingsString;
    function CGeoChildEntitiesQueryResult() {
        CBaseChartObject.call(this);
        this.geoChildEntitiesQuery = null;
        this.geoChildEntities = null;
    }

    InitClass(CGeoChildEntitiesQueryResult, CBaseChartObject, AscDFH.historyitem_type_GeoChildEntitiesQueryResult);

    CGeoChildEntitiesQueryResult.prototype.setGeoChildEntitiesQuery = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntitiesQuery, this.geoChildEntitiesQuery, pr));
        this.geoChildEntitiesQuery = pr;
    };
    CGeoChildEntitiesQueryResult.prototype.setGeoChildEntities = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntitiesQueryResult_SetGeoChildEntities, this.geoChildEntities, pr));
        this.geoChildEntities = pr;
    };
    window['AscFormat'].CGeoChildEntitiesQueryResult = CGeoChildEntitiesQueryResult;

    // GeoChildEntitiesQueryResults
    drawingsChangesMap[AscDFH.historyitem_GeoChildEntitiesQueryResults_SetGeoChildEntitiesQueryResult] = function(oClass, value) {
        oClass.geoChildEntitiesQueryResult = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildEntitiesQueryResults_SetGeoChildEntitiesQueryResult] = window['AscDFH'].CChangesDrawingsString;
    function CGeoChildEntitiesQueryResults() {
        CBaseChartObject.call(this);
        this.geoChildEntitiesQueryResult = null;
    }

    InitClass(CGeoChildEntitiesQueryResults, CBaseChartObject, AscDFH.historyitem_type_GeoChildEntitiesQueryResults);

    CGeoChildEntitiesQueryResults.prototype.setGeoChildEntitiesQueryResult = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildEntitiesQueryResults_SetGeoChildEntitiesQueryResult, this.geoChildEntitiesQueryResult, pr));
        this.geoChildEntitiesQueryResult = pr;
    };
    window['AscFormat'].CGeoChildEntitiesQueryResults = CGeoChildEntitiesQueryResults;

    // GeoChildTypes
    drawingsChangesMap[AscDFH.historyitem_GeoChildTypes_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoChildTypes_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    function CGeoChildTypes() {
        CBaseChartObject.call(this);
        this.entityType = null;
    }

    InitClass(CGeoChildTypes, CBaseChartObject, AscDFH.historyitem_type_GeoChildTypes);

    CGeoChildTypes.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoChildTypes_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    window['AscFormat'].CGeoChildTypes = CGeoChildTypes;

    // GeoData
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetGeoPolygons] = function(oClass, value) {
        oClass.geoPolygons = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetCopyrights] = function(oClass, value) {
        oClass.copyrights = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetEntityName] = function(oClass, value) {
        oClass.entityName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetEntityId] = function(oClass, value) {
        oClass.entityId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetEast] = function(oClass, value) {
        oClass.east = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetWest] = function(oClass, value) {
        oClass.west = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetNorth] = function(oClass, value) {
        oClass.north = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoData_SetSouth] = function(oClass, value) {
        oClass.south = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoData_SetGeoPolygons] = window['AscDFH'].CChangesDrawingsString;
    function CGeoData() {
        CBaseChartObject.call(this);
        this.geoPolygons = null;
        this.copyrights = null;
        this.entityName = null;
        this.entityId = null;
        this.east = null;
        this.west = null;
        this.north = null;
        this.south = null;
    }

    InitClass(CGeoData, CBaseChartObject, AscDFH.historyitem_type_GeoData);

    CGeoData.prototype.setGeoPolygons = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetGeoPolygons, this.geoPolygons, pr));
        this.geoPolygons = pr;
    };
    CGeoData.prototype.setCopyrights = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetCopyrights, this.copyrights, pr));
        this.copyrights = pr;
    };
    CGeoData.prototype.setEntityName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetEntityName, this.entityName, pr));
        this.entityName = pr;
    };
    CGeoData.prototype.setEntityId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetEntityId, this.entityId, pr));
        this.entityId = pr;
    };
    CGeoData.prototype.setEast = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetEast, this.east, pr));
        this.east = pr;
    };
    CGeoData.prototype.setWest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetWest, this.west, pr));
        this.west = pr;
    };
    CGeoData.prototype.setNorth = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetNorth, this.north, pr));
        this.north = pr;
    };
    CGeoData.prototype.setSouth = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoData_SetSouth, this.south, pr));
        this.south = pr;
    };
    window['AscFormat'].CGeoData = CGeoData;

    // GeoDataEntityQuery
    drawingsChangesMap[AscDFH.historyitem_GeoDataEntityQuery_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataEntityQuery_SetEntityId] = function(oClass, value) {
        oClass.entityId = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataEntityQuery_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataEntityQuery_SetEntityId] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataEntityQuery() {
        CBaseChartObject.call(this);
        this.entityType = null;
        this.entityId = null;
    }

    InitClass(CGeoDataEntityQuery, CBaseChartObject, AscDFH.historyitem_type_GeoDataEntityQuery);

    CGeoDataEntityQuery.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataEntityQuery_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    CGeoDataEntityQuery.prototype.setEntityId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataEntityQuery_SetEntityId, this.entityId, pr));
        this.entityId = pr;
    };
    window['AscFormat'].CGeoDataEntityQuery = CGeoDataEntityQuery;

    // GeoDataEntityQueryResult
    drawingsChangesMap[AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoDataEntityQuery] = function(oClass, value) {
        oClass.geoDataEntityQuery = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoData] = function(oClass, value) {
        oClass.geoData = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoDataEntityQuery] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoData] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataEntityQueryResult() {
        CBaseChartObject.call(this);
        this.geoDataEntityQuery = null;
        this.geoData = null;
    }

    InitClass(CGeoDataEntityQueryResult, CBaseChartObject, AscDFH.historyitem_type_GeoDataEntityQueryResult);

    CGeoDataEntityQueryResult.prototype.setGeoDataEntityQuery = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoDataEntityQuery, this.geoDataEntityQuery, pr));
        this.geoDataEntityQuery = pr;
    };
    CGeoDataEntityQueryResult.prototype.setGeoData = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataEntityQueryResult_SetGeoData, this.geoData, pr));
        this.geoData = pr;
    };
    window['AscFormat'].CGeoDataEntityQueryResult = CGeoDataEntityQueryResult;

    // GeoDataEntityQueryResults
    drawingsChangesMap[AscDFH.historyitem_GeoDataEntityQueryResults_SetGeoDataEntityQueryResult] = function(oClass, value) {
        oClass.geoDataEntityQueryResult = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataEntityQueryResults_SetGeoDataEntityQueryResult] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataEntityQueryResults() {
        CBaseChartObject.call(this);
        this.geoDataEntityQueryResult = null;
    }

    InitClass(CGeoDataEntityQueryResults, CBaseChartObject, AscDFH.historyitem_type_GeoDataEntityQueryResults);

    CGeoDataEntityQueryResults.prototype.setGeoDataEntityQueryResult = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataEntityQueryResults_SetGeoDataEntityQueryResult, this.geoDataEntityQueryResult, pr));
        this.geoDataEntityQueryResult = pr;
    };
    window['AscFormat'].CGeoDataEntityQueryResults = CGeoDataEntityQueryResults;

    // GeoDataPointQuery
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointQuery_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointQuery_SetLatitude] = function(oClass, value) {
        oClass.latitude = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointQuery_SetLongitude] = function(oClass, value) {
        oClass.longitude = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointQuery_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointQuery_SetLatitude] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointQuery_SetLongitude] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataPointQuery() {
        CBaseChartObject.call(this);
        this.entityType = null;
        this.latitude = null;
        this.longitude = null;
    }

    InitClass(CGeoDataPointQuery, CBaseChartObject, AscDFH.historyitem_type_GeoDataPointQuery);

    CGeoDataPointQuery.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointQuery_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    CGeoDataPointQuery.prototype.setLatitude = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointQuery_SetLatitude, this.latitude, pr));
        this.latitude = pr;
    };
    CGeoDataPointQuery.prototype.setLongitude = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointQuery_SetLongitude, this.longitude, pr));
        this.longitude = pr;
    };
    window['AscFormat'].CGeoDataPointQuery = CGeoDataPointQuery;

    // GeoDataPointToEntityQuery
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityId] = function(oClass, value) {
        oClass.entityId = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityId] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataPointToEntityQuery() {
        CBaseChartObject.call(this);
        this.entityType = null;
        this.entityId = null;
    }

    InitClass(CGeoDataPointToEntityQuery, CBaseChartObject, AscDFH.historyitem_type_GeoDataPointToEntityQuery);

    CGeoDataPointToEntityQuery.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    CGeoDataPointToEntityQuery.prototype.setEntityId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointToEntityQuery_SetEntityId, this.entityId, pr));
        this.entityId = pr;
    };
    window['AscFormat'].CGeoDataPointToEntityQuery = CGeoDataPointToEntityQuery;

    // GeoDataPointToEntityQueryResult
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointQuery] = function(oClass, value) {
        oClass.geoDataPointQuery = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointToEntityQuery] = function(oClass, value) {
        oClass.geoDataPointToEntityQuery = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointQuery] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointToEntityQuery] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataPointToEntityQueryResult() {
        CBaseChartObject.call(this);
        this.geoDataPointQuery = null;
        this.geoDataPointToEntityQuery = null;
    }

    InitClass(CGeoDataPointToEntityQueryResult, CBaseChartObject, AscDFH.historyitem_type_GeoDataPointToEntityQueryResult);

    CGeoDataPointToEntityQueryResult.prototype.setGeoDataPointQuery = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointQuery, this.geoDataPointQuery, pr));
        this.geoDataPointQuery = pr;
    };
    CGeoDataPointToEntityQueryResult.prototype.setGeoDataPointToEntityQuery = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointToEntityQueryResult_SetGeoDataPointToEntityQuery, this.geoDataPointToEntityQuery, pr));
        this.geoDataPointToEntityQuery = pr;
    };
    window['AscFormat'].CGeoDataPointToEntityQueryResult = CGeoDataPointToEntityQueryResult;

    // GeoDataPointToEntityQueryResults
    drawingsChangesMap[AscDFH.historyitem_GeoDataPointToEntityQueryResults_SetGeoDataPointToEntityQueryResult] = function(oClass, value) {
        oClass.geoDataPointToEntityQueryResult = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoDataPointToEntityQueryResults_SetGeoDataPointToEntityQueryResult] = window['AscDFH'].CChangesDrawingsString;
    function CGeoDataPointToEntityQueryResults() {
        CBaseChartObject.call(this);
        this.geoDataPointToEntityQueryResult = null;
    }

    InitClass(CGeoDataPointToEntityQueryResults, CBaseChartObject, AscDFH.historyitem_type_GeoDataPointToEntityQueryResults);

    CGeoDataPointToEntityQueryResults.prototype.setGeoDataPointToEntityQueryResult = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoDataPointToEntityQueryResults_SetGeoDataPointToEntityQueryResult, this.geoDataPointToEntityQueryResult, pr));
        this.geoDataPointToEntityQueryResult = pr;
    };
    window['AscFormat'].CGeoDataPointToEntityQueryResults = CGeoDataPointToEntityQueryResults;

    // Geography
    drawingsChangesMap[AscDFH.historyitem_Geography_SetGeoCache] = function(oClass, value) {
        oClass.geoCache = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Geography_SetProjectionType] = function(oClass, value) {
        oClass.projectionType = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Geography_SetViewedRegionType] = function(oClass, value) {
        oClass.viewedRegionType = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Geography_SetCultureLanguage] = function(oClass, value) {
        oClass.cultureLanguage = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Geography_SetCultureRegion] = function(oClass, value) {
        oClass.cultureRegion = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Geography_SetAttribution] = function(oClass, value) {
        oClass.attribution = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetGeoCache] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetProjectionType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetViewedRegionType] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetCultureLanguage] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetGeoCache] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Geography_SetGeoCache] = window['AscDFH'].CChangesDrawingsString;
    function CGeography() {
        CBaseChartObject.call(this);
        this.geoCache = null;
        this.projectionType = null;
        this.viewedRegionType = null;
        this.cultureLanguage = null;
        this.cultureRegion = null;
        this.attribution = null;
    }

    InitClass(CGeography, CBaseChartObject, AscDFH.historyitem_type_Geography);

    CGeography.prototype.setGeoCache = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetGeoCache, this.geoCache, pr));
        this.geoCache = pr;
    };
    CGeography.prototype.setProjectionType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetProjectionType, this.projectionType, pr));
        this.projectionType = pr;
    };
    CGeography.prototype.setViewedRegionType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetViewedRegionType, this.viewedRegionType, pr));
        this.viewedRegionType = pr;
    };
    CGeography.prototype.setCultureLanguage = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetCultureLanguage, this.cultureLanguage, pr));
        this.cultureLanguage = pr;
    };
    CGeography.prototype.setCultureRegion = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetCultureRegion, this.cultureRegion, pr));
        this.cultureRegion = pr;
    };
    CGeography.prototype.setAttribution = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Geography_SetAttribution, this.attribution, pr));
        this.attribution = pr;
    };
    window['AscFormat'].CGeography = CGeography;

    // GeoHierarchyEntity
    drawingsChangesMap[AscDFH.historyitem_GeoHierarchyEntity_SetEntityName] = function(oClass, value) {
        oClass.entityName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoHierarchyEntity_SetEntityId] = function(oClass, value) {
        oClass.entityId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoHierarchyEntity_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoHierarchyEntity_SetEntityName] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoHierarchyEntity_SetEntityId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoHierarchyEntity_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    function CGeoHierarchyEntity() {
        CBaseChartObject.call(this);
        this.entityName = null;
        this.entityId = null;
        this.entityType = null;
    }

    InitClass(CGeoHierarchyEntity, CBaseChartObject, AscDFH.historyitem_type_GeoHierarchyEntity);

    CGeoHierarchyEntity.prototype.setEntityName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoHierarchyEntity_SetEntityName, this.entityName, pr));
        this.entityName = pr;
    };
    CGeoHierarchyEntity.prototype.setEntityId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoHierarchyEntity_SetEntityId, this.entityId, pr));
        this.entityId = pr;
    };
    CGeoHierarchyEntity.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoHierarchyEntity_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    window['AscFormat'].CGeoHierarchyEntity = CGeoHierarchyEntity;

    // GeoLocation
    drawingsChangesMap[AscDFH.historyitem_GeoLocation_SetAddress] = function(oClass, value) {
        oClass.address = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocation_SetLatitude] = function(oClass, value) {
        oClass.latitude = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocation_SetLongitude] = function(oClass, value) {
        oClass.longitude = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocation_SetEntityName] = function(oClass, value) {
        oClass.entityName = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocation_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocation_SetAddress] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocation_SetLatitude] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocation_SetLongitude] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocation_SetEntityName] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocation_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    function CGeoLocation() {
        CBaseChartObject.call(this);
        this.address = null;
        this.latitude = null;
        this.longitude = null;
        this.entityName = null;
        this.entityType = null;
    }

    InitClass(CGeoLocation, CBaseChartObject, AscDFH.historyitem_type_GeoLocation);

    CGeoLocation.prototype.setAddress = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocation_SetAddress, this.address, pr));
        this.address = pr;
    };
    CGeoLocation.prototype.setLatitude = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocation_SetLatitude, this.latitude, pr));
        this.latitude = pr;
    };
    CGeoLocation.prototype.setLongitude = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocation_SetLongitude, this.longitude, pr));
        this.longitude = pr;
    };
    CGeoLocation.prototype.setEntityName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocation_SetEntityName, this.entityName, pr));
        this.entityName = pr;
    };
    CGeoLocation.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocation_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    window['AscFormat'].CGeoLocation = CGeoLocation;

    // GeoLocationQuery
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQuery_SetCountryRegion] = function(oClass, value) {
        oClass.countryRegion = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict1] = function(oClass, value) {
        oClass.adminDistrict1 = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict2] = function(oClass, value) {
        oClass.adminDistrict2 = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQuery_SetPostalCode] = function(oClass, value) {
        oClass.postalCode = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQuery_SetEntityType] = function(oClass, value) {
        oClass.entityType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQuery_SetCountryRegion] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict1] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict2] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQuery_SetPostalCode] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQuery_SetEntityType] = window['AscDFH'].CChangesDrawingsString;
    function CGeoLocationQuery() {
        CBaseChartObject.call(this);
        this.countryRegion = null;
        this.adminDistrict1 = null;
        this.adminDistrict2 = null;
        this.postalCode = null;
        this.entityType = null;
    }

    InitClass(CGeoLocationQuery, CBaseChartObject, AscDFH.historyitem_type_GeoLocationQuery);

    CGeoLocationQuery.prototype.setCountryRegion = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQuery_SetCountryRegion, this.countryRegion, pr));
        this.countryRegion = pr;
    };
    CGeoLocationQuery.prototype.setAdminDistrict1 = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict1, this.adminDistrict1, pr));
        this.adminDistrict1 = pr;
    };
    CGeoLocationQuery.prototype.setAdminDistrict2 = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQuery_SetAdminDistrict2, this.adminDistrict2, pr));
        this.adminDistrict2 = pr;
    };
    CGeoLocationQuery.prototype.setPostalCode = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQuery_SetPostalCode, this.postalCode, pr));
        this.postalCode = pr;
    };
    CGeoLocationQuery.prototype.setEntityType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQuery_SetEntityType, this.entityType, pr));
        this.entityType = pr;
    };
    window['AscFormat'].CGeoLocationQuery = CGeoLocationQuery;

    // GeoLocationQueryResult
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocationQuery] = function(oClass, value) {
        oClass.geoLocationQuery = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocations] = function(oClass, value) {
        oClass.geoLocations = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocationQuery] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocations] = window['AscDFH'].CChangesDrawingsString;
    function CGeoLocationQueryResult() {
        CBaseChartObject.call(this);
        this.geoLocationQuery = null;
        this.geoLocations = null;
    }

    InitClass(CGeoLocationQueryResult, CBaseChartObject, AscDFH.historyitem_type_GeoLocationQueryResult);

    CGeoLocationQueryResult.prototype.setGeoLocationQuery = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocationQuery, this.geoLocationQuery, pr));
        this.geoLocationQuery = pr;
    };
    CGeoLocationQueryResult.prototype.setGeoLocations = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQueryResult_SetGeoLocations, this.geoLocations, pr));
        this.geoLocations = pr;
    };
    window['AscFormat'].CGeoLocationQueryResult = CGeoLocationQueryResult;

    // GeoLocationQueryResults
    drawingsChangesMap[AscDFH.historyitem_GeoLocationQueryResults_SetGeoLocationQueryResult] = function(oClass, value) {
        oClass.geoLocationQueryResult = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocationQueryResults_SetGeoLocationQueryResult] = window['AscDFH'].CChangesDrawingsString;
    function CGeoLocationQueryResults() {
        CBaseChartObject.call(this);
        this.geoLocationQueryResult = null;
    }

    InitClass(CGeoLocationQueryResults, CBaseChartObject, AscDFH.historyitem_type_GeoLocationQueryResults);

    CGeoLocationQueryResults.prototype.setGeoLocationQueryResult = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocationQueryResults_SetGeoLocationQueryResult, this.geoLocationQueryResult, pr));
        this.geoLocationQueryResult = pr;
    };
    window['AscFormat'].CGeoLocationQueryResults = CGeoLocationQueryResults;

    // GeoLocations
    drawingsChangesMap[AscDFH.historyitem_GeoLocations_SetGeoLocation] = function(oClass, value) {
        oClass.geoLocation = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoLocations_SetGeoLocation] = window['AscDFH'].CChangesDrawingsString;
    function CGeoLocations() {
        CBaseChartObject.call(this);
        this.geoLocation = null;
    }

    InitClass(CGeoLocations, CBaseChartObject, AscDFH.historyitem_type_GeoLocations);

    CGeoLocations.prototype.setGeoLocation = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoLocations_SetGeoLocation, this.geoLocation, pr));
        this.geoLocation = pr;
    };
    window['AscFormat'].CGeoLocations = CGeoLocations;

    // GeoPolygon
    drawingsChangesMap[AscDFH.historyitem_GeoPolygon_SetPolygonId] = function(oClass, value) {
        oClass.polygonId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoPolygon_SetNumPoints] = function(oClass, value) {
        oClass.numPoints = value;
    };
    drawingsChangesMap[AscDFH.historyitem_GeoPolygon_SetPcaRings] = function(oClass, value) {
        oClass.pcaRings = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoPolygon_SetPolygonId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoPolygon_SetNumPoints] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_GeoPolygon_SetPcaRings] = window['AscDFH'].CChangesDrawingsString;
    function CGeoPolygon() {
        CBaseChartObject.call(this);
        this.polygonId = null;
        this.numPoints = null;
        this.pcaRings = null;
    }

    InitClass(CGeoPolygon, CBaseChartObject, AscDFH.historyitem_type_GeoPolygon);

    CGeoPolygon.prototype.setPolygonId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoPolygon_SetPolygonId, this.polygonId, pr));
        this.polygonId = pr;
    };
    CGeoPolygon.prototype.setNumPoints = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoPolygon_SetNumPoints, this.numPoints, pr));
        this.numPoints = pr;
    };
    CGeoPolygon.prototype.setPcaRings = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoPolygon_SetPcaRings, this.pcaRings, pr));
        this.pcaRings = pr;
    };
    window['AscFormat'].CGeoPolygon = CGeoPolygon;

    // GeoPolygons
    drawingsChangesMap[AscDFH.historyitem_GeoPolygons_SetGeoPolygon] = function(oClass, value) {
        oClass.geoPolygon = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_GeoPolygons_SetGeoPolygon] = window['AscDFH'].CChangesDrawingsString;
    function CGeoPolygons() {
        CBaseChartObject.call(this);
        this.geoPolygon = null;
    }

    InitClass(CGeoPolygons, CBaseChartObject, AscDFH.historyitem_type_GeoPolygons);

    CGeoPolygons.prototype.setGeoPolygon = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_GeoPolygons_SetGeoPolygon, this.geoPolygon, pr));
        this.geoPolygon = pr;
    };
    window['AscFormat'].CGeoPolygons = CGeoPolygons;

    // Gridlines
    drawingsChangesMap[AscDFH.historyitem_Gridlines_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Gridlines_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Gridlines_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Gridlines_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CGridlines() {
        CBaseChartObject.call(this);
        this.spPr = null;
        this.extLst = null;
    }

    InitClass(CGridlines, CBaseChartObject, AscDFH.historyitem_type_Gridlines);

    CGridlines.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Gridlines_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CGridlines.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Gridlines_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CGridlines = CGridlines;

    // HeaderFooter
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetOddHeader] = function(oClass, value) {
        oClass.oddHeader = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetOddFooter] = function(oClass, value) {
        oClass.oddFooter = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetEvenHeader] = function(oClass, value) {
        oClass.evenHeader = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetEvenFooter] = function(oClass, value) {
        oClass.evenFooter = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetFirstHeader] = function(oClass, value) {
        oClass.firstHeader = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetFirstFooter] = function(oClass, value) {
        oClass.firstFooter = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetAlignWithMargins] = function(oClass, value) {
        oClass.alignWithMargins = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetDifferentOddEven] = function(oClass, value) {
        oClass.differentOddEven = value;
    };
    drawingsChangesMap[AscDFH.historyitem_HeaderFooter_SetDifferentFirst] = function(oClass, value) {
        oClass.differentFirst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetOddHeader] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetOddFooter] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetEvenHeader] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetEvenFooter] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetFirstHeader] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetFirstFooter] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetAlignWithMargins] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetDifferentOddEven] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_HeaderFooter_SetDifferentFirst] = window['AscDFH'].CChangesDrawingsString;
    function CHeaderFooter() {
        CBaseChartObject.call(this);
        this.oddHeader = null;
        this.oddFooter = null;
        this.evenHeader = null;
        this.evenFooter = null;
        this.firstHeader = null;
        this.firstFooter = null;
        this.alignWithMargins = null;
        this.differentOddEven = null;
        this.differentFirst = null;
    }

    InitClass(CHeaderFooter, CBaseChartObject, AscDFH.historyitem_type_HeaderFooter);

    CHeaderFooter.prototype.setOddHeader = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetOddHeader, this.oddHeader, pr));
        this.oddHeader = pr;
    };
    CHeaderFooter.prototype.setOddFooter = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetOddFooter, this.oddFooter, pr));
        this.oddFooter = pr;
    };
    CHeaderFooter.prototype.setEvenHeader = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetEvenHeader, this.evenHeader, pr));
        this.evenHeader = pr;
    };
    CHeaderFooter.prototype.setEvenFooter = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetEvenFooter, this.evenFooter, pr));
        this.evenFooter = pr;
    };
    CHeaderFooter.prototype.setFirstHeader = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetFirstHeader, this.firstHeader, pr));
        this.firstHeader = pr;
    };
    CHeaderFooter.prototype.setFirstFooter = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetFirstFooter, this.firstFooter, pr));
        this.firstFooter = pr;
    };
    CHeaderFooter.prototype.setAlignWithMargins = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetAlignWithMargins, this.alignWithMargins, pr));
        this.alignWithMargins = pr;
    };
    CHeaderFooter.prototype.setDifferentOddEven = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetDifferentOddEven, this.differentOddEven, pr));
        this.differentOddEven = pr;
    };
    CHeaderFooter.prototype.setDifferentFirst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_HeaderFooter_SetDifferentFirst, this.differentFirst, pr));
        this.differentFirst = pr;
    };
    window['AscFormat'].CHeaderFooter = CHeaderFooter;

    // Legend
    drawingsChangesMap[AscDFH.historyitem_Legend_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Legend_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Legend_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Legend_SetPos] = function(oClass, value) {
        oClass.pos = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Legend_SetAlign] = function(oClass, value) {
        oClass.align = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Legend_SetOverlay] = function(oClass, value) {
        oClass.overlay = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetPos] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetAlign] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Legend_SetOverlay] = window['AscDFH'].CChangesDrawingsString;
    function CLegend() {
        CBaseChartObject.call(this);
        this.spPr = null;
        this.txPr = null;
        this.extLst = null;
        this.pos = null;
        this.align = null;
        this.overlay = null;
    }

    InitClass(CLegend, CBaseChartObject, AscDFH.historyitem_type_Legend);

    CLegend.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CLegend.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CLegend.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CLegend.prototype.setPos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetPos, this.pos, pr));
        this.pos = pr;
    };
    CLegend.prototype.setAlign = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetAlign, this.align, pr));
        this.align = pr;
    };
    CLegend.prototype.setOverlay = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Legend_SetOverlay, this.overlay, pr));
        this.overlay = pr;
    };
    window['AscFormat'].CLegend = CLegend;

    // NumberColorPosition
    drawingsChangesMap[AscDFH.historyitem_NumberColorPosition_SetVal] = function(oClass, value) {
        oClass.val = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumberColorPosition_SetVal] = window['AscDFH'].CChangesDrawingsString;
    function CNumberColorPosition() {
        CBaseChartObject.call(this);
        this.val = null;
    }

    InitClass(CNumberColorPosition, CBaseChartObject, AscDFH.historyitem_type_NumberColorPosition);

    CNumberColorPosition.prototype.setVal = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumberColorPosition_SetVal, this.val, pr));
        this.val = pr;
    };
    window['AscFormat'].CNumberColorPosition = CNumberColorPosition;

    // NumberFormat
    drawingsChangesMap[AscDFH.historyitem_NumberFormat_SetFormatCode] = function(oClass, value) {
        oClass.formatCode = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumberFormat_SetSourceLinked] = function(oClass, value) {
        oClass.sourceLinked = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumberFormat_SetFormatCode] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumberFormat_SetSourceLinked] = window['AscDFH'].CChangesDrawingsString;
    function CNumberFormat() {
        CBaseChartObject.call(this);
        this.formatCode = null;
        this.sourceLinked = null;
    }

    InitClass(CNumberFormat, CBaseChartObject, AscDFH.historyitem_type_NumberFormat);

    CNumberFormat.prototype.setFormatCode = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumberFormat_SetFormatCode, this.formatCode, pr));
        this.formatCode = pr;
    };
    CNumberFormat.prototype.setSourceLinked = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumberFormat_SetSourceLinked, this.sourceLinked, pr));
        this.sourceLinked = pr;
    };
    window['AscFormat'].CNumberFormat = CNumberFormat;

    // NumericDimension
    drawingsChangesMap[AscDFH.historyitem_NumericDimension_SetF] = function(oClass, value) {
        oClass.f = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericDimension_SetNf] = function(oClass, value) {
        oClass.nf = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericDimension_SetLvl] = function(oClass, value) {
        oClass.lvl = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericDimension_SetType] = function(oClass, value) {
        oClass.type = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumericDimension_SetF] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericDimension_SetNf] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericDimension_SetLvl] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericDimension_SetType] = window['AscDFH'].CChangesDrawingsString;
    function CNumericDimension() {
        CBaseChartObject.call(this);
        this.f = null;
        this.nf = null;
        this.lvl = null;
        this.type = null;
    }

    InitClass(CNumericDimension, CBaseChartObject, AscDFH.historyitem_type_NumericDimension);

    CNumericDimension.prototype.setF = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericDimension_SetF, this.f, pr));
        this.f = pr;
    };
    CNumericDimension.prototype.setNf = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericDimension_SetNf, this.nf, pr));
        this.nf = pr;
    };
    CNumericDimension.prototype.setLvl = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericDimension_SetLvl, this.lvl, pr));
        this.lvl = pr;
    };
    CNumericDimension.prototype.setType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericDimension_SetType, this.type, pr));
        this.type = pr;
    };
    window['AscFormat'].CNumericDimension = CNumericDimension;

    // NumericLevel
    drawingsChangesMap[AscDFH.historyitem_NumericLevel_SetPt] = function(oClass, value) {
        oClass.pt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericLevel_SetPtCount] = function(oClass, value) {
        oClass.ptCount = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericLevel_SetFormatCode] = function(oClass, value) {
        oClass.formatCode = value;
    };
    drawingsChangesMap[AscDFH.historyitem_NumericLevel_SetName] = function(oClass, value) {
        oClass.name = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumericLevel_SetPt] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericLevel_SetPtCount] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericLevel_SetFormatCode] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_NumericLevel_SetName] = window['AscDFH'].CChangesDrawingsString;
    function CNumericLevel() {
        CBaseChartObject.call(this);
        this.pt = null;
        this.ptCount = null;
        this.formatCode = null;
        this.name = null;
    }

    InitClass(CNumericLevel, CBaseChartObject, AscDFH.historyitem_type_NumericLevel);

    CNumericLevel.prototype.setPt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericLevel_SetPt, this.pt, pr));
        this.pt = pr;
    };
    CNumericLevel.prototype.setPtCount = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericLevel_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
    };
    CNumericLevel.prototype.setFormatCode = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericLevel_SetFormatCode, this.formatCode, pr));
        this.formatCode = pr;
    };
    CNumericLevel.prototype.setName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericLevel_SetName, this.name, pr));
        this.name = pr;
    };
    window['AscFormat'].CNumericLevel = CNumericLevel;

    // NumericValue
    drawingsChangesMap[AscDFH.historyitem_NumericValue_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumericValue_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CNumericValue() {
        CBaseChartObject.call(this);
        this.idx = null;
    }

    InitClass(CNumericValue, CBaseChartObject, AscDFH.historyitem_type_NumericValue);

    CNumericValue.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_NumericValue_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CNumericValue = CNumericValue;

    // PageMargins
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetL] = function(oClass, value) {
        oClass.l = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetR] = function(oClass, value) {
        oClass.r = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetT] = function(oClass, value) {
        oClass.t = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetB] = function(oClass, value) {
        oClass.b = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetHeader] = function(oClass, value) {
        oClass.header = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageMargins_SetFooter] = function(oClass, value) {
        oClass.footer = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetL] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetR] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetT] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetB] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetHeader] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageMargins_SetFooter] = window['AscDFH'].CChangesDrawingsString;
    function CPageMargins() {
        CBaseChartObject.call(this);
        this.l = null;
        this.r = null;
        this.t = null;
        this.b = null;
        this.header = null;
        this.footer = null;
    }

    InitClass(CPageMargins, CBaseChartObject, AscDFH.historyitem_type_PageMargins);

    CPageMargins.prototype.setL = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetL, this.l, pr));
        this.l = pr;
    };
    CPageMargins.prototype.setR = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetR, this.r, pr));
        this.r = pr;
    };
    CPageMargins.prototype.setT = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetT, this.t, pr));
        this.t = pr;
    };
    CPageMargins.prototype.setB = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetB, this.b, pr));
        this.b = pr;
    };
    CPageMargins.prototype.setHeader = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetHeader, this.header, pr));
        this.header = pr;
    };
    CPageMargins.prototype.setFooter = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageMargins_SetFooter, this.footer, pr));
        this.footer = pr;
    };
    window['AscFormat'].CPageMargins = CPageMargins;

    // PageSetup
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetPaperSize] = function(oClass, value) {
        oClass.paperSize = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetFirstPageNumber] = function(oClass, value) {
        oClass.firstPageNumber = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetOrientation] = function(oClass, value) {
        oClass.orientation = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetBlackAndWhite] = function(oClass, value) {
        oClass.blackAndWhite = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetDraft] = function(oClass, value) {
        oClass.draft = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetUseFirstPageNumber] = function(oClass, value) {
        oClass.useFirstPageNumber = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetHorizontalDpi] = function(oClass, value) {
        oClass.horizontalDpi = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetVerticalDpi] = function(oClass, value) {
        oClass.verticalDpi = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PageSetup_SetCopies] = function(oClass, value) {
        oClass.copies = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetPaperSize] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetFirstPageNumber] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetOrientation] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetBlackAndWhite] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetDraft] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetUseFirstPageNumber] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetHorizontalDpi] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetVerticalDpi] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PageSetup_SetCopies] = window['AscDFH'].CChangesDrawingsString;
    function CPageSetup() {
        CBaseChartObject.call(this);
        this.paperSize = null;
        this.firstPageNumber = null;
        this.orientation = null;
        this.blackAndWhite = null;
        this.draft = null;
        this.useFirstPageNumber = null;
        this.horizontalDpi = null;
        this.verticalDpi = null;
        this.copies = null;
    }

    InitClass(CPageSetup, CBaseChartObject, AscDFH.historyitem_type_PageSetup);

    CPageSetup.prototype.setPaperSize = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetPaperSize, this.paperSize, pr));
        this.paperSize = pr;
    };
    CPageSetup.prototype.setFirstPageNumber = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetFirstPageNumber, this.firstPageNumber, pr));
        this.firstPageNumber = pr;
    };
    CPageSetup.prototype.setOrientation = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetOrientation, this.orientation, pr));
        this.orientation = pr;
    };
    CPageSetup.prototype.setBlackAndWhite = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetBlackAndWhite, this.blackAndWhite, pr));
        this.blackAndWhite = pr;
    };
    CPageSetup.prototype.setDraft = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetDraft, this.draft, pr));
        this.draft = pr;
    };
    CPageSetup.prototype.setUseFirstPageNumber = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetUseFirstPageNumber, this.useFirstPageNumber, pr));
        this.useFirstPageNumber = pr;
    };
    CPageSetup.prototype.setHorizontalDpi = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetHorizontalDpi, this.horizontalDpi, pr));
        this.horizontalDpi = pr;
    };
    CPageSetup.prototype.setVerticalDpi = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetVerticalDpi, this.verticalDpi, pr));
        this.verticalDpi = pr;
    };
    CPageSetup.prototype.setCopies = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PageSetup_SetCopies, this.copies, pr));
        this.copies = pr;
    };
    window['AscFormat'].CPageSetup = CPageSetup;

    // ParentLabelLayout
    drawingsChangesMap[AscDFH.historyitem_ParentLabelLayout_SetVal] = function(oClass, value) {
        oClass.val = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ParentLabelLayout_SetVal] = window['AscDFH'].CChangesDrawingsString;
    function CParentLabelLayout() {
        CBaseChartObject.call(this);
        this.val = null;
    }

    InitClass(CParentLabelLayout, CBaseChartObject, AscDFH.historyitem_type_ParentLabelLayout);

    CParentLabelLayout.prototype.setVal = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ParentLabelLayout_SetVal, this.val, pr));
        this.val = pr;
    };
    window['AscFormat'].CParentLabelLayout = CParentLabelLayout;

    // PercentageColorPosition
    drawingsChangesMap[AscDFH.historyitem_PercentageColorPosition_SetVal] = function(oClass, value) {
        oClass.val = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PercentageColorPosition_SetVal] = window['AscDFH'].CChangesDrawingsString;
    function CPercentageColorPosition() {
        CBaseChartObject.call(this);
        this.val = null;
    }

    InitClass(CPercentageColorPosition, CBaseChartObject, AscDFH.historyitem_type_PercentageColorPosition);

    CPercentageColorPosition.prototype.setVal = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PercentageColorPosition_SetVal, this.val, pr));
        this.val = pr;
    };
    window['AscFormat'].CPercentageColorPosition = CPercentageColorPosition;

    // PlotArea
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetPlotAreaRegion] = function(oClass, value) {
        oClass.plotAreaRegion = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetAxis] = function(oClass, value) {
        oClass.axis = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotArea_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetPlotAreaRegion] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetAxis] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotArea_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CPlotArea() {
        CBaseChartObject.call(this);
        this.plotAreaRegion = null;
        this.axis = null;
        this.spPr = null;
        this.extLst = null;
    }

    InitClass(CPlotArea, CBaseChartObject, AscDFH.historyitem_type_PlotArea);

    CPlotArea.prototype.setPlotAreaRegion = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotArea_SetPlotAreaRegion, this.plotAreaRegion, pr));
        this.plotAreaRegion = pr;
    };
    CPlotArea.prototype.setAxis = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsObject(this, AscDFH.historyitem_PlotArea_SetAxis, this.axis, pr));
        this.axis = pr;
    };
    CPlotArea.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotArea_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CPlotArea.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotArea_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CPlotArea = CPlotArea;

    // PlotAreaRegion
    drawingsChangesMap[AscDFH.historyitem_PlotAreaRegion_SetPlotSurface] = function(oClass, value) {
        oClass.plotSurface = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotAreaRegion_SetSeries] = function(oClass, value) {
        oClass.series = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotAreaRegion_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PlotAreaRegion_SetPlotSurface] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotAreaRegion_SetSeries] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotAreaRegion_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CPlotAreaRegion() {
        CBaseChartObject.call(this);
        this.plotSurface = null;
        this.series = null;
        this.extLst = null;
    }

    InitClass(CPlotAreaRegion, CBaseChartObject, AscDFH.historyitem_type_PlotAreaRegion);

    CPlotAreaRegion.prototype.setPlotSurface = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotAreaRegion_SetPlotSurface, this.plotSurface, pr));
        this.plotSurface = pr;
    };
    CPlotAreaRegion.prototype.setSeries = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotAreaRegion_SetSeries, this.series, pr));
        this.series = pr;
    };
    CPlotAreaRegion.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotAreaRegion_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CPlotAreaRegion = CPlotAreaRegion;

    // PlotSurface
    drawingsChangesMap[AscDFH.historyitem_PlotSurface_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PlotSurface_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PlotSurface_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PlotSurface_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CPlotSurface() {
        CBaseChartObject.call(this);
        this.spPr = null;
        this.extLst = null;
    }

    InitClass(CPlotSurface, CBaseChartObject, AscDFH.historyitem_type_PlotSurface);

    CPlotSurface.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotSurface_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CPlotSurface.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PlotSurface_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CPlotSurface = CPlotSurface;

    // PrintSettings
    drawingsChangesMap[AscDFH.historyitem_PrintSettings_SetHeaderFooter] = function(oClass, value) {
        oClass.headerFooter = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrintSettings_SetPageMargins] = function(oClass, value) {
        oClass.pageMargins = value;
    };
    drawingsChangesMap[AscDFH.historyitem_PrintSettings_SetPageSetup] = function(oClass, value) {
        oClass.pageSetup = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettings_SetHeaderFooter] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettings_SetPageMargins] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_PrintSettings_SetPageSetup] = window['AscDFH'].CChangesDrawingsString;
    function CPrintSettings() {
        CBaseChartObject.call(this);
        this.headerFooter = null;
        this.pageMargins = null;
        this.pageSetup = null;
    }

    InitClass(CPrintSettings, CBaseChartObject, AscDFH.historyitem_type_PrintSettings);

    CPrintSettings.prototype.setHeaderFooter = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PrintSettings_SetHeaderFooter, this.headerFooter, pr));
        this.headerFooter = pr;
    };
    CPrintSettings.prototype.setPageMargins = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PrintSettings_SetPageMargins, this.pageMargins, pr));
        this.pageMargins = pr;
    };
    CPrintSettings.prototype.setPageSetup = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_PrintSettings_SetPageSetup, this.pageSetup, pr));
        this.pageSetup = pr;
    };
    window['AscFormat'].CPrintSettings = CPrintSettings;

    // RegionLabelLayout
    drawingsChangesMap[AscDFH.historyitem_RegionLabelLayout_SetVal] = function(oClass, value) {
        oClass.val = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_RegionLabelLayout_SetVal] = window['AscDFH'].CChangesDrawingsString;
    function CRegionLabelLayout() {
        CBaseChartObject.call(this);
        this.val = null;
    }

    InitClass(CRegionLabelLayout, CBaseChartObject, AscDFH.historyitem_type_RegionLabelLayout);

    CRegionLabelLayout.prototype.setVal = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_RegionLabelLayout_SetVal, this.val, pr));
        this.val = pr;
    };
    window['AscFormat'].CRegionLabelLayout = CRegionLabelLayout;

    // RelId
    drawingsChangesMap[AscDFH.historyitem_RelId_SetR] = function(oClass, value) {
        oClass.r = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_RelId_SetR] = window['AscDFH'].CChangesDrawingsString;
    function CRelId() {
        CBaseChartObject.call(this);
        this.r = null;
    }

    InitClass(CRelId, CBaseChartObject, AscDFH.historyitem_type_RelId);

    CRelId.prototype.setR = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_RelId_SetR, this.r, pr));
        this.r = pr;
    };
    window['AscFormat'].CRelId = CRelId;

    // Series
    drawingsChangesMap[AscDFH.historyitem_Series_SetTx] = function(oClass, value) {
        oClass.tx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetValueColors] = function(oClass, value) {
        oClass.valueColors = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetValueColorPositions] = function(oClass, value) {
        oClass.valueColorPositions = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetDataPt] = function(oClass, value) {
        oClass.dataPt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetDataLabels] = function(oClass, value) {
        oClass.dataLabels = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetDataId] = function(oClass, value) {
        oClass.dataId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetLayoutPr] = function(oClass, value) {
        oClass.layoutPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetAxisId] = function(oClass, value) {
        oClass.axisId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetLayoutId] = function(oClass, value) {
        oClass.layoutId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetHidden] = function(oClass, value) {
        oClass.hidden = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetOwnerIdx] = function(oClass, value) {
        oClass.ownerIdx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetUniqueId] = function(oClass, value) {
        oClass.uniqueId = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Series_SetFormatIdx] = function(oClass, value) {
        oClass.formatIdx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetTx] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetValueColors] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetValueColorPositions] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetDataPt] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetDataLabels] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetDataId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetLayoutPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetAxisId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetLayoutId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetHidden] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetOwnerIdx] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetUniqueId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Series_SetFormatIdx] = window['AscDFH'].CChangesDrawingsString;
    function CSeries() {
        CBaseChartObject.call(this);
        this.tx = null;
        this.spPr = null;
        this.valueColors = null;
        this.valueColorPositions = null;
        this.dataPt = null;
        this.dataLabels = null;
        this.dataId = null;
        this.layoutPr = null;
        this.axisId = null;
        this.extLst = null;
        this.layoutId = null;
        this.hidden = null;
        this.ownerIdx = null;
        this.uniqueId = null;
        this.formatIdx = null;
    }

    InitClass(CSeries, CBaseChartObject, AscDFH.historyitem_type_Series);

    CSeries.prototype.setTx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetTx, this.tx, pr));
        this.tx = pr;
    };
    CSeries.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CSeries.prototype.setValueColors = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetValueColors, this.valueColors, pr));
        this.valueColors = pr;
    };
    CSeries.prototype.setValueColorPositions = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetValueColorPositions, this.valueColorPositions, pr));
        this.valueColorPositions = pr;
    };
    CSeries.prototype.setDataPt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetDataPt, this.dataPt, pr));
        this.dataPt = pr;
    };
    CSeries.prototype.setDataLabels = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetDataLabels, this.dataLabels, pr));
        this.dataLabels = pr;
    };
    CSeries.prototype.setDataId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetDataId, this.dataId, pr));
        this.dataId = pr;
    };
    CSeries.prototype.setLayoutPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetLayoutPr, this.layoutPr, pr));
        this.layoutPr = pr;
    };
    CSeries.prototype.setAxisId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetAxisId, this.axisId, pr));
        this.axisId = pr;
    };
    CSeries.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CSeries.prototype.setLayoutId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetLayoutId, this.layoutId, pr));
        this.layoutId = pr;
    };
    CSeries.prototype.setHidden = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetHidden, this.hidden, pr));
        this.hidden = pr;
    };
    CSeries.prototype.setOwnerIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetOwnerIdx, this.ownerIdx, pr));
        this.ownerIdx = pr;
    };
    CSeries.prototype.setUniqueId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetUniqueId, this.uniqueId, pr));
        this.uniqueId = pr;
    };
    CSeries.prototype.setFormatIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Series_SetFormatIdx, this.formatIdx, pr));
        this.formatIdx = pr;
    };
    window['AscFormat'].CSeries = CSeries;

    // SeriesElementVisibilities
    drawingsChangesMap[AscDFH.historyitem_SeriesElementVisibilities_SetConnectorLines] = function(oClass, value) {
        oClass.connectorLines = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesElementVisibilities_SetMeanLine] = function(oClass, value) {
        oClass.meanLine = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesElementVisibilities_SetMeanMarker] = function(oClass, value) {
        oClass.meanMarker = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesElementVisibilities_SetNonoutliers] = function(oClass, value) {
        oClass.nonoutliers = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesElementVisibilities_SetOutliers] = function(oClass, value) {
        oClass.outliers = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_SeriesElementVisibilities_SetConnectorLines] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesElementVisibilities_SetMeanLine] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesElementVisibilities_SetMeanMarker] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesElementVisibilities_SetNonoutliers] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesElementVisibilities_SetOutliers] = window['AscDFH'].CChangesDrawingsString;
    function CSeriesElementVisibilities() {
        CBaseChartObject.call(this);
        this.connectorLines = null;
        this.meanLine = null;
        this.meanMarker = null;
        this.nonoutliers = null;
        this.outliers = null;
    }

    InitClass(CSeriesElementVisibilities, CBaseChartObject, AscDFH.historyitem_type_SeriesElementVisibilities);

    CSeriesElementVisibilities.prototype.setConnectorLines = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesElementVisibilities_SetConnectorLines, this.connectorLines, pr));
        this.connectorLines = pr;
    };
    CSeriesElementVisibilities.prototype.setMeanLine = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesElementVisibilities_SetMeanLine, this.meanLine, pr));
        this.meanLine = pr;
    };
    CSeriesElementVisibilities.prototype.setMeanMarker = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesElementVisibilities_SetMeanMarker, this.meanMarker, pr));
        this.meanMarker = pr;
    };
    CSeriesElementVisibilities.prototype.setNonoutliers = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesElementVisibilities_SetNonoutliers, this.nonoutliers, pr));
        this.nonoutliers = pr;
    };
    CSeriesElementVisibilities.prototype.setOutliers = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesElementVisibilities_SetOutliers, this.outliers, pr));
        this.outliers = pr;
    };
    window['AscFormat'].CSeriesElementVisibilities = CSeriesElementVisibilities;

    // SeriesLayoutProperties
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetParentLabelLayout] = function(oClass, value) {
        oClass.parentLabelLayout = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetRegionLabelLayout] = function(oClass, value) {
        oClass.regionLabelLayout = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetVisibility] = function(oClass, value) {
        oClass.visibility = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetAggregation] = function(oClass, value) {
        oClass.aggregation = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetBinning] = function(oClass, value) {
        oClass.binning = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetGeography] = function(oClass, value) {
        oClass.geography = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetStatistics] = function(oClass, value) {
        oClass.statistics = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetSubtotals] = function(oClass, value) {
        oClass.subtotals = value;
    };
    drawingsChangesMap[AscDFH.historyitem_SeriesLayoutProperties_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetParentLabelLayout] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetRegionLabelLayout] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetVisibility] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetAggregation] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetBinning] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetGeography] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetStatistics] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetSubtotals] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayoutProperties_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CSeriesLayoutProperties() {
        CBaseChartObject.call(this);
        this.parentLabelLayout = null;
        this.regionLabelLayout = null;
        this.visibility = null;
        this.aggregation = null;
        this.binning = null;
        this.geography = null;
        this.statistics = null;
        this.subtotals = null;
        this.extLst = null;
    }

    InitClass(CSeriesLayoutProperties, CBaseChartObject, AscDFH.historyitem_type_SeriesLayoutProperties);

    CSeriesLayoutProperties.prototype.setParentLabelLayout = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetParentLabelLayout, this.parentLabelLayout, pr));
        this.parentLabelLayout = pr;
    };
    CSeriesLayoutProperties.prototype.setRegionLabelLayout = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetRegionLabelLayout, this.regionLabelLayout, pr));
        this.regionLabelLayout = pr;
    };
    CSeriesLayoutProperties.prototype.setVisibility = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetVisibility, this.visibility, pr));
        this.visibility = pr;
    };
    CSeriesLayoutProperties.prototype.setAggregation = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_SeriesLayoutProperties_SetAggregation, this.aggregation, pr));
        this.aggregation = pr;
    };
    CSeriesLayoutProperties.prototype.setBinning = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetBinning, this.binning, pr));
        this.binning = pr;
    };
    CSeriesLayoutProperties.prototype.setGeography = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetGeography, this.geography, pr));
        this.geography = pr;
    };
    CSeriesLayoutProperties.prototype.setStatistics = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetStatistics, this.statistics, pr));
        this.statistics = pr;
    };
    CSeriesLayoutProperties.prototype.setSubtotals = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetSubtotals, this.subtotals, pr));
        this.subtotals = pr;
    };
    CSeriesLayoutProperties.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_SeriesLayoutProperties_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CSeriesLayoutProperties = CSeriesLayoutProperties;

    // Statistics
    drawingsChangesMap[AscDFH.historyitem_Statistics_SetQuartileMethod] = function(oClass, value) {
        oClass.quartileMethod = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Statistics_SetQuartileMethod] = window['AscDFH'].CChangesDrawingsString;
    function CStatistics() {
        CBaseChartObject.call(this);
        this.quartileMethod = null;
    }

    InitClass(CStatistics, CBaseChartObject, AscDFH.historyitem_type_Statistics);

    CStatistics.prototype.setQuartileMethod = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Statistics_SetQuartileMethod, this.quartileMethod, pr));
        this.quartileMethod = pr;
    };
    window['AscFormat'].CStatistics = CStatistics;

    // StringDimension
    drawingsChangesMap[AscDFH.historyitem_StringDimension_SetF] = function(oClass, value) {
        oClass.f = value;
    };
    drawingsChangesMap[AscDFH.historyitem_StringDimension_SetNf] = function(oClass, value) {
        oClass.nf = value;
    };
    drawingsChangesMap[AscDFH.historyitem_StringDimension_SetLvl] = function(oClass, value) {
        oClass.lvl = value;
    };
    drawingsChangesMap[AscDFH.historyitem_StringDimension_SetType] = function(oClass, value) {
        oClass.type = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_StringDimension_SetF] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StringDimension_SetNf] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StringDimension_SetLvl] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StringDimension_SetType] = window['AscDFH'].CChangesDrawingsString;
    function CStringDimension() {
        CBaseChartObject.call(this);
        this.f = null;
        this.nf = null;
        this.lvl = null;
        this.type = null;
    }

    InitClass(CStringDimension, CBaseChartObject, AscDFH.historyitem_type_StringDimension);

    CStringDimension.prototype.setF = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringDimension_SetF, this.f, pr));
        this.f = pr;
    };
    CStringDimension.prototype.setNf = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringDimension_SetNf, this.nf, pr));
        this.nf = pr;
    };
    CStringDimension.prototype.setLvl = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringDimension_SetLvl, this.lvl, pr));
        this.lvl = pr;
    };
    CStringDimension.prototype.setType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringDimension_SetType, this.type, pr));
        this.type = pr;
    };
    window['AscFormat'].CStringDimension = CStringDimension;

    // StringLevel
    drawingsChangesMap[AscDFH.historyitem_StringLevel_SetPt] = function(oClass, value) {
        oClass.pt = value;
    };
    drawingsChangesMap[AscDFH.historyitem_StringLevel_SetPtCount] = function(oClass, value) {
        oClass.ptCount = value;
    };
    drawingsChangesMap[AscDFH.historyitem_StringLevel_SetName] = function(oClass, value) {
        oClass.name = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_StringLevel_SetPt] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StringLevel_SetPtCount] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_StringLevel_SetName] = window['AscDFH'].CChangesDrawingsString;
    function CStringLevel() {
        CBaseChartObject.call(this);
        this.pt = null;
        this.ptCount = null;
        this.name = null;
    }

    InitClass(CStringLevel, CBaseChartObject, AscDFH.historyitem_type_StringLevel);

    CStringLevel.prototype.setPt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringLevel_SetPt, this.pt, pr));
        this.pt = pr;
    };
    CStringLevel.prototype.setPtCount = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringLevel_SetPtCount, this.ptCount, pr));
        this.ptCount = pr;
    };
    CStringLevel.prototype.setName = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringLevel_SetName, this.name, pr));
        this.name = pr;
    };
    window['AscFormat'].CStringLevel = CStringLevel;

    // StringValue
    drawingsChangesMap[AscDFH.historyitem_StringValue_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_StringValue_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CStringValue() {
        CBaseChartObject.call(this);
        this.idx = null;
    }

    InitClass(CStringValue, CBaseChartObject, AscDFH.historyitem_type_StringValue);

    CStringValue.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_StringValue_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CStringValue = CStringValue;

    // Subtotals
    drawingsChangesMap[AscDFH.historyitem_Subtotals_SetIdx] = function(oClass, value) {
        oClass.idx = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Subtotals_SetIdx] = window['AscDFH'].CChangesDrawingsString;
    function CSubtotals() {
        CBaseChartObject.call(this);
        this.idx = null;
    }

    InitClass(CSubtotals, CBaseChartObject, AscDFH.historyitem_type_Subtotals);

    CSubtotals.prototype.setIdx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Subtotals_SetIdx, this.idx, pr));
        this.idx = pr;
    };
    window['AscFormat'].CSubtotals = CSubtotals;

    // Text
    drawingsChangesMap[AscDFH.historyitem_Text_SetTxData] = function(oClass, value) {
        oClass.txData = value;
    };
    drawingsChangesMap[AscDFH.historyitem_Text_SetRich] = function(oClass, value) {
        oClass.rich = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Text_SetTxData] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Text_SetRich] = window['AscDFH'].CChangesDrawingsString;
    function CText() {
        CBaseChartObject.call(this);
        this.txData = null;
        this.rich = null;
    }

    InitClass(CText, CBaseChartObject, AscDFH.historyitem_type_Text);

    CText.prototype.setTxData = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Text_SetTxData, this.txData, pr));
        this.txData = pr;
    };
    CText.prototype.setRich = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Text_SetRich, this.rich, pr));
        this.rich = pr;
    };
    window['AscFormat'].CText = CText;

    // TextData
    drawingsChangesMap[AscDFH.historyitem_TextData_SetF] = function(oClass, value) {
        oClass.f = value;
    };
    drawingsChangesMap[AscDFH.historyitem_TextData_SetV] = function(oClass, value) {
        oClass.v = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_TextData_SetF] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_TextData_SetV] = window['AscDFH'].CChangesDrawingsString;
    function CTextData() {
        CBaseChartObject.call(this);
        this.f = null;
        this.v = null;
    }

    InitClass(CTextData, CBaseChartObject, AscDFH.historyitem_type_TextData);

    CTextData.prototype.setF = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_TextData_SetF, this.f, pr));
        this.f = pr;
    };
    CTextData.prototype.setV = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_TextData_SetV, this.v, pr));
        this.v = pr;
    };
    window['AscFormat'].CTextData = CTextData;

    // // TickLabels (unused)
    // drawingsChangesMap[AscDFH.historyitem_TickLabels_SetExtLst] = function(oClass, value) {
    //     oClass.extLst = value;
    // };
    // AscDFH.changesFactory[AscDFH.historyitem_TickLabels_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    // function CTickLabels() {
    //     CBaseChartObject.call(this);
    //     this.extLst = null;
    // }

    // InitClass(CTickLabels, CBaseChartObject, AscDFH.historyitem_type_TickLabels);

    // CTickLabels.prototype.setExtLst = function(pr) {
    //     History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_TickLabels_SetExtLst, this.extLst, pr));
    //     this.extLst = pr;
    // };
    // window['AscFormat'].CTickLabels = CTickLabels;

    // TickMarks
    drawingsChangesMap[AscDFH.historyitem_TickMarks_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_TickMarks_SetType] = function(oClass, value) {
        oClass.type = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_TickMarks_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_TickMarks_SetType] = window['AscDFH'].CChangesDrawingsString;
    function CTickMarks() {
        CBaseChartObject.call(this);
        this.extLst = null;
        this.type = null;
    }

    InitClass(CTickMarks, CBaseChartObject, AscDFH.historyitem_type_TickMarks);

    CTickMarks.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_TickMarks_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CTickMarks.prototype.setType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_TickMarks_SetType, this.type, pr));
        this.type = pr;
    };
    window['AscFormat'].CTickMarks = CTickMarks;

    // ValueAxisScaling
    drawingsChangesMap[AscDFH.historyitem_ValueAxisScaling_SetMax] = function(oClass, value) {
        oClass.max = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueAxisScaling_SetMin] = function(oClass, value) {
        oClass.min = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueAxisScaling_SetMajorUnit] = function(oClass, value) {
        oClass.majorUnit = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueAxisScaling_SetMinorUnit] = function(oClass, value) {
        oClass.minorUnit = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ValueAxisScaling_SetMax] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueAxisScaling_SetMin] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueAxisScaling_SetMajorUnit] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueAxisScaling_SetMinorUnit] = window['AscDFH'].CChangesDrawingsString;
    function CValueAxisScaling() {
        CBaseChartObject.call(this);
        this.max = null;
        this.min = null;
        this.majorUnit = null;
        this.minorUnit = null;
    }

    InitClass(CValueAxisScaling, CBaseChartObject, AscDFH.historyitem_type_ValueAxisScaling);

    CValueAxisScaling.prototype.setMax = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueAxisScaling_SetMax, this.max, pr));
        this.max = pr;
    };
    CValueAxisScaling.prototype.setMin = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueAxisScaling_SetMin, this.min, pr));
        this.min = pr;
    };
    CValueAxisScaling.prototype.setMajorUnit = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueAxisScaling_SetMajorUnit, this.majorUnit, pr));
        this.majorUnit = pr;
    };
    CValueAxisScaling.prototype.setMinorUnit = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueAxisScaling_SetMinorUnit, this.minorUnit, pr));
        this.minorUnit = pr;
    };
    window['AscFormat'].CValueAxisScaling = CValueAxisScaling;

    // ValueColorEndPosition
    drawingsChangesMap[AscDFH.historyitem_ValueColorEndPosition_SetExtremeValue] = function(oClass, value) {
        oClass.extremeValue = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorEndPosition_SetNumber] = function(oClass, value) {
        oClass.number = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorEndPosition_SetPercent] = function(oClass, value) {
        oClass.percent = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorEndPosition_SetExtremeValue] = window['AscDFH'].CChangesDrawingsBool;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorEndPosition_SetNumber] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorEndPosition_SetPercent] = window['AscDFH'].CChangesDrawingsString;
    function CValueColorEndPosition() {
        CBaseChartObject.call(this);
        this.extremeValue = null;
        this.number = null;
        this.percent = null;
    }

    InitClass(CValueColorEndPosition, CBaseChartObject, AscDFH.historyitem_type_ValueColorEndPosition);

    CValueColorEndPosition.prototype.setExtremeValue = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsBool(this, AscDFH.historyitem_ValueColorEndPosition_SetExtremeValue, this.extremeValue, pr));
        this.extremeValue = pr;
    };
    CValueColorEndPosition.prototype.setNumber = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorEndPosition_SetNumber, this.number, pr));
        this.number = pr;
    };
    CValueColorEndPosition.prototype.setPercent = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorEndPosition_SetPercent, this.percent, pr));
        this.percent = pr;
    };
    window['AscFormat'].CValueColorEndPosition = CValueColorEndPosition;

    // ValueColorMiddlePosition
    drawingsChangesMap[AscDFH.historyitem_ValueColorMiddlePosition_SetNumber] = function(oClass, value) {
        oClass.number = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorMiddlePosition_SetPercent] = function(oClass, value) {
        oClass.percent = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorMiddlePosition_SetNumber] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorMiddlePosition_SetPercent] = window['AscDFH'].CChangesDrawingsString;
    function CValueColorMiddlePosition() {
        CBaseChartObject.call(this);
        this.number = null;
        this.percent = null;
    }

    InitClass(CValueColorMiddlePosition, CBaseChartObject, AscDFH.historyitem_type_ValueColorMiddlePosition);

    CValueColorMiddlePosition.prototype.setNumber = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorMiddlePosition_SetNumber, this.number, pr));
        this.number = pr;
    };
    CValueColorMiddlePosition.prototype.setPercent = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorMiddlePosition_SetPercent, this.percent, pr));
        this.percent = pr;
    };
    window['AscFormat'].CValueColorMiddlePosition = CValueColorMiddlePosition;

    // ValueColorPositions
    drawingsChangesMap[AscDFH.historyitem_ValueColorPositions_SetMin] = function(oClass, value) {
        oClass.min = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorPositions_SetMid] = function(oClass, value) {
        oClass.mid = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorPositions_SetMax] = function(oClass, value) {
        oClass.max = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColorPositions_SetCount] = function(oClass, value) {
        oClass.count = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorPositions_SetMin] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorPositions_SetMid] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorPositions_SetMax] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColorPositions_SetCount] = window['AscDFH'].CChangesDrawingsString;
    function CValueColorPositions() {
        CBaseChartObject.call(this);
        this.min = null;
        this.mid = null;
        this.max = null;
        this.count = null;
    }

    InitClass(CValueColorPositions, CBaseChartObject, AscDFH.historyitem_type_ValueColorPositions);

    CValueColorPositions.prototype.setMin = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorPositions_SetMin, this.min, pr));
        this.min = pr;
    };
    CValueColorPositions.prototype.setMid = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorPositions_SetMid, this.mid, pr));
        this.mid = pr;
    };
    CValueColorPositions.prototype.setMax = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorPositions_SetMax, this.max, pr));
        this.max = pr;
    };
    CValueColorPositions.prototype.setCount = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColorPositions_SetCount, this.count, pr));
        this.count = pr;
    };
    window['AscFormat'].CValueColorPositions = CValueColorPositions;

    // ValueColors
    drawingsChangesMap[AscDFH.historyitem_ValueColors_SetMinColor] = function(oClass, value) {
        oClass.minColor = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColors_SetMidColor] = function(oClass, value) {
        oClass.midColor = value;
    };
    drawingsChangesMap[AscDFH.historyitem_ValueColors_SetMaxColor] = function(oClass, value) {
        oClass.maxColor = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_ValueColors_SetMinColor] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColors_SetMidColor] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_ValueColors_SetMaxColor] = window['AscDFH'].CChangesDrawingsString;
    function CValueColors() {
        CBaseChartObject.call(this);
        this.minColor = null;
        this.midColor = null;
        this.maxColor = null;
    }

    InitClass(CValueColors, CBaseChartObject, AscDFH.historyitem_type_ValueColors);

    CValueColors.prototype.setMinColor = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColors_SetMinColor, this.minColor, pr));
        this.minColor = pr;
    };
    CValueColors.prototype.setMidColor = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColors_SetMidColor, this.midColor, pr));
        this.midColor = pr;
    };
    CValueColors.prototype.setMaxColor = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_ValueColors_SetMaxColor, this.maxColor, pr));
        this.maxColor = pr;
    };
    window['AscFormat'].CValueColors = CValueColors;

    // Simple Types

    
    // SidePos
    drawingsChangesMap[AscDFH.historyitem_SidePos_SetSidePos] = function(oClass, value) {
        oClass.sidePos = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_SidePos_SetSidePos] = window['AscDFH'].CChangesDrawingsLong;
    function CSidePos() {
        CBaseChartObject.call(this);
        this.sidePos = null;
    }

    InitClass(CSidePos, CBaseChartObject, AscDFH.historyitem_type_SidePos);

    CSidePos.prototype.setSidePos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SidePos_SetSidePos, this.sidePos, pr));
        this.sidePos = pr;
    };
    window['AscFormat'].CSidePos = CSidePos;

    // PosAlign
    drawingsChangesMap[AscDFH.historyitem_PosAlign_SetPosAlign] = function(oClass, value) {
        oClass.posAlign = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_PosAlign_SetPosAlign] = window['AscDFH'].CChangesDrawingsLong;
    function CPosAlign() {
        CBaseChartObject.call(this);
        this.posAlign = null;
    }

    InitClass(CPosAlign, CBaseChartObject, AscDFH.historyitem_type_PosAlign);

    CPosAlign.prototype.setPosAlign = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_PosAlign_SetPosAlign, this.posAlign, pr));
        this.posAlign = pr;
    };
    window['AscFormat'].CPosAlign = CPosAlign;

    // AxisUnit
    drawingsChangesMap[AscDFH.historyitem_AxisUnit_SetAxisUnit] = function(oClass, value) {
        oClass.axisUnit = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnit_SetAxisUnit] = window['AscDFH'].CChangesDrawingsLong;
    function CAxisUnit() {
        CBaseChartObject.call(this);
        this.axisUnit = null;
    }

    InitClass(CAxisUnit, CBaseChartObject, AscDFH.historyitem_type_AxisUnit);

    CAxisUnit.prototype.setAxisUnit = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_AxisUnit_SetAxisUnit, this.axisUnit, pr));
        this.axisUnit = pr;
    };
    window['AscFormat'].CAxisUnit = CAxisUnit;

    // FormulaDirection
    drawingsChangesMap[AscDFH.historyitem_FormulaDirection_SetFormulaDirection] = function(oClass, value) {
        oClass.formulaDirection = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_FormulaDirection_SetFormulaDirection] = window['AscDFH'].CChangesDrawingsLong;
    function CFormulaDirection() {
        CBaseChartObject.call(this);
        this.formulaDirection = null;
    }

    InitClass(CFormulaDirection, CBaseChartObject, AscDFH.historyitem_type_FormulaDirection);

    CFormulaDirection.prototype.setAxisUnit = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_FormulaDirection_SetFormulaDirection, this.formulaDirection, pr));
        this.formulaDirection = pr;
    };
    window['AscFormat'].CFormulaDirection = CFormulaDirection;

    // IntervalClosedSide
    drawingsChangesMap[AscDFH.historyitem_IntervalClosedSide_SetIntervalClosedSide] = function(oClass, value) {
        oClass.intervalClosedSide = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_IntervalClosedSide_SetIntervalClosedSide] = window['AscDFH'].CChangesDrawingsLong;
    function CIntervalClosedSide() {
        CBaseChartObject.call(this);
        this.intervalClosedSide = null;
    }

    InitClass(CIntervalClosedSide, CBaseChartObject, AscDFH.historyitem_type_IntervalClosedSide);

    CIntervalClosedSide.prototype.setIntervalClosedSide = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_IntervalClosedSide_SetIntervalClosedSide, this.side, pr));
        this.intervalClosedSide = pr;
    };
    window['AscFormat'].CIntervalClosedSide = CIntervalClosedSide;

    // NumericDimensionType
    drawingsChangesMap[AscDFH.historyitem_NumericDimensionType_SetNumericDimensionType] = function(oClass, value) {
        oClass.numericDimensionType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_NumericDimensionType_SetNumericDimensionType] = window['AscDFH'].CChangesDrawingsLong;
    function CNumericDimensionType() {
        CBaseChartObject.call(this);
        this.numericDimensionType = null;
    }

    InitClass(CNumericDimensionType, CBaseChartObject, AscDFH.historyitem_type_NumericDimensionType);

    CNumericDimensionType.prototype.setNumericDimensionType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_NumericDimensionType_SetNumericDimensionType, this.numericDimensionType, pr));
        this.numericDimensionType = pr;
    };
    window['AscFormat'].CNumericDimensionType = CNumericDimensionType;

    // QuartileMethod
    drawingsChangesMap[AscDFH.historyitem_QuartileMethod_SetQuartileMethod] = function(oClass, value) {
        oClass.quartileMethod = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_QuartileMethod_SetQuartileMethod] = window['AscDFH'].CChangesDrawingsLong;
    function CQuartileMethod() {
        CBaseChartObject.call(this);
        this.quartileMethod = null;
    }

    InitClass(CQuartileMethod, CBaseChartObject, AscDFH.historyitem_type_QuartileMethod);

    CQuartileMethod.prototype.setQuartileMethod = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_QuartileMethod_SetQuartileMethod, this.quartileMethod, pr));
        this.quartileMethod = pr;
    };
    window['AscFormat'].CQuartileMethod = CQuartileMethod;

    // DataLabelPos
    drawingsChangesMap[AscDFH.historyitem_DataLabelPos_SetDataLabelPos] = function(oClass, value) {
        oClass.dataLabelPos = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_DataLabelPos_SetDataLabelPos] = window['AscDFH'].CChangesDrawingsLong;
    function CDataLabelPos() {
        CBaseChartObject.call(this);
        this.dataLabelPos = null;
    }

    InitClass(CDataLabelPos, CBaseChartObject, AscDFH.historyitem_type_DataLabelPos);

    CDataLabelPos.prototype.setDataLabelPos = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_DataLabelPos_SetDataLabelPos, this.dataLabelPos, pr));
        this.dataLabelPos = pr;
    };
    window['AscFormat'].CDataLabelPos = CDataLabelPos;

    // SeriesLayout
    drawingsChangesMap[AscDFH.historyitem_SeriesLayout_SetSeriesLayout] = function(oClass, value) {
        oClass.seriesLayout = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_SeriesLayout_SetSeriesLayout] = window['AscDFH'].CChangesDrawingsLong;
    function CSeriesLayout() {
        CBaseChartObject.call(this);
        this.seriesLayout = null;
    }

    InitClass(CSeriesLayout, CBaseChartObject, AscDFH.historyitem_type_SeriesLayout);

    CSeriesLayout.prototype.setSeriesLayout = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_SeriesLayout_SetSeriesLayout, this.seriesLayout, pr));
        this.seriesLayout = pr;
    };
    window['AscFormat'].CSeriesLayout = CSeriesLayout;

    // TickMarksType
    drawingsChangesMap[AscDFH.historyitem_TickMarksType_SetTickMarksType] = function(oClass, value) {
        oClass.tickMarksType = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_TickMarksType_SetTickMarksType] = window['AscDFH'].CChangesDrawingsLong;
    function CTickMarksType() {
        CBaseChartObject.call(this);
        this.tickMarksType = null;
    }

    InitClass(CTickMarksType, CBaseChartObject, AscDFH.historyitem_type_TickMarksType);

    CTickMarksType.prototype.setTickMarksType = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsLong(this, AscDFH.historyitem_TickMarksType_SetTickMarksType, this.tickMarksType, pr));
        this.tickMarksType = pr;
    };
    window['AscFormat'].CTickMarksType = CTickMarksType;

    // template
    drawingsChangesMap[AscDFH.historyitem_Address_SetTest] = function(oClass, value) {
        oClass.test = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Address_SetTest] = window['AscDFH'].CChangesDrawingsString;
    function CTest() {
        CBaseChartObject.call(this);
        this.test = null;
    }

    InitClass(CTest, CBaseChartObject, AscDFH.historyitem_type_Test);

    CTest.prototype.setTest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetTest, this.test, pr));
        this.test = pr;
    };
    window['AscFormat'].CTest = CTest;
    // end template
    
    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CAddress = CAddress;
})(window);