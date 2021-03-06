import path from 'path'
import xlsx from 'xlsx'
import {toLowerAndNoSpace} from './utils/strings'
import {toLowerAndNoSpaceStringsArray} from './utils/array'
export Lookup from './lookup'

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

parameters		
 @opts
		filter sheets
			callback acceptsSheet(sheetName) to filter sheets
			callback acceptsRow(header, row) to filter rows
		data in a range
			{range: {s:{c:0, r:0}, e:{c:100, r:100}}}}
			{startRow: 1, endRow: 10}
		merge data from all sheets (ex: by year)
			{mergeData: true}
		skip rows
			{skipRows: 0}
			{specialSkipRows: {sheet1: {skipRows: 1, hasMapping: false}, sheet3: {skipRows: 1, hasMapping: false}}}
		selected columns (in lowercase and without spaces)
			{columns: [col1, colo2, ...]}
*
**/
export async function read(fileNames, opts) {		
	let data = {}

	opts = opts || {}
	if (opts.startRow && opts.endRow) {
		opts.range = { s: {c: 0, r: opts.startRow}, e: {c: 100, r: opts.endRow}}
	}	

	const files = fileNames instanceof Array ? fileNames : [fileNames]	

	let promises = files.map(file => readOneFile(file, opts))

	const results = await Promise.all(promises)
	return mergeSameData(results)
}

function mergeSameData(arr) {
	let result = {}

	for(const o of arr)	
		for(const prop in o)
			if (result[prop])
				result[prop].data.push(...o[prop].data)		
			else
				result[prop] = o[prop]

	return result
}

async function readOneFile(fileName, opts) {
	if (!fileName)
		return
	
	console.log(`loading file ${path.basename(fileName)}`)

	const workbook = xlsx.readFile(fileName)

	//read data for each accepted sheet
	let promises = 
			workbook.SheetNames
				.filter(sheetName => !opts.acceptsSheet || opts.acceptsSheet(toLowerAndNoSpace(sheetName)))
				.map(sheetName => readOneSheet(workbook, fileName, sheetName, opts))

	const results = await Promise.all(promises)

	console.log(`loaded file ${path.basename(fileName)}`)	
	return mergeSameData(results)
}

function readOneSheet(workbook, fileName, sheetName, opts) {	
	console.log(`loading sheet ${sheetName}`)

	let sheetData = {}
	const sheetNameLower = toLowerAndNoSpace(sheetName)	

	const skipRows = 
			opts.specialSkipRows && opts.specialSkipRows[sheetNameLower] ?
				opts.specialSkipRows[sheetNameLower].skipRows :
				opts.skipRows || 0

	const hasMapping = 
			opts.specialSkipRows && opts.specialSkipRows[sheetNameLower] ?
				opts.specialSkipRows[sheetNameLower].hasMapping :
				opts.hasMapping || false

	//header to read for current sheet
	const header = 
		readHeader(
			fileName, 
			sheetName,
			{
				skipRows: skipRows,
				hasMapping: hasMapping
			})

	/*
	* options to read only these columns from excel
	* if param 'columns' available then use that as header else use all columns from header
	* columns must all be in lowercase and without spaces
	*/

	opts.header = opts.columns || header.columns


	let data = xlsx.utils.sheet_to_json(
					workbook.Sheets[sheetName], 
					opts)

	data.splice(
		0, 
		opts.hasMapping ? skipRows + 3 : skipRows + 1
		)

	//filter rows
	if (opts.acceptsRow)
		data = data.filter(row => opts.acceptsRow(toLowerAndNoSpace(sheetName), header, row))

	//add meta info to rows
	data.forEach(row => {
		row._sheet = sheetName.toLowerCase().replace(/ /g, '')
		row._file = fileName.toLowerCase()
	})

	/*
	if merge data, result as 
	{
		all: { header, data }
	}
	*/
	if (opts.mergeData) {
		if (!sheetData.all) {
			sheetData.all = {
				header: header,
				data: data
			}
		}
		else {
			sheetData.all.data.push(data)
		}
	}
	else {
		/*
		not merge, result as
		{
			sheet1: { header, data },
			sheet2: { header, data },
			...
		}
		*/

		if (sheetData[sheetNameLower]) {
			sheetData[sheetNameLower].data.push(data)
		}
		else {
			sheetData[sheetNameLower] = {
				header: header,
				data: data
			}
		}
	}

	console.log(`loaded sheet ${sheetName}`)
	return sheetData
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

	if (!opts.acceptsSheet || opts.acceptsSheet(sheetNameLower)) {
		const data = xlsx.utils.sheet_to_json(
					workbook.Sheets[sheetName], 
					opts)

		const result = { 
			originalColumns: data[0],
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