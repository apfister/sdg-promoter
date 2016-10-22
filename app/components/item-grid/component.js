import Ember from 'ember';
import ENV from 'sdg-promoter/config/environment';

import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domClass from 'dojo/dom-class';

import Memory from 'dstore/Memory';
import Pagination from 'dgrid/extensions/Pagination';
import OnDemandGrid from 'dgrid/OnDemandGrid';
import all from 'dojo/promise/all';

// esri
import Portal from 'esri/portal/Portal';
import PortalQueryParams from 'esri/portal/PortalQueryParams';
import esriRequest from 'esri/request';
import esriLang from 'esri/core/lang';

export default Ember.Component.extend({

  classNames: ['item-grid'],

  portalQueryEngine: Ember.inject.service(),

  arcgisValidatorEngine: Ember.inject.service(),

  arcgisValidatorConfig: Ember.inject.service(),

  appState: Ember.inject.service(),

  didInsertElement() {

    const s = this.get('portalQueryEngine');

    // s.queryCurationGroups()
    //   .then((curationGroups) => {
    //     Ember.debug('curationGroups :', curationGroups);
    //   }, (error) => {
    //     Ember.debug('error fetching curation groups :', JSON.stringify(error));
    //   });
      
    const portal = new Portal('https://www.arcgis.com');
    // portal.authMode = 'immediate';

    this.set('portal', portal);
    
    const groupId = ENV.APP.groupId;
    
    portal.load()
      .then( () => {
        this.validateSDGGroup(groupId);
      }, (error) => {
        Ember.debug('error loading portal: ', JSON.stringify(error));
      });    

  },

  preReqToken(ioArgs) {
    if (ioArgs && ioArgs.content) {
      if (!ioArgs.content.token && this.get('session.token')) {
        ioArgs.content.token = this.get('session.token');
      }
    }
    return ioArgs;
  },

  validateSDGGroup(groupId) {
    esriRequest.setRequestPreCallback(this.preReqToken.bind(this));

    const portal = this.get('portal');

    const queryInput = groupId;

    const groupQuery = portal.queryGroups(new PortalQueryParams({
      query: 'id:' + queryInput,
      token: this.get('session.token')
    }));

    const itemQuery = portal.queryItems(new PortalQueryParams({
      query: 'id:' + queryInput,
      token: this.get('session.token')
    }));

    all({
      'groupQuery': groupQuery,
      'itemQuery': itemQuery
    }).then( (queryResults) => {

      // item query results
      const itemQueryResults = queryResults.itemQuery.results;
      // group query results
      const groupQueryResults = queryResults.groupQuery.results;
      // check if there are any results returned from the query
      if (itemQueryResults.length < 1 && groupQueryResults.length < 1) {
          // no results from either query
          // query(".js-modal-toggle")[1].click();
          Ember.debug('no results from group or item query');
      } else {
        // results
        if (groupQueryResults.length > 0) {
            // group ID
            portal.queryGroups(new PortalQueryParams({
              query: 'id:' + queryInput
            })).then(this.queryPortalResultHandler.bind(this));
        }

        if (itemQueryResults.length > 0) {
            portal.queryItems(new PortalQueryParams({
              query: 'id:' + queryInput
            })).then(this.queryPortalGroupResultHandler.bind(this));
        }
      }
    }, (error) => {
      Ember.debug('error querying for items :', JSON.stringify(error));
    });
  },

  queryPortalResultHandler(portalGroups) {
    // Ember.debug('queryPortalResultHandler', JSON.stringify(portalGroups));
    
    const portalGroup = portalGroups.results[0];

    if (esriLang.isDefined(portalGroup)) {
      // empty the contents of any previously validated items
      // userInterfaceUtils.emptyValidatedItemsContainer();
      
      // set the group labels
      // userInterfaceUtils.setGroupNameLabel(portalGroup.title);
            
      // display loader
      // userInterfaceUtils.updateValidateItemsLoader(true);
      
      this.get('appState').set('groupName', portalGroup.title);

      // query the portal group
      const portalQueryEngine = this.get('portalQueryEngine');

      portalQueryEngine.queryGroup(portalGroup)
        .then(this.queryPortalGroupResultHandler.bind(this));

    } else {
      // invalid group ID entered
      // query(".js-modal-toggle")[0].click();
      Ember.debug('invalid group ID entered');
    }
  },

  queryPortalGroupResultHandler(response) {
    // Ember.debug('queryPortalGroupResultHandler', JSON.stringify(response));
    
    // check item or group
    let allItems = null;

    if (esriLang.isDefined(response.data)) {
      // process items from group
      allItems = response.data;
    } else {
      // process single item
      allItems = response.results;
    }

    if (allItems.length < 1) {
      // query(".js-modal-toggle")[0].click();
      // hide loader
      // userInterfaceUtils.updateValidateItemsLoader(false);
      
      Ember.debug('no results found in `queryPortalGroupResultHandler` ', response);
    } else {

      const portalQueryEngine = this.get('portalQueryEngine');

      portalQueryEngine.processPortalItems(allItems)
        .then( (portalItemsAndPromises) => {

          all( portalItemsAndPromises[2] )
            .then(
              (shareGroupResponse) => {

                portalQueryEngine.addSharedGroupsToItems(allItems, shareGroupResponse)
                  .then( 
                    (portalItemsAndSharedGroupObjects) => {
                      // Ember.debug('portalItemsAndSharedGroupObjects', portalItemsAndSharedGroupObjects);
                      
                      if (portalItemsAndPromises[1].length > 0) {
                        
                        all( portalItemsAndPromises[1])
                          .then( (dataObjects) => {

                            portalQueryEngine.getAllPossibleUsers(allItems)
                              .then( (users) => {
                              // userInterfaceUtils.updateValidateItemsLoaderText("Validating items...");
                                
                                portalQueryEngine.processPortalUsers(users)
                                  .then( (portalUserPromises) => {
                                   
                                    all(portalUserPromises)
                                      .then( (portalUserObjects) => {

                                        portalQueryEngine.createPortalItemStore(dataObjects, portalItemsAndPromises[0])
                                          .then( (portalItemsAndDataObjects) => {
                                            
                                            portalQueryEngine.createHybridItems(portalItemsAndDataObjects, portalUserObjects, portalItemsAndSharedGroupObjects)
                                              .then( (hybridItems) => {
                                                //userInterfaceUtils.printItems(hybridItems);
                                                // topic.publish("validation complete", validationEngine.validateItems(hybridItems));
                                                // hide loader
                                                // userInterfaceUtils.updateValidateItemsLoader(false);
                                                
                                                const arcgisValidatorEngine = this.get('arcgisValidatorEngine');

                                                arcgisValidatorEngine.validateItems(hybridItems)
                                                  .then( (scoredItems) => {
                                                    Ember.debug(`finished validating and scoring items: ${scoredItems.length} items present.`);

                                                    this.initGrid(scoredItems);

                                                  });                                                
                                                
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      } else {
                        //TODO : fill in this part
                        Ember.debug('error 262: dunno what goes here yet');
                      }

                    },
                    (error) => {
                      Ember.debug('error on processing all `addSharedGroupsToItems` :', error);      
                    }
                  );

              },
              (error) => {
                Ember.debug('error on processing all promises during `all(portalItemsAndPromises)` :', error);
              }
            );          

        }, (error) => {
          Ember.debug('error on `processPortalItems` :', error);
        });
    }
  },

  _compare (a, b) {
    if (a.country > b.country)
      return 1;
    
    if (a.country < b.country)
      return -1;

    return 0;
  },

  initGrid(storeItems) {
    Ember.debug('firing up grid with new items ..');

    const appState = this.get('appState');

    storeItems.sort(this._compare);

    const memStore = new Memory({
      data: storeItems,
      idProperty: 'id'
    });

    appState.set('gridStore', memStore);

    const grid = new (declare([OnDemandGrid, Pagination])) ({
      // className: 'dgrid-autoheight',
      collection: memStore,
      pagingLinks: 1,
      rowsPerPage: 5,
      firstLastArrows: true,
      renderRow: (object, options) => {

        const itemID = object.id;
        const itemThumbnailUrl = this._setThumbnailUrl(itemID, object.thumbnail);
        const sharing = ( object.access === 'public' ? 'Public' : 'Not Shared' );
        const lastModified = this._formatDate(new Date(object.modified));
        const itemTypeIconUrl = this._getItemTypeIconUrl(object.type);

        const score = object.scoring.totalScore;
        let itemScoreClass = 'text-muted';
        if (score <= 10) {
          itemScoreClass = 'text-danger';
        } else if (score > 10 && score <= 35) {
          itemScoreClass = 'text-warning';
        } else if (score >= 80) {
          itemScoreClass = 'text-sucess';
        }

        let content = 
        `<div class="row item-row"> 
          <div class="col-xs-2"> 
            <div class="thumbnail">
              <img class="img-responsive center-block item-thumbnail" src=${itemThumbnailUrl}>
            </div>
          </div>
          <div class="col-xs-8">
            <div class="item-title">${object.title}</div>
            <div class="item-meta-data">
              <span class="item-type">
                <span> <img class="item-icon" src="${itemTypeIconUrl}"> </span>${object.type}</span> - 
                <span class="item-access">${sharing} - Updated ${lastModified}</span>
            </div>
            
            <div class="item-number-views">${object.numViews} views</div>
          </div>
          <div class="col-xs-2"> 
            <div>
              <span class="item-score ${itemScoreClass}">${object.scoring.totalScore}</span> <span class="item-score-sep"> /</span> <span class="item-score-100">100</span>
            </div>
          </div>
        </div>
        `;

        const node = domConstruct.toDom(content);

        let div = domConstruct.create('div', { className: 'collapsed'});
        div.appendChild(node);

        const scoring = object.scoring;
        
        let summaryContent = '<table class="table table-condensed"> <tbody>';

        scoring.items.forEach( (scoreItem) => {
          let className = 'score-graphic';

          if (scoreItem.score !== scoreItem.maxScore) {
            className += ' score-graphic-fail';
          } else {
            className += ' score-graphic-pass';
          }

          summaryContent += `<tr>
            <td class="col-xs-1">${scoreItem.label}</td>
            <td class="col-xs-5"> <div class="${className}"> ${scoreItem.score} / ${scoreItem.maxScore} </div> </td>
          </tr>
          `;

        });

        summaryContent += '</tbody></table>';

        let summaryNode = domConstruct.toDom(summaryContent);

        let summaryDiv = domConstruct.create('div', { className: 'container expando item-detail' }, div);
        summaryDiv.appendChild(summaryNode);

        return div;
      }
    }, this.element);

    grid.startup();

    appState.set('grid', grid);

    this.set('expandedNode', null);

    grid.on('.dgrid-row:click', this._gridRowClickHandler.bind(this));

    this.set('grid', grid);
  },

  _formatDate (date) {
    const arcgisValidatorConfig = this.get('arcgisValidatorConfig');

    const d = new Date(date);

    const month = arcgisValidatorConfig.MONTHS[d.getMonth()];

    if (d.isNaN) {
      return '';
    } else {
      return `${month} ${d.getDate()}, ${d.getFullYear()}`;
    }
  },

  _setThumbnailUrl (itemID, itemThumbnail) {
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    let url = window.location.origin + window.location.pathname;

    if (esriLang.isDefined(itemThumbnail)) {
      const token = this.get('session.token');

      url = `https://www.arcgis.com/sharing/rest/content/items/${itemID}/info/${itemThumbnail}?token=${token}`;

    } else {
      url = url + 'assets/images/nullThumbnail.png';
    }

    return url;
  },

  _getItemTypeIconUrl(type) {
    let iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/maps16.png';

    switch (type) {
      case 'Web Mapping Application':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/apps16.png';
        break;
      case 'Web Map':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/maps16.png';
        break;
      case 'Feature Service':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/featureshosted16.png';
        break;
      case 'Map Service':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/mapimages16.png';
        break;
      case 'Vector Tile Service':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/vectortile16.png';
        break;
      case 'Image Service':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/imagery16.png';
        break;
      case 'Web Scene':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/websceneglobal16.png';
        break;
      case 'CSV':
        iconUrl = '//js.arcgis.com/3.18/esri/css/images/item_type_icons/datafiles16.png';
        break;
      default:
        // do nothing
    }

    return iconUrl;
  },

  _gridRowClickHandler(event) {
    const row = this.get('grid').row(event);
    
    const node = row.element;

    const collapsed = domClass.contains(node, 'collapsed');

    domClass.toggle(node, 'collapsed', !collapsed);

    let expandedNode = this.get('expandedNode');

    collapsed && expandedNode && domClass.add(expandedNode, 'collapsed');

    expandedNode = collapsed ? node : null;

    this.set('expandedNode', expandedNode);
  }

});
