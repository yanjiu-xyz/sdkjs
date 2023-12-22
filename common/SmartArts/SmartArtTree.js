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

	const degToRad = Math.PI / 180;
	const algDelta = 1e-13;
	const bulletFontSizeCoefficient = 51 / 65;

	function fAlgDeltaEqual(a, b) {
		return AscFormat.fApproxEqual(a, b, algDelta);
	}

	function CCoordPoint(x, y) {
		this.x = x;
		this.y = y;
	}

	CCoordPoint.prototype.getVector = function (point) {
		return new CVector(point.x - this.x, point.y - this.y);
	}
	function CVector(x, y) {
		this.x = x;
		this.y = y;
	}
	CVector.prototype.getDistance = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	CVector.prototype.diff = function (vector) {
		return new CVector(this.x - vector.x, this.y - vector.y);
	}
	CVector.prototype.multiply = function (value) {
		this.x *= value;
		this.y *= value;
	};


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
		const nodes = this.getNodesArray(smartArtAlgorithm);

		switch (this.func) {
			case AscFormat.If_func_cnt:
				return this.funcCnt(nodes);
			case AscFormat.If_func_depth:
				return this.funcDepth(node);
			case AscFormat.If_func_maxDepth:
				return this.funcMaxDepth(nodes);
			case AscFormat.If_func_pos:
				return this.funcPos(nodes, node);
			case AscFormat.If_func_posEven:
				return this.funcPosEven(nodes, node);
			case AscFormat.If_func_posOdd:
				return this.funcPosOdd(nodes, node);
			case AscFormat.If_func_revPos:
				return this.funcRevPos(nodes, node);
			case AscFormat.If_func_var:
				return this.funcVar(node);
			default:
				return false;
		}
	};

	If.prototype.check = function (expected, result) {
		switch (this.op) {
			case AscFormat.If_op_equ: {
				return expected === result;
			}
			case AscFormat.If_op_gt: {
				return result > expected;
			}
			case AscFormat.If_op_lt: {
				return result < expected;
			}
			case AscFormat.If_op_gte: {
				return result >= expected;
			}
			case AscFormat.If_op_lte: {
				return result <= expected;
			}
			case AscFormat.If_op_neq: {
				return result !== expected;
			}
			default: {
				return false;
			}
		}
	}
	If.prototype.funcPosEven = function (nodes, currentNode) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] === currentNode) {
				const isEven = i % 2 === 0 ? 1 : 0;
				return this.check(conditionValue, isEven);
			}
		}
		return false;
	};
	If.prototype.funcPosOdd = function (nodes, currentNode) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] === currentNode) {
				const isOdd = i % 2;
				return this.check(conditionValue, isOdd);
			}
		}
		return false;
	};
	If.prototype.funcPos = function (nodes, currentNode) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] === currentNode) {
				return this.check(conditionValue, i + 1);
			}
		}
		return false;
	};
	If.prototype.funcRevPos = function (nodes, currentNode) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] === currentNode) {
				return this.check(conditionValue, nodes.length - i);
			}
		}
		return false;
	};
	If.prototype.funcDepth = function (currentNode) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		return this.check(conditionValue, currentNode.depth + 1);
	};
	If.prototype.funcMaxDepth = function (nodes) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		let maxDepth = -1;
		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i].depth > maxDepth) {
				maxDepth = nodes[i].depth;
			}
		}
		return this.check(conditionValue, maxDepth + 1);
	};
	If.prototype.funcVar = function (node) {
		const nodeVal = node.getFuncVarValue(this.arg);
		return this.check(this.getConditionValue(), nodeVal);
	}
	If.prototype.funcCnt = function (nodes) {
		return this.check(parseInt(this.val, 10), nodes.length);
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

	RuleLst.prototype.executeAlgorithm = function (smartartAlgorithm) {
		smartartAlgorithm.setRules(this.list);
	}

	Else.prototype.executeAlgorithm = function (smartartAlgorithm) {
		for (let i = 0; i < this.list.length; i++) {
			this.list[i].executeAlgorithm(smartartAlgorithm);
		}
	}

	ForEach.prototype.executeAlgorithm = function (smartartAlgorithm) {
		const nodes = this.getNodesArray(smartartAlgorithm);
		const currentPresNode = smartartAlgorithm.getCurrentPresNode();
		if (currentPresNode) {
			currentPresNode.isHideLastTrans = this.getHideLastTrans(0);
		}
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
		let algorithm;
		switch (this.getType()) {
			case AscFormat.Alg_type_snake: {
				algorithm = new SnakeAlgorithm();
				break;
			}
			case AscFormat.Alg_type_tx: {
				algorithm = new TextAlgorithm();
				break;
			}
			case AscFormat.Alg_type_sp: {
				algorithm = new SpaceAlgorithm();
				break;
			}
			case AscFormat.Alg_type_composite: {
				algorithm = new CompositeAlgorithm();
				break;
			}
			case AscFormat.Alg_type_lin: {
				algorithm = new LinearAlgorithm();
				break;
			}
			case AscFormat.Alg_type_conn: {
				algorithm = new ConnectorAlgorithm();
				break;
			}
			case AscFormat.Alg_type_cycle: {
				algorithm = new CycleAlgorithm();
				break;
			}
			default: {
				break;
			}
		}
		if (algorithm) {
			algorithm.setParams(this.param);
			algorithm.setParentNode(smartartAlgorithm.getCurrentPresNode());
		}
		return algorithm;
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
		this.connectorAlgorithmStack = [];
		this.initDataTree();
	}
	SmartArtAlgorithm.prototype.addConnectorAlgorithm = function (algorithm) {
		this.connectorAlgorithmStack.push(algorithm);
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
					const mainShape = presNode.shape;
					if (mainShape) {
						const colorShape = mainShape.connectorShape || mainShape;
						colorShape.setFill(colorStyleLbl.getShapeFill(i));
						colorShape.setLn(colorStyleLbl.getShapeLn(i));
					}
				}
			}
		}
	};

	SmartArtAlgorithm.prototype.initDataTree = function () {
		const dataModel = this.smartart.getDataModel().getDataModel();
		const mainSmartArtPoint = dataModel.getMainPoint();
		const treeRoot = new SmartArtDataNode(mainSmartArtPoint, 0);
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

		this.calcRules();
		this.calcConstraints();
		this.calcScaleCoefficients();
		this.calcAdaptedConstraints();
		this.executeAlgorithms();
	};
	SmartArtAlgorithm.prototype.calcScaleCoefficients = function () {
		const oThis = this;
		this.forEachPresFromBottom(function (presNode) {
			presNode.calcScaleCoefficients(oThis);
		});
	};
	SmartArtAlgorithm.prototype.calcAdaptedConstraints = function () {
		this.forEachPresFromTop(function (presNode) {
			presNode.setConstraints(true);
		});
	};
	SmartArtAlgorithm.prototype.calcConstraints = function () {
		this.forEachPresFromTop(function (presNode) {
			presNode.setConstraints();
		});
	};
	SmartArtAlgorithm.prototype.calcRules = function () {
		this.forEachPresFromTop(function (presNode) {
			presNode.setRules();
		});
	};
	SmartArtAlgorithm.prototype.executeAlgorithms = function () {
		const oThis = this;
		this.forEachPresFromBottom(function (presNode) {
			presNode.startAlgorithm(oThis);
		});
		this.generateConnectors();
		this.forEachPresFromTop(function (presNode) {
			oThis.addToColorCheck(presNode);
		});
	};
	SmartArtAlgorithm.prototype.generateConnectors = function () {
		while (this.connectorAlgorithmStack.length) {
			const connectorAlgorithm = this.connectorAlgorithmStack.pop();
			connectorAlgorithm.connectShapes();
		}
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
			for (let i = element.childs.length - 1; i >= 0; i -= 1) {
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
	SmartArtAlgorithm.prototype.setRules = function (rules) {
		const node = this.getCurrentPresNode();
		node.setLayoutRules(rules);
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

	SmartArtDataNodeBase.prototype.getNodesByAxis = function (nodes, axis, ptType) {
		nodes = nodes || [];
		switch (axis) {
			case AscFormat.AxisType_value_ch: {
				this.getNodesByCh(nodes, ptType);
				break;
			}
			case AscFormat.AxisType_value_par: {
				this.getNodesByParent(nodes, ptType);
				break;
			}
			case AscFormat.AxisType_value_self: {
				const needNode = this.getNodeByPtType(ptType);
				if (needNode) {
					nodes.push(needNode);
				}
				break;
			}
			case AscFormat.AxisType_value_followSib: {
				this.getNodesByFollowSib(nodes, ptType);
				break;
			}
			case AscFormat.AxisType_value_des: {
				this.getNodesByDescendant(nodes, ptType);
				break;
			}
			case AscFormat.AxisType_value_desOrSelf: {
				this.getNodesByAxis(nodes, AscFormat.AxisType_value_self, ptType);
				this.getNodesByAxis(nodes, AscFormat.AxisType_value_des, ptType);
				break;
			}
			default: {
				break;
			}
		}
		return nodes;
	}
	SmartArtDataNodeBase.prototype.getParent = function () {
		return this.parent;
	}
	SmartArtDataNodeBase.prototype.getNodesByParent = function (nodes, ptType) {
		const parent = this.getParent();
		const needNode = parent && parent.getNodeByPtType(ptType);
		if (needNode) {
			nodes.push(needNode);
		}
	};
	SmartArtDataNodeBase.prototype.getNodesByDescendant = function (nodes, ptType) {
		const elements = [].concat(this.childs);
		while (elements.length) {
			const child = elements.shift();
			const needNode = child.getNodeByPtType(ptType);
			if (needNode) {
				nodes.push(needNode);
			}
			for (let i = 0; i < child.childs.length; i++) {
				elements.push(child.childs[i]);
			}
		}
	};
	SmartArtDataNodeBase.prototype.getNodesByFollowSib = function (nodes, ptType) {
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
			}
		}
	};

	SmartArtDataNodeBase.prototype.getNodesByCh = function (nodes, ptType) {
		for (let i = 0; i < this.childs.length; i++) {
			const child = this.childs[i];
			const needNode = child.getNodeByPtType(ptType);
			if (needNode) {
				nodes.push(needNode);
			}
		}
	};

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
	SmartArtSibDataNode.prototype.getParent = function () {
		return this.parent && this.parent.parent;
	}
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
	SmartArtParDataNode.prototype.getNodeByPtType = function (elementTypeValue) {
		return this;
	}
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
			case AscFormat.ElementType_value_parTrans:
				return this.parNode;
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
		this.connectorShape = null;
		this.customAdj = null;
	}
	ShadowShape.prototype.getBounds = function () {
		return {
			b: this.y + this.h,
			t: this.y,
			l: this.x,
			r: this.x + this.w,
			isEllipse: this.type === AscFormat.LayoutShapeType_shapeType_ellipse
		};
	};
	ShadowShape.prototype.setCalcInfo = function () {
		this.calcInfo = {
			isChecked: false
		};
	};
	ShadowShape.prototype.changeSize = function (coefficient, props) {
		props = props || {};
		this.x *= coefficient;
		this.w *= coefficient;
		if (props.changeHeight !== false) {
			this.y *= coefficient;
			this.h *= coefficient;
		}
	}
	ShadowShape.prototype.initFromShape = function (shape) {
		this.shape = shape;
		if (!shape.hideGeom) {
			this.type = shape.type;
			this.isSpacing = this.type === AscFormat.LayoutShapeType_outputShapeType_none;
			this.rot = AscFormat.isRealNumber(shape.rot) ? AscFormat.normalizeRotate(degToRad * shape.rot) : 0;
		}
		const widthCoef = this.node.getWidthScale();
		const heightCoef = this.node.getHeightScale();
		let x = this.node.getAdaptConstr(AscFormat.Constr_type_l);
		let y = this.node.getAdaptConstr(AscFormat.Constr_type_t);
		const width = this.node.getAdaptConstr(AscFormat.Constr_type_w);
		const height = this.node.getAdaptConstr(AscFormat.Constr_type_h);
		if (this.node.adaptConstr[AscFormat.Constr_type_ctrX] !== undefined) {
			x = this.node.adaptConstr[AscFormat.Constr_type_ctrX] - (x + width / 2);
		}
		if (this.node.adaptConstr[AscFormat.Constr_type_ctrY] !== undefined) {
			y = this.node.adaptConstr[AscFormat.Constr_type_ctrY] - (y + height / 2);
		}
		this.x = x;
		this.y = y;
		this.w = width * widthCoef;
		this.h = height * heightCoef;
		const parentNode = this.node.parent;
		if (parentNode) {
			const offX = (width - this.w) / 2;
			const offY = (height - this.h) / 2;
			if (this.x + offX > 0) {
				this.x += offX;
			}
			if (this.y + offY > 0) {
				this.y += offY;
			}
		}


		this.cleanParams = {
			w: width,
			h: height,
			x: x,
			y: y
		};
	}

	ShadowShape.prototype.setFill = function (fill) {
		this.fill = fill;
	};

	ShadowShape.prototype.setLn = function (ln) {
		this.ln = ln;
	}

	ShadowShape.prototype.getEditorShape = function () {
		if (this.connectorShape) {
			return this.connectorShape.getEditorShape();
		}
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
		const adjLst = this.customAdj || (this.shape && this.shape.adjLst);
		if (adjLst) {
			const geometry = editorShape.spPr.geometry;
			for (let i = 0; i < adjLst.list.length; i += 1) {
				const adj = adjLst.list[i];
				const geometryAdj = geometry.ahXYLstInfo[adj.idx - 1];
				const adjName = geometryAdj && (geometryAdj.gdRefX || geometryAdj.gdRefY);
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
		txXfrm.setRot(AscFormat.normalizeRotate(-this.rot));
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
		this._isHideLastChild = null;
	}
	BaseAlgorithm.prototype.getGuideVectorByAngle = function (xAngle) {
		return new CVector(Math.cos(xAngle), Math.sin(xAngle));
	}
	BaseAlgorithm.prototype.getRadialConnectionInfo = function () {};
	BaseAlgorithm.prototype.setParentAlgorithm = function (algorithm) {};
	BaseAlgorithm.prototype.isHideLastChild = function () {
		if (this._isHideLastChild !== null) {
			return this._isHideLastChild;
		}
		this._isHideLastChild = false;
		if (this.parentNode.isHideLastTrans) {
			const childs = this.parentNode.childs;
			const lastNode = childs[childs.length - 1];
			if (lastNode && lastNode.isSibNode()) {
				this._isHideLastChild = true;
			}
		}
		return this._isHideLastChild;
	};
	BaseAlgorithm.prototype.getShapePoint = function (bounds, pointPosition) {
		return new CCoordPoint(bounds.l + (bounds.r - bounds.l) / 2, bounds.t + (bounds.b - bounds.t) / 2);
	};

	BaseAlgorithm.prototype.getMinShapeEdgePoint = function (bounds, guideVector) {
		if (bounds.isEllipse) {
			return this.getMinCircleEdgePoint(bounds, guideVector);
		} else {
			return this.getMinRectEdgePoint(bounds, guideVector);
		}
	};

	BaseAlgorithm.prototype.getParametricLinEquation = function (startPoint, guideVector) {
		const len = guideVector.getDistance();
		return {
			x: startPoint.x,
			ax: guideVector.x / len,
			y: startPoint.y,
			ay: guideVector.y / len
		};
	}
	BaseAlgorithm.prototype.resolveParameterLineAndShapeEquation = function (ellipseBounds, paramLine) {
		const width = ellipseBounds.r - ellipseBounds.l;
		const height = ellipseBounds.b - ellipseBounds.t;
		const cw = width / 2;
		const ch = height / 2;
		const cx = cw + ellipseBounds.l;
		const cy = ch + ellipseBounds.t;

		const px = paramLine.ax;
		const py = paramLine.ay;
		const x1 = paramLine.x;
		const y1 = paramLine.y;
		const ch2 = ch * ch;
		const cw2 = cw * cw;
		const a = ch2 * px * px + cw2 * py * py;
		const b = 2 * ch2 * px * (x1 - cx) + 2 * cw2 * py * (y1 - cy);
		const c = ch2 * (cy * cy - 2 * cy * y1 + y1 * y1) + cw2 * (cx * cx - 2 * cx * x1 + x1 * x1) - cw2 * ch2;
		return AscFormat.fSolveQuadraticEquation(a, b, c);
	}
	BaseAlgorithm.prototype.getMinCircleEdgePoint = function (bounds, guideVector) {
		const shapePoint = this.getShapePoint(bounds);
		const line = this.getParametricLinEquation(shapePoint, guideVector);
		const answer = this.resolveParameterLineAndShapeEquation(bounds, line);
		if (answer.bError) {
			return null;
		}
		const angle = this.getGuideAngle(guideVector);

		const xt1 = line.x + line.ax * answer.x1;
		const yt1 = line.y + line.ay * answer.x1;

		let edgeAngle = this.getGuideAngle(new CVector(xt1 - shapePoint.x, yt1 - shapePoint.y));
		if (AscFormat.fApproxEqual(edgeAngle, angle, algDelta)) {
			return new CCoordPoint(xt1, yt1);
		}

		const xt2 = line.x + line.ax * answer.x2;
		const yt2 = line.y + line.ay * answer.x2;

		edgeAngle = this.getGuideAngle(new CVector(xt2 - shapePoint.x, yt2 - shapePoint.y));
		if (AscFormat.fApproxEqual(edgeAngle, angle, algDelta)) {
			return new CCoordPoint(xt2, yt2);
		}
	};
	BaseAlgorithm.prototype.getMinRectEdgePoint = function (bounds, guideVector) {
		const shapePoint = this.getShapePoint(bounds);
		const centerAngle = this.getGuideAngle(guideVector);
		let checkEdges = [
			[new CCoordPoint(bounds.l, bounds.t), new CCoordPoint(bounds.r, bounds.t)],
			[new CCoordPoint(bounds.r, bounds.t), new CCoordPoint(bounds.r, bounds.b)],
			[new CCoordPoint(bounds.l, bounds.t), new CCoordPoint(bounds.l, bounds.b)],
			[new CCoordPoint(bounds.l, bounds.b), new CCoordPoint(bounds.r, bounds.b)]
		];
		for (let i = 0; i < checkEdges.length; i += 1) {
			const edge = checkEdges[i];
			const point = this.getRectEdgePoint(shapePoint, guideVector, edge[0], edge[1]);
			if (point) {
				const edgeGuideVector = {x: point.x - shapePoint.x, y: point.y - shapePoint.y};
				const edgeAngle = this.getGuideAngle(edgeGuideVector);
				if (AscFormat.fApproxEqual(edgeAngle, centerAngle, algDelta)) {
					return point;
				}
			}
		}
	};
	BaseAlgorithm.prototype.getRectEdgePoint = function (linePoint, guideVector, rectEdgePoint1, rectEdgePoint2) {
		const line1 = this.getParametricLinEquation(linePoint, guideVector);
		const line2 = this.getParametricLinEquation(rectEdgePoint1, new CVector(rectEdgePoint2.x - rectEdgePoint1.x, rectEdgePoint2.y - rectEdgePoint1.y));
		const divider = line1.ay * line2.ax - line1.ax * line2.ay;
		if (divider === 0) {
			return null;
		}
		const parameter = (line1.ax * (line2.y - line1.y) - line1.ay * (line2.x - line1.x)) / divider;
		const x = line2.x + line2.ax * parameter;
		const y = line2.y + line2.ay * parameter;
		if (((x > rectEdgePoint1.x && x < rectEdgePoint2.x) || AscFormat.fApproxEqual(x, rectEdgePoint2.x, algDelta))
			&& ((y > rectEdgePoint1.y && y < rectEdgePoint2.y) || AscFormat.fApproxEqual(y, rectEdgePoint2.y, algDelta))) {
			return new CCoordPoint(x, y);
		}
		return null;
	}

	BaseAlgorithm.prototype.getGuideAngle = function (guideVector) {

		const x = guideVector.x;
		const y = guideVector.y;
		const vectorLength = Math.sqrt(x * x + y * y);
		if (vectorLength !== 0) {
			const angle = Math.acos(x / vectorLength);
			if (y > 0) {
				return angle;
			}
			return AscFormat.normalizeRotate(-angle);
		}
		return null;
	}
	BaseAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints();
	};
	BaseAlgorithm.prototype.getShapes = function () {
		return [];
	}
	BaseAlgorithm.prototype.setConnectionDistance = function (value, isStart) {

	};
	BaseAlgorithm.prototype.afterShape = function (smartartAlgorithm) {};
	BaseAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm) {};
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
	BaseAlgorithm.prototype.setFirstConnectorShape = function () {

	};
	BaseAlgorithm.prototype.setLastConnectorShape = function () {

	};
	BaseAlgorithm.prototype.applyPostAlgorithmSettingsForShape = function (shape, prSet, customCoefficient) {
		const coefficient = AscFormat.isRealNumber(customCoefficient) ? customCoefficient : 1;
		const presNode = shape.node;
		let neighborWidth = null;
		let neighborHeight = null;
		const neighbor = presNode.getNeighbor();
		const neighborShape = neighbor.shape;
		if (neighborShape) {
			if (presNode.node.isSibNode()) {
				neighborHeight = neighborShape.cleanParams.h;
			} else {
				neighborWidth = neighborShape.cleanParams.w;
			}
		}

		if (prSet) {
			if (prSet.custLinFactNeighborX) {
				const width = neighborWidth !== null ? neighborWidth : shape.cleanParams.w;
				shape.x += width * prSet.custLinFactNeighborX * coefficient;
			}
			if (prSet.custLinFactX) {
				shape.x += shape.cleanParams.w * prSet.custLinFactX * coefficient;
			}
			if (prSet.custLinFactNeighborY) {
				const height = neighborHeight !== null ? neighborHeight : shape.cleanParams.h;
				shape.y += height * prSet.custLinFactNeighborY * coefficient;
			}
			if (prSet.custLinFactY) {
				shape.y += shape.cleanParams.h * prSet.custLinFactY * coefficient;
			}
		}
	};
	function PositionAlgorithm() {
		BaseAlgorithm.call(this);
		this.connector = null;
		this.shapeContainer = null;
	}
	AscFormat.InitClassWithoutType(PositionAlgorithm, BaseAlgorithm);
	PositionAlgorithm.prototype.applyOffsetByParents = function () {
		this.shapeContainer.calcMetrics();
		this.shapeContainer.forEachShape(function (shape) {
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
	};
	PositionAlgorithm.prototype.getShapes = function (smartartAlgorithm) {
		smartartAlgorithm.applyColorsDef();
		const shapes = [];

		this.shapeContainer.forEachShape(function (shape) {
			const nodes = [shape.node];
			while (nodes.length) {
				const node = nodes.pop();
				const shape = node.shape;
				const editorShape = shape && shape.getEditorShape();
				if (editorShape) {
					shapes.push(editorShape);
				}
				for (let i = node.childs.length - 1; i >= 0; i -= 1) {
					nodes.push(node.childs[i]);
				}
			}
		});
		return shapes;
	};
	PositionAlgorithm.prototype.applyPostAlgorithmSettings = function () {
		const oThis = this;
		this.shapeContainer.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			node.forEachDesOrSelf(function (chNode) {
				const prSet = chNode.getPrSet();
				const shape = chNode.shape;
				oThis.applyPostAlgorithmSettingsForShape(shape, prSet);
			});
		});
	};
	PositionAlgorithm.prototype.applyConstraintOffset = function () {
		const parentNode = this.parentNode;
		const width = parentNode.constr[AscFormat.Constr_type_w];
		const ctrX = parentNode.constr[AscFormat.Constr_type_ctrX];
		let offX = 0;
		let offY = 0;
		if (ctrX !== undefined) {
			offX = ctrX - width / 2;
		}
		this.shapeContainer.forEachShape(function (shape) {
			const node = shape.node;
			node.forEachDes(function (node) {
				const shape = node.shape;
				if (shape) {
					shape.x += offX;
					shape.y += offY;
				}
			});
		});
	};
	PositionAlgorithm.prototype.applyParamOffsets = function () {
		switch (this.params[AscFormat.Param_type_off]) {
			case AscFormat.ParameterVal_offset_ctr:
				this.applyCenterAlign();
				break;
			default:
				break;
		}
	};

	PositionAlgorithm.prototype.applyCenterAlign = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const parentHeight = parentConstraints.height;

		this.shapeContainer.applyCenterAlign(parentHeight, parentWidth);
		const oThis = this;
		this.shapeContainer.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			oThis.applyAligns(node);
		});
	};

	PositionAlgorithm.prototype.setConnections = function () {
		const nodes = this.parentNode.childs;
		let previousIndex = 0;
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node.isMainElement()) {
				previousIndex = i;
				break;
			}
		}
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			const shape = node.shape;
			if (shape.type === AscFormat.LayoutShapeType_outputShapeType_conn) {
				const algorithm = node.algorithm;
				let nextIndex = i + 1;
				while (nextIndex < nodes.length && !nodes[nextIndex].isMainElement()) {
					nextIndex += 1;
				}
				if (nextIndex === nodes.length && !this.isHideLastChild()) {
					nextIndex = 0;
					while (nextIndex < previousIndex && !nodes[nextIndex].isMainElement()) {
						nextIndex += 1;
					}
				}
				const nextShape = nodes[nextIndex] && nodes[nextIndex].shape;
				if (node.isSibNode()) {
					const previousShape = nodes[previousIndex] && nodes[previousIndex].shape;
					if (algorithm && previousShape && nextShape) {
						algorithm.setFirstConnectorShape(previousShape);
						algorithm.setLastConnectorShape(nextShape);
						algorithm.setParentAlgorithm(this);
					}
				} else {
					this.setParentConnection(algorithm, nextShape);
				}
				previousIndex = nextIndex;
			}
		}
	}
	PositionAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childShape) {
		const parentShape = this.parentNode.shape;
		if (parentShape && connectorAlgorithm && childShape) {
			connectorAlgorithm.setParentAlgorithm(this);
			connectorAlgorithm.setFirstConnectorShape(parentShape);
			connectorAlgorithm.setLastConnectorShape(childShape);
		}
	};
	PositionAlgorithm.prototype.applyAligns = function (presNode) {
		const shape = presNode.shape;
		const cleanParams = shape.cleanParams;
		const cleanW = cleanParams.w;
		const cleanH = cleanParams.h;

		const parentOffX = (shape.w - cleanW) / 2;
		const parentOffY = (shape.h - cleanH) / 2;

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

	PositionAlgorithm.prototype.getNodeConstraints = function (node) {
			return node.nodeConstraints;
	}


	function SnakeAlgorithm() {
		PositionAlgorithm.call(this);
	}

	AscFormat.InitClassWithoutType(SnakeAlgorithm, PositionAlgorithm);
	SnakeAlgorithm.prototype.initParams = function (params) {
		BaseAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_flowDir] === undefined) {
			this.params[AscFormat.Param_type_flowDir] = AscFormat.ParameterVal_flowDirection_row;
		}
		if (this.params[AscFormat.Param_type_grDir] === undefined) {
			this.params[AscFormat.Param_type_grDir] = AscFormat.ParameterVal_growDirection_tL;
		}
	};
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


	SnakeAlgorithm.prototype.calculateRowScaleCoefficient = function () {
		const oThis = this;
		const root = this.parentNode;
		const parentConstraints = this.getNodeConstraints(root);
		const parentWidth = parentConstraints.width;
		const parentHeight = parentConstraints.height;
		const spaceConstr = root.getConstr(AscFormat.Constr_type_sp);
		const initValues = this.getStartValues(root.childs[0]);
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
							return true;
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
		for (let j = 0; j < root.childs.length; j++) {
			const node = root.childs[j];
			node.setWidthScaleConstrCoefficient(coefficient);
			node.setHeightScaleConstrCoefficient(coefficient);
		}
	};

	SnakeAlgorithm.prototype.calculateShapePositions = function () {
		this.nodes = this.parentNode.childs.slice();
		if (this.isHideLastChild()) {
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
	SnakeAlgorithm.prototype.calcScaleCoefficients = function () {
		if (this.params[AscFormat.Param_type_flowDir] === AscFormat.ParameterVal_flowDirection_row) {
			this.calculateRowScaleCoefficient();
		}
	};
	SnakeAlgorithm.prototype.calculateRowSnake = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const constrSpace = this.parentNode.getAdaptConstr(AscFormat.Constr_type_sp);
		const rows = new ShapeRows();
		let row = new ShapeRow();
		rows.push(row);

		for (let shapeIndex = 0; shapeIndex < this.nodes.length; shapeIndex += 1) {
			const shShape = this.nodes[shapeIndex].shape;
			if (!shShape) {
				continue;
			}
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
					if ((shapeIndex === this.nodes.length - 1) && checkShape === shShape) {
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
		this.shapeContainer = rows;

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
		this.applyParamOffsets();
		this.applyPostAlgorithmSettings();
	};

	SnakeAlgorithm.prototype.applyCenterAlign = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const parentHeight = parentConstraints.height;

		this.shapeContainer.applyCenterAlign(parentHeight, parentWidth);
		const oThis = this;
		this.shapeContainer.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			oThis.applyAligns(node);
		});
	};

	function ShapeContainer() {
		this.width = 0;
		this.height = 0;
	}
	ShapeContainer.prototype.forEachShape = function () {
	};
	ShapeContainer.prototype.applyCenterAlign = function (parentHeight, parentWidth) {
	};

	function ShapeCycle() {
		ShapeContainer.call(this)
		this.shapes = [];
		this.bounds = null;
	}
	AscFormat.InitClassWithoutType(ShapeCycle, ShapeContainer);
	ShapeCycle.prototype.push = function (shape) {
		this.shapes.push(shape);
	};
	ShapeCycle.prototype.forEachShape = function (callback) {
		for (let i = 0; i < this.shapes.length; i += 1) {
			callback(this.shapes[i]);
		}
	}
	ShapeCycle.prototype.calcMetrics = function () {
		const firstShape = this.shapes[0];
		if (firstShape) {
			const bounds = {l: firstShape.x, t: firstShape.y, r: firstShape.x + firstShape.w, b: firstShape.y + firstShape.h};
			for (let i = 1; i < this.shapes.length; i += 1) {
				const shape = this.shapes[i];
				if (shape.x < bounds.l) {
					bounds.l = shape.x;
				}
				if (shape.y < bounds.t) {
					bounds.t = shape.y;
				}

				const b = shape.y + shape.h;
				if (b > bounds.b) {
					bounds.b = b;
				}

				const r = shape.x + shape.w;
				if (r > bounds.r) {
					bounds.r = r;
				}
			}
			this.width = bounds.r - bounds.l;
			this.height = bounds.b - bounds.t;
			this.bounds = bounds;
		}
	};
	ShapeCycle.prototype.getOffsets = function (parentHeight, parentWidth) {
		const cycleCY = this.bounds.t + this.height / 2;
		const cycleCX = this.bounds.l + this.width / 2;
		return {
			x: parentWidth / 2 - cycleCX,
			y: parentHeight / 2 - cycleCY
		};
	}
	ShapeCycle.prototype.applyCenterAlign = function (parentHeight, parentWidth) {
		const offsets = this.getOffsets(parentHeight, parentWidth);
		for (let i = 0; i < this.shapes.length; i++) {
			const shape = this.shapes[i];
			const node = shape.node;
			node.moveTo(offsets.x, offsets.y);
		}
	};


	function ShapeRows() {
		ShapeContainer.call(this);
		this.rows = [];
	}
	AscFormat.InitClassWithoutType(ShapeRows, ShapeContainer);

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

	function CycleAlgorithm() {
		PositionAlgorithm.call(this);
		this.calcValues = {
			radius: 0,
			startAngle: 0,
			stepAngle: 0,
			mainElements: [],
			centerNodeIndex: null
		};
	}
	AscFormat.InitClassWithoutType(CycleAlgorithm, PositionAlgorithm);
	CycleAlgorithm.prototype.getCenterNode = function () {
		if (this.calcValues.centerNodeIndex !== null) {
			return this.parentNode.childs[this.calcValues.centerNodeIndex];
		}
	};
	CycleAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childShape) {
		const centerNode = this.getCenterNode();
		const centerShape = centerNode && centerNode.shape;
		if (centerShape && connectorAlgorithm && childShape) {
			connectorAlgorithm.setParentAlgorithm(this);
			connectorAlgorithm.setFirstConnectorShape(centerShape);
			connectorAlgorithm.setLastConnectorShape(childShape);
		}
	};
	CycleAlgorithm.prototype.isClockwise = function () {
		return this.calcValues.stepAngle > 0;
	}
	CycleAlgorithm.prototype.getShapeIndex = function (shape) {
		return this.calcValues.mainElements.indexOf(shape);
	};
	CycleAlgorithm.prototype.getRadialConnectionInfo = function (node) {
		const parentHeight = this.parentNode.getAdaptConstr(AscFormat.Constr_type_h);
		const parentWidth = this.parentNode.getAdaptConstr(AscFormat.Constr_type_w);

		const nodeIndex = this.getShapeIndex(node);
		if (nodeIndex === -1) {
			return null;
		}
		const result = {};
		const offsets = this.shapeContainer.getOffsets(parentHeight, parentWidth);
		result.point = new CCoordPoint(offsets.x, offsets.y);
		result.radius = this.calcValues.radius;
		result.angle = AscFormat.normalizeRotate(this.calcValues.startAngle + this.calcValues.stepAngle * nodeIndex);
		result.isClockwise = this.isClockwise();
		return result;
	};
	CycleAlgorithm.prototype.initParams = function (params) {
		PositionAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_stAng] === undefined) {
			this.params[AscFormat.Param_type_stAng] = 0;
		}
		if (this.params[AscFormat.Param_type_spanAng] === undefined) {
			this.params[AscFormat.Param_type_spanAng] = 360;
		}
		if (this.params[AscFormat.Param_type_off] === undefined) {
			this.params[AscFormat.Param_type_off] = AscFormat.ParameterVal_offset_ctr;
		}
		if (this.params[AscFormat.Param_type_ctrShpMap] === undefined) {
			this.params[AscFormat.Param_type_ctrShpMap] = AscFormat.ParameterVal_centerShapeMapping_none;
		}
	}
	CycleAlgorithm.prototype.getCenterShapeRadius = function (centerBounds, anotherBounds, angle) {
		if (!centerBounds || !anotherBounds) {
			return 0;
		}
		const centerPoint = this.getShapePoint(centerBounds);
		const anotherPoint = this.getShapePoint(anotherBounds);
		const guideVector = this.getGuideVectorByAngle(angle);
		const centerEdgePoint = this.getMinShapeEdgePoint(centerBounds, guideVector);
		const anotherEdgePoint = this.getMinShapeEdgePoint(anotherBounds, new CVector(-guideVector.x, -guideVector.y));
		if (centerEdgePoint && anotherEdgePoint) {
			const centerDistance = centerPoint.getVector(centerEdgePoint).getDistance();
			const anotherDistance = anotherPoint.getVector(anotherEdgePoint).getDistance();
			const minPadding = this.parentNode.getConstr(AscFormat.Constr_type_sp);
			return centerDistance + anotherDistance + minPadding;
		}
		return 0;
	}
	CycleAlgorithm.prototype.initCenterShapeMap = function () {
		if (this.params[AscFormat.Param_type_ctrShpMap] === AscFormat.ParameterVal_centerShapeMapping_fNode) {
			const childs = this.parentNode.childs;
			for (let i = 0; i < childs.length; i += 1) {
				const child = childs[i];
				if (child.isContentNode()) {
					this.calcValues.centerNodeIndex = i;
					return i + 1;
				}
			}
		}
		return 0;
	};
	CycleAlgorithm.prototype.calcScaleCoefficients = function () {
		const spanAngle = this.params[AscFormat.Param_type_spanAng];
		const startAngle = AscFormat.normalizeRotate(this.params[AscFormat.Param_type_stAng] * degToRad - Math.PI / 2);

		const childs = this.parentNode.childs;
		const mainElementsBounds = [];
		let startIndex = this.initCenterShapeMap();
		for (startIndex; startIndex < childs.length; startIndex += 1) {
			const child = childs[startIndex];
			if (child.isContentNode()) {
				mainElementsBounds.push(this.getCleanNodeBounds(child));
				this.calcValues.mainElements.push(child);
			}
		}

		let stepAngle;
		if (Math.abs(spanAngle) === 360) {
			stepAngle = (spanAngle / mainElementsBounds.length) * degToRad;
		} else {
			stepAngle = (spanAngle / (mainElementsBounds.length - 1)) * degToRad;
		}
		this.calcValues.startAngle = startAngle;
		this.calcValues.stepAngle  = stepAngle;

		let previousAngle = startAngle;
		let currentAngle = AscFormat.normalizeRotate(startAngle + stepAngle);
		const divider = Math.sqrt(2 * (1 - Math.cos(Math.abs(stepAngle))));
		const sibSp = this.parentNode.constr[AscFormat.Constr_type_sibSp];
		let maxRadius = 0;
		if (divider !== 0) {
			let centerShapeBounds;
			const centerNode = this.getCenterNode();
			if (centerNode) {
				centerShapeBounds = this.getCleanNodeBounds(centerNode);
				maxRadius = this.getCenterShapeRadius(centerShapeBounds, mainElementsBounds[0], startAngle);
			}
			let previousBounds = mainElementsBounds[0];
			for (let i = 1; i < mainElementsBounds.length; i++) {
				const currentBounds = mainElementsBounds[i];
				const tempCenterRadius = this.getCenterShapeRadius(centerShapeBounds, currentBounds, currentAngle);
				let tempSibRadius = 0;
				const guideVector = this.getDiffGuideVector(previousAngle, currentAngle);
				const currentEdgePoint = this.getMinShapeEdgePoint(currentBounds, guideVector);
				const previousEdgePoint = this.getMinShapeEdgePoint(previousBounds, new CVector(-guideVector.x, -guideVector.y));
				if (currentEdgePoint && previousEdgePoint) {
					const currentShapePoint = this.getShapePoint(currentBounds);
					const previousShapePoint = this.getShapePoint(previousBounds);
					const currentVector = currentShapePoint.getVector(currentEdgePoint);
					const previousVector = previousShapePoint.getVector(previousEdgePoint);
					const previousDistance = previousVector.getDistance();
					const currentDistance = currentVector.getDistance();

					tempSibRadius = (sibSp + previousDistance + currentDistance) / divider;
				}
				maxRadius = Math.max(maxRadius, tempSibRadius, tempCenterRadius);
				previousAngle = currentAngle;
				currentAngle = AscFormat.normalizeRotate(currentAngle + stepAngle);
			}
		}
		currentAngle = startAngle;
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const cycleBounds = {l: 0, r: 0, t: 0, b: 0};
		for (let i = 0; i < mainElementsBounds.length; i++) {
			const radiusVector = this.getGuideVectorByAngle(currentAngle);
			radiusVector.multiply(maxRadius);
			const currentBounds = mainElementsBounds[i];
			const halfWidth = (currentBounds.r - currentBounds.l) / 2;
			const halfHeight = (currentBounds.b - currentBounds.t) / 2;
			const newL = radiusVector.x - halfWidth;
			const newR = radiusVector.x + halfWidth;
			const newT = radiusVector.y - halfHeight;
			const newB = radiusVector.y + halfHeight;

			if (newL < cycleBounds.l) {
				cycleBounds.l = newL;
			}
			if (newT < cycleBounds.t) {
				cycleBounds.t = newT;
			}
			if (newR > cycleBounds.r) {
				cycleBounds.r = newR;
			}
			if (newB > cycleBounds.b) {
				cycleBounds.b = newB;
			}

			currentAngle = AscFormat.normalizeRotate(currentAngle + stepAngle);
		}

		const cycleHeight = cycleBounds.b - cycleBounds.t;
		const cycleWidth = cycleBounds.r - cycleBounds.l;
		const coefficient = Math.min(1, parentConstraints.width / cycleWidth, parentConstraints.height / cycleHeight);
		this.calcValues.radius = maxRadius * coefficient;
		for (let i = 0; i < this.parentNode.childs.length; i++) {
			const child = this.parentNode.childs[i];
			child.setWidthScaleConstrCoefficient(coefficient);
			child.setHeightScaleConstrCoefficient(coefficient);
		}
	};
	CycleAlgorithm.prototype.calculateShapePositions = function () {
		const childs = this.parentNode.childs;
		const radius = this.calcValues.radius;
		let currentAngle = this.calcValues.startAngle;
		const stepAngle = this.calcValues.stepAngle;
		const container = new ShapeCycle();
		let startIndex = 0;
		if (this.calcValues.centerNodeIndex !== null) {
			const centerNode = this.getCenterNode();
			const shape = centerNode && centerNode.shape;
			if  (shape) {
				shape.x -= shape.w / 2;
				shape.y -= shape.h / 2;
				container.push(shape);
			}
			startIndex = this.calcValues.centerNodeIndex + 1;
		}
		for (let i = startIndex; i < childs.length; i++) {
			const child = childs[i];
			if (child.isContentNode()) {
				const shape = child.shape;
				if (shape) {
					const radiusGuideVector = this.getGuideVectorByAngle(currentAngle);
					radiusGuideVector.multiply(radius);
					const radiusX = radiusGuideVector.x;
					const radiusY = radiusGuideVector.y;
					const offX = radiusX - shape.w / 2;
					const offY = radiusY - shape.h / 2;
					shape.x += offX;
					shape.y += offY;
					currentAngle += stepAngle;
					container.push(shape);
				}
			} else {
				if (child.shape) {
					container.push(child.shape);
				}
			}
		}
		this.shapeContainer = container;
		this.applyOffsetByParents();
		this.applyParamOffsets();
		this.applyConstraintOffset();
		this.applyPostAlgorithmSettings();
		this.setConnections();
	};

	CycleAlgorithm.prototype.getCleanNodeBounds = function (node) {
		const width = node.getConstr(AscFormat.Constr_type_w);
		const height = node.getConstr(AscFormat.Constr_type_h);
		const x = node.getConstr(AscFormat.Constr_type_l);
		const y = node.getConstr(AscFormat.Constr_type_t);
		const isEllipse = node.layoutInfo.shape.type === AscFormat.LayoutShapeType_shapeType_ellipse;
		return {
			l: x,
			t: y,
			r: x + width,
			b: y + height,
			isEllipse: isEllipse
		};
	}


	CycleAlgorithm.prototype.getDiffGuideVector = function (xPreviousAngle, xCurrentAngle) {
		const previousVector = this.getGuideVectorByAngle(xPreviousAngle);
		const currentVector =  this.getGuideVectorByAngle(xCurrentAngle);

		return currentVector.diff(previousVector);
	};

	function LinearAlgorithm() {
		PositionAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(LinearAlgorithm, PositionAlgorithm);

	LinearAlgorithm.prototype.initParams = function (params) {
		PositionAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_linDir] === undefined) {
			this.params[AscFormat.Param_type_linDir] = AscFormat.ParameterVal_linearDirection_fromL;
		}
		if (this.params[AscFormat.Param_type_off] === undefined) {
			this.params[AscFormat.Param_type_off] = AscFormat.ParameterVal_offset_ctr;
		}
	}

	LinearAlgorithm.prototype.calculateShapePositions = function () {
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromL) {
			this.calculateRowLinear();
		}
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromT) {
			this.calculateColumnLinear();
		}
	};
	LinearAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints();
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromL) {
			this.calculateRowScaleCoefficient();
		}
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromT) {
			this.calculateColumnScaleCoefficient();
		}
	};
	LinearAlgorithm.prototype.calculateRowScaleCoefficient = function () {
		const childs = this.parentNode.childs;
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const length = this.isHideLastChild() ? childs.length - 1 : childs.length;

		let sumWidth = 0;
		let maxHeight = 0;
		for (let i = 0; i < length; i += 1) {
			const child = childs[i];
			const childConstraints = this.getNodeConstraints(child);
			sumWidth += childConstraints.width;
			if (maxHeight < childConstraints.height) {
				maxHeight = childConstraints.height;
			}
		}
		let widthCoefficient = 1;
		if (sumWidth !== 0) {
			widthCoefficient = Math.min(1, parentWidth / sumWidth);
		}
		let heightCoefficient = 1;
		// todo think about it
/*		if (maxHeight !== 0) {
			heightCoefficient = Math.min(1, parentHeight / maxHeight);
		}*/


		for (let i = 0; i < childs.length; i += 1) {
			const child = childs[i];
			child.setWidthScaleConstrCoefficient(widthCoefficient);
			child.setHeightScaleConstrCoefficient(heightCoefficient);
		}
	}

	LinearAlgorithm.prototype.calculateRowLinear = function () {
		const childs = this.parentNode.childs;
		const length = this.isHideLastChild() ? childs.length - 1 : childs.length;
		const rows = new ShapeRows();
		const row = new ShapeRow();
		rows.push(row);
		for (let i = 0; i < length; i++) {
			const child = childs[i];
			const shape = child.shape;
			if (shape) {
				shape.x += row.width;
				row.push(shape);
				if (row.height < shape.h) {
					row.height = shape.h;
				}
				row.width += shape.w;
			}
		}
		row.cleanHeight = row.height;
		this.shapeContainer = rows;
		this.applyOffsetByParents();
		this.applyParamOffsets();
		this.applyConstraintOffset();
		this.applyPostAlgorithmSettings();
		this.setConnections();
	}

	function ConnectorAlgorithm() {
		BaseAlgorithm.call(this);
		this.startShape = null;
		this.endShape = null;
		this.connectorShape = null;
		this.connectionDistances = {
			begin: 0.22,
			end: 0.25
		};
		this.parentAlgorithm = null;
		this.calcValues = {
			edgePoints: null,
			connectionPoints: null
		}
	}
	AscFormat.InitClassWithoutType(ConnectorAlgorithm, BaseAlgorithm);
	ConnectorAlgorithm.prototype.initParams = function (params) {
		BaseAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_dim] === undefined) {
			this.params[AscFormat.Param_type_dim] = AscFormat.ParameterVal_connectorDimension_2D;
		}
		if (this.params[AscFormat.Param_type_begSty] === undefined) {
			this.params[AscFormat.Param_type_begSty] = AscFormat.ParameterVal_arrowheadStyle_noArr;
		}
		if (this.params[AscFormat.Param_type_endSty] === undefined) {
			this.params[AscFormat.Param_type_endSty] = AscFormat.ParameterVal_arrowheadStyle_arr;
		}
		if (this.params[AscFormat.Param_type_connRout] === undefined) {
			this.params[AscFormat.Param_type_connRout] = AscFormat.ParameterVal_connectorRouting_stra;
		}
	}
	ConnectorAlgorithm.prototype.getEdgePoints = function () {
		if (!this.calcValues.edgePoints) {
			const startEdgePoint = this.getEdgePoint(true);
			const endEdgePoint = this.getEdgePoint();
			this.calcValues.edgePoints = {
				start: startEdgePoint,
				end: endEdgePoint
			};
		}
		if (this.calcValues.edgePoints.start && this.calcValues.edgePoints.end) {
			return this.calcValues.edgePoints;
		}
		return null;
	};
	ConnectorAlgorithm.prototype.getConnectionPoints = function () {
		if (!this.calcValues.connectionPoints) {
			this.calcValues.connectionPoints = {
				start: null,
				end : null
			};
			const edgePoints = this.getEdgePoints();
			if (edgePoints) {
				const startPoint = edgePoints.start;
				const endPoint = edgePoints.end;


				const startLambda = this.connectionDistances.begin / (1 - this.connectionDistances.begin);
				const sumStartX = startPoint.x + startLambda * endPoint.x;
				const sumStartY = startPoint.y + startLambda * endPoint.y;
				const endLambda = this.connectionDistances.end / (1 - this.connectionDistances.end);
				const sumEndX = endPoint.x + endLambda * startPoint.x;
				const sumEndY = endPoint.y + endLambda * startPoint.y;
				const startConnectionPoint = new CCoordPoint(sumStartX / (1 + startLambda), sumStartY / (1 + startLambda));
				const endConnectionPoint = new CCoordPoint(sumEndX / (1 + endLambda), sumEndY / (1 + endLambda));
				this.calcValues.connectionPoints.start = startConnectionPoint;
				this.calcValues.connectionPoints.end = endConnectionPoint;
			}
		}
		if (this.calcValues.connectionPoints.start && this.calcValues.connectionPoints.end) {
			return this.calcValues.connectionPoints;
		}
		return null;
	}
	ConnectorAlgorithm.prototype.setParentAlgorithm = function (algorithm) {
		this.parentAlgorithm = algorithm;
	};
	ConnectorAlgorithm.prototype.setConnectionDistance = function (value, isStart) {
		if (isStart) {
			this.connectionDistances.begin = value;
		} else {
			this.connectionDistances.end = value;
		}
	};
	ConnectorAlgorithm.prototype.getPointPosition = function (isStart) {
		const param = isStart ? this.params[AscFormat.Param_type_begPts] : this.params[AscFormat.Param_type_endPts];
		if (param) {
			return param[0];
		}
		return AscFormat.ParameterVal_connectorPoint_auto;
	};
	ConnectorAlgorithm.prototype.getAutoEdgePoint = function (isStart) {
		const startBounds = this.startShape.getBounds();
		const endBounds = this.endShape.getBounds();
		const startPoint = this.getShapePoint(startBounds);
		const endPoint = this.getShapePoint(endBounds);
		let guideVector;
		if (isStart) {
			guideVector = new CVector(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
		} else {
			guideVector = new CVector(startPoint.x - endPoint.x, startPoint.y - endPoint.y);
		}
		const bounds = isStart ? startBounds : endBounds;
		return this.getMinShapeEdgePoint(bounds, guideVector);
	};
	ConnectorAlgorithm.prototype.getEllipseRadialEdgePoint = function (radialInfo, bounds, isStart) {
		const cycleAngle = radialInfo.angle;
		const centerPoint = radialInfo.point;
		const radius = radialInfo.radius;
		const shapeRadius = (bounds.r - bounds.l) / 2;
		const shapeAngle =  Math.acos(1 - ((shapeRadius * shapeRadius) / (2 * radius * radius)));
		let angle = cycleAngle;
		if (radialInfo.isClockwise) {
			if (isStart) {
				angle += shapeAngle;
			} else {
				angle -= shapeAngle;
			}
		} else {
			if (isStart) {
				angle -= shapeAngle;
			} else {
				angle += shapeAngle;
			}
		}


		return new CCoordPoint(Math.cos(angle) * radius + centerPoint.x, Math.sin(angle) * radius + centerPoint.y);
	};
	ConnectorAlgorithm.prototype.isPointOnSegment = function (point, startSegment, endSegment) {
		return (point.x > startSegment.x || fAlgDeltaEqual(point.x, startSegment.x)) && (point.x < endSegment.x || fAlgDeltaEqual(point.x, endSegment.x)) &&
			(point.y > startSegment.y || fAlgDeltaEqual(point.y, startSegment.y)) && (point.y < endSegment.y || fAlgDeltaEqual(point.y, endSegment.y));
	}
	ConnectorAlgorithm.prototype.getRectRadialEdgePoint = function (radialInfo, bounds, isStart) {
		const centerPoint = radialInfo.point;
		const radius = radialInfo.radius;
		const isClockwise = radialInfo.isClockwise;

		const ellipseBounds = {
			l: centerPoint.x - radius,
			r: centerPoint.x + radius,
			t: centerPoint.y - radius,
			b: centerPoint.y + radius
		};

		const linePoints = [
			[new CCoordPoint(bounds.l, bounds.t), new CCoordPoint(bounds.r, bounds.t)],
			[new CCoordPoint(bounds.l, bounds.t), new CCoordPoint(bounds.l, bounds.b)],
			[new CCoordPoint(bounds.l, bounds.b), new CCoordPoint(bounds.r, bounds.b)],
			[new CCoordPoint(bounds.r, bounds.t), new CCoordPoint(bounds.r, bounds.b)]
		];
		const rectCenterPoint = this.getShapePoint(bounds);
		for (let i = 0; i < linePoints.length; i += 1) {
			const coords = linePoints[i];
			const paramLine = this.getParametricLinEquation(coords[0], new CVector(coords[1].x - coords[0].x, coords[1].y - coords[0].y));
			const answer = this.resolveParameterLineAndShapeEquation(ellipseBounds, paramLine);
			if (!answer.bError) {
				let point;
				const point1 = new CCoordPoint(paramLine.x + paramLine.ax * answer.x1, paramLine.y + paramLine.ay * answer.x1);
				const point2 = new CCoordPoint(paramLine.x + paramLine.ax * answer.x2, paramLine.y + paramLine.ay * answer.x2);

				if (this.isPointOnSegment(point1, coords[0], coords[1])) {
					point = point1;
				} else if (this.isPointOnSegment(point2, coords[0], coords[1])) {
					point = point2;
				} else {
					continue;
				}
				const diffVector = new CVector(point.x - centerPoint.x, point.y - centerPoint.y);
				const diffAngle = this.getGuideAngle(diffVector);
				if (isStart && isClockwise || !isStart && !isClockwise) {
					if (diffAngle >= 0 && diffAngle < Math.PI / 2) {
						if (point.y > rectCenterPoint.y && point.x < rectCenterPoint.x) {
							return point;
						}
					} else if (diffAngle >= Math.PI / 2 && diffAngle < Math.PI) {
						if (point.y < rectCenterPoint.y && point.x < rectCenterPoint.x) {
							return point;
						}
					} else if (diffAngle >= Math.PI && diffAngle < 3 * Math.PI / 2) {
						if (point.y < rectCenterPoint.y && point.x > rectCenterPoint.x) {
							return point;
						}
					} else {
						if (point.y > rectCenterPoint.y && point.x > rectCenterPoint.x) {
							return point;
						}
					}

				} else {
					if (diffAngle >= 0 && diffAngle < Math.PI / 2) {
						if (point.y < rectCenterPoint.y && point.x > rectCenterPoint.x) {
							return point;
						}
					} else if (diffAngle >= Math.PI / 2 && diffAngle < Math.PI) {
						if (point.y > rectCenterPoint.y && point.x > rectCenterPoint.x) {
							return point;
						}
					} else if (diffAngle >= Math.PI && diffAngle < 3 * Math.PI / 2) {
						if (point.y > rectCenterPoint.y && point.x < rectCenterPoint.x) {
							return point;
						}
					} else {
						if (point.y < rectCenterPoint.y && point.x < rectCenterPoint.x) {
							return point;
						}
					}
				}
			}
		}
		return null;
	};
	ConnectorAlgorithm.prototype.getRadialEdgePoint = function (isStart) {
		const shape = isStart ? this.startShape : this.endShape;
		const radialInfo = this.parentAlgorithm.getRadialConnectionInfo(shape.node);
		if (!radialInfo || radialInfo.radius === 0) {
			return null;
		}

		const bounds = shape.getBounds();
		if (bounds.isEllipse) {
			return this.getEllipseRadialEdgePoint(radialInfo, bounds, isStart);
		}
		return this.getRectRadialEdgePoint(radialInfo, bounds, isStart);
	};
	ConnectorAlgorithm.prototype.getEdgePoint = function (isStart) {
		const type = this.getPointPosition(isStart);
		switch (type) {
			case AscFormat.ParameterVal_connectorPoint_radial:
				return this.getRadialEdgePoint(isStart);
			case AscFormat.ParameterVal_connectorPoint_auto:
			default:
				return this.getAutoEdgePoint(isStart);
		}
	}

	ConnectorAlgorithm.prototype.calculateShapePositions = function (presNode, smartartAlgorithm) {
		presNode.createShadowShape();
		smartartAlgorithm.addConnectorAlgorithm(this);
	}

	ConnectorAlgorithm.prototype.setFirstConnectorShape = function (shape) {
		this.startShape = shape;
	};
	ConnectorAlgorithm.prototype.setLastConnectorShape = function (shape) {
		this.endShape = shape;
	};
	ConnectorAlgorithm.prototype.connectShapes = function () {
		if (this.startShape && this.endShape) {
			if (this.params[AscFormat.Param_type_dim] === AscFormat.ParameterVal_connectorDimension_2D) {
				this.createShapeConnector();
			} else if (this.params[AscFormat.Param_type_dim] === AscFormat.ParameterVal_connectorDimension_1D) {
				this.createLineConnector();
			}
		}
	};
	ConnectorAlgorithm.prototype.getCustomAdjShapeLst = function (shapeType) {
		if (shapeType === AscFormat.LayoutShapeType_shapeType_circularArrow) {
			const customAdjLst = new AscFormat.AdjLst();
			const adj1 = new AscFormat.Adj();
			const adj2 = new AscFormat.Adj();
			const adj3 = new AscFormat.Adj();
			const adj4 = new AscFormat.Adj();
			const adj5 = new AscFormat.Adj();
			adj1.setIdx(1);
			adj2.setIdx(2);
			adj3.setIdx(3);
			adj4.setIdx(4);
			adj5.setIdx(5);
			adj1.setVal(0.05202);
			adj2.setVal(3.36015);
			adj3.setVal(168.65256);
			adj4.setVal(151.98729);
			adj5.setVal(0.06068);
			customAdjLst.addToLst(0, adj1);
			customAdjLst.addToLst(0, adj2);
			customAdjLst.addToLst(0, adj3);
			customAdjLst.addToLst(0, adj4);
			customAdjLst.addToLst(0, adj5);
			return customAdjLst;
		} else if (shapeType !== AscFormat.LayoutShapeType_shapeType_rect) {
			const customAdjLst = new AscFormat.AdjLst();
			const adj1 = new AscFormat.Adj();
			const adj2 = new AscFormat.Adj();
			adj1.setIdx(1);
			adj2.setIdx(2);
			adj1.setVal(0.6);
			adj2.setVal(0.5);
			customAdjLst.addToLst(0, adj1);
			customAdjLst.addToLst(0, adj2);
			return customAdjLst;
		}
	};

	ConnectorAlgorithm.prototype.getConnectorShapeType = function () {
		const endStyle = this.params[AscFormat.Param_type_endSty];
		const beginStyle = this.params[AscFormat.Param_type_begSty];
		if (this.params[AscFormat.Param_type_connRout] === AscFormat.ParameterVal_connectorRouting_curve) {
			if (endStyle === AscFormat.ParameterVal_arrowheadStyle_arr && beginStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_leftRightCircularArrow;
			} else if (endStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_circularArrow;
			} else if (beginStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_leftCircularArrow;
			}
			return AscFormat.LayoutShapeType_shapeType_rect;
		} else {
			if (endStyle === AscFormat.ParameterVal_arrowheadStyle_arr && beginStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_leftRightArrow;
			} else if (endStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_rightArrow;
			} else if (beginStyle === AscFormat.ParameterVal_arrowheadStyle_arr) {
				return AscFormat.LayoutShapeType_shapeType_leftArrow;
			}
			return AscFormat.LayoutShapeType_shapeType_rect;
		}


	}
	ConnectorAlgorithm.prototype.getTemplateConnectorShape = function () {
		const shape = this.parentNode.shape;
		const connectorShape = new ShadowShape();
		connectorShape.shape = shape.shape;

		connectorShape.type = this.getConnectorShapeType();
		connectorShape.customAdj = this.getCustomAdjShapeLst(connectorShape.type);
		connectorShape.cleanParams = {};
		connectorShape.cleanParams.w = shape.cleanParams.w;
		connectorShape.cleanParams.h = shape.cleanParams.h;
		connectorShape.cleanParams.x = shape.cleanParams.x;
		connectorShape.cleanParams.y = shape.cleanParams.y;
		connectorShape.node = this.parentNode;
		return connectorShape;
	};
	ConnectorAlgorithm.prototype.createShapeConnector = function () {
		const connectionPoints = this.getConnectionPoints();
		if (connectionPoints) {
			const startArrowPoint = connectionPoints.start;
			const endArrowPoint = connectionPoints.end;

			const cx = (startArrowPoint.x + endArrowPoint.x) / 2;
			const cy = (startArrowPoint.y + endArrowPoint.y) / 2;

			const arrowVector = new CVector(endArrowPoint.x - startArrowPoint.x, endArrowPoint.y - startArrowPoint.y);

			let width;
			const connectionDistanceResolver = this.parentAlgorithm.parentNode.connectionDistanceResolver;
			const minConnectionDistance = connectionDistanceResolver && connectionDistanceResolver.getConnectionDistance();
			if (connectionDistanceResolver && minConnectionDistance !== -1) {
				width = minConnectionDistance;
			} else {
				width = arrowVector.getDistance();
			}
			const height = this.parentNode.shape.h;

			const x = cx - width / 2;
			const y = cy - height / 2;
			const shape = this.parentNode.shape;
			const connectorShape = this.getTemplateConnectorShape();

			connectorShape.x = x;
			connectorShape.y = y;
			connectorShape.rot = this.getGuideAngle(arrowVector);
			shape.connectorShape = connectorShape;

			const prSet = this.parentNode.getPrSet();
			if (!prSet.getPresStyleLbl()) {
				prSet.setPresStyleLbl("sibTrans2D1");
			}
			const coefficient = width / shape.cleanParams.w;
			this.applyPostAlgorithmSettingsForShape(connectorShape, prSet, coefficient);

			const heightScale = this.parentNode.getHeightScale(true);
			const widthScale = this.parentNode.getWidthScale(true);
			const scaleHeight = height * heightScale;
			const scaleWidth = width * widthScale;
			connectorShape.h = scaleHeight;
			connectorShape.w = scaleWidth;
			connectorShape.x += (width - scaleWidth) / 2;
			connectorShape.y += (height - scaleHeight) / 2;
		}
	};

	ConnectorAlgorithm.prototype.createLineConnector = function () {

	};

	function SpaceAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(SpaceAlgorithm, BaseAlgorithm);
	
	SpaceAlgorithm.prototype.calculateShapePositions = function (presNode) {
		presNode.createShadowShape();
	}

	function TextAlgorithm() {
		BaseAlgorithm.call(this);
	}

	AscFormat.InitClassWithoutType(TextAlgorithm, BaseAlgorithm);

	TextAlgorithm.prototype.calculateShapePositions = function (presNode) {
		presNode.createShadowShape();
	};

	function CompositeAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(CompositeAlgorithm, BaseAlgorithm);

	CompositeAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints(true);
	};
	CompositeAlgorithm.prototype.calculateShapePositions = function (presNode) {
		presNode.createShadowShape(true);
		presNode.shape.isSpacing = false;
	};

	CompositeAlgorithm.prototype.getShapes = function (smartartAlgorithm) {
		smartartAlgorithm.applyColorsDef();
		const shapes = [];
		const shadowShapes = this.parentNode.getShadowShapesByZOrder();
		for (let i = 0; i < shadowShapes.length; i++) {
			const editorShape = shadowShapes[i].getEditorShape();
			if (editorShape) {
				shapes.push(editorShape);
			}
		}
		return shapes;
	}

function PresNode(presPoint, contentNode) {
	this.parent = null;
	this.presPoint = presPoint || null;
	this.childs = [];
	this.factRules = {};
	this.constr = {};
	this.algorithm = null;
	this.node = contentNode;
	this.contentNodes = [];
	this.layoutInfo = {
		constrLst: null,
		ruleLst: null,
		shape: null
	};
	this.adaptConstr = {};
	this.nodeConstraints = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	};

	this.scaleMainConstraintCoefficient = {
		width: 1,
		height: 1
	};
	this.isHideLastTrans = true;
	this.connectionDistanceResolver = null;
}
	PresNode.prototype.isMainElement = function () {
		return this.layoutInfo.shape.type !== AscFormat.LayoutShapeType_outputShapeType_conn &&
			this.layoutInfo.shape.type !== AscFormat.LayoutShapeType_outputShapeType_none;
	}
	PresNode.prototype.isSibNode = function () {
		return this.node.isSibNode();
	};
	PresNode.prototype.isParNode = function () {
		return this.node.isParNode();
	};
	PresNode.prototype.isContentNode = function () {
		return this.node.isContentNode();
	};
	PresNode.prototype.getShadowShapesByZOrder = function () {
		const shapes = [];
		const elements = [this];
		while (elements.length) {
			const tempElements = [];
			const element = elements.pop();
			if (element.shape) {
				shapes.push(element.shape);
			}
			for (let i = 0; i < element.childs.length; i += 1) {
				const child = element.childs[i];
				tempElements.push(child);
			}
			tempElements.sort(function (a, b) {
				let aIndex = 0;
				let bIndex = 0;
				if (a.shape) {
					aIndex = a.shape.shape.zOrderOff;
				}
				if (b.shape) {
					bIndex = b.shape.shape.zOrderOff;
				}
				return aIndex - bIndex;
			});
			elements.push.apply(elements, tempElements);
		}
		shapes.reverse();
		return shapes;
	}
	PresNode.prototype.setWidthScaleConstrCoefficient = function (coefficient) {
		this.scaleMainConstraintCoefficient.width = coefficient;
	}
	PresNode.prototype.setHeightScaleConstrCoefficient = function (coefficient) {
		this.scaleMainConstraintCoefficient.height = coefficient;
	}
	PresNode.prototype.getChildIndex = function (child) {
		for (let i = 0; i < this.childs.length; i++) {
			if (this.childs[i] === child) {
				return i;
			}
		}
	}
	PresNode.prototype.getNeighbor = function () {
		const parent = this.parent;
		const index = parent.getChildIndex(this);
		for (let i = index + 1; i < parent.childs.length; i += 1) {
			const child = parent.childs[i];
			const shape = child.shape;
			if (!shape.isSpacing) {
				return child;
			}
		}

		for (let i = index - 1; i >= 0; i -= 1) {
			const child = parent.childs[i];
			const shape = child.shape;
			if (!shape.isSpacing) {
				return child;
			}
		}

		return this;
	};
	PresNode.prototype.moveTo = function (deltaX, deltaY) {
		this.forEachDesOrSelf(function (node) {
			const shape = node.shape;
			if (shape) {
				shape.x += deltaX;
				shape.y += deltaY;
			}
		});
	};
	PresNode.prototype.changeShapeSizes = function (coefficient, props) {
	this.forEachDesOrSelf(function (presNode) {
		const shape = presNode.shape;
		if (shape) {
			shape.changeSize(coefficient, props);
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
	PresNode.prototype.setRules = function () {
		const ruleLst = this.layoutInfo.ruleLst;
		if (!ruleLst) {
			return;
		}
		let cacheFor = {};
		for (let i = 0; i < ruleLst.length; i++) {
			const rule = ruleLst[i];
			if (!cacheFor[rule.for]) {
				cacheFor[rule.for] = [];
				this.getNodesByAxis(cacheFor[rule.for], rule.for);
			}
			const nodes = cacheFor[rule.for];
			for (let j = 0; j < nodes.length; j++) {
				nodes[j].setRule(rule);
			}
		}
	};
	PresNode.prototype.getFactRule = function (type) {
			return this.factRules[type];
	};
	PresNode.prototype.setRule = function (rule) {
		const node = this.getConstraintNode(rule.forName, rule.ptType.getVal());
		if (node) {
			if (AscFormat.isRealNumber(rule.fact)) {
				if (rule.val !== rule.val) {
					node.factRules[rule.type] = rule.fact;
				}
			}
		}
	};
	PresNode.prototype.setConstraints = function (isAdapt) {
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
					nodes[0].setConstraintByNode(constr, nodes[0], isAdapt);
				} else {
					for (let j = 0; j < nodes.length; j++) {
						const node = nodes[j];
						node.setConstraintByNode(constr, this, isAdapt);
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
							if (nodes[k].setConstraintByNode(constr, refNodes[j], isAdapt)) {
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

	PresNode.prototype.getConstraintNode = function (forName, ptType) {
		let node = this;
		if (forName) {
			node = this.checkName(forName);
		}
		return node && node.checkPtType(ptType);
	};

	PresNode.prototype.setConstraintByNode = function (constr, node, isAdapt) {
		let aspectRatio;
		if (constr.for === AscFormat.Constr_for_ch) {
			aspectRatio = node.getAspectRatio();
		}

		const refNode = node.getConstraintNode(constr.refForName, constr.refPtType.getVal());
		if (!refNode) {
			return false;
		}
		const constrNode = this.getConstraintNode(constr.forName, constr.ptType.getVal());
		if (constrNode) {
			const constrVal = refNode.getRefConstr(constr, aspectRatio, isAdapt);
			if (!AscFormat.isRealNumber(constrVal)) {
				return false;
			}
			constrNode.setConstraint(constr, constrVal, isAdapt);
			constrNode.setParamConstraint(constr, refNode);
			return true;
		}
		return false;
	};
	PresNode.prototype.setParamConstraint = function (constr, refNode) {
		switch (constr.type) {
			case AscFormat.Constr_type_connDist: {
				if (constr.for !== AscFormat.Constr_for_self) {
					if (this.algorithm) {
						if (!refNode.connectionDistanceResolver) {
							refNode.connectionDistanceResolver = new CConnectionDistanceResolver();
						}
						refNode.connectionDistanceResolver.addConnection(this.algorithm);
					}
				}
			}
		}
	}
	PresNode.prototype.setConstraint = function (constr, value, isAdapt) {
		let factor = this.getFactRule(constr.type);
		if (factor === undefined) {
			factor = constr.fact;
		}
		value *= factor;
		let constrObject;
		if (isAdapt) {
			constrObject = this.adaptConstr;
			if (constr.for !== AscFormat.Constr_for_self && constr.refFor === AscFormat.Constr_for_self) {
				if (constr.type === AscFormat.Constr_type_h) {
					if (constr.refType === AscFormat.Constr_type_w) {
						value = value * this.scaleMainConstraintCoefficient.width/* * this.scaleMainConstraintCoefficient.height*/;
					} else {
						value = value * this.scaleMainConstraintCoefficient.height;
					}
				} else if (constr.type === AscFormat.Constr_type_w) {
					if (constr.refType === AscFormat.Constr_type_h) {
						value = value * this.scaleMainConstraintCoefficient.width/* * this.scaleMainConstraintCoefficient.height*/;
					} else {
						value = value * this.scaleMainConstraintCoefficient.width;
					}
				}
			}
		} else {
			constrObject = this.constr;
		}

		switch (constr.op) {
			case AscFormat.Constr_op_gte: {
				const oldValue = constrObject[constr.type];
				if (oldValue !== undefined && value < oldValue) {
					return;
				}
				break;
			}
			case AscFormat.Constr_op_lte: {
				const oldValue = constrObject[constr.type];
				if (oldValue !== undefined && value > oldValue) {
					return;
				}
				break;
			}
			default: {
				break;
			}
		}

		constrObject[constr.type] = value;
		switch (constr.type) {
			case AscFormat.Constr_type_b: {
				const height = constrObject[AscFormat.Constr_type_h];
				if (height !== undefined) {
					constrObject[AscFormat.Constr_type_t] = constrObject[AscFormat.Constr_type_b] - height;
				}
				break;
			}
			case AscFormat.Constr_type_r: {
				const width = constrObject[AscFormat.Constr_type_w];
				if (width !== undefined) {
					constrObject[AscFormat.Constr_type_l] = constrObject[AscFormat.Constr_type_r] - width;
				}
				break;
			}
			case AscFormat.Constr_type_begPad:
			case AscFormat.Constr_type_endPad: {
				if (constr.refType === AscFormat.Constr_type_connDist) {
					if (this.algorithm) {
						this.algorithm.setConnectionDistance(constr.fact, constr.type === AscFormat.Constr_type_begPad);
					}
				} else {
					this.algorithm.setConnectionDistance(value, constr.type === AscFormat.Constr_type_begPad);
				}
				break;
			}
			default: {
				break;
			}
		}
	};
	PresNode.prototype.getRefConstr = function (constr, aspectRatio, isAdapt) {
		let constrObject;
		if (isAdapt) {
			constrObject = this.adaptConstr;
		} else {
			constrObject = this.constr;
		}
		let value;
		if (constr.refFor === AscFormat.Constr_for_self && constrObject[constr.type] !== undefined && constr.refType === AscFormat.Constr_type_none) {
			value = constrObject[constr.type];
		} else if (constrObject[constr.refType]) {
			value = constrObject[constr.refType];
		}
		if (value !== undefined) {
			if (aspectRatio) {
				switch (constr.refType) {
/*				case AscFormat.Constr_type_h:
					const width = constrObject[AscFormat.Constr_type_w];
					if (width !== undefined) {
						const aspectHeight = value * aspectRatio;
						if (width > aspectHeight) {
							value = aspectHeight;
						}
					}
					break;*/
					case AscFormat.Constr_type_w:
						const height = constrObject[AscFormat.Constr_type_h];
						if (height !== undefined) {
							const aspectHeight = height * aspectRatio;
							if (aspectHeight < value) {
								value = aspectHeight;
							}
						}
						break;
					default:
						break;
				}
			}
		} else {
			switch (constr.refType) {
				case AscFormat.Constr_type_b: {
					const top = constrObject[AscFormat.Constr_type_t];
					const height = constrObject[AscFormat.Constr_type_h];
					if (AscFormat.isRealNumber(top) && AscFormat.isRealNumber(height)) {
						value = top + height;
						constrObject[AscFormat.Constr_type_b] = value;
					}
					break;
				}
				default: {
					break;
				}
			}
			if (value === undefined) {
				value = constr.val;
			}
		}

		return value;
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
	PresNode.prototype.getAdaptConstr = function (type) {
		return this.adaptConstr[type] || 0;
	}

	PresNode.prototype.getDirection = function () {
		return this.presPoint.getDirection();
	}

	PresNode.prototype.checkName = function (name) {
		if (this.getPresName() === name) {
			return this;
		}
	}

	PresNode.prototype.startAlgorithm = function (smartartAlgorithm) {
		if (this.algorithm) {
			this.algorithm.calculateShapePositions(this, smartartAlgorithm);
		}
	}

	PresNode.prototype.calcScaleCoefficients = function (smartartAlgorithm) {
		if (this.algorithm) {
			this.algorithm.calcScaleCoefficients(this, smartartAlgorithm);
		}
	}

	PresNode.prototype.setLayoutConstraints = function (lst) {
		this.layoutInfo.constrLst = lst;
	};
	PresNode.prototype.setLayoutRules = function (lst) {
		this.layoutInfo.ruleLst = lst;
	};
	PresNode.prototype.checkBounds = function (bounds) {
		if (this.nodeConstraints.x < bounds.l) {
			bounds.l = this.nodeConstraints.x;
		}
		if (this.nodeConstraints.y < bounds.t) {
			bounds.t = this.nodeConstraints.y;
		}
		const right = this.nodeConstraints.x + this.nodeConstraints.width;
		if (right > bounds.r) {
			bounds.r = right;
		}
		const bottom = this.nodeConstraints.y + this.nodeConstraints.height;
		if (bottom > bounds.b) {
			bounds.b = bottom;
		}
	}
	PresNode.prototype.calcNodeConstraints = function (isComposite) {
		if (isComposite && this.childs.length) {
			const childBounds = {
					b: 0,
					t: 0,
					l: 0,
					r: 0
			};
			for (let i = 0; i < this.childs.length; i++) {
				const child = this.childs[i];
				child.checkBounds(childBounds);
			}
			const customBoundsWidth = childBounds.r - childBounds.l;
			const customBoundsHeight = childBounds.b - childBounds.t;

			this.nodeConstraints.width = customBoundsWidth;
			this.nodeConstraints.height = customBoundsHeight;
		} else {
			const widthScale = this.getWidthScale();
			const heightScale = this.getHeightScale();
			const width = this.getConstr(AscFormat.Constr_type_w);
			const height = this.getConstr(AscFormat.Constr_type_h);
			const scaleWidth = width * widthScale;
			const scaleHeight = height * heightScale;
			const x = this.getConstr(AscFormat.Constr_type_l);
			const y = this.getConstr(AscFormat.Constr_type_t);
			this.nodeConstraints.width = scaleWidth;
			this.nodeConstraints.height = scaleHeight;
			this.nodeConstraints.x = x - (scaleWidth - width) / 2;
			this.nodeConstraints.y = y - (scaleHeight - height) / 2;
		}
	}
	PresNode.prototype.createShadowShape = function (isComposite) {
		this.shape = new ShadowShape(this);
		this.shape.initFromShape(this.layoutInfo.shape);
		if (isComposite && this.childs.length) {
			const bounds = {
				custom: {
					l: 0,
					r: 0,
					t: 0,
					b: 0
				},
				clean: {
					l: 0,
					r: 0,
					t: 0,
					b: 0
				}
			};
			for (let i = 0; i < this.childs.length; i += 1) {
				this.childs[i].checkShapeBounds(bounds);
			}


			this.shape.w = bounds.custom.r - bounds.custom.l;
			this.shape.h = bounds.custom.b - bounds.custom.t;

			this.shape.cleanParams.w = bounds.clean.r - bounds.clean.l;
			this.shape.cleanParams.h = bounds.clean.b - bounds.clean.t;
		}
	};
	PresNode.prototype.checkShapeBounds = function (bounds) {
		if (this.shape) {
			if (this.shape.x < bounds.custom.l) {
				bounds.custom.l = this.shape.x;
			}
			if (this.shape.y < bounds.custom.t) {
				bounds.custom.t = this.shape.y;
			}
			const right = this.shape.x + this.shape.w;
			if (right > bounds.custom.r) {
				bounds.custom.r = right;
			}
			const bottom = this.shape.y + this.shape.h;
			if (bottom > bounds.custom.b) {
				bounds.custom.b = bottom;
			}

			const cleanParams = this.shape.cleanParams;
			if (cleanParams.x < bounds.clean.l) {
				bounds.clean.l = cleanParams.x;
			}
			if (cleanParams.y < bounds.clean.t) {
				bounds.clean.t = cleanParams.y;
			}
			const cleanRight = cleanParams.x + cleanParams.w;
			if (cleanRight > bounds.clean.r) {
				bounds.clean.r = cleanRight;
			}
			const cleanBottom = cleanParams.y + cleanParams.h;
			if (cleanBottom > bounds.clean.b) {
				bounds.clean.b = cleanBottom;
			}
		}
	}

	PresNode.prototype.getHeightScale = function (force) {
		const node = this.node;
		if (!force && node.isSibNode()) {
			return 1;
		}
		const prSet = this.getPrSet();
		if (prSet) {
			return prSet.custScaleY || 1;
		}
		return 1;
	}

	PresNode.prototype.getWidthScale = function (force) {
		const node = this.node;
		if (!force && node.isSibNode()) {
			return 1;
		}
		const prSet = this.getPrSet();
		if (prSet) {
			return prSet.custScaleX || 1;
		}
		return 1;
	}

	PresNode.prototype.initRootConstraints = function (smartArt) {
		this.constr[AscFormat.Constr_type_w] = smartArt.spPr.xfrm.extX;
		this.constr[AscFormat.Constr_type_h] = smartArt.spPr.xfrm.extY;
		this.adaptConstr[AscFormat.Constr_type_w] = smartArt.spPr.xfrm.extX;
		this.adaptConstr[AscFormat.Constr_type_h] = smartArt.spPr.xfrm.extY;
		this.nodeConstraints.width = smartArt.spPr.xfrm.extX;
		this.nodeConstraints.height = smartArt.spPr.xfrm.extY;
	};
	PresNode.prototype.getModelId = function () {
		return this.presPoint.getModelId();
	};

function CConnectionDistanceResolver() {
	this.connectionAlgorithms = [];
	this.connectionDistance = null;
}

	CConnectionDistanceResolver.prototype.calcChildConnectionDistance = function () {
		this.connectionDistance = -1;
		const firstAlg = this.connectionAlgorithms[0];
		if (firstAlg) {
			const points = firstAlg.getConnectionPoints();
			if (points) {
				const v = new CVector(points.end.x - points.start.x, points.end.y - points.start.y);
				this.connectionDistance = v.getDistance();
			} else {
				return;
			}
		}
		for (let i = 1; i < this.connectionAlgorithms.length; i++) {
			const alg = this.connectionAlgorithms[i];
			const points = alg.getConnectionPoints();
			if (points) {
				const v = new CVector(points.end.x - points.start.x, points.end.y - points.start.y);
				const distance = v.getDistance();
				if (distance < this.connectionDistance) {
					this.connectionDistance = distance;
				}
			}
		}
	};
	CConnectionDistanceResolver.prototype.getConnectionDistance = function () {
		if (this.connectionDistance === null) {
			this.calcChildConnectionDistance();
		}
		return this.connectionDistance;
	};
	CConnectionDistanceResolver.prototype.addConnection = function (algorithm) {
		this.connectionAlgorithms.push(algorithm);
	}













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

