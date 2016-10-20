import Ember from 'ember';

import Array from 'dojo/_base/array';
import dDeclare from 'dojo/_base/declare';
import dLang from 'dojo/_base/lang';
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import on from 'dojo/on';
import Memory from 'dojo/store/Memory';
import Observable from 'dojo/store/Observable';
import Topic from 'dojo/topic';

// Esri
import esriLang from 'esri/core/lang';
import PortalQueryParams from 'esri/portal/PortalQueryParams';
import QueryTask from 'esri/tasks/QueryTask';
import Query from 'esri/tasks/support/Query';
import esriRequest from 'esri/request';


export default Ember.Service.extend({

  arcgisValidatorConfig: Ember.inject.service(),

  init() {
    this._getFolderItemsDeferred = null;
    
    Ember.debug('firing up portal-query-engine ember service ..');
  },

  queryGroup: function (portalGroup) {
    // Instantiating a dojo/Deferred object, starting the thread and when it completes calling .resolve() with
    // any results and returning the object to the consumer.
    const deferred = new Deferred();
    
    if (this._getGroupItemsDeferred) {
        this._getGroupItemsDeferred.cancel();
    }

    const portalQueryParams = new PortalQueryParams({
      start: 1,
      sortField: 'modified',
      num: 100
    });

    // once ALL the items within the target group are returned from recursive queries, resolve
    this._getGroupItemsDeferred = this._searchItems(portalGroup, portalQueryParams)
      .then( (allResults) => {
        this._getGroupItemsDeferred = null;
      
        const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

        // store items in a store
        const _tmpStore = new Observable(new Memory({
          data: allResults.filter( function (item) {
            // only return items supported by the Living Atlas
            return (arcgisValidatorConfig.VALID_TYPES.indexOf(item.type) > -1);
          })
        }));
      
        deferred.resolve(_tmpStore);

      });

    return deferred.promise;
  },

  _searchItems: function (portalGroup, qParams, allResults) {
      // Instantiating a dojo/Deferred object, starting the thread and when it completes calling .resolve() with
      // any results and returning the object to the consumer.
      const deferred = new Deferred();
      
      if (!allResults) {
        allResults = [];
      }

      // The parameters used to perform a query for Items, Groups, and Users within a Portal.
      const params = new PortalQueryParams({
        start: esriLang.isDefined(qParams) ? qParams.start : 1,
        sortField: 'modified',
        num: 100
      });

      // Executes a query against the group to return an array of PortalItem objects that match the input query.
      portalGroup.queryItems(params)
        .then(function (response) {
          // concat the portalItems to the previous response
          allResults = allResults.concat(response.results);
          // if there are more items remaining in the group, recursively retrieve them
          if (response.nextQueryParams.start > -1) {
            this._searchItems(portalGroup, response.nextQueryParams, allResults).then(deferred.resolve, deferred.reject);
          } else {
            deferred.resolve(allResults);
          }
        });

      return deferred.promise;
  },

  processPortalItems: function (portalItems) {

    const deferred = new Deferred();

    const portalItemArr = [];

    const promises = [];

    const sharingQueryPromises = [];

    // iterate over all of the items and begin creating the "hybrid" item type
    // the hybrid item type is the item, plus the /data on the item (if available)
    portalItems.forEach( (portalItem, i) => {
      // add unique item ID and portalItem to the hybrid type
      portalItemArr.push({
          'id': portalItem.id,    // item ID
          'item': portalItem,     // portal item
          'data': null,           // /data
          'user': null            // itemOwner information
      });

      sharingQueryPromises.push(this._getSharedGroups(portalItem));

      const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

      // build an array of promises in order to get the /data information for certain types
      if ( portalItem.type === arcgisValidatorConfig.supportedTypes.WEB_MAP ||
          portalItem.type === arcgisValidatorConfig.supportedTypes.WEB_MAPPING_APPLICATION ||
          portalItem.type === arcgisValidatorConfig.supportedTypes.FEATURE_SERVICE ||
          portalItem.type === arcgisValidatorConfig.supportedTypes.FEATURE_COLLECTION ||
          portalItem.type === arcgisValidatorConfig.supportedTypes.IMAGE_SERVICE ||
          portalItem.type === arcgisValidatorConfig.supportedTypes.MAP_SERVICE ) {

          promises.push(this._checkForBadPromises(portalItem));
      }
      // resolve
      //      array of items
      //      array of promises used to retrieve the /data information
      if (i === portalItems.length - 1) {
        deferred.resolve( [ portalItemArr, promises, sharingQueryPromises ] );
      }
    });

    return deferred.promise;
  },

  _checkForBadPromises: function (portalItem) {
      const deferred = new Deferred();

      esriRequest(`${portalItem.itemUrl}/data`, {
        responseType: 'json'
      })
        .then( (result) => {
          deferred.resolve(result);
        }, (error) => {
          deferred.resolve(portalItem.id);
        });

      return deferred.promise;
  },

  _getSharedGroups: function (portalItem) {
      const deferred = new Deferred();

      esriRequest(`http://www.arcgis.com/sharing/rest/content/items/${portalItem.id}/groups?f=json`, {
        responseType: 'json'
      })
        .then( (result) => {
          deferred.resolve({
            'id': portalItem.id,
            'result': result
          });
        }, (error) => {
          deferred.resolve(error);
        });

      return deferred.promise;
  },

  /**
   * Retrieve all users for all the items returned from the group query
   *
   * @param portalItems
   *
   * @returns {*} A collection of unique users is returned with no duplicates in the collection
   */
  getAllPossibleUsers: function (portalItems) {
      const deferred = new Deferred();

      let users = [];
      portalItems.forEach( (portalItem, i) => {
        if (users.indexOf(portalItem.owner) === -1) {
          // no match, add it to the list of unique users
          users.push(portalItem.owner);
        }

        if (i === portalItems.length - 1) {
          deferred.resolve(users);
        }
      });

      return deferred.promise;
  },

  /**
   * Retrieve information for the users
   *
   * @param users
   *
   * @returns {*}
   */
  processPortalUsers: function (users) {
      const deferred = new Deferred();
      
      let promises = [];

      const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

      // iterate over the portalItems, get all possible users
      users.forEach( (user, i) => {
        // promise
        promises.push(
          esriRequest(`${window.location.protocol}//${arcgisValidatorConfig.SHARING_COMMUNITY_URL}${user}?f=json`)
        );

        // resolve
        if (i === users.length - 1) {
          deferred.resolve(promises);
        }
      });

      return deferred.promise;
  },

  createPortalItemStore: function (portalItemsData, portalItemArr) {
    const deferred = new Deferred();

    // assign the /data information to the data property of a hybrid item
    if (portalItemsData.length > 0) {
      // iterate over the item data objects
      portalItemsData.forEach( (itemData, i) => {
        if (esriLang.isDefined(itemData.url)) {
          const url = itemData.url.split('/data');

          const id = url[0].split('/');

          // add data to portalItem
          portalItemArr.find( (d) => {
            // assign data object to data property of the hybrid item
            if (d.id === id[id.length - 1]) {
              d.data = itemData.data;
            }
          });
        } else {
          portalItemArr.find(function (d) {
            // assign data object to data property of the hybrid item
            if (d.id === itemData) {
                d.data = 'ERROR';
            }
          });
        }

        if (i === portalItemsData.length - 1) {
          deferred.resolve(portalItemArr);
        }
      });

    } else {
        deferred.resolve(portalItemArr);
    }

    return deferred.promise;
  },

  addSharedGroupsToItems: function (portalItems, sharedGroupsData) {
    const deferred = new Deferred();

    let portalItemData = [];
    
    portalItems.forEach(function (portalItem, i) {

      sharedGroupsData.find(function (d) {
        // assign data object to data property of the hybrid item
        if (d.id === portalItem.id) {
          portalItemData.push({
            itemID: portalItem.id,
            sharedGroups: d
          });
        }
      });

      if (i === portalItems.length - 1) {
        deferred.resolve(portalItemData);
      }
    });

    return deferred.promise;
  },

  createHybridItems: function (allItems, users, portalItemsAndSharedGroupObjects) {
    const deferred = new Deferred();
    
    let hybridItems = [];
    
    let itemStatus = '';
    
    let assignedCurator = '';
    
    // query nomcur and retrieve the items
    this._queryNomcur().then( (results) => {
      // all items in nomcur
      const nomcurItems = results.features.map(feature => feature.attributes);
      
      // all item ID's
      const nomcurItemsIDs = nomcurItems.map(item => item.itemID);

      // iterate over all items from the group we are currently processing
      allItems.forEach( (anItem, i) => {
        // current portal item ID
        const currentID = anItem.id;

        // check if the item is in nomcur
        const isMatch = nomcurItemsIDs.includes(currentID);

        // if the item is in nomcur, retrieve its status
        if (isMatch) {
          const match = nomcurItems.find( (num) => {
            return num.itemID == currentID;
          });
          
          itemStatus = match.OnineStatus;
          
          assignedCurator = match.Creator
          
          Ember.debug('assignedCurator', assignedCurator);
        }

        // iterate through users
        users.forEach( (user) => {
          if (anItem.item.owner === user.data.username) {
            const sharedGroups = portalItemsAndSharedGroupObjects.find( (item) => {
              return item.itemID == currentID;
            });

            hybridItems.push({
              id: anItem.id,
              data: anItem.data,
              item: anItem.item,
              user: user,
              status: itemStatus,
              assignedCurator: assignedCurator,
              shared: sharedGroups.sharedGroups.result
            });
          }
        });

        if (i === allItems.length - 1) {
          deferred.resolve(hybridItems);
        }
      });
    });

    return deferred.promise;
  },

  queryFolders: function (selectedFolderID) {
      var deferred = new Deferred();
      // retrieve PortalFolder objects
      this._fetchPortalFolderObjects(selectedFolderID).then( function (portalFolder) {
          // fetch items for each of the current PortalFolder
          this._getFolderItemsDeferred = this._fetchItemsInFolder(portalFolder, new PortalQueryParams({
              "start": 1,
              "num": 100
          })).then( function (allResults) {
              this._getFolderItemsDeferred = null;
              var _tmpStore = new Observable(new Memory({
                  data: array.filter(allResults, lang.hitch(this, function (item) {
                      return (array.indexOf(window.contributorAppConfig.VALID_TYPES, item.type) > -1);
                  }))
              }));
              deferred.resolve(_tmpStore.data);
          });
      });
      return deferred.promise;
  },

  _fetchPortalFolderObjects: function (selectedFolderID) {
      var deferred = new Deferred();
      if (selectedFolderID === "") {
          deferred.resolve("");
      }
      // iterate through each of the User's PortalFolders in their AGOL account
      array.forEach(window.contributorAppConfig.myContentFolders, function (portalFolder) {
          // if we reached a selected PortalFolder match, add it to an array of promises for querying
          if (selectedFolderID === portalFolder.id) {
              deferred.resolve(portalFolder);
          }
      });
      return deferred.promise;
  },

  _fetchItemsInFolder: function (portalFolder, qParams, allResults) {
      var deferred = new Deferred();

      if (!allResults) {
          allResults = [];
      }
      window.contributorAppConfig.portalUser.fetchItems({
          "start": esriLang.isDefined(qParams.nextStart) ? qParams.nextStart : qParams,
          "folder": portalFolder,
          "num": 100
      }).then( function (response) {
          allResults = allResults.concat(response.items);
          if (response.nextStart > -1) {
              this._fetchItemsInFolder(portalFolder, response.nextStart, allResults).then(deferred.resolve, deferred.reject);
          } else {
              deferred.resolve(allResults);
          }
      });
      return deferred.promise;
  },

  queryCurationGroups: function (portalUser) {
      var query = new Query();
      var queryTask = new QueryTask(window.location.protocol + "//services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/curation_groups/FeatureServer/0");

      if (esriLang.isDefined(portalUser)) {
          query.where = "owner = '" + portalUser.username + "'";
      } else {
          query.where = "1=1";
      }
      query.returnGeometry = false;
      query.outFields = ["*"];
      return queryTask.execute(query);
  },

  _queryNomcur: function () {

      // temp until we figure out nominator tracking
      return Ember.RSVP.resolve( { features:[] } );

      // let query = new Query();

      // const queryTask = new QueryTask(window.location.protocol + window.contributorAppConfig.NOMINATED_ITEMS);
      // query.where = "1=1";
      // query.returnGeometry = false;
      // query.outFields = ["*"];
      // /*queryTask.execute(query).then(
      //  lang.hitch(this, this._queryNomcurSuccessHandler),
      //  lang.hitch(this, this._queryNomcurErrorHandler)
      //  );*/
      // return queryTask.execute(query);
  }

});
