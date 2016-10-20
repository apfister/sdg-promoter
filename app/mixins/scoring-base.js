import Ember from 'ember';

import array from 'dojo/_base/array';
import lang from 'dojo/_base/lang';
import esriLang from 'esri/core/lang';

export default Ember.Mixin.create({

  arcgisValidatorConfig: Ember.inject.service(),

  // thumbnails
  thumbnailsMaxScore: null,
  thumbnailsSmallScore: null,
  thumbnailsLargeScore: null,
  // title
  titleMaxScore: null,
  titleMinLengthScore: null,
  titleNoProhibitedWordsScore: null,
  titleNoProhibitedCharsScore: null,
  titleNoAllCapsScore: null,
  // snippet/summary
  snippetMaxScore: null,
  snippetMustExistScore: null,
  snippetMinLengthScore: null,
  snippetNoProhibitedWordsScore: null,
  snippetNoProhibitedCharsScore: null,
  // description
  descriptionMaxScore: null,
  descriptionMustExistScore: null,
  descriptionMinLengthScore: null,
  descriptionHasLinkScore: null,
  // access information
  accessInformationMaxScore: null,
  accessInformationMustExistScore: null,
  // license information
  licenseInformationMaxScore: null,
  licenseInformationMustExistScore: null,
  licenseInformationMinLengthScore: null,
  licenseInformationHasLinksScore: null,
  // tags
  tagsMaxScore: null,
  tagsMinNumberOfTotalTagsScore: null,
  tagsMinNumberOfTotalLivingAtlasTagsScore: null,
  tagsNoProhibitedTagsScore: null,
  // sharing
  sharingMaxScore: null,
  sharingPrivateScore: null,
  sharingOrgScore: null,
  sharingPublicScore: null,
  // number of layers
  numLayersMaxScore: null,
  numLayersGoodScore: null,
  numLayersBetterScore: null,
  numLayersBestScore: null,
  // ssl
  sslMaxScore: null,
  sslEnabledScore: null,
  sslDisabledScore: null,
  // user profile full name
  userProfileFullNameMinLengthScore: null,
  userProfileFullNameNoProhibitedCharsScore: null,
  userProfileFullNameMaxScore: null,
  // user profile description
  userProfileDescriptionHasDescriptionScore: null,
  userProfileDescriptionMinNumWordsScore: null,
  userProfileDescriptionHasLink: null,
  userProfileDescriptionHasEmail: null,
  userProfileDescriptionMinNumSentencesScore: null,
  userProfileDescriptionMaxScore: null,
  // user profile thumbnail
  userProfileThumbnailHasThumbnailScore: null,
  userProfileThumbnailMaxScore: null,

  init() {
    // thumbnails
    this.set('thumbnailsMaxScore', 0);
    this.set('thumbnailsSmallScore', 0);
    this.set('thumbnailsLargeScore', 0);
    // item title
    this.set('titleMaxScore', 0);
    this.set('titleMinLengthScore', 0);
    this.set('titleNoProhibitedWordsScore', 0);
    this.set('titleNoProhibitedCharsScore', 0);
    this.set('titleNoAllCapsScore', 0);
    // item summary/snippet
    this.set('snippetMaxScore', 0);
    this.set('snippetMustExistScore', 0);
    this.set('snippetMinLengthScore', 0);
    this.set('snippetNoProhibitedWordsScore', 0);
    this.set('snippetNoProhibitedCharsScore', 0);
    // description
    this.set('descriptionMaxScore', 0);
    this.set('descriptionMustExistScore', 0);
    this.set('descriptionMinLengthScore', 0);
    this.set('descriptionHasLinkScore', 0);
    // access information
    this.set('accessInformationMaxScore', 0);
    this.set('accessInformationMustExistScore', 0);
    // license information
    this.set('licenseInformationMaxScore', 0);
    this.set('licenseInformationMustExistScore', 0);
    this.set('licenseInformationMinLengthScore', 0);
    this.set('licenseInformationHasLinksScore', 0);
    // tags
    this.set('tagsMaxScore', 0);
    this.set('tagsMinNumberOfTotalTagsScore', 0);
    this.set('tagsMinNumberOfTotalLivingAtlasTagsScore', 0);
    this.set('tagsNoProhibitedTagsScore', 0);
    // sharing
    this.set('sharingMaxScore', 0);
    this.set('sharingPrivateScore', 0);
    this.set('sharingOrgScore', 0);
    this.set('sharingPublicScore', 0);
    // number of layers
    this.set('numLayersMaxScore', 0);
    this.set('numLayersGoodScore', 0);
    this.set('numLayersBetterScore', 0);
    this.set('numLayersBestScore', 0);
    // ssl
    this.set('sslMaxScore', 0);
    this.set('sslEnabledScore', 0);
    this.set('sslDisabledScore', 0);
    // user profile full name
    this.set('userProfileFullNameMinLengthScore', 0);
    this.set('userProfileFullNameNoProhibitedCharsScore', 0);
    this.set('userProfileFullNameMaxScore', 0);
    // user profile description
    this.set('userProfileDescriptionHasDescriptionScore', 0);
    this.set('userProfileDescriptionMinNumWordsScore', 0);
    this.set('userProfileDescriptionHasLink', 0);
    this.set('userProfileDescriptionHasEmail', 0);
    this.set('userProfileDescriptionMinNumSentencesScore', 0);
    this.set('userProfileDescriptionMaxScore', 0);
    // user profile thumbnail
    this.set('userProfileThumbnailHasThumbnailScore', 0);
    this.set('userProfileThumbnailMaxScore', 0);
  },

  setScoreType(type) {
    
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    var scoringType = null;
    switch (type) {
      case arcgisValidatorConfig.supportedTypes.WEB_MAP:
        scoringType = arcgisValidatorConfig.scoring.WEB_MAP;
        break;
      case arcgisValidatorConfig.supportedTypes.MAP_SERVICE:
        scoringType = arcgisValidatorConfig.scoring.MAP_SERVICE;
        break;
      case arcgisValidatorConfig.supportedTypes.FEATURE_COLLECTION:
        scoringType = arcgisValidatorConfig.scoring.FEATURE_COLLECTION;
        break;
      case arcgisValidatorConfig.supportedTypes.FEATURE_SERVICE:
        scoringType = arcgisValidatorConfig.scoring.FEATURE_SERVICE;
        break;
      case arcgisValidatorConfig.supportedTypes.IMAGE_SERVICE:
        scoringType = arcgisValidatorConfig.scoring.IMAGE_SERVICE;
        break;
      case arcgisValidatorConfig.supportedTypes.WEB_SCENE:
        scoringType = arcgisValidatorConfig.scoring.WEB_SCENE;
        break;
      case arcgisValidatorConfig.supportedTypes.CITY_ENGINE_WEB_SCENE:
        scoringType = arcgisValidatorConfig.scoring.CITY_ENGINE_WEB_SCENE;
        break;
      case arcgisValidatorConfig.supportedTypes.WEB_MAPPING_APPLICATION:
        scoringType = arcgisValidatorConfig.scoring.WEB_MAPPING_APPLICATION;
        break;
      case arcgisValidatorConfig.supportedTypes.GEOPROCESSING_SERVICE:
        scoringType = arcgisValidatorConfig.scoring.GEOPROCESSING_SERVICE;
        break;
      case arcgisValidatorConfig.supportedTypes.MOBILE_APPLICATION:
        scoringType = arcgisValidatorConfig.scoring.MOBILE_APPLICATION;
        break;
      case arcgisValidatorConfig.supportedTypes.DOCUMENT_LINK:
        scoringType = arcgisValidatorConfig.scoring.DOCUMENT_LINK;
        break;
      case arcgisValidatorConfig.supportedTypes.RULE_PACKAGE:
        scoringType = arcgisValidatorConfig.scoring.RULE_PACKAGE;
        break;
      case arcgisValidatorConfig.supportedTypes.VECTOR_TILE_SERVICE:
        scoringType = arcgisValidatorConfig.scoring.VECTOR_TILE_SERVICE;
        break;
      case arcgisValidatorConfig.supportedTypes.LAYER_PACKAGE:
        scoringType = arcgisValidatorConfig.scoring.LAYER_PACKAGE;
        break;
      case arcgisValidatorConfig.supportedTypes.WMS:
        scoringType = arcgisValidatorConfig.scoring.WMS;
        break;
      default:
        scoringType = arcgisValidatorConfig.scoring.DEFAULT;
    }

    // set scores
    // thumbnails
    this.set('thumbnailsSmallScore', scoringType.THUMBNAILS.HAS_CUSTOM_SMALL);
    this.set('thumbnailsLargeScore', scoringType.THUMBNAILS.HAS_CUSTOM_LARGE);
    this.set('thumbnailsMaxScore', this.get('thumbnailsSmallScore') + this.get('thumbnailsLargeScore'));
    // title
    this.set('titleMinLengthScore', scoringType.TITLE.MIN_LENGTH_SCORE);
    this.set('titleNoProhibitedWordsScore', scoringType.TITLE.NO_PROHIBITED_WORDS_SCORE);
    this.set('titleNoProhibitedCharsScore', scoringType.TITLE.NO_UNDERSCORE_SCORE);
    this.set('titleNoAllCapsScore', scoringType.TITLE.NO_ALL_CAPS_SCORE);
    this.set('titleMaxScore', this.get('titleMinLengthScore') + this.get('titleNoProhibitedWordsScore') + this.get('titleNoProhibitedCharsScore') + this.get('titleNoAllCapsScore'));
    // snippet
    this.set('snippetMustExistScore', scoringType.SUMMARY.MUST_EXIST_SCORE);
    this.set('snippetMinLengthScore', scoringType.SUMMARY.MIN_LENGTH_SCORE);
    this.set('snippetNoProhibitedWordsScore', scoringType.SUMMARY.NO_PROHIBITED_WORDS_SCORE);
    this.set('snippetNoProhibitedCharsScore', scoringType.SUMMARY.NO_UNDERSCORE_SCORE);
    this.set('snippetMaxScore', this.get('snippetMustExistScore') + this.get('snippetMinLengthScore') + this.get('snippetNoProhibitedWordsScore') + this.get('snippetNoProhibitedCharsScore'));
    // description
    this.set('descriptionMustExistScore', scoringType.DESCRIPTION.MUST_EXIST_SCORE);
    this.set('descriptionMinLengthScore', scoringType.DESCRIPTION.MIN_LENGTH_SCORE);
    this.set('descriptionHasLinkScore', scoringType.DESCRIPTION.HAS_LINK_SCORE);
    this.set('descriptionMaxScore', this.get('descriptionMustExistScore') + this.get('descriptionMinLengthScore') + this.get('descriptionHasLinkScore'));
    // access information
    this.set('accessInformationMustExistScore', scoringType.ACCESS_INFORMATION.MUST_EXIST_SCORE);
    this.set('accessInformationMaxScore', this.get('accessInformationMustExistScore'));
    // license information
    this.set('licenseInformationMustExistScore', scoringType.LICENSE_INFORMATION.MUST_EXIST_SCORE);
    this.set('licenseInformationMinLengthScore', scoringType.LICENSE_INFORMATION.MIN_LENGTH_SCORE);
    this.set('licenseInformationHasLinksScore', scoringType.LICENSE_INFORMATION.HAS_LINK_SCORE);
    this.set('licenseInformationMaxScore', this.get('licenseInformationMustExistScore') + this.get('licenseInformationMinLengthScore') + this.get('licenseInformationHasLinksScore'));
    // tags
    this.set('tagsMinNumberOfTotalTagsScore', scoringType.TAGS.MIN_LENGTH_SCORE);
    this.set('tagsMinNumberOfTotalLivingAtlasTagsScore', scoringType.TAGS.MIN_LAW_TAGS_LENGTH_SCORE);
    this.set('tagsNoProhibitedTagsScore', scoringType.TAGS.NO_PROHIBITED_TAGS_SCORE);
    this.set('tagsMaxScore', this.get('tagsMinNumberOfTotalTagsScore') + this.get('tagsMinNumberOfTotalLivingAtlasTagsScore') + this.get('tagsNoProhibitedTagsScore'));
    // sharing
    this.set('sharingPrivateScore', scoringType.SHARING.PRIVATE);
    this.set('sharingOrgScore', scoringType.SHARING.ORG);
    this.set('sharingPublicScore', scoringType.SHARING.PUBLIC);
    this.set('sharingMaxScore', this.get('sharingPrivateScore') + this.get('sharingOrgScore') + this.get('sharingPublicScore'));
    // number layers
    this.set('numLayersGoodScore', scoringType.LAYER_COUNT.LAYER_COUNT_GOOD_SCORE);
    this.set('numLayersBetterScore', scoringType.LAYER_COUNT.LAYER_COUNT_BETTER_SCORE);
    this.set('numLayersBestScore', scoringType.LAYER_COUNT.LAYER_COUNT_BEST_SCORE);
    this.set('numLayersMaxScore', this.get('numLayersBestScore'));
    // ssl
    this.set('sslEnabledScore', scoringType.SSL.SSL_ENABLED);
    this.set('sslDisabledScore', scoringType.SSL.SSL_DISABLED);
    this.set('sslMaxScore', this.get('sslEnabledScore') + this.get('sslDisabledScore'));
    // user profile full name
    this.set('userProfileFullNameMinLengthScore', scoringType.USER_PROFILE_FULLNAME.HAS_FULLNAME_SCORE);
    this.set('userProfileFullNameNoProhibitedCharsScore', scoringType.USER_PROFILE_FULLNAME.HAS_NO_UNDERSCORE_SCORE);
    this.set('userProfileFullNameMaxScore', this.get('userProfileFullNameMinLengthScore') + this.get('userProfileFullNameNoProhibitedCharsScore'));
    // user profile description
    this.set('userProfileDescriptionHasDescriptionScore', scoringType.USER_PROFILE_DESCRIPTION.USER_PROFILE_DESCRIPTION_HAS_DESCRIPTION);
    this.set('userProfileDescriptionMinNumWordsScore', scoringType.USER_PROFILE_DESCRIPTION.USER_PROFILE_DESCRIPTION_HAS_MIN_NUM_WORDS);
    this.set('userProfileDescriptionHasLink', scoringType.USER_PROFILE_DESCRIPTION.USER_PROFILE_DESCRIPTION_HAS_LINK);
    this.set('userProfileDescriptionHasEmail', scoringType.USER_PROFILE_DESCRIPTION.USER_PROFILE_DESCRIPTION_HAS_EMAIL);
    this.set('userProfileDescriptionMinNumSentencesScore', scoringType.USER_PROFILE_DESCRIPTION.USER_PROFILE_DESCRIPTION_HAS_MIN_NUM_SENTENCES);
    this.set('userProfileDescriptionMaxScore', this.get('userProfileDescriptionHasDescriptionScore') + this.get('userProfileDescriptionMinNumWordsScore') + this.get('userProfileDescriptionHasLink') + this.get('userProfileDescriptionHasEmail') + this.get('userProfileDescriptionMinNumSentencesScore'));
    // user profile thumbnail
    this.set('userProfileThumbnailHasThumbnailScore', scoringType.USER_PROFILE_THUMBNAIL.USER_PROFILE_HAS_THUMBNAIL);
    this.set('userProfileThumbnailMaxScore', this.get('userProfileThumbnailHasThumbnailScore'));
  },

  scoreThumbnails: function (thumbnailObj) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
 
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.THUMBNAILS;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.THUMBNAILS;
    
    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.thumbnailsMaxScore;
    scoreObj.messages = [];

    if (thumbnailObj.hasCustomSmallThumbnail) {
      scoreObj.score = this.thumbnailsSmallScore;
    } else {
      scoreObj.messages.push({
      "error": ERROR_MESSAGES.SMALL_THUMBNAIL_ERROR
      });
    }

    if (thumbnailObj.hasCustomLargeThumbnail) {
      scoreObj.score = scoreObj.score + this.thumbnailsLargeScore;
    } else {
      scoreObj.messages.push({
      "error": ERROR_MESSAGES.LARGE_THUMBNAIL_ERROR
      });
    }

    return scoreObj;
  },

  scoreTitle: function (title) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.TITLE;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.TITLE;
    
    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.titleMaxScore;
    scoreObj.messages = [];

    if (title.nWords === 0) {
      scoreObj.messages.push({
        "error": ERROR_MESSAGES.MISSING_TITLE
      });
    } else {
      // check length
      if (title.nWords >= 2) {
        scoreObj.score = this.titleMinLengthScore;
      } else {
        scoreObj.messages.push({
          "warning": WARNING_MESSAGES.TITLE_TOO_SHORT
        });
      }
      // check for prohibited words
      if (!title.prohibitedWords) {
        scoreObj.score = scoreObj.score + this.titleNoProhibitedWordsScore;
      } else {
        scoreObj.messages.push({
          "warning": WARNING_MESSAGES.TITLE_PROHIBITED_TEXT
        });
      }
      // check case
      if (!title.isAllUpperCase) {
        scoreObj.score = scoreObj.score + this.titleNoAllCapsScore;
      } else {
        scoreObj.messages.push({
          "warning": WARNING_MESSAGES.TITLE_CASE
        });
      }
      // check for prohibited characters
      if (!title.prohibitedChars) {
        scoreObj.score = scoreObj.score + this.titleNoProhibitedCharsScore;
      } else {
        scoreObj.messages.push({
          "warning": WARNING_MESSAGES.TITLE_PROHIBITED_CHARS
        });
      }
    }
    return scoreObj;
  },

  scoreSnippet: function (snippet) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES   = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.SUMMARY;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.SUMMARY;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.snippetMaxScore;
    scoreObj.messages = [];

    if (!esriLang.isDefined(snippet)) {
      scoreObj.messages.push({
        "error": ERROR_MESSAGES.MISSING_SUMMARY
      });
    } else {
      // must exist
      if (snippet.strLength) {
        scoreObj.score = this.snippetMustExistScore;
        // minimum number of words
        if (snippet.numWords >= 10) {
          scoreObj.score = scoreObj.score + this.snippetMinLengthScore;
        } else {
          scoreObj.messages.push({
            "warning": WARNING_MESSAGES.SUMMARY_TOO_SHORT
          });
        }

        //
        if (!snippet.prohibitedWords) {
          scoreObj.score = scoreObj.score + this.snippetNoProhibitedWordsScore;
        } else {
          scoreObj.messages.push({
            "warning": WARNING_MESSAGES.SUMMARY_PROHIBITED_TEXT
          });
        }
        //
        if (!snippet.prohibitedChars) {
          scoreObj.score = scoreObj.score + this.snippetNoProhibitedCharsScore;
        } else {
          scoreObj.messages.push({
            "warning": WARNING_MESSAGES.SUMMARY_PROHIBITED_CHARS
          });
        }
      } else {
        scoreObj.messages.push({
          "error": ERROR_MESSAGES.MISSING_SUMMARY
        });
      }
    }
    return scoreObj;
  },

  scoreDescription: function (description) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES   = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.DESCRIPTION;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.DESCRIPTION;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.descriptionMaxScore;
    scoreObj.messages = [];

    if (!esriLang.isDefined(description)) {
      scoreObj.messages.push({"error": ERROR_MESSAGES.MISSING_DESCRIPTION});
    } else {
      //
      if (description.strLength) {
        scoreObj.score = this.descriptionMustExistScore;
        //
        if (description.numWords >= 48) {
          scoreObj.score = scoreObj.score + this.descriptionMinLengthScore;
        } else {
          scoreObj.messages.push({
            "warning": WARNING_MESSAGES.TOO_SHORT
          });
        }
        //
        if (description.hasLinks) {
          scoreObj.score = scoreObj.score + this.descriptionHasLinkScore;
        } else {
          scoreObj.messages.push({
            "warning": WARNING_MESSAGES.NO_LINKS
          });
        }
      } else {
        scoreObj.messages.push({
          "error": ERROR_MESSAGES.MISSING_DESCRIPTION
        });
      }
    }
    return scoreObj;
  },

  scoreLicenseInformation: function (licenseInformation) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES   = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.ACCESS_USE_CONSTRAINTS;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.ACCESS_USE_CONSTRAINTS;
    
    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.licenseInformationMaxScore;
    scoreObj.messages = [];

    //
    if (licenseInformation.strLength) {
      scoreObj.score = this.licenseInformationMustExistScore;
      if (!esriLang.isDefined(licenseInformation)) {
        scoreObj.messages.push({"warning": WARNING_MESSAGES.MISSING});
      } else {
        //
        if (licenseInformation.numWords >= 2) {
          scoreObj.score = scoreObj.score + this.licenseInformationMinLengthScore;
        } else {
          scoreObj.messages.push({"warning": WARNING_MESSAGES.TOO_SHORT});
        }
        //
        if (licenseInformation.hasLinks) {
          scoreObj.score = scoreObj.score + this.licenseInformationHasLinksScore;
        } else {
          scoreObj.messages.push({"warning": WARNING_MESSAGES.NO_LINKS});
        }
      }
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.MISSING});
    }

    return scoreObj;
  },

  scoreAccessInformation: function (accessInformation) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.CREDITS;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.CREDITS;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.accessInformationMaxScore;
    scoreObj.messages = [];

    if (esriLang.isDefined(accessInformation)) {
      if (accessInformation.strLength) {
        scoreObj.score = this.accessInformationMustExistScore;
      } else {
        scoreObj.messages.push({"warning": WARNING_MESSAGES.MISSING});
      }
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.MISSING});
    }
    return scoreObj;
  },

  scoreTags: function (tags) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.TAGS;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.TAGS;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.tagsMaxScore;
    scoreObj.messages = [];

    if (tags.hasMinNumTotalTags) {
      scoreObj.score = this.tagsMinNumberOfTotalTagsScore;
      if (!tags.hasProhibitedTags) {
        scoreObj.score = scoreObj.score + this.tagsNoProhibitedTagsScore;
      } else {
        scoreObj.messages.push({"error": ERROR_MESSAGES.PROHIBITED_TAGS});
      }
    } else {
      scoreObj.messages.push({
        "error": lang.replace(ERROR_MESSAGES.MINIMUM_NUMBER_OF_TAGS, {
          "numTags": tags.numTags
        })
      });
    }

    if (tags.hasMinNumLivingAtlasTags && tags.hasMinNumTotalTags) {
      scoreObj.score = scoreObj.score + this.tagsMinNumberOfTotalLivingAtlasTagsScore;
    } else {
      if (!tags.hasMinNumLivingAtlasTags) {
        scoreObj.messages.push({
          "error": lang.replace(ERROR_MESSAGES.MINIMUM_NUMBER_OF_LA_TAGS, {
            "numTags": tags.numTags
          })
        });
      }
    }

    return scoreObj;
  },

  scoreSharing: function (sharing) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.SHARING;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.SHARING;
    
    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.sharingMaxScore;
    scoreObj.messages = [];

    if (sharing.private) {
      scoreObj.score = this.sharingPrivateScore;
      scoreObj.messages.push({"error": ERROR_MESSAGES.PRIVATE});
    } else if (sharing.org) {
      scoreObj.score = this.sharingOrgScore;
      scoreObj.messages.push({"error": ERROR_MESSAGES.ORG});
    } else {
      scoreObj.score = this.sharingMaxScore;
    }

    return scoreObj;
  },

  scoreNumberOfLayers: function (layers) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.LAYER_COUNT;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.LAYER_COUNT;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.numLayersMaxScore;
    scoreObj.messages = [];

    if (layers.numLayers < 1) {
      scoreObj.score = this.numLayersBestScore;
    }

    if (layers.numLayers === 1) {
      scoreObj.score = this.numLayersBestScore;
    }

    if (layers.numLayers > 1 && layers.numLayers <= 10) {
      scoreObj.score = this.numLayersBetterScore;
      scoreObj.messages.push({"warning": WARNING_MESSAGES.BETTER});
    }

    if (layers.numLayers > 10) {
      scoreObj.score = this.numLayersGoodScore;
      scoreObj.messages.push({"warning": WARNING_MESSAGES.GOOD});
    }

    if (layers.numLayers === "ERROR") {
      scoreObj.score = 0;
      scoreObj.messages.push({"error": ERROR_MESSAGES.ERROR});
    }

    return scoreObj;
  },

  scoreSSL: function (ssl) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.SSL;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.SSL;

    let isSSL = false;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.sslMaxScore;
    scoreObj.messages = [];

    ssl.layers.forEach( (layer) => {
      if (esriLang.isDefined(layer)) {
        let protocol = '';
        if (esriLang.isDefined(layer.url)) {
          protocol = layer.url.split("/")[0];
        } else {
          protocol = layer.split("/")[0];
        }
        if (protocol === "http:") {
          isSSL = false;
        } else {
          isSSL = true;
        }
      }
    });

    if (isSSL) {
      scoreObj.score = this.sslEnabledScore;
    } else {
      scoreObj.score = this.sslDisabledScore;
      scoreObj.messages.push({"warning": WARNING_MESSAGES.DISABLED});
    }

    return scoreObj;
  },

  scoreUserProfileFullName: function (fullName) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.USER_PROFILE_NAME;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.USER_PROFILE_NAME;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.userProfileFullNameMaxScore;
    scoreObj.messages = [];

    if (fullName.hasFullName) {
      scoreObj.score = this.userProfileFullNameMinLengthScore;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.MIN_LENGTH});
    }

    if (!fullName.prohibitedChars) {
      scoreObj.score = scoreObj.score + this.userProfileFullNameNoProhibitedCharsScore;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.PROHIBITED_CHAR});
    }

    return scoreObj;
  },

  scoreUserProfileDescription: function (description) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES  = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.USER_PROFILE_DESCRIPTION;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.USER_PROFILE_DESCRIPTION;

    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.userProfileDescriptionMaxScore;
    scoreObj.messages = [];

    if (description.hasDescription) {
      scoreObj.score = this.userProfileDescriptionHasDescriptionScore;
    } else {
      scoreObj.messages.push({"error": ERROR_MESSAGES.MISSING});
    }

    if (description.hasUrl) {
      scoreObj.score = scoreObj.score + this.userProfileDescriptionHasLink;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.NO_LINK});
    }

    if (description.numWords > 10) {
      scoreObj.score = scoreObj.score + this.userProfileDescriptionMinNumWordsScore;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.MIN_WORD_COUNT});
    }

    if (description.numSentences >= 2) {
      scoreObj.score = scoreObj.score + this.userProfileDescriptionMinNumSentencesScore;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.MIN_NUM_SENTENCES});
    }

    if (description.hasEmail) {
      scoreObj.score = scoreObj.score + this.userProfileDescriptionHasEmail;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.NO_EMAIL});
    }

    return scoreObj;
  },

  scoreUserProfileThumbnail: function (thumbnail) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    const WARNING_MESSAGES   = arcgisValidatorConfig.SCORING_MESSAGES.WARNINGS.USER_PROFILE_THUMBNAIL;
    const ERROR_MESSAGES = arcgisValidatorConfig.SCORING_MESSAGES.ERRORS.USER_PROFILE_THUMBNAIL;
    
    let scoreObj = {};
    scoreObj.score = 0;
    scoreObj.maxScore = this.userProfileThumbnailMaxScore;
    scoreObj.messages = [];

    if (thumbnail.hasThumbnail) {
      scoreObj.score = this.userProfileThumbnailHasThumbnailScore;
    } else {
      scoreObj.messages.push({"warning": WARNING_MESSAGES.NO_THUMBNAIL});
    }

    return scoreObj;
  }

});
