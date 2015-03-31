/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * <p>This widget provides multiple ways in which search requests can be made. As well as supporting the basic ability
 * to allow the user to enter a search term and hit the return key to go to a 
 * [configurable search results page]{@link module:alfresco/header/SearchBox#searchResultsPage} it also supports the ability
 * to immediately show search results for documents, sites and users as characters are entered. These "live search" results
 * can be [completely disabled]{@link module:alfresco/header/SearchBox#liveSearch} or individually disabled for any combination
 * of [documents]{@link module:alfresco/header/SearchBox#showDocumentResults}, [sites]{@link module:alfresco/header/SearchBox#showSiteResults}
 * and [users]{@link module:alfresco/header/SearchBox#showPeopleResults}.</p>
 * <p>It's possible to override [placeholder]{@link module:alfresco/header/SearchBox#placeholder} text as well as the 
 * live search result titles for [documents]{@link module:alfresco/header/SearchBox#documentsTitle}, 
 * [sites]{@link module:alfresco/header/SearchBox#sitesTitle} and [users]{@link module:alfresco/header/SearchBox#peopleTitle}. Links 
 * for individual results can also be configured and it is also possible to include
 * [hidden search terms]{@link module:alfresco/header/SearchBox#hiddenSearchTerms} in the search queries to tailor the
 * results.</p>
 * 
 * @module alfresco/header/SearchBox
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @author Dave Draper
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/TemporalUtils",
        "alfresco/core/FileSizeMixin",
        "dojo/text!./templates/SearchBox.html",
        "dojo/text!./templates/LiveSearch.html",
        "dojo/text!./templates/LiveSearchItem.html",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/header/AlfMenuBar",
        "service/constants/Default",
        "dojo/json",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/date/stamp",
        "dojo/on"], 
        function(declare, lang, array, _Widget, _Templated, TemporalUtils, FileSizeMixin, SearchBoxTemplate, 
                 LiveSearchTemplate, LiveSearchItemTemplate, AlfCore, AlfXhr, AlfMenuBar, 
                 AlfConstants, JSON, domAttr, domStyle, domClass, domConstruct, Stamp, on) {

   /**
    * LiveSearch widget
    */
   var LiveSearch = declare([_Widget, _Templated, AlfCore], {
      
      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {string}
       */
      i18nScope: "org.alfresco.SearchBox",
      
      /**
       * @instance
       * @type {object}
       * @default  null
       */
      searchBox: null,
      
      /**
       * DOM element container for Documents
       * 
       * @instance
       * @type {object}
       */
      containerNodeDocs: null,
      
      /**
       * DOM element container for Sites
       * 
       * @instance
       * @type {object}
       */
      containerNodeSites: null,
      
      /**
       * DOM element container for People
       * 
       * @instance
       * @type {object}
       */
      containerNodePeople: null,
      
      /**
       * @instance
       * @type {string}
       * @default  null
       */
      label: null,
      
      /**
       * @instance
       * @type {string}
       */
      templateString: LiveSearchTemplate,
      
      /**
       * @instance
       */
      postMixInProperties: function alfresco_header_LiveSearch__postMixInProperties() {
         // construct our I18N labels ready for template
         this.label = {};
         this.label.documents = this.message(this.searchBox.documentsTitle);
         this.label.sites = this.message(this.searchBox.sitesTitle);
         this.label.people = this.message(this.searchBox.peopleTitle);
         this.label.more = this.message(this.searchBox.moreTitle);
      },
      
      /**
       * @instance
       */
      onSearchDocsMoreClick: function alfresco_header_LiveSearch__onSearchDocsMoreClick(evt) {
         this.searchBox.liveSearchDocuments(this.searchBox.lastSearchText, this.searchBox.resultsCounts.docs);
         evt.preventDefault();
      }
   });
   
   /**
    * LiveSearchItem widget
    */
   var LiveSearchItem = declare([_Widget, _Templated, AlfCore], {

      /**
       * @instance
       * @type {object}
       */
      searchBox: null,
      
      /**
       * @instance
       * @type {string}
       */
      templateString: LiveSearchItemTemplate,
      
      /**
       * Handle storing of a "last" user search in local storage list
       *
       * @instance
       * @param {object} evt The click event
       */
      onResultClick: function alfresco_header_LiveSearchItem__onResultClick(evt) {
         this.searchBox.onSaveLastUserSearch();

         this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
            type: "FULL_PATH",
            url: this.link
         });

         evt.preventDefault();
         evt.stopPropagation();
      },

      /**
       * Handles any clicks on the meta information containing in the link (e.g. links
       * to specific sites that documents are found in).
       *
       * @instance
       * @param {object} evt The click event
       */
      onMetaClick: function alfresco_header_LiveSearchItem__onMetaClick(evt) {

         if (evt.target && evt.target.href)
         {
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               type: "FULL_PATH",
               url: evt.target.href
            });
         }

         evt.preventDefault();
         evt.stopPropagation();
      }
   });

   /**
    * alfresco/header/SearchBox widget
    */ 
   return declare([_Widget, _Templated, AlfCore, AlfXhr, TemporalUtils, FileSizeMixin], {

      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {string}
       */
      i18nScope: "org.alfresco.SearchBox",

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SearchBox.css"}]
       */
      cssRequirements: [{cssFile: "./css/SearchBox.css"}],

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/SearchBox.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/SearchBox.properties"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: SearchBoxTemplate,

      /**
       * @instance
       * @type {object}
       * @default null
       */
      _searchMenu: null,

      /**
       * This is the width of the search input field (in pixels).
       * 
       * @instance
       * @type {integer}
       * @default 180
       */
      width: "180",

      /**
       * @instance
       * @type {string}
       * @default null
       */
      site: null,

      /**
       * @instance
       * @type {boolean}
       * @default true
       */
      advancedSearch: true,
      
      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      allsites: false,
      
      /**
       * @instance
       * @type {boolean}
       * @default true
       */
      liveSearch: true,
      
      /**
       * @instance
       * @type {string}
       * @default null
       */
      lastSearchText: null,
      
      /**
       * @instance
       * @type {number}
       * @default 250
       */
      _keyRepeatWait: 250,
      
      /**
       * @instance
       * @type {number}
       * @default 2
       */
      _minimumSearchLength: 2,
      
      /**
       * @instance
       * @type {number}
       * @default 5
       */
      _resultPageSize: 5,
      
      /**
       * @instance
       * @type {object}
       * @default null
       */
      _LiveSearch: null,
      
       /**
       * @instance
       * @type {object}
       * @default null
       */
      _requests: null,
      
       /**
       * @instance
       * @type {number}
       * @default 0
       */
      _lastSearchIndex: 0,
      
      /**
       * @instance
       * @type {string}
       * @default null
       */
      resultsCounts: null,

      /**
       * This indicates whether or not the live search popup should be aligned to the
       * right or left of the search box. It defaults to true as this is the expected
       * location of the search box in Alfresco Share.
       *
       * @instance
       * @type {boolean}
       * @default "right"
       */
      alignment: "right",

      /**
       * This is the page to navigate to for document container links. It defaults
       * to the "documentlibrary" (as this is the standard document library page in
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default "documentlibrary"
       */
      documentLibraryPage: "documentlibrary",

      /**
       * This is the page to navigate to for document links. It defaults to 
       * "document-details" (as this is the standard document details page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default "document-details"
       */
      documentPage: "document-details",

      /**
       * This is the page to navigate to for blog post links. It defaults to 
       * "blog-postview" (as this is the standard blog post page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default "blog-postview"
       */
      blogPage: "blog-postview",

      /**
       * This is the page to navigate to for wiki page links. It defaults to 
       * "wiki-page" (as this is the standard Wiki page in 
       * Alfresco Share) but it can be configured to go to a custom page.
       *
       * @instance
       * @type {string}
       * @default "wiki-page"
       */
      wikiPage: "wiki-page",

      /**
       * This is the page to navigate to for site home links. It defaults to 
       * "dashboard" (as this is the standard dashboard page in 
       * Alfresco Share) but it can be configured to go to a custom page. The page
       * will be prefixed with the standard site URI token mapping (e.g. site/<site>/)
       *
       * @instance
       * @type {string}
       * @default "dashboard"
       */
      sitePage: "dashboard",

      /**
       * This is the page to navigate to for user links. It defaults to 
       * "profile" (as this is the standard profile page in 
       * Alfresco Share) but it can be configured to go to a custom page. The page
       * will be prefixed with the standard user URI token mapping (e.g. user/<user-id>/)
       *
       * @instance
       * @type {string}
       * @default "profile"
       */
      peoplePage: "profile",

      /**
       * If this is overridden to be true then hitting the enter key will not trigger a redirect
       * to a search results page.
       *
       * @instance
       * @type {boolean}
       * @default  false
       */
      suppressRedirect: false,

      /**
       * Indicates whether or not document results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showDocumentResults: true,

      /**
       * Indicates whether or not site results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showSiteResults: true,

      /**
       * Indicates whether or not people results should be displayed in the live search pane.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showPeopleResults: true,

      /**
       * Some additional search terms to include in search requests that will not be displayed to the
       * user. Setting this can tailor the results that are shown in both the search results page and
       * the live search results.
       *
       * @instance
       * @type {string}
       * @default
       */
      hiddenSearchTerms: "",

      /**
       * @instance
       */
      postMixInProperties: function alfresco_header_SearchBox__postMixInProperties() {
         // construct our I18N labels ready for template
         this.label = {};
         array.forEach(["clear"], lang.hitch(this, function(msg) {
            this.label[msg] = this.message("search." + msg);
         }));

         // Make sure that the inner width is a valid number...
         // Set the outer width (based on the requested inner width of the input field)...
         var w = parseInt(this.width, 10);
         if (isNaN(w))
         {
            this.width = "180";
            this._outerWidth = "250";
         }
         else
         {
            this._outerWidth = (w + 70) + "";
         }
      },

      /**
       * The placeholder text to set in the main input field.
       *
       * @instance
       * @type {string}
       * @default "search.instruction"
       */
      placeholder: "search.instruction",

      /**
       * The text to use for the accessibility instruction on the input field.
       *
       * @instance
       * @type {string}
       * @default "search.label"
       */
      accessibilityInstruction: "search.label",

      /**
       * The title to use as above document results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default "search.documents"
       */
      documentsTitle: "search.documents",

      /**
       * The title to use as above site results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default "search.sites"
       */
      sitesTitle: "search.sites",

      /**
       * The title to use as above people results in the live search results panel.
       * 
       * @instance
       * @type {string}
       * @default "search.people"
       */
      peopleTitle: "search.people",

      /**
       * The title to use on the button for retrieving more document results.
       * 
       * @instance
       * @type {string}
       * @default "search.more"
       */
      moreTitle: "search.more",

      /**
       * @instance
       */
      postCreate: function alfresco_header_SearchBox__postCreate() {

         this._requests = [];
         this.resultsCounts = {};
         
         domAttr.set(this._searchTextNode, "id", "HEADER_SEARCHBOX_FORM_FIELD");
         domAttr.set(this._searchTextNode, "placeholder", this.message(this.placeholder));
         
         on(this._searchTextNode, "keyup", lang.hitch(this, function(evt) {
            this.onSearchBoxKeyUp(evt);
         }));
         on(this._searchTextNode, "keydown", lang.hitch(this, function(evt) {
            this.onSearchBoxKeyDown(evt);
         }));
         
         // construct the optional advanced search menu
         if (this.advancedSearch)
         {
            var currSite = lang.getObject("Alfresco.constants.SITE");

            this._searchMenu = new AlfMenuBar({
               widgets: [
                  {
                     name: "alfresco/header/AlfMenuBarPopup",
                     config: {
                        id: this.id + "_DROPDOWN_MENU",
                        showArrow: false,
                        label: "",
                        iconSrc: require.toUrl("alfresco/header") + "/css/images/search-16-gray.png",
                        iconClass: "alf-search-icon",
                        widgets: [
                           {
                              name: "alfresco/menus/AlfMenuItem",
                              config: {
                                 id: this.id + "_ADVANCED_SEARCH",
                                 i18nScope: "org.alfresco.SearchBox",
                                 label: "search.advanced",
                                 targetUrl: (currSite ? "site/" + currSite + "/" : "") + "advsearch"
                              }
                           }
                        ]
                     }
                  }
               ]
            });
            this._searchMenu.placeAt(this._searchMenuNode);
            this._searchMenu.startup();
         }

         if (this.liveSearch)
         {
            // construct the live search panel
            this._LiveSearch = new LiveSearch({
               searchBox: this
            });

            if (this.alignment)
            {
               domClass.add(this._LiveSearch.domNode, this.alignment);
            }

            this._LiveSearch.placeAt(this._searchLiveNode);

            // event handlers to hide/show the panel
            on(window, "click", lang.hitch(this, function() {
               domStyle.set(this._LiveSearch.containerNode, "display", "none");
            }));
            on(this._searchTextNode, "click", lang.hitch(this, function(evt) {
               this.updateResults();
               evt.stopPropagation();
            }));
            on(this._LiveSearch, "click", function(evt) {
               evt.stopPropagation();
            });
         }
         
         this.addAccessibilityLabel();
      },

      /**
       * This indicated whether or not the search box should link to the faceted search page or not. It is used by the
       * [generateSearchPageLink fuction]{@link module:alfresco/header/SearchBox#generateSearchPageLink} to determine
       * the URL to generate for displaying search results. By default it will be the faceted search page.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      linkToFacetedSearch: true,

      /**
       * The search results page to use. If this is left as the default of null then it is assumed that
       * the widget is being used within Alfresco Share and the standard search page or faceted search
       * page will be used (depending upon the configuration of 
       * [linkToFacetedSearch]{@link module:alfresco/header/SearchBox#linkToFacetedSearch}). Alternatively
       * this can be configured to be a custom page.
       *
       * @instance
       * @type {string}
       * @default null
       */
      searchResultsPage: null,

      /**
       * The default scope to use when requesting a search.
       *
       * @instance
       * @type {string}
       * @default "repo"
       */
      defaultSearchScope: "repo",

      /**
       * This function is called from the [onSearchBoxKeyUp function]{@link module:alfresco/header/SearchBox#onSearchBoxKeyUp}
       * when the enter key is pressed and will generate a link to either the faceted search page or the old search page
       * based on the value of [linkToFacetedSearch]{@link module:alfresco/header/SearchBox#linkToFacetedSearch}. This function
       * can also be overridden by extending modules to link to an entirely new search page.
       *
       * @instance
       * @param {string} terms The search terms to use
       * @returns {string} The URL for the search page.
       */
      generateSearchPageLink: function alfresco_header_SearchBox__generateSearchPageLink(terms) {
         var url;
         var scope = this.defaultSearchScope;
         if (this.searchResultsPage)
         {
            // Generate custom search page link...
            url = this.searchResultsPage + "#searchTerm=" + encodeURIComponent(terms + this.hiddenSearchTerms) + "&scope=" + scope + "&sortField=Relevance";
         }
         else if (this.linkToFacetedSearch === true)
         {
            // Generate faceted search page link...
            url = "dp/ws/faceted-search#searchTerm=" + encodeURIComponent(terms + this.hiddenSearchTerms) + "&scope=" + scope + "&sortField=Relevance";
         }
         else
         {
            // Generate old search page link...
            url = "search?t=" + encodeURIComponent(terms + this.hiddenSearchTerms) + (this.allsites ? "&a=true&r=false" : "&a=false&r=true");
         }
         if (this.site)
         {
            url = "site/" + this.site + "/" + url;
         }
         this.alfLog("log", "Generated search page link", url, this);
         return url;
      },
      
      /**
       * Check if the web browser supports HTML5 local storage
       * 
       * @returns {boolean} true if local storage is available, false otherwise
       */
      _supportsLocalStorage : function alfresco_header_SearchBox__supportsLocalStorage() {
         try {
            return "localStorage" in window && window.localStorage !== null;
         }
         catch (e) {
            return false;
         }
      },
      
      /**
       * @instance
       */
      onSaveLastUserSearch: function alfresco_header_SearchBox__onSaveLastUserSearch() {
         var terms = lang.trim(this._searchTextNode.value);
         if (terms.length !== 0)
         {
            if (this._supportsLocalStorage())
            {
               var searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY")) || [];
               if (searches.length === 0 || searches[searches.length - 1] !== terms)
               {
                  searches.push(terms);
                  if (searches.length > 16)
                  {
                     searches = searches.slice(searches.length - 16);
                  }
                  localStorage.setItem("ALF_SEARCHBOX_HISTORY", JSON.stringify(searches));
               }
            }
         }
      },
      
      /**
       * Handles keydown events that occur on the <input> element. Used to page through last user searches
       * and ensure no other components handle the cursor key events.
       * 
       * @instance
       * @param {object} evt The keydown event
       */
      onSearchBoxKeyDown: function alfresco_header_SearchBox__onSearchBoxKeyDown(evt) {
         var searches;
         switch (evt.keyCode)
         {
            // Ensure left/right arrow key events are handled only by this component
            case 37:
            case 39:
            {
               evt.stopPropagation();
               break;
            }
            
            // Up Arrow press
            case 38:
            {
               evt.stopPropagation();
               if (this._supportsLocalStorage())
               {
                  searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY"));
                  if (searches)
                  {
                     if (this._lastSearchIndex === 0)
                     {
                        this._lastSearchIndex = searches.length - 1;
                     }
                     else
                     {
                        this._lastSearchIndex--;
                     }
                     this._searchTextNode.value = searches[this._lastSearchIndex];
                     this.onSearchBoxKeyUp(evt);
                  }
               }
               break;
            }
            
            // Down Arrow press
            case 40:
            {
               evt.stopPropagation();
               if (this._supportsLocalStorage())
               {
                  searches = JSON.parse(localStorage.getItem("ALF_SEARCHBOX_HISTORY"));
                  if (searches)
                  {
                     if (this._lastSearchIndex === searches.length - 1)
                     {
                        this._lastSearchIndex = 0;
                     }
                     else
                     {
                        this._lastSearchIndex++;
                     }
                     this._searchTextNode.value = searches[this._lastSearchIndex];
                     this.onSearchBoxKeyUp(evt);
                  }
               }
               break;
            }
         }
      },

      /**
       * Handles keyup events that occur on the <input> element used for capturing search terms.
       * @instance
       * @param {object} evt The keyup event
       */
      onSearchBoxKeyUp: function alfresco_header_SearchBox__onSearchBoxKeyUp(evt) {
         var terms = lang.trim(this._searchTextNode.value);
         switch (evt.keyCode)
         {
            // Enter key press
            case 13:
            {
               if (terms.length !== 0 && this.suppressRedirect !== true)
               {
                  this.onSaveLastUserSearch();
                  // ACE-1798 - always close the live search drop-down on enter keypress..
                  this.clearResults();
                  this.alfLog("log", "Search request for: ", terms);
                  var url = this.generateSearchPageLink(terms);
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", { 
                     url: url,
                     type: "SHARE_PAGE_RELATIVE",
                     target: "CURRENT"
                  });
               }
               break;
            }
            
            // Other key press
            default:
            {
               if (this.liveSearch)
               {
                  if (terms.length >= this._minimumSearchLength && terms !== this.lastSearchText)
                  {
                     this.lastSearchText = terms;

                     // abort previous XHR requests to ensure we don't display results from a previous potentially slower query
                     for (var i=0; i<this._requests.length; i++)
                     {
                        this._requests[i].cancel();
                     }
                     this._requests = [];

                     // execute our live search queries in a few ms if user has not continued typing
                     if (this._timeoutHandle)
                     {
                        clearTimeout(this._timeoutHandle);
                     }
                     var _this = this;
                     this._timeoutHandle = setTimeout(function() {
                        if (_this.showDocumentResults)
                        {
                           _this.liveSearchDocuments(terms, 0);
                        }
                        if (_this.showSiteResults)
                        {
                           _this.liveSearchSites(terms, 0);
                        }
                        if (_this.showPeopleResults)
                        {
                           _this.liveSearchPeople(terms, 0);
                        }
                     }, this._keyRepeatWait);
                  }
               }
               if (terms.length === 0)
               {
                  this.clearResults();
               }
            }
         }
      },
      
      /**
       * @instance
       * @param {string} terms
       * @param {number} startIndex
       */
      liveSearchDocuments: function alfresco_header_SearchBox__liveSearchDocuments(terms, startIndex) {
         this._requests.push(
            this.serviceXhr({
               url: AlfConstants.PROXY_URI + "slingshot/live-search-docs?t=" + encodeURIComponent(terms + this.hiddenSearchTerms) + "&maxResults=" + this._resultPageSize + "&startIndex=" + startIndex,
               method: "GET",
               successCallback: function(response) {
                  if (startIndex === 0)
                  {
                     this._LiveSearch.containerNodeDocs.innerHTML = "";
                  }
                  
                  // construct each Document item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     // construct the meta-data - site information, modified by and title description as tooltip
                     var site = (item.site ? "site/" + item.site.shortName + "/" : "");
                     var info = "";
                     if (item.site)
                     {
                        info += "<a href='" + AlfConstants.URL_PAGECONTEXT + site + this.documentLibraryPage + "'>" + this.encodeHTML(item.site.title) + "</a> | ";
                     }
                     info += "<a href='" + AlfConstants.URL_PAGECONTEXT + "user/" + this.encodeHTML(item.modifiedBy) + "/" + this.peoplePage + "'>" + this.encodeHTML(item.modifiedBy) + "</a> | ";
                     info += this.getRelativeTime(item.modifiedOn) + " | ";
                     info += this.formatFileSize(item.size);

                     var desc = this.encodeHTML(item.title);
                     if (item.description)
                     {
                        desc += (desc.length !== 0 ? "\r\n" : "") + this.encodeHTML(item.description);
                     }
                     // build the widget for the item - including the thumbnail url for the document
                     var link;
                     switch (item.container)
                     {
                        case "wiki":
                           link = this.wikiPage + "?title=" + encodeURIComponent(item.name);
                           break;
                        case "blog":
                           link = this.blogPage + "?postId=" + encodeURIComponent(item.name);
                           item.name = item.title;
                           break;
                        default:
                           link = this.documentPage + "?nodeRef=" + item.nodeRef;
                           break;
                     }
                     var lastModified = item.lastThumbnailModification || 1;
                     var itemLink = new LiveSearchItem({
                        searchBox: this,
                        cssClass: "alf-livesearch-thumbnail",
                        title: desc,
                        label: this.encodeHTML(item.name),
                        link: AlfConstants.URL_PAGECONTEXT + site + link,
                        icon: AlfConstants.PROXY_URI + "api/node/" + item.nodeRef.replace(":/", "") + "/content/thumbnails/doclib?c=queue&ph=true&lastModified=" + lastModified,
                        alt: this.encodeHTML(item.name),
                        meta: info
                     });
                     itemLink.placeAt(this._LiveSearch.containerNodeDocs);
                  }, this);
                  // the more action is added if more results are potentially available
                  domStyle.set(this._LiveSearch.nodeDocsMore, "display", response.hasMoreRecords ? "block" : "none");
                  // record the count of results
                  if (startIndex === 0)
                  {
                     this.resultsCounts.docs = 0;
                  }
                  this.resultsCounts.docs += response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  domStyle.set(this._LiveSearch.nodeDocsMore, "display", "none");
                  if (startIndex === 0)
                  {
                     this._LiveSearch.containerNodeDocs.innerHTML = "";
                     this.resultsCounts.docs = 0;
                  }
                  this.updateResults();
               },
               callbackScope: this
            }));
      },

      /**
       * @instance
       * @param {string} terms The search terms
       * @param {number} startIndex
       */
      liveSearchSites: function alfresco_header_SearchBox__liveSearchSites(terms, /*jshint unused:false*/ startIndex) {
         this._requests.push(
            this.serviceXhr({
               url: AlfConstants.PROXY_URI + "slingshot/live-search-sites?t=" + encodeURIComponent(terms + this.hiddenSearchTerms) + "&maxResults=" + this._resultPageSize,
               method: "GET",
               successCallback: function(response) {
                  this._LiveSearch.containerNodeSites.innerHTML = "";
                  
                  // construct each Site item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     var itemLink = new LiveSearchItem({
                        searchBox: this,
                        cssClass: "alf-livesearch-icon",
                        title: this.encodeHTML(item.description),
                        label: this.encodeHTML(item.title),
                        link: AlfConstants.URL_PAGECONTEXT + "site/" + item.shortName + "/" + this.sitePage,
                        icon: AlfConstants.URL_RESCONTEXT + "components/images/filetypes/generic-site-32.png",
                        alt: this.encodeHTML(item.title),
                        meta: item.description ? this.encodeHTML(item.description) : "&nbsp;"
                     });
                     itemLink.placeAt(this._LiveSearch.containerNodeSites);
                  }, this);
                  this.resultsCounts.sites = response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  this._LiveSearch.containerNodeSites.innerHTML = "";
                  this.resultsCounts.sites = 0;
                  this.updateResults();
               },
               callbackScope: this
            }));
      },
      
      /**
       * @instance
       * @param {string} terms The search terms
       * @param {number} startIndex
       */
      liveSearchPeople: function alfresco_header_SearchBox__liveSearchPeople(terms, /*jshint unused:false*/ startIndex) {
         this._requests.push(
            this.serviceXhr({
               url: AlfConstants.PROXY_URI + "slingshot/live-search-people?t=" + encodeURIComponent(terms + this.hiddenSearchTerms) + "&maxResults=" + this._resultPageSize,
               method: "GET",
               successCallback: function(response) {
                  this._LiveSearch.containerNodePeople.innerHTML = "";
                  
                  // construct each Person item as a LiveSearchItem widget
                  array.forEach(response.items, function(item) {
                     var fullName = item.firstName + " " + item.lastName;
                     var meta = this.encodeHTML(item.jobtitle || "") + (item.location ? (", "+this.encodeHTML(item.location)) : "");
                     var itemLink = new LiveSearchItem({
                        searchBox: this,
                        cssClass: "alf-livesearch-icon",
                        title: this.encodeHTML(item.jobtitle || ""),
                        label: this.encodeHTML(fullName + " (" + item.userName + ")"),
                        link: AlfConstants.URL_PAGECONTEXT + "user/" + encodeURIComponent(item.userName) + "/" + this.peoplePage,
                        icon: AlfConstants.PROXY_URI + "slingshot/profile/avatar/" + encodeURIComponent(item.userName) + "/thumbnail/avatar32",
                        alt: this.encodeHTML(fullName),
                        meta: meta ? meta : "&nbsp;"
                     });
                     itemLink.placeAt(this._LiveSearch.containerNodePeople);
                  }, this);
                  this.resultsCounts.people = response.items.length;
                  this.updateResults();
               },
               failureCallback: function() {
                  this._LiveSearch.containerNodePeople.innerHTML = "";
                  this.resultsCounts.people = 0;
                  this.updateResults();
               },
               callbackScope: this
            }));
      },

      /**
       * @instance
       */
      updateResults: function alfresco_header_SearchBox__showResults() {
         var anyResults = false;

         // Documents
         if (this.resultsCounts.docs > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodeDocs, "display", "block");
            domStyle.set(this._LiveSearch.containerNodeDocs, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodeDocs, "display", "none");
            domStyle.set(this._LiveSearch.containerNodeDocs, "display", "none");
         }

         // Sites
         if (this.resultsCounts.sites > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodeSites, "display", "block");
            domStyle.set(this._LiveSearch.containerNodeSites, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodeSites, "display", "none");
            domStyle.set(this._LiveSearch.containerNodeSites, "display", "none");
         }

         // People
         if (this.resultsCounts.people > 0)
         {
            anyResults = true;
            domStyle.set(this._LiveSearch.titleNodePeople, "display", "block");
            domStyle.set(this._LiveSearch.containerNodePeople, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.titleNodePeople, "display", "none");
            domStyle.set(this._LiveSearch.containerNodePeople, "display", "none");
         }

         // Results pane
         if (anyResults)
         {
            domStyle.set(this._LiveSearch.containerNode, "display", "block");
         }
         else
         {
            domStyle.set(this._LiveSearch.containerNode, "display", "none");
         }
      },

      /**
       * @instance
       */
      clearResults: function alfresco_header_SearchBox__clearResults() {
         this._searchTextNode.value = "";
         if (this.liveSearch)
         {
            this.lastSearchText = "";

            for (var i=0; i<this._requests.length; i++)
            {
               this._requests[i].cancel();
            }
            this._requests = [];

            this.resultsCounts = {};
            this._LiveSearch.containerNodeDocs.innerHTML = "";
            this._LiveSearch.containerNodePeople.innerHTML = "";
            this._LiveSearch.containerNodeSites.innerHTML = "";

            domStyle.set(this._LiveSearch.nodeDocsMore, "display", "none");

            this.updateResults();
         }
         this._searchTextNode.focus();
      },

      /**
       * When the search box loads, add a label to support accessibility
       * 
       * @instance
       */
      addAccessibilityLabel: function alfresco_header_SearchBox__addAccessibilityLabel() {
         domConstruct.create("label", {
            "for": "HEADER_SEARCHBOX_FORM_FIELD",
            innerHTML: this.message(this.accessibilityInstruction),
            "class": "hidden"
         }, this._searchTextNode, "before");
      },

      /**
       * @instance
       * @param {object} evt The click event
       */
      onSearchClearClick: function alfresco_header_LiveSearch__onSearchClearClick(evt) {
         this.clearResults();
         evt.preventDefault();
      }
   });
});
