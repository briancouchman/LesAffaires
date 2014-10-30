'use strict'


var method = Palette.prototype;

function Palette (_packetsPerLevel, _itemsPerPacket, _levelsPerPalette){
    this.packetsPerLevel = _packetsPerLevel;
    this.itemsPerPacket = _itemsPerPacket;
    this.levelsPerPalette = _levelsPerPalette;
    this.rows = [];
    this.currentLevel = 0;

    this.rows[this.currentLevel] = [];
}

method.addItems = function(items){
  var packet = 0, itemsLeft = items;
  var paletteIsOpen = true;

  while(itemsLeft > 0 && paletteIsOpen){
    //Start a new row on the palette, the current row is maxed out
    if(this.rows[this.currentLevel].length  == this.packetsPerLevel){
      //if reached the max number of levels already, close this palette
      if(this.rows.length < this.levelsPerPalette){
        this.rows[++this.currentLevel] = [];
      }else{
        paletteIsOpen = false;
      }
    }

    if(paletteIsOpen){
      var currentPacket = itemsLeft > this.itemsPerPacket ? this.itemsPerPacket : itemsLeft;

      itemsLeft = itemsLeft - currentPacket;


      this.rows[this.currentLevel].push(currentPacket);
    }
  }
}

method.total = function(){
  var total = 0;

  for(var i = 0; i < this.rows.length; i++){
    for(var j = 0; j < this.rows[i].length; j++){
      total += this.rows[i][j];
    }
  }

  return total;
}


module.exports = Palette;
