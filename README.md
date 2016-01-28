var readHeader = require('excels-data').readHeader;
var readData = require('excels-data').readData;

// import {readHeader, readData} from 'excels-data'

/**
* read header
**/
var header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				});
				
console.log(header.columns);
console.log(header.mapColumns['lowestlevel']);



/**
* read data
**/
var header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				});

var data = readData(
		'./test/test.xlsx', 
		{
			acceptsSheet: (sheetName) => sheetName === 'staffs',
			header: header.columns,
			skipRows: 4
		});
		
		
console.log(data.staffs[0].email)
