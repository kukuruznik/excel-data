# Installation
npm install excel-data

# Read Data
```javascript
// import {readHeader, readData} from 'excels-data'
var readHeader = require('excels-data').readHeader;
var readData = require('excels-data').readData;
```

##### Read header
```javascript
var header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				});
				
console.log(header.columns);
console.log(header.mapColumns['lowestlevel']);
```


##### Read data
```javascript
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
```

##### Read data from multiple sheets and merge
```javascript
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
			skipRows: 4,
			mergeData: true
		});
		
		
//data in sheet#staffs
console.log(data.filter(i => i.email === 'john@gmail.com'))

//data in sheet#staffs_2015
console.log(data.filter(i => i.email === 'bill@gmail.com'))
```
