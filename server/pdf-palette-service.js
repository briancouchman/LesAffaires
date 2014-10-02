var PDFDocument = require("pdfkit");
var fs = require("fs");


var isDefined = function(obj){
  return obj != null && obj != '' && typeof obj !== 'undefined';
}

var props;


module.exports = {


  init: function(_props){
    props = _props;
  },

  start: function(){
    if(props.pdf.dir == null && props.pdf.ext == null){
      throw new Error("PDF service must be initialized with the pdf configuration. Call pdfService.init(props);");
    }

    var filename = "palette-" + Date.now().toString();
    var filepath = __dirname + props.pdf.dir + "/" + filename + props.pdf.ext;

    this.doc = new PDFDocument({
      layout: 'portrait',
      size: 'LEGAL',
      margin:10
    });
    this.doc.pipe(fs.createWriteStream(filepath));

    return filename;
  },

  generatePalettes: function(palettes){
    var totalPalettes = palettes.length;
    var currentPalette = 1;
    for(var i = 0; i < palettes.length; i++){
      var palette = palettes[i];
      this.generateLabel({
        address: palette.address,
        currentPalette: currentPalette++,
        totalPalettes: totalPalettes,
        currentQty: 0,
        totalQty: palette.address.quantity,
        itemsPerPacket: palette.itemsPerPacket,
        packetsPerLevel: palette.packetsPerLevel
      })
    }
  },

  generateLabel: function(options){

    if(this.doc == null){
      throw Error("You must call init first");
    }
    // Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage


    var address = options.address;


    this.doc.fontSize(14)
    cursor=this.doc.text("JOB ID:", 30, 200);

    if(isDefined(address.dest)){
      cursor.text(address.dest)
    }

    if(isDefined(address.company)){
      cursor.text(address.company)
    }

    if(isDefined(address.add_comp)){
      cursor.text(address.add_comp)
    }

    if(isDefined(address.address)){
      cursor.text(address.address.toUpperCase())
    }

    if(isDefined(address.city)){
      cursor.text(address.city.toUpperCase() + " " + address.province.toUpperCase() + "")
    }

    if(isDefined(address.zipcode)){
      cursor.text(address.zipcode.toUpperCase())
    }

    if(isDefined(address.phone)){
      cursor.text('Telephone ' + address.phone);
    }

    // line
    this.addLine(310);
    var now = Date.now();
    this.doc.text("EDITION: " + now.toLocaleString("en-US", {formatMatcher: 'year, month, day', year: 'numeric', month: '2-digit', day: '2-digit'}))
    this.doc.text("TRANSPORTEUR: ")

    this.addLine(355);

    this.doc.text("").moveDown();
    this.doc.text("Skid # : " + options.currentPalette + "  /  " + options.totalPalettes).moveDown();;

    this.doc.text("QTE CETTE PALETTE: " + options.currentQty).moveDown();

    this.doc.text("Qte cumulative: ??? ");
    this.doc.text("Qte commandee: " + Math.round(options.totalQty)).moveDown();

    this.addLine(505);
    this.doc.text("Copies / Paquet: " + options.itemsPerPacket);
    this.doc.text("Paquet / Rangee: " + options.packetPerLevel);

    this.addLine(550);

    if(address.day && address.hour){
      this.doc.text("LIVRAISON " + address.day.toUpperCase() + " AVANT " + address.hour.toUpperCase());
      this.doc.text("??? EN VRAC ???");
    }

    this.doc.text("LES AFFAIRES");

    this.doc.addPage();
  },

  addLine: function(y){
    this.doc.text("").moveDown();
    this.doc.moveTo(10, y).lineTo(300, y).stroke();
  },

  close: function(){
    this.doc.end()
  }
}
