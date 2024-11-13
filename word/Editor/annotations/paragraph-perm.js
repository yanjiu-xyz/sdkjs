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

(function()
{
	/**
	 * @constructor
	 * @extends {CParagraphContentBase}
	 */
	function ParagraphPermBase()
	{
		CParagraphContentBase.call(this);
		this.Id = AscCommon.g_oIdCounter.Get_NewId();
		AscCommon.g_oTableId.Add(this, this.Id);
	}
	
	ParagraphPermBase.prototype             = Object.create(CParagraphContentBase.prototype);
	ParagraphPermBase.prototype.constructor = ParagraphPermBase;
	
	ParagraphPermBase.Type = para_Unknown;
	ParagraphPermBase.prototype.Get_Id = function()
	{
		return this.Id;
	};
	ParagraphPermBase.prototype.GetId = function()
	{
		return this.Id;
	};
	ParagraphPermBase.prototype.Copy = function()
	{
		return new this.constructor();
	};
	ParagraphPermBase.prototype.GetRangeId = function()
	{
		return this.rangeId;
	};
	//----------------------------------------------------------------------------------------------------------------------
	// Collaboration
	//----------------------------------------------------------------------------------------------------------------------
	ParagraphPermBase.prototype.Refresh_RecalcData = function()
	{
	};
	
	/**
	 * @param rangeId
	 * @param colFirst
	 * @param colLast
	 * @param displacedByCustomXml
	 * @param ed
	 * @param edGrp
	 * @constructor
	 * @extends {ParagraphPermBase}
	 */
	function ParagraphPermStart(rangeId, colFirst, colLast, displacedByCustomXml, ed, edGrp)
	{
		this.rangeId              = rangeId;
		this.colFirst             = undefined !== colFirst && null !== colFirst ? colFirst : undefined;
		this.colLast              = undefined !== colLast && null !== colLast ? colLast : undefined;
		this.displacedByCustomXml = undefined !== displacedByCustomXml && null !== displacedByCustomXml ? displacedByCustomXml : undefined;
		this.ed                   = undefined !== ed && null !== ed ? ed : undefined;
		this.edGrp                = undefined !== edGrp && null !== edGrp ? edGrp : undefined;
		
		ParagraphPermBase.call(this);
	}
	ParagraphPermStart.prototype = Object.create(ParagraphPermBase.prototype);
	ParagraphPermStart.prototype.constructor = ParagraphPermStart;
	ParagraphPermStart.Type = para_PermStart;
	ParagraphPermStart.fromObject = function(obj)
	{
		if (!obj)
			return null;
		
		return new ParagraphPermStart(obj.id, obj.colFirst, obj.colLast, obj.displacedByCustomXml, obj.ed, obj.edGrp);
	};
	ParagraphPermStart.prototype.Copy = function()
	{
		return new ParagraphPermStart(this.rangeId, this.colFirst, this.colLast, this.displacedByCustomXml, this.ed, this.edGrp);
	};
	ParagraphPermStart.prototype.Write_ToBinary2 = function(writer)
	{
		writer.WriteLong(AscDFH.historyitem_type_ParagraphPermStart);
		
		writer.WriteString2("" + this.Id);
		writer.WriteString2("" + this.rangeId);
		
		let startPos = writer.GetCurPosition();
		writer.Skip(4);
		let flags = 0;
		
		if (undefined !== this.colFirst)
		{
			writer.WriteLong(this.colFirst);
			flags |= 1;
		}
		
		if (undefined !== this.colLast)
		{
			writer.WriteLong(this.colLast);
			flags |= 2;
		}
		
		if (undefined !== this.displacedByCustomXml)
		{
			writer.WriteByte(this.displacedByCustomXml);
			flags |= 4;
		}
		
		if (undefined !== this.ed)
		{
			writer.WriteByte(this.ed);
			flags |= 8;
		}
		
		if (undefined !== this.edGrp)
		{
			writer.WriteString2(this.edGrp);
			flags |= 16;
		}
		
		let endPos = writer.GetCurPosition();
		writer.Seek(startPos);
		writer.WriteLong(flags);
		writer.Seek(endPos);
	};
	ParagraphPermStart.prototype.Read_FromBinary2 = function(reader)
	{
		this.Id      = reader.GetString2();
		this.rangeId = reader.GetString2();
		
		let flags = reader.GetLong();
		
		if (flags & 1)
			this.colFirst = reader.GetLong();
		
		if (flags & 2)
			this.colLast = reader.GetLong();
		
		if (flags & 4)
			this.displacedByCustomXml = reader.GetByte();
		
		if (flags & 8)
			this.ed = reader.GetByte();
		
		if (flags & 16)
			this.edGrp = reader.GetString();
	};
	
	/**
	 * @param rangeId
	 * @constructor
	 * @extends {ParagraphPermBase}
	 */
	function ParagraphPermEnd(rangeId)
	{
		this.rangeId = rangeId;
		ParagraphPermBase.call(this);
	}
	ParagraphPermEnd.prototype = Object.create(ParagraphPermBase.prototype);
	ParagraphPermEnd.prototype.constructor = ParagraphPermEnd;
	ParagraphPermEnd.Type = para_PermStart;
	ParagraphPermEnd.fromObject = function(obj)
	{
		if (!obj)
			return null;
		
		return new ParagraphPermEnd(obj.id);
	};
	ParagraphPermEnd.prototype.Copy = function()
	{
		return new ParagraphPermEnd(this.rangeId);
	};
	ParagraphPermEnd.prototype.Write_ToBinary2 = function(writer)
	{
		writer.WriteLong(AscDFH.historyitem_type_ParagraphPermStart);
		
		writer.WriteString2("" + this.Id);
		writer.WriteString2("" + this.rangeId);
	};
	ParagraphPermEnd.prototype.Read_FromBinary2 = function(reader)
	{
		this.Id      = reader.GetString2();
		this.rangeId = reader.GetString2();
	};
	
	//--------------------------------------------------------export----------------------------------------------------
	AscWord.ParagraphPermStart = ParagraphPermStart;
	AscWord.ParagraphPermEnd   = ParagraphPermEnd;
})();

