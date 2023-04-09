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

(function(){

	function setCanvasSize(element, width, height, is_correction)
	{
		if (element.width === width && element.height === height)
			return;

		if (true !== is_correction)
		{
			element.width = width;
			element.height = height;
			return;
		}

		var data = element.getContext("2d").getImageData(0, 0, element.width, element.height);
		element.width = width;
		element.height = height;
		element.getContext("2d").putImageData(data, 0, 0);
	};

	AscCommon.calculateCanvasSize = function(element, is_correction, is_wait_correction)
	{
		if (true !== is_correction && undefined !== element.correctionTimeout)
		{
			clearTimeout(element.correctionTimeout);
			element.correctionTimeout = undefined;
		}

		var scale = AscCommon.AscBrowser.retinaPixelRatio;
		if (Math.abs(scale - (scale >> 0)) < 0.001)
		{
			setCanvasSize(element,
				scale * parseInt(element.style.width),
				scale * parseInt(element.style.height),
				is_correction);
			return;
		}

		var rect = element.getBoundingClientRect();
		var isCorrectRect = (rect.width === 0 && rect.height === 0) ? false : true;
		if (is_wait_correction || !isCorrectRect)
		{
			var isNoVisibleElement = false;
			if (element.style.display === "none")
				isNoVisibleElement = true;
			else if (element.parentNode && element.parentNode.style.display === "none")
				isNoVisibleElement = true;

			if (!isNoVisibleElement)
			{
				element.correctionTimeout = setTimeout(function (){
					calculateCanvasSize(element, true);
				}, 100);
			}

			if (!isCorrectRect)
			{
				var style_width = parseInt(element.style.width);
				var style_height = parseInt(element.style.height);

				rect = {
					x: 0, left: 0,
					y: 0, top: 0,
					width: style_width, right: style_width,
					height: style_height, bottom: style_height
				};
			}
		}

		setCanvasSize(element,
			Math.round(scale * rect.right) - Math.round(scale * rect.left),
			new_height = Math.round(scale * rect.bottom) - Math.round(scale * rect.top),
			is_correction);
	};

	window["AscViewer"] = window["AscViewer"] || {};

	AscFonts.g_fontApplication.Init();

	window["AscViewer"].createViewer = function(parent, options)
	{
		if (options)
		{
			if (options["enginePath"])
				window["AscViewer"]["baseEngineUrl"] = options["enginePath"];

			if (options["fontsPath"])
				AscCommon.g_font_loader.fontFilesPath = options["fontsPath"];

			if (options["theme"])
				AscCommon.updateGlobalSkin(options["theme"]);
		}

		var apiFake = {
			isMobileVersion : false,
			isSeparateModule : true,

			baseFontsPath : (options && options["fontsPath"]) ? options["fontsPath"] : undefined,

			getPageBackgroundColor : function() {
				// TODO: get color from theme
				if (this.isDarkMode)
					return [0x3A, 0x3A, 0x3A];
				return [0xFF, 0xFF, 0xFF];
			},

			WordControl : {
				NoneRepaintPages : false
			},

			sendEvent : function() {
			}
		};

		return new AscCommon.CViewer(parent, apiFake);
	};

	window["AscViewer"].createThumbnails = function(parent)
	{
		return new AscCommon.ThumbnailsControl(parent);
	};

})();
