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
 * This renderer can be used to both indicate whether or not an item is selected and to allow the selection
 * or de-selection the [item]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} that it represents.
 * The selection capabilities of this widget are provided by the 
 * [ItemSelectionMixin]{@link module:alfresco/lists/ItemSelectionMixin} module.
 * 
 * @module alfresco/renderers/Selector
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/lists/ItemSelectionMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/lists/ItemSelectionMixin",
        "dojo/text!./templates/Selector.html"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, ItemSelectionMixin, template) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, ItemSelectionMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Selector.css"}]
       */
      cssRequirements: [{cssFile:"./css/Selector.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
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
      }
   });
});