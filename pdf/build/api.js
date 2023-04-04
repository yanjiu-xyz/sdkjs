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
