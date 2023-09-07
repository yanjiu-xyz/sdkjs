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
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
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

const fs = require('node:fs');
// Input and output file with errors
const INPUTFILE = process.argv[2] ? `${__dirname}/${process.argv[2]}` : `${__dirname}/input.txt`;
const OUTPUTFILE = `${__dirname}/output.txt`;
// Old serialized props map
const OLD_PROPS_MAP_NAME = 'sdk-all.props.js.map';
// New serialized props map
const NEW_PROPS_MAP_WORD_NAME = 'word.props.js.map';
const NEW_PROPS_MAP_CELL_NAME = 'cell.props.js.map';
const NEW_PROPS_MAP_SLIDE_NAME = 'slide.props.js.map';

function readProps(file) {
	let props = fs.readFileSync(file, {encoding: 'utf-8'});
	let propsLines = props.split('\n');
	let propsMap = {};
	propsLines.forEach(function (line) {
		let lineElems = line.split(':');
		propsMap[lineElems[1]] = lineElems[0]
	});
	return propsMap;
}

function run(inputFile = "unique.txt", outputFile = "deserialized.txt", mapsDir="maps")
{
	let sdkMaps = {};
	console.log('Read: ', inputFile);
	let propsReplaced = 0;
	let text = fs.readFileSync(inputFile, {encoding: 'utf-8'});
	let lines = text.split('\n');
	let replaced = lines.map((line) => {
		let sdkMatchRes = line.match(/\/([a-zA-z0-9\-\.]*)\/sdkjs\/([a-zA-z0-9\-\.]*)\//);

		if (!sdkMatchRes || 3 !== sdkMatchRes.length) {
			return line;
		}
		let maps = sdkMaps[sdkMatchRes[0]];
		if (!maps) {
			let pathProps = `${mapsDir}/${sdkMatchRes[1]}/${sdkMatchRes[2]}.props.js.map`;
			let pathVars = `${mapsDir}/${sdkMatchRes[1]}/${sdkMatchRes[2]}.vars.js.map`;
			console.log(`Read maps: ${pathProps} and ${pathVars}`);
			sdkMaps[sdkMatchRes[0]] = {props: readProps(pathProps), vars: readProps(pathVars)};
		}
		if (maps) {
			line = line.replace(/(new )?([a-zA-z0-9$]*)(@http| \(http)/, (match, p1, p2, p3) => {
				let props = p1 ? maps.vars[p2] : maps.props[p2];
				if (props) {
					propsReplaced++;
					return `${p1 || ''}${p2}(${props})${p3}`
				} else {
					return match
				}
			});
		}
		return line;
	});
	console.log(`Number of replaced properties: ${propsReplaced}`);

	let output = replaced.join('\n');
	fs.writeFileSync(outputFile, output, {encoding: 'utf-8'});
	console.log('Complete writeFileSync:' + outputFile);
}

run.apply(this, process.argv.slice(2));
