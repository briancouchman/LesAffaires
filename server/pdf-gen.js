var PDFDocument = require("pdfkit");
var fs = require("fs");



var getFilename = function(address){
  var filename = '';
  if(isDefined(address.company)){
    filename = address.company;
    filename += "-";
  }
  filename += address.dest;
  return filename;

}

var isDefined = function(obj){
  return obj != null && obj != '' && typeof obj !== 'undefined';
}


module.exports = {
  init: function(filename){
    this.doc = new PDFDocument({
      layout: 'landscape',
      size: [283.46, 467.72]
    });
    this.doc.pipe(fs.createWriteStream(filename));
  },

  generateSticker: function(address){
    if(this.doc == null){
      throw Error("You must call init first");
    }
    // Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage

    this.doc.image('./img/logo.png', 0, 15, {width: 300});

    this.doc.fontSize(10)
    var cursor = this.doc.text(address.address, 306, 30, {width: 200})

    if(isDefined(address.add_comp)){
      cursor.text(address.add_comp)
    }
    if(isDefined(address.city)){
      var city_line = address.city + " (" + address.province + ") " + address.zipcode;
      cursor.text(city_line).moveDown(0.4);
    }
    if(isDefined(address.phone)){
      cursor.text('Telephone ' + address.phone);
    }

    if(isDefined(address.dest)){
      this.doc.fontSize(16)
      this.doc.text(address.dest, 50, 175, {width: 400});
    }
    this.doc.addPage();
  },

  close: function(){
    this.doc.end()
  }
}
