define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('addressService', function(){
    console.log("Starting addressService");
    var TOKEN = "\""

    /**
     * Detects a pattern where some parts of an address is left incomplete, assuming the reader
     * will understand it means that is is to be completed implicitely by the address just before in the list
     * Pattern : "
     * @param addresses the list of addresses to check
     */
    this.cleanIncompleteAddresses = function(addresses){
      angular.forEach(addresses, function(address, idx){
        var prevAddress = addresses[idx-1];

        if(address.company == TOKEN){
          address.company = prevAddress.company;
        }

        if(address.address == TOKEN){
          address.address = prevAddress.address;
        }

        if(address.add_comp == TOKEN){
          address.add_comp = prevAddress.add_comp;
        }

        if(address.city == TOKEN){
          address.city = prevAddress.city;
        }

        if(address.province == TOKEN){
          address.province = prevAddress.province;
        }

        if(address.zipcode == TOKEN){
          address.zipcode = prevAddress.zipcode;
        }
      })
    }
  })
});
