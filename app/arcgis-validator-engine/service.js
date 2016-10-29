import Ember from 'ember';
// import esriLang from 'esri/core/lang';
// import Deferred from 'dojo/Deferred';
// import array from 'dojo/_base/array';

// import stripTags from 'sdg-promoter/utils/stripTags';

import ValidationBase from 'sdg-promoter/mixins/validation-base';
import ScoringEngine from 'sdg-promoter/mixins/scoring-engine';

export default Ember.Service.extend(ScoringEngine, ValidationBase, {

  arcgisValidatorConfig: Ember.inject.service(),

  validateItem: function (item) {
    // /data
    const data = item.data;

    let validatedItem = {};
    
    // set PortalItem properties on the new hybrid item type
    validatedItem.access = item.access;
    validatedItem.description = item.description;
    validatedItem.id = item.id;
    validatedItem.isLayer = item.isLayer;
    validatedItem.itemUrl = item.itemUrl;
    validatedItem.largeThumbnail = item.largeThumbnail;
    validatedItem.licenseInfo = item.licenseInfo;
    validatedItem.modified = item.modified;
    validatedItem.numViews = item.numViews;
    validatedItem.owner = item.owner;
    validatedItem.status = item.status;
    validatedItem.assignedCurator = item.assignedCurator;
    validatedItem.thumbnail = item.thumbnail;
    validatedItem.thumbnailUrl = item.thumbnailUrl;
    validatedItem.title = item.title;
    validatedItem.type = item.type;
    validatedItem.url = item.url;
    validatedItem.data = item.data;
    validatedItem.shared = item.shared;
    
    // set item validation properties on the hybrid item
    validatedItem.thumbnailsValidationResults = this.validateItemThumbnails(item);
    validatedItem.titleValidationResults = this.validateItemTitle(item);
    validatedItem.snippetValidationResults = this.validateItemSnippet(item);
    validatedItem.descriptionValidationResults = this.validateItemDescription(item);
    validatedItem.accessInformationValidationResults = this.validateItemLicenseInfo(item);
    validatedItem.licenseInfoValidationResults = this.validateItemAccessInformation(item);
    validatedItem.tagsValidationResults = this.validateItemTags(item);
    validatedItem.sharingValidationResults = this.validateItemSharing(item);
    validatedItem.layersValidationResults = this.validateNumberOfLayers(data);
    validatedItem.sslValidationResults = this.validateSecureSocketsLayer(item);
    validatedItem.userProfileFullnameValidationResults = this.validateUserProfileUsername(item);
    validatedItem.userProfileDescriptionValidationResults = this.validateUserProfileUserDescription(item);
    validatedItem.userProfileThumbnailValidationResults = this.validateUserProfileUserThumbnail(item);
    
    // properly score the item based on the item's type
    this.setScoreType(item.type);
    
    // score the item
    const scores = this.scoreItem(validatedItem);
    
    // set item scoring properties on the hybrid item
    validatedItem.totalScore = scores.score;
    validatedItem.scoring = scores;
    
    return validatedItem;

  },

  /////////////////////////////////////////////////////
  // Validate
  /////////////////////////////////////////////////////
  /**
   * Validate an array of items
   *
   * @param hybridPortalItems
   * A hybrid item is a PortalItem object and the /data JSON from an item.
   * The /data for an item must be retrieved to score the number of layers, otherwise, only a PortalItem object would be
   * required instead.
   *
   * @returns {*}
   * Return an array of validated items.  Each item in the returned array will contain the validation results as properties
   * added to the item as well as the item's validated properties scored and appended to the item.
   *
   */
  validateItems: function (hybridPortalItems) {
    // const deferred = new Deferred();
    const deferred = RSVP.defer();

    // total number of items
    const nPortalItems = hybridPortalItems.length;
    
    let validatedItems = [];
    
    // iterate through the items
    hybridPortalItems.forEach( (hybridPortalItem, i) => {
      // PortalItem
      const item = hybridPortalItem.item;

      // /data
      const data = hybridPortalItem.data;

      let validatedItem = {};
      
      // set PortalItem properties on the new hybrid item type
      validatedItem.access = item.access;
      validatedItem.description = item.description;
      validatedItem.id = item.id;
      validatedItem.isLayer = item.isLayer;
      validatedItem.itemUrl = item.itemUrl;
      validatedItem.largeThumbnail = item.largeThumbnail;
      validatedItem.licenseInfo = item.licenseInfo;
      validatedItem.modified = item.modified;
      validatedItem.numViews = item.numViews;
      validatedItem.owner = item.owner;
      validatedItem.status = hybridPortalItem.status;
      validatedItem.assignedCurator = hybridPortalItem.assignedCurator;
      validatedItem.thumbnail = item.thumbnail;
      validatedItem.thumbnailUrl = item.thumbnailUrl;
      validatedItem.title = item.title;
      validatedItem.type = item.type;
      validatedItem.url = item.url;
      validatedItem.data = hybridPortalItem.data;
      validatedItem.shared = hybridPortalItem.shared;
      
      // set item validation properties on the hybrid item
      validatedItem.thumbnailsValidationResults = this.validateItemThumbnails(item);
      validatedItem.titleValidationResults = this.validateItemTitle(item);
      validatedItem.snippetValidationResults = this.validateItemSnippet(item);
      validatedItem.descriptionValidationResults = this.validateItemDescription(item);
      validatedItem.accessInformationValidationResults = this.validateItemLicenseInfo(item);
      validatedItem.licenseInfoValidationResults = this.validateItemAccessInformation(item);
      validatedItem.tagsValidationResults = this.validateItemTags(item);
      validatedItem.sharingValidationResults = this.validateItemSharing(item);
      validatedItem.layersValidationResults = this.validateNumberOfLayers(data);
      validatedItem.sslValidationResults = this.validateSecureSocketsLayer(hybridPortalItem);
      validatedItem.userProfileFullnameValidationResults = this.validateUserProfileUsername(hybridPortalItem);
      validatedItem.userProfileDescriptionValidationResults = this.validateUserProfileUserDescription(hybridPortalItem);
      validatedItem.userProfileThumbnailValidationResults = this.validateUserProfileUserThumbnail(hybridPortalItem);
      
      // properly score the item based on the item's type
      this.setScoreType(hybridPortalItem.item.type);
      
      // score the item
      const scores = this.scoreItem(validatedItem);
      
      // set item scoring properties on the hybrid item
      validatedItem.totalScore = scores.score;
      validatedItem.scoring = scores;
      
      // add the new hybrid item to the array of hybrid items that will be returned
      validatedItems.push(validatedItem);

      if (i === nPortalItems - 1) {
        deferred.resolve(validatedItems);
      }
    });
    
    return deferred.promise;
  },

  /////////////////////////////////////////////////////
  // Single item property validation routines
  /////////////////////////////////////////////////////
  
  /**
   * Validate an item's thumbnails (small and large thumbnail).
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      hasCustomSmallThumbnail: Indicates the item has a custom small thumbnail
   *      hasCustomLargeThumbnail: Indicates the item has a custom large thumbnail
   */
  validateItemThumbnails: function (item) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    let result = {};
    
    let smallThumbnail = item.thumbnail;
    
    let largeThumbnail = item.largeThumbnail;
    
    let smallThumbnailFileName = null;

    // Check the file name of the small thumbnail and see if it's not null and not one of the AGOL default file names used
    // assigned to new items.  If there is a match the user has not uploaded a custom small thumbnail (or the
    // user has, and the new thumbnail file name is the same as one of the default file names assigned by AGOL).
    // The indexOf() method searches the array for the specified item, and returns its position.
    // Returns -1 if the item is not found.
    if (arcgisValidatorConfig.AGOL_DEFAULT_THUMBNAIL_FILE_NAMES.indexOf(smallThumbnail) > -1) {
      smallThumbnail = null;
    }

    // For layer packages the AGOL default small thumbnail file name seems to be "thumbnail/thumbnail.png"
    if (item.type === 'Layer Package' && smallThumbnail === 'thumbnail/thumbnail.png') {
      smallThumbnail = null;
    }

    if (Ember.isEmpty(smallThumbnail) && Ember.isEmpty(largeThumbnail)) {
      // small = no
      // large = no
      result.hasCustomSmallThumbnail = false;

      result.hasCustomLargeThumbnail = false;

    } else if (!Ember.isEmpty(smallThumbnail) && Ember.isEmpty(largeThumbnail)) {
      // small = yes
      // large = no
      // get file name
      smallThumbnailFileName = this._getSmallThumbnailFileName(smallThumbnail);

      // check if filename is default filename for thumbnails
      result.hasCustomSmallThumbnail = this._isThumbnailFileNameDefault(smallThumbnailFileName);
      
      result.hasCustomLargeThumbnail = false;

    } else if (Ember.isEmpty(smallThumbnail) && !Ember.isEmpty(largeThumbnail)) {
      // small = no
      // large = yes
      result.hasCustomSmallThumbnail = false;
      
      result.hasCustomLargeThumbnail = true;

    } else if (!Ember.isEmpty(smallThumbnail) && !Ember.isEmpty(largeThumbnail)) {
      // small = yes
      // large = yes
      
      smallThumbnailFileName = this._getSmallThumbnailFileName(smallThumbnail);
      
      // check if filename is default filename for small thumbnails
      result.hasCustomSmallThumbnail = this._isThumbnailFileNameDefault(smallThumbnailFileName);
      
      result.hasCustomLargeThumbnail = true;

    }

    return result;
  },

  /**
   * Validate an item's title.
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      strLength: Boolean value indicating if the title is empty or not (it is possible to programmatically set an item's title to empty, so we need to check this)
   *      nWords: Number of words in the title
   *      prohibitedWords: Boolean value indicating if the title contains prohibited sub-strings
   *      isAllUpperCase: Boolean value indicating if the title is ALL UPPERCASE
   *      prohibitedChars: Boolean value indicating if the title has prohibited characters
   */
  validateItemTitle: function (item) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    let result = {};
    
    const title = item.title;
    
    let strippedString = '';

    // strip any weird characters from the title
    if (!Ember.isEmpty(title)) {
      strippedString = title.replace(/(<([^>]+)>)/ig, '');
    } else {
      strippedString = '';
    }

    result.strLength = this._checkStringLength(strippedString);

    result.nWords = this._getNumWords(strippedString);

    result.prohibitedWords = this._checkTitleForBadWords(strippedString, arcgisValidatorConfig.ITEM_SNIPPET_PROHIBITED_WORDS);

    result.isAllUpperCase = this._checkIsAllUpperCase(strippedString);

    result.prohibitedChars = this._hasBadCharacters(strippedString, ['_']);
    
    return result;
  },

  /**
   * Validate an item's summary
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      strLength: Boolean value indicating if the summary is empty
   *      prohibitedWords: Boolean value indicating if the summary contains prohibited strings
   *      prohibitedChars: Boolean value indicating if the summary has prohibited characters
   *      numWords: Number of strings in the summary
   */
  validateItemSnippet: function (item) {

    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    let result = {};
    result.strLength = false;
    result.prohibitedChars = false;
    result.prohibitedWords = false;
    result.numWords = 0;

    const snippet = item.snippet;
    
    // check if there is even a summary
    if (!Ember.isEmpty(snippet)) {
      // there is a summary
      result.strLength = this._checkStringLength(snippet);

      // check prohibited chars
      result.prohibitedChars = this._hasBadCharacters(snippet, ['_']);

      // check for prohibited words
      result.prohibitedWords = this._checkForProhibitedWords(snippet, arcgisValidatorConfig.ITEM_SNIPPET_PROHIBITED_WORDS);

      // check number of words in the item after it's been stripped on any tags
      result.numWords = this._getNumWords(snippet);

    }

    return result;
  },

  /**
   * Validate an item's description
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      strLength: Boolean value indicating if the description is empty
   *      hasLinks: Boolean value indicating if the description contains links/urls
   *      numWords: Number of words in the description (after the tags are stripped)
   */
  validateItemDescription: function (item) {
    let result = {};
    result.strLength = false;
    result.hasLinks = false;
    result.numWords = 0;

    const description = item.description;

    let itemDescriptionStrippped = '';    

    if (!Ember.isEmpty(description)) {
      itemDescriptionStrippped = description.replace(/<(?:.|\n)*?>/gm, '');

      itemDescriptionStrippped = itemDescriptionStrippped.trim();

      if (itemDescriptionStrippped.length > 0) {
        result.strLength = this._checkStringLength(itemDescriptionStrippped);
      }

      if (description.search('href') > -1) {
        result.hasLinks = true;
      }
      // get number fo words
      result.numWords = this._getNumWords(itemDescriptionStrippped);
    }

    return result;
  },

  /**
   * Validate an item's licensing information (credits/licensing)
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      strLength: Boolean value indicating if the licenseInfo is empty
   *      hasLinks: Boolean value indicating if the licenseInfo contains links/urls
   *      numWords: Number of words in the licenseInfo (after the tags are stripped)
   */
  validateItemAccessInformation: function (item) {
      let result = {};
      result.strLength = false;
      result.hasLinks = false;

      let licenseInfo = item.licenseInfo;
      
      let itemLicenseInfoStripped = '';

      // the licenseInfo object may be defined by still empty, if so, set it to an empty string
      if (licenseInfo === '' || licenseInfo === '<span></span>' || licenseInfo === null) {
        itemLicenseInfoStripped = '';
      } else {
        // contains text, strip the tags
        itemLicenseInfoStripped = licenseInfo.replace(/(<([^>]+)>)/ig, '');
      }
      
      // after the tags are stripped, check it again
      if (!Ember.isEmpty(licenseInfo)) {
        // trim the ends
        itemLicenseInfoStripped = itemLicenseInfoStripped.trim();
        
        // if there isn anything left, check the length
        if (itemLicenseInfoStripped.length > 0) {
          result.strLength = this._checkStringLength(itemLicenseInfoStripped);
        }
        // check for links
        if (licenseInfo.search('href') > -1) {
          result.hasLinks = true; 
        }
      }

      result.numWords = this._getNumWords(itemLicenseInfoStripped);
      
      return result;
  },

  /**
   * Validate an item's Access and Use constrains
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      strLength: Boolean value indicating if there is any text in this field
   */
  validateItemLicenseInfo: function (item) {
      let result = {};

      let accessInformation = item.accessInformation;

      result.strLength = false;

      if (!Ember.isEmpty(accessInformation)) {
        if (accessInformation === '<span></span>' || accessInformation === '') {
          result.strLength = false;
        } else {
          result.strLength = true;
        }
      } else {
        result.strLength = false;
      }

      return result;
  },

  /**
   * Validate an item's tags
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      numTags: Number of tags for the item
   *      hasMinNumTotalTags: Boolean indicating the item contains the minimum total number of tags required to pass
   *      hasMinNumLivingAtlasTags: Boolean indicating the item contains the minimum total number of "Living Atlas" tags required to pass
   *      hasProhibitedTags: Boolean indicating the item contains no prohibited tags
   */
  validateItemTags: function (item) {
    let result = {};
    result.numTags = nTags;
    result.hasMinNumTotalTags = false;
    result.hasMinNumLivingAtlasTags = false;
    result.hasProhibitedTags = false;

    let tags = item.tags;
    let nTags = tags.length;
    let tempTags = [];

    // I believe I have seen an item with no tags, so we need to check an item contains zero tags
    if (nTags > 0) {
      
      const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

      // check if an item has at least the minimum number of total tags
      result.hasMinNumTotalTags = this._hasMinimumRequiredTotalNumberOfTags(nTags);
      
      // tag matching will be case-insensitive
      tags.forEach( (tag) => {
        tempTags.push(tag.toLowerCase());
      });
      
      // check if any tags are prohibited words (i.e. test)
      if (arcgisValidatorConfig.LIVING_ATLAS_TAGS_PROHIBITED.some( (badWord) => {
          return tempTags.indexOf(badWord.toLowerCase()) !== -1;
        })) {
        // FAIL
        result.hasProhibitedTags = true;
      } else {
        // PASS
        result.hasProhibitedTags = false;
      }

      let nRequiredAtlasTags = 0;

      let hasAtlasTag = false;

      arcgisValidatorConfig.LIVING_ATLAS_TAGS.forEach( (atlasTag) => {
        tags.forEach( (tag)  => {
          if (tag === atlasTag) {
            hasAtlasTag = true;
            nRequiredAtlasTags++;
          }
        });
      });

      // check if the item has the minimum total number of required living atlas tags
      if (hasAtlasTag) {
        result.hasMinNumLivingAtlasTags = this._hasMinimumRequiredTotalNumberOfLivingAtlasTags(nRequiredAtlasTags)
      }
    }

    return result;
  },

   /**
   * Validate an item's access
   *
   * @param item
   * Accepts an PortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      private: item is not shared
   *      org: item only shared with the user's org
   *      public: item shared with everyone
   */
  validateItemSharing: function (item) {
    let result = {};
    result.private = false;
    result.org = false;
    result.public = false;

    const sharing = item.access;

    if (sharing === 'private') {
      result.private = true;
    } else if (sharing === 'org' || sharing === 'shared') {
      result.org = true;
    } else {
      result.public = true;
    }
    
    return result;
  },

  /**
   * Validate the item's layer count
   *
   * @param data
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      numLayers: Number of layers (number of basemaps PLUS number of operational layers)
   *      baseMaps: Item's basemaps
   *      operationalLayers: Item's operational layers
   */
  validateNumberOfLayers: function (data) {
    let result = {};

    if (data !== '' && !Ember.isEmpty(data)) {

      result.baseMaps = !Ember.isEmpty(data.baseMap) ? data.baseMap.baseMapLayers : [];

      result.operationalLayers = !Ember.isEmpty(data.operationalLayers) ? data.operationalLayers : [];

      result.numLayers = result.baseMaps.length + result.operationalLayers.length;

      if (data === 'ERROR') {
        result.numLayers = data;
      }

      return result;
    } else {

      result.baseMaps = null;
      result.operationalLayers = null;
      result.numLayers = 0;

      return result;
    }
  },

  /**
   * Validation rule to determine if "any" layer is not SSL-enabled
   *
   * @param hybridPortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *
   */
  validateSecureSocketsLayer: function (item) {
    let result = {};
    result.layers = [];

    const data = item.data;
    
    const itemUrl = !Ember.isEmpty(item.url) ? item.url : null;

    if (data !== "" && !Ember.isEmpty(data)) {
      
      result.baseMaps = !Ember.isEmpty(data.baseMap) ? data.baseMap.baseMapLayers : [];
      
      result.operationalLayers = !Ember.isEmpty(data.operationalLayers) ? data.operationalLayers : [];
      
      result.operationalLayers.forEach( (operationalLayer) => {
        result.layers.push(operationalLayer.url);
      });

      result.layers.push(itemUrl);
      
      result.numLayers = /*result.baseMaps.length + */ result.layers.length;
     
      return result;
    } else {
      result.baseMaps = null;
      result.operationalLayers = null;
      result.numLayers = 1;
      result.layers.push(itemUrl);
     
      return result;
    }
  },

  /**
   * Validate the item owner's profile full name
   *
   * @param hybridPortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      hasFullName: Boolean indicating if the user have a valid full name
   *      prohibitedChars: Boolean indicating if the user's full name does not contain prohibited chars
   */
  validateUserProfileUsername: function (item) {
    let result = {};
    
    const userObj = item.userDetail;
    
    const fullName = userObj.fullName;

    // check if the user entered a fullname and it's not just an empty string
    if (fullName === '' || Ember.isEmpty(fullName)) {
      result.hasFullName = false;
    } else {
      result.hasFullName = true;

      // check for prohibited characters
      result.prohibitedChars = this._hasBadCharacters(fullName, ['_']);
    }

    return result;
  },

  /**
   * Validate the item owner's profile description
   *
   * @param hybridPortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   *      hasDescription: Boolean indicating if there is a description
   *      hasUrl: Boolean indicating if there is a url in the description
   *      numWords: Number of words
   *      numSentences: Number of sentences
   *      hasEmail: Boolean indicating if there is an email in the description
   */
  validateUserProfileUserDescription: function (item) {
    let result = {};

    const userObj = item.userDetail;

    const description = userObj.description;
    
    if (Ember.isEmpty(description) || description === '') {
        
      // no description
      result.hasDescription = false;
    } else {

      // has description
      result.hasDescription = true;

      // strip html tags
      const strippedString = description.replace(/(<([^>]+)>)/ig, '');
      
      // check if there is a url in the description
      result.hasUrl = this._hasUrl(strippedString);
      
      // check the number of words
      result.numWords = this._getNumWords(strippedString);
      
      // check the number of sentences
      const nSentences = strippedString.match(/[^\.!\?]+[\.!\?]+/g);
      
      if (!Ember.isEmpty(nSentences)) {
        result.numSentences = nSentences.length;
      } else {
        result.numSentences = 0;
      }

      // check if there is an email in the description
      result.hasEmail = this._extractEmails(description);
    }

    return result;
  },

  /**
   * Validate the item owner's profile thumbnail
   *
   * @param hybridPortalItem
   *
   * @returns {{}}
   * Return a result that contains the properties:
   */
  validateUserProfileUserThumbnail: function (item) {
    let result = {};
    result.hasThumbnail = false;

    const userObj = item.userDetail;
    
    const thumbnail = userObj.thumbnail;
    
    if (!Ember.isEmpty(thumbnail)) {
      const index = thumbnail.lastIndexOf('/') + 1;
      
      let filename = thumbnail.substr(index);
      filename = filename.split('?')[0];
      
      // check if the user is not using the default thumbnail
      result.hasThumbnail = this._isThumbnailFileNameDefault(filename);
    }

    return result;
  }

});