
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
var c_oserct_chartExAxisID = 0
var c_oserct_chartExAxisHIDDEN = 1;
var c_oserct_chartExAxisCATSCALING = 2;
var c_oserct_chartExAxisVALSCALING = 3;
var c_oserct_chartExAxisTITLE = 4;
var c_oserct_chartExAxisUNIT = 5;
var c_oserct_chartExAxisNUMFMT = 6;
var c_oserct_chartExAxisMAJORTICK = 7;
var c_oserct_chartExAxisMINORTICK = 8;
var c_oserct_chartExAxisMAJORGRID = 9;
var c_oserct_chartExAxisMINORGRID = 10;
var c_oserct_chartExAxisTICKLABELS = 11;
var c_oserct_chartExAxisTXPR = 12;
var c_oserct_chartExAxisSPPR = 13;


BinaryChartWriter.prototype.WriteCT_Axis = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisID, function() {
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
        this.bs.WriteItem(c_oserct_chartExAxisUNIT, function() {
            oThis.WriteCT_AxisUnits(oVal.units);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisNUMFMT, function() {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if(oVal.majorTickMarks !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMAJORTICK, function() {
            oThis.WriteCT_TickMarks(oVal.majorTickMarks);
        });
    }
    if(oVal.minorTickMarks !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMINORTICK, function() {
            oThis.WriteCT_TickMarks(oVal.minorTickMarks);
        });
    }
    if(oVal.majorGridlines !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMAJORGRID, function() {
            oThis.WriteCT_Gridlines(oVal.majorGridlines);
        });
    }
    if(oVal.minorGridlines !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisMINORGRID, function() {
            oThis.WriteCT_Gridlines(oVal.minorGridlines);
        });
    }
    if(oVal.tickLabels !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTICKLABELS, function() {
            oThis.memory.WriteBool(oVal.tickLabels);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Axis = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisID === type)
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
    else if (c_oserct_chartExAxisUNIT === type)
    {
        var oNewVal = new AscFormat.CAxisUnits();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_AxisUnits(t, l, oNewVal);
        });
        val.setUnits(oNewVal);
    }
    else if (c_oserct_chartExAxisNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExAxisMAJORTICK === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMajorTickMarks(oNewVal);
    }
    else if (c_oserct_chartExAxisMINORTICK === type)
    {
        var oNewVal = new AscFormat.CTickMarks();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarks(t, l, oNewVal);
        });
        val.setMinorTickMarks(oNewVal);
    }
    else if (c_oserct_chartExAxisMAJORGRID === type)
    {
        var oNewVal = new AscFormat.CGridlines();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Gridlines(t, l, oNewVal);
        });
        val.setMajorGridlines(oNewVal);
    }
    else if (c_oserct_chartExAxisMINORGRID === type)
    {
        var oNewVal = new AscFormat.CGridlines();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Gridlines(t, l, oNewVal);
        });
        val.setMinorGridlines(oNewVal);
    }
    else if (c_oserct_chartExAxisTICKLABELS === type)
    {
        val.setTickLabels(this.stream.GetBool());
    }
    else if (c_oserct_chartExAxisTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExAxisSPPR === type)
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
            if (oCurVal !== null) {
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
    if (oCurVal !== null) {
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

// CChartExPlotArea
var c_oserct_chartExChartAREAREGION = 0;
var c_oserct_chartExChartAXIS = 1;
var c_oserct_chartExChartSPPR = 2;

BinaryChartWriter.prototype.WriteCT_ChartExPlotArea = function (oVal) {
    var oThis = this;
    if(oVal.plotAreaRegion !== null) {
        this.bs.WriteItem(c_oserct_chartExChartAREAREGION, function() {
            oThis.WriteCT_PlotAreaRegion(oVal.plotAreaRegion);
        });
    }
    if (oVal.axis !== null) {
        for (var i = 0, length = oVal.axis.length; i < length; ++i) {
            var oCurVal = oVal.axis[i];
            if (oCurVal !== null) {
                this.bs.WriteItem(c_oserct_chartExChartAXIS, function () {
                    oThis.WriteCT_Axis(oCurVal);
                });
            }
        }
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExChartSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartExPlotArea = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExChartAREAREGION === type)
    {
        var oNewVal = new AscFormat.CPlotAreaRegion();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ChartAreaRegion(t, l, oNewVal);
        });
        val.setPlotAreaRegion(oNewVal);
    }
    else if (c_oserct_chartExChartAXIS === type) {
        var oNewVal = new AscFormat.CAxis();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Axis(t, l, oNewVal);
        });
        val.addAxis(oNewVal);
    }
    else if (c_oserct_chartExChartSPPR === type)
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

// CPlotAreaRegion
var c_oserct_chartExAreaPLOTSURFACE = 0;
var c_oserct_chartExAreaSERIES = 1;

BinaryChartWriter.prototype.WriteCT_PlotAreaRegion = function (oVal) {
    var oThis = this;
    if(oVal.plotSurface !== null) {
        this.bs.WriteItem(c_oserct_chartExAreaPLOTSURFACE, function() {
            oThis.WriteCT_PlotSurface(oVal.plotSurface);
        });
    }
    if (oVal.series !== null) {
        for (var i = 0, length = oVal.series.length; i < length; ++i) {
            var oCurVal = oVal.series[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExAreaSERIES, function () {
                    oThis.WriteCT_Series(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_PlotAreaRegion = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAreaPLOTSURFACE === type)
    {
        var oNewVal = new AscFormat.CPlotSurface();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_PlotSurface(t, l, oNewVal);
        });
        val.setPlotSurface(oNewVal);
    }
    else if (c_oserct_chartExAreaSERIES === type) {
        var oNewVal = new AscFormat.CSeries();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Series(t, l, oNewVal);
        });
        val.addSeries(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CPlotSurface
var c_oserct_chartExPlotSurfaceSPPR = 0;

BinaryChartWriter.prototype.WriteCT_PlotSurface = function (oVal) {
    var oThis = this;
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExPlotSurfaceSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_PlotSurface = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExPlotSurfaceSPPR === type)
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

// CSeries
var c_oserct_chartExSeriesDATAPT = 0;
var c_oserct_chartExSeriesDATALABELS = 1;
var c_oserct_chartExSeriesLAYOUTPROPS = 2;
var c_oserct_chartExSeriesTEXT = 3;
var c_oserct_chartExSeriesAXIS = 4;
var c_oserct_chartExSeriesDATAID = 5;
var c_oserct_chartExSeriesSPPR = 6;
var c_oserct_chartExSeriesLAYOUTID = 7;
var c_oserct_chartExSeriesHIDDEN = 8;
var c_oserct_chartExSeriesOWNERIDX = 9;
var c_oserct_chartExSeriesFORMATIDX = 10;
var c_oserct_chartExSeriesUNIQUEID = 11;

BinaryChartWriter.prototype.WriteCT_Series = function (oVal) {
    var oThis = this;
    if (oVal.dataPt !== null) {
        for (var i = 0, length = oVal.dataPt.length; i < length; ++i) {
            var oCurVal = oVal.dataPt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSeriesDATAPT, function () {
                    oThis.WriteCT_DataPoint(oCurVal);
                });
            }
        }
    }
    if(oVal.dataLabels !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesDATALABELS, function() {
            oThis.WriteCT_DataLabels(oVal.dataLabels);
        });
    }
    if(oVal.layoutPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLAYOUTPROPS, function() {
            oThis.WriteCT_SeriesLayoutProperties(oVal.layoutPr);
        });
    }
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesTEXT, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if (oVal.axisId !== null) {
        for (var i = 0, length = oVal.axisId.length; i < length; ++i) {
            var oCurVal = oVal.axisId[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSeriesAXIS, function () {
                    oThis.WriteCT_Axis(oCurVal);
                });
            }
        }
    }
    if(oVal.dataId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesDATAID, function() {
            oThis.memory.WriteDouble2(oVal.dataId);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.layoutId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLAYOUTID, function() {
            oThis.WriteCT_SeriesLayout(oVal.layoutId);
        });
    }
    if(oVal.hidden !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesHIDDEN, function() {
            oThis.memory.WriteBool(oVal.hidden);
        });
    }
    if(oVal.ownerIdx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesOWNERIDX, function() {
            oThis.memory.WriteLong(oVal.ownerIdx);
        });
    }
    if(oVal.formatIdx !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesFORMATIDX, function() {
            oThis.memory.WriteLong(oVal.formatIdx);
        });
    }
    if(oVal.uniqueId !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesUNIQUEID, function() {
            oThis.memory.WriteString3(oVal.uniqueId);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Series = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesDATAPT === type) {
        var oNewVal = new AscFormat.CDataPoint();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataPoint(t, l, oNewVal);
        });
        val.addDataPt(oNewVal);
    }
    else if (c_oserct_chartExSeriesDATALABELS === type)
    {
        var oNewVal = new AscFormat.CDataLabels();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_DataLabels(t, l, oNewVal);
        });
        val.setDataLabels(oNewVal);
    }
    else if (c_oserct_chartExSeriesLAYOUTPROPS === type)
    {
        var oNewVal = new AscFormat.CSeriesLayoutProperties();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_SeriesLayoutProperties(t, l, oNewVal);
        });
        val.setLayoutPr(oNewVal);
    }
    else if (c_oserct_chartExSeriesTEXT === type)
    {
        val.setTx(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExSeriesAXIS === type) {
        var oNewVal = new AscFormat.CAxis();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Axis(t, l, oNewVal);
        });
        val.addAxisId(oNewVal);
    }
    else if (c_oserct_chartExSeriesDATAID === type)
    {
        val.setTx(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExSeriesSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExSeriesLAYOUTID === type)
    {
        var oNewVal = new AscFormat.CSeriesLayout();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_SeriesLayout(t, l, oNewVal);
        });
        val.setLayoutId(oNewVal);
    } 
    else if (c_oserct_chartExSeriesHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool());
    } 
    else if (c_oserct_chartExSeriesOWNERIDX === type) 
    {
        val.setOwnerIdx(this.stream.GetULongLE());
    } 
    else if (c_oserct_chartExSeriesFORMATIDX === type) 
    {
        val.setFormatIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExSeriesUNIQUEID === type)
    {
        val.setUniqueId(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CDataPoint
var c_oserct_chartExDataPointIDX = 0;
var c_oserct_chartExDataPointSPPR = 1;

BinaryChartWriter.prototype.WriteCT_DataPoint = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataPointIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataPointSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_DataPoint = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataPointIDX === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataPointSPPR === type)
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

// CDataLabels
var c_oserct_chartExDataLabelsPOS = 0;
var c_oserct_chartExDataLabelsNUMFMT = 1;
var c_oserct_chartExDataLabelsTXPR = 2;
var c_oserct_chartExDataLabelsSPPR = 3;
var c_oserct_chartExDataLabelsVISABILITIES = 4;
var c_oserct_chartExDataLabelsSEPARATOR = 5;
var c_oserct_chartExDataLabelsDATALABEL = 6;
var c_oserct_chartExDataLabelsDATALABELHIDDEN = 7;

BinaryChartWriter.prototype.WriteCT_DataLabels = function (oVal) {
    var oThis = this;
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsPOS, function() {
            oThis.WriteCT_DataLabelPos(oVal.pos);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsNUMFMT, function() {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsVISABILITIES, function() {
            oThis.WriteCT_DataLabelVisibilities(oVal.visibility);
        });
    }
    if(oVal.separator !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelsSEPARATOR, function() {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
    if (oVal.dataLabel !== null) {
        for (var i = 0, length = oVal.dataLabel.length; i < length; ++i) {
            var oCurVal = oVal.dataLabel[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLabelsDATALABEL, function () {
                    oThis.WriteCT_Datalabel(oCurVal);
                });
            }
        }
    }
    if (oVal.dataLabelHidden !== null) {
        for (var i = 0, length = oVal.dataLabelHidden.length; i < length; ++i) {
            var oCurVal = oVal.dataLabelHidden[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLabelsDATALABELHIDDEN, function () {
                    oThis.WriteCT_DataLabelHidden(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_DataLabels = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelsPOS === type)
    {
        var oNewVal = new AscFormat.CDataLabelPos();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_DataLabelPos(t, l, oNewVal);
        });
        val.setPos(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelsSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelsVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CDataLabelVisibilities();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_DataLabelVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsSEPARATOR === type)
    {
        val.setSeparator(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLabelsDATALABEL === type) {
        var oNewVal = new AscFormat.CDatalabel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Datalabel(t, l, oNewVal);
        });
        val.addDatalabel(oNewVal);
    }
    else if (c_oserct_chartExDataLabelsDATALABELHIDDEN === type) {
        var oNewVal = new AscFormat.CDataLabelHidden();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_DataLabelHidden(t, l, oNewVal);
        });
        val.addDataLabelHidden(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CNumFmt (ChartExNumFmt)
var c_oserct_chartExNumberFormatFORMATCODE = 0;
var c_oserct_chartExNumberFormatSOURCELINKED = 1;

BinaryChartWriter.prototype.WriteCT_ChartExNumFmt = function (oVal) {
    var oThis = this;
    if (oVal.formatCode !== null) {
        this.bs.WriteItem(c_oserct_chartExNumberFormatFORMATCODE, function () {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
    if (oVal.sourceLinked !== null) {
        this.bs.WriteItem(c_oserct_chartExNumberFormatSOURCELINKED, function () {
            oThis.memory.WriteBool(oVal.sourceLinked);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartExNumFmt = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExNumberFormatFORMATCODE === type) {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExNumberFormatSOURCELINKED === type) {
        val.setSourceLinked(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CDataLabel
var c_oserct_chartExDataLabelIDX  = 0;
var c_oserct_chartExDataLabelPOS = 1;
var c_oserct_chartExDataLabelNUMFMT = 2;
var c_oserct_chartExDataLabelTXPR = 3;
var c_oserct_chartExDataLabelSPPR = 4;
var c_oserct_chartExDataLabelVISABILITIES = 5;
var c_oserct_chartExDataLabelSEPARATOR = 6;

BinaryChartWriter.prototype.WriteCT_DataLabel = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelPOS, function() {
            oThis.WriteCT_DataLabelPos(oVal.pos);
        });
    }
    if(oVal.numFmt !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelNUMFMT, function() {
            oThis.WriteCT_NumFmt(oVal.numFmt);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVISABILITIES, function() {
            oThis.WriteCT_DataLabelVisibilities(oVal.visibility);
        });
    }
    if(oVal.separator !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelSEPARATOR, function() {
            oThis.memory.WriteString3(oVal.separator);
        });
    }
};
BinaryChartReader.prototype.ReadCT_DataLabel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelIDX === type) 
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLabelPOS === type)
    {
        var oNewVal = new AscFormat.CDataLabelPos();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_DataLabelPos(t, l, oNewVal);
        });
        val.setPos(oNewVal);
    }
    else if (c_oserct_chartExDataLabelNUMFMT === type)
    {
        var oNewVal = new AscFormat.CNumFmt();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_NumFmt(t, l, oNewVal);
        });
        val.setNumFmt(oNewVal);
    }
    else if (c_oserct_chartExDataLabelTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExDataLabelVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CDataLabelVisibilities();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_DataLabelVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExDataLabelSEPARATOR === type)
    {
        val.setSeparator(this.stream.GetString2LE(length));
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
