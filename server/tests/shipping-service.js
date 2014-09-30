var assert = require("assert");
var sinon = require("sinon");
var shippingService = require("../shipping-service.js");

describe('Shipping service', function(){
  var props = {};
  beforeEach(function(){
    shippingService.init({
      box15:{
        min: 2800,
        max: 4000,
        available: true
      },
      box17:{
        min: 1000,
        max: 2800,
        available: true
      },
      envT7:{
        min: 400,
        max: 1000,
        available: true
      },
      envT6:{
        min: 0,
        max: 400,
        available: true
      }
    });
  });

  describe('#calculate', function(){
    it('should return 4 box15 for 400 items of 40 pages (16000 pages)', function(){
      var results = shippingService.calculate(400, 40);
      assert.deepEqual([100,100,100,100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 4 box15 for 401 items of 40 pages (16040 pages)', function(){
      var results = shippingService.calculate(401, 40);
      assert.deepEqual([100,100,100,100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([1], results.envT6);
    })

    it('should return 4 box15 for 380 items of 40 pages (15200 pages)', function(){
      var results = shippingService.calculate(380, 40);
      assert.deepEqual([100,100,100,80], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 3 box15 and 1 box 17 for 350 items of 40 pages (14000 pages)', function(){
      var results = shippingService.calculate(350, 40);
      assert.deepEqual([100,100,100], results.box15);
      assert.deepEqual([50], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })


    it('should return 1 box15 for 100 items of 40 pages (4000 pages)', function(){
      var results = shippingService.calculate(100, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 2 box15 for 180 items of 40 pages (4000 + 3200 pages)', function(){
      var results = shippingService.calculate(180, 40);
      assert.deepEqual([100,80], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 1 of each for 162 items of 40 pages (6480 pages)', function(){
      var results = shippingService.calculate(162, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([62], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 1 box15 and 1 box 17 for 140 items of 40 pages (4000 + 1600 pages)', function(){
      var results = shippingService.calculate(140, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([40], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 1 box15 and 1 env T7 for 112 items of 40 pages (4000 + 480 pages)', function(){
      var results = shippingService.calculate(112, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([12], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 1 box15 and 1 env T6 for 110 items of 40 pages (4000 + 400 pages)', function(){
      var results = shippingService.calculate(110, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([10], results.envT6);
    })

    it('should return 1 box15 and 1 env T7 for 102 items of 40 pages (4000 + 80 pages)', function(){
      var results = shippingService.calculate(102, 40);
      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([2], results.envT6);
    })

    it('should return 1 box15 and 1 env T7 for 100 items of 44 pages (4400)', function(){
      var results = shippingService.calculate(100, 44);
      assert.deepEqual([90], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([10], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 1 box15 and 1 env T7 for 100 items of 92 pages (9200)', function(){
      var results = shippingService.calculate(100, 92);
      assert.deepEqual([43,43], results.box15);
      assert.deepEqual([14], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 0 for 0 items', function(){
      var results = shippingService.calculate(0, 40);
      assert.deepEqual([], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should return 0 for 10 items of 0 pages', function(){
      var results = shippingService.calculate(10, 0);
      assert.deepEqual([], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

  })


  describe('#calculate', function(){
    it('should not count box15 if unavailable', function(){
      shippingService.props.box15.available = false;

      var results = shippingService.calculate(100, 40);

      assert.deepEqual([], results.box15);
      assert.deepEqual([70,30], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should not count box15 and box17 if unavailable', function(){
      shippingService.props.box15.available = false;
      shippingService.props.box17.available = false;

      var results = shippingService.calculate(100, 40);

      assert.deepEqual([], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([25,25,25,25], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should not count box17 if unavailable', function(){
      shippingService.props.box17.available = false;

      var results = shippingService.calculate(120, 40);

      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([20], results.envT7);
      assert.deepEqual([], results.envT6);
    })

    it('should not count box17 and envT7 if unavailable', function(){
      shippingService.props.box17.available = false;
      shippingService.props.envT7.available = false;

      var results = shippingService.calculate(120, 40);

      assert.deepEqual([100], results.box15);
      assert.deepEqual([], results.box17);
      assert.deepEqual([], results.envT7);
      assert.deepEqual([10,10], results.envT6);
    })

  })

  describe('#getShipping', function(){
    it('should return a shipping with the given address', function(){
      var shipping = shippingService.getShipping({city: 'Montreal'});
      assert.equal('Montreal', shipping.address.city);
    })

    it('should call the calculate with the right quantity and pages', function(){
      var spy = sinon.spy(shippingService, "calculate");

      shippingService.getShipping({quantity: 112}, 40);

      assert(shippingService.calculate.calledWith(112, 40));
      shippingService.calculate.restore();
    })

    it('should call the calculate with the right quantity and pages', function(){
      var spy = sinon.stub(shippingService, "calculate").returns({box15: 4, box17: 3, envT7: 2, envT6: 1});

      var shipping = shippingService.getShipping({quantity: 0}, 0); //quantities and number of pages are irrelevant

      assert(shipping.box15, 4);
      assert(shipping.box17, 3);
      assert(shipping.envT7, 2);
      assert(shipping.envT6, 1);
    })

  })

});
