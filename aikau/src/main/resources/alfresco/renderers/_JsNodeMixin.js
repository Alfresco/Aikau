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
 * @module alfresco/menus/_JsNodeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "alfresco/core/JsNode"], 
        function(declare, lang, JsNode) {
   
   return declare(null, {

      /**
       * @instance
       * @param {object} args The arguments to mixin
       */
      constructor: function alfresco_renderers__JsNodeMixin__constructor(args) {
         lang.mixin(this, args);
         if (this.currentItem)
         {
            // This checks if the "jsNode" attribute has been created, and if not will make an attempt
            // to create it. This is in place purely for handling node based items, but shouldn't
            // break anything else...
            if (typeof this.currentItem.jsNode === "undefined" && this.currentItem.node)
            {
               this.currentItem.jsNode = new JsNode(this.currentItem.node);
            }
         }
      }
   });
});