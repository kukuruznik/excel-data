import {expect} from 'chai'
import {readHeader, readData} from '../dist/index'

describe('excel reader', () => {
	describe('#readHeader', () => {
		it('should have valid header', () => {			

			const header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,					
				})

			expect(header.columns).to.eql(['Name','Email','Age','Lowest Level','Highest Level','Decimal Value','Hex Value'])
		})

		it('should have valid map header', () => {			

			const header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				})

			expect(header.columns).to.eql(['Name','Email','Age','Lowest Level','Highest Level','Decimal Value','Hex Value'])
			
			//without mapping
			expect(header.mapColumns['name']).not.to.equal('name')
			expect(header.mapColumns['email']).not.to.equal('email')
			expect(header.mapColumns['age']).not.to.equal('age')

			//with mapping
			expect(header.mapColumns['lowestlevel']).to.equal('salarylevel')
			expect(header.mapColumns['highestlevel']).to.equal('salarylevel')
			expect(header.mapColumns['decimalvalue']).to.equal('decimal')
			expect(header.mapColumns['hexvalue']).to.equal('hex')
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
			const header = readHeader(
				'./test/test.xlsx', 
				{
					acceptsSheet: (sheetName) => sheetName === 'staffs',
					atRow: 1,
					hasMapping: true
				})

			const data = readData(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName === 'staffs',
						header: header.columns,
						skipRows: 4
					})

			const staffs = data.staffs

			expect(staffs[0].email).to.equal('john@gmail.com')
			expect(staffs[0]['decimalvalue']).to.equal('3232')
		})
	})
})