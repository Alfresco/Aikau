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
 * <p>This layout widget provides the ability to display tabbed content where tabs can be dynamically
 * added, selected and removed as required. Unless explicitly requested, only the content of the intially
 * selected tab will be rendered - the content of the other tabs will be rendered as they are selected. The 
 * height of the widget will grow and shrink based on the content of each tab by default unless
 * the [height]{@link module:alfresco/layout/AlfTabContainer#height} is explicitly set to a non-percentage
 * value.</p>
 * <p>If you want the widget to respond to publications to dynamically 
 * [add]{@link module:alfresco/layout/AlfTabContainer#tabAdditionTopic}, 
 * [select]{@link module:alfresco/layout/AlfTabContainer#tabSelectionTopic}, 
 * [disable]{@link module:alfresco/layout/AlfTabContainer#tabDisablementTopic} or
 * [delete]{@link module:alfresco/layout/AlfTabContainer#tabDeletionTopic} tabs then you will need to
 * configure the topics to subscribe to. Subscriptions will be made at the configured 
 * [pubSubScope]{@link module:alfresco/core/Core#pubSubScope} of the widget.</p>
 *
 * <p>You can also request an additional publication occur when requesting to add a new tab by including a
 * "publishOnAdd" attribute in the payload that is an object containing a "publishTopic" attribute (with optional
 * "publishPayload", "publishGlobal", "publishToParent" and "publishScope" attributes).</p>
 * 
 * <p><b>PLEASE NOTE:</b> It is not possible to use this module to control the layout of controls within a form. If you wish
 * to create a form containing tabbed controls then you should use the 
 * [TabbedControls]{@link module:alfresco/forms/TabbedControls} widget</p>
 *
 * @example <caption>Basic configuration (first tab will be selected):</caption>
 * {
 *    name: "alfresco/layout/AlfTabContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "TAB1",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Alfresco Logo",
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "TAB2",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Surf Logo",
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Use "delayProcessing" to force second tab to render before selection:</caption>
 * {
 *    name: "alfresco/layout/AlfTabContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "TAB1",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Alfresco Logo",
 *             selected: true,
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "TAB2",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Surf Logo",
 *             delayProcessing: false,
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Use "selected" make the second tab initially selected:</caption>
 * {
 *    name: "alfresco/layout/AlfTabContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "TAB1",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Alfresco Logo",
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "TAB2",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Surf Logo",
 *             selected: true,
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 * 
 * @example <caption>Define topics to dynamically manipulate tabs:</caption>
 * {
 *    name: "alfresco/layout/AlfTabContainer",
 *    config: {
 *       tabSelectionTopic: "SELECT_TAB_TOPIC",
 *       tabDisablementTopic: "DISABLE_TAB_TOPIC",
 *       tabAdditionTopic: "ADD_TAB_TOPIC",
 *       tabDeletionTopic: "DELETE_TAB_TOPIC",
 *       widgets: [
 *          {
 *             id: "TAB1",
 *             name: "alfresco/logo/Logo",
 *             title: "Tab with Alfresco Logo",
 *             selected
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Example publication to add a new tab (based on previous example topic):</caption>
 * {
 *    publishTopic: "ADD_TAB_TOPIC",
 *    publishPayload: {
 *       widgets: [
 *          {
 *             name: "alfresco/html/Label",
 *             title: "New",
 *             closable: true,
 *             selected: true,
 *             config: {
 *                label: "This tab was dynamically added"
 *             }
 *          }
 *       ]
 *    }
 * }
 * 
 * @module alfresco/layout/AlfTabContainer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/core/ResizeMixin
 * @author Richard Smith
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfTabContainer.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ResizeMixin",
        "alfresco/core/topics",
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/_base/lang",
        "dojo/_base/array",
        "jquery"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, ResizeMixin, 
                 topics, TabContainer, ContentPane, Deferred, domConstruct, domClass, lang, array, $) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ResizeMixin], {
      
      /**
       * An array of the CSS files to use with this widget
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfTabContainer.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfTabContainer.css"}],
      
      /**
       * The HTML template to use for the widget
       * 
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This will hold a reference to the tab container widget.
       *
       * @instance
       * @type {object}
       * @default
       */
      tabContainerWidget: null,

      /**
       * Height of the finished AlfTabContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default
       */
      height: "100%",

      /**
       * Width of the finished AlfTabContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default
       */
      width: "100%",

      /**
       * Should TabContainer layout mathematics be invoked?
       * 
       * @instance
       * @type {Boolean}
       * @default
       */
      doLayout: false,

      /**
       * This can be configured to give all tabs some padding around their content. The amount of
       * padding is controlled by the LESS variable "tab-padding"
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.79
       */
      padded: false,

      /**
       * This array is used to store widgets for delayed processing
       * 
       * @type {array}
       */
      _delayedProcessingWidgets: [],

      /**
       * The topic whose publication should trigger the selection of a tab
       * 
       * @instance
       * @type {string}
       * @default
       */
      tabSelectionTopic: null,

      /**
       * The topic whose publication should trigger the disablement/enablement of a tab
       * 
       * @instance
       * @type {string}
       * @default
       */
      tabDisablementTopic: null,

      /**
       * The topic whose publication should trigger the addition of a tab
       * 
       * @instance
       * @type {string}
       * @default
       */
      tabAdditionTopic: null,

      /**
       * The topic whose publication should trigger the deletion of a tab
       * 
       * @instance
       * @type {string}
       * @default
       */
      tabDeletionTopic: null,

      /**
       * This is the default delayed processing behaviour of tabs. By default a tabs content
       * will not be created until it is displayed (unless the tab is configured to request
       * otherwise). However, this can be overridden to switch the default so that all tab
       * content will be created as soon as the container is created.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      delayProcessingDefault: true,

      /**
       * A promise of the children of the [tabContainerWidget]{@link module:alfresco/layout/AlfTabContainer#tabContainerWidget}
       * that is resolved when it is created.
       * 
       * @instance
       * @type {object}
       * @since 1.0.79
       */
      _tabContainerChildrenPromise: null,

      /**
       * Creates the "dijit/layout/TabContainer" wrapped by this widget and sets up associated
       * subscriptions, etc.
       * 
       * @instance
       * @since 1.0.46
       */
      createTabContainer: function alfresco_layout_AlfTabContainer__createTabContainer() {
         var overallwidth = $(this.domNode).width();
         if (overallwidth)
         {
            try
            {
               // Initialise a TabContainer instance and watch its selectedChildWidget event
               this.tabContainerWidget = new TabContainer({
                  id: this.id + "_TABCONTAINER",
                  style: "height: " + this.height + "; width: " + this.width + ";",
                  doLayout: this.doLayout
               }, this.tabNode);
               this.tabContainerWidget.watch("selectedChildWidget", lang.hitch(this, this._tabChanged));

               // Setup child widgets and startup()
               if (this.widgets)
               {
                  this.widgets = array.filter(this.widgets, function(widget) {
                     return this.processAllFilters(widget.config);
                  }, this);

                  // By default we want to ensure that we don't unnecessarily process widgets for 
                  // tabs that are not immediately visible. Therefore unless specifically requested 
                  // in the configuration to be the selected tab or the to render immediately then
                  // we'll mark them all as delayed processing. If no tab is marked as selected then
                  // we'll ensure that the first tab is both selected and will be immediately rendered
                  var tabSelected = false;
                  array.forEach(this.widgets, function(widget) {
                     if ((widget.delayProcessing === true && !widget.selected) || 
                         widget.delayProcessing === false)
                     {
                        // No action, use the explicit configuration
                     }
                     else if (widget.delayProcessing === true && widget.selected)
                     {
                        // Silly configuration, if the tab is to be initially selected, processing can't be delayed...
                        widget.delayProcessingDefault = false;
                     }
                     else
                     {
                        // Use the default if no configuration is provided...
                        widget.delayProcessing = this.delayProcessingDefault;
                     }
                     tabSelected = tabSelected || widget.selected;
                  }, this);

                  if (this.widgets.length && !tabSelected)
                  {
                     this.widgets[0].selected = true;
                     this.widgets[0].delayProcessing = false;
                  }

                  // Now add tabs for each widget...
                  array.forEach(this.widgets, lang.hitch(this, this.addWidget));
               }
               this.tabContainerWidget.startup();

               // Subscribe to some optional topics
               if (this.tabSelectionTopic)
               {
                  this.alfSubscribe(this.tabSelectionTopic, lang.hitch(this, this.onTabSelect));
               }
               if (this.tabDisablementTopic)
               {
                  this.alfSubscribe(this.tabDisablementTopic, lang.hitch(this, this.onTabDisable));
               }
               if (this.tabAdditionTopic)
               {
                  this.alfSubscribe(this.tabAdditionTopic, lang.hitch(this, this.onTabAdd));
               }
               if (this.tabDeletionTopic)
               {
                  this.alfSubscribe(this.tabDeletionTopic, lang.hitch(this, this.onTabDelete));
               }
               
               this.alfPublishResizeEvent(this.domNode);
               domClass.add(this.domNode, "alfresco-layout-AlfTabContainer--tabsDisplayed");

               if (this._tabContainerChildrenPromise)
               {
                  this._tabContainerChildrenPromise.resolve(this.tabContainerWidget.getChildren());
               }
            }
            catch(e)
            {
               this.alfLog("error", "It was not possible to create a TabContainer", e, this);
            }
         }
      },

      /**
       * Returns a promise of the children of the 
       * [tabContainerWidget]{@link module:alfresco/layout/AlfTabContainer#tabContainerWidget}
       * that will be resolved when it is created.
       * 
       * @instance
       * @return {promise} A promise of the children of the tab container
       * @since 1.0.79
       */
      getTabContainerChildren: function alfresco_layout_AlfTabContainer__getTabContainerChildren() {
         return this._tabContainerChildrenPromise;
      },

      /**
       * Calls [createTabContainer]{@link module:alfresco/layout/AlfTabContainer#createTabContainer}
       * to create the "dijit/layout/TabContainer" that is wrapped by this widget.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_AlfTabContainer__postCreate() {
         this._tabContainerChildrenPromise = new Deferred();
         this.createTabContainer();
         this.alfSetupResizeSubscriptions(this.onResize, this);
         this.addResizeListener(this.domNode);
         if (this.padded)
         {
            domClass.add(this.domNode, "alfresco-layout-AlfTabContainer--padded");
         }
      },

      /**
       * This function adds widgets to the TabContainer widget
       * 
       * @instance
       * @param {object} widget The widget to add
       * @param {integer} index The index of the required tab position
       */
      addWidget: function alfresco_layout_AlfTabContainer__addWidget(widget, /*jshint unused:false*/ index) {
         var targetTabId = null;
         if (widget.id)
         {
            targetTabId = this.id + "_" + widget.id;
         }

         var indexOfDuplicateTab = this.indexOfTabId(targetTabId);
         if (indexOfDuplicateTab !== -1)
         {
            // A tab with the requested ID has already been added, so just select it...
            this.tabContainerWidget.selectChild(this.tabContainerWidget.getChildren()[indexOfDuplicateTab]);
         }
         else
         {
            // NOTE: It's important that the DOM structure of the tab is created and added to the page before 
            //       creating each child widget in order that the child widget has access to the initial dimensions
            //       of the tab (e.g. for an AlfSideBarContainer to calculate it's height appropriately)...
            var domNode = domConstruct.create("div", {});
            var cp = new ContentPane({
               id: targetTabId
            });
            domClass.add(cp.domNode, "alfresco-layout-AlfTabContainer__OuterTab");
            this.tabContainerWidget.addChild(cp, widget.tabIndex);

            // Add content to the ContentPane
            if(widget.content && typeof widget.content === "string")
            {
               cp.set("content", widget.content);
            }

            // Add a title to the ContentPane
            if(widget.title && typeof widget.title === "string")
            {
               cp.set("title", this.message(widget.title));
            }

            // Add an iconClass to the ContentPane
            if(widget.iconClass && typeof widget.iconClass === "string")
            {
               cp.set("iconClass", widget.iconClass);
            }

            // Should the ContentPane be closable?
            if(widget.closable && typeof widget.closable === "boolean")
            {
               cp.set("closable", widget.closable);
            }

            // Should the ContentPane be disabled?
            if(widget.disabled && typeof widget.disabled === "boolean")
            {
               cp.set("disabled", widget.disabled);
            }

            // If not delayed processing, create the widget and add to the panel
            if(!widget.delayProcessing)
            {
               var widgetNode = this.createWidgetDomNode(widget, cp.domNode);
               var w = this.createWidget(widget, widgetNode);
            }
            // Otherwise record the widget for processing later on
            else
            {
               this._delayedProcessingWidgets.push(
                  {
                     "domNode": cp.domNode,
                     "contentPane": cp,
                     "widget": widget
                  }
               );
            }

            // If we have an index add the ContentPane at a particular position otherwise just add it
            if (widget.selected === true)
            {
               this.tabContainerWidget.selectChild(cp);
            }
         }
      },

      /**
       * 
       * @instance
       * @param {string} id The ID of an existing tab to search for
       * @return {number} The index of the duplicate tab and -1 if a duplicate does not exist
       * @since 1.0.35
       */
      indexOfTabId: function alfresco_layout_AlfTabContainer__indexOfTabId(id) {
         var duplicateTabIndex = -1;
         if (id)
         {
            array.some(this.tabContainerWidget.getChildren(), function(tab, tabIndex) {
               var match = tab.id === id;
               if (match)
               {
                  duplicateTabIndex = tabIndex;
               }
               return match;
            }, this);
         }
         return duplicateTabIndex;
      },

      /**
       * Event triggered when the selected tab changes. Used to load delayed processing widgets.
       *
       * @instance
       * @private
       * @param {string} name
       * @param {object} oldTab
       * @param {object} newTab
       */
      _tabChanged: function alfresco_layout_AlfTabContainer___tabChanged(name, oldTab, newTab) {
         var forDeletion = null;
         for(var i = 0; i < this._delayedProcessingWidgets.length; i++)
         {
            var delayedWidget = this._delayedProcessingWidgets[i];
            if(newTab.containerNode.id === delayedWidget.contentPane.id)
            {
               var widgetNode = this.createWidgetDomNode(delayedWidget.widget, delayedWidget.domNode);
               var w = this.createWidget(delayedWidget.widget, widgetNode);

               // Add the widget to the ContentPane
               newTab.addChild(w);
               forDeletion = i;
               break;
            }
         }
         if(forDeletion || forDeletion === 0)
         {
            this._delayedProcessingWidgets.splice(forDeletion, 1);
         }
         this.alfPublish(topics.PAGE_WIDGETS_READY, {}, true);
         this.alfPublish(topics.WIDGET_PROCESSING_COMPLETE, {}, true);
         this.alfPublishResizeEvent(this.domNode);
      },

      /**
       * Resizes the TabContainer on resize events.
       *
       * @instance
       * @param {object} evt The resize event.
       */
      onResize: function alfresco_layout_AlfTabContainer__onResize() {
         if (!this.tabContainerWidget)
         {
            // If wrapped tab container does not exist then this is likely to mean that it was not
            // possible to create the widget at startup - possibly because of issues around visibility.
            // Therefore we should attempt to create the tab container again (which will get the appropriate
            // sizing)...
            this.createTabContainer();
         }
         else if (this.tabContainerWidget && typeof this.tabContainerWidget.resize === "function")
         {
            this.tabContainerWidget.resize();

            // See AKU-766 - absolutely make sure that the selected child really is selected!
            if (this.tabContainerWidget.selectedChildWidget)
            {
               this.tabContainerWidget._showChild(this.tabContainerWidget.selectedChildWidget);
            }
         }
      },

      /**
       * This function selects a tab based upon parameter 'payload.index' or 'payload.id' or 'payload.title'.
       * 
       * @instance
       * @param {object} payload Details of the tab to select
       */
      onTabSelect: function alfresco_layout_AlfTabContainer__onTabSelect(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === "number" && tabs[payload.index])
         {
            tc.selectChild(tabs[payload.index]);
         }
         else if(payload && (typeof payload.id === "string" || typeof payload.title === "string"))
         {
            var targetTabId = this.id + "_" + payload.id;
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               if((payload.id && tabs[i].id === targetTabId) || (payload.title && tabs[i].title === payload.title))
               {
                  tc.selectChild(tabs[i]);
                  break;
               }
            }
         }
         else
         {
            this.alfLog("warn", "Attempt made to select a TabController tab with an inapproriate payload", this);
         }
      },

      /**
       * This function disables or enables a tab based upon parameter 'payload.index' or 'payload.id' or 'payload.title', and 'payload.value' for the state.
       * 
       * @instance
       * @param {object} payload Details of the tab to disable or enable
       */
      onTabDisable: function alfresco_layout_AlfTabContainer__onTabDisable(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === "number" && tabs[payload.index] && typeof payload.value === "boolean")
         {
            tabs[payload.index].set("disabled", payload.value);
         }
         else if(payload && (typeof payload.id === "string" || typeof payload.title === "string") && typeof payload.value === "boolean")
         {
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               var targetTabId = this.id + "_" + payload.id;
               if((payload.id && tabs[i].id === targetTabId) || (payload.title && tabs[i].title === payload.title))
               {
                  tabs[i].set("disabled", payload.value);
                  break;
               }
            }
         }
         else
         {
            this.alfLog("warn", "Attempt made to disable or enable a TabController tab with an inapproriate payload", this);
         }
      },

      /**
       * This function adds a new tab.
       * 
       * @instance
       * @param {object} payload Details of the tab to add
       */
      onTabAdd: function alfresco_layout_AlfTabContainer__onTabAdd(payload) {
         if (payload && payload.widgets)
         {
            array.forEach(payload.widgets, lang.hitch(this, this.addWidget));
         }

         // See AKU-583...
         // It is possible to include a "publishOnAdd" attribute when creating tabs that define an additional publication to perform
         // after the tab is added...
         if (payload.publishOnAdd)
         {
            var publication = payload.publishOnAdd;
            if (publication.publishTopic)
            {
               this.alfPublish(publication.publishTopic,
                               publication.publishPayload,
                               publication.publishGlobal,
                               publication.publishToParent,
                               publication.publishScope);
            }
            else
            {
               this.alfLog("warn", "A request to add a tab included a following publication, but it did not include a 'publishTopic' attribute", payload, this);
            }
         }
      },

      /**
       * This function deletes a tab based upon parameter 'payload.index' or 'payload.id' or 'payload.title'.
       * 
       * @instance
       * @param {object} payload Details of the tab to delete
       */
      onTabDelete: function alfresco_layout_AlfTabContainer__onTabDelete(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === "number" && tabs[payload.index])
         {
            tc.removeChild(tabs[payload.index]);
         }
         else if(payload && (typeof payload.id === "string" || typeof payload.title === "string"))
         {
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               var targetTabId = this.id + "_" + payload.id;
               if((payload.id && tabs[i].id === targetTabId) || (payload.title && tabs[i].title === payload.title))
               {
                  tc.removeChild(tabs[i]);
                  break;
               }
            }
         }
         else
         {
            this.alfLog("warn", "Attempt made to remove a TabController tab with an inapproriate payload", this);
         }
      }
   });
});