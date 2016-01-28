```javascript
// import {readHeader, readData} from 'excels-data'
var readHeader = require('excels-data').readHeader;
var readData = require('excels-data').readData;
```

###### read header
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


###### read data
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
