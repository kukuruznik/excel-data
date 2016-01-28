```javascript
// import {readHeader, readData} from 'excels-data'
```

###### read header
```javascript
var readHeader = require('excels-data').readHeader;
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


###### read data
```javascript
var readData = require('excels-data').readData;
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
