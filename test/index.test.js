import {expect} from 'chai'
import {readHeader, readData} from '../dist/index'

describe('excel reader', () => {
	describe('#readHeader', () => {
		it('should have valid header', () => {			

			const headerRows = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1
				})

			//return only one row
			expect(headerRows.length).to.equal(1)

			//return correct header columns
			const headerColumns = headerRows[0]
			expect(headerColumns).to.eql(['Name','Email','Age','Lowest Level','Highest Level','Decimal Value','Hex Value'])
		})

		it('should have valid map header', () => {			

			const headerRows = readHeader(
				'./test/test.xlsx', 
				{
					atRow: 1,
					hasMapping: true
				})

			//return 3 rows
			expect(headerRows.length).to.equal(3)

			//return correct header columns & map columns
			const headerColumns = headerRows[0]
			expect(headerColumns).to.eql(['Name','Email','Age','Lowest Level','Highest Level','Decimal Value','Hex Value'])

			const mapColumns = headerRows[2]
			expect(mapColumns).to.eql([, , ,'SalaryLevel','Salary Level','Decimal','Hex'])
		})
	})

	describe('#readData', () => {
		it('should return only data for filtered sheets (salarylevel)', () => {			
			const data = readData(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName === 'salarylevel'
					})

			//not return data for sheet staffs
			expect(data.staffs).to.be.undefined

			//return data for sheet salarylevel
			expect(data.salarylevel).not.to.be.undefined

		})

		it('should have valid data', () => {			
			const headerRows = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				})

			const columns = headerRows[0]

			const data = readData(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName === 'staffs',
						header: columns,
						skipRows: 4
					})

			const staffs = data.staffs

			expect(staffs[0].email).to.equal('john@gmail.com')
			expect(staffs[0]['decimalvalue']).to.equal('3232')
		})
	})
})