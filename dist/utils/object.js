'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.partOfObject = partOfObject;
exports.equalsWithoutCaseSentitive = equalsWithoutCaseSentitive;
function partOfObject(part, o) {
	if (part && o) {
		for (var propName in part) {
			if (part[propName] !== o[propName]) return false;
		}
	} else return false;

	return true;
}

function equalsWithoutCaseSentitive(o1, o2) {
	//o1, o2 are simple type
	if (!(o1 instanceof Object) && !(o2 instanceof Object)) return equalFields(o1, o2);

	//o1, o2 are objects
	for (var propName in o1) {
		if (!equalFields(o1[propName], o2[propName])) return false;
	}return true;
}

function equalFields(f1, f2) {
	return ('' + f1).trim().toLowerCase() === ('' + f2).trim().toLowerCase();
}