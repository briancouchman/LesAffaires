var assert = require("assert");
var sinon = require("sinon");
var Palette = require("../domain/Palette.js");

describe('Palette domain', function(){

  beforeEach(function(){

  })

  describe('#addItems', function(){
    it('should add 100 items as 4 packets on the first row', function(){
      var palette = new Palette (4,25,10); //4 packets per level, 25 items per packet, on max 10 levels

      palette.addItems(100);

      assert.deepEqual([[25,25,25,25]], palette.rows);
      assert.equal(100, palette.getTotal());
    })

    it('should add 100 items as 2x2 packets on 2 rows', function(){
      var palette = new Palette (2,25,10);

      palette.addItems(100);

      assert.deepEqual([[25,25],[25,25]], palette.rows);
      assert.equal(100, palette.getTotal());
    })

    it('should add 500 items as 2x10 packets on 2 rows', function(){
      var palette = new Palette (10,25,10);

      palette.addItems(500);

      assert.deepEqual([[25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25]], palette.rows);
      assert.equal(500, palette.getTotal());
    })

    it('should add 80 items as 4 packets on the first row', function(){
      var palette = new Palette (4,25,10);

      palette.addItems(80);

      assert.deepEqual([[25,25,25,5]], palette.rows);
      assert.equal(80, palette.getTotal());
    })

    it('should add 10 items as 1 packet on the first row', function(){
      var palette = new Palette (4,25,10);

      palette.addItems(10);

      assert.deepEqual([[10]], palette.rows);
      assert.equal(10, palette.getTotal());
    })

    it('should add 2750 items as 11 packet on 10 row', function(){
      var palette = new Palette (11,25,10);

      palette.addItems(2750);

      assert.deepEqual([
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25]
      ], palette.rows);
      assert.equal(2750, palette.getTotal());
    })


    it('should add 2750 items as 11 packet on 10 row (the max), even if given 3000 items', function(){
      var palette = new Palette (11,25,10);

      palette.addItems(3000);

      assert.deepEqual([
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25],
        [25,25,25,25,25,25,25,25,25,25,25],[25,25,25,25,25,25,25,25,25,25,25]
      ], palette.rows);
      assert.equal(2750, palette.getTotal());
    })
  })
})
