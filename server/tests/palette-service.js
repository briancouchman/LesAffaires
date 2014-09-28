var assert = require("assert");
var sinon = require("sinon");
var paletteService = require("../palette-service.js");

describe('Palette service', function(){
  var props = {};
  before(function(){

  });


  describe('#calculatePalette', function(){
    it('should initialize a palette object properly', function(){
      var spy = sinon.spy(paletteService, "createPalette");
      paletteService.init({
        palette: {
          maxPacketsPerLevel: 11,
          maxItemsPerPacket: 25,
          maxLevelsPerPalette: 10
        }
      });

      paletteService.calculatePalette(1);

      assert(paletteService.createPalette.calledWith(11,25,10));
      paletteService.createPalette.restore();
    })
  });

  describe('#calculate', function(){
    it('should return 1 palette for 2000 items', function(){
      paletteService.init({
        palette: {
          maxPacketsPerLevel: 11,
          maxItemsPerPacket: 25,
          maxLevelsPerPalette: 10
        }
      });

      var palettes = paletteService.calculate({quantity: 2000});

      assert.equal(1, palettes.length);
    })

    it('should return 2 palette for 3000 items', function(){
      paletteService.init({
        palette: {
          maxPacketsPerLevel: 11,
          maxItemsPerPacket: 25,
          maxLevelsPerPalette: 10
        }
      });

      var palettes = paletteService.calculate({quantity: 3000});

      assert.equal(2, palettes.length);
    })

    it('should return 4 palettes for 8828 items', function(){
      paletteService.init({
        palette: {
          maxPacketsPerLevel: 11,
          maxItemsPerPacket: 25,
          maxLevelsPerPalette: 10
        }
      });

      var palettes = paletteService.calculate({quantity: 8828});

      assert.equal(4, palettes.length);
    })

    it('should return an error if the service is not initialized', function(){
      try{
        paletteService.calculate(1);
      }catch(error){
        assert.equal(error.description, "Palette service must be initialized with properties. Call init(properties).");
      }
    })

    /*it('should return an error if properties dont have palette configuration', function(){
      paletteService.init({
        whatever: 'something',
        noPaletteHere: 'nope'
      })

      try{
        paletteService.calculate(1);
      }catch(error){
        assert.equal(error.description, "The configuration does not contain properties for palettes. Fix the config.json file");
      }
    })*/
  });
});
