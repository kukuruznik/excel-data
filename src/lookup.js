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
class Lookup {
	/*
	@enumsData: loaded from excel files
	*/
	constructor(...enumsData) {
		this.enums = {}

		//merge all enumsData into only one
		enumsData.forEach(enumData => {
			for(const key in enumData)
				this.enums[key] = enumData[key]
		})
	}

	getEnums(){
		return this.enums
	}

	/*
	return 
		enum item
	using param @match if lookup basing on multiple columns
	@match = (enum item, key) => bool
	*/
	lookupValue(key, enumName, match) {
		const theEnum = this.enums[enumName]

		if (theEnum) {
			const enumItems = 
					theEnum.data.filter(i => 
						match ? 
							match(i, key) : 
							i.key === key)

			//must match only one enum
			if (enumItems && enumItems.length === 1)
				return enumItems[0]
		}

		return null
	}	

	/*
	find enum name: if no enum found for @name, then find with value in mapping row
	*/
	lookupName(name, mapColumns) {
		let enumName =	
				mapColumns ?
					mapColumns[name] || name :
					name

		if (this.enums && this.enums[enumName])
			return enumName

		return null
	}	
}

module.exports = Lookup