# Installation
npm install excel-data

# Read Data
```javascript
// import {readExcelData} from 'excel-data'
var readExcelData = require('excel-data').readExcelData;
```

##### 1. Read data from all sheets
```javascript
var data = readExcelData('test.xlsx');
```


##### 2. Read data from all sheets - ignore skipRows
```javascript
var data = readExcelData(
		'test.xlsx', 
		{
			skipRows: 1
		});
```


##### 3. Read & merge data from all sheets (same data info)
```javascript
var data = readExcelData(
		'test.xlsx', 
		{
			mergeData: true
		});
```


##### 4. Read data from all sheets - has header columns mapping
```javascript
var data = readExcelData(
		'test.xlsx', 
		{
			hasMapping: true,
		});
```


##### 5. Readdata from filtered sheets
```javascript
var data = readExcelData(
		'test.xlsx', 
		{
			acceptsSheet: function(sheetName) { return sheetName === 'salarylevel' }
		});
```
