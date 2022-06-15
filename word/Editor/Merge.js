(function (undefined) {
    var CDocumentComparison = AscCommonWord.CDocumentComparison;
    var CNode               = AscCommonWord.CNode;
    var g_oTableId          = AscCommon.g_oTableId;

    var EXCLUDED_PUNCTUATION = {};
    EXCLUDED_PUNCTUATION[46] = true; // TODO: organize import
    //EXCLUDED_PUNCTUATION[95] = true;
    EXCLUDED_PUNCTUATION[160] = true;

})()