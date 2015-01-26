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
 * 
 * @module alfresco/core/JsNode
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/json",
        "dojo/_base/lang",
        "alfresco/core/NodeUtils",
        "alfresco/core/ObjectTypeUtils"], 
        function(declare, dojoJson, lang, NodeUtils, ObjectTypeUtils) {
   
   // Normally we would just return a declared class, but it is necessary to be able to recursively
   // create a JsNode for a "linkedNode". So we will declare the core functionality in a variable
   // which is then used in the actual class declared at the end of this module.
   var JsNode = declare(null, {

      /* 
       *
       * @instance
       * @type {object}
       * @default
       */
      constants: {
         PROP_NAME: "cm:name",
         PROP_TITLE: "cm:title",
         PROP_DESCRIPTION: "cm:description",
         PROP_CREATED: "cm:created",
         PROP_CREATOR: "cm:creator",
         PROP_MODIFIER: "cm:modifier",
         PROP_MODIFIED: "cm:modified",
         PROP_CATEGORIES: "cm:categories",
         PROP_TAGGABLE: "cm:taggable"
      },

      /**
       *
       *
       * @instance
       */
      constructor: function alfresco_core_JsNode__constructor(args) {
         if (ObjectTypeUtils.isString(args))
         {
            // The supplied node is a String (and is expected to be a JSON string so should be parsed into an object)...
            try
            {
               this.nodeJson = args;
               this.node = dojoJson.parse(args);
            }
            catch (e)
            {
               // Can't log error, no alfLog !
            }
            
         }
         else if (ObjectTypeUtils.isObject(args))
         {
            // The supplied node is an Object so needs to be converted into a JSON string...
            this.node = {};
            lang.mixin(this.node, args);
            this.nodeJson = dojoJson.stringify(this.node);
         }
         if (this.node != null)
         {
            this.nodeRef = NodeUtils.processNodeRef(this.node.nodeRef);
            this.properties = this.node.properties || {};
            this.aspects = this.node.aspects || [];
            this.permissions = this.node.permissions || {};
            this.aspectsObj = null;
            this.tagsArray = null;
            this.tagsObj = null;
            this.categoriesArray = null;
            this.categoriesObj = null;
            this.isContainer = this.node.isContainer;
            this.isLink = this.node.isLink;
            // this.linkedNode = this.constructor(this.node.linkedNode);
            this.isLocked = this.node.isLocked;
            this.type = this.node.type;
            this.contentURL = this.node.contentURL;
            this.mimetype = this.node.mimetype;
            this.size = this.node.size;

            /*
             * Populates the properties object literal with all "cm:" properties for easy access.
             * Therefore description can be accessed either as node.properties[this.constants.PROP_DESCRIPTION]
             * or, more simply, as node.properties.description.
             *
             * For all properties, the ":" character is replaced with an underscore.
             * These can then be accessed as, for example, node.properties.gd_googleUrl
             */
            for (var index in this.properties)
            {
               if (this.properties.hasOwnProperty(index))
               {
                  if (index.indexOf("cm:") === 0)
                  {
                     this.properties[index.substring(3)] = this.properties[index];
                  }
                  this.properties[index.replace(/:/g, "_")] = this.properties[index];
               }
            };
         }
      },

      /**
       * 
       * 
       * @instance
       */
      getTags: function alfresco_core_JsNode__getTags() {
         if (this.tagsArray === null)
         {
            this.tagsArray = [];

            var prop_taggable = this.properties[this.constants.PROP_TAGGABLE] || [];
            for (var i = 0, ii = prop_taggable.length; i < ii; i++)
            {
               this.tagsArray.push(prop_taggable[i].name);
            }
         }
         return this.tagsArray;
      },

      /**
       *
       * @instance
       */
      getCategories: function alfresco_core_JsNode__getCategories() {
         if (this.categoriesArray === null)
         {
            this.categoriesArray = [];
            var prop_categories = this.properties[this.constants.PROP_CATEGORIES] || [];
            for (var i = 0, ii = prop_categories.length; i < ii; i++)
            {
               this.categoriesArray.push([prop_categories[i].name, prop_categories[i].path]);
            }
         }
         return this.categoriesArray;
      },

      /**
       *
       * @instance
       * @returns {object} The node object
       */
      getNode: function alfresco_core_JsNode__getNode() {
         return this.node;
      },

      /**
       *
       * @instance
       * @returns {string} A stringified representation of the node.
       */
      toJson: function alfresco_core_JsNode__toJson() {
         return this.nodeJson;
      },

      /**
       *
       * @instance
       * @param {string} nodeRef The new NodeRef to process.
       */
      setNodeRef: function alfresco_core_JsNode__setNodeRef(nodeRef) {
         this.nodeRef = new NodeUtils.processNodeRef(nodeRef);
      },

      /**
       *
       * @instance
       * @param {string} property The property to check for
       * @returns {boolean} true if the node has the property and false otherwise
       */
      hasProperty: function alfresco_core_JsNode__hasProperty(property) {
         return this.properties.hasOwnProperty(property);
      },

      /**
       *
       * @instance
       * @param {string} aspect The aspect to check for
       * @returns {boolean} true eif the node has the aspect and false otherwise.
       */
      hasAspect: function alfresco_core_JsNode__hasAspect(aspect) {
         if (this.aspectsObj === null)
         {
            this.aspectsObj = Alfresco.util.arrayToObject(this.aspects);
         }
         return this.aspectsObj.hasOwnProperty(aspect);
      },

      /**
       *
       * @instance
       * @param {string} permission The permission to check for
       * @returns {boolean} True if the node has the permission and false otherwise.
       */
      hasPermission: function alfresco_core_JsNode__hasPermission(permission){
         return this.permissions.user[permission];
      },

      /**
       *
       * @instance
       * @param {string} tag The tag to check for
       * @returns {boolean} True if the node has the tag and false otherwise
       */
      hasTag: function alfresco_core_JsNode__hasTag(tag) {
         if (this.tagsObj === null)
         {
            this.tagsObj = Alfresco.util.arrayToObject(this.tags);
         }
         return this.tagsObj.hasOwnProperty(tag);
      }
   });

   return declare(null, {

      /**
       * This instantiates the "inner" class and then returns builds a linked node
       * as required.
       *
       * @instance
       */
      constructor: function alfresco_core_JsNode__constructor(args) {
         var primaryJsNode = new JsNode(args);
         if (primaryJsNode.node != null && primaryJsNode.node.linkedNode != null)
         {
            primaryJsNode.linkedNode = new JsNode(primaryJsNode.linkedNode);
         }
         lang.mixin(this, primaryJsNode);
      }
   });
});
