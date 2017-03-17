/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * <p>This layout widget provides the ability to display stacked content a little like the pages (panes) of 
 * a book and where only one pane will be shown at a time. Panes can be dynamically added, selected and 
 * removed as required. Unless explicitly requested, only the content of the intially selected pane will be 
 * rendered - the content of the other panes will be rendered as they are selected. The height of the widget 
 * will grow and shrink based on the content of each pane by default unless the 
 * [height]{@link module:alfresco/layout/AlfStackContainer#height} is explicitly set to a non-percentage 
 * value.</p>
 * <p>If you want the widget to respond to publications to dynamically 
 * [add]{@link module:alfresco/layout/AlfStackContainer#paneAdditionTopic}, 
 * [select]{@link module:alfresco/layout/AlfStackContainer#paneSelectionTopic} or
 * [delete]{@link module:alfresco/layout/AlfStackContainer#paneDeletionTopic} panes then you will need to 
 * configure the topics to subscribe to. Subscriptions will be made at the configured 
 * [pubSubScope]{@link module:alfresco/core/Core#pubSubScope} of the widget.</p>
 * <p>Pane selection can also be made by configuring a 
 * [paneSelectionHashVar]{@link module:alfresco/layout/AlfStackContainer#paneSelectionHashVar}. When a hash 
 * changed event occurs and the hash contains the configured variable, should it match the title of one of 
 * the panes in the AlfStackContainer, that pane will be selected.</p>
 *
 * @example <caption>Basic configuration (first pane will be selected):</caption>
 * {
 *    name: "alfresco/layout/AlfStackContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "PANE1",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Alfresco Logo",
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "PANE2",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Surf Logo",
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Use "delayProcessing" to force second pane to render before selection:</caption>
 * {
 *    name: "alfresco/layout/AlfStackContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "PANE1",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Alfresco Logo",
 *             selected: true,
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "PANE2",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Surf Logo",
 *             delayProcessing: false,
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Use "selected" make the second pane initially selected:</caption>
 * {
 *    name: "alfresco/layout/AlfStackContainer",
 *    config: {
 *       widgets: [
 *          {
 *             id: "PANE1",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Alfresco Logo",
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "PANE2",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Surf Logo",
 *             selected: true,
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 * 
 * @example <caption>Define topics to dynamically manipulate panes:</caption>
 * {
 *    name: "alfresco/layout/AlfStackContainer",
 *    config: {
 *       paneSelectionTopic: "SELECT_PANE_TOPIC",
 *       paneAdditionTopic: "ADD_PANE_TOPIC",
 *       paneDeletionTopic: "DELETE_PANE_TOPIC",
 *       widgets: [
 *          {
 *             id: "PANE1",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane with Alfresco Logo",
 *             selected
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Example publication to add a new pane (based on previous example topic):</caption>
 * {
 *    publishTopic: "ADD_PANE_TOPIC",
 *    publishPayload: {
 *       widgets: [
 *          {
 *             name: "alfresco/html/Label",
 *             title: "New",
 *             closable: true,
 *             selected: true,
 *             config: {
 *                label: "This pane was dynamically added"
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Define a paneSelectionHashVar:</caption>
 * {
 *    name: "alfresco/layout/AlfStackContainer",
 *    config: {
 *       paneSelectionHashVar: "view",
 *       widgets: [
 *          {
 *             id: "PANE1",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane1",
 *             selected
 *             config: {
 *                logoClasses: "alfresco-logo-only"
 *             }
 *          },
 *          {
 *             id: "PANE2",
 *             name: "alfresco/logo/Logo",
 *             title: "Pane2",
 *             selected: true,
 *             config: {
 *                logoClasses: "surf-logo-large"
 *             }
 *          }
 *       ]
 *    }
 * }
 * <p>If the hash was changed to #view=Pane2, PANE2 will be displayed</p>
 * 
 * @module alfresco/layout/AlfStackContainer
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfStackContainer.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/documentlibrary/_AlfHashMixin",
        "dijit/layout/StackContainer",
        "dijit/layout/ContentPane",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/util/hashUtils"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, _AlfHashMixin, 
                  StackContainer, ContentPane, domConstruct, lang, array, hashUtils) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, _AlfHashMixin], {
      
      /**
       * The HTML template to use for the widget
       * 
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This will hold a reference to the stack container widget.
       *
       * @instance
       * @type {object}
       * @default
       */
      stackContainerWidget: null,

      /**
       * Height of the finished AlfStackContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default
       */
      height: "100%",

      /**
       * Width of the finished AlfStackContainer as any recognised css size with units
       * 
       * @instance
       * @type {string}
       * @default
       */
      width: "100%",

      /**
       * Should StackContainer layout mathematics be invoked?
       * 
       * @instance
       * @type {Boolean}
       * @default
       */
      doLayout: false,

      /**
       * This array is used to store widgets for delayed processing
       * 
       * @type {array}
       */
      _delayedProcessingWidgets: [],

      /**
       * The topic whose publication should trigger the selection of a pane
       * 
       * @instance
       * @type {string}
       * @default
       */
      paneSelectionTopic: null,

      /**
       * The topic whose publication should trigger the addition of a pane
       * 
       * @instance
       * @type {string}
       * @default
       */
      paneAdditionTopic: null,

      /**
       * The topic whose publication should trigger the deletion of a pane
       * 
       * @instance
       * @type {string}
       * @default
       */
      paneDeletionTopic: null,

      /**
       * If this optional value is provided, a change to the hash of this variable will update the pane selection
       *
       * @instance
       * @type {string}
       * @default
       */
      paneSelectionHashVar: null,
      
      /**
       * Variable to record the title of the selected pane at initialisation
       *
       * @instance
       * @type {object}
       * @default
       * @private
       */
      _defaultPaneTitle: null,

      /**
       * @instance
       */
      postCreate: function alfresco_layout_AlfStackContainer__postCreate() {

         // Initialise a StackContainer instance and watch its selectedChildWidget event
         this.stackContainerWidget = new StackContainer({
            style: "height: " + this.height + "; width: " + this.width + ";",
            doLayout: this.doLayout
         }, this.containerNode);
         this.stackContainerWidget.watch("selectedChildWidget", lang.hitch(this, this._paneChanged));

         // Setup child widgets and startup()
         if (this.widgets)
         {
            // By default we want to ensure that we don't unnecessarily process widgets for 
            // panes that are not immediately visible. Therefore unless specifically requested 
            // in the configuration to be the selected pane or to render immediately then
            // we'll mark them all as delayed processing. If no pane is marked as selected then
            // we'll ensure that the first pane is both selected and will be immediately rendered
            var paneSelected = false;
            array.forEach(this.widgets, function(widget) {
               if (widget.delayProcessing !== false && !widget.selected)
               {
                  widget.delayProcessing = true;
               }
               paneSelected = paneSelected || widget.selected;
            });
            if (this.widgets.length && !paneSelected)
            {
               this.widgets[0].selected = true;
               this.widgets[0].delayProcessing = false;
            }

            // Now add panes for each widget...
            array.forEach(this.widgets, lang.hitch(this, this.addWidget));
         }
         this.stackContainerWidget.startup();

         // Subscribe to some optional topics
         if (this.paneSelectionTopic)
         {
            this.alfSubscribe(this.paneSelectionTopic, lang.hitch(this, this.paneSelect));
         }
         if (this.paneAdditionTopic)
         {
            this.alfSubscribe(this.paneAdditionTopic, lang.hitch(this, this.paneAdd));
         }
         if (this.paneDeletionTopic)
         {
            this.alfSubscribe(this.paneDeletionTopic, lang.hitch(this, this.paneDelete));
         }
         if (this.paneSelectionHashVar)
         {
            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onHashChanged));

            // Initialise the view by invoking onHashChanged, as though the browser had done so
            this.onHashChanged(hashUtils.getHash());
         }
      },

      /**
       * This function adds widgets to the StackContainer widget
       * 
       * @instance
       * @param {object} widget The widget to add
       * @param {integer} [index] The index of the required pane position
       */
      addWidget: function alfresco_layout_AlfStackContainer__addWidget(widget, index) {

         // Create a domNode and ContentPane
         var domNode = domConstruct.create("div", {}),
             cp = new ContentPane();

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

         // Should the ContentPane be selected?
         if(widget.selected && typeof widget.selected === "boolean")
         {
            cp.set("selected", widget.selected);
            if(cp.get("title") !== null)
            {
               this._defaultPaneTitle = cp.get("title");
            }
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
         this.stackContainerWidget.addChild(cp, (typeof index !== "undefined" ? index : null));
      },

      /**
       * Event triggered when the selected pane changes. Used to load delayed processing widgets.
       *
       * @instance
       * @private
       * @param {string} name
       * @param {object} oldPane
       * @param {object} newPane
       */
      _paneChanged: function alfresco_layout_AlfStackContainer___paneChanged(name, oldPane, newPane) {

         var forDeletion = null;
         for(var i = 0; i < this._delayedProcessingWidgets.length; i++)
         {
            var delayedWidget = this._delayedProcessingWidgets[i];
            if(newPane.containerNode.id === delayedWidget.contentPane.id)
            {
               var widgetNode = this.createWidgetDomNode(delayedWidget.widget, delayedWidget.domNode);
               var w = this.createWidget(delayedWidget.widget, widgetNode);

               // Add the widget to the ContentPane
               newPane.addChild(w);
               forDeletion = i;
               break;
            }
         }
         if(forDeletion !== null)
         {
            this._delayedProcessingWidgets.splice(forDeletion, 1);
         }
      },

      /**
       * This function selects a pane based upon parameter "payload.index" or "payload.id" or "payload.title".
       * 
       * @instance
       * @param {object} payload Details of the pane to select
       */
      paneSelect: function alfresco_layout_AlfStackContainer__paneSelect(payload) {
         var sc = this.stackContainerWidget,
             panes = sc.getChildren();
         if(payload && typeof payload.index === "number" && panes[payload.index])
         {
            sc.selectChild(panes[payload.index]);
         }
         else if(payload && (typeof payload.id === "string" || typeof payload.title === "string"))
         {
            for(var i = 0; i < panes.length; i++) // panes does not support forEach
            {
               if((payload.id && panes[i].id === payload.id) || (payload.title && panes[i].title === payload.title))
               {
                  sc.selectChild(panes[i]);
                  break;
               }
            }
         }
         else
         {
            this.alfLog("warn", "Attempt made to select a StackContainer pane with an inapproriate payload", this);
         }
      },

      /**
       * This function adds a new pane.
       * 
       * @instance
       * @param {object} payload Details of the pane to add
       */
      paneAdd: function alfresco_layout_AlfStackContainer__paneAdd(payload) {
         if (payload && payload.widgets)
         {
            array.forEach(payload.widgets, lang.hitch(this, this.addWidget));
         }
      },

      /**
       * This function deletes a pane based upon parameter "payload.index" or "payload.id" or "payload.title".
       * 
       * @instance
       * @param {object} payload Details of the pane to delete
       */
      paneDelete: function alfresco_layout_AlfStackContainer__paneDelete(payload) {
         var sc = this.stackContainerWidget,
             panes = sc.getChildren();
         if(payload && typeof payload.index === "number" && panes[payload.index])
         {
            sc.removeChild(panes[payload.index]);
         }
         else if(payload && (typeof payload.id === "string" || typeof payload.title === "string"))
         {
            for(var i = 0; i < panes.length; i++) // panes does not support forEach
            {
               if((payload.id && panes[i].id === payload.id) || (payload.title && panes[i].title === payload.title))
               {
                  sc.removeChild(panes[i]);
                  break;
               }
            }
         }
         else
         {
            this.alfLog("warn", "Attempt made to remove a StackContainer pane with an inapproriate payload", this);
         }
      },

      /**
       * This function is called whenever the browser URL hash fragment is changed
       * 
       * @instance
       * @param {object} payload
       */
      onHashChanged: function alfresco_layout_AlfStackContainer__onHashChanged(payload) {
         // If the payload contains a paneSelectionHashVar then we will show that pane. Otherwise we arrive here 
         // only when the hash variable is missing because of browser back or a user edit of the hash string. In 
         // both cases we want to re-show the original default pane if one was originally selected.
         if(payload[this.paneSelectionHashVar])
         {
            this.paneSelect({
               title: payload[this.paneSelectionHashVar]
            });
         }
         else if(this._defaultPaneTitle)
         {
            this.paneSelect({
               title: this._defaultPaneTitle
            });
         }
      }
   });
});