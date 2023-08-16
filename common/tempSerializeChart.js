
// // CAddress (unused)
// var c_oserct_addressADDRESS1 = 0;
// var c_oserct_addressCOUTNRYREGION = 1;
// var c_oserct_addressADMINDISTRICT1 = 2;
// var c_oserct_addressADMINDISTRICT2 = 3;
// var c_oserct_addressPOSTALCODE = 4;
// var c_oserct_addressLOCALITY = 5;
// var c_oserct_addressISOCOUTRYCODE = 6;

// BinaryChartWriter.prototype.WriteCT_Address = function (oVal) {
//     var oThis = this;
//     if(oVal.address1 !== null) {
//         this.bs.WriteItem(c_oserct_addressADDRESS1, function() {
//             oThis.memory.WriteString3(oVal.address1);
//         });
//     }
//     if(oVal.countryRegion !== null) {
//         this.bs.WriteItem(c_oserct_addressCOUTNRYREGION, function() {
//             oThis.memory.WriteString3(oVal.countryRegion);
//         });
//     }
//     if(oVal.adminDistrict1 !== null) {
//         this.bs.WriteItem(c_oserct_addressADMINDISTRICT1, function() {
//             oThis.memory.WriteString3(oVal.adminDistrict1);
//         });
//     }
//     if(oVal.adminDistrict2 !== null) {
//         this.bs.WriteItem(c_oserct_addressADMINDISTRICT2, function() {
//             oThis.memory.WriteString3(oVal.adminDistrict2);
//         });
//     }
//     if(oVal.postalCode !== null) {
//         this.bs.WriteItem(c_oserct_addressPOSTALCODE, function() {
//             oThis.memory.WriteString3(oVal.postalCode);
//         });
//     }
//     if(oVal.locality !== null) {
//         this.bs.WriteItem(c_oserct_addressLOCALITY, function() {
//             oThis.memory.WriteString3(oVal.locality);
//         });
//     }
//     if(oVal.isoCountryCode !== null) {
//         this.bs.WriteItem(c_oserct_addressISOCOUTRYCODE, function() {
//             oThis.memory.WriteString3(oVal.isoCountryCode);
//         });
//     }
// };
// BinaryChartReader.prototype.ReadCT_Address = function (type, length, val) {
//     var res = c_oSerConstants.ReadOk;
//     var oThis = this;
//     var oNewVal;
//     if (c_oserct_addressADDRESS1 === type)
//     {
//         val.setAddress1(this.stream.GetString2LE(length));
//     }
//     else if (c_oserct_addressCOUTNRYREGION === type)
//     {
//         val.setCountryRegion(this.stream.GetString2LE(length));
//     }
//     else if (c_oserct_addressADMINDISTRICT1 === type)
//     {
//         val.setAdminDistrict1(this.stream.GetString2LE(length));
//     }
//     else if (c_oserct_addressADMINDISTRICT2 === type)
//     {
//         val.setAdminDistrict2(this.stream.GetString2LE(length));
//     } 
//     else if (c_oserct_addressPOSTALCODE === type)
//     {
//         val.setPostalCode(this.stream.GetString2LE(length));
//     }
//     else if (c_oserct_addressLOCALITY === type)
//     {
//         val.setLocality(this.stream.GetString2LE(length));
//     }
//     else if (c_oserct_addressISOCOUTRYCODE === type)
//     {
//         val.setISOCountryCode(this.stream.GetString2LE(length));
//     }
//     else
//     {
//         res = c_oSerConstants.ReadUnknown;
//     }
//     return res;
// };

// CAxis
var c_oserct_axisID  = 13
var c_oserct_chartExAxisHIDDEN = 14;
var c_oserct_chartExAxisCATSCALING = 0;
var c_oserct_chartExAxisVALSCALING = 1;
var c_oserct_chartExAxisTITLE = 2;
var c_oserct_axisUNITS = 3;
var c_oserct_axisNUMFMT = 9;
var c_oserct_axisMAJORTICKMARKS = 6;
var c_oserct_axisMINORTICKMARKS = 7;
var c_oserct_axisMAJORGRIDLINES = 4;
var c_oserct_axisMINORGRIDLINES = 5;
var c_oserct_axisTICKLABELS = 8;
var c_oserct_axisTXPR = 11;
var c_oserct_axisSPPR = 10;


BinaryChartWriter.prototype.WriteCT_Axis = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_axisID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.hidden !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisHIDDEN, function() {
            oThis.memory.WriteBool(oVal.hidden);
        });
    }
    if(oVal.catScaling !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisCATSCALING, function() {
            oThis.WriteCT_CategoryAxisScaling(oVal.catScaling);
        });
    }
    if(oVal.valScaling !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisVALSCALING, function() {
            oThis.WriteCT_ValueAxisScaling(oVal.valScaling);
        });
    }
    if(oVal.title !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTITLE, function() {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if(oVal.units !== null) {
        this.bs.WriteItem(c_oserct_axisUNITS, function() {
            oThis.WriteCT_AxisUnits(oVal.units);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_axisNUMFMT, function() {
            oThis.WriteCT_NumFmt(oVal.numFmt);
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
    if(oVal.tickLabels !== null) {
        this.bs.WriteItem(c_oserct_axisTICKLABELS, function() {
            oThis.memory.WriteBool(oVal.tickLabels);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_axisTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_axisSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Axis = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_axisID === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExAxisHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool());
    }
    else if (c_oserct_chartExAxisCATSCALING === type)
    {
        var oNewVal = new AscFormat.CCategoryAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_CategoryAxisScaling(t, l, oNewVal);
        });
        val.setCatScaling(oNewVal);
    }
    else if (c_oserct_chartExAxisVALSCALING === type)
    {
        var oNewVal = new AscFormat.CValueAxisScaling();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ValueAxisScaling(t, l, oNewVal);
        });
        val.setValScaling(oNewVal);
    }
    else if (c_oserct_chartExAxisTITLE === type)
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
    else if (c_oserct_axisNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
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
    else if (c_oserct_axisTICKLABELS === type)
    {
        val.setTickLabels(this.stream.GetBool());
    }
    else if (c_oserct_axisTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_axisSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CAxisUnits
var c_oserct_chartExAxisUnitTYPE = 0;
var c_oserct_chartExAxisUnitLABEL = 1;

BinaryChartWriter.prototype.WriteCT_AxisUnits = function (oVal) {
    var oThis = this;
    if(oVal.unitsLabel !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitLABEL, function() {
            oThis.WriteCT_AxisUnitsLabel(oVal.unitsLabel);
        });
    }
    if(oVal.unit !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitTYPE, function() {
            oThis.WriteCT_AxisUnit(oVal.unit);
        });
    }
};
BinaryChartReader.prototype.ReadCT_AxisUnits = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisUnitLABEL === type)
    {
        var oNewVal = new AscFormat.CAxisUnitsLabel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnitsLabel(t, l, oNewVal);
        });
        val.setUnitsLabel(oNewVal);
    }
    else if (c_oserct_chartExAxisUnitTYPE === type)
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

// CChartData
var c_oserct_chartExDATA = 0;
var c_oserct_chartExEXTERNALDATA = 1;

BinaryChartWriter.prototype.WriteCT_ChartData = function (oVal) {
    var oThis = this;
    if (oVal.data !== null) {
        for (var i = 0, length = oVal.data.length; i < length; ++i) {
            var oCurVal = oVal.data[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDATA, function () {
                    oThis.WriteCT_Data(oCurVal);
                });
            }
        }
    }
    if(oVal.externalData !== null) {
        this.bs.WriteItem(c_oserct_chartExEXTERNALDATA, function() {
            oThis.WriteCT_ExternalData(oVal.externalData);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDATA === type) {
        var oNewVal = new AscFormat.CData();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Data(t, l, oNewVal);
        });
        val.addData(oNewVal);
    }
    else if (c_oserct_chartExEXTERNALDATA === type)
    {
        var oNewVal = new AscFormat.CExternalData();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_ExternalData(t, l, oNewVal);
        });
        val.setExternalData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CExternalData (contains in ChartFormat.js)
var c_oserct_chartExExternalAUTOUPDATE  = 0;

BinaryChartWriter.prototype.WriteCT_ChartExExternalData = function (oVal) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oCurVal = oVal.m_autoUpdate;
    if (null != oCurVal) {
        this.bs.WriteItem(c_oserct_chartExExternalAUTOUPDATE, function () {
            oThis.WriteCT_Boolean(oCurVal);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartExExternalData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    if (c_oserct_externaldataAUTOUPDATE === type) {
        var oNewVal;
        oNewVal = {};
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Boolean(t, l, oNewVal);
        });
        val.m_autoUpdate = oNewVal;
    }
    else
        res = c_oSerConstants.ReadUnknown;
    return res;
};

// CChartEx
var c_oserct_chartExChartPLOTAREA = 0;
var c_oserct_chartExChartTITLE = 1;
var c_oserct_chartExChartLEGEND = 2;

BinaryChartWriter.prototype.WriteCT_ChartEx = function (oVal) {
    var oThis = this;
    if(oVal.plotArea !== null) {
        this.bs.WriteItem(c_oserct_chartExChartPLOTAREA, function() {
            oThis.WriteCT_PlotArea(oVal.plotArea);
        });
    }
    if(oVal.title !== null) {
        this.bs.WriteItem(c_oserct_chartExChartTITLE, function() {
            oThis.WriteCT_Title(oVal.title);
        });
    }
    if(oVal.legend !== null) {
        this.bs.WriteItem(c_oserct_chartExChartLEGEND, function() {
            oThis.WriteCT_Legend(oVal.legend);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartEx = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExChartPLOTAREA === type)
    {
        var oNewVal = new AscFormat.CPlotArea();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotArea(t, l, oNewVal);
        });
        val.setPlotArea(oNewVal);
    }
    else if (c_oserct_chartExChartTITLE === type)
    {
        var oNewVal = new AscFormat.Ctitle();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Title(t, l, oNewVal);
        });
        val.setTitle(oNewVal);
    }
    else if (c_oserct_chartExChartLEGEND === type)
    {
        var oNewVal = new AscFormat.CLegend();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Legend(t, l, oNewVal);
        });
        val.setLegend(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// template CChartExPlotArea
var c_oserct_chartExChartAREAREGION  = 0;
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
    }
    else if (c_oserct_testATTR2 === type)
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
    }
    else if (c_oserct_testATTR2 === type)
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
