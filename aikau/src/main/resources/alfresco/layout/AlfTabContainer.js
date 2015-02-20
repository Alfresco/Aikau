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
 * @module alfresco/layout/AlfTabContainer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfTabContainer.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, TabContainer, ContentPane, domConstruct, lang, array) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
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
       * @default null
       */
      tabContainerWidget: null,

      /**
       * Height of the finished AlfTabContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default "100%"
       */
      height: "100%",

      /**
       * Width of the finished AlfTabContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default "100%"
       */
      width: "100%",

      /**
       * Should TabContainer layout mathematics be invoked?
       * 
       * @instance
       * @type {Boolean}
       * @default false
       */
      doLayout: false,

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
       * @default null
       */
      tabSelectionTopic: null,

      /**
       * The topic whose publication should trigger the disablement/enablement of a tab
       * 
       * @instance
       * @type {string}
       * @default null
       */
      tabDisablementTopic: null,

      /**
       * The topic whose publication should trigger the addition of a tab
       * 
       * @instance
       * @type {string}
       * @default null
       */
      tabAdditionTopic: null,

      /**
       * The topic whose publication should trigger the deletion of a tab
       * 
       * @instance
       * @type {string}
       * @default null
       */
      tabDeletionTopic: null,

      /**
       * @instance
       */
      postCreate: function alfresco_layout_AlfTabContainer__postCreate() {

         // Initialise a TabContainer instance and watch its selectedChildWidget event
         this.tabContainerWidget = new TabContainer({
            style: "height: " + this.height + "; width: " + this.width + ";",
            doLayout: this.doLayout
         }, this.tabNode);
         this.tabContainerWidget.watch("selectedChildWidget", lang.hitch(this, "_tabChanged"));

         // Setup child widgets and startup()
         if (this.widgets)
         {
            array.forEach(this.widgets, lang.hitch(this, "addWidget"));
         }
         this.tabContainerWidget.startup();

         // Subscribe to some optional topics
         if (this.tabSelectionTopic != null)
         {
            this.alfSubscribe(this.tabSelectionTopic, lang.hitch(this, "tabSelect"));
         }
         if (this.tabDisablementTopic != null)
         {
            this.alfSubscribe(this.tabDisablementTopic, lang.hitch(this, "tabDisable"));
         }
         if (this.tabAdditionTopic != null)
         {
            this.alfSubscribe(this.tabAdditionTopic, lang.hitch(this, "tabAdd"));
         }
         if (this.tabDeletionTopic != null)
         {
            this.alfSubscribe(this.tabDeletionTopic, lang.hitch(this, "tabDelete"));
         }
      },

      /**
       * This function adds widgets to the TabContainer widget
       * 
       * @instance
       * @param {object} widget The widget to add
       * @param {integer} index The index of the required tab position
       */
      addWidget: function alfresco_layout_AlfTabContainer__addWidget(widget, index) {

         // Create a domNode and ContentPane
         var domNode = domConstruct.create("div", {}),
             cp = new ContentPane();

         // Add content to the ContentPane
         if(widget.content && typeof widget.content === "string")
         {
            cp.set('content', widget.content);
         }

         // Add a title to the ContentPane
         if(widget.title && typeof widget.title === "string")
         {
            cp.set('title', this.message(widget.title));
         }

         // Add an iconClass to the ContentPane
         if(widget.iconClass && typeof widget.iconClass === "string")
         {
            cp.set('iconClass', widget.iconClass);
         }

         // Should the ContentPane be closable?
         if(widget.closable && typeof widget.closable === "boolean")
         {
            cp.set('closable', widget.closable);
         }

         // Should the ContentPane be disabled?
         if(widget.disabled && typeof widget.disabled === "boolean")
         {
            cp.set('disabled', widget.disabled);
         }

         // Should the ContentPane be selected?
         if(widget.selected && typeof widget.selected === "boolean")
         {
            cp.set('selected', widget.selected);
         }

         // If not delayed processing, create the widget and add to the panel
         if(!widget.delayProcessing)
         {
            var widgetNode = this.createWidgetDomNode(widget, domNode);
            var w = this.createWidget(widget, widgetNode);

            // Add the widget to the ContentPane
            cp.addChild(w);
         }
         // Otherwise record the widget for processing later on
         else
         {
            this._delayedProcessingWidgets.push(
               {
                  "domNode": domNode,
                  "contentPane": cp,
                  "widget": widget
               }
            );
         }

         // If we have an index add the ContentPane at a particular position otherwise just add it
         this.tabContainerWidget.addChild(cp, (typeof index !== 'undefined' ? index : null));
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
         if(forDeletion != null)
         {
            this._delayedProcessingWidgets.splice(forDeletion, 1);
         }
      },

      /**
       * This function selects a tab based upon parameter 'payload.index' or 'payload.id' or 'payload.title'.
       * 
       * @instance
       * @param {object} payload Details of the tab to select
       */
      tabSelect: function alfresco_layout_AlfTabContainer__tabSelect(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === 'number' && tabs[payload.index])
         {
            tc.selectChild(tabs[payload.index]);
         }
         else if(payload && (typeof payload.id === 'string' || typeof payload.title === 'string'))
         {
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               if((payload.id && tabs[i].id === payload.id) || (payload.title && tabs[i].title === payload.title))
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
      tabDisable: function alfresco_layout_AlfTabContainer__tabDisable(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === 'number' && tabs[payload.index] && typeof payload.value === 'boolean')
         {
            tabs[payload.index].set('disabled', payload.value);
         }
         else if(payload && (typeof payload.id === 'string' || typeof payload.title === 'string') && typeof payload.value === 'boolean')
         {
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               if((payload.id && tabs[i].id === payload.id) || (payload.title && tabs[i].title === payload.title))
               {
                  tabs[i].set('disabled', payload.value);
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
      tabAdd: function alfresco_layout_AlfTabContainer__tabAdd(payload) {
         // TODO: Complete the tabAdd function

         // if(payload && payload.model)
         // {
         //    // Create widget
         //    // Pass to addWidget function with payload.index if provided
         // }
         // else if(payload && payload.widgetId)
         // {
         //    // Find widget by ID
         //    // Pass to addWidget function with payload.index if provided
         // }

      },

      /**
       * This function deletes a tab based upon parameter 'payload.index' or 'payload.id' or 'payload.title'.
       * 
       * @instance
       * @param {object} payload Details of the tab to delete
       */
      tabDelete: function alfresco_layout_AlfTabContainer__tabDelete(payload) {
         var tc = this.tabContainerWidget,
             tabs = tc.getChildren();
         if(payload && typeof payload.index === 'number' && tabs[payload.index])
         {
            tc.removeChild(tabs[payload.index]);
         }
         else if(payload && (typeof payload.id === 'string' || typeof payload.title === 'string'))
         {
            for(var i = 0; i < tabs.length; i++) // tabs does not support forEach
            {
               if((payload.id && tabs[i].id === payload.id) || (payload.title && tabs[i].title === payload.title))
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