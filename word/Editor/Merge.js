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

(function (undefined) {
    const CDocumentComparison = AscCommonWord.CDocumentComparison;
    const CNode = AscCommonWord.CNode;
    const CTextElement = AscCommonWord.CTextElement;


    function getPriorityReviewType(arrOfTypes) {
        const bRemove = arrOfTypes.some(function (reviewType) {
            return reviewType === reviewtype_Remove;
        });
        if (bRemove) return reviewtype_Remove;

        const bAdd = arrOfTypes.some(function (reviewType) {
            return reviewType === reviewtype_Add;
        });
        if (bAdd) return reviewtype_Add;
        return reviewtype_Common;
    }

    function checkArrayForReviewType(arr) {
        for (let i = 0; i < 0; i += 1) {
            if (arr[i].GetReviewType && (arr[i].GetReviewType() !== reviewtype_Common)) {
                return true;
            }
        }
        return false;
    }

    function getChangeReviewTypesInformation(arrReviewTypesOfMainElement, arrReviewTypesOfRevisedElement) {
        const arrChangeReviewTypesInfo = [
            {
                nPriorityReviewType: reviewtype_Common,
                nStartChangeReviewIndex: -1,
                nEndChangeReviewIndex: 0,
                sReviewUserName: '',
                oReviewInfo: null,
                sReviewDate: ''
            }
        ];
        for (let i = 0; i < arrReviewTypesOfRevisedElement.length; i += 1) {
            const priorityReviewType = arrReviewTypesOfRevisedElement[i].reviewType;
            
            const oReviewInfo = arrReviewTypesOfRevisedElement[i].reviewInfo;
            const sReviewUserName = oReviewInfo && oReviewInfo.GetUserName();
            const sReviewDate = '' + oReviewInfo && oReviewInfo.DateTime;
            if (priorityReviewType !== reviewtype_Common) {
                const lastChangeReviewInfo = arrChangeReviewTypesInfo[arrChangeReviewTypesInfo.length - 1];
                if (lastChangeReviewInfo.nStartChangeReviewIndex === -1) {
                    lastChangeReviewInfo.nStartChangeReviewIndex = i;
                    lastChangeReviewInfo.nEndChangeReviewIndex = i - 1;
                    lastChangeReviewInfo.nPriorityReviewType = priorityReviewType;
                    lastChangeReviewInfo.sReviewUserName = sReviewUserName;
                    lastChangeReviewInfo.sReviewDate = sReviewDate;
                }
                if (i - 1 === lastChangeReviewInfo.nEndChangeReviewIndex 
                    && priorityReviewType === lastChangeReviewInfo.nPriorityReviewType 
                    && lastChangeReviewInfo.sReviewUserName === sReviewUserName 
                    && sReviewDate === lastChangeReviewInfo.sReviewDate) {
                    lastChangeReviewInfo.nEndChangeReviewIndex = i;
                    lastChangeReviewInfo.sReviewUserName = sReviewUserName;
                    lastChangeReviewInfo.sReviewDate = sReviewDate;
                } else {
                    arrChangeReviewTypesInfo.push({
                        nPriorityReviewType: priorityReviewType,
                        nStartChangeReviewIndex: i,
                        nEndChangeReviewIndex: i,
                        sReviewUserName: sReviewUserName,
                        sReviewDate: sReviewDate,
                    });
                }
            }
        }
        return arrChangeReviewTypesInfo;
    }
    
    function resolveTypesFromNodeWithPartner(originalNode, comparison) {
        originalNode.forEachRight(function (oNode) {
            const oPartnerNode = oNode.partner;
            const oOriginalTextElement = oNode.element;
            if (oOriginalTextElement instanceof CTextElement && oPartnerNode) {
                const oOriginalTextParagraph = oOriginalTextElement.firstRun.Paragraph;

                const oRevisedTextElement = oPartnerNode.element;
                const arrOriginalContent = oOriginalTextElement.firstRun.Paragraph.Content;
                
                const arrChangeReviewTypesInfo = getChangeReviewTypesInformation(oOriginalTextElement.reviewElementTypes, oRevisedTextElement.reviewElementTypes);
                
                let nCurrentOriginalRunIndex = oOriginalTextParagraph.Content.length - 1;
                for (let i = oOriginalTextParagraph.Content.length - 1; i >= 0; i -= 1) {
                    if (oOriginalTextParagraph.Content[i] === oOriginalTextElement.lastRun) {
                        nCurrentOriginalRunIndex = i;
                        break;
                    }
                }
                let oCurrentOriginalRun = arrOriginalContent[nCurrentOriginalRunIndex];
                let nCurrentOriginalRunElementIndex = oOriginalTextElement.getPosOfEnd();
                let bIsFindEndElementForChangeReview = false;
                const oNeedReviewWithUser = {};
                while (arrChangeReviewTypesInfo.length) {
                    const oChangeReviewInfoElement = arrChangeReviewTypesInfo.pop();
                    if (oChangeReviewInfoElement.nStartChangeReviewIndex !== -1) {
                        const nEndChangeReviewIndex = oChangeReviewInfoElement.nEndChangeReviewIndex;
                        const nStartChangeReviewIndex = oChangeReviewInfoElement.nStartChangeReviewIndex;
                        const nPriorityReviewType = oChangeReviewInfoElement.nPriorityReviewType;
                        const sReviewUserName = oChangeReviewInfoElement.sReviewUserName;
                        const sReviewDate = oChangeReviewInfoElement.sReviewDate;
                        const oFirstChangeElement = oOriginalTextElement.elements[nStartChangeReviewIndex];
                        const oLastChangeElement = oOriginalTextElement.elements[nEndChangeReviewIndex];
                        if (!oNeedReviewWithUser[sReviewDate]) {
                            oNeedReviewWithUser[sReviewDate] = {};
                        }
                        if (!oNeedReviewWithUser[sReviewDate][sReviewUserName]) {
                            const oNeedReview = {};
                            oNeedReview[reviewtype_Add] = [];
                            oNeedReview[reviewtype_Remove] = [];
                            oNeedReviewWithUser[sReviewDate][sReviewUserName] = oNeedReview;
                        }
                        while (nCurrentOriginalRunIndex !== -1) {
                            if (nCurrentOriginalRunElementIndex === -1) {
                                do {
                                    nCurrentOriginalRunIndex -= 1;
                                } while (arrOriginalContent[nCurrentOriginalRunIndex] && arrOriginalContent[nCurrentOriginalRunIndex].Content.length === 0)
                                
                                oCurrentOriginalRun  = arrOriginalContent[nCurrentOriginalRunIndex];
                                if (!oCurrentOriginalRun) {
                                    break;
                                }
                                nCurrentOriginalRunElementIndex = oCurrentOriginalRun.Content.length - 1;
                                
                                if (oCurrentOriginalRun === oOriginalTextElement.firstRun) {
                                    bIsFindEndElementForChangeReview = false;
                                } else if (bIsFindEndElementForChangeReview) {
                                    oNeedReviewWithUser[sReviewDate][sReviewUserName][nPriorityReviewType].push(oCurrentOriginalRun);
                                }
                            }
                            
                            if (oCurrentOriginalRun.Content[nCurrentOriginalRunElementIndex] === oLastChangeElement) {
                                bIsFindEndElementForChangeReview = true;
                                oCurrentOriginalRun.Split2(nCurrentOriginalRunElementIndex + 1, oOriginalTextParagraph, nCurrentOriginalRunIndex);
                            }

                            if (oCurrentOriginalRun.Content[nCurrentOriginalRunElementIndex] === oFirstChangeElement) {
                                const oNewRun = oCurrentOriginalRun.Split2(nCurrentOriginalRunElementIndex, oOriginalTextParagraph, nCurrentOriginalRunIndex);
                                oNeedReviewWithUser[sReviewDate][sReviewUserName][nPriorityReviewType].push(oNewRun);
                                break;
                            }
                            nCurrentOriginalRunElementIndex -= 1;
                        }
                    }
                }

                for (let sReviewDate in oNeedReviewWithUser) {
                    for (let sUserName in oNeedReviewWithUser[sReviewDate]) {
                        comparison.setReviewInfoForArray(oNeedReviewWithUser[sReviewDate][sUserName][reviewtype_Add], reviewtype_Add, sUserName, parseInt(sReviewDate, 10));
                        comparison.setReviewInfoForArray(oNeedReviewWithUser[sReviewDate][sUserName][reviewtype_Remove], reviewtype_Remove, sUserName, parseInt(sReviewDate, 10));
                    }
                }
            }
        });
    }

    function CMergeComparisonNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
    }

    CMergeComparisonNode.prototype = Object.create(CNode.prototype);
    CMergeComparisonNode.prototype.constructor = CMergeComparisonNode;

    CMergeComparisonNode.prototype.privateCompareElements = function (oNode, bCheckNeighbors) {
        const oElement1 = this.element;
        const oElement2 = oNode.element;
        if (oElement1.isReviewWord !== oElement2.isReviewWord) {
            return false;
        }
        return CNode.prototype.privateCompareElements.call(this, oNode, bCheckNeighbors);
    }

    CMergeComparisonNode.prototype.copyRunWithMockParagraph = function (oRun, mockParagraph, comparison) {
        const oRet = CNode.prototype.copyRunWithMockParagraph.call(this, oRun, mockParagraph, comparison);
        return oRet;
    };

    CMergeComparisonNode.prototype.pushToArrInsertContentWithCopy = function (aContentToInsert, elem, comparison) {
        CNode.prototype.pushToArrInsertContentWithCopy.call(this, aContentToInsert, elem, comparison);
    }


    CMergeComparisonNode.prototype.setCommonReviewTypeWithInfo = function (element, info) {
        element.SetReviewTypeWithInfo((element.GetReviewType && element.GetReviewType()) || reviewtype_Common, info);
    };

    CMergeComparisonNode.prototype.applyInsert = function (arrToInsert, arrToRemove, nInsertPosition, comparison, opts) {
        const oThis = this;
        opts = opts || {};
        if (arrToInsert.length === 0) {
            for (let i = 0; i < arrToRemove.length; i += 1) {
                comparison.setRemoveReviewType(arrToRemove[i]);
            }
        } else if (arrToRemove.length === 0) {
            this.insertContentAfterRemoveChanges(arrToInsert, nInsertPosition, comparison);
        }/* else if (!(checkArrayForReviewType(arrToInsert) || checkArrayForReviewType(arrToRemove))) { // TODO: подумать, действительно ли это быстрее
            CNode.prototype.applyInsert.call(this, arrToInsert, arrToRemove, nInsertPosition, comparison, opts);
        } */else {
            arrToInsert = arrToInsert.reverse();
            if (opts.needReverse) {
                arrToRemove = arrToRemove.reverse();
            }
            nInsertPosition = arrToRemove[0].GetPosInParent();
            comparison.resolveConflicts(arrToInsert, arrToRemove, arrToRemove[0].Paragraph, nInsertPosition);
        }
    }

    function CMergeComparisonTextElement() {
        CTextElement.call(this);
        this.isReviewWord = false;
        this.reviewElementTypes = [];
    }

    CMergeComparisonTextElement.prototype = Object.create(CTextElement.prototype);
    CMergeComparisonTextElement.prototype.constructor = CMergeComparisonTextElement;

    CMergeComparisonTextElement.prototype.addToElements = function (element, reviewType) {
        CTextElement.prototype.addToElements.call(this, element);
        this.reviewElementTypes.push(reviewType);
        if (reviewType.reviewType !== reviewtype_Common) {
            this.isReviewWord = true;
        }
    };

    CMergeComparisonTextElement.prototype.equals = function (otherElement) {
        const bEquals = CTextElement.prototype.equals.call(this, otherElement);
        if (!bEquals) {
            return false;
        }
        if (this.reviewElementTypes.length === otherElement.reviewElementTypes.length) {
            for (let i = 0; i < this.reviewElementTypes.length; i += 1) {
                if (this.reviewElementTypes[i].reviewType !== otherElement.reviewElementTypes[i].reviewType) {
                    return false;
                }
            }
        }

        return bEquals;
    }

    function CResolveConflictTextElement() {
        CTextElement.call(this);
        this.reviewElementTypes = [];
    }

    CResolveConflictTextElement.prototype = Object.create(CTextElement.prototype);
    CResolveConflictTextElement.prototype.constructor = CResolveConflictTextElement;
    CResolveConflictTextElement.prototype.addToElements = CMergeComparisonTextElement.prototype.addToElements;
    

    function CDocumentResolveConflictComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.parentParagraph = null;
        this.startPosition = 0;
        this.copyPr = {
            CopyReviewPr: false,
            Comparison: this,
        };
        this.bSaveCustomReviewType = true;
    }

    CDocumentResolveConflictComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentResolveConflictComparison.prototype.constructor = CDocumentResolveConflictComparison;

    CDocumentResolveConflictComparison.prototype.getNodeConstructor = function () {
        return CConflictResolveNode;
    }

    CDocumentResolveConflictComparison.prototype.setReviewInfoForArray = function (arrNeedReviewObjects, nType, sCustomReviewUserName, nCustomReviewDate) {
        for (let i = 0; i < arrNeedReviewObjects.length; i += 1) {
            const oNeedReviewObject = arrNeedReviewObjects[i];
            if (oNeedReviewObject.SetReviewTypeWithInfo) {
                let oReviewInfo = oNeedReviewObject.ReviewInfo.Copy();
                this.setReviewInfo(oReviewInfo, sCustomReviewUserName, nCustomReviewDate);
                if (this.bSaveCustomReviewType) {
                    const reviewType = oNeedReviewObject.GetReviewType && oNeedReviewObject.GetReviewType();
                    if (reviewType === reviewtype_Add || reviewType === reviewtype_Remove) {
                        if (nType === reviewtype_Add && reviewType === reviewtype_Remove) {
                            oReviewInfo = oNeedReviewObject.ReviewInfo.Copy();
                            oReviewInfo.SavePrev(reviewtype_Add);
                            nType = reviewtype_Remove;
                        } else if (reviewType === reviewtype_Add && nType === reviewtype_Remove) {
                            oReviewInfo = oNeedReviewObject.ReviewInfo.Copy();
                            oReviewInfo.SavePrev(reviewtype_Add);
                            if (sCustomReviewUserName) {
                                oReviewInfo.UserName = sCustomReviewUserName;
                            }
                            if (nCustomReviewDate) {
                                oReviewInfo.DateTime = nCustomReviewDate;
                            }
                        }
                    }
                }
                oNeedReviewObject.SetReviewTypeWithInfo(nType, oReviewInfo, false);
            }
        }
    }

    CDocumentResolveConflictComparison.prototype.getTextElementConstructor = function () {
        return CResolveConflictTextElement;
    }

    CDocumentResolveConflictComparison.prototype.getReviewTypeAndName = function (oRun) {
        const oReviewInfo = oRun.GetReviewInfo && oRun.GetReviewInfo();
        const reviewType = oRun.GetReviewType && oRun.GetReviewType();
        return {
            reviewType: reviewType,
            reviewInfo: oReviewInfo,
        };
    }

    CDocumentResolveConflictComparison.prototype.applyChangesToParagraph = function (oNode) {
        oNode.changes.sort(function (c1, c2) {
            return c2.anchor.index - c1.anchor.index;
        });
        let currentChangeId = 0;
        for (let i = oNode.children.length - 1; i >= 0; i -= 1) {
            const oChildNode = oNode.children[i];
            if (currentChangeId < oNode.changes.length && oNode.changes[currentChangeId].anchor.index === i) {
                const aContentToInsert = oNode.getArrOfInsertsFromChanges(currentChangeId, this);
                //handle removed elements
                oNode.applyInsertsToParagraph(this, aContentToInsert, currentChangeId);
                currentChangeId += 1
            } else {
                if (i !== oNode.children.length - 1) {
                    resolveTypesFromNodeWithPartner(oChildNode, this);
                }
            }
            if (currentChangeId < oNode.changes.length && oNode.changes[currentChangeId].anchor.index > i) {
                currentChangeId += 1;
            }
        }

        this.applyChangesToChildrenOfParagraphNode(oNode);
        this.applyChangesToSectPr(oNode);
    }

    CDocumentResolveConflictComparison.prototype.getLCSEqualsMethod = function () {
        return function () {
            return true;
        }
    }

    CDocumentResolveConflictComparison.prototype.setRemoveReviewType = function (element) {
        if (!(element.IsParaEndRun && element.IsParaEndRun())) {
            if (!element.GetReviewType || element.GetReviewType && element.GetReviewType() === reviewtype_Common) {
                this.setReviewInfoRecursive(element, reviewtype_Add);
            }
        }
    }

    function CConflictResolveNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
    }

    CConflictResolveNode.prototype = Object.create(CNode.prototype);
    CConflictResolveNode.prototype.constructor = CConflictResolveNode;

    CConflictResolveNode.prototype.getApplyParagraph = function (comparison) {
        return comparison.parentParagraph;
    }

    CConflictResolveNode.prototype.copyRunWithMockParagraph = function (oRun, mockParagraph, comparison) {
        comparison.copyPr.bSaveCustomReviewType = true;
        const oRet = CNode.prototype.copyRunWithMockParagraph.call(this, oRun, mockParagraph, comparison);
        delete comparison.copyPr.bSaveCustomReviewType;
        return oRet;
    };

    CConflictResolveNode.prototype.pushToArrInsertContentWithCopy = function (aContentToInsert, elem, comparison) {
        comparison.copyPr.bSaveCustomReviewType = true;
        CNode.prototype.pushToArrInsertContentWithCopy.call(this, aContentToInsert, elem, comparison);
        delete comparison.copyPr.bSaveCustomReviewType;
    }

    CConflictResolveNode.prototype.setCommonReviewTypeWithInfo = function (element, info) {
        element.SetReviewTypeWithInfo((element.GetReviewType && element.GetReviewType()) || reviewtype_Common, info);
    }
    
    CConflictResolveNode.prototype.getStartPosition = function (comparison) {
        return comparison.startPosition;
    }

    function CMockDocument() {
        this.Content = [];
    }

    function CMockParagraph() {
        this.Content = [];
    }

    function CMockMinHash() {
        this.count = 0;
        this.countLetters = 0;
    }

    CMockMinHash.prototype.jaccard = function () {
        return 0.8;
    }

    CMockMinHash.prototype.update = function () {
        this.count += 1;
    }

    function CDocumentMergeComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.bSaveCustomReviewType = true;
        this.copyPr = {
            CopyReviewPr: false,
            Comparison: this,
            SkipUpdateInfo: true
        };
    }

    CDocumentMergeComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentMergeComparison.prototype.constructor = CDocumentMergeComparison;


    CDocumentMergeComparison.prototype.setRemoveReviewType = function (element) {
        if (!(element.IsParaEndRun && element.IsParaEndRun())) {
            if (!element.GetReviewType || element.GetReviewType && element.GetReviewType() === reviewtype_Common) {
                this.setReviewInfoRecursive(element, reviewtype_Add);
            }
        }
    }

    CDocumentMergeComparison.prototype.resolveCustomReviewTypesBetweenElements = function (oMainElement, oRevisedElement) {
        const nMainReviewType = oMainElement.GetReviewType();
        const nRevisedReviewType = oRevisedElement.GetReviewType();
        if (nRevisedReviewType !== reviewtype_Common && nRevisedReviewType !== nMainReviewType) {
            const oMainReviewInfo = oMainElement.GetReviewInfo();
            const oRevisedReviewInfo = oRevisedElement.GetReviewInfo().Copy();
            if (nMainReviewType === reviewtype_Common) {
                oMainElement.SetReviewTypeWithInfo(nRevisedReviewType, oRevisedReviewInfo);
            } else if (nMainReviewType === reviewtype_Add) {
                oRevisedReviewInfo.SavePrev(reviewtype_Add);
                oMainElement.SetReviewTypeWithInfo(reviewtype_Remove, oRevisedReviewInfo);
            } else if (nMainReviewType === reviewtype_Remove) {
                oMainReviewInfo.SavePrev(reviewtype_Add);
                oMainElement.SetReviewTypeWithInfo(reviewtype_Remove, oMainReviewInfo);
            }
        }
    }

    CDocumentMergeComparison.prototype.checkParaEndReview = function (oNode) {
        if (oNode && oNode.element.GetType() === type_Paragraph && oNode.partner) {
            const oMainParaEnd = oNode.element.GetParaEndRun();
            const oRevisedParaEnd = oNode.partner.element.GetParaEndRun();
            this.resolveCustomReviewTypesBetweenElements(oMainParaEnd, oRevisedParaEnd);
        }
    };

    CDocumentMergeComparison.prototype.applyChangesToTableSize = function(oNode) {
        this.copyPr.SkipUpdateInfo = false;
        this.copyPr.bSaveCustomReviewType = true;
        CDocumentComparison.prototype.applyChangesToTableSize.call(this, oNode);
        delete this.copyPr.bSaveCustomReviewType;
        this.copyPr.SkipUpdateInfo = true;
    }

    CDocumentMergeComparison.prototype.checkRowReview = function(oRowNode) {
        const oPartnerNode = oRowNode.partner;
        if (oPartnerNode) {
            const oMainRow = oRowNode.element;
            const oPartnerRow = oPartnerNode.element;
            this.resolveCustomReviewTypesBetweenElements(oMainRow, oPartnerRow);
        }
    };

    CDocumentMergeComparison.prototype.resolveConflicts = function (arrToInserts, arrToRemove, applyParagraph, nInsertPosition) {
        if (arrToInserts.length === 0 || arrToRemove.length === 0) return;
        arrToRemove.push(new AscCommonWord.ParaRun());
        arrToInserts.push(new AscCommonWord.ParaRun());
        arrToRemove[arrToRemove.length - 1].Content.push(new AscWord.CRunParagraphMark());
        arrToInserts[arrToInserts.length - 1].Content.push(new AscWord.CRunParagraphMark());
        const comparison = new CDocumentResolveConflictComparison(this.originalDocument, this.revisedDocument, this.options);
        const originalDocument = new CMockDocument();
        const revisedDocument = new CMockDocument();
        const originalParagraph = new CMockParagraph();
        const revisedParagraph = new CMockParagraph();
        const origParagraph = applyParagraph;
        comparison.startPosition = nInsertPosition;
        comparison.parentParagraph = origParagraph;
        originalParagraph.Content = arrToRemove;
        revisedParagraph.Content = arrToInserts;
        originalDocument.Content.push(originalParagraph);
        revisedDocument.Content.push(revisedParagraph);

        comparison.compareRoots(originalDocument, revisedDocument);
        return originalParagraph.Content;
    }

    CDocumentMergeComparison.prototype.getReviewTypeAndName = function (oRun) {
        const oReviewInfo = oRun.GetReviewInfo && oRun.GetReviewInfo();
        const sUserName = oReviewInfo && oReviewInfo.GetUserName();
        const reviewType = oRun.GetReviewType && oRun.GetReviewType();
        return {
            reviewType: reviewType,
            userName: sUserName
        };
    }

    CDocumentMergeComparison.prototype.applyParagraphComparison = function (oOrigRoot, oRevisedRoot) {
        this.copyPr.SkipUpdateInfo = false;
        this.copyPr.bSaveCustomReviewType = true;
        CDocumentComparison.prototype.applyParagraphComparison.call(this, oOrigRoot, oRevisedRoot);
        for (let i = oOrigRoot.children.length - 1; i >= 0; i -= 1) {
            this.checkParaEndReview(oOrigRoot.children[i]);
        }
        const oParentContent = oOrigRoot.element.Content;
        const oLastElement = oParentContent[oParentContent.length - 1];
        if (oLastElement && oLastElement.GetReviewType() !== reviewtype_Common) {
            oLastElement.SetReviewType(reviewtype_Common);
        }

        delete this.copyPr.bSaveCustomReviewType;
        this.copyPr.SkipUpdateInfo = true;
    };

    CDocumentMergeComparison.prototype.getNodeConstructor = function () {
        return CMergeComparisonNode;
    };


    CDocumentMergeComparison.prototype.getTextElementConstructor = function () {
        return CMergeComparisonTextElement;
    };

    CDocumentMergeComparison.prototype.GetReviewTypeFromParaDrawing = function (oParaDrawing) {
        const oRun = oParaDrawing.GetRun();
        if (oRun) {
            return oRun.GetReviewType();
        }
        return reviewtype_Common;
    }

    CDocumentMergeComparison.prototype.compareDrawingObjects = function (oBaseDrawing, oCompareDrawing, bOrig) {
        if (oBaseDrawing && oCompareDrawing) {
            const baseReviewType = this.GetReviewTypeFromParaDrawing(oBaseDrawing);
            const compareReviewType = this.GetReviewTypeFromParaDrawing(oCompareDrawing);
            const arrOfReviewTypes = [];

            if (baseReviewType) arrOfReviewTypes.push(baseReviewType);
            if (compareReviewType) arrOfReviewTypes.push(compareReviewType);

            const priorityReviewType = getPriorityReviewType(arrOfReviewTypes);

            const oBaseRun = bOrig ? oBaseDrawing.GetRun() : oCompareDrawing.GetRun();
            this.setReviewInfoForArray([oBaseRun], priorityReviewType);
        }
        CDocumentComparison.prototype.compareDrawingObjects.call(this, oBaseDrawing, oCompareDrawing);
    }



    CDocumentMergeComparison.prototype.compare = function (callback) {
        const oOriginalDocument = this.originalDocument;
        const oRevisedDocument = this.revisedDocument;
        if (!oOriginalDocument || !oRevisedDocument) {
            return;
        }
        const oThis = this;
        const aImages = AscCommon.pptx_content_loader.End_UseFullUrl();
        const oObjectsForDownload = AscCommon.GetObjectsForImageDownload(aImages);
        const oApi = oOriginalDocument.GetApi();
        if (!oApi) {
            return;
        }
        const fCallback = function (data) {
            const oImageMap = {};
            AscFormat.ExecuteNoHistory(function () {
                AscCommon.ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
            }, oThis, []);

            const NewNumbering = oRevisedDocument.Numbering.CopyAllNums(oOriginalDocument.Numbering);
            oRevisedDocument.CopyNumberingMap = NewNumbering.NumMap;
            oOriginalDocument.Numbering.AppendAbstractNums(NewNumbering.AbstractNum);
            oOriginalDocument.Numbering.AppendNums(NewNumbering.Num);
            for (let key in NewNumbering.NumMap) {
                if (NewNumbering.NumMap.hasOwnProperty(key)) {
                    oThis.checkedNums[NewNumbering.NumMap[key]] = true;
                }
            }
            oThis.compareRoots(oOriginalDocument, oRevisedDocument);
            oThis.compareSectPr(oOriginalDocument, oRevisedDocument);

            const oFonts = oOriginalDocument.Document_Get_AllFontNames();
            const aFonts = [];
            for (let i in oFonts) {
                if (oFonts.hasOwnProperty(i)) {
                    aFonts[aFonts.length] = new AscFonts.CFont(i, 0, "", 0, null);
                }
            }
            oApi.pre_Paste(aFonts, oImageMap, function () {
                callback && callback();
            });
        };
        AscCommon.sendImgUrls(oApi, oObjectsForDownload.aUrls, fCallback, null, true);
        return null;
    };

    function CDocumentMerge(oOriginalDocument, oRevisedDocument, oOptions) {
        this.originalDocument = oOriginalDocument;
        this.revisedDocument = oRevisedDocument;
        this.options = oOptions;
        this.api = oOriginalDocument.GetApi();
        this.comparison = new CDocumentMergeComparison(oOriginalDocument, oRevisedDocument, oOptions ? oOptions : new AscCommonWord.ComparisonOptions());
        this.oldTrackRevisions = false;
    }

    CDocumentMerge.prototype.resolveConflicts = CDocumentMergeComparison.prototype.resolveConflicts;

    CDocumentMerge.prototype.applyLastMergeCallback = function () {
        const oOriginalDocument = this.originalDocument;
        const oApi = this.api;
        if (!(oApi && oOriginalDocument)) {
            return;
        }

        oOriginalDocument.SetTrackRevisions(this.oldTrackRevisions);
        oOriginalDocument.End_SilentMode(false);
        oOriginalDocument.Recalculate();
        oOriginalDocument.UpdateInterface();
        oOriginalDocument.FinalizeAction();
        oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
    }

    CDocumentMerge.prototype.merge = function () {
        const oOriginalDocument = this.originalDocument;
        const oRevisedDocument = this.revisedDocument;
        if (!oOriginalDocument || !oRevisedDocument) {
            return;
        }

        oOriginalDocument.StopRecalculate();
        oOriginalDocument.StartAction(AscDFH.historydescription_Document_MergeDocuments);
        oOriginalDocument.Start_SilentMode();
        this.oldTrackRevisions = oOriginalDocument.IsTrackRevisions();
        oOriginalDocument.SetTrackRevisions(false);

        this.comparison.compare(this.applyLastMergeCallback.bind(this));
    };


    function mergeBinary(oApi, sBinary2, oOptions) {
        const oDoc1 = oApi.WordControl.m_oLogicDocument;
        if (!window['NATIVE_EDITOR_ENJINE']) {
            const oCollaborativeEditing = oDoc1.CollaborativeEditing;
            if (oCollaborativeEditing && !oCollaborativeEditing.Is_SingleUser()) {
                oApi.sendEvent("asc_onError", Asc.c_oAscError.ID.CannotCompareInCoEditing, c_oAscError.Level.NoCritical);
                return;
            }
        }
        oApi.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);

        const oDoc2 = AscFormat.ExecuteNoHistory(function () {
            const openParams = {noSendComments: true};
            let oDoc2 = new CDocument(oApi.WordControl.m_oDrawingDocument, true);
            oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc2;
            oApi.WordControl.m_oLogicDocument = oDoc2;
            const oBinaryFileReader = new AscCommonWord.BinaryFileReader(oDoc2, openParams);
            AscCommon.pptx_content_loader.Start_UseFullUrl(oApi.insertDocumentUrlsData);
            if (!oBinaryFileReader.Read(sBinary2)) {
                oDoc2 = null;
            }
            oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc1;
            oApi.WordControl.m_oLogicDocument = oDoc1;
            if (oDoc1.History)
                oDoc1.History.Set_LogicDocument(oDoc1);
            if (oDoc1.CollaborativeEditing)
                oDoc1.CollaborativeEditing.m_oLogicDocument = oDoc1;
            return oDoc2;
        }, this, []);

        oDoc1.History.Document = oDoc1;

        if (oDoc2) {
            const oMerge = new AscCommonWord.CDocumentMerge(oDoc1, oDoc2, oOptions ? oOptions : new ComparisonOptions());
            oMerge.merge();
        } else {
            AscCommon.pptx_content_loader.End_UseFullUrl();
        }

    }
    
    function mergeDocuments(oApi, oTmpDocument) {
        oApi.insertDocumentUrlsData = {
            imageMap: oTmpDocument["GetImageMap"](), documents: [], convertCallback: function (_api, url) {
            }, endCallback: function (_api) {
            }
        };
        mergeBinary(oApi, oTmpDocument["GetBinary"](), null, true);
        oApi.insertDocumentUrlsData = null;
    }

    window['AscCommonWord'].CDocumentMerge = CDocumentMerge;
    window['AscCommonWord'].mergeBinary = mergeBinary;
    window['AscCommonWord'].CMockMinHash = CMockMinHash;
    window['AscCommonWord'].CMockDocument = CMockDocument;
    window['AscCommonWord'].CMockParagraph = CMockParagraph;
    window['AscCommonWord']["mergeDocuments"] = window['AscCommonWord'].mergeDocuments = mergeDocuments;

})()
