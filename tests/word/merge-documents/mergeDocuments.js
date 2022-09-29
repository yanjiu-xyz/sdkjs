/*
 * (c) Copyright Ascensio System SIA 2010-2022
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

const mockEditor = AscTest.Editor;
mockEditor.pre_Paste = function (first, second, callback) {
    callback();
}

AscCommon.sendImgUrls = function (first, second, callback) {
    callback()
}

AscCommon.ResetNewUrls = function () {
    
}

function readMainDocument(oApi, sBinary) {
    const stream = AscCommon.Base64.decode(sBinary, true);
    const openParams = {noSendComments: true};
    const oDrawingDocument = oApi.WordControl;
    let oDoc = new CDocument(oDrawingDocument, true);

    oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc;
    oApi.WordControl.m_oLogicDocument = oDoc;
    const oBinaryFileReader = new AscCommonWord.BinaryFileReader(oDoc, openParams);
    if (!oBinaryFileReader.Read(stream)) {
        oDoc = null;
    }
    return oDoc;
}

function readRevisedDocument(oApi, sBinary) {
    const stream = AscCommon.Base64.decode(sBinary, true);
    const oDoc1 = oApi.WordControl.m_oLogicDocument;
    const openParams = {noSendComments: true};
    let oDoc2 = new CDocument(oApi.WordControl.m_oDrawingDocument, true);
    oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc2;
    oApi.WordControl.m_oLogicDocument = oDoc2;
    const oBinaryFileReader = new AscCommonWord.BinaryFileReader(oDoc2, openParams);
    AscCommon.pptx_content_loader.Start_UseFullUrl(oApi.insertDocumentUrlsData);
    if (!oBinaryFileReader.Read(stream)) {
        oDoc2 = null;
    }
    oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc1;
    oApi.WordControl.m_oLogicDocument = oDoc1;
    if (oDoc1.History)
        oDoc1.History.Set_LogicDocument(oDoc1);
    if (oDoc1.CollaborativeEditing)
        oDoc1.CollaborativeEditing.m_oLogicDocument = oDoc1;
    
    return oDoc2;
}

function merge(sMainBinary, sRevisedBinary, callback) {
    const mainDocument = readMainDocument(mockEditor, sMainBinary);
    const revisedDocument = readRevisedDocument(mockEditor, sRevisedBinary);
    const merge = new AscCommonWord.CDocumentMerge(mainDocument, revisedDocument, {});
    const oldMergeCallback = merge.applyLastMergeCallback;
    merge.applyLastMergeCallback = function () {
        oldMergeCallback.call(this);
        callback();
    }
    merge.merge();
}

function getTestObject(oDocument) {
    const result = [];
    oDocument.Content.forEach(function (par) {
        const paragraphContent = [];
        result.push(paragraphContent);
        par.CheckRunContent(function (oRun) {
            if (oRun.Content.length === 0 || oRun.IsParaEndRun()) return;
            const currentReviewType = oRun.ReviewType;
            let currentContent = paragraphContent[paragraphContent.length - 1];
            if (paragraphContent.length === 0 || currentContent.reviewType !== currentReviewType) {
                currentContent = {reviewType: currentReviewType, text: ''};
                paragraphContent.push(currentContent);
            }
            oRun.Content.forEach(function (el) {
                currentContent.text += String.fromCharCode(el.Value)
            });
        });
    });
    return result;
}


$(function () {

    QUnit.module("Unit-tests for merge documents feature");

    QUnit.test("Test 1 2:", function(assert)
    {
        let strRes = ''
        AscFormat.ExecuteNoHistory(function () {
            for (let i = 0; i < testBinaryFiles.length; i += 1) {
                const test = testBinaryFiles[i];
                merge(test[0], test[1], function () {
                    const doc = mockEditor.WordControl.m_oLogicDocument;
                    const result = getTestObject(doc);
                    assert.deepEqual(result, answers[i], comments[i]);
                });
            }
        }, this, []);
    });
    
    QUnit.test("Test 2 1:", function(assert)
    {
        let strRes = ''
        AscFormat.ExecuteNoHistory(function () {
            for (let i = 0; i < testBinaryFiles.length; i += 1) {
                const test = testBinaryFiles[i];
                merge(test[1], test[0], function () {
                    const doc = mockEditor.WordControl.m_oLogicDocument;
                    const result = getTestObject(doc);
                    assert.deepEqual(result, answers[i], comments[i]);
                });
            }
        }, this, []);
    });
});
