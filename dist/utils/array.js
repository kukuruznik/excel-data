'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toLowerAndNoSpaceStringsArray = toLowerAndNoSpaceStringsArray;

var _strings = require('./strings');

function toLowerAndNoSpaceStringsArray(arr) {
	arr = arr || [];
	return arr.map(function (i) {
		return (0, _strings.toLowerAndNoSpace)(i);
	});
}

// export function flattenArray(arr){
// 	let result = []

// 	if (arr)
// 		for(const i of arr)
// 			if (i instanceof Array)
// 				result = [...result, ...flattenArray(i)]
// 			else
// 				result = [...result, i]

// 	return result
// }