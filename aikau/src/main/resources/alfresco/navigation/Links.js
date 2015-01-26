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
 * This is a work in progress widget - use with caution.
 * 
 * @module alfresco/navigation/Links
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Links.html",
        "alfresco/core/Core",
        "dojo/dom-construct",
        "dojo/_base/array",
        "service/constants/Default"], 
        function(declare, _Widget, _Templated, template, AlfCore, domConstruct, array, AlfConstants) {
   
   return declare([_Widget, _Templated, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Links.css"}]
       */
      cssRequirements: [{cssFile:"./css/Links.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * @instance
       */
      postCreate: function alfresco_navigation_Links__postCreate() {
         this.inherited(arguments);
         var _this = this;
         this.alfPublish("GetPages", {});
         this.alfSubscribe("AvailablePages", function(pageList) {
            
            domConstruct.empty(_this.linksNode);
            
            array.forEach(pageList, function(page, i) {
               
               if (page.label && page.value)
               {
                  var nodeRef = page.value.replace("://", "/"),
                      uri = AlfConstants.URL_PAGECONTEXT + "hdp/ws/rpr/" + nodeRef;
                  domConstruct.create("div", {
                     innerHTML: "<a href='" + uri + "'>" + this.encodeHTML(page.label) + "</a>"
                  }, _this.linksNode);
               }
            });
         });
      }
   });
});