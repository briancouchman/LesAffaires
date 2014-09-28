var assert = require("assert");
var sinon = require("sinon");
var excelService = require("../excel-service");

describe('Excel service', function(){
  var records;

  before(function(){
    records = [
      ['','',''],
      ['Adressage', '','']
    ];
  });

  describe('#getStartRow', function(){
    it('should return -1 when the records are empty', function(){
      assert.equal(-1, excelService.getStartRow([]));
    })

    it('should return -1 when the records are null', function(){
      assert.equal(-1, excelService.getStartRow(null));
    })

    it('should return -1 when the records do not contain a marker', function(){
      assert.equal(-1, excelService.getStartRow([ ['','',''], ['','','']]));
    })

    it('should return the expected start row when records contains a marker', function(){
      assert.equal(1, excelService.getStartRow(records));
    })
  })


  describe('#extractAddresses', function(){
    it('should return empty array if the records are empty', function(){
      assert.deepEqual([], excelService.extractAddresses([[]]));
    })

    it('should return empty array if the records are null', function(){
      assert.deepEqual([], excelService.extractAddresses(null));
    })
    it('should not return addresses that have not postal code', function(){
      assert.deepEqual([], excelService.extractAddresses([['','','350 rue Caisse','','','','']]));
    })
    it('should not return addresses that have a postal code but no quantity', function(){
      assert.deepEqual([], excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', 0]]));
    })
    it('should return address with the address, the zip code and the quantity', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', 10]])
      );
    })
    it('should return address with the address, the zip code and the quantity as a string', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10']])
      );
    })
    it('should return address with the address, the zip code, and the addresse complement', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, add_comp: "appt B204"}],
        excelService.extractAddresses([['','','350 rue Caisse','appt B204','','','H2G2S3', '10']])
      );
    })
    it('should return address with the address, the zip code, and the city', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, city: "Montreal"}],
        excelService.extractAddresses([['','','350 rue Caisse','','Montreal','','H2G2S3', '10']])
      );
    })
    it('should return address with the address, the zip code, and the province', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, province: "Québec"}],
        excelService.extractAddresses([['','','350 rue Caisse','','','Québec','H2G2S3', '10']])
      );
    })
    it('should return address with the address, the zip code, and the recipient', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, dest: "Mr Jean Tremblay"}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', 'Mr Jean Tremblay']])
      );
    })
    it('should return address with the address, the zip code, and the recipient\'s company', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, company: 'Air Canada'}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', '', 'Air Canada']])
      );
    })
    it('should return address with the address, the zip code, the recipient\'s company and the day / hour of delivery', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, company: 'Air Canada', day: 'Tuesday', hour: '11:00AM'}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', '', 'Air Canada','Tuesday', '11:00AM']])
      );
    })
    it('should return address with the address, the zip code, the recipient\'s company and the carrier', function(){
      assert.deepEqual(
        [{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, company: 'Air Canada', carrier: 'Purolator'}],
        excelService.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', '', 'Air Canada','','','','','','Purolator']])
      );
    })

  })

  describe('#processRecords', function(){
    it('should call getStartRow', function(){
      //given
      var spy = sinon.spy(excelService, "getStartRow");
      var records = [['']];

      //when
      excelService.processRecords(records);

      //then
      assert(excelService.getStartRow.calledOnce);
      assert(excelService.getStartRow.calledWith(records));
      excelService.getStartRow.restore();
    })

    it('should call extractAddresses with the a subset of the array of records', function(){
      //given
      var records = [['0'],['1'],['2']];
      var spy = sinon.spy(excelService, "extractAddresses");
      var stub = sinon.stub(excelService, "getStartRow").withArgs(records).returns(1);

      //when
      excelService.processRecords(records);

      //then
      assert(excelService.extractAddresses.calledOnce);
      assert(excelService.extractAddresses.calledWith([['1'],['2']]));
      excelService.getStartRow.restore();
      excelService.extractAddresses.restore();
    })


    it('should call the callback with the result of extractAddresses', function(){
      //given
      var records = [['0']];
      var callback = sinon.spy();
      var stub = sinon.stub(excelService, "extractAddresses").returns([['test']]);

      //when
      excelService.processRecords(records, callback);

      //then
      assert(callback.calledOnce);
      assert(callback.calledWith([['test']]));
      excelService.extractAddresses.reset();
    })

  })
})
