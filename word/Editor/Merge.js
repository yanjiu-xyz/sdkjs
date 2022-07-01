(function (undefined) {
    var CDocumentComparison = AscCommonWord.CDocumentComparison;
    var CNode               = AscCommonWord.CNode;
    var g_oTableId          = AscCommon.g_oTableId;
    var CTextElement = window['AscCommonWord'].CTextElement;

    var CONFLICT_TYPES = {
        originalDocument: 0x01,
        revisedDocument: 0x02,
    };

    var EXCLUDED_PUNCTUATION = {};
    EXCLUDED_PUNCTUATION[46] = true; // TODO: organize import
    EXCLUDED_PUNCTUATION[160] = true;



    function isDuplicateArr(arrOfRuns1, arrOfRuns2) {
        const elementOfRun1 = [];
        const elementOfRun2 = [];

        for (let i = 0; i < arrOfRuns1.length; i += 1) {
            for (let j = 0; j < arrOfRuns1[i].Content.length; j += 1) {
                const elem = arrOfRuns1[i].Content[j];
                elementOfRun1.push(elem);
            }
        }
        for (let i = 0; i < arrOfRuns2.length; i += 1) {
            for (let j = 0; j < arrOfRuns2[i].Content.length; j += 1) {
                const elem = arrOfRuns2[i].Content[j];
                elementOfRun2.push(elem);
            }
        }

        let arr1Index = 0;
        let arr2Index = 0;

        function skipSpaces() {
            let element = elementOfRun1[arr1Index];
            while (arr1Index < elementOfRun1.length && element && element.Type === para_Space) {
                arr1Index += 1;
                element = elementOfRun1[arr1Index];
            }
            element = elementOfRun2[arr1Index];
            while (arr2Index < elementOfRun2.length && element && element.Type === para_Space) {
                arr2Index += 1;
                element = elementOfRun2[arr2Index];
            }
        }

        while (arr1Index < elementOfRun1.length && arr2Index < elementOfRun2.length) {
            const elem1 = elementOfRun1[arr1Index];
            const elem2 = elementOfRun2[arr2Index];
            if (!(elem1.Type === para_Drawing && elem2.Type === para_Drawing)) {
                if (elem1.Value === elem2.Value) {
                    arr1Index += 1;
                    arr2Index += 1;

                } else if (elem1.Type === para_Space && elem2.Type === para_Space || (arr1Index === 0 && elem1.Type === para_Space || arr2Index === 0 && elem2.Type === para_Space)) {
                    skipSpaces();
                } else {
                    return false;
                }
            } else {
                if (!elem1.IsComparable(elem2)) {
                    return false;
                } else {
                    arr1Index += 1;
                    arr2Index += 1;
                }
            }


        }
        skipSpaces();
        if (arr1Index < elementOfRun1.length || arr2Index < elementOfRun2.length) {
            return false;
        }
        return true;
    }


    function isOnlySpaceParaRun(element) {
        if (element instanceof ParaRun) {
            return element.Content.every(function (textElem) {
                return textElem.Type === para_Space;
            });
        }
        return false;
    }


    function getPriorityReviewType(arrOfTypes) {
        var bRemove = arrOfTypes.some(function (reviewType) {
            return reviewType === reviewtype_Remove;
        });
        if (bRemove) return reviewtype_Remove;

        var bAdd = arrOfTypes.some(function (reviewType) {
            return reviewType === reviewtype_Add;
        });
        if (bAdd) return reviewtype_Add;
        return reviewtype_Common;
    }

    function collectReviewRunsBefore(oRun, posInParent) {
        const arrRet = [];
        var oParagraph = oRun.Paragraph;
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

    function collectReviewRunsAround(oRun, posInParent) {
        const arrRet = [];
        var oParagraph = oRun.Paragraph;
        posInParent = AscFormat.isRealNumber(posInParent) ? posInParent : oRun.GetPosInParent();
        // let posNextRun = posInParent - 1;
        // while (posNextRun >= 0) {
        //     const checkElem = oParagraph.Content[posNextRun];
        //     if (checkElem instanceof ParaRun) {
        //         if ((checkElem.GetReviewType && checkElem.GetReviewType() !== reviewtype_Common) || isOnlySpaceParaRun(checkElem)) {
        //             arrRet.unshift(checkElem);
        //         } else {
        //             break;
        //         }
        //     } else {
        //         break;
        //     }
        //     posNextRun -= 1;
        // }
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

    function CMergeComparisonNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
    }
    CMergeComparisonNode.prototype = Object.create(CNode.prototype);
    CMergeComparisonNode.prototype.constructor = CMergeComparisonNode;

    CMergeComparisonNode.prototype.applyInsertsToParagraphsWithoutRemove = function (comparison, aContentToInsert, idxOfChange) {
        var oChildNode, oFirstText, oCurRun, j, k, t;
        var oElement = this.element;
        var oChange = this.changes[idxOfChange];
        if(aContentToInsert.length > 0)
        {
            var index = oChange.anchor.index;
            oChildNode = this.children[index];
            if(oChildNode)
            {
                oFirstText = oChildNode.element;
                for(j = 0; j < oElement.Content.length; ++j)
                {
                    if(Array.isArray(oElement.Content))
                    {
                        oCurRun = oElement.Content[j];
                        // если совпали ран, после которого нужно вставлять и ран из цикла
                        if(oFirstText === oCurRun)
                        {
                            for (t = 0; t < aContentToInsert.length; t += 1)
                            {
                                if(comparison.isElementForAdd(aContentToInsert[t]))
                                {
                                    oElement.AddToContent(j + 1, aContentToInsert[t]);
                                }
                            }
                            break;
                        }
                        // иначе надо посмотреть, возможно стоит вставлять элементы не после рана, а после конкретного элемента и текущий ран из цикла нужно засплитить
                        else if(Array.isArray(oCurRun.Content) && Array.isArray(oFirstText.elements))
                        {
                            for(k = 0; k < oCurRun.Content.length; ++k)
                            {
                                // если элементы совпали, значит, мы нашли место вставки
                                if(oFirstText.elements[0] === oCurRun.Content[k])
                                {
                                    break;
                                }
                            }
                            var bFind = false;
                            // проверим, не дошли ли мы просто до конца массива, ничего не встретив
                            if(k === oCurRun.Content.length)
                            {
                                if(oFirstText.firstRun === oCurRun)
                                {
                                    k = 0;
                                    bFind = true;
                                }
                            }
                            else
                            {
                                bFind = true;
                            }
                            if(k <= oCurRun.Content.length && bFind)
                            {
                                var arrOfReview = collectReviewRunsBefore(oCurRun, oCurRun.GetPosInParent());
                                var isDuplicate = isDuplicateArr(arrOfReview, aContentToInsert);
                                if (!isDuplicate) {
                                    oCurRun.Split2(k, oElement, j);
                                    for (t = 0; t < aContentToInsert.length; t += 1) {
                                        if(comparison.isElementForAdd(aContentToInsert[t]))
                                        {
                                            oElement.AddToContent(j + 1, aContentToInsert[t]);
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    };

    CMergeComparisonNode.prototype.setRemoveReviewType = function (element, comparison) {
        if(!(element.IsParaEndRun && element.IsParaEndRun()))
        {
            if (!element.GetReviewType || element.GetReviewType && element.GetReviewType() === reviewtype_Common) {
                comparison.setReviewInfoRecursive(element, reviewtype_Add);
            }
        }
    };
    CMergeComparisonNode.prototype.needToInsert = function (arrSetRemoveReviewType, aContentToInsert) {return !isDuplicateArr(arrSetRemoveReviewType, aContentToInsert);};

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertStart = function (aContentToInsert, element, comparison, countOfSpaces) {
        if (isParaDrawingRun(element)) return false;
        this.checkNodeWithInsert(element, comparison)
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            if (countOfSpaces) {
                for (let i = 0; i < countOfSpaces; i += 1) {
                    element.Add_ToContent(element.Content.length, new ParaSpace());
                }
            }
            this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);
            return false;
        } else if (element instanceof ParaRun) {
            var isOnlySpaces = isOnlySpaceParaRun(element);
            if (isOnlySpaces) {
                if (countOfSpaces) {
                    for (let i = 0; i < countOfSpaces; i += 1) {
                        element.Add_ToContent(element.Content.length, new ParaSpace());
                    }
                }
                this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);

            }
            return !isOnlySpaces;
        }
        return true;
    };

    function isParaDrawingRun(run) {
        return run.Content.some(function (el) {
            return el.Type === para_Drawing;
        });
    }
    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertEnd = function (aContentToInsert, element, comparison) {
        if (isParaDrawingRun(element)) return;
        this.checkNodeWithInsert(element, comparison);
        if (element.GetReviewType && element.GetReviewType() !== reviewtype_Common) {
            this.pushToArrInsertContentWithCopy(aContentToInsert, element, comparison);
        } else {
            aContentToInsert.length = 0;
        }
    };

    CMergeComparisonNode.prototype.checkNodeWithInsert = function (element, comparison) {
        console.log(element)
        if (element) {
            console.log('this', element.Id)
            delete comparison.mergeRunsMap[element.Id];
        }

    };

    function CMergeComparisonTextElement() {
        CTextElement.call(this);
        this.isReviewWord = false;
    }

    CMergeComparisonTextElement.prototype = Object.create(CTextElement.prototype);
    CMergeComparisonTextElement.prototype.constructor = CMergeComparisonTextElement;

    CMergeComparisonTextElement.prototype.setFirstRun = function (oRun, bSkipSetReview)
    {
        this.firstRun = oRun;
        this.setReviewWordFlagFromRun(oRun, bSkipSetReview);
    };
    CMergeComparisonTextElement.prototype.setLastRun = function (oRun, bSkipSetReview)
    {
        this.lastRun = oRun;
        this.setReviewWordFlagFromRun(oRun, bSkipSetReview);
    };

    CMergeComparisonTextElement.prototype.setReviewWordFlagFromRun = function (oRun, bSkipSetReview) {
        if (!bSkipSetReview) {
            var reviewType = oRun.GetReviewType();
            if (reviewType === reviewtype_Add || reviewType === reviewtype_Remove) {
                this.isReviewWord = true;
            }
        }
    }

    function CDocumentMergeComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.mergeRunsMap = {};
        this.bSaveCustomReviewType = true;
        this.drawingReviewType = {};
        this.drawingRunMap = {};
        this.copyPr = {
            CopyReviewPr: false,
            Comparison: this,
            bSaveReviewType: true,
        };
    }

    CDocumentMergeComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentMergeComparison.prototype.constructor = CDocumentMergeComparison;

    CDocumentMergeComparison.prototype.getNodeConstructor = function () {
        return CMergeComparisonNode;
    };


    CDocumentMergeComparison.prototype.getTextElementConstructor = function () {
        return CMergeComparisonTextElement;
    };

    CDocumentMergeComparison.prototype.GetReviewTypeFromParaDrawing = function (oParaDrawing) {
        var oRun = oParaDrawing.GetRun();
        if (oRun) {
            return oRun.GetReviewType();
        }
        return reviewtype_Common;
    }

    CDocumentMergeComparison.prototype.compareDrawingObjects = function(oBaseDrawing, oCompareDrawing, bOrig) {
        if (oBaseDrawing && oCompareDrawing) {
            var baseReviewType = this.GetReviewTypeFromParaDrawing(oBaseDrawing);
            var compareReviewType = this.GetReviewTypeFromParaDrawing(oCompareDrawing);
            var arrOfReviewTypes = [];

            if (baseReviewType) arrOfReviewTypes.push(baseReviewType);
            if (compareReviewType) arrOfReviewTypes.push(compareReviewType);

            var priorityReviewType = getPriorityReviewType(arrOfReviewTypes);

            var oBaseRun = bOrig ? oBaseDrawing.GetRun() : oCompareDrawing.GetRun();
            this.setReviewInfoForArray([oBaseRun], priorityReviewType);
        }
        CDocumentComparison.prototype.compareDrawingObjects.call(this, oBaseDrawing, oCompareDrawing);
    }

    CDocumentMergeComparison.prototype.saveMergeChanges = function (lastNode, parentNode, run, isOriginalDocument) {
        var bHaveDrawings = run.Content.some(function (element) {
           return element.Type === para_Drawing;
        });
        if (bHaveDrawings) {
            return;
        }
        let arrContentForInsert;
        if (lastNode) {
            if (!this.mergeRunsMap[lastNode.element.lastRun.Id]) {
                this.mergeRunsMap[lastNode.element.lastRun.Id] = {isParent: !lastNode, lastNode: lastNode, contentForInsert: [], isOriginalDocument: isOriginalDocument};
            }
            arrContentForInsert = this.mergeRunsMap[lastNode.element.lastRun.Id].contentForInsert;
        } else {
            if (!this.mergeRunsMap[parentNode.element.Id]) {
                this.mergeRunsMap[parentNode.element.Id] = {isParent: !lastNode, lastNode: parentNode, contentForInsert: [], isOriginalDocument: isOriginalDocument};
            }
            arrContentForInsert = this.mergeRunsMap[parentNode.element.Id].contentForInsert;
        }
            arrContentForInsert.push(run);

    }

    // CDocumentMergeComparison.prototype.createNodeFromRunContentElement = function(oElement, oParentNode, oHashWords, isOriginalDocument)
    // {
    //     var NodeConstructor = this.getNodeConstructor();
    //     var oRet = new NodeConstructor(oElement, oParentNode);
    //     var oLastText = null, oRun,oNextRun, oRunElement, i, j;
    //     var aLastWord = [];
    //     var bSkip = false;
    //     var lastNode = null;
    //     for(i = 0; i < oElement.Content.length; ++i)
    //     {
    //
    //         oRun = oElement.Content[i];
    //         oNextRun = oElement.Content[i + 1];
    //         if(oRun instanceof ParaRun)
    //         {
    //             var bReview = oRun.GetReviewType() === reviewtype_Add || oRun.GetReviewType() === reviewtype_Remove;
    //
    //             if (bSkip) {
    //                 if (!bReview) {
    //                     oLastText = new CTextElement();
    //                     oLastText.setFirstRun(oRun);
    //                     oLastText.setLastRun(oRun);
    //                     bSkip = false;
    //                 } else {
    //                     if (!isOriginalDocument) {
    //                         this.saveMergeChanges(lastNode, oParentNode.children[oParentNode.children.length - 1], oRun, isOriginalDocument);
    //                     }
    //                     continue;
    //                 }
    //             }
    //
    //             if(oRun.Content.length > 0)
    //             {
    //                 if(!oLastText)
    //                 {
    //                     oLastText = new CTextElement();
    //                     oLastText.setFirstRun(oRun);
    //                 }
    //                 if(oLastText.elements.length === 0)
    //                 {
    //                     oLastText.setFirstRun(oRun);
    //                     oLastText.setLastRun(oRun);
    //                 }
    //                 for(j = 0; j < oRun.Content.length; ++j)
    //                 {
    //                     oRunElement = oRun.Content[j];
    //                     var bPunctuation = para_Text === oRunElement.Type && (AscCommon.g_aPunctuation[oRunElement.Value] && !EXCLUDED_PUNCTUATION[oRunElement.Value]);
    //                     if(oRunElement.Type === para_Space || oRunElement.Type === para_Tab
    //                         || oRunElement.Type === para_Separator || oRunElement.Type === para_NewLine
    //                         || oRunElement.Type === para_FootnoteReference
    //                         || oRunElement.Type === para_EndnoteReference
    //                         || bPunctuation || bReview)
    //                     {
    //                         if(oLastText.elements.length > 0)
    //                         {
    //                             lastNode = new NodeConstructor(oLastText, oRet);
    //                             oLastText.updateHash(oHashWords);
    //                             oLastText = new CTextElement();
    //                             oLastText.setFirstRun(oRun);
    //                         }
    //                         if (!bReview) {
    //                             oLastText.setLastRun(oRun);
    //                             oLastText.elements.push(oRunElement);
    //                             lastNode = new NodeConstructor(oLastText, oRet);
    //                             oLastText.updateHash(oHashWords);
    //
    //                             oLastText = new CTextElement();
    //                             oLastText.setFirstRun(oRun);
    //                             oLastText.setLastRun(oRun);
    //                         } else {
    //                             if (!isOriginalDocument) {
    //                                 this.saveMergeChanges(lastNode, oParentNode.children[oParentNode.children.length - 1], oRun, isOriginalDocument);
    //                             }
    //                             bSkip = true;
    //                             break;
    //                         }
    //                     }
    //                     else if(oRunElement.Type === para_Drawing)
    //                     {
    //                         if(oLastText.elements.length > 0)
    //                         {
    //                             oLastText.updateHash(oHashWords);
    //                             new NodeConstructor(oLastText, oRet);
    //                             oLastText = new CTextElement();
    //                             oLastText.setFirstRun(oRun);
    //                             oLastText.setLastRun(oRun);
    //                         }
    //                         oLastText.elements.push(oRun.Content[j]);
    //                         new NodeConstructor(oLastText, oRet);
    //                         oLastText = new CTextElement();
    //                         oLastText.setFirstRun(oRun);
    //                         oLastText.setLastRun(oRun);
    //                     }
    //                     else if(oRunElement.Type === para_End)
    //                     {
    //                         if(oLastText.elements.length > 0)
    //                         {
    //                             oLastText.updateHash(oHashWords);
    //                             new NodeConstructor(oLastText, oRet);
    //                             oLastText = new CTextElement();
    //                             oLastText.setFirstRun(oRun);
    //                             oLastText.setLastRun(oRun);
    //                         }
    //                         oLastText.setFirstRun(oRun);
    //                         oLastText.setLastRun(oRun);
    //                         oLastText.elements.push(oRun.Content[j]);
    //                         new NodeConstructor(oLastText, oRet);
    //                         oLastText.updateHash(oHashWords);
    //                         oLastText = new CTextElement();
    //                         oLastText.setFirstRun(oRun);
    //                         oLastText.setLastRun(oRun);
    //                     }
    //                     else
    //                     {
    //                         if(oLastText.elements.length === 0)
    //                         {
    //                             oLastText.setFirstRun(oRun);
    //                         }
    //                         oLastText.setLastRun(oRun);
    //                         oLastText.elements.push(oRun.Content[j]);
    //                     }
    //                 }
    //             }
    //         }
    //         else
    //         {
    //             if(!(oRun instanceof CParagraphBookmark))
    //             {
    //                 if(oLastText && oLastText.elements.length > 0)
    //                 {
    //                     oLastText.updateHash(oHashWords);
    //                     new NodeConstructor(oLastText, oRet);
    //                 }
    //                 if(aLastWord.length > 0)
    //                 {
    //                     oHashWords.update(aLastWord);
    //                     aLastWord.length = 0;
    //                 }
    //                 oLastText = null;
    //                 if(Array.isArray(oRun.Content))
    //                 {
    //                     this.createNodeFromRunContentElement(oRun, oRet, oHashWords, isOriginalDocument);
    //                 }
    //                 else
    //                 {
    //                     new NodeConstructor(oRun, oRet);
    //                 }
    //             }
    //         }
    //     }
    //     if(oLastText && oLastText.elements.length > 0)
    //     {
    //         oLastText.updateHash(oHashWords);
    //         new NodeConstructor(oLastText, oRet);
    //     }
    //     return oRet;
    // };

    CDocumentMergeComparison.prototype.createNodeFromRunContentElement = function(oElement, oParentNode, oHashWords, isOriginalDocument)
    {
        var NodeConstructor = this.getNodeConstructor();
        var TextElementConstructor = this.getTextElementConstructor();
        var oRet = new NodeConstructor(oElement, oParentNode);
        var oLastText = null, oRun, oRunElement, i, j;
        var aLastWord = [];
        var lastNode = null;
        for(i = 0; i < oElement.Content.length; ++i)
        {
            oRun = oElement.Content[i];

            if(oRun instanceof ParaRun)
            {
                var bReviewType = oRun.GetReviewType() === reviewtype_Remove || oRun.GetReviewType() === reviewtype_Add;
                if (bReviewType && !isOriginalDocument) {
                    this.saveMergeChanges(lastNode, oParentNode.children[oParentNode.children.length - 1], oRun, isOriginalDocument);
                }
                if(oRun.Content.length > 0)
                {
                    if(!oLastText)
                    {
                        oLastText = new TextElementConstructor();
                        oLastText.setFirstRun(oRun);
                    }
                    if(oLastText.elements.length === 0)
                    {
                        oLastText.setFirstRun(oRun);
                        oLastText.setLastRun(oRun);
                    }
                    for(j = 0; j < oRun.Content.length; ++j)
                    {
                        oRunElement = oRun.Content[j];
                        var bPunctuation = para_Text === oRunElement.Type && (AscCommon.g_aPunctuation[oRunElement.Value] && !EXCLUDED_PUNCTUATION[oRunElement.Value]);
                        if(oRunElement.Type === para_Space || oRunElement.Type === para_Tab
                            || oRunElement.Type === para_Separator || oRunElement.Type === para_NewLine
                            || oRunElement.Type === para_FootnoteReference
                            || oRunElement.Type === para_EndnoteReference
                            || bPunctuation)
                        {
                            if(oLastText.elements.length > 0)
                            {
                                if (!oLastText.isReviewWord) {
                                    lastNode = new NodeConstructor(oLastText, oRet);
                                }
                                oLastText.updateHash(oHashWords);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                            }

                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRunElement);
                            if (!oLastText.isReviewWord) {
                                lastNode = new NodeConstructor(oLastText, oRet);
                            }
                            oLastText.updateHash(oHashWords);

                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun, true);
                            oLastText.setLastRun(oRun, true);
                        }
                        else if(oRunElement.Type === para_Drawing)
                        {
                            if(oLastText.elements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                if (!oLastText.isReviewWord) {
                                    lastNode = new NodeConstructor(oLastText, oRet);
                                }
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.elements.push(oRun.Content[j]);
                            this.drawingRunMap[oRun.Content[j].Id] = oRun;
                            new NodeConstructor(oLastText, oRet);
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun, true);
                            oLastText.setLastRun(oRun, true);
                        }
                        else if(oRunElement.Type === para_End)
                        {
                            if(oLastText.elements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                new NodeConstructor(oLastText, oRet);
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
                        }
                        else
                        {
                            if(oLastText.elements.length === 0)
                            {
                                oLastText.setFirstRun(oRun);
                            }
                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRun.Content[j]);
                        }
                    }
                }
            }
            else
            {
                if(!(oRun instanceof CParagraphBookmark))
                {
                    if(oLastText && oLastText.elements.length > 0)
                    {
                        oLastText.updateHash(oHashWords);
                        new NodeConstructor(oLastText, oRet);
                    }
                    if(aLastWord.length > 0)
                    {
                        oHashWords.update(aLastWord);
                        aLastWord.length = 0;
                    }
                    oLastText = null;
                    if(Array.isArray(oRun.Content))
                    {
                        this.createNodeFromRunContentElement(oRun, oRet, oHashWords, isOriginalDocument);
                    }
                    else
                    {
                        new NodeConstructor(oRun, oRet);
                    }
                }
            }
        }
        if(oLastText && oLastText.elements.length > 0)
        {
            oLastText.updateHash(oHashWords);
            new NodeConstructor(oLastText, oRet);
        }
        return oRet;
    };

    CDocumentMergeComparison.prototype.compare = function(callback)
    {
        var oOriginalDocument = this.originalDocument;
        var oRevisedDocument = this.revisedDocument;
        if(!oOriginalDocument || !oRevisedDocument)
        {
            return;
        }
        var oThis = this;
        var aImages = AscCommon.pptx_content_loader.End_UseFullUrl();
        var oObjectsForDownload = AscCommon.GetObjectsForImageDownload(aImages);
        var oApi = oOriginalDocument.GetApi(), i;
        if(!oApi)
        {
            return;
        }
        var fCallback = function (data) {
            var oImageMap = {};
            AscFormat.ExecuteNoHistory(function () {
                AscCommon.ResetNewUrls(data, oObjectsForDownload.aUrls, oObjectsForDownload.aBuilderImagesByUrl, oImageMap);
            }, oThis, []);

            var NewNumbering = oRevisedDocument.Numbering.CopyAllNums(oOriginalDocument.Numbering);
            oRevisedDocument.CopyNumberingMap = NewNumbering.NumMap;
            oOriginalDocument.Numbering.AppendAbstractNums(NewNumbering.AbstractNum);
            oOriginalDocument.Numbering.AppendNums(NewNumbering.Num);
            var key;
            for(key in NewNumbering.NumMap)
            {
                if (NewNumbering.NumMap.hasOwnProperty(key))
                {
                    oThis.checkedNums[NewNumbering.NumMap[key]] = true;
                }
            }
            oThis.compareRoots(oOriginalDocument, oRevisedDocument);
            oThis.compareSectPr(oOriginalDocument, oRevisedDocument);

            var oFonts = oOriginalDocument.Document_Get_AllFontNames();
            var aFonts = [];
            for (i in oFonts)
            {
                if(oFonts.hasOwnProperty(i))
                {
                    aFonts[aFonts.length] = new AscFonts.CFont(i, 0, "", 0, null);
                }
            }
            oApi.pre_Paste(aFonts, oImageMap, function()
            {
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

    CDocumentMerge.prototype.getConflictName = function (conflictType) {
        switch (conflictType) {
            case CONFLICT_TYPES.originalDocument:
                return ' Original conflict';
            case CONFLICT_TYPES.revisedDocument:
                return ' Revised conflict';
            default:
                return '';
        }
    };

    CDocumentMerge.prototype.applyLastMergeCallback = function() {
        var oOriginalDocument = this.originalDocument;
        var oComp = this.comparison;
        var oApi = this.api;
        if(!(oApi && oOriginalDocument)) {
            return;
        }
        console.log(oComp.mergeRunsMap)
        for (var insertId in oComp.mergeRunsMap) {
            var insert = oComp.mergeRunsMap[insertId];
            var contentForInsert = insert.contentForInsert;
            var partner = insert.lastNode.partner;
            if (partner) {
                var oRun;
                if (insert.isParent) {
                    oRun = partner.element.Content[0];
                } else {
                    oRun = partner.element.lastRun;
                }
                var nInsertPosition;
                if (insert.isParent) {
                    nInsertPosition = 0;
                } else {
                    nInsertPosition = partner.element.getPosOfEnd() + 1;

                }
                if (oRun) {
                    var oParagraph = oRun.Paragraph;
                    var posInParent = oRun.GetPosInParent();

                    var arrOfReview = collectReviewRunsAround(oRun, posInParent);
                    var isDuplicate = isDuplicateArr(arrOfReview, contentForInsert);

                    if (!isDuplicate) {
                        var oNewRun = oRun.Split2(nInsertPosition, oParagraph, posInParent);
                        while (contentForInsert.length) {
                            var oRunForInsert = contentForInsert.pop();
                            oParagraph.Add_ToContent(posInParent + 1, oRunForInsert.Copy(false, {CopyReviewPr: true}));
                        }
                    }
                }
            }
        }

        oOriginalDocument.SetTrackRevisions(this.oldTrackRevisions);
        oOriginalDocument.End_SilentMode(false);
        oOriginalDocument.Recalculate();
        oOriginalDocument.UpdateInterface();
        oOriginalDocument.FinalizeAction();
        oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
    }

    CDocumentMerge.prototype.merge4 = function () {
        var oOriginalDocument = this.originalDocument;
        var oRevisedDocument = this.revisedDocument;
        if(!oOriginalDocument || !oRevisedDocument) {
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
        var oDoc1 = oApi.WordControl.m_oLogicDocument;
        if(!window['NATIVE_EDITOR_ENJINE'])
        {
            var oCollaborativeEditing = oDoc1.CollaborativeEditing;
            if(oCollaborativeEditing && !oCollaborativeEditing.Is_SingleUser())
            {
                oApi.sendEvent("asc_onError", Asc.c_oAscError.ID.CannotCompareInCoEditing, c_oAscError.Level.NoCritical);
                return;
            }
        }
        oApi.sync_StartAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);

        var oDoc2 = AscFormat.ExecuteNoHistory(function() {
            var oBinaryFileReader, openParams        = {noSendComments: true};
            var oDoc2 = new CDocument(oApi.WordControl.m_oDrawingDocument, true);
            oApi.WordControl.m_oDrawingDocument.m_oLogicDocument = oDoc2;
            oApi.WordControl.m_oLogicDocument = oDoc2;
            oBinaryFileReader = new AscCommonWord.BinaryFileReader(oDoc2, openParams);
            AscCommon.pptx_content_loader.Start_UseFullUrl(oApi.insertDocumentUrlsData);
            if (!oBinaryFileReader.Read(sBinary2))
            {
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
            var oMerge = new AscCommonWord.CDocumentMerge(oDoc1, oDoc2, oOptions ? oOptions : new ComparisonOptions());
            oMerge.merge4(); //TODO: change
        } else {
            AscCommon.pptx_content_loader.End_UseFullUrl();
        }

    }

    window['AscCommonWord'].CDocumentMerge = CDocumentMerge;
    window['AscCommonWord'].mergeBinary = mergeBinary;

})()