define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('newspaperService', function($http, $q){
    console.log("Starting newspaperService");

    this.fitsInABox = function(item, thresholdForBoxes, thresholdForLetters){
      return Math.round(item.quantity) <= thresholdForBoxes && Math.round(item.quantity) > thresholdForLetters;
    };
    this.fitsInALetter = function(item, thresholdForLetters){
      return Math.round(item.quantity) <= thresholdForLetters;
    };
    this.fitsInAMono = function(item, thresholdForBoxes){
      return Math.round(item.quantity) > thresholdForBoxes;
    };


    /**
     * Secret sauce formula to calculate the weight of on item of the newspaper 'Les Affaires'
     * @param pages the number of pages of the newspaper
     * @return the total weight of a single newspaper in Kg.
     */
    this.getNewspaperWeight = function(pages){
      return (((11*13.5*(pages/2)*70)/950)/1000)/2.2046;
    };

    /**
     * Return the max number of newspapers that can be fitted in a box.
     *  A box can be 23 Kg max and generally the items are packaged by groups of ten
     * @param itemWeight the weight in kg of a single newspaper
     * @return the max number of newspaper (multiple of ten) that can be fit in a box (max 23 Kg.)
     */
    this.getThresholdForBoxes = function(itemWeight){
      var maxNet = 23/itemWeight;
      return Math.round(maxNet - (23 % itemWeight));
    };


    /**
     * Return the max number of newspapers that can be fitted in a letter.
     * Set to 10 for now until we know better
     * @return the max number of newspaper that can be fit in a letter (10 for now))
     */
    this.getThresholdForLetters = function(){
      return 10;
    };
  });
});
