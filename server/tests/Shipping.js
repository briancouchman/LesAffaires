var assert = require("assert");
var sinon = require("sinon");
var Shipping = require("../domain/Shipping.js");

describe('Shipping service', function(){

  beforeEach(function(){

  })


  describe('#addBox15', function(){
    it('should return add 1 box of 100 items', function(){
      var shipping = new Shipping (40);

      shipping.addBox15(4000);

      assert.deepEqual([100], shipping.box15);
    })

    it('should return add 1 box of 90 items and 40 pages of leftOver', function(){
      var shipping = new Shipping (44);

      var leftOver = shipping.addBox15(4000);

      assert.deepEqual([90], shipping.box15);
      assert.equal(40, leftOver);
    })

    it('should return add 1 box of 90 items and 40 pages of leftOver', function(){
      var shipping = new Shipping (92);

      var leftOver = shipping.addBox15(4000);

      assert.deepEqual([43], shipping.box15);
      assert.equal(44, leftOver);
    })
  })
})
