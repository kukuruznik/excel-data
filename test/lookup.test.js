import {expect} from 'chai'
import {read, Lookup} from '../src/index'

describe('Lookup', () => {
	let lookup

	before(() => {
		Promise
			.all([
					read('./test/test_data/lookup/global_lookup_tables.xlsx'),
					read('./test/test_data/lookup/local_lookup_tables.xlsx')
				])
			.then(data => lookup = new Lookup(...data))
	})

	describe('#load', () =>
		it('load all enums', () => {		
			const enums = lookup.getEnums()
			expect(enums.years).not.to.be.undefined
			expect(enums.unknow).to.be.undefined
		})
	)

	describe('#lookupName', () => {
		
		it('has mapping columns', () => {				
			const mapColumns = {
				_protocol_: 'protocols'
			}

			const enumName = lookup.lookupName('_protocol_', mapColumns)
			expect(enumName).to.equal('protocols')
		})
		

		it('none-existing enum', () => {
			const enumName = lookup.lookupName('_protocol_', null)
			expect(enumName).to.be.null
		})
	})


	describe('#lookupValue', () => {
		
		it('valid enum', () => {								
			const enumItem = lookup.lookupValue('PROTOCOL_BOSCH', 'protocols')
			expect(enumItem.value).to.equal('9')
		})
		

		it('invalid enum', () => {				
			const enumItem = lookup.lookupValue('DUMMY KEY', 'protocols')
			expect(enumItem).to.be.null
		})


		it('for enums basing  on multiple columns', () => {
			const enumItem = lookup.lookupValue(
				{
					key: '07:Pending///13 B0:Current///13 80:History///01 0A:Permanent',
					offset: '1',
					dtcframe: '1',
					dtcformat: '1'
				}, 
				'readdtccommandlist')
			
			expect(enumItem.key).to.equal('07:Pending///13 B0:Current///13 80:History///01 0A:Permanent')
			expect(enumItem.offset).to.equal('1')
			expect(enumItem.dtcframe).to.equal('1')
			expect(enumItem.dtcformat).to.equal('1')
			expect(enumItem.value).to.equal('88')
		})	
	})
})	
