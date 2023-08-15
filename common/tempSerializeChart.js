
// CAddress
var c_oserct_addressADDRESS1 = 0;
var c_oserct_addressCOUTNRYREGION = 1;
var c_oserct_addressADMINDISTRICT1 = 2;
var c_oserct_addressADMINDISTRICT2 = 3;
var c_oserct_addressPOSTALCODE = 4;
var c_oserct_addressLOCALITY = 5;
var c_oserct_addressISOCOUTRYCODE = 6;

BinaryChartWriter.prototype.WriteCT_Address = function (oVal) {
    var oThis = this;
    if(oVal.address1 !== null) {
        this.bs.WriteItem(c_oserct_addressADDRESS1, function() {
            oThis.memory.WriteString3(oVal.address1);
        });
    }
    if(oVal.countryRegion !== null) {
        this.bs.WriteItem(c_oserct_addressCOUTNRYREGION, function() {
            oThis.memory.WriteString3(oVal.countryRegion);
        });
    }
    if(oVal.adminDistrict1 !== null) {
        this.bs.WriteItem(c_oserct_addressADMINDISTRICT1, function() {
            oThis.memory.WriteString3(oVal.adminDistrict1);
        });
    }
    if(oVal.adminDistrict2 !== null) {
        this.bs.WriteItem(c_oserct_addressADMINDISTRICT2, function() {
            oThis.memory.WriteString3(oVal.adminDistrict2);
        });
    }
    if(oVal.postalCode !== null) {
        this.bs.WriteItem(c_oserct_addressPOSTALCODE, function() {
            oThis.memory.WriteString3(oVal.postalCode);
        });
    }
    if(oVal.locality !== null) {
        this.bs.WriteItem(c_oserct_addressLOCALITY, function() {
            oThis.memory.WriteString3(oVal.locality);
        });
    }
    if(oVal.isoCountryCode !== null) {
        this.bs.WriteItem(c_oserct_addressISOCOUTRYCODE, function() {
            oThis.memory.WriteString3(oVal.isoCountryCode);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Address = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_addressADDRESS1 === type)
    {
        val.setAddress1(this.stream.GetString2LE(length));
    }
    else if (c_oserct_addressCOUTNRYREGION === type)
    {
        val.setCountryRegion(this.stream.GetString2LE(length));
    }
    else if (c_oserct_addressADMINDISTRICT1 === type)
    {
        val.setAdminDistrict1(this.stream.GetString2LE(length));
    }
    else if (c_oserct_addressADMINDISTRICT2 === type)
    {
        val.setAdminDistrict2(this.stream.GetString2LE(length));
    } 
    else if (c_oserct_addressPOSTALCODE === type)
    {
        val.setPostalCode(this.stream.GetString2LE(length));
    }
    else if (c_oserct_addressLOCALITY === type)
    {
        val.setLocality(this.stream.GetString2LE(length));
    }
    else if (c_oserct_addressISOCOUTRYCODE === type)
    {
        val.setISOCountryCode(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CAxis
var c_oserct_axisCATSCALING = 0;
var c_oserct_axisVALSCALING = 1;
var c_oserct_axisTITLE = 2;
var c_oserct_axisUNITS = 3;
var c_oserct_axisMAJORGRIDLINES = 4;
var c_oserct_axisMINORGRIDLINES = 5;
var c_oserct_axisMAJORTICKMARKS = 6;
var c_oserct_axisMINORTICKMARKS = 7;
var c_oserct_axisTICKLABELS = 8;
var c_oserct_axisNUMFMT = 9;
var c_oserct_axisSPPR = 10;
var c_oserct_axisTXPR = 11;
var c_oserct_axisEXTLST = 12;
var c_oserct_axisID = 13;
var c_oserct_axisHIDDEN = 14;

BinaryChartWriter.prototype.WriteCT_Axis = function (oVal) {
    var oThis = this;
    if(oVal.catScaling !== null) {
        this.bs.WriteItem(c_oserct_axisCATSCALING, function() {
            oThis.WriteCT_CategoryAxisScaling(oVal.catScaling);
        });
    }
    if(oVal.valScaling !== null) {
        this.bs.WriteItem(c_oserct_axisVALSCALING, function() {
            oThis.WriteCT_ValueAxisScaling(oVal.valScaling);
        });
    }
    if(oVal.title !== null) {
        this.bs.WriteItem(c_oserct_axisTITLE, function() {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if(oVal.units !== null) {
        this.bs.WriteItem(c_oserct_axisUNITS, function() {
            oThis.WriteCT_AxisUnits(oVal.units);
        });
    }
    if(oVal.majorGridlines !== null) {
        this.bs.WriteItem(c_oserct_axisMAJORGRIDLINES, function() {
            oThis.WriteCT_Gridlines(oVal.majorGridlines);
        });
    }
    if(oVal.minorGridlines !== null) {
        this.bs.WriteItem(c_oserct_axisMINORGRIDLINES, function() {
            oThis.WriteCT_Gridlines(oVal.minorGridlines);
        });
    }
    if(oVal.majorTickMarks !== null) {
        this.bs.WriteItem(c_oserct_axisMAJORTICKMARKS, function() {
            oThis.WriteCT_TickMarks(oVal.majorTickMarks);
        });
    }
    if(oVal.minorTickMarks !== null) {
        this.bs.WriteItem(c_oserct_axisMINORTICKMARKS, function() {
            oThis.WriteCT_TickMarks(oVal.minorTickMarks);
        });
    }
    if(oVal.tickLabels !== null) {
        this.bs.WriteItem(c_oserct_axisTICKLABELS, function() {
            oThis.memory.WriteBool(oVal.tickLabels);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_axisNUMFMT, function() {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_axisSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_axisTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.extLst !== null) {
        this.bs.WriteItem(c_oserct_axisEXTLST, function() {
            oThis.WriteCT_extLst(oVal.extLst);
        });
    }
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_axisID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.hidden !== null) {
        this.bs.WriteItem(c_oserct_axisHIDDEN, function() {
            oThis.memory.WriteBool(oVal.hidden);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Axis = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_axisCATSCALING === type)
    {
        var oNewVal = new AscFormat.CCategoryAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_CategoryAxisScaling(t, l, oNewVal);
        });
        val.setCatScaling(oNewVal);
    }
    else if (c_oserct_axisVALSCALING === type)
    {
        var oNewVal = new AscFormat.CValueAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ValueAxisScaling(t, l, oNewVal);
        });
        val.setValScaling(oNewVal);
    }
    else if (c_oserct_axisTITLE === type)
    {
        var oNewVal = new AscFormat.CTitle();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        val.setTitle(oNewVal);
    }
    else if (c_oserct_axisUNITS === type)
    {
        var oNewVal = new AscFormat.CAxisUnits();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnits(t, l, oNewVal);
        });
        val.setUnits(oNewVal);
    }
    else if (c_oserct_axisMAJORGRIDLINES === type)
    {
        var oNewVal = new AscFormat.CGridlines();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Gridlines(t, l, oNewVal);
        });
        val.setMajorGridlines(oNewVal);
    }
    else if (c_oserct_axisMINORGRIDLINES === type)
    {
        var oNewVal = new AscFormat.CGridlines();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Gridlines(t, l, oNewVal);
        });
        val.setMinorGridlines(oNewVal);
    }
    else if (c_oserct_axisMAJORTICKMARKS === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMajorTickMarks(oNewVal);
    }
    else if (c_oserct_axisMINORTICKMARKS === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMinorTickMarks(oNewVal);
    }
    else if (c_oserct_axisTICKLABELS === type)
    {
        val.setTickLabels(this.stream.GetBool());
    }
    else if (c_oserct_axisNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_axisSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_axisTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_axisEXTLST === type)
    {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.setExtLst(oNewVal);
    }
    else if (c_oserct_axisID === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_axisHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CAxisUnits
var c_oserct_axisunitsUNITSLABEL = 0;
var c_oserct_axisunitsEXTLST = 1;
var c_oserct_axisunitsUNIT = 2;

BinaryChartWriter.prototype.WriteCT_AxisUnits = function (oVal) {
    var oThis = this;
    if(oVal.unitsLabel !== null) {
        this.bs.WriteItem(c_oserct_axisunitsUNITSLABEL, function() {
            oThis.WriteCT_AxisUnitsLabel(oVal.unitsLabel);
        });
    }
    if(oVal.extLst !== null) {
        this.bs.WriteItem(c_oserct_axisunitsEXTLST, function() {
            oThis.WriteCT_extLst(oVal.extLst);
        });
    }
    if(oVal.unit !== null) {
        this.bs.WriteItem(c_oserct_axisunitsUNIT, function() {
            oThis.WriteCT_AxisUnit(oVal.unit);
        });
    }
};
BinaryChartReader.prototype.ReadCT_AxisUnits = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_axisunitsUNITSLABEL === type)
    {
        var oNewVal = new AscFormat.CAxisUnitsLabel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnitsLabel(t, l, oNewVal);
        });
        val.setUnitsLabel(oNewVal);
    } else if (c_oserct_axisunitsEXTLST === type)
    {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_extLst(t, l, oNewVal);
        });
        // val.setExtLst(oNewVal);
    } else if (c_oserct_axisunitsUNIT === type)
    {
        var oNewVal = new AscFormat.CAxisUnit();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_AxisUnit(t, l, oNewVal);
        });
        val.setUnit(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// template
var c_oserct_testATTR1 = 0;
var c_oserct_testATTR2 = 1;

BinaryChartWriter.prototype.WriteCT_Test = function (oVal) {
    var oThis = this;
    if(oVal.attr1 !== null) {
        this.bs.WriteItem(c_oserct_testATTR1, function() {
            oThis.WriteCT_ATTR1(oVal.attr1);
        });
    }
    if(oVal.attr2 !== null) {
        this.bs.WriteItem(c_oserct_testATTR1, function() {
            oThis.WriteCT_Attr2(oVal.attr2);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Test = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_testATTR1 === type)
    {
        var oNewVal = new AscFormat.CAttr1();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Attr1(t, l, oNewVal);
        });
        val.setAttr1(oNewVal);
    } else if (c_oserct_testATTR2 === type)
    {
        var oNewVal = new AscFormat.CAttr2();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Attr2(t, l, oNewVal);
        });
        val.setAttr2(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
