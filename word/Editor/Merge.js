(function (undefined) {
    var CDocumentComparison = AscCommonWord.CDocumentComparison;
    var CNode               = AscCommonWord.CNode;
    var g_oTableId          = AscCommon.g_oTableId;

    var EXCLUDED_PUNCTUATION = {};
    EXCLUDED_PUNCTUATION[46] = true; // TODO: organize import
    //EXCLUDED_PUNCTUATION[95] = true;
    EXCLUDED_PUNCTUATION[160] = true;

    function getPriorityReviewType(firstReviewType, secondReviewType) {
        if (firstReviewType === reviewtype_Remove || secondReviewType === reviewtype_Remove) {
            return reviewtype_Remove;
        } else if (firstReviewType === reviewtype_Add || secondReviewType === reviewtype_Add) {
            return reviewtype_Add;
        }
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

    CMergeTextElement.prototype.getReviewType = function (idxElement) {
        var oRun = this.mergeElements[idxElement].run;
        return oRun && oRun.GetReviewType();
    }

    CMergeTextElement.prototype.merge = function (anotherTextElement, insertIndexesMap) {
        if (!(anotherTextElement instanceof this.constructor)) return;

        insertIndexesMap = insertIndexesMap || {};
        var initialElements = this.mergeElements;
        var mergedElements = anotherTextElement.mergeElements;

        var initialIndex = 0;
        var mergedIndex = 0;


        while (initialIndex < initialElements.length && mergedIndex < mergedElements.length) {
            var originalRun = this.getMergedRun(initialIndex);//todo: change this
            var mergedRun = anotherTextElement.getMergedRun(mergedIndex);
            var anotherReviewType = mergedRun.GetReviewType();
            var currentReviewType = originalRun.GetReviewType();
            var actualReviewType = getPriorityReviewType(anotherReviewType, currentReviewType);
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
    };

    CMergeTextElement.prototype.equals = function (oAnotherTextElement) {
        if (!(oAnotherTextElement instanceof this.constructor)) return false;
        if (this.mergeElements.length !== oAnotherTextElement.mergeElements.length) return false;


        var currentElements = this.mergeElements;
        var equalsElements = oAnotherTextElement.mergeElements;
        for (var i = 0; i < currentElements.length; i += 1) {
            var currentElement = currentElements[i].element.Value;
            var equalElement = equalsElements[i].element.Value;
            if (currentElement !== equalElement) {
                return false;
            } else {
                var mergedRun1 = this.getMergedRun(i);
                var mergedRun2 = oAnotherTextElement.getMergedRun(i);
                if (mergedRun1.GetReviewType() !== mergedRun2.GetReviewType()) {
                    return false;
                }
            }
        }
        return true;
    }

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

    CDocumentMerge.prototype.applyInsertsToParagraphsWithRemove = function (oChange, oElement, aContentToInsert) {
        var oLastText = oChange.remove[oChange.remove.length - 1].element;
        var oFirstText = oChange.remove[0].element;
        var oCurRun, oNewRun, oChildElement, k, t;
        if(oLastText.lastRun)
        {
            oCurRun = oLastText.lastRun;
        }
        else
        {
            oCurRun = oLastText;
        }

        var nInsertPosition = -1;
        for(k = oElement.Content.length - 1; k > -1; --k)
        {
            if(oElement.Content[k] === oCurRun)
            {
                if(oLastText instanceof CTextElement)
                {
                    for(t = oCurRun.Content.length - 1; t > -1; t--)
                    {
                        if(oCurRun.Content[t] === oLastText.elements[oLastText.elements.length - 1])
                        {
                            break;
                        }
                    }
                    if(t > -1)
                    {
                        //  if(t !== oCurRun.Content.length - 1)
                        {
                            nInsertPosition = k + 1;
                            oNewRun = oCurRun.Split2(t + 1, oElement, k);
                            /*oCurRunReviewType = oCurRun.GetReviewType();
                            if (!oCurRunReviewType) {
                                oNewRun.SetReviewTypeWithInfo(reviewtype_Common, oCurRun.ReviewInfo.Copy());
                            }*/
                        }
                        // else
                        // {}
                    }
                }
                else
                {
                    nInsertPosition = k + 1;
                }
                break;
            }
        }
        for(; k > -1; --k)
        {
            oChildElement = oElement.Content[k];
            if(oChildElement !== oFirstText.firstRun && oChildElement !== oFirstText)
            {
                if(!(oChildElement.IsParaEndRun && oChildElement.IsParaEndRun()))
                {

                    this.setReviewInfoRecursive(oChildElement, reviewtype_Add, true);
                }
            }
            else
            {
                if(oChildElement instanceof ParaRun)
                {
                    for(t = 0; t < oChildElement.Content.length; t++)
                    {
                        if(oChildElement.Content[t] === oFirstText.elements[0])
                        {
                            break;
                        }
                    }
                    t = Math.min(Math.max(t, 0), oChildElement.Content.length - 1);
                    if(t > 0)
                    {
                        oNewRun = oChildElement.Split2(t, oElement, k);
                        if(!(oNewRun.IsParaEndRun && oNewRun.IsParaEndRun()))
                        {
                            this.setReviewInfoRecursive(oNewRun, reviewtype_Add, true);
                        }
                        nInsertPosition++;
                    }
                    else
                    {

                        if(!(oChildElement.IsParaEndRun && oChildElement.IsParaEndRun()))
                        {
                            this.setReviewInfoRecursive(oChildElement, reviewtype_Add, true);
                        }
                    }
                }
                else
                {
                    this.setReviewInfoRecursive(oChildElement, reviewtype_Add, true);
                }
                break;
            }
        }
        if(nInsertPosition > -1)
        {
            for(t = aContentToInsert.length - 1; t > - 1; --t)
            {
                if(this.isElementForAdd(aContentToInsert[t]))
                {
                    oElement.AddToContent(nInsertPosition, aContentToInsert[t]);
                }
            }
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

    CDocumentMerge.prototype.getLargestCommonDocument = function (oOrigDocument, oRevisedDocument) {

        return oOrigDocument;
    }

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
        // var idOfRuns = Object.keys(this.insertIndexesMap).sort(function (a, b) {
        //     return parseFloat(a) - parseFloat(b);
        // });
        // var oThis = this;
        //
        // idOfRuns.forEach(function (idOfRun) {
        //     var oRun = g_oTableId.Get_ById(idOfRun);
        //
        //     var insertInfo = oThis.insertIndexesMap[idOfRun].contentForInsert;
        //     var groupedInsertInfo = oThis.groupByReviewType(insertInfo);
        //     for (var i = groupedInsertInfo.length - 1; i >= 0; i -= 1) {
        //         var infoForSplitRun = groupedInsertInfo[i];
        //         var splitRun = oRun.Split2(0, oRun.Parent, oRun.GetPosInParent());
        //         for (var j = 0; j < infoForSplitRun.length; j += 1) {
        //             var insertCharInfo = infoForSplitRun[j];
        //             var mergedChar = insertCharInfo.mergedChar;
        //             splitRun.AddToContent(j, mergedChar);
        //         }
        //         oThis.setReviewInfoRecursive(splitRun, infoForSplitRun[0].reviewType);
        //     }
        // });

        // for (var idOfRun in this.insertIndexesMap) {
        //     var oRun = g_oTableId.Get_ById(idOfRun);
        //
        //     var insertInfo = this.insertIndexesMap[idOfRun].contentForInsert;
        //     var groupedInsertInfo = this.groupByReviewType(insertInfo);
        //     for (var i = groupedInsertInfo.length - 1; i >= 0; i -= 1) {
        //         var infoForSplitRun = groupedInsertInfo[i];
        //         var splitRun = oRun.Split2(0, oRun.Parent, oRun.GetPosInParent());
        //         for (var j = 0; j < infoForSplitRun.length; j += 1) {
        //             var insertCharInfo = infoForSplitRun[j];
        //             var mergedChar = insertCharInfo.mergedChar;
        //             oRun.AddToContent(j, mergedChar);
        //         }
        //         this.setReviewInfoRecursive(oRun, infoForSplitRun[0].reviewType);
        //     }
        // }

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
                oRun = oRun.Split2(relativeIndex, oRun.Parent, oRun.GetPosInParent());
                deltaInsertIndex += relativeIndex;
                for (var j = 0; j < groupedTypesForInsert.length; j += 1) {
                    var groupedByTypeContent = groupedTypesForInsert[j];
                    var p = 0;
                    for (var k = 0; k < groupedByTypeContent.length; k += 1) {
                        var mergedChar = groupedByTypeContent[k].mergedChar;
                        if (mergedChar instanceof AscCommonWord.ParaEnd) {
                            var paragraph = oRun.Parent;
                            var parent = paragraph.Parent;
                            var parPos;
                            for (var t = 0; t < parent.Content.length; t += 1) {
                                if (parent.Content[t] === paragraph) {
                                    parPos = t;
                                    break;
                                }
                            }
                            var newPar = new Paragraph(parent.DrawingDocument, parent);
                            var pos = new AscCommonWord.CParagraphContentPos();
                            pos.Data[0] = oRun.GetPosInParent();
                            pos.Data[1] = k;
                            paragraph.Split(newPar, pos);
                        } else {
                            oRun.AddToContent(k - p, mergedChar);
                        }
                    }

                    var temp = oRun.Split2(k, oRun.Parent, oRun.GetPosInParent());
                    this.setReviewInfoRecursive(oRun, groupedByTypeContent[0].reviewType);
                    oRun = temp
                }

            }
        }
    };


    CDocumentMerge.prototype.applyChangesWithIterators = function (originalIterator, mergedIterator) {
        for (originalIterator; originalIterator.check(); originalIterator.next()) {
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


        var largestCommonDocument = this.getLargestCommonDocument(oOrigWithoutPrChanges, oRevisedWithoutChanges);


        var largestCommonDocumentIterator = new CDocumentIterator(largestCommonDocument);
        var firstDocumentWithChangesIterator = new CDocumentIterator(oOrigCopy);
        var secondDocumentWithChangesIterator = new CDocumentIterator(oRevisedCopy);

        // this.applyChangesWithIterators(largestCommonDocumentIterator, firstDocumentWithChangesIterator);
        // largestCommonDocumentIterator.reset();
        this.applyChangesWithIterators(largestCommonDocumentIterator, secondDocumentWithChangesIterator);

        this.applyMerge();
        oOriginalDocument.Recalculate();
        oOriginalDocument.UpdateInterface();
        oApi.sync_EndAction(Asc.c_oAscAsyncActionType.BlockInteraction, Asc.c_oAscAsyncAction.SlowOperation);
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
                if (checkElement instanceof Paragraph) {
                    this.concatParagraphsWithNext(checkElement);
                } else if (checkElement.GetReviewType && checkElement.GetReviewType()) {
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
            oMerge.merge2(); //TODO: change
        } else {
            AscCommon.pptx_content_loader.End_UseFullUrl();
        }
    }

    window['AscCommonWord'].CDocumentMerge = CDocumentMerge;
    window['AscCommonWord'].mergeBinary = mergeBinary;

})()