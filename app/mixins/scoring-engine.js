import Ember from 'ember';

import ScoringBase from 'sdg-promoter/mixins/scoring-base';

import array from 'dojo/_base/array';
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import Deferred from 'dojo/Deferred';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import on from 'dojo/on';
import query from 'dojo/query';
import Memory from 'dstore/Memory';
import topic from 'dojo/topic';

// dGrid
import Pagination from 'dgrid/extensions/Pagination';
import OnDemandGrid from 'dgrid/OnDemandGrid';

//Esri
import esriLang from 'esri/core/lang';

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

  scoreItemOld (validationResult) {
    let score = 0;

    let failObj = {
      score: score,
      thumbnailScoreLabel: '',
      titleScoreLabel: '',
      status: '',
      warnings: '',
      errors: ''
    };

    var thumbnailsScore = this.scoreThumbnails(validationResult.thumbnailsValidationResults);
    // failObj.thumbnailScoreLabel = "<div class='column-1 total-score-value'>" + thumbnailsScore.score + "</div><div class='column-2 total-score-value'>" + thumbnailsScore.maxScore + "</div>";
    // failObj.totalScore = thumbnailsScore.score;
    // failObj.maxScore = thumbnailsScore.maxScore;
    array.forEach(thumbnailsScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var titleScore = this.scoreTitle(validationResult.titleValidationResults);
    failObj.titleScoreLabel = "<div class='column-1 total-score-value'>" + titleScore.score + "</div><div class='column-2 total-score-value'>" + titleScore.maxScore + "</div>";
    failObj.totalScore = titleScore.score;
    failObj.maxScore = titleScore.maxScore;
    array.forEach(titleScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var snippetScore = this.scoreSnippet(validationResult.snippetValidationResults);
    failObj.snippetScoreLabel = "<div class='column-1 total-score-value'>" + snippetScore.score + "</div><div class='column-2 total-score-value'>" + snippetScore.maxScore + "</div>";
    failObj.totalScore = snippetScore.score;
    failObj.maxScore = snippetScore.maxScore;
    array.forEach(snippetScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var descriptionScore = this.scoreDescription(validationResult.descriptionValidationResults);
    failObj.descriptionScoreLabel = "<div class='column-1 total-score-value'>" + descriptionScore.score + "</div><div class='column-2 total-score-value'>" + descriptionScore.maxScore + "</div>";
    failObj.totalScore = descriptionScore.score;
    failObj.maxScore = descriptionScore.maxScore;
    array.forEach(descriptionScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var accessInformationScore = this.scoreAccessInformation(validationResult.accessInformationValidationResults);
    failObj.accessScoreLabel = "<div class='column-1 total-score-value'>" + accessInformationScore.score + "</div><div class='column-2 total-score-value'>" + accessInformationScore.maxScore + "</div>";
    failObj.totalScore = accessInformationScore.score;
    failObj.maxScore = accessInformationScore.maxScore;
    array.forEach(accessInformationScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var licenseInformationScore = this.scoreLicenseInformation(validationResult.licenseInfoValidationResults);
    failObj.licenseScoreLabel = "<div class='column-1 total-score-value'>" + licenseInformationScore.score + "</div><div class='column-2 total-score-value'>" + licenseInformationScore.maxScore + "</div>";
    failObj.totalScore = licenseInformationScore.score;
    failObj.maxScore = licenseInformationScore.maxScore;
    array.forEach(licenseInformationScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var tagsScore = this.scoreTags(validationResult.tagsValidationResults);
    failObj.tagsScoreLabel = "<div class='column-1 total-score-value'>" + tagsScore.score + "</div><div class='column-2 total-score-value'>" + tagsScore.maxScore + "</div>";
    failObj.totalScore = tagsScore.score;
    failObj.maxScore = tagsScore.maxScore;
    array.forEach(tagsScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var sharingScore = this.scoreSharing(validationResult.sharingValidationResults);
    failObj.sharingScoreLabel = "<div class='column-1 total-score-value'>" + sharingScore.score + "</div><div class='column-2 total-score-value'>" + sharingScore.maxScore + "</div>";
    failObj.totalScore = sharingScore.score;
    failObj.maxScore = sharingScore.maxScore;
    array.forEach(sharingScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var layerCountScore = this.scoreNumberOfLayers(validationResult.layersValidationResults);
    failObj.layerCountScoreLabel = "<div class='column-1 total-score-value'>" + layerCountScore.score + "</div><div class='column-2 total-score-value'>" + layerCountScore.maxScore + "</div>";
    failObj.totalScore = layerCountScore.score;
    failObj.maxScore = layerCountScore.maxScore;
    array.forEach(layerCountScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var sslEnabledScore = this.scoreSSL(validationResult.sslValidationResults);
    failObj.sslEnabledScoreLabel = "<div class='column-1 total-score-value'>" + sslEnabledScore.score + "</div><div class='column-2 total-score-value'>" + sslEnabledScore.maxScore + "</div>";
    failObj.totalScore = sslEnabledScore.score;
    failObj.maxScore = sslEnabledScore.maxScore;

    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    if (validationResult.type === arcgisValidatorConfig.supportedTypes.WEB_MAP
        || validationResult.type === arcgisValidatorConfig.supportedTypes.WEB_MAPPING_APPLICATION
        || validationResult.type === arcgisValidatorConfig.supportedTypes.MAP_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.FEATURE_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.IMAGE_SERVICE
        || validationResult.type === arcgisValidatorConfig.supportedTypes.VECTOR_TILE_SERVICE) {
        
        array.forEach(sslEnabledScore.messages, lang.hitch(this, function (msg) {
          this._buildErrorMessageContainer(failObj, msg);
        }));
    }

    var userProfileFullNameScore = this.scoreUserProfileFullName(validationResult.userProfileFullnameValidationResults);
    failObj.userProfileFullNameScoreLabel = "<div class='column-1 total-score-value'>" + userProfileFullNameScore.score + "</div><div class='column-2 total-score-value'>" + userProfileFullNameScore.maxScore + "</div>";
    failObj.totalScore = userProfileFullNameScore.score;
    failObj.maxScore = userProfileFullNameScore.maxScore;
    array.forEach(userProfileFullNameScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var userProfileDescriptionScore = this.scoreUserProfileDescription(validationResult.userProfileDescriptionValidationResults);
    failObj.userProfileDescriptionScoreLabel = "<div class='column-1 total-score-value'>" + userProfileDescriptionScore.score + "</div><div class='column-2 total-score-value'>" + userProfileDescriptionScore.maxScore + "</div>";
    failObj.totalScore = userProfileDescriptionScore.score;
    failObj.maxScore = userProfileDescriptionScore.maxScore;
    array.forEach(userProfileDescriptionScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var userProfileThumbnailScore = this.scoreUserProfileThumbnail(validationResult.userProfileThumbnailValidationResults);
    failObj.userProfileThumbnailScoreLabel = "<div class='column-1 total-score-value'>" + userProfileThumbnailScore.score + "</div><div class='column-2 total-score-value'>" + userProfileThumbnailScore.maxScore + "</div>";
    failObj.totalScore = userProfileThumbnailScore.score;
    failObj.maxScore = userProfileThumbnailScore.maxScore;
    array.forEach(userProfileThumbnailScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    if (failObj.errors !== 0) {
      failObj.status = 'fatal';
    } else if (failObj.warnings !== 0) {
      failObj.status = 'warning';
    }

    // calculate the item's total score
    failObj.score = thumbnailsScore.score + titleScore.score + snippetScore.score + descriptionScore.score + accessInformationScore.score + licenseInformationScore.score + tagsScore.score + sharingScore.score + layerCountScore.score + sslEnabledScore.score + userProfileFullNameScore.score + userProfileDescriptionScore.score + userProfileThumbnailScore.score;
    
    return failObj;
  },

  _buildErrorMessageContainer: function (failObj, msg) {
    failObj.warnings = esriLang.isDefined(msg.warning) ? failObj.warnings + "<div><span class='warning-icon font-size-0 icon-ui-notice-triangle' aria-label='notice-triangle'></span>" + msg.warning + "</div>" : failObj.warnings + "";
    failObj.errors = esriLang.isDefined(msg.error) ? failObj.errors + "<div><span class='font-size-0 icon-ui-red icon-ui-notice-triangle' aria-label='notice-triangle'></span>" + msg.error + "</div>" : failObj.errors + "";
  },

  _getNumPassingItems (scores) {
    const deferred = new Deferred();

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
