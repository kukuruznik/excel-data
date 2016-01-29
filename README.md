# Installation
```javascript
npm install excel-data
```

# Read Data
```javascript
// import read from 'excel-data'
var read = require('excel-data');
```

##### 1. Read data from all sheets
```javascript
var data = read('test.xlsx');
```


##### 2. Read data from all sheets - ignore top rows (skipRows)
```javascript
var data = read(
		'test.xlsx', 
		{
			skipRows: 1
		});
```


##### 3. Read & merge data from all sheets (same data info)
```javascript
var data = read(
		'test.xlsx', 
		{
			mergeData: true
		});
```


##### 4. Read data from all sheets - has header columns mapping
```javascript
var data = read(
		'test.xlsx', 
		{
			hasMapping: true,
		});
```


##### 5. Read data from filtered sheets
```javascript
var data = read(
		'test.xlsx', 
		{
			//acceptsSheet: sheetName => sheetName === 'staffs_2015'
			acceptsSheet: function(sheetName) { return sheetName === 'staffs_2015' }
		});
```
