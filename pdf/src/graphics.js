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

(function(window, undefined){

function CPDFGraphics()
{
    this.context        = null;
    this.widthPx        = undefined;
    this.heightPx       = undefined;
    this.widthMM        = undefined;
    this.heightMM       = undefined;
    this.lineWidth      = 1;
    this.fillStyle      = null;
    this.strokeStyle    = null;
    this.globalAlpha    = 1;
}

CPDFGraphics.prototype.SetStrokeStyle = function(style) {
    if (this.context)
        this.context.strokeStyle = style;

    this.strokeStyle = style;
};
CPDFGraphics.prototype.SetFillStyle = function(style) {
    if (this.context)
        this.context.fillStyle = style;

    this.fillStyle = style;
};
CPDFGraphics.prototype.SetLineWidth = function(width) {
    if (this.context)
        this.context.lineWidth = width;
        
    this.lineWidth = width;
};
CPDFGraphics.prototype.GetLineWidth = function() {
    return this.lineWidth;
};
CPDFGraphics.prototype.Init = function(context, nWidthPx, nHeightPx) {
    this.context    = context;
    this.widthPx    = nWidthPx;
    this.heightPx   = nHeightPx;
    this.widthMM    = nWidthPx * g_dKoef_pix_to_mm;
    this.heightMM   = nHeightPx * g_dKoef_pix_to_mm;
};
CPDFGraphics.prototype.Rect = function(x, y, w, h) {
    this.context.rect(x, y, w, h);
};
CPDFGraphics.prototype.BeginPath = function() {
    this.context.beginPath();
};
CPDFGraphics.prototype.ClosePath = function() {
    this.context.closePath();
};
CPDFGraphics.prototype.Stroke = function() {
    this.context.stroke();
};
CPDFGraphics.prototype.MoveTo = function(x, y) {
    this.context.moveTo(x, y);
};
CPDFGraphics.prototype.LineTo = function(x, y) {
    this.context.lineTo(x, y);
};
CPDFGraphics.prototype.FillRect = function(x, y, w, h) {
    this.context.beginPath();
    this.context.fillRect(x, y, w, h);
};
CPDFGraphics.prototype.DrawImage = function(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    this.context.drawImage(...arguments);
};
CPDFGraphics.prototype.RoundRect = function() {
    this.context.roundRect(...arguments);
};
CPDFGraphics.prototype.SetLineDash = function(dash) {
    if (this.context)
        this.context.setLineDash(dash);
};
CPDFGraphics.prototype.SetGlobalAlpha = function(value) {
    if (this.context)
        this.context.globalAlpha = value;
};

CPDFGraphics.prototype.Arc = function(x, y, radius, startAng, endAng, counterClockwise) {
    this.context.arc(x, y, radius, startAng, endAng, counterClockwise);
};
CPDFGraphics.prototype.ArcTo = function() {
    this.context.arcTo(...arguments);
};
CPDFGraphics.prototype.QuadraticCurveTo = function() {
    this.context.quadraticCurveTo(...arguments);
};
CPDFGraphics.prototype.Fill = function() {
    this.context.fill();
};
CPDFGraphics.prototype.ClearRect = function(x, y, w, h) {
    this.context.clearRect(x, y, w, h);
};

    //------------------------------------------------------------export----------------------------------------------------
    window['AscPDF'] = window['AscPDF'] || {};
    window['AscPDF'].CPDFGraphics = CPDFGraphics;
})(window);
