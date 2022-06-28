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
    //EXCLUDED_PUNCTUATION[95] = true;
    EXCLUDED_PUNCTUATION[160] = true;


/*    function getText(oRun) {
        return oRun.Content.map(function (el) {
            return String.fromCharCode(el.Value);
        }).join('');
    }*/

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
                                var arrOfReview = collectReviewRunsAround(oCurRun, oCurRun.GetPosInParent());
                                var isDuplicate = isDuplicateArr(arrOfReview, aContentToInsert);
                                if (isDuplicate) {
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

            if (elem1.Value === elem2.Value) {
                arr1Index += 1;
                arr2Index += 1;

            } else if (elem1.Type === para_Space && elem2.Type === para_Space) {
                skipSpaces();
            } else {
                return false;
            }
        }
        skipSpaces();
        if (arr1Index < elementOfRun1.length || arr2Index < elementOfRun2.length) {
            return false;
        }
        return true;
    }
    CMergeComparisonNode.prototype.needToInsert = function (arrSetRemoveReviewType, aContentToInsert) {return !isDuplicateArr(arrSetRemoveReviewType, aContentToInsert);};

    function isOnlySpaceParaRun(element) {
        if (element instanceof ParaRun) {
            return element.Content.every(function (textElem) {
                return textElem.Type === para_Space;
            });
        }
        return false;
    }

    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertStart = function (aContentToInsert, element, comparison, countOfSpaces) {
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
    CMergeComparisonNode.prototype.edgeCaseHandlingOfCleanInsertEnd = function (aContentToInsert, element, comparison) {
        this.checkNodeWithInsert(element, comparison)
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

    CMergeComparisonTextElement.prototype.setFirstRun = function (oRun)
    {
        this.firstRun = oRun;
        this.setReviewWordFlagFromRun(oRun);
    };
    CMergeComparisonTextElement.prototype.setLastRun = function (oRun)
    {
        this.lastRun = oRun;
        this.setReviewWordFlagFromRun(oRun);
    };

    CMergeComparisonTextElement.prototype.setReviewWordFlagFromRun = function (oRun) {
        var reviewType = oRun.GetReviewType();
        if (reviewType === reviewtype_Add || reviewType === reviewtype_Remove) {
            this.isReviewWord = true;
        }
    }

    function CDocumentMergeComparison(oOriginalDocument, oRevisedDocument, oOptions) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.mergeRunsMap = {};
    }

    CDocumentMergeComparison.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentMergeComparison.prototype.constructor = CDocumentMergeComparison;

    CDocumentMergeComparison.prototype.getNodeConstructor = function () {
        return CMergeComparisonNode;
    };


    CDocumentMergeComparison.prototype.getTextElementConstructor = function () {
        return CMergeComparisonTextElement;
    };

    CDocumentMergeComparison.prototype.saveMergeChanges = function (lastNode, parentNode, run, isOriginalDocument) {
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
                        }
                        else if(oRunElement.Type === para_Drawing)
                        {
                            if(oLastText.elements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                new NodeConstructor(oLastText, oRet);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.elements.push(oRun.Content[j]);
                            new NodeConstructor(oLastText, oRet);
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                        }
                        else if(oRunElement.Type === para_End)
                        {
                            if(oLastText.elements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                new NodeConstructor(oLastText, oRet);
                                oLastText = new TextElementConstructor();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                            oLastText.elements.push(oRun.Content[j]);
                            new NodeConstructor(oLastText, oRet);
                            oLastText.updateHash(oHashWords);
                            oLastText = new TextElementConstructor();
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
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

    function CMergeTextElementInfo(oRun, pos) {
        this.run = oRun;
        this.posInRun = pos;
        this.element = oRun.Content[pos];
    }

    function CMergeTextElement() {
        AscCommonWord.CTextElement.call(this);
        this.mergeElements = [];
    }
    CMergeTextElement.prototype = Object.create(AscCommonWord.CTextElement.prototype);
    CMergeTextElement.prototype.constructor = CMergeTextElement;

    CMergeTextElement.prototype.getMergedRun = function (idxElement) {
        return this.mergeElements[idxElement].run;
    };

    CMergeTextElement.prototype.equalsDuplicate = function (oAnotherTextElement) {
        return this.equalsWithoutType(oAnotherTextElement) && this.isWord();
    };
    CMergeTextElement.prototype.isWord = function () {
        return this.mergeElements.every(function (elem) {
            var element = elem.element;
            var bPunctuation = para_Text === element.Type && (AscCommon.g_aPunctuation[element.Value] && !EXCLUDED_PUNCTUATION[element.Value]);
            return !(element.Type === para_Space || element.Type === para_Tab
                || element.Type === para_Separator || element.Type === para_NewLine
                || element.Type === para_FootnoteReference
                || element.Type === para_EndnoteReference
                || bPunctuation);
        });
    };
    CMergeTextElement.prototype.getReviewType = function (idxElement) {
        var oRun = this.mergeElements[idxElement].run;
        return oRun && oRun.GetReviewType();
    }

    CMergeTextElement.prototype.getPriorityReviewType = function () {
        var oThis = this;
        return this.mergeElements.reduce(function (acc, b, idx) {
            return getPriorityReviewType([oThis.getReviewType(idx), acc]);
        }, reviewtype_Common);
    };

    CMergeTextElement.prototype.logText = function () {
        return this.mergeElements.map(function (e) {
            return String.fromCharCode(e.element.Value);
        }).join('')
    }

    CMergeTextElement.prototype.merge = function (anotherTextElement, insertIndexesMap, arrOfReviewType) {
        if (!(anotherTextElement instanceof this.constructor)) return;

        arrOfReviewType = arrOfReviewType || [];

        insertIndexesMap = insertIndexesMap || {};
        var initialElements = this.mergeElements;
        var mergedElements = anotherTextElement.mergeElements;
        console.log( 'diff:',anotherTextElement.logText(),'<-->', 'largest:', this.logText());
        var initialIndex = 0;
        var mergedIndex = 0;
        var bEqualsWithoutType = this.equalsWithoutType(anotherTextElement);

/*        if (!bEqualsWithoutType) {
            var originalRun = this.getMergedRun(0);
            var currentReviewType = originalRun.GetReviewType();

            if (!insertIndexesMap[originalRun.Id]) {
                insertIndexesMap[originalRun.Id] = {};
                insertIndexesMap[originalRun.Id].contentForInsert = [];
            }
            var contentForInsert = insertIndexesMap[originalRun.Id].contentForInsert;

            for (var i = 0; i < mergedElements.length; i += 1) {
                var mergedChar = mergedElements[i].element;
                var mergedRun = anotherTextElement.getMergedRun(i);
                var anotherReviewType = mergedRun.GetReviewType();
                var actualReviewType = getPriorityReviewType([anotherReviewType, currentReviewType, arrOfReviewType[i]]);

                contentForInsert.push({splitIndex:initialElements[initialIndex].posInRun, mergedChar: mergedChar, reviewType: actualReviewType});
            }
        } else {*/
            while (initialIndex < initialElements.length && mergedIndex < mergedElements.length) {
                var originalRun = this.getMergedRun(initialIndex);//todo: change this
                var mergedRun = anotherTextElement.getMergedRun(mergedIndex);
                var anotherReviewType = mergedRun.GetReviewType();
                var currentReviewType = originalRun.GetReviewType();
                var actualReviewType = getPriorityReviewType([anotherReviewType, currentReviewType, arrOfReviewType[mergedIndex]]);
                if (!insertIndexesMap[originalRun.Id]) {
                    insertIndexesMap[originalRun.Id] = {};
                    insertIndexesMap[originalRun.Id].contentForInsert = [];
                }
                var reviewEquals = anotherReviewType === currentReviewType;
                var contentForInsert = insertIndexesMap[originalRun.Id].contentForInsert;

                var initialChar = initialElements[initialIndex].element;
                var mergedChar = mergedElements[mergedIndex].element;
                var bEquals = reviewEquals && mergedChar && initialChar.Value === mergedChar.Value;
                while (!bEquals && mergedIndex < mergedElements.length) {
                    contentForInsert.push({splitIndex:initialElements[initialIndex].posInRun, mergedChar: mergedChar, reviewType: actualReviewType});

                    //originalRun.AddToContent(insertIndex, mergedChar);
                    mergedIndex += 1;
                    if (mergedElements[mergedIndex]) {
                        mergedChar = mergedElements[mergedIndex] && mergedElements[mergedIndex].element;
                        reviewEquals = anotherTextElement.getReviewType(mergedIndex) === currentReviewType;
                    }

                    bEquals = reviewEquals && mergedChar && initialChar.Value === mergedChar.Value;
                }

                initialIndex += 1;
                mergedIndex += 1;
            }
        /*}*/
    };

    CMergeTextElement.prototype.merge2 = function (anotherTextElement, insertIndexesMap, arrOfReviewType, conflictType) {
        if (!(anotherTextElement instanceof this.constructor)) return;

        arrOfReviewType = arrOfReviewType || [];

        insertIndexesMap = insertIndexesMap || {};
        var initialElements = this.mergeElements;
        var mergedElements = anotherTextElement.mergeElements;

        var originalRun = this.getMergedRun(0);
        var mergedRun = anotherTextElement.getMergedRun(0);
        var anotherReviewType = mergedRun.GetReviewType();
        var currentReviewType = originalRun.GetReviewType();
        var actualReviewType = getPriorityReviewType([anotherReviewType, currentReviewType, arrOfReviewType[0]]);
        if (!insertIndexesMap[originalRun.Id]) {
            insertIndexesMap[originalRun.Id] = {};
            insertIndexesMap[originalRun.Id].contentForInsert = [];
        }
        var contentForInsert = insertIndexesMap[originalRun.Id].contentForInsert;
        mergedElements.forEach(function (elem) {
            contentForInsert.push({splitIndex:initialElements[0].posInRun, mergedChar: elem.element, reviewType: actualReviewType, conflictType: conflictType});
        })

    };

    CMergeTextElement.prototype.equals = function (oAnotherTextElement) {
        return this.equalsWithoutType(oAnotherTextElement) && this.reviewTypeEquals(oAnotherTextElement);
    }
    CMergeTextElement.prototype.equalsWithoutType2 = function (oAnotherTextElement) {
        if (!(oAnotherTextElement instanceof this.constructor)) return false;
        if (this.mergeElements.length !== oAnotherTextElement.mergeElements.length) return false;

        var currentElements = this.mergeElements;
        var equalsElements = oAnotherTextElement.mergeElements;
        for (var i = 0; i < currentElements.length; i += 1) {
            var currentElement = currentElements[i].element.Value;
            var equalElement = equalsElements[i].element.Value;
            if (currentElement !== equalElement) {
                return false;
            }
        }
        var currentElements = this.mergeElements;
        for (var i = 0; i < currentElements.length; i += 1) {
            var mergedRun1 = this.getMergedRun(i);
            var mergedRun2 = oAnotherTextElement.getMergedRun(i);
            if (mergedRun1.GetReviewType() !== mergedRun2.GetReviewType() && mergedRun1.GetReviewType() !== reviewtype_Common && mergedRun2.GetReviewType() !== reviewtype_Common) {
                return false;
            }
        }

        return true;
    }

    CMergeTextElement.prototype.equalsWithoutType = function (oAnotherTextElement) {
        if (!(oAnotherTextElement instanceof this.constructor)) return false;
        if (this.mergeElements.length !== oAnotherTextElement.mergeElements.length) return false;

        var currentElements = this.mergeElements;
        var equalsElements = oAnotherTextElement.mergeElements;
        for (var i = 0; i < currentElements.length; i += 1) {
            var currentElement = currentElements[i].element.Value;
            var equalElement = equalsElements[i].element.Value;
            if (currentElement !== equalElement) {
                return false;
            }
        }
        return true;
    }



    CMergeTextElement.prototype.reviewTypeEquals = function (oAnotherTextElement) {
        if (!(oAnotherTextElement instanceof this.constructor)) return false;
        if (this.mergeElements.length !== oAnotherTextElement.mergeElements.length) return false;
        var currentElements = this.mergeElements;
        for (var i = 0; i < currentElements.length; i += 1) {
            var mergedRun1 = this.getMergedRun(i);
            var mergedRun2 = oAnotherTextElement.getMergedRun(i);
            if (mergedRun1.GetReviewType() !== mergedRun2.GetReviewType()) {
                return false;
            }
        }
        return true;
    };

    function CMergeNode(oElement, oParent) {
        CNode.call(this, oElement, oParent);
        this.isVisit = false;
    }

    CMergeNode.prototype = Object.create(CNode.prototype);
    CMergeNode.prototype.constructor = CMergeNode;

    CMergeNode.prototype.equals = function (oNode) {
        if (!(this.element instanceof CMergeTextElement) || !(oNode.element instanceof CMergeTextElement)) return false;
        return this.element.equals(oNode.element);
    }

    CMergeNode.prototype.equalsWithoutType = function (oNode) {
        if (!(this.element instanceof CMergeTextElement) || !(oNode.element instanceof CMergeTextElement)) return false;
        return this.element.equalsWithoutType(oNode.element);
    }

    CMergeNode.prototype.equalsDuplicate = function (oNode) {
        if (!(this.element instanceof CMergeTextElement) || !(oNode.element instanceof CMergeTextElement)) return false;
        return this.element.equalsDuplicate(oNode.element);
    }

    CMergeNode.prototype.merge = function (oNode) {
        this.element.merge(oNode.element);
    }

    CMergeNode.prototype.equalsWithoutType2 = function (oNode) {
        if (!(this.element instanceof CMergeTextElement) || !(oNode.element instanceof CMergeTextElement)) return false;
        return this.element.equalsWithoutType(oNode.element);
    }

    CMergeNode.prototype.arrEquals = function (arrONodes) {
        var oThis = this;
        return arrONodes.map(function (oNode) {
            return oThis.equals(oNode);
        });
    }

    CMergeNode.prototype.arrEqualsWithoutType = function (arrONodes) {
        var oThis = this;
        return arrONodes.map(function (oNode) {
            return oThis.equalsWithoutType(oNode);
        });
    }

    CMergeNode.prototype.getPriorityReviewType = function (oNode) {
        return this.element.getPriorityReviewType();
    }

    CMergeNode.prototype.arrNotEqualsNodes = function (arrONodes) {
        var oThis = this;
        return arrONodes.filter(function (oNode) {
            return !oThis.equals(oNode);
        });
    }


    
    CMergeNode.prototype.reviewTypeEquals = function (oNode) {
        if (!(this.element instanceof CMergeTextElement) || !(oNode.element instanceof CMergeTextElement)) return false;
        return this.element.reviewTypeEquals(oNode.element);
    }

    function CDocumentMerge(oOriginalDocument, oRevisedDocument, oOptions, originalAuthor, revisedAuthor) {
        CDocumentComparison.call(this, oOriginalDocument, oRevisedDocument, oOptions);
        this.originalAuthor = originalAuthor;
        this.revisedAuthor = revisedAuthor;
        this.insertIndexesMap = {};
    }
    CDocumentMerge.prototype = Object.create(CDocumentComparison.prototype);
    CDocumentMerge.prototype.constructor = CDocumentMerge;
    CDocumentMerge.prototype.compare = undefined;

    CDocumentMerge.prototype.applyLastComparison = function (oOrigRoot, oRevisedRoot) {
        var j = oRevisedRoot.children.length - 1;
        var aInserContent = [];
        var bHavePrChanges;
        for(var i = oOrigRoot.children.length - 1; i > -1 ; --i)
        {
            if(!oOrigRoot.children[i].partner)
            {
                var oChidrenElement = oOrigRoot.children[i].element;
                if (oChidrenElement) {

                    bHavePrChanges = (oChidrenElement.HavePrChange && oChidrenElement.HavePrChange() ||
                        oOrigRoot.element.HavePrChange && oOrigRoot.element.HavePrChange());
                    if (!bHavePrChanges) {
                        this.setReviewInfoRecursive(oChidrenElement, reviewtype_Add);
                    }
                }
            }
            else
            {
                aInserContent.length = 0;
                for(j = oOrigRoot.children[i].partner.childidx + 1;
                    j < oRevisedRoot.children.length && !oRevisedRoot.children[j].partner; ++j)
                {
                    aInserContent.push(oRevisedRoot.children[j]);
                }
                if(aInserContent.length > 0)
                {
                    this.insertNodesToDocContent(oOrigRoot.element, i + 1, aInserContent);
                }
            }
        }
        aInserContent.length = 0;
        for(j = 0; j < oRevisedRoot.children.length && !oRevisedRoot.children[j].partner; ++j)
        {
            aInserContent.push(oRevisedRoot.children[j]);
        }
        if(aInserContent.length > 0)
        {
            this.insertNodesToDocContent(oOrigRoot.element, 0, aInserContent);
        }
    };

    CDocumentMerge.prototype.insertNodesToDocContent = function (oElement, nIndex, aInsert) {

        var k = 0;
        for(var j = 0; j < aInsert.length; ++j)
        {
            var oChildElement = null;
            if(aInsert[j].element.Get_Type)
            {
                var reviewType = aInsert[j].element.GetReviewType && aInsert[j].element.GetReviewType();
                oChildElement = aInsert[j].element.Copy(oElement, oElement.DrawingDocument, Object.assign({ReviewType: reviewType}, this.copyPr));
            }
            else
            {
                if(aInsert[j].element.Parent && aInsert[j].element.Parent.Get_Type)
                {
                    var reviewType = aInsert[j].element.Parent.GetReviewType && aInsert[j].element.Parent.GetReviewType();
                    oChildElement = aInsert[j].element.Parent.Copy(oElement, oElement.DrawingDocument, Object.assign({ReviewType: reviewType},this.copyPr));
                }
            }
            if(oChildElement)
            {
                oElement.Internal_Content_Add(nIndex + k, oChildElement, false);
                ++k;
            }
        }

    };

    function CMockDocument(arrContent) {
        this.Content = arrContent || [];
    }

    CMockDocument.prototype.Remove_FromContent = function (idx, nCount) {
        this.Content.splice(idx, nCount);
    }

    CDocumentMerge.prototype.getLargestCommonDocument = function (oOrigDocument, oRevisedDocument, callback) {
        var oComp = new CDocumentComparison(oOrigDocument, oRevisedDocument, /*oOptions ? oOptions : */new AscCommonWord.ComparisonOptions());
        oComp.applyInsertsToParagraphsWithRemove = CDocumentMerge.prototype.applyInsertsToParagraphsWithRemove;
        var oThis = this;
        function callback2() {
            var documentWithChanges = new CMockDocument(oOrigDocument.Content.map(function (e) {return e.Copy()}));
            // не нужно хавать документ и очищать его, при сравнении все должно схлопнуться
            var largestCommonDocument = oThis.getClearDocument(oOrigDocument);
            callback(/*largestCommonDocument*/oOrigDocument, documentWithChanges);
        }
        oComp.compare(callback2);
    }
    function collectReviewRunsAround(oRun, posInParent) {
        const arrRet = [];
        var oParagraph = oRun.Paragraph;
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
    CDocumentMerge.prototype.getLargestCommonDocument2 = function (oOrigDocument, oRevisedDocument, callback) {
        var oComp = new CDocumentMergeComparison(oOrigDocument, oRevisedDocument, /*oOptions ? oOptions : */new AscCommonWord.ComparisonOptions());
        var oThis = this;
        function callback2() {
            var documentWithChanges = new CMockDocument(oOrigDocument.Content.map(function (e) {return e.Copy()}));
            // не нужно хавать документ и очищать его, при сравнении все должно схлопнуться
            var largestCommonDocument = /*oThis.getClearDocument(*/oOrigDocument/*)*/;
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
            callback(largestCommonDocument/*oOrigDocument*/, documentWithChanges);
        }
        oComp.compare(callback2);
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


    CDocumentMerge.prototype.groupByInsertIndex = function (insertInfo) {
        var oRet = {};
        for (var i = 0; i < insertInfo.length; i += 1) {
            var element = insertInfo[i];
            if (!oRet[element.splitIndex]) {
                oRet[element.splitIndex] = [];
            }
            oRet[element.splitIndex].push(element);
        }
        return oRet;
    }

    CDocumentMerge.prototype.groupByReviewType2 = function (oGroupedByInsertIndex) {
        var oRet = {};
        for (var insertIndex in oGroupedByInsertIndex) {
            var insertInfo = oGroupedByInsertIndex[insertIndex];

            var arrRet = [];
            var temp = [insertInfo[0]];
            for (var i = 1; i < insertInfo.length; i += 1) {
                if (insertInfo[i].reviewType === temp[temp.length - 1].reviewType && insertInfo[i].conflictType === temp[temp.length - 1].conflictType) {
                    temp.push(insertInfo[i]);
                } else {
                    arrRet.push(temp);
                    temp = [insertInfo[i]];
                }
            }
            if (arrRet[arrRet.length - 1] !== temp) {
                arrRet.push(temp);
            }
            oRet[insertIndex] = arrRet;
        }
        return oRet;
    }

    CDocumentMerge.prototype.groupByReviewType = function (insertInfo) {
        var arrRet = [];
        var temp = [insertInfo[0]];
        for (var i = 1; i < insertInfo.length; i += 1) {
            if (insertInfo[i].reviewType === temp[temp.length - 1].reviewType) {
                temp.push(insertInfo[i]);
            } else {
                arrRet.push(temp);
                temp = [insertInfo[i]];
            }
        }
        if (arrRet[arrRet.length - 1] !== temp) {
            arrRet.push(temp);
        }
        return arrRet;
    };

    CDocumentMerge.prototype.applyMerge = function () {
        for (var idOfRun in this.insertIndexesMap) {
            var oRun = g_oTableId.Get_ById(idOfRun);

            var insertInfo = this.insertIndexesMap[idOfRun].contentForInsert;
            var groupedInsertInfo = this.groupByInsertIndex(insertInfo);
            groupedInsertInfo = this.groupByReviewType2(groupedInsertInfo);
            var insertIndexes = Object.keys(groupedInsertInfo).sort(function (a, b) {return parseFloat(a) - parseFloat(b);});
            var deltaInsertIndex = 0;
            for (var i = 0; i < insertIndexes.length; i += 1) {
                var insertIndex = parseInt(insertIndexes[i], 10);
                var groupedTypesForInsert = groupedInsertInfo[insertIndex];
                var relativeIndex = insertIndex - deltaInsertIndex;
                oRun = oRun.Split2(relativeIndex, oRun.Paragraph, oRun.GetPosInParent());
                deltaInsertIndex += relativeIndex;
                for (var j = 0; j < groupedTypesForInsert.length; j += 1) {
                    var groupedByTypeContent = groupedTypesForInsert[j];
                    // var p = 0;
                    for (var k = 0; k < groupedByTypeContent.length; k += 1) {
                        var mergedChar = groupedByTypeContent[k].mergedChar;
                        // if (mergedChar instanceof AscCommonWord.ParaEnd) {
                        //     var paragraph = oRun.Parent;
                        //     var parent = paragraph.Parent;
                        //     var parPos;
                        //     for (var t = 0; t < parent.Content.length; t += 1) {
                        //         if (parent.Content[t] === paragraph) {
                        //             parPos = t;
                        //             break;
                        //         }
                        //     }
                        //     var newPar = new Paragraph(parent.DrawingDocument, parent);
                        //     var pos = new AscCommonWord.CParagraphContentPos();
                        //     pos.Data[0] = oRun.GetPosInParent();
                        //     pos.Data[1] = k;
                        //     paragraph.Split(newPar, pos);
                        // } else {
                            oRun.AddToContent(k, mergedChar);
                        // }
                    }

                    var temp = oRun.Split2(k, oRun.Paragraph, oRun.GetPosInParent());
                    this.setReviewInfoRecursive(oRun, groupedByTypeContent[0].reviewType);
                    oRun = temp;
                }

            }
        }
    };

    CDocumentMerge.prototype.applyMerge2 = function () {
        for (var idOfRun in this.insertIndexesMap) {
            var oRun = g_oTableId.Get_ById(idOfRun);

            var insertInfo = this.insertIndexesMap[idOfRun].contentForInsert;
            var groupedInsertInfo = this.groupByInsertIndex(insertInfo);
            groupedInsertInfo = this.groupByReviewType2(groupedInsertInfo);
            var insertIndexes = Object.keys(groupedInsertInfo).sort(function (a, b) {return parseFloat(a) - parseFloat(b);});
            var deltaInsertIndex = 0;
            for (var i = 0; i < insertIndexes.length; i += 1) {
                var insertIndex = parseInt(insertIndexes[i], 10);
                var groupedTypesForInsert = groupedInsertInfo[insertIndex];
                var relativeIndex = insertIndex - deltaInsertIndex;
                oRun = oRun.Split2(relativeIndex, oRun.Paragraph, oRun.GetPosInParent());

                deltaInsertIndex += relativeIndex;
                for (var j = 0; j < groupedTypesForInsert.length; j += 1) {
                    var groupedByTypeContent = groupedTypesForInsert[j];
                    // var p = 0;
                    for (var k = 0; k < groupedByTypeContent.length; k += 1) {
                        var mergedChar = groupedByTypeContent[k].mergedChar;
                        oRun.AddToContent(k, mergedChar);
                    }

                    var temp = oRun.Split2(k, oRun.Paragraph, oRun.GetPosInParent());
                    this.setReviewInfoRecursive(oRun, groupedByTypeContent[0].reviewType, undefined, groupedByTypeContent[0].conflictType);
                    oRun = temp;
                }

            }
        }
    };


    CDocumentMerge.prototype.checkIterators = function (arrOfIterators) {
        return arrOfIterators.some(function (iterator) {
            return iterator.check();
        });
    };

    CDocumentMerge.prototype.filterIterators = function (arrOfIterators) {
        return arrOfIterators.filter(function (iterator) {
            return iterator.check();
        });
    }

    CDocumentMerge.prototype.skipUnusualIterators = function (arrOfIterators) {
        return arrOfIterators.map(function (iterator) {
            return iterator.skipUnusual();
        });
    };

    CDocumentMerge.prototype.getValueIterators = function (arrOfIterators) {
        return arrOfIterators.map(function (iterator) {
            return iterator.getValue();
        });
    };

    CDocumentMerge.prototype.getNotEqualsIterators = function (compareNode) {

    }

    CDocumentMerge.prototype.nextIterators = function (arrOfIterators) {
        arrOfIterators.forEach(function (iterator) {
            iterator.next();
        });
    }

    CDocumentMerge.prototype.getPriorityReviewTypesFromIterators = function (arrOfIterators) {
        if (arrOfIterators.length === 0) return [];
        var oRet = [];
        for (var i = 0; i < arrOfIterators[0].value.element.mergeElements.length; i += 1) {
            oRet.push(arrOfIterators[0].value.element.getReviewType(i));
        }

        for (var i = 1; i < arrOfIterators.length; i += 1) {
            var oNode = arrOfIterators[i].value;
            for (var j = 0; j < oRet.length; j += 1) {
                oRet[j] = getPriorityReviewType([oNode.element.getReviewType(j), oRet[j]]);
            }
        }
        return oRet;
    }

    // Функция параллельного хода итераторов
    CDocumentMerge.prototype.applyChangesWithSeveralIterators = function (originalIterator, arrOfMergedIterators) {

        for (originalIterator; originalIterator.check(); originalIterator.next()) {
            var commonNode = originalIterator.getValue();
            var diffNodes = this.getValueIterators(arrOfMergedIterators);

            commonNode = originalIterator.skipUnusual();
            diffNodes = this.skipUnusualIterators(arrOfMergedIterators);
            if (!originalIterator.check() || !this.checkIterators(arrOfMergedIterators)) {
                break;
            }

            var availableMergedIterators = this.filterIterators(arrOfMergedIterators);
            diffNodes = this.getValueIterators(availableMergedIterators);
/*            var reviewTypeOfCommonNode = commonNode.getPriorityReviewType();
            var arrOfEquals
            if (AscFormat.isRealNumber(reviewTypeOfCommonNode) && reviewTypeOfCommonNode !== reviewtype_Common) {
                arrOfEquals = commonNode.arrEqualsWithoutType(diffNodes);
            } else {*/
               var arrOfEquals = commonNode.arrEquals(diffNodes);
/*            }*/

            var notEqualsIterators = availableMergedIterators.filter(function (iterator, idx) {
                return !arrOfEquals[idx];
            });

            // Пока есть, что мерджить, мерджим
            while (this.checkIterators(notEqualsIterators)) {
                // отфильтруем незаконченные итераторы
                notEqualsIterators = this.filterIterators(notEqualsIterators);
                if (!notEqualsIterators.length) break;

                // посмотрим, может, после предыдущего пропуска дубликатов Мы уже смерджили все, что можно
                diffNodes = this.getValueIterators(notEqualsIterators);
                arrOfEquals = commonNode.arrEquals(diffNodes);
                notEqualsIterators = notEqualsIterators.filter(function (iterator, idx) {
                    return !arrOfEquals[idx];
                });
                if (!notEqualsIterators.length) break;



                var mergedIterator = notEqualsIterators.pop();
                var diffNode = mergedIterator.getValue();

                var duplicateIterators = notEqualsIterators.filter(function (iterator) {
                    return diffNode.equalsWithoutType(iterator.getValue());
                });
                var arrOfReviewType = this.getPriorityReviewTypesFromIterators(duplicateIterators);
                this.nextIterators(duplicateIterators);
                this.skipUnusualIterators(duplicateIterators);
                var bEquals = commonNode.equals(diffNode);
                if (!bEquals && mergedIterator.check()) {
                    commonNode.element.merge(diffNode.element, this.insertIndexesMap, arrOfReviewType);

                    mergedIterator.next();

                    diffNode = mergedIterator.skipUnusual();
                    bEquals = commonNode.equals(diffNode);
                }
                if (mergedIterator.check() && !bEquals) {
                    notEqualsIterators.push(mergedIterator);
                }

            }
            availableMergedIterators = this.filterIterators(availableMergedIterators);
            this.nextIterators(availableMergedIterators);
        }
    }
    
    CDocumentMerge.prototype.getChangesFromIteratorsBeforeCommonNode = function (arrOfIterators, commonNode) {
        var oRet = [];
        arrOfIterators.forEach(function (iterator) {
           oRet.push(iterator.getChangesBeforeCommonNode(commonNode));
        });
        return oRet;
    }

    function DiffNodesCollector(originalValue, revisedValue, comparisonValue) {
        this.originalValue = originalValue;
        this.revisedValue = revisedValue;
        this.comparisonValue = comparisonValue;
    }

    function DiffIteratorsCollector(originalIterator, revisedIterator, comparisonIterator) {
        this.originalIterator = originalIterator || null;
        this.revisedIterator = revisedIterator || null;
        this.comparisonIterator = comparisonIterator || null;
    }

    DiffIteratorsCollector.prototype.getDiffNodesCollector = function () {
        return new DiffNodesCollector(this.originalIterator && this.originalIterator.getValue(), this.revisedIterator && this.revisedIterator.getValue(), this.comparisonIterator && this.comparisonIterator.getValue());
    }

    DiffIteratorsCollector.prototype.getDiffNodesCollector = function () {
        return new DiffNodesCollector(this.originalIterator.getValue(), this.revisedIterator.getValue(), this.comparisonIterator.getValue());
    }

    DiffIteratorsCollector.prototype.skipUnusual = function () {
        if (this.originalIterator) {
            this.originalIterator.skipUnusual();
        }
        if (this.revisedIterator) {
            this.revisedIterator.skipUnusual();
        }
        if (this.comparisonIterator) {
            this.comparisonIterator.skipUnusual();
        }
        return this.getDiffNodesCollector();
    }

    DiffIteratorsCollector.prototype.check = function () {
        var bCheck = false;
        if (this.originalIterator) {
            bCheck = this.originalIterator.check();
            if (bCheck) return true;
        }
        if (this.revisedIterator) {
            bCheck = this.revisedIterator.check();
            if (bCheck) return true;
        }
        if (this.comparisonIterator) {
            bCheck = this.comparisonIterator.check();
            if (bCheck) return true;
        }
        return false;
    }

    DiffIteratorsCollector.prototype.filterCheck = function () {
        var oRet = new this.constructor();

        if (this.originalIterator && this.originalIterator.check()) {
            oRet.originalIterator = this.originalIterator
        }
        if (this.revisedIterator && this.revisedIterator.check()) {
            oRet.revisedIterator = this.revisedIterator;
        }
        if (this.comparisonIterator && this.comparisonIterator.check()) {
            oRet.comparisonIterator = this.comparisonIterator;
        }
        return oRet;
    }

    DiffIteratorsCollector.prototype.filterNotEquals = function (commonNode) {
        var oRet = new this.constructor();

        if (this.originalIterator) {
            var iterator = this.originalIterator;
            var diffNode = iterator.getValue();
            if (!commonNode.equals(diffNode)) {
                oRet.originalIterator = iterator;
            }
        }

        if (this.revisedIterator) {
            var iterator = this.revisedIterator;
            var diffNode = iterator.getValue();
            if (!commonNode.equals(diffNode)) {
                oRet.revisedIterator = iterator;
            }
        }

        if (this.comparisonIterator) {
            var iterator = this.comparisonIterator;
            var diffNode = iterator.getValue();
            if (!commonNode.equals(diffNode)) {
                oRet.comparisonIterator = iterator;
            }
        }

        return oRet;
    }

    DiffIteratorsCollector.prototype.isExist = function () {
        if (this.originalIterator) {
            return true;
        }
        if (this.revisedIterator) {
            return true;
        }
        if (this.comparisonIterator) {
            return true;
        }
        return false;
    }

    DiffIteratorsCollector.prototype.getCompareDiffBeforeNode = function (commonNode) {
        var oRet = {
            originalDiff: [],
            revisedDiff: []
        };

        var iterator = this.comparisonIterator;
        if (iterator) {
            var diffNode = iterator.getValue();
            var bEquals = commonNode.equals(diffNode);
            while (!bEquals && iterator.check()) {
                var reviewType = diffNode.element.getReviewType(0);
                if (reviewType === reviewtype_Remove) {
                    oRet.originalDiff.push(diffNode);
                } else if (reviewType === reviewtype_Add) {
                    oRet.revisedDiff.push(diffNode);
                }

                iterator.next();
                diffNode = iterator.skipUnusual();
                bEquals = commonNode.equals(diffNode);
            }
        }
        this.comparisonDiff = oRet;

        return oRet;
    }

    DiffIteratorsCollector.prototype._getDiffFromIterators = function (commonNode, iterator) {
        var oRet = [];
        if (iterator) {
            var diffNode = iterator.getValue();
            var bEquals = commonNode.equals(diffNode);
            while (!bEquals && iterator.check()) {
                oRet.push(diffNode);

                iterator.next();

                diffNode = iterator.skipUnusual();
                bEquals = commonNode.equals(diffNode);
            }
        }
        return oRet;
    }
    
    DiffIteratorsCollector.prototype.getOriginalDiffBeforeNode = function (commonNode) {
        var iterator = this.originalIterator;
        var diffs = this._getDiffFromIterators(commonNode, iterator);
        return this.comparisonDiff.originalDiff.concat(diffs);
    }

    DiffIteratorsCollector.prototype.getRevisedDiffBeforeNode = function (commonNode) {
        var iterator = this.revisedIterator;
        var diffs = this._getDiffFromIterators(commonNode, iterator);
        return this.comparisonDiff.revisedDiff.concat(diffs);
    }

    DiffIteratorsCollector.prototype.next = function () {
        if (this.originalIterator) {
            this.originalIterator.next();
        }
        if (this.revisedIterator) {
            this.revisedIterator.next();
        }
        if (this.comparisonIterator) {
            this.comparisonIterator.next();
        }
    }

    CDocumentMerge.prototype.compareDiffNodes = function (arrDiff1, arrDiff2) {
        if (arrDiff1.length !== arrDiff2.length) return false;

        for (var i = 0; i < arrDiff1.length; i += 1) {
            var bEquals = arrDiff1[i].equals(arrDiff2[i]);
            if (!bEquals) return false;
        }
        return true;
    };


    // Функция параллельного хода итераторов
    CDocumentMerge.prototype.applyChangesWithSeveralIterators2 = function (largestCommonDocumentIterator, originalIteratorWithChanges, revisedIteratorWithChanges, largestCommonDocumentWithComparisonIterator) {
        var oThis = this;
        var diffIterators = new DiffIteratorsCollector(originalIteratorWithChanges, revisedIteratorWithChanges, largestCommonDocumentWithComparisonIterator);
        for (largestCommonDocumentIterator; largestCommonDocumentIterator.check(); largestCommonDocumentIterator.next()) {
            var commonNode = largestCommonDocumentIterator.skipUnusual();
            diffIterators.skipUnusual();
            if (!largestCommonDocumentIterator.check() || !diffIterators.check()) {
                break;
            }

            var availableMergedIterators = diffIterators.filterCheck();
            var notEqualsIterators = availableMergedIterators.filterNotEquals(commonNode);

            if (notEqualsIterators.check()) {
                notEqualsIterators = notEqualsIterators.filterCheck();
                if (!notEqualsIterators.isExist()) break;

                notEqualsIterators = notEqualsIterators.filterNotEquals(commonNode);
                if (!notEqualsIterators.isExist()) break;

                notEqualsIterators.getCompareDiffBeforeNode(commonNode);
                var diffOriginalNodes = notEqualsIterators.getOriginalDiffBeforeNode(commonNode);
                var diffRevisedNodes = notEqualsIterators.getRevisedDiffBeforeNode(commonNode);

                var bDuplicate = this.compareDiffNodes(diffOriginalNodes, diffRevisedNodes);
                if (bDuplicate) {
                    diffRevisedNodes.forEach(function (diffNode) {
                        commonNode.element.merge2(diffNode.element, oThis.insertIndexesMap, []);
                    });
                } else {
                    var bConflict = diffOriginalNodes.length && diffRevisedNodes.length;
                    diffOriginalNodes.forEach(function(diffNode) {
                        commonNode.element.merge2(diffNode.element, oThis.insertIndexesMap, [], bConflict ? CONFLICT_TYPES.originalDocument : undefined);
                    });
                    diffRevisedNodes.forEach(function(diffNode) {
                        commonNode.element.merge2(diffNode.element, oThis.insertIndexesMap, [], bConflict ? CONFLICT_TYPES.revisedDocument: undefined);
                    });
                }
            }

            availableMergedIterators = availableMergedIterators.filterCheck();
            availableMergedIterators.next();
        }
    }


    CDocumentMerge.prototype.applyChangesWithIterators = function (originalIterator, mergedIterator) {
        for (originalIterator; originalIterator.check() && mergedIterator.check(); originalIterator.next()) {
            var commonNode = originalIterator.getValue();
            var diffNode = mergedIterator.getValue();

            commonNode = originalIterator.skipUnusual();
            diffNode = mergedIterator.skipUnusual();

            if (!originalIterator.check() || !mergedIterator.check()) {
                break;
            }
            var bEquals = commonNode.equals(diffNode);
            if (bEquals) {
                mergedIterator.next();
                console.log(true);
            } else {
                while (!bEquals && mergedIterator.check()) {
                    commonNode.element.merge(diffNode.element, this.insertIndexesMap);
                    mergedIterator.next();

                    diffNode = mergedIterator.skipUnusual();
                    bEquals = commonNode.equals(diffNode);
                }
                if (mergedIterator.check()) {
                    mergedIterator.next();
                }
            }
        }
    };

    CDocumentMerge.prototype.merge2 = function () {
        var oOriginalDocument = this.originalDocument;
        var oRevisedDocument = this.revisedDocument;

        if(!oOriginalDocument || !oRevisedDocument)
        {
            return;
        }
        var oApi = oOriginalDocument.GetApi();
        if(!oApi)
        {
            return;
        }

        var oOrigCopy = new CMockDocument(oOriginalDocument.Content.map(function(e){return e.Copy()}));
        var oRevisedCopy = new CMockDocument(oRevisedDocument.Content.map(function(e){return e.Copy()}));

        /*        for (var iter = new CDocumentIterator(oOriginalDocument); iter.check(); iter.next()) {
                    console.log(iter.skipUnusual());
                }*/
        var oOrigWithoutPrChanges = this.getClearDocument(oOriginalDocument);
        var oRevisedWithoutChanges = this.getClearDocument(oRevisedDocument);


        this.getLargestCommonDocument(oOrigWithoutPrChanges, oRevisedWithoutChanges, function (largestCommonDocument, documentWithDiff) {
            var largestCommonDocumentIterator = new CDocumentIterator(largestCommonDocument);
            var firstDocumentWithChangesIterator = new CDocumentIterator(oOrigCopy);
            var secondDocumentWithChangesIterator = new CDocumentIterator(oRevisedCopy);
            var thirdDocumentWithChangesIterator = new CDocumentIterator(documentWithDiff);
            // this.applyChangesWithIterators(largestCommonDocumentIterator, firstDocumentWithChangesIterator);
            // largestCommonDocumentIterator.reset();
            // this.applyChangesWithIterators(largestCommonDocumentIterator, secondDocumentWithChangesIterator);

            this.applyChangesWithSeveralIterators(largestCommonDocumentIterator, [
                firstDocumentWithChangesIterator,
                secondDocumentWithChangesIterator,
                //thirdDocumentWithChangesIterator
            ]);
            console.log(this.insertIndexesMap);
            this.applyMerge();



            oOriginalDocument.Recalculate();
            oOriginalDocument.UpdateInterface();
            oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        }.bind(this));
            oOriginalDocument.Recalculate();
            oOriginalDocument.UpdateInterface();
            oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        //
        //

        /*        var oOrigRootWithChanges = this.createNodeFromDocContent(this.originalDocument, null, null);
                var oRevisedRootWithChanges =  this.createNodeFromDocContent(this.revisedDocument, null, null);

                var oRevisedRootWithoutChanges = this.getNodesWithoutChanges(this.createNodeFromDocContent({Content: this.originalDocument.Content.map(function (elem) {
                        return elem.Copy();
                    })}, null, null));
                var oOrigRootWithoutChanges    = this.getNodesWithoutChanges(this.createNodeFromDocContent({Content: this.revisedDocument.Content.map(function (elem) {
                        return elem.Copy();
                    })}, null, null));
                console.log(oOrigRootWithChanges, oOrigRootWithoutChanges);*/
        /*var i, j;
        var oEqualMap;
        var aBase, aCompare, bOrig = true;
        if(oOrigRoot.children.length <= oRevisedRoot.children.length)
        {
            aBase = oOrigRoot.children;
            aCompare = oRevisedRoot.children;
        }
        else
        {
            bOrig = false;
            aBase = oRevisedRoot.children;
            aCompare = oOrigRoot.children;
        }*/


    };

    CDocumentMerge.prototype.merge4 = function () {
        var oOriginalDocument = this.originalDocument;
        var oRevisedDocument = this.revisedDocument;

        if(!oOriginalDocument || !oRevisedDocument)
        {
            return;
        }
        var oApi = oOriginalDocument.GetApi();
        if(!oApi)
        {
            return;
        }

        oOriginalDocument.StopRecalculate();
        oOriginalDocument.StartAction(AscDFH.historydescription_Document_MergeDocuments);
        oOriginalDocument.Start_SilentMode();
        var oldTrackRevisions = oOriginalDocument.IsTrackRevisions();
        oOriginalDocument.SetTrackRevisions(false);




        var oOrigCopy = new CMockDocument(oOriginalDocument.Content.map(function(e){return e.Copy()}));
        var oRevisedCopy = new CMockDocument(oRevisedDocument.Content.map(function(e){return e.Copy()}));

        /*        for (var iter = new CDocumentIterator(oOriginalDocument); iter.check(); iter.next()) {
                    console.log(iter.skipUnusual());
                }*/
        var oOrigWithoutPrChanges = /*this.getClearDocument(*/oOriginalDocument/*)*/;
        var oRevisedWithoutChanges = /*this.getClearDocument(*/oRevisedDocument/*)*/;


        this.getLargestCommonDocument2(oOrigWithoutPrChanges, oRevisedWithoutChanges, function (largestCommonDocument, documentWithDiff) {
            // var largestCommonDocumentIterator = new CDocumentIterator(largestCommonDocument);
            // var originalDocumentWithChangesIterator = new CDocumentIterator(oOrigCopy);
            // var revisedDocumentWithChangesIterator = new CDocumentIterator(oRevisedCopy);
            // var largestCommonDocumentWithChangesIterator = new CDocumentIterator(documentWithDiff);
            // // this.applyChangesWithIterators(largestCommonDocumentIterator, originalDocumentWithChangesIterator);
            // // largestCommonDocumentIterator.reset();
            // // this.applyChangesWithIterators(largestCommonDocumentIterator, revisedDocumentWithChangesIterator);
            //
            // this.applyChangesWithSeveralIterators2(largestCommonDocumentIterator,
            //     originalDocumentWithChangesIterator,
            //     revisedDocumentWithChangesIterator,
            //     largestCommonDocumentWithChangesIterator
            // );
            // console.log(this.insertIndexesMap);
            // this.applyMerge2();



            oOriginalDocument.SetTrackRevisions(oldTrackRevisions);
            oOriginalDocument.End_SilentMode(false);
            oOriginalDocument.Recalculate();
            oOriginalDocument.UpdateInterface();
            oOriginalDocument.FinalizeAction();
            oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        }.bind(this));
        //
        //

        /*        var oOrigRootWithChanges = this.createNodeFromDocContent(this.originalDocument, null, null);
                var oRevisedRootWithChanges =  this.createNodeFromDocContent(this.revisedDocument, null, null);

                var oRevisedRootWithoutChanges = this.getNodesWithoutChanges(this.createNodeFromDocContent({Content: this.originalDocument.Content.map(function (elem) {
                        return elem.Copy();
                    })}, null, null));
                var oOrigRootWithoutChanges    = this.getNodesWithoutChanges(this.createNodeFromDocContent({Content: this.revisedDocument.Content.map(function (elem) {
                        return elem.Copy();
                    })}, null, null));
                console.log(oOrigRootWithChanges, oOrigRootWithoutChanges);*/
        /*var i, j;
        var oEqualMap;
        var aBase, aCompare, bOrig = true;
        if(oOrigRoot.children.length <= oRevisedRoot.children.length)
        {
            aBase = oOrigRoot.children;
            aCompare = oRevisedRoot.children;
        }
        else
        {
            bOrig = false;
            aBase = oRevisedRoot.children;
            aCompare = oOrigRoot.children;
        }*/


    };

    CDocumentMerge.prototype.merge3 = function () {

        var oOriginalDocument = this.originalDocument;
        var oRevisedDocument = this.revisedDocument;

        if(!oOriginalDocument || !oRevisedDocument)
        {
            return;
        }
        var oApi = oOriginalDocument.GetApi();
        if(!oApi)
        {
            return;
        }

         var oComp = new CDocumentMergeComparison(this.originalDocument, this.revisedDocument, /*oOptions ? oOptions : */new AscCommonWord.ComparisonOptions());
        var oThis = this;
        var callback2 = function() {
            // var documentWithChanges = new CMockDocument(oOrigDocument.Content.map(function (e) {return e.Copy()}));
            // // не нужно хавать документ и очищать его, при сравнении все должно схлопнуться
            // var largestCommonDocument = oThis.getClearDocument(oOrigDocument);
            // callback(largestCommonDocument, documentWithChanges);


            oOriginalDocument.Recalculate();
            oOriginalDocument.UpdateInterface();
            oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
        }.bind(this);
        oComp.compare(callback2);
            oOriginalDocument.Recalculate();
            oOriginalDocument.UpdateInterface();
            oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
    }

    CDocumentMerge.prototype.saveRemoveElementFromDocument = function (oElement) {
        var parent = oElement.Parent;
        if (parent) {
            for (var i = 0; i < parent.Content.length; i += 1) {
                if (parent.Content[i] === oElement) {
                    if (parent.Remove_FromContent) {
                        parent.Remove_FromContent(i, 1);
                    } else {
                        parent.Content.splice(i, 1);
                    }
                    break;
                }
            }
        }
    }
    CDocumentMerge.prototype.concatParagraphsWithNext = function (oParagraph) {
        oParagraph.SetReviewType(reviewtype_Common);
        var parent = oParagraph.Parent;
        var posInParent;
        for (var i = 0; i < parent.Content.length; i += 1) {
            if (parent.Content[i] === oParagraph) {
                posInParent = i;
            }
        }
        if (parent.Content[posInParent + 1]) {

            oParagraph.Concat(parent.Content[posInParent + 1]);
            parent.Remove_FromContent(posInParent + 1, 1);
        }
    };
    CDocumentMerge.prototype.getClearDocument = function (oDocument) {
        var arrCheckObjects = oDocument.Content.slice();
        while (arrCheckObjects.length) {
            var checkElement = arrCheckObjects.pop();
            if (checkElement) {
                if (!(checkElement instanceof Paragraph) && checkElement.GetReviewType && checkElement.GetReviewType()) {
                    this.saveRemoveElementFromDocument(checkElement);
                } else if (checkElement.Content) {
                    arrCheckObjects.push.apply(arrCheckObjects, checkElement.Content);
                }
            }
        }
        return oDocument;
    }


    CDocumentMerge.prototype.createNodeFromRunContentElement = function(oElement, oParentNode, oHashWords)
    {
        var oRet = new CMergeNode(oElement, oParentNode);
        var oLastText = null, oRun, oRunElement, i, j;
        var aLastWord = [];
        for(i = 0; i < oElement.Content.length; ++i)
        {
            oRun = oElement.Content[i];
            if(oRun instanceof ParaRun)
            {
                if(oRun.Content.length > 0)
                {
                    if(!oLastText)
                    {
                        oLastText = new CMergeTextElement();
                        oLastText.setFirstRun(oRun);
                    }
                    if(oLastText.mergeElements.length === 0)
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
                            if(oLastText.mergeElements.length > 0)
                            {
                                new CMergeNode(oLastText, oRet);
                                oLastText.updateHash(oHashWords);
                                oLastText = new CMergeTextElement();
                                oLastText.setFirstRun(oRun);
                            }

                            oLastText.setLastRun(oRun);
                            oLastText.mergeElements.push(new CMergeTextElementInfo(oRun, j));
                            new CMergeNode(oLastText, oRet);
                            oLastText.updateHash(oHashWords);

                            oLastText = new CMergeTextElement();
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                        }
                        else if(oRunElement.Type === para_Drawing)
                        {
                            if(oLastText.mergeElements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                new CMergeNode(oLastText, oRet);
                                oLastText = new CMergeTextElement();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.mergeElements.push(new CMergeTextElementInfo(oRun, j));
                            new CMergeNode(oLastText, oRet);
                            oLastText = new CMergeTextElement();
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                        }
                        else if(oRunElement.Type === para_End)
                        {
                            if(oLastText.mergeElements.length > 0)
                            {
                                oLastText.updateHash(oHashWords);
                                new CMergeNode(oLastText, oRet);
                                oLastText = new CMergeTextElement();
                                oLastText.setFirstRun(oRun);
                                oLastText.setLastRun(oRun);
                            }
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                            oLastText.mergeElements.push(new CMergeTextElementInfo(oRun, j));
                            new CMergeNode(oLastText, oRet);
                            oLastText.updateHash(oHashWords);
                            oLastText = new CMergeTextElement();
                            oLastText.setFirstRun(oRun);
                            oLastText.setLastRun(oRun);
                        }
                        else
                        {
                            if(oLastText.mergeElements.length === 0)
                            {
                                oLastText.setFirstRun(oRun);
                            }
                            oLastText.setLastRun(oRun);
                            oLastText.mergeElements.push(new CMergeTextElementInfo(oRun, j));
                        }
                    }

                }
            }
            else
            {
                if(!(oRun instanceof CParagraphBookmark))
                {
                    if(oLastText && oLastText.mergeElements.length > 0)
                    {
                        oLastText.updateHash(oHashWords);
                        new CMergeNode(oLastText, oRet);
                    }
                    if(aLastWord.length > 0)
                    {
                        oHashWords.update(aLastWord);
                        aLastWord.length = 0;
                    }
                    oLastText = null;
                    if(Array.isArray(oRun.Content))
                    {
                        this.createNodeFromRunContentElement(oRun, oRet, oHashWords);
                    }
                    else
                    {
                        new CMergeNode(oRun, oRet);
                    }
                }
            }
        }
        if(oLastText && oLastText.mergeElements.length > 0)
        {
            oLastText.updateHash(oHashWords);
            new CMergeNode(oLastText, oRet);
        }
        return oRet;
    };

    CDocumentMerge.prototype.getNodeConstructor = function () {
        return CMergeNode;
    };

    function CDocumentIterator(oDocument) {
        this.tree = this.createTree(oDocument, null, null);
        this.parent = this.tree;
        this.value = this.tree.children[0];
        if (!this.value) {
            this.checkValue = false;
        } else {
            this.value.isVisit = true;
            this.checkValue = true;
        }
    }

    CDocumentIterator.prototype.createTree = CDocumentMerge.prototype.createNodeFromDocContent;
    CDocumentIterator.prototype.getNodeConstructor = CDocumentMerge.prototype.getNodeConstructor;
    CDocumentIterator.prototype.createNodeFromRunContentElement = CDocumentMerge.prototype.createNodeFromRunContentElement;

    CDocumentIterator.prototype.getValue = function () {
        return this.value;
    }

    CDocumentIterator.prototype.getChangesBeforeCommonNode = function (oNode) {
        var oRet = [];
        for (this; this.check() && !oNode.equals(this.getValue()); this.next()) {
            oRet.push(this.getValue());
        }
        return oRet;
    };

    CDocumentIterator.prototype.reset = function () {
        this.checkValue = true;
        this.parent = this.tree;
        this.value = this.tree.children[0];
        var arrReset = [this.tree];
        while (arrReset.length) {
            var checkChild = arrReset.pop();
            checkChild.isVisit = false;
            arrReset.push.apply(arrReset, checkChild.children);
        }
    };

    CDocumentIterator.prototype.next = function () {
        var newValue;

        while (!newValue) {
            if (!this.parent) {
                this.checkValue = false;
                break;
            } else if (this.value.children[0] && !this.value.children[0].isVisit) {
                newValue = this.value.children[0];
            } else if (this.value.childidx === this.parent.children.length - 1 || this.parent.children[this.value.childidx + 1].isVisit) {
                var oldParent = this.parent;
                this.parent = this.parent.par;
                this.value = oldParent;
            } else {
                newValue = this.parent.children[this.value.childidx + 1];
            }
        }

        if (newValue) {
            this.value = newValue;
            this.value.isVisit = true;
            this.parent = this.value.par;
        }
    }

    CDocumentIterator.prototype.check = function () {
        return this.checkValue;
    }

    CDocumentIterator.prototype.isElementForAdd = function ()
    {
        if(this.getValue().IsParaEndRun && this.getValue().IsParaEndRun())
        {
            return false;
        }
        return true;
    };

    CDocumentIterator.prototype.skipUnusual = function () {
        while ((!(this.getValue().element instanceof AscCommonWord.CTextElement)) && this.check()) {
            this.next();
        }
        return this.getValue();
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