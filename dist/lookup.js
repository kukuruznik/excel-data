'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _object = require('./utils/object');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
contains many enums loaded from multiple excel file. 
each will be from a separated excel sheet

	enums
	{
		enums1: {header, data},
		enums2: {header, data},
		....
	}

*/

var Lookup = function () {
	/*
 @enumsData: loaded from excel files
 */

	function Lookup() {
		var _this = this;

		(0, _classCallCheck3.default)(this, Lookup);

		this.enums = {};

		//merge all enumsData into only one

		for (var _len = arguments.length, enumsData = Array(_len), _key = 0; _key < _len; _key++) {
			enumsData[_key] = arguments[_key];
		}

		enumsData.forEach(function (enumData) {
			for (var key in enumData) {
				_this.enums[key] = enumData[key];
			}
		});
	}

	(0, _createClass3.default)(Lookup, [{
		key: 'getEnums',
		value: function getEnums() {
			return this.enums;
		}
	}, {
		key: 'getEnum',
		value: function getEnum(name) {
			return this.enums[name] || this.enums[name + 's'];
		}

		/*
  return 
  	enum item
  @key
  	could be a single value or an object	
  */

	}, {
		key: 'lookupValue',
		value: function lookupValue(key, enumName) {
			var theEnum = this.getEnum(enumName);

			if (theEnum) {
				var enumItems = theEnum.data.filter(function (i) {
					return key instanceof Object ? (0, _object.partOfObject)(key, i) && (0, _object.equalsWithoutCaseSentitive)(key, i) : (0, _object.equalsWithoutCaseSentitive)(i.key, key);
				});

				//must match only one enum
				if (enumItems && enumItems.length === 1) return enumItems[0];
			}

			return null;
		}

		/*
  find enum name: if no enum found for @name, then find with value in mapping row
  */

	}, {
		key: 'lookupName',
		value: function lookupName(name, mapColumns) {
			var enumName = mapColumns ? mapColumns[name] || name : name;

			if (this.enums && this.enums[enumName]) return enumName;

			return null;
		}
	}]);
	return Lookup;
}();

module.exports = Lookup;