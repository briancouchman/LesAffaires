var Shipping = require('./domain/Shipping');


module.exports = {
  props: {},

  init: function(_props){
    this.props = _props;

    console.log("Shipping service is initialized");
  },

  calculateBox15: function(shipping){
    while(this.pagesLeft > this.props.box15.min || this.pagesLeft > this.props.box17.max){
      var _pages = this.pagesLeft >= this.props.box15.max ? this.props.box15.max : this.pagesLeft;
      var leftOver = shipping.addBox15(_pages);

      this.pagesLeft = this.pagesLeft - this.props.box15.max + leftOver;
    }
  },

  calculateBox17: function(shipping){
    while(this.pagesLeft > this.props.box17.min){
      var _pages = this.pagesLeft >= this.props.box17.max ? this.props.box17.max : this.pagesLeft;
      var leftOver = shipping.addBox17(_pages);

      this.pagesLeft = this.pagesLeft - this.props.box17.max + leftOver;
    }
  },

  calculateEnvT7: function(shipping){
    while(this.pagesLeft > this.props.envT7.min){
      var items = this.pagesLeft >= this.props.envT7.max ? this.props.envT7.max : this.pagesLeft;
      var leftOver = shipping.addEnvT7(items);

      this.pagesLeft = this.pagesLeft - this.props.envT7.max + leftOver;
    }
  },

  calculateEnvT6: function(shipping){
    while(this.pagesLeft > this.props.envT6.min){
      var items = this.pagesLeft >= this.props.envT6.max ? this.props.envT6.max : this.pagesLeft;
      var leftOver = shipping.addEnvT6(items);

      this.pagesLeft = this.pagesLeft - this.props.envT6.max;
    }
  },

  calculate: function(quantity, pages){
    if(this.props == null) {
      throw new Error("Shiping service must be initialized with properties. Call init(properties).");
    }

    var shipping = this.createShipping(pages);

    var totalPages = quantity * pages;
    this.pagesLeft = totalPages;

    if(totalPages >= this.props.box15.min && totalPages <= this.props.box15.max && this.props.box15.available ){
      shipping.addBox15(totalPages);
    } else {
      if(this.props.box15.available) this.calculateBox15(shipping);
      if(this.props.box17.available) this.calculateBox17(shipping);
      if(this.props.envT7.available) this.calculateEnvT7(shipping);
      if(this.props.envT6.available) this.calculateEnvT6(shipping);
    }

    return shipping;
  },

  getShipping: function(address, pages){
    var shipping = this.calculate(address.quantity, pages);
    shipping.address = address;
    shipping.quantity = address.quantity;

    return shipping;
  },

  createShipping: function(pages){
    return new Shipping(pages);
  }

}
