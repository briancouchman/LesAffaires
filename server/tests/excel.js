var assert = require("assert");
var sinon = require("sinon");
var excel = require("../excel");

describe('Excel', function(){
  var records;

  before(function(){
    records = [
      ['','',''],
      ['Adressage', '','']
    ];
  });

  describe('#getStartRow', function(){
    it('should return -1 when the records are empty', function(){
      assert.equal(-1, excel.getStartRow([]));
    })

    it('should return -1 when the records are null', function(){
      assert.equal(-1, excel.getStartRow(null));
    })

    it('should return -1 when the records do not contain a marker', function(){
      assert.equal(-1, excel.getStartRow([ ['','',''], ['','','']]));
    })

    it('should return the expected start row when records contains a marker', function(){
      assert.equal(1, excel.getStartRow(records));
    })
  })


  describe('#extractAddresses', function(){
    it('should return empty array if the records are empty', function(){
      assert.deepEqual([], excel.extractAddresses([[]]));
    })

    it('should return empty array if the records are null', function(){
      assert.deepEqual([], excel.extractAddresses(null));
    })
    it('should not return addresses that have not postal code', function(){
      assert.deepEqual([], excel.extractAddresses([['','','350 rue Caisse','','','','']]));
    })
    it('should not return addresses that have a postal code but no quantity', function(){
      assert.deepEqual([], excel.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', 0]]));
    })
    it('should return address with the address, the zip code and the quantity', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10}], excel.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', 10]]));
    })
    it('should return address with the address, the zip code and the quantity as a string', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10}], excel.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10']]));
    })
    it('should return address with the address, the zip code, and the addresse complement', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, add_comp: "appt B204"}], excel.extractAddresses([['','','350 rue Caisse','appt B204','','','H2G2S3', '10']]));
    })
    it('should return address with the address, the zip code, and the city', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, city: "Montreal"}], excel.extractAddresses([['','','350 rue Caisse','','Montreal','','H2G2S3', '10']]));
    })
    it('should return address with the address, the zip code, and the province', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, province: "Québec"}], excel.extractAddresses([['','','350 rue Caisse','','','Québec','H2G2S3', '10']]));
    })
    it('should return address with the address, the zip code, and the recipient', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, dest: "Mr Jean Tremblay"}], excel.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', 'Mr Jean Tremblay']]));
    })
    it('should return address with the address, the zip code, and the recipient\'s company', function(){
      assert.deepEqual([{address: '350 rue Caisse', zipcode:'H2G2S3', quantity: 10, company: 'Air Canada'}], excel.extractAddresses([['','','350 rue Caisse','','','','H2G2S3', '10', '', 'Air Canada']]));
    })
  })

  describe('#processRecords', function(){
    it('should call getStartRow', function(){
      //given
      var spy = sinon.spy(excel, "getStartRow");
      var records = [['']];

      //when
      excel.processRecords(records);

      //then
      assert(excel.getStartRow.calledOnce);
      assert(excel.getStartRow.calledWith(records));
      excel.getStartRow.restore();
    })

    it('should call extractAddresses with the a subset of the array of records', function(){
      //given
      var records = [['0'],['1'],['2']];
      var spy = sinon.spy(excel, "extractAddresses");
      var stub = sinon.stub(excel, "getStartRow").withArgs(records).returns(1);

      //when
      excel.processRecords(records);

      //then
      assert(excel.extractAddresses.calledOnce);
      assert(excel.extractAddresses.calledWith([['1'],['2']]));
      excel.getStartRow.restore();
      excel.extractAddresses.restore();
    })


    it('should call the callback with the result of extractAddresses', function(){
      //given
      var records = [['0']];
      var callback = sinon.spy();
      var stub = sinon.stub(excel, "extractAddresses").returns([['test']]);

      //when
      excel.processRecords(records, callback);

      //then
      assert(callback.calledOnce);
      assert(callback.calledWith([['test']]));
      excel.extractAddresses.reset();
    })

  })
})
