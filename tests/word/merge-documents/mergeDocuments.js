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

AscCommon.sendImgUrls = function (first, second, callback) {
    callback()
}

AscCommon.ResetNewUrls = function () {
    
}

function merge(oMainDocument, oRevisedDocument, callback) {
    const merge = new AscCommonWord.CDocumentMerge(oMainDocument, oRevisedDocument, new AscCommonWord.ComparisonOptions());
    const oldMergeCallback = merge.applyLastMergeCallback;
    merge.applyLastMergeCallback = function () {
        oldMergeCallback.call(this);
        callback();
    }
    merge.merge();
}
AscCommonWord.CHeaderFooter.prototype.getTestObject = function (oParentContent) {
    const content = {type: 'headerfooter', content: []};
    oParentContent.push(content);
    this.Content.getTestObject(content.content);
};
AscCommonWord.CDocument.prototype.getTestObject = function () {
    const documentTestObject = {type: 'document', content: []};
    this.Content.forEach(function (oItem) {
        if (oItem.getTestObject) {
            oItem.getTestObject(documentTestObject.content);
        } else {
            documentTestObject.content.push(oItem.constructor.name)
        }
    });
    if (this.SectPr) {
        const HdrFtr = this.SectPr.GetAllHdrFtrs();
        for (let i = 0; i < HdrFtr.length; i += 1) {
            HdrFtr[i].getTestObject(documentTestObject.content);
        }

    }
    if (this.Footnotes) {
        this.Footnotes.getTestObject(documentTestObject.content);
    }
    return documentTestObject;
}

AscCommonWord.CTable.prototype.getTestObject = function (documentContent) {
    const oTableContent = {type: 'table', rows: []};
    documentContent.push(oTableContent)
    for (let i = 0; i < this.Content.length; i += 1) {
        const row = this.Content[i];
        row.getTestObject(oTableContent.rows);
    }
}

AscCommonWord.CTableRow.prototype.getTestObject = function (tableContent) {
    const rowContent = {type: 'row', content: []};
    tableContent.push(rowContent);
    for (let i = 0; i < this.Content.length; i += 1) {
        const cell = this.Content[i];
        cell.getTestObject(rowContent.content);
    }
}

AscCommonWord.CTableCell.prototype.getTestObject = function (rowContent) {
    const cellContent = {type: 'cell', content: []};
    rowContent.push(cellContent);
    const content = this.GetContent();
    content.CheckRunContent(function (oRun) {
        oRun.getTestObject(cellContent.content);
    });
}


ParaMath.prototype.getTestObject = function (parentContent) {
    const content = {type: 'paramath', content: []};
    parentContent.push(content)
    this.Root.getTestObject(content.content);
}
CMathContent.prototype.getTestObject = function (parentContent) {
    const mathContent = {type: 'mathcontent', content: []};
    parentContent.push(mathContent)
    for (var i = 0; i < this.Content.length; ++i)
    {
        if (para_Math_Run === this.Content[i].Type)
            this.Content[i].getTestObject(mathContent.content);
    }
}
CMathBase.prototype.getTestObject = function (parentContent) {
    const mathBaseContent = {type: 'mathbase', content: []};
    parentContent.push(mathBaseContent)
    this.Content.forEach(function (oRun) {
       oRun.getTestObject(mathBaseContent.content);
    });
  }
CDocumentSectionsInfo.prototype.getTestObject = function (parentContent) {
      let headers = this.GetAllHdrFtrs();
      for (let index = 0, count = headers.length; index < count; ++index)
      {
          const oHeaderContent = {
              type: 'documentsectioninfo',
              content: []
          }
          parentContent.push(oHeaderContent);
          headers[index].getTestObject(oHeaderContent.content);
      }
  }
CDocumentContentBase.prototype.getTestObject = function (parentContent) {
      const CDocumentContent = {type: 'documentcontentbase', content: []};
      parentContent.push(CDocumentContent)
      for (var nIndex = 0, nCount = this.Content.length; nIndex < nCount; ++nIndex)
      {
          this.Content[nIndex].getTestObject(CDocumentContent.content);
      }
 }
CDocumentContentElementBase.prototype.getTestObject = function () {

  }
CEndnotesController.prototype.getTestObject = function (parentContent) {
      for (var sId in this.Endnote)
      {
          let oEndnote = this.Endnote[sId];
          const oEndNoteContent = {type: 'endnote', content: []};
          parentContent.push(oEndNoteContent);
          oEndnote.checkTestObject(oEndNoteContent.content)
      }
  }
CFootnotesController.prototype.getTestObject = function (parentContent) {
      for (var sId in this.Footnote)
      {
          let oFootnote = this.Footnote[sId];
          const oFootnoteContent = {type: 'footnote', content: []};
          parentContent.push(oFootnoteContent)
          for (let i = 0; i < oFootnote.Content.length; i += 1) {
              oFootnote.Content[i].getTestObject(oFootnoteContent.content);
          }
      }
  }

  CParagraphContentBase.prototype.getTestObject = function (parentContent) {
    const paragraphContent = {type: 'paragraphcontentbase', content: []};
    parentContent.push(paragraphContent)
    for (let i = 0; i < this.Content.length;i += 1) {
        this.Content[i].getTestObject(paragraphContent.content);
    }
  }
  CParagraphContentWithParagraphLikeContent.prototype.getTestObject = function () {

  }
  CBlockLevelSdt.prototype.getTestObject = function (parentContent) {
     const BlockLvlSdtContent = {type: 'blocklvlsdt', content: []};
     parentContent.push(BlockLvlSdtContent)
     this.Content.getTestObject(BlockLvlSdtContent.content);
  }

Paragraph.prototype.getTestObject = function (documentContent) {
    const oTestParagraph = {type: 'paragraph', content: []};
    documentContent.push(oTestParagraph);
    const oTestParagraphContent =
      this.CheckRunContent(function (oRun) {
          oRun.getTestObject(oTestParagraph.content);
      });
    return oTestParagraph;
}

ParaRun.prototype.getTestObject = function (oParentContent) {
    if (this.Content.length === 0) return;
    const oReviewInfo = this.GetReviewInfo();
    const prevAdded = oReviewInfo.GetPrevAdded();
    let mainReviewType = this.GetReviewType && this.GetReviewType();
    let mainUserName = oReviewInfo.GetUserName();
    let mainDateTime = oReviewInfo.GetDateTime();

    let additionalReviewType;
    let additionalUserName;
    let additionalDateTime;

    if (prevAdded) {
        additionalReviewType = reviewtype_Add;
        additionalUserName = prevAdded.GetUserName();
        additionalDateTime = prevAdded.GetDateTime();
    }
    let currentContent = oParentContent[oParentContent.length - 1];
    const needCreateNewText = (oParentContent.length === 0 ||
      currentContent.mainReviewType !== mainReviewType || currentContent.mainUserName !== mainUserName || currentContent.mainDateTime !== mainDateTime ||
      currentContent.additionalReviewType !== additionalReviewType || currentContent.additionalUserName !== additionalUserName || currentContent.additionalDateTime !== additionalDateTime);
    if (needCreateNewText || this.IsParaEndRun()) {
        currentContent = {
            mainReviewType: mainReviewType,
            mainDateTime: mainDateTime,
            mainUserName: mainUserName,
            additionalReviewType: additionalReviewType,
            additionalDateTime: additionalDateTime,
            additionalUserName: additionalUserName,
            text: ''
        };
        oParentContent.push(currentContent);
    }
    this.Content.forEach(function (el) {
        currentContent.text += String.fromCharCode(el.Value)
    });
}

function getTestObject(oDocument) {
    return oDocument.getTestObject();
}


$(function () {

    QUnit.module("Unit-tests for merge documents feature");

    QUnit.test("Test", function(assert)
    {
        AscFormat.ExecuteNoHistory(function () {
            for (let i = 0; i < testObjectInfo.length; i += 1) {
                const test = testObjectInfo[i];
                merge(readMainDocument(test.originalDocument), readRevisedDocument(test.revisedDocument), function () {
                    const doc = mockEditor.WordControl.m_oLogicDocument;
                    const result = getTestObject(doc);
                    console.log(result)
                    assert.deepEqual(result, getTestObject(readMainDocument(answers[i].finalDocument)), comments[i]);
                });
            }
        }, this, []);
    });
});
