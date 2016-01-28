import xlsx from 'xlsx'
import {toLowerAndNoSpace} from './utils/strings'
import {toLowerAndNoSpaceStringsArray} from './utils/array'

/**
* return
	{
		sheetname1 (lowercase & no space): 
		[
			{column1 (lowercase & no space): value1, column2: value2, ...},
			...
		],
		sheetname2: 
		[
			{column1 (lowercase & no space): value1, column2: value2, ...},
			...
		],
		...
	}
 @opts
		filter sheets
			callback acceptsSheet(sheetName) to filter
		format
 			data as json
 				without header
 			data as matrix
				{header:1}
			data as (column letter, value)
				{header:'A'}
			data with user-defined column names
				{header:2}
		data in a range
			{range: {s:{c:0, r:0}, e:{c:100, r:100}}}}
			{startRow: 1, endRow: 10}
		merge data from all sheets (ex: by year)
			{mergeData: true}
*
**/
function readData(fileName, opts) {
	opts = opts || {}
	if (opts.startRow !== undefined) {
		opts.range = { s: {c: 0, r: opts.startRow}, e: {c: 100, r: opts.endRow}}
	}

	//transform all columns into lowercase & without spaces
	if(Array.isArray(opts.header))
		opts.header = toLowerAndNoSpaceStringsArray(opts.header)

	const skipRows = opts.skipRows || 0

	let sheetToData = []

	const workbook = xlsx.readFile(fileName)	
	
	//read data for each accepted sheet
	workbook.SheetNames.forEach( sheetName => {		
		const sheetNameLower = toLowerAndNoSpace(sheetName)

		if (opts.acceptsSheet === undefined || opts.acceptsSheet(sheetNameLower)) {
			let data = xlsx.utils.sheet_to_json(
							workbook.Sheets[sheetName], 
							opts)

			data.splice(0, skipRows)

			if (opts.mergeData)
				sheetToData = sheetToData.concat(data)
			else
				sheetToData[sheetNameLower] = data
		}
	})

	return sheetToData
}


/**
* return
 {
	columns: [column1, column2, ...],
	mapColumns: 
	{
		column1: column1_,
		column2: column2_,
		....
	}
 }
 params
 @opts
	filter sheets
		callback acceptsSheet(sheetName) to filter
	header
 		{atRow: 1} --start row

		mapping: next 2 rows after header for mapping
 			{hasMapping: true}
			ex:
				column1		column2		column3
		        	x 		   			   x
*			 	c1_map					 c3_map
**/	
function readHeader(fileName, opts) {
	opts = opts || {}
	opts.header = 1;

	const startRow = opts.atRow || 0
	const endRow = opts.hasMapping ? startRow + 2 : startRow;	
	opts.range = { s: {c: 0, r: startRow}, e: {c: 100, r: endRow}}

	const workbook = xlsx.readFile(fileName)	

	//extract header from the first accepted sheet
	for(const sheetName of workbook.SheetNames) {		
		const sheetNameLower = toLowerAndNoSpace(sheetName)

		if (opts.acceptsSheet === undefined || opts.acceptsSheet(sheetNameLower)) {
			const data = xlsx.utils.sheet_to_json(
						workbook.Sheets[sheetName], 
						opts)

			const result = { 
				columns: data[0],
				mapColumns: {}
			}

			if (opts.hasMapping) {
				// data[0]: columns header
				// data[1]: 'x' or nothing, 'x' = having mapping
				// data[2]: map to enum/decimal/hex
				for (let i=0; i<data[0].length; i++)
					if (data[1][i] === 'x') {
						const columnLower = toLowerAndNoSpace(data[0][i])
						const mapColumnLower = toLowerAndNoSpace(data[2][i])
						result.mapColumns[columnLower] = mapColumnLower
					}
			}

			return result;
		}
	}

	return null;
}

export {
	readData,
	readHeader
}