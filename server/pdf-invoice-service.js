'use strict';

var PDFDocument = require('pdfkit' );
var fs = require("fs");

var props;

var _font = __dirname + '/font/Arial_Narrow.ttf'


var isDefined = function(obj){
  return obj != null && obj != '' && typeof obj !== 'undefined';
}

var addLesAffairesLogo = function(doc){

  doc.image(__dirname + '/img/logo_lesaffaires.png', 5, 15, {width: 150});

  doc.fontSize(8);
  doc.font(_font);
  doc.text("1100, boul. René-Lévesque Ouest, 24e étage", 200, 20, {width: 150})
     .text("Montréal (Québec) H3B 4X9").moveDown(0.4)
     .text("Téléphone: 514-392-9000");

}


module.exports = {
  init: function(_props){
    props = _props;
  },

  start: function(){
    if(props && typeof props.pdf !== "undefined" && props.pdf.dir == null && props.pdf.ext == null){
      throw new Error("PDF service must be initialized with the pdf configuration. Call pdfService.init(props);");
    }

    var filename = "invoice-" + Date.now().toString();
    var filepath = __dirname + props.pdf.dir + "/" + filename + props.pdf.ext;

    this.doc = new PDFDocument({
      layout: 'portrait',
      size:'A4',
      margin:10
    });
    this.doc.pipe(fs.createWriteStream(filepath));

    return filename;
  },


  generateInvoice: function(shippings){
    if(this.doc == null){
      throw Error("You must call init first");
    }

    if(shippings == null){
      throw Error("No shippings. Cannot generate an invoice.");
    }
    // Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage

    addLesAffairesLogo(this.doc);

    this.doc.fontSize(11)
            .text("", 30, 120, {width: 200});

    this.doc.fontSize(20)
            .text("INVOICE", 280, 80, {width: 60, align: 'right'});

    this.doc.fontSize(11)
            .text("Invoice Date: " );

    this.generateTable(shippings);

    this.doc.addPage();
  },

  generateTable: function(shippings){
    var tableOptions = {
        columns:[
            { id: 'container', width: 40, name: 'Type de boite' },
            { id: 'quantity', width: 10, name: 'Quantite' },
            { id: 'unitPrice', width: 25, name: 'Prix unitaire' },
            { id: 'total', width: 15, name: 'Prix unitaire' }
        ],
        y: 300,
        margins: {
            left: 40,
            top: 0,
            right: 40,
            bottom: 20
        },
        padding: {
            left: 10,
            top: 10,
            right: 10,
            bottom: 10
        },
        font: _font,
        boldFont: _font
    };
    var boxes = this.getBoxes(shippings);
    console.log(boxes);
    this.doc.table(boxes, tableOptions);
  },

  getBoxes: function(shippings){
    var boxes = { box15: 0, box17: 0, envT7: 0, envT6: 0 };

    for(var i = 0; i < shippings.length; i++){
      var shipping = shippings[i];

      for(var j = 0; j < shipping.box15.length; j++){
        boxes.box15 += shipping.box15[j];
      }
      for(var j = 0; j < shipping.box17.length; j++){
        boxes.box17 += shipping.box17[j];
      }
      for(var j = 0; j < shipping.envT7.length; j++){
        boxes.envT7 += shipping.envT7[j];
      }
      for(var j = 0; j < shipping.envT6.length; j++){
        boxes.envT6 += shipping.envT6[j];
      }
    }

    return [
      {container: 'Boites de 15 pouces', quantity: boxes.box15, unitPrice: parseFloat(props.box15.price), total: (boxes.box15 * props.box15.price).toFixed(2) },
      {container: 'Boites de 17 pouces', quantity: boxes.box17, unitPrice: parseFloat(props.box17.price), total: (boxes.box17 * props.box17.price).toFixed(2) },
      {container: 'Enveloppe T7', quantity: boxes.envT7, unitPrice: parseFloat(props.envT7.price), total: (boxes.envT7 * props.envT7.price).toFixed(2) },
      {container: 'Enveloppe T6', quantity: boxes.envT6, unitPrice: parseFloat(props.envT6.price), total: (boxes.envT6 * props.envT6.price).toFixed(2) }
    ];
  },

  close: function(){
    this.doc.end()
  }
}
