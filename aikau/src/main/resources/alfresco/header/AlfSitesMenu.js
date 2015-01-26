/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @module alfresco/header/AlfSitesMenu
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/header/AlfMenuBarPopup",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect",
        "dijit/registry",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/header/AlfMenuItem",
        "alfresco/header/AlfCascadingMenu",
        "dojo/dom-style",
        "dijit/popup",
        "service/constants/Default"], 
        function(declare, AlfMenuBarPopup, AlfXhr, lang, array, aspect, registry, AlfMenuGroup, AlfMenuItem, AlfCascadingMenu, domStyle, popup, AlfConstants) {
   
   /**
    * This extends "alfresco/header/AlfMenuBarPopup" to add additional subscriptions for site data changes. Most
    * notably when site favourites are added and removed.
    */
   return declare([AlfMenuBarPopup, AlfXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfSitesMenu.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfSitesMenu.properties"}],
      
      /**
       * This should be set with the id of the current user. By default it is set to null which indicates
       * and if not overridden will result in the add/remove favourite sites menu items NOT being displayed.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      currentUser: null,
      
      /**
       * This should be set with the short name of the current site. By default it is set to the null which
       * indicates that the Sites Menu is not being displayed on a page related to a specific site. In which case
       * the "Add" and "Remove" favourite options will NOT be added.
       * @instance
       * @type {string}
       * @default null
       */
      currentSite: null,

      /**
       * Extend the default constructor to add subscriptions for handling favourites being added and removed.
       * 
       * @instance
       */
      constructor: function alfresco_header_AlfSitesMenu__constructor() {
         this.alfSubscribe("ALF_FAVOURITE_SITE_ADDED", lang.hitch(this, "favouriteAdded"));
         this.alfSubscribe("ALF_FAVOURITE_SITE_REMOVED", lang.hitch(this, "favouriteRemoved"));
         this.alfSubscribe("ALF_SITE_DETAILS_UPDATED", lang.hitch(this, "siteDetailsUpdated"));
         this.alfSubscribe("ALF_SITE_JOINED", lang.hitch(this, "siteJoined"));
         this.alfSubscribe("ALF_SITE_LEFT", lang.hitch(this, "siteLeft"));
      },
      
      /**
       * Indicates whether or not the "Recent Sites" group should be displayed or not.
       * @instance
       * @type {boolean}
       * @default true
       */
      showRecentSites: true,
      
      /**
       * Indicate whether or not to show the "Useful" group.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showUsefulGroup: true,
      
      /**
       * Indicates whether or not to show the "Site Finder" menu item.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showSiteFinder: true,
      
      /**
       * Indicates whether or not the "Create Site" menu item should be displayed or not.
       * @instance
       * @type {boolean}
       * @default true
       */
      showCreateSite: true,

      /**
       * Indicates whether or not the "My Sites" menu item should be displayed or not.
       * @instance
       * @type {boolean}
       * @default true
       */
      showMySites: true,
      
      /**
       * Indicates whether or not to show the "Favourites" cascading menu item.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showFavourites: true,
      
      /**
       * This defines the default widgets to display in the menu - just a loading image.
       * 
       * @instance
       * @type {object}
       */
      widgets: [
         {
            name: "alfresco/header/AlfMenuItem",
            config: {
               iconClass: "alf-loading-icon",
               label: "loading.label"
            }
         }
      ],
      
      /**
       * Extend the default postCreate function to setup handlers for adding the 'Useful' group once all the other
       * menu groups and items have been processed.
       *  
       * @instance
       */
      postCreate: function alf_menus_header_AlfSitesMenu__postCreate() {
         if (!this.label)
         {
            this.set("label", this.message("menu.label"));
         }
         this.inherited(arguments);
         if (this.popup)
         {
            // The "opOpen" function of the associated AlfMenuGroups widget is not defined by default so we're 
            // going to "link" it to the popupFocused function so that the first time the user clicks on the 
            // AlfSitesMenu in the menu bar we can asynchronously load the required data.
            this.popup.onOpen = dojo.hitch(this, "loadMenu");
         }
         else
         {
            this.alfLog("log", "No Sites Menu popup - something has gone wrong!");
         }
      },
      
      /**
       * A URL to override the default. Primarily provided for the test harness.
       * @instance
       * @type {string} 
       */
      _menuUrl: null,
      
      /**
       * Indicates whether or not the menu has been loaded yet.
       * @instance
       * @type {boolean} 
       * @default false
       */
      _menuLoaded: false,
      
      /**
       * This function is called when the associated AlfMenuGroups popup is opened. It asynchronously loads the
       * recently visited sites information.
       * 
       * @instance
       */
      loadMenu: function alfresco_header_AlfSitesMenu__loadMenu() {
         if (this._menuLoaded)
         {
            this.alfLog("log", "Menu already loaded");
         }
         else
         {
            this.alfLog("log", "Loading menu");
            var url = this._menuUrl;
            if (url == null)
            {
               url = AlfConstants.URL_SERVICECONTEXT + "header/sites-menu/recent";
               if (this.currentSite)
               {
                  url = url + "/site/" + this.currentSite;
               }
            }
            this.serviceXhr({url : url,
                             method: "GET",
                             successCallback: this._menuDataLoaded,
                             failureCallback: this._menuDataLoadFailed,
                             callbackScope: this});
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _menuDataLoaded: function alfresco_header_AlfSitesMenu___menuDataLoaded(response, originalRequestConfig) {
         this.alfLog("log", "Menu data loaded successfully", response);
         this._menuLoaded = true;
         
         // Check for keyboard access by seeing if the first child is focused...
         var focusFirstChild = (this.popup && this.popup.getChildren().length > 0 && this.popup.getChildren()[0].focused);
         
         // Remove the loading menu item...
         var _this = this;
         array.forEach(this.popup.getChildren(), function(widget, index) {
            _this.popup.removeChild(widget);
         });
         
         // Add recent groups if there are some...
         if (response.widgetsRecent && response.widgetsRecent.length > 0)
         {
            this.addRecentGroup(response.widgetsRecent);
         }
         
         // Add the useful group...
         this.addUsefulGroup(response.showAddFavourite, response.showRemoveFavourite);

         if (focusFirstChild)
         {
            // Focus something after the async load completes to ensure that when the user has opened the 
            // menu with the keyboard they have something selected...
            if (this.recentGroup)
            {
               this.recentGroup.focusFirstChild();
            }  
            else
            {
               this.usefulGroup.focusFirstChild();
            }
         }
         
         // Set up the favourites cascading popup to asynchronously load the favourites upon request...
         this.favoritesCascade.popup.onOpen = dojo.hitch(this, "loadFavourites");
      },
      
      /**
       * Adds the "Recent" group to the AlfMenuGroups popup.
       * 
       * @instance
       * @param {array} widgetsRecent An array of the recently visited site menu item widget configurations
       */
      addRecentGroup: function alf_header_AlfSitesMenu__addRecentGroup(widgetsRecent) {
         if (this.popup && this.showRecentSites)
         {
            // Create the 'Recent' group widget...
            this.recentGroup = new AlfMenuGroup({
               label: this.recentGroupLabel
            });
            
            // Add all the recent menu items...
            array.forEach(widgetsRecent, dojo.hitch(this, "_addMenuItem", this.recentGroup));
            
            // Add the recent group to the existing groups...
            this.popup.addChild(this.recentGroup);
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _menuDataLoadFailed: function alfresco_header_AlfSitesMenu___menuDataLoadFailed(response, originalRequestConfig) {
         this.alfLog("error", "Could not load sites menu items", response);
         var _this = this;
         array.forEach(this.popup.getChildren(), function(widget, index) {
            _this.popup.removeChild(widget);
         });
         this.addMenuFailMessageItem();
      },
      
      /**
       * This is a reference to any favourites message item that gets created (typically when either
       * favourites could not be loaded or there are no favourites to display).
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _menuMessageItem: null,
      
      /**
       * Adds a non-functional message menu item to the favourites menu. This is used when needing to 
       * indicate that the favourites could not be loaded. The most likely cause of this would be when
       * connectivity has been lost, authentication timed out or the repository has gone down since
       * loading the page.
       * 
       * @instance
       */
      addMenuFailMessageItem: function alf_header_AlfSitesMenu__addMenuFailMessageItem() {
         this._menuMessageItem = new AlfMenuItem({
            label: "menu.load.error"
         });
         this.popup.addChild(this._menuMessageItem);
      },
      
      /**
       * A URL to override the default. Primarily provided for the test harness.
       * @instance
       * @type {string}
       * @default null 
       */
      _favouritesUrl: null,
      
      /**
       * Indicates whether the users favourite sites have been loaded yet.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _favouritesLoaded: false,
      
      /**
       * This function is called when the user clicks on the "Favourites" cascading menu item to asynchronously
       * load their favourite sites.
       * 
       * @instance
       */
      loadFavourites: function alf_header_AlfSitesMenu__loadFavourites() {
         if (this._favouritesLoaded)
         {
            this.alfLog("log", "Favourites already loaded");
         }
         else
         {
            this.alfLog("log", "Loading favourites");
            var url = this._favouritesUrl;
            if (url == null)
            {
               url = AlfConstants.URL_SERVICECONTEXT + "header/sites-menu/favourites";
            }
            this.serviceXhr({url : url,
                             method: "GET",
                             successCallback: this._favouritesDataLoaded,
                             failureCallback: this._favouritesDataLoadFailed,
                             callbackScope: this});
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _favouritesDataLoaded: function alfresco_header_AlfSitesMenu___favouritesDataLoaded(response, originalRequestConfig) {
         this.alfLog("log", "Menu data loaded successfully", response);
         this._favouritesLoaded = true;
         
         // Check for keyboard access by seeing if the first child is focused...
         var focusFirstChild = (this.favouritesList && this.favouritesList.getChildren().length > 0 && this.favouritesList.getChildren()[0].focused);
         
         // Remove the loading favourites item...
         var _this = this;
         array.forEach(this.favouritesList.getChildren(), function(widget, index) {
            _this.favouritesList.removeChild(widget);
         });
         
         // Add recent groups if there are some...
         if (response.widgetsFavourites)
         {
            if (response.widgetsFavourites.length > 0)
            {
               response.widgetsFavourites.sort(this.sortFavourites);
               array.forEach(response.widgetsFavourites, dojo.hitch(this, "_addMenuItem", this.favouritesList));
            }
            else
            {
               // If there are no favourites then we don't want to just display nothing, so we'll create
               // a non-functional menu item (e.g. one that doesn't do anything) to indicate that there
               // aren't any favourites. A reference is kept so we can remove it when adding a new item.
               this.addNoFavouritesMessageItem();
            }
         }
         
         if (focusFirstChild)
         {
            // Focus the first favourite (or the no favourites item)...
            this.favouritesList.focusFirstChild();
         }
      },
      
      /**
       * This is the the sort function used for ordering favourite site menu items.
       * 
       * @instance
       * @param {object} item1 The first menu item to compare
       * @param {object} item2 The second menu item to compare
       * @returns 1 if item1 is alphabetically after item2, -1 if item2 is alphabetically after item1
       */
      sortFavourites: function alfresco_header_AlfSitesMenu__sortFavourites(item1, item2) {
         if (item1.config && item1.config.label && item2.config && item2.config.label)
         {
            return (item1.config.label > item2.config.label) ? 1 : (item1.config.label < item2.config.label) ? -1 : 0;
         }
         else if (item1.config && item1.config.label)
         {
            // Only item1 has a shortName - put this first...
            return 1;
         }
         else if (item2.config && item2.config.label)
         {
            // Only item2 has a shortName - put it first...
            return -1;
         }
         else
         {
            // Neither have a shortName
            return 0;
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      _favouritesDataLoadFailed: function alfresco_header_AlfSitesMenu___favouritesDataLoadFailed(response, originalRequestConfig) {
         this.alfLog("error", "Could not load favourites menu items", response);
         // Remove the loading favourites item...
         var _this = this;
         array.forEach(this.favouritesList.getChildren(), function(widget, index) {
            _this.favouritesList.removeChild(widget);
         });
         this.addFavouritesFailMessageItem();
      },
      
      /**
       * This is a reference to any favourites message item that gets created (typically when either
       * favourites could not be loaded or there are no favourites to display).
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _favouritesMessageItem: null,
      
      /**
       * Adds a non-functional message menu item to the favourites menu. This is used when needing to 
       * indicate that the favourites didn't load or that there are no favourites.
       * 
       * @instance
       */
      addNoFavouritesMessageItem: function alf_header_AlfSitesMenu__addNoFavouritesMessageItem() {
         this._favouritesMessageItem = new AlfMenuItem({
            label: "no.favourites.label"
         });
         this.favouritesList.addChild(this._favouritesMessageItem);
      },
      
      /**
       * Adds a non-functional message menu item to the favourites menu. This is used when needing to 
       * indicate that the favourites could not be loaded. The most likely cause of this would be when
       * connectivity has been lost, authentication timed out or the repository has gone down since
       * loading the page.
       * 
       * @instance
       */
      addFavouritesFailMessageItem: function alf_header_AlfSitesMenu__addFavouritesFailMessageItem() {
         this._favouritesMessageItem = new AlfMenuItem({
            label: "favourites.load.error"
         });
         this.favouritesList.addChild(this._favouritesMessageItem);
      },
      
      /**
       * Adds an individual menu item.
       * 
       * @instance
       * @param {object} group The group to add the menu item to
       * @param {object} widget The menu item to add
       * @param {integer} index The index to add the menu item at.
       */
      _addMenuItem: function(group, widget, index) {
         this.alfLog("log", "Adding menu item", widget, index, group);
         var item = new AlfMenuItem(widget.config);
         group.addChild(item);
      },
      
      /**
       * This function add the 'Useful' group and associated menu items into the AlfMenuGroups popup.
       * 
       * @instance
       * @param {boolean} showAddFavourite Indicates whether or not to display the "Add Favourite" menu item
       * @param {boolean} showRemoveFavourite Indicates whether or not to display the "Remove Favourite" menu item
       */
      addUsefulGroup: function alf_header_AlfSitesMenu__addUsefulGroup(showAddFavourite, showRemoveFavourite) {
         this.alfLog("log", "Creating 'Useful' group");
         if (this.popup && this.showUsefulGroup)
         {
            // Create the 'Useful' group widget...
            this.usefulGroup = new AlfMenuGroup({
               label: this.usefulGroupLabel
            });
            
            // Create and add the 'My Sites', 'Site Finder' and 'Create Site' menu items to it...
            if (this.showMySites)
            {
               this.mySites = new AlfMenuItem({
                  id: this.id + "_MY_SITES",
                  label: this.mySitesLabel,
                  iconClass: this.mySitesIconClass,
                  targetUrl: "user/" + encodeURIComponent(AlfConstants.USERNAME) + "/user-sites"
               });
               this.usefulGroup.addChild(this.mySites);
            }
            if (this.showSiteFinder)
            {
               this.siteFinder = new AlfMenuItem({
                  id: this.id + "_SITE_FINDER",
                  label: this.siteFinderLabel,
                  iconClass: this.siteFinderIconClass,
                  targetUrl: "site-finder"
               });
               this.usefulGroup.addChild(this.siteFinder);
            }
            if (this.showCreateSite)
            {
               this.createSite = new AlfMenuItem({
                  id: this.id + "_CREATE_SITE",
                  label: this.createSiteLabel,
                  iconClass: this.createSiteIconClass,
                  publishTopic: "ALF_CREATE_SITE"
               });
               this.usefulGroup.addChild(this.createSite);
            }

            if (this.showFavourites)
            {
               // Create a basic group for holding the favourites...
               this.favouritesList = new AlfMenuGroup({
                  widgets: [{
                     name: "alfresco/header/AlfMenuItem",
                     config: {
                        iconClass: "alf-loading-icon",
                        label: this.message("loading.label")
                     }
                  }]
               });
               
               // Create the cascading menu item to popout the favourites list...
               this.favoritesCascade = new AlfCascadingMenu({
                  id: this.id + "_FAVOURITES",
                  label: this.favouriteGroupLabel,
                  iconClass: this.favouriteGroupIconClass
               });
               
               // Add the list into the cascading menu...
               this.favoritesCascade.popup.addChild(this.favouritesList);

               // Add the default menu items...
               this.usefulGroup.addChild(this.favoritesCascade);
               
               // If the current page is associated with a site then add the add and remove favourite site options...
               if (this.currentSite && this.currentSite !== "" && this.currentUser && this.currentUser !== "")
               {
                  // Always create the Add and Remove favourite menu items, but only add them if requested
                  // This is done so that we can add and remove the menu items easily upon request...
                  this.addFavourite = new AlfMenuItem({
                     id: this.id + "_ADD_FAVOURITE",
                     label: this.addFavouriteLabel,
                     iconClass: this.addFavouriteIconClass,
                     publishTopic: "ALF_ADD_FAVOURITE_SITE",
                     publishPayload: {
                        site: this.currentSite,
                        user: this.currentUser
                     }
                  });
                  this.removeFavourite = new AlfMenuItem({
                     id: this.id + "_REMOVE_FAVOURITE",
                     label: this.removeFavouriteLabel,
                     iconClass: this.removeFavouriteIconClass,
                     publishTopic: "ALF_REMOVE_FAVOURITE_SITE",
                     publishPayload: {
                        site: this.currentSite,
                        user: this.currentUser
                     }
                  });

                  if (showAddFavourite)
                  {
                     // Update the site and user information for the add favourite site config, create the menu
                     // item and add it to the group...
                    this.usefulGroup.addChild(this.addFavourite);
                  }
                  
                  if (showRemoveFavourite)
                  {
                     // Update the site and user information for the remove favourite site config, create the menu
                     // item and add it to the group...
                     this.usefulGroup.addChild(this.removeFavourite);
                  }
               }
            }

            // Add the useful group to the existing groups...
            this.popup.addChild(this.usefulGroup);
         }
      },
      
      /**
       * This function adds a new favourite to the favourites list. 
       * 
       * @instance
       * @param {object} data The details of the site to make a favourite
       */
      addFavouriteMenuItem: function alfresco_header_AlfSitesMenu__addFavouriteMenuItem(data) {
         // Check a potential favourite has been defined. This information should be provided so that all of the 
         // information for making the current site a favourite is available. If 'potentialFavouriteConfig' is not
         // defined then this indicates that either the AlfSitesMenu has not been configured correctly or that the
         // user is NOT on a site page (and that the 'add favourite' item has been shown in error...
         this.alfLog("log", "Adding favourite menu item", data);
         if (data && data.site)
         {
            // Check that a site title is available...
            if (data.title)
            {
               // Add the favourite...
               this.alfLog("log", "Title provided");
               this._addFavouriteMenuItem(data.site, data.title);
            }
            else
            {
               this.alfLog("log", "No title provided - retrieving from repository...");
               
               // If the title isn't available - go and fetch it...
               // Create a unique topic and subscribe to it, this topic will be passed for the
               // site details to be posted against. The subscription handle is intentionally not
               // kept and removed later because it is assumed that the uniqueness of the topic
               // will ensure it is not published against.
               var _this = this,
                   responseTopic = this.generateUuid();
               this.alfSubscribe(responseTopic, function(payload) {
                  if (payload && payload.title && payload.shortName)
                  {
                     _this.alfLog("log", "Retrieved site details", payload);
                     _this._addFavouriteMenuItem(payload.shortName, payload.title);
                  }
                  else
                  {
                     // Handle unexpected data (which may result from a failed request)...
                     _this.alfLog("error", "Site data not returned in the expected structure", payload);
                  }
               });
               
               // Publish a request for site information, passing a unique topic for the response
               // to be published against (which has already been subscribed to)...
               this.alfPublish("ALF_GET_SITE_DETAILS", {
                  site: data.site,
                  responseTopic: responseTopic
               });
            }
         }
         else
         {
            this.alfLog("error", "A request was made to add a favourite site, but there is no 'site' attribute has been defined.", data);
         }
      },
      
      /**
       * This is a 'private' function that should not be called directly. It is called from the 'addFavouriteMenuItem' function
       * from two different code paths. It needed to be separated into a new function so that it could be used after retrieving
       * the site title or when the site title was already available.
       * 
       * @instance
       * @param {string} siteShortName The site shortname to use for the favourite
       * @param {string} siteTitle The title of the site to display as the label of the menu item.
       */
      _addFavouriteMenuItem: function alfresco_header_AlfSitesMenu___addFavouriteMenuItem(siteShortName, siteTitle) {
         this.alfLog("log", "Adding favourite", siteShortName, siteTitle);
         
         // Remove any message menu item...
         if (this._favouritesMessageItem)
         {
            this.favouritesList.removeChild(this._favouritesMessageItem);
         }

         var newFavourite = new AlfMenuItem({
            label: siteTitle,
            iconClass: this.favouriteGroupIconClass,
            targetUrl: "site/" + siteShortName + "/dashboard",
            siteShortName: siteShortName
         });
         
         if (this.favouritesList)
         {
            var currFavourites = this.favouritesList.getChildren(),
            foundIndex = null;
            for (var i=0; i<currFavourites.length && foundIndex == null; i++)
            {
               if (newFavourite.label < currFavourites[i].label)
               {
                  foundIndex = i;
               }
            }
            this.alfLog("log", "Adding favourite at index: ", foundIndex);
            this.favouritesList.addChild(newFavourite, foundIndex);
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} data An object that should contain site and user attributes
       */
      favouriteAdded: function alfresco_header_AlfSitesMenu__favouriteAdded(data) {
         this.alfLog("log", "Favourite Site Added", data);
         
         if (data.site)
         {
            if (data.site == this.currentSite)
            {
               // The site removed is the site the user is currently viewing, so we can removed the option to make the 
               // current site a favourite...
               this.usefulGroup.removeChild(this.addFavourite);
               this.usefulGroup.addChild(this.removeFavourite);
            }

            // Update the Sites Menu favourites list with the new favourite menu item...
            this.addFavouriteMenuItem({site: data.site, title: data.title});
         }
         else
         {
            this.alfLog("warn", "A favourite site has been added, but the site name has NOT been provided. The Sites Menu will not be modified");
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} data An object that should contain site and user attributes
       */
      favouriteRemoved: function alfresco_header_AlfSitesMenu__favouriteRemoved(data) {
         this.alfLog("log", "Favourite Site Removed", data);
         
         if (data && data.site == this.currentSite)
         {
            // A request has been made to remove the current site.
            this.usefulGroup.removeChild(this.removeFavourite);
            this.usefulGroup.addChild(this.addFavourite);
         }
         
         // Search through the favourites list and remove any matching favourite item...
         if (this.favouritesList)
         {
            var _this = this;
            array.forEach(this.favouritesList.getChildren(), function(currFavourite, index) {
               if (currFavourite.siteShortName == data.site)
               {
                  // Remove the favourite, but keep a reference to the removed menu item in case
                  // the user decides to add it back in. This makes sense because we don't want
                  // have to try to retrieve the site title (as it won't be readily available)...
                  _this.favouritesList.removeChild(currFavourite);
               }
            });
         }
         
         // If we've just removed the last favourite then add a message menu item to indicate
         // that there are no favourites...
         if (this.favouritesList && this.favouritesList.getChildren().length === 0)
         {
            this.addNoFavouritesMessageItem();
         }
      },
      
      /**
       * When a user joins a site then they should automatically be given the option to make the site a favourite.
       * The current design of the header means that the entire page will be reloaded (which will then reflect
       * the change in favourites).
       * 
       * @instance
       * @param {object} data An object that should include details of the user and the joined site
       */
      siteJoined: function alfresco_header_AlfSitesMenu__siteJoined(data) {
         // At the moment nothing is being implemented here, because the page will be reloaded anyway
      },
      
      /**
       * When a user leaves a site this function is called so that the favourite site is removed from
       * their preferences.
       * 
       * @instance
       * @param {object} data An object that should include details of the user and the joined left
       */
      siteLeft: function alfresco_header_AlfSitesMenu__siteLeft(data) {
         // At the moment nothing is being implemented here, because the page will be reloaded anyway
      },
      
      /**
       * 
       * @instance
       * @param {object} data 
       */
      siteDetailsUpdated: function alfresco_header_AlfSitesMenu__siteDetailsUpdated(data) {
         this.alfLog("log", "Not yet implemented!");
         // TODO: Implement this!
      },
      
      /**
       * The label for the "Recently Visited Sites" group.
       * 
       * @instance
       * @type {string}
       * @default "recent.sites.label"
       */
      recentGroupLabel: "recent.sites.label",
      
      /**
       * The label for the "Favourite Sites" group.
       * 
       * @instance
       * @type {string}
       * @default "favourite.sites.label"
       */
      favouriteGroupLabel: "favourite.sites.label",
      
      /**
       * The label for the "Useful" group - this group contains the Site Finder, Create Site and Add/Remove
       * favourite menu items.
       * 
       * @instance
       * @type {string}
       * @default "useful.sites.label"
       */
      usefulGroupLabel: "useful.sites.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-favourite-site-icon"
       */
      favouriteGroupIconClass: "alf-favourite-site-icon",
      
      /**
       * @instance
       * @type {string}
       * @default "site-finder.label"
       */
      siteFinderLabel: "site-finder.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-site-finder-icon"
       */
      siteFinderIconClass: "alf-site-finder-icon",
      
      /**
       * @instance
       * @type {string}
       * @default "create-site.label"
       */
      createSiteLabel: "create-site.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-create-site-icon"
       */
      createSiteIconClass: "alf-create-site-icon",
      
      /**
       * @instance
       * @type {string}
       * @default "my-sites.label"
       */
      mySitesLabel: "my-sites.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-my-sites-icon"
       */
      mySitesIconClass: "alf-my-sites-icon",
      
      /**
       * @instance
       * @type {string}
       * @default "add-favourite-site.label"
       */
      addFavouriteLabel: "add-favourite-site.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-favourite-site-icon"
       */
      addFavouriteIconClass:  "alf-add-favourite-site-icon",
      
      /**
       * @instance
       * @type {string}
       * @default "remove-favourite-site.label"
       */
      removeFavouriteLabel: "remove-favourite-site.label",
      
      /**
       * @instance
       * @type {string}
       * @default "alf-remove-favourite-site-icon"
       */
      removeFavouriteIconClass: "alf-remove-favourite-site-icon"
   });
});
