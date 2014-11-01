var excelParser = require('excel-parser');

module.exports = {
    parseExcel: function (filename, callback, errorCallback){
        console.log("Parsing " + filename);
        excelParser.parse({
            inFile: filename,
            worksheet: 1
        },function(err, records){
            if(err) {
                console.error("Parsing with error: " + err);
                errorCallback.call(this, err);
            }else{
                console.log("Parsing successful");
                //console.log(records);
                this.processRecords(records, callback);
            }
        }.bind(this));
    },
    processRecords: function (records, callback) {
        var startRow = this.getStartRow(records);

        var edition = {
            addresses: this.extractAddresses(records.slice(startRow)),
            date: this.getEditionDate(records)
        }

        if(typeof callback === 'function'){
            callback.call(this, edition);
        }
    },

    getEditionDate: function(records){
        return new String(records[3][5]);
    },

    getStartRow: function(records){
        var startRow = -1;

        if(records != null && typeof records !== "undefined") {
            //Find the starting point
            for(var i=0; i < records.length; i++){
                var row = records[i];
                if(row[0] == "Adressage"){
                    startRow = i;
                    break;
                }
            }
        }

        return startRow;
    },


  extractAddresses: function(records){
    var addresses = [];

    if(records != null && typeof records !== "undefined"){
      var ADDRESS=2, ADD_COMP=3, CITY=4, PROVINCE=5, ZIPCODE=6, QUANTITY=7, DEST=8, COMPANY=9, DAY=10, HOUR=11,CARRIER=15;
      for(var j=0; j < records.length; j++){
        var row = records[j];
        if(row[ZIPCODE] != '' && row[QUANTITY] > 0){
          try{
            var address = {};
            if(row[ADDRESS] != "" && typeof row[ADDRESS] !== "undefined")   address.address = row[ADDRESS];
            if(row[ADD_COMP] != "" && typeof row[ADD_COMP] !== "undefined") address.add_comp = row[ADD_COMP];
            if(row[CITY] != "" && typeof row[CITY] !== "undefined")         address.city = row[CITY];
            if(row[PROVINCE] != "" && typeof row[PROVINCE] !== "undefined") address.province = row[PROVINCE];
            if(row[ZIPCODE] != ""  && typeof row[ZIPCODE] !== "undefined")  address.zipcode = row[ZIPCODE];
            if(row[QUANTITY] != "" && typeof row[QUANTITY] !== "undefined") address.quantity = row[QUANTITY];
            if(row[DEST] != "" && typeof row[DEST] !== "undefined")         address.dest = row[DEST];
            if(row[COMPANY] != "" && typeof row[COMPANY] !== "undefined")   address.company = row[COMPANY];
            if(row[DAY] != "" && typeof row[DAY] !== "undefined")           address.day = row[DAY];
            if(row[HOUR] != "" && typeof row[HOUR] !== "undefined")         address.hour = row[HOUR];
            if(row[CARRIER] != "" && typeof row[CARRIER] !== "undefined")   address.carrier = row[CARRIER];

            addresses.push(address);
          }catch(e){
            console.log("error " + e);
          }
        }
      }
    }

    return addresses;
  }
};
