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

(function(window)
{
	const EPSILON = AscCommon.TwipsToMM(1);
	
	/**
	 * Class for handling bidirectional flow of text or other content
	 * @constructor
	 */
	function ParagraphDrawSelectionState()
	{
		this.x    = 0;
		this.rtl  = false;
		this.bidi = new AscWord.BidiFlow(this);
		
		this.selectionRanges = [];
	}
	ParagraphDrawSelectionState.prototype.beginRange = function(rangeX)
	{
		this.x = rangeX;
		this.bidi.begin(this.rtl);
	};
	ParagraphDrawSelectionState.prototype.endRange = function()
	{
		this.bidi.end();
	};
	ParagraphDrawSelectionState.prototype.getSelectionRanges = function()
	{
		return this.selectionRanges;
	};
	/**
	 * @param element {AscWord.CRunElementBase}
	 * @param isSelected {boolean}
	 */
	ParagraphDrawSelectionState.prototype.handleRunElement = function(element, isSelected)
	{
		if (para_Drawing === element.Type && !element.IsInline())
			element.Draw_Selection();
		else
			this.bidi.add([element, isSelected], element.isRtl());
	};
	ParagraphDrawSelectionState.prototype.handleBidiFlow = function(data)
	{
		let element    = data[0];
		let isSelected = data[1];
		
		let w = element.GetWidthVisible();
		if (isSelected)
		{
			let lastRange = this.selectionRanges.length ? this.selectionRanges[this.selectionRanges.length - 1] : null;
			if (lastRange && Math.abs(lastRange.x + lastRange.w - this.x) < EPSILON)
				lastRange.w += w;
			else
				this.selectionRanges.push({x : this.x, w : w});
		}
		
		this.x += w;
	};
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphDrawSelectionState = ParagraphDrawSelectionState;
	
})(window);


