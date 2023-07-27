"use strict";

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
    function(window, undefined) {

    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    var drawingContentChanges = window['AscDFH'].drawingContentChanges;

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

    drawingsChangesMap[AscDFH.historyitem_Aggregation_SetTest] = function(oClass, value) {
        oClass.test = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Aggregation_SetTest] = window['AscDFH'].CChangesDrawingsString;
    function CAggregation() { // todo
        CBaseChartObject.call(this);
        this.test = null;
    }

    InitClass(CAggregation, CBaseChartObject, AscDFH.historyitem_type_Aggregation);

    CAggregation.prototype.setTest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Address_SetTest, this.test, pr));
        this.test = pr;
    };
    window['AscFormat'].CAggregation = CAggregation;

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
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetCatScaling] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetValScaling] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTitle] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetUnits] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMajorGridlines] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMinorGridlines] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMajorTickMarks] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetMinorTickMarks] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTickLabels] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetNumFmt] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetId] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_Axis_SetHidden] = window['AscDFH'].CChangesDrawingsString;

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
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetCatScaling, this.catScaling, pr));
        this.catScaling = pr;
    };
    CAxis.prototype.setValScaling = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetValScaling, this.valScaling, pr));
        this.valScaling = pr;
    };
    CAxis.prototype.setTitle = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetTitle, this.title, pr));
        this.title = pr;
    };
    CAxis.prototype.setUnits = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetUnits, this.units, pr));
        this.units = pr;
    };
    CAxis.prototype.setMajorGridlines = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetMajorGridlines, this.majorGridlines, pr));
        this.majorGridlines = pr;
    };
    CAxis.prototype.setMinorGridlines = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetMinorGridlines, this.minorGridlines, pr));
        this.minorGridlines = pr;
    };
    CAxis.prototype.setMajorTickMarks = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetMajorTickMarks, this.majorTickMarks, pr));
        this.majorTickMarks = pr;
    };
    CAxis.prototype.setMinorTickMarks = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetMinorTickMarks, this.minorTickMarks, pr));
        this.minorTickMarks = pr;
    };
    CAxis.prototype.setTickLabels = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetTickLabels, this.tickLabels, pr));
        this.tickLabels = pr;
    };
    CAxis.prototype.setNumFmt = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetNumFmt, this.numFmt, pr));
        this.numFmt = pr;
    };
    CAxis.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CAxis.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CAxis.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CAxis.prototype.setId = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetId, this.id, pr));
        this.id = pr;
    };
    CAxis.prototype.setHidden = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Axis_SetHidden, this.hidden, pr));
        this.hidden = pr;
    };
    window['AscFormat'].CAxis = CAxis;

    // AxisTitle
    drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetTx] = function(oClass, value) {
        oClass.tx = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetSpPr] = function(oClass, value) {
        oClass.spPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetTxPr] = function(oClass, value) {
        oClass.txPr = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisTitle_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetTx] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetSpPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetTxPr] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisTitle_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    function CAxisTitle() {
        CBaseChartObject.call(this);
        this.tx = null;
        this.spPr = null;
        this.txPr = null;
        this.extLst = null;
    }

    InitClass(CAxisTitle, CBaseChartObject, AscDFH.historyitem_type_AxisTitle);

    CAxisTitle.prototype.setTx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisTitle_SetTx, this.tx, pr));
        this.tx = pr;
    };
    CAxisTitle.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisTitle_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CAxisTitle.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisTitle_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CAxisTitle.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisTitle_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CAxisTitle = CAxisTitle;

    // AxisUnits
    drawingsChangesMap[AscDFH.historyitem_AxisUnit_SetUnitsLabel] = function(oClass, value) {
        oClass.unitsLabel = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnit_SetExtLst] = function(oClass, value) {
        oClass.extLst = value;
    };
    drawingsChangesMap[AscDFH.historyitem_AxisUnit_SetUnit] = function(oClass, value) {
        oClass.unit = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnit_SetUnitsLabel] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnit_SetExtLst] = window['AscDFH'].CChangesDrawingsString;
    AscDFH.changesFactory[AscDFH.historyitem_AxisUnit_SetUnit] = window['AscDFH'].CChangesDrawingsString;
    function CAxisUnits() {
        CBaseChartObject.call(this);
        this.unitsLabel = null;
        this.extLst = null;
        this.unit = null;
    }

    InitClass(CAxisUnits, CBaseChartObject, AscDFH.historyitem_type_AxisUnits);

    CAxisUnits.prototype.setTest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnit_SetUnitsLabel, this.unitsLabel, pr));
        this.unitsLabel = pr;
    };
    CAxisUnits.prototype.setTest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnit_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    CAxisUnits.prototype.setTest = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnit_SetUnit, this.unit, pr));
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

    InitClass(CAxisUnitsLabel, CBaseChartObject, AscDFH.historyitem_type_Test);

    CAxisUnitsLabel.prototype.setTx = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnitsLabel_SetTx, this.tx, pr));
        this.tx = pr;
    };
    CAxisUnitsLabel.prototype.setSpPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnitsLabel_SetSpPr, this.spPr, pr));
        this.spPr = pr;
    };
    CAxisUnitsLabel.prototype.setTxPr = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnitsLabel_SetTxPr, this.txPr, pr));
        this.txPr = pr;
    };
    CAxisUnitsLabel.prototype.setExtLst = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_AxisUnitsLabel_SetExtLst, this.extLst, pr));
        this.extLst = pr;
    };
    window['AscFormat'].CAxisUnitsLabel = CAxisUnitsLabel;

    // Binning
    drawingsChangesMap[AscDFH.historyitem_Binning_SetTest] = function(oClass, value) {
        oClass.test = value;
    };
    AscDFH.changesFactory[AscDFH.historyitem_Binning_SetTest] = window['AscDFH'].CChangesDrawingsString;
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
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Binning_SetBinSize, this.binSize, pr));
        this.binSize = pr;
    };
    CBinning.prototype.setBinCount = function(pr) {
        History.CanAddChanges() && History.Add(new CChangesDrawingsString(this, AscDFH.historyitem_Binning_SetBinCount, this.binCount, pr));
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