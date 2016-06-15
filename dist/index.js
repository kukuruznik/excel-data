'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Lookup = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var abc = function () {
	var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
		var _this = this;

		return _regenerator2.default.wrap(function _callee2$(_context2) {
			while (1) {
				switch (_context2.prev = _context2.next) {
					case 0:
						_context2.next = 2;
						return (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
							return _regenerator2.default.wrap(function _callee$(_context) {
								while (1) {
									switch (_context.prev = _context.next) {
										case 0:
											return _context.abrupt('return', 10);

										case 1:
										case 'end':
											return _context.stop();
									}
								}
							}, _callee, _this);
						}));

					case 2:
						return _context2.abrupt('return', _context2.sent);

					case 3:
					case 'end':
						return _context2.stop();
				}
			}
		}, _callee2, this);
	}));
	return function abc() {
		return ref.apply(this, arguments);
	};
}();

exports.read = read;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _strings = require('./utils/strings');

var _array = require('./utils/array');

var _lookup = require('./lookup');

var _lookup2 = _interopRequireDefault(_lookup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Lookup = _lookup2.default;

/**
* return
	for every single sheet
		{
			sheetname1 (lowercase & no space): {
				header: {
					columns: [column1, column2, ...],
					mapColumns:
					{
						column2: column2_,
						column3: column3_',
						...
					}
				},
				data [
					{column1 (lowercase & no space): value1, column2: value2, ...},
					...
				],
			},
			sheet2: {
	
			}
		}
	merging data from multiple sheet
		{
			header: {
				columns: [column1, column2, ...],
				mapColumns:
				{
					column2: column2x,
					column3: column3y',
					...
				}
			},
			data [
				{column1 (lowercase & no space): value1, column2: value2, ...},
				...
			],
		}

parameters		
 @opts
		filter sheets
			callback acceptsSheet(sheetName) to filter sheets
			callback acceptsRow(header, row) to filter rows
		data in a range
			{range: {s:{c:0, r:0}, e:{c:100, r:100}}}}
			{startRow: 1, endRow: 10}
		merge data from all sheets (ex: by year)
			{mergeData: true}
		skip rows
			{skipRows: 0}
			{specialSkipRows: {sheet1: {skipRows: 1, hasMapping: false}, sheet3: {skipRows: 1, hasMapping: false}}}
		selected columns (in lowercase and without spaces)
			{columns: [col1, colo2, ...]}
*
**/

function read(fileNames, opts) {
	var data = {};

	opts = opts || {};
	if (opts.startRow && opts.endRow) {
		opts.range = { s: { c: 0, r: opts.startRow }, e: { c: 100, r: opts.endRow } };
	}

	var files = fileNames instanceof Array ? fileNames : [fileNames];

	return new _promise2.default(function (resolve, reject) {
		var promises = files.map(function (file) {
			return readOneFile(file, opts);
		});

		_promise2.default.all(promises).then(function (results) {
			return resolve(mergeSameData(results));
		}).catch(function (err) {
			return reject(err);
		});
	});
}

function mergeSameData(arr) {
	var result = {};

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(arr), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var o = _step.value;

			for (var prop in o) {
				var _result$prop$data;

				if (result[prop]) (_result$prop$data = result[prop].data).push.apply(_result$prop$data, (0, _toConsumableArray3.default)(o[prop].data));else result[prop] = o[prop];
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return result;
}

function readOneFile(fileName, opts) {
	if (!fileName) return;

	console.log('loading file ' + _path2.default.basename(fileName));

	return new _promise2.default(function (resolve, reject) {
		var workbook = _xlsx2.default.readFile(fileName);

		//read data for each accepted sheet
		var promises = workbook.SheetNames.filter(function (sheetName) {
			return !opts.acceptsSheet || opts.acceptsSheet((0, _strings.toLowerAndNoSpace)(sheetName));
		}).map(function (sheetName) {
			return readOneSheet(workbook, fileName, sheetName, opts);
		});

		_promise2.default.all(promises).then(function (results) {
			console.log('loaded file ' + _path2.default.basename(fileName));
			resolve(mergeSameData(results));
		}).catch(function (err) {
			return reject(err);
		});
	});
}

function readOneSheet(workbook, fileName, sheetName, opts) {
	console.log('loading sheet ' + sheetName);

	var sheetData = {};
	var sheetNameLower = (0, _strings.toLowerAndNoSpace)(sheetName);

	var skipRows = opts.specialSkipRows && opts.specialSkipRows[sheetNameLower] ? opts.specialSkipRows[sheetNameLower].skipRows : opts.skipRows || 0;

	var hasMapping = opts.specialSkipRows && opts.specialSkipRows[sheetNameLower] ? opts.specialSkipRows[sheetNameLower].hasMapping : opts.hasMapping || false;

	//header to read for current sheet
	var header = readHeader(fileName, sheetName, {
		skipRows: skipRows,
		hasMapping: hasMapping
	});

	/*
 * options to read only these columns from excel
 * if param 'columns' available then use that as header else use all columns from header
 * columns must all be in lowercase and without spaces
 */

	opts.header = opts.columns || header.columns;

	var data = _xlsx2.default.utils.sheet_to_json(workbook.Sheets[sheetName], opts);

	data.splice(0, opts.hasMapping ? skipRows + 3 : skipRows + 1);

	//filter rows
	if (opts.acceptsRow) data = data.filter(function (row) {
		return opts.acceptsRow((0, _strings.toLowerAndNoSpace)(sheetName), header, row);
	});

	//add meta info to rows
	data.forEach(function (row) {
		row._sheet = sheetName.toLowerCase().replace(/ /g, '');
		row._file = fileName.toLowerCase();
	});

	/*
 if merge data, result as 
 {
 	all: { header, data }
 }
 */
	if (opts.mergeData) {
		if (!sheetData.all) {
			sheetData.all = {
				header: header,
				data: data
			};
		} else {
			sheetData.all.data.push(data);
		}
	} else {
		/*
  not merge, result as
  {
  	sheet1: { header, data },
  	sheet2: { header, data },
  	...
  }
  */

		if (sheetData[sheetNameLower]) {
			sheetData[sheetNameLower].data.push(data);
		} else {
			sheetData[sheetNameLower] = {
				header: header,
				data: data
			};
		}
	}

	console.log('loaded sheet ' + sheetName);
	return _promise2.default.resolve(sheetData);
}

/**
* return
 {
	columns: [column1, column2, ...],
	mapColumns: 
	{
		column1: column1_,
		column2: column2_,
		....
	}
 }
 params
 @opts
	filter sheets
		callback acceptsSheet(sheetName) to filter
	header
 		{skipRows: 0} --start row

		mapping: next 2 rows after header for mapping
 			{hasMapping: true}
			ex:
				column1		column2		column3
		        	x 		   			   x
*			 	c1_map					 c3_map
**/
function readHeader(fileName, sheetName, opts) {
	opts = opts || {};
	opts.header = 1;

	var startRow = opts.skipRows || 0;
	var endRow = opts.hasMapping ? startRow + 2 : startRow;
	opts.range = { s: { c: 0, r: startRow }, e: { c: 100, r: endRow } };

	var workbook = _xlsx2.default.readFile(fileName);

	//extract header from the first accepted sheet
	var sheetNameLower = (0, _strings.toLowerAndNoSpace)(sheetName);

	if (!opts.acceptsSheet || opts.acceptsSheet(sheetNameLower)) {
		var data = _xlsx2.default.utils.sheet_to_json(workbook.Sheets[sheetName], opts);

		var result = {
			originalColumns: data[0],
			columns: (0, _array.toLowerAndNoSpaceStringsArray)(data[0]),
			mapColumns: {}
		};

		if (opts.hasMapping) {
			// data[0]: columns header
			// data[1]: 'x' or nothing, 'x' = having mapping
			// data[2]: map to enum/decimal/hex
			for (var i = 0; i < data[0].length; i++) {
				if (data[1][i] === 'x') {
					var columnLower = (0, _strings.toLowerAndNoSpace)(data[0][i]);
					var mapColumnLower = (0, _strings.toLowerAndNoSpace)(data[2][i]);
					result.mapColumns[columnLower] = mapColumnLower;
				}
			}
		}

		return result;
	}

	return null;
}