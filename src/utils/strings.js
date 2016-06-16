export function toLowerAndNoSpace(s) {
	return !s ? 
			s : 
			s.toLowerCase().replace(/ /g, '')
}