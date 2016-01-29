import {toLowerAndNoSpace} from './strings'

function toLowerAndNoSpaceStringsArray(arr) {
	arr = arr || []
		
	for(const i in arr)
		arr[i] = toLowerAndNoSpace(arr[i])

	return arr
}

module.exports = {
	toLowerAndNoSpaceStringsArray
}