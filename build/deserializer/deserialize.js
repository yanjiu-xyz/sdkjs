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

/**
 * @typedef {'word' | 'cell' | 'slide'} Editor
 */

/**
 * @param {string} line
 * @return {boolean}
 */
function isStackTrace(line) {
	return (
		/^(at\s)?(\w+|\.|\$|\[|\])+.*http.*\.js/.test(line) &&
		!/Script|StackTrace/.test(line)
	);
}

/**
 * @param {string} string
 * @return {string}
 */
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A class whose instance can dereference properties in a particular version. One instance - one version.
 * @class
 */
class Deserializer {
	/**
	 * @param {string} version version in cache for dereference
	 * @param {boolean} isNewSourceMaps New or old maps should be used (feature/source-maps)
	 */
	constructor(version, isNewSourceMaps = false) {
		/** @type {string} */
		this.version = version;
		/** @type {boolean} */
		this.isNewSourceMaps = isNewSourceMaps;
		if (this.isNewSourceMaps) {
			this.serializedProps = {
				word: fs.readFileSync(
					`${__dirname}/cache/${this.version}/${NEW_PROPS_MAP_WORD_NAME}`,
					{ encoding: 'utf-8' }
				),
				cell: fs.readFileSync(
					`${__dirname}/cache/${this.version}/${NEW_PROPS_MAP_CELL_NAME}`,
					{ encoding: 'utf-8' }
				),
				slide: fs.readFileSync(
					`${__dirname}/cache/${this.version}/${NEW_PROPS_MAP_SLIDE_NAME}`,
					{ encoding: 'utf-8' }
				),
			};
		} else {
			this.serializedProps = fs.readFileSync(
				`${__dirname}/cache/${this.version}/${OLD_PROPS_MAP_NAME}`,
				{ encoding: 'utf-8' }
			);
		}
	}
	/**
	 * @private
	 * @param {string} prop
	 * @param {'word', 'cell', slide} editor
	 * @return {string}
	 */
	_deserializeProp(prop, editor = null) {
		if (this.isNewSourceMaps) {
			const re = new RegExp(`\\w*:${prop}\\s`, 'g');
			return (
				re
					.exec(this.serializedProps[editor])?.[0]
					.replace(`:${prop.replace('$', '\\$')}\n`, '') || prop
			);
		} else {
			const re = new RegExp(`\\w*\\:${prop.replace('$', '\\$')}\\s`, 'g');
			return (
				re.exec(this.serializedProps)?.[0].replace(`:${prop}\n`, '') || prop
			);
		}
	}
	/**
	 * Parses dot-separated properties in string.
	 * @private
	 * @param {string} expression
	 * @param {Editor} editor
	 * @return {string}
	 */
	_deserializePropsString(expression, editor) {
		let result = '';
		const delimiters = expression.matchAll(/\.|\[|\]/g);
		const expressionArray = expression.split(/\.|\[|\]/g);
		const changedExpressions = expressionArray.map((exp) => 
			this._deserializeProp(exp, editor),
		);
		changedExpressions.forEach((exp) => {
			let next = delimiters.next();
			result = result += exp + (next.done ? '' : next.value);
		});
		return result;
	}
	/**
	 * @private
	 * @param {string} expression
	 * @return {string}
	 */
	_deserializeExpression(expression) {
		if (/at\s+http.*\.js/.test(expression)) {
			return expression;
		}
		const url = /http.*\.js/.exec(expression)?.[0];
		if (/sdkjs/.test(url)) {
			const editor = new RegExp(`word|cell|slide`, 'g').exec(url)?.[0];
			const propsRegExp = /^(at)?\s?(new)?\s?(\w+|\.|\$|\[|\])*/;
			const props = propsRegExp
				.exec(expression)?.[0]
				.replace(/at\s|new\s/g, '')
				.trim();
			const changedExpression = this._deserializePropsString(props, editor);
			return expression.replace(
				expression,
				`${expression} (${changedExpression})`
			);
		} else {
			return expression;
		}
	}
	/**
	 * @private
	 * @param {string} header
	 */
	_parseHeader(header) {
		header = header.replace(/"/g, '').trim();
		let result = header.replace(/,|\n|\\n/g, '\n');
		let typeError = /TypeError.*/.exec(result)?.[0];
		if (typeError) {
			let errorProp =
				/\'\w*\'/.exec(typeError)?.[0].replace(/'/g, '') ||
				/(\w+|\.|\$|\[|\])*\sis\s.*/
					.exec(typeError)?.[0]
					.replace(/\sis\s.*/, '')
					.trim();
			if (errorProp) {
				result = result.replace(
					new RegExp(escapeRegExp(typeError), 'g'),
					`${typeError} (${this._deserializePropsString(errorProp)})`
				);
			}
		}
		return result;
	}
	/**
	 * @public
	 * @param {string} error
	 * @return {string}
	 */
	deserializeError(error) {
		const errorArray = error.split(/\n|\r|\\n/);
		const expressions = [];
		const headerArray = [];
		errorArray.forEach((line) => {
			line = line.trim();
			if (/StackTrace: (at\s)?(\w+|\.|\$|\[|\])+.*http.*\.js/.test(line)) {
				expressions.push(line.replace('StackTrace: ', ''));
			}
			isStackTrace(line) ? expressions.push(line) : headerArray.push(line);
		});
		const header = this._parseHeader(headerArray.join('\n').trim());
		const changedExpressions = expressions.map((expression) =>
			this._deserializeExpression(expression)
		);
		let result = 'Header:\n' + header + '\n';
		changedExpressions.forEach((expression) => {
			result += `${expression}\n`;
		});
		return result;
	}
}

class Controller {
	constructor() {
		/**
		 * @type {Map.<string, Deserializer>}
		 */
		this.deserializers = new Map();
		/**
		 * @private
		 * @enum
		 */
		this._MapsCheckingType = {
			NotExists: 1,
			New: 2,
			Old: 3,
			Error: 4,
		};
	}
	/**
	 * @private
	 * @param {string} error
	 * @return {string}
	 */
	_getVersion(error) {
		return /\d+\.(\d+\.?)+\-\d+/.exec(error)?.[0];
	}
	/**
	 * @private
	 * @param {string} errors
	 * @return {Array.<string>}
	 */
	_parseErrors(errors) {
		const result = [''];
		let isHeader = false;
		let index = 0;
		errors
			.split(/\n|\\n/)
			.map((line) => line.trim())
			.forEach((line) => {
				if (!isStackTrace(line) && !isHeader) {
					isHeader = true;
					index += 1;
					result[index] = '';
				} else if (isStackTrace(line)) {
					isHeader = false;
				}
				result[index] += line + '\n';
			});
		return result;
	}
	/**
	 * @private
	 * @param {Array.<string>} errors
	 * @return {Set.<string>}
	 */
	_getVersions(errors) {
		const set = new Set();
		errors.forEach((error) => {
			if (this._getVersion(error)) {
				set.add(this._getVersion(error));
			}
		});
		return set;
	}
	/**
	 * @private
	 * @param {string} path
	 * @return {number}
	 */
	_checkMaps(path) {
		const files = fs.readdirSync(path);
		if (
			files.includes(NEW_PROPS_MAP_WORD_NAME) &&
			files.includes(NEW_PROPS_MAP_CELL_NAME) &&
			files.includes(NEW_PROPS_MAP_SLIDE_NAME)
		) {
			return this._MapsCheckingType.New;
		} else if (files.includes(OLD_PROPS_MAP_NAME)) {
			return this._MapsCheckingType.Old;
		} else if (files.length == 0) {
			return this._MapsCheckingType.NotExists;
		} else {
			return this._MapsCheckingType.Error;
		}
	}
	/**
	 * @private
	 * @param {string} version
	 * @return {number}
	 */
	_checkVersionInCache(version) {
		const path = `${__dirname}/cache/${version}`;
		if (fs.existsSync(path)) {
			return this._checkMaps(path);
		} else {
			return this._MapsCheckingType.NotExists;
		}
	}
	/**
	 * @param {string} path
	 * @param {string} version
	 * @return {boolean} returns whether maps were found
	 */
	_findLastMaps(path, version) {
		console.log(`Trying to find it in ${path}`);
		if (
			fs.existsSync(path) &&
			(this._checkMaps(path) == this._MapsCheckingType.New ||
				this._checkMaps(path) == this._MapsCheckingType.Old)
		) {
			const mapsType = this._checkMaps(path);
			if (!fs.existsSync(`${__dirname}/cache/${version}`)) {
				fs.mkdirSync(`${__dirname}/cache/${version}`);
			}
			if (mapsType == this._MapsCheckingType.Old) {
				fs.renameSync(
					`${path}/${OLD_PROPS_MAP_NAME}`,
					`${__dirname}/cache/${version}/${OLD_PROPS_MAP_NAME}`
				);
			} else {
				fs.renameSync(
					`${path}/${NEW_PROPS_MAP_WORD_NAME}`,
					`${__dirname}/cache/${version}/${NEW_PROPS_MAP_WORD_NAME}`
				);
				fs.renameSync(
					`${path}/${NEW_PROPS_MAP_CELL_NAME}`,
					`${__dirname}/cache/${version}/${NEW_PROPS_MAP_CELL_NAME}`
				);
				fs.renameSync(
					`${path}/${NEW_PROPS_MAP_SLIDE_NAME}`,
					`${__dirname}/cache/${version}/${NEW_PROPS_MAP_SLIDE_NAME}`
				);
			}
			this.deserializers.set(
				version,
				new Deserializer(version, mapsType === this._MapsCheckingType.New)
			);
			return true;
		} else {
			return false;
		}
	}
	run(inputFile = INPUTFILE, outputFile = OUTPUTFILE) {
		const errors = this._parseErrors(
			fs.readFileSync(inputFile, { encoding: 'utf-8' })
		);
		const versions = this._getVersions(errors);
		if (!fs.existsSync(`${__dirname}/cache`)) {
			fs.mkdirSync(`${__dirname}/cache`);
		}
		versions.forEach((version) => {
			switch (this._checkVersionInCache(version)) {
				case this._MapsCheckingType.Old:
					this.deserializers.set(version, new Deserializer(version, false));
					versions.delete(version);
					break;
				case this._MapsCheckingType.New:
					this.deserializers.set(version, new Deserializer(version, true));
					versions.delete(version);
					break;
				case this._MapsCheckingType.NotExists:
					break;
				case this._MapsCheckingType.Error:
					console.log(
						`Something wrong with maps in ${__dirname}/cache/${version}\nWill consider it non-existent.`
					);
					break;
			}
		});
		if (versions.size == 1) {
			const version = versions.values().next().value;
			console.log('One version missing. Trying to find it automatically...');
			if (this._findLastMaps(`${__dirname}/../maps`, version)) {
				console.log(
					`Map was found in ${__dirname}/../maps This map will be used as a ${version} version.`
				);
			} else if (this._findLastMaps(`${__dirname}/..`, version)) {
				console.log(
					`Map was found in ${__dirname}/.. This map will be used as a ${version} version.`
				);
			} else if (this._findLastMaps(`${__dirname}`, version)) {
				console.log(
					`Map was found in ${__dirname}/.. This map will be used as a ${version} version.`
				);
			} else {
				console.error(
					`No maps found in build folder.\n` +
						`Not enough versions found! Found: ${this.deserializers.size}. Expected: ${versions.size}\n` +
						`Tip: If only one version is missing, it can be found automatically in build folder.`
				);
				process.exit();
			}
		} else if (versions.size > 1) {
			console.error(
				`Not enough versions found!` +
					`Found: ${this.deserializers.size}. Expected: ${versions.size}\n` +
					`Tip: If only one version is missing, it can be found automatically in build folder.`
			);
			process.exit();
		}
		const resultArray = errors.map((error) => {
			if (this._getVersion(error)) {
				return this.deserializers
					.get(this._getVersion(error))
					.deserializeError(error);
			} else {
				return error;
			}
		});
		const result = resultArray.join('\n');
		fs.writeFileSync(outputFile, result, { encoding: 'utf-8' });
	}
}
const controller = new Controller();
console.log('Running...');
controller.run(INPUTFILE, OUTPUTFILE);
