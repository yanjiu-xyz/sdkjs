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

(function (window, undefined) {
	var InitClass = AscFormat.InitClass;
	var CAnimTexture = AscFormat.CAnimTexture;

	const STATE_FLAG_SELECTED = 1;
	const STATE_FLAG_HOVERED = 2;
	const STATE_FLAG_PRESSED = 4;
	const STATE_FLAG_DISABLED = 8;

	const CONTROL_TYPE_UNKNOWN = 0;
	const CONTROL_TYPE_LABEL = 1;
	const CONTROL_TYPE_IMAGE = 2;
	const CONTROL_TYPE_BUTTON = 3;
	const CONTROL_TYPE_HEADER = 4;
	const CONTROL_TYPE_SCROLL_VERT = 5;
	const CONTROL_TYPE_SCROLL_HOR = 6;
	const CONTROL_TYPE_TIMELINE_CONTAINER = 7;
	const CONTROL_TYPE_TIMELINE = 8;
	const CONTROL_TYPE_SEQ_LIST_CONTAINER = 9;
	const CONTROL_TYPE_SEQ_LIST = 10;
	const CONTROL_TYPE_ANIM_SEQ = 11;
	const CONTROL_TYPE_ANIM_GROUP_LIST = 12;
	const CONTROL_TYPE_ANIM_GROUP = 13;
	const CONTROL_TYPE_ANIM_ITEM = 14;
	const CONTROL_TYPE_EFFECT_BAR = 15;


	function CControl(oParentControl) {
		AscFormat.ExecuteNoHistory(function () {
			AscFormat.CShape.call(this);
			this.setRecalculateInfo();
			this.setBDeleted(false);
			this.setLayout(0, 0, 0, 0);
		}, this, []);

		this.parent = editor.WordControl.m_oLogicDocument.Slides[0];
		this.parentControl = oParentControl;
		this.state = 0;
		this.hidden = false;
		this.previous = null;
		this.next = null;
	}

	InitClass(CControl, AscFormat.CShape, CONTROL_TYPE_UNKNOWN);

	CControl.prototype.DEFALT_WRAP_OBJECT = {
		oTxWarpStruct: null,
		oTxWarpStructParamarks: null,
		oTxWarpStructNoTransform: null,
		oTxWarpStructParamarksNoTransform: null
	};
	CControl.prototype.setHidden = function (bVal) {
		if (this.hidden !== bVal) {
			this.hidden = bVal;
			this.onUpdate();
		}
	};
	CControl.prototype.show = function () {
		this.setHidden(false);
	};
	CControl.prototype.hide = function () {
		this.setHidden(true);
	};
	CControl.prototype.isHidden = function () {
		return this.hidden;
	};
	CControl.prototype.notAllowedWithoutId = function () {
		return false;
	};
	//define shape methods
	CControl.prototype.getBodyPr = function () {
		return this.bodyPr;
	};
	CControl.prototype.getScrollOffsetX = function (oChild) {
		return 0;
	};
	CControl.prototype.getScrollOffsetY = function (oChild) {
		return 0;
	};
	CControl.prototype.getParentScrollOffsetX = function (oChild) {
		if (this.parentControl) {
			return this.parentControl.getScrollOffsetX(oChild);
		}
		return 0;
	};
	CControl.prototype.getParentScrollOffsetY = function (oChild) {
		if (this.parentControl) {
			return this.parentControl.getScrollOffsetY(oChild);
		}
		return 0;
	};
	CControl.prototype.getFullTransformMatrix = function () {
		return this.transform;
	};
	CControl.prototype.getInvFullTransformMatrix = function () {
		return this.invertTransform;
	};
	CControl.prototype.multiplyParentTransforms = function (oLocalTransform) {
		var oMT = AscCommon.global_MatrixTransformer;
		var oTransform = oMT.CreateDublicateM(oLocalTransform);
		var oScrollMatrix = new AscCommon.CMatrix();
		oScrollMatrix.tx = this.getParentScrollOffsetX(this);
		oScrollMatrix.ty = this.getParentScrollOffsetY(this);
		oMT.MultiplyAppend(oTransform, oScrollMatrix);
		var oParentTransform = this.parentControl && this.parentControl.getFullTransformMatrix();
		oParentTransform && oMT.MultiplyAppend(oTransform, oParentTransform);
		return oTransform;
	};
	CControl.prototype.getFullTransform = function () {
		return this.transform;
	};
	CControl.prototype.getFullTextTransform = function () {
		return this.transformText;
	};
	CControl.prototype.recalculate = function () {
		AscFormat.CShape.prototype.recalculate.call(this);
	};
	CControl.prototype.recalculateBrush = function () {
		this.brush = null;
	};
	CControl.prototype.recalculatePen = function () {
		this.pen = null;
	};
	CControl.prototype.recalculateContent = function () {
	};
	CControl.prototype.recalculateGeometry = function () {
		//this.calcGeometry = AscFormat.CreateGeometry("rect");
		//this.calcGeometry.Recalculate(this.extX, this.extY);
	};
	CControl.prototype.recalculateTransform = function () {
		if (!this.transform) {
			this.transform = new AscCommon.CMatrix();
		}
		var tx = this.getLeft();
		var ty = this.getTop();
		this.x = tx;
		this.y = ty;
		this.rot = 0;
		this.extX = this.getWidth();
		this.extY = this.getHeight();
		this.flipH = false;
		this.flipV = false;
		ty += this.getParentScrollOffsetY(this);
		var oCurParent = this.parentControl;

		if (oCurParent) {
			tx += oCurParent.transform.tx;
			ty += oCurParent.transform.ty
		}
		this.transform.tx = tx;
		this.transform.ty = ty;
		if (!this.invertTransform) {
			this.invertTransform = new AscCommon.CMatrix();
		}
		this.invertTransform.tx = -tx;
		this.invertTransform.ty = -ty;
		this.localTransform = this.transform;
	};
	CControl.prototype.recalculateTransformText = function () {
		if (!this.transformText) {
			this.transformText = new AscCommon.CMatrix();
		}
		this.transformText.tx = this.transform.tx;
		this.transformText.ty = this.transform.ty;

		if (!this.invertTransformText) {
			this.invertTransformText = new AscCommon.CMatrix();
		}
		this.invertTransformText.tx = -this.transform.tx;
		this.invertTransformText.ty = -this.transform.ty;
		this.localTransformText = this.transformText;
	};
	CControl.prototype.recalculateBounds = function () {
		var dX = this.transform.tx;
		var dY = this.transform.ty;
		this.bounds.reset(dX, dY, dX + this.getWidth(), dY + this.getHeight())
	};
	CControl.prototype.recalculateSnapArrays = function () {
	};
	CControl.prototype.checkAutofit = function (bIgnoreWordShape) {
		return false;
	};
	CControl.prototype.checkTextWarp = function (oContent, oBodyPr, dWidth, dHeight, bNeedNoTransform, bNeedWarp) {
		return this.DEFALT_WRAP_OBJECT;
	};
	CControl.prototype.addToRecalculate = function () {
	};
	CControl.prototype.canHandleEvents = function () {
		return true;
	};
	CControl.prototype.getPenWidth = function (graphics) {
		var fScale = graphics.m_oCoordTransform.sx;
		var nPenW = AscCommon.AscBrowser.convertToRetinaValue(1, true) / fScale;
		return nPenW;
	};
	CControl.prototype.draw = function (graphics) {
		if (this.isHidden()) {
			return false;
		}
		if (!this.checkUpdateRect(graphics.updatedRect)) {
			return false;
		}

		this.recalculateTransform();
		this.recalculateTransformText();

		var sFillColor = this.getFillColor();
		var sOutlineColor = this.getOutlineColor();
		var oColor;
		if (sOutlineColor || sFillColor) {
			graphics.SaveGrState();
			graphics.transform3(this.transform);
			var x = 0;
			var y = 0;
			var extX = this.getWidth();
			var extY = this.getHeight();
			if (sFillColor) {
				oColor = AscCommon.RgbaHexToRGBA(sFillColor);
				graphics.b_color1(oColor.R, oColor.G, oColor.B, 0xFF);
				graphics.rect(x, y, extX, extY);
				graphics.df();
			}
			if (sOutlineColor) {
				oColor = AscCommon.RgbaHexToRGBA(sOutlineColor);
				graphics.SetIntegerGrid(true);

				var nPenW = this.getPenWidth(graphics);
				//graphics.p_width(100);//AscCommon.AscBrowser.convertToRetinaValue(1, true);
				graphics.p_color(oColor.R, oColor.G, oColor.B, 0xFF);
				graphics.drawHorLine(0, y, x, x + extX, nPenW);
				graphics.drawHorLine(0, y + extY, x, x + extX, nPenW);
				graphics.drawVerLine(2, x, y, y + extY, nPenW);
				graphics.drawVerLine(2, x + extX, y, y + extY, nPenW);
				graphics.ds();
			}
			graphics.RestoreGrState();
		}
		AscFormat.CShape.prototype.draw.call(this, graphics);
		return true;

	};
	CControl.prototype.hit = function (x, y) {
		if (this.parentControl && !this.parentControl.hit(x, y)) {
			return false;
		}
		var oInv = this.invertTransform;
		var tx = oInv.TransformPointX(x, y);
		var ty = oInv.TransformPointY(x, y);
		return tx >= 0 && tx <= this.extX && ty >= 0 && ty <= this.extY;
	};
	CControl.prototype.setStateFlag = function (nFlag, bValue) {
		var nOldState = this.state;
		if (bValue) {
			this.state |= nFlag;
		} else {
			this.state &= (~nFlag);
		}
		if (nOldState !== this.state) {
			this.onUpdate();
		}
	};
	CControl.prototype.getStateFlag = function (nFlag) {
		return (this.state & nFlag) !== 0;
	};
	CControl.prototype.isHovered = function () {
		return this.getStateFlag(STATE_FLAG_HOVERED);
	};
	CControl.prototype.isActive = function () {
		if (this.parentControl) {
			if (!this.eventListener && this.parentControl.isEventListener(this)) {
				return true;
			}
		}
		return false;
	};
	CControl.prototype.setHoverState = function () {
		this.setStateFlag(STATE_FLAG_HOVERED, true);
	};
	CControl.prototype.setNotHoverState = function () {
		this.setStateFlag(STATE_FLAG_HOVERED, false);
	};
	CControl.prototype.onMouseMove = function (e, x, y) {
		if (e.IsLocked) {
			return false;
		}
		if (!this.canHandleEvents()) {
			return false;
		}
		var bHover = this.hit(x, y);
		var bRet = bHover !== this.isHovered();
		if (bHover) {
			this.setHoverState();
		} else {
			this.setNotHoverState();
		}
		return bRet;
	};
	CControl.prototype.onMouseDown = function (e, x, y) {
		if (!this.canHandleEvents()) {
			return false;
		}
		if (this.hit(x, y)) {
			if (this.parentControl) {
				this.parentControl.setEventListener(this);
			}
			return true;
		}
		return false;
	};
	CControl.prototype.onMouseUp = function (e, x, y) {
		if (this.parentControl) {
			if (this.parentControl.isEventListener(this)) {
				this.parentControl.setEventListener(null);
				return true;
			}
		}
		return false;
	};
	CControl.prototype.onMouseWheel = function (e, deltaY, X, Y) {
		return false;
	};
	CControl.prototype.onUpdate = function () {
		if (this.parentControl) {
			var oBounds = this.getBounds();
			this.parentControl.onChildUpdate(oBounds);
		}
	};
	CControl.prototype.onChildUpdate = function (oBounds) {
		if (this.parentControl) {
			this.parentControl.onChildUpdate(oBounds);
		}
	};
	CControl.prototype.getCursorInfo = function (e, x, y) {
		if (!this.hit(x, y)) {
			return null;
		} else {
			return {
				cursorType: "default",
				tooltip: this.getTooltipText()
			}
		}
	};
	CControl.prototype.checkUpdateRect = function (oUpdateRect) {
		var oBounds = this.getBounds();
		if (oUpdateRect && oBounds) {
			if (!oUpdateRect.isIntersectOther(oBounds)) {
				return false;
			}
		}
		return true;
	};
	CControl.prototype.recalculate = function () {
		AscFormat.CShape.prototype.recalculate.call(this);
	};
	/**
	 * Sets the location and dimensions of the control inside the parent container.
	 *
	 * @param {number} dX - Offset of the element along the X axis relative to the upper-left corner of the parent container.
	 * @param {number} dY - Offset of the element along the Y axis relative to the upper-left corner of the parent container.
	 * @param {number} dExtX - Width of the element.
	 * @param {number} dExtY - Height of the element.
	 *
	 * @note
	 * - Negative values for dX and dY are supported with behavior similar to "overflow: hidden" in CSS.
	 * - Negative values for dExtX and dExtY are not supported and may lead to unexpected behavior.
	 * - It is recommended to avoid using negative values for dExtX and dExtY to ensure proper rendering and hit detection.
	 */
	CControl.prototype.setLayout = function (dX, dY, dExtX, dExtY) {
		if (!this.spPr) {
			this.spPr = new AscFormat.CSpPr();
		}
		if (!this.spPr.xfrm) {
			this.spPr.xfrm = new AscFormat.CXfrm();
		}

		this.spPr.xfrm.offX = dX;
		this.spPr.xfrm.offY = dY;
		this.spPr.xfrm.extX = dExtX;
		this.spPr.xfrm.extY = dExtY;
		this.handleUpdateExtents();
	};
	CControl.prototype.getLeft = function () {
		return this.spPr.xfrm.offX;
	};
	CControl.prototype.getTop = function () {
		return this.spPr.xfrm.offY;
	};
	CControl.prototype.getRight = function () {
		return this.spPr.xfrm.offX + this.spPr.xfrm.extX;
	};
	CControl.prototype.getBottom = function () {
		return this.spPr.xfrm.offY + this.spPr.xfrm.extY;
	};
	CControl.prototype.getWidth = function () {
		return this.spPr.xfrm.extX;
	};
	CControl.prototype.getHeight = function () {
		return this.spPr.xfrm.extY;
	};
	CControl.prototype.getBounds = function () {
		this.recalculateBounds();
		this.recalculateTransform();
		this.recalculateTransformText();
		return this.bounds;
	};
	CControl.prototype.convertRelToAbs = function (oPos) {
		var oAbsPos = { x: oPos.x, y: oPos.y };
		var oParent = this;
		while (oParent) {
			oAbsPos.x += oParent.getLeft();
			oAbsPos.y += oParent.getTop();
			oParent = oParent.parentControl;
		}
		return oAbsPos;
	};
	CControl.prototype.convertAbsToRel = function (oPos) {
		var oRelPos = { x: oPos.x, y: oPos.y };
		var oParent = this;
		while (oParent) {
			oRelPos.x -= oParent.getLeft();
			oRelPos.y -= oParent.getTop();
			oParent = oParent.parentControl;
		}
		return oRelPos;
	};
	CControl.prototype.getNext = function () {
		return this.next;
	};
	CControl.prototype.getPrevious = function () {
		return this.previous;
	};
	CControl.prototype.setNext = function (v) {
		this.next = v;
	};
	CControl.prototype.setPrevious = function (v) {
		this.previous = v;
	};
	CControl.prototype.setParentControl = function (v) {
		this.parentControl = v;
	};
	CControl.prototype.getTiming = function () {
		var oSlide = this.getSlide();
		if (oSlide) {
			return oSlide.timing;
		}
		return null;
	};
	CControl.prototype.getSlide = function () {
		var oSlide = null;
		if (editor.WordControl && editor.WordControl.m_oLogicDocument) {
			oSlide = editor.WordControl.m_oLogicDocument.GetCurrentSlide();
			return oSlide;
		}
		return null;
	};
	CControl.prototype.getSlideNum = function () {
		var oSlide = this.getSlide();
		if (oSlide) {
			return oSlide.num;
		}
		return -1;
	};
	CControl.prototype.getFillColor = function () {
		var sFillColor;
		var oSkin = AscCommon.GlobalSkin;
		if (this.isActive()) {
			sFillColor = oSkin.ThumbnailsPageOutlineActive;
		} else if (this.isHovered()) {
			sFillColor = oSkin.ScrollerHoverColor;
		} else {
			sFillColor = oSkin.BackgroundColorThumbnails;
		}
		return sFillColor;
	};
	CControl.prototype.getOutlineColor = function () {
		var sOutlineColor;
		var oSkin = AscCommon.GlobalSkin;
		if (this.isActive()) {
			sOutlineColor = oSkin.ScrollOutlineActiveColor;
		} else if (this.isHovered()) {
			sOutlineColor = oSkin.ThumbnailsPageOutlineHover;
		} else {
			sOutlineColor = oSkin.ScrollOutlineColor;
		}
		return sOutlineColor;
	};
	CControl.prototype.drawShdw = function () {

	};


	function CControlContainer(oParentControl) {
		CControl.call(this, oParentControl);
		this.children = [];
		this.recalcInfo.recalculateChildrenLayout = true;
		this.recalcInfo.recalculateChildren = true;

		this.eventListener = null;
	}

	InitClass(CControlContainer, CControl, CONTROL_TYPE_UNKNOWN);

	CControlContainer.prototype.isEventListener = function (oChild) {
		return this.eventListener === oChild;
	};
	CControlContainer.prototype.onScroll = function () {
	};
	CControlContainer.prototype.onStartScroll = function () {
	};
	CControlContainer.prototype.onEndScroll = function () {
	};
	CControlContainer.prototype.clear = function () {
		for (var nIdx = this.children.length - 1; nIdx > -1; --nIdx) {
			this.removeControl(this.children[nIdx]);
		}
	};
	CControlContainer.prototype.addControl = function (oChild) {
		var oLast = this.children[this.children.length - 1];
		this.children.push(oChild);
		if (oLast) {
			oLast.setNext(oChild);
			oChild.setPrevious(oLast);
			oChild.setParentControl(this);
		}
		return oChild;
	};
	CControlContainer.prototype.removeControl = function (oChild) {
		var nIdx = this.getChildIdx(oChild);
		this.removeByIdx(nIdx);
	};
	CControlContainer.prototype.removeByIdx = function (nIdx) {
		if (nIdx > -1 && nIdx < this.children.length) {
			var oChild = this.children[nIdx];
			oChild.setNext(null);
			oChild.setPrevious(null);
			oChild.setParentControl(null);
			var oPrev = this.children[nIdx - 1] || null;
			var oNext = this.children[nIdx + 1] || null;
			if (oPrev) {
				oPrev.setNext(oNext);
			}
			if (oNext) {
				oNext.setPrevious(oPrev);
			}
			this.children.splice(nIdx, 1);
		}
	};
	CControlContainer.prototype.getChildIdx = function (oChild) {
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			if (this.children[nChild] === oChild) {
				return nChild;
			}
		}
		return -1;
	};
	CControlContainer.prototype.getChildByType = function (nType) {
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			var oChild = this.children[nChild];
			if (oChild.getObjectType() === nType) {
				return oChild;
			}
		}
		return null;
	};
	CControlContainer.prototype.getChild = function (nIdx) {
		if (nIdx > -1 && nIdx < this.children.length) {
			return this.children[nIdx];
		}
	};
	CControlContainer.prototype.draw = function (graphics) {
		if (!CControl.prototype.draw.call(this, graphics)) {
			return false;
		}
		this.clipStart(graphics);
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			this.children[nChild].draw(graphics);
		}
		this.clipEnd(graphics);
		return true;
	};
	CControlContainer.prototype.clipStart = function (graphics) {
	};
	CControlContainer.prototype.clipEnd = function (graphics) {
	};
	CControlContainer.prototype.recalculateChildrenLayout = function () {
	};
	CControlContainer.prototype.recalculateChildren = function () {
	};
	CControlContainer.prototype.recalculate = function () {
		AscFormat.ExecuteNoHistory(function () {
			CControl.prototype.recalculate.call(this);
			if (this.recalcInfo.recalculateChildren) {
				this.recalculateChildren();
				this.recalcInfo.recalculateChildren = false;
			}
			if (this.recalcInfo.recalculateChildrenLayout) {
				this.recalculateChildrenLayout();
				this.recalcInfo.recalculateChildrenLayout = false;
			}
			for (var nChild = 0; nChild < this.children.length; ++nChild) {
				this.children[nChild].recalculate();
			}
		}, this, []);
	};
	CControlContainer.prototype.setLayout = function (dX, dY, dExtX, dExtY) {
		AscFormat.ExecuteNoHistory(function () {
			CControl.prototype.setLayout.call(this, dX, dY, dExtX, dExtY);
			this.recalcInfo.recalculateChildrenLayout = true;
		}, this, []);
	};
	CControlContainer.prototype.handleUpdateExtents = function () {
		this.recalcInfo.recalculateChildrenLayout = true;
		CControl.prototype.handleUpdateExtents.call(this);
	};
	CControlContainer.prototype.setEventListener = function (oChild) {
		if (oChild) {
			this.eventListener = oChild;
			if (this.parentControl) {
				this.parentControl.setEventListener(this);
			}
		} else {
			this.eventListener = null;
			if (this.parentControl) {
				this.parentControl.setEventListener(null);
			}
		}
	};
	CControlContainer.prototype.onMouseDown = function (e, x, y) {
		for (var nChild = this.children.length - 1; nChild >= 0; --nChild) {
			if (this.children[nChild].onMouseDown(e, x, y)) {
				return true;
			}
		}
		return CControl.prototype.onMouseDown.call(this, e, x, y);
	};
	CControlContainer.prototype.onMouseMove = function (e, x, y) {
		for (var nChild = this.children.length - 1; nChild >= 0; --nChild) {
			if (this.children[nChild].onMouseMove(e, x, y)) {
				return true;
			}
		}
		return CControl.prototype.onMouseMove.call(this, e, x, y);
	};
	CControlContainer.prototype.onMouseUp = function (e, x, y) {
		for (var nChild = this.children.length - 1; nChild >= 0; --nChild) {
			if (this.children[nChild].onMouseUp(e, x, y)) {
				return true;
			}
		}
		return CControl.prototype.onMouseUp.call(this, e, x, y);
	};
	CControlContainer.prototype.onMouseWheel = function (e, deltaY, X, Y) {
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			if (this.children[nChild].onMouseWheel(e, deltaY, X, Y)) {
				return true;
			}
		}
		return CControl.prototype.onMouseWheel.call(this, e, deltaY, X, Y);
	};
	CControlContainer.prototype.isScrolling = function () {
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			var oChild = this.children[nChild];
			if (oChild.isOnScroll && oChild.isOnScroll()) {
				return true;
			}
		}
		return false;
	};
	CControlContainer.prototype.canHandleEvents = function () {
		return false;
	};
	CControlContainer.prototype.onResize = function () {
		this.handleUpdateExtents();
		this.recalculate();
	};


	function CTopControl(oDrawer) {
		CControlContainer.call(this, null);
		this.drawer = oDrawer;
	}

	InitClass(CTopControl, CControlContainer, CONTROL_TYPE_UNKNOWN);

	CTopControl.prototype.onUpdateRect = function (oBounds) {
		if (this.drawer) {
			this.drawer.OnAnimPaneChanged(oBounds);
		}
	};
	CTopControl.prototype.onUpdate = function () {
		var oBounds = this.getBounds();
		this.onUpdateRect(oBounds);
	};
	CTopControl.prototype.onChildUpdate = function (oBounds) {
		this.onUpdateRect(oBounds);
	};
	CTopControl.prototype.onResize = function () {
		this.setLayout(0, 0, this.drawer.GetWidth(), this.drawer.GetHeight());
		CControlContainer.prototype.onResize.call(this);
		this.onUpdate();
	};


	function CLabel(oParentControl, sString, nFontSize, bBold, nParaAlign) {
		CControl.call(this, oParentControl);
		AscFormat.ExecuteNoHistory(function () {
			this.string = sString;
			this.fontSize = nFontSize;
			this.createTextBody();
			var oTxLstStyle = new AscFormat.TextListStyle();
			oTxLstStyle.levels[0] = new CParaPr();
			oTxLstStyle.levels[0].DefaultRunPr = new AscCommonWord.CTextPr();
			oTxLstStyle.levels[0].DefaultRunPr.FontSize = nFontSize;
			oTxLstStyle.levels[0].DefaultRunPr.Bold = bBold;
			oTxLstStyle.levels[0].DefaultRunPr.Color = new AscCommonWord.CDocumentColor(0x44, 0x44, 0x44, false);
			oTxLstStyle.levels[0].DefaultRunPr.RFonts.SetAll("Arial", -1);
			if (AscFormat.isRealNumber(nParaAlign)) {
				oTxLstStyle.levels[0].Jc = nParaAlign;
			}
			this.txBody.setLstStyle(oTxLstStyle);
			this.bodyPr = new AscFormat.CBodyPr();
			this.bodyPr.setDefault();
			this.bodyPr.anchor = 1;//vertical align ctr
			this.bodyPr.resetInsets();
			this.bodyPr.horzOverflow = AscFormat.nHOTClip;
			this.bodyPr.vertOverflow = AscFormat.nVOTClip;
		}, this, []);
	}

	InitClass(CLabel, CControl, CONTROL_TYPE_LABEL);

	CLabel.prototype.getString = function () {
		return AscCommon.translateManager.getValue(this.string);
	};
	CLabel.prototype.recalculateContent = function () {
		//this.recalculateGeometry();
		this.recalculateTransform();
		//        this.txBody.content.Recalc_AllParagraphs_CompiledPr();
		if (!this.txBody.bFit || !AscFormat.isRealNumber(this.txBody.fitWidth) || this.txBody.fitWidth > this.getWidth()) {
			this.txBody.recalculateOneString(this.getString());
		}
	};
	CLabel.prototype.canHandleEvents = function () {
		return false;
	};
	CLabel.prototype.getFillColor = function () {
		return null;
	};
	CLabel.prototype.getOutlineColor = function () {
		return null;
	};
	CLabel.prototype.recalculateTransformText = function () {
		var Y = this.getHeight() / 2 - this.txBody.content.GetSummaryHeight() / 2;
		if (!this.transformText) {
			this.transformText = new AscCommon.CMatrix();
		}
		this.transformText.tx = this.transform.tx;
		this.transformText.ty = this.transform.ty + Y;

		if (!this.invertTransformText) {
			this.invertTransformText = new AscCommon.CMatrix();
		}
		this.invertTransformText.tx = -this.transformText.tx;
		this.invertTransformText.ty = -this.transformText.ty;
		this.localTransformText = this.transformText;
	};
	CLabel.prototype.recalculateTransformText2 = function () {
		return null;
	};


	function CImageControl(oParentControl) {
		CControl.call(this, oParentControl)
	}

	InitClass(CImageControl, CControl, CONTROL_TYPE_IMAGE);

	CImageControl.prototype.canHandleEvents = function () {
		return false;
	};
	//CImageControl.prototype.draw = function() {
	//};


	function CButton(oParentControl, fOnMouseDown, fOnMouseMove, fOnMouseUp) {
		CControlContainer.call(this, oParentControl);
		this.onMouseDownCallback = fOnMouseDown;
		this.onMouseMoveCallback = fOnMouseMove;
		this.onMouseUpCallback = fOnMouseUp;
	}

	InitClass(CButton, CControlContainer, CONTROL_TYPE_BUTTON);

	CButton.prototype.onMouseDown = function (e, x, y) {
		if (this.onMouseDownCallback && this.onMouseDownCallback.call(this, e, x, y)) {
			return true;
		}
		return CControlContainer.prototype.onMouseDown.call(this, e, x, y);
	};
	CButton.prototype.onMouseMove = function (e, x, y) {
		if (this.onMouseMoveCallback && this.onMouseMoveCallback.call(this, e, x, y)) {
			return true;
		}
		return CControlContainer.prototype.onMouseMove.call(this, e, x, y);
	};
	CButton.prototype.onMouseUp = function (e, x, y) {
		if (this.onMouseUpCallback && this.onMouseUpCallback.call(this, e, x, y)) {
			return true;
		}
		return CControlContainer.prototype.onMouseUp.call(this, e, x, y);
	};
	CButton.prototype.canHandleEvents = function () {
		return true;
	};
	// CButton.prototype.draw = function(graphics) {
	//     if(this.isHidden()){
	//         return false;
	//     }
	//     if(!this.checkUpdateRect(graphics.updatedRect)) {
	//         return false;
	//     }
	//
	//     graphics.SaveGrState();
	//     var oSkin = AscCommon.GlobalSkin;
	//     //ScrollBackgroundColor     : "#EEEEEE",
	//     //ScrollOutlineColor        : "#CBCBCB",
	//     //ScrollOutlineHoverColor   : "#CBCBCB",
	//     //ScrollOutlineActiveColor  : "#ADADAD",
	//     //ScrollerColor             : "#F7F7F7",
	//     //ScrollerHoverColor        : "#C0C0C0",
	//     //ScrollerActiveColor       : "#ADADAD",
	//     //ScrollArrowColor          : "#ADADAD",
	//     //ScrollArrowHoverColor     : "#F7F7F7",
	//     //ScrollArrowActiveColor    : "#F7F7F7",
	//     //ScrollerTargetColor       : "#CFCFCF",
	//     //ScrollerTargetHoverColor  : "#F1F1F1",
	//     //ScrollerTargetActiveColor : "#F1F1F1",
	//     var x = 0;
	//     var y = 0;
	//     var extX = this.getWidth();
	//     var extY = this.getHeight();
	//     graphics.transform3(this.transform);
	//
	//     var sFillColor;
	//     var sOutlineColor;
	//     var oColor;
	//     if(this.isActive()) {
	//         sFillColor = oSkin.ScrollerActiveColor;
	//         sOutlineColor = oSkin.ScrollOutlineActiveColor;
	//     }
	//     else if(this.isHovered()) {
	//         sFillColor = oSkin.ScrollerHoverColor;
	//         sOutlineColor = oSkin.ScrollOutlineHoverColor;
	//     }
	//     else {
	//         sFillColor = oSkin.ScrollerColor;
	//         sOutlineColor = oSkin.ScrollOutlineColor;
	//     }
	//     oColor = AscCommon.RgbaHexToRGBA(sFillColor);
	//     graphics.b_color1(oColor.R, oColor.G, oColor.B, 0xFF);
	//     graphics.rect(x, y, extX, extY);
	//     graphics.df();
	//     oColor = AscCommon.RgbaHexToRGBA(sOutlineColor);
	//
	//     graphics.SetIntegerGrid(true);
	//     graphics.p_width(0);
	//     graphics.p_color(oColor.R, oColor.G, oColor.B, 0xFF);
	//     graphics.drawHorLine(0, y, x, x + extX, 0);
	//     graphics.drawHorLine(0, y + extY, x, x + extX, 0);
	//     graphics.drawVerLine(2, x, y, y + extY, 0);
	//     graphics.drawVerLine(2, x + extX, y, y + extY, 0);
	//     graphics.ds();
	//     graphics.RestoreGrState();
	//     return true;
	// };

	CButton.prototype.getFillColor = function () {
		// if(this.parentControl instanceof CTimelineContainer) {
		//     return null;
		// }

		var oSkin = AscCommon.GlobalSkin;
		if (this.isActive()) {
			return oSkin.ScrollerActiveColor;
		} else if (this.isHovered()) {
			return oSkin.ScrollerHoverColor;
		} else if (this.isDisabled()) {
			return '#123456'
		} else {
			return oSkin.ScrollerColor;
		}
	};
	CButton.prototype.getOutlineColor = function () {
		if (this.parentControl instanceof CTimeline) { return '#000' }

		var oSkin = AscCommon.GlobalSkin;
		if (this.isActive()) {
			return oSkin.ScrollOutlineActiveColor;
		} else if (this.isHovered()) {
			return oSkin.ScrollOutlineHoverColor;
		} else {
			return oSkin.ScrollOutlineColor;
		}
	};
	CButton.prototype.isPressed = function () {
		return this.getStateFlag(STATE_FLAG_PRESSED);
	};
	CButton.prototype.disable = function () {
		return this.setStateFlag(STATE_FLAG_DISABLED, true)
	};
	CButton.prototype.enable = function () {
		return this.setStateFlag(STATE_FLAG_DISABLED, false)
	};
	CButton.prototype.isDisabled = function () {
		return this.getStateFlag(STATE_FLAG_DISABLED);
	};


	function CAnimPaneHeader(oDrawer) {
		CTopControl.call(this, oDrawer);
		this.label = this.addControl(new CLabel(this, "Animation Pane", 10, true));

		this.playButton = this.addControl(new CButton(
			this, null, null, managePreview));
		this.moveUpButton = this.addControl(new CButton(
			this, null, null, moveChosenUp));
		this.moveDownButton = this.addControl(new CButton(
			this, null, null, moveChosenDown));
		this.closeButton = this.addControl(new CButton(
			this, null, null, closePanel));

		// Event handlers for button of CAnimPaneHeader ---

		function managePreview(event, x, y) {
			if (!this.hit(x, y)) { return }
			if (this.isDisabled()) { return }
			Asc.editor.asc_IsStartedAnimationPreview() ?
				Asc.editor.asc_StopAnimationPreview() : Asc.editor.asc_StartAnimationPreview()
		}

		function moveChosenUp(event, x, y) {
			if (!this.hit(x, y)) { return }
			if (this.isDisabled()) { return }
			if (Asc.editor.asc_canMoveAnimationEarlier()) {
				if (Asc.editor.asc_IsStartedAnimationPreview()) {
					Asc.editor.asc_StopAnimationPreview()
				}
				Asc.editor.asc_moveAnimationEarlier()
			}
		}

		function moveChosenDown(event, x, y) {
			if (!this.hit(x, y)) { return }
			if (this.isDisabled()) { return }
			if (Asc.editor.asc_canMoveAnimationLater()) {
				if (Asc.editor.asc_IsStartedAnimationPreview()) {
					Asc.editor.asc_StopAnimationPreview()
				}
				Asc.editor.asc_moveAnimationLater()
			}
		}

		function closePanel(event, x, y) {
			if (!this.hit(x, y)) { return }
			if (this.isDisabled()) { return }
			Asc.editor.asc_ShowAnimPane(false)
		}

		// --- end of event handlers for buttons of CAnimPaneHeader
	}

	InitClass(CAnimPaneHeader, CTopControl, CONTROL_TYPE_HEADER);

	CAnimPaneHeader.prototype.recalculateChildrenLayout = function () {
		this.label.setLayout(
			AscCommon.TIMELINE_LEFT_MARGIN,
			0,
			this.playButton.getLeft(),
			this.getHeight()
		);
		this.playButton.setLayout(
			PLAY_BUTTON_LEFT,
			PLAY_BUTTON_TOP,
			PLAY_BUTTON_WIDTH,
			PLAY_BUTTON_HEIGHT
		);
		this.moveUpButton.setLayout(
			MOVE_UP_BUTTON_LEFT,
			MOVE_UP_BUTTON_TOP,
			MOVE_UP_BUTTON_WIDTH,
			MOVE_UP_BUTTON_HEIGHT
		);
		this.moveDownButton.setLayout(
			MOVE_DOWN_BUTTON_LEFT,
			MOVE_DOWN_BUTTON_TOP,
			MOVE_DOWN_BUTTON_WIDTH,
			MOVE_DOWN_BUTTON_HEIGHT
		);
		this.closeButton.setLayout(
			this.getWidth() - AscCommon.TIMELINE_LIST_RIGHT_MARGIN - BUTTON_SIZE,
			(this.getHeight() - BUTTON_SIZE) / 2,
			BUTTON_SIZE,
			BUTTON_SIZE
		);
	};
	CAnimPaneHeader.prototype.getFillColor = function () {
		return null;
	};
	CAnimPaneHeader.prototype.getOutlineColor = function () {
		return null;
	};


	function CScrollBase(oParentControl, oContainer, oChild) {
		CControlContainer.call(this, oParentControl);

		this.container = oContainer;
		this.scrolledChild = oChild;

		this.startButton = this.addControl(new CButton(this));
		this.endButton = this.addControl(new CButton(this));

		this.timerId = null;
		this.timeoutId = null;

		this.scrollOffset = 0;
		this.tmpScrollOffset = null;

		this.startScrollerPos = null;
		this.startScrollTop = null;
	}

	InitClass(CScrollBase, CControlContainer, CONTROL_TYPE_UNKNOWN);

	CScrollBase.prototype.limitScrollOffset = function (offsetValue /* in millimeters */) {
		return Math.max(0, Math.min(offsetValue, this.getMaxScrollOffset()));
	};
	CScrollBase.prototype.getScrollOffset = function () {
		if (this.tmpScrollOffset !== null) {
			return this.tmpScrollOffset;
		}
		this.scrollOffset = this.limitScrollOffset(this.scrollOffset);
		return this.scrollOffset;
	};
	CScrollBase.prototype.setTmpScroll = function (val) {
		this.tmpScrollOffset = this.limitScrollOffset(val)

		this.parentControl.onScroll();
		this.onUpdate();
	};
	CScrollBase.prototype.clearTmpScroll = function () {
		if (this.tmpScrollOffset === null) { return }

		this.scrollOffset = this.limitScrollOffset(this.tmpScrollOffset);
		this.tmpScrollOffset = null;

		this.parentControl.onScroll();
		this.onUpdate();
	};

	CScrollBase.prototype.startScroll = function (step) {
		this.endScroll();
		var oScroll = this;
		this.tmpScrollOffset = this.getScrollOffset();
		oScroll.addScroll(step);

		this.timeoutId = setTimeout(function () {
			oScroll.timeoutId = null;
			oScroll.timerId = setInterval(function () {
				oScroll.addScroll(step);
			}, SCROLL_TIMER_INTERVAL);
		}, SCROLL_TIMER_DELAY);
	};
	CScrollBase.prototype.addScroll = function (step) {
		this.setTmpScroll(this.tmpScrollOffset + step);
		this.parentControl.onScroll();
	};
	CScrollBase.prototype.endScroll = function () {
		if (this.timerId !== null) {
			clearInterval(this.timerId);
			this.timerId = null;
		}
		if (this.timeoutId !== null) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}

		this.clearTmpScroll();
		this.setStateFlag(STATE_FLAG_SELECTED, false);

		this.startScrollerPos = null;
		this.startScrollTop = null;
	};
	CScrollBase.prototype.isOnScroll = function () {
		return this.timerId !== null || this.timeoutId !== null || this.parentControl.isEventListener(this);
	};

	CScrollBase.prototype.getMaxScrollOffset = function (val) {
		// Method must return the maximum allowed value of "this.scrollOffset" in millimeters
		let errorMessage = 'NOT IMPLEMENTED: getMaxScrollOffset'
		throw new Error(errorMessage)
	};
	CScrollBase.prototype.hitInScroller = function (x, y) {
		if (this.isHidden()) {
			return false;
		}
		var oInv = this.getInvFullTransformMatrix();
		var tx = oInv.TransformPointX(x, y);
		var ty = oInv.TransformPointY(x, y);
		var l = this.getScrollerX();
		var t = this.getScrollerY();
		var r = l + this.getScrollerWidth();
		var b = t + this.getScrollerHeight();
		return tx >= l && tx <= r && ty >= t && ty <= b;
	};
	CScrollBase.prototype.getScrollerX = function (dScrollOffset) {
		return 0;
	};
	CScrollBase.prototype.getScrollerY = function (dScrollOffset) {
		return 0;
	};
	CScrollBase.prototype.getScrollerWidth = function (dScrollOffset) {
		return 0;
	};
	CScrollBase.prototype.getScrollerHeight = function (dScrollOffset) {
		return 0;
	};
	CScrollBase.prototype.getFillColor = function () {
		return null;
	};
	CScrollBase.prototype.getOutlineColor = function () {
		return null;
	};


	function CScrollVert(oParentControl, oContainer, oChild) {
		CScrollBase.call(this, oParentControl, oContainer, oChild);
	}

	InitClass(CScrollVert, CScrollBase, CONTROL_TYPE_SCROLL_VERT);

	CScrollVert.prototype.recalculateChildrenLayout = function () {
		this.startButton.setLayout(0, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
		this.endButton.setLayout(0, this.getHeight() - SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
	};
	CScrollVert.prototype.getRailHeight = function () {
		return this.getHeight() - this.children[0].getHeight() - this.children[1].getHeight();
	};
	CScrollVert.prototype.getRelScrollerPos = function (dScrollOffset) {
		return this.startButton.getBottom() + dScrollOffset * ((this.getRailHeight() - this.getScrollerHeight()) / (this.getMaxScrollOffset()));
	};
	CScrollVert.prototype.getScrollerX = function (dScrollOffset) {
		return 0;
	};
	CScrollVert.prototype.getScrollerY = function () {
		return this.getRelScrollerPos(this.getScrollOffset());
	};
	CScrollVert.prototype.getScrollerWidth = function (dScrollOffset) {
		return this.getWidth();
	};
	CScrollVert.prototype.getScrollerHeight = function () {
		var dRailH = this.getRailHeight();
		var dMinRailH = dRailH / 4;
		return Math.max(dMinRailH, dRailH * (dRailH / this.scrolledChild.getHeight()))
	};
	CScrollVert.prototype.getMaxScrollOffset = function () {
		return Math.max(0, this.scrolledChild.getHeight() - this.container.getHeight());
	};
	CScrollVert.prototype.getMaxRelScrollOffset = function () {
		return Math.max(0, this.getRailHeight() - this.getScrollerHeight());
	};
	CScrollVert.prototype.draw = function (graphics) {
		if (this.isHidden()) {
			return false;
		}
		if (!this.checkUpdateRect(graphics.updatedRect)) {
			return false;
		}
		this.children[0].draw(graphics);
		this.children[1].draw(graphics);


		graphics.SaveGrState();
		var oSkin = AscCommon.GlobalSkin;
		//ScrollBackgroundColor     : "#EEEEEE",
		//ScrollOutlineColor        : "#CBCBCB",
		//ScrollOutlineHoverColor   : "#CBCBCB",
		//ScrollOutlineActiveColor  : "#ADADAD",
		//ScrollerColor             : "#F7F7F7",
		//ScrollerHoverColor        : "#C0C0C0",
		//ScrollerActiveColor       : "#ADADAD",
		//ScrollArrowColor          : "#ADADAD",
		//ScrollArrowHoverColor     : "#F7F7F7",
		//ScrollArrowActiveColor    : "#F7F7F7",
		//ScrollerTargetColor       : "#CFCFCF",
		//ScrollerTargetHoverColor  : "#F1F1F1",
		//ScrollerTargetActiveColor : "#F1F1F1",
		var x = this.getScrollerX();
		var y = this.getRelScrollerPos(this.getScrollOffset());
		var extX = this.getScrollerWidth();
		var extY = this.getScrollerHeight();
		graphics.transform3(this.transform);

		var sFillColor;
		var sOutlineColor;
		var oColor;
		if (this.isActive()) {
			sFillColor = oSkin.ScrollerActiveColor;
			sOutlineColor = oSkin.ScrollOutlineActiveColor;
		} else if (this.isHovered()) {
			sFillColor = oSkin.ScrollerHoverColor;
			sOutlineColor = oSkin.ScrollOutlineHoverColor;
		} else {
			sFillColor = oSkin.ScrollerColor;
			sOutlineColor = oSkin.ScrollOutlineColor;
		}
		oColor = AscCommon.RgbaHexToRGBA(sFillColor);
		graphics.b_color1(oColor.R, oColor.G, oColor.B, 0xFF);
		graphics.rect(x, y, extX, extY);
		graphics.df();
		oColor = AscCommon.RgbaHexToRGBA(sOutlineColor);
		graphics.SetIntegerGrid(true);
		var nPenW = this.getPenWidth(graphics);
		graphics.p_color(oColor.R, oColor.G, oColor.B, 0xFF);
		graphics.drawHorLine(0, y, x, x + extX, nPenW);
		graphics.drawHorLine(0, y + extY, x, x + extX, nPenW);
		graphics.drawVerLine(2, x, y, y + extY, nPenW);
		graphics.drawVerLine(2, x + extX, y, y + extY, nPenW);
		graphics.ds();
		graphics.RestoreGrState();
		return true;
	};
	CScrollVert.prototype.onMouseMove = function (e, x, y) {
		if (this.isHidden()) {
			return false;
		}
		var bRet = false;
		if (this.eventListener) {
			this.eventListener.onMouseMove(e, x, y);
			return true;
		}

		if (this.parentControl.isEventListener(this)) {
			if (this.startScrollerPos === null) {
				this.startScrollerPos = y;
			}
			if (this.startScrollTop === null) {
				this.startScrollTop = this.getScrollOffset();
			}
			var dCoeff = this.getMaxScrollOffset() / this.getMaxRelScrollOffset();
			var dy = dCoeff * (y - this.startScrollerPos);
			this.setTmpScroll(dy + this.startScrollTop);
			return true;
		}
		bRet |= this.children[0].onMouseMove(e, x, y);
		bRet |= this.children[1].onMouseMove(e, x, y);

		var bHit = this.hitInScroller(x, y);
		var nState = this.isHovered();
		if (this.isHovered()) {
			if (!bHit) {
				this.setStateFlag(STATE_FLAG_HOVERED, false);
				bRet = true;
			}
		} else {
			if (bHit) {
				this.setStateFlag(STATE_FLAG_HOVERED, true);
				bRet = true;
			}
		}
		//-----------------------------
		return bRet;
	};
	CScrollVert.prototype.onMouseDown = function (e, x, y) {
		var bRet = false;
		if (this.hit(x, y)) {
			bRet |= this.children[0].onMouseDown(e, x, y);
			bRet |= this.children[1].onMouseDown(e, x, y);
			if (!bRet) {
				if (this.hitInScroller(x, y)) {
					this.startScrollerPos = y;
					this.startScrollTop = this.getScrollOffset();
					this.setStateFlag(STATE_FLAG_SELECTED, true);
					this.parentControl.setEventListener(this);
					this.parentControl.onScroll();
					//-----------------------------
				} else {
					this.parentControl.setEventListener(this);
					var oInv = this.getInvFullTransformMatrix();
					var ty = oInv.TransformPointY(x, y);
					if (ty < this.getScrollerY()) {
						this.startScroll(-ANIM_ITEM_HEIGHT);
					} else {
						this.startScroll(ANIM_ITEM_HEIGHT);
					}
				}
				return true;
			}
		}
		return bRet;
	};
	CScrollVert.prototype.onMouseUp = function (e, x, y) {
		this.endScroll();
		var bRet = false;
		if (this.eventListener) {
			bRet = this.eventListener.onMouseUp(e, x, y);
			this.eventListener = null;
			return bRet;
		}
		bRet |= this.children[0].onMouseUp(e, x, y);
		bRet |= this.children[1].onMouseUp(e, x, y);
		this.setEventListener(null);
		return bRet;
	};


	function CScrollHor(oParentControl, oContainer, oChild) {
		CScrollBase.call(this, oParentControl, oContainer, oChild);

		this.startButton.onMouseDownCallback = onFirstBtnMouseDown
		this.endButton.onMouseDownCallback = onSecondBtnMouseDown
		this.startButton.onMouseUpCallback = this.endButton.onMouseUpCallback = onMouseUp

		// List of buttons handlers---

		function onFirstBtnMouseDown(e, x, y) {
			if (!this.hit(x, y)) { return }
			this.parentControl.setEventListener(this);
			let step = (this.parentControl.getWidth() - 2 * SCROLL_BUTTON_SIZE) * SCROLL_STEP
			this.parentControl.startScroll(-step);
			return true;
		}

		function onSecondBtnMouseDown(e, x, y) {
			if (!this.hit(x, y)) { return }
			this.parentControl.setEventListener(this);
			let step = (this.parentControl.getWidth() - 2 * SCROLL_BUTTON_SIZE) * SCROLL_STEP
			this.parentControl.startScroll(step);
			return true;
		}

		function onMouseUp(e, x, y) {
			if (this.parentControl.isEventListener(this)) {
				this.parentControl.setEventListener(null);
				this.parentControl.endScroll();
				return true;
			}
			return false;
		}

		// --- end of list of button handlers
	}

	InitClass(CScrollHor, CScrollBase, CONTROL_TYPE_SCROLL_HOR);

	CScrollHor.prototype.recalculateChildrenLayout = function () {
		this.startButton.setLayout(0, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
		this.endButton.setLayout(this.getWidth() - SCROLL_BUTTON_SIZE, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
		// this.scroller.setLayout(this.timeToPos(this.curTimePos) - SCROLL_BUTTON_SIZE / 2, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
	};
	CScrollHor.prototype.getMaxScrollOffset = function () {
		return this.getWidth() - SCROLL_BUTTON_SIZE - this.scroller.getWidth();
	};
	CScrollHor.prototype.getScrollPointerPosition = function () {
		return this.getScrollOffset() + this.scroller.getWidth() / 2;
	};


	function CTimelineContainer(oDrawer) {
		CTopControl.call(this, oDrawer);
		this.drawer = oDrawer;

		this.secondsButton = this.addControl(new CButton(
			this, null, null, manageTimelineScale));
		this.timeline = this.addControl(new CTimeline(this));

		function manageTimelineScale(event, x, y) {
			if (!this.hit(x, y)) { return }
			this.next.tmScaleIdx = (this.next.tmScaleIdx + 1) % 11
			this.next.onUpdate()
		}
	}

	InitClass(CTimelineContainer, CTopControl, CONTROL_TYPE_TIMELINE_CONTAINER);

	CTimelineContainer.prototype.recalculateChildrenLayout = function () {
		var dPosY = (this.getHeight() - SECONDS_BUTTON_HEIGHT) / 2;
		this.secondsButton.setLayout(SECONDS_BUTTON_LEFT, dPosY, SECONDS_BUTTON_WIDTH, SECONDS_BUTTON_HEIGHT);
		var dLeft = LABEL_TIMELINE_WIDTH + AscCommon.TIMELINE_LEFT_MARGIN - 1.5 * SCROLL_THICKNESS;
		var dWidth = this.getWidth() - AscCommon.TIMELINE_LIST_RIGHT_MARGIN - dLeft;
		dPosY = (this.getHeight() - SCROLL_THICKNESS) / 2;
		this.timeline.setLayout(dLeft, dPosY, dWidth, SCROLL_THICKNESS);
	};
	CTimelineContainer.prototype.getFillColor = function () {
		return null;
	};
	CTimelineContainer.prototype.getOutlineColor = function () {
		return null;
	};


	function CTimeline(oParentControl) {
		CScrollHor.call(this, oParentControl);

		this.scroller = this.addControl(new CButton(this, stickToPointer, handlePointerMovement, unstickFromPointer));
		this.scroller.onMouseDownCallback = stickToPointer
		this.scroller.onMouseMoveCallback = handlePointerMovement
		this.scroller.onMouseUpCallback = unstickFromPointer

		this.startTimePos = 0;
		this.curTimePos = 5;
		this.tmScaleIdx = 2;

		//labels cache
		this.labels = {};
		this.usedLabels = {};
		this.cachedParaPr = null

		// Handlers for scroller button ---

		function stickToPointer(event, x, y) {
			if (!this.hit(x, y)) { return }
			this.isStickedToPointer = true
		}

		function unstickFromPointer(event, x, y) {
			this.isStickedToPointer = false
			this.parentControl.endScroll()
		}

		function handlePointerMovement(event, x, y) {
			if (!this.isStickedToPointer) { return }

			// Calculating new position of the scroller
			let rightBorder = this.parentControl.getMaxScrollOffset()
			let leftBorder = SCROLL_BUTTON_SIZE
			let newLeft = x - SCROLL_BUTTON_SIZE / 2 - this.parentControl.getLeft()
			newLeft = Math.min(rightBorder, Math.max(leftBorder, newLeft))

			// Check if the boundaried are reached and start scrolling if so
			if (newLeft == leftBorder || newLeft == rightBorder) {
				if (!this.hit(x, y)) { return }
				let scrollStep = (this.parentControl.getWidth() - 2 * SCROLL_BUTTON_SIZE) * SCROLL_STEP
				scrollStep = newLeft == leftBorder ? -scrollStep : scrollStep;
				this.parentControl.startScroll(scrollStep);
			}
			else this.parentControl.endScroll()

			// Updating curTimePos
			this.parentControl.setCurTimePos(this.parentControl.posToTime(newLeft + SCROLL_BUTTON_SIZE / 2))

			// Если оставить "newLeft, t, w, h", то t почему-то перезаписывается постоянно
			// let { l, t, w, h } = this.bounds
			// this.setLayout(newLeft, t, w, h)

			this.setLayout(newLeft, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE)
			this.onUpdate()
		}

		// --- end of handlers for scroller button
	}

	InitClass(CTimeline, CScrollHor, CONTROL_TYPE_TIMELINE);

	
	CTimeline.prototype.setCurTimePos = function (tValue) {
		this.curTimePos = Math.max(0, tValue)
	}
	CTimeline.prototype.addScroll = function (step) {
		let diff = this.posToTime(step) - this.startTimePos
		this.startTimePos = Math.max(0, this.startTimePos + diff)
		this.setCurTimePos(this.curTimePos + diff)
		this.onUpdate()
	};
	CTimeline.prototype.startDrawLabels = function () {
		this.usedLabels = {};
	};
	CTimeline.prototype.endDrawLabels = function () {
		for (var nTime in this.labels) {
			if (!this.usedLabels[nTime]) {
				var oLabel = this.labels[nTime];
				oLabel.parentControl = null;
				oLabel.bDeleted = true;
				delete this.labels[nTime];
			}
		}
	};
	CTimeline.prototype.getLabel = function (nTime, scale) {
		this.usedLabels[nTime] = true;
		if (this.labels[nTime] && AscFormat.fApproxEqual(this.labels[nTime].scale, scale, 0.01)) {
			return this.labels[nTime];
		}
		return this.cacheLabel(nTime, scale);
	};
	CTimeline.prototype.cacheLabel = function (nTime, scale) {
		var oLabel = new CLabel(this, this.getTimeString(nTime), 7.5);
		var oContent = oLabel.txBody.content;
		oLabel.setLayout(0, 0, LABEL_WIDTH, this.getHeight());
		if (this.cachedParaPr) {
			oContent.Content[0].CompiledPr = this.cachedParaPr;
		} else {
			oContent.SetApplyToAll(true);
			oContent.SetParagraphAlign(AscCommon.align_Center);
			oContent.SetApplyToAll(false);
		}
		oLabel.recalculate();
		if (!this.cachedParaPr) {
			this.cachedParaPr = oContent.Content[0].CompiledPr;
		}
		var oBaseTexture = oLabel.getAnimTexture(scale);
		if (oBaseTexture) {
			this.labels[nTime] = new CAnimTexture(this, oBaseTexture.canvas, oBaseTexture.scale, oBaseTexture.x, oBaseTexture.y);
		}
		return this.labels[nTime];
	};
	CTimeline.prototype.getTimeString = function (nTime) {
		if (nTime < 60) {
			return "" + nTime;
		}
		var nMin, nSec;
		var sMin, sSec;
		nSec = (nTime % 60);
		if (nSec === 0) {
			sSec = "00";
		} else {
			sSec = "" + nSec;
		}
		if (nTime < 3600) {
			return (((nTime / 60) >> 0) + ":") + sSec;
		}

		nMin = ((nTime / 60) >> 0);
		if (nMin === 0) {
			sMin = "00";
		} else {
			sMin = "" + nMin;
		}
		return (((nTime / 3600) >> 0) + ":") + (sMin + ":") + sSec;
	};
	CTimeline.prototype.drawLabel = function (graphics, dPos, nTime) {
		var oLabelTexture = this.getLabel(nTime, graphics.m_oCoordTransform.sx);
		var oMatrix = new AscCommon.CMatrix();
		var dWidth = oLabelTexture.canvas.width / oLabelTexture.scale;
		var dHeight = oLabelTexture.canvas.height / oLabelTexture.scale;
		graphics.drawImage2(oLabelTexture.canvas,
			dPos - dWidth / 2, this.getHeight() / 2 - dHeight / 2,
			dWidth,
			dHeight);
		// var oContent = oLabel.txBody.content;
		// oContent.ShiftView(dPos - LABEL_WIDTH / 2, this.getHeight() / 2 - oContent.GetSummaryHeight() / 2);
		// oContent.Draw(0, graphics);
		// oContent.ResetShiftView();
	};
	CTimeline.prototype.getPaneLeft = function () {
		return SCROLL_BUTTON_SIZE;
	};
	CTimeline.prototype.getFillColor = function () {
		return null;
	};
	CTimeline.prototype.getOutlineColor = function () {
		return null;
	};
	CTimeline.prototype.canHandleEvents = function () {
		return true;
	};
	// CTimeline.prototype.recalculateChildrenLayout = function () {
	// 	this.scroller.setLayout(this.timeToPos(this.curTimePos) - SCROLL_BUTTON_SIZE / 2, 0, SCROLL_BUTTON_SIZE, SCROLL_BUTTON_SIZE);
	// 	this.scroller.getOutlineColor = function () { return '#000' }
	// };
	CTimeline.prototype.drawMark = function (graphics, dPos) {
		var dHeight = this.getHeight() / 3;
		var nPenW = this.getPenWidth(graphics);
		graphics.drawVerLine(1, dPos, dHeight, dHeight + dHeight, nPenW);
	};
	CTimeline.prototype.start = function (graphics, dPos) {
		var dHeight = this.getHeight() / 3;
		var nPenW = this.getPenWidth(graphics);
		graphics.drawVerLine(1, dPos, dHeight, dHeight + dHeight, nPenW);
	};
	CTimeline.prototype.draw = function (graphics) {
		if (this.isHidden()) { return false }
		if (!this.checkUpdateRect(graphics.updatedRect)) { return false }

		graphics.SaveGrState();
		// var dPenW = this.getPenWidth(graphics);
		// graphics.SetIntegerGrid(true);
		// graphics.p_width(dPenW);
		// var sColor = this.children[0].getOutlineColor();
		// var oColor = AscCommon.RgbaHexToRGBA(sColor);
		// graphics.p_color(oColor.R, oColor.G, oColor.B, 255);
		// var dPaneLeft = this.children[0].getRight();
		// var dPaneWidth = this.getWidth() - (this.children[0].getWidth() + this.children[1].getWidth());
		// graphics.rect(dPaneLeft, 0, dPaneWidth, this.getHeight());
		// graphics.ds();
		// graphics.RestoreGrState();
		var oSkin = AscCommon.GlobalSkin;
		var sColor = oSkin.ScrollOutlineColor;
		var oColor = AscCommon.RgbaHexToRGBA(sColor);
		var dPaneLeft = this.getRulerStart();
		var dPaneWidth = this.getRulerEnd() - dPaneLeft;
		var x = dPaneLeft;
		var y = 0;
		var extX = dPaneWidth;
		var extY = this.getHeight();
		graphics.transform3(this.transform);
		graphics.SetIntegerGrid(true);
		var nPenW = this.getPenWidth(graphics);
		graphics.p_color(oColor.R, oColor.G, oColor.B, 0xFF);
		graphics.drawHorLine(0, y, x, x + extX, nPenW);
		graphics.drawHorLine(0, y + extY, x, x + extX, nPenW);
		graphics.drawVerLine(2, x, y, y + extY, nPenW);
		graphics.drawVerLine(2, x + extX, y, y + extY, nPenW);
		graphics.ds();

		//draw marks
		//find first visible
		var fStartTime = this.posToTime(this.getRulerStart());
		var fTimeInterval = TIME_SCALES[this.tmScaleIdx];
		var nMarksCount = TIME_INTERVALS[this.tmScaleIdx] === LONG_TIME_INTERVAL ? 10 : 2;

		var dTimeOfSmallInterval = fTimeInterval / nMarksCount;
		var nStartIntervalIdx = this.startTimePos / dTimeOfSmallInterval >> 0;
		var nEndIntervalIdx = this.posToTime(this.getRulerEnd()) / dTimeOfSmallInterval + 0.5 >> 0;
		this.startDrawLabels();
		var nInterval;
		graphics.AddClipRect(x, y, extX, extY);
		for (nInterval = nStartIntervalIdx; nInterval <= nEndIntervalIdx; ++nInterval) {
			var dTime = nInterval * dTimeOfSmallInterval;
			var dPos = this.timeToPos(dTime);
			if (nInterval % nMarksCount !== 0) {
				this.drawMark(graphics, dPos);
			} else {
				this.drawLabel(graphics, dPos, dTime);
			}
		}
		graphics.ds();
		// for(nInterval = nFirstInterval; nInterval <= nLastInterval; ++nInterval) {
		//     var dTime = nInterval*dSmallInterval;
		//     var dPos = this.timeToPos(dTime);
		//     if(nInterval % nMarksCount === 0) {
		//         this.drawLabel(graphics, dPos, dTime);
		//     }
		// }
		this.endDrawLabels();
		//

		graphics.RestoreGrState();

		if (!CScrollHor.prototype.draw.call(this, graphics)) {
			return false;
		}
	};

	CTimeline.prototype.getRulerStart = function () {
		return this.children[0].getRight();
	};
	CTimeline.prototype.getRulerEnd = function () {
		return this.getWidth() - this.children[1].getWidth();
	};
	CTimeline.prototype.getCursorSize = function () {
		return BUTTON_SIZE;
	};

	/**
	 * Returns the value (in millimeters) of the left margin
	 * for the start of the timeline
	 */
	CTimeline.prototype.getZeroShift = function () {
		return this.getRulerStart() + this.getCursorSize() / 2;
	};

	/*
	 * Functions to convert time to pos and vice versa
	 */
	CTimeline.prototype.getLinearCoeffs = function () {
		//linear relationship x = a*t + b
		var a = TIME_INTERVALS[this.tmScaleIdx] / TIME_SCALES[this.tmScaleIdx];
		var b = this.getZeroShift() - a * this.startTimePos;
		return { a: a, b: b };
	};
	CTimeline.prototype.timeToPos = function (fTime) {
		//linear relationship x = a*t + b
		var oCoefs = this.getLinearCoeffs();
		return oCoefs.a * fTime + oCoefs.b;
	};
	CTimeline.prototype.posToTime = function (fPos) {
		//linear relationship x = a*t + b 
		var oCoefs = this.getLinearCoeffs();
		return (fPos - oCoefs.b) / oCoefs.a;
	};


	function CSeqListContainer(oDrawer) {
		CTopControl.call(this, oDrawer);
		this.seqList = this.addControl(new CSeqList(this));
	}

	InitClass(CSeqListContainer, CTopControl, CONTROL_TYPE_SEQ_LIST_CONTAINER);

	CSeqListContainer.prototype.getScrollOffsetY = function (oChild) {
		return 0;
	};
	CSeqListContainer.prototype.recalculateChildrenLayout = function () {
		this.seqList.setLayout(0, 0, this.getWidth(), this.seqList.getHeight());
		this.seqList.recalculate();
		this.setLayout(0, 0, this.seqList.getWidth(), this.seqList.getHeight());
	};
	CSeqListContainer.prototype.clipStart = function (graphics) {

	};
	CSeqListContainer.prototype.clipEnd = function (graphics) {
	};
	CSeqListContainer.prototype.onScroll = function () {
		this.onUpdate();
	};
	CSeqListContainer.prototype.getFillColor = function () {
		return null;
	};
	CSeqListContainer.prototype.getOutlineColor = function () {
		return null;
	};
	CSeqListContainer.prototype.onMouseWheel = function (e, deltaY, X, Y) {
		return false;
	};


	function CSeqList(oParentControl) {
		CControlContainer.call(this, oParentControl);
		this.sequences = this.children;
	}

	InitClass(CSeqList, CControlContainer, CONTROL_TYPE_SEQ_LIST);

	CSeqList.prototype.getIndexLabelRight = function () {
		return 10;//TODO
	};
	CSeqList.prototype.recalculateChildren = function () {
		this.clear();

		var oTiming = this.getTiming();
		if (!oTiming) { return }

		var aAllSeqs = oTiming.getRootSequences();
		var oLastSeqView = null;
		for (var nSeq = 0; nSeq < aAllSeqs.length; ++nSeq) {
			var oSeqView = new CAnimSequence(this, aAllSeqs[nSeq]);
			this.addControl(oSeqView);
			oLastSeqView = oSeqView;
		}
	};
	CSeqList.prototype.recalculateChildrenLayout = function () {
		var dLastBottom = 0;
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			var oSeq = this.children[nChild];
			oSeq.setLayout(0, dLastBottom, this.getWidth(), 0);
			oSeq.recalculate();
			dLastBottom = oSeq.getBottom();
		}
		this.setLayout(this.getLeft(), this.getTop(), this.getWidth(), dLastBottom);
	};
	CSeqList.prototype.getFillColor = function () {
		return null;
	};
	CSeqList.prototype.getOutlineColor = function () {
		return null;
	};
	// CSeqList.prototype.draw = function(graphics) {
	//     if(!this.checkUpdateRect(graphics.updateRect)) {
	//         return false;
	//     }
	//     if(this.parentControl.isScrolling() && !this.bDrawTexture) {
	//         this.recalculateTransform();
	//         this.checkCachedTexture(graphics).draw(graphics, new AscCommon.CMatrix());
	//         return;
	//     }
	//     this.clearCachedTexture();
	//     return CControlContainer.prototype.draw.call(this, graphics);
	// };


	CSeqList.prototype.checkCachedTexture = function (graphics) {
		var dGraphicsScale = graphics.m_oCoordTransform.sx;
		if (this.cachedCanvas) {
			var dScale = this.cachedCanvas.scale;
			if (AscFormat.fApproxEqual(dScale, dGraphicsScale)) {
				return this.cachedCanvas;
			}
		}
		this.bDrawTexture = true;
		var oBaseTexture = this.getAnimTexture(dGraphicsScale);
		if (oBaseTexture) {
			this.cachedCanvas = new CAnimTexture(this, oBaseTexture.canvas, oBaseTexture.scale, oBaseTexture.x, oBaseTexture.y);
		}
		else {
			this.cachedCanvas = null;
		}
		this.bDrawTexture = false;
		return this.cachedCanvas;
	};
	CSeqList.prototype.clearCachedTexture = function () {
		if (this.cachedCanvas) {
			this.cachedCanvas = null;
		}
	};


	function CAnimSequence(oParentControl, oSeq) {//main seq, interactive seq
		CControlContainer.call(this, oParentControl);
		this.seq = oSeq;
		this.label = null; //this.addControl(new CLabel(this, "seq"));
		this.groupList = null;//this.addControl(new CAnimGroupList(this));
	}

	InitClass(CAnimSequence, CControlContainer, CONTROL_TYPE_ANIM_SEQ);

	CAnimSequence.prototype.getIndexLabelRight = function () {
		return this.parentControl.getIndexLabelRight() - this.getLeft();
	};
	CAnimSequence.prototype.recalculateChildren = function () {
		this.clear();
		var sLabel = this.seq.getLabel();
		if (typeof sLabel === "string" && sLabel.length > 0) {
			this.label = this.addControl(new CLabel(this, sLabel, 9, true));
		} else {
			this.label = null;
		}
		this.groupList = this.addControl(new CAnimGroupList(this));
	};
	CAnimSequence.prototype.getSeq = function () {
		return this.seq;
	};
	CAnimSequence.prototype.recalculateChildrenLayout = function () {
		var dCurY = 0;
		if (this.label) {
			this.label.setLayout(0, dCurY, this.getWidth(), SEQ_LABEL_HEIGHT);
			this.label.recalculate();
			dCurY += this.label.getHeight();
		}
		if (this.groupList) {
			this.groupList.setLayout(0, dCurY, this.getWidth(), 0);
			this.groupList.recalculate();
			dCurY += this.groupList.getHeight();
		}
		this.setLayout(this.getLeft(), this.getTop(), this.getWidth(), dCurY);
	};
	CAnimSequence.prototype.getFillColor = function () {
		return null;
	};
	CAnimSequence.prototype.getOutlineColor = function () {
		return null;
	};


	function CAnimGroupList(oParentControl) {//main seq, interactive seq
		CControlContainer.call(this, oParentControl);
	}

	InitClass(CAnimGroupList, CControlContainer, CONTROL_TYPE_ANIM_GROUP_LIST);

	CAnimGroupList.prototype.getIndexLabelRight = function () {
		return this.parentControl.getIndexLabelRight() - this.getLeft();
	};
	CAnimGroupList.prototype.getSeq = function () {
		return this.parentControl.getSeq();
	};
	CAnimGroupList.prototype.recalculateChildren = function () {
		this.clear();
		var oSeq = this.getSeq();
		var aAllEffects = oSeq.getAllEffects();

		for (var nCurEffect = 0; nCurEffect < aAllEffects.length; ++nCurEffect) {
			var oItem = new CAnimItem(this, aAllEffects[nCurEffect]);
			this.addControl(oItem);
		}
	};
	CAnimGroupList.prototype.getFillColor = function () {
		return null;
	};
	CAnimGroupList.prototype.getOutlineColor = function () {
		return null;
	};

	//CAnimGroupList.prototype.draw = function() {
	//};
	CAnimGroupList.prototype.recalculateChildrenLayout = function () {
		var dLastBottom = 0;
		for (var nChild = 0; nChild < this.children.length; ++nChild) {
			var oChild = this.children[nChild];
			oChild.setLayout(0, dLastBottom, this.getWidth(), ANIM_ITEM_HEIGHT);
			oChild.recalculate();
			dLastBottom = oChild.getBottom();
		}
		this.setLayout(this.getLeft(), this.getTop(), this.getWidth(), dLastBottom);
	};


	function CAnimGroup(oParentControl, aEffects) {
		CControlContainer.call(this, oParentControl);
	}

	InitClass(CAnimGroup, CControlContainer, CONTROL_TYPE_ANIM_GROUP);

	CAnimGroup.prototype.getIndexLabelRight = function () {
		return this.parentControl.getIndexLabelRight() - this.getLeft();
	};


	function CAnimItem(oParentControl, oEffect) {
		CControlContainer.call(this, oParentControl);
		this.indexLabel = this.addControl(new CLabel(this, oEffect.getIndexInSequence() + "", 7.5));
		this.eventTypeImage = this.addControl(new CImageControl(this));
		this.effectTypeImage = this.addControl(new CImageControl(this));
		this.effectLabel = this.addControl(new CLabel(this, oEffect.getObjectName(), 7.5));
		this.effectBar = this.addControl(new CEffectBar(this));
		this.contextMenuButton = this.addControl(new CButton(this));

		this.effect = oEffect;
	}

	InitClass(CAnimItem, CControlContainer, CONTROL_TYPE_ANIM_ITEM);

	CAnimItem.prototype.getIndexLabelRight = function () {
		return this.parentControl.getIndexLabelRight() - this.getLeft();
	};
	CAnimItem.prototype.getEffectLabelRight = function () {
		return LABEL_TIMELINE_WIDTH;
	};
	CAnimItem.prototype.recalculateChildrenLayout = function () {
		var dIndexLabelRight = this.getIndexLabelRight();
		var dYInside = (this.getHeight() - EFFECT_BAR_HEIGHT) / 2;
		this.indexLabel.setLayout(0, dYInside, dIndexLabelRight, EFFECT_BAR_HEIGHT);
		this.eventTypeImage.setLayout(this.indexLabel.getRight(), dYInside, EFFECT_BAR_HEIGHT, EFFECT_BAR_HEIGHT);
		this.effectTypeImage.setLayout(this.eventTypeImage.getRight(), dYInside, EFFECT_BAR_HEIGHT, EFFECT_BAR_HEIGHT);
		var dLabelRight = this.getEffectLabelRight();
		var dEffectLabelLeft = this.effectTypeImage.getRight();
		this.effectLabel.setLayout(dEffectLabelLeft, dYInside, dLabelRight - dEffectLabelLeft, EFFECT_BAR_HEIGHT);
		this.effectBar.setLayout(0, 0, 0, 0);//todo
		var dRightSpace = dYInside;
		this.contextMenuButton.setLayout(this.getRight() - dRightSpace - EFFECT_BAR_HEIGHT, dYInside, EFFECT_BAR_HEIGHT, EFFECT_BAR_HEIGHT);
	};
	CAnimItem.prototype.canHandleEvents = function () {
		return true;
	};
	// CAnimItem.prototype.getFillColor = function() {
	//     return null;
	// };
	CAnimItem.prototype.getOutlineColor = function () {
		return null;
	};

	//CAnimItem.prototype.draw = function() {
	//};


	function CEffectBar(oParentControl) {
		CControl.call(this, oParentControl)
	}

	InitClass(CEffectBar, CControl, CONTROL_TYPE_EFFECT_BAR);


	// Header
	const PLAY_BUTTON_WIDTH = 82 * AscCommon.g_dKoef_pix_to_mm;
	const PLAY_BUTTON_HEIGHT = 24 * AscCommon.g_dKoef_pix_to_mm;
	const PLAY_BUTTON_LEFT = 145 * AscCommon.g_dKoef_pix_to_mm;
	const PLAY_BUTTON_TOP = 12 * AscCommon.g_dKoef_pix_to_mm;

	const MOVE_UP_BUTTON_WIDTH = 24 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_UP_BUTTON_HEIGHT = 24 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_UP_BUTTON_LEFT = 241 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_UP_BUTTON_TOP = 12 * AscCommon.g_dKoef_pix_to_mm;

	const MOVE_DOWN_BUTTON_WIDTH = 24 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_DOWN_BUTTON_HEIGHT = 24 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_DOWN_BUTTON_LEFT = MOVE_UP_BUTTON_WIDTH + 241 * AscCommon.g_dKoef_pix_to_mm;
	const MOVE_DOWN_BUTTON_TOP = 12 * AscCommon.g_dKoef_pix_to_mm;

	// Timeline
	const SECONDS_BUTTON_WIDTH = 76 * AscCommon.g_dKoef_pix_to_mm;
	const SECONDS_BUTTON_HEIGHT = 24 * AscCommon.g_dKoef_pix_to_mm;
	const SECONDS_BUTTON_LEFT = 57 * AscCommon.g_dKoef_pix_to_mm;

	const LEFT_TIMELINE_INDENT = 14 * AscCommon.g_dKoef_pix_to_mm;
	const LABEL_TIMELINE_WIDTH = 155 * AscCommon.g_dKoef_pix_to_mm;

	const SCROLL_TIMER_INTERVAL = 150;
	const SCROLL_TIMER_DELAY = 600;
	const SCROLL_STEP = 0.26

	//Time scales in seconds
	const TIME_SCALES = [1, 1, 2, 5, 10, 20, 60, 120, 300, 600, 600];

	//lengths
	const SMALL_TIME_INTERVAL = 15;
	const MIDDLE_1_TIME_INTERVAL = 20;
	const MIDDLE_2_TIME_INTERVAL = 25;
	const LONG_TIME_INTERVAL = 30;

	const TIME_INTERVALS = [
		LONG_TIME_INTERVAL, //1
		SMALL_TIME_INTERVAL, //1
		SMALL_TIME_INTERVAL, //2
		MIDDLE_1_TIME_INTERVAL, //5
		MIDDLE_1_TIME_INTERVAL,//10
		MIDDLE_1_TIME_INTERVAL,//20
		MIDDLE_2_TIME_INTERVAL,//60
		MIDDLE_2_TIME_INTERVAL,//120
		MIDDLE_2_TIME_INTERVAL,//300
		MIDDLE_2_TIME_INTERVAL,//600
		SMALL_TIME_INTERVAL//600
	];

	const LABEL_WIDTH = 100;

	const HEADER_HEIGHT = 7.5;
	const BUTTON_SIZE = HEADER_HEIGHT;
	const TOOLBAR_HEIGHT = HEADER_HEIGHT;
	const PADDING_LEFT = 3;
	const PADDING_TOP = PADDING_LEFT;
	const PADDING_RIGHT = PADDING_LEFT;
	const PADDING_BOTTOM = PADDING_LEFT;
	const VERTICAL_SPACE = PADDING_LEFT;
	const HORIZONTAL_SPACE = PADDING_LEFT;
	const SCROLL_THICKNESS = 15 * AscCommon.g_dKoef_pix_to_mm;
	const SCROLL_BUTTON_SIZE = SCROLL_THICKNESS;
	const TIMELINE_HEIGHT = SCROLL_THICKNESS + 1;
	const BUTTON_SPACE = HORIZONTAL_SPACE / 2;
	const TOOLBAR_WIDTH = 25;
	const ANIM_LABEL_WIDTH = 40;
	const ANIM_ITEM_HEIGHT = TIMELINE_HEIGHT;
	const EFFECT_BAR_HEIGHT = 2 * ANIM_ITEM_HEIGHT / 3;
	const SEQ_LABEL_HEIGHT = EFFECT_BAR_HEIGHT;


	window['AscCommon'] = window['AscCommon'] || {};
	window['AscCommon'].CAnimPaneHeader = CAnimPaneHeader;
	window['AscCommon'].CSeqListContainer = CSeqListContainer;
	window['AscCommon'].CTimelineContainer = CTimelineContainer;

})(window);

