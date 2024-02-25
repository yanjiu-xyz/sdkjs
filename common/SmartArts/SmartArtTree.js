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
	const IS_DEBUG_DRAWING = true;
	const IS_ADD_HTML = false;
	AscCommon.IS_GENERATE_SMARTART_ON_OPEN = false;

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
	const radToDeg = 1 / degToRad;
	const algDelta = 1e-13;
	const bulletFontSizeCoefficient = 51 / 65;

	function checkPositionBounds(position, bounds) {
		if (position.x < bounds.l) {
			bounds.l = position.x;
		}
		if (position.y < bounds.t) {
			bounds.t = position.y;
		}
		const right = position.x + position.width;
		if (right > bounds.r) {
			bounds.r = right;
		}
		const bottom = position.y + position.height;
		if (bottom > bounds.b) {
			bounds.b = bottom;
		}
	}
	function checkBounds(firstBounds, secondBounds) {
		if (secondBounds.l < firstBounds.l) {
			firstBounds.l = secondBounds.l;
		}
		if (secondBounds.t < firstBounds.t) {
			firstBounds.t = secondBounds.t;
		}
		if (secondBounds.r > firstBounds.r) {
			firstBounds.r = secondBounds.r;
		}
		if (secondBounds.b > firstBounds.b) {
			firstBounds.b = secondBounds.b;
		}
	}

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
	CVector.getVectorByAngle = function (angle) {
		return new CVector(Math.cos(angle), Math.sin(angle));
	};
	CVector.prototype.getDistance = function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};
	CVector.prototype.getDiffVector = function (vector) {
		return new CVector(this.x - vector.x, this.y - vector.y);
	};
	CVector.prototype.multiply = function (value) {
		this.x *= value;
		this.y *= value;
	};
	CVector.prototype.getAngle = function () {
		const x = this.x;
		const y = this.y;
		const vectorLength = Math.sqrt(x * x + y * y);
		if (vectorLength !== 0) {
			const angle = Math.acos(x / vectorLength);
			if (y > 0) {
				return angle;
			}
			return AscFormat.normalizeRotate(-angle);
		}
		return null;
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
		curPresNode.checkMoveWith();
		smartartAlgorithm.removeCurrentPresNode(curPresNode);
	}
	LayoutNode.prototype.getForEachMap = function () {
		const forEachMap = {};
		const elements = [this];
		while (elements.length) {
			const element = elements.pop();

			const list = element.list;
			if (list) {
				elements.push.apply(elements, list);
			}
			if (element instanceof ForEach) {
				forEachMap[element.name] = element;
			}
		}
		return forEachMap;
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
				const depth = node.isParNode() ? node.depth - 1 : node.depth;
				return this.funcMaxDepth(nodes, depth);
			case AscFormat.If_func_pos:
				return this.funcPos(nodes, node);
			case AscFormat.If_func_posEven:
				return this.funcPosEven(nodes, node);
			case AscFormat.If_func_posOdd:
				return this.funcPosOdd(nodes, node);
			case AscFormat.If_func_revPos:
				return this.funcRevPos(nodes, node);
			case AscFormat.If_func_var:
				return this.funcVar(smartArtAlgorithm);
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
		return this.check(conditionValue, currentNode.depth);
	};
	If.prototype.funcMaxDepth = function (nodes, curDepth) {
		const conditionValue = parseInt(this.getConditionValue(), 10);
		let maxDepth = curDepth;
		for (let i = 0; i < nodes.length; i++) {
			const depth = nodes[i].getChildDepth();
			if (depth > maxDepth) {
				maxDepth = depth;
			}
		}
		return this.check(conditionValue, maxDepth - curDepth);
	};
	If.prototype.getFuncVarNode = function (smartArtAlgorithm) {
		switch (this.arg) {
			case AscFormat.If_arg_dir: {
				return smartArtAlgorithm.dataRoot;
			}
			default:
				return smartArtAlgorithm.getCurrentNode();
		}
	};
	If.prototype.funcVar = function (smartArtAlgorithm) {
		const node = this.getFuncVarNode(smartArtAlgorithm);
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
			case AscFormat.If_arg_hierBranch: {
				return this.getConditionHierBranchValue();
			}
			default:
				return this.val;
		}
	};
	If.prototype.getConditionHierBranchValue = function () {
		switch (this.val) {
			case 'l':
				return AscFormat.HierBranch_val_l;
			case 'r':
				return AscFormat.HierBranch_val_r;
			case 'hang':
				return AscFormat.HierBranch_val_hang;
			case 'init':
				return AscFormat.HierBranch_val_init;
			case 'std':
				return AscFormat.HierBranch_val_std;
			default:
				break;
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
		const refForEach = smartartAlgorithm.getForEach(this.ref);
		if (refForEach) {
			refForEach.executeAlgorithm(smartartAlgorithm);
			return;
		}
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
	};

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
			case AscFormat.Alg_type_pyra: {
				algorithm = new PyramidAlgorithm();
				break;
			}
			case AscFormat.Alg_type_hierRoot: {
				algorithm = new HierarchyRootAlgorithm();
				break;
			}
			case AscFormat.Alg_type_hierChild: {
				algorithm = new HierarchyChildAlgorithm();
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
		this.moveShapeSettings = [];
		this.sizeCoefficients = {
			widthCoefficient: 1,
			heightCoefficient: 1
		};
		this.forEachMap = null;
		this.initDataTree();
	}
	SmartArtAlgorithm.prototype.addSettingsForMove = function (settings) {
		this.moveShapeSettings.push(settings);
	};
	SmartArtAlgorithm.prototype.applySettingsForMove = function () {
		while (this.moveShapeSettings.length) {
			const settings = this.moveShapeSettings.pop();
			const coefficient = settings.coefficient;
			const shape = settings.shape;

			const presNode = shape.node;
			const prSet = presNode.getPrSet();
			let neighborWidth = null;
			let neighborHeight = null;
			const neighbor = presNode.getNeighbor();
			const neighborShape = neighbor.shape;
/*			if (neighborShape) {
				if (presNode.node.isSibNode()) {
					neighborHeight = neighborShape.cleanParams.height;
				} else {
					neighborWidth = neighborShape.cleanParams.width;
				}
			}*/
			if (prSet) {
				let offX = 0;
				let offY = 0;
				if (shape.radialVector) {
					const custScaleRadius = prSet.custRadScaleRad === null ? 1 : prSet.custRadScaleRad;
					const custScaleAngle = prSet.custRadScaleInc === null ? 0 : prSet.custRadScaleInc;
					if (custScaleRadius !== 1 || custScaleAngle !== 0) {

						const defaultRadius = shape.radialVector.getDistance();
						const defaultAngle = shape.radialVector.getAngle();
						const shapeCenterPoint = new CCoordPoint(shape.x + shape.width / 2, shape.y + shape.height / 2);
						const centerPoint = new CCoordPoint(shapeCenterPoint.x - shape.radialVector.x, shapeCenterPoint.y - shape.radialVector.y);
						const customRadius = defaultRadius * custScaleRadius;
						const custAngle = AscFormat.normalizeRotate(defaultAngle + custScaleAngle * shape.incAngle);
						const custVector = CVector.getVectorByAngle(custAngle);
						custVector.multiply(customRadius);
						const custCenterPoint = new CCoordPoint(custVector.x + centerPoint.x, custVector.y + centerPoint.y);
						offX = custCenterPoint.x - shape.width / 2 - shape.x;
						offY = custCenterPoint.y - shape.height / 2 - shape.y;
					}
				} else {
					if (prSet.custLinFactNeighborX) {
						const width = neighborWidth !== null ? neighborWidth : shape.cleanParams.width;
						offX += width * prSet.custLinFactNeighborX * coefficient;
					}
					if (prSet.custLinFactX) {
						offX += shape.cleanParams.width * prSet.custLinFactX * coefficient;
					}
					if (prSet.custLinFactNeighborY) {
						const height = neighborHeight !== null ? neighborHeight : shape.cleanParams.height;
						offY += height * prSet.custLinFactNeighborY * coefficient;
					}
					if (prSet.custLinFactY) {
						offY += shape.cleanParams.height * prSet.custLinFactY * coefficient;
					}
				}
				shape.moveTo(offX, offY);
			}
		}
	};
	SmartArtAlgorithm.prototype.getForEach = function (ref) {
		return this.forEachMap[ref];
	};
	SmartArtAlgorithm.prototype.setWidthScaleCoefficient = function (coefficient) {
		this.sizeCoefficients.widthCoefficient = coefficient;
	};
	SmartArtAlgorithm.prototype.setHeightScaleCoefficient = function (coefficient) {
		this.sizeCoefficients.heightCoefficient = coefficient;
	};
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
						if (mainShape.connectorShape) {
							mainShape.connectorShape.setFill(AscFormat.CreateNoFillUniFill());
							mainShape.connectorShape.setLn(colorStyleLbl.getShapeLn(i, mainShape.connectorShape));
						} else {
							colorShape.setFill(colorStyleLbl.getShapeFill(i, mainShape));
							colorShape.setLn(colorStyleLbl.getShapeLn(i, mainShape));
						}
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
		presNode.moveWith = layoutNode.moveWith;
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
		this.forEachMap = layoutNode.getForEachMap();
		layoutNode.executeAlgorithm(this);

		this.presRoot = mockPresNode.childs[0];
		this.presRoot.parent = null;
		this.presRoot.initRootConstraints(this.smartart, this);
		this.removeCurrentPresNode();
		this.removeCurrentNode();

		this.calcRules();
		this.calcConstraints();
		this.calcScaleCoefficients();
		this.presRoot.initRootConstraints(this.smartart, this);
		this.calcAdaptedConstraints();
		this.executeAlgorithms();
	};
	SmartArtAlgorithm.prototype.calcScaleCoefficients = function () {
		const oThis = this;
		this.forEachPresFromBottom(function (presNode) {
			presNode.startAlgorithm(oThis, true);
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
		this.applySettingsForMove();
		this.generateConnectors();
		this.applySettingsForMove();
		this.forEachPresFromTop(function (presNode) {
			oThis.addToColorCheck(presNode);
		});
	};
	SmartArtAlgorithm.prototype.generateConnectors = function () {
		while (this.connectorAlgorithmStack.length) {
			const connectorAlgorithm = this.connectorAlgorithmStack.pop();
			connectorAlgorithm.connectShapes(this);
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
		this.depth = AscFormat.isRealNumber(depth) ? depth : null;
	}
	SmartArtDataNodeBase.prototype.getDirection = function () {};
	SmartArtDataNodeBase.prototype._getHierBranchValue = function () {
		if (this.presNode) {
			const presPoint = this.presNode.presPoint;
			return presPoint && presPoint.getHierBranchValue();
		}
	};
	SmartArtDataNodeBase.prototype.getHierBranch = function () {
		return this._getHierBranchValue();
	};
	SmartArtDataNodeBase.prototype.getFuncVarValue = function (type) {
		switch (type) {
			case AscFormat.If_arg_dir:
				return this.getDirection();
			case AscFormat.If_arg_hierBranch:
				return this.getHierBranch();
		}
	};
	SmartArtDataNodeBase.prototype.getPresName = function () {
		return this.presNode && this.presNode.getPresName();
	};
	SmartArtDataNodeBase.prototype.getPtType = function () {
		return this.point.type;
	}

	SmartArtDataNodeBase.prototype.getNodesByAxis = function (nodes, axis, ptType) {
		nodes = nodes || [];
		switch (axis) {
			case AscFormat.AxisType_value_root: {
				this.getNodesByRoot(nodes, ptType);
				break;
			}
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
			case AscFormat.AxisType_value_precedSib: {
				this.getNodesByPrecedSib(nodes, ptType);
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
	SmartArtDataNodeBase.prototype.getNodesByRoot = function (nodes, ptType) {
		let curNode = this;
		while (curNode && !curNode.isRoot()) {
			curNode = curNode.parent;
		}
		if (curNode && curNode.isRoot()) {
			const needNode = curNode.getNodeByPtType(ptType);
			if (needNode) {
				nodes.push(needNode);
			}
		}
	}
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
	SmartArtDataNodeBase.prototype.getNodesByPrecedSib = function (nodes, ptType) {
		const parent = this.parent;
		if (parent) {
			for (let i = 0; i < parent.childs.length; i++) {
				if (parent.childs[i] === this) {
					if (ptType === AscFormat.ElementType_value_parTrans) {
						const needNode = parent.childs[i].getNodeByPtType(ptType);
						if (needNode) {
							nodes.push(needNode);
						}
					}
					break;
				} else {
					const needNode = parent.childs[i].getNodeByPtType(ptType);
					if (needNode) {
						nodes.push(needNode);
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
	SmartArtDataNodeBase.prototype.isNode = function () {
		return this.point.getType() === AscFormat.Point_type_node;
	};
	SmartArtDataNodeBase.prototype.isAsst = function () {
		return this.point.getType() === AscFormat.Point_type_asst;
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
	SmartArtParDataNode.prototype.getDirection = function () {
		return this.parent.getDirection();
	};
	SmartArtParDataNode.prototype.getHierBranch = function () {
		let node = this;
		while (node) {
			const val = node._getHierBranchValue();
			if (AscFormat.isRealNumber(val)) {
				return val;
			}
			node = node.parent;
		}
		return null;
	};
	SmartArtParDataNode.prototype.getParent = function () {
		return this.parent && this.parent.parent;
	}
	function SmartArtDataNode(mainPoint, depth) {
		SmartArtDataNodeBase.call(this, mainPoint, depth);
		this.sibNode = null;
		this.parNode = null;
		this.childDepth = null;
	}
	AscFormat.InitClassWithoutType(SmartArtDataNode, SmartArtDataNodeBase);
	SmartArtDataNode.prototype.getPointType = function () {
		return this.point.getType();
	}

	SmartArtDataNode.prototype.getDirection = function () {
		return this.presNode && this.presNode.getDirection();
	}

	SmartArtDataNode.prototype.getChildDepth = function () {
		if (this.childDepth === null) {
			let maxDepth = this.depth;
			const tempNodes = [this];
			while (tempNodes.length) {
				const node = tempNodes.pop();
				if (node.depth > maxDepth) {
					maxDepth = node.depth;
				}
				tempNodes.push.apply(tempNodes, node.childs);
			}
			this.childDepth = maxDepth;
		}
		return this.childDepth;
	};
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
				if (this.isNode()) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_parTrans:
				return this.parNode;
			case AscFormat.ElementType_value_all:
				return this;
			case AscFormat.ElementType_value_asst:
				if (this.isAsst()) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_doc:
				if (this.isRoot()) {
					return this;
				}
				break;

			case AscFormat.ElementType_value_nonAsst:
				if (!this.isAsst()) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_nonNorm:
				break;
			case AscFormat.ElementType_value_norm:
				break;
			case AscFormat.ElementType_value_pres:
				break;
			default:
				return this;
		}
	}

	SmartArtDataNode.prototype.getSibName = function () {
		return this.sibNode.getPresName();
	};
	SmartArtDataNode.prototype.getParName = function () {
		return this.parNode.getPresName();
	};

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

	function Position(node) {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.node = node;
		this.cleanParams = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	}
	Position.prototype.initFromShape = function () {

	};
	Position.prototype.moveTo = function (dx, dy) {
		this.node.moveTo(dx, dy, true);
	};
	Position.prototype.checkBounds = function (bounds) {
		checkPositionBounds(this, bounds);
	};
	Position.prototype.getBounds = function () {
		return {
			b: this.y + this.height,
			t: this.y,
			l: this.x,
			r: this.x + this.width,
		};
	};
	function ShadowShape(node) {
		Position.call(this, node);
		this.rot = 0;
		this.type = AscFormat.LayoutShapeType_outputShapeType_none;
		this.ln = null;
		this.fill = null;
		this.isSpacing = true;
		this.shape = null;
		this.calcInfo = null;
		this.connectorShape = null;
		this.customAdj = null;
		this.customGeom = [];
		this.radialVector = null;
	}
	AscFormat.InitClassWithoutType(ShadowShape, Position);
	ShadowShape.prototype.moveTo = function (dX, dY) {
		this.node.moveTo(dX, dY, false);
	};
	ShadowShape.prototype.checkBounds = function (bounds) {
		checkPositionBounds(this, bounds);
	};
	ShadowShape.prototype.getBounds = function () {
		const bounds = Position.prototype.getBounds.call(this);
		bounds.isEllipse = this.type === AscFormat.LayoutShapeType_shapeType_ellipse;
		return bounds;
	};
	ShadowShape.prototype.setCalcInfo = function () {
		this.calcInfo = {
			isChecked: false
		};
	};
	ShadowShape.prototype.changeSize = function (coefficient, props) {
		props = props || {};
		this.x *= coefficient;
		this.width *= coefficient;
		if (props.changeHeight !== false) {
			this.y *= coefficient;
			this.height *= coefficient;
		}
	}
	ShadowShape.prototype.initSizesFromConstraints = function () {

	}
	ShadowShape.prototype.initFromShape = function (shape) {
		this.shape = shape;
		if (!(shape.hideGeom && (this.node.algorithm instanceof SpaceAlgorithm))) {
			this.type = shape.type;
			this.isSpacing = this.type === AscFormat.LayoutShapeType_outputShapeType_none;
		}

	}

	ShadowShape.prototype.setFill = function (fill) {
		this.fill = fill;
	};

	ShadowShape.prototype.setLn = function (ln) {
		this.ln = ln;
	}

	ShadowShape.prototype.getEditorLine = function () {
		const initObjects = AscFormat.CShape.getInitObjects();
		const parentObjects = initObjects.parentObjects;
		if (!parentObjects) {
			return null;
		}
		const shapeTrack = new AscFormat.NewShapeTrack("", this.x, this.y, AscFormat.GetDefaultTheme(), parentObjects.theme, parentObjects.master, parentObjects.layout, parentObjects.slide, initObjects.page);
		shapeTrack.track({}, this.x + this.width, this.y + this.height);
		const shape = shapeTrack.getShape(false, initObjects.drawingDocument, null);
		shape.spPr.xfrm.setExtX(this.width);
		shape.spPr.xfrm.setExtY(this.height);
		shape.setBDeleted(false);
		shape.setParent(initObjects.parent);
		shape.setWorksheet(initObjects.worksheet);

		const geometry = shape.spPr && shape.spPr.geometry;
		for (let i = 0; i < this.customGeom.length; i += 1) {
			const custCommand = this.customGeom[i];
			for (let j = 1; j < custCommand.length; j++) {
				custCommand[j] = String(custCommand[j] * 36000 >> 0);
			}
			geometry.AddPathCommand.apply(geometry, custCommand);
		}
		this.applyPostEditorSettings(shape);
		return shape;
	};
	ShadowShape.prototype.getEditorShape = function (isLine) {
		if (this.connectorShape) {
			return this.connectorShape.getEditorShape(this.connectorShape.type === AscFormat.LayoutShapeType_outputShapeType_conn);
		}

		if (isLine) {
			return this.getEditorLine();
		} else {
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
			shapeTrack.track({}, this.x + this.width, this.y + this.height);
			const shape = shapeTrack.getShape(false, initObjects.drawingDocument, null);
			shape.spPr.xfrm.setExtX(this.width);
			shape.spPr.xfrm.setExtY(this.height);
			shape.setBDeleted(false);
			shape.setParent(initObjects.parent);
			shape.setWorksheet(initObjects.worksheet);

			this.applyAdjLst(shape);
			this.applyPostEditorSettings(shape);
			return shape;
		}
	}
	ShadowShape.prototype.getAdjValueWithApplyFactor = function (val) {
		switch (this.type) {
			case AscFormat.LayoutShapeType_shapeType_pie:
			case AscFormat.LayoutShapeType_shapeType_arc:
				val = AscFormat.normalizeRotate(val * degToRad) * radToDeg;
				return val * 60000;
			default:
				return val * 100000;
		}
	};
	ShadowShape.prototype.applyAdjLst = function (editorShape) {
		const adjLst = this.customAdj || (this.shape && this.shape.adjLst);
		if (adjLst) {
			const geometry = editorShape.spPr.geometry;
			const singleAdjName = "adj";
			for (let i = 0; i < adjLst.list.length; i += 1) {
				const adj = adjLst.list[i];
				const adjName = singleAdjName + adj.idx;
				if (geometry.avLst[adjName]) {
					geometry.AddAdj(adjName, 0, this.getAdjValueWithApplyFactor(adj.val));
				} else if (geometry.avLst[singleAdjName]) {
					geometry.AddAdj(singleAdjName, 0, this.getAdjValueWithApplyFactor(adj.val));
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
		this.constraintSizes = null;
	}
	BaseAlgorithm.prototype.setParentConnection = function(connectorAlgorithm, childNode) {
		if (connectorAlgorithm && childNode) {
			connectorAlgorithm.setParentAlgorithm(this);
			connectorAlgorithm.setFirstConnectorNode(this.parentNode);
			connectorAlgorithm.setLastConnectorNode(childNode);
		}
	};
	BaseAlgorithm.prototype.getBounds = function (isCalculateScaleCoefficients, bounds) {
		const shape = this.parentNode.getShape(isCalculateScaleCoefficients);
		if (!bounds) {
			bounds = shape.getBounds();
		} else {
			shape.checkBounds(bounds);
		}
		return bounds;
	};
	BaseAlgorithm.prototype.getRoot = function () {
		return this.parentNode;
	};
	BaseAlgorithm.prototype.getShapes = function (smartartAlgorithm) {
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
	BaseAlgorithm.prototype.applyPostAlgorithmSettings = function (smartartAlgorithm) {
		this.applyPostAlgorithmSettingsForShape(smartartAlgorithm, this.parentNode.getShape(false));
	};
	BaseAlgorithm.prototype.isHierarchy = function () {return false;};
	BaseAlgorithm.prototype.moveToHierarchyOffsets = function () {};

	BaseAlgorithm.prototype.getNodeConstraints = function (node) {
		return node.nodeConstraints;
	};
	BaseAlgorithm.prototype.isRootHierarchy = function () {
		return false;
	};
	BaseAlgorithm.prototype.isCanSetConnection = function () {
		return false;
	};
	BaseAlgorithm.prototype.setConstraintSizes = function (shape) {
		this.constraintSizes = {
			x     : shape.x,
			y     : shape.y,
			width : shape.width,
			height: shape.height
		}
	}
	BaseAlgorithm.prototype.setConnections = function () {
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
				const nextNode = nodes[nextIndex];
				if (node.isSibNode()) {
					const previousNode = nodes[previousIndex];
					if (algorithm && previousNode && nextNode) {
						algorithm.setFirstConnectorNode(previousNode);
						algorithm.setLastConnectorNode(nextNode);
						algorithm.setParentAlgorithm(this);
					}
				} else {
					// todo
					const childNode = node.node.parent.presNode;
					if (childNode) {
						this.setParentConnection(algorithm, childNode);
					}
				}
				previousIndex = nextIndex;
			}
		}
	};
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
	BaseAlgorithm.prototype.getShapePoint = function (bounds) {
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
		const angle = guideVector.getAngle();

		const xt1 = line.x + line.ax * answer.x1;
		const yt1 = line.y + line.ay * answer.x1;

		let edgeAngle = new CVector(xt1 - shapePoint.x, yt1 - shapePoint.y).getAngle();
		if (AscFormat.fApproxEqual(edgeAngle, angle, algDelta)) {
			return new CCoordPoint(xt1, yt1);
		}

		const xt2 = line.x + line.ax * answer.x2;
		const yt2 = line.y + line.ay * answer.x2;

		edgeAngle = new CVector(xt2 - shapePoint.x, yt2 - shapePoint.y).getAngle();
		if (AscFormat.fApproxEqual(edgeAngle, angle, algDelta)) {
			return new CCoordPoint(xt2, yt2);
		}
	};
	BaseAlgorithm.prototype.getMinRectEdgePoint = function (bounds, guideVector) {
		const shapePoint = this.getShapePoint(bounds);
		const centerAngle = guideVector.getAngle();
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
				const edgeGuideVector = new CVector(point.x - shapePoint.x, point.y - shapePoint.y);
				const edgeAngle = edgeGuideVector.getAngle();
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
		if (((x > rectEdgePoint1.x && x < rectEdgePoint2.x) || AscFormat.fApproxEqual(x, rectEdgePoint2.x, algDelta) || AscFormat.fApproxEqual(x, rectEdgePoint1.x, algDelta))
			&& ((y > rectEdgePoint1.y && y < rectEdgePoint2.y) || AscFormat.fApproxEqual(y, rectEdgePoint2.y, algDelta) || AscFormat.fApproxEqual(y, rectEdgePoint1.y, algDelta))) {
			return new CCoordPoint(x, y);
		}
		return null;
	}

	BaseAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints();
	};
	BaseAlgorithm.prototype.setConnectionDistance = function (value, isStart) {

	};
	BaseAlgorithm.prototype.afterShape = function (smartartAlgorithm) {};
	BaseAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(false, false, isCalculateScaleCoefficients);
	};
	BaseAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		this.createShadowShape(isCalculateScaleCoefficients);
	};
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
	BaseAlgorithm.prototype.setFirstConnectorNode = function () {

	};
	BaseAlgorithm.prototype.setLastConnectorNode = function () {

	};
	BaseAlgorithm.prototype.applyPostAlgorithmSettingsForShape = function (smartartAlgorithm, shape, customCoefficient) {
		const presNode = shape.node;
		const prSet = presNode.getPrSet();
		if (prSet.custLinFactY || prSet.custLinFactX || prSet.custLinFactNeighborY || prSet.custLinFactNeighborX) {
			smartartAlgorithm.addSettingsForMove({shape: shape, coefficient: customCoefficient || 1});
		}
	};
	function PositionAlgorithm() {
		BaseAlgorithm.call(this);
		this.connector = null;
		this.shapeContainer = null;
		this.coefficientShapeContainer = null;
	}
	AscFormat.InitClassWithoutType(PositionAlgorithm, BaseAlgorithm);
	PositionAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		return isCalculateScaleCoefficient ? this.coefficientShapeContainer : this.shapeContainer;
	};
	PositionAlgorithm.prototype.applyOffsetByParents = function () {
		const shapeContainer = this.getShapeContainer();
		shapeContainer.calcMetrics();
		shapeContainer.forEachShape(function (parentShape) {
			const parentNode = parentShape.node;
			const offX = parentShape.x;
			const offY = parentShape.y;
			parentNode.forEachDes(function (node) {
				const shape = node.shape;
				if (parentShape && shape) {

					shape.x += offX;
					shape.y += offY;
				}
			});
		});
	};

	PositionAlgorithm.prototype.applyConstraintOffset = function (isCalculateScaleCoefficient) {
		const parentNode = this.parentNode;
		const constrObject = isCalculateScaleCoefficient ? parentNode.constr : parentNode.adaptConstr;
		const width = constrObject[AscFormat.Constr_type_w];
		const height = constrObject[AscFormat.Constr_type_h];
		const ctrX = constrObject[AscFormat.Constr_type_ctrX];
		const ctrY = constrObject[AscFormat.Constr_type_ctrY];
		let offX = parentNode.getConstr(AscFormat.Constr_type_l, !isCalculateScaleCoefficient);
		let offY = parentNode.getConstr(AscFormat.Constr_type_t, !isCalculateScaleCoefficient);
		if (ctrX !== undefined) {
			offX += ctrX - width / 2;
		}
		if (ctrY !== undefined) {
			offY += ctrY - height / 2;
		}

		const shapeContainer = this.getShapeContainer(isCalculateScaleCoefficient);
		shapeContainer.forEachShape(function (shape) {
			const node = shape.node;
			node.forEachDesOrSelf(function (node) {
				const shape = node.getShape(isCalculateScaleCoefficient);
				if (shape) {
					shape.x += offX;
					shape.y += offY;
				}
			});
		});
	};
	PositionAlgorithm.prototype.applyParamOffsets = function (isCalculateScaleCoefficient) {
		switch (this.params[AscFormat.Param_type_off]) {
			case AscFormat.ParameterVal_offset_ctr:
				this.applyCenterAlign(isCalculateScaleCoefficient);
				break;
			default:
				break;
		}
	};

	PositionAlgorithm.prototype.applyCenterAlign = function (isCalculateScaleCoefficient) {
		const parentHeight = this.parentNode.getConstr(AscFormat.Constr_type_h, !isCalculateScaleCoefficient)/* || this.parentNode.getParentHeight(!isCalculateScaleCoefficient)*/;
		const parentWidth = this.parentNode.getConstr(AscFormat.Constr_type_w, !isCalculateScaleCoefficient)/* || this.parentNode.getParentWidth(!isCalculateScaleCoefficient)*/;
		if (!(parentWidth && parentHeight)) {
			return
		}

		const shapeContainer = this.getShapeContainer(isCalculateScaleCoefficient);
		const offsets = shapeContainer.getOffsets(parentHeight, parentWidth, isCalculateScaleCoefficient);
		// this.parentNode.moveTo(offsets.offX, offsets.offY, isCalculateScaleCoefficient);
		this.moveToHierarchyOffsets(offsets.offX, offsets.offY);
		for (let i = 0; i < this.parentNode.childs.length; i++) {
			this.parentNode.childs[i].moveTo(offsets.offX, offsets.offY, isCalculateScaleCoefficient);
		}
/*		shapeContainer.forEachShape(function (shadowShape) {
			const node = shadowShape.node;
			oThis.applyAligns(node, isCalculateScaleCoefficient);
		});*/
	};

	PositionAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childNode) {
		connectorAlgorithm.setParentAlgorithm(this);
		connectorAlgorithm.setFirstConnectorNode(this.parentNode);
		connectorAlgorithm.setLastConnectorNode(childNode);
	};
	PositionAlgorithm.prototype.applyAligns = function (presNode, isCalculateScaleCoefficient) {
		const shape = presNode.getShape(isCalculateScaleCoefficient);
		const cleanParams = shape.cleanParams;
		const cleanW = cleanParams.width;
		const cleanH = cleanParams.height;

		const parentOffX = (shape.width - cleanW) / 2;
		const parentOffY = (shape.height - cleanH) / 2;

		presNode.forEachDes(function (chNode) {
			const parNode = chNode.parent;
			let parentRightEdge = 0;
			let parentBottomEdge = 0;
			const parShape = parNode && parNode.getShape(isCalculateScaleCoefficient);
			if (parShape) {
				parentRightEdge = parShape.x + parShape.width;
				parentBottomEdge = parShape.y + parShape.height;
			}
			const chShape = chNode.getShape(isCalculateScaleCoefficient);
			if (chShape) {
				const newX = chShape.x + parentOffX;
				const newY = chShape.y + parentOffY;
				if ((newX > 0) && (newX + chShape.width < parentRightEdge)) {
					chShape.x = newX;
				}
				if (( newY > 0) && (newY + chShape.height < parentBottomEdge)) {
					chShape.y = newY;
				}
			}
		});
	};
	
	PositionAlgorithm.prototype.calcScaleCoefficients = function () {

	};
	PositionAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm) {
		
	};


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
			let previousMaxWidthCoefficient = null;
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
						if (previousMaxWidthCoefficient !== null && previousMaxWidthCoefficient < coefficient && tempCoefficient < coefficient && previousMaxWidthCoefficient >= heightCoefficient) {
							coefficient = previousMaxWidthCoefficient;
							return true;
						} else if (widthCoefficient < coefficient && (previousMaxWidthCoefficient === null || previousMaxWidthCoefficient < widthCoefficient)) {
							previousMaxWidthCoefficient = widthCoefficient;
						}
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
	SnakeAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(false, true);
	};
	SnakeAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
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
		this.createShadowShape(isCalculateScaleCoefficients);
	}
	SnakeAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints();
		if (this.params[AscFormat.Param_type_flowDir] === AscFormat.ParameterVal_flowDirection_row) {
			this.calculateRowScaleCoefficient();
		}
	};
	SnakeAlgorithm.prototype.calculateRowSnake = function () {
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentWidth = parentConstraints.width;
		const constrSpace = this.parentNode.getConstr(AscFormat.Constr_type_sp, true);
		const rows = this.getShapeContainer();
		let row = new ShapeRow();
		rows.push(row);

		for (let shapeIndex = 0; shapeIndex < this.nodes.length; shapeIndex += 1) {
			const shShape = this.nodes[shapeIndex].shape;
			if (!shShape) {
				continue;
			}
			shShape.setCalcInfo();
			if ((row.width + shShape.width > parentWidth) && !AscFormat.fApproxEqual(row.width + shShape.width, parentWidth, algDelta)) {
				let checkShape;
				if (!shShape.isSpacing) {
					checkShape = row.row[row.row.length - 1];
				} else {
					checkShape = shShape;
				}

				if (checkShape && checkShape.isSpacing && !checkShape.calcInfo.isChecked) {
					checkShape.calcInfo.isChecked = true;
					if ((shapeIndex === this.nodes.length - 1) && checkShape === shShape) {
						checkShape.height = 0;
					} else {
						row.height += constrSpace;
						checkShape.height = row.height;
					}
					if (checkShape !== shShape) {
						row.width -= checkShape.width;
					}
					checkShape.width = 0;
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

			row.width += shShape.width;
			if (row.height < shShape.height) {
				row.height = shShape.height;
				row.cleanHeight = shShape.height;
			}
		}
		rows.calcMetrics();

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
	SnakeAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		if (isCalculateScaleCoefficient) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new ShapeRows();
			}
			return this.coefficientShapeContainer;
		}
		if (this.shapeContainer === null) {
			this.shapeContainer = new ShapeRows();
		}
		return this.shapeContainer;
	};

	function ContainerBase() {

	}
	ContainerBase.prototype.forEachShape = function (callback) {
	};
	ContainerBase.prototype.applyCenterAlign = function (parentHeight, parentWidth) {
	};
	ContainerBase.prototype.calcMetrics = function () {
	};
	function ShapeContainer() {
		ContainerBase.call(this);
		this.shapes = [];
		this.bounds = null;
	}
	AscFormat.InitClassWithoutType(ShapeContainer, ContainerBase);
	ShapeContainer.prototype.forEachShape = function (callback) {
		for (let i = 0; i < this.shapes.length; i += 1) {
			callback(this.shapes[i]);
		}
	};
	ShapeContainer.prototype.reverse = function () {
		return this.shapes.reverse();
	};
	ShapeContainer.prototype.push = function (shape) {
		this.shapes.push(shape);
	};
	ShapeContainer.prototype.getBounds = function (isCalculateScaleCoefficient) {
		if (this.bounds === null) {
			if (this.shapes.length) {
				const firstShape = this.shapes[0];
				this.bounds = {l: firstShape.x, r: firstShape.x + firstShape.width, t: firstShape.y, b: firstShape.y + firstShape.height};
				for (let i = 1; i < this.shapes.length; i += 1) {
					this.shapes[i].checkBounds(this.bounds);
				}
			} else {
				this.bounds = {l: 0, r: 0, t: 0, b: 0};
			}
		}
		return this.bounds;
	};
	ShapeContainer.prototype.getOffsets = function (parentHeight, parentWidth, isCalculateScaleCoefficient) {
		const bounds = this.getBounds(isCalculateScaleCoefficient);
		const ctrX = bounds.l + (bounds.r - bounds.l) / 2;
		const ctrY = bounds.t + (bounds.b - bounds.t) / 2;
		const offX = parentWidth / 2 - ctrX;
		const offY = parentHeight / 2 - ctrY;
		return {offX: offX, offY: offY};
	}
	ShapeContainer.prototype.applyCenterAlign = function (parentHeight, parentWidth, isCalculateScaleCoefficient) {
		const offsets = this.getOffsets(parentHeight, parentWidth, isCalculateScaleCoefficient);
		for (let i = 0; i < this.shapes.length; i++) {
			const shape = this.shapes[i];
			const node = shape.node;
			node.moveTo(offsets.offX, offsets.offY, isCalculateScaleCoefficient);
		}
	};
	function PyramidContainer() {
		ShapeContainer.call(this)
	}
	AscFormat.InitClassWithoutType(PyramidContainer, ShapeContainer);

	function HierarchyChildContainer() {
		ShapeContainer.call(this);
	}
	AscFormat.InitClassWithoutType(HierarchyChildContainer, ShapeContainer);
	HierarchyChildContainer.prototype.getBounds = function (isCalculateScaleCoefficient) {
		let bounds;
		for (let i = 0; i < this.shapes.length; i += 1) {
			const shape = this.shapes[i];
			const algorithm = shape.node.algorithm;
			bounds = algorithm.getBounds(isCalculateScaleCoefficient, bounds);
		}
		if (!bounds) {
			return {l: 0, r: 0, t: 0, b: 0};
		}
		return bounds;
	};
	function HierarchyRootContainer() {
		ShapeContainer.call(this);
	}
	AscFormat.InitClassWithoutType(HierarchyRootContainer, ShapeContainer);
	function CycleContainer() {
		ShapeContainer.call(this);
	}
	AscFormat.InitClassWithoutType(CycleContainer, ShapeContainer);
	CycleContainer.prototype.getOffsets = function (parentHeight, parentWidth, isCalculateScaleCoefficient) {
		const bounds = this.getBounds(isCalculateScaleCoefficient);
		const cycleCY = bounds.t + (bounds.b - bounds.t) / 2;
		const cycleCX = bounds.l + (bounds.r - bounds.l) / 2;
		return {
			x: parentWidth / 2 - cycleCX,
			y: parentHeight / 2 - cycleCY
		};
	};



	function ShapeRows() {
		ContainerBase.call(this);
		this.rows = [];
		this.width = 0;
		this.height = 0;
	}
	AscFormat.InitClassWithoutType(ShapeRows, ContainerBase);

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
	ShapeRows.prototype.applyCenterAlign = function (parentHeight, parentWidth, isCalculateScaleCoefficient) {
		const offRowsX = (parentWidth - this.width) / 2;
		const offRowsY = (parentHeight - this.height) / 2;

		for (let i = 0; i < this.rows.length; i++) {
			const row = this.rows[i];
			for (let j = 0; j < row.row.length; j++) {
				const shape = row.row[j];
				const offRowX = (this.width - row.width) / 2;
				const offRowY = (row.cleanHeight - shape.height) / 2;
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
function HierarchyAlgorithm() {
	PositionAlgorithm.call(this);
	this.levelPositions = [];
	this.calcValues = {
		mainChilds: null
	};
}
	AscFormat.InitClassWithoutType(HierarchyAlgorithm, PositionAlgorithm);
	HierarchyAlgorithm.prototype.moveToHierarchyOffsets = function (dx, dy) {
		for (let i = 0; i < this.levelPositions.length; i += 1) {
			const levelPosition = this.levelPositions[i];
			levelPosition.l += dx;
			levelPosition.r += dx;
			levelPosition.t += dy;
			levelPosition.b += dy;
		}
	};
	HierarchyAlgorithm.prototype.setLevelBounds = function (bounds) {
		this.levelPositions.push(Object.assign({}, bounds));
	};
	HierarchyAlgorithm.prototype.getScaleCoefficient = function () {
		return 1;
	};
	HierarchyAlgorithm.prototype.getHorizontalOffset = function (node, isCalculateScaleCoefficient, fromLeft) {
		const algorithm = node.algorithm;
		let maxSpace = 0;
		const shape = node.getShape(isCalculateScaleCoefficient);

		for (let i = 0; i < this.levelPositions.length; i += 1) {
			const startBounds = this.levelPositions[i];
			for (let j = 0; j < algorithm.levelPositions.length; j += 1) {
				const endBounds = algorithm.levelPositions[j];
				let levelDifference;
				if (fromLeft) {
					levelDifference = startBounds.r - endBounds.l;
				} else {
					levelDifference = endBounds.r - startBounds.l;
				}
				if (levelDifference > maxSpace && !!this.getVerticalIntersection(startBounds, endBounds)) {
					maxSpace = levelDifference;
				}
			}
			const shapeBounds = shape.getBounds();
			let nodeDifference;
			if (fromLeft) {
				nodeDifference = startBounds.r - shapeBounds.l;
			} else {
				nodeDifference = shapeBounds.r - startBounds.l;
			}
			if (nodeDifference > maxSpace && !!this.getVerticalIntersection(shapeBounds, startBounds)) {
				maxSpace = nodeDifference;
			}
		}
		return maxSpace;
	};
	HierarchyAlgorithm.prototype.getHorizontalIntersection = function (bounds1, bounds2) {
		return Math.max(Math.min(bounds1.r, bounds2.r) - Math.max(bounds1.l, bounds2.l), 0);
	};
	HierarchyAlgorithm.prototype.getVerticalIntersection = function (bounds1, bounds2) {
		return Math.max(Math.min(bounds1.b, bounds2.b) - Math.max(bounds1.t, bounds2.t), 0);
	};
	HierarchyAlgorithm.prototype.getVerticalOffset = function (node, isCalculateScaleCoefficient) {
		const algorithm = node.algorithm;
		let maxSpace = 0;
		const shape = node.getShape(isCalculateScaleCoefficient);
		for (let i = 0; i < this.levelPositions.length; i += 1) {
			const startBounds = this.levelPositions[i];
			for (let j = 0; j < algorithm.levelPositions.length; j += 1) {
				const endBounds = algorithm.levelPositions[j];
				const levelDifference = startBounds.b - endBounds.t;
				if (levelDifference > maxSpace && !!this.getHorizontalIntersection(startBounds, endBounds)) {
					maxSpace = levelDifference;
				}
			}
			const shapeBounds = shape.getBounds();
			const nodeDifference = startBounds.b - shapeBounds.t;
			if (nodeDifference > maxSpace && !!this.getHorizontalIntersection(shapeBounds, startBounds)) {
				maxSpace = nodeDifference;
			}
		}
		return maxSpace;
	};
	HierarchyAlgorithm.prototype.isHierarchy = function () {
		return true;
	};
	HierarchyAlgorithm.prototype.getMainChilds = function () {
		if (this.calcValues.mainChilds === null) {
			const childs = [];
			for (let i = 0; i < this.parentNode.childs.length; i += 1) {
				const child = this.parentNode.childs[i];
				if (child.isContentNode()) {
					childs.push(child);
				}
			}
			this.calcValues.mainChilds = childs;
		}
		return this.calcValues.mainChilds;
	};
	HierarchyAlgorithm.prototype._calculateShapePositions = function (isAdapt) {

	};
	HierarchyAlgorithm.prototype.setScaleCoefficient = function () {
		const childs = this.getMainChilds();
		const parentHeight = this.parentNode.getConstr(AscFormat.Constr_type_h);
		const parentWidth = this.parentNode.getConstr(AscFormat.Constr_type_w);
		if (!(parentHeight && parentWidth)) {
			return;
		}
		const shapeContainer = this.getShapeContainer(true);
		const bounds = shapeContainer.getBounds(true);
		const height = bounds.b - bounds.t;
		const width = bounds.r - bounds.l;

		const coefficient = Math.min(parentHeight / height, parentWidth / width, 1);
		if (!AscFormat.isRealNumber(coefficient)) {
			return
		}
		for (let i = 0; i < childs.length; i += 1) {
			const rootChild = childs[i];
			const rootRelationWidth = rootChild.relations.nodeWidth;
			const rootRelationHeight = rootChild.relations.nodeHeight;
			if (rootRelationWidth && rootRelationHeight) {
				rootRelationWidth.setWidthScale(coefficient);
				rootRelationHeight.setHeightScale(coefficient);
			} else if (rootRelationWidth) {
				rootRelationWidth.setWidthScale(coefficient);
			} else if (rootRelationHeight) {
				rootRelationHeight.setHeightScale(coefficient);
			}
			for (let j = 0; j < rootChild.childs.length; j += 1) {
				const child = rootChild.childs[j];
				const relationWidth = child.relations.nodeWidth;
				const relationHeight = child.relations.nodeHeight;
				if (relationWidth && relationHeight) {
					relationWidth.setWidthScale(coefficient);
					relationHeight.setHeightScale(coefficient);
				} else if (relationWidth) {
					relationWidth.setWidthScale(coefficient);
				} else if (relationHeight) {
					relationHeight.setHeightScale(coefficient);
				}
			}
		}
	};

	HierarchyAlgorithm.prototype.updateLevelPositions = function (algorithm) {
		if (algorithm.levelPositions) {
			for (let i = 0; i < algorithm.levelPositions.length; i += 1) {
				this.setLevelBounds(algorithm.levelPositions[i]);
			}
		}
	};
	HierarchyAlgorithm.prototype.resetLevelPositions = function () {
		this.levelPositions = [];
	};
	HierarchyAlgorithm.prototype.collectHierarchyPositions = function () {};
	HierarchyAlgorithm.prototype.putShapesToShapeContainer = function (isCalculateScaleCoefficient) {};
	HierarchyAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		this.resetLevelPositions();
		this.putShapesToShapeContainer(isCalculateScaleCoefficients);
		this._calculateShapePositions(isCalculateScaleCoefficients);
		this.applyParamOffsets(isCalculateScaleCoefficients);
		this.applyConstraintOffset(isCalculateScaleCoefficients);
		this.collectHierarchyPositions();
		if (isCalculateScaleCoefficients) {
			this.setScaleCoefficient();
		} else {
			this.setConnections();
		}
		this.createShadowShape(isCalculateScaleCoefficients);
	};


	function HierarchyChildAlgorithm() {
		HierarchyAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(HierarchyChildAlgorithm, HierarchyAlgorithm);

	HierarchyChildAlgorithm.prototype.getHorizontalSibSp = function (node, isCalculateScaleCoefficient, fromLeft) {
		const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
		const offset = this.getHorizontalOffset(node, isCalculateScaleCoefficient, fromLeft);
		if (fromLeft) {
			return sibSp + offset;
		} else {
			return - offset - sibSp;
		}
	};
	HierarchyChildAlgorithm.prototype.getVerticalSibSp = function (node, isCalculateScaleCoefficient) {
		const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
		const offset = this.getVerticalOffset(node, isCalculateScaleCoefficient);
		return sibSp + offset;
	};
	HierarchyChildAlgorithm.prototype.isHorizontalHierarchy = function () {
		const parent = this.parentNode.parent;
		if (parent && parent.algorithm.isHierarchy()) {
			return parent.algorithm.isHorizontalHierarchy();
		} else {
			switch (this.params[AscFormat.Param_type_chAlign]) {
				case AscFormat.ParameterVal_childAlignment_r:
				case AscFormat.ParameterVal_childAlignment_l:
					return true;
				default:
					return false;
			}
		}
	};
	HierarchyChildAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createHierarchyChildShadowShape(isCalculateScaleCoefficients);
	};
	HierarchyChildAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childNode) {
		const parent = this.parentNode.parent;
		if (parent && parent.algorithm.isHierarchy()) {
			const root = parent.algorithm.getRoot();
			root.algorithm.setParentConnection(connectorAlgorithm, childNode.algorithm.getRoot());
		}
	};
	HierarchyChildAlgorithm.prototype.initParams = function (params) {
		HierarchyAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_linDir] === undefined) {
			this.params[AscFormat.Param_type_linDir] = AscFormat.ParameterVal_linearDirection_fromL;
		}
		if (this.params[AscFormat.Param_type_chAlign] === undefined) {
			this.params[AscFormat.Param_type_chAlign] = AscFormat.ParameterVal_childAlignment_t;
		}
		if (this.params[AscFormat.Param_type_off] === undefined) {
			this.params[AscFormat.Param_type_off] = AscFormat.ParameterVal_offset_ctr;
		}
	}

	HierarchyChildAlgorithm.prototype.isHang = function () {
		return this.params[AscFormat.Param_type_secLinDir] !== undefined &&
			this.params[AscFormat.Param_type_linDir] !== undefined;
	}
	HierarchyChildAlgorithm.prototype.getCommonChildBounds = function (isCalculateScaleCoefficient) {
		const childs = this.getMainChilds();
		let bounds;
		for (let i = 0; i < childs.length; i += 1) {
			const child = childs[i];
			bounds = child.algorithm.getBounds(isCalculateScaleCoefficient, bounds);
		}
		return bounds;
	};
	HierarchyChildAlgorithm.prototype.getRootCenteringOffset = function (shape, isCalculateScaleCoefficient) {
		const result = {offX: 0, offY: 0};
		if (this.isHang()) {
			const isHorizontal = this.isHorizontalHierarchy();
			const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
			const bounds = this.getHangStructBounds(isCalculateScaleCoefficient);
			if (!bounds) {
				return result;
			}
			if (isHorizontal) {
				result.offY = shape.y + shape.height / 2 - bounds.b - sibSp / 2;
			} else {
				if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromR) {
					result.offX = shape.x + shape.width / 2 - bounds.l + sibSp / 2;
				} else {
					result.offX = shape.x + shape.width / 2 - bounds.r - sibSp / 2;
				}
			}
		}
		return result;
	};
	HierarchyChildAlgorithm.prototype.putShapesToShapeContainer = function (isCalculateScaleCoefficient) {
		const childs = this.getMainChilds();
		const shapeContainer = this.getShapeContainer(isCalculateScaleCoefficient);
		for (let i = 0; i < childs.length; i += 1) {
			shapeContainer.push(childs[i].getShape(isCalculateScaleCoefficient));
		}
	}
	HierarchyChildAlgorithm.prototype.calculateVerticalHierarchyVerticalShapePositions = function (isCalculateScaleCoefficient, fromTop) {
		const childs = fromTop ? this.getMainChilds() : this.getMainChilds().slice().reverse();
		const parentNode = this.parentNode;
		const sibSp = parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
		const commonBounds = this.getCommonChildBounds(isCalculateScaleCoefficient);
		const firstShape = childs[0].getShape(isCalculateScaleCoefficient);
		const firstBounds = childs[0].algorithm.getBounds(isCalculateScaleCoefficient);

		const firstChildOffsets = this.getChildAlignOffsets(commonBounds, firstBounds, this.params[AscFormat.Param_type_chAlign]);
		firstShape.moveTo(firstChildOffsets.offX, firstChildOffsets.offY);

		let offY = firstBounds.b - firstBounds.t + sibSp;
		this.setLevelBounds({l: firstShape.x, t: firstShape.y, b: firstShape.y + firstShape.height, r: firstShape.x + firstShape.width});
		this.updateLevelPositions(childs[0].algorithm);
		let previousShape = firstShape;
		let previousDesHeight = firstBounds.b - firstBounds.t;
		for (let i = 1; i < childs.length; i += 1) {
			const node = childs[i];
			const shape = node.getShape(isCalculateScaleCoefficient);
			const bounds = node.algorithm.getBounds(isCalculateScaleCoefficient);
			const childOffsets = this.getChildAlignOffsets(commonBounds, bounds, this.params[AscFormat.Param_type_chAlign]);
			const offY = previousShape.y + previousDesHeight + sibSp - shape.y;
			shape.moveTo(childOffsets.offX, offY + childOffsets.offY);
			this.setLevelBounds({l: shape.x, t: shape.y, b: shape.y + shape.height, r: shape.x + shape.width});
			this.updateLevelPositions(node.algorithm);
			previousShape = shape;
			previousDesHeight = bounds.b - bounds.t;
		}
	};
	HierarchyChildAlgorithm.prototype.calculateHorizontalHierarchyVerticalShapePositions = function (isCalculateScaleCoefficient, fromTop) {
		const childs = fromTop ? this.getMainChilds() : this.getMainChilds().slice().reverse();
		const parentNode = this.parentNode;
		const commonBounds = this.getCommonChildBounds(isCalculateScaleCoefficient);
		const firstNode = childs[0];
		const firstShape = firstNode.getShape(isCalculateScaleCoefficient);
		const firstBounds = firstNode.algorithm.getBounds(isCalculateScaleCoefficient);
		const firstChildOffsets = this.getChildAlignOffsets(commonBounds, firstBounds, this.params[AscFormat.Param_type_chAlign]);
		firstShape.moveTo(firstChildOffsets.offX, firstChildOffsets.offY);

		this.updateLevelPositions(firstNode.algorithm);
		let previousShape = firstShape;
		this.setLevelBounds({l: firstShape.x, r: firstShape.x + firstShape.width, t: firstShape.y, b: firstShape.y + firstShape.height});
		for (let i = 1; i < childs.length; i += 1) {
			const node = childs[i];
			const shape = node.getShape(isCalculateScaleCoefficient);
			const bounds = node.algorithm.getBounds(isCalculateScaleCoefficient);
			const offY = previousShape.y + previousShape.height - shape.y;
			const childOffsets = this.getChildAlignOffsets(commonBounds, bounds, this.params[AscFormat.Param_type_chAlign]);
			shape.moveTo(childOffsets.offX, offY + childOffsets.offY);
			const sibSp = this.getVerticalSibSp(node, isCalculateScaleCoefficient);
			shape.moveTo(0, sibSp);
			this.updateLevelPositions(node.algorithm);
			this.setLevelBounds({l: shape.x, r: shape.x + shape.width, t: shape.y, b: shape.y + shape.height});
			previousShape = shape;
		}
	};
	HierarchyChildAlgorithm.prototype.setSibLevelBounds = function () {

	};
	HierarchyChildAlgorithm.prototype.calculateVerticalHierarchyHorizontalShapePositions = function (isCalculateScaleCoefficient, fromLeft) {
		const childs = this.getMainChilds();
		const commonBounds = this.getCommonChildBounds(isCalculateScaleCoefficient);
		const firstNode = childs[0];
		const firstShape = firstNode.getShape(isCalculateScaleCoefficient);
		const firstBounds = firstNode.algorithm.getBounds(isCalculateScaleCoefficient);
		const firstAlignOffsets = this.getChildAlignOffsets(commonBounds, firstBounds, this.params[AscFormat.Param_type_chAlign]);
		firstNode.moveTo(firstAlignOffsets.offX, firstAlignOffsets.offY, isCalculateScaleCoefficient);
		this.updateLevelPositions(childs[0].algorithm);
		let previousShape = firstShape;
		this.setLevelBounds({l: firstShape.x, t: firstShape.y, b: firstShape.y + firstShape.height, r: firstShape.x + firstShape.width});
		for (let i = 1; i < childs.length; i += 1) {
			const node = childs[i];
			const shape = node.getShape(isCalculateScaleCoefficient);

			let offX;
			if (fromLeft) {
				offX = previousShape.x + previousShape.width - shape.x;
			} else {
				offX = previousShape.x - (shape.x + shape.width);
			}
			const bounds = node.algorithm.getBounds(isCalculateScaleCoefficient);
			const alignOffsets = this.getChildAlignOffsets(commonBounds, bounds, this.params[AscFormat.Param_type_chAlign]);
			node.moveTo(offX + alignOffsets.offX, alignOffsets.offY, isCalculateScaleCoefficient);
			const offset = this.getHorizontalSibSp(node, isCalculateScaleCoefficient, fromLeft);
			node.moveTo(offset, 0, isCalculateScaleCoefficient);
			previousShape = shape;
			this.updateLevelPositions(node.algorithm);
			this.setLevelBounds({l: shape.x, t: shape.y, b: shape.y + shape.height, r: shape.x + shape.width});
		}
	};
	HierarchyChildAlgorithm.prototype.calculateHorizontalHierarchyHorizontalShapePositions = function (isCalculateScaleCoefficient, fromRight) {
		const childs = fromRight ? this.getMainChilds() : this.getMainChilds().slice().reverse();
		const parentNode = this.parentNode;
		const sibSp = parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
		const commonBounds = this.getCommonChildBounds(isCalculateScaleCoefficient);
		const firstShape = childs[0].getShape(isCalculateScaleCoefficient);
		const firstBounds = childs[0].algorithm.getBounds(isCalculateScaleCoefficient);

		const firstChildOffsets = this.getChildAlignOffsets(commonBounds, firstBounds, this.params[AscFormat.Param_type_chAlign]);
		firstShape.moveTo(firstChildOffsets.offX, firstChildOffsets.offY);

		this.setLevelBounds({l: firstShape.x, t: firstShape.y, b: firstShape.y + firstShape.height, r: firstShape.x + firstShape.width});
		this.updateLevelPositions(childs[0].algorithm);
		let previousShape = firstShape;
		let previousWidth = firstBounds.r - firstBounds.l;
		for (let i = 1; i < childs.length; i += 1) {
			const node = childs[i];
			const shape = node.getShape(isCalculateScaleCoefficient);
			const bounds = node.algorithm.getBounds(isCalculateScaleCoefficient);
			const childOffsets = this.getChildAlignOffsets(commonBounds, bounds, this.params[AscFormat.Param_type_chAlign]);
			const offX = previousShape.x + previousWidth + sibSp;
			shape.moveTo(childOffsets.offX + offX, childOffsets.offY);
			this.setLevelBounds({l: shape.x, t: shape.y, b: shape.y + shape.height, r: shape.x + shape.width});
			this.updateLevelPositions(node.algorithm);
			previousShape = shape;
			previousWidth = bounds.r - bounds.l;
		}
	};
	HierarchyChildAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		if (isCalculateScaleCoefficient) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new HierarchyChildContainer();
			}
			return this.coefficientShapeContainer;
		}
		if (this.shapeContainer === null) {
			this.shapeContainer = new HierarchyChildContainer();
		}
		return this.shapeContainer;
	}
	HierarchyChildAlgorithm.prototype.calculateShapePositionsHorizontalHang = function (isCalculateScaleCoefficient, fromRight) {
		const childs = this.getMainChilds();
		const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);

		const topRow = [];
		const bottomRow = [];

		for (let i = 0; i < childs.length; i += 1) {
			const child = childs[i];
			if (i % 2 === 0) {
				topRow.push(child);
			} else {
				bottomRow.push(child);
			}
		}

		const topCalcBounds = this.applyMainChildAlign(topRow, isCalculateScaleCoefficient);
		const bottomCalcBounds = this.applyMainChildAlign(bottomRow, isCalculateScaleCoefficient);

		let bottomOffY = 0;
		if (topCalcBounds.commonBounds && bottomCalcBounds.commonBounds) {
			bottomOffY = topCalcBounds.commonBounds.b - bottomCalcBounds.commonBounds.t + sibSp;
		}

		let offX = 0;
		for (let i = 0; i < topRow.length; i += 1) {
			const topNode = topRow[i];
			const topShape = topNode.getShape(isCalculateScaleCoefficient);
			const topBounds = topCalcBounds.bounds[i];

			const commonChildBounds = Object.assign({}, topBounds);

			const bottomNode = bottomRow[i];
			let bottomShape;
			if (bottomNode) {
				bottomShape = bottomNode.getShape(isCalculateScaleCoefficient);
				const bottomBounds = bottomCalcBounds.bounds[i];
				checkBounds(commonChildBounds, bottomBounds);
				const bottomOffsets = this.getChildAlignOffsets(commonChildBounds, bottomBounds, this.params[AscFormat.Param_type_chAlign]);
				bottomNode.moveTo(bottomOffsets.offX, bottomOffsets.offY, isCalculateScaleCoefficient);
				if (fromRight) {
					bottomShape.moveTo(offX - (bottomShape.x + bottomShape.width), bottomOffY - bottomShape.y);
				} else {
					bottomShape.moveTo(offX - bottomShape.x, bottomOffY - bottomShape.y);
				}
				this.updateLevelPositions(bottomNode.algorithm);
				this.setLevelBounds({
					l: bottomShape.x,
					r: bottomShape.x + bottomShape.width,
					t: bottomShape.y,
					b: bottomShape.y + bottomShape.height
				});
			}
			const topOffsets = this.getChildAlignOffsets(commonChildBounds, topBounds, this.params[AscFormat.Param_type_chAlign]);
			topNode.moveTo(topOffsets.offX, topOffsets.offY, isCalculateScaleCoefficient);
			if (fromRight) {
				topShape.moveTo(offX - (topShape.x + topShape.width), 0);
			} else {
				topShape.moveTo(offX - topShape.x, 0);
			}
			this.updateLevelPositions(topNode.algorithm);
			this.setLevelBounds({
				l: topShape.x,
				r: topShape.x + topShape.width,
				t: topShape.y,
				b: topShape.y + topShape.height
			});
			if (topShape && bottomShape) {
				const bottomBounds = bottomCalcBounds.bounds[i];
				if (fromRight) {
					const topLeft = topShape.x + topShape.width - (topBounds.r - topBounds.l);
					const bottomLeft = bottomShape.x + bottomShape.width - (bottomBounds.r - bottomBounds.l);
					offX = Math.min(topLeft, bottomLeft) - sibSp;
				} else {
					const topRight = topShape.x + (topBounds.r - topBounds.l);
					const bottomRight = bottomShape.x + (bottomBounds.r - bottomBounds.l);
					offX = Math.max(topRight, bottomRight) + sibSp;
				}
			}
		}
	};
	HierarchyChildAlgorithm.prototype.getChildAlignOffsets = function (commonBounds, shapeBounds, childAlign) {
		const offsets = {offX: 0, offY: 0};

		switch (childAlign) {
			case AscFormat.ParameterVal_childAlignment_l:
				offsets.offX = commonBounds.l - shapeBounds.l;
				break;
			case AscFormat.ParameterVal_childAlignment_t:
				offsets.offY = commonBounds.t - shapeBounds.t;
				break;
			case AscFormat.ParameterVal_childAlignment_r:
				offsets.offX = commonBounds.r - shapeBounds.r;
				break;
			case AscFormat.ParameterVal_childAlignment_b:
				offsets.offY = commonBounds.b - shapeBounds.b;
				break;
			default:
				break;
		}
		return offsets;
	};
	HierarchyChildAlgorithm.prototype.calculateShapePositionsVerticalHangFromTop = function (isCalculateScaleCoefficient, fromRight) {
		const childs = this.getMainChilds();

		let leftCol = [];
		let rightCol = [];
		const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp, !isCalculateScaleCoefficient);
		for (let i = 0; i < childs.length; i += 1) {
			const child = childs[i];
			if (i % 2 === 0) {
				leftCol.push(child);
			} else {
				rightCol.push(child);
			}
		}
		if (fromRight) {
			const tempCol = leftCol;
			leftCol = rightCol;
			rightCol = tempCol;
		}
		const leftCalcBounds = this.applyMainChildAlign(leftCol, isCalculateScaleCoefficient);
		const rightCalcBounds = this.applyMainChildAlign(rightCol, isCalculateScaleCoefficient);
		let rightOffX = 0;
		if (leftCalcBounds.commonBounds && rightCalcBounds.commonBounds) {
			rightOffX = leftCalcBounds.commonBounds.r - rightCalcBounds.commonBounds.l + sibSp;
		}
		let offY = 0;
		const columnLength = Math.ceil(childs.length / 2);
		for (let i = 0; i < columnLength; i += 1) {
			const leftNode = leftCol[i];
			if (leftNode) {
				const leftShape = leftNode.getShape(isCalculateScaleCoefficient);
				leftShape.moveTo(0, offY);
				this.updateLevelPositions(leftNode.algorithm);
				this.setLevelBounds({l: leftShape.x, r: leftShape.x + leftShape.width, t: leftShape.y, b: leftShape.y + leftShape.height});
			}
			const rightNode = rightCol[i];
			if (rightNode) {
				const rightShape = rightNode.getShape(isCalculateScaleCoefficient);
				rightShape.moveTo(rightOffX, offY);
				this.updateLevelPositions(rightNode.algorithm);
				this.setLevelBounds({l: rightShape.x, r: rightShape.x + rightShape.width, t: rightShape.y, b: rightShape.y + rightShape.height});
			}
			const leftBounds = leftCalcBounds.bounds[i];
			const rightBounds = rightCalcBounds.bounds[i];
			if (leftBounds && rightBounds) {
				const commonChildBounds = Object.assign({}, leftBounds);
				checkBounds(commonChildBounds, rightBounds);
/*				const leftOffsets = this.getChildAlignOffsets(commonChildBounds, leftBounds, this.params[AscFormat.Param_type_chAlign]);
				const rightOffsets = this.getChildAlignOffsets(commonChildBounds, rightBounds, this.params[AscFormat.Param_type_chAlign]);
				leftNode.moveTo(leftOffsets.offX, leftOffsets.offY, isCalculateScaleCoefficient);
				rightNode.moveTo(rightOffsets.offX, rightOffsets.offY, isCalculateScaleCoefficient);*/
				offY += Math.max(leftBounds.b - leftBounds.t, rightBounds.b - rightBounds.t) + sibSp;
			}
		}
	};
	HierarchyChildAlgorithm.prototype.applyMainChildAlign = function (childs, isCalculateScaleCoefficient) {
		const allBounds = [];
		const result = {
			commonBounds: null,
			bounds: allBounds
		};
		if (!childs.length) {
			return result;
		}
		const commonBounds = {};
		const firstChild = childs[0];
		const firstBounds = firstChild.algorithm.getBounds(isCalculateScaleCoefficient);
		allBounds.push(firstBounds);
		Object.assign(commonBounds, firstBounds);
		for (let i = 1; i < childs.length; i += 1) {
			const child = childs[i];
			const bounds = child.algorithm.getBounds(isCalculateScaleCoefficient);
			checkBounds(commonBounds, bounds);
			allBounds.push(bounds);
		}

		for (let i = 0; i < childs.length; i += 1) {
			const child = childs[i];
			const mainOffsets = this.getChildAlignOffsets(commonBounds, allBounds[i], this.params[AscFormat.Param_type_chAlign]);
			const secondaryOffsets = this.getChildAlignOffsets(commonBounds, allBounds[i], this.params[AscFormat.Param_type_secChAlign]);
			child.moveTo(mainOffsets.offX + secondaryOffsets.offX, mainOffsets.offY + secondaryOffsets.offY, isCalculateScaleCoefficient);
		}
		return {commonBounds: commonBounds, bounds: allBounds};
	};

	HierarchyChildAlgorithm.prototype.calculateShapePositionsVerticalHangFromRight = function (isCalculateScaleCoefficient) {

	};
	HierarchyChildAlgorithm.prototype._calculateShapePositions = function (isCalculateScaleCoefficient) {
		const childs = this.getMainChilds();
		if (!childs.length) {
			return;
		}
		if (this.isHang()) {
			switch (this.params[AscFormat.Param_type_secLinDir]) {
				case AscFormat.ParameterVal_linearDirection_fromT:
					const fromRight = this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromR;
					this.calculateShapePositionsVerticalHangFromTop(isCalculateScaleCoefficient, fromRight);
					break;
				case AscFormat.ParameterVal_linearDirection_fromL:
					this.calculateShapePositionsHorizontalHang(isCalculateScaleCoefficient, false);
					break;
				case AscFormat.ParameterVal_linearDirection_fromR:
					this.calculateShapePositionsHorizontalHang(isCalculateScaleCoefficient, true);
					break;
				default:
					break;
			}
		} else {
			if (this.isHorizontalHierarchy()) {
				switch (this.params[AscFormat.Param_type_linDir]) {
					case AscFormat.ParameterVal_linearDirection_fromB:
						this.calculateHorizontalHierarchyVerticalShapePositions(isCalculateScaleCoefficient, false);
						break;
					case AscFormat.ParameterVal_linearDirection_fromT:
						this.calculateHorizontalHierarchyVerticalShapePositions(isCalculateScaleCoefficient, true);
						break;
					case AscFormat.ParameterVal_linearDirection_fromR:
						this.calculateHorizontalHierarchyHorizontalShapePositions(isCalculateScaleCoefficient, false);
						break;
					case AscFormat.ParameterVal_linearDirection_fromL:
						this.calculateHorizontalHierarchyHorizontalShapePositions(isCalculateScaleCoefficient, true);
						break;
					default:
						break;
				}
			} else {
				switch (this.params[AscFormat.Param_type_linDir]) {
					case AscFormat.ParameterVal_linearDirection_fromB:
						this.calculateVerticalHierarchyVerticalShapePositions(isCalculateScaleCoefficient, false);
						break;
					case AscFormat.ParameterVal_linearDirection_fromT:
						this.calculateVerticalHierarchyVerticalShapePositions(isCalculateScaleCoefficient, true);
						break;
					case AscFormat.ParameterVal_linearDirection_fromR:
						this.calculateVerticalHierarchyHorizontalShapePositions(isCalculateScaleCoefficient, false);
						break;
					case AscFormat.ParameterVal_linearDirection_fromL:
						this.calculateVerticalHierarchyHorizontalShapePositions(isCalculateScaleCoefficient, true);
						break;
					default:
						break;
				}
			}
		}
	};

	HierarchyChildAlgorithm.prototype.getChildBounds = function (isCalculateScaleCoefficients) {
		const childs = this.getMainChilds();

		if (!childs.length) {
			return;
		}

		const firstChild = childs[0];
		const firstRoot = firstChild.algorithm.getRoot();
		const firstShape = firstRoot.getShape(isCalculateScaleCoefficients);
		const bounds = firstShape.getBounds();

		for (let i = 1; i < childs.length; i += 1) {
			const child = childs[i];
			const root = child.algorithm.getRoot();
			const shape = root.getShape(isCalculateScaleCoefficients);
			shape.checkBounds(bounds);
		}
		return bounds;
	};
	HierarchyChildAlgorithm.prototype.getHangStructBounds = function (isCalculateScaleCoefficients) {
		const childs = this.getMainChilds();
		if (!childs.length) {
			return;
		}
		const firstChild = childs[0];
		const bounds = firstChild.algorithm.getBounds(isCalculateScaleCoefficients);
		for (let i = 2; i < childs.length; i += 2) {
			const child = childs[i];
			child.algorithm.getBounds(isCalculateScaleCoefficients, bounds);
		}
		return bounds;
	};
	function HierarchyRootAlgorithm() {
		HierarchyAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(HierarchyRootAlgorithm, HierarchyAlgorithm);
	HierarchyRootAlgorithm.prototype.isHorizontalHierarchy = function () {
		switch (this.params[AscFormat.Param_type_hierAlign]) {
			case AscFormat.ParameterVal_hierarchyAlignment_lB:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_lT:
			case AscFormat.ParameterVal_hierarchyAlignment_rB:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_rT:
				return true;
			default:
				return false;
		}
	};
	HierarchyRootAlgorithm.prototype.putShapesToShapeContainer = function (isCalculateScaleCoefficient) {
		const rootNode = this.getRoot();
		const asstNode = this.getAsstNode();
		const nonAsstNode = this.getNonAsstNode();
		const shapeContainer = this.getShapeContainer(isCalculateScaleCoefficient);
		shapeContainer.push(rootNode.getShape(isCalculateScaleCoefficient));
		if (asstNode && asstNode.algorithm.getMainChilds().length) {
			shapeContainer.push(asstNode.getShape(isCalculateScaleCoefficient));
		}
		if (nonAsstNode.algorithm.getMainChilds().length) {
			shapeContainer.push(nonAsstNode.getShape(isCalculateScaleCoefficient));
		}
	};
	HierarchyRootAlgorithm.prototype.getBounds = function (isCalculateScaleCoefficients, bounds) {
		const childs = this.getMainChilds();
		const firstChild = childs[0];
		const firstShape = firstChild.getShape(isCalculateScaleCoefficients);
		if (!bounds) {
			bounds = firstShape.getBounds();
		} else {
			firstShape.checkBounds(bounds);
		}
		const asstNode = this.getAsstNode();
		if (asstNode && asstNode.childs.length) {
			const shape = asstNode.getShape(isCalculateScaleCoefficients);
			shape.checkBounds(bounds);
		}
		const nonAsstNode = this.getNonAsstNode();
		if (nonAsstNode.childs.length) {
			const shape = nonAsstNode.getShape(isCalculateScaleCoefficients);
			shape.checkBounds(bounds);
		}
		return bounds;
	};
	HierarchyRootAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createHierarchyRootShadowShape(isCalculateScaleCoefficients);
	};
	HierarchyRootAlgorithm.prototype.getNonAsstNode = function () {
		return this.parentNode.childs[1];
	};
	HierarchyRootAlgorithm.prototype.getAsstNode = function () {
		return this.parentNode.childs[2];
	};
	HierarchyRootAlgorithm.prototype.applyMainTopAlign = function (isCalculateScaleCoefficients) {
		const root = this.getRoot();
		if (!root) {
			return;
		}
		const parentNode = this.parentNode;
		const space = parentNode.getConstr(AscFormat.Constr_type_sp, !isCalculateScaleCoefficients);
		const rootShape = root.getShape(isCalculateScaleCoefficients);
		let offY = rootShape.y + rootShape.height + space;

		const asstNode = this.getAsstNode();
		if (asstNode && asstNode.algorithm.getMainChilds().length) {
			const asstShape = asstNode.getShape(isCalculateScaleCoefficients);
			asstShape.moveTo(/*todo: asstOffset*/0, offY - asstShape.y);
			offY = asstShape.y + asstShape.height + space;
		}

		const nonAsstNode = this.getNonAsstNode();
		if (nonAsstNode.algorithm.getMainChilds().length) {
			const nonAsstShape = nonAsstNode.getShape(isCalculateScaleCoefficients);
			nonAsstShape.moveTo(/*todo: nonAsstOffset*/0, offY - nonAsstShape.y);
		}
	};

	HierarchyRootAlgorithm.prototype.applyMainBottomAlign = function (isCalculateScaleCoefficients) {
		const rootNode = this.getRoot();
		if (!rootNode) {
			return;
		}
		const parentNode = this.parentNode;
		const space = parentNode.getConstr(AscFormat.Constr_type_sp, !isCalculateScaleCoefficients);

		let offY = 0;
		const nonAsstNode = this.getNonAsstNode();
		if (nonAsstNode.algorithm.getMainChilds().length) {
			const nonAsstShape = nonAsstNode.getShape(isCalculateScaleCoefficients);
			offY += nonAsstShape.y + nonAsstShape.height + space;
		}


		const asstNode = this.getAsstNode();
		if (asstNode && asstNode.algorithm.getMainChilds().length) {
			const asstShape = asstNode.getShape(isCalculateScaleCoefficients);
			asstShape.moveTo(/*todo: asstOffset*/0, offY - asstShape.y);
			offY = asstShape.y + asstShape.height + space;
		}

		const rootShape = rootNode.getShape(isCalculateScaleCoefficients);
		rootShape.moveTo(0, offY - rootShape.y);
	};

	HierarchyRootAlgorithm.prototype.applyMainLeftAlign = function (isCalculateScaleCoefficients) {
		const rootNode = this.getRoot();
		if (!rootNode) {
			return;
		}
		const space = this.parentNode.getConstr(AscFormat.Constr_type_sp, !isCalculateScaleCoefficients);
		const rootShape = rootNode.getShape(isCalculateScaleCoefficients);
		let offX = rootShape.x + rootShape.width + space;

		const asstNode = this.getAsstNode();
		if (asstNode && asstNode.algorithm.getMainChilds().length) {
			const asstShape = asstNode.getShape(isCalculateScaleCoefficients);
			asstShape.moveTo(offX - asstShape.x, 0);
			offX = asstShape.x + asstShape.width + space;
		}

		const nonAsstNode = this.getNonAsstNode();
		if (nonAsstNode.algorithm.getMainChilds().length) {
			const nonAsstShape = nonAsstNode.getShape(isCalculateScaleCoefficients);
			nonAsstShape.moveTo(offX - nonAsstShape.x, 0);
		}
	};

	HierarchyRootAlgorithm.prototype.applyMainRightAlign = function (isCalculateScaleCoefficients) {
		const rootNode = this.getRoot();
		if (!rootNode) {
			return;
		}
		const space = this.parentNode.getConstr(AscFormat.Constr_type_sp, !isCalculateScaleCoefficients);
		let offX = 0;

		const nonAsstNode = this.getNonAsstNode();
		if (nonAsstNode.algorithm.getMainChilds().length) {
			const nonAsstShape = nonAsstNode.getShape(isCalculateScaleCoefficients);
			offX = nonAsstShape.x + nonAsstShape.width + space;
		}

		const asstNode = this.getAsstNode();
		if (asstNode && asstNode.algorithm.getMainChilds().length) {
			const asstShape = asstNode.getShape(isCalculateScaleCoefficients);
			asstShape.moveTo(offX - asstShape.x, 0);
			offX = asstShape.x + asstShape.width + space;
		}

		const rootShape = rootNode.getShape(isCalculateScaleCoefficients);
		rootShape.moveTo(offX - rootShape.x, 0);
	};

	HierarchyRootAlgorithm.prototype.applyMainAlign = function (isCalculateScaleCoefficients) {
		switch (this.params[AscFormat.Param_type_hierAlign]) {
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_bL:
			case AscFormat.ParameterVal_hierarchyAlignment_bR:
				this.applyMainBottomAlign(isCalculateScaleCoefficients);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_lB:
			case AscFormat.ParameterVal_hierarchyAlignment_lT:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrDes:
				this.applyMainLeftAlign(isCalculateScaleCoefficients);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_rB:
			case AscFormat.ParameterVal_hierarchyAlignment_rT:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrDes:
				this.applyMainRightAlign(isCalculateScaleCoefficients);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_tL:
			case AscFormat.ParameterVal_hierarchyAlignment_tR:
				this.applyMainTopAlign(isCalculateScaleCoefficients);
				break;
			default:
				return;
		}
	};
	HierarchyRootAlgorithm.prototype.applySecondaryAlign = function (isCalculateScaleCoefficients) {
		const asstNode = this.getAsstNode();
		const nonAsstNode = this.getNonAsstNode();

		if (asstNode) {
			this.applySecondaryAlignForChild(isCalculateScaleCoefficients, asstNode);
		}
		this.applySecondaryAlignForChild(isCalculateScaleCoefficients, nonAsstNode);
	};
	HierarchyRootAlgorithm.prototype.applySecondaryAlignForChild = function (isCalculateScaleCoefficients, child) {
		const rootNode = this.getRoot();
		const rootShape = rootNode.getShape(isCalculateScaleCoefficients);
		const childShape = child.getShape(isCalculateScaleCoefficients);
		if (child.algorithm.isHang()) {
			const offsets = child.algorithm.getRootCenteringOffset(rootShape, isCalculateScaleCoefficients);
			childShape.moveTo(offsets.offX, offsets.offY);
			return;
		}

		const appendChildOffset = this.getOffsetAlign(isCalculateScaleCoefficients, child);
		switch (this.params[AscFormat.Param_type_hierAlign]) {
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrCh: {
				const childBounds = child.algorithm.getChildBounds(isCalculateScaleCoefficients);
				if (childBounds) {
					childShape.moveTo(0, (rootShape.y + rootShape.height / 2) - (childBounds.t + (childBounds.b - childBounds.t) / 2) + appendChildOffset);
				}
				break;
			}
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrCh: {
				const childBounds = child.algorithm.getChildBounds(isCalculateScaleCoefficients);
				if (childBounds) {
					childShape.moveTo((rootShape.x + rootShape.width / 2) - (childBounds.l + (childBounds.r - childBounds.l) / 2) + appendChildOffset, 0);
				}
				break;
			}
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrDes:
				childShape.moveTo(0, rootShape.y + rootShape.height / 2 - (childShape.y + childShape.height / 2) + appendChildOffset);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrDes:
				childShape.moveTo(rootShape.x + rootShape.width / 2 - (childShape.x + childShape.width / 2) + appendChildOffset, 0);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_bL:
			case AscFormat.ParameterVal_hierarchyAlignment_tL:
				childShape.moveTo(rootShape.x - childShape.x + appendChildOffset, 0);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_bR:
			case AscFormat.ParameterVal_hierarchyAlignment_tR:
				childShape.moveTo((rootShape.x + rootShape.width) - (childShape.x + childShape.width) + appendChildOffset, 0);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_lB:
			case AscFormat.ParameterVal_hierarchyAlignment_rB:
				childShape.moveTo(0, (rootShape.y + rootShape.height) - (childShape.y + childShape.height) + appendChildOffset);
				break;
			case AscFormat.ParameterVal_hierarchyAlignment_lT:
			case AscFormat.ParameterVal_hierarchyAlignment_rT:
				childShape.moveTo(0, rootShape.y - childShape.y + appendChildOffset);
				break;
			default:
				return;
		}
	};

	HierarchyRootAlgorithm.prototype.getOffsetAlign = function (isCalculateScaleCoefficients, child) {
		const offsetFactor = child.algorithm.isHang() ? 0 : this.parentNode.getConstr(AscFormat.Constr_type_alignOff, !isCalculateScaleCoefficients);
		if (!offsetFactor) {
			return 0;
		}
		const rootNode = this.getRoot();
		const rootShape = rootNode.getShape(isCalculateScaleCoefficients);
		switch (this.params[AscFormat.Param_type_hierAlign]) {
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrCh:
			case AscFormat.ParameterVal_hierarchyAlignment_bCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_lCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_rCtrDes:
			case AscFormat.ParameterVal_hierarchyAlignment_tCtrDes:
				return 0;
			case AscFormat.ParameterVal_hierarchyAlignment_bL:
			case AscFormat.ParameterVal_hierarchyAlignment_tL:
				return rootShape.width * offsetFactor;
			case AscFormat.ParameterVal_hierarchyAlignment_bR:
			case AscFormat.ParameterVal_hierarchyAlignment_tR:
				return -rootShape.width * offsetFactor;
			case AscFormat.ParameterVal_hierarchyAlignment_lB:
			case AscFormat.ParameterVal_hierarchyAlignment_rB:
				return -rootShape.height * offsetFactor;
			case AscFormat.ParameterVal_hierarchyAlignment_lT:
			case AscFormat.ParameterVal_hierarchyAlignment_rT:
				return rootShape.height * offsetFactor;
			default:
				return 0;
		}
	};

	HierarchyRootAlgorithm.prototype.initParams = function (params) {
		HierarchyAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_off] === undefined) {
			this.params[AscFormat.Param_type_off] = AscFormat.ParameterVal_offset_ctr;
		}
		if (this.params[AscFormat.Param_type_hierAlign] === undefined) {
			this.params[AscFormat.Param_type_hierAlign] = AscFormat.ParameterVal_hierarchyAlignment_tCtrCh;
		}
	}
	HierarchyRootAlgorithm.prototype.getRoot = function () {
		const childs = this.getMainChilds();
		if (childs.length) {
			return childs[0];
		}
	};
	HierarchyRootAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficients) {
		if (isCalculateScaleCoefficients) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new HierarchyRootContainer();
			}
			return this.coefficientShapeContainer;
		} else {
			if (this.shapeContainer === null) {
				this.shapeContainer = new HierarchyRootContainer();
			}
			return this.shapeContainer;
		}
	};
	HierarchyRootAlgorithm.prototype._collectHierarchyPositions = function (isVertical) {
		const asstNode = this.getAsstNode();
		if (asstNode) {
			const asstAlgorithm = asstNode.algorithm;
			for (let i = 0; i < asstAlgorithm.levelPositions.length; i += 1) {
				this.setLevelBounds(asstAlgorithm.levelPositions[i]);
			}
		}
		const nonAsstNode = this.getNonAsstNode();
		const nonAsstAlgorithm = nonAsstNode.algorithm;
		for (let i = 0; i < nonAsstAlgorithm.levelPositions.length; i += 1) {
			this.setLevelBounds(nonAsstAlgorithm.levelPositions[i]);
		}
	};
	HierarchyRootAlgorithm.prototype.collectHierarchyPositions = function () {
		this._collectHierarchyPositions();
	};
	HierarchyRootAlgorithm.prototype._calculateShapePositions = function (isCalculateScaleCoefficients) {
		this.applyMainAlign(isCalculateScaleCoefficients);
		this.applySecondaryAlign(isCalculateScaleCoefficients);
	};


	function PyramidAlgorithm() {
		PositionAlgorithm.call(this);
		this.calcValues = {
			defaultBlockHeight: 0
		};
	}
	AscFormat.InitClassWithoutType(PyramidAlgorithm, PositionAlgorithm);
	PyramidAlgorithm.prototype.initParams = function (params) {
		PositionAlgorithm.prototype.initParams.call(this, params);
		if (this.params[AscFormat.Param_type_pyraAcctPos] === undefined) {
			this.params[AscFormat.Param_type_pyraAcctPos] = AscFormat.ParameterVal_pyramidAccentPosition_aft;
		}
		if (this.params[AscFormat.Param_type_off] === undefined) {
			this.params[AscFormat.Param_type_off] = AscFormat.ParameterVal_offset_ctr;
		}

	}
	PyramidAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints();
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentHeight = parentConstraints.height;
		const childs = this.parentNode.childs;
		const defaultBlockHeight = parentHeight / childs.length;
		let sumHeight = 0;
		for (let i = 0; i < childs.length; i++) {
			const child = this.getPyramidChildren(childs[i]).pyramid;
			const scaleBlockHeight = child.getHeightScale();
			sumHeight += scaleBlockHeight * defaultBlockHeight;
		}
		this.calcValues.defaultBlockHeight = defaultBlockHeight * (parentHeight / sumHeight);
	};
	PyramidAlgorithm.prototype.setPyramidParametersForNode = function (child, x, y, height, width, cleanHeight, cleanWidth, adjValue) {
		const shape = child.shape;
		if (shape) {
			if (width < height) {
				adjValue = adjValue * height / cleanWidth;
			}
			shape.height = height;
			shape.width = width;
			shape.x = x;
			shape.y = y;
			shape.cleanParams.height = cleanHeight;
			shape.cleanParams.width = cleanWidth;
			const adjLst = new AscFormat.AdjLst();
			const adj = new AscFormat.Adj();
			adj.setVal(adjValue);
			adj.setIdx(1);
			adjLst.addToLst(0, adj);
			shape.customAdj = adjLst;
		}
	};
	PyramidAlgorithm.prototype.getPyramidChildren = function (node) {
		const pyramid = node.getNamedNode(this.params[AscFormat.Param_type_pyraLvlNode]);
		const acct = node.getNamedNode(this.params[AscFormat.Param_type_pyraAcctBkgdNode]);
		return {
			pyramid: pyramid,
			acct: acct
		};
	};
	PyramidAlgorithm.prototype.isReversedPyramid = function () {
		return this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromT;
	};
	PyramidAlgorithm.prototype.getStartDefaultBlockWidth = function () {
		const acctRatio = this.parentNode.getConstr(AscFormat.Constr_type_pyraAcctRatio);
		const parentWidth = this.getNodeConstraints(this.parentNode).width;
		return parentWidth * (1 - acctRatio);
	}
	PyramidAlgorithm.prototype.forEachChild = function (callback, startIndex) {
		const childs = this.parentNode.childs;
		if (this.isReversedPyramid()) {
			for (let i = startIndex; i < childs.length; i += 1) {
				callback(childs[i]);
			}
		} else {
			for (let i = childs.length - 1 - startIndex; i >= 0; i -= 1) {
				callback(childs[i]);
			}
		}
	}
	PyramidAlgorithm.prototype.getFirstPyramidComponents = function () {
		const childs = this.parentNode.childs;
		if (this.isReversedPyramid()) {
			return this.getPyramidChildren(childs[0]);
		}

		return this.getPyramidChildren(childs[childs.length - 1]);
	}
	PyramidAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		if (isCalculateScaleCoefficient) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new PyramidContainer();
			}
			return this.coefficientShapeContainer;
		}
		if (this.shapeContainer === null) {
			this.shapeContainer = new PyramidContainer();
		}
		return this.shapeContainer;
	};
	PyramidAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		const childs = this.parentNode.childs;
		if (!childs.length) {
			return;
		}
		const shapeContainer = this.getShapeContainer();
		const parentConstraints = this.getNodeConstraints(this.parentNode);
		const parentHeight = parentConstraints.height;
		const defaultBlockHeight = this.calcValues.defaultBlockHeight;
		let previousBlockWidth = this.getStartDefaultBlockWidth();
		const defaultAdjValue = (previousBlockWidth / 2) / parentHeight;


		const firstPyramidComponents = this.getFirstPyramidComponents();
		const firstChild = firstPyramidComponents.pyramid;
		const firstHeight = defaultBlockHeight * firstChild.getHeightScale();
		const firstWidth = previousBlockWidth * firstChild.getWidthScale();
		let ctrX = (previousBlockWidth - firstWidth) / 2 + firstWidth / 2;
		if (!this.isAfterAcct()) {
			ctrX = parentConstraints.width - ctrX;
		}
		let previousY;
		if (this.isReversedPyramid()) {
			previousY = 0;
		} else {
			previousY = parentHeight - firstHeight;
		}
		let previousBlockHeight = firstHeight;
		this.setPyramidParametersForNode(firstChild, ctrX - firstWidth / 2, previousY,  firstHeight, firstWidth, defaultBlockHeight, previousBlockWidth, defaultAdjValue);
		const firstAcctOffset = defaultAdjValue * previousBlockHeight;
		if (this.isReversedPyramid()) {
			firstChild.shape.rot = Math.PI;
			this.addAcctShape(firstChild, firstPyramidComponents.acct, defaultAdjValue, firstAcctOffset);
			shapeContainer.push(firstChild.shape);
		} else {
			shapeContainer.push(firstChild.shape);
			this.addAcctShape(firstChild, firstPyramidComponents.acct, defaultAdjValue, firstAcctOffset);
		}
		const oThis = this;
		this.forEachChild(function (node) {
			const pyramidComponents = oThis.getPyramidChildren(node);
			const child = pyramidComponents.pyramid;
			const blockHeightFactor = child.getHeightScale();
			const blockWidthFactor = child.getWidthScale();
			const scaledBlockHeight = blockHeightFactor * defaultBlockHeight;
			const curBlockWidth = previousBlockWidth - 2 * defaultAdjValue * previousBlockHeight;
			const scaledBlockWidth = curBlockWidth * blockWidthFactor;
			const x = ctrX - scaledBlockWidth / 2;
			let y;
			if (oThis.isReversedPyramid()) {
				y = previousY + previousBlockHeight;
			} else {
				y = previousY - scaledBlockHeight;
			}
			const acctOffset = defaultAdjValue * scaledBlockHeight;
			oThis.setPyramidParametersForNode(child, x, y,  scaledBlockHeight, scaledBlockWidth, defaultBlockHeight, curBlockWidth, defaultAdjValue);
			if (oThis.isReversedPyramid()) {
				child.shape.rot = Math.PI;
				oThis.addAcctShape(child, pyramidComponents.acct, defaultAdjValue, acctOffset);
				oThis.shapeContainer.push(child.shape);
			} else {
				oThis.shapeContainer.push(child.shape);
				oThis.addAcctShape(child, pyramidComponents.acct, defaultAdjValue, acctOffset);
			}
			previousBlockWidth = curBlockWidth;
			previousBlockHeight = scaledBlockHeight;
			previousY = y;
		}, 1);
		if (!this.isReversedPyramid()) {
			shapeContainer.reverse();
		}
		this.applyParamOffsets();
		this.applyPostAlgorithmSettings();
		this.createShadowShape(isCalculateScaleCoefficients);
	};
	PyramidAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(true);
	};
	PyramidAlgorithm.prototype.getTemplateAdjAcctLst = function (firstAdj, secondAdj) {
		const adjLst = new AscFormat.AdjLst();
		const adj1 = new AscFormat.Adj();
		adjLst.addToLst(0, adj1);
		adj1.setIdx(1);

		const adj2 = new AscFormat.Adj();
		adj2.setIdx(2);
		adjLst.addToLst(1, adj2);

		adj1.setVal(firstAdj);
		adj2.setVal(secondAdj);
		return adjLst;
	};
	PyramidAlgorithm.prototype.isAfterAcct = function () {
		return this.params[AscFormat.Param_type_pyraAcctPos] === AscFormat.ParameterVal_pyramidAccentPosition_aft;
	}
	PyramidAlgorithm.prototype.addAcctShape = function (mainNode, acctNode, defaultAdjValue, acctHelper) {
		if (!(mainNode && acctNode)) {
			return;
		}
		const shapeContainer = this.getShapeContainer();
		const parentWidth = this.getNodeConstraints(this.parentNode).width;
		const mainShape = mainNode.shape;
		const acctShape = acctNode.shape;

		const heightScale = acctNode.getHeightScale();
		const widthScale = acctNode.getWidthScale();
		let defaultWidth;
		if (this.isAfterAcct()) {
			defaultWidth = parentWidth - (mainShape.x + mainShape.width - acctHelper);
		} else {
			defaultWidth = mainShape.x + acctHelper;
		}
		const defaultHeight = mainShape.height;
		acctShape.cleanParams.width = defaultWidth;
		acctShape.cleanParams.height = defaultHeight;
		acctShape.width = defaultWidth * widthScale;
		acctShape.height = defaultHeight * heightScale;
		if (defaultWidth < defaultHeight) {
			defaultAdjValue = defaultAdjValue * defaultHeight / defaultWidth;
		}

		if (this.isAfterAcct()) {
			acctShape.x = mainShape.x + mainShape.width - acctHelper + (defaultWidth - acctShape.width) / 2;
			if (this.isReversedPyramid()) {
				acctShape.customAdj = this.getTemplateAdjAcctLst(defaultAdjValue, 0);
			} else {
				acctShape.customAdj = this.getTemplateAdjAcctLst(0, defaultAdjValue);
			}
		} else {
			acctShape.x = (defaultWidth - acctShape.width) / 2;
			if (this.isReversedPyramid()) {
				acctShape.customAdj = this.getTemplateAdjAcctLst(0, defaultAdjValue);
			} else {
				acctShape.customAdj = this.getTemplateAdjAcctLst(defaultAdjValue, 0);
			}
		}
		acctShape.y = mainShape.y + (defaultHeight - acctShape.height) / 2;
		if (!this.isReversedPyramid()) {
			acctShape.rot = Math.PI;
		}
		shapeContainer.push(acctShape);
	};

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
	CycleAlgorithm.prototype.isCanSetConnection = function () {
		return true;
	};
	CycleAlgorithm.prototype.getCenterNode = function () {
		if (this.calcValues.centerNodeIndex !== null) {
			return this.parentNode.childs[this.calcValues.centerNodeIndex];
		}
	};
	CycleAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childNode) {
		const centerShape = this.getCenterNode();
		if (centerShape && connectorAlgorithm && childNode) {
			connectorAlgorithm.setParentAlgorithm(this);
			connectorAlgorithm.setFirstConnectorNode(centerShape);
			connectorAlgorithm.setLastConnectorNode(childNode);
		}
	};
	CycleAlgorithm.prototype.isClockwise = function () {
		return this.calcValues.stepAngle > 0;
	}
	CycleAlgorithm.prototype.getShapeIndex = function (shape) {
		return this.calcValues.mainElements.indexOf(shape);
	};
	CycleAlgorithm.prototype.getRadialConnectionInfo = function (node) {
		const parentHeight = this.parentNode.getConstr(AscFormat.Constr_type_h, true);
		const parentWidth = this.parentNode.getConstr(AscFormat.Constr_type_w, true);

		const nodeIndex = this.getShapeIndex(node);
		if (nodeIndex === -1) {
			return null;
		}
		const result = {};
		const shapeContainer = this.getShapeContainer();
		const offsets = shapeContainer.getOffsets(parentHeight, parentWidth); // todo isCalculateScaleCoefficient
		result.point = new CCoordPoint(offsets.x, offsets.y);
		result.radius = this.calcValues.radius;
		// todo: add custom radial info
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
	CycleAlgorithm.prototype.getCenterShapeRadius = function (centerBounds, anotherBounds, guideVector) {
		if (!centerBounds || !anotherBounds) {
			return 0;
		}
		const centerPoint = this.getShapePoint(centerBounds);
		const anotherPoint = this.getShapePoint(anotherBounds);
		const centerEdgePoint = this.getMinShapeEdgePoint(centerBounds, guideVector);
		const anotherEdgePoint = this.getMinShapeEdgePoint(anotherBounds, new CVector(-guideVector.x, -guideVector.y));
		if (centerEdgePoint && anotherEdgePoint) {
			const centerDistance = centerPoint.getVector(centerEdgePoint).getDistance();
			const anotherDistance = anotherPoint.getVector(anotherEdgePoint).getDistance();
			const minPadding = this.parentNode.getConstr(AscFormat.Constr_type_sp);
			return centerDistance + anotherDistance + minPadding;
		}
		return 0;
	};
	CycleAlgorithm.prototype.getStartCycleBounds = function () {
		const centerNode = this.getCenterNode();
		if (centerNode) {
			const bounds = this.getCleanNodeBounds(centerNode);
			const halfWidth = (bounds.r - bounds.l) / 2;
			const halfHeight = (bounds.b - bounds.t) / 2;
			return {
				l: -halfWidth,
				r: halfWidth,
				t: -halfHeight,
				b: halfHeight
			};
		}
		return {l: 0, r: 0, t: 0, b: 0};
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
		this.parentNode.calcNodeConstraints();
		const parentConstraints = this.getNodeConstraints(this.parentNode);
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
			if (mainElementsBounds.length === 0) {
				stepAngle = 0;
			} else {
				stepAngle = (spanAngle / mainElementsBounds.length) * degToRad;
			}

		} else {
			if (mainElementsBounds.length === 0) {
				stepAngle = 0;
			} else {
				stepAngle = (spanAngle / (mainElementsBounds.length - 1)) * degToRad;
			}
		}
		stepAngle = AscFormat.normalizeRotate(stepAngle);
		this.calcValues.startAngle = startAngle;
		this.calcValues.stepAngle  = stepAngle;

		let previousAngle = startAngle;
		let currentAngle = AscFormat.normalizeRotate(startAngle + stepAngle);
		const divider = Math.sqrt(2 * (1 - Math.cos(Math.abs(stepAngle))));
		const sibSp = this.parentNode.getConstr(AscFormat.Constr_type_sibSp);

		let maxRadius = 0;
		const centerNode = this.getCenterNode();
		let centerShapeBounds;
		if (centerNode) {
			const startGuideVector = CVector.getVectorByAngle(startAngle);
			centerShapeBounds = this.getCleanNodeBounds(centerNode);
			maxRadius = this.getCenterShapeRadius(centerShapeBounds, mainElementsBounds[0], startGuideVector);
		}
		if (divider !== 0) {
			let previousBounds = mainElementsBounds[0];
			for (let i = 1; i < mainElementsBounds.length; i++) {
				const currentBounds = mainElementsBounds[i];
				const centerGuideVector = CVector.getVectorByAngle(currentAngle);
				const tempCenterRadius = this.getCenterShapeRadius(centerShapeBounds, currentBounds, centerGuideVector);

				let tempSibRadius = 0;

				const previousVector = CVector.getVectorByAngle(previousAngle);
				const currentVector = CVector.getVectorByAngle(currentAngle);
				const guideVector = currentVector.getDiffVector(previousVector);
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
		const cycleBounds = this.getStartCycleBounds();
		const radiusBounds = {l: 0, r: 0, t: 0, b: 0};
		for (let i = 0; i < mainElementsBounds.length; i++) {
			const radiusVector = CVector.getVectorByAngle(currentAngle);
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
				radiusBounds.l = radiusVector.x;
			}
			if (newT < cycleBounds.t) {
				cycleBounds.t = newT;
				radiusBounds.t = radiusVector.y;
			}
			if (newR > cycleBounds.r) {
				cycleBounds.r = newR;
				radiusBounds.r = radiusVector.x;
			}
			if (newB > cycleBounds.b) {
				cycleBounds.b = newB;
				radiusBounds.b = radiusVector.y;
			}

			currentAngle = AscFormat.normalizeRotate(currentAngle + stepAngle);
		}

		const cycleHeight = cycleBounds.b - cycleBounds.t;
		const cycleWidth = cycleBounds.r - cycleBounds.l;
		const coefficient = Math.min(1, parentConstraints.width / cycleWidth, parentConstraints.height / cycleHeight);
		let radiusCoefficient = coefficient;
		const scaleFactor = this.getOffsetScaleFactor(radiusBounds, cycleBounds);
		if (scaleFactor > 1) {
			radiusCoefficient = Math.max(coefficient, scaleFactor);
		}
		this.calcValues.radius = maxRadius * radiusCoefficient;
		for (let i = 0; i < this.parentNode.childs.length; i++) {
			const child = this.parentNode.childs[i];
			child.setWidthScaleConstrCoefficient(coefficient);
			child.setHeightScaleConstrCoefficient(coefficient);
		}
	};
	CycleAlgorithm.prototype.getOffsetScaleFactor = function (radiusBounds, cycleBounds) {
		if (this.parentNode.constr[AscFormat.Constr_type_sp] !== undefined) {
			return 1;
		}
		const parentConstraints = this.getNodeConstraints(this.parentNode);

		const radiusHeight = radiusBounds.b - radiusBounds.t;
		const radiusWidth = radiusBounds.r - radiusBounds.l;
		const parentWidth = parentConstraints.width - (radiusBounds.l - cycleBounds.l) - (cycleBounds.r - radiusBounds.r);
		const parentHeight = parentConstraints.height - (radiusBounds.t - cycleBounds.t) - (cycleBounds.b - radiusBounds.b);
		if (radiusHeight !== 0 && radiusWidth !== 0) {
			return Math.max(1, Math.min(parentWidth / radiusWidth, parentHeight / radiusHeight));
		} else if (radiusHeight === 0 && radiusWidth !== 0) {
			return Math.max(1, parentWidth / radiusWidth);
		} else if (radiusWidth === 0 && radiusHeight !== 0) {
			return Math.max(1, parentHeight / radiusHeight);
		}
		return 1;
	};

	CycleAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		const childs = this.parentNode.childs;
		const radius = this.calcValues.radius;
		let currentAngle = this.calcValues.startAngle;
		const stepAngle = this.calcValues.stepAngle;
		const container = this.getShapeContainer();
		let startIndex = 0;
		if (this.calcValues.centerNodeIndex !== null) {
			const centerNode = this.getCenterNode();
			const shape = centerNode && centerNode.shape;
			if  (shape) {
				shape.x -= shape.width / 2;
				shape.y -= shape.height / 2;
				container.push(shape);
			}
			startIndex = this.calcValues.centerNodeIndex + 1;
		}
		let incAngle = 0;
		if (this.calcValues.mainElements.length) {
			incAngle = Math.PI / this.calcValues.mainElements.length;
		}

		for (let i = startIndex; i < childs.length; i++) {
			const child = childs[i];
			if (child.isContentNode()) {
				const shape = child.shape;
				if (shape) {
					const radiusGuideVector = CVector.getVectorByAngle(currentAngle);
					radiusGuideVector.multiply(radius);
					shape.radialVector = radiusGuideVector;
					shape.incAngle = incAngle;
					const offX = radiusGuideVector.x - shape.width / 2;
					const offY = radiusGuideVector.y - shape.height / 2;
					shape.x += offX;
					shape.y += offY;
					currentAngle = currentAngle + stepAngle;
					container.push(shape);
				}
			} else {
				if (child.shape) {
					container.push(child.shape);
				}
			}
		}
		this.applyOffsetByParents();
		this.applyParamOffsets();
		this.applyConstraintOffset();
		this.applyPostAlgorithmSettings();
		this.setConnections();
		this.createShadowShape(isCalculateScaleCoefficients);
	};
	CycleAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(true);
	};
	CycleAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		if (isCalculateScaleCoefficient) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new CycleContainer();
			}
			return this.coefficientShapeContainer;
		}
		if (this.shapeContainer === null) {
			this.shapeContainer = new CycleContainer();
		}
		return this.shapeContainer;
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
	LinearAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(true);
	};
	LinearAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromL) {
			this.calculateRowLinear();
		}
		if (this.params[AscFormat.Param_type_linDir] === AscFormat.ParameterVal_linearDirection_fromT) {
			this.calculateColumnLinear();
		}
		this.createShadowShape(isCalculateScaleCoefficients);
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
		const rows = this.getShapeContainer();
		const row = new ShapeRow();
		rows.push(row);
		for (let i = 0; i < length; i++) {
			const child = childs[i];
			const shape = child.shape;
			if (shape) {
				shape.x += row.width;
				row.push(shape);
				if (row.height < shape.height) {
					row.height = shape.height;
				}
				row.width += shape.width;
			}
		}
		row.cleanHeight = row.height;
		this.applyOffsetByParents();
		this.applyParamOffsets();
		this.applyConstraintOffset();
		this.applyPostAlgorithmSettings();
		this.setConnections();
	}
	LinearAlgorithm.prototype.getShapeContainer = function (isCalculateScaleCoefficient) {
		if (isCalculateScaleCoefficient) {
			if (this.coefficientShapeContainer === null) {
				this.coefficientShapeContainer = new ShapeRows();
			}
			return this.coefficientShapeContainer;
		}
		if (this.shapeContainer === null) {
			this.shapeContainer = new ShapeRows();
		}
		return this.shapeContainer;
	};

	function ConnectorAlgorithm() {
		BaseAlgorithm.call(this);
		this.startNode = null;
		this.endNode = null;
		this.connectorShape = null;
		this.connectionDistances = {
			begin: 0.22,
			end: 0.25
		};
		this.parentAlgorithm = null;
		this.calcValues = {
			edgePoints: null,
			connectionPoints: null,
			pointPositions: null
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
		if (this.params[AscFormat.Param_type_connRout] === AscFormat.ParameterVal_connectorRouting_bend) {
			if (this.params[AscFormat.Param_type_bendPt] === undefined) {
				this.params[AscFormat.Param_type_bendPt] = AscFormat.ParameterVal_bendPoint_end;
			}
		}
	}
	ConnectorAlgorithm.prototype.getEdgePoints = function () {
		if (!this.calcValues.edgePoints) {
			const startEdgePoints = this.getAvailableEdgePoints(true);
			const endEdgePoints = this.getAvailableEdgePoints();

			let minDistance = null;
			let calcStartEdgePoint;
			let calcEndEdgePoint;
			for (let i = 0; i < startEdgePoints.length; i += 1) {
				const startEdgePoint = startEdgePoints[i].point;
				for (let j = 0; j < endEdgePoints.length; j += 1) {
					const endEdgePoint = endEdgePoints[j].point;
					const distance = startEdgePoint.getVector(endEdgePoint).getDistance();
					if (minDistance === null || minDistance > distance) {
						minDistance = distance;
						calcStartEdgePoint = startEdgePoints[i];
						calcEndEdgePoint = endEdgePoints[j];
					}
				}
			}
			this.calcValues.edgePoints = {
				start: null,
				end: null
			};
			this.calcValues.pointPositions = {
				start: AscFormat.ParameterVal_connectorPoint_auto,
				end: AscFormat.ParameterVal_connectorPoint_auto
			};
			if (calcStartEdgePoint && calcEndEdgePoint) {
				this.calcValues.edgePoints.start = calcStartEdgePoint.point;
				this.calcValues.pointPositions.start = calcStartEdgePoint.type;
				this.calcValues.edgePoints.end = calcEndEdgePoint.point;
				this.calcValues.pointPositions.end = calcEndEdgePoint.type;
			}
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
		return this.calcValues.connectionPoints;
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
		if (!this.calcValues.pointPositions) {
			this.getEdgePoints();
		}
		return isStart ? this.calcValues.pointPositions.start : this.calcValues.pointPositions.end;
	};
	ConnectorAlgorithm.prototype.getStartShape = function () {
		return this.startNode.getShape(false);
	};
	ConnectorAlgorithm.prototype.getEndShape = function () {
		return this.endNode.getShape(false);
	};
	ConnectorAlgorithm.prototype.getAutoEdgePoint = function (isStart) {
		const startShape = this.getStartShape();
		const endShape = this.getEndShape();
		const startBounds = startShape.getBounds();
		const endBounds = endShape.getBounds();
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
				const diffAngle = diffVector.getAngle();
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
		const shape = isStart ? this.getStartShape() : this.getEndShape();
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
	ConnectorAlgorithm.prototype.getAvailablePointPositions = function (isStart) {
		const parameters = isStart ? this.params[AscFormat.Param_type_begPts] : this.params[AscFormat.Param_type_endPts];
		return parameters || [AscFormat.ParameterVal_connectorPoint_auto];

	}
	ConnectorAlgorithm.prototype.getAvailableEdgePoints = function (isStart) {
		const result = [];
		const pointPositions = this.getAvailablePointPositions(isStart);
		for (let i = 0; i < pointPositions.length; i += 1) {
			const type = pointPositions[i];
			switch (type) {
				case AscFormat.ParameterVal_connectorPoint_radial:
					result.push({point: this.getRadialEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_tL:
					result.push({point: this.getTopLeftEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_tCtr:
					result.push({point: this.getTopCenterEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_tR:
					result.push({point: this.getTopRightEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_midR:
					result.push({point: this.getMidRightEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_bR:
					result.push({point: this.getBottomRightEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_bCtr:
					result.push({point: this.getBottomCenterEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_bL:
					result.push({point: this.getBottomLeftEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_midL:
					result.push({point: this.getMidLeftEdgePoint(isStart), type: type});
					break;
				case AscFormat.ParameterVal_connectorPoint_auto:
				default:
					result.push({point: this.getAutoEdgePoint(isStart), type: type});
					break;
			}
		}
		return result;
	};
	ConnectorAlgorithm.prototype.getTopLeftEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x, shape.y);
	};
	ConnectorAlgorithm.prototype.getTopCenterEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x + shape.width / 2, shape.y);
	};
	ConnectorAlgorithm.prototype.getTopRightEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x + shape.width, shape.y);
	};
	ConnectorAlgorithm.prototype.getMidRightEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x + shape.width, shape.y + shape.height / 2);
	};
	ConnectorAlgorithm.prototype.getBottomRightEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x + shape.width, shape.y + shape.height);
	};
	ConnectorAlgorithm.prototype.getBottomCenterEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x + shape.width / 2, shape.y + shape.height);
	};
	ConnectorAlgorithm.prototype.getBottomLeftEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x, shape.y + shape.height);
	};
	ConnectorAlgorithm.prototype.getMidLeftEdgePoint = function (isStart) {
		const shape = isStart ? this.getStartShape() : this.getEndShape();
		return new CCoordPoint(shape.x, shape.y + shape.height / 2);
	};

	ConnectorAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(false, false, isCalculateScaleCoefficients);
	};
	ConnectorAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		this.createShadowShape(isCalculateScaleCoefficients);
		if (!isCalculateScaleCoefficients) {
			smartartAlgorithm.addConnectorAlgorithm(this);
		}
	}

	ConnectorAlgorithm.prototype.setFirstConnectorNode = function (node) {
		this.startNode = node;
	};
	ConnectorAlgorithm.prototype.setLastConnectorNode = function (node) {
		this.endNode = node;
	};
	ConnectorAlgorithm.prototype.connectShapes = function (smartartAlgorithm) {
		if (this.startNode && this.endNode) {
			if (this.params[AscFormat.Param_type_dim] === AscFormat.ParameterVal_connectorDimension_2D) {
				this.createShapeConnector(smartartAlgorithm);
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
		connectorShape.cleanParams.width = shape.cleanParams.width;
		connectorShape.cleanParams.height = shape.cleanParams.height;
		connectorShape.cleanParams.x = shape.cleanParams.x;
		connectorShape.cleanParams.y = shape.cleanParams.y;
		connectorShape.node = this.parentNode;
		return connectorShape;
	};
	ConnectorAlgorithm.prototype.createShapeConnector = function (smartartAlgorithm) {
		const connectionPoints = this.getConnectionPoints();
		if (connectionPoints.start && connectionPoints.end) {
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
			const height = this.parentNode.shape.height;

			const x = cx - width / 2;
			const y = cy - height / 2;
			const shape = this.parentNode.shape;
			const connectorShape = this.getTemplateConnectorShape();

			connectorShape.x = x;
			connectorShape.y = y;
			connectorShape.rot = arrowVector.getAngle();
			shape.connectorShape = connectorShape;

			const prSet = this.parentNode.getPrSet();
			if (!prSet.getPresStyleLbl()) {
				prSet.setPresStyleLbl("sibTrans2D1");
			}
			const coefficient = width / shape.cleanParams.width;
			this.applyPostAlgorithmSettings(smartartAlgorithm, connectorShape, coefficient);

			const heightScale = this.parentNode.getHeightScale(true);
			const widthScale = this.parentNode.getWidthScale(true);
			const scaleHeight = height * heightScale;
			const scaleWidth = width * widthScale;
			connectorShape.height = scaleHeight;
			connectorShape.width = scaleWidth;
			connectorShape.x += (width - scaleWidth) / 2;
			connectorShape.y += (height - scaleHeight) / 2;
		}
	};

	ConnectorAlgorithm.prototype.createLineConnector = function () {
			const points = this.getConnectionPoints();
			if (points.start && points.end) {
				switch (this.params[AscFormat.Param_type_connRout]) {
					case AscFormat.ParameterVal_connectorRouting_stra:
						this.createStraightLineConnector(points.start, points.end);
						break;
					case AscFormat.ParameterVal_connectorRouting_bend:
						this.createBendLineConnector(points.start, points.end);
						break;
					default:
						break;
				}
			}
	};
	ConnectorAlgorithm.prototype.getStraightConnectionInfo = function (startPoint, endPoint) {
		const cx = (startPoint.x + endPoint.x) / 2;
		const cy = (startPoint.y + endPoint.y) / 2;

		const arrowVector = new CVector(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

		let width;
		const connectionDistanceResolver = this.parentAlgorithm.parentNode.connectionDistanceResolver;
		const minConnectionDistance = connectionDistanceResolver && connectionDistanceResolver.getConnectionDistance();
		if (connectionDistanceResolver && minConnectionDistance !== -1) {
			width = minConnectionDistance;
		} else {
			width = arrowVector.getDistance();
		}
		const shape = this.parentNode.shape;
		const height = shape.height;

		const x = cx - width / 2;
		const y = cy - height / 2;

		const coefficient = width / shape.cleanParams.width;

		const heightScale = this.parentNode.getHeightScale(true);
		const widthScale = this.parentNode.getWidthScale(true);
		const scaleHeight = height * heightScale;
		const scaleWidth = width * widthScale;

		return {
			x: x,
			y: y,
			width: scaleWidth,
			height: scaleHeight,
			offX: (width - scaleWidth) / 2,
			offY: (height - scaleHeight) / 2,
			rot: arrowVector.getAngle(),
			coefficient: coefficient
		}
	}
	ConnectorAlgorithm.prototype.isDoubleBendHorizontalConnector = function() {
		const startPoint = this.getPointPosition(true);
		const endPoint = this.getPointPosition();
		return startPoint === AscFormat.ParameterVal_connectorPoint_midR && endPoint === AscFormat.ParameterVal_connectorPoint_midL ||
			startPoint === AscFormat.ParameterVal_connectorPoint_midL && endPoint === AscFormat.ParameterVal_connectorPoint_midR;
	};
	ConnectorAlgorithm.prototype.isDoubleBendVerticalConnector = function() {
		const startPoint = this.getPointPosition(true);
		const endPoint = this.getPointPosition();
		return startPoint === AscFormat.ParameterVal_connectorPoint_bCtr && endPoint === AscFormat.ParameterVal_connectorPoint_tCtr ||
			startPoint === AscFormat.ParameterVal_connectorPoint_tCtr && endPoint === AscFormat.ParameterVal_connectorPoint_bCtr;
	};
	ConnectorAlgorithm.prototype.isWrongBendPoints = function (startPoint, endPoint) {
		const endPointPosition = this.getPointPosition();
		const startPointPosition = this.getPointPosition(true);
		switch (endPointPosition) {
			case AscFormat.ParameterVal_connectorPoint_tCtr:
				if ((endPoint.y <= startPoint.y) ||
					(startPointPosition === AscFormat.ParameterVal_connectorPoint_midR && endPoint.x <= startPoint.x) ||
					(startPointPosition === AscFormat.ParameterVal_connectorPoint_midL && endPoint.x >= startPoint.x)) {
					return true;
				}
				break;
			case AscFormat.ParameterVal_connectorPoint_bCtr:
				if ((endPoint.y >= startPoint.y) ||
					(startPointPosition === AscFormat.ParameterVal_connectorPoint_midR && endPoint.x <= startPoint.x) ||
					(startPointPosition === AscFormat.ParameterVal_connectorPoint_midL && endPoint.x >= startPoint.x)) {
					return true;
				}
				break;
			case AscFormat.ParameterVal_connectorPoint_midR:
			case AscFormat.ParameterVal_connectorPoint_bR:
				if ((endPoint.x >= startPoint.x) ||
					((startPointPosition === AscFormat.ParameterVal_connectorPoint_bCtr ||
						startPointPosition === AscFormat.ParameterVal_connectorPoint_tCtr) && endPoint.y <= startPoint.y)) {
					return true;
				}
				break;
			case AscFormat.ParameterVal_connectorPoint_midL:
			case AscFormat.ParameterVal_connectorPoint_bL:
				if ((endPoint.x <= startPoint.x) ||
					((startPointPosition === AscFormat.ParameterVal_connectorPoint_bCtr ||
						startPointPosition === AscFormat.ParameterVal_connectorPoint_tCtr) && endPoint.y <= startPoint.y)) {
					return true;
				}
				break;
		}
		return false;
	};
	ConnectorAlgorithm.prototype.getBendPoints = function (startPoint, endPoint) {
		if (this.isWrongBendPoints(startPoint, endPoint)) {
			return [];
		}
		const isReverse = this.params[AscFormat.Param_type_bendPt] === AscFormat.ParameterVal_bendPoint_end;
		if (isReverse) {
			const t = startPoint;
			startPoint = endPoint;
			endPoint = t;
		}
		let bendDist;
		if (this.isDoubleBendHorizontalConnector()) {
			bendDist = this.parentNode.adaptConstr[AscFormat.Constr_type_bendDist];
			if (bendDist === undefined) {
				bendDist = Math.abs(startPoint.x - endPoint.x) / 2;
			}
		} else if (this.isDoubleBendVerticalConnector()) {
			bendDist = this.parentNode.adaptConstr[AscFormat.Constr_type_bendDist];
			if (bendDist === undefined) {
				bendDist = Math.abs(startPoint.y - endPoint.y) / 2;
			}
		}
		const type = this.getPointPosition(!isReverse);
		let bendPoints;
		switch (type) {
			case AscFormat.ParameterVal_connectorPoint_auto:
				break;
			case AscFormat.ParameterVal_connectorPoint_bCtr: {
				if (bendDist === undefined) {
					bendPoints = [new CCoordPoint(startPoint.x, endPoint.y)];
				} else {
					let y = Math.min(endPoint.y, startPoint.y + bendDist);
					bendPoints = [new CCoordPoint(startPoint.x, y), new CCoordPoint(endPoint.x, y)];
				}
				break;
			}
			case AscFormat.ParameterVal_connectorPoint_ctr:
				break;
			case AscFormat.ParameterVal_connectorPoint_bL:
			case AscFormat.ParameterVal_connectorPoint_midL: {
				if (bendDist === undefined) {
					bendPoints = [new CCoordPoint(endPoint.x, startPoint.y)];
				} else {
					let x = Math.max(endPoint.x, startPoint.x - bendDist);
					bendPoints = [new CCoordPoint(x, startPoint.y), new CCoordPoint(x, endPoint.y)];
				}
				break;
			}
			case AscFormat.ParameterVal_connectorPoint_bR:
			case AscFormat.ParameterVal_connectorPoint_midR: {
				if (bendDist === undefined) {
					bendPoints = [new CCoordPoint(endPoint.x, startPoint.y)];
				} else {
					let x = Math.min(endPoint.x, startPoint.x + bendDist);
					bendPoints = [new CCoordPoint(x, startPoint.y), new CCoordPoint(x, endPoint.y)];
				}
				break;
			}
			case AscFormat.ParameterVal_connectorPoint_radial:
				break;
			case AscFormat.ParameterVal_connectorPoint_tCtr: {
				if (bendDist === undefined) {
					bendPoints = [new CCoordPoint(startPoint.x, endPoint.y)];
				} else {
					let y = Math.max(endPoint.y, startPoint.y - bendDist);
					bendPoints = [new CCoordPoint(startPoint.x, y), new CCoordPoint(endPoint.x, y)];
				}
				break;
			}
			case AscFormat.ParameterVal_connectorPoint_tL:
				break;
			case AscFormat.ParameterVal_connectorPoint_tR:
				break;
			default:
				break;
		}
		if (bendPoints) {
			return isReverse ? bendPoints.reverse() : bendPoints;
		}
	};
	ConnectorAlgorithm.prototype.getStartBendPoint = function (startPoint, endPoint) {

	};
	ConnectorAlgorithm.prototype.getEndBendPoint = function (startPoint, endPoint) {

	};
	ConnectorAlgorithm.prototype.getBendConnectionInfo = function (startPoint, endPoint) {
		const x = endPoint.x < startPoint.x ? endPoint.x : startPoint.x;
		const y = endPoint.y < startPoint.y ? endPoint.y : startPoint.y;
		const width = Math.abs(endPoint.x - startPoint.x);
		const height = Math.abs(endPoint.y - startPoint.y);
		const bendPoints = this.getBendPoints(startPoint, endPoint);
		return {
			x: x,
			y: y,
			width: width,
			height: height,
			bendPoints: bendPoints
		};
	}
	ConnectorAlgorithm.prototype.createBendLineConnector = function (startPoint, endPoint) {
		const shape = this.parentNode.getShape(false);
		shape.height = 0;
		const info = this.getBendConnectionInfo(startPoint, endPoint);
		const connectorShape = this.getTemplateConnectorLine();

		connectorShape.x = info.x;
		connectorShape.y = info.y;
		connectorShape.width = info.width;
		connectorShape.height = info.height;

		shape.connectorShape = connectorShape;

		const prSet = this.parentNode.getPrSet();
		if (!prSet.getPresStyleLbl()) {
			prSet.setPresStyleLbl("parChTrans1D2");
		}

		const bendPoints = info.bendPoints;
		const localEndPoint = new CCoordPoint(endPoint.x - connectorShape.x, endPoint.y - connectorShape.y);
		const localStartPoint = new CCoordPoint(startPoint.x - connectorShape.x, startPoint.y - connectorShape.y);
		if (bendPoints) {
			connectorShape.customGeom.push([0]);
				connectorShape.customGeom.push([1, localStartPoint.x, localStartPoint.y]);
				for (let i = 0; i < bendPoints.length; i++) {
					const bendPoint = bendPoints[i];
					const localBendPoint = new CCoordPoint(bendPoint.x - connectorShape.x, bendPoint.y - connectorShape.y);
					connectorShape.customGeom.push([2, localBendPoint.x, localBendPoint.y]);
				}
				connectorShape.customGeom.push([2, localEndPoint.x, localEndPoint.y]);

		} else {
			connectorShape.customGeom.push([0]);
			connectorShape.customGeom.push([1, localStartPoint.x, localStartPoint.y]);
			connectorShape.customGeom.push([2, localEndPoint.x, localEndPoint.y]);
		}
	};
	ConnectorAlgorithm.prototype.createStraightLineConnector = function (startPoint, endPoint) {
		const shape = this.parentNode.shape;
		shape.height = 0;
		const info = this.getStraightConnectionInfo(startPoint, endPoint);
		const connectorShape = this.getTemplateConnectorLine();

		connectorShape.x = info.x;
		connectorShape.y = info.y;
		connectorShape.rot = info.rot;

		shape.connectorShape = connectorShape;

		const prSet = this.parentNode.getPrSet();
		if (!prSet.getPresStyleLbl()) {
			prSet.setPresStyleLbl("parChTrans1D2");
		}

		connectorShape.height = info.height;
		connectorShape.width = info.width;
		connectorShape.x += info.offX;
		connectorShape.y += info.offY;

		connectorShape.customGeom.push([0]);
		connectorShape.customGeom.push([1, 0, 0]);
		connectorShape.customGeom.push([2, connectorShape.width, 0]);
		connectorShape.customGeom.push([6]);
	};
	ConnectorAlgorithm.prototype.getTemplateConnectorLine = function () {
		const shape = this.parentNode.shape;
		const connectorShape = new ShadowShape();
		connectorShape.shape = shape.shape;

		connectorShape.type = AscFormat.LayoutShapeType_outputShapeType_conn;
		connectorShape.cleanParams = {};
		connectorShape.cleanParams.width = shape.cleanParams.width;
		connectorShape.cleanParams.height = shape.cleanParams.height;
		connectorShape.cleanParams.x = shape.cleanParams.x;
		connectorShape.cleanParams.y = shape.cleanParams.y;
		connectorShape.node = this.parentNode;
		return connectorShape;
	}

	function SpaceAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(SpaceAlgorithm, BaseAlgorithm);
	
	SpaceAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		this.createShadowShape(isCalculateScaleCoefficients);
		if (!isCalculateScaleCoefficients) {
			this.applyPostAlgorithmSettings(smartartAlgorithm);
		}
	}
	SpaceAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(false, false, isCalculateScaleCoefficients);
	};
	function TextAlgorithm() {
		BaseAlgorithm.call(this);
	}

	AscFormat.InitClassWithoutType(TextAlgorithm, BaseAlgorithm);

	TextAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateScaleCoefficient) {
		this.createShadowShape(isCalculateScaleCoefficient);
		if (!isCalculateScaleCoefficient) {
			this.applyPostAlgorithmSettings(smartartAlgorithm);
		}
	};
	TextAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(false, false, isCalculateScaleCoefficients);
	};

	function CompositeAlgorithm() {
		BaseAlgorithm.call(this);
	}
	AscFormat.InitClassWithoutType(CompositeAlgorithm, BaseAlgorithm);

	CompositeAlgorithm.prototype.setParentConnection = function (connectorAlgorithm, childNode) {
		if (connectorAlgorithm && childNode.algorithm) {
			let srcNode;
			let dstNode;
			if (connectorAlgorithm.params[AscFormat.Param_type_srcNode]) {
				srcNode = this.parentNode.getNamedNode(connectorAlgorithm.params[AscFormat.Param_type_srcNode]);
			} else {
				srcNode = this.parentNode.getDefaultConnectionNode();
			}
			if (connectorAlgorithm.params[AscFormat.Param_type_dstNode]) {
				dstNode = childNode.getNamedNode(connectorAlgorithm.params[AscFormat.Param_type_dstNode]);
			} else {
				dstNode = childNode.getDefaultConnectionNode();
			}
			if (srcNode && dstNode) {
				connectorAlgorithm.setParentAlgorithm(this);
				connectorAlgorithm.setFirstConnectorNode(srcNode);
				connectorAlgorithm.setLastConnectorNode(dstNode);
			}
		}

	};
	CompositeAlgorithm.prototype.calcScaleCoefficients = function () {
		this.parentNode.calcNodeConstraints(true);
	};
	CompositeAlgorithm.prototype.createShadowShape = function (isCalculateScaleCoefficients) {
		return this.parentNode.createShadowShape(true, false, isCalculateScaleCoefficients);
	};
	CompositeAlgorithm.prototype.calculateShapePositions = function (smartartAlgorithm, isCalculateCoefficients) {
		const parentNode = this.parentNode;
		const bounds = this.createShadowShape(isCalculateCoefficients);
		if (!isCalculateCoefficients) {
			const shape = parentNode.getShape(isCalculateCoefficients);
			const boundsHeight = shape.height;
			const constrBounds = parentNode.getChildConstraintBounds(isCalculateCoefficients);
			const boundsWidth = constrBounds.r - constrBounds.l;
			const parentWidth = parentNode.getConstr(AscFormat.Constr_type_w, true);
			const parentHeight = parentNode.getConstr(AscFormat.Constr_type_h, true);
			const offX = -constrBounds.l + (parentWidth - boundsWidth) / 2;
			//todo: height alignment is carried out without taking into account ctrY
			const offY = -bounds.custom.t + (parentHeight - boundsHeight) / 2;
			parentNode.moveTo(offX, offY, isCalculateCoefficients);
				this.setConnections();
			}

	};

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
	this.nodeConstraints = null;
	this.shape = null;
	this.moveWithNodes = [];

	this.scaleMainConstraintCoefficient = {
		width: 1,
		height: 1
	};
	this.moveScaleCoefficients = {
		width: 1,
		height: 1
	};
	this.isHideLastTrans = true;
	this.connectionDistanceResolver = null;
	this.bounds = {
		constraints: null
	};
	this.namedNodes = null;
	this.relations = {
		nodeWidth: null,
		nodeHeight: null,
	}
	this.parentScale = {
		width: 1,
		height: 1
	}
	this.moveWith = null;
}
PresNode.prototype.getDefaultConnectionNode = function() {
	if (this.childs.length) {
		return this.childs[0];
	}
	return this;
	};
	PresNode.prototype.getShape = function (isCalculateCoefficients) {
		if (isCalculateCoefficients) {
			if (!this.nodeConstraints) {
				this.nodeConstraints = new Position(this);
			}
			return this.nodeConstraints;
		}
		if (!this.shape) {
			this.shape = new ShadowShape(this);
		}
		return this.shape;
	};
	PresNode.prototype.setWidthScale = function (pr) {
		if (pr < this.parentScale.width) {
			this.parentScale.width = pr;
		}
	}
	PresNode.prototype.setHeightScale = function (pr) {
		if (pr < this.parentScale.height) {
			this.parentScale.height = pr;
		}
	}
PresNode.prototype.getNamedNode = function (name) {
		if (name === undefined) {
			return this;
		}
	if (this.namedNodes === null) {
		this.namedNodes = {};
		const childs = this.childs;
		for (let i = 0; i < childs.length; i++) {
			const child = childs[i];
			this.namedNodes[child.getPresName()] = child;
		}
	}
	return this.namedNodes[name];
};
	PresNode.prototype.isMainElement = function () {
		return this.layoutInfo.shape.type !== AscFormat.LayoutShapeType_outputShapeType_conn &&
			this.layoutInfo.shape.type !== AscFormat.LayoutShapeType_outputShapeType_none || (this.algorithm && this.algorithm.isCanSetConnection());
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
	PresNode.prototype.collectHierarchyShapes = function(shapes) {
		const nodeElements = [this];
		const tempShapes = [];
		while (nodeElements.length) {
			const element = nodeElements.pop();
			if (element.algorithm.isHierarchy()) {
				for (let i = 0; i < element.childs.length; i += 1) {
					nodeElements.push(element.childs[i]);
				}
				const shape = element.getShape(false);
				tempShapes.push(shape);
			} else {
				const childShapes = element.getShadowShapesByZOrder();
				for (let i = childShapes.length - 1; i >= 0; i -= 1) {
					tempShapes.push(childShapes[i]);
				}
			}
		}
		tempShapes.sort(function (a, b) {
			const aIndex = a.shape.zOrderOff;
			const bIndex = b.shape.zOrderOff;
			return bIndex - aIndex;
		});
		shapes.push.apply(shapes, tempShapes);
	};
	PresNode.prototype.getShadowShapesByZOrder = function () {
		const shapes = [];
		const elements = [this];
		while (elements.length) {
			const tempElements = [];
			const element = elements.pop();
			if (element.algorithm.isHierarchy()) {
				this.collectHierarchyShapes(shapes);
			} else {
				const shape = element.getShape(false);
				if (shape) {
					shapes.push(shape);
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
			if (child.isMainElement()) {
				return child;
			}
		}

		for (let i = index - 1; i >= 0; i -= 1) {
			const child = parent.childs[i];
			const shape = child.shape;
			if (child.isMainElement()) {
				return child;
			}
		}

		return this;
	};
	PresNode.prototype.moveTo = function (deltaX, deltaY, isCalcScaleCoefficient) {
		deltaX = deltaX || 0;
		deltaY = deltaY || 0;
		this.forEachDesOrSelf(function (node) {
			const shape = node.getShape(isCalcScaleCoefficient);
			if (shape) {
				shape.x += deltaX;
				shape.y += deltaY;
			}
		});
		for (let i = 0; i < this.moveWithNodes.length; i++) {
			const moveNode = this.moveWithNodes[i];
			const moveShape = moveNode.getShape(isCalcScaleCoefficient);
			if (moveShape) {
				moveShape.x += deltaX;
				moveShape.y += deltaY;
			}
		}
		this.algorithm.moveToHierarchyOffsets(deltaX, deltaY);
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
	PresNode.prototype.addMoveWithNode = function (node) {
		this.moveWithNodes.push(node);
	}
	PresNode.prototype.checkMoveWith = function () {
		for (let i = 0; i < this.childs.length; i += 1) {
			const node = this.childs[i];
			if (node.moveWith) {
				const moveNode = this.getNamedNode(node.moveWith);
				if (moveNode) {
					moveNode.addMoveWithNode(node);
				}
			}
		}
	};
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
			case AscFormat.ElementType_value_parTrans:
				if (ptType === AscFormat.Point_type_parTrans) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_node:
				if (ptType === AscFormat.Point_type_node) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_asst:
				if (ptType === AscFormat.Point_type_asst) {
					return this;
				}
				break;
			case AscFormat.ElementType_value_nonAsst:
				if (ptType !== AscFormat.Point_type_asst) {
					return this;
				}
				break;
			default:
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
		const refNode = node.getConstraintNode(constr.refForName, constr.refPtType.getVal());
		if (!refNode) {
			return false;
		}
		const constrNode = this.getConstraintNode(constr.forName, constr.ptType.getVal());
		if (constrNode) {
			const constrVal = refNode.getRefConstr(constr, isAdapt, constrNode);
			if (!AscFormat.isRealNumber(constrVal)) {
				return false;
			}
			constrNode.setConstraint(constr, constrVal, isAdapt);
			constrNode.setParamConstraint(constr, refNode);
			if (refNode !== constrNode && constr.refFor === AscFormat.Constr_for_self && refNode.node.isRoot()) {
				if (constr.type === AscFormat.Constr_type_w) {
					this.relations.nodeWidth = refNode;
				} else if (constr.type === AscFormat.Constr_type_h) {
					this.relations.nodeHeight = refNode;
				}
			}

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
	function isUserConstr(type) {
		switch (type) {
			case AscFormat.Constr_type_userA:
			case AscFormat.Constr_type_userB:
			case AscFormat.Constr_type_userC:
			case AscFormat.Constr_type_userD:
			case AscFormat.Constr_type_userE:
			case AscFormat.Constr_type_userF:
			case AscFormat.Constr_type_userG:
			case AscFormat.Constr_type_userH:
			case AscFormat.Constr_type_userI:
			case AscFormat.Constr_type_userJ:
			case AscFormat.Constr_type_userK:
			case AscFormat.Constr_type_userL:
			case AscFormat.Constr_type_userM:
			case AscFormat.Constr_type_userN:
			case AscFormat.Constr_type_userO:
			case AscFormat.Constr_type_userP:
			case AscFormat.Constr_type_userQ:
			case AscFormat.Constr_type_userR:
			case AscFormat.Constr_type_userS:
			case AscFormat.Constr_type_userT:
			case AscFormat.Constr_type_userU:
			case AscFormat.Constr_type_userV:
			case AscFormat.Constr_type_userW:
			case AscFormat.Constr_type_userX:
			case AscFormat.Constr_type_userY:
			case AscFormat.Constr_type_userZ:
				return true;
			default:
				return false;
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
			if (constr.for !== AscFormat.Constr_for_self && constr.refFor === AscFormat.Constr_for_self || isUserConstr(constr.refType)) {
				if (constr.type === AscFormat.Constr_type_h) {
/*					if (constr.refType === AscFormat.Constr_type_w) {
						value = value * this.scaleMainConstraintCoefficient.width/!* * this.scaleMainConstraintCoefficient.height*!/;
					} else {*/
						value = value * this.scaleMainConstraintCoefficient.height;
/*					}*/
				} else if (constr.type === AscFormat.Constr_type_w) {
/*					if (constr.refType === AscFormat.Constr_type_h) {
						value = value * this.scaleMainConstraintCoefficient.width/!* * this.scaleMainConstraintCoefficient.height*!/;
					} else {*/
						value = value * this.scaleMainConstraintCoefficient.width;
/*					}*/
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
/*			case AscFormat.Constr_type_b: {
				const height = constrObject[AscFormat.Constr_type_h] || 0;
				constrObject[AscFormat.Constr_type_t] = constrObject[AscFormat.Constr_type_b] - height;
				break;
			}
			case AscFormat.Constr_type_r: {
				const width = constrObject[AscFormat.Constr_type_w] || 0;
				constrObject[AscFormat.Constr_type_l] = constrObject[AscFormat.Constr_type_r] - width;
				break;
			}*/
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
	PresNode.prototype.getParentWidth = function (isAdapt) {
		if (this.isContentNode() && this.parent) {
			const parentConstrObject = isAdapt ? this.parent.adaptConstr : this.parent.constr;
			let parentWidth = parentConstrObject[AscFormat.Constr_type_w];
			let parentHeight = parentConstrObject[AscFormat.Constr_type_h];
			const aspectRatio = this.parent.getAspectRatio();
			if (aspectRatio) {
				const aspectWidth = parentHeight * aspectRatio;
				if (parentWidth > aspectWidth) {
					parentWidth = aspectWidth;
				}
			}
			return parentWidth;
		}
	};
	PresNode.prototype.getParentHeight = function (isAdapt) {
		if (this.isContentNode() && this.parent) {
			const parentConstrObject = isAdapt ? this.parent.adaptConstr : this.parent.constr;
			let parentWidth = parentConstrObject[AscFormat.Constr_type_w];
			let parentHeight = parentConstrObject[AscFormat.Constr_type_h];
			const aspectRatio = this.parent.getAspectRatio();
			if (aspectRatio) {
				const aspectWidth = parentHeight * aspectRatio;
				if (parentWidth <= aspectWidth) {
					parentHeight = parentWidth / aspectRatio;
				}
			}
			return parentHeight;
		}
	};
	PresNode.prototype.getRefConstr = function (constr, isAdapt, constrNode) {
		let aspectRatio;
		if (constr.for === AscFormat.Constr_for_ch) {
			aspectRatio = this.getAspectRatio();
		}
		const constrObject = isAdapt ? this.adaptConstr : this.constr;
		let value;
		if (constr.refFor === AscFormat.Constr_for_self && constrObject[constr.type] !== undefined && constr.refType === AscFormat.Constr_type_none) {
			value = constrObject[constr.type];
		} else if (constrObject[constr.refType]) {
			value = constrObject[constr.refType];
		}
		if (value !== undefined) {
			switch (constr.type) {
				case AscFormat.Constr_type_h:

						value *= this.parentScale.height;


					break;
				case AscFormat.Constr_type_w:

						value *= this.parentScale.width;


					break;
			}
				switch (constr.refType) {
				case AscFormat.Constr_type_h:
					if (aspectRatio) {
						const width = constrObject[AscFormat.Constr_type_w];
						if (width !== undefined) {
							const aspectWidth = width / aspectRatio;
							if (aspectWidth < value) {
								value = aspectWidth;
							}
						}
					}
					break;
					case AscFormat.Constr_type_w:
						if (aspectRatio) {
							const height = constrObject[AscFormat.Constr_type_h];
							if (height !== undefined) {
								const aspectHeight = height * aspectRatio;
								if (aspectHeight < value) {
									value = aspectHeight;
								}
							}
						}
						break;
					default:
						break;
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
				case AscFormat.Constr_type_w: {
					value = this.getParentWidth(isAdapt);
					break;
				}
				case AscFormat.Constr_type_h: {
					value = this.getParentHeight(isAdapt);
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
	PresNode.prototype.getConstr = function (type, isAdapt) {
		const constrObj = isAdapt ? this.adaptConstr : this.constr;
			switch (type) {
			case AscFormat.Constr_type_l: {
				let result = constrObj[AscFormat.Constr_type_l];
				const right = constrObj[AscFormat.Constr_type_r];
				if (right !== undefined) {
					const width = constrObj[AscFormat.Constr_type_w] || 0;
					result = right - width;
				}
				constrObj[AscFormat.Constr_type_l] = result;
				break;
			}
			case AscFormat.Constr_type_t: {
				let result = constrObj[AscFormat.Constr_type_t];
				const bottom = constrObj[AscFormat.Constr_type_b];
				if (bottom !== undefined) {
					const height = constrObj[AscFormat.Constr_type_h] || 0;
					result = bottom - height;
				}
				constrObj[AscFormat.Constr_type_t] = result;
				break;
			}
				case AscFormat.Constr_type_w: {
					const right = constrObj[AscFormat.Constr_type_r];
					const left = constrObj[AscFormat.Constr_type_l];
					if (right !== undefined && left !== undefined) {
						constrObj[AscFormat.Constr_type_w] = right - left;
					}
					break;
				}
				case AscFormat.Constr_type_h: {
					const bottom = constrObj[AscFormat.Constr_type_b];
					const top = constrObj[AscFormat.Constr_type_t];
					if (bottom !== undefined && top !== undefined) {
						constrObj[AscFormat.Constr_type_h] = bottom - top;
					}
					break;
				}
/*				case AscFormat.Constr_type_w: {
				return this.getParentWidth(isAdapt) || 0;
			}
			case AscFormat.Constr_type_h: {
				return this.getParentHeight(isAdapt) || 0;
			}*/
			default:
				break;
		}
		return constrObj[type] || 0;
	};


	PresNode.prototype.getDirection = function () {
		return this.presPoint.getDirection();
	}

	PresNode.prototype.checkName = function (name) {
		if (this.getPresName() === name) {
			return this;
		}
	}

	PresNode.prototype.startAlgorithm = function (smartartAlgorithm, isCalculateScaleCoefficients) {
		if (this.algorithm) {
			this.algorithm.calculateShapePositions(smartartAlgorithm, isCalculateScaleCoefficients);
		}
	}

	PresNode.prototype.calcScaleCoefficients = function (smartartAlgorithm) {
		if (this.algorithm) {
			this.algorithm.calcScaleCoefficients(smartartAlgorithm);
		}
	}
	PresNode.prototype.setLayoutConstraints = function (lst) {
		this.layoutInfo.constrLst = lst;
	};
	PresNode.prototype.setLayoutRules = function (lst) {
		this.layoutInfo.ruleLst = lst;
	};
	PresNode.prototype.checkBounds = function (bounds) {
		this.nodeConstraints.checkBounds(bounds);
	}
	PresNode.prototype.calcNodeConstraints = function (isComposite) {
		if (isComposite && this.childs.length) {
			this.updateCompositeSizes(true, false);
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
	PresNode.prototype.updateCompositeSizes = function (isCalculateCoefficients, changePosition) {
		if (!this.childs.length) {
			return;
		}
		const firstShape = this.childs[0].getShape(isCalculateCoefficients);
		const cleanParams = firstShape.cleanParams;
		const bounds = {
			custom: {
				l: firstShape.x,
				r: firstShape.x + firstShape.width,
				t: firstShape.y,
				b: firstShape.y + firstShape.height
			},
			clean: {
				l: cleanParams.x,
				r: cleanParams.x + cleanParams.width,
				t: cleanParams.y,
				b: cleanParams.y + cleanParams.height
			}
		};
		for (let i = 1; i < this.childs.length; i += 1) {
			this.childs[i].checkShapeBounds(bounds, isCalculateCoefficients);
		}
		const shape = this.getShape(isCalculateCoefficients);
		if (!changePosition) {
			shape.x = bounds.custom.l;
			shape.y = bounds.custom.t;
			shape.cleanParams.x = bounds.clean.l;
			shape.cleanParams.y = bounds.clean.t;
		}

		shape.width = bounds.custom.r - bounds.custom.l;
		shape.height = bounds.custom.b - bounds.custom.t;

		shape.cleanParams.width = bounds.clean.r - bounds.clean.l;
		shape.cleanParams.height = bounds.clean.b - bounds.clean.t;
		return bounds;
	};
	PresNode.prototype.createShadowShape = function (isComposite, isCombine, isCalculateCoefficients) {

		const shape = this.getShape(isCalculateCoefficients);
		shape.initFromShape(this.layoutInfo.shape);
		this.createShadowShapeFromConstraints(shape, isCalculateCoefficients);
		if (isComposite) {
			shape.isSpacing = !(isComposite || isCombine);
			//todo
			this.algorithm.setConstraintSizes(shape);
			return this.updateCompositeSizes(isCalculateCoefficients, isCombine);
		}
	};
	PresNode.prototype.createHierarchyRootShadowShape = function (isCalculateCoefficients) {
		const algorithm = this.algorithm;
		if (algorithm) {
			const root = algorithm.getRoot();
			const shape = this.getShape(isCalculateCoefficients);
			shape.initFromShape(this.layoutInfo.shape);
			// root.algorithm.getBounds();
			const rootShape = root.getShape(isCalculateCoefficients);
			shape.x = rootShape.x;
			shape.y = rootShape.y;
			shape.width = rootShape.width;
			shape.height = rootShape.height;
			shape.cleanParams = Object.assign({}, rootShape.cleanParams);
		}
	};
	PresNode.prototype.createHierarchyChildShadowShape = function (isCalculateCoefficients) {
		const shape = this.getShape(isCalculateCoefficients);
		shape.initFromShape(this.layoutInfo.shape);
		const childs = this.algorithm.getMainChilds();
		if (!childs.length) {
			return;
		}
		let bounds = childs[0].algorithm.getBounds(isCalculateCoefficients);
		for (let i = 1; i < childs.length; i += 1) {
			const child = childs[i];
			const algorithm = child.algorithm;
			bounds = algorithm.getBounds(isCalculateCoefficients, bounds);
		}
		if (bounds) {
			shape.x = bounds.l;
			shape.y = bounds.t;
			shape.width = bounds.r - bounds.l;
			shape.height = bounds.b - bounds.t;
		}
	};
	PresNode.prototype.createShadowShapeFromConstraints = function (layoutShape, isCalculateCoefficients) {
		const constrObject = isCalculateCoefficients ? this.constr : this.adaptConstr;
		const shape = this.getShape(isCalculateCoefficients);
		shape.rot = AscFormat.isRealNumber(layoutShape.rot) ? AscFormat.normalizeRotate(degToRad * layoutShape.rot) : 0;

		const widthCoef = this.getWidthScale();
		const heightCoef = this.getHeightScale();
		let x = 0;
		let y = 0;
		let width = this.getConstr(AscFormat.Constr_type_w, !isCalculateCoefficients);
		let height = this.getConstr(AscFormat.Constr_type_h, !isCalculateCoefficients);
		let scaleWidth = width * widthCoef;
		let scaleHeight = height * heightCoef;
		if (layoutShape.rot === 90 || layoutShape.rot === 270) {
			let temp = width;
			width = height;
			height = temp;
			temp = scaleWidth;
			scaleWidth = scaleHeight;
			scaleHeight = temp;
		}

		const calcL = this.getConstr(AscFormat.Constr_type_l, !isCalculateCoefficients);
		if (constrObject[AscFormat.Constr_type_l] !== undefined) {
			x = calcL;
		} else if (constrObject[AscFormat.Constr_type_ctrX] !== undefined) {
			x = constrObject[AscFormat.Constr_type_ctrX] - (x + width / 2);
		}
		const calcT = this.getConstr(AscFormat.Constr_type_t, !isCalculateCoefficients);
		if (constrObject[AscFormat.Constr_type_t] !== undefined) {
			y = calcT;
		} else if (constrObject[AscFormat.Constr_type_ctrY] !== undefined) {
			y = constrObject[AscFormat.Constr_type_ctrY] - (y + height / 2);
		}

		shape.x = x;
		shape.y = y;


		shape.width = scaleWidth;
		shape.height = scaleHeight;
		const offX = (width - shape.width) / 2;
		const offY = (height - shape.height) / 2;
		shape.x += offX;
		shape.y += offY;

		for (let i = 0; i < this.moveWithNodes.length; i += 1) {
			const moveNode = this.moveWithNodes[i];
			const moveConstrObject = isCalculateCoefficients ? moveNode.constr : moveNode.adaptConstr;
			if (moveNode.isInitShape(isCalculateCoefficients)) {
				const moveShape = moveNode.getShape(isCalculateCoefficients);
				const scaleMoveWidth = moveShape.width * widthCoef;
				const scaleMoveHeight = moveShape.height * heightCoef;
				const moveOffX = (shape.x + (moveShape.x - x) * widthCoef) - moveShape.x;
				const moveOffY = (moveShape.height - scaleMoveHeight) / 2;
				moveShape.width = scaleMoveWidth;
				moveShape.height = scaleMoveHeight;
				moveNode.moveTo(moveOffX, moveOffY, isCalculateCoefficients);


			} else {
				moveNode.setMoveScaleCoefficients(widthCoef, heightCoef);
			}
		}

		shape.cleanParams = {
			width: width,
			height: height,
			x: x,
			y: y
		};
	};
	PresNode.prototype.isInitShape = function (isCalculateScaleCoefficient) {
		return !!(isCalculateScaleCoefficient ? this.nodeConstraints : this.shape);
	};
	PresNode.prototype.setMoveScaleCoefficients = function (widthCoefficient, heightCoefficient) {
		this.moveScaleCoefficients.width = widthCoefficient;
		this.moveScaleCoefficients.height = heightCoefficient;
	};
	PresNode.prototype.getChildConstraintBounds = function (isCalculateCoefficients) {
		if (this.bounds.constraints === null) {
			const constrBounds = {
				l: 0,
				r: 0,
				t: 0,
				b: 0
			};
			this.bounds.constraints = constrBounds;
			if (this.childs.length) {
				const firstNodeConstraints = this.childs[0].algorithm && this.childs[0].algorithm.constraintSizes;
				if (firstNodeConstraints) {
					constrBounds.b = firstNodeConstraints.y + firstNodeConstraints.height;
					constrBounds.t = firstNodeConstraints.y;
					constrBounds.l = firstNodeConstraints.x;
					constrBounds.r = firstNodeConstraints.x + firstNodeConstraints.width;
				} else {
					const shape = this.childs[0].getShape(isCalculateCoefficients);
					constrBounds.b = shape.y + shape.height;
					constrBounds.t = shape.y;
					constrBounds.l = shape.x;
					constrBounds.r = shape.x + shape.width;
				}
				for (let i = 1; i < this.childs.length; i++) {
					this.childs[i].checkConstraintBounds(constrBounds, isCalculateCoefficients);
				}
			}
		}
		return this.bounds.constraints;
	};
	PresNode.prototype.checkConstraintBounds = function (bounds, isCalculateScaleCoefficient) {
		if (!this.isContentNode()) {
			return;
		}
		const constraintSizes = this.algorithm && this.algorithm.constraintSizes;
		if (constraintSizes) {
			if (constraintSizes.x < bounds.l) {
				bounds.l = constraintSizes.x;
			}
			if (constraintSizes.y < bounds.t) {
				bounds.t = constraintSizes.y;
			}
			const right = constraintSizes.x + constraintSizes.width;
			if (right > bounds.r) {
				bounds.r = right;
			}
			const bottom = constraintSizes.y + constraintSizes.height;
			if (bottom > bounds.b) {
				bounds.b = bottom;
			}
		} else {
			const shape = this.getShape(isCalculateScaleCoefficient);
			if (shape.x < bounds.l) {
				bounds.l = shape.x;
			}
			if (shape.y < bounds.t) {
				bounds.t = shape.y;
			}
			const right = shape.x + shape.width;
			if (right > bounds.r) {
				bounds.r = right;
			}
			const bottom = shape.y + shape.height;
			if (bottom > bounds.b) {
				bounds.b = bottom;
			}
		}
	};

	PresNode.prototype.checkShapeBounds = function (bounds, isCalculateScaleCoefficient) {
		const shape = this.getShape(isCalculateScaleCoefficient);
		if (!this.isContentNode() || shape.width === 0 && shape.height === 0 || !(this.algorithm instanceof CompositeAlgorithm) && (!this.isMainElement() || this.layoutInfo.shape.hideGeom)) {
			return;
		}

		checkPositionBounds(shape, bounds.custom);
		checkPositionBounds(shape.cleanParams, bounds.clean);
	};

	PresNode.prototype.getHeightScale = function (force) {
		const node = this.node;
		if (!force && node.isSibNode()) {
			return this.moveScaleCoefficients.height;
		}
		const prSet = this.getPrSet();
		if (prSet) {
			return (prSet.custScaleY || 1) * this.moveScaleCoefficients.height;
		}
		return this.moveScaleCoefficients.height;
	}

	PresNode.prototype.getWidthScale = function (force) {
		const node = this.node;
		if (!force && node.isSibNode()) {
			return this.moveScaleCoefficients.width;
		}
		const prSet = this.getPrSet();
		if (prSet) {
			return (prSet.custScaleX || 1) * this.moveScaleCoefficients.width;
		}
		return this.moveScaleCoefficients.width;
	}

	PresNode.prototype.initRootConstraints = function (smartArt, smartartAlgorithm) {
		this.constr[AscFormat.Constr_type_w] = smartArt.spPr.xfrm.extX;
		this.constr[AscFormat.Constr_type_h] = smartArt.spPr.xfrm.extY;
		this.adaptConstr[AscFormat.Constr_type_w] = smartArt.spPr.xfrm.extX * smartartAlgorithm.sizeCoefficients.widthCoefficient;
		this.adaptConstr[AscFormat.Constr_type_h] = smartArt.spPr.xfrm.extY * smartartAlgorithm.sizeCoefficients.heightCoefficient;
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
			if (points.end && points.start) {
				const v = new CVector(points.end.x - points.start.x, points.end.y - points.start.y);
				this.connectionDistance = v.getDistance();
			} else {
				return;
			}
		}
		for (let i = 1; i < this.connectionAlgorithms.length; i++) {
			const alg = this.connectionAlgorithms[i];
			const points = alg.getConnectionPoints();
			if (points.end && points.start) {
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

	AscFormat.SmartArtAlgorithm = SmartArtAlgorithm;
})(window);

