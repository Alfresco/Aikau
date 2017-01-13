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
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "dojo/text!./templates/Test2.html",
        "dojo/_base/lang",
        "dojo/string",
        "vue"], 
        function(declare, _WidgetBase, _TemplatedMixin, Core, template, lang, string, Vue) {
   
   return declare([_WidgetBase, _TemplatedMixin, Core], {

      templateString: template,

      postCreate: function aikau_vue_Test__postCreate() {
         var registeredComponent = this.registerComponent({});

         Vue.component("aikau-root-vue", {
            template: registeredComponent.template,
            components: registeredComponent.components,
            data: function() {
               return {
                  parentMsg: "",
                  bob: ""
               };
            }
         });

         // jshint nonew:false
         new Vue({
            el: "#" + this.id
         });

      },

      widgets: [
         {
            name: "aikau/vue/Test3"
         }
      ],

      getElementName: function() {
         return "test2";
      },

      getRegisteredComponent: function() {
         return this.registeredComponent;
      },

      registerComponent: function aikau_vue_Test2__registerComponent(input) {

         var t = "<div><span>Hello</span><input v-model='parentMsg'><span>{{ parentMsg }}</span>${widgetsSlot}</div>";

         var output = this.createChildComponents({
            template: t
         });

         this.registeredComponent = {
            template: output.template,
            components: output.components
         };

         return this.registeredComponent;
      },

      createChildComponents: function aikau_vue_Test2__createChildComponents(input) {
         // Create a string to hold the template of the component that will be registered...
         var output = {
            template: input.template,
            components: {},
            props: []
         };
         
         if (this.widgets && typeof this.widgets.forEach === "function")
         {
            this.widgets.forEach(function(widget) {
               if (widget.name)
               {
                  require([widget.name], lang.hitch(this, function(ChildWidget) {

                     if (typeof ChildWidget === "function")
                     {
                        var child = new ChildWidget(widget.config || {});
                        if (child)
                        {
                           var elementName;
                           if (typeof child.getElementName === "function")
                           {
                              elementName = child.getElementName();
                           }
                           else
                           {
                              console.error ("Child doesn't have a 'getElementName' function", child);
                           }
                           
                           var registeredComponent;
                           if (typeof child.registerComponent === "function")
                           {
                              registeredComponent = child.registerComponent();
                           }
                           else
                           {
                              console.error ("Child doesn't have a 'getRegisteredComponent' function", child);
                           }
                           
                           if (elementName && registeredComponent)
                           {
                              var insert = "<" + elementName;
                              for (var key in widget.config)
                              {
                                 if (key === "props")
                                 {
                                    // TODO: Dynamic binding required
                                    for (var prop in widget.config.props)
                                    {
                                       if (widget.config.props.hasOwnProperty(prop))
                                       {
                                          insert += " :" + prop + "='" + widget.config.props[prop] + "'";
                                       }
                                    }
                                 }
                                 else if (widget.config.hasOwnProperty(key) && widget.config[key])
                                 {
                                    insert += " " + key + "='" + widget.config[key] + "'"; 

                                    // output.props.push(key);
                                 }
                              }

                              insert += "></" + elementName + ">";

                              output.template = string.substitute(output.template, {
                                 widgetsSlot: insert
                              });
                              

                              // Need to add registered component...
                              output.components[elementName] = registeredComponent;
                           }
                        }
                     }
                  }));
               }
            }, this);
         }

         return output;
      }
   });
});