import Ember from 'ember';

import ScoringBase from 'sdg-promoter/mixins/scoring-base';

export default Ember.Mixin.create( ScoringBase, {
  
  arcgisValidatorConfig: Ember.inject.service(),

  itemScore: null,

  // hybrid portal item store
  hybridPortalItemStore: null,

  // dGrid utils
  gridUtils: null,

  init() {
    
    this.set('itemScore', 0);

    this.set('hybridPortalItemStore', null);

  },

  getColors (i, color1, color2) {
    const colorArray = [color1, color2];

    return colorArray[i];
  },

  scoreItem (validationResult) {
    
    let scoreObj = {
      totalScore: 0,
      items: [],
      status: ''
    };

    const thumbnailsScore = this.scoreThumbnails(validationResult.thumbnailsValidationResults);
    scoreObj.items.push( thumbnailsScore );

    const titleScore = this.scoreTitle(validationResult.titleValidationResults);
    scoreObj.items.push( titleScore );

    const snippetScore = this.scoreSnippet(validationResult.snippetValidationResults);
    scoreObj.items.push( snippetScore );

    const descriptionScore = this.scoreDescription(validationResult.descriptionValidationResults);
    scoreObj.items.push( descriptionScore );

    const accessInformationScore = this.scoreAccessInformation(validationResult.accessInformationValidationResults);
    scoreObj.items.push( accessInformationScore );

    const licenseInformationScore = this.scoreLicenseInformation(validationResult.licenseInfoValidationResults);
    scoreObj.items.push( licenseInformationScore );

    const tagsScore = this.scoreTags(validationResult.tagsValidationResults);
    scoreObj.items.push( tagsScore );

    const sharingScore = this.scoreSharing(validationResult.sharingValidationResults);
    scoreObj.items.push( sharingScore );

    const layerCountScore = this.scoreNumberOfLayers(validationResult.layersValidationResults);
    scoreObj.items.push( layerCountScore );

    const sslEnabledScore = this.scoreSSL(validationResult.sslValidationResults);

    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    if (validationResult.type === arcgisValidatorConfig.supportedTypes.WEB_MAP
        || validationResult.type === arcgisValidatorConfig.supportedTypes.WEB_MAPPING_APPLICATION
        || validationResult.type === arcgisValidatorConfig.supportedTypes.MAP_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.FEATURE_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.IMAGE_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.VECTOR_TILE_SERVICE) {
      
      // do nothing
    } else {
      // do we need to do this?
      sslEnabledScore.messages = [];
    }

    scoreObj.items.push( sslEnabledScore );

    const userProfileFullNameScore = this.scoreUserProfileFullName(validationResult.userProfileFullnameValidationResults);
    scoreObj.items.push( userProfileFullNameScore );

    const userProfileDescriptionScore = this.scoreUserProfileDescription(validationResult.userProfileDescriptionValidationResults);
    scoreObj.items.push( userProfileDescriptionScore );

    const userProfileThumbnailScore = this.scoreUserProfileThumbnail(validationResult.userProfileThumbnailValidationResults);
    scoreObj.items.push( userProfileThumbnailScore );

    // if (scoreObj.errors !== 0) {
    //   scoreObj.status = 'fatal';
    // } else if (scoreObj.warnings !== 0) {
    //   scoreObj.status = 'warning';
    // }

    // calculate the item's total score
    scoreObj.totalScore = thumbnailsScore.score + titleScore.score + snippetScore.score + descriptionScore.score + accessInformationScore.score + licenseInformationScore.score + tagsScore.score + sharingScore.score + layerCountScore.score + sslEnabledScore.score + userProfileFullNameScore.score + userProfileDescriptionScore.score + userProfileThumbnailScore.score;

    return scoreObj;

  },

  _getNumPassingItems (scores) {
    // const deferred = new Deferred();
    const deferred = RSVP.defer();

    let passingCount = 0
    
    scores.forEach( (score, i) => {
      if (score >= 80) {
        passingCount++;
      }

      if (i === scores.length - 1) {
        deferred.resolve(passingCount);
      }

    });

    return deferred.promise;
  },

  _compare (a, b) {
    if (a.country > b.country)
      return 1;
    
    if (a.country < b.country)
      return -1;

    return 0;
  }

});
