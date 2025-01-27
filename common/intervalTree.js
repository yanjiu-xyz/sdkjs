/*
 * (c) Copyright Ascensio System SIA 2010-2024
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
 * You can contact Ascensio System SIA at 20A-6 Ernesta Birznieka-Upish
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

"use strict";

(function(window) {
    // An augmented AVL Tree where each node maintains a list of records and their search intervals.
    // Record is composed of an interval and its underlying data, sent by a client. This allows the
    // interval tree to have the same interval inserted multiple times, as long its data is different.
    // Both insertion and deletion require O(log n) time. Searching requires O(k*logn) time, where `k`
    // is the number of intervals in the output list.
    var isSame = function shallowEqual(objA, objB, compare, compareContext) {
        var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

        if (ret !== void 0) {
            return !!ret;
        }

        if (objA === objB) {
            return true;
        }

        if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
            return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

        // Test for A's keys different from B.
        for (var idx = 0; idx < keysA.length; idx++) {
            var key = keysA[idx];

            if (!bHasOwnProperty(key)) {
                return false;
            }

            var valueA = objA[key];
            var valueB = objB[key];

            ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

            if (ret === false || (ret === void 0 && valueA !== valueB)) {
                return false;
            }
        }

        return true;
    };

    function height(node) {
        if (node === undefined) {
            return -1;
        }
        else {
            return node.height;
        }
    }
    var Node = /** @class */ (function () {
        function Node(intervalTree, record) {
            this.intervalTree = intervalTree;
            this.records = [];
            this.height = 0;
            this.key = record.low;
            this.max = record.high;
            // Save the array of all records with the same key for this node
            this.records.push(record);
        }
        // Gets the highest record.high value for this node
        Node.prototype.getNodeHigh = function () {
            var high = this.records[0].high;
            for (var i = 1; i < this.records.length; i++) {
                if (this.records[i].high > high) {
                    high = this.records[i].high;
                }
            }
            return high;
        };
        // Updates height value of the node. Called during insertion, rebalance, removal
        Node.prototype.updateHeight = function () {
            this.height = Math.max(height(this.left), height(this.right)) + 1;
        };
        // Updates the max value of all the parents after inserting into already existing node, as well as
        // removing the node completely or removing the record of an already existing node. Starts with
        // the parent of an affected node and bubbles up to root
        Node.prototype.updateMaxOfParents = function () {
            if (this === undefined) {
                return;
            }
            var thisHigh = this.getNodeHigh();
            if (this.left !== undefined && this.right !== undefined) {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(this.left.max, thisHigh);
            }
            else if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(this.right.max, thisHigh);
            }
            else {
                this.max = thisHigh;
            }
            if (this.parent) {
                this.parent.updateMaxOfParents();
            }
        };
        /*
        Left-Left case:
  
               z                                      y
              / \                                   /   \
             y   T4      Right Rotate (z)          x     z
            / \          - - - - - - - - ->       / \   / \
           x   T3                                T1 T2 T3 T4
          / \
        T1   T2
  
        Left-Right case:
  
             z                               z                           x
            / \                             / \                        /   \
           y   T4  Left Rotate (y)         x  T4  Right Rotate(z)     y     z
          / \      - - - - - - - - ->     / \      - - - - - - - ->  / \   / \
        T1   x                           y  T3                      T1 T2 T3 T4
            / \                         / \
          T2   T3                      T1 T2
        */
        // Handles Left-Left case and Left-Right case after rebalancing AVL tree
        Node.prototype._updateMaxAfterRightRotate = function () {
            var parent = this.parent;
            var left = parent.left;
            // Update max of left sibling (x in first case, y in second)
            var thisParentLeftHigh = left.getNodeHigh();
            if (left.left === undefined && left.right !== undefined) {
                left.max = Math.max(thisParentLeftHigh, left.right.max);
            }
            else if (left.left !== undefined && left.right === undefined) {
                left.max = Math.max(thisParentLeftHigh, left.left.max);
            }
            else if (left.left === undefined && left.right === undefined) {
                left.max = thisParentLeftHigh;
            }
            else {
                left.max = Math.max(Math.max(left.left.max, left.right.max), thisParentLeftHigh);
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(thisHigh, this.right.max);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(thisHigh, this.left.max);
            }
            else if (this.left === undefined && this.right === undefined) {
                this.max = thisHigh;
            }
            else {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(Math.max(parent.left.max, parent.right.max), parent.getNodeHigh());
        };
        /*
        Right-Right case:
  
          z                               y
         / \                            /   \
        T1  y     Left Rotate(z)       z     x
           / \   - - - - - - - ->     / \   / \
          T2  x                      T1 T2 T3 T4
             / \
            T3 T4
  
        Right-Left case:
  
           z                            z                            x
          / \                          / \                         /   \
         T1  y   Right Rotate (y)     T1  x      Left Rotate(z)   z     y
            / \  - - - - - - - - ->      / \   - - - - - - - ->  / \   / \
           x  T4                        T2  y                   T1 T2 T3 T4
          / \                              / \
        T2   T3                           T3 T4
        */
        // Handles Right-Right case and Right-Left case in rebalancing AVL tree
        Node.prototype._updateMaxAfterLeftRotate = function () {
            var parent = this.parent;
            var right = parent.right;
            // Update max of right sibling (x in first case, y in second)
            var thisParentRightHigh = right.getNodeHigh();
            if (right.left === undefined && right.right !== undefined) {
                right.max = Math.max(thisParentRightHigh, right.right.max);
            }
            else if (right.left !== undefined && right.right === undefined) {
                right.max = Math.max(thisParentRightHigh, right.left.max);
            }
            else if (right.left === undefined && right.right === undefined) {
                right.max = thisParentRightHigh;
            }
            else {
                right.max = Math.max(Math.max(right.left.max, right.right.max), thisParentRightHigh);
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(thisHigh, this.right.max);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(thisHigh, this.left.max);
            }
            else if (this.left === undefined && this.right === undefined) {
                this.max = thisHigh;
            }
            else {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(Math.max(parent.left.max, right.max), parent.getNodeHigh());
        };
        Node.prototype._leftRotate = function () {
            var rightChild = this.right;
            rightChild.parent = this.parent;
            if (rightChild.parent === undefined) {
                this.intervalTree.root = rightChild;
            }
            else {
                if (rightChild.parent.left === this) {
                    rightChild.parent.left = rightChild;
                }
                else if (rightChild.parent.right === this) {
                    rightChild.parent.right = rightChild;
                }
            }
            this.right = rightChild.left;
            if (this.right !== undefined) {
                this.right.parent = this;
            }
            rightChild.left = this;
            this.parent = rightChild;
            this.updateHeight();
            rightChild.updateHeight();
        };
        Node.prototype._rightRotate = function () {
            var leftChild = this.left;
            leftChild.parent = this.parent;
            if (leftChild.parent === undefined) {
                this.intervalTree.root = leftChild;
            }
            else {
                if (leftChild.parent.left === this) {
                    leftChild.parent.left = leftChild;
                }
                else if (leftChild.parent.right === this) {
                    leftChild.parent.right = leftChild;
                }
            }
            this.left = leftChild.right;
            if (this.left !== undefined) {
                this.left.parent = this;
            }
            leftChild.right = this;
            this.parent = leftChild;
            this.updateHeight();
            leftChild.updateHeight();
        };
        // Rebalances the tree if the height value between two nodes of the same parent is greater than
        // two. There are 4 cases that can happen which are outlined in the graphics above
        Node.prototype._rebalance = function () {
            if (height(this.left) >= 2 + height(this.right)) {
                var left = this.left;
                if (height(left.left) >= height(left.right)) {
                    // Left-Left case
                    this._rightRotate();
                    this._updateMaxAfterRightRotate();
                }
                else {
                    // Left-Right case
                    left._leftRotate();
                    this._rightRotate();
                    this._updateMaxAfterRightRotate();
                }
            }
            else if (height(this.right) >= 2 + height(this.left)) {
                var right = this.right;
                if (height(right.right) >= height(right.left)) {
                    // Right-Right case
                    this._leftRotate();
                    this._updateMaxAfterLeftRotate();
                }
                else {
                    // Right-Left case
                    right._rightRotate();
                    this._leftRotate();
                    this._updateMaxAfterLeftRotate();
                }
            }
        };
        Node.prototype.insert = function (record) {
            if (record.low < this.key) {
                // Insert into left subtree
                if (this.left === undefined) {
                    this.left = new Node(this.intervalTree, record);
                    this.left.parent = this;
                }
                else {
                    this.left.insert(record);
                }
            }
            else {
                // Insert into right subtree
                if (this.right === undefined) {
                    this.right = new Node(this.intervalTree, record);
                    this.right.parent = this;
                }
                else {
                    this.right.insert(record);
                }
            }
            // Update the max value of this ancestor if needed
            if (this.max < record.high) {
                this.max = record.high;
            }
            // Update height of each node
            this.updateHeight();
            // Rebalance the tree to ensure all operations are executed in O(logn) time. This is especially
            // important in searching, as the tree has a high chance of degenerating without the rebalancing
            this._rebalance();
        };
        Node.prototype._getOverlappingRecords = function (currentNode, low, high, output) {
            if (currentNode.key <= high && low <= currentNode.getNodeHigh()) {
                // Nodes are overlapping, check if individual records in the node are overlapping
                for (var i = 0; i < currentNode.records.length; i++) {
                    if (currentNode.records[i].high >= low) {
                        output.push(currentNode.records[i]);
                    }
                }
            }
        };
        Node.prototype.search = function (low, high, output) {
            // Don't search nodes that don't exist
            if (this === undefined) {
                return;
            }
            // If interval is to the right of the rightmost point of any interval in this node and all its
            // children, there won't be any matches
            if (low > this.max) {
                return;
            }
            // Search left children
            if (this.left !== undefined && this.left.max >= low) {
                this.left.search(low, high, output);
            }
            // Check this node
            this._getOverlappingRecords(this, low, high, output);
            // If interval is to the left of the start of this interval, then it can't be in any child to
            // the right
            if (high < this.key) {
                return;
            }
            // Otherwise, search right children
            if (this.right !== undefined) {
                this.right.search(low, high, output);
            }
        };
        // Searches for any overlapping node
        Node.prototype.searchAny = function(low, high) {
            // Don't search nodes that don't exist
            if (this === undefined) {
                return;
            }
            // If interval is to the right of the rightmost point of any interval in this node and all its
            // children, there won't be any matches
            if (low > this.max) {
                return;
            }
            if (this.key <= high) {
                // Nodes are overlapping, check if individual records in the node are overlapping
                for (var i = 0; i < this.records.length; i++) {
                    if (this.records[i].high >= low) {
                        return this.records[i];
                    }
                }
            }
            // Search left children
            if (this.left !== undefined && this.left.max >= low) {
                return this.left.searchAny(low, high);
            } else if (this.right !== undefined && this.key <= high) {
                return this.right.searchAny(low, high);
            }
        };
        // Searches for a node by a `key` value
        Node.prototype.searchExisting = function (low) {
            if (this === undefined) {
                return undefined;
            }
            if (this.key === low) {
                return this;
            }
            else if (low < this.key) {
                if (this.left !== undefined) {
                    return this.left.searchExisting(low);
                }
            }
            else {
                if (this.right !== undefined) {
                    return this.right.searchExisting(low);
                }
            }
            return undefined;
        };
        // Returns the smallest node of the subtree
        Node.prototype._minValue = function () {
            if (this.left === undefined) {
                return this;
            }
            else {
                return this.left._minValue();
            }
        };
        Node.prototype.remove = function (node) {
            var parent = this.parent;
            if (node.key < this.key) {
                // Node to be removed is on the left side
                if (this.left !== undefined) {
                    return this.left.remove(node);
                }
                else {
                    return undefined;
                }
            }
            else if (node.key > this.key) {
                // Node to be removed is on the right side
                if (this.right !== undefined) {
                    return this.right.remove(node);
                }
                else {
                    return undefined;
                }
            }
            else {
                if (this.left !== undefined && this.right !== undefined) {
                    // Node has two children
                    var minValue = this.right._minValue();
                    this.key = minValue.key;
                    this.records = minValue.records;
                    return this.right.remove(this);
                }
                else if (parent.left === this) {
                    // One child or no child case on left side
                    if (this.right !== undefined) {
                        parent.left = this.right;
                        this.right.parent = parent;
                    }
                    else {
                        parent.left = this.left;
                        if (this.left !== undefined) {
                            this.left.parent = parent;
                        }
                    }
                    parent.updateMaxOfParents();
                    parent.updateHeight();
                    parent._rebalance();
                    return this;
                }
                else if (parent.right === this) {
                    // One child or no child case on right side
                    if (this.right !== undefined) {
                        parent.right = this.right;
                        this.right.parent = parent;
                    }
                    else {
                        parent.right = this.left;
                        if (this.left !== undefined) {
                            this.left.parent = parent;
                        }
                    }
                    parent.updateMaxOfParents();
                    parent.updateHeight();
                    parent._rebalance();
                    return this;
                }
            }
        };
        return Node;
    }());
    var NodeWithId = /** @class */ (function () {
        function NodeWithId(intervalTree, record) {
            this.intervalTree = intervalTree;
            this.records = {};
            this.recordsCount = 0;
            this.height = 0;
            this.key = record.low;
            this.max = record.high;
            // Save the array of all records with the same key for this node
            this.records[record.id] = record;
            this.recordsCount = 1;
        }
        // Gets the highest record.high value for this node
        NodeWithId.prototype.getNodeHigh = function () {
            var high = Number.NEGATIVE_INFINITY;
            for (var i in this.records) {
                if (this.records.hasOwnProperty(i)) {
                    high = Math.max(high, this.records[i].high);
                }
            }
            return high;
        };
        // Updates height value of the node. Called during insertion, rebalance, removal
        NodeWithId.prototype.updateHeight = function () {
            this.height = Math.max(height(this.left), height(this.right)) + 1;
        };
        // Updates the max value of all the parents after inserting into already existing node, as well as
        // removing the node completely or removing the record of an already existing node. Starts with
        // the parent of an affected node and bubbles up to root
        NodeWithId.prototype.updateMaxOfParents = function () {
            if (this === undefined) {
                return;
            }
            var thisHigh = this.getNodeHigh();
            if (this.left !== undefined && this.right !== undefined) {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(this.left.max, thisHigh);
            }
            else if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(this.right.max, thisHigh);
            }
            else {
                this.max = thisHigh;
            }
            if (this.parent) {
                this.parent.updateMaxOfParents();
            }
        };
        /*
         Left-Left case:

         z                                      y
         / \                                   /   \
         y   T4      Right Rotate (z)          x     z
         / \          - - - - - - - - ->       / \   / \
         x   T3                                T1 T2 T3 T4
         / \
         T1   T2

         Left-Right case:

         z                               z                           x
         / \                             / \                        /   \
         y   T4  Left Rotate (y)         x  T4  Right Rotate(z)     y     z
         / \      - - - - - - - - ->     / \      - - - - - - - ->  / \   / \
         T1   x                           y  T3                      T1 T2 T3 T4
         / \                         / \
         T2   T3                      T1 T2
         */
        // Handles Left-Left case and Left-Right case after rebalancing AVL tree
        NodeWithId.prototype._updateMaxAfterRightRotate = function () {
            var parent = this.parent;
            var left = parent.left;
            // Update max of left sibling (x in first case, y in second)
            var thisParentLeftHigh = left.getNodeHigh();
            if (left.left === undefined && left.right !== undefined) {
                left.max = Math.max(thisParentLeftHigh, left.right.max);
            }
            else if (left.left !== undefined && left.right === undefined) {
                left.max = Math.max(thisParentLeftHigh, left.left.max);
            }
            else if (left.left === undefined && left.right === undefined) {
                left.max = thisParentLeftHigh;
            }
            else {
                left.max = Math.max(Math.max(left.left.max, left.right.max), thisParentLeftHigh);
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(thisHigh, this.right.max);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(thisHigh, this.left.max);
            }
            else if (this.left === undefined && this.right === undefined) {
                this.max = thisHigh;
            }
            else {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(Math.max(parent.left.max, parent.right.max), parent.getNodeHigh());
        };
        /*
         Right-Right case:

         z                               y
         / \                            /   \
         T1  y     Left Rotate(z)       z     x
         / \   - - - - - - - ->     / \   / \
         T2  x                      T1 T2 T3 T4
         / \
         T3 T4

         Right-Left case:

         z                            z                            x
         / \                          / \                         /   \
         T1  y   Right Rotate (y)     T1  x      Left Rotate(z)   z     y
         / \  - - - - - - - - ->      / \   - - - - - - - ->  / \   / \
         x  T4                        T2  y                   T1 T2 T3 T4
         / \                              / \
         T2   T3                           T3 T4
         */
        // Handles Right-Right case and Right-Left case in rebalancing AVL tree
        NodeWithId.prototype._updateMaxAfterLeftRotate = function () {
            var parent = this.parent;
            var right = parent.right;
            // Update max of right sibling (x in first case, y in second)
            var thisParentRightHigh = right.getNodeHigh();
            if (right.left === undefined && right.right !== undefined) {
                right.max = Math.max(thisParentRightHigh, right.right.max);
            }
            else if (right.left !== undefined && right.right === undefined) {
                right.max = Math.max(thisParentRightHigh, right.left.max);
            }
            else if (right.left === undefined && right.right === undefined) {
                right.max = thisParentRightHigh;
            }
            else {
                right.max = Math.max(Math.max(right.left.max, right.right.max), thisParentRightHigh);
            }
            // Update max of itself (z)
            var thisHigh = this.getNodeHigh();
            if (this.left === undefined && this.right !== undefined) {
                this.max = Math.max(thisHigh, this.right.max);
            }
            else if (this.left !== undefined && this.right === undefined) {
                this.max = Math.max(thisHigh, this.left.max);
            }
            else if (this.left === undefined && this.right === undefined) {
                this.max = thisHigh;
            }
            else {
                this.max = Math.max(Math.max(this.left.max, this.right.max), thisHigh);
            }
            // Update max of parent (y in first case, x in second)
            parent.max = Math.max(Math.max(parent.left.max, right.max), parent.getNodeHigh());
        };
        NodeWithId.prototype._leftRotate = function () {
            var rightChild = this.right;
            rightChild.parent = this.parent;
            if (rightChild.parent === undefined) {
                this.intervalTree.root = rightChild;
            }
            else {
                if (rightChild.parent.left === this) {
                    rightChild.parent.left = rightChild;
                }
                else if (rightChild.parent.right === this) {
                    rightChild.parent.right = rightChild;
                }
            }
            this.right = rightChild.left;
            if (this.right !== undefined) {
                this.right.parent = this;
            }
            rightChild.left = this;
            this.parent = rightChild;
            this.updateHeight();
            rightChild.updateHeight();
        };
        NodeWithId.prototype._rightRotate = function () {
            var leftChild = this.left;
            leftChild.parent = this.parent;
            if (leftChild.parent === undefined) {
                this.intervalTree.root = leftChild;
            }
            else {
                if (leftChild.parent.left === this) {
                    leftChild.parent.left = leftChild;
                }
                else if (leftChild.parent.right === this) {
                    leftChild.parent.right = leftChild;
                }
            }
            this.left = leftChild.right;
            if (this.left !== undefined) {
                this.left.parent = this;
            }
            leftChild.right = this;
            this.parent = leftChild;
            this.updateHeight();
            leftChild.updateHeight();
        };
        // Rebalances the tree if the height value between two nodes of the same parent is greater than
        // two. There are 4 cases that can happen which are outlined in the graphics above
        NodeWithId.prototype._rebalance = function () {
            if (height(this.left) >= 2 + height(this.right)) {
                var left = this.left;
                if (height(left.left) >= height(left.right)) {
                    // Left-Left case
                    this._rightRotate();
                    this._updateMaxAfterRightRotate();
                }
                else {
                    // Left-Right case
                    left._leftRotate();
                    this._rightRotate();
                    this._updateMaxAfterRightRotate();
                }
            }
            else if (height(this.right) >= 2 + height(this.left)) {
                var right = this.right;
                if (height(right.right) >= height(right.left)) {
                    // Right-Right case
                    this._leftRotate();
                    this._updateMaxAfterLeftRotate();
                }
                else {
                    // Right-Left case
                    right._rightRotate();
                    this._leftRotate();
                    this._updateMaxAfterLeftRotate();
                }
            }
        };
        NodeWithId.prototype.insert = function (record) {
            if (record.low < this.key) {
                // Insert into left subtree
                if (this.left === undefined) {
                    this.left = new NodeWithId(this.intervalTree, record);
                    this.left.parent = this;
                }
                else {
                    this.left.insert(record);
                }
            }
            else {
                // Insert into right subtree
                if (this.right === undefined) {
                    this.right = new NodeWithId(this.intervalTree, record);
                    this.right.parent = this;
                }
                else {
                    this.right.insert(record);
                }
            }
            // Update the max value of this ancestor if needed
            if (this.max < record.high) {
                this.max = record.high;
            }
            // Update height of each node
            this.updateHeight();
            // Rebalance the tree to ensure all operations are executed in O(logn) time. This is especially
            // important in searching, as the tree has a high chance of degenerating without the rebalancing
            this._rebalance();
        };
        NodeWithId.prototype._getOverlappingRecords = function (currentNode, low, high, output) {
            if (currentNode.key <= high && low <= currentNode.max) {
                // Nodes are overlapping, check if individual records in the node are overlapping
                for (var i in this.records) {
                    if (this.records.hasOwnProperty(i)) {
                        if (this.records[i].high >= low) {
                            output.push(this.records[i]);
                        }
                    }
                }
            }
        };
        NodeWithId.prototype.search = function (low, high, output) {
            // Don't search nodes that don't exist
            if (this === undefined) {
                return;
            }
            // If interval is to the right of the rightmost point of any interval in this node and all its
            // children, there won't be any matches
            if (low > this.max) {
                return;
            }
            // Search left children
            if (this.left !== undefined && this.left.max >= low) {
                this.left.search(low, high, output);
            }
            // Check this node
            this._getOverlappingRecords(this, low, high, output);
            // If interval is to the left of the start of this interval, then it can't be in any child to
            // the right
            if (high < this.key) {
                return;
            }
            // Otherwise, search right children
            if (this.right !== undefined) {
                this.right.search(low, high, output);
            }
        };
        // Searches for any overlapping node
        NodeWithId.prototype.searchAny = function(low, high) {
            // Don't search nodes that don't exist
            if (this === undefined) {
                return;
            }
            // If interval is to the right of the rightmost point of any interval in this node and all its
            // children, there won't be any matches
            if (low > this.max) {
                return;
            }
            if (this.key <= high) {
                // Nodes are overlapping, check if individual records in the node are overlapping
                for (var i in this.records) {
                    if (this.records.hasOwnProperty(i)) {
                        if (this.records[i].high >= low) {
                            return this.records[i];
                        }
                    }
                }
            }
            // Search left children
            if (this.left !== undefined && this.left.max >= low) {
                return this.left.searchAny(low, high);
            } else if (this.right !== undefined && this.key <= high) {
                return this.right.searchAny(low, high);
            }
        };
        // Searches for a node by a `key` value
        NodeWithId.prototype.searchExisting = function (low) {
            if (this === undefined) {
                return undefined;
            }
            if (this.key === low) {
                return this;
            }
            else if (low < this.key) {
                if (this.left !== undefined) {
                    return this.left.searchExisting(low);
                }
            }
            else {
                if (this.right !== undefined) {
                    return this.right.searchExisting(low);
                }
            }
            return undefined;
        };
        // Returns the smallest node of the subtree
        NodeWithId.prototype._minValue = function () {
            if (this.left === undefined) {
                return this;
            }
            else {
                return this.left._minValue();
            }
        };
        NodeWithId.prototype.remove = function (node) {
            var parent = this.parent;
            if (node.key < this.key) {
                // NodeWithId to be removed is on the left side
                if (this.left !== undefined) {
                    return this.left.remove(node);
                }
                else {
                    return undefined;
                }
            }
            else if (node.key > this.key) {
                // NodeWithId to be removed is on the right side
                if (this.right !== undefined) {
                    return this.right.remove(node);
                }
                else {
                    return undefined;
                }
            }
            else {
                if (this.left !== undefined && this.right !== undefined) {
                    // NodeWithId has two children
                    var minValue = this.right._minValue();
                    this.key = minValue.key;
                    this.records = minValue.records;
                    this.recordsCount = minValue.recordsCount;
                    return this.right.remove(this);
                }
                else if (parent.left === this) {
                    // One child or no child case on left side
                    if (this.right !== undefined) {
                        parent.left = this.right;
                        this.right.parent = parent;
                    }
                    else {
                        parent.left = this.left;
                        if (this.left !== undefined) {
                            this.left.parent = parent;
                        }
                    }
                    parent.updateMaxOfParents();
                    parent.updateHeight();
                    parent._rebalance();
                    return this;
                }
                else if (parent.right === this) {
                    // One child or no child case on right side
                    if (this.right !== undefined) {
                        parent.right = this.right;
                        this.right.parent = parent;
                    }
                    else {
                        parent.right = this.left;
                        if (this.left !== undefined) {
                            this.left.parent = parent;
                        }
                    }
                    parent.updateMaxOfParents();
                    parent.updateHeight();
                    parent._rebalance();
                    return this;
                }
            }
        };
        return NodeWithId;
    }());

    var IntervalTree = /** @class */ (function () {
        function IntervalTree() {
            this.count = 0;
        }
        IntervalTree.prototype.insert = function (record) {
            if (record.low > record.high) {
                throw new Error('`low` value must be lower or equal to `high` value');
            }
            if (this.root === undefined) {
                // Base case: Tree is empty, new node becomes root
                this.root = new Node(this, record);
                this.count++;
                return true;
            }
            else {
                // Otherwise, check if node already exists with the same key
                var node = this.root.searchExisting(record.low);
                if (node !== undefined) {
                    // Check the records in this node if there already is the one with same low, high, data
                    for (var i = 0; i < node.records.length; i++) {
                        if (isSame(node.records[i], record)) {
                            // This record is same as the one we're trying to insert; return false to indicate
                            // nothing has been inserted
                            return false;
                        }
                    }
                    // Add the record to the node
                    node.records.push(record);
                    // Update max of the node and its parents if necessary
                    if (record.high > node.max) {
                        node.max = record.high;
                        if (node.parent) {
                            node.parent.updateMaxOfParents();
                        }
                    }
                    this.count++;
                    return true;
                }
                else {
                    // Node with this key doesn't already exist. Call insert function on root's node
                    this.root.insert(record);
                    this.count++;
                    return true;
                }
            }
        };
        IntervalTree.prototype.search = function (low, high, opt_output) {
            if (!opt_output) {
                opt_output = [];
            }
            if (this.root !== undefined) {
                this.root.search(low, high, opt_output);
            }
            return opt_output;
        };
        IntervalTree.prototype.searchExisting = function (low, high) {
            if (this.root) {
                var node = this.root.searchExisting(low);
                if (node) {
                    for (var i = 0; i < node.records.length; i++) {
                        if (node.records[i].high === high) {
                            return node.records[i];
                        }
                    }
                }
            }
        };
        IntervalTree.prototype.searchAny = function (low, high) {
            if (this.root) {
                return  this.root.searchAny(low, high);
            }
        };
        IntervalTree.prototype.remove = function (record) {
            if (this.root === undefined) {
                // Tree is empty; nothing to remove
                return false;
            }
            else {
                var node = this.root.searchExisting(record.low);
                if (node === undefined) {
                    return false;
                }
                else if (node.records.length > 1) {
                    var removedRecord = void 0;
                    // Node with this key has 2 or more records. Find the one we need and remove it
                    for (var i = 0; i < node.records.length; i++) {
                        if (isSame(node.records[i], record)) {
                            removedRecord = node.records[i];
                            node.records.splice(i, 1);
                            break;
                        }
                    }
                    if (removedRecord) {
                        removedRecord = undefined;
                        // Update max of that node and its parents if necessary
                        if (record.high === node.max) {
                            var nodeHigh = node.getNodeHigh();
                            if (node.left !== undefined && node.right !== undefined) {
                                node.max = Math.max(Math.max(node.left.max, node.right.max), nodeHigh);
                            }
                            else if (node.left !== undefined && node.right === undefined) {
                                node.max = Math.max(node.left.max, nodeHigh);
                            }
                            else if (node.left === undefined && node.right !== undefined) {
                                node.max = Math.max(node.right.max, nodeHigh);
                            }
                            else {
                                node.max = nodeHigh;
                            }
                            if (node.parent) {
                                node.parent.updateMaxOfParents();
                            }
                        }
                        this.count--;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (node.records.length === 1) {
                    // Node with this key has only 1 record. Check if the remaining record in this node is
                    // actually the one we want to remove
                    if (isSame(node.records[0], record)) {
                        // The remaining record is the one we want to remove. Remove the whole node from the tree
                        if (this.root.key === node.key) {
                            // We're removing the root element. Create a dummy node that will temporarily take
                            // root's parent role
                            var rootParent = new Node(this, { low: record.low, high: record.low });
                            rootParent.left = this.root;
                            this.root.parent = rootParent;
                            var removedNode = this.root.remove(node);
                            this.root = rootParent.left;
                            if (this.root !== undefined) {
                                this.root.parent = undefined;
                            }
                            if (removedNode) {
                                removedNode = undefined;
                                this.count--;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            var removedNode = this.root.remove(node);
                            if (removedNode) {
                                removedNode = undefined;
                                this.count--;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else {
                        // The remaining record is not the one we want to remove
                        return false;
                    }
                }
                else {
                    // No records at all in this node?! Shouldn't happen
                    return false;
                }
            }
        };
        IntervalTree.prototype.inOrder = function () {
            return new InOrder(this.root);
        };
        IntervalTree.prototype.preOrder = function () {
            return new PreOrder(this.root);
        };
        return IntervalTree;
    }());

    var IntervalTreeWithId = /** @class */ (function () {
        function IntervalTreeWithId() {
            this.count = 0;
        }
        IntervalTreeWithId.prototype.insert = function (record) {
            if (record.low > record.high) {
                throw new Error('`low` value must be lower or equal to `high` value');
            }
            if (this.root === undefined) {
                // Base case: Tree is empty, new node becomes root
                this.root = new NodeWithId(this, record);
                this.count++;
                return true;
            }
            else {
                // Otherwise, check if node already exists with the same key
                var node = this.root.searchExisting(record.low);
                if (node !== undefined) {
                    // Check the records in this node if there already is the one with same low, high, data
                    if(node.records[record.id]) {
                        return false;
                    }
                    // Add the record to the node
                    node.records[record.id] = record;
                    node.recordsCount++;
                    // Update max of the node and its parents if necessary
                    if (record.high > node.max) {
                        node.max = record.high;
                        if (node.parent) {
                            node.parent.updateMaxOfParents();
                        }
                    }
                    this.count++;
                    return true;
                }
                else {
                    // Node with this key doesn't already exist. Call insert function on root's node
                    this.root.insert(record);
                    this.count++;
                    return true;
                }
            }
        };
        IntervalTreeWithId.prototype.search = function (low, high, opt_output) {
            if (!opt_output) {
                opt_output = [];
            }
            if (this.root !== undefined) {
                this.root.search(low, high, opt_output);
            }
            return opt_output;
        };
        IntervalTreeWithId.prototype.searchExisting = function (low, high) {
            if (this.root) {
                var node = this.root.searchExisting(low);
                if (node) {
                    for (var i in node.records) {
                        if (node.records.hasOwnProperty(i)) {
                            if (node.records[i].high === high) {
                                return node.records[i];
                            }
                        }
                    }
                }
            }
        };
        IntervalTreeWithId.prototype.searchAny = function (low, high) {
            if (this.root) {
                return  this.root.searchAny(low, high);
            }
        };
        IntervalTreeWithId.prototype.remove = function (record) {
            if (this.root === undefined) {
                // Tree is empty; nothing to remove
                return false;
            }
            else {
                var node = this.root.searchExisting(record.low);
                if (node === undefined) {
                    return false;
                }
                else if (node.recordsCount > 1) {
                    var removedRecord = void 0;
                    // Node with this key has 2 or more records. Find the one we need and remove it
                    if(node.records[record.id]) {
                        removedRecord = node.records[record.v];
                        delete node.records[record.id];
                        node.recordsCount--;
                    }
                    if (removedRecord) {
                        removedRecord = undefined;
                        // Update max of that node and its parents if necessary
                        if (record.high === node.max) {
                            var nodeHigh = node.getNodeHigh();
                            if (node.left !== undefined && node.right !== undefined) {
                                node.max = Math.max(Math.max(node.left.max, node.right.max), nodeHigh);
                            }
                            else if (node.left !== undefined && node.right === undefined) {
                                node.max = Math.max(node.left.max, nodeHigh);
                            }
                            else if (node.left === undefined && node.right !== undefined) {
                                node.max = Math.max(node.right.max, nodeHigh);
                            }
                            else {
                                node.max = nodeHigh;
                            }
                            if (node.parent) {
                                node.parent.updateMaxOfParents();
                            }
                        }
                        this.count--;
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (node.recordsCount === 1) {
                    // Node with this key has only 1 record. Check if the remaining record in this node is
                    // actually the one we want to remove
                    if (node.records[record.id]) {
                        // The remaining record is the one we want to remove. Remove the whole node from the tree
                        if (this.root.key === node.key) {
                            // We're removing the root element. Create a dummy node that will temporarily take
                            // root's parent role
                            var rootParent = new NodeWithId(this, { low: record.low, high: record.low });
                            rootParent.left = this.root;
                            this.root.parent = rootParent;
                            var removedNode = this.root.remove(node);
                            this.root = rootParent.left;
                            if (this.root !== undefined) {
                                this.root.parent = undefined;
                            }
                            if (removedNode) {
                                removedNode = undefined;
                                this.count--;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            var removedNode = this.root.remove(node);
                            if (removedNode) {
                                removedNode = undefined;
                                this.count--;
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else {
                        // The remaining record is not the one we want to remove
                        return false;
                    }
                }
                else {
                    // No records at all in this node?! Shouldn't happen
                    return false;
                }
            }
        };
        IntervalTreeWithId.prototype.inOrder = function () {
            return new InOrder(this.root);
        };
        IntervalTreeWithId.prototype.preOrder = function () {
            return new PreOrder(this.root);
        };
        return IntervalTreeWithId;
    }());

    var DataIntervalTree = /** @class */ (function () {
        function DataIntervalTree() {
            this.tree = new IntervalTree();
        }
        DataIntervalTree.prototype.insert = function (low, high, data) {
            return this.tree.insert({ low: low, high: high, data: data });
        };
        DataIntervalTree.prototype.remove = function (low, high, data) {
            return this.tree.remove({ low: low, high: high, data: data });
        };
        DataIntervalTree.prototype.searchNodes = function (low, high) {
            return this.tree.search(low, high);
        };
        DataIntervalTree.prototype.search = function (low, high) {
            return this.searchNodes(low, high).map(function (v) { return v.data; });
        };
        DataIntervalTree.prototype.searchExisting = function (low, high) {
            var record = this.tree.searchExisting(low, high);
            return record ? record.data : undefined;
        };
        DataIntervalTree.prototype.searchAny = function (low, high) {
            var record = this.tree.searchAny(low, high);
            return record ? record.data : undefined;
        };
        DataIntervalTree.prototype.inOrder = function () {
            return this.tree.inOrder();
        };
        DataIntervalTree.prototype.preOrder = function () {
            return this.tree.preOrder();
        };
        Object.defineProperty(DataIntervalTree.prototype, "count", {
            get: function () {
                return this.tree.count;
            },
            enumerable: true,
            configurable: true
        });
        return DataIntervalTree;
    }());
    var DataIntervalTreeWithId = /** @class */ (function () {
        function DataIntervalTree() {
            this.tree = new IntervalTreeWithId();
        }
        DataIntervalTree.prototype.insert = function (low, high, data, id) {
            return this.tree.insert({ low: low, high: high, data: data, id: id });
        };
        DataIntervalTree.prototype.remove = function (low, high, data, id) {
            return this.tree.remove({ low: low, high: high, data: data, id: id });
        };
        DataIntervalTree.prototype.searchNodes = function (low, high) {
            return this.tree.search(low, high);
        };
        DataIntervalTree.prototype.search = function (low, high) {
            return this.searchNodes(low, high).map(function (v) { return v.data; });
        };
        DataIntervalTree.prototype.searchExisting = function (low, high) {
            var record = this.tree.searchExisting(low, high);
            return record ? record.data : undefined;
        };
        DataIntervalTree.prototype.searchAny = function (low, high) {
            var record = this.tree.searchAny(low, high);
            return record ? record.data : undefined;
        };
        DataIntervalTree.prototype.inOrder = function () {
            return this.tree.inOrder();
        };
        DataIntervalTree.prototype.preOrder = function () {
            return this.tree.preOrder();
        };
        Object.defineProperty(DataIntervalTree.prototype, "count", {
            get: function () {
                return this.tree.count;
            },
            enumerable: true,
            configurable: true
        });
        return DataIntervalTree;
    }());
    var DataIntervalTree2D = /** @class */ (function () {
        function DataIntervalTree2D() {
            this.tree = new IntervalTree();
        }
        DataIntervalTree2D.prototype.insert = function(bbox, data) {
            var record = this.tree.searchExisting(bbox.r1, bbox.r2);
            if (!record) {
                record = {low: bbox.r1, high: bbox.r2, data: new IntervalTree()};
                this.tree.insert(record);
            }
            record.data.insert({low: bbox.c1, high: bbox.c2, data: data});
        };
        DataIntervalTree2D.prototype.remove = function(bbox, data) {
            var record = this.tree.searchExisting(bbox.r1, bbox.r2);
            if (record) {
                record.data.remove({low: bbox.c1, high: bbox.c2, data: data});
            }
        };
        DataIntervalTree2D.prototype.searchNodes = function(bbox) {
            var res = [];
            var records = this.tree.search(bbox.r1, bbox.r2);
            for (var i = 0; i < records.length; i++) {
                records[i].data.search(bbox.c1, bbox.c2, res);
            }
            return res;
        };
        DataIntervalTree2D.prototype.searchAny = function(bbox) {
            var any;
            var records = this.tree.search(bbox.r1, bbox.r2);
            for (var i = 0; i < records.length; i++) {
                any = records[i].data.searchAny(bbox.c1, bbox.c2);
                if (any) {
                    return any.data;
                }
            }
            return null;
        };
        return DataIntervalTree2D;
    }());

    var InOrder = /** @class */ (function () {
        function InOrder(startNode) {
            this.stack = [];
            if (startNode !== undefined) {
                this.push(startNode);
            }
        }
        InOrder.prototype.next = function () {
            // Will only happen if stack is empty and pop is called
            if (this.currentNode === undefined) {
                return {
                    done: true,
                    value: undefined,
                };
            }
            // Process this node
            if (this.i < this.currentNode.records.length) {
                return {
                    done: false,
                    value: this.currentNode.records[this.i++],
                };
            }
            if (this.currentNode.right !== undefined) {
                this.push(this.currentNode.right);
            }
            else {
                // Might pop the last and set this.currentNode = undefined
                this.pop();
            }
            return this.next();
        };
        InOrder.prototype.push = function (node) {
            this.currentNode = node;
            this.i = 0;
            while (this.currentNode.left !== undefined) {
                this.stack.push(this.currentNode);
                this.currentNode = this.currentNode.left;
            }
        };
        InOrder.prototype.pop = function () {
            this.currentNode = this.stack.pop();
            this.i = 0;
        };
        return InOrder;
    }());

    if (typeof Symbol === 'function') {
        InOrder.prototype[Symbol.iterator] = function () { return this; };
    }
    var PreOrder = /** @class */ (function () {
        function PreOrder(startNode) {
            this.stack = [];
            this.i = 0;
            this.currentNode = startNode;
        }
        PreOrder.prototype.next = function () {
            // Will only happen if stack is empty and pop is called,
            // which only happens if there is no right node (i.e we are done)
            if (this.currentNode === undefined) {
                return {
                    done: true,
                    value: undefined,
                };
            }
            // Process this node
            if (this.i < this.currentNode.records.length) {
                return {
                    done: false,
                    value: this.currentNode.records[this.i++],
                };
            }
            if (this.currentNode.right !== undefined) {
                this.push(this.currentNode.right);
            }
            if (this.currentNode.left !== undefined) {
                this.push(this.currentNode.left);
            }
            this.pop();
            return this.next();
        };
        PreOrder.prototype.push = function (node) {
            this.stack.push(node);
        };
        PreOrder.prototype.pop = function () {
            this.currentNode = this.stack.pop();
            this.i = 0;
        };
        return PreOrder;
    }());

    if (typeof Symbol === 'function') {
        PreOrder.prototype[Symbol.iterator] = function () { return this; };
    }
    //----------------------------------------------------------export----------------------------------------------------
    window['AscCommon'] = window['AscCommon'] || {};
    window['AscCommon'].DataIntervalTree = DataIntervalTree;
    window['AscCommon'].DataIntervalTreeWithId = DataIntervalTreeWithId;
    window['AscCommon'].DataIntervalTree2D = DataIntervalTree2D;

}(window));
