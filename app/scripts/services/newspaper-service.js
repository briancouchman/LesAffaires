define(['angular', 'app'], function(angular, app) {
  //console.log("Defining services");
  return app.service('newspaperService', function(){
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
     * A box can contain mximum 4000
     * ** Rounding to the closest mutliple of 5 **
     * @param numberOfPages the number of pages for a newspapaer
     * @return the max number of newspaper that can be fit in a box (max 4000 pages)
     */
    this.getThresholdForBoxes = function(numberOfPages){
      if(numberOfPages == 0) return 0;
      return Math.floor(4000 / numberOfPages);
    };

    this.getThresholdForBigBoxes = function(numberOfPages){
      if(numberOfPages == 0) return 0;
      return Math.floor(4000 / numberOfPages);
    };

    this.getThresholdForSmallBoxes = function(numberOfPages){
      if(numberOfPages == 0) return 0;
      return Math.floor(2800 / numberOfPages);
    };

   /**
    * Return the max number of newspapers that can be fitted in a pile.
    * A pile can be 23 Kg max and generally the items are packaged by groups of ten
    * @param itemWeight the weight in kg of a single newspaper
    * @return the max number of newspaper (multiple of ten) that can be fit in a pile (max 23 Kg.)
    */
    this.getThresholdForPiles = function(itemWeight){
      var maxNet = 23/itemWeight;
      return Math.round(maxNet - (23 % itemWeight));
    };


    /**
     * Return the max number of newspapers that can be fitted in a letter.
     * Set to 10 for now until we know better
     * @return the max number of newspaper that can be fit in a letter (10 for now))
     */
    this.getThresholdForBigLetters = function(){
      if(numberOfPages == 0) return 0;
      return Math.floor(1100 / numberOfPages);
    };

    this.getThresholdForSmallLetters = function(){
      if(numberOfPages == 0) return 0;
      return Math.floor(400 / numberOfPages);
    };

    this.getThresholdForLetters = function(){
      return 10;
    };


// maximum dans les grandes boites (4000 pages par boite)
// 30 adresses (lignes d'adresse)
// ideal: commande avec boite 15 pouces + 1 enveloppe
// chaque adresse va avoir son propre set d'envoi (# boites, # enveloppes, etc)
// les PDFS doivent refleter ca
//chaque etiquette doit indiquer la quantite, partielle et totale, et le numero d'envoi (1 sur 3, 2 sur 3..etc)
// les enveloppes coutent 6 fois plus cher que les boites.
// par ordre de prix boite de 25, boite de 17 env T7, env T6
// tous ont un minimum, sauf les boites T6
// small box : 17 pouces -> 2800 pages
// big box : 15 pouces -> 4000 pages
// big letter : T7 -> 1100 pages
// small letter : T6 -> 400 pages




  });
});
