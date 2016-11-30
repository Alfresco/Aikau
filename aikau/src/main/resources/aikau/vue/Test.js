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
 * 
 * 
 * @module aikau/vue/Test
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dojo/text!./templates/Test.html",
        "alfresco/core/Core",
        "aikau/core/ChildProcessing",
        "dojo/_base/lang",
        "vue"], 
        function(declare, _WidgetBase, template, Core, ChildProcessing, lang, Vue) {
   


   // Only declare this once...
   Vue.component("aikau-vue-test", {
      template: template,
      data: function() {
         return {
            items: [
               {
                  value: "1"
               },
               {
                  value: "2"
               }
            ],
            message: "Hello",
            messageIn: "Bob"
         };
      }
   });

   return declare([_WidgetBase, Core, ChildProcessing], {

      /**
       * @instance
       */
      postMixInProperties: function aikau_vue_Test__postMixInProperties() {
         
      },

      buildRendering: function aikau_vue_Test__buildRendering() {
         this.domNode = document.createElement("aikau-vue-test");

         


      },

      postCreate: function aikau_vue_Test__postCreate() {

         if (this.widgets) {

            this.createChildren({
               widgets: this.widgets,
               targetNode: this._targetNode || this.domNode
            }).then(lang.hitch(this, function(widgets) {
               this.childWidgets = widgets;

               new Vue({
                  el: "#" + this.id
               });
            }));

            // var elName = widget.name.replace(/\//g, "-");
            // var widgetEl = document.createElement(elName);
            // this.domNode.appendChild(widgetEl);

         };


         
      }
   });
});