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

})()