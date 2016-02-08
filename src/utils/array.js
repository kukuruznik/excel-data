import {toLowerAndNoSpace} from './strings'

export function toLowerAndNoSpaceStringsArray(arr) {
	arr = arr || []
	return arr.map(i => toLowerAndNoSpace(i))
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