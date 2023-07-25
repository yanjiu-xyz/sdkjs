"use strict";

(/**
 * @param {Window} window
 * @param {undefined} undefined
 */
    function(window, undefined) {

    var drawingsChangesMap = window['AscDFH'].drawingsChangesMap;
    var drawingContentChanges = window['AscDFH'].drawingContentChanges;

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
    
    //--------------------------------------------------------export----------------------------------------------------
    window['AscFormat'] = window['AscFormat'] || {};
    window['AscFormat'].CAddress = CAddress;
})(window);