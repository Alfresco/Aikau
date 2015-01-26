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
 * @module alfresco/renderers/Category
 * @extends module:alfresco/renderers/Property
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/text!./templates/Category.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/navigation/Link",
        "dojo/dom-construct"], 
        function(declare, Property, _NavigationServiceTopicMixin, template, lang, array, Link, domConstruct) {

   return declare([Property, _NavigationServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Category.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Category.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Category.css"}]
       */
      cssRequirements: [{cssFile:"./css/Category.css"}],
      
      /**
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Category__postMixInProperties() {
         // No action intentionally
      },
      
      /**
       * @instance
       */
      postCreate: function alfresco_renderers_Category__postCreate() {
         this.inherited(arguments);
         if (lang.exists("node.properties.cm:categories", this.currentItem))
         {
            var categories = lang.getObject("node.properties.cm:categories", false, this.currentItem);
            array.forEach(categories, lang.hitch(this, "addCategory", categories.length));
         }
      },
      
      /**
       * @instance
       * @param {number} total The total number of categories
       * @param {object} category The category definition
       * @param {number} index The index of the category
       */
      addCategory: function alfresco_renderers_Category__addCategory(total, category, index) {
         this.alfLog("log", "Adding category", category);
         var link = new Link({
            label: category.name,
            title: this.message("category.filter.title", {"0": category.name}),
            publishTopic: this.navigateToPageTopic,
            publishPayload: {
               type: this.hashPath,
               url: "filter=category|" + category.path + "/" + category.name
            }
         });
         link.placeAt(this.categoryNode, "last");
         if (index < total -1)
         {
            domConstruct.create("span", {
               innerHTML: ",",
               "class" : "spacer"
            }, this.categoryNode, "last");
         }
      }
   });
});