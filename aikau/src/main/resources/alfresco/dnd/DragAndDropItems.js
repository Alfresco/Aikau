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
 * This widget allows an array of [items]{@link module:alfresco/dnd/DragAndDropItems#items} to 
 * be rendered which can be dragged and dropped (e.g. onto a [DragAndDropTargetControl]
 * {@link module:alfresco/form/controls/DragAndDropTargetControl}).
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
       * Creates a palette of items that can be dragged (and dropped).
       * 
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
       * Handles the creation of drag and drop avatars. This could check the supplied hint parameter
       * to see if an avatar is required, but since the source doesn't allow self-copying and is not
       * a target in itself then this is not necessary.
       * 
       * @instance
       * @param {object} item The configuration for the dragged item.
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
       * The array of items to render as draggable entities. Each item should have a type array (indicating
       * what targets it can be dropped onto), a label (to indicate its purpose) and a value (which can
       * be any complex object).
       * 
       * @instance
       * @type {array}
       * @default null
       */
      items: null
   });
});