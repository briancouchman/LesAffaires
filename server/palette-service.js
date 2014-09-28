var Palette = require('./domain/Palette');

module.exports = {
  props: null,

  init: function(_props){
    this.props = _props;

    console.log("Palette service is initialized");
  },


  /**
   * Calculate the necessary palettes for a given quntity
   * @param quantity the total number of items to package
   * return a palette
   */
  calculate: function(address){
    if(this.props == null) {
      throw new Error("Palette service must be initialized with properties. Call init(properties).");
    }
    if(typeof this.props.palette === "undefined") {
      throw new Error("The configuration does not contain properties for palettes. Fix the config.json file");
    }

    var palettes = [];


    var quantityLeft = address.quantity;
    while(quantityLeft > 0){
      var palette = this.calculatePalette(quantityLeft);
      palette.address = address;

      palettes.push(palette);

      quantityLeft = quantityLeft - palette.getTotal();
    }

    return palettes;
  },

  calculatePalette: function(quantity){

    var palette = this.createPalette(this.props.palette.maxPacketsPerLevel, this.props.palette.maxItemsPerPacket, this.props.palette.maxLevelsPerPalette);

    palette.addItems(quantity);

    return palette;
  },

  getPalettes: function(address){
    return  this.calculate(address);
  },


  createPalette: function(maxPacketsPerLevel, maxItemsPerPacket, maxLevelsPerPalette){
    return new Palette(maxPacketsPerLevel, maxItemsPerPacket, maxLevelsPerPalette);
  }
}
