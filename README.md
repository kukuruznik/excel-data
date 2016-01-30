# Installation
```javascript
npm install excel-data
```

# Read Data
```javascript
// import {read, Lookup} from 'excel-data'
var read = require('excel-data').read;
var Lookup = require('excel-data').Lookup;
```

##### Read data from all sheets
```javascript
var data = read('test.xlsx');
```


##### Read data from all sheets - ignore top rows (skipRows)
```javascript
var data = read(
		'test.xlsx', 
		{
			skipRows: 1
		});
```


##### Read & merge data from all sheets (same data info)
```javascript
var data = read(
		'test.xlsx', 
		{
			mergeData: true
		});
```


##### Read data from all sheets - has header columns mapping
```javascript
var data = read(
		'test.xlsx', 
		{
			hasMapping: true,
		});
```


##### Read data from filtered sheets
```javascript
var data = read(
		'test.xlsx', 
		{
			//acceptsSheet: sheetName => sheetName === 'staffs_2015'
			acceptsSheet: function(sheetName) { return sheetName === 'staffs_2015' }
		});
```


# Lookup Data
```javascript
var data1 = read(
		'employee_2015.xlsx', 
		{
			skipRows: 1
			mergeData: true
		});

var data2 = read(
		'employee_2016.xlsx', 
		{
			skipRows: 1
			mergeData: true
		});

const lookup = new Lookup(
		data1,
		data2,
		...)
```	

##### lookup with one or multiple columns

```javascript
const item = lookup.lookupValue(
			{
				year: 2015, 
				level: 4
			},
			'salarylevel' //sheet name in lowercase and no spaces
		)

console.log(item.salary)
```

##### special lookup table with 2 main columns (key + value)
```javascript
const item = lookup.lookupValue('KW2000', 'protocols')
console.log(item.value)
```
