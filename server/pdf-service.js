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

var addLesAffairesLogo = function(doc){

  doc.image('./img/logo.png', 0, 15, {width: 300});

  doc.fontSize(9);
  doc.font('./font/Arial_Narrow.ttf')
  doc.text("10807 rue Mirabeau", 330, 30, {width: 300})
     .text("Anjou (Québec) H1J1T7").moveDown(0.4)
     .text("Téléphone: (514) 355-4134")
}


module.exports = {
  init: function(filename){
    this.doc = new PDFDocument({
      layout: 'landscape',
      size: [252, 360],
      margin:10
    });
    this.doc.pipe(fs.createWriteStream(filename));
  },

  generateShipping: function(shipping){
    var totalBoxes = shipping.box15 + shipping.box17 + shipping.envT7 + shipping.envT6;
    var currentBox = 1;
    for(var i = 0; i < shipping.box15; i++){
      this.generateLabel({
        address: shipping.address,
        currentBox: currentBox++,
        totalBoxes: totalBoxes,
        currentQty: 0,
        totalQty: shipping.address.quantity,
        boxType: 'box15'
      })
    }

    for(var i = 0; i < shipping.box17; i++){
      this.generateLabel({
        address: shipping.address,
        currentBox: currentBox++,
        totalBoxes: totalBoxes,
        currentQty: 0,
        totalQty: shipping.address.quantity,
        boxType: 'box17'
      })
    }

    for(var i = 0; i < shipping.envT7; i++){
      this.generateLabel({
        address: shipping.address,
        currentBox: currentBox++,
        totalBoxes: totalBoxes,
        currentQty: 0,
        totalQty: shipping.address.quantity,
        boxType: 'envT7'
      })
    }

    for(var i = 0; i < shipping.envT6; i++){
      this.generateLabel({
        address: shipping.address,
        currentBox: currentBox++,
        totalBoxes: totalBoxes,
        currentQty: 0,
        totalQty: shipping.address.quantity,
        boxType: 'envT6'
      })
    }
  },

  generateLabel: function(options){
    if(this.doc == null){
      throw Error("You must call init first");
    }
    // Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage

    //addLesAffairesLogo(this.doc);

    var address = options.address;


    this.doc.fontSize(10)
    cursor=this.doc.text("", 30, 160, {width: 300});

    if(isDefined(address.dest)){
      cursor.text(address.dest)
    }

    if(isDefined(address.company)){
      cursor.text(address.company)
    }

    if(isDefined(address.address)){
      cursor.text(address.address)
    }

    if(isDefined(address.add_comp)){
      cursor.text(address.add_comp)
    }

    if(isDefined(address.city)){
      var city_line = address.city + " (" + address.province + ")";
      cursor.text(city_line).text(address.zipcode).moveDown(0.4);
    }

    if(isDefined(address.phone)){
      cursor.text('Telephone ' + address.phone);
    }


    this.doc.fontSize(16)
            .text(options.currentBox + "/" + options.totalBoxes, 280, 80, {width: 60, align: 'right'});

    this.doc.fontSize(9)
            .text(options.currentQty + " copies", 280, 100, {width: 60, align: 'right'})
            .text("(total " + Math.round(options.totalQty) + ")", 280, 110, {width: 60, align: 'right'});

    this.doc.fontSize(9)
            .text(this.getBoxType(options.boxType), 280, 130, {width: 60, align: 'right'});


    this.doc.addPage();
  },

  getBoxType: function(boxType){
    var str = "";
    switch(boxType){
      case "box15":
      default:
        str = "Boite 15\"";
        break;

      case "box17":
        str = "Boite 17\"";
        break;

      case "envT7":
        str = "Enveloppe T7";
        break;

      case "envT6":
        str = "Enveloppe T6";
        break;
    }

    return str;
  },

  close: function(){
    this.doc.end()
  }
}
