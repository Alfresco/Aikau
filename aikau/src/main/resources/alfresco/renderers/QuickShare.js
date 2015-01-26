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
 * The QuickShare renderer is a customization of the [toggle renderer]{@link module:alfresco/renderers/Toggle} that allows
 * non-container nodes to be publicly shared. It renders as one of two states, unshared being the basic "toggle off" state
 * and shared being a [menu bar]{@link module:alfresco/menus/AlfMenuBar} containing [menu items]{@link module:alfresco/menus/AlfMenuItem}
 * for removing the share and, viewing the shared location.
 * 
 * @module alfresco/renderers/QuickShare
 * @extends module:alfresco/renderers/Toggle
 * @mixes module:alfresco/services/_QuickShareServiceTopicMixin
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Toggle",
        "alfresco/services/_QuickShareServiceTopicMixin",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/text!./templates/QuickShare.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dijit/registry",
        "alfresco/menus/AlfMenuBar",
        "alfresco/menus/AlfMenuBarPopup",
        "alfresco/menus/AlfCascadingMenu",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/menus/AlfMenuItem",
        "alfresco/menus/AlfMenuTextForClipboard",
        "service/constants/Default"], 
        function(declare, Toggle, _QuickShareServiceTopicMixin, CoreWidgetProcessing, template, lang, array, domClass, registry, 
                 AlfMenuBar, AlfMenuBarPopup, AlfCascadingMenu, AlfMenuGroup, AlfMenuItem, AlfMenuTextForClipboard, AlfConstants) {

   return declare([Toggle, _QuickShareServiceTopicMixin, CoreWidgetProcessing], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/QuickShare.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/QuickShare.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/QuickShare.css"}]
       */
      cssRequirements: [{cssFile:"./css/QuickShare.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string}
       * @default "quick-share.enabled.label"
       */
      onLabel: "quick-share.enabled.label",
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "quick-share.disabled.label"
       */
      offLabel: "quick-share.disabled.label",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "quick-share.enabled.description"
       */
      onTooltip: "quick-share.enabled.description",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string} 
       * @default "quick-share.disabled.description"
       */
      offTooltip: "quick-share.disabled.description",
      
      /**
       * The CSS class to apply for the on display
       * @instance
       * @type {string}
       * @default "quick-share"
       */
      toggleClass: "quick-share",
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_QuickShare__postMixInProperties() {
         // Set up the toggle topics..
         // If no instantiation overrides have been provided then just default to the standard topics
         // provided by the "alfresco/services/_RatingsServiceTopicMixin" class...
         this.toggleOnTopic = (this.toggleOnTopic != null) ? this.toggleOnTopic : this.addQuickShareTopic;
         this.toggleOnSuccessTopic = (this.toggleOnSuccessTopic != null) ? this.toggleOnSuccessTopic : this.addQuickShareSuccessTopic;
         this.toggleOnFailureTopic = (this.toggleOnFailureTopic != null) ? this.toggleOnFailureTopic : this.addQuickShareFailureTopic;
         this.toggleOffTopic = (this.toggleOffTopic != null) ? this.toggleOffTopic : this.removeQuickShareTopic;
         this.toggleOffSuccessTopic = (this.toggleOffSuccessTopic != null) ? this.toggleOffSuccessTopic : this.removeQuickShareSuccessTopic;
         this.toggleOffFailureTopic = (this.toggleOffFailureTopic != null) ? this.toggleOffFailureTopic : this.removeQuickShareFailureTopic;
         
         // It is necessary to capture the toggle off request and call the onclick function...
         // This is because the toggle off is triggered by a menu item added to the toggled on view rather
         // than being triggered directly by a bubbling DOM event...
         this.simulateToggleOff = this.generateUuid();
         this.alfSubscribe(this.simulateToggleOff, lang.hitch(this, this.onClick));
         
         // Perform the standard setup...
         this.inherited(arguments);
      },
      
      /**
       * The property that will contain the shared ID when shared.
       *
       * @instance
       * @type {string}
       * @default "jsNode.properties.qshare:sharedId"
       */
      propertyToRender: "jsNode.properties.qshare:sharedId",

      /**
       * Overridden to get the liked state of the current item.
       * 
       * @instance
       * @returns {boolean} Indicating the initial state of the toggle.
       */
      getInitialState: function alfresco_renderers_QuickShare__getInitialState() {
         return (lang.getObject(this.propertyToRender, false, this.currentItem) != null);
      },
      
      /**
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_QuickShare__postCreate() {
         this.inherited(arguments);
         
         // Hide folders
         var isContainer = lang.getObject("node.isContainer", false, this.currentItem);
         if (isContainer)
         {
            domClass.add(this.domNode, "hidden");
         }
         else
         {
            this.quickShareLink = AlfConstants.QUICKSHARE_URL;
            if (this.isToggleOn)
            {
               var quickShareId = lang.getObject(this.propertyToRender, false, this.currentItem);
               this.widgets = this.defineWidgets(quickShareId);
               this.processWidgets(this.widgets, this.onNode);
            }
         }
      },
      
      /**
       * The default quick share link
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      quickShareLink: "",

      /**
       * This function is passed as the callback handler when publishing a request for the quick share link.
       * It simply sets the "quickShareLink" attribute with the argument passed.
       * 
       * @instance
       * @param {string} link The link to access quick shared content
       */
      setQuickShareLink: function alfresco_renderers_QuickShare__setQuickShareLink(link) {
         this.quickShareLink = link;
      },
      
      /**
       * This function is passed as the callback handler when publishing a request for the social link configuration.
       * It simply sets the "socialLinks" attribute with the argument passed.
       * 
       * @instance
       * @param {array} links The links to use when publishing quick shared content
       */
      setSocialLinks: function alfresco_renderers_QuickShare__setSocialLinks(links) {
         this.socialLinks = links;
      },
      
      /**
       * Called whenever the "toggleOnSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOnSuccess: function alfresco_renderers_QuickShare__onToggleOnSuccess(payload) {
         this.inherited(arguments);
         this.widgets = this.defineWidgets(payload.response.sharedId);
         lang.setObject(this.propertyToRender, payload.response.sharedId, this.currentItem);
         this.processWidgets(this.widgets, this.onNode);
      },
      
      /**
       * Called whenever the "toggleOffSuccessTopic" attribute is published on
       * @instance
       */
      onToggleOffSuccess: function alfresco_renderers_QuickShare__onToggleOffSuccess(payload) {
         this.inherited(arguments);
         if (this.onNode.children != null && this.onNode.children.length > 0)
         {
            var existingWidget = registry.byNode(this.onNode.children[0]);
            existingWidget.destroy();
         }
      },
      
      /**
       * Defines a JSON structure for the widgets to represent the shared state options.
       * @instance
       */
      defineWidgets: function alfresco_renderers_QuickShare__defineWidgets(sharedId) {
         var shareUrl = "http://" + window.location.host + this.quickShareLink.replace("{sharedId}", sharedId);
         var widgets = [
            {
               name: "alfresco/menus/AlfMenuBar",
               config: {
                  widgets: [
                     {
                        name: "alfresco/menus/AlfMenuBarPopup",
                        config: {
                           label: this.message("quick-share.enabled.label"),
                           iconClass: "alf-quick-share-enabled-icon",
                           widgets: [
                              {
                                 name: "alfresco/menus/AlfMenuGroup",
                                 config: {
                                    widgets: [
                                       {
                                          name: "alfresco/menus/AlfCascadingMenu",
                                          config: {
                                             label: this.message("quick-share.public-url.label"),
                                             widgets: [
                                                {
                                                   name: "alfresco/menus/AlfMenuGroup",
                                                   config: {
                                                      widgets: [
                                                         {
                                                            name: "alfresco/menus/AlfMenuTextForClipboard",
                                                            config: {
                                                               textForClipboard: shareUrl
                                                            }
                                                         }
                                                      ]
                                                   }
                                                }
                                             ]
                                          }
                                       },
                                       {
                                          name: "alfresco/menus/AlfMenuItem",
                                          config: {
                                             label: this.message("quick-share.view.label"),
                                             publishTopic: "ALF_NAVIGATE_TO_PAGE",
                                             publishPayload: {
                                                url: shareUrl,
                                                type: "FULL_PATH",
                                                target: "NEW"
                                             }
                                          }
                                       },
                                       {
                                          name: "alfresco/menus/AlfMenuItem",
                                          config: {
                                             label: this.message("quick-share.unshare.label"),
                                             publishTopic: this.simulateToggleOff,
                                             publishPayload: {
                                                node: this.currentItem,
                                                sharedId: sharedId
                                             }
                                          }
                                       }
                                    ]
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
         return widgets;
      }
   });
});