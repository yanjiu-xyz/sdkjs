
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
        val.setValScaling(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisTITLE === type)
    {
        val.setTitle(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisUNITS === type)
    {
        val.setUnits(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisMAJORGRIDLINES === type)
    {
        val.setMajorGridlines(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisMINORGRIDLINES === type)
    {
        val.setMinorGridlines(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisMAJORTICKMARKS === type)
    {
        val.setMajorTickMarks(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisMINORTICKMARKS === type)
    {
        val.setMinorTickMarks(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisTICKLABELS === type)
    {
        val.setTickLabels(this.stream.GetBool(length));
    }
    else if (c_oserct_axisNUMFMT === type)
    {
        val.setNumFmt(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisSPPR === type)
    {
        val.setSpPr(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisTXPR === type)
    {
        val.setTxPr(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisEXTLST === type)
    {
        val.setExtLst(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisID === type)
    {
        val.setId(this.stream.GetString2LE(length));
    }
    else if (c_oserct_axisHIDDEN === type)
    {
        val.setHidden(this.stream.GetBool(length));
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};
// template
var c_oserct_testLongAttr = 0;
var c_oserct_testStringAttr = 1;
var c_oserct_testVARIATION = 2;
var c_oserct_testCOLOR = 3;
var c_oserct_testEFFECT = 4;

BinaryChartWriter.prototype.WriteCT_Test = function (oVal) {
    var oThis = this;
    if(oVal.id !== null) {
        this.bs.WriteItem(c_oserct_testLongAttr, function() {
            oThis.memory.WriteLong(oVal.id);
        });
    }
    if(oVal.meth !== null) {
        this.bs.WriteItem(c_oserct_testStringAttr, function() {
            oThis.memory.WriteString3(oVal.meth);
        });
    }
    var aItems = oVal.items, nItem, oItem;
    for(nItem = 0; nItem < aItems.length; ++nItem) {
        oItem = aItems[nItem];
        if(oItem instanceof AscFormat.CUniColor) {
            this.bs.WriteItem(c_oserct_testCOLOR, function() {
                AscCommon.pptx_content_writer.WriteUniColor(oThis.memory, oItem)
            });
        }
        else {
            this.bs.WriteItem(c_oserct_testVARIATION, function() {
                oThis.WriteCT_TestVariation(oItem);
            });
        }
    }
};
BinaryChartReader.prototype.ReadCT_Test = function (type, length, val) {
    var res = c_oSerConstants.ReadOk;
    var oThis = this;
    var oNewVal;
    if (c_oserct_testLongAttr === type)
    {
        val.setId(this.stream.GetULongLE());
    }
    else if (c_oserct_testStringAttr === type)
    {
        val.setMeth(this.stream.GetString2LE(length));
    }
    else if(c_oserct_testVARIATION === type)
    {
        oNewVal = new AscFormat.CColorModifiers();
        res = this.bcr.Read1(length, function (t, l) {
            return oThis.ReadCT_TestVariation(t, l, oNewVal);
        });
        val.addItem(oNewVal);
    }
    else if(c_oserct_testCOLOR === type)
    {
        oNewVal = AscCommon.pptx_content_loader.ReadUniColor(this, this.stream);
        if(oNewVal)
        {
            val.addItem(oNewVal);
        }
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};


BinaryChartWriter.prototype.WriteCT_TestVariation = function (oVal) {
    var oThis = this;
    var aMods = oVal.Mods, nMod, oMod;
    for(nMod = 0; nMod < aMods.length; ++nMod) {
        oMod = aMods[nMod];
        this.bs.WriteItem(c_oserct_testEFFECT, function() {
            AscCommon.pptx_content_writer.WriteMod(oThis.memory, oMod)
        });
    }
};
BinaryChartReader.prototype.ReadCT_TestVariation = function (type, length, val)
{
    var res = c_oSerConstants.ReadOk;
    if (c_oserct_testEFFECT === type)
    {
        var oMod = AscCommon.pptx_content_loader.ReadColorMod(this, this.stream);
        if(oMod)
        {
            val.addMod(oMod);
        }
    }
    else
    {
        res = c_oSerConstants.ReadUnknown;
    }
    return res;
};