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
    failObj.thumbnailScoreLabel = "<div class='column-1 total-score-value'>" + thumbnailsScore.score + "</div><div class='column-2 total-score-value'>" + thumbnailsScore.maxScore + "</div>";
    array.forEach(thumbnailsScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var titleScore = this.scoreTitle(validationResult.titleValidationResults);
    failObj.titleScoreLabel = "<div class='column-1 total-score-value'>" + titleScore.score + "</div><div class='column-2 total-score-value'>" + titleScore.maxScore + "</div>";
    array.forEach(titleScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var snippetScore = this.scoreSnippet(validationResult.snippetValidationResults);
    failObj.snippetScoreLabel = "<div class='column-1 total-score-value'>" + snippetScore.score + "</div><div class='column-2 total-score-value'>" + snippetScore.maxScore + "</div>";
    array.forEach(snippetScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var descriptionScore = this.scoreDescription(validationResult.descriptionValidationResults);
    failObj.descriptionScoreLabel = "<div class='column-1 total-score-value'>" + descriptionScore.score + "</div><div class='column-2 total-score-value'>" + descriptionScore.maxScore + "</div>";
    array.forEach(descriptionScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var accessInformationScore = this.scoreAccessInformation(validationResult.accessInformationValidationResults);
    failObj.accessScoreLabel = "<div class='column-1 total-score-value'>" + accessInformationScore.score + "</div><div class='column-2 total-score-value'>" + accessInformationScore.maxScore + "</div>";
    array.forEach(accessInformationScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var licenseInformationScore = this.scoreLicenseInformation(validationResult.licenseInfoValidationResults);
    failObj.licenseScoreLabel = "<div class='column-1 total-score-value'>" + licenseInformationScore.score + "</div><div class='column-2 total-score-value'>" + licenseInformationScore.maxScore + "</div>";
    array.forEach(licenseInformationScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var tagsScore = this.scoreTags(validationResult.tagsValidationResults);
    failObj.tagsScoreLabel = "<div class='column-1 total-score-value'>" + tagsScore.score + "</div><div class='column-2 total-score-value'>" + tagsScore.maxScore + "</div>";
    array.forEach(tagsScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var sharingScore = this.scoreSharing(validationResult.sharingValidationResults);
    failObj.sharingScoreLabel = "<div class='column-1 total-score-value'>" + sharingScore.score + "</div><div class='column-2 total-score-value'>" + sharingScore.maxScore + "</div>";
    array.forEach(sharingScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var layerCountScore = this.scoreNumberOfLayers(validationResult.layersValidationResults);
    failObj.layerCountScoreLabel = "<div class='column-1 total-score-value'>" + layerCountScore.score + "</div><div class='column-2 total-score-value'>" + layerCountScore.maxScore + "</div>";
    array.forEach(layerCountScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var sslEnabledScore = this.scoreSSL(validationResult.sslValidationResults);
    failObj.sslEnabledScoreLabel = "<div class='column-1 total-score-value'>" + sslEnabledScore.score + "</div><div class='column-2 total-score-value'>" + sslEnabledScore.maxScore + "</div>";

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
    array.forEach(userProfileFullNameScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var userProfileDescriptionScore = this.scoreUserProfileDescription(validationResult.userProfileDescriptionValidationResults);
    failObj.userProfileDescriptionScoreLabel = "<div class='column-1 total-score-value'>" + userProfileDescriptionScore.score + "</div><div class='column-2 total-score-value'>" + userProfileDescriptionScore.maxScore + "</div>";
    array.forEach(userProfileDescriptionScore.messages, lang.hitch(this, function (msg) {
        this._buildErrorMessageContainer(failObj, msg);
    }));

    var userProfileThumbnailScore = this.scoreUserProfileThumbnail(validationResult.userProfileThumbnailValidationResults);
    failObj.userProfileThumbnailScoreLabel = "<div class='column-1 total-score-value'>" + userProfileThumbnailScore.score + "</div><div class='column-2 total-score-value'>" + userProfileThumbnailScore.maxScore + "</div>";
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
  },

  scoreItems(arg1, arg2, arg3, arg4) {

  }

});
