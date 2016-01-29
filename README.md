# Installation
npm install excel-data

# Read Data
```javascript
// import {readExcelData} from 'excels-data'
var readExcelData = require('excels-data').readExcelData;
```

##### Read header & data from filtered sheets
```javascript
var data = readExcelData(
		'test.xlsx', 
		{
			acceptsSheet: function(sheetName) { return sheetName === 'salarylevel' }
		});
```

##### Read header with mapping & data from filtered sheets
```javascript
const data = readExcelData(
		'test.xlsx', 
		{
			acceptsSheet: function(sheetName) { return sheetName.indexOf('staffs') > -1; }
			hasMapping: true,
			skipRows: 1
		});
```

##### Read header with mapping & merge data from filtered sheets
```javascript
const data = readExcelData(
		'test.xlsx', 
		{
			acceptsSheet: function(sheetName) { return sheetName.indexOf('staffs') > -1; }
			hasMapping: true,
			skipRows: 1,
			mergeData: true
		})
```
