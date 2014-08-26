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

var addTranscontinentalAddress = function(doc){

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
      size: 'A4',
      margin:20
    });
    this.doc.pipe(fs.createWriteStream(filename));
  },

  generateLabel: function(address){
    if(this.doc == null){
      throw Error("You must call init first");
    }
    // Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage

    addTranscontinentalAddress(this.doc);

    this.doc.fontSize(12)
    cursor=this.doc.text("", 50, 160, {width: 600});

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


    this.doc.addPage();
  },

  close: function(){
    this.doc.end()
  }
}
