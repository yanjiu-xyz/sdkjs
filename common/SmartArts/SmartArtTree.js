/*
 * (c) Copyright Ascensio System SIA 2010-2023
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

(function (window) {
	const LayoutNode = AscFormat.LayoutNode;
	const Choose = AscFormat.Choose;
	const If = AscFormat.If;
	const Else = AscFormat.Else;
	const Alg = AscFormat.Alg;
	const ForEach = AscFormat.ForEach;
	const Point = AscFormat.Point;
	const ConstrLst = AscFormat.ConstrLst;
	const SShape = AscFormat.SShape;
	const PresOf = AscFormat.PresOf;
	const RuleLst = AscFormat.RuleLst;
	const VarLst = AscFormat.VarLst;

	const algDelta = 1e-13;
	const bulletFontSizeCoefficient = 51 / 65;

	function createPresNode(presName, styleLbl, contentNode) {
		presName = presName || "";
		const point = new Point();
		point.setType(AscFormat.Point_type_pres);
		const prSet = new AscFormat.PrSet();
		prSet.setPresName(presName);
		prSet.setPresStyleLbl(styleLbl || "node1");

		point.setPrSet(prSet);
		return new PresNode(point, contentNode);
	}
	RuleLst.prototype.executeAlgorithm = function (smartartAlgorithm) {};

	VarLst.prototype.executeAlgorithm = function (smartartAlgorithm) {};

	PresOf.prototype.executeAlgorithm = function (smartartAlgorithm) {
		const currentPresNode = smartartAlgorithm.getCurrentPresNode();
		const nodes = this.getNodesArray(smartartAlgorithm);
		for (let i = 0; i < nodes.length; i++) {

			const node = nodes[i];
			currentPresNode.contentNodes.push(node);
		}
	};
	LayoutNode.prototype.executeAlgorithm = function (smartartAlgorithm) {
		const list = this.list;
		const parentPresNode = smartartAlgorithm.getCurrentPresNode();
		const curPresNode = smartartAlgorithm.getPresNode(this);
		smartartAlgorithm.addToColorCheck(curPresNode);
		parentPresNode.addChild(curPresNode);
		smartartAlgorithm.addCurrentPresNode(curPresNode);
		for (let i = 0; i < list.length; i += 1) {
			const element = this.list[i];
			element.executeAlgorithm(smartartAlgorithm);
		}
		smartartAlgorithm.removeCurrentPresNode(curPresNode);
	}

	Choose.prototype.executeAlgorithm = function (smartartAlgorithm) {
		for (let i = 0; i < this.if.length; i++) {
			if (this.if[i].executeAlgorithm(smartartAlgorithm)) {
				return;
			}
		}
		this.else.executeAlgorithm(smartartAlgorithm);
	};


	If.prototype.executeAlgorithm = function (smartartAlgorithm) {
		if (this.checkCondition(smartartAlgorithm)) {
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].executeAlgorithm(smartartAlgorithm);
			}
			return true;
		}
		return false;
	}

	If.prototype.checkCondition = function (smartArtAlgorithm) {
		const node = smartArtAlgorithm.getCurrentNode();
		const nodes = node.getNodesByAxis(this.axis);

		switch (this.func) {
			case AscFormat.If_func_cnt:
				return this.funcCnt(nodes);
			case AscFormat.If_func_depth:
				return this.funcDepth(nodes);
			case AscFormat.If_func_maxDepth:
				return this.funcMaxDepth(nodes);
			case AscFormat.If_func_pos:
				return this.funcPos(nodes);
			case AscFormat.If_func_posEven:
				return this.funcPosEven(nodes);
			case AscFormat.If_func_posOdd:
				return this.funcPosOdd(nodes);
			case AscFormat.If_func_revPos:
				return this.funcRevPos(nodes);
			case AscFormat.If_func_var:
				return this.funcVar(node);
			default:
				return false;
		}
	};
	If.prototype.funcVar = function (node) {
		const nodeVal = node.getFuncVarValue(this.arg);
		switch (this.op) {
			case AscFormat.If_op_equ: {
				return this.getConditionValue() === nodeVal;
			}
			default: {
				return false;
			}
		}
	}
	If.prototype.getConditionValue = function () {
		switch (this.arg) {
			case AscFormat.If_arg_dir: {
				return this.getConditionDirValue();
			}
			default:
				return this.val;
		}
	}
	If.prototype.getConditionDirValue = function () {
		switch (this.val) {
			case 'norm':
				return AscFormat.DiagramDirection_val_norm;
			case 'rev':
				return AscFormat.DiagramDirection_val_rev;
			default:
				break;
		}
	}
	ConstrLst.prototype.executeAlgorithm = function (smartartAlgorithm) {
		smartartAlgorithm.setConstraints(this.list);
	}

	Else.prototype.executeAlgorithm = function (smartartAlgorithm) {
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].executeAlgorithm(smartartAlgorithm);
		}
	}

	ForEach.prototype.executeAlgorithm = function (smartartAlgorithm) {
		const nodes = this.getNodesArray(smartartAlgorithm);
		for (let i = 0; i < nodes.length; i += 1) {
			const node = nodes[i];
			smartartAlgorithm.addCurrentNode(node);
			for (let j = 0; j < this.list.length; j++) {
				this.list[j].executeAlgorithm(smartartAlgorithm);
			}
			smartartAlgorithm.removeCurrentNode();
		}
	}

	Alg.prototype.getAlgorithm = function (smartartAlgorithm) {
		switch (this.getType()) {
			case AscFormat.Alg_type_snake: {
				const algorithm = new SnakeAlgorithm();
				algorithm.setParams(this.param);
				algorithm.setParentNode(smartartAlgorithm.getCurrentPresNode());
				return algorithm;
			}
			case AscFormat.Alg_type_tx: {
				const algorithm = new TextAlgorithm();
				algorithm.setParams(this.param);
				algorithm.setParentNode(smartartAlgorithm.getCurrentPresNode());
				return algorithm;
			}
			case AscFormat.Alg_type_sp: {
				const algorithm = new SpaceAlgorithm();
				algorithm.setParams(this.param);
				algorithm.setParentNode(smartartAlgorithm.getCurrentPresNode());
				return algorithm;
			}
			case AscFormat.Alg_type_composite: {
				const algorithm = new CompositeAlgorithm();
				algorithm.setParams(this.param);
				algorithm.setParentNode(smartartAlgorithm.getCurrentPresNode());
				return algorithm;
			}
			default: {
				break;
			}
		}
	};

	Alg.prototype.executeAlgorithm = function (smartartAlgorithm) {
		const node = smartartAlgorithm.getCurrentPresNode();
		node.setAlgorithm(this.getAlgorithm(smartartAlgorithm));
	}


	Point.prototype.getVariables = function () {
		const prSet = this.prSet;
		return prSet && prSet.getPresLayoutVars();
	}
	Point.prototype.getDirection = function () {
		const variables = this.getVariables();
		if (variables) {
			const dir = variables.getDir();
			if (dir) {
				return dir.getVal();
			}
		}
		return AscFormat.DiagramDirection_val_norm;
	}
	SShape.prototype.executeAlgorithm = function (smartartAlgoritm) {
		const presNode = smartartAlgoritm.getCurrentPresNode();
		presNode.layoutInfo.shape = this;
	}

	function SmartArtAlgorithm(smartart) {
		this.smartart = smartart;
		const relations = this.smartart.getRelationOfContent2();
		this.relations = relations.byConnections;
		this.customRelations = relations.custom;
		this.dataRoot = null;
		this.presRoot = null;
		this.nodesStack = [];
		this.presNodesStack = [];
		this.colorCheck = {};
		this.initDataTree();
	}

	SmartArtAlgorithm.prototype.addToColorCheck = function (presNode) {
		const styleLbl = presNode.getPresStyleLbl();
		if (styleLbl) {
			if (!this.colorCheck[styleLbl]) {
				this.colorCheck[styleLbl] = [];
			}
			this.colorCheck[styleLbl].push(presNode);
		}
	};
	SmartArtAlgorithm.prototype.applyColorsDef = function () {
		const colorsDef = this.smartart.getColorsDef();
		const styleLblsByName = colorsDef.styleLblByName;
		for (let styleLbl in this.colorCheck) {
			const colorStyleLbl = styleLblsByName[styleLbl];
			if (colorStyleLbl) {
				const presNodes = this.colorCheck[styleLbl];
				for (let i = 0; i < presNodes.length; i += 1) {
					const presNode = presNodes[i];
					const shape = presNode.shape;
					if (shape) {
						shape.setFill(colorStyleLbl.getShapeFill(i));
						shape.setLn(colorStyleLbl.getShapeLn(i));
					}
				}
			}
		}
	};

	SmartArtAlgorithm.prototype.initDataTree = function () {
		const dataModel = this.smartart.getDataModel().getDataModel();
		const mainSmartArtPoint = dataModel.getMainPoint();
		const treeRoot = new SmartArtDataNode(mainSmartArtPoint, null, 0);
		this.dataRoot = treeRoot;
		const elements = [treeRoot];

		while (elements.length) {
			const root = elements.shift();
			const rootChildDepth = root.depth + 1;
			let connectionChildren = this.relations[[AscFormat.Cxn_type_parOf]][root.getModelId()];
			if (connectionChildren) {
				for (let i = 0; i < connectionChildren.length; i += 1) {
					const connectionChild = connectionChildren[i];
					const contentPoint = connectionChild.point;
					const sibPoint = connectionChild.sibPoint;
					const parPoint = connectionChild.parPoint;
					const node = new SmartArtDataNode(contentPoint, rootChildDepth);
					node.setSibNode(new SmartArtSibDataNode(sibPoint, rootChildDepth));
					node.setParNode(new SmartArtParDataNode(parPoint, rootChildDepth));
					root.addChild(node);
					elements.push(node);
				}
			}
		}
	}

	SmartArtAlgorithm.prototype.getPresNode = function (layoutNode) {
		const currentNode = this.getCurrentNode();
		const currentPresNode = this.getCurrentPresNode();
		const presRelations = this.relations[AscFormat.Cxn_type_presOf];
		const presCustomRelations = this.customRelations.presParOfAssocId;
		const presChildParRelations = this.customRelations.presChildParOf;
		const presParRelations = this.relations[AscFormat.Cxn_type_presParOf];
		let presNode;
		if (!currentNode.presNode) {
			const nodeModelId = currentNode.getModelId();

			let presPoint = presRelations[nodeModelId] || presCustomRelations[nodeModelId];
			while (presPoint && presPoint.getPresName() !== layoutNode.name) {
				presPoint = presChildParRelations[presPoint.getModelId()];
			}
			if (presPoint) {
				presNode = new PresNode(presPoint, currentNode);
			} else {
				presNode = createPresNode(layoutNode.name, layoutNode.styleLbl, currentNode);
			}
			currentNode.setPresNode(presNode);
		} else {
			const children = presParRelations[currentPresNode.getModelId()];
			const child = children && children[currentPresNode.childs.length];
			if (child) {
				presNode = new PresNode(child, currentNode);
			} else {
				presNode = createPresNode(layoutNode.name, layoutNode.styleLbl, currentNode);
			}
		}
		return presNode;
	};

	SmartArtAlgorithm.prototype.addCurrentPresNode = function (presNode) {
		this.presNodesStack.push(presNode);
	}
	SmartArtAlgorithm.prototype.removeCurrentPresNode = function () {
		this.presNodesStack.pop();
	}
	SmartArtAlgorithm.prototype.getCurrentPresNode = function () {
		return this.presNodesStack[this.presNodesStack.length - 1];
	}
	SmartArtAlgorithm.prototype.getShapes = function () {

		const algorithm = this.presRoot.algorithm;
		return algorithm ? algorithm.getShapes(this) : [];
	}


	SmartArtAlgorithm.prototype.startFromBegin = function () {
		this.addCurrentNode(this.dataRoot);
		const mockPresNode = new PresNode();
		this.addCurrentPresNode(mockPresNode);

		const layout = this.smartart.getLayoutDef();
		const layoutNode = layout.getLayoutNode();
		layoutNode.executeAlgorithm(this);

		this.presRoot = mockPresNode.childs[0];
		this.presRoot.parent = null;
		this.presRoot.initRootConstraints(this.smartart);
		this.removeCurrentPresNode();
		this.removeCurrentNode();

		this.executeConstrs();
		this.executeAlgorithms();
	};

	SmartArtAlgorithm.prototype.executeConstrs = function () {
		this.forEachPresFromTop(function (presNode) {
			presNode.setConstraints();
		});
	};
	SmartArtAlgorithm.prototype.executeAlgorithms = function () {
		this.forEachPresFromBottom(function (presNode) {
			presNode.startAlgorithm();
		});
	};
	SmartArtAlgorithm.prototype.forEachPresFromBottom = function (callback) {
		const checkElements = [this.presRoot];
		while (checkElements.length) {
			const elem = checkElements.pop();
			if (elem.childs.length) {
				for (let i = 0; i < elem.childs.length; i += 1) {
					checkElements.push(elem.childs[i]);
				}
			} else {
				const callbackElements = [elem];
				while (callbackElements.length) {
					const elem = callbackElements.pop();
					callback(elem);
					const firstParentChild = elem.parent && elem.parent.childs[0];
					if (firstParentChild === elem) {
						callbackElements.push(elem.parent);
					}
				}
			}
		}
	};


	SmartArtAlgorithm.prototype.forEachPresFromTop = function (callback) {
		const elements = [this.presRoot];
		while (elements.length) {
			const element = elements.pop();
			callback(element);
			for (let i = 0; i < element.childs.length; i++) {
				elements.push(element.childs[i]);
			}
		}
	};


	SmartArtAlgorithm.prototype.getCurrentNode = function () {
		return this.nodesStack[this.nodesStack.length - 1];
	}
	SmartArtAlgorithm.prototype.addCurrentNode = function (node) {
		this.nodesStack.push(node);
	}

	SmartArtAlgorithm.prototype.removeCurrentNode = function () {
		this.nodesStack.pop();
	}

	SmartArtAlgorithm.prototype.setConstraints = function (constr) {
		const node = this.getCurrentPresNode();
		node.setLayoutConstraints(constr);
	}

	function SmartArtDataNodeBase(point, depth) {
		this.point = point;
		this.parent = null;
		this.presNode = null;
		this.childs = [];
		this.algorithm = null;
		this.cacheAlgorithm = null;
		this.depth = depth || null;
	}

	SmartArtDataNodeBase.prototype.getPtType = function () {
		return this.point.type;
	}

	SmartArtDataNodeBase.prototype.getNodesByAxis = function (nodes, axis, ptType, count) {
		nodes = nodes || [];
		switch (axis) {
			case AscFormat.AxisType_value_ch: {
				this.getNodesByCh(nodes, ptType, count);
				break;
			}
			case AscFormat.AxisType_value_self: {
				nodes.push(this);
				break;
			}
			case AscFormat.AxisType_value_followSib: {
				this.getNodesByFollowSib(nodes, ptType, count);
				break;
			}
			case AscFormat.AxisType_value_des: {
				this.getNodesByDescendant(nodes, ptType, count);
				break;
			}
			case AscFormat.AxisType_value_desOrSelf: {
				this.getNodesByAxis(nodes, AscFormat.AxisType_value_self, ptType, count);
				if (isMaxCount(nodes, count)) {
					break;
				}
				this.getNodesByAxis(nodes, AscFormat.AxisType_value_des, ptType, count);
				break;
			}
			default: {
				break;
			}
		}
		return nodes;
	}

	SmartArtDataNodeBase.prototype.getNodesByDescendant = function (nodes, ptType, count) {
		const elements = [].concat(this.childs);
		while (elements.length) {
			const child = elements.shift();
			const needNode = child.getNodeByPtType(ptType);
			if (needNode) {
				nodes.push(needNode);
			}
			if (isMaxCount(nodes, count)) {
				return;
			}
			for (let i = 0; i < child.childs.length; i++) {
				elements.push(child.childs[i]);
			}
		}
	};
	SmartArtDataNodeBase.prototype.getNodesByFollowSib = function (nodes, ptType, count) {
		const parent = this.parent;
		if (parent) {
			let bAdd = false;
			for (let i = 0; i < parent.childs.length; i++) {
				if (bAdd) {
					const needNode = parent.childs[i].getNodeByPtType(ptType);
					if (needNode) {
						nodes.push(needNode);
					}
				} else if (parent.childs[i] === this) {
					bAdd = true;
					if (ptType === AscFormat.ElementType_value_sibTrans) {
						const needNode = parent.childs[i].getNodeByPtType(ptType);
						if (needNode) {
							nodes.push(needNode);
						}
					}
				}
				if (isMaxCount(nodes, count)) {
					return;
				}
			}
		}
	};

	SmartArtDataNodeBase.prototype.getNodesByCh = function (nodes, ptType, count) {
		for (let i = 0; i < this.childs.length; i++) {
			const child = this.childs[i];
			const needNode = child.getNodeByPtType(ptType);
			if (needNode) {
				nodes.push(needNode);
			}
			if (isMaxCount(nodes, count)) {
				return;
			}
		}
	};

	function isMaxCount(array, count) {
		if (AscFormat.isRealNumber(count)) {
			return array.length >= count;
		}

		return false;
	}

	SmartArtDataNodeBase.prototype.addChild = function (child, position) {
		position = AscFormat.isRealNumber(position) ? position : this.childs.length;
		this.childs.splice(position, 0, child);
		child.setParent(this);
	};
	SmartArtDataNodeBase.prototype.removeChilds = function (position, count) {
		this.childs.splice(position, count);
	};
	SmartArtDataNodeBase.prototype.setParent = function (parent) {
		this.parent = parent;
	};
	SmartArtDataNodeBase.prototype.setPresNode = function (presNode) {
		this.presNode = presNode;
	};

	SmartArtDataNodeBase.prototype.getModelId = function () {
		return this.point.getModelId();
	};
	SmartArtDataNodeBase.prototype.isRoot = function () {
		return this.point.getType() === AscFormat.Point_type_doc;
	};
	SmartArtDataNodeBase.prototype.isContentNode = function () {
		return false;
	};
	SmartArtDataNodeBase.prototype.isSibNode = function () {
		return false;
	};
	SmartArtDataNodeBase.prototype.isParNode = function () {
		return false;
	};

	function SmartArtSibDataNode(mainPoint, depth) {
		SmartArtDataNodeBase.call(this, mainPoint, depth);
	}
	AscFormat.InitClassWithoutType(SmartArtSibDataNode, SmartArtDataNodeBase);
	SmartArtSibDataNode.prototype.isSibNode = function () {
		return true;
	};
	SmartArtSibDataNode.prototype.getNodeByPtType = function (elementTypeValue) {
		switch (elementTypeValue) {
			case AscFormat.ElementType_value_sibTrans:
				return this;
			case AscFormat.ElementType_value_node:
				return this;
			default:
				return this;
		}
	}

	function SmartArtParDataNode(mainPoint, depth) {
		SmartArtDataNodeBase.call(this, mainPoint, depth);
	}
	AscFormat.InitClassWithoutType(SmartArtParDataNode, SmartArtDataNodeBase);
	SmartArtParDataNode.prototype.isParNode = function () {
		return true;
	};

	function SmartArtDataNode(mainPoint, depth) {
		SmartArtDataNodeBase.call(this, mainPoint, depth);
		this.sibNode = null;
		this.parNode = null;
	}
	AscFormat.InitClassWithoutType(SmartArtDataNode, SmartArtDataNodeBase);


	SmartArtDataNode.prototype.isContentNode = function () {
		return true;
	};

	SmartArtDataNode.prototype.setSibNode = function (node) {
		this.sibNode = node;
		node.setParent(this);
	};

	SmartArtDataNode.prototype.setParNode = function (node) {
		this.parNode = node;
		node.setParent(this);
	};

	SmartArtDataNode.prototype.getNodeByPtType = function (elementTypeValue) {
		switch (elementTypeValue) {
			case AscFormat.ElementType_value_sibTrans:
				return this.sibNode;
			case AscFormat.ElementType_value_node:
				return this;
			default:
				return this;
		}
	}

	SmartArtDataNode.prototype.getPresName = function () {
		return this.presNode && this.presNode.getPresName();
	};
	SmartArtDataNode.prototype.getSibName = function () {
		return this.sibNode.getPresName();
	};
	SmartArtDataNode.prototype.getParName = function () {
		return this.parNode.getPresName();
	};

	SmartArtDataNode.prototype.getPointType = function () {
		return this.point.getType();
	}

	SmartArtDataNode.prototype.getDirection = function () {
		return this.presNode && this.presNode.getDirection();
	}

	SmartArtDataNode.prototype.getFuncVarValue = function (type) {
		switch (type) {
			case AscFormat.If_arg_dir:
				return this.getDirection();
		}
	}


	SmartArtDataNode.prototype.checkName = function (name) {
		switch (name) {
			case this.getPresName():
				return this;
			case this.getSibName():
				return this.sibNode;
			case this.getParName():
				return this.parNode;
			default:
				return null;
		}
	}


	SmartArtDataNode.prototype.getPrSet = function () {
		return this.presNode && this.presNode.getPrSet();
	}

	function ShadowShape(node) {
		this.w = 0;
		this.h = 0;
		this.x = 0;
		this.y = 0;
		this.rot = 0;
		this.type = AscFormat.LayoutShapeType_outputShapeType_none;
		this.node = node;
		this.ln = null;
		this.fill = null;
		this.isSpacing = true;
		this.shape = null;
		this.calcInfo = null;
	}
	ShadowShape.prototype.setCalcInfo = function () {
		this.calcInfo = {
			isChecked: false
		};
	};
	ShadowShape.prototype.changeSize = function (coefficient) {
		this.x *= coefficient;
		this.y *= coefficient;
		this.h *= coefficient;
		this.w *= coefficient;
	}
	ShadowShape.prototype.initFromShape = function (shape) {
		this.shape = shape;
		if (!shape.hideGeom) {
			this.type = shape.type;
			this.isSpacing = this.type === AscFormat.LayoutShapeType_outputShapeType_none;
		}
		const widthCoef = this.node.getWidthScale();
		const heightCoef = this.node.getHeightScale();
		this.x = this.node.getConstr(AscFormat.Constr_type_l) * heightCoef;
		this.y = this.node.getConstr(AscFormat.Constr_type_t) * heightCoef;
		this.w = this.node.getConstr(AscFormat.Constr_type_w) * widthCoef;
		this.h = this.node.getConstr(AscFormat.Constr_type_h) * heightCoef;

		this.cleanParams = {
			w: this.node.getConstr(AscFormat.Constr_type_w),
			h: this.node.getConstr(AscFormat.Constr_type_h)
		};
	}

	ShadowShape.prototype.setFill = function (fill) {
		this.fill = fill;
	};

	ShadowShape.prototype.setLn = function (ln) {
		this.ln = ln;
	}

	ShadowShape.prototype.getEditorShape = function () {
		const shapeType = this.getEditorShapeType();
		if (typeof shapeType !== 'string') {
			return null;
		}
		const initObjects = AscFormat.CShape.getInitObjects();
		const parentObjects = initObjects.parentObjects;
		if (!parentObjects) {
			return null;
		}

		const shapeTrack = new AscFormat.NewShapeTrack(this.getEditorShapeType(), this.x, this.y, AscFormat.GetDefaultTheme(), parentObjects.theme, parentObjects.master, parentObjects.layout, parentObjects.slide, initObjects.page);
		shapeTrack.track({}, this.x + this.w, this.y + this.h);
		const shape = shapeTrack.getShape(false, initObjects.drawingDocument, null);
		shape.setBDeleted(false);
		shape.setParent(initObjects.parent);
		shape.setWorksheet(initObjects.worksheet);

		this.applyAdjLst(shape);
		this.applyPostEditorSettings(shape);
		return shape;
	}
	ShadowShape.prototype.applyAdjLst = function (editorShape) {
		const adjLst = this.shape.adjLst;
		if (adjLst) {
			const geometry = editorShape.spPr.geometry;
			for (let i = 0; i < adjLst.list.length; i += 1) {
				const adj = adjLst.list[i];
				const adjName = "adj" + adj.idx;
				if (geometry.avLst[adjName]) {
					geometry.AddAdj(adjName, 0, adj.val * 100000);
				}
			}
		}

	}
	ShadowShape.prototype.applyPostEditorSettings = function (editorShape) {
		const shapeSmartArtInfo = new AscFormat.ShapeSmartArtInfo();
		const presNode = this.node;
		shapeSmartArtInfo.setShapePoint(presNode.presPoint);
		editorShape.setShapeSmartArtInfo(shapeSmartArtInfo);
		let sumRot = this.rot;
		const prSet = presNode.getPrSet();
		if (prSet) {
			if (prSet.custAng) {
				sumRot += prSet.custAng;
			}
		}
		editorShape.spPr.xfrm.setRot(AscFormat.normalizeRotate(sumRot));

		let shapeContent;
		if (presNode.contentNodes.length) {
			editorShape.createTextBody();
			shapeContent = editorShape.txBody.content;
		}

		const arrParagraphs = [];
		let nBulletLevel = 0;
		let nIncreaseLevel = 0;
		let firstDepth = 0;
		let maxDepth = 0;
		for (let i = 0; i < presNode.contentNodes.length; i += 1) {
			const contentNode = presNode.contentNodes[i];
			const mainPoint = contentNode.point;
			if (contentNode.point) {
				shapeSmartArtInfo.addToLstContentPoint(i, contentNode.point);
				const dataContent = mainPoint.t && mainPoint.t.content;
				if (dataContent) {
					const firstParagraph = dataContent.Content[0];
					if (firstParagraph) {
						//todo
						const copyParagraph = firstParagraph.Copy(shapeContent, shapeContent.DrawingDocument);
						if (i === 0) {
							firstDepth = contentNode.depth;
						} else {
							const oBullet = AscFormat.fGetPresentationBulletByNumInfo({Type: 0, SubType: 0});
							copyParagraph.Add_PresentationNumbering(oBullet);
							copyParagraph.Set_PresentationLevel(nBulletLevel);
							nBulletLevel = Math.max(nBulletLevel + 1, 8);
							const deltaDepth = contentNode.depth - firstDepth;
							copyParagraph.Set_Ind({Left: 7.9 * (contentNode.depth - firstDepth), FirstLine: -7.9}, false);
							if (deltaDepth > maxDepth) {
								maxDepth = deltaDepth;
							}
						}
						copyParagraph.Set_Spacing({After : 0, Line : 0.9, LineRule : Asc.linerule_Auto}, false);
						arrParagraphs.push(copyParagraph);
						for (let j = 1; j < dataContent.Content.length; j += 1) {
							const paragraph = dataContent.Content[j];
							const copyCurrentParagraph = paragraph.Copy();
							if (copyParagraph.Pr.Ind) {
								copyCurrentParagraph.Set_Ind({Left: copyParagraph.Pr.Ind.Left}, false);

							}
							if (copyParagraph.Pr.Spacing) {
								copyCurrentParagraph.Set_Spacing(copyParagraph.Pr.Spacing, false);
							}
							arrParagraphs.push(copyCurrentParagraph);
						}
					}
				}
				nIncreaseLevel += 1;
			}
		}
		this.maxDepth = maxDepth;
		if (arrParagraphs.length) {
			shapeContent.Internal_Content_RemoveAll();
			for (let i = 0; i < arrParagraphs.length; i++) {
				shapeContent.AddToContent(shapeContent.Content.length, arrParagraphs[i]);
			}
		}

		if (shapeSmartArtInfo.contentPoint.length) {
			this.applyTextSettings(editorShape);
		}
		if (this.fill) {
			editorShape.spPr.setFill(this.fill);
		}
		if (this.ln) {
			editorShape.spPr.setLn(this.ln);
		}
	}

	ShadowShape.prototype.applyTextSettings = function (editorShape) {
		const txXfrm = new AscFormat.CXfrm();
		const xfrm = editorShape.spPr.xfrm;
		txXfrm.setOffX(xfrm.offX);
		txXfrm.setOffY(xfrm.offY);
		txXfrm.setExtX(xfrm.extX);
		txXfrm.setExtY(xfrm.extY);
		editorShape.setTxXfrm(txXfrm);


		const bodyPr = new AscFormat.CBodyPr();
		editorShape.txBody.setBodyPr(bodyPr);
		if (this.maxDepth > 0) {
			bodyPr.setAnchor(AscFormat.VERTICAL_ANCHOR_TYPE_TOP);
			editorShape.txBody.content.SetParagraphAlign(AscCommon.align_Left);
		} else {
			bodyPr.setAnchor(AscFormat.VERTICAL_ANCHOR_TYPE_CENTER);
			editorShape.txBody.content.SetParagraphAlign(AscCommon.align_Center);
		}
	};

	ShadowShape.prototype.getEditorShapeType = function () {
		if (this.type !== AscFormat.LayoutShapeType_outputShapeType_none && this.type !== AscFormat.LayoutShapeType_outputShapeType_conn) {
			return AscCommon.To_XML_ST_LayoutShapeType(this.type);
		}
	};


	function BaseAlgorithm() {
		this.params = {};
		this.nodes = [];
		this.parentNode = null;
	}
	BaseAlgorithm.prototype.afterShape = function (smartartAlgorithm) {};
	BaseAlgorithm.prototype.afterLayoutNode = function (smartartAlgorithm) {};
	BaseAlgorithm.prototype.setParams = function (params) {
		this.initParams(params);
	};
	BaseAlgorithm.prototype.initParams = function (params) {
		for (let i = 0; i < params.length; i++) {
			const param = params[i];
			this.params[param.type] = param.getValEnum();
		}
	};
	BaseAlgorithm.prototype.getAspectRatio = function () {
		return this.params[AscFormat.Param_type_ar] || 0;
	}


	BaseAlgorithm.prototype.setParentNode = function (node) {
		this.parentNode = node;
	};


	function SnakeAlgorithm() {
		BaseAlgorithm.call(this);
		this.calcValues = {
			rowCount   : 0,
			columnCount: 0,
			coefficient: 1
		};
		this.rows = null;
	}

	AscFormat.InitClassWithoutType(SnakeAlgorithm, BaseAlgorithm);
	SnakeAlgorithm.prototype.initParams = function (params) {
		BaseAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_flowDir] === undefined) {
			this.params[AscFormat.Param_type_flowDir] = AscFormat.ParameterVal_flowDirection_row;
		}
		if (this.params[AscFormat.Param_type_grDir] === undefined) {
			this.params[AscFormat.Param_type_grDir] = AscFormat.ParameterVal_growDirection_tL;
		}
	};
	SnakeAlgorithm.prototype.getShapes = function (smartartAlgorithm) {
		smartartAlgorithm.applyColorsDef();
		const shapes = [];
		if (this.rows) {
			for (let i = 0; i < this.rows.rows.length; i += 1) {
				const row = this.rows.rows[i];
				for (let j = 0; j < row.row.length; j += 1) {
					const shShape = row.row[j];
					const node = shShape.node;
					const nodes = [node];
					while (nodes.length) {
						const shapeNode = nodes.pop();
						const shadowShape = shapeNode.shape;
						if (shadowShape) {
							const editorShape = shadowShape.getEditorShape();
							if (editorShape) {
								shapes.push(editorShape);
							}
						}
						for (let k = shapeNode.childs.length - 1; k >= 0; k -= 1) {
							nodes.push(shapeNode.childs[k]);
						}
					}
				}
			}
		}
		return shapes;
	}
	SnakeAlgorithm.prototype.getStartValues = function (node) {
		const oRes = {coefficient: 1, width: 0, height: 0, prSpace: 0};
		if (node) {
			const nodeConstraints = this.getNodeConstraints(node);
			oRes.height = nodeConstraints.height;
			oRes.width = nodeConstraints.width;

			const parentConstraints = this.getNodeConstraints(this.parentNode);
			const smWidth = parentConstraints.width;
			const smHeight = parentConstraints.height;

			const widthKoef = smWidth / oRes.width;
			const heightKoef = smHeight / oRes.height;
			oRes.coefficient = Math.min(1, widthKoef, heightKoef);
		}
		return oRes;
	};
	SnakeAlgorithm.prototype.getNodeConstraints = function (node) {
		const oRes = {width: 0, height: 0};
		if (node.shape) {
			oRes.width = node.shape.w;
			oRes.height = node.shape.h;
		} else {
			const widthScale = node.getWidthScale();
			const heightScale = node.getHeightScale();
			oRes.width = node.getConstr(AscFormat.Constr_type_w) * widthScale;
			oRes.height = node.getConstr(AscFormat.Constr_type_h) * heightScale;
		}
		return oRes;
	}

	SnakeAlgorithm.prototype.initRowCalcValues = function () {
		const oThis = this;

		const root = this.parentNode;
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const parentHeight = parentConstraints.height;
		const spaceConstr = this.parentNode.getConstr(AscFormat.Constr_type_sp);
		const initValues = this.getStartValues(this.nodes[0]);
		let coefficient = initValues.coefficient;
		let i = 1;
		let nNeedRecalc = 0;
		function calculateAdaptCoefficient() {
			let prSpaceWidth = 0;
			let previousRowHeight = 0;
			let columnWidth = initValues.width;
			let rowHeight = initValues.height;
			let previousRowSpace = 0;
			for (i; i < root.childs.length; i++) {
				const child = root.childs[i];
				if (child.node.isSibNode()) {
					const sibConstraints = oThis.getNodeConstraints(child);
					prSpaceWidth = sibConstraints.width;
				} else {
					const nodeConstraints = oThis.getNodeConstraints(child);
					const nodeWidth = nodeConstraints.width;
					const nodeHeight = nodeConstraints.height;

					const sumWidth = columnWidth + nodeWidth + prSpaceWidth;
					const sumHeight = rowHeight + nodeHeight + spaceConstr;

					const updatePreviousRowHeight = previousRowHeight + nodeHeight + previousRowSpace;


					let widthCoefficient = 1;
					let heightCoefficient = 1;
					widthCoefficient = parentWidth / sumWidth;
					heightCoefficient = parentHeight / sumHeight;
					const tempCoefficient = Math.min(coefficient, Math.max(widthCoefficient, heightCoefficient));
					const nodeWidthCoefficient = parentWidth / nodeWidth;
					const nodeHeightCoefficient = parentHeight / updatePreviousRowHeight;
					let addToWidth = false;


					if ((heightCoefficient < 1) && (heightCoefficient > widthCoefficient) && (nodeWidthCoefficient < tempCoefficient)) {
						coefficient = Math.min(coefficient, /*nodeWidthCoefficient,*/ nodeWidthCoefficient);
						addToWidth = true;
					} else if ((updatePreviousRowHeight > rowHeight) && (widthCoefficient < 1) && (widthCoefficient > nodeHeightCoefficient) && (nodeHeightCoefficient < tempCoefficient)) {
						if (previousRowHeight > nodeHeight || nNeedRecalc >= i) {
							coefficient = Math.min(coefficient, nodeHeightCoefficient);
						} else {
							coefficient = Math.min(coefficient, parentHeight / nodeHeight);
						}
					} else {
						addToWidth = widthCoefficient >= tempCoefficient;
						coefficient = tempCoefficient;

					}
					if (addToWidth) {
						columnWidth = sumWidth;
						rowHeight = Math.max(rowHeight, updatePreviousRowHeight);
						// todo need optimize
						if (nNeedRecalc < i) {
							return true
						}
					} else {
						previousRowSpace = spaceConstr;
						previousRowHeight = rowHeight;
						rowHeight = sumHeight;
						columnWidth = nodeWidth;
					}
				}
			}
			return false;
		}

		while (calculateAdaptCoefficient()) {
			nNeedRecalc = i;
			i = 1;
		}
		this.calcValues.coefficient = coefficient;
	};

	SnakeAlgorithm.prototype.getScaledShape = function (node) {
		const coefficient = this.calcValues.coefficient;
		node.changeShapeSizes(coefficient);
		return node.shape;
	}
	SnakeAlgorithm.prototype.getScaledShapes = function () {
		const shapes = [];
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			const shShape = this.getScaledShape(node);
			if (shShape) {
				shapes.push(shShape);
			}
		}
		return shapes;
	}
	SnakeAlgorithm.prototype.afterLayoutNode = function () {
		this.nodes = this.parentNode.childs.slice();
		if (this.nodes[this.nodes.length - 1].node.isSibNode()) {
			this.nodes.pop();
		}
		switch (this.params[AscFormat.Param_type_flowDir]) {
			case AscFormat.ParameterVal_flowDirection_row:
			default: {
				switch (this.params[AscFormat.Param_type_grDir]) {
					case AscFormat.ParameterVal_growDirection_tL:
					default:
						this.calculateRowSnake();
						break;
				}
				break;
			}
		}
	}
	SnakeAlgorithm.prototype.calculateRowSnake = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		this.initRowCalcValues();
		const constrSpace = this.parentNode.getConstr(AscFormat.Constr_type_sp) * this.calcValues.coefficient;
		const rows = new ShapeRows();
		let row = new ShapeRow();
		rows.push(row);

		const shapes = this.getScaledShapes();
		for (let shapeIndex = 0; shapeIndex < shapes.length; shapeIndex += 1) {
			const shShape = shapes[shapeIndex];
			shShape.setCalcInfo();
			if ((row.width + shShape.w > parentWidth) && !AscFormat.fApproxEqual(row.width + shShape.w, parentWidth, algDelta)) {
				let checkShape;
				if (!shShape.isSpacing) {
					checkShape = row.row[row.row.length - 1];
				} else {
					checkShape = shShape;
				}

				if (checkShape && checkShape.isSpacing && !checkShape.calcInfo.isChecked) {
					checkShape.calcInfo.isChecked = true;
					if ((shapeIndex === shapes.length - 1) && checkShape === shShape) {
						checkShape.h = 0;
					} else {
						row.height += constrSpace;
						checkShape.h = row.height;
					}
					if (checkShape !== shShape) {
						row.width -= checkShape.w;
					}
					checkShape.w = 0;
				}

				if (!shShape.isSpacing) {
					shShape.x = 0;
					shShape.y = row.y + row.height;
					row = new ShapeRow();
					rows.push(row);
					row.y = shShape.y;
				}


			} else {
				shShape.x = row.width;
				shShape.y = row.y;
			}
			row.push(shShape);

			row.width += shShape.w;
			if (row.height < shShape.h) {
				row.height = shShape.h;
				row.cleanHeight = shShape.h;
			}
		}
		rows.calcMetrics();
		this.rows = rows;

		rows.forEachShape(function (shape) {
			const node = shape.node;
			node.forEachDes(function (node) {
				const parentNode = node.parent;
				const parentShape = parentNode.shape;
				const shape = node.shape;
				if (parentShape && shape) {
					shape.x += parentShape.x;
					shape.y += parentShape.y;
				}
			});
		});
		this.applyOffsets();
		this.applyPostAlgorithmSettings();
	};
	SnakeAlgorithm.prototype.applyOffsets = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const parentHeight = parentConstraints.height;
		switch (this.params[AscFormat.Param_type_off]) {
			case AscFormat.ParameterVal_offset_ctr:
				this.rows.applyCenterAlign(parentHeight, parentWidth);
				break;
			default:
				break;
		}
		const oThis = this;
		this.rows.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			oThis.applyAligns(node);
		});

	}
	SnakeAlgorithm.prototype.applyAligns = function (presNode) {
		const shape = presNode.shape;
		const cleanParams = shape.cleanParams;
		const cleanW = cleanParams.w * this.calcValues.coefficient;
		const cleanH = cleanParams.h * this.calcValues.coefficient;

		let parentOffX = 0;
		let parentOffY = 0;
		switch (this.params[AscFormat.Param_type_horzAlign]) {
			case AscFormat.ParameterVal_diagramHorizontalAlignment_ctr: {
				parentOffX = (shape.w - cleanW) / 2;
				break;
			}
			default:
				break;
		}

		switch (this.params[AscFormat.Param_type_vertAlign]) {
			case AscFormat.ParameterVal_verticalAlignment_mid: {
				parentOffY = (shape.h - cleanH) / 2;
				break;
			}
			default:
				break;
		}
		presNode.forEachDes(function (chNode) {
			const parNode = chNode.parent;
			let parentRightEdge = 0;
			let parentBottomEdge = 0;
			if (parNode && parNode.shape) {
				parentRightEdge = parNode.shape.x + parNode.shape.w;
				parentBottomEdge = parNode.shape.y + parNode.shape.h;
			}
			const shape = chNode.shape;
			if (shape) {
				const newX = shape.x + parentOffX;
				const newY = shape.y + parentOffY;
				if ((newX > 0) && (newX + shape.w < parentRightEdge)) {
					shape.x = newX;
				}
				if (( newY > 0) && (newY + shape.h < parentBottomEdge)) {
					shape.y = newY;
				}
			}
		});
	};
	SnakeAlgorithm.prototype.applyPostAlgorithmSettings = function () {
		const oThis = this;
		this.rows.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			node.forEachDesOrSelf(function (chNode) {
				const prSet = chNode.getPrSet();
				const shape = chNode.shape;
				if (prSet) {
					if (prSet.custLinFactNeighborX) {
						shape.x += shape.cleanParams.w * prSet.custLinFactNeighborX * oThis.calcValues.coefficient;
					}
					if (prSet.custLinFactNeighborY) {
						shape.y += shape.cleanParams.h * prSet.custLinFactNeighborY * oThis.calcValues.coefficient;
					}
				}
			});

		});
	}

	function ShapeRows() {
		this.rows = [];
		this.width = 0;
		this.height = 0;
		this.x = 0;
		this.y = 0;
	}

	ShapeRows.prototype.push = function (elem) {
		this.rows.push(elem);
	}
	ShapeRows.prototype.calcMetrics = function () {
		for (let i = 0; i < this.rows.length; i += 1) {
			const row = this.rows[i];
			if (this.width < row.width) {
				this.width = row.width;
			}
			this.height += row.height;
		}
	};
	ShapeRows.prototype.applyCenterAlign = function (parentHeight, parentWidth) {
		const offRowsX = (parentWidth - this.width) / 2;
		const offRowsY = (parentHeight - this.height) / 2;

		for (let i = 0; i < this.rows.length; i++) {
			const row = this.rows[i];
			for (let j = 0; j < row.row.length; j++) {
				const shape = row.row[j];
				const offRowX = (this.width - row.width) / 2;
				const offRowY = (row.cleanHeight - shape.h) / 2;
				const node = shape.node;
				node.moveTo(offRowsX + offRowX, offRowsY + offRowY);
			}
		}
	};
	ShapeRows.prototype.forEachShape = function (callback) {
		for (let i = 0; i < this.rows.length; i += 1) {
			this.rows[i].forEachShape(callback);
		}
	};


	function ShapeRow() {
		this.row = [];
		this.width = 0;
		this.height = 0;
		this.cleanHeight = 0;
		this.x = 0;
		this.y = 0;
	}

	ShapeRow.prototype.push = function (elem) {
		this.row.push(elem);
	}

	ShapeRow.prototype.forEachShape = function (callback) {
		for (let i = 0; i < this.row.length; i += 1) {
			callback(this.row[i]);
		}
	}


	function SpaceAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(SpaceAlgorithm, BaseAlgorithm);
	
	SpaceAlgorithm.prototype.afterLayoutNode = function (presNode) {
		presNode.createShadowShape();
	}

	function TextAlgorithm() {
		BaseAlgorithm.call(this);
	}

	AscFormat.InitClassWithoutType(TextAlgorithm, BaseAlgorithm);

	TextAlgorithm.prototype.afterLayoutNode = function (presNode) {
		presNode.createShadowShape();
	};


	function CompositeAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(CompositeAlgorithm, BaseAlgorithm);

	CompositeAlgorithm.prototype.afterLayoutNode = function (presNode) {
		presNode.createShadowShape();
		presNode.shape.isSpacing = false;
	};

function PresNode(presPoint, contentNode) {
	this.parent = null;
	this.presPoint = presPoint || null;
	this.childs = [];
	this.constr = {};
	this.algorithm = null;
	this.node = contentNode;
	this.contentNodes = [];
	this.layoutInfo = {};
}

	PresNode.prototype.moveTo = function (deltaX, deltaY) {
			this.forEachDesOrSelf(function (node) {
				const shape = node.shape;
				if (shape) {
					shape.x += deltaX;
					shape.y += deltaY;
				}
			});
	};
	PresNode.prototype.changeShapeSizes = function (coefficient) {
	this.forEachDesOrSelf(function (presNode) {
		const shape = presNode.shape;
		if (shape) {
			shape.changeSize(coefficient);
		}
	});
	}

	PresNode.prototype.forEachDes = function (callback) {
		const elements = [this];
		while (elements.length) {
			const element = elements.pop();
			for (let i = 0; i < element.childs.length; i++) {
				elements.push(element.childs[i]);
				callback(element.childs[i]);
			}
		}
	};

	PresNode.prototype.forEachDesOrSelf = function (callback) {
		callback(this);
		this.forEachDes(callback);
	};
	PresNode.prototype.getAspectRatio = function () {
		if (this.algorithm) {
			return this.algorithm.getAspectRatio();
		}
		return 0;
	}
	PresNode.prototype.getPresStyleLbl = function () {
		return this.presPoint.getPresStyleLbl();
	}
PresNode.prototype.addChild = function (ch, pos) {
	if (!AscFormat.isRealNumber(pos)) {
		pos = this.childs.length;
	}
	this.childs.splice(pos, 0, ch);
	ch.parent = this;
};
	PresNode.prototype.removeChilds = function (pos, count) {
		this.childs.splice(pos, count);
	};
	PresNode.prototype.getPresName = function () {
		return this.presPoint.getPresName();
	};
	PresNode.prototype.getPrSet = function () {
		return this.presPoint.getPrSet();
	};

	PresNode.prototype.setShape = function (shape) {
		this.shape = shape;
	};

	PresNode.prototype.getNodesByAxis = function (nodes, constrType) {
		switch (constrType) {
			case AscFormat.Constr_for_self: {
				nodes.push(this);
				break;
			}
			case AscFormat.Constr_for_ch: {
				for (let i = 0; i < this.childs.length; i++) {
					nodes.push(this.childs[i]);
				}
				break;
			}
			case AscFormat.Constr_for_des: {
				const elements = [this];
				while (elements.length) {
					const element = elements.pop();
					for (let i = 0; i < element.childs.length; i++) {
						const child = element.childs[i];
						nodes.push(child);
						elements.push(child);
					}
				}
				break;
			}
			default: {
				break;
			}
		}
	};
	PresNode.prototype.setConstraints = function () {
		const constrLst = this.layoutInfo.constrLst;
		if (!constrLst) {
			return;
		}
		let cacheFor = {};
		let cacheRefFor = {};
		for (let i = 0; i < constrLst.length; i++) {
			const constr = constrLst[i];
			if (!cacheFor[constr.for]) {
				cacheFor[constr.for] = [];
				this.getNodesByAxis(cacheFor[constr.for], constr.for);
			}
			const nodes = cacheFor[constr.for];
/*			if (constr.for === constr.refFor) {
				for (let j = 0; j < nodes.length; j++) {
					const node = nodes[j];
					node.setConstraintByNode(constr, node);
				}
			} else */if (constr.refFor === AscFormat.Constr_for_self) {
				if (constr.for === AscFormat.Constr_for_self) {
					nodes[0].setConstraintByNode(constr, nodes[0]);
				} else {
					for (let j = 0; j < nodes.length; j++) {
						const node = nodes[j];
						node.setConstraintByNode(constr, this);
					}
				}
			} else {
				if (!cacheRefFor[constr.refFor]) {
					cacheRefFor[constr.refFor] = [];
					this.getNodesByAxis(cacheRefFor[constr.refFor], constr.refFor);
				}
				const refNodes = cacheRefFor[constr.refFor];
				for (let k = 0; k < nodes.length; k += 1) {
					if(!constr.forName || nodes[k].checkName(constr.forName)) {
						for (let j = 0; j < refNodes.length; j++) {
							if (nodes[k].setConstraintByNode(constr, refNodes[j])) {
								break;
							}
						}
					}
				}
			}
		}
	}
	PresNode.prototype.getPtType = function () {
		return this.node.getPtType();
	}
	PresNode.prototype.checkPtType = function (elementType) {
		const ptType = this.node.getPtType();
		switch (elementType) {
			case AscFormat.ElementType_value_all:
				return this;
			case AscFormat.ElementType_value_sibTrans:
				if (ptType === AscFormat.Point_type_sibTrans) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_node:
				if (ptType === AscFormat.Point_type_node) {
					return this;
				}
				break;
		}
	}

	PresNode.prototype.setConstraintByNode = function (constr, node) {
		let refNode;
		let aspectRatio;
		if (constr.for === AscFormat.Constr_for_ch) {
			aspectRatio = node.getAspectRatio();
		}
		if (constr.refForName) {
			refNode = node.checkName(constr.refForName);
		} else {
			refNode = node;
		}
		refNode = refNode && refNode.checkPtType(constr.refPtType.getVal());
		if (!refNode) {
			return false;
		}
		let constrNode;
		if (constr.forName) {
			constrNode = this.checkName(constr.forName);
		} else {
			constrNode = this;
		}
		constrNode = constrNode && constrNode.checkPtType(constr.ptType.getVal());
		if (constrNode) {
			const constrVal = refNode.getRefConstr(constr, aspectRatio);
			if (!AscFormat.isRealNumber(constrVal)) {
				return false;
			}
			constrNode.setConstraint(constr, constrVal);
			return true;
		}
		return false;
	};
	PresNode.prototype.setConstraint = function (constr, value) {
		this.constr[constr.type] = value;
		switch (constr.type) {
			case AscFormat.Constr_type_b:
				const height = this.constr[AscFormat.Constr_type_h];
				if (height !== undefined) {
					this.constr[AscFormat.Constr_type_t] = this.constr[AscFormat.Constr_type_b] - height;
				}
				break;
			case AscFormat.Constr_type_r:
				const width = this.constr[AscFormat.Constr_type_w];
				if (width !== undefined) {
					this.constr[AscFormat.Constr_type_l] = this.constr[AscFormat.Constr_type_r] - width;
				}
				break;
			default:
				break;
		}
	};
	PresNode.prototype.getRefConstr = function (constr, aspectRatio) {
		if (constr.refFor === AscFormat.Constr_for_self && this.constr[constr.type] !== undefined) {
			return this.constr[constr.type] * constr.fact;
		}
		let value = constr.val;
		if (this.constr[constr.refType]) {
			value = this.constr[constr.refType];
/*			if (aspectRatio) {
				switch (constr.refType) {
					case AscFormat.Constr_type_w:
						const height = this.constr[AscFormat.Constr_type_h];
						if (height !== undefined) {
							value = aspectHeight;
						}
						const aspectHeight = height * aspectRatio;
						if (height < value) {
							value = Math.max(value, height * aspectRatio);
						}
						break;
					default:
				}
			}*/
		} else {
			switch (constr.refType) {
				case AscFormat.Constr_type_b: {
					const top = this.constr[AscFormat.Constr_type_t];
					const height = this.constr[AscFormat.Constr_type_h];
					if (AscFormat.isRealNumber(top) && AscFormat.isRealNumber(height)) {
						value = top + height;
						this.constr[AscFormat.Constr_type_b] = value;
					}
					break;
				}
				default: {
					break;
				}
			}

		}
		return value * constr.fact;
	};

	PresNode.prototype.setAlgorithm = function (algorithm) {
		this.algorithm = algorithm;
	}

	PresNode.prototype.getAlgorithm = function () {
		return this.algorithm;
	}
	PresNode.prototype.getConstr = function (type) {
		return this.constr[type] || 0;
	}

	PresNode.prototype.getDirection = function () {
		return this.presPoint.getDirection();
	}

	PresNode.prototype.checkName = function (name) {
		if (this.getPresName() === name) {
			return this;
		}
	}

	PresNode.prototype.startAlgorithm = function () {
		if (this.algorithm) {
			this.algorithm.afterLayoutNode(this);
		}
	}

	PresNode.prototype.setLayoutConstraints = function (lst) {
		this.layoutInfo.constrLst = lst;
	};

	PresNode.prototype.createShadowShape = function () {
		this.shape = new ShadowShape(this);
		this.shape.initFromShape(this.layoutInfo.shape);

		if (this.childs.length) {
			let childBounds = {b: 0, t: 0, l: 0, r: 0};
			for (let i = 0; i < this.childs.length; i++) {
				const child = this.childs[i];
				child.checkBounds(childBounds);
			}
			const boundsWidth = childBounds.r - childBounds.l;
			const boundsHeight = childBounds.b - childBounds.t;
			this.shape.w = boundsWidth;
			this.shape.h = boundsHeight;
		} else {
			this.shape.w = this.shape.w;
			this.shape.h = this.shape.h;
		}


	};
	PresNode.prototype.checkBounds = function (bounds) {
		if (this.shape) {
			if (this.shape.x < bounds.l) {
				bounds.l = this.shape.x;
			}
			if (this.shape.y < bounds.t) {
				bounds.t = this.shape.y;
			}
			const right = this.shape.x + this.shape.w;
			if (right > bounds.r) {
				bounds.r = right;
			}
			const bottom = this.shape.y + this.shape.h;
			if (bottom > bounds.b) {
				bounds.b = bottom;
			}
		}
	}

	PresNode.prototype.getHeightScale = function () {
		const prSet = this.getPrSet();
		if (prSet) {
			return prSet.custScaleY || 1;
		}
		return 1;
	}

	PresNode.prototype.getWidthScale = function () {
		const prSet = this.getPrSet();
		if (prSet) {
			return prSet.custScaleX || 1;
		}
		return 1;
	}

	PresNode.prototype.initRootConstraints = function (smartArt) {
		this.constr[AscFormat.Constr_type_w] = smartArt.spPr.xfrm.extX;
		this.constr[AscFormat.Constr_type_h] = smartArt.spPr.xfrm.extY;
	};
	PresNode.prototype.getModelId = function () {
		return this.presPoint.getModelId();
	};














	let IS_DEBUG_DRAWING = true;
	let IS_ADD_HTML = false;

	if (IS_DEBUG_DRAWING) {
		AscCommon.InitDebugSmartArt = function () {

			const SMARTART_PREVIEW_SIZE_MM = 8128000 * AscCommonWord.g_dKoef_emu_to_mm;
			const smartArtType = Asc.c_oAscSmartArtTypes.BendingPictureAccentList;

			let loadedSmartArt;

			function getSmartArt() {
				return new Promise(function (resolve) {
					if (loadedSmartArt) {
						resolve(loadedSmartArt);
					}
					AscCommon.g_oBinarySmartArts.checkLoadDrawing().then(function () {
						return AscCommon.g_oBinarySmartArts.checkLoadData(smartArtType);
					}).then(function () {
						return AscFormat.ExecuteNoHistory(function () {
							const oSmartArt = new AscFormat.SmartArt();
							oSmartArt.bNeedUpdatePosition = false;
							oSmartArt.bFirstRecalculate = false;
							const oApi = Asc.editor || editor;
							oSmartArt.bForceSlideTransform = true;
							oSmartArt.fillByPreset(smartArtType);
							oSmartArt.setBDeleted2(false);
							const oXfrm = oSmartArt.spPr.xfrm;
							const oDrawingObjects = oApi.getDrawingObjects();
							oXfrm.setOffX(0);
							oXfrm.setOffY((SMARTART_PREVIEW_SIZE_MM - oXfrm.extY) / 2);
							if (oDrawingObjects) {
								oSmartArt.setDrawingObjects(oDrawingObjects);
								if (oDrawingObjects.cSld) {
									oSmartArt.setParent2(oDrawingObjects);
									oSmartArt.setRecalculateInfo();
								}

								if (oDrawingObjects.getWorksheetModel) {
									oSmartArt.setWorksheet(oDrawingObjects.getWorksheetModel());
								}
							}
							oSmartArt.recalcTransformText();
							oSmartArt.recalculate();

							loadedSmartArt = oSmartArt;
							resolve(oSmartArt);
						}, this, []);
					});
				});

			}

			let getGraphics;
			if (IS_ADD_HTML) {
				const oDivElement = document.createElement('div');
				oDivElement.style.cssText = "padding:0;margin:0;user-select:none;width:300px;height:300px;position:absolute;left:0;top:0;background-color: white;z-index:1000000;";
				document.body.appendChild(oDivElement);
				const nWidth_px = oDivElement.clientWidth;
				const nHeight_px = oDivElement.clientHeight;

				const oCanvas = document.createElement('canvas');
				oCanvas.style.cssText = "padding:0;margin:0;user-select:none;width:100%;height:100%;";
				if (nWidth_px > 0 && nHeight_px > 0) {
					oDivElement.appendChild(oCanvas);
				}


				oCanvas.width = AscCommon.AscBrowser.convertToRetinaValue(nWidth_px, true);
				oCanvas.height = AscCommon.AscBrowser.convertToRetinaValue(nHeight_px, true);
				const nRetinaWidth = oCanvas.width;
				const nRetinaHeight = oCanvas.height;
				const oContext = oCanvas.getContext("2d");
				getGraphics = function(smartart) {
					const size = Math.max(smartart.spPr.xfrm.extX, smartart.spPr.xfrm.extY);
					const oGraphics = new AscCommon.CGraphics();
					oGraphics.init(oContext,
						nRetinaWidth,
						nRetinaHeight,
						size,
						size);
					oGraphics.m_oFontManager = AscCommon.g_fontManager;

					oGraphics.SetIntegerGrid(true);
					oGraphics.transform(1, 0, 0, 1, 0, 0);

					oGraphics.b_color1(255, 255, 255, 255);
					oGraphics.rect(0, 0, size, size);
					oGraphics.df();
					return oGraphics;
				}

				getSmartArt().then(function (smartart) {
					const oGraphics = getGraphics(smartart);
					smartart.draw(oGraphics);
				});

			}


			document.body.addEventListener('keydown', function (e) {
				if (e.ctrlKey && e.altKey && e.keyCode === 82) {
					getSmartArt().then(function (smartart) {
						const oSM = editor.getGraphicController().selectedObjects[0];
						smartart = oSM || smartart;


						const smartArtAlgorithm = new SmartArtAlgorithm(smartart);
						smartArtAlgorithm.startFromBegin();
						const drawing = smartart.spTree[0];
						const shapeLength = drawing.spTree.length;
						for (let i = 0; i < shapeLength; i++) {
							drawing.removeFromSpTreeByPos(0);
						}
						const shapes = smartArtAlgorithm.getShapes();

						for (let i = shapes.length - 1; i >= 0; i -= 1) {
							drawing.addToSpTree(0, shapes[i]);
						}


						smartart.recalculate();

						if (IS_ADD_HTML) {
							const oGraphics = getGraphics(smartart);
							smartart.draw(oGraphics);
						}


						editor.getLogicDocument().Recalculate();
						smartart.fitFontSize();
						editor.getLogicDocument().Recalculate();
					});
				}
			});
		}

	}

})(window);

