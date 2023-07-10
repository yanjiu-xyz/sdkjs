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

// Import
var global_MatrixTransformer = AscCommon.global_MatrixTransformer;
var g_dKoef_mm_to_pix = AscCommon.g_dKoef_mm_to_pix;

function CCacheSlideImage()
{
    this.Image = null;
    this.Color = { r: 0, g: 0, b: 0};
}

var __nextFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { return setTimeout(callback, 25); };
})();

var __cancelFrame = (function () {
        return window.cancelAnimationFrame ||
            window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
})();

function CTransitionAnimation(htmlpage)
{
    this.HtmlPage = htmlpage;

    this.Type       = 0;
    this.Param      = 0;
    this.Duration   = 0;

    this.StartTime  = 0;
    this.EndTime    = 0;
    this.CurrentTime = 0;

    this.CacheImage1 = new CCacheSlideImage();
    this.CacheImage2 = new CCacheSlideImage();

    this.Rect = new AscCommon._rect();
    this.Params = null;
	this.Morph = null;

    this.IsBackward = false;
    this.DemonstrationObject = null;

    this.TimerId = null;
    var oThis = this;

    this.CalculateRect = function()
    {
        // эта функция определяет, где находится рект для перехода


        var _rect   = editor.WordControl.m_oDrawingDocument.SlideCurrectRect;

        this.Rect.x = AscCommon.AscBrowser.convertToRetinaValue(_rect.left, true);
        this.Rect.y = AscCommon.AscBrowser.convertToRetinaValue(_rect.top, true);
        this.Rect.w = AscCommon.AscBrowser.convertToRetinaValue(_rect.right - _rect.left, true);
        this.Rect.h = AscCommon.AscBrowser.convertToRetinaValue(_rect.bottom - _rect.top, true);
    };

    this.CalculateRectDemonstration = function()
    {
        var _width = this.HtmlPage.DemonstrationManager.Canvas.width;
        var _height = this.HtmlPage.DemonstrationManager.Canvas.height;

        var _w_mm = this.HtmlPage.m_oLogicDocument.GetWidthMM();
        var _h_mm = this.HtmlPage.m_oLogicDocument.GetHeightMM();

        // проверим аспект
        var aspectDisplay = _width / _height;
        var aspectPres = _w_mm / _h_mm;

        var _l = 0;
        var _t = 0;
        var _w = 0;
        var _h = 0;

        if (aspectPres > aspectDisplay)
        {
            _w = _width;
            _h = _w / aspectPres;
            _l = 0;
            _t = (_height - _h) >> 1;
        }
        else
        {
            _h = _height;
            _w = _h * aspectPres;
            _t = 0;
            _l = (_width - _w) >> 1;
        }

        this.Rect.x = _l >> 0;
        this.Rect.y = _t >> 0;
        this.Rect.w = _w >> 0;
        this.Rect.h = _h >> 0;
    };

    this.SetBaseTransform = function()
    {
        if (this.DemonstrationObject == null)
        {
            var ctx1 = this.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
            ctx1.setTransform(1, 0, 0, 1, 0, 0);
            this.HtmlPage.m_oOverlayApi.SetBaseTransform();
        }
        else
        {
            var _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
            _ctx1.setTransform(1, 0, 0, 1, 0, 0);

            var _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.setTransform(1, 0, 0, 1, 0, 0);
        }
    };

    this.DrawImage = function(CacheImage, slide_num)
    {
        var _w = this.Rect.w;
        var _h = this.Rect.h;
        CacheImage.Image = this.CreateImage(_w, _h);
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(slide_num);
        var oPlayer = oSlide.getAnimationPlayer();
        oPlayer.drawFrame(CacheImage.Image, {x: 0, y: 0, w: _w, h: _h});
    };

    this.DrawImage1 = function(slide_num, _not_use_prev)
    {
        if (undefined === slide_num)
        {
            if (null == this.DemonstrationObject)
            {
                slide_num = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
            else
            {
                slide_num = this.DemonstrationObject.SlideNum;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
        }

        if (slide_num > 0 && (_not_use_prev !== true))
        {
            this.DrawImage(this.CacheImage1, slide_num - 1);
        }
    };

    this.DrawImage2 = function(slide_num)
    {
        if (undefined === slide_num)
        {
            if (null == this.DemonstrationObject)
            {
                slide_num = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
            else
            {
                slide_num = this.DemonstrationObject.SlideNum;
                if (slide_num >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    slide_num = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
        }

        if (slide_num >= 0)
        {
            this.DrawImage(this.CacheImage2, slide_num);
        }
    };

    this.StopIfPlaying = function()
    {
        if (this.IsPlaying())
        {
            __cancelFrame(this.TimerId);
            this.TimerId = null;
        }
    };

    this.Start = function(isButtonPreview, endCallback)
    {
        this.endCallback = endCallback
        this.StopIfPlaying();

        if (true == isButtonPreview)
        {
            this.CalculateRect();

            var _currentSlide = 0;
            if (null == this.DemonstrationObject)
            {
                _currentSlide = this.HtmlPage.m_oDrawingDocument.SlideCurrent;
                if (_currentSlide >= this.HtmlPage.m_oDrawingDocument.SlidesCount)
                    _currentSlide = this.HtmlPage.m_oDrawingDocument.SlidesCount - 1;
            }
            else
            {
                _currentSlide = this.DemonstrationObject.GetPrevVisibleSlide(true);
            }

            this.DrawImage1(_currentSlide, false);
            this.DrawImage2(_currentSlide);
        }

        this.StartTime = new Date().getTime();
        this.EndTime = this.StartTime + this.Duration;

		const nType = this.Type;
        switch (nType)
        {
            case c_oAscSlideTransitionTypes.Fade:
            {
                this._startFade();
                break;
            }
            case c_oAscSlideTransitionTypes.Push:
            {
                this._startPush();
                break;
            }
            case c_oAscSlideTransitionTypes.Wipe:
            {
                this._startWipe();
                break;
            }
            case c_oAscSlideTransitionTypes.Split:
            {
                this._startSplit();
                break;
            }
            case c_oAscSlideTransitionTypes.UnCover:
            {
                this._startUnCover();
                break;
            }
            case c_oAscSlideTransitionTypes.Cover:
            {
                this._startCover();
                break;
            }
            case c_oAscSlideTransitionTypes.Clock:
            {
                this._startClock();
                break;
            }
            case c_oAscSlideTransitionTypes.Zoom:
            {
                this._startZoom();
                break;
            }
            case c_oAscSlideTransitionTypes.Morph:
            {
                this._startMorph();
                break;
            }
            default:
            {
                this.End(true);
                break;
            }
        }
    };

    this.End = function(bIsAttack)
    {
        if (bIsAttack === true && null != this.TimerId)
            __cancelFrame(this.TimerId);

        this.TimerId = null;
        this.Params = null;
		this.Morph = null;

        if (this.endCallback)
            this.endCallback()

        if (this.DemonstrationObject != null)
        {
            this.DemonstrationObject.OnEndTransition(bIsAttack);

            this.CacheImage1.Image = null;
            this.CacheImage2.Image = null;
            return;
        }

        this.CacheImage1.Image = null;
        this.CacheImage2.Image = null;

        var ctx1 = this.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
        ctx1.setTransform(1, 0, 0, 1, 0, 0);
        this.HtmlPage.OnScroll();

    };

    this.IsPlaying = function()
    {
        return (null != this.TimerId) ? true : false;
    };

    this.CreateImage = function(w, h)
    {
        var _im = document.createElement('canvas');
        _im.width = w;
        _im.height = h;
        return _im;
    };

    // animations
    this._startFade = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        if (oThis.TimerId === null)
        {
            oThis.Params = { IsFirstAfterHalf : true };

            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }

            if (!oThis.IsBackward)
            {
                if (null != oThis.CacheImage1.Image)
                {
                    _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                }
                else
                {
                    var _c = oThis.CacheImage1.Color;
                    _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx1.beginPath();
                }
            }
            else
            {
                _ctx1.fillStyle = "rgb(0,0,0)";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        if (oThis.Param == c_oAscSlideTransitionParams.Fade_Smoothly)
        {
            _ctx2.globalAlpha = _part;

            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx2.beginPath();
            }

            _ctx2.globalAlpha = 1;
        }
        else if (oThis.Param == c_oAscSlideTransitionParams.Fade_Through_Black)
        {
            if (!oThis.IsBackward)
            {
                if (oThis.Params.IsFirstAfterHalf)
                {
                    if (_part > 0.5)
                    {
                        var _ctx1 = null;
                        if (null == oThis.DemonstrationObject)
                        {
                            // отрисовываем на основной канве картинку первого слайда
                            _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                        }
                        else
                        {
                            _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                        }

                        _ctx1.fillStyle = "rgb(0,0,0)";
                        _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        _ctx1.beginPath();

                        oThis.Params.IsFirstAfterHalf = false;
                    }
                }

                if (oThis.Params.IsFirstAfterHalf)
                {
                    _ctx2.globalAlpha = (2 * _part);
                    _ctx2.fillStyle = "rgb(0,0,0)";
                    _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx2.beginPath();
                }
                else
                {
                    _ctx2.globalAlpha = (2 * (_part - 0.5));

                    if (null != oThis.CacheImage2.Image)
                    {
                        _ctx2.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage2.Color;
                        _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        _ctx2.beginPath();
                    }
                }
            }
            else
            {
                if (oThis.Params.IsFirstAfterHalf)
                {
                    if (_part < 0.5)
                    {
                        var _ctx1 = null;
                        if (null == oThis.DemonstrationObject)
                        {
                            // отрисовываем на основной канве картинку первого слайда
                            _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                        }
                        else
                        {
                            _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                        }

                        if (null != oThis.CacheImage1.Image)
                        {
                            _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        }
                        else
                        {
                            var _c = oThis.CacheImage1.Color;
                            _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                            _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                            _ctx1.beginPath();
                        }

                        oThis.Params.IsFirstAfterHalf = false;
                    }
                }

                if (!oThis.Params.IsFirstAfterHalf)
                {
                    _ctx2.globalAlpha = (2 * _part);
                    _ctx2.fillStyle = "rgb(0,0,0)";
                    _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    _ctx2.beginPath();
                }
                else
                {
                    _ctx2.globalAlpha = (2 * (_part - 0.5));

                    if (null != oThis.CacheImage2.Image)
                    {
                        _ctx2.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage2.Color;
                        _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx2.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        _ctx2.beginPath();
                    }
                }
            }

            _ctx2.globalAlpha = 1;
        }

        oThis.TimerId = __nextFrame(oThis._startFade);
    };

    this._startPush = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        if (oThis.TimerId === null)
        {
            oThis.Params = { IsFirstAfterHalf : true };

            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                var _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                var _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }
        }

        var _xSrc = 0;
        var _ySrc = 0;

        var _xDstO = oThis.Rect.x;
        var _yDstO = oThis.Rect.y;
        var _wDstO = oThis.Rect.w;
        var _hDstO = oThis.Rect.h;

        var _xSrcO = 0;
        var _ySrcO = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * (1 - _part)) >> 0;
        var _offY = (_hDst * (1 - _part)) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xSrc = _offX;
                _wDst -= _offX;

                _xDstO += _wDst;
                _wDstO -= _wDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xDst += _offX;
                _wDst -= _offX;

                _xSrcO = _wDst;
                _wDstO -= _wDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _ySrc = _offY;
                _hDst -= _offY;

                _yDstO += _hDst;
                _hDstO -= _hDst;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _yDst += _offY;
                _hDst -= _offY;

                _ySrcO = _hDst;
                _hDstO -= _hDst;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;

        if (null == oThis.DemonstrationObject)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
        }

        if (_wDstO > 0 && _hDstO > 0)
        {
            if (null != oThis.CacheImage1.Image)
            {
                _ctx2.drawImage(oThis.CacheImage1.Image, _xSrcO, _ySrcO, _wDstO, _hDstO, _xDstO, _yDstO, _wDstO, _hDstO);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDstO, _yDstO, _wDstO, _hDstO);
                _ctx2.beginPath();
            }
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startPush);
    };

    this._startWipe = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(_xDst, _yDst, _wDst, _hDst);
        }

        var _koefWipeLen = 1;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _xPosStart = (_xDst - _koefWipeLen * _wDst) >> 0;
                var _xPos = (_xPosStart + (_part * (1 + _koefWipeLen) * _wDst)) >> 0;
                var _gradW = (_koefWipeLen * _wDst) >> 0;

                if (_xPos > _xDst)
                {
                    if ((_xPos + _gradW) > (_xDst + _wDst))
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _xPos - _xDst + 1, _hDst);
                        _ctx2.beginPath();

                        var _srcImageW = (256 * (_wDst - _xPos + _xDst) / _gradW) >> 0;
                        if (_srcImageW > 0 && (_wDst - _xPos + _xDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 0, _srcImageW, 1, _xPos, _yDst, _wDst - _xPos + _xDst, _hDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _xPos - _xDst + 1, _hDst);
                        _ctx2.beginPath();

                        if (_gradW > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xPos, _yDst, _gradW, _hDst);
                        }
                    }
                }
                else
                {
                    var _srcImageW = _xPos + _gradW - _xDst;
                    var _srcImageWW = 256 * (_xPos + _gradW - _xDst) / _gradW;

                    if (_srcImageW > 0 && _srcImageWW > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 256 - _srcImageWW, 0, _srcImageWW, 1, _xDst, _yDst, _srcImageW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _rDst = _xDst + _wDst;

                var _xPosStart = (_rDst + _koefWipeLen * _wDst) >> 0;
                var _xPos = (_xPosStart - (_part * (1 + _koefWipeLen) * _wDst)) >> 0;
                var _gradW = (_koefWipeLen * _wDst) >> 0;

                if (_xPos < _rDst)
                {
                    if ((_xPos - _gradW) < _xDst)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xPos, _yDst, _rDst - _xPos, _hDst);
                        _ctx2.beginPath();

                        var _srcImageW = (256 * (_xDst - _xPos + _gradW) / _gradW) >> 0;
                        if (_srcImageW > 0 && (_xPos - _xDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, _srcImageW, 0, 256 - _srcImageW, 1, _xDst, _yDst, _xPos - _xDst, _hDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xPos, _yDst, _rDst - _xPos + 1, _hDst);
                        _ctx2.beginPath();

                        if (_gradW > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xPos - _gradW, _yDst, _gradW, _hDst);
                        }
                    }
                }
                else
                {
                    var _gradWW = _xPosStart - _xPos;
                    if (_gradWW > 0)
                    {
                         var _srcImageW = 256 * _gradWW / _gradW;

                         if (_srcImageW > 0 && (_rDst - _xPos + _gradW) > 0)
                         {
                             _ctx2.drawImage(oThis.Params.GradImage, 0, 0, _srcImageW, 1, _xPos - _gradW, _yDst, _rDst - _xPos + _gradW, _hDst);
                         }
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 1;
                    _canvasTmp.height = 256;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, 256);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _yPosStart = (_yDst - _koefWipeLen * _hDst) >> 0;
                var _yPos = (_yPosStart + (_part * (1 + _koefWipeLen) * _hDst)) >> 0;
                var _gradH = (_koefWipeLen * _hDst) >> 0;

                if (_yPos > _yDst)
                {
                    if ((_yPos + _gradH) > (_yDst + _hDst))
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _wDst, _yPos - _yDst + 1);
                        _ctx2.beginPath();

                        var _srcImageH = (256 * (_hDst - _yPos + _yDst) / _gradH) >> 0;
                        if (_srcImageH > 0 && (_hDst - _yPos + _yDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, _srcImageH, _xDst, _yPos, _wDst, _hDst - _yPos + _yDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yDst, _wDst, _yPos - _yDst + 1);
                        _ctx2.beginPath();

                        if (_gradH > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xDst, _yPos, _wDst, _gradH);
                        }
                    }
                }
                else
                {
                    var _srcImageH = _yPos + _gradH - _yDst;
                    var _srcImageHH = 256 * (_yPos + _gradH - _yDst) / _gradH;

                    if (_srcImageH > 0 && _srcImageHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 256 - _srcImageHH, 1, _srcImageHH, _xDst, _yDst, _wDst, _srcImageH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 1;
                    _canvasTmp.height = 256;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, 256);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _bDst = _yDst + _hDst;
                var _yPosStart = (_bDst + _koefWipeLen * _hDst) >> 0;
                var _yPos = (_yPosStart - (_part * (1 + _koefWipeLen) * _hDst)) >> 0;
                var _gradH = (_koefWipeLen * _hDst) >> 0;

                if (_yPos < _bDst)
                {
                    if ((_yPos - _gradH) < _yDst)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yPos, _wDst, _bDst - _yPos);
                        _ctx2.beginPath();

                        var _srcImageH = (256 * (_yPos - _yDst) / _gradH) >> 0;
                        if (_srcImageH > 0 && (_yPos - _yDst) > 0)
                            _ctx2.drawImage(oThis.Params.GradImage, 0, 256 - _srcImageH, 1, _srcImageH, _xDst, _yDst, _wDst, _yPos - _yDst);
                    }
                    else
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, _yPos, _wDst, _bDst - _yPos);
                        _ctx2.beginPath();

                        if (_gradH > 0)
                        {
                            _ctx2.drawImage(oThis.Params.GradImage, _xDst, _yPos - _gradH, _wDst, _gradH);
                        }
                    }
                }
                else
                {
                    var _srcImageH = _bDst - (_yPos - _gradH);
                    var _srcImageHH = 256 * _srcImageH / _gradH;

                    if (_srcImageH > 0 && _srcImageHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, _srcImageHH, _xDst, _bDst - _srcImageH, _wDst, _srcImageH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _hDstN2 = _wDst * _sin;
                var _hDstN = 2 * _hDstN2;
                var _wDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = -_sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _hDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_hDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_hDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _hDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _hDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(Math.PI/2 - _ang);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(-_hDstN2 - _gradW, -_wDstN / 2, _gradW, _wDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_hDstN2, -_wDstN / 2, _hDstN, _wDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _wDstN2 = _wDst * _sin;
                var _wDstN = 2 * _wDstN2;
                var _hDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _wDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_wDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_wDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _wDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _wDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(_ang - Math.PI / 2);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(_wDstN2, -_hDstN / 2, _gradW, _hDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_wDstN2, -_hDstN / 2, _wDstN, _hDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = 255 - i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _wDstN2 = _wDst * _sin;
                var _wDstN = 2 * _wDstN2;
                var _hDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = -_cos;

                var _gradW = (_koefWipeLen * _wDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX - (_wDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY - (_wDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX + _e_off_x * _part * (_gradW + _wDstN);
                var _cPosY = _cStartY + _e_off_y * _part * (_gradW + _wDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(_ang - Math.PI / 2);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(-_wDstN2 - _gradW, -_hDstN / 2, _gradW, _hDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_wDstN2, -_hDstN / 2, _wDstN, _hDstN);

                _ctx2.restore();
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                if (null == oThis.TimerId)
                {
                    var _canvasTmp = document.createElement('canvas');
                    _canvasTmp.width = 256;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(256, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _ang = Math.atan(_hDst / _wDst);
                var _sin = Math.sin(_ang);
                var _cos = Math.cos(_ang);

                var _hDstN2 = _wDst * _sin;
                var _hDstN = 2 * _hDstN2;
                var _wDstN = _wDst * _cos + _hDst * _sin;

                var _e_off_x = _sin;
                var _e_off_y = _cos;

                var _gradW = (_koefWipeLen * _hDstN) >> 0;

                var _cX = _xDst + _wDst / 2;
                var _cY = _yDst + _hDst / 2;
                var _cStartX = _cX + (_hDstN2 + _gradW / 2) * _e_off_x;
                var _cStartY = _cY + (_hDstN2 + _gradW / 2) * _e_off_y;

                var _cPosX = _cStartX - _e_off_x * _part * (_gradW + _hDstN);
                var _cPosY = _cStartY - _e_off_y * _part * (_gradW + _hDstN);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                _ctx2.translate(_cPosX, _cPosY);
                _ctx2.rotate(Math.PI/2 - _ang);

                // потом расчитать точнее!!!
                _ctx2.fillStyle = "#000000";
                _ctx2.fillRect(_hDstN2, -_wDstN / 2, _gradW, _wDstN);
                _ctx2.beginPath();

                _ctx2.drawImage(oThis.Params.GradImage, -_hDstN2, -_wDstN / 2, _hDstN, _wDstN);

                _ctx2.restore();
                break;
            }
            default:
                break;
        }

        _ctx2.globalCompositeOperation = "source-atop";
        if (null != oThis.CacheImage2.Image)
        {
            _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
        }
        else
        {
            var _c = oThis.CacheImage2.Color;
            _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
            _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
            _ctx2.beginPath();
        }

        _ctx2.globalCompositeOperation = "source-over";
        oThis.TimerId = __nextFrame(oThis._startWipe);
    };

    this._startSplit = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(_xDst, _yDst, _wDst, _hDst);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(_xDst, _yDst, _wDst, _hDst);
        }

        if (oThis.TimerId === null)
        {
            // отрисовываем на основной канве картинку первого слайда
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }
            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _koefWipeLen = 1;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Split_VerticalOut:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = __w;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(_canvasTmp.width, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cX = _xDst + _wDst / 2;

                if (_part <= 0.5)
                {
                    var _w = (_part * 2 * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    if (_w > 0 && _w2 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(Math.max(_xDst, _cX - _w2 / 2 - 1), _yDst, Math.min(_w2 + 2, _wDst), _hDst);
                        _ctx2.beginPath();

                        var _w4 = _w2 >> 1;
                        var _x = _cX - _w2;
                        var _r = _cX + _w4;
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _x, _yDst, _w4, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _r, _yDst, _w4, _hDst);
                    }
                }
                else
                {
                    var _w = (_part * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";
                    _ctx2.fillRect(Math.max(_xDst, _cX - _w2 - 1), _yDst, Math.min(_w + 2, _wDst), _hDst);
                    _ctx2.beginPath();

                    var _gradWW = (_wDst - _w) >> 1;
                    var _gradW = (_wDst / 4) >> 0;

                    var _srcOff = 256 * _gradWW / _gradW;
                    if (_gradWW > 0)
                    {
                        //_ctx2.drawImage(oThis.Params.GradImage, 256 - _srcOff, 0, _srcOff, 1, _xDst, _yDst, _gradWW, _hDst);
                        //_ctx2.drawImage(oThis.Params.GradImage, 255, 0, _srcOff, 1, _cX + _w2, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _xDst, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _cX + _w2, _yDst, _gradWW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_VerticalIn:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = __w;
                    _canvasTmp.height = 1;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(_canvasTmp.width, 1);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cX = _xDst + _wDst / 2;

                if (_part <= 0.5)
                {
                    var _w = (_part * 2 * _wDst) >> 0;
                    var _w2 = _w >> 1;
                    var _w4 = _w2 >> 1;

                    if (_w4 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";

                        _ctx2.fillRect(_xDst, _yDst, _w4 + 1, _hDst);
                        _ctx2.beginPath();
                        _ctx2.fillRect(_xDst + _wDst - _w4 - 1, _yDst, _w4 + 1, _hDst);
                        _ctx2.beginPath();

                        var _x = _xDst + _w4;
                        var _r = _xDst + _wDst - _w2;
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _x, _yDst, _w4, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _r, _yDst, _w4, _hDst);
                    }
                }
                else
                {
                    var _w = (_part * _wDst) >> 0;
                    var _w2 = _w >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";

                    _ctx2.fillRect(_xDst, _yDst, _w2 + 1, _hDst);
                    _ctx2.beginPath();
                    _ctx2.fillRect(_xDst + _wDst - _w2 - 1, _yDst, _w2 + 1, _hDst);
                    _ctx2.beginPath();

                    var _gradWW = (_wDst - _w) >> 1;
                    var _gradW = (_wDst / 4) >> 0;

                    var _srcOff = 256 * _gradWW / _gradW;

                    if (_gradWW > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 255, 0, 255, 1, _xDst + _w2, _yDst, _gradWW, _hDst);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 255, 1, _cX, _yDst, _gradWW, _hDst);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalOut:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = 1;
                    _canvasTmp.height = __w;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, __w);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cY = _yDst + _hDst / 2;

                if (_part <= 0.5)
                {
                    var _h = (_part * 2 * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    if (_h > 0 && _h2 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";
                        _ctx2.fillRect(_xDst, Math.max(_cY - _h2 / 2 - 1), _wDst, Math.min(_h2 + 2, _hDst));
                        _ctx2.beginPath();

                        var _h4 = _h2 >> 1;
                        var _y = _cY - _h2;
                        var _b = _cY + _h4;

                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _y, _wDst, _h4);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _b, _wDst, _h4);
                    }
                }
                else
                {
                    var _h = (_part * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";
                    _ctx2.fillRect(_xDst, Math.max(_yDst, _cY - _h2 - 1), _wDst, Math.min(_h + 2, _hDst));
                    _ctx2.beginPath();

                    var _gradHH = (_hDst - _h) >> 1;
                    var _gradH = (_hDst / 4) >> 0;

                    //var _srcOff = 256 * _gradHH / _gradH;
                    if (_gradHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _yDst, _wDst, _gradHH);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _cY + _h2, _wDst, _gradHH);
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Split_HorizontalIn:
            {
                if (oThis.TimerId === null)
                {
                    var _canvasTmp = document.createElement('canvas');
                    var __w = 256 + 255;
                    _canvasTmp.width = 1;
                    _canvasTmp.height = __w;
                    var _canvasTmpCtx = _canvasTmp.getContext('2d');
                    var _data = _canvasTmpCtx.createImageData(1, __w);
                    for (var i = 0; i < 256; i++)
                        _data.data[4 * i + 3] = i;
                    for (var i = 256; i < __w; i++)
                        _data.data[4 * i + 3] = __w - i - 1;
                    _canvasTmpCtx.putImageData(_data, 0, 0);

                    oThis.Params = { GradImage : _canvasTmp };
                }

                var _cY = _yDst + _hDst / 2;

                if (_part <= 0.5)
                {
                    var _h = (_part * 2 * _hDst) >> 0;
                    var _h2 = _h >> 1;
                    var _h4 = _h2 >> 1;

                    if (_h4 > 0)
                    {
                        _ctx2.beginPath();
                        _ctx2.fillStyle = "#000000";

                        _ctx2.fillRect(_xDst, _yDst, _wDst, _h4 + 1);
                        _ctx2.beginPath();
                        _ctx2.fillRect(_xDst, _yDst + _hDst - _h4 - 1, _wDst, _h4 + 1);
                        _ctx2.beginPath();

                        var _y = _yDst + _h4;
                        var _b = _yDst + _hDst - _h2;
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _y, _wDst, _h4);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _b, _wDst, _h4);
                    }
                }
                else
                {
                    var _h = (_part * _hDst) >> 0;
                    var _h2 = _h >> 1;

                    _ctx2.beginPath();
                    _ctx2.fillStyle = "#000000";

                    _ctx2.fillRect(_xDst, _yDst, _wDst, _h2 + 1);
                    _ctx2.beginPath();
                    _ctx2.fillRect(_xDst, _yDst + _hDst - _h2 - 1, _wDst, _h2 + 1);
                    _ctx2.beginPath();

                    var _gradHH = (_hDst - _h) >> 1;
                    var _gradH = (_hDst / 4) >> 0;

                    //var _srcOff = 256 * _gradHH / _gradH;
                    if (_gradHH > 0)
                    {
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 255, 1, 255, _xDst, _yDst + _h2, _wDst, _gradHH);
                        _ctx2.drawImage(oThis.Params.GradImage, 0, 0, 1, 255, _xDst, _cY, _wDst, _gradHH);
                    }
                }
                break;
            }
            default:
                break;
        }

        _ctx2.globalCompositeOperation = "source-atop";
        if (null != oThis.CacheImage2.Image)
        {
            _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
        }
        else
        {
            var _c = oThis.CacheImage2.Color;
            _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
            _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
            _ctx2.beginPath();
        }

        _ctx2.globalCompositeOperation = "source-over";
        oThis.TimerId = __nextFrame(oThis._startSplit);
    };

    this._startUnCover = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }

            if (null != oThis.CacheImage2.Image)
            {
                _ctx1.drawImage(oThis.CacheImage2.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _xSrc = 0;
        var _ySrc = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * _part) >> 0;
        var _offY = (_hDst * _part) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xDst += _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xSrc = _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _yDst += _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _ySrc = _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                _xDst += _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                _xSrc = _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                _xDst += _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                _xSrc = _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage1.Image)
            {
                _ctx2.drawImage(oThis.CacheImage1.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startUnCover);
    };

    this._startCover = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _xSrc = 0;
        var _ySrc = 0;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _offX = (_wDst * (1 - _part)) >> 0;
        var _offY = (_hDst * (1 - _part)) >> 0;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Param_Left:
            {
                _xSrc = _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Right:
            {
                _xDst += _offX;
                _wDst -= _offX;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Top:
            {
                _ySrc = _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_Bottom:
            {
                _yDst += _offY;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopLeft:
            {
                _xSrc = _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_TopRight:
            {
                _xDst += _offX;
                _ySrc = _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomLeft:
            {
                _xSrc = _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            case c_oAscSlideTransitionParams.Param_BottomRight:
            {
                _xDst += _offX;
                _yDst += _offY;
                _wDst -= _offX;
                _hDst -= _offY;
                break;
            }
            default:
                break;
        }

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xSrc, _ySrc, _wDst, _hDst, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        oThis.TimerId = __nextFrame(oThis._startCover);
    };

    this._startClock = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        if (oThis.TimerId === null)
        {
            var _ctx1 = null;
            if (null == oThis.DemonstrationObject)
            {
                // отрисовываем на основной канве картинку первого слайда
                _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
            }
            else
            {
                _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                _ctx1.fillStyle = "#000000";
                _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
            }

            if (null != oThis.CacheImage1.Image)
            {
                _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
            }
            else
            {
                var _c = oThis.CacheImage1.Color;
                _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                _ctx1.beginPath();
            }
        }

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        var _anglePart1 = Math.atan(_wDst / _hDst);
        var _anglePart2 = Math.PI / 2 - _anglePart1;
        var _offset = 0;

        var _ctx2 = null;
        if (oThis.DemonstrationObject == null)
        {
            oThis.HtmlPage.m_oOverlayApi.Clear();
            oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

            _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
        }
        else
        {
            _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
        }

        _ctx2.save();
        _ctx2.beginPath();

        var _cX = _xDst + _wDst / 2;
        var _cY = _yDst + _hDst / 2;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Clock_Clockwise:
            {
                var _angle = 2 * Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 2:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 3:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Clock_Counterclockwise:
            {
                var _angle = 2 * Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX - _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_x, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 2:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY + _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst + _hDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 3:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _x = _cX + _offset;
                            _y = _yDst;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _x = _xDst + _wDst;
                            _y = _cY - _offset;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX, _yDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_x, _y);
                            _ctx2.closePath();
                        }

                        break;
                    }
                }
                break;
            }
            case c_oAscSlideTransitionParams.Clock_Wedge:
            {
                var _angle = Math.PI * _part;
                var _x = 0;
                var _y = 0;

                var _mainPart = (2 * _angle / Math.PI) >> 0;
                var _nomainPart = _angle - (_mainPart * Math.PI / 2);

                switch (_mainPart)
                {
                    case 0:
                    {
                        if (_nomainPart > _anglePart1)
                        {
                            _offset = _wDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_xDst, _cY - _offset);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _cY - _offset);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _hDst * Math.tan(_nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX - _offset, _yDst);
                            _ctx2.lineTo(_cX + _offset, _yDst);
                            _ctx2.closePath();
                        }

                        break;
                    }
                    case 1:
                    {
                        if (_nomainPart > _anglePart2)
                        {
                            _offset = _hDst * Math.tan((Math.PI / 2) - _nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_cX - _offset, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst + _hDst);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst + _hDst);
                            _ctx2.lineTo(_cX + _offset, _yDst + _hDst);
                            _ctx2.closePath();
                        }
                        else
                        {
                            _offset = _wDst * Math.tan(_nomainPart) / 2;

                            _ctx2.moveTo(_cX, _cY);
                            _ctx2.lineTo(_xDst, _cY + _offset);
                            _ctx2.lineTo(_xDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _yDst);
                            _ctx2.lineTo(_xDst + _wDst, _cY + _offset);
                        }

                        break;
                    }
                }
                break;
            }
            default:
                break;
        }

        _ctx2.clip();

        if (_wDst > 0 && _hDst > 0)
        {
            if (null != oThis.CacheImage2.Image)
            {
                _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
            }
            else
            {
                var _c = oThis.CacheImage2.Color;
                _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.beginPath();
            }
        }

        _ctx2.restore();

        oThis.TimerId = __nextFrame(oThis._startClock);
    };

    this._startZoom = function()
    {
        oThis.CurrentTime = new Date().getTime();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }

        oThis.SetBaseTransform();

        var _xDst = oThis.Rect.x;
        var _yDst = oThis.Rect.y;
        var _wDst = oThis.Rect.w;
        var _hDst = oThis.Rect.h;

        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;

        switch (oThis.Param)
        {
            case c_oAscSlideTransitionParams.Zoom_In:
            {
                var _ctx1 = null;
                if (null == oThis.DemonstrationObject)
                {
                    // отрисовываем на основной канве картинку первого слайда
                    _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                    _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
                }
                else
                {
                    _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                    _ctx1.fillStyle = "#000000";
                    _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
                }


                var _w = ((0.5 * _wDst) * (1 + _part)) >> 0;
                var _h = ((0.5 * _hDst) * (1 + _part)) >> 0;
                var _x = (_wDst - _w) >> 1;
                var _y = (_hDst - _h) >> 1;

                var _x1 = (0.25 * _wDst - _x) >> 0;
                var _y1 = (0.25 * _hDst - _y) >> 0;
                var _w1 = _wDst - 2 * _x1;
                var _h1 = _hDst - 2 * _y1;

                if (_w > 0 && _h > 0)
                {
                    if (null != oThis.CacheImage2.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage2.Image, _xDst + _x, _yDst + _y, _w, _h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage2.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(_xDst + _x, _yDst + _y, _w, _h);
                        _ctx1.beginPath();
                    }
                }

                _ctx1.globalAlpha = (1 - _part);
                if (null != oThis.CacheImage1.Image)
                {
                    _ctx1.drawImage(oThis.CacheImage1.Image, _x1, _y1, _w1, _h1, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage1.Color;
                    _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx1.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx1.beginPath();
                }
                _ctx1.globalAlpha = 1;

                break;
            }
            case c_oAscSlideTransitionParams.Zoom_Out:
            {
                var _ctx1 = null;
                if (null == oThis.DemonstrationObject)
                {
                    // отрисовываем на основной канве картинку первого слайда
                    _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                    _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                    _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
                }
                else
                {
                    _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                    _ctx1.fillStyle = "#000000";
                    _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
                }

                _part = 1 - _part;
                var _w = ((0.5 * _wDst) * (1 + _part)) >> 0;
                var _h = ((0.5 * _hDst) * (1 + _part)) >> 0;
                var _x = (_wDst - _w) >> 1;
                var _y = (_hDst - _h) >> 1;

                var _x1 = (0.25 * _wDst - _x) >> 0;
                var _y1 = (0.25 * _hDst - _y) >> 0;
                var _w1 = _wDst - 2 * _x1;
                var _h1 = _hDst - 2 * _y1;

                if (_w > 0 && _h > 0)
                {
                    if (null != oThis.CacheImage1.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage1.Image, _xDst + _x, _yDst + _y, _w, _h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage1.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(_xDst + _x, _yDst + _y, _w, _h);
                        _ctx1.beginPath();
                    }
                }

                _ctx1.globalAlpha = (1 - _part);
                if (null != oThis.CacheImage2.Image)
                {
                    _ctx1.drawImage(oThis.CacheImage2.Image, _x1, _y1, _w1, _h1, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage2.Color;
                    _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx1.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx1.beginPath();
                }
                _ctx1.globalAlpha = 1;

                break;
            }
            case c_oAscSlideTransitionParams.Zoom_AndRotate:
            {
                if (oThis.TimerId === null)
                {
                    var _ctx1 = null;
                    if (null == oThis.DemonstrationObject)
                    {
                        // отрисовываем на основной канве картинку первого слайда
                        _ctx1 = oThis.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
                        _ctx1.fillStyle = GlobalSkin.BackgroundColor;
                        _ctx1.fillRect(0, 0, oThis.HtmlPage.m_oEditor.HtmlElement.width, oThis.HtmlPage.m_oEditor.HtmlElement.height);
                    }
                    else
                    {
                        _ctx1 = oThis.DemonstrationObject.Canvas.getContext('2d');
                        _ctx1.fillStyle = "#000000";
                        _ctx1.fillRect(0, 0, oThis.DemonstrationObject.Canvas.width, oThis.DemonstrationObject.Canvas.height);
                    }

                    if (null != oThis.CacheImage1.Image)
                    {
                        _ctx1.drawImage(oThis.CacheImage1.Image, oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                    }
                    else
                    {
                        var _c = oThis.CacheImage1.Color;
                        _ctx1.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                        _ctx1.fillRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                        _ctx1.beginPath();
                    }
                }

                var _ctx2 = null;
                if (oThis.DemonstrationObject == null)
                {
                    oThis.HtmlPage.m_oOverlayApi.Clear();
                    oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);

                    _ctx2 = oThis.HtmlPage.m_oOverlayApi.m_oContext;
                }
                else
                {
                    _ctx2 = oThis.DemonstrationObject.Overlay.getContext('2d');
                    _ctx2.clearRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);
                }

                // начинаем с угла в -45 градусов. затем крутим против часовой стрелки на 360 + 45 градусов
                // размер - от 5% до 100%
                var _angle = -45 + 405 * _part;
                var _scale = (0.05 + 0.95 * _part);
                _angle *= (Math.PI / 180);

                _ctx2.save();
                _ctx2.beginPath();
                _ctx2.rect(_xDst, _yDst, _wDst, _hDst);
                _ctx2.clip();
                _ctx2.beginPath();

                var _xC = _xDst + _wDst / 2;
                var _yC = _yDst + _hDst / 2;

                var localTransform = new AscCommon.CMatrixL();
                global_MatrixTransformer.TranslateAppend(localTransform, -_xC, -_yC);
                global_MatrixTransformer.ScaleAppend(localTransform, _scale, _scale);
                global_MatrixTransformer.RotateRadAppend(localTransform, _angle);
                global_MatrixTransformer.TranslateAppend(localTransform, _xC, _yC);

                _ctx2.transform(localTransform.sx, localTransform.shy, localTransform.shx, localTransform.sy, localTransform.tx, localTransform.ty);

                if (null != oThis.CacheImage2.Image)
                {
                    _ctx2.drawImage(oThis.CacheImage2.Image, _xDst, _yDst, _wDst, _hDst);
                }
                else
                {
                    var _c = oThis.CacheImage2.Color;
                    _ctx2.fillStyle = "rgb(" + _c.r + "," + _c.g + "," + _c.b + ")";
                    _ctx2.fillRect(_xDst, _yDst, _wDst, _hDst);
                    _ctx2.beginPath();
                }

                _ctx2.restore();

                break;
            }
            default:
                break;
        }


        oThis.TimerId = __nextFrame(oThis._startZoom);
    };
    this._startMorph = function()
    {

        oThis.CurrentTime = new Date().getTime();


        oThis.SetBaseTransform();

        if (oThis.CurrentTime >= oThis.EndTime)
        {
            oThis.End(false);
            return;
        }
        var _part = (oThis.CurrentTime - oThis.StartTime) / oThis.Duration;
        if (oThis.IsBackward)
            _part = 1 - _part;


		if(!oThis.Morph)
		{
			const oPr = editor.WordControl.m_oLogicDocument;
			const oSlide1 = oPr.Slides[0];
			const oSlide2 = oPr.Slides[1];
			oThis.Morph = new CSlideMorphEffect(oSlide1, oSlide2, oThis.Param)
		}
        let oCanvas;
        if(oThis.DemonstrationObject)
        {
            oCanvas = oThis.DemonstrationObject.Canvas;
        }
        else
        {

            oCanvas = oThis.HtmlPage.m_oOverlayApi.m_oControl.HtmlElement;
        }



        oThis.HtmlPage.m_oOverlayApi.Clear();
        oThis.HtmlPage.m_oOverlayApi.CheckRect(oThis.Rect.x, oThis.Rect.y, oThis.Rect.w, oThis.Rect.h);



        oThis.Morph.morph(_part);
	    oThis.Morph.draw(oCanvas, oThis.Rect, _part)

        oThis.TimerId = __nextFrame(oThis._startMorph);
    };
}



function gcd(n, m) {
    return m === 0 ? n : gcd(m, n % m);
}

function lcm(n, m) {
    return n * m / gcd(n, m);
}



function CMorphObjectBase(oTexturesCache, nRelH1, nRelH2) {
    this.cache = oTexturesCache;
    const isN = AscFormat.isRealNumber;
	this.relHeight1 = isN(nRelH1) ? nRelH1 : null;
	this.relHeight2 = isN(nRelH2) ? nRelH2 : null;

    this.relHeight = null;

    this.relTime = 0.0;
}
CMorphObjectBase.prototype.morph = function (dRelTime) {
    if(this.relHeight1 !== null && this.relHeight2 !== null) {
        this.relHeight = this.relHeight1 + dRelTime * (this.relHeight2 - this.relHeight1);
    }
    else if(this.relHeight1 !== null) {
        this.relHeight = this.relHeight1;
    }
    else {
        this.relHeight = this.relHeight2;
    }
    this.relTime = dRelTime;
};
CMorphObjectBase.prototype.morphObjects = function (dRelTime) {

};
CMorphObjectBase.prototype.draw = function (oGraphics) {

};
CMorphObjectBase.prototype.getValBetween = function(dVal1, dVal2) {
    return dVal1 + (dVal2 - dVal1)* this.relTime;
};

function CMorphedPath(oTexturesCache, oPath1, nRelH1, oBrush1, oPen1, oTransform1,
                      oPath2, nRelH2, oBrush2, oPen2, oTransform2) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2);


    if(oPath1.fill !== oPath2.fill || oPath1.stroke !== oPath2.stroke) {
        return;
    }
    this.path1 = oPath1;
    this.brush1 = oBrush1;
    this.pen1 = oPen1;
    this.transform1 = oTransform1;

    this.path2 = oPath2;
    this.brush2 = oBrush2;
    this.pen2 = oPen2;
    this.transform2 = oTransform2;
    this.path1T = null;
    this.path2T = null;
    AscFormat.ExecuteNoHistory(function() {

        this.path1T = new AscFormat.Path();
        this.path1T.setParent(this.path1.parent);
        this.path1.convertToBezierCurves(this.path1T, this.transform1);

        this.path2T = new AscFormat.Path();
        this.path2T.setParent(this.path2.parent);
        this.path2.convertToBezierCurves(this.path2T, this.transform2);
    }, this, []);


    this.path = null;
    this.pen = null;
    this.brush = null;

    this.contours1 = [];
    this.contours2 = [];

    let aContours1 = [];
    let aContours2 = [];
    const aCommands1 = this.path1T.ArrPathCommand;
    const aCommands2 = this.path2T.ArrPathCommand;


    for(let nCmd = 0; nCmd < aCommands1.length; ++nCmd) {
        let oCmd = aCommands1[nCmd];
        if(oCmd.id === AscFormat.moveTo) {
            aContours1.push([]);
        }
        if(aContours1.length === 0) {
            aContours1.push([]);
        }
        let aContour = aContours1[aContours1.length - 1];
        aContour.push(oCmd);
    }
    for(let nCmd = 0; nCmd < aCommands2.length; ++nCmd) {
        let oCmd = aCommands2[nCmd];
        if(oCmd.id === AscFormat.moveTo) {
            aContours2.push([]);
        }
        if(aContours2.length === 0) {
            aContours2.push([]);
        }
        let aContour = aContours2[aContours2.length - 1];
        aContour.push(oCmd);
    }
    if(aContours1.length === aContours2.length) {
        const nContoursCount = aContours1.length;
        for(let nCnt = 0; nCnt < nContoursCount; ++nCnt) {
            let aContour1 = aContours1[nCnt];
            let aContour2 = aContours2[nCnt];
            let oFirstCmd1 = aContour1[0];
            let oFirstCmd2 = aContour2[0];
            let oLastCmd1 = aContour1[aContour1.length - 1];
            let oLastCmd2 = aContour2[aContour2.length - 1];
            if(oLastCmd1.id !== oLastCmd2.id) {
                return;
            }

            if(oFirstCmd1.id !== AscFormat.moveTo) {
                return;
            }
            if(oFirstCmd2.id !== AscFormat.moveTo) {
                return;
            }
            let n = aContour1.length - 1;
            if(oLastCmd1.id === AscFormat.close) {
                n--;
            }
            let m = aContour2.length - 1;
            if(oLastCmd2.id === AscFormat.close) {
                m--;
            }
            const nLCM = lcm(n, m);
            const n1 = nLCM / n;
            const m1 = nLCM / m;
            function getBezierCommands(aCommands, nSplitCount) {
                let aBezier = [];
                let oLastCommand = aCommands[aCommands.length - 1];
                let nLastIdx = aCommands.length - 1;
                if(oLastCommand.id === AscFormat.close) {
                    --nLastIdx;
                }
                let dLastX, dLastY;
                for(let nCmd = 0; nCmd <= nLastIdx; ++nCmd) {
                    let oCmd = aCommands[nCmd];
                    if(oCmd.id === AscFormat.moveTo) {
                        dLastX = oCmd.X;
                        dLastY = oCmd.Y;
                    }
                    else if(oCmd.id === AscFormat.bezier4) {
                        let dX0 = dLastX;
                        let dY0 = dLastY;
                        let dX1 = oCmd.X0;
                        let dY1 = oCmd.Y0;
                        let dX2 = oCmd.X1;
                        let dY2 = oCmd.Y1;
                        let dX3 = oCmd.X2;
                        let dY3 = oCmd.Y2;
                        let aSplitCommand = AscFormat.splitBezier4OnParts(dX0, dY0, dX1, dY1, dX2, dY2, dX3, dY3, nSplitCount);
                        if(!aSplitCommand) {
                            return;
                        }
                        aBezier = aBezier.concat(aSplitCommand);

                        dLastX = oCmd.X2;
                        dLastY = oCmd.Y2;
                    }
                    else {
                        return null;
                    }
                }
                return aBezier;
            }
            let aBezier1 = getBezierCommands(aCommands1, n1);
            let aBezier2 = getBezierCommands(aCommands2, m1);
            if(!aBezier1 || !aBezier2 || aBezier1.length !== aBezier2.length) {
                return;
            }

            function fillContour(aContourT, oFirstCommand, oLastCommand, aBezier, oT) {
                let oCmd = oFirstCommand;
                let dX = oCmd.X;
                let dY = oCmd.Y;
                aContourT.push([dX, dY]);
                for(let nCmd = 0; nCmd < aBezier1.length; ++nCmd) {
                    let aBezier4 =  aBezier[nCmd];
                    let dX0 = aBezier4[2];
                    let dY0 = aBezier4[3];
                    let dX1 = aBezier4[4];
                    let dY1 = aBezier4[5];
                    let dX2 = aBezier4[6];
                    let dY2 = aBezier4[7];
                    aContourT.push([dX0, dY0, dX1, dY1, dX2, dY2]);
                }
                if(oLastCommand.id === AscFormat.close) {
                    aContourT.push([]);
                }

            }

            let aContourT1 = [];
            this.contours1.push(aContourT1);
            fillContour(aContourT1, oFirstCmd1, oLastCmd1, aBezier1, this.transform1);

            let aContourT2 = [];
            this.contours2.push(aContourT2);
            fillContour(aContourT2, oFirstCmd2, oLastCmd2, aBezier2, this.transform2);
        }
    }


    const oPath = AscFormat.ExecuteNoHistory(function() {

        let oPath = new AscFormat.Path();
        return oPath;

    }, this, []);
    oPath.fill = oPath1.fill;
    oPath.stroke = oPath1.stroke;
    let aPathCommands = oPath.ArrPathCommand;
    for(let nContour = 0; nContour < this.contours1.length; ++nContour) {
        let aContour1 = this.contours1[nContour];
        let aContour2 = this.contours2[nContour];
        if(aContour1.length !== aContour2.length) {
            return;
        }
        for(let nCmd = 0; nCmd < aContour1.length; ++nCmd) {
            let aCmd1 = aContour1[nCmd];
            let aCmd2 = aContour2[nCmd];
            if(aCmd1.length !== aCmd2.length) {
                return;
            }
            if(aCmd1.length === 2) {
                aPathCommands.push({
                    id: AscFormat.moveTo,
                    X: aCmd1[0],
                    Y: aCmd1[1],

                    cmd1: aCmd1,
                    cmd2: aCmd2
                });
            }
            else if (aCmd1.length === 6) {
                aPathCommands.push({
                    id: AscFormat.bezier4,
                    X0: aCmd1[0],
                    Y0: aCmd1[1],
                    X1: aCmd1[2],
                    Y1: aCmd1[3],
                    X2: aCmd1[4],
                    Y2: aCmd1[5],

                    cmd1: aCmd1,
                    cmd2: aCmd2
                });
            }
            else if (aCmd1.length === 0) {
                aPathCommands.push({
                    id: AscFormat.close,
                    cmd1: aCmd1,
                    cmd2: aCmd2
                });
            }
        }
    }
    this.path = oPath;

    let oGeometry = new AscFormat.ExecuteNoHistory(function() {return new AscFormat.Geometry();}, this, []);
    oGeometry.pathLst.push(this.path);
    this.drawObject = new AscFormat.OverlayObject(oGeometry, 100, 100, this.brush1, this.pen1, new AscCommon.CMatrix());
    this.morph(1);
}
AscFormat.InitClassWithoutType(CMorphedPath, CMorphObjectBase);
CMorphedPath.prototype.morph = function (dTime) {
    if(!this.isValid()) {
        return;
    }
    if(!this.path) {
        return;
    }

    CMorphObjectBase.prototype.morph.call(this, dTime);
    let aCommands = this.path.ArrPathCommand;
    for(let nCmd = 0; nCmd < aCommands.length; ++nCmd) {
        let oCmd = aCommands[nCmd];
        let aCmd1 = oCmd.cmd1;
        let aCmd2 = oCmd.cmd2;
        if(!aCmd1 || !aCmd2) {
            return;
        }
        if(oCmd.id === AscFormat.moveTo) {
            oCmd.X = this.getValBetween(aCmd1[0], aCmd2[0]);
            oCmd.Y = this.getValBetween(aCmd1[1], aCmd2[1]);
        }
        else if(oCmd.id === AscFormat.bezier4) {
            oCmd.X0 = this.getValBetween(aCmd1[0], aCmd2[0]);
            oCmd.Y0 = this.getValBetween(aCmd1[1], aCmd2[1]);
            oCmd.X1 = this.getValBetween(aCmd1[2], aCmd2[2]);
            oCmd.Y1 = this.getValBetween(aCmd1[3], aCmd2[3]);
            oCmd.X2 = this.getValBetween(aCmd1[4], aCmd2[4]);
            oCmd.Y2 = this.getValBetween(aCmd1[5], aCmd2[5]);
        }
        else if(oCmd.id === AscFormat.close) {

        }
        else {
            return;
        }
    }
};
CMorphedPath.prototype.draw = function(oGraphics) {
    if(!this.isValid()) {
        return;
    }
    this.drawObject.draw(oGraphics);
};
CMorphedPath.prototype.isValid = function() {
    return !!this.path;
};
CMorphedPath.prototype.getPath = function() {
    return this.path;
};

function CComplexMorphObject(oTexturesCache, nRelH1, nRelH2) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2);
    this.morphedObjects = [];
}
AscFormat.InitClassWithoutType(CComplexMorphObject, CMorphObjectBase);
CComplexMorphObject.prototype.morph = function (dTime) {
    for(let nIdx = 0; nIdx < this.morphedObjects.length; ++ nIdx) {
        this.morphedObjects[nIdx].morph(dTime);
    }
};
CComplexMorphObject.prototype.draw = function (oGraphics) {
    for(let nIdx = 0; nIdx < this.morphedObjects.length; ++ nIdx) {
        this.morphedObjects[nIdx].draw(oGraphics);
    }
};
CComplexMorphObject.prototype.addMorphObject = function (oMorphObject) {
    this.morphedObjects.push(oMorphObject);
};
function CShapeComplexMorph(oTexturesCache, nRelH1, nRelH2, oShape1, oShape2, bNoText) {
    CComplexMorphObject.call(this, oTexturesCache, nRelH1, nRelH2);
    this.shape1 = oShape1;
    this.shape2 = oShape2;
    const oGeometry1 = this.shape1.getGeometry();
    const oGeometry2 = this.shape2.getGeometry();
    const oGeometryMorph = new CGeometryMorphObject(this.cache, this.relHeight1, this.relHeight2,
        oGeometry1, this.shape1.brush, this.shape1.pen, this.shape1.transform,
        oGeometry2, this.shape2.brush, this.shape2.pen, this.shape2.transform);
    if(oGeometryMorph.isValid()) {
        this.addMorphObject(oGeometryMorph);
        if(!bNoText) {
            const oContent1 = this.shape1.getDocContent();
            const oTransform1 = this.shape1.transformText;
            const oContent2 = this.shape2.getDocContent();
            const oTransform2 = this.shape2.transformText;
            if(oContent1 || oContent2) {
                this.addMorphObject(new CContentMorphObject(oTexturesCache, nRelH1, nRelH2,
                    oContent1, oTransform1,
                    oContent2, oTransform2));
            }
        }
    }
    else {
        this.addMorphObject(new CStretchTextureTransform(oTexturesCache, nRelH1, nRelH2, this.shape1, this.shape2, bNoText));
    }

}
AscFormat.InitClassWithoutType(CShapeComplexMorph, CComplexMorphObject);




function CGeometryMorphObject(oTexturesCache, nRelH1, nRelH2,
                              oGeometry1, oBrush1, oPen1, oTransform1,
                              oGeometry2, oBrush2, oPen2, oTransform2) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2);
    this.geometry1 = oGeometry1;
    this.brush1 = oBrush1;
    this.pen1 = oPen1;
    this.transform1 = oTransform1;
    this.geometry2 = oGeometry2;
    this.brush2 = oBrush2;
    this.pen2 = oPen2;
    this.transform2 = oTransform2;
    this.geometry = null;
    this.morphedPaths = [];
    this.textureShape1 = null;
    this.textureShape2 = null;

    this.init();
}
AscFormat.InitClassWithoutType(CGeometryMorphObject, CMorphObjectBase);
CGeometryMorphObject.prototype.init = function() {
    const aPathLst1 = this.geometry1.pathLst;
    const aPathLst2 = this.geometry2.pathLst;

    let bTextureMorph = true;
    if(aPathLst1.length === aPathLst2.length) {
        const aPaths = [];
        const nPathCount = aPathLst1.length;
        const aMorphs = [];
        let nPath;
        for(nPath = 0; nPath < nPathCount; ++nPath) {
            let oPath1 = aPathLst1[nPath];
            let oPath2 = aPathLst2[nPath];
            let oPathMorph = new CMorphedPath(this.cache, oPath1, this.relHeight1, this.brush1, this.pen1, this.transform1,
                oPath2, this.relHeight2, this.brush2, this.pen2, this.transform2);
            if(!oPathMorph.isValid()) {
                break;
            }
            aPaths.push(oPathMorph.getPath());
            aMorphs.push(oPathMorph);
        }
        bTextureMorph = (nPath < nPathCount);
        if(!bTextureMorph) {
            this.morphedPaths = aMorphs;
            this.geometry = AscFormat.ExecuteNoHistory(function () { return new AscFormat.Geometry();}, this, []);
            this.geometry.pathLst = aPaths;
            this.drawObject = new AscFormat.OverlayObject(this.geometry, 100, 100, new AscFormat.CUniFill(), new AscFormat.CLn(), new AscCommon.CMatrix());
            this.textureShape1 = CGeometryTextureMorph.prototype.createShape.call(this, AscFormat.ExecuteNoHistory(function () { return new AscFormat.CreateGeometry("rect");}, this, []),
                 this.brush1, this.pen1, new AscCommon.CMatrix());
            this.textureShape2 = CGeometryTextureMorph.prototype.createShape.call(this, AscFormat.ExecuteNoHistory(function () { return new AscFormat.CreateGeometry("rect");}, this, []),
                this.brush2, this.pen2, new AscCommon.CMatrix());
        }
        return;
    }
};
CGeometryMorphObject.prototype.morph = function(dRelTime) {
    if(!this.isValid()) {
        return;
    }
    CMorphObjectBase.prototype.morph.call(this, dRelTime);
    const nPathsCount = this.morphedPaths.length;
    for(let nIdx = 0; nIdx < nPathsCount; ++nIdx) {
        this.morphedPaths[nIdx].morph(dRelTime);
    }
};
CGeometryMorphObject.prototype.morphBrush = function(oBrush1, oBrush2, dScale) {

    if(!oBrush1 && !oBrush2) {
        return null;
    }
    let oBrush = oBrush1;

    if(oBrush1 && oBrush1.isSolidFill() &&  oBrush2 && oBrush2.isSolidFill()) {
        const oRGBA1 = oBrush1.getRGBAColor();
        const oRGBA2 = oBrush2.getRGBAColor();
        const R = this.getValBetween(oRGBA1.R, oRGBA2.R) + 0.5 >> 0;
        const G = this.getValBetween(oRGBA1.G, oRGBA2.G) + 0.5 >> 0;
        const B = this.getValBetween(oRGBA1.B, oRGBA2.B) + 0.5 >> 0;
        const A = this.getValBetween(oRGBA1.A, oRGBA2.A) + 0.5 >> 0;
        const isN = AscFormat.isRealNumber;
        const dTransparent1 = isN(oBrush1.transparent) ? oBrush1.transparent : 255;
        const dTransparent2 = isN(oBrush2.transparent) ? oBrush2.transparent : 255;
        const dTransparent = this.getValBetween(dTransparent1, dTransparent2);
        oBrush = AscFormat.CreateSolidFillRGBA(R, G, B, A);
        oBrush.transparent = dTransparent;
    }
    else if(oBrush1 && oBrush1.isNoFill() &&  oBrush2 && oBrush2.isNoFill()) {
        return oBrush1;
    }
    else {
        var oShapeDrawer = new AscCommon.CShapeDrawer();
        oShapeDrawer.bIsCheckBounds = true;
        oShapeDrawer.Graphics = new AscFormat.CSlideBoundsChecker();
        this.drawObject.check_bounds(oShapeDrawer);
        const dBoundsW = oShapeDrawer.max_x - oShapeDrawer.min_x;
        const dBoundsH = oShapeDrawer.max_y - oShapeDrawer.min_y;
        this.textureShape1.calcGeometry.Recalculate(dBoundsW, dBoundsH);
        this.textureShape1.brush = oBrush1;
        this.textureShape1.pen = AscFormat.CreateNoFillLine();
        this.textureShape1.bounds.reset(0, 0, dBoundsW, dBoundsH);
        this.textureShape1.extX = dBoundsW;
        this.textureShape1.extY = dBoundsH;
        const oTexture1 = this.cache.checkMorphTexture(this.textureShape1.Id, dScale, oBrush1 && oBrush1.isBlipFill());

        this.textureShape2.calcGeometry.Recalculate(dBoundsW, dBoundsH);
        this.textureShape2.brush = oBrush2;
        this.textureShape2.pen = AscFormat.CreateNoFillLine();
        this.textureShape2.bounds.reset(0, 0, dBoundsW, dBoundsH);
        this.textureShape2.extX = dBoundsW;
        this.textureShape2.extY = dBoundsH;
        const oTexture2 = this.cache.checkMorphTexture(this.textureShape2.Id, dScale, oBrush2 && oBrush2.isBlipFill());

        oBrush = new AscFormat.CreateBlipFillUniFillFromUrl("");
        oBrush.IsTransitionTextures = true;
        oBrush.alpha1 = 1 - this.relTime;
        oBrush.alpha2 = this.relTime;
        oBrush.canvas1 = oTexture1.canvas;
        oBrush.canvas2 = oTexture2.canvas;
    }
    return oBrush;
};
CGeometryMorphObject.prototype.morphPen = function(oPen1, oPen2) {
    const  oResultPen1 = oPen1 ? oPen1 : AscFormat.CreateNoFillLine();
    const  oResultPen2 = oPen2 ? oPen2 : AscFormat.CreateNoFillLine();
    const oComparePen = oResultPen1.compare(oResultPen2);
    const oPen = new AscFormat.CLn();
    const isN = AscFormat.isRealNumber;
    const nW1 = isN(oResultPen1.w) ? oResultPen1.w : 12700;
    const nW2 = isN(oResultPen2.w) ? oResultPen2.w : 12700;
    const nW = (this.getValBetween(nW1, nW2) + 0.5) >> 0;
    oPen.w = nW;
    oPen.Fill = this.morphBrush(oResultPen1.Fill, oResultPen2.Fill, 1.0);
    oPen.prstDash = oComparePen.prstDash;
    oPen.Join = oComparePen.Join;
    oPen.headEnd = oComparePen.headEnd;
    oPen.tailEnd = oComparePen.tailEnd;
    oPen.algn = oComparePen.algn;
    oPen.cap = oComparePen.cap;
    oPen.cmpd = oComparePen.cmpd;
    return oPen;
};
CGeometryMorphObject.prototype.draw = function(oGraphics) {
    if(!this.isValid()) {
        return;
    }
    const dScale = oGraphics.m_oCoordTransform.sx;
    this.drawObject.brush = this.morphBrush(this.brush1, this.brush2, dScale);
    this.drawObject.pen = this.morphPen(this.pen1, this.pen2);
    this.drawObject.draw(oGraphics);
};
CGeometryMorphObject.prototype.isValid = function() {
    return !!this.geometry;
};


function CGeometryTextureMorph(oTexturesCache, nRelH1, nRelH2,
                               oGeometry1, oBrush1, oPen1, oTransform1,
                               oGeometry2, oBrush2, oPen2, oTransform2) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2);
    this.shape1 = this.createShape(oGeometry1, oBrush1, oPen1, oTransform1);
    this.shape2 = this.createShape(oGeometry2, oBrush2, oPen2, oTransform2);
}

AscFormat.InitClassWithoutType(CGeometryTextureMorph, CMorphObjectBase);
CGeometryTextureMorph.prototype.createShape = function (oGeometry, oBrush, oPen, oTransform) {
    return AscFormat.ExecuteNoHistory(function() {
        AscCommon.g_oTableId.TurnOn();
        const oShape = new AscFormat.CShape();
        AscCommon.g_oTableId.TurnOff();
        oShape.checkEmptySpPrAndXfrm(null);
        oShape.calcGeometry = oGeometry;
        oShape.spPr.geometry = oGeometry;
        oShape.brush = oBrush;
        oShape.pen = oPen;
        oShape.localTransform = oTransform;
        oShape.transform = oTransform;
        oShape.recalculateBounds();
        return oShape;
    }, this, []);
};
CGeometryTextureMorph.prototype.draw = function (oGraphics) {
    const dScale = oGraphics.m_oCoordTransform.sx;
    const oTexture1 = this.cache.checkMorphTexture(this.shape1.GetId(), dScale);
    const oTexture2 = this.cache.checkMorphTexture(this.shape2.GetId(), dScale);
    const oBounds1 = this.shape1.bounds;
    const oBounds2 = this.shape2.bounds;
    const oCenter1 = oBounds1.getCenter();
    const oCenter2 = oBounds2.getCenter();
    const dW = this.getValBetween(oBounds1.w, oBounds2.w);
    const dH = this.getValBetween(oBounds1.h, oBounds2.h);
    const dXC = this.getValBetween(oCenter1.x, oCenter2.x);
    const dYC = this.getValBetween(oCenter1.y, oCenter2.y);
    const dX = dXC - dW / 2;
    const dY = dYC - dH / 2;
    const dAlpha1 = 1 - this.relTime;
    const dAlpha2 = this.relTime;
    const oT = oGraphics.m_oCoordTransform;
    const nX = (oT.tx + dX * dScale + 0.5) >> 0;
    const nY = (oT.ty + dY * dScale + 0.5) >> 0;
    const nW = dW * dScale + 0.5 >> 0;
    const nH = dH * dScale + 0.5 >> 0;
    oTexture1.drawInRect(oGraphics, dAlpha1, nX, nY, nW, nH);
    oTexture2.drawInRect(oGraphics, dAlpha2, nX, nY, nW, nH);
};

function CContentMorphObject(oTexturesCache, nRelH1, nRelH2,
                             oContent1, oTransform1,
                             oContent2, oTransform2) {
    CComplexMorphObject.call(this, oTexturesCache, nRelH1, nRelH2);
    this.content1 = oContent1;
    this.content2 = oContent2;
    this.transform1 = oTransform1;
    this.transform2 = oTransform2;

    const isN = AscFormat.isRealNumber;

    let oTextDrawer1, oTextDrawer2;
    let oDrawWrapper1, oDrawWrapper2;
    let oDocStruct1, oDocStruct2;
    if(oContent1) {
        oTextDrawer1 = new AscFormat.CTextDrawer(oContent1.XLimit, oContent1.YLimit, false, oContent1.Get_Theme(), true);
        oContent1.Draw(oContent1.StartPage, oTextDrawer1);
        oDocStruct1 = oTextDrawer1.m_oDocContentStructure;
        oDrawWrapper1 = new CTextDrawerStructureWrapper(oDocStruct1, oTransform1, oContent1.Get_Theme(), oContent1.Get_ColorMap());
    }
    if(oContent2) {
        oTextDrawer2 = new AscFormat.CTextDrawer(oContent2.XLimit, oContent2.YLimit, false, oContent2.Get_Theme(), true);
        oContent2.Draw(oContent2.StartPage, oTextDrawer2);
        oDocStruct2 = oTextDrawer2.m_oDocContentStructure;
        oDrawWrapper2 = new CTextDrawerStructureWrapper(oDocStruct2, oTransform2, oContent2.Get_Theme(), oContent2.Get_ColorMap());
    }
    if(oDrawWrapper1 && !oDrawWrapper2) {
        this.addMorphObject(new CMorphedDisappearObject(oTexturesCache, oDrawWrapper1, nRelH1));
    }
    else if(!oDrawWrapper1 && oDrawWrapper2) {
        this.addMorphObject(new CMorphedAppearObject(oTexturesCache, oDrawWrapper2, nRelH2));
    }
    else if(oDrawWrapper1 && oDrawWrapper2) {

        const aParStructs1 = oDocStruct1.getParagraphStructures();
        const aParStructs2 = oDocStruct2.getParagraphStructures();
        let bTexture = true;
        if(aParStructs1.length === aParStructs2.length) {
            let nPar;
            for(nPar = 0; nPar < aParStructs1.length; ++nPar) {
                let oParStruct1 = aParStructs1[nPar];
                let oParStruct2 = aParStructs2[nPar];
                let aTextStructs1 = oParStruct1.getTextStructures();
                let aTextStructs2 = oParStruct2.getTextStructures();
                if(aTextStructs1.length !== aTextStructs2.length) {
                    break;
                }
                let nText;
                for(nText = 0; nText < aTextStructs1.length; ++nText) {
                    let oTextStruct1 = aTextStructs1[nText];
                    let oTextStruct2 = aTextStructs2[nText];
                    if(!isN(oTextStruct1.Code) || oTextStruct1.Code !== oTextStruct2.Code) {
                        break;
                    }
                }
                if(nText < aTextStructs1.length) {
                    break;
                }
            }
            if(nPar === aParStructs1.length) {
                bTexture = false;


                for(nPar = 0; nPar < aParStructs1.length; ++nPar) {
                    let oParStruct1 = aParStructs1[nPar];
                    let oParStruct2 = aParStructs2[nPar];
                    let aTextStructs1 = oParStruct1.getTextStructures();
                    let aTextStructs2 = oParStruct2.getTextStructures();
                    if(aTextStructs1.length !== aTextStructs2.length) {
                        break;
                    }
                    let nText;
                    for(nText = 0; nText < aTextStructs1.length; ++nText) {
                        let oTextStruct1 = aTextStructs1[nText];
                        let oTextStruct2 = aTextStructs2[nText];
                        if(oTextStruct1.Code === oTextStruct2.Code) {
                            let oGeomMorph = new CGeometryMorphObject(oTexturesCache, nRelH1, nRelH2,
                                oTextStruct1.geometry, oTextStruct1.brush, oTextStruct1.pen, oTransform1,
                                oTextStruct2.geometry, oTextStruct2.brush, oTextStruct2.pen, oTransform2);
                            if(oGeomMorph.isValid()) {
                                this.addMorphObject(oGeomMorph);
                            }
                            else {
                                let oWrapper1 = new CObjectForDrawWrapper(oTextStruct1, oTransform1, oContent1.Get_Theme(), oContent1.Get_ColorMap());
                                let oWrapper2 = new CObjectForDrawWrapper(oTextStruct2, oTransform2, oContent2.Get_Theme(), oContent2.Get_ColorMap());
                                this.addMorphObject(new CStretchTextureTransform(oTexturesCache, nRelH1, nRelH2, oWrapper1, oWrapper2));
                            }
                        }
                    }
                }
            }
        }
        if(bTexture) {
            this.addMorphObject(new COrigSizeTextureTransform(oTexturesCache, nRelH1, nRelH2, oDrawWrapper1, oDrawWrapper2));
        }
    }
}
AscFormat.InitClassWithoutType(CContentMorphObject, CComplexMorphObject);

function CSlideMorphEffect(oSlide1, oSlide2, nType) {
	this.slide1 = oSlide1;
	this.slide2 = oSlide2;
	this.type = c_oAscSlideTransitionParams.Morph_Objects;
    if(AscFormat.isRealNumber(nType)) {
        this.type = nType;
    }
	this.texturesCache = new AscCommon.CTexturesCache();
	this.morphObjects = [];
	this.init();
}
CSlideMorphEffect.prototype.draw = function(oCanvas, oRect, dTime) {
	if(!this.slide1 || !this.slide2) {
		return;
	}
    let wPix = oRect.w;
    let hPix = oRect.h;
    let wMM = this.slide1.Width;
    let hMM = this.slide1.Height;
    let oGraphics = new AscCommon.CGraphics();
    let oCtx = oCanvas.getContext('2d');

    oCtx.clearRect(oRect.x, oRect.y, oRect.w, oRect.h);
    oGraphics.init(oCtx, wPix, hPix, wMM, hMM);
    oGraphics.m_oCoordTransform.tx = oRect.x;
    oGraphics.m_oCoordTransform.ty = oRect.y;
    oGraphics.m_oFontManager = AscCommon.g_fontManager;
    oGraphics.transform(1, 0, 0, 1, 0, 0);
    oGraphics.IsNoDrawingEmptyPlaceholder = true;
    oGraphics.IsDemonstrationMode = true;
    DrawBackground(oGraphics, AscFormat.CreateSolidFillRGBA(255, 255, 255, 255), wMM, hMM);
    for(let nIdx = 0; nIdx < this.morphObjects.length; ++nIdx) {
        this.morphObjects[nIdx].draw(oGraphics);
    }
};
CSlideMorphEffect.prototype.init = function() {
	if(!this.slide1 || !this.slide2) {
		return;
	}
    AscFormat.ExecuteNoHistory(function() {
        switch(this.type) {
            case c_oAscSlideTransitionParams.Morph_Objects: {
                this.generateObjectBasedMorphs();
                break;
            }
            case c_oAscSlideTransitionParams.Morph_Words: {
                this.generateWordBasedMorphs();
                break;
            }
            case c_oAscSlideTransitionParams.Morph_Letters: {
                this.generateLetterBasedMorphs();
                break;
            }
        }
    }, this, []);
};
CSlideMorphEffect.prototype.pushMorphObject = function (oMorph) {
    this.morphObjects.push(oMorph);
};
CSlideMorphEffect.prototype.addShapeMorphs = function (oShape1, nRelH1, oShape2, nRelH2, bNoText) {
    this.pushMorphObject(new CShapeComplexMorph(this.texturesCache, nRelH1, nRelH2, oShape1, oShape2, bNoText));
};
CSlideMorphEffect.prototype.addTableMorphs = function (oGrFrame1, nRelH1, oGrFrame2, nRelH2) {
    this.pushMorphObject(new CTableComplexMorph(this.texturesCache, nRelH1, nRelH2, oGrFrame1, oGrFrame2));
};
CSlideMorphEffect.prototype.addObjectMorphs = function(oDrawing1, nRelH1, oDrawing2, nRelH2, bNoText) {
    if(!oDrawing1 || !oDrawing2) {
        return;
    }
    const nType1 = oDrawing1.getObjectType();
    const nType2 = oDrawing2.getObjectType();
    if(nType1 !== nType2) {
        return;
    }
    switch (nType1) {
        case AscDFH.historyitem_type_Shape: {
            this.addShapeMorphs(oDrawing1, nRelH1, oDrawing2, nRelH2, bNoText)
            break;
        }
        case AscDFH.historyitem_type_GraphicFrame: {
            this.addTableMorphs(oDrawing1, nRelH1, oDrawing2, nRelH2);
            break;
        }
        default: {
            this.pushMorphObject(new CStretchTextureTransform(this.texturesCache, nRelH1, nRelH2, oDrawing1, oDrawing2));
            break;
        }
    }
};
CSlideMorphEffect.prototype.generateObjectBasedMorphs = function() {
	//match objects
    this.pushMorphObject(new COrigSizeTextureTransform(this.texturesCache, -2, -1, new CBackgroundWrapper(this.slide1), new CBackgroundWrapper(this.slide2)));
	const aDrawings1 = this.slide1.getDrawingObjects();
	const aDrawings2 = this.slide2.getDrawingObjects();
	const nDrawingsCount1 = aDrawings1.length;
	const nDrawingsCount2 = aDrawings2.length;
    const oMapPaired = {};
	for(let nDrawing1 = 0; nDrawing1 < nDrawingsCount1; ++nDrawing1) {
		let oDrawing1 = aDrawings1[nDrawing1];
        let oPairedDrawing = null;
        let nParedRelH = null;
        for(let nDrawing2 = 0; nDrawing2 < nDrawingsCount2; ++nDrawing2) {
            let oDrawing2 = aDrawings2[nDrawing2];
            if(!oMapPaired[oDrawing2.Id]) {
                oPairedDrawing = oDrawing1.compareForMorph(oDrawing2, oPairedDrawing);
                if(oDrawing2 === oPairedDrawing) {
                    nParedRelH = nDrawing2;
                }
            }
        }
        if(oPairedDrawing) {
            oMapPaired[oPairedDrawing.Id] = true;
            this.addObjectMorphs(oDrawing1, nDrawing1, oPairedDrawing, nParedRelH);
        }
        else {
            this.pushMorphObject(new CMorphedDisappearObject(this.texturesCache, oDrawing1, nDrawing1));
        }
	}
    for(let nDrawing2 = 0; nDrawing2 < nDrawingsCount2; ++nDrawing2) {
        let oDrawing2 = aDrawings2[nDrawing2];
        if(!oMapPaired[oDrawing2.Id]) {
            this.pushMorphObject(new CMorphedAppearObject(this.texturesCache, oDrawing2, nDrawing2));
        }
    }
};
CSlideMorphEffect.prototype.generateWordBasedMorphs = function() {
    this.generateTextBasedMorph(false);
};
CSlideMorphEffect.prototype.generateLetterBasedMorphs = function() {
	this.generateTextBasedMorph(true);
};

CSlideMorphEffect.prototype.generateTextBasedMorph = function(bLetter) {
    this.pushMorphObject(new COrigSizeTextureTransform(this.texturesCache, -2, -1, new CBackgroundWrapper(this.slide1), new CBackgroundWrapper(this.slide2)));

    const aDrawings1 = this.slide1.getDrawingObjects();
    const aDrawings2 = this.slide2.getDrawingObjects();
    const aMorphedDrawings1 = this.createMatchArray(aDrawings1, bLetter);
    const aMorphedDrawings2 = this.createMatchArray(aDrawings2, bLetter);

    const oCompareResult = compareDrawings(aMorphedDrawings1, aMorphedDrawings2);
    const aBaseNode = oCompareResult[0].children;
    const aCompareNode = oCompareResult[1].children;
    const aSecondBase = [];
    const aSecondCompare = [];
    for(let nIdx = 0; nIdx < aBaseNode.length; ++nIdx) {
        let oBaseNode = aBaseNode[nIdx];
        let oPartner = oBaseNode.partner;
        if(oBaseNode.partner) {
            this.addObjectMorphs(oBaseNode.element, oBaseNode.idx, oPartner.element, oPartner.idx, true);
        }
        else {
            aSecondBase.push(oBaseNode);
        }
    }
    for(let nIdx = 0; nIdx < aCompareNode.length; ++nIdx) {
        let oNode = aCompareNode[nIdx];
        if(!oNode.partner) {
            aSecondCompare.push(oNode);
        }
    }
    const oSecondCompareResult = compareDrawings(aSecondBase, aSecondCompare);
    const aSecondBaseNode = oSecondCompareResult[0].children;
    const aSecondCompareNode = oSecondCompareResult[1].children;
    for(let nIdx = 0; nIdx < aSecondBaseNode.length; ++nIdx) {
        let oBaseNode = aSecondBaseNode[nIdx];
        let oPartner = oBaseNode.partner;
        if(oBaseNode.partner) {
            this.addObjectMorphs(oBaseNode.element, oBaseNode.idx, oPartner.element, oPartner.idx, true);
        }
        else {
            this.pushMorphObject(new CMorphedDisappearObject(this.texturesCache, oBaseNode.element, oBaseNode.idx, true));
        }
    }
    for(let nIdx = 0; nIdx < aSecondCompareNode.length; ++nIdx) {
        let oNode = aSecondCompareNode[nIdx];
        if(!oNode.partner) {
            this.pushMorphObject(new CMorphedAppearObject(this.texturesCache, oNode.element, oNode.idx, true));
        }
    }

};
CSlideMorphEffect.prototype.createMatchArray = function(aDrawings, bLetter) {
    let aRet = [];
    for(let nSp = 0; nSp < aDrawings.length; ++nSp) {
        const oSp = aDrawings[nSp];
        let nType = oSp.getObjectType();
        switch (nType) {
            case AscDFH.historyitem_type_Shape: {
                aRet.push(oSp);
                let oDocContent = oSp.getDocContent();
                if(oDocContent) {
                    const oTextDrawer = new AscFormat.CTextDrawer(oDocContent.XLimit, oDocContent.YLimit, false, oDocContent.Get_Theme(), true);
                    oDocContent.Draw(oDocContent.StartPage, oTextDrawer);
                    const oDocStruct = oTextDrawer.m_oDocContentStructure;
                    let nIdx;
                    let oTheme = oDocContent.Get_Theme();
                    let oColorMap = oDocContent.Get_ColorMap();
                    let oTransform = oSp.transformText;
                    let oObjectForDraw;
                    for(nIdx = 0; nIdx < oDocStruct.m_aParagraphBackgrounds.length; ++nIdx)
                    {
                        oObjectForDraw = oDocStruct.m_aParagraphBackgrounds[nIdx];
                        aRet.push(new CObjectForDrawWrapper(oObjectForDraw, oTransform, oTheme, oColorMap));
                    }
                    for(nIdx = 0;nIdx< oDocStruct.m_aBorders.length; ++nIdx)
                    {
                        oObjectForDraw = oDocStruct.m_aBorders[nIdx];
                        aRet.push(new CObjectForDrawWrapper(oObjectForDraw, oTransform, oTheme, oColorMap));
                    }
                    for(nIdx = 0; nIdx < oDocStruct.m_aBackgrounds.length; ++nIdx)
                    {
                        oObjectForDraw = oDocStruct.m_aBackgrounds[nIdx];
                        aRet.push(new CObjectForDrawWrapper(oObjectForDraw, oTransform, oTheme, oColorMap));
                    }

                    for(nIdx = 0; nIdx < oDocStruct.m_aContent.length; ++nIdx) {
                        let oPara = oDocStruct.m_aContent[nIdx];
                        let aWords = oPara.m_aWords;
                        for(let nWord = 0; nWord < aWords.length; ++nWord) {
                            let aWord = aWords[nWord];
                            if(bLetter) {
                                for(let nLetter = 0; nLetter < aWord.length; ++nLetter) {
                                    aRet.push( new CObjectForDrawWrapper(aWord[nLetter], oTransform, oTheme, oColorMap));
                                }
                            }
                            else {
                                aRet.push( new CObjectForDrawArrayWrapper(aWord, oTransform, oTheme, oColorMap));
                            }
                        }
                    }
                }
                break;
            }
            default: {
                aRet.push(oSp);
                break;
            }
        }
    }
    return aRet;
};
CSlideMorphEffect.prototype.morph = function(dTime) {
    for(let nIdx = 0; nIdx < this.morphObjects.length; ++nIdx) {
        this.morphObjects[nIdx].morph(dTime);
    }
    this.morphObjects.sort(function (a, b) {
        return a.relHeight - b.relativeHeight;
    });
};





function CDrawingNode(element, par, idx) {
    this.element = element;
    this.partner = null;
    this.par = par;
    this.idx = idx || 0;
    if(Array.isArray(element)) {
        this.children = [];
        for(let nIdx = 0; nIdx < element.length; ++nIdx) {
            let oElement = element[nIdx];
            if(oElement instanceof CDrawingNode) {
                oElement.par = this;
                this.children.push(oElement);
            }
            else {
                this.children.push(new CDrawingNode(oElement, this, nIdx));
            }
        }

    }
}
CDrawingNode.prototype.children = [];
CDrawingNode.prototype.equals = function(oNode) {
    if(!Array.isArray(this.element)) {
        return this.element.compareForMorph(oNode.element, null) === oNode.element;
    }
    return this.element === oNode.element;
};
CDrawingNode.prototype.forEachDescendant = function(callback, T) {
    this.children.forEach(function(node) {
        node.forEach(callback, T);
    });
};
CDrawingNode.prototype.forEach = function(callback, T) {
    callback.call(T, this);
    this.children.forEach(function(node) {
        node.forEach(callback, T);
    });
};

function CDiffMatching() {
}
CDiffMatching.prototype.get = function(oNode) {
    return oNode.partner;
};
CDiffMatching.prototype.put = function(oNode1, oNode2) {
    oNode1.partner = oNode2;
    oNode2.partner = oNode1;
};
function CDiffChange(oOperation) {
    this.pos = -1;
    this.deleteCount = 0;
    this.insert = [];

    var oAnchor = oOperation.anchor;
    this.pos = oAnchor.index;
    if(Array.isArray(oOperation.remove)) {
        this.deleteCount = oOperation.remove.length;
    }
    var nIndex, oNode;
    if(Array.isArray(oOperation.insert)) {
        for(nIndex = 0; nIndex < oOperation.insert.length; ++nIndex) {
            oNode = oOperation.insert[nIndex];
            this.insert.push(oNode.element);
        }
    }
}
CDiffChange.prototype.getPos = function() {
    return this.pos;
};
CDiffChange.prototype.getDeleteCount = function() {
    return this.deleteCount;
};
CDiffChange.prototype.getInsertSymbols = function() {
    return this.insert;
};
function compareDrawings(aDrawings1, aDrawings2) {
    let aDelta = [];
    let oBaseNode = new CDrawingNode(aDrawings1, null);
    let oReplaceNode = new CDrawingNode(aDrawings2, null);
    let oMatching = new CDiffMatching();
    oMatching.put(oBaseNode, oReplaceNode);
    let oDiff  = new AscCommon.Diff(oBaseNode, oReplaceNode);
    oDiff.equals = function(a, b)
    {
        return a.equals(b);
    };
    oDiff.matchTrees(oMatching);
    var oDeltaCollector = new AscCommon.DeltaCollector(oMatching, oBaseNode, oReplaceNode);
    oDeltaCollector.forEachChange(function(oOperation){
        aDelta.push(new CDiffChange(oOperation));
    });
    return [oBaseNode, oReplaceNode, aDelta];
}



function CMorphedFadeObject(oTexturesCache, oDrawing, nRelH, bNoText) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH, null);
    this.drawing = oDrawing;
    this.bNoText = bNoText;
}
AscFormat.InitClassWithoutType(CMorphedFadeObject, CMorphObjectBase);
CMorphedFadeObject.prototype.morph = function(dRelTime) {
    CMorphObjectBase.prototype.morph.call(this, dRelTime);
};
CMorphedFadeObject.prototype.drawWithAlpha = function(oGraphics, dAlpha) {
    const dScale = oGraphics.m_oCoordTransform.sx;
    const oOldTxBody = this.drawing.txBody;
    if(this.bNoText) {
        this.drawing.txBody = null;
    }
    const oTexture = this.cache.checkMorphTexture(this.drawing.GetId(), dScale);
    if(this.bNoText) {
        this.drawing.txBody = oOldTxBody;
    }
    if(!oTexture) {
        return;
    }
    const oFadeTexture = oTexture.createFadeIn(dAlpha);
    if(!oFadeTexture) {
        return;
    }
    oFadeTexture.draw(oGraphics, null);
};

function CMorphedAppearObject(oTexturesCache, oDrawing, nRelH, bNoText) {
    CMorphedFadeObject.call(this, oTexturesCache, oDrawing, nRelH, bNoText)
}
AscFormat.InitClassWithoutType(CMorphedAppearObject, CMorphedFadeObject);
CMorphedAppearObject.prototype.draw = function(oGraphics) {
    let dAlpha;
    if(this.relTime < 0.5) {
        dAlpha = 0.0;
    }
    else {
        dAlpha = 2 * this.relTime - 1.0;
    }
    this.drawWithAlpha(oGraphics, dAlpha);
};
function CMorphedDisappearObject(oTexturesCache, oDrawing, nRelH, bNoText) {
    CMorphedFadeObject.call(this, oTexturesCache, oDrawing, nRelH, bNoText)
}
AscFormat.InitClassWithoutType(CMorphedDisappearObject, CMorphedFadeObject);
CMorphedDisappearObject.prototype.draw = function(oGraphics) {
    let dAlpha;
    if(this.relTime < 0.5) {
        dAlpha = 1.0 - 2 * this.relTime;
    }
    else {
        dAlpha = 0.0;
    }
    this.drawWithAlpha(oGraphics, dAlpha);
};


function CStretchTextureTransform(oTexturesCache, nRelH1, nRelH2, oDrawing1, oDrawing2, bNoText) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2)
    this.drawing1 = oDrawing1;
    this.drawing2 = oDrawing2;
    this.bNoText = !!bNoText;
}
AscFormat.InitClassWithoutType(CStretchTextureTransform, CMorphObjectBase);
CStretchTextureTransform.prototype.draw = function(oGraphics) {
    const dScale = oGraphics.m_oCoordTransform.sx;
    let oOldTxBody1 = this.drawing1.txBody;
    let oOldTxBody2 = this.drawing2.txBody;
    if(this.bNoText) {
        this.drawing1.txBody = null;
        this.drawing2.txBody = null;
    }
    const oTexture1 = this.cache.checkMorphTexture(this.drawing1.GetId(), dScale);
    const oTexture2 = this.cache.checkMorphTexture(this.drawing2.GetId(), dScale);
    if(this.bNoText) {
        this.drawing1.txBody = oOldTxBody1;
        this.drawing2.txBody = oOldTxBody2;
    }
    const oBounds1 = this.drawing1.bounds;
    const oBounds2 = this.drawing2.bounds;
    const oCenter1 = oBounds1.getCenter();
    const oCenter2 = oBounds2.getCenter();
    const dW = this.getValBetween(oBounds1.w, oBounds2.w);
    const dH = this.getValBetween(oBounds1.h, oBounds2.h);
    const dXC = this.getValBetween(oCenter1.x, oCenter2.x);
    const dYC = this.getValBetween(oCenter1.y, oCenter2.y);
    const dX = dXC - dW / 2;
    const dY = dYC - dH / 2;
    const dAlpha1 = 1 - this.relTime;
    const dAlpha2 = this.relTime;
    const oT = oGraphics.m_oCoordTransform;
    const nX = (oT.tx + dX * dScale + 0.5) >> 0;
    const nY = (oT.ty + dY * dScale + 0.5) >> 0;
    const nW = dW * dScale + 0.5 >> 0;
    const nH = dH * dScale + 0.5 >> 0;
    oTexture1.drawInRect(oGraphics, dAlpha1, nX, nY, nW, nH);
    oTexture2.drawInRect(oGraphics, dAlpha2, nX, nY, nW, nH);
};

function COrigSizeTextureTransform(oTexturesCache, nRelH1, nRelH2, oDrawing1, oDrawing2) {
    CMorphObjectBase.call(this, oTexturesCache, nRelH1, nRelH2)
    this.drawing1 = oDrawing1;
    this.drawing2 = oDrawing2;
}
AscFormat.InitClassWithoutType(COrigSizeTextureTransform, CMorphObjectBase);
COrigSizeTextureTransform.prototype.draw = function(oGraphics) {
    const dScale = oGraphics.m_oCoordTransform.sx;
    const oTexture1 = this.cache.checkMorphTexture(this.drawing1.GetId(), dScale);
    const oTexture2 = this.cache.checkMorphTexture(this.drawing2.GetId(), dScale);
    const oBounds1 = this.drawing1.bounds;
    const oBounds2 = this.drawing2.bounds;
    const oCenter1 = oBounds1.getCenter();
    const oCenter2 = oBounds2.getCenter();
    const dXC = this.getValBetween(oCenter1.x, oCenter2.x);
    const dYC = this.getValBetween(oCenter1.y, oCenter2.y);
    const dW1 = oBounds1.w;
    const dH1 = oBounds1.h;
    const dW2 = oBounds2.w;
    const dH2 = oBounds2.h;
    const dX1 = dXC - dW1 / 2;
    const dY1 = dYC - dH1 / 2;
    const dX2 = dXC - dW2 / 2;
    const dY2 = dYC - dH2 / 2;
    const dAlpha1 = 1 - this.relTime;
    const dAlpha2 = this.relTime;
    const oT = oGraphics.m_oCoordTransform;
    const nX1 = (oT.tx + dX1 * dScale + 0.5) >> 0;
    const nY1 = (oT.ty + dY1 * dScale + 0.5) >> 0;
    const nX2 = (oT.tx + dX2 * dScale + 0.5) >> 0;
    const nY2 = (oT.ty + dY2 * dScale + 0.5) >> 0;
    const nW1 = oTexture1.getWidth();
    const nH1 = oTexture1.getHeight();
    const nW2 = oTexture2.getWidth();
    const nH2 = oTexture2.getHeight();
    oTexture1.drawInRect(oGraphics, dAlpha1, nX1, nY1, nW1, nH1);
    oTexture2.drawInRect(oGraphics, dAlpha2, nX2, nY2, nW2, nH2);
};


function CTextDrawerStructureWrapper(oTextDrawerStructure, oTransform, oTheme, oColorMap) {
    this.textDrawerStructure = oTextDrawerStructure;
    this.theme = oTheme;
    this.colorMap = oColorMap;
    this.transform = oTransform;
    this.bounds = new AscFormat.CGraphicBounds(0, 0, 0, 0);
    this.init();
    AscFormat.ExecuteNoHistory(function() {
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.TurnOn();
        AscCommon.g_oTableId.Add(this, this.Id);
        AscCommon.g_oTableId.TurnOff();
    }, this, []);
}
CTextDrawerStructureWrapper.prototype.GetId = function() {
    return this.Id;
};
CTextDrawerStructureWrapper.prototype.init = function() {
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.draw(oBoundsChecker);
    const oBounds = oBoundsChecker.Bounds;
    this.bounds.reset(oBounds.min_x, oBounds.min_y, oBounds.max_x, oBounds.max_y);
};
CTextDrawerStructureWrapper.prototype.draw = function(oGraphics) {
    this.textDrawerStructure.draw(oGraphics, this.transform, this.theme, this.colorMap);
};
CTextDrawerStructureWrapper.prototype.getAnimTexture = function (scale, bMorph) {
    return AscFormat.CGraphicObjectBase.prototype.getAnimTexture.call(this, scale, bMorph);
};
CTextDrawerStructureWrapper.prototype.getBoundsByDrawing = function (bMorph) {
    return this.bounds;
};
CTextDrawerStructureWrapper.prototype.compareForMorph = function(oDrawingToCheck, oCurCandidate) {
    return oCurCandidate;
};
CTextDrawerStructureWrapper.prototype.isShape = function () {
    return false;
};
CTextDrawerStructureWrapper.prototype.getObjectType = function () {
    return null;
};

function CObjectForDrawWrapper(oObjectForDraw, oTransform, oTheme, oColorMap) {
    this.objectForDraw = oObjectForDraw;
    this.theme = oTheme;
    this.colorMap = oColorMap;
    this.transform = oTransform;
    this.bounds = new AscFormat.CGraphicBounds(0, 0, 0, 0);
    this.init();
    AscFormat.ExecuteNoHistory(function() {
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.TurnOn();
        AscCommon.g_oTableId.Add(this, this.Id);
        AscCommon.g_oTableId.TurnOff();
    }, this, []);
}
CObjectForDrawWrapper.prototype.GetId = function() {
    return this.Id;
};
CObjectForDrawWrapper.prototype.init = function() {
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.draw(oBoundsChecker);
    const oBounds = oBoundsChecker.Bounds;
    this.bounds.reset(oBounds.min_x, oBounds.min_y, oBounds.max_x, oBounds.max_y);
};
CObjectForDrawWrapper.prototype.draw = function(oGraphics) {
    this.objectForDraw.draw(oGraphics, undefined, this.transform, this.theme, this.colorMap);
};
CObjectForDrawWrapper.prototype.getAnimTexture = function (scale, bMorph) {
    return AscFormat.CGraphicObjectBase.prototype.getAnimTexture.call(this, scale, bMorph);
};
CObjectForDrawWrapper.prototype.getBoundsByDrawing = function (bMorph) {
    return this.bounds;
};
CObjectForDrawWrapper.prototype.compareForMorph = function(oDrawingToCheck, oCurCandidate) {
    if(!(oDrawingToCheck instanceof CObjectForDrawWrapper)) {
        return oCurCandidate;
    }
    if(this.objectForDraw.compareForMorph(oDrawingToCheck.objectForDraw) !== oDrawingToCheck.objectForDraw) {
        return oCurCandidate;
    }
    return oDrawingToCheck;
};
CObjectForDrawWrapper.prototype.isShape = function () {
    return false;
};
CObjectForDrawWrapper.prototype.getObjectType = function () {
    return null;
};

function CObjectForDrawArrayWrapper(aObjectForDraw, oTransform, oTheme, oColorMap) {
    this.objectsForDraw = aObjectForDraw;
    this.theme = oTheme;
    this.colorMap = oColorMap;
    this.transform = oTransform;
    this.bounds = new AscFormat.CGraphicBounds(0, 0, 0, 0);
    this.init();
    AscFormat.ExecuteNoHistory(function() {
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.TurnOn();
        AscCommon.g_oTableId.Add(this, this.Id);
        AscCommon.g_oTableId.TurnOff();
    }, this, []);
}
CObjectForDrawArrayWrapper.prototype.GetId = function() {
    return this.Id;
};
CObjectForDrawArrayWrapper.prototype.init = function() {
    var oBoundsChecker = new AscFormat.CSlideBoundsChecker();
    this.draw(oBoundsChecker);
    const oBounds = oBoundsChecker.Bounds;
    this.bounds.reset(oBounds.min_x, oBounds.min_y, oBounds.max_x, oBounds.max_y);
};
CObjectForDrawArrayWrapper.prototype.draw = function(oGraphics) {
    for(let nIdx = 0; nIdx < this.objectsForDraw.length; ++nIdx) {
        this.objectsForDraw[nIdx].draw(oGraphics, undefined, this.transform, this.theme, this.colorMap);
    }
};
CObjectForDrawArrayWrapper.prototype.getAnimTexture = function (scale, bMorph) {
    return AscFormat.CGraphicObjectBase.prototype.getAnimTexture.call(this, scale, bMorph);
};
CObjectForDrawArrayWrapper.prototype.getBoundsByDrawing = function (bMorph) {
    return this.bounds;
};
CObjectForDrawArrayWrapper.prototype.compareForMorph = function(oDrawingToCheck, oCurCandidate) {
    if(!(oDrawingToCheck instanceof CObjectForDrawArrayWrapper)) {
        return oCurCandidate;
    }
    if(oDrawingToCheck.objectsForDraw.length !== this.objectsForDraw.length) {
        return oCurCandidate;
    }
    for(let nIdx = 0; nIdx < oDrawingToCheck.objectsForDraw.length; ++nIdx) {
        let oToCheck = oDrawingToCheck.objectsForDraw[nIdx];
        if(oToCheck !== this.objectsForDraw[nIdx].compareForMorph(oToCheck, null)) {
            return oCurCandidate;
        }
    }
    return oDrawingToCheck;
};
CObjectForDrawArrayWrapper.prototype.isShape = function () {
    return false;
};
CObjectForDrawArrayWrapper.prototype.getObjectType = function () {
    return null;
};

function CBackgroundWrapper(oSlide) {
    this.slide = oSlide;
    this.bounds = new AscFormat.CGraphicBounds(0, 0, oSlide.Width, oSlide.Height);
    AscFormat.ExecuteNoHistory(function() {
        this.Id = AscCommon.g_oIdCounter.Get_NewId();
        AscCommon.g_oTableId.TurnOn();
        AscCommon.g_oTableId.Add(this, this.Id);
        AscCommon.g_oTableId.TurnOff();
    }, this, []);
}
CBackgroundWrapper.prototype.GetId = function() {
    return this.Id;
};
CBackgroundWrapper.prototype.draw = function(oGraphics) {
    oGraphics.SaveGrState();
    oGraphics.transform3(new AscCommon.CMatrix());
    this.slide.drawBgMasterAndLayout(oGraphics, true, false);
    oGraphics.RestoreGrState();
};
CBackgroundWrapper.prototype.getAnimTexture = function (scale, bMorph) {
    return AscFormat.CGraphicObjectBase.prototype.getAnimTexture.call(this, scale, bMorph);
};
CBackgroundWrapper.prototype.getBoundsByDrawing = function (bMorph) {
    return this.bounds;
};



function CTableComplexMorph(oTexturesCache, nRelH1, nRelH2, oGrFrame1, oGrFrame2) {

    CStretchTextureTransform.call(this, oTexturesCache, nRelH1, nRelH2, oGrFrame1, oGrFrame2);
    this.grFrame1 = oGrFrame1;
    this.grFrame2 = oGrFrame2;
    const oTable1 = oGrFrame1.graphicObject;
    const oTable2 = oGrFrame2.graphicObject;
}
AscFormat.InitClassWithoutType(CTableComplexMorph, CStretchTextureTransform);


function CDemonstrationManager(htmlpage)
{
    this.HtmlPage   = htmlpage;
    this.Transition = new CTransitionAnimation(htmlpage);

    this.DivWidth = 0;
    this.DivHeight = 0;

    this.MainDivId          = "";
    this.DemonstrationDiv   = null;
    this.DivEndPresentation = null;
    this.EndShowMessage     = "";

    this.SlideNum           = -1;
    this.SlidesCount        = 0;

    this.Mode      = false;
    this.Canvas    = null;
    this.Overlay   = null;

    this.SlideImage = null;

    this.IsPlayMode = true;
    this.CheckSlideDuration = -1;
    this.WaitAnimationEnd = false;
    this.Transition.DemonstrationObject = this;

    this.CacheImagesManager = new CCacheManager();
    this.SlideImages = new Array(2);
    this.SlideImages[0] = null;
    this.SlideImages[1] = null;

    this.SlideIndexes = new Array(2);
    this.SlideIndexes[0] = -1;
    this.SlideIndexes[1] = -1;

    this.waitReporterObject = null;

    this.PointerDiv = null;

    this.isMouseDown = false;
    this.StartSlideNum = -1;
    this.TmpSlideVisible = -1;
    this.LastMoveTime = null;

    var oThis = this;

    this.CacheSlide = function(slide_num, slide_index)
    {
        var _w = this.Transition.Rect.w;
        var _h = this.Transition.Rect.h;
        var _image = this.CacheImagesManager.Lock(_w, _h);
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(slide_num);
        var oPlayer = oSlide.getAnimationPlayer();
        oPlayer.drawFrame(_image.image, {x:0, y: 0, w: _w, h: _h});
        this.SlideImages[slide_index] = new CCacheSlideImage();
        this.SlideImages[slide_index].Image = _image;
        this.SlideIndexes[slide_index] = slide_num;
    };

    this.PrepareTransition = function(is_first, is_backward)
    {
        var _slide1 = -1;
        var _slide2 = -1;

        this.Transition.IsBackward = false;
        if (is_first)
        {
            _slide1 = -1;
            _slide2 = this.SlideNum;
        }
        else if (!is_backward)
        {
            _slide1 = this.GetPrevVisibleSlide(true);
            _slide2 = this.SlideNum;
        }
        else
        {
            this.Transition.IsBackward = true;
            _slide1 = this.GetPrevVisibleSlide(true);
            _slide2 = this.SlideNum;
        }

        this.Transition.CalculateRectDemonstration();

        if (this.SlideImages[0])
            this.CacheImagesManager.UnLock(this.SlideImages[0].Image);
        this.SlideImages[0] = null;
        this.SlideIndexes[0] = -1;

        if (this.SlideImages[1])
            this.CacheImagesManager.UnLock(this.SlideImages[1].Image);
        this.SlideImages[1] = null;
        this.SlideIndexes[1] = -1;
        if (_slide1 == -1)
        {
            this.Transition.CacheImage1.Image = null;
        }
        else
        {
            this.CacheSlide(_slide1, 0);
            this.Transition.CacheImage1.Image = this.SlideImages[0].Image.image;
        }
        if (_slide2 == -1)
        {
            this.Transition.CacheImage2.Image = null;
        }
        else
        {
            this.CacheSlide(_slide2, 1);
            this.Transition.CacheImage2.Image = this.SlideImages[1].Image.image;
        }
    };

    this.PrepareSlide = function()
    {
        if (this.SlideNum < 0 || this.SlideNum >= this.SlidesCount)
        {
            this.SlideImage = -1;
            return;
        }
        else
        {
            if (this.SlideNum != this.SlideIndexes[0])
            {
                if (this.SlideImages[0])
                    this.CacheImagesManager.UnLock(this.SlideImages[0].Image);
                this.SlideImages[0] = null;
                this.SlideIndexes[0] = -1;
            }
            if (this.SlideNum != this.SlideIndexes[1])
            {
                if (this.SlideImages[1])
                    this.CacheImagesManager.UnLock(this.SlideImages[1].Image);
                this.SlideImages[1] = null;
                this.SlideIndexes[1] = -1;
            }

            if (this.SlideNum == this.SlideIndexes[0])
            {
                this.SlideImage = 0;
            }
            else if (this.SlideNum == this.SlideIndexes[1])
            {
                this.SlideImage = 1;
            }
            else
            {
                this.CacheSlide(this.SlideNum, 0);
                this.SlideImage = 0;
            }
        }
    };

    this.CorrectSlideNum = function()
    {
        this.SlidesCount = this.HtmlPage.m_oDrawingDocument.SlidesCount;
        if (this.SlideNum > this.SlidesCount)
            this.SlideNum = this.SlidesCount;
    };

    this.StartWaitReporter = function(main_div_id, start_slide_num, is_play_mode)
    {
		var _parent = document.getElementById(main_div_id);
		if (_parent)
		{
			var _elem = document.createElement('div');
			_elem.setAttribute("id", "dem_id_wait_reporter");
			_elem.setAttribute("style", "line-height:100%;overflow:hidden;position:absolute;margin:0px;padding:25% 0px 0px 0px;left:0px;top:0px;width:100%;height:100%;z-index:20;background-color:#000000;text-align:center;font-family:monospace;font-size:12pt;color:#FFFFFF;");
			_elem.innerHTML = AscCommon.translateManager.getValue("Loading");
			_parent.appendChild(_elem);
		}

		this.waitReporterObject = [main_div_id, start_slide_num, is_play_mode];

		if (undefined !== window["AscDesktopEditor"])
		{
			this.HtmlPage.m_oApi.hideVideoControl();
			window["AscDesktopEditor"]["SetFullscreen"](true);
		}
    };

    this.EndWaitReporter = function(isNoStart)
    {
		var _parent = document.getElementById(this.waitReporterObject[0]);
		var _elem = document.getElementById("dem_id_wait_reporter");
		try
        {
		    _parent.removeChild(_elem);
        }
        catch (err)
        {
        }

        if (true !== isNoStart)
            this.Start(this.waitReporterObject[0], this.waitReporterObject[1], this.waitReporterObject[2], true);
        this.waitReporterObject = null;
    };

    this.Start = function(main_div_id, start_slide_num, is_play_mode, is_no_fullscreen)
    {
		this.StartSlideNum = start_slide_num;
		if (-1 == start_slide_num)
			start_slide_num = 0;

        this.SlidesCount = this.HtmlPage.m_oDrawingDocument.SlidesCount;
        this.DemonstrationDiv = document.getElementById(main_div_id);
        if (this.DemonstrationDiv == null || start_slide_num < 0 || start_slide_num >= this.SlidesCount)
            return;

        if (undefined !== window["AscDesktopEditor"] && (true !== is_no_fullscreen))
            window["AscDesktopEditor"]["SetFullscreen"](true);

        this.MainDivId = main_div_id;
        var _width  = this.DemonstrationDiv.clientWidth;
        var _height = this.DemonstrationDiv.clientHeight;

        this.DivWidth = _width;
        this.DivHeight = _height;

        this.Mode = true;
        this.Canvas = document.createElement('canvas');
        this.Canvas.setAttribute("style", "position:absolute;margin:0;padding:0;left:0px;top:0px;width:100%;height:100%;zIndex:2;background-color:#000000;");
        this.Canvas.width = AscCommon.AscBrowser.convertToRetinaValue(_width, true);
        this.Canvas.height = AscCommon.AscBrowser.convertToRetinaValue(_height, true);

        this.SlideNum = start_slide_num;

        this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);

		this.Canvas.onmousedown  = this.onMouseDown;
		this.Canvas.onmousemove  = this.onMouseMove;
        this.Canvas.onmouseup    = this.onMouseUp;
		this.Canvas.onmouseleave = this.onMouseLeave;

        this.Canvas.onmousewheel = this.onMouseWhell;
        if (this.Canvas.addEventListener)
            this.Canvas.addEventListener("DOMMouseScroll", this.onMouseWhell, false);

        this.DemonstrationDiv.appendChild(this.Canvas);
        this.IsPlayMode = true;

        if (false === is_play_mode)
            this.IsPlayMode = false;

        this.SlideIndexes[0] = -1;
        this.SlideIndexes[1] = -1;

        this.StartSlide(true, true);
    };

    this.StartSlide = function(is_transition_use, is_first_play)
    {
        oThis.HtmlPage.m_oApi.hideVideoControl();
        if (oThis.Canvas)
        {
            oThis.Canvas.style.cursor = "default";
        }

        oThis.StopTransition();

        if (oThis.SlideNum == oThis.SlidesCount)
        {
            if (null == oThis.DivEndPresentation)
            {
                oThis.DivEndPresentation = document.createElement('div');
                oThis.DivEndPresentation.setAttribute("style", "position:absolute;margin:0px;padding:0px;left:0px;top:0px;width:100%;height:100%;z-index:4;background-color:#000000;text-align:center;font-family:monospace;font-size:12pt;color:#FFFFFF;");
                oThis.DivEndPresentation.innerHTML = AscCommon.translateManager.getValue(oThis.EndShowMessage);
                if ("" == oThis.EndShowMessage)
                    oThis.DivEndPresentation.innerHTML = AscCommon.translateManager.getValue("The end of slide preview. Click to exit.");

                //oThis.DemonstrationDivEndPresentation.onmousedown  = oThis.onMouseDownDemonstration;
                //oThis.DemonstrationDivEndPresentation.onmousemove  = oThis.onMouseMoveDemonstration;
				oThis.DivEndPresentation.onmousedown  = oThis.onMouseDown;
                oThis.DivEndPresentation.onmouseup    = oThis.onMouseUp;

                oThis.DivEndPresentation.onmousewheel = oThis.onMouseWhell;
                if (oThis.DivEndPresentation.addEventListener)
                    oThis.DivEndPresentation.addEventListener("DOMMouseScroll", oThis.onMouseWhell, false);

                oThis.DemonstrationDiv.appendChild(oThis.DivEndPresentation);
            }
            return;
        }
        else if (null != oThis.DivEndPresentation)
        {
            this.DemonstrationDiv.removeChild(this.DivEndPresentation);
            this.DivEndPresentation = null;
        }

        var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
        var _transition = null;
        if (is_transition_use && _slides[oThis.SlideNum])
        {
            _transition = _slides[oThis.SlideNum].transition;

            if (_transition.TransitionType != c_oAscSlideTransitionTypes.None && _transition.TransitionDuration > 0)
            {
                oThis.StartTransition(_transition, is_first_play, false);
                return;
            }
            else
            {
                oThis.StartAnimation(oThis.SlideNum);
            }
        }

        oThis.OnPaintSlide(false);
    };

    this.StartAnimation = function(nSlideNum)
    {
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(nSlideNum);
        if(oSlide)
        {
            return oSlide.getAnimationPlayer().start();
        }
        return false;
    };

    this.StopAnimation = function(nSlideNum)
    {
        if(this.HtmlPage.m_oLogicDocument)
        {
            var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(nSlideNum);
            if(oSlide)
            {
                oSlide.getAnimationPlayer().stop();
            }
        }
    };
    this.StopAllAnimations = function()
    {
        if(this.HtmlPage.m_oLogicDocument)
        {
            this.HtmlPage.m_oLogicDocument.StopAnimation();
        }
    };

    this.PauseAnimation = function(nSlideNum)
    {
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(nSlideNum);
        if(oSlide)
        {
            oSlide.getAnimationPlayer().pause();
        }
    };

    this.OnAnimMainSeqFinished = function(nSlideNum)
    {
        if(oThis.WaitAnimationEnd)
        {
            oThis.WaitAnimationEnd = false;
            if(oThis.SlideNum === nSlideNum)
            {
                oThis.AdvanceAfter();
            }
        }
    };

    this.IsMainSeqFinished = function(nSlideNum)
    {
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(nSlideNum);
        if(oSlide)
        {
            return oSlide.getAnimationPlayer().isMainSequenceFinished();
        }
        return true;
    };

    this.StartSlideBackward = function()
    {
        oThis.HtmlPage.m_oApi.hideVideoControl();
        var _is_transition = oThis.Transition.IsPlaying();
        oThis.StopTransition();
        var nOldSlideNum = this.SlideNum;

        oThis.SlideImages[0] = null;
        oThis.SlideImages[1] = null;

        oThis.SlideIndexes[0] = -1;
        oThis.SlideIndexes[1] = -1;

        if (oThis.SlideNum == oThis.SlidesCount)
        {
            oThis.SlideNum = this.GetPrevVisibleSlide(true);
            oThis.StartAnimation(oThis.SlideNum);
            oThis.OnPaintSlide(false);
            if (null != oThis.DivEndPresentation)
            {
                oThis.DemonstrationDiv.removeChild(oThis.DivEndPresentation);
                oThis.DivEndPresentation = null;
            }

            return;
        }

        if (0 >= this.SlideNum)
        {
            this.SlideNum = this.GetFirstVisibleSlide();
            return;
        }

        var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
        var _transition = _slides[oThis.SlideNum].transition;

        if (!_is_transition && (_transition.TransitionType != c_oAscSlideTransitionTypes.None && _transition.TransitionDuration > 0))
        {
            oThis.StartTransition(_transition, false, true);
            oThis.StopAnimation(nOldSlideNum);
            return;
        }

        oThis.StopAnimation(nOldSlideNum);
        if (!_is_transition)
            oThis.SlideNum = this.GetPrevVisibleSlide(true);


        oThis.StartAnimation(oThis.SlideNum);
        oThis.OnPaintSlide(false);
    };

    this.StopTransition = function()
    {
        if (oThis.Transition.TimerId)
            oThis.Transition.End(true);

        if (-1 != this.CheckSlideDuration)
            clearTimeout(this.CheckSlideDuration);

        this.CheckSlideDuration = -1;
        this.WaitAnimationEnd = false;
    };

    this.StartTransition = function(_transition, is_first, is_backward)
    {
        // сначала проверим, создан ли уже оверлей (в идеале спрашивать еще у транзишна, нужен ли ему оверлей)
        // пока так.
        if (null == oThis.Overlay)
        {
            oThis.Overlay = document.createElement('canvas');
            oThis.Overlay.setAttribute("style", "position:absolute;margin:0;padding:0;left:0px;top:0px;width:100%;height:100%;zIndex:3;");
            oThis.Overlay.width = oThis.Canvas.width;
            oThis.Overlay.height = oThis.Canvas.height;

            oThis.Overlay.onmousedown  = oThis.onMouseDown;
            oThis.Overlay.onmousemove  = oThis.onMouseMove;
            oThis.Overlay.onmouseup    = oThis.onMouseUp;
			oThis.Overlay.onmouseleave = oThis.onMouseLeave;

            oThis.Overlay.onmousewheel = oThis.onMouseWhell;
            if (oThis.Overlay.addEventListener)
                oThis.Overlay.addEventListener("DOMMouseScroll", oThis.onMouseWhell, false);

            this.DemonstrationDiv.appendChild(oThis.Overlay);
        }

        oThis.Transition.Type = _transition.TransitionType;
        oThis.Transition.Param = _transition.TransitionOption;
        oThis.Transition.Duration = _transition.TransitionDuration;

        oThis.PrepareTransition(is_first, is_backward);
        oThis.Transition.Start(false);
    };

    this.OnEndTransition = function(bIsAttack)
    {
        if (oThis.Transition.IsBackward)
        {
            oThis.SlideNum = oThis.GetPrevVisibleSlide(true);
            oThis.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(oThis.SlideNum);
        }
        oThis.OnPaintSlide(true);
        oThis.StartAnimation(oThis.SlideNum);
    };

    this.OnPaintSlide = function(is_clear_overlay)
    {
        if (is_clear_overlay && oThis.Overlay)
        {
            var _ctx2 = oThis.Overlay.getContext('2d');
            _ctx2.clearRect(oThis.Transition.Rect.x, oThis.Transition.Rect.y, oThis.Transition.Rect.w, oThis.Transition.Rect.h);
        }

        oThis.Transition.CalculateRectDemonstration();
        oThis.PrepareSlide();

        var _ctx1 = oThis.Canvas.getContext('2d');

        var _image = null;
        if (0 == oThis.SlideImage)
            _image = oThis.SlideImages[0].Image.image;
        else if (1 == oThis.SlideImage)
            _image = oThis.SlideImages[1].Image.image;

        if (null != _image)
        {
            _ctx1.drawImage(_image, oThis.Transition.Rect.x, oThis.Transition.Rect.y, oThis.Transition.Rect.w, oThis.Transition.Rect.h);
        }

        // теперь запустим функцию
        var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
        var nSlideNum = oThis.SlideNum;
        var oSlide = _slides[nSlideNum];

        oThis.WaitAnimationEnd = false;
        if (oSlide && oSlide.isAdvanceAfterTransition())
        {
            oThis.CheckSlideDuration = setTimeout(function()
            {
                oThis.CheckSlideDuration = -1;
                if(oThis.IsMainSeqFinished(nSlideNum))
                {
                    oThis.AdvanceAfter();
                }
                else
                {
                    oThis.WaitAnimationEnd = true;
                }
            }, oSlide.getAdvanceDuration());
        }
    };

    this.AdvanceAfter = function()
    {
        if (oThis.IsPlayMode)
        {
            oThis.TmpSlideVisible = oThis.SlideNum;
            oThis.GoToNextVisibleSlide();
            oThis.PauseAnimation(oThis.TmpSlideVisible);
            if(oThis.SlideNum === oThis.SlidesCount && oThis.isLoop())
            {
                oThis.SlideNum = oThis.GetFirstVisibleSlide();
	            oThis.StopAllAnimations();
            }
            oThis.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(oThis.SlideNum);
            oThis.StartSlide(true, false);
            oThis.TmpSlideVisible = -1;
        }
    };

    this.End = function(isNoUseFullScreen)
    {
		this.PointerRemove();
        if (this.waitReporterObject)
        {
            this.EndWaitReporter(true);
			this.HtmlPage.m_oApi.sync_endDemonstration();
        }
		this.HtmlPage.m_oApi.DemonstrationReporterEnd();

        if (this.HtmlPage.m_oApi.isOnlyDemonstration)
            return;

		if (true !== isNoUseFullScreen)
		{
			if (undefined !== window["AscDesktopEditor"])
				window["AscDesktopEditor"]["SetFullscreen"](false);
		}

        if (!this.Mode)
            return;

        this.StopTransition();

        if (null != this.DivEndPresentation)
        {
            this.DemonstrationDiv.removeChild(this.DivEndPresentation);
            this.DivEndPresentation = null;
        }

        if (null != this.Overlay)
        {
            this.DemonstrationDiv.removeChild(this.Overlay);
            this.Overlay = null;
        }

        this.DemonstrationDiv.removeChild(this.Canvas);
        this.Canvas = null;

        var _oldSlideNum = this.SlideNum;

        this.SlideNum = -1;
        this.DemonstrationDiv = null;
        this.Mode = false;

        var ctx1 = this.HtmlPage.m_oEditor.HtmlElement.getContext('2d');
        ctx1.setTransform(1, 0, 0, 1, 0, 0);

        this.HtmlPage.m_oApi.sync_endDemonstration();

        if (true)
		{
			if (_oldSlideNum < 0)
				_oldSlideNum = 0;
			var _slidesCount = this.HtmlPage.m_oApi.getCountPages();
			if (_oldSlideNum >= _slidesCount)
			    _oldSlideNum = _slidesCount - 1;

			if (0 <= _oldSlideNum)
			    this.HtmlPage.GoToPage(_oldSlideNum);
		}

		this.StartSlideNum = -1;
        this.StopAllAnimations();

    };

    this.IsVisibleSlide = function(slideNum)
    {
		if (slideNum == this.StartSlideNum)
		    return true;

		if (-1 != this.TmpSlideVisible)
        {
            if (slideNum == this.TmpSlideVisible)
                return true;
        }

		return this.HtmlPage.m_oLogicDocument.IsVisibleSlide(slideNum);
    };

    this.GoToNextVisibleSlide = function()
    {
		this.SlideNum++;
		while (this.SlideNum < this.SlidesCount)
        {
            if (this.IsVisibleSlide(this.SlideNum))
                break;

            this.SlideNum++;
        }
    };

	this.GoToPrevVisibleSlide = function()
	{
		this.SlideNum--;
		while (this.SlideNum >= 0)
		{
			if (this.IsVisibleSlide(this.SlideNum))
				break;

			this.SlideNum--;
		}
	};

	this.GetPrevVisibleSlide = function(isNoUseLoop)
    {
        var _slide = this.SlideNum - 1;
        while (_slide >= 0)
        {
            if (this.IsVisibleSlide(_slide))
                return _slide;

            --_slide;
        }

        if ((true === isNoUseLoop) || !this.isLoop())
            return -1;

        _slide = this.SlidesCount - 1;
        while (_slide > this.SlideNum)
        {
			if (this.IsVisibleSlide(_slide))
				return _slide;

            --_slide;
        }

        return this.SlidesCount;
    };

	this.GetNextVisibleSlide = function()
    {
		var _slide = this.SlideNum + 1;
		while (_slide < this.SlidesCount)
		{
			if (this.IsVisibleSlide(_slide))
				return _slide;

			++_slide;
		}

		if (!this.isLoop())
			return this.SlidesCount;

		_slide = 0;
		while (_slide < this.SlideNum)
		{
			if (this.IsVisibleSlide(_slide))
				return _slide;

			++_slide;
		}

		return -1;
    };

	this.GetFirstVisibleSlide = function()
	{
	    var _slide = 0;
		while (_slide < this.SlidesCount)
		{
			if (this.IsVisibleSlide(_slide))
				return _slide;
			++_slide;
		}
		return 0;
	};

	this.GetLastVisibleSlide = function()
	{
		var _slide = this.SlidesCount - 1;
		while (_slide >= 0)
		{
			if (this.IsVisibleSlide(_slide))
				return _slide;
			--_slide;
		}
		return this.SlidesCount - 1;
	};

	this.GetCurrentAnimPlayer = function()
	{
        var oSlide = this.HtmlPage.m_oLogicDocument.GetSlide(this.SlideNum);
        if(!oSlide)
        {
            return null;
        }
        return oSlide.getAnimationPlayer();
	};

    this.OnNextSlide = function()
    {
        if(this.OnNextSlideAnimPlayer())
        {
            return;
        }
        this.NextSlide();
    };

    this.OnNextSlideAnimPlayer = function ()
    {
        var oPlayer = this.GetCurrentAnimPlayer();
        if(oPlayer)
        {
            if(oPlayer.onNextSlide())
            {
                return true;
            }
        }
        return false;
    };

    this.NextSlide = function(isNoSendFormReporter, isNoFromEvent)
    {
        if (!this.Mode)
            return;

		this.TmpSlideVisible = this.SlideNum;
        this.PauseAnimation(this.SlideNum);

        if (this.HtmlPage.m_oApi.isReporterMode && !isNoSendFormReporter)
			this.HtmlPage.m_oApi.sendFromReporter("{ \"reporter_command\" : \"next\" }");


        this.CorrectSlideNum();

        var _is_transition = this.Transition.IsPlaying();
        if (!_is_transition)
        {
            //this.SlideNum++;
            this.GoToNextVisibleSlide();
		}

        if (this.isLoop() && (this.SlideNum >= this.SlidesCount)) {
            this.StopAllAnimations();
            this.SlideNum = this.GetFirstVisibleSlide();
	        this.StopAllAnimations();
        }

        if (this.SlideNum > this.SlidesCount)
            this.End();
        else
        {
            this.HtmlPage.m_oNotesApi.IsEmptyDrawCheck = true;
            this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);
            this.StartSlide(!_is_transition, false);
			this.HtmlPage.m_oNotesApi.IsEmptyDrawCheck = false;
        }

        this.TmpSlideVisible = -1;
    };

    this.isLoop = function()
    {
        return (this.HtmlPage.m_oApi.WordControl.m_oLogicDocument.isLoopShowMode() || this.HtmlPage.m_oApi.isEmbedVersion);
    };

    this.OnPrevSlide = function()
    {
        var oPlayer = this.GetCurrentAnimPlayer();
        if(oPlayer)
        {
            if(oPlayer.onPrevSlide())
            {
                return;
            }
        }
        return this.PrevSlide();
    };

    this.PrevSlide = function(isNoSendFormReporter)
    {
        if (!this.Mode)
            return;

		this.TmpSlideVisible = this.SlideNum;

		if (this.HtmlPage.m_oApi.isReporterMode && !isNoSendFormReporter)
			this.HtmlPage.m_oApi.sendFromReporter("{ \"reporter_command\" : \"prev\" }");

        if (this.GetFirstVisibleSlide() != this.SlideNum)
        {
            this.CorrectSlideNum();

            // TODO: backward transition
            this.StartSlideBackward();
            this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);
        }
        else if (this.isLoop())
        {
            this.CorrectSlideNum();
            this.SlideNum = this.SlidesCount;
            this.StartSlideBackward();
            this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);
        }

		this.TmpSlideVisible = -1;
    };

    this.GoToSlide = function(slideNum, isNoSendFormReporter)
    {
        if (!this.Mode)
            return;

        if(this.SlideNum === slideNum)
        {
            return;
        }

        this.PauseAnimation(this.SlideNum);

		if (this.HtmlPage.m_oApi.isReporterMode && !isNoSendFormReporter)
			this.HtmlPage.m_oApi.sendFromReporter("{ \"reporter_command\" : \"go_to_slide\", \"slide\" : " + slideNum + " }");

        this.CorrectSlideNum();

        if ((slideNum == this.SlideNum) || (slideNum < 0) || (slideNum >= this.SlidesCount))
            return;

        this.SlideNum = slideNum;
        this.HtmlPage.m_oApi.sync_DemonstrationSlideChanged(this.SlideNum);

        this.StartSlide(true, false);
    };

    this.Play = function(isNoSendFormReporter)
    {
        this.IsPlayMode = true;
        if (-1 == this.CheckSlideDuration)
        {
            this.NextSlide(isNoSendFormReporter);
        }
        else
        {
            this.StartAnimation(this.SlideNum);
        }
    };

    this.Pause = function()
    {
        this.IsPlayMode = false;
        this.PauseAnimation(this.SlideNum);
    };

    this.OnRecalculateAnimationFrame = function(oPlayer)
    {
        oPlayer.drawFrame(oThis.Canvas, this.Transition.Rect);
    };

    // manipulators
    this.onKeyDownCode = function(code)
    {
		switch (code)
		{
			case 13:    // enter
			case 32:    // space
			case 34:    // PgDn
			case 39:    // right arrow
			case 40:    // bottom arrow
			{
				oThis.OnNextSlide();
				break;
			}
			case 33:
			case 37:
			case 38:
			{
				oThis.OnPrevSlide();
				break;
			}
			case 36:    // home
			{
			    oThis.GoToSlide(oThis.GetFirstVisibleSlide());
				break;
			}
			case 35:    // end
			{
				oThis.GoToSlide(oThis.GetLastVisibleSlide());
				break;
			}
			case 27:    // escape
			{
				oThis.End();
				break;
			}
			default:
				break;
		}
    };

    this.onKeyDown = function(e)
    {
        AscCommon.check_KeyboardEvent(e);

        if (oThis.HtmlPage.m_oApi.reporterWindow)
        {
			var _msg_ = {
				"main_command"  : true,
				"keyCode"       : AscCommon.global_keyboardEvent.KeyCode
			};

			oThis.HtmlPage.m_oApi.sendToReporter(JSON.stringify(_msg_));
			oThis.HtmlPage.IsKeyDownButNoPress = true;
			return false;
        }

        this.onKeyDownCode(AscCommon.global_keyboardEvent.KeyCode);

        oThis.HtmlPage.IsKeyDownButNoPress = true;
        return false;
    };

    this.documentMouseInfo = function(e)
    {
        var transition = oThis.Transition;
        if ((oThis.SlideNum >= 0 && oThis.SlideNum < oThis.SlidesCount) && (!transition || !transition.IsPlaying()))
        {
            AscCommon.check_MouseDownEvent(e, false);

            var _w = AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.w);
            var _h = AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.h);
            var _w_mm = oThis.HtmlPage.m_oLogicDocument.GetWidthMM();
            var _h_mm = oThis.HtmlPage.m_oLogicDocument.GetHeightMM();

            var _x = AscCommon.global_mouseEvent.X - AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.x);
            var _y = AscCommon.global_mouseEvent.Y - AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.y);

            if (oThis.HtmlPage.m_oApi.isReporterMode)
            {
                _x -= ((oThis.HtmlPage.m_oMainParent.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0);
            }
            if(oThis.HtmlPage.m_oApi.isEmbedVersion)
            {
                _y -= oThis.HtmlPage.Y;
            }

            _x = _x * _w_mm / _w;
            _y = _y * _h_mm / _h;

            return { x : _x, y : _y, page : oThis.SlideNum };
        }
        return null;
    };

    this.convertCoordsToCursorWR = function(x, y)
    {
        var transition = oThis.Transition;
        if(transition)
        {
            var _w = AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.w);
            var _h = AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.h);
            var _w_mm = oThis.HtmlPage.m_oLogicDocument.GetWidthMM();
            var _h_mm = oThis.HtmlPage.m_oLogicDocument.GetHeightMM();

            var _x = x * _w / _w_mm;
            var _y = y * _h / _h_mm;


            if (oThis.HtmlPage.m_oApi.isReporterMode)
            {
                _x += ((oThis.HtmlPage.m_oMainParent.AbsolutePosition.L * g_dKoef_mm_to_pix) >> 0);
            }
            if(oThis.HtmlPage.m_oApi.isEmbedVersion)
            {
                _y += oThis.HtmlPage.Y;
            }

            var nRetX = _x + AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.x);
            var nRetY = _y + AscCommon.AscBrowser.convertToRetinaValue(transition.Rect.y);

            return { X : nRetX, Y : nRetY, Error: false};
        }

        return { x : 0, y : 0, Error: true};
    };

    this.CheckMouseDown = function(x, y, page)
    {
        var ret = oThis.HtmlPage.m_oLogicDocument.OnMouseDown(AscCommon.global_mouseEvent, x, y, page);
        if (ret == keydownresult_PreventAll)
        {
            // mouse up will not sended!!!
            oThis.HtmlPage.m_oLogicDocument.OnMouseUp(AscCommon.global_mouseEvent, x, y, page);
            return true;
        }
        return false;
    };

    this.CheckHideCursor = function()
    {
        if(!oThis.Canvas)
        {
            return;
        }
        var nShowTime = 3000;
        if(oThis.LastMoveTime !== null && (new Date()).getTime() - oThis.LastMoveTime > nShowTime)
        {
            if(oThis.Canvas.style.cursor !== "none" && oThis.Canvas.style.cursor !== "pointer")
            {
                oThis.Canvas.style.cursor = "none";
            }
        }
    };

    this.onMouseDown = function(e)
    {
        var documentMI = oThis.documentMouseInfo(e);
        if (documentMI)
        {
            var oApi = oThis.HtmlPage.m_oApi;
            oThis.HtmlPage.m_oApi.disableReporterEvents = true;
            if(oThis.CheckMouseDown(documentMI.x, documentMI.y, documentMI.page))
            {
                oThis.HtmlPage.m_oApi.disableReporterEvents = false;
                var oMsg;
                if (oApi.isReporterMode)
                {
                    oMsg =
                    {
                        "reporter_command": "on_mouse_down",
                        "x": documentMI.x,
                        "y": documentMI.y,
                        "page": documentMI.page
                    };
                    oApi.sendFromReporter(JSON.stringify(oMsg));
                }
                if (oApi.reporterWindow)
                {
                    oMsg =
                    {
                        "main_command": true,
                        "on_mouse_down": true,
                        "x": documentMI.x,
                        "y": documentMI.y,
                        "page": documentMI.page
                    };
                    oApi.sendToReporter(JSON.stringify(oMsg));
                }
                return;
            }
            oThis.HtmlPage.m_oApi.disableReporterEvents = false;
        }
        oThis.isMouseDown = true;
        e.preventDefault();
        return false;
    };

    this.onMouseLeave = function(e)
    {
		if (!oThis.HtmlPage.m_oApi.isReporterMode)
			return;
		if (!oThis.HtmlPage.reporterPointer)
			return;

		oThis.PointerRemove();

        e.preventDefault();
        return false;
    };

    this.onMouseMove = function(e)
    {
        oThis.LastMoveTime = (new Date()).getTime();
        if (true)
        {
            var documentMI = oThis.documentMouseInfo(e);
            if (documentMI)
                oThis.HtmlPage.m_oLogicDocument.OnMouseMove(AscCommon.global_mouseEvent, documentMI.x, documentMI.y, documentMI.page);
        }

		if (!oThis.HtmlPage.reporterPointer)
			return;

        var _x = 0;
        var _y = 0;
		if (e.pageX || e.pageY)
		{
			_x = e.pageX;
			_y = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			_x = e.clientX;
			_y = e.clientY;
		}

		_x = (_x * AscCommon.AscBrowser.zoom) >> 0;
		_y = (_y * AscCommon.AscBrowser.zoom) >> 0;

		_x -= parseInt(oThis.HtmlPage.m_oMainParent.HtmlElement.style.left);
		_y -= parseInt(oThis.HtmlPage.m_oMainParent.HtmlElement.style.top);

		var _rect = oThis.Transition.Rect;
		_x -= _rect.x;
		_y -= _rect.y;
		_x /= _rect.w;
		_y /= _rect.h;

		oThis.PointerMove(_x, _y);

        e.preventDefault();
        return false;
    };

    this.onMouseUp = function(e, isAttack, isFromMainToReporter)
    {
    	if (!oThis.isMouseDown && true !== isAttack)
    		return;

    	if (AscCommon.global_mouseEvent.IsLocked)
			AscCommon.global_mouseEvent.IsLocked = false;

		oThis.isMouseDown = false;
		if (isFromMainToReporter && oThis.PointerDiv && oThis.HtmlPage.m_oApi.isReporterMode)
		    oThis.PointerRemove();

		if (oThis.PointerDiv && oThis.HtmlPage.m_oApi.isReporterMode)
		{
			AscCommon.stopEvent(e);
			return false;
        }

		if (oThis.HtmlPage.m_oApi.reporterWindow)
		{
			var _msg_ = {
				"main_command"  : true,
				"mouseUp"       : true
			};

			oThis.HtmlPage.m_oApi.sendToReporter(JSON.stringify(_msg_));

			AscCommon.stopEvent(e);
			return false;
		}

        var documentMI = oThis.documentMouseInfo(e);
        if (documentMI)
        {
            var ret = oThis.HtmlPage.m_oLogicDocument.OnMouseUp(AscCommon.global_mouseEvent, documentMI.x, documentMI.y, documentMI.page);
            if (ret == keydownresult_PreventAll)
                return;
        }

        // next slide
        oThis.CorrectSlideNum();

        var _is_transition = oThis.Transition.IsPlaying();
        if (_is_transition)
        {
            oThis.OnNextSlide();
        }
        else
        {
            if (oThis.SlideNum < 0 || oThis.SlideNum >= oThis.SlidesCount)
            {
                oThis.OnNextSlide();
            }
            else
            {
                var _slides = oThis.HtmlPage.m_oLogicDocument.Slides;
                var _transition = _slides[oThis.SlideNum].transition;

                if (_transition.SlideAdvanceOnMouseClick === true)
                {
                    oThis.OnNextSlide();
                }
            }
        }

		AscCommon.stopEvent(e);
        return false;
    };

    this.onMouseWheelDelta = function(delta)
    {
		if (delta > 0)
		{
			this.OnNextSlide();
		}
		else
		{
			this.OnPrevSlide();
		}
    };

    this.onMouseWhell = function(e)
    {
        if (undefined !== window["AscDesktopEditor"])
        {
            if (false === window["AscDesktopEditor"]["CheckNeedWheel"]())
                return;
        }

        var delta = 0;
        if (undefined != e.wheelDelta)
            delta = (e.wheelDelta > 0) ? -1 : 1;
        else
            delta = (e.detail > 0) ? 1 : -1;

		if (oThis.HtmlPage.m_oApi.reporterWindow)
		{
			var _msg_ = {
				"main_command"  : true,
				"mouseWhell"    : delta
			};

			oThis.HtmlPage.m_oApi.sendToReporter(JSON.stringify(_msg_));
			AscCommon.stopEvent(e);
			return false;
		}

        oThis.onMouseWheelDelta(delta);

        AscCommon.stopEvent(e);
        return false;
    };

    this.Resize = function(isNoSend)
    {
		if (isNoSend !== true && oThis.HtmlPage.m_oApi.reporterWindow)
		{
			var _msg_ = {
				"main_command"  : true,
				"resize"        : true
			};

			oThis.HtmlPage.m_oApi.sendToReporter(JSON.stringify(_msg_));
		}
		else if (isNoSend !== true && oThis.HtmlPage.m_oApi.isReporterMode)
        {
			var _msg_ = {
				"reporter_command"  : "resize"
			};

			oThis.HtmlPage.m_oApi.sendFromReporter(JSON.stringify(_msg_));
        }

        if (!this.Mode)
            return;

        var _width  = this.DemonstrationDiv.clientWidth;
        var _height = this.DemonstrationDiv.clientHeight;

        if (_width == this.DivWidth && _height == this.DivHeight && true !== isNoSend)
            return;

		oThis.HtmlPage.m_oApi.disableReporterEvents = true;

        this.DivWidth = _width;
        this.DivHeight = _height;

        this.Canvas.width = AscCommon.AscBrowser.convertToRetinaValue(_width, true);
        this.Canvas.height = AscCommon.AscBrowser.convertToRetinaValue(_height, true);

        this.Transition.CalculateRectDemonstration();

        this.SlideIndexes[0] = -1;
        this.SlideIndexes[1] = -1;

        if (this.Overlay)
        {
            this.Overlay.width = this.Canvas.width;
            this.Overlay.height = this.Canvas.height;
        }

        if (this.SlideNum < this.SlidesCount)
            this.StartSlide(this.Transition.IsPlaying(), false);

		oThis.HtmlPage.m_oApi.disableReporterEvents = false;
    };

    this.PointerMove = function(x, y, w, h)
    {
        if (!this.PointerDiv)
        {
            this.PointerDiv = document.createElement("div");
            if (AscCommon.AscBrowser.retinaPixelRatio > 1.5)
            {
				this.PointerDiv.setAttribute("style", "position:absolute;z-index:100;pointer-events:none;width:28px;height:28px;margin:0;padding:0;border:none;background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMDctMjZUMTU6MTc6MzIrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTA3LTI2VDE1OjU1OjQ3KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE3LTA3LTI2VDE1OjU1OjQ3KzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRTk4RENGNDcyMDExMUU3QjE0ODlFOEJERTU4NTc4NyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCRTk4RENGNTcyMDExMUU3QjE0ODlFOEJERTU4NTc4NyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFOThEQ0YyNzIwMTExRTdCMTQ4OUU4QkRFNTg1Nzg3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJFOThEQ0YzNzIwMTExRTdCMTQ4OUU4QkRFNTg1Nzg3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4SWSuQAABttJREFUeNrcm8+PFEUUx6tranZ3hh1Ww4FwMQIJRr1xEmIEjH+AF08mHl3ictTgj7uJZ1lhiSZKwsmTdyNgDJiQcNtgSGCNF8JJ11l2Zrunu+2adE3evP6+qu7ZXX9N8tLVPbPV/en36tV7r2qjPM9V+Yk8R187qvFbfo+cXc/JNdQOfa+ko2kA1URQH+hTB8onqL+IHo0HLiQ6cD4LIJUscC7BTkGaBnDac9QBSB+gDy4j7Qh8pzz9Qg3WgdIACl1330njkb75jMFxodcjdpRgKxr0wSFpCW0dMFcVMEsqKWvTvjLycrQEaTxwFBDBtIS2O0cmKwE6TXAgzeA4KB/LFUjDXDh/KP7QdcWnSRXQXArE9eXgUvbcKXn2jE8TPg1yOMPahl03TKtNAFNyHIGjz2FRDU55bjQGkSkiECtt0jbsBbQELSpBe1Rjo1JaAK7u1BMhDWoAyTVGwdpEfJAhQARnJRGmIAUiItefJpqEToabpgQ2xwA5qKRF5dEeBUvAWFYeE6Uy4TEBOKTBOQJIJQQpASI4w8ZzBGLZkETSPCg5FwpggebJcd4DibTAPSc1y7iEjANmyc1ck3aExiB9CGnszTEoLlybLQIpadB5yoRoLyZzqTSHZkKcqqkWfWPQpz0HuUAEQVIzRYDUPJ3W6N/5HBOaQytTnmkw/3HzdIAdBkrHJTdTZKLUNKnmdWBaceO3xYIB6kVrORkDALkGOwTUwbeZNhAg1Z7tc4eZtAoEBCmBpOFdhJwMjz1bHsh5oEUnE1PNNzc7w2vXn4t/uHk42/i1l/2xaSGUfmYp1kef78+9fvbJwjtv/xYtLQ3IuGsJL4J62rR8nhH5m5QxjEO2KM/zxZpaoiDdUg6U4s4nWhx8sXZ8cOnKibzfb3vyNhX1eklnZflBZ+X8w1KDw0Is8HYpT0vZJtcH5e+c7JQvKCbOavwyLGCPAdIxVAduCjIfDrtbyxdOFlo7ohp82ufOPO5dXb0XLSxsA7in5NwBcsiYQY4BNcgmpBQpNB7HMguc/SQ3bh3pv7ty0jPtGE+UJIWE3hJD3fE4iWwGl68emwWOQg5Wrxxn0ZIUHbU8GctEtKA935QBswrrUAafX35B7fIzWF07YfsCUMaTc4o1Ic2iBKk+oz0Z/fghrLeUHIp56UV18PrX6tCj++rQxi/jtr0Gc52iD9sXgNM1k+mpqEfPUCqENZn4xq3DItx336r2a68WOin4jRm37TXzMoYs+2o1rPfAGpBGnrtBTXRy0+zRRg89bPeTi6rwjNWbFNe6H1+EgGVfqEJXt+isuJMRp6lA1XoibhKvuP/Tr8hTw+lTxV9Wb1/21bSSDp9fq//5Rws1fl/tEl634Rd0/bd/lqeF23eKv6zevuxrN2sUk+fXDcrpvtJ6po8d7aM7bH/6mSqim+pNimv2O/jWiziVVbXrrE1AWN1wRUesOs+dO/MEPexo/b768823VPLjT8VJOhbbttfsd+hjg3CWNaBSfi1YG4seZAntPItDUQy6WB57ZXuxmJyXfj919g1vcO0cSp57g+9n79z8vsgwNovTrVL6ZRy6ReJRFJPGZeA9Cbi1J1vOPBXnES8U2ZSnc+H8A++It2B57v2JzSzK9Clh6dGIPYO0QDPtG2qYZCrULRNSZhgfO+8tPyzM6/GsHs9mFGXaFLO+OSwHFRm0ZzEkrVG3jIlZjGVx7dK9WSBdukT7QukPg+T+oOJsdIOFEAmOAg5tPtf75su73Y8+WLfjKQRmf9P98P31g9e+ulvmgkMA6GQkaFJ0QNbJHADV67lAVt9ljqe7RyULBzZgWX3dbL6ibQfoMoM2gKS1l3lWYOqyesxuik4JtQQCiWQHaDohWk6cdk0N83SFnQRkz+ihaZWsadnQyRDITg2nUzFTU2MJ2UHqwHJYxirU8YyF35hpEmkqEZxNEDAHS8gjT8oimVu8i9I91+SOUDVDkJVpwrCbRWypGOVjvnV2B7hXiy8UbmcWb2qEB42EnQ0KrPRQuL1YPuOQcU3toWlCGQEuAnAR2GvGzZOu7+3FAmgCIiZfRFN7DEZgN4MS4DIGuddL2FRjPKIZhSZ64zFPVG1TQlCe7tMmhBEASwPTQ8ZNFG2rarJxLgXa249tJCOQzaDcFGoQmV6dBf+MrOy0SFCw1xuBJAkmwkbYTKOJdnLBPPki5H5s5UqFtpRFZDybMELRJvOMvZwt+GsWGOznZrwssBtR1KAEyfd+oa0a2gO3H9spEZSU9E40GHkgI7B7IfsHNsTWhZoqbxq+Q9aTm1JYeszUv2NLM6rdVjQYKbz/GUkONqj+3ZvSgzvwkQYlTebqP/hvBX8JMAASRMzjAJSzzwAAAABJRU5ErkJggg=='); background-size: 28px 28px;");
            }
            else
			{
				this.PointerDiv.setAttribute("style", "position:absolute;z-index:100;pointer-events:none;width:28px;height:28px;margin:0;padding:0;border:none;background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+dpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTctMDctMjZUMTU6MTc6MzIrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE3LTA3LTI2VDE1OjU0OjExKzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE3LTA3LTI2VDE1OjU0OjExKzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NTgwNDIyNDcyMDExMUU3OTRGNTgwQjYzODE3QjJFRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4NTgwNDIyNTcyMDExMUU3OTRGNTgwQjYzODE3QjJFRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjg1ODA0MjIyNzIwMTExRTc5NEY1ODBCNjM4MTdCMkVFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjg1ODA0MjIzNzIwMTExRTc5NEY1ODBCNjM4MTdCMkVFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dWpcyAAAAsxJREFUeNq8lr+KFEEQxnt6+nZG53Y9jxMzUTAwMDP1CQSRywQjwcjAJxBE8AkMjAQjwUxE8AmMzQQDQTGTO867/ePO7M7O2DVXNXxb2wuzcNjw0b13vfXbqq6q7qiua+NHpGRZeo2iUStVLL1u5RRE5hjmGD7bNUAxvgBVMMse45QXAnEBIRiBCCqVIoDSqLSHYnyL1VOzQBEosLnXDGaMRsl7I6fC6Ng4KWGlPAvUKWAJkMIrXxOJ9gwRJt4Q5BzrPM8pQK2ECGAEmkL4g4nl4OwEmDAg89pmZQxOIbQGQkmwv14TtmPVGcs5WwkPhlOABBp4XeBZoD0FnAGsp7xfqIRahEKasuFthu167QA04b2GjRQMG8LfK8jUOSsWD+0aDzOG7Ag0f/3mRv723fXFj599shpfuzpKH9z/nj56+E39CEkg0UyAke80AwUQr/a8LnldpvXo8ZPbs4+frpjA6N2986v/6uVnvzz0+u11wOsjrxP2nqIw1d0lVplKoc3Is3UwGvQ/2qOSS9duw7Kq8ONA4ScURjGe7N8zu1+/NKK1DN6D9boFJdJyQk1Ze+zkzGhkL56ZaDBoRGsTnZYb7wm1wCVZ85+HDVwxKw2ZslG+MHn63NTDYSNam9PrzfCeUt0WK7ZtAIK106Q3pb4Ai/cfzNHNW41oLYP3FNDA5/ADKg2sAl2/bVdUZ5T6rXXyij2TsuBanPB3cgAveUx12FfdBYt9j9Wl8I+57g6hBo+5BsfyQwiYQXchaB+gFzdsbQL9A7ARw+gmKVzg7HK4iC0YnnZo3kPuLGMI7dJZOri1S+h5ser6YrTL9TRmTSGJBFg7uK9K9VDCrl+wwS4XsIRPgOJhJR5KSENPwAUAN3liFKpEVkKKUP0am/OXN31EBWvRqcIvA41gHjjbrs/ElcJHD/WDRwyc5UO4BUoCRGDEysPnLJ/6/wQYAGSEwicuWovcAAAAAElFTkSuQmCC'); background-size: 28px 28px;");
			}
			this.DemonstrationDiv.appendChild(this.PointerDiv);
        }
        var _rect = this.Transition.Rect;
		this.PointerDiv.style.left = ((_rect.x + x * _rect.w - 14) >> 0) + "px";
		this.PointerDiv.style.top = ((_rect.y + y * _rect.h - 14) >> 0) + "px";

		if (this.HtmlPage.m_oApi.isReporterMode)
        {
			this.Canvas.style.cursor = "none";
			if (this.Overlay)
				this.Overlay.style.cursor = "none";

            var _msg_ = {
                "reporter_command" : "pointer_move",
                "x" : x,
                "y" : y
            };
			this.HtmlPage.m_oApi.sendFromReporter(JSON.stringify(_msg_));
        }
    };

    this.PointerRemove = function()
    {
        if (!this.PointerDiv)
            return;

		this.DemonstrationDiv.removeChild(this.PointerDiv);
		this.PointerDiv = null;

		if (this.HtmlPage.m_oApi.isReporterMode)
		{
			this.Canvas.style.cursor = "default";
			if (this.Overlay)
				this.Overlay.style.cursor = "default";

			this.HtmlPage.m_oApi.sendFromReporter("{ \"reporter_command\" : \"pointer_remove\" }");
		}
    };
}
