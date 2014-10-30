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

  doc.fontSize(10);
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
            .text("FACTURE", 380, 80, {width: 100, align: 'right'});

    this.doc.fontSize(11)
            .text("Date: " + new Date(Date.now()).toLocaleDateString(), 180, 120, {width: 300, align: 'right'});

    this.generateTable(shippings);

  },

  generateTable: function(shippings){
    var currencyRenderer = function(item){
          return item && item + ' $' || ''
    }

    var tableOptions = {
        columns:[
            { id: 'container', width: 40, name: 'Type de boite'},
            { id: 'quantity', width: 10, name: 'Quantite' },
            { id: 'unitPrice', width: 25, name: 'Prix unitaire', renderer: currencyRenderer },
            { id: 'total', width: 15, name: 'Prix unitaire', renderer: currencyRenderer  }
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
    this.doc.table(boxes, tableOptions);
  },

  getBoxes: function(shippings){
    var boxes = { box15: { qty: 0, price: 0 }, box17: { qty: 0, price: 0 }, envT7: { qty: 0, price: 0 }, envT6: { qty: 0, price: 0 }, qtyTotal: 0, priceTotal: 0 };

    for(var i = 0; i < shippings.length; i++){
      var shipping = shippings[i];

      for(var j = 0; j < shipping.box15.length; j++){
        boxes.box15.qty += shipping.box15[j];
      }
      boxes.box15.price = (boxes.box15.qty * props.box15.price).toFixed(2);

      for(var j = 0; j < shipping.box17.length; j++){
        boxes.box17.qty += shipping.box17[j];
      }
      boxes.box17.price = (boxes.box17.qty * props.box17.price).toFixed(2);

      for(var j = 0; j < shipping.envT7.length; j++){
        boxes.envT7.qty += shipping.envT7[j];
      }
      boxes.envT7.price = (boxes.envT7.qty * props.envT7.price).toFixed(2);

      for(var j = 0; j < shipping.envT6.length; j++){
        boxes.envT6.qty += shipping.envT6[j];
      }
      boxes.envT6.price = (boxes.envT6.qty * props.envT6.price).toFixed(2);

      boxes.qtyTotal = (boxes.box15.qty + boxes.box17.qty + boxes.envT7.qty + boxes.envT6.qty);
      boxes.priceTotal = parseFloat(boxes.box15.price) + parseFloat(boxes.box17.price) + parseFloat(boxes.envT7.price) + parseFloat(boxes.envT6.price);
    }

    return [
      {container: 'Boites de 15 pouces', quantity: boxes.box15.qty, unitPrice: parseFloat(props.box15.price), total: boxes.box15.price },
      {container: 'Boites de 17 pouces', quantity: boxes.box17.qty, unitPrice: parseFloat(props.box17.price), total: boxes.box17.price },
      {container: 'Enveloppe T7', quantity: boxes.envT7.qty, unitPrice: parseFloat(props.envT7.price), total: boxes.envT7.price },
      {container: 'Enveloppe T6', quantity: boxes.envT6.qty, unitPrice: parseFloat(props.envT6.price), total: boxes.envT6.price},
      {container: 'Total', quantity: boxes.qtyTotal, unitPrice: "", total: boxes.priceTotal }
    ]
  },

  close: function(){
    this.doc.end()
  }
}
