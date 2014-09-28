var assert = require("assert");
var sinon = require("sinon");
var pdfService = require("../pdf--shipping-service");


describe('PDF Generation', function(){
  var shipping = {}, address = {};


  before(function(){
    pdfService.init('../pdf/test.pdf');

    address = {/*
      dest: "Brian Couchman",
      company: "Agilistic",
      add_comp: "coin Belanger / de Bordeaux",
      address: "6901, rue de Bordeaux",
      city: "Montreal",
      province: "Quebec",
      zipcode: "H2G2S3",*/
      quantity: 100
    };
    shipping = {
      address: address,
      box15: 1,
      box17: 1,
      envT7: 1,
      envT6: 0
    }
  });

  describe('#generateShipping', function(){
    it('should return -1 when the records are empty', function(){

      var spy = sinon.spy(pdfService, 'generateLabel');

      pdfService.generateShipping(shipping);

      assert.equal(3, spy.callCount);
      assert.equal(spy.args[0][0], {currentBox: 1, totalBoxes: 3, currentQty: 0, totalQty: 100, boxType: 'box15', address: address});
      assert(spy.withArgs({address: address, currentBox: 2, totalBoxes: 3, currentQty: 0, totalQty: 100, boxType: 'box17'}).calledOnce);
      assert(spy.withArgs({address: address, currentBox: 3, totalBoxes: 3, currentQty: 0, totalQty: 100, boxType: 'envT7'}).calledOnce);
    })
  })

})
