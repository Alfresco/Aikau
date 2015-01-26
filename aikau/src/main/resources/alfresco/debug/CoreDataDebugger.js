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
 * @module alfresco/debug/CoreDataDebugger
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/CoreDataDebugger.html",
        "alfresco/core/Core",
        "alfresco/core/CoreData",
        "dojo/store/Memory",
        "dijit/tree/ObjectStoreModel",
        "dijit/Tree"], 
        function(declare, _Widget, _Templated, template, AlfCore, CoreData, Memory, ObjectStoreModel, Tree) {
   
   return declare([_Widget, _Templated, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/CoreDataDebugger.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/CoreDataDebugger.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       */
      postCreate: function alfresco_debug_CoreDataDebugger__postCreate() {
         var data = CoreData.getSingleton();
         
         var myStore = new Memory({
            data: data.getDataStoreFriendlyData(),
            getChildren: function(object){
               return object.children ? object.children : [];
            }
         });
         var myModel = new ObjectStoreModel({
            store: myStore,
            query: {root: true},
            labelAttr: "label"
         });
         
         // Create the Tree.
         var tree = new Tree({
            model: myModel,
            showRoot: false,
            getIconClass: function(item, opened) {
               return (item.type == "value" ? "dijitLeaf" : (opened ? "dijitFolderOpened" : "dijitFolderClosed"));
            }
         });
         tree.placeAt(this.treeNode);
         tree.startup();
      }
   });
});