/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This is the root list module.
 *
 * @module alfresco/lists/AlfList
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/core/DynamicWidgetProcessingTopics
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfList.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/DynamicWidgetProcessingTopics",
        "alfresco/documentlibrary/views/AlfDocumentListView",
        "alfresco/menus/AlfCheckableMenuItem",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class"],
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, _AlfDocumentListTopicMixin,
                 DynamicWidgetProcessingTopics, AlfDocumentListView, AlfCheckableMenuItem, array, lang, domConstruct, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, _AlfDocumentListTopicMixin, DynamicWidgetProcessingTopics], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfList.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfList.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfList.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * A map of views that the list can switch between.
       *
       * @instance
       * @type {object}
       * @default null
       */
      viewMap: null,

      /**
       * A map of the additional controls that each view requires. This is map is populated as each view
       * is selected (so that the controls are only loaded once) but are then loaded from the map. This
       * allows the same controls to be added and removed as views are switched.
       *
       * @instance
       * @type {object}
       * @default null
       */
      viewControlsMap: null,

      /**
       * The widgets processed by AlfDocumentList should all be instances of "alfresco/documentlibrary/AlfDocumentListView".
       * Any widget that is instantiated that does not inherit from that class will not be included as a view.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * Is there currently a request in progress?
       *
       * @instance
       * @default false
       * @type {Boolean}
       */
      requestInProgress: false,

      /**
       * Should we prevent multiple simultaneous requests
       *
       * @instance
       * @default false
       * @type {Boolean}
       */
      blockConcurrentRequests: false,

      /**
       * Indicates whether Infinite Scroll should be used when requesting documents
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      useInfiniteScroll: false,

      /**
       * This is the topic to publish to make requests to retrieve data to populate the list
       * with. This can be overridden with alternative topics to obtain different data sets
       *
       * @instance
       * @type {string}
       * @default "ALF_RETRIEVE_DOCUMENTS_REQUEST"
       */
      loadDataPublishTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST",

      /**
       * This is the payload to publish to make requests to retrieve data to populate the list
       * with.
       *
       * @instance
       * @type {object}
       * @default null
       */
      loadDataPublishPayload: null,

      /**
       * Subscribe the document list topics.
       *
       * @instance
       */
      postMixInProperties: function alfresco_lists_AlfList__postMixInProperties() {
         this.setupSubscriptions();
         this.setDisplayMessages();
      },

      /**
       * This function sets up the subscriptions that the Document List relies upon to manage its
       * internal state and request documents.
       *
       * @instance
       */
      setupSubscriptions: function alfresco_lists_AlfList__setupSubscriptions() {
         this.alfSubscribe(this.reloadDataTopic, lang.hitch(this, this.loadData));
         this.alfSubscribe(this.viewSelectionTopic, lang.hitch(this, this.onViewSelected));
         this.alfSubscribe(this.loadDataPublishTopic + "_SUCCESS", lang.hitch(this, this.onDataLoadSuccess));
         this.alfSubscribe(this.loadDataPublishTopic + "_FAILURE", lang.hitch(this, this.onDataLoadFailure));
         this.alfSubscribe(this.requestInProgressTopic, lang.hitch(this, this.onRequestInProgress));
         this.alfSubscribe(this.requestFinishedTopic, lang.hitch(this, this.onRequestFinished));
         if (this.useInfiniteScroll)
         {
            this.alfSubscribe(this.scrollNearBottom, lang.hitch(this, this.onScrollNearBottom));
         }
      },

      /**
       * This is the message to display when no view is selected. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */
      noViewSelectedMessage: "alflist.no.view.message",

      /**
       * This is the message to display when no view is selected. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      noDataMessage: "alflist.no.data.message",

      /**
       * This is the message to display when no data is available. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      fetchingDataMessage: "alflist.loading.data.message",

      /**
       * This is the message to display whilst data is being loaded. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      renderingViewMessage: "alflist.rendering.data.message",

      /**
       * This is the message to display when an error occurs rendering data. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      fetchingMoreDataMessage: "alflist.loading.data.message",

      /**
       * This is the message to display when data cannot be loaded Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      dataFailureMessage: "alflist.data.failure.message",

      /**
       * This function should be overridden as necessary to change the messages displayed for various states
       * of the list, e.g.
       * <ul><li>When no view is configured</li>
       * <li>When there is no data to render</li>
       * <li>When data is being retrieved</li>
       * <li>When the view is being rendered</li>
       * <li>When the additional data is being retrieved (e.g. on infinite scroll)</li></ul>
       *
       * @instance
       */
      setDisplayMessages: function alfresco_lists_AlfList__setDisplayMessages() {
         this.noViewSelectedMessage = this.message(this.noViewSelectedMessage);
         this.noDataMessage = this.message(this.noDataMessage);
         this.fetchingDataMessage = this.message(this.fetchingDataMessage);
         this.renderingViewMessage = this.message(this.renderingViewMessage);
         this.fetchingMoreDataMessage = this.message(this.fetchingMoreDataMessage);
         this.dataFailureMessage = this.message(this.dataFailureMessage);
      },

      /**
       * @instance
       */
      postCreate: function alfresco_lists_AlfList__postCreate() {
         // Process the array of widgets. Only views should be included as widgets of the DocumentList.
         if (this.widgets)
         {
            // Opting to NOT clone the widgets for performance here, but leaving the code commented out
            // for hasty re-insertion if necessary. It *shouldn't* be necessary to clone here because
            // the views will clone as necessary...
            // this.processWidgets(JSON.parse(JSON.stringify(this.widgets)));
            this.processWidgets(this.widgets);
         }
      },

      /**
       * This indicates that the instance should wait for all widgets on the page to finish rendering before
       * making any attempt to load data. If this is set to true then loading can begin as soon as this instance
       * has finished being created. This needs to be overridden in the case where the instance is created
       * dynamically after the page has loaded.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      waitForPageWidgets: true,

      /**
       * This is updated by the [onPageWidgetsReady]{@link module:alfresco/lists/AlfList#onPageWidgetsReady}
       * function to be true when all widgets on the page have been loaded. It is used to block loading of
       * data until the page is completely setup. This is done to avoid multiple data loads as other widgets
       * on the page publish the details of their initial state (which would otherwise trigger a call to
       * [loadData]{@link module:alfresco/lists/AlfList#onPageWidgetsReady})
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _readyToLoad: false,

      /**
       * The list is intended to work co-operatively with other widgets on a page to assist with
       * setting the data that should be retrieved. As related widgets are created and publish their initial
       * state they may trigger requests to load data. As such, data loading should not be started until
       * all the widgets on the page are ready.
       *
       * @instance
       * @param {object} payload
       */
      onPageWidgetsReady: function alfresco_lists_AlfList__onPageWidgetsReady(payload) {
         this.alfUnsubscribe(this.pageWidgetsReadySubcription);
         this._readyToLoad = true;
         if (this.currentData != null)
         {
            this.processLoadedData(this.currentData);
            this.renderView();
         }
         else
         {
            this.loadData();
         }
      },

      /**
       * The preference property to use for saving the current view. Initially defaulted to
       * the document library view preference but can be overridden if desired.
       *
       * @instance
       * @type {string}
       * @default "org.alfresco.share.documentList.viewRendererName"
       */
      viewPreferenceProperty: "org.alfresco.share.documentList.viewRendererName",

      /**
       * Iterates over the widgets processed and calls the [registerView]{@link module:alfresco/lists/AlfList#registerView}
       * function with each one.
       *
       * @instance
       * @param {object[]} The created widgets
       */
      allWidgetsProcessed: function alfresco_lists_AlfList__allWidgetsProcessed(widgets) {
         this.viewMap = {};
         array.forEach(widgets, lang.hitch(this, "registerView"));

         // If no default view has been provided, then just use the first...
         if (this._currentlySelectedView == null)
         {
            for (var view in this.viewMap) {
               this._currentlySelectedView = view;
               break;
            }
         }

         this.alfPublish(this.viewSelectionTopic, {
            value: this._currentlySelectedView,
            preference: this.viewPreferenceProperty
         });

         if (this.waitForPageWidgets === true)
         {
            // Create a subscription to listen out for all widgets on the page being reported
            // as ready (then we can start loading data)...
            this.pageWidgetsReadySubcription = this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, "onPageWidgetsReady"), true);
         }
         else
         {
            // Load data immediately...
            this._readyToLoad = true;
            this.onPageWidgetsReady();
         }
      },

      /**
       * This is called from [allWidgetsProcessed]{@link module:alfresco/lists/AlfList#allWidgetsProcessed} for
       * each widget defined. Only widgets that inherit from [AlfDocumentListView]{@link module:alfresco/documentlibrary/views/AlfDocumentListView}
       * will be successfully registered.
       *
       * @instance
       * @param {object} view The view to register
       * @param {number} index
       */
      registerView: function alfresco_lists_AlfList__registerView(view, index) {
         if (view.isInstanceOf(AlfDocumentListView))
         {
            this.alfLog("log", "Registering view", view);
            var viewSelectionConfig = view.getViewSelectionConfig();
            if (viewSelectionConfig == null || !this.isValidViewSelectionConfig(viewSelectionConfig))
            {
               this.alfLog("error", "The following view does not provide a valid selection menu item upon request", viewSelectionConfig);
            }
            else
            {
               // Update the view message to be consistent with the configuration of the list...
               view.noItemsMessage = this.noDataMessage;
               this.processView(view, index);
            }
         }
         else
         {
            this.alfLog("warn", "The following widget was provided as a view, but it does not inherit from 'alfresco/documentlibrary/AlfDocumentListView'", view);
         }
      },

      /**
       * Processes a registered view. This function essentially adds the view to the
       * [viewMap]{@link module:alfresco/lists/AlfList#viewMap}.
       *
       * @instance
       * @param {object} view The view to process
       * @param {number} index The view index
       */
      processView: function alfresco_lists_AlfList__processView(view, index) {
         var viewName = view.getViewName();
         if (viewName == null)
         {
            viewName = index;
         }

         // Create a new new menu item using the supplied configuration...
         var viewSelectionConfig = view.getViewSelectionConfig();
         viewSelectionConfig.value = viewName;

         // Check if this is the initially requested view...
         if (viewName == this.view)
         {
            this._currentlySelectedView = viewName;
            viewSelectionConfig.checked = true;
         }

         // Attempt to get a localized version of the label...
         viewSelectionConfig.label = this.message(viewSelectionConfig.label);

         // Publish the additional controls...
         this.publishAdditionalControls(viewName, view);

         // Set the value of the publish topic...
         viewSelectionConfig.publishTopic = this.viewSelectionTopic;
         viewSelectionConfig.publishPayload = {
            preference: this.viewPreferenceProperty
         };

         // Set a common group for the menu item...
         viewSelectionConfig.group = this.viewSelectionMenuItemGroup;

         // Make sure to inherit pubSubScope:
         viewSelectionConfig.pubSubScope = this.pubSubScope;

         // Create a new AlfCheckableMenuItem for selecting the view. This will then be published and any menus that have subscribed
         // to the topic defined by "selectionMenuItemTopic" should add the menu item. When the menu item is clicked it will publish
         // the selection on the topic defined by the "viewSelectionTopic" (to which this DocumentList instance subscribes) and the
         // new view will be rendered...
         var selectionMenuItem = new AlfCheckableMenuItem(viewSelectionConfig);

         // If the view meets all the required criteria then we can add it for selection...
         this.alfPublish(this.selectionMenuItemTopic, {
            menuItem: selectionMenuItem
         });
         this.viewMap[viewName] = view;
      },

      /**
       * This is the ID of the widget that should be targeted with adding additional view controls to
       *
       * @instance
       * @type {string}
       * @default "DOCLIB_TOOLBAR"
       */
      additionalControlsTarget: "DOCLIB_TOOLBAR",

      /**
       * This is the dynacmic visibility configuration that should be applied
       * to all additional controls added for a view.
       *
       * @instance
       * @type {object}
       * @default null
       */
      additionalViewControlVisibilityConfig: null,

      /**
       * Gets the additional controls for a view and publishes them.
       *
       * @instance
       * @param {string} viewName The name of the view
       * @param {object} view The view to get the controls for.
       */
      publishAdditionalControls: function alfresco_lists_AlfList__publishAdditionalControls(viewName, view) {
         if (this.viewControlsMap == null)
         {
            this.viewControlsMap = {};
         }

         // Get any new additional controls (check the map first)
         var newAdditionalControls = this.viewControlsMap[viewName];
         if (newAdditionalControls == null)
         {
            newAdditionalControls = view.getAdditionalControls();
            if (this.additionalViewControlVisibilityConfig != null)
            {
               array.forEach(newAdditionalControls, function(control, index) {
                  control.visibilityConfig = this.additionalViewControlVisibilityConfig;
                  this.setupVisibilityConfigProcessing(control);
               }, this);
            }
            this.viewControlsMap[viewName] = newAdditionalControls;
         }

         // Publish the new additional controls for anyone wishing to display them...
         if (newAdditionalControls != null)
         {
            this.alfPublish(this.dynamicallyAddWidgetTopic, {
               targetId: this.additionalControlsTarget,
               targetPosition: 0,
               widgets: newAdditionalControls
            });
         }
      },

      /**
       * By default this just ensures that a label has been provided. However this function could be overridden to provide
       * more complete validation if there are specific requirements for view selection configuration.
       *
       * @instance isValidViewSelectionConfig
       * @param {object} viewSelectionConfig The configuration to validate
       * @return {boolean} Either true or false depending upon the validity of the supplied configuration.
       */
      isValidViewSelectionConfig: function alfresco_lists_AlfList__isValidViewSelectionConfig(viewSelectionConfig) {
         return (viewSelectionConfig.label != null && viewSelectionConfig.label !== "");
      },

      /**
       * Use to keeps track of the [view]{@link module:alfresco/documentlibrary/views/AlfDocumentListView} that is currently selected.
       *
       * @instance
       * @type {string}
       * @default null
       */
      _currentlySelectedView: null,

      /**
       * Used to keep track of the current data for rendering by [views]{@link module:alfresco/documentlibrary/views/AlfDocumentListView}.
       *
       * @instance
       * @type {object}
       * @default null
       */
      currentData: null,

      /**
       * Handles requests to switch views. This is called whenever the [viewSelectionTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#viewSelectionTopic}
       * topic is published on and expects a payload containing an attribute "value" which should map to a registered
       * [view]{@link module:alfresco/documentlibrary/views/AlfDocumentListView}. The views are mapped against the index they were configured
       * with so the value is expected to be an integer.
       *
       * @instance
       * @param {object} payload The payload published on the view selection topic.
       */
      onViewSelected: function alfresco_lists_AlfList__onViewSelected(payload) {
         if (this.currentData == null)
         {
            this.alfLog("warn", "There is no data to render a view with");
            this.showNoDataMessage();
         }
         else if (payload == null || payload.value == null)
         {
            this.alfLog("warn", "A request was made to select a view, but not enough information was provided", payload);
         }
         else if (this._currentlySelectedView == payload.value)
         {
            // The requested view is the current view. No action required.
         }
         else if (this.viewMap[payload.value] == null)
         {
            // An invalid view was requested. Each view will have been mapped to the order in which it occurred in the
            // the "widgets" array provided for the DocumentList. The payload value attribute should correspond to an
            // index from that array...
            this.alfLog("error", "A request was made to select a non-existent view. Requested view: ", payload.value, " from: ", this.viewMap);
         }
         else
         {
            // Just do some double-checking to be sure...
            if (typeof this.viewMap[payload.value].renderView === "function")
            {
               // Render the selected view...
               this._currentlySelectedView = payload.value;
               var newView = this.viewMap[payload.value];
               this.showRenderingMessage();
               newView.setData(this.currentData);
               newView.currentData.previousItemCount = 0;
               newView.renderView(false);
               this.showView(newView);
            }
            else
            {
               this.alfLog("error", "A view was requested that does not define a 'renderView' function", this.viewMap[payload.value]);
            }
         }
      },

      /**
       * Iterates over all the views and calls their 
       * [clearOldView]{@link module:alfresco/documentlibrary/views/AlfDocumentListView#clearOldView} function.
       *
       * @instance
       */
      clearViews: function alfresco_lists_AlfList__clearViews() {
         for (var viewName in this.viewMap)
         {
            var view = this.viewMap[viewName];
            if (typeof view.clearOldView === "function")
            {
               view.clearOldView();
            }
         }
      },

      /**
       * Hides all the children of the supplied DOM node by applying the "share-hidden" CSS class to them.
       *
       * @instance
       * @param {Element} targetNode The DOM node to hide the children of.
       */
      hideChildren: function alfresco_lists_AlfList__hideChildren(targetNode) {
         array.forEach(targetNode.children, function(node) {
            domClass.add(node, "share-hidden");
         });
      },

      /**
       * If there is no data to render a view with then this function will be called to update the DocumentList
       * view node with a message explaining the situation.
       *
       * @instance
       */
      showNoDataMessage: function alfresco_lists_AlfList__showNoDataMessage() {
         this.hideChildren(this.domNode);
         domClass.remove(this.noDataNode, "share-hidden");
      },

      /**
       * If there is no data to render a view with then this function will be called to update the DocumentList
       * view node with a message explaining the situation.
       *
       * @instance
       */
      showDataLoadFailure: function alfresco_lists_AlfList__showDataLoadFailure() {
         this.hideChildren(this.domNode);
         domClass.remove(this.dataFailureNode, "share-hidden");
      },

      /**
       * This is called before a request to load more data is made so that the user is aware that data
       * is being asynchronously loaded.
       *
       * @instance
       */
      showLoadingMessage: function alfresco_lists_AlfList__showLoadingMessage() {
         if (!this.useInfiniteScroll)
         {
            this.hideChildren(this.domNode);
            domClass.remove(this.dataLoadingNode, "share-hidden");
         }
         else
         {
            domClass.remove(this.dataLoadingMoreNode, "share-hidden");
         }
      },

      /**
       * This is called once data has been loaded but before the view rendering begins. This can be useful
       * when there is a lot of data and the view is complex to render so may not be instantaneous.
       *
       * @instance
       */
      showRenderingMessage: function alfresco_lists_AlfList__showRenderingMessage() {
         if (!this.useInfiniteScroll)
         {
            this.hideChildren(this.domNode);
            domClass.remove(this.renderingViewNode, "share-hidden");
         }
      },

      /**
       * @instance
       * @param {object} view The view to show
       */
      showView: function alfresco_lists_AlfList__showView(view) {
         this.hideChildren(this.domNode);
         if (this.viewsNode.children.length > 0)
         {
            this.viewsNode.removeChild(this.viewsNode.children[0]);
         }

         // Add the new view...
         domConstruct.place(view.domNode, this.viewsNode);
         domClass.remove(this.viewsNode, "share-hidden");

         // Tell the view that it's now on display...
         view.onViewShown();
      },

      /**
       * Makes a request to load data from the repository. If the request is successful then then the
       * [onDataLoadSuccess]{@link module:alfresco/lists/AlfList#onDataLoadSuccess}
       * function will be called. If the request fails then the
       * [onDataLoadFailure]{@link module:alfresco/lists/AlfList#onDataLoadFailure}
       * function will be called.
       *
       * @instance
       */
      loadData: function alfresco_lists_AlfList__loadData() {
         if (!this.requestInProgress)
         {
            this.showLoadingMessage();

            // Clear the previous data only when not configured to use infinite scroll...
            if (!this.useInfiniteScroll)
            {
               this.clearViews();
            }

            var payload;
            if (this.loadDataPublishPayload)
            {
               payload = lang.clone(this.loadDataPublishPayload);
            }
            else
            {
               payload = {};
            }

            payload.alfResponseTopic = this.pubSubScope + this.loadDataPublishTopic;
            this.updateLoadDataPayload(payload);
            this.alfPublish(this.loadDataPublishTopic, payload, true);
         }
         else
         {
            // Let the user know that we're still waiting on the last data load?
            this.alfLog("warn", "Waiting for previous data load request to complete", this);
         }
      },

      /**
       * This is an extension point for extending modules to use. By default it does nothing to
       * the supplied payload.
       *
       * @instance
       * @param {object} payload The payload object to update
       */
      updateLoadDataPayload: function alfresco_lists_AlfList__updateLoadDataPayload(payload) {
         // Does nothing by default.
      },

      /**
       * The property in the data response that is the attribute of items to render
       *
       * @instance
       * @type {string}
       * @default "items"
       */
      itemsProperty: "items",

      /**
       * The property in the data response that is a metadata attribute containing additional information
       * about the overall context of the list. This defaults to "metadata". If not attribute with the
       * defined name is provided then no data will be assigned.
       *
       * @instance
       * @type {string}
       * @default "metadata"
       */
      metadataProperty: "metadata",

      /**
       * The property in the response that indicates the starting index of overall data to request.
       *
       * @instance
       * @type {string}
       * @default "startIndex"
       */
      startIndexProperty: "startIndex",

      /**
       * The property in the response that indicates the total number of results available.
       *
       * @instance
       * @type {string}
       * @default "startIndex"
       */
      totalResultsProperty: "totalRecords",

      /**
       * Handles successful calls to get data from the repository.
       *
       * @instance
       * @param {object} response The response object
       * @param {object} originalRequestConfig The configuration that was passed to the the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadSuccess: function alfresco_lists_AlfList__onDataLoadSuccess(payload) {
         this.alfLog("log", "Data Loaded", payload, this);

         var foundItems = false;
         if (this.itemsProperty == null)
         {
            this.currentData = {};
            this.currentData.items = payload.response;
            foundItems = true;
         }
         else
         {
            var items = lang.getObject(this.itemsProperty, false, payload.response);
            if (items == null)
            {
               // As a fallback we're going to check the actual payload object...
               // It would be reasonable to ask why we don't just look in payload initially and
               // expect the "itemsProperty" to include "response", however that is not the most common
               // scenario and this approach catches the edge cases...
               items = lang.getObject(this.itemsProperty, false, payload);
            }

            if (items)
            {
               this.currentData = {};
               this.currentData.items = items;
               foundItems = true;

               // We lose metaData unless we store that as well.
               var metadata = lang.getObject(this.metadataProperty, false, payload.response);
               if (metadata)
               {
                  this.currentData.metadata = metadata;
               }
            }
            else
            {
               this.showDataLoadFailure();
            }
         }

         if (foundItems)
         {
            if (payload.response) 
            {
               this.processLoadedData(payload.response);
            }
            else
            {
               this.processLoadedData(this.currentData);
            }
            this.renderView();
         }

         // This request has finished, allow another one to be triggered.
         this.alfPublish(this.requestFinishedTopic, {});
      },

      /**
       * This function renders the view with the current data.
       *
       * @instance
       */
      renderView: function alfresco_lists_AlfList__renderView() {
         // Re-render the current view with the new data...
         var view = this.viewMap[this._currentlySelectedView];
         if (view != null)
         {
            this.showRenderingMessage();
            view.setData(this.currentData);
            view.renderView(this.useInfiniteScroll);
            this.showView(view);

            // Force a resize of the sidebar container to take the new height of the view into account...
            this.alfPublish("ALF_RESIZE_SIDEBAR", {});
         }
      },

      /**
       * Publishes the details of the documents that have been loaded (primarily for multi-selection purposes)
       *
       * @instance
       * @param {object} response The original response.
       */
      processLoadedData: function alfresco_lists_AlfList__processLoadedData(response) {
         // Publish the details of the loaded documents. The initial use case for this was to allow
         // the selected items menu to know how many items were available for selection but it
         // clearly has many other uses...
         var totalDocuments = this.currentData.items.length;
         var startIndex = 0;
         if (response != null)
         {
            var tmp = lang.getObject(this.totalResultsProperty, false, response);
            if (tmp != null)
            {
               totalDocuments = tmp;
            }

            tmp = lang.getObject(this.startIndexProperty, false, response);
            if (tmp != null)
            {
               startIndex = tmp;
            }
         }

         this.alfPublish(this.documentsLoadedTopic, {
            documents: this.currentData.items,
            totalDocuments: totalDocuments,
            startIndex: startIndex
         });
      },

      /**
       * Handles failed calls to get data from the repository.
       *
       * @instance
       * @param {object} response The response object
       * @param {object} originalRequestConfig The configuration that was passed to the the [serviceXhr]{@link module:alfresco/core/CoreXhr#serviceXhr} function
       */
      onDataLoadFailure: function alfresco_lists_AlfList__onDataLoadSuccess(response, originalRequestConfig) {
         this.alfLog("error", "Data Load Failed", response, originalRequestConfig);
         this.currentData = null;
         this.showDataLoadFailure();
         this.alfPublish(this.requestFinishedTopic, {});
      },

      /**
       * This is an extension point function that performs no action but can be overridden by
       * extending modules.
       *
       * @instance
       * @param payload
       */
      onScrollNearBottom: function  alfresco_lists_AlfList__onScrollNearBottom(payload) {
         // No action by default - this is an extension point only.
      },

      /**
       * Triggered when a request is in progress to prevent multiple submissions.
       *
       * @instance
       */
      onRequestInProgress: function alfresco_lists_AlfList__onRequestInProgress() {
         this.requestInProgress = true;
      },

      /**
       * Triggered when a request has finished to allow another submission.
       *
       * @instance
       */
      onRequestFinished: function alfresco_lists_AlfList__onRequestFinished() {
         this.requestInProgress = false;
      }
   });
});