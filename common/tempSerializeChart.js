
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

// DataLabelHidden
var c_oserct_chartExDataLabelHiddenIDX = 0;

BinaryChartWriter.prototype.WriteCT_DataLabelHidden = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelHiddenIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
};
BinaryChartReader.prototype.ReadCT_DataLabelHidden = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelHiddenIDX === type) 
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CSeriesLayoutProperties
var c_oserct_chartExSeriesLayoutPARENT = 0;
var c_oserct_chartExSeriesLayoutREGION = 1;
var c_oserct_chartExSeriesLayoutVISABILITIES = 2;
var c_oserct_chartExSeriesLayoutAGGREGATION = 3;
var c_oserct_chartExSeriesLayoutBINNING = 4;
var c_oserct_chartExSeriesLayoutSTATISTIC = 5;
var c_oserct_chartExSeriesLayoutSUBTOTALS = 6;

BinaryChartWriter.prototype.WriteCT_SeriesLayoutProperties = function (oVal) {
    var oThis = this;
    if(oVal.parentLabelLayout !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutPARENT, function() {
            oThis.WriteCT_ParentLabelLayout(oVal.parentLabelLayout);
        });
    }
    if(oVal.regionLabelLayout !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutREGION, function() {
            oThis.WriteCT_RegionLabelLayout(oVal.regionLabelLayout);
        });
    }
    if(oVal.visibility !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutVISABILITIES, function() {
            oThis.WriteCT_SeriesElementVisibilities(oVal.visibility);
        });
    }
    if(oVal.aggregation !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutAGGREGATION, function() {
            oThis.memory.WriteBool(oVal.aggregation);
        });
    }
    if(oVal.binning !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutBINNING, function() {
            oThis.WriteCT_Binning(oVal.binning);
        });
    }
    if(oVal.statistics !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutSTATISTIC, function() {
            oThis.WriteCT_Statistics(oVal.statistics);
        });
    }
    if(oVal.subtotals !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesLayoutSUBTOTALS, function() {
            oThis.WriteCT_Subtotals(oVal.subtotals);
        });
    }
};
BinaryChartReader.prototype.ReadCT_SeriesLayoutProperties = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesLayoutPARENT === type)
    {
        var oNewVal = new AscFormat.CParentLabelLayout();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_ParentLabelLayout(t, l, oNewVal);
        });
        val.setParentLabelLayout(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutREGION === type)
    {
        var oNewVal = new AscFormat.CRegionLabelLayout();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_RegionLabelLayout(t, l, oNewVal);
        });
        val.setRegionLabelLayout(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutVISABILITIES === type)
    {
        var oNewVal = new AscFormat.CSeriesElementVisibilities();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_SeriesElementVisibilities(t, l, oNewVal);
        });
        val.setVisibility(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutAGGREGATION === type)
    {
        val.setAggregation(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesLayoutBINNING === type)
    {
        var oNewVal = new AscFormat.CBinning();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Binning(t, l, oNewVal);
        });
        val.setBinning(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutSTATISTIC === type)
    {
        var oNewVal = new AscFormat.CStatistics();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Statistics(t, l, oNewVal);
        });
        val.setStatistics(oNewVal);
    }
    else if (c_oserct_chartExSeriesLayoutSUBTOTALS === type)
    {
        var oNewVal = new AscFormat.CSubtotals();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Subtotals(t, l, oNewVal);
        });
        val.setSubtotals(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CDataLabelVisibilities
var c_oserct_chartExDataLabelVisibilitiesSERIES = 0;
var c_oserct_chartExDataLabelVisibilitiesCATEGORY = 1;
var c_oserct_chartExDataLabelVisibilitiesVALUE = 2;

BinaryChartWriter.prototype.WriteCT_DataLabelVisibilities = function (oVal) {
    var oThis = this;
    if(oVal.seriesName !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesSERIES, function() {
            oThis.memory.WriteBool(oVal.seriesName);
        });
    }
    if(oVal.categoryName !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesCATEGORY, function() {
            oThis.memory.WriteBool(oVal.categoryName);
        });
    }
    if(oVal.value !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLabelVisibilitiesVALUE, function() {
            oThis.memory.WriteBool(oVal.value);
        });
    }
};
BinaryChartReader.prototype.ReadCT_DataLabelVisibilities = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLabelVisibilitiesSERIES === type)
    {
        val.setSeriesName(this.stream.GetBool());
    }
    else if (c_oserct_chartExDataLabelVisibilitiesCATEGORY === type)
    {
        val.setCategoryName(this.stream.GetBool());
    }
    else if (c_oserct_chartExDataLabelVisibilitiesVALUE === type)
    {
        val.setValue(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CBinning
var c_oserct_chartExBinningBINSIZE = 0;
var c_oserct_chartExBinningBINCOUNT = 1;
var c_oserct_chartExBinningINTERVAL = 2;
var c_oserct_chartExBinningUNDERVAL = 3;
var c_oserct_chartExBinningUNDERAUTO = 4;
var c_oserct_chartExBinningOVERVAL = 5;
var c_oserct_chartExBinningOVERAUTO = 6;

BinaryChartWriter.prototype.WriteCT_Binning = function (oVal) {
    var oThis = this;
    if(oVal.binSize !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningBINSIZE, function() {
            oThis.memory.WriteDouble2(oVal.binSize);
        });
    }
    if(oVal.binCount !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningBINCOUNT, function() {
            oThis.memory.WriteLong(oVal.binCount);
        });
    }
    if(oVal.intervalClosed !== null) {
        this.bs.WriteItem(c_oserct_chartExBinningINTERVAL, function() {
            oThis.WriteCT_IntervalClosedSide(oVal.intervalClosed);
        });
    }
    if(oVal.underflow !== null) {
        if (oVal.underflow.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExBinningUNDERVAL, function() {
                oThis.memory.WriteDouble2(oVal.underflow.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExBinningUNDERAUTO, function() {
                oThis.memory.WriteByte(oVal.underflow.dValue);
            });
        }
    }
    if(oVal.overflow !== null) {
        if (oVal.overflow.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExBinningOVERVAL, function() {
                oThis.memory.WriteDouble2(oVal.overflow.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExBinningOVERAUTO, function() {
                oThis.memory.WriteByte(oVal.overflow.dValue);
            });
        }
    }
};
BinaryChartReader.prototype.ReadCT_Binning = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExBinningBINSIZE === type)
    {
        val.setBinSize(this.stream.GetDoubleLE());
    }
    else if (c_oserct_chartExBinningBINCOUNT === type)
    {
        val.setBinCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExBinningINTERVAL === type)
    {
        var oNewVal = new AscFormat.CIntervalClosedSide();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_IntervalClosedSide(t, l, oNewVal);
        });
        val.setIntervalClosed(oNewVal);
    }
    else if (c_oserct_chartExBinningUNDERVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setUnderflow(oNewVal);
    }
    else if (c_oserct_chartExBinningUNDERAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setUnderflow(oNewVal);
    }
    else if (c_oserct_chartExBinningOVERVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setOverflow(oNewVal);
    }
    else if (c_oserct_chartExBinningOVERAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setOverflow(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CChartExTitle
var c_oserct_chartExTitleTX = 0;
var c_oserct_chartExTitleTXPR = 1;
var c_oserct_chartExTitleSPPR = 2;
var c_oserct_chartExTitlePOS = 3;
var c_oserct_chartExTitleALIGN = 4;
var c_oserct_chartExTitleOVERLAY = 5;

BinaryChartWriter.prototype.WriteCT_ChartExTitle = function (oVal) {
    var oThis = this;
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleTX, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExTitlePOS, function() {
            oThis.WriteCT_SidePos(oVal.pos);
        });
    }
    if(oVal.align !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleALIGN, function() {
            oThis.WriteCT_PosAlign(oVal.align);
        });
    }
    if(oVal.overlay !== null) {
        this.bs.WriteItem(c_oserct_chartExTitleOVERLAY, function() {
            oThis.memory.WriteBool(oVal.overlay);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartExTitle = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTitleTX === type)
    {
        var oNewVal = new AscFormat.CText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Text(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_chartExTitleTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExTitleSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExTitlePOS === type)
    {
        var oNewVal = new AscFormat.CSidePos();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_SidePos(t, l, oNewVal);
        });
        val.setPos(oNewVal);
    }
    else if (c_oserct_chartExTitleALIGN === type)
    {
        var oNewVal = new AscFormat.CPosAlign();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_PosAlign(t, l, oNewVal);
        });
        val.setAlign(oNewVal);
    }
    else if (c_oserct_chartExTitleOVERLAY === type)
    {
        val.setOverlay(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CChartExLegend
var c_oserct_chartExLegendTXPR = 0;
var c_oserct_chartExLegendSPPR = 1;
var c_oserct_chartExLegendPOS = 2;
var c_oserct_chartExLegendALIGN = 3;
var c_oserct_chartExLegendOVERLAY = 4;

BinaryChartWriter.prototype.WriteCT_ChartExLegend = function (oVal) {
    var oThis = this;
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
    if(oVal.pos !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendPOS, function() {
            oThis.WriteCT_SidePos(oVal.pos);
        });
    }
    if(oVal.align !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendALIGN, function() {
            oThis.WriteCT_PosAlign(oVal.align);
        });
    }
    if(oVal.overlay !== null) {
        this.bs.WriteItem(c_oserct_chartExLegendOVERLAY, function() {
            oThis.memory.WriteBool(oVal.overlay);
        });
    }
};
BinaryChartReader.prototype.ReadCT_ChartExLegend = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExLegendTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else if (c_oserct_chartExLegendSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExLegendPOS === type)
    {
        var oNewVal = new AscFormat.CSidePos();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_SidePos(t, l, oNewVal);
        });
        val.setPos(oNewVal);
    }
    else if (c_oserct_chartExLegendALIGN === type)
    {
        var oNewVal = new AscFormat.CPosAlign();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_PosAlign(t, l, oNewVal);
        });
        val.setAlign(oNewVal);
    }
    else if (c_oserct_chartExLegendOVERLAY === type)
    {
        val.setOverlay(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CText
var c_oserct_chartExTextRICH  = 0;
var c_oserct_chartExTextDATA  = 1;

BinaryChartWriter.prototype.WriteCT_Text = function (oVal) {
    var oThis = this;
    if(oVal.rich !== null) {
        this.bs.WriteItem(c_oserct_chartExTextRICH, function() {
            oThis.WriteCT_TextBody(oVal.rich);
        });
    }
    if(oVal.txData !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDATA, function() {
            oThis.WriteCT_TextData(oVal.txData);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Text = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTextRICH === type)
    {
        var oNewVal = new AscFormat.CTextBody();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TextBody(t, l, oNewVal);
        });
        val.setRich(oNewVal);
    }
    else if (c_oserct_chartExTextDATA === type)
    {
        var oNewVal = new AscFormat.CTextData();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_TextData(t, l, oNewVal);
        });
        val.setTxData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CTextData
var c_oserct_chartExTextDataFORMULA = 0;
var c_oserct_chartExTextDataVALUE = 1;

BinaryChartWriter.prototype.WriteCT_TextData = function (oVal) {
    var oThis = this;
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDataFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.v !== null) {
        this.bs.WriteItem(c_oserct_chartExTextDataVALUE, function() {
            oThis.memory.WriteString3(oVal.v);
        });
    }
};
BinaryChartReader.prototype.ReadCT_TextData = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTextDataFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExTextDataVALUE === type)
    {
        val.setV(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CData
var c_oserct_chartExDataID  = 0;
var c_oserct_chartExDataSTRDIMENSION  = 1;
var c_oserct_chartExDataNUMDIMENSION  = 2;

BinaryChartWriter.prototype.WriteCT_Data = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_chartExDataID, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.dimension !== null) {
        for (var i = 0, length = oVal.dimension.length; i < length; ++i) {
            var oDimension = oVal.dimension[i];
            if (oDimension instanceof AscFormat.CNumericDimension) {
                this.bs.WriteItem(c_oserct_chartExDataNUMDIMENSION, function() {
                    oThis.WriteCT_NumericDimension(oDimension);
                });
            } else {
                this.bs.WriteItem(c_oserct_chartExDataSTRDIMENSION, function() {
                    oThis.WriteCT_StringDimension(oDimension);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_Data = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataID === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataSTRDIMENSION === type)
    {
        var oNewVal = new AscFormat.CStringDimension();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StringDimension(t, l, oNewVal);
        });
        val.addDimension(oNewVal);
    }
    else if (c_oserct_chartExDataNUMDIMENSION === type)
    {
        var oNewVal = new AscFormat.CNumericDimension();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumericDimension(t, l, oNewVal);
        });
        val.addDimension(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CSubtotals
var c_oserct_chartExSubtotalsIDX = 0;

BinaryChartWriter.prototype.WriteCT_Subtotals = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        for (var i = 0, length = oVal.idx.length; i < length; ++i) {
            var oCurVal = oVal.idx[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExSubtotalsIDX, function () {
                    oThis.memory.WriteLong(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_Subtotals = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSubtotalsIDX === type)
    {
        val.addIdx(this.stream.GetULongLE());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CSeriesElementVisibilities
var c_oserct_chartExSeriesVisibilitiesCONNECTOR = 0;
var c_oserct_chartExSeriesVisibilitiesMEANLINE = 1;
var c_oserct_chartExSeriesVisibilitiesMEANMARKER = 2;
var c_oserct_chartExSeriesVisibilitiesNONOUTLIERS = 3;
var c_oserct_chartExSeriesVisibilitiesOUTLIERS = 4;

BinaryChartWriter.prototype.WriteCT_SeriesElementVisibilities = function (oVal) {
    var oThis = this;
    if(oVal.connectorLines !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesCONNECTOR, function() {
            oThis.memory.WriteBool(oVal.connectorLines);
        });
    }
    if(oVal.meanLine !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesMEANLINE, function() {
            oThis.memory.WriteBool(oVal.meanLine);
        });
    }
    if(oVal.meanMarker !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesMEANMARKER, function() {
            oThis.memory.WriteBool(oVal.meanMarker);
        });
    }
    if(oVal.nonoutliers !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesNONOUTLIERS, function() {
            oThis.memory.WriteBool(oVal.nonoutliers);
        });
    }
    if(oVal.outliers !== null) {
        this.bs.WriteItem(c_oserct_chartExSeriesVisibilitiesOUTLIERS, function() {
            oThis.memory.WriteBool(oVal.outliers);
        });
    }
};
BinaryChartReader.prototype.ReadCT_SeriesElementVisibilities = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExSeriesVisibilitiesCONNECTOR === type)
    {
        val.setConnectorLines(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesMEANLINE === type)
    {
        val.setMeanLine(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesMEANMARKER === type)
    {
        val.setMeanMarker(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesNONOUTLIERS === type)
    {
        val.setNonoutliers(this.stream.GetBool());
    }
    else if (c_oserct_chartExSeriesVisibilitiesOUTLIERS === type)
    {
        val.setOutliers(this.stream.GetBool());
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CCategoryAxisScaling
var c_oserct_chartExCatScalingGAPAUTO = 0;
var c_oserct_chartExCatScalingGAPVAL = 1;

BinaryChartWriter.prototype.WriteCT_CategoryAxisScaling = function (oVal) {
    var oThis = this;
    if(oVal.gapWidth !== null) {
        if (oVal.gapWidth.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExCatScalingGAPVAL, function() {
                oThis.memory.WriteDouble2(oVal.gapWidth.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExCatScalingGAPAUTO, function() {
                oThis.memory.WriteByte(oVal.gapWidth.dValue);
            });
        }
    }
};
BinaryChartReader.prototype.ReadCT_CategoryAxisScaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExCatScalingGAPVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setGapWidth(oNewVal);
    }
    else if (c_oserct_chartExCatScalingGAPAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setGapWidth(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CValueAxisScaling
var c_oserct_chartExValScalingMAXAUTO = 0;
var c_oserct_chartExValScalingMAXVAL = 1;
var c_oserct_chartExValScalingMINAUTO = 2;
var c_oserct_chartExValScalingMINVAL = 3;
var c_oserct_chartExValScalingMAJUNITAUTO = 4;
var c_oserct_chartExValScalingMAJUNITVAL = 5;
var c_oserct_chartExValScalingMINUNITAUTO = 6;
var c_oserct_chartExValScalingMINUNITVAL = 7;

BinaryChartWriter.prototype.WriteCT_ValueAxisScaling = function (oVal) {
    var oThis = this;
    if(oVal.max !== null) {
        if (oVal.max.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExValScalingMAXVAL, function() {
                oThis.memory.WriteDouble2(oVal.max.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMAXAUTO, function() {
                oThis.memory.WriteByte(oVal.max.dValue);
            });
        }
    }
    if(oVal.min !== null) {
        if (oVal.min.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExValScalingMINVAL, function() {
                oThis.memory.WriteDouble2(oVal.min.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMINAUTO, function() {
                oThis.memory.WriteByte(oVal.min.dValue);
            });
        }
    }
    if(oVal.majorUnit !== null) {
        if (oVal.majorUnit.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExValScalingMAJUNITVAL, function() {
                oThis.memory.WriteDouble2(oVal.majorUnit.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMAJUNITAUTO, function() {
                oThis.memory.WriteByte(oVal.majorUnit.dValue);
            });
        }
    }
    if(oVal.minorUnit !== null) {
        if (oVal.minorUnit.eValue === EDoubleOrAutomatic.typeDouble) {
            this.bs.WriteItem(c_oserct_chartExValScalingMINUNITVAL, function() {
                oThis.memory.WriteDouble2(oVal.minorUnit.dValue);
            });
        } else {
            this.bs.WriteItem(c_oserct_chartExValScalingMINUNITAUTO, function() {
                oThis.memory.WriteByte(oVal.minorUnit.dValue);
            });
        }
    }
};
BinaryChartReader.prototype.ReadCT_ValueAxisScaling = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExValScalingMAXAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setMax(oNewVal);
    }
    else if (c_oserct_chartExValScalingMAXVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setMax(oNewVal);
    }
    else if (c_oserct_chartExValScalingMINAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setMin(oNewVal);
    }
    else if (c_oserct_chartExValScalingMINVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setMin(oNewVal);
    }
    else if (c_oserct_chartExValScalingMAJUNITAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setMajorUnit(oNewVal);
    }
    else if (c_oserct_chartExValScalingMAJUNITVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setMajorUnit(oNewVal);
    }
    else if (c_oserct_chartExValScalingMINUNITAUTO === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setEValue(this.stream.GetUChar());
        val.setMinorUnit(oNewVal);
    }
    else if (c_oserct_chartExValScalingMINUNITVAL === type)
    {
        var oNewVal = new AscFormat.CDoubleOrAutomatic();
        oNewVal.setDvalue(this.stream.GetDoubleLE());
        val.setMinorUnit(oNewVal);
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

// CAxisUnitsLabel
var c_oserct_chartExAxisUnitsLabelTEXT = 0;
var c_oserct_chartExAxisUnitsLabelSPPR = 1;
var c_oserct_chartExAxisUnitsLabelTXPR = 2;

BinaryChartWriter.prototype.WriteCT_AxisUnitsLabel = function (oVal) {
    var oThis = this;
    if(oVal.tx !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelTEXT, function() {
            oThis.WriteCT_Text(oVal.tx);
        });
    }
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
    if(oVal.txPr !== null) {
        this.bs.WriteItem(c_oserct_chartExAxisUnitsLabelTXPR, function() {
            oThis.WriteTxPr(oVal.txPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_AxisUnitsLabel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExAxisUnitsLabelTEXT === type)
    {
        var oNewVal = new AscFormat.CText();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_Text(t, l, oNewVal);
        });
        val.setTx(oNewVal);
    }
    else if (c_oserct_chartExAxisUnitsLabelSPPR === type)
    {
        val.setSpPr(this.ReadSpPr(length));
        val.spPr.setParent(val);
    }
    else if (c_oserct_chartExAxisUnitsLabelTXPR === type)
    {
        val.setTxPr(this.ReadTxPr(length));
        val.txPr.setParent(val);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CTickMarks
var c_oserct_chartExTickMarksTYPE = 0;

BinaryChartWriter.prototype.WriteCT_TickMarks = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExTickMarksTYPE, function() {
            oThis.WriteCT_TickMarksType(oVal.type);
        });
    }
};
BinaryChartReader.prototype.ReadCT_TickMarks = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExTickMarksTYPE === type)
    {
        var oNewVal = new AscFormat.CTickMarksType();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TickMarksType(t, l, oNewVal);
        });
        val.setType(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CGridlines
var c_oserct_chartExGridlinesSPPR = 0;

BinaryChartWriter.prototype.WriteCT_Gridlines = function (oVal) {
    var oThis = this;
    if(oVal.spPr !== null) {
        this.bs.WriteItem(c_oserct_chartExGridlinesSPPR, function() {
            oThis.WriteSpPr(oVal.spPr);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Gridlines = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExGridlinesSPPR === type)
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

// CStatistics
var c_oserct_chartExStatisticsMETHOD = 0;

BinaryChartWriter.prototype.WriteCT_Statistics = function (oVal) {
    var oThis = this;
    if(oVal.quartileMethod !== null) {
        this.bs.WriteItem(c_oserct_chartExStatisticsMETHOD, function() {
            oThis.memory.WriteByte(oVal.quartileMethod.quartileMethod);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Statistics = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExStatisticsMETHOD === type)
    {
        var oNewVal = new AscFormat.CQuartileMethod();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_QuartileMethod(t, l, oNewVal);
        });
        oNewVal.setQuartileMethod(this.stream.GetUChar());
        val.setQuartileMethod(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CStringDimension, CNumericDimension
var c_oserct_chartExDataDimensionTYPE = 0;
var c_oserct_chartExDataDimensionFORMULA = 1;
var c_oserct_chartExDataDimensionNF = 2;
var c_oserct_chartExDataDimensionSTRINGLEVEL = 3;
var c_oserct_chartExDataDimensionNUMERICLEVEL = 4;

BinaryChartWriter.prototype.WriteCT_StringDimension = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionTYPE, function() {
            oThis.memory.WriteBool(oVal.type.dimensionType);
        });
    }
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.nf !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionNF, function() {
            oThis.memory.WriteString3(oVal.nf);
        });
    }
    if(oVal.levelData !== null) {
        for (var i = 0, length = oVal.levelData.length; i < length; ++i) {
            var oCurVal = oVal.levelData[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataDimensionSTRINGLEVEL, function () {
                    oThis.WriteCT_StringLevel(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_StringDimension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataDimensionTYPE === type)
    {
        var oNewVal = new AscFormat.CDimensionType();
        oNewVal.setDimensionType(this.stream.GetUChar());
        val.addLevelData(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionNF === type)
    {
        val.setNf(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataDimensionSTRINGLEVEL === type)
    {
        var oNewVal = new AscFormat.CStringLevel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_StringLevel(t, l, oNewVal);
        });
        val.addLevelData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

BinaryChartWriter.prototype.WriteCT_NumericDimension = function (oVal) {
    var oThis = this;
    if(oVal.type !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionTYPE, function() {
            oThis.memory.WriteBool(oVal.type.dimensionType);
        });
    }
    if(oVal.f !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionFORMULA, function() {
            oThis.WriteCT_Formula(oVal.f);
        });
    }
    if(oVal.nf !== null) {
        this.bs.WriteItem(c_oserct_chartExDataDimensionNF, function() {
            oThis.memory.WriteString3(oVal.nf);
        });
    }
    if(oVal.levelData !== null) {
        for (var i = 0, length = oVal.levelData.length; i < length; ++i) {
            var oCurVal = oVal.levelData[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataDimensionNUMERICLEVEL, function () {
                    oThis.WriteCT_NumericLevel(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_NumericDimension = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataDimensionTYPE === type)
    {
        var oNewVal = new AscFormat.CDimensionType();
        oNewVal.setDimensionType(this.stream.GetUChar());
        val.addLevelData(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionFORMULA === type)
    {
        var oNewVal = new AscFormat.CFormula();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_Formula(t, l, oNewVal);
        });
        val.setF(oNewVal);
    }
    else if (c_oserct_chartExDataDimensionNF === type)
    {
        val.setNf(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataDimensionNUMERICLEVEL === type)
    {
        var oNewVal = new AscFormat.CNumericLevel();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_NumericLevel(t, l, oNewVal);
        });
        val.addLevelData(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CFormula
var c_oserct_chartExFormulaCONTENT = 0;
var c_oserct_chartExFormulaDIRECTION = 1;

BinaryChartWriter.prototype.WriteCT_Formula = function (oVal) {
    var oThis = this;
    if(oVal.content !== null) {
        this.bs.WriteItem(c_oserct_chartExFormulaCONTENT, function() {
            oThis.memory.WriteString3(oVal.content);
        });
    }
    if(oVal.dir !== null) {
        this.bs.WriteItem(c_oserct_chartExFormulaDIRECTION, function() {
            oThis.memory.WriteByte(oVal.dir.formulaDirection);
        });
    }
};
BinaryChartReader.prototype.ReadCT_Formula = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExFormulaCONTENT === type)
    {
        val.setContent(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExFormulaDIRECTION === type)
    {
        var oNewVal = new AscFormat.CFormulaDirection();
        oNewVal.setFormulaDirection(this.stream.GetUChar());
        val.setDir(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CStringLevel, CNumericLevel
var c_oserct_chartExDataLevelNAME = 0;
var c_oserct_chartExDataLevelCOUNT = 1;
var c_oserct_chartExDataLevelPT = 2;
var c_oserct_chartExDataLevelFORMATCODE = 3;

BinaryChartWriter.prototype.WriteCT_StringLevel = function (oVal) {
    var oThis = this;
    if(oVal.name !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelNAME, function() {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if(oVal.ptCount !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelCOUNT, function() {
            oThis.memory.WriteLong(oVal.ptCount);
        });
    }
    if(oVal.pt !== null) {
        for (var i = 0, length = oVal.pt.length; i < length; ++i) {
            var oCurVal = oVal.pt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLevelPT, function () {
                    oThis.WriteCT_StringValue(oCurVal);
                });
            }
        }
    }
};
BinaryChartReader.prototype.ReadCT_StringLevel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLevelNAME === type)
    {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLevelCOUNT === type)
    {
        val.setPtCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLevelPT === type)
    {
        var oNewVal = new AscFormat.CStringValue();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_StringValue(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

BinaryChartWriter.prototype.WriteCT_NumericLevel = function (oVal) {
    var oThis = this;
    if(oVal.name !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelNAME, function() {
            oThis.memory.WriteString3(oVal.name);
        });
    }
    if(oVal.ptCount !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelCOUNT, function() {
            oThis.memory.WriteLong(oVal.ptCount);
        });
    }
    if(oVal.pt !== null) {
        for (var i = 0, length = oVal.pt.length; i < length; ++i) {
            var oCurVal = oVal.pt[i];
            if (null != oCurVal) {
                this.bs.WriteItem(c_oserct_chartExDataLevelPT, function () {
                    oThis.WriteCT_NumericValue(oCurVal);
                });
            }
        }
    }
    if(oVal.formatCode !== null) {
        this.bs.WriteItem(c_oserct_chartExDataLevelFORMATCODE, function() {
            oThis.memory.WriteString3(oVal.formatCode);
        });
    }
};
BinaryChartReader.prototype.ReadCT_NumericLevel = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataLevelNAME === type)
    {
        val.setName(this.stream.GetString2LE(length));
    }
    else if (c_oserct_chartExDataLevelCOUNT === type)
    {
        val.setPtCount(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataLevelPT === type)
    {
        var oNewVal = new AscFormat.CNumericValue();
        res = this.bcr.Read2(length, function (t, l) {
            return oThis.ReadCT_NumericValue(t, l, oNewVal);
        });
        val.addPt(oNewVal);
    }
    else if (c_oserct_chartExDataLevelFORMATCODE === type)
    {
        val.setFormatCode(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

// CStringValue, CNumericValue 
var c_oserct_chartExDataValueIDX = 0;
var c_oserct_chartExDataValueCONTENT = 1;

BinaryChartWriter.prototype.WriteCT_StringValue = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.content !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueCONTENT, function() {
            oThis.memory.WriteString3(oVal.content);
        });
    }
};
BinaryChartReader.prototype.ReadCT_StringValue = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataValueIDX === type)
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataValueCONTENT === type)
    {
        val.setContent(this.stream.GetString2LE(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};

BinaryChartWriter.prototype.WriteCT_NumericValue = function (oVal) {
    var oThis = this;
    if(oVal.idx !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueIDX, function() {
            oThis.memory.WriteLong(oVal.idx);
        });
    }
    if(oVal.content !== null) {
        this.bs.WriteItem(c_oserct_chartExDataValueCONTENT, function() {
            oThis.memory.WriteDouble2(oVal.content);
        });
    }
};
BinaryChartReader.prototype.ReadCT_NumericValue = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_chartExDataValueIDX === type)
    {
        val.setIdx(this.stream.GetULongLE());
    }
    else if (c_oserct_chartExDataValueCONTENT === type)
    {
        val.setContent(this.stream.GetDoubleLE());
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
