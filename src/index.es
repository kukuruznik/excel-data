import xlsx from 'xlsx'
import {toLowerAndNoSpace} from './utils/strings'
import {toLowerAndNoSpaceStringsArray} from './utils/array'

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
 		{skipRows: 0} --start row

		mapping: next 2 rows after header for mapping
 			{hasMapping: true}
			ex:
				column1		column2		column3
		        	x 		   			   x
*			 	c1_map					 c3_map
**/	
function readHeader(fileName, sheetName, opts) {
	opts = opts || {}
	opts.header = 1;

	const startRow = opts.skipRows || 0
	const endRow = opts.hasMapping ? startRow + 2 : startRow;	
	opts.range = { s: {c: 0, r: startRow}, e: {c: 100, r: endRow}}

	const workbook = xlsx.readFile(fileName)	

	//extract header from the first accepted sheet
	const sheetNameLower = toLowerAndNoSpace(sheetName)

	if (opts.acceptsSheet === undefined || opts.acceptsSheet(sheetNameLower)) {
		const data = xlsx.utils.sheet_to_json(
					workbook.Sheets[sheetName], 
					opts)

		const result = { 
			columns: toLowerAndNoSpaceStringsArray(data[0]),
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

	return null;
}



/**
* return
	for every single sheet
		{
			sheetname1 (lowercase & no space): {
				header: {
					columns: [column1, column2, ...],
					mapColumns:
					{
						column2: column2_,
						column3: column3_',
						...
					}
				},
				data [
					{column1 (lowercase & no space): value1, column2: value2, ...},
					...
				],
			},
			sheet2: {
	
			}
		}
	merging data from multiple sheet
		{
			header: {
				columns: [column1, column2, ...],
				mapColumns:
				{
					column2: column2x,
					column3: column3y',
					...
				}
			},
			data [
				{column1 (lowercase & no space): value1, column2: value2, ...},
				...
			],
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
		skip rows
			{skipRows: 0}
*
**/
function readExcelData(fileName, opts) {
	opts = opts || {}
	const skipRows = opts.skipRows || 0

	if (opts.startRow !== undefined && opts.endRow !== undefined) {
		opts.range = { s: {c: 0, r: opts.startRow}, e: {c: 100, r: opts.endRow}}
	}	

	let sheetsData = {}
	const workbook = xlsx.readFile(fileName)	
	
	//read data for each accepted sheet
	workbook.SheetNames.forEach( sheetName => {		
		const sheetNameLower = toLowerAndNoSpace(sheetName)

		if (opts.acceptsSheet === undefined || opts.acceptsSheet(sheetNameLower)) {

			//header to read for current sheet
			const header = 
				readHeader(
					fileName, 
					sheetName,
					{
						skipRows: skipRows,
						hasMapping: opts.hasMapping
					})

			opts.header = header.columns


			let data = xlsx.utils.sheet_to_json(
							workbook.Sheets[sheetName], 
							opts)

			data.splice(
				0, 
				opts.hasMapping ? skipRows + 3 : skipRows + 1
				)

			//if merge data, result as {header, data}
			if (opts.mergeData) {
				if (sheetsData.header === undefined) {
					sheetsData = {
						header: header,
						data: data
					}
				}
				else {
					sheetsData.data.push(data)
				}
			}
			else {
				/*
				not merge, result as
				{
					sheet1: {header, data},
					sheet2: {header, data},
					...
				}
				*/

				sheetsData[sheetNameLower] = {
					header: header,
					data: data
				}
			}
		}
	})

	return sheetsData
}


export {
	readExcelData
}