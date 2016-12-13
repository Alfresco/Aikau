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
 * This renderer can be used to both indicate whether or not an item is selected and to allow the selection
 * or de-selection the [item]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} that it represents.
 * The selection capabilities of this widget are provided by the 
 * [ItemSelectionMixin]{@link module:alfresco/lists/ItemSelectionMixin} module.
 * 
 * @module alfresco/renderers/Selector
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/lists/ItemSelectionMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "alfresco/lists/ItemSelectionMixin",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare,BaseWidget, _OnDijitClickMixin, ItemSelectionMixin, array, lang, domClass) {

   return declare([BaseWidget, _OnDijitClickMixin, ItemSelectionMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Selector.css"}]
       */
      cssRequirements: [{cssFile:"./css/Selector.css"}],
      
      /**
       * The dot-notation property to use in the 
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} to use to 
       * indicate when the selector is disabled.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.70
       */
      disableProperty: null,

      /**
       * An array of values to match against the 
       * [disableProperty]{@link module:alfresco/renderers/Selector#disableProperty} of the 
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}. If any of the values
       * are matched then the selector will be disabled.
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.70
       */
      disabledOnValues: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Actions__createWidgetDom() {
         this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-Selector");
         this.domNode.setAttribute("tabindex", "0");
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onSelectionClick));
      },

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       * @listens module:alfresco/core/topics#DOCUMENT_SELECTION_UPDATE
       */
      postMixInProperties: function alfresco_renderers_Selector__postMixInProperties() {
         // Set up a subscription to handle file selection events, these will be along the lines of
         // select all, select none, invert, etc. Each individual selector will respond to these
         // events...
         // this.alfSubscribe(this.documentSelectionTopic, lang.hitch(this, this.onFileSelection), this.publishGlobal, this.publishToParent);
         this.createItemSelectionSubscriptions();
      },

      /**
       * Checks the [disableProperty]{@link module:alfresco/renderers/Selector#disableProperty} of the 
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} against the 
       * [array of values]{@link module:alfresco/renderers/Selector#disableProperty} that will cause the
       * selector to be disabled.
       * 
       * @instance
       * @since 1.0.70
       */
      postCreate: function alfresco_renderers_Selector__postCreate() {
         this.inherited(arguments);
         if(this.isDisabled())
         {
            this.selectOnClick = false;
            domClass.add(this.domNode, "alfresco-lists-ItemSelectionMixin--disabled");
         }
      },

      /**
       * Checks the disabled state of the current item.
       * 
       * @instance
       * @since 1.0.70
       */
      isDisabled: function alfresco_renderers_Selector__isDisabled() {
         var disabled = false;
         if (this.disableProperty && this.disabledOnValues)
         {
            var disablePropertyValue = lang.getObject(this.disableProperty, false, this.currentItem);
            disabled = array.some(this.disabledOnValues, function(target) {
               return disablePropertyValue === target;
            });
         }
         return disabled;
      }
   });
});