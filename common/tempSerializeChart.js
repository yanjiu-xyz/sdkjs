
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