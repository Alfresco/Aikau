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
 * 
 * 
 * @module alfresco/dnd/DragAndDropItems
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DragAndDropItems.html",
        "dojo/text!./templates/DragAndDropItem.html",
        "alfresco/core/Core",
        "dojo/dnd/Source",
        "dojo/_base/lang",
        "dojo/string",
        "dojo/dom-construct"], 
        function(declare, _Widget, _Templated, template, PaletteItemTemplate, AlfCore, Source, lang, stringUtil, domConstruct) {
   
   return declare([_Widget, _Templated, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DragAndDropItems.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      dragWithHandles: false,
      
      /**
       * @instance
       */
      postCreate: function alfresco_dnd_DragAndDropItems__postCreate() {
         var palette = new Source(this.paletteNode, {
            copyOnly: true,
            selfCopy: false,
            creator: lang.hitch(this, this.creator),
            withHandles: this.dragWithHandles
         });
         palette.insertNodes(false, this.items);
      },
      
      /**
       * Handles the creation of drag'n'drop avatars. This could check the supplied hint parameter
       * to see if an avatar is required, but since the source doesn't allow self-copying and is not
       * a target in itself then this is not necessary.
       * 
       * @instance
       */
      creator: function alfresco_dnd_DragAndDropItems__creator(item, hint) {
         this.alfLog("log", "Creating", item, hint);
         var clonedItem = lang.clone(item);
         var node = domConstruct.toDom(stringUtil.substitute(PaletteItemTemplate, {
            title: clonedItem.label ? clonedItem.label : "",
            iconClass: clonedItem.iconClass ? clonedItem.iconClass : ""
         }));
         return {node: node, data: clonedItem, type: clonedItem.type};
      },
      
      /**
       * @instance
       * @returns {object[]}
       */
      items: null
   });
});