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

(function(window)
{
	/**
	 * @constructor
	 */
	function FFData()
	{
		this.calcOnExit = undefined; // bool
		this.checkBox   = undefined; // CheckBox
		this.ddList     = undefined; // DDList
		this.enabled    = undefined; // bool
		this.entryMacro = undefined; // string
		this.exitMacro  = undefined; // string
		this.helpText   = undefined; // FFDataText
		this.label      = undefined; // int
		this.name       = undefined; // string
		this.statusText = undefined; // FFDataText
		this.tabIndex   = undefined; // int
		this.textInput  = undefined; // TextInput
	}
	FFData.prototype.Copy = function()
	{
		let ffData = new FFData();
		
		ffData.calcOnExit = this.calcOnExit;
		ffData.checkBox   = this.checkBox ? this.checkBox.Copy() : undefined;
		ffData.ddList     = this.ddList ? this.ddList.Copy() : undefined;
		ffData.enabled    = this.enabled;
		ffData.entryMacro = this.entryMacro;
		ffData.exitMacro  = this.exitMacro;
		ffData.helpText   = this.helpText ? this.helpText.Copy() : undefined;
		ffData.label      = this.label;
		ffData.name       = this.name;
		ffData.statusText = this.statusText ? this.statusText.Copy() : undefined;
		ffData.tabIndex   = this.tabIndex;
		ffData.textInput  = this.textInput ? this.textInput.Copy() : undefined;
		return ffData;
	};
	FFData.prototype.initCheckBox = function()
	{
		this.checkBox = new CheckBox();
		return this.checkBox;
	};
	FFData.prototype.initDDList = function()
	{
		this.ddList = new DDList();
		return this.ddList;
	};
	FFData.prototype.initHelpText = function()
	{
		this.helpText = new FFDataText();
		return this.helpText;
	};
	FFData.prototype.initStatusText = function()
	{
		this.statusText = new FFDataText();
		return this.statusText;
	};
	FFData.prototype.initTextInput = function()
	{
		this.textInput = new TextInput();
		return this.textInput;
	};
	
	/**
	 * ffData.checkBox
	 * @constructor
	 */
	function CheckBox()
	{
		this.checked  = undefined;
		this.default  = undefined;
		this.size     = undefined;
		this.sizeAuto = undefined;
	}
	CheckBox.prototype.Copy = function()
	{
		let cb = new CheckBox();
		
		cb.checked  = this.checked;
		cb.default  = this.default;
		cb.size     = this.size;
		cb.sizeAuto = this.sizeAuto;
		return cb;
	};
	
	/**
	 * ffData.ddList
	 * @constructor
	 */
	function DDList()
	{
		this.default = undefined;
		this.list    = [];
		this.result  = undefined;
	}
	DDList.prototype.Copy = function()
	{
		let ddList = new DDList();
		
		ddList.default = this.default;
		ddList.result  = this.result;
		ddList.list    = this.list.slice();
		return ddList;
	};
	
	/**
	 * ffData.helpText or ffData.statusText
	 * @constructor
	 */
	function FFDataText()
	{
		this.type = undefined;
		this.val  = undefined;
	}
	FFDataText.prototype.Copy = function()
	{
		let ht = new HelpText();
		
		ht.type = this.type;
		ht.val  = this.val;
		return ht;
	};
	
	/**
	 * ffData.textInput
	 * @constructor
	 */
	function TextInput()
	{
		this.default   = undefined; // string
		this.format    = undefined; // string
		this.type      = undefined;
		this.maxLength = undefined;
	}
	TextInput.prototype.Copy = function()
	{
		let ti = new TextInput();
		
		ti.default   = this.default;
		ti.format    = this.format;
		ti.type      = this.type;
		ti.maxLength = this.maxLength;
		return ti;
	};
	
	
	//--------------------------------------------------------export----------------------------------------------------
	window['AscWord'].FFData = FFData;
	
})(window);

