import {toLowerAndNoSpace} from './strings'

export function toLowerAndNoSpaceStringsArray(arr) {
	arr = arr || []
	return arr.map(i => toLowerAndNoSpace(i))
}