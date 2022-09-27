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

    function isParaDrawingRun(run) {
        for (let i = 0; i < run.Content.length; i += 1) {
            if (run.Content[i].Type === para_Drawing) return true;
        }
        return false;
    }
    function isAnchorParaDrawingRun(run) {
        if (!run.Content) return false;
        for (let i = 0; i < run.Content.length; i += 1) {
            if (run.Content[i].Type === para_Drawing && !run.Content[i].IsInline()) return true;
        }
        return false;
    }

    // TODO:  напоминание
    // В слиянии мы делаем сравнение, не учитывая части с ревью,
    // Далее при добавлении в исходный документ найденных изменений при сравнении,
    // сравниваем их с исходными измененными частями и в исходный документ добавляем уже это сравнение
    // Бывает так, что часть с ревью и сравненная часть совпадают между собой,
    // но отличаются лишь пробелами по краям(не только пробелами, а всеми возможными частями слева и справа)
    // Поскольку при сравнении пробелы могут быть выбраны как слева, так и справа,
    // то приоритет надо отдавать пробелам в исходной измененной части и провести балансировку пробелов в полученных изменениях при сравнении
    // Так же стоит оптимизировать вызов сравнения измененных частей двух документов,
    // если внутри двух массивов нет элементов с ревью, то сравнение этих кусков производить не нужно. (не уверен, на двухстраничном документе это слегка замедлило работу(2ms))
    // Стоит так же подумать о приоритетном типе ревью, бывают случаи, когда выставляется тип удаления, а иногда и добавления. P.S. Скорее всего, если авторы разные, то изменения добавляются с разным типом  ревью (Это не так, создатели документа и авторы изменений могут быть раными)

    //
    // function countFreeSpacesBefore(oRun, posInParent) { // TODO: надо написать полноценный балансировщик
    //     const oParagraph = oRun.Paragraph;
    //     posInParent = posInParent || oRun.GetPosInParent();
    //     let countOfFreeSpaces = 0;
    //     let bBreak = false;
    //     for (let i = posInParent; i >= 0; i -= 1) {
    //
    //         const currentRun = oParagraph.Content[i];
    //         if (currentRun.GetReviewType() !== reviewtype_Common || bBreak) {
    //             break;
    //         }
    //
    //         for (let j = currentRun.Content.length - 1; j >= 0; j -= 1) {
    //             const textElement = currentRun.Content[j];
    //             if (textElement.Type === para_Space) {
    //                 countOfFreeSpaces += 1;
    //             } else {
    //                 bBreak = true;
    //                 break;
    //             }
    //         }
    //     }
    //     return countOfFreeSpaces;
    // }
    //
    // function countFreeSpacesAfter(oRun, posInParent) {
    //     const oParagraph = oRun.Paragraph;
    //     posInParent = posInParent || oRun.GetPosInParent();
    //     let countOfFreeSpaces = 0;
    //     let bBreak = false;
    //     for (let i = posInParent; i < oParagraph.Content.length; i += 1) {
    //
    //         const currentRun = oParagraph.Content[i];
    //         if (currentRun.GetReviewType() !== reviewtype_Common || bBreak) {
    //             break;
    //         }
    //         for (let j = 0; j < currentRun.Content.length; j += 1) {
    //             const textElement = currentRun.Content[j];
    //             if (textElement.Type === para_Space) {
    //                 countOfFreeSpaces += 1;
    //             } else {
    //                 bBreak = true;
    //                 break;
    //             }
    //         }
    //     }
    //     return countOfFreeSpaces;
    // }



    function isOnlySpaceParaRun(element) {
        if (element instanceof ParaRun) {
            return element.Content.every(function (textElem) {
                return textElem.Type === para_Space;
            });
        }
        return false;
    }


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

    function collectReviewRunsBefore(oRun, posInParent) {
        const arrRet = [];
        const oParagraph = oRun.Paragraph;
        posInParent = AscFormat.isRealNumber(posInParent) ? posInParent : oRun.GetPosInParent();
        let posNextRun = posInParent - 1;
        while (posNextRun >= 0) {
            const checkElem = oParagraph.Content[posNextRun];
            if (checkElem instanceof ParaRun) {
                if ((checkElem.GetReviewType && checkElem.GetReviewType() !== reviewtype_Common) || isOnlySpaceParaRun(checkElem)) {
                    arrRet.unshift(checkElem);
                } else {
                    break;
                }
            } else {
                break;
            }
            posNextRun -= 1;
        }

        return arrRet;
    }

    function collectReviewRunsAfter(oRun, posInParent) {
        const arrRet = [];
        const oParagraph = oRun.Paragraph;
        posInParent = AscFormat.isRealNumber(posInParent) ? posInParent : oRun.GetPosInParent();
        let posNextRun = posInParent;
        while (posNextRun < oParagraph.Content.length) {
            const checkElem = oParagraph.Content[posNextRun];
            if (checkElem instanceof ParaRun) {
                if ((checkElem.GetReviewType && checkElem.GetReviewType() !== reviewtype_Common) || isOnlySpaceParaRun(checkElem)) {
                    arrRet.push(checkElem);
                } else if (posInParent !== posNextRun) {
                    break;
                }
            } else {
                break;
            }
            posNextRun += 1;
        }
        return arrRet;
    }
    // CDocumentMergeComparison.prototype.setTypesForReview = function () {
    //     const oCore = this.revisedDocument.Core;
    //     const oCore2 = this.originalDocument.Core;
    //     console.log(oCore, oCore2)
    // }


    // CDocumentMergeComparison.prototype.isDuplicateArrOfRuns = function (arrOfRemove, arrOfInsert) {
    //     const comparison = new CDocumentResolveConflictComparison(this.originalDocument, this.revisedDocument, this.options);
    //     const originalDocument = new CMockDocument();
    //     const originalParagraph = new CMockParagraph();
    //     originalDocument.Content = [originalParagraph];
    //     originalParagraph.Content = arrOfRemove;
    //
    //     const revisedDocument = new CMockDocument();
    //     const revisedParagraph = new CMockParagraph();
    //     revisedDocument.Content = [revisedParagraph];
    //     revisedParagraph.Content = arrOfInsert;
    //
    //     const rootOfRemove = comparison.createNodeFromDocContent(originalDocument);
    //     const rootOfInsert = comparison.createNodeFromDocContent(revisedDocument);
    //
    //     const childrenOfRemove = rootOfRemove.children[0].children;
    //     const childrenOfInsert = rootOfInsert.children[0].children;
    //     if (childrenOfRemove.length !== childrenOfInsert.length) {
    //         return {isDuplicate: false};
    //     }
    //
    //     function countOfSpaces(arr) {
    //         const spacesInStart = [];
    //         for (let i = 0; i < arr.length; i += 1) {
    //             const oNode = arr[i];
    //             if (oNode.element.isSpaceText()) {
    //                 spacesInStart.push(oNode);
    //             } else {
    //                 break;
    //             }
    //         }
    //         const spacesInEnd = [];
    //         for (let i = arr.length - 1; i >= 0; i -= 1) {
    //             const oNode = arr[i];
    //             if (oNode.element.isSpaceText()) {
    //                 spacesInEnd.push(oNode);
    //             } else {
    //                 break;
    //             }
    //         }
    //         return {spacesInStart: spacesInStart, spacesInEnd: spacesInEnd};
    //     }
    //     const countOfInsertSpaces = countOfSpaces(childrenOfInsert);
    //     const countOfRemoveSpaces = countOfSpaces(childrenOfRemove);
    //
    //     if (countOfInsertSpaces.spacesInStart.length > countOfRemoveSpaces.spacesInStart.length) {
    //         if (countOfInsertSpaces.spacesInEnd.length < countOfRemoveSpaces.spacesInEnd.length) {
    //
    //             const needToReplace = countOfInsertSpaces.spacesInStart.length - countOfRemoveSpaces.spacesInStart.length;
    //             const firstRunOfRemove = childrenOfRemove[0].element.firstRun;
    //             const lastRunOfRemove = childrenOfRemove[childrenOfRemove.length - 1].element.lastRun;
    //             const paragraph = firstRunOfRemove.Paragraph;
    //             const posInParagraph = firstRunOfRemove.GetPosInParent();
    //
    //             if (posInParagraph !== 0) {
    //                 const availableSpacesInEnd = countFreeSpacesBefore(paragraph.Content[posInParagraph - 1]);
    //                 const replaceAmount = Math.min(availableSpacesInEnd, needToReplace);
    //                 const oNodeCount = childrenOfRemove[childrenOfRemove.length - replaceAmount];
    //
    //                 if (oNodeCount) {
    //                     const firstElement = oNodeCount.element.elements[0];
    //                     const posOfElement = oNodeCount.element.firstRun.GetElementPosition(firstElement);
    //                     const firstRun = oNodeCount.element.firstRun;
    //                     const posFirstRun = firstRun.GetPosInParent();
    //                     const newRun = firstRun.Split2(posOfElement, paragraph, posFirstRun);
    //                     const arrNeedForCommon = [];
    //                     if (firstRun === lastRunOfRemove) {
    //                         arrNeedForCommon.push(newRun);
    //                     } else {
    //                         for (let i = posFirstRun + 1; i < lastRunOfRemove.GetPosInParent(); i += 1) {
    //                             const currentRun = paragraph.Content[i];
    //                             arrNeedForCommon.push(currentRun);
    //                         }
    //                     }
    //
    //                     comparison.setReviewInfoForArray(arrNeedForCommon, reviewtype_Common);
    //                 }
    //             }
    //         }
    //     }
    //
    //     for (let i = 0; i < childrenOfRemove.length; i++) {
    //         const oNode1 = childrenOfRemove[i];
    //         const oNode2 = childrenOfInsert[i];
    //         const bEquals = oNode1.equals(oNode2);
    //         if (!bEquals) return {isDuplicate: false};
    //     }
    //
    //
    //     return {isDuplicate: true};
    // }

    //
    //
    // function collectReviewRunsAfter(oRun, posInParent, checkSpacesArray) {
    //     const arrRet = [];
    //     const oParagraph = oRun.Paragraph;
    //     posInParent = AscFormat.isRealNumber(posInParent) ? posInParent : oRun.GetPosInParent();
    //     let posNextRun = posInParent;
    //     let bNotSkipSpaces = false;
    //     while (posNextRun < oParagraph.Content.length) {
    //         const checkElem = oParagraph.Content[posNextRun];
    //         if (checkElem instanceof ParaRun) {
    //             if ((checkElem.GetReviewType && checkElem.GetReviewType() !== reviewtype_Common)) {
    //                 arrRet.push(checkElem);
    //                 bNotSkipSpaces = true;
    //             } else if (isOnlySpaceParaRun(checkElem)) {
    //                 if (bNotSkipSpaces) {
    //                     arrRet.push(checkElem);
    //                 }
    //             } else if (posInParent !== posNextRun) {
    //                 break;
    //             }
    //         } else {
    //             break;
    //         }
    //         posNextRun += 1;
    //     }
    //
    //     while (arrRet.length && arrRet[arrRet.length - 1].GetReviewType() === reviewtype_Common) {
    //         arrRet.pop();
    //     }
    //     // checkSpacesArray.
    //     return arrRet;
    // }

    function CMergeComparisonNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
    }

    CMergeComparisonNode.prototype = Object.create(CNode.prototype);
    CMergeComparisonNode.prototype.constructor = CMergeComparisonNode;


    CMergeComparisonNode.prototype.applyInsertsToParagraphsWithoutRemove = function (comparison, aContentToInsert, idxOfChange) {
        const oElement = this.element;
        const oChange = this.changes[idxOfChange];
        const insertPosition = this.getStartPosition();
        if (aContentToInsert.length > 0) {
            const index = oChange.anchor.index;
            const oChildNode = this.children[index];
            if (oChildNode) {
                const oFirstText = oChildNode.element;
                for (let j = 0; j < oElement.Content.length; ++j) {
                    if (Array.isArray(oElement.Content)) {
                        const oCurRun = oElement.Content[j];
                        // если совпали ран, после которого нужно вставлять и ран из цикла
                        if (oFirstText === oCurRun) {
                            this.applyInsert(aContentToInsert, [], j + 1, comparison);
                            break;
                        }
                        // иначе надо посмотреть, возможно стоит вставлять элементы не после рана, а после конкретного элемента и текущий ран из цикла нужно засплитить
                        else if (Array.isArray(oCurRun.Content) && Array.isArray(oFirstText.elements)) {
                            let k = 0;
                            for (k; k < oCurRun.Content.length; ++k) {
                                // если элементы совпали, значит, мы нашли место вставки
                                if (oFirstText.elements[0] === oCurRun.Content[k]) {
                                    break;
                                }
                            }
                            let bFind = false;
                            // проверим, не дошли ли мы просто до конца массива, ничего не встретив
                            if (k === oCurRun.Content.length) {
                                if (oFirstText.firstRun === oCurRun) {
                                    k = 0;
                                    bFind = true;
                                }
                            } else {
                                bFind = true;
                            }
                            if (k <= oCurRun.Content.length && bFind) {
                                const arrOfReview = collectReviewRunsBefore(oCurRun, oCurRun.GetPosInParent());
                                oCurRun.Split2(k, oElement, insertPosition + j);
                                this.applyInsert(aContentToInsert, arrOfReview, j + 1, comparison);
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    CMergeComparisonNode.prototype.setRemoveReviewType = function (element, comparison) {
        if (!(element.IsParaEndRun && element.IsParaEndRun())) {
            if (!element.GetReviewType || element.GetReviewType && element.GetReviewType() === reviewtype_Common) {
                comparison.setReviewInfoRecursive(element, reviewtype_Add);
            }
        }
    };

    function checkArrayForReviewType(arr) {
        for (let i = 0; i < 0; i += 1) {
            if (arr[i].GetReviewType && (arr[i].GetReviewType() !== reviewtype_Common)) {
                return true;
            }
        }
        return false;
    }


    CMergeComparisonNode.prototype.applyInsert = function (arrToInsert, arrToRemove, nInsertPosition, comparison, opts) {
        const oThis = this;
        opts = opts || {};
        if (arrToInsert.length === 0) {
            for (let i = 0; i < arrToRemove.length; i += 1) {
                this.setRemoveReviewType(arrToRemove[i], comparison);
            }
        } else if (arrToRemove.length === 0) {
            this.insertContentAfterRemoveChanges(arrToInsert, nInsertPosition, comparison);
        }/* else if (!(checkArrayForReviewType(arrToInsert) || checkArrayForReviewType(arrToRemove))) { // TODO: подумать, действительно ли это быстрее
            CNode.prototype.applyInsert.call(this, arrToInsert, arrToRemove, nInsertPosition, comparison, opts);
        } */else {
            arrToInsert.forEach(function (el) {
                if (el.GetReviewType && el.GetReviewType() === reviewtype_Common) {
                    oThis.setRemoveReviewType(el, comparison);
                }
            });
            arrToRemove.forEach(function (el) {
                if (el.GetReviewType && el.GetReviewType() === reviewtype_Common) {
                    oThis.setRemoveReviewType(el, comparison);
                }
            });
            arrToInsert = arrToInsert.reverse();
            if (opts.needReverse) {
                arrToRemove = arrToRemove.reverse();
            }
            nInsertPosition = arrToRemove[0].GetPosInParent();
            comparison.resolveConflicts(arrToInsert, arrToRemove, arrToRemove[0].Paragraph, nInsertPosition);
        }
    }

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertStart = function (aContentToInsert, element, comparison, countOfSpaces) {
        if (isAnchorParaDrawingRun(element)) return false;
        this.checkNodeWithInsert(element, comparison);
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            if (countOfSpaces) {
                for (let i = 0; i < countOfSpaces; i += 1) {
                    element.Add_ToContent(element.Content.length, new AscWord.CRunSpace());
                }
            }
            this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);
            return false;
        } else if (element instanceof ParaRun) {
            const isOnlySpaces = isOnlySpaceParaRun(element);
            if (isOnlySpaces) {
                this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);

            }
            return !isOnlySpaces;
        }
        return true;
    };

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertEnd = function (aContentToInsert, element, comparison) {
        if (isAnchorParaDrawingRun(element)) return;
        this.checkNodeWithInsert(element, comparison);
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);
        } else {
            aContentToInsert.length = 0;
        }
    };

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanRemoveStart = function (aContentToRemove, element, countOfSpaces) {
        if (isAnchorParaDrawingRun(element)) return false;
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            aContentToRemove.push(element);
            return false;
        } else if (element instanceof ParaRun) {
            const isOnlySpaces = isOnlySpaceParaRun(element);
            if (isOnlySpaces) {
                aContentToRemove.push(element);
            }
            return !isOnlySpaces;
        }
        return true;
    };

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanRemoveEnd = function (aContentToRemove, element) {
        if (isAnchorParaDrawingRun(element)) return;
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            aContentToRemove.push(element);
        } else {
            aContentToRemove.length = 0;
        }
    };

    CMergeComparisonNode.prototype.checkNodeWithInsert = function (element, comparison) {
        if (element) {
            delete comparison.mergeRunsMap[element.Id];
        }

    };

    function CMergeComparisonTextElement() {
        CTextElement.call(this);
        this.isReviewWord = false;
    }

    CMergeComparisonTextElement.prototype = Object.create(CTextElement.prototype);
    CMergeComparisonTextElement.prototype.constructor = CMergeComparisonTextElement;

    CMergeComparisonTextElement.prototype.haveCommonReviewType = function () {
        let bHaveCommonReviewType = false;
        this.forEachRun(function (oRun) {
            if (!bHaveCommonReviewType) {
                bHaveCommonReviewType = oRun.GetReviewType() === reviewtype_Common;
            }
        });
        return bHaveCommonReviewType;
    };

    CMergeComparisonTextElement.prototype.haveCustomReviewType = function () {
        let bHaveCustomReviewType = false;
        this.forEachRun(function (oRun) {
            if (!bHaveCustomReviewType) {
                bHaveCustomReviewType = oRun.GetReviewType() !== reviewtype_Common;
            }
        });
        return bHaveCustomReviewType;
    };

    CMergeComparisonTextElement.prototype.setPriorityReviewType = function (comparison, isOriginalDocument, saveMergesFunction) {
        const infoAfterSetReviewType = {
            appendRunIndex: 0,
            appendElementIndex: 0
        };
        if (!(this.haveCustomReviewType())) return infoAfterSetReviewType;
        const oParagraph = this.firstRun.Paragraph;
        if (this.firstRun.GetReviewType() === reviewtype_Common) {
            const posOfStart = this.getPosOfStart();
            if (posOfStart !== 0) {
                const oNewRun = this.firstRun.Split2(posOfStart, oParagraph, this.firstRun.GetPosInParent());
                if (this.firstRun === this.lastRun) {
                    this.lastRun = oNewRun;
                }
                this.firstRun = oNewRun;
                infoAfterSetReviewType.appendRunIndex += 1;
                infoAfterSetReviewType.appendElementIndex = posOfStart;
            }
        }

        if (this.lastRun.GetReviewType() === reviewtype_Common) {
            const posOfEnd = this.getPosOfEnd();
            if (posOfEnd !== this.lastRun.Content.length - 1) {
                this.lastRun.Split2(posOfEnd + 1, oParagraph, this.lastRun.GetPosInParent());
                infoAfterSetReviewType.appendRunIndex += 1;
                infoAfterSetReviewType.appendElementIndex = 0;
            }
        }
        const oRuns = [];
        this.forEachRun(function (oRun) {
                if (!isOriginalDocument) {
                    saveMergesFunction(oRun);
                }
                oRuns.push(oRun);
                //comparison.setReviewInfoRecursive(oRun, /*priorityReviewType*/reviewtype_Add);
        });
        comparison.setReviewInfoForArray(oRuns, reviewtype_Add);
        return infoAfterSetReviewType;
    }

    CMergeComparisonTextElement.prototype.setFirstRun = function (oRun, bSkipSetReview) {
        this.firstRun = oRun;
        this.setReviewWordFlagFromRun(oRun, bSkipSetReview);
    };
    CMergeComparisonTextElement.prototype.setLastRun = function (oRun, bSkipSetReview) {
        this.lastRun = oRun;
        this.setReviewWordFlagFromRun(oRun, bSkipSetReview);
    };

    CMergeComparisonTextElement.prototype.setReviewWordFlagFromRun = function (oRun, bSkipSetReview) {
        if (!bSkipSetReview) {
            const reviewType = oRun.GetReviewType();
            if (reviewType === reviewtype_Add || reviewType === reviewtype_Remove) {
                this.isReviewWord = true;
            }
        }
    }

    function CResolveConflictTextElement() {
        CTextElement.call(this);
    }

    CResolveConflictTextElement.prototype = Object.create(CTextElement.prototype);
    CResolveConflictTextElement.prototype.constructor = CResolveConflictTextElement;

    CResolveConflictTextElement.prototype.getPriorityReviewType = function () {
        const arrPriorityReviewTypes = [];
        this.forEachRun(function (oRun) {
            arrPriorityReviewTypes.push(oRun.GetReviewType());
        });
        return getPriorityReviewType(arrPriorityReviewTypes);
    }

    function CDocumentResolveConflictComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.parentParagraph = null;
        this.startPosition = 0;
        this.copyPr = {
            CopyReviewPr: false,
            Comparison: this,
            bSaveReviewType: true,
        };
        this.bSaveCustomReviewType = true;
    }

    CDocumentResolveConflictComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentResolveConflictComparison.prototype.constructor = CDocumentResolveConflictComparison;

    CDocumentResolveConflictComparison.prototype.getNodeConstructor = function () {
        return CConflictResolveNode;
    }

    CDocumentResolveConflictComparison.prototype.getTextElementConstructor = function () {
        return CResolveConflictTextElement;
    }

    CDocumentResolveConflictComparison.prototype.applyChangesToParagraph = function (oNode) {
        oNode.changes.sort(function (c1, c2) {
            return c2.anchor.index - c1.anchor.index
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
                resolveTypesFromNodeWithPartner(oChildNode, this, true);
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

    function CConflictResolveNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
    }

    CConflictResolveNode.prototype = Object.create(CNode.prototype);
    CConflictResolveNode.prototype.constructor = CConflictResolveNode;

    CConflictResolveNode.prototype.getApplyParagraph = function (comparison) {
        return comparison.parentParagraph;
    }

    CConflictResolveNode.prototype.setRemoveReviewType = CMergeComparisonNode.prototype.setRemoveReviewType;

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

    function resolveTypesFromNodeWithPartner(originalNode, comparison, bOrig) {
        const mergeInfo = [];
        originalNode.forEach(function (oNode) {
            const partner = oNode.partner;
            const originalElement = oNode.element;
            if (originalElement instanceof CTextElement && partner) {
                const revisedElement = partner.element;
                const originalType = originalElement.getPriorityReviewType();
                const revisedType = revisedElement.getPriorityReviewType();
                const priorityReviewType = getPriorityReviewType([originalType, revisedType]);
                const mainElement = bOrig ? originalElement : revisedElement;
                const startPos = mainElement.getPosOfStart();
                const endPos = mainElement.getPosOfEnd();
                mergeInfo.push({
                    startRun: mainElement.firstRun,
                    startPos: startPos,
                    endRun: mainElement.lastRun,
                    endPos: endPos + 1,
                    reviewType: priorityReviewType
                });
            }
        });

        if (mergeInfo.length) {
            const mapSetReview = {};
            mapSetReview[reviewtype_Common] = [];
            mapSetReview[reviewtype_Add] = [];
            mapSetReview[reviewtype_Remove] = [];

            for (let i = mergeInfo.length - 1; i >= 0; i -= 1) {
                const runSplitInfo = mergeInfo[i];
                const startPos = runSplitInfo.startPos;
                const endPos = runSplitInfo.endPos;

                let startRun = runSplitInfo.startRun;
                let endRun = runSplitInfo.endRun;
                let oParagraph = startRun.Paragraph;
                let startRunPosInParent = startRun.GetPosInParent();
                let endRunPosInParent = endRun.GetPosInParent();
                if (endPos !== -1) {
                    endRun = endRun.Split2(endPos, oParagraph, endRunPosInParent);
                }
                if (startPos !== -1) {
                    startRun = startRun.Split2(startPos, oParagraph, startRunPosInParent);
                }
                startRunPosInParent += 1;
                while (startRun && endRun && startRun !== endRun) {
                    mapSetReview[runSplitInfo.reviewType].push(startRun);
                    startRunPosInParent += 1;
                    startRun = oParagraph.Content[startRunPosInParent];
                }
            }
            const bSaveCustomReviewType = comparison.bSaveCustomReviewType;
            comparison.bSaveCustomReviewType = false;
            comparison.setReviewInfoForArray(mapSetReview[reviewtype_Common], reviewtype_Common);
            comparison.setReviewInfoForArray(mapSetReview[reviewtype_Add], reviewtype_Add);
            comparison.setReviewInfoForArray(mapSetReview[reviewtype_Remove], reviewtype_Remove);
            comparison.bSaveCustomReviewType = bSaveCustomReviewType;
        }
    }

    function CDocumentMergeComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.mergeRunsMap = {};
        this.bSaveCustomReviewType = true;
        this.drawingReviewType = {};
        this.copyPr = {
            CopyReviewPr: false,
            Comparison: this,
            bSaveReviewType: true,
        };
    }

    CDocumentMergeComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentMergeComparison.prototype.constructor = CDocumentMergeComparison;



    CDocumentMergeComparison.prototype.applyChangesToParagraph = function (oNode) {
        oNode.changes.sort(function (c1, c2) {
            return c2.anchor.index - c1.anchor.index
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
                this.mergeChangeWithPartner(oChildNode);

            }

            if (currentChangeId < oNode.changes.length && oNode.changes[currentChangeId].anchor.index > i) {
                currentChangeId += 1;
            }
            /*const partner = oChildNode.partner;
            const run = partner && (partner.element.lastRun || partner.element);
            const runId = run && run.Id;
            if (lastRunId.length === 0) {
                if (runId) {
                    lastRunId = runId;
                }
            } else {
                if (runId && runId !== lastRunId) {
                    this.mergeChange(lastRunId);
                    lastRunId = runId;
                }
            }*/



        }

        this.mergeChangeWithPartner(oNode);
        this.applyChangesToChildrenOfParagraphNode(oNode);
        this.applyChangesToSectPr(oNode);
    }

    CDocumentMergeComparison.prototype.mergeChangeWithPartner = function (oNode) {
        const partner = oNode.partner;
        const run = partner && (partner.element.lastRun || partner.element);
        if (run) {
            this.mergeChange(run.Id);
        }
    }
    CDocumentMergeComparison.prototype.mergeChange = function (insertId) {
            const insert = this.mergeRunsMap[insertId];
            if (insert) {
                const contentForInsert = insert.contentForInsert;
                const partner = insert.lastNode.partner;
                if (partner) {
                    let oRun;
                    if (insert.isParent) {
                        oRun = partner.element.Content[0];
                    } else {
                        oRun = partner.element.lastRun;
                    }
                    let nInsertPosition;
                    if (insert.isParent) {
                        nInsertPosition = 0;
                    } else {
                        nInsertPosition = partner.element.getPosOfEnd() + 1;

                    }
                    if (oRun) {
                        const oParagraph = oRun.Paragraph;
                        const posInParent = oRun.GetPosInParent();

                        const arrOfReview = collectReviewRunsAfter(oRun, posInParent, contentForInsert);
                        //const isDuplicate = this.comparison.isDuplicateArrOfRuns(arrOfReview, contentForInsert);
                        // if (!isDuplicate) {
                        // const resolveInsertIndex = insert.isParent ? arrOfReview[0].GetPosInParent() : arrOfReview[0].GetPosInParent() + 1;
                        if (arrOfReview.length) {
                            this.resolveConflicts(contentForInsert, arrOfReview, oParagraph, arrOfReview[0].GetPosInParent());
                        } else {
                            const oNewRun = oRun.Split2(nInsertPosition, oParagraph, posInParent);
                            while (contentForInsert.length) {
                                const oRunForInsert = contentForInsert.pop();
                                oParagraph.Add_ToContent(posInParent + 1, oRunForInsert.Copy(false, {CopyReviewPr: true}));
                            }
                        }
                        // }
                    }
                }
                delete this.mergeRunsMap[insertId];
            }
    }

    CDocumentMergeComparison.prototype.resolveConflicts = function (arrToInserts, arrToRemove, applyParagraph, nInsertPosition) {
        if (arrToInserts.length === 0 || arrToRemove.length === 0) return;
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

    CDocumentMergeComparison.prototype.applyLastComparison = function (oOrigRoot, oRevisedRoot) {
        const bOrig = oOrigRoot.children.length >= oRevisedRoot.children.length;
        const mainRoot = bOrig ? oOrigRoot : oRevisedRoot;
        for (let i = 0; i < mainRoot.children.length; i += 1) {
            const child = mainRoot.children[i];
            const partner = child.partner;
            let origChild;
            let revisedChild;
            if (bOrig) {
                origChild = child;
                revisedChild = partner;
            } else {
                revisedChild = child;
                origChild = partner;
            }
            if (origChild && revisedChild) {
                const childReviewType = origChild.element.GetReviewType && origChild.element.GetReviewType();
                const partnerReviewType = revisedChild.element.GetReviewType && revisedChild.element.GetReviewType();
                const priorityReviewType = getPriorityReviewType([childReviewType, partnerReviewType]);
                if (childReviewType !== priorityReviewType) {
                    this.setReviewInfoForArray([origChild], priorityReviewType);
                }
            }
        }
        CDocumentComparison.prototype.applyLastComparison.call(this, oOrigRoot, oRevisedRoot);
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

    CDocumentMergeComparison.prototype.saveMergeChanges = function (lastNode, parentNode, run) {
        const bHaveDrawings = isAnchorParaDrawingRun(run);
        const bHaveParaEnd = run.Content.some(function (element) {
            return element.Type === para_End;
        });
        if (bHaveDrawings || bHaveParaEnd) {
            return;
        }
        let arrContentForInsert;
        if (lastNode) {
            if (!this.mergeRunsMap[lastNode.element.lastRun.Id]) {
                this.mergeRunsMap[lastNode.element.lastRun.Id] = {
                    isParent: !lastNode,
                    lastNode: lastNode,
                    contentForInsert: []
                };
            }
            arrContentForInsert = this.mergeRunsMap[lastNode.element.lastRun.Id].contentForInsert;
        } else {
            if (!this.mergeRunsMap[parentNode.element.Id]) {
                this.mergeRunsMap[parentNode.element.Id] = {
                    isParent: !lastNode,
                    lastNode: parentNode,
                    contentForInsert: []
                };
            }
            arrContentForInsert = this.mergeRunsMap[parentNode.element.Id].contentForInsert;
        } if (arrContentForInsert[arrContentForInsert.length - 1] !== run) {
            arrContentForInsert.push(run);

        }
    }

    CDocumentMergeComparison.prototype.createNodeFromRunContentElement = function (oElement, oParentNode, oHashWords, isOriginalDocument) {
        const NodeConstructor = this.getNodeConstructor();
        const oThis = this;
        const TextElementConstructor = this.getTextElementConstructor();
        const oRet = new NodeConstructor(oElement, oParentNode);
        const aLastWord = [];

        let oLastText = null;
        let lastNode = null;
        let i = 0;
        let j = 0;
        function offset(oLastText, lastNode, paragraphNode) {
            const infoAfterSetPriorityType = oLastText.setPriorityReviewType(oThis, isOriginalDocument, oThis.saveMergeChanges.bind(oThis, lastNode, paragraphNode));
            if (oLastText.lastRun === oRun) {
                if (infoAfterSetPriorityType.appendRunIndex !== 0) {
                    i += infoAfterSetPriorityType.appendRunIndex;
                    oRun = oElement.Content[i];
                }
                if (infoAfterSetPriorityType.appendElementIndex !== 0) {
                    j = (j - infoAfterSetPriorityType.appendElementIndex);
                } else if (infoAfterSetPriorityType.appendRunIndex !== 0) {
                    j = 0;
                }
            }
        }

        let oRun;
        while (i < oElement.Content.length) {
            oRun = oElement.Content[i];

            if (oRun instanceof ParaRun) {
                if (oRun.Content.length > 0) {
                    if (!oLastText) {
                        oLastText = new TextElementConstructor();
                        oLastText.setFirstRun(oRun);
                    }
                    if (oLastText.elements.length === 0) {
                        oLastText.setFirstRun(oRun);
                        oLastText.setLastRun(oRun);
                    }
                    j = 0;
                    while (j < oRun.Content.length) {
                        const oRunElement = oRun.Content[j];
                        if (AscCommonWord.isBreakWordElement(oRunElement)) {
                            if (oLastText.elements.length > 0) {
                                if (!oLastText.isReviewWord) {
                                    lastNode = new NodeConstructor(oLastText, oRet);
                                }
                                oLastText.updateHash(oHashWords);
                                offset(oLastText, lastNode, oParentNode.children[oParentNode.children.length - 1]);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                            }

                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRunElement);
                            if (!oLastText.isReviewWord) {
                                lastNode = new NodeConstructor(oLastText, oRet);
                            }
                            oLastText.updateHash(oHashWords);
                            offset(oLastText, lastNode, oParentNode.children[oParentNode.children.length - 1]);
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun, true);
                            oLastText.setLastRun(oRun, true);
                        } else if (oRunElement.Type === para_Drawing) {
                            if (oLastText.elements.length > 0) {
                                oLastText.updateHash(oHashWords);
                                if (!oLastText.isReviewWord) {
                                    lastNode = new NodeConstructor(oLastText, oRet);
                                }
                                offset(oLastText, lastNode, oParentNode.children[oParentNode.children.length - 1]);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.elements.push(oRun.Content[j]);
                            if (oRun.Content[j].Is_Inline()) {
                                if (!oLastText.isReviewWord) {
                                    lastNode = new NodeConstructor(oLastText, oRet);
                                }
                                offset(oLastText, lastNode, oParentNode.children[oParentNode.children.length - 1]);
                            } else {
                                new NodeConstructor(oLastText, oRet);
                            }
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun, true);
                            oLastText.setLastRun(oRun, true);
                        } else if (oRunElement.Type === para_End) {
                            if (oLastText.elements.length > 0) {
                                oLastText.updateHash(oHashWords);
                                new NodeConstructor(oLastText, oRet);
                                offset(oLastText, lastNode, oParentNode.children[oParentNode.children.length - 1]);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun, true);
                                oLastText.setLastRun(oRun, true);
                            }
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRun.Content[j]);
                            new NodeConstructor(oLastText, oRet);
                            oLastText.updateHash(oHashWords);
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun, true);
                            oLastText.setLastRun(oRun, true);
                        } else {
                            if (oLastText.elements.length === 0) {
                                oLastText.setFirstRun(oRun);
                            }
                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRun.Content[j]);
                        }
                        j += 1;
                    }
                }
            } else {
                if (!(oRun instanceof CParagraphBookmark)) {
                    if (oLastText && oLastText.elements.length > 0) {
                        oLastText.updateHash(oHashWords);
                        if (!oLastText.isReviewWord) {
                            lastNode = new NodeConstructor(oLastText, oRet);
                        }
                        const infoAfterSetPriorityType = oLastText.setPriorityReviewType(this, isOriginalDocument, this.saveMergeChanges.bind(this, lastNode, oParentNode.children[oParentNode.children.length - 1]));
                    }
                    if (aLastWord.length > 0) {
                        oHashWords.update(aLastWord);
                        aLastWord.length = 0;
                    }
                    oLastText = null;
                    if (Array.isArray(oRun.Content)) {
                        lastNode = this.createNodeFromRunContentElement(oRun, oRet, oHashWords, isOriginalDocument);
                    } else {
                        lastNode = new NodeConstructor(oRun, oRet);
                    }
                }
            }
            i += 1;
        }
        if (oLastText && oLastText.elements.length > 0) {
            oLastText.updateHash(oHashWords);
            if (!oLastText.isReviewWord) {
                lastNode = new NodeConstructor(oLastText, oRet);
            }
       }
        return oRet;
    };

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
        console.timeEnd('compare');
    }

    CDocumentMerge.prototype.merge4 = function () {
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
        //this.comparison.setTypesForReview()
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
            console.time('compare');
            const oMerge = new AscCommonWord.CDocumentMerge(oDoc1, oDoc2, oOptions ? oOptions : new ComparisonOptions());
            oMerge.merge4(); //TODO: change
        } else {
            AscCommon.pptx_content_loader.End_UseFullUrl();
        }

    }

    window['AscCommonWord'].CDocumentMerge = CDocumentMerge;
    window['AscCommonWord'].mergeBinary = mergeBinary;
    window['AscCommonWord'].CMockMinHash = CMockMinHash;
    window['AscCommonWord'].CMockDocument = CMockDocument;
    window['AscCommonWord'].CMockParagraph = CMockParagraph;

})()
