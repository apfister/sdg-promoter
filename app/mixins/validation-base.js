import Ember from 'ember';

import array from 'dojo/_base/array';

export default Ember.Mixin.create({

  arcgisValidatorConfig: Ember.inject.service(),

  _checkForProhibitedWords: function (inputText, badWords) {
    inputText = inputText.toLowerCase();
    if (array.some(badWords, function (badWord) {
          badWord = badWord.toLowerCase();
          return inputText.search(badWord) >= 0;
      })) {
      // yes
      return true;
    } else {
      // no
      return false;
    }
  },

  _checkTitleForBadWords : function (inputText, badWords) {
    inputText = inputText.toLowerCase();
    inputText = this._extractWords(inputText);

    if (array.some(inputText, function (currentWord) {
            var match = false;
            array.forEach(badWords, function (badWord) {
                if (currentWord === badWord)
                    match = true;
            });
            return match;
        })) {
        return true;
    } else {
        return false;
    }
  },

  _extractWords: function (s) {
    // exclude white space
    s = s.replace("-", " ");
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    // exclude newline with a space at beginning
    s = s.replace(/\n /, "\n");
    return s.split(" ");
  },

  _hasBonusWords: function (inputText, bonusWords, bonus) {
    inputText = inputText.toLowerCase();
    if (array.some(bonusWords, function (bonusWord) {
          bonusWord = bonusWord.toLowerCase();
          return inputText.search(bonusWord) >= 0;
      })) {
      // yes
      return bonus;
    } else {
      // no
      return 0;
    }
  },

  _checkIsAllUpperCase: function (str) {
    return (str === str.toUpperCase());
  },

  _checkStringLength: function (str) {
    if (str.length > 0) {
      return true;
    } else {
      return false;
    }
  },

  _getNumWords: function (s) {
    // exclude white space
    s = s.replace(/(^\s*)|(\s*$)/gi, "");
    s = s.replace(/[ ]{2,}/gi, " ");
    // exclude newline with a space at beginning
    s = s.replace(/\n /, "\n");

    if (s.split(" ").length === 1) {
      if (s.trim() === "") {
        return 0;
      }
    }
    return s.split(" ").length;
  },

  _hasBadCharacters: function (inputText, badChars) {
    if (inputText.indexOf(badChars) === -1) {
      return false;
    } else {
      return true;
    }
  },

  _getSmallThumbnailFileName: function (smallThumbnail) {
    var index = smallThumbnail.lastIndexOf("/") + 1;
    var smallThumbnailFileName = smallThumbnail.substr(index);
    smallThumbnailFileName = smallThumbnailFileName.split("?")[0];
    return smallThumbnailFileName;
  },

  _isThumbnailFileNameDefault: function (smallThumbnailFileName) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');
    
    return arcgisValidatorConfig.AGOL_USER_PROFILE_THUMBNAIL_NAMES.indexOf(smallThumbnailFileName) < 0;
  },

  _extractEmails: function (text) {
    return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  },

  _hasUrl: function (str) {
    var pattern = new RegExp("((?:(http|https|Http|Https|rtsp|Rtsp):\\/\\/(?:(?:[a-zA-Z0-9\\$\\-\\_\\.\\+\\!\\*\\'\\(\\)"
        + "\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,64}(?:\\:(?:[a-zA-Z0-9\\$\\-\\_"
        + "\\.\\+\\!\\*\\'\\(\\)\\,\\;\\?\\&\\=]|(?:\\%[a-fA-F0-9]{2})){1,25})?\\@)?)?"
        + "((?:(?:[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}\\.)+"   // named host
        + "(?:"   // plus top level domain
        + "(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])"
        + "|(?:biz|b[abdefghijmnorstvwyz])"
        + "|(?:cat|com|coop|c[acdfghiklmnoruvxyz])"
        + "|d[ejkmoz]"
        + "|(?:edu|e[cegrstu])"
        + "|f[ijkmor]"
        + "|(?:gov|g[abdefghilmnpqrstuwy])"
        + "|h[kmnrtu]"
        + "|(?:info|int|i[delmnoqrst])"
        + "|(?:jobs|j[emop])"
        + "|k[eghimnrwyz]"
        + "|l[abcikrstuvy]"
        + "|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])"
        + "|(?:name|net|n[acefgilopruz])"
        + "|(?:org|om)"
        + "|(?:pro|p[aefghklmnrstwy])"
        + "|qa"
        + "|r[eouw]"
        + "|s[abcdeghijklmnortuvyz]"
        + "|(?:tel|travel|t[cdfghjklmnoprtvwz])"
        + "|u[agkmsyz]"
        + "|v[aceginu]"
        + "|w[fs]"
        + "|y[etu]"
        + "|z[amw]))"
        + "|(?:(?:25[0-5]|2[0-4]" // or ip address
        + "[0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\\.(?:25[0-5]|2[0-4][0-9]"
        + "|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(?:25[0-5]|2[0-4][0-9]|[0-1]"
        + "[0-9]{2}|[1-9][0-9]|[1-9]|0)\\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}"
        + "|[1-9][0-9]|[0-9])))"
        + "(?:\\:\\d{1,5})?)" // plus option port number
        + "(\\/(?:(?:[a-zA-Z0-9\\;\\/\\?\\:\\@\\&\\=\\#\\~"  // plus option query params
        + "\\-\\.\\+\\!\\*\\'\\(\\)\\,\\_])|(?:\\%[a-fA-F0-9]{2}))*)?"); // fragment locator
    if (!pattern.test(str)) {
      return false;
    } else {
      return true;
    }
  },

  _hasMinimumRequiredTotalNumberOfTags: function (nTags) {
    return nTags >= 4;
  },

  _hasMinimumRequiredTotalNumberOfLivingAtlasTags: function (nTags) {
    return nTags >= 1;
  }

});
