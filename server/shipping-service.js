var Shipping = require('./domain/Shipping');


module.exports = {
  props: {},

  init: function(_props){
    this.props = _props;

    console.log("Shipping service is initialized");
  },

  calculate: function(quantity, pages){
    if(this.props == null) {
      throw new Error("Shiping service must be initialized with properties. Call init(properties).");
    }


    var box15 = 0, box17 = 0, envT7 = 0, envT6 = 0;

    var totalPages = quantity * pages;
    var pagesLeft = totalPages;

    if(totalPages < this.props.box15.min){
      box15 = 0;
    }
    if(totalPages >= this.props.box15.min && totalPages <= this.props.box15.max){
      box15 = 1;
    } else{
      while(pagesLeft > this.props.box15.min || pagesLeft > this.props.box17.max){
        pagesLeft = pagesLeft - this.props.box15.max;
        box15++;
      }
      while(pagesLeft > this.props.box17.min){
        pagesLeft = pagesLeft - this.props.box17.max;
        box17++;
      }
      while(pagesLeft > this.props.envT7.min){
        pagesLeft = pagesLeft - this.props.envT7.max;
        envT7++;
      }
      while(pagesLeft > this.props.envT6.min){
        pagesLeft = pagesLeft - this.props.envT6.max;
        envT6++;
      }
    }

    return {
      box15: box15,
      box17: box17,
      envT7: envT7,
      envT6: envT6
    }
  },

  getShipping: function(address, pages){
    var boxes = this.calculate(address.quantity, pages);
    var shipping = this.createShipping();
    shipping.address = address;
    shipping.box15 = boxes.box15;
    shipping.box17 = boxes.box17;
    shipping.envT7 = boxes.envT7;
    shipping.envT6 = boxes.envT6;

    return shipping;
  },

  createShipping: function(){
    return new Shipping();
  }

}
