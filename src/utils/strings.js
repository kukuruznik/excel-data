function toLowerAndNoSpace(s) {
	if (s === undefined || s === null)
		return s
		
	return s.toLowerCase().replace(/ /g, '')
}

module.exports = {
	toLowerAndNoSpace
}