'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.toLowerAndNoSpace = toLowerAndNoSpace;
function toLowerAndNoSpace(s) {
		return !s ? s : s.toLowerCase().replace(/ /g, '');
}

// export function isNA(s) {
// 	if (s === null || s === undefined || s.trim() === '')
// 		return true

// 	s = s.toLowerCase()

// 	return s === 'na' || s === 'n/a'
// }