/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * An abstract view for the Alfresco Share document list. It can be used in JSON page models if
 * configured with a widgets definition. Otherwise it can be extended to define specific views
 *
 * @module alfresco/lists/views/AlfListView
 * @extends module:alfresco/core/BaseWidget
 * @mixes module:alfresco/core/_ConstructedWidgetMixin
 * @mixes external:dojo/_KeyNavContainer
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/BaseWidget",
        "alfresco/core/_ConstructedWidgetMixin",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "alfresco/lists/views/ListRenderer",
        "alfresco/lists/views/RenderAppendixSentinel",
        "alfresco/core/Core",
        "alfresco/core/JsNode",
        "alfresco/core/WidgetsCreator",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/query"],
        function(declare, BaseWidget, _ConstructedWidgetMixin, _MultiItemRendererMixin, _AlfDndDocumentUploadMixin, ListRenderer,
                 RenderAppendixSentinel, AlfCore, JsNode, WidgetsCreator, lang, array, domConstruct, domClass, query) {

   return declare([BaseWidget, _ConstructedWidgetMixin, _MultiItemRendererMixin, AlfCore, _AlfDndDocumentUploadMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfListView.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfListView.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfListView.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfListView.css"}],

      /**
       * This is the topic that will be subscribed to when [subscribeToDocRequests]
       * {@link module:alfresco/lists/views/AlfListView#subscribeToDocRequests} is
       * configured to be true.
       *
       * @instance
       * @type {string}
       * @default
       */
      documentSubscriptionTopic: "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS",

      /**
       * This is the property of each item in the list that uniquely identifies that item. This
       * should be configured correctly in order for items to be 
       * [brought into view]{@link module alfresco/lists/views/ListRenderer#bringItemIntoView} as required.
       * 
       * @instance
       * @type {string}
       * @default
       */
      itemKey: "nodeRef",

      /**
       * This is the property that is used to lookup documents in the subscribed topic.
       *
       * @instance
       * @type {string}
       * @default
       */
      itemsProperty: "response.items",

      /**
       * This can be set to be a custom message that is displayed when there are no items to
       * be displayed in the current view. This will not be used if 
       * [widgetsForNoDataDisplay]{@link module alfresco/lists/views/ListRenderer#widgetsForNoDataDisplay}
       * is configured.
       *
       * @instance
       * @type {string}
       * @default
       */
      noItemsMessage: null,

      /**
       * This is the default CSS selector query to use to check whether any data has actually been rendered.
       * It's used from within the [renderView]{@link module:alfresco/lists/views/AlfListView#renderView}
       * function to check that data is actually rendered (because even though renderable items might exist it's possible
       * for them to be filtered out so that they're not displayed). This needs to be overriden by views that don't
       * render a DOM that matches the query.
       *
       * @instance
       * @type {string}
       * @default
       */
      renderFilterSelectorQuery: "tr",

      /**
       * Should the widget subscribe to events triggered by the documents request?
       * This should be set to true in the widget config for standalone/isolated usage.
       *
       * @instance
       * @type Boolean
       * @default
       */
      subscribeToDocRequests: false,

      /**
       * Overrides the 
       * [inherited default configuration]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#suppressDndUploading}
       * to suppress the drag-and-drop upload highlighting.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.39
       */
      suppressDndUploading: true,
      
      /**
       * This will be automatically set when the view is used in an [AlfHashList]{@link module:alfresco/lists/AlfHashList}.
       * It indicates whether or not the list is being driven by data set on the browser URL hash and it can be useful
       * for views to have access to this information.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.56
       */
      useHash: null,

      /**
       * Whether the list that's creating this view has infinite scroll turned on
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.32
       */
      useInfiniteScroll: false,
      
      /**
       * The configuration for view selection menu items. This needs to be either configured or defined in an
       * extending module. If this isn't specified then the view will not be selectable in the document list.
       *
       * @instance
       * @type {Object}
       * @default {}
       */
      viewSelectionConfig: {
         label: "Abstract",
         value: "Abstract"
      },

      /**
       * The widgets to be processed to generate each item in the rendered view.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * An optional widget model to be rendered as an appendix to the actual data. If this is
       * defined then it will never be possible for the
       * [widgetsForNoDataDisplay]{@link module:alfresco/lists/views/AlfListView#widgetsForNoDataDisplay}
       * model to be rendered because it results in a special 
       * [marker]{@link module:alfresco/lists/views/RenderAppendixSentinel}
       * being added to the data set to be rendered.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.44
       */
      widgetsForAppendix: null,

      /**
       * An optional JSON model defining the widgets to display when no data is available to display.
       *
       * @instance
       * @type {array}
       * @default
       */
      widgetsForNoDataDisplay: null,
      
      /**
       * Builds the DOM structure.
       * 
       * @instance buildDOMStructure
       */
      buildDOMStructure : function alfresco_lists_views_AlfListView__buildDOMStructure(rootNode) {
          var nodeProps = this._buildDOMNodeProperties();
          
          nodeProps.className += " ";
          nodeProps.className += "alfresco-lists-views-AlfListView";
    
          this.domNode = domConstruct.create("div", nodeProps, rootNode);
          this._setupWidgetInfo();
          this.tableNode = domConstruct.create("table", {
              cellspacing : "0",
              cellpadding : "0"
          }, this.domNode);
      },

      /**
       * Implements the widget life-cycle method to add drag-and-drop upload capabilities to the root DOM node.
       * This allows files to be dragged and dropped from the operating system directly into the browser
       * and uploaded to the location represented by the document list.
       *
       * @instance
       */
      postCreate: function alfresco_lists_views_AlfListView__postCreate() {
         this.inherited(arguments);

         // Set up a subscription to handle requests for the view name.
         // This supports other widgets displaying the name (rather than value) of views and
         // also acts as a "role call" of views to check that an expected view is available
         this.alfSubscribe("ALF_VIEW_NAME_REQUEST", lang.hitch(this, this.onViewNameRequest));

         // Allow custom messages to be displayed when no items are available for display...
         if (!this.noItemsMessage)
         {
            this.noItemsMessage = this.message("doclistview.no.data.message");
         }
         else
         {
            this.noItemsMessage = this.message(this.noItemsMessage);
         }

         // Call DND upload mixin functions to add support for uploading behaviour...
         this.subscribeToCurrentNodeChanges(this.domNode);
         this.addUploadDragAndDrop(this.domNode);

         if (this.subscribeToDocRequests)
         {
            this.alfSubscribe(this.documentSubscriptionTopic, lang.hitch(this, this.onDocumentsLoaded));
         }
         if (this.currentData)
         {
            // Render the initial data - make sure any previous data is cleared (not that there should be any!)
            this.renderView(false);
         }
         this._renderOptionalElements();
      },

      /**
       * If the supplied payload contains a view value that matches this view then this will resolve
       * the promise that should be included.
       *
       * @instance
       * @param {object} payload A payload containing a view value and a promise to resolve.
       */
      onViewNameRequest: function alfresco_lists_views_AlfListView__onViewNameRequest(payload) {
         if (payload && 
             payload.value === this.getViewName() && 
             payload.promise && 
             typeof payload.promise.resolve === "function")
         {
            payload.promise.resolve({
               value: this.getViewName(),
               label: this.viewSelectionConfig.label 
            });
         }
      },

      /**
       * @instance
       * @param {object} payload The details of the documents that have been provided.
       */
      onDocumentsLoaded: function alfresco_lists_views_AlfListView__onDocumentsLoaded(payload) {
         var items = lang.getObject(this.itemsProperty, false, payload);
         if (items)
         {
            array.forEach(items, lang.hitch(this, this.processItem));
            this.setData({
               items: items
            });
            this.renderView(false);
         }
         else
         {
            this.alfLog("warn", "Payload contained no 'response.items' attribute", payload, this);
         }
      },

      /**
       * Attempts to process an item provided to the
       * [onDocumentsLoaded]{@link module:alfresco/lists/views/AlfListView#onDocumentsLoaded}
       * function. By default this attempts to process node data as the default behaviour is to assume this
       * is an Alfresco node.
       *
       * @instance
       * @param {object} item The item to process
       * @param {number} index The index of the item
       */
      processItem: function alfresco_lists_views_AlfListView__processItem(item, /*jshint unused:false*/ index) {
         try
         {
            if (item.node)
            {
               item.jsNode = new JsNode(item.node);
            }
         }
         catch (e)
         {
            this.alfLog("warn", "Could not process item as Alfresco node", item, e);
         }
      },

      /**
       * This should be overridden to give each view a name. If it's not overridden then the view will just get given
       * a name of the index that it was registered with. It will still be possible to select the view but it will cause
       * issues with preferences.
       *
       * @instance
       * @returns {string} "Abstract"
       */
      getViewName: function alfresco_lists_views_AlfListView__getViewName() {
         return this.viewSelectionConfig.value;
      },

      /**
       * This should be overridden to provide configuration for view selection. As a minimum, a localised label MUST be provided
       * as the "label" attribute. Other attributes that could be provided would be "iconClass". This configuration will typically
       * be used to construct a menu item. By default this just returns the
       * [viewSelectionConfig]{@link module:alfresco/lists/views/AlfListView#viewSelectionConfig}
       *
       * @instance
       * @returns {Object} The configuration for selecting the view.
       */
      getViewSelectionConfig: function alfresco_lists_views_AlfListView__getViewSelectionConfig() {
         return this.viewSelectionConfig;
      },


      /**
       * This function should be overridden to publish the details of any additional controls that are needed to control
       * view of the data that it provides. An example of a control would be the thumbnail size slider for the gallery
       * control.
       *
       * @instance getAdditionalControls
       * @returns {Object[]}
       */
      getAdditionalControls: function alfresco_lists_views_AlfListView__getAdditionalControls() {
         // For the abstract view there are no additional controls.
         return [];
      },

      /**
       * Extends the inherited function to also update the docListRenderer if it exists with the data.
       *
       * @instance
       * @param {object} newData The additional data to add.
       */
      augmentData: function alfresco_lists_views_AlfListView__augmentData(/*jshint unused:false*/ newData) {
         this.inherited(arguments);
         if (this.docListRenderer)
         {
            this.docListRenderer.currentData = this.currentData;
         }
      },

      /**
       * Calls the [renderData]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#renderData}
       * function if the [currentData]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#currentData}
       * attribute has been set to an object with an "items" attribute that is an array of objects.
       *
       * @instance
       * @param {boolean} preserveCurrentData This should be set to true when you don't want to clear the old data, the
       * most common example of this is when infinite scroll is being used.
       */
      renderView: function alfresco_lists_views_AlfListView__renderView(preserveCurrentData) {
         if (this.currentData && this.currentData.items)
         {
            if (this.widgetsForAppendix)
            {
               var containsSentinel = array.some(this.currentData.items, function(item) {
                  return item === RenderAppendixSentinel;
               });
               !containsSentinel && this.currentData.items.push(RenderAppendixSentinel);
            }

            if (this.currentData.items.length > 0)
            {
               try
               {
                  if (this.messageNode)
                  {
                     domConstruct.destroy(this.messageNode);
                  }

                  // If we don't want to preserve the current data (e.g. if infinite scroll isn't being used)
                  // then we should destroy the previous renderer...
                  if ((preserveCurrentData === false || preserveCurrentData === undefined) && this.docListRenderer)
                  {
                     this.destroyRenderer();
                  }

                  // If the renderer is null we need to create one (this typically wouldn't be expected to happen)
                  // when rendering additional infinite scroll data...
                  if (!this.docListRenderer)
                  {
                     this.docListRenderer = this.createListRenderer();
                     this.docListRenderer.placeAt(this.tableNode, "last");
                  }

                  // Ensure that the renderer has has the same itemKey value as configured on the view. This is
                  // so that comparisons can be made for selection and items can be brought into view as necessary
                  this.docListRenderer.itemKey = this.itemKey;
                  
                  // Finally, render the current data (when using infinite scroll the data should have been augmented)
                  this.docListRenderer.renderData();

                  // Check to see if any rows were rendered (allows for renderFilters on widgets. If they weren't, render no Data Display.
                  if (query(this.renderFilterSelectorQuery, this.tableNode).length === 0)
                  {
                     this.renderNoDataDisplay();
                  }
               }
               catch(e)
               {
                  this.alfLog("error", "The following error occurred rendering the data", e, this);
                  this.renderErrorDisplay();
               }
            }
            else
            {
               this.renderNoDataDisplay();
            }
         }
         else
         {
            this.renderNoDataDisplay();
         }
      },

      /**
       * Creates a new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       *
       * @instance
       * @returns {object} A new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       */
      createListRenderer: function alfresco_lists_views_AlfListView__createListRenderer() {
         var dlr = new ListRenderer({
            id: this.id + "_ITEMS",
            widgets: this.widgets,
            suppressWidgetInfo : this.suppressWidgetInfo,
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            widgetsForAppendix: this.widgetsForAppendix
         });
         return dlr;
      },

      /**
       * Removes the previously rendered view.
       *
       * @instance
       */
      clearOldView: function alfresco_lists_views_AlfListView__clearOldView() {
         this.destroyRenderer();
         if (this.messageNode)
         {
            domConstruct.destroy(this.messageNode);
         }
         // Remove all table body elements. (preserves headers)
         query("tbody", this.tableNode).forEach(domConstruct.destroy);
         this.clearData();
      },

      /**
       * This should be called when the renderers need to be removed. 
       * 
       * @instance
       * @extendable
       * @since 1.0.32
       */
      destroyRenderer: function alfresco_lists_views_AlfListView__destroyRenderer() {
         if (this.docListRenderer)
         {
            this.docListRenderer.destroy();
            // TODO: Concerned about this - it needs further investigation as to why anything is being left behind!
            this.docListRenderer = null;
         }
      },

      /**
       * Called from [renderView]{@link module:alfresco/lists/views/AlfListView#renderView} for
       * every widget created for the last view. It is important that widgets are properly destroyed to ensure that
       * they do not respond to topics that they have subscribed to (e.g. selection events such as selecting all
       * documents).
       *
       * @instance
       * @param {object} widget The widget to destroy
       * @param {number} index The index of the widget
       */
      destroyWidget: function alfresco_lists_views_AlfListView__destroyWidget(widget) {
         if (typeof widget.destroyRecursive === "function")
         {
            widget.destroyRecursive();
         }
      },

      /**
       * Called after the view has been shown (note that [renderView]{@link module:alfresco/lists/views/AlfListView#renderView}
       * does not mean that the view has been displayed, just that it has been rendered.
       * @instance
       */
      onViewShown: function alfresco_lists_views_AlfListView__onViewShown() {
         this.alfPublish("ALF_WIDGET_PROCESSING_COMPLETE", {}, true);
      },

      /**
       * This method is called when there is no data to be shown. By default this just shows a standard localized
       * message to say that there is no data.
       *
       * @instance
       */
      renderNoDataDisplay: function alfresco_lists_views_AlfListView__renderNoDataDisplay() {
         this.clearOldView();

         // Only generate message node if there's a label or widgets to go in it.
         if (this.noItemsMessage || this.widgetsForNoDataDisplay)
         {
            this.messageNode = domConstruct.create("div", {
               className: "alfresco-lists-views-AlfListView__no-data",
               innerHTML: this.noItemsMessage
            }, this.domNode);
         }

         // If specific widgets have been defined to display when there are no results then replace
         // the default message with them...
         if (this.widgetsForNoDataDisplay)
         {
            var wc = new WidgetsCreator({
               widgets: this.widgetsForNoDataDisplay
            });
            domConstruct.empty(this.messageNode);
            wc.buildWidgets(this.messageNode);
         }
      },

      /**
       * This method is called when there is an error occurred rendering the view
       *
       * @instance
       */
      renderErrorDisplay: function alfresco_lists_views_AlfListView__renderErrorDisplay() {
         this.clearOldView();
         this.messageNode = domConstruct.create("div", {
            className: "alfresco-lists-views-AlfListView__render-error",
            innerHTML: this.message("doclistview.rendering.error.message")
         }, this.domNode);
      },

      /**
       * Runs _renderHeader() and _renderCaption() in the correct order to construct the elements appropriately
       *
       * @instance
       */
      _renderOptionalElements: function alfresco_lists_views_AlfListView___renderOptionalElements() {
         this._renderHeader();
         this._renderCaption();
      },

      /**
       * Optionally builds the header contents from a nested set of widgets in attribute widgetsForHeader
       *
       * @instance
       */
      _renderHeader: function alfresco_lists_views_AlfListView___renderHeader() {
         this.currentItem = {};
         if (this.widgetsForHeader)
         {
            var thead = domConstruct.create("thead", null, this.tableNode, "first");
            var clonedWidgets = lang.clone(this.widgetsForHeader);
            this.processObject(["processInstanceTokens"], clonedWidgets);
            this.processWidgets(clonedWidgets, thead);
         }
         this.currentItem = null;
      },

      /**
       * Optionally add a caption to the generated table
       *
       * @instance
       */
      _renderCaption: function alfresco_lists_views_AlfListView___renderCaption() {
         if(this.a11yCaption && this.tableNode)
         {
            // Create a caption node
            var caption = domConstruct.create("caption", {
               innerHTML: this.a11yCaption
            }, this.tableNode, "first");

            // Apply a class to the caption
            if(this.a11yCaptionClass)
            {
               domClass.add(caption, this.a11yCaptionClass);
            }
         }
      }
   });
});