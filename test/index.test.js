import {expect} from 'chai'
import read from '../src/index'

describe('excel reader', () => {	
	describe('#read', () => {
		it('should return only data for filtered sheets (salarylevel)', () => {			
			const data = read(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName === 'salarylevel'
					})

			//not return data for sheet staffs
			expect(data.staffs).to.be.undefined

			//return data for sheet salarylevel
			expect(data.salarylevel).not.to.be.undefined
			expect(data.salarylevel.header).not.to.be.undefined
			expect(data.salarylevel.data).not.to.be.undefined
		})

		it('should have valid header columns', () => {			
			const data = read(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName.indexOf('staffs') > -1,
						hasMapping: true,
						skipRows: 1
					})						

			expect(data.staffs.header.columns).to.eql(['name', 'email', 'age', 'lowestlevel', 'highestlevel', 'decimalvalue', 'hexvalue'])
		})

		it('should have valid header columns mapping', () => {			
			const data = read(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName.indexOf('staffs') > -1,
						hasMapping: true,
						skipRows: 1
					})						

			expect(data.staffs.header.mapColumns).to.eql({
				'lowestlevel': 'salarylevel', 
				'highestlevel': 'salarylevel', 
				'decimalvalue': 'decimal', 
				'hexvalue': 'hex'})
		})

		it('should have valid data', () => {
			const data = read(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName.indexOf('staffs') > -1,
						hasMapping: true,
						skipRows: 1
					})						

			expect(data.staffs.data.filter(i => i.email === 'john@gmail.com')).not.to.be.null
			expect(data.staffs.data.filter(i => i.decimalvalue === '3232')).not.to.be.null
		})

		it('should merge data from 2 sheets', () => {			
			const data = read(
					'./test/test.xlsx', 
					{
						acceptsSheet: (sheetName) => sheetName.indexOf('staffs') > -1,
						hasMapping: true,
						skipRows: 1,
						mergeData: true
					})			

			//data in sheet#staffs
			expect(data.all.data.filter(i => i.email === 'john@gmail.com')).not.to.be.null
			expect(data.all.data.filter(i => i.decimalvalue === '3232')).not.to.be.null

			// //data in sheet#staffs_2015
			 expect(data.all.data.filter(i => i.email === 'bill@gmail.com')).not.to.be.null
			 expect(data.all.data.filter(i => i.hexvalue === '8A9B1')).not.to.be.null
		})
	})
})