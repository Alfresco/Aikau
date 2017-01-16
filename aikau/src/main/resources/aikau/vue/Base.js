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
 * @module aikau/vue/Base
 * @author Dave Draper
 * @since 1.0.NEXT
 */
define(["dojo/_base/declare",
        "dojo/Stateful",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/string"], 
        function(declare, Stateful, Core, lang, string) {

   return declare([Stateful, Core], {
      
      /**
       * This should be implemented to return a Vue.js component definition object.
       * 
       * @instance
       * @return {object} A Vue.js component definition object.
       */
      getComponent: function aikau_vue_Base__getComponent() {
         return {};
      },

      /**
       * This must be overridden by extending widgets to return the preferred element name
       * for the locally registered compoent. This can be any string value but should be 
       * meaningful to aid debugging.
       *
       * @instance
       * @return {string} The element name for the locally registered component
       */
      getComponentElement: function aikau_vue_Base__getComponentElement() {
         this.alfLog("warn", "The 'getComponentElement' function has not been overridden", this);
         return "";
      },
      
      /**
       * Retrieves the template for the supplied child component.
       *
       * @instance
       * @param  {object} input
       * @param  {object} input.child The child component to retrieve the template from
       * @return {string} The template for the child component.
       */
      getChildComponentTemplate: function aikau_vue_Base__getChildComponentTemplate(input) {
         var template;
         if (input &&  input.child && typeof input.child.getComponent === "function")
         {
            var component = input.child.getComponent();
            if (component && component.template)
            {
               template = component.template;
            }
            else
            {
               this.alfLog("error", "No child component template provided", input, component, this);
            }
         }
         else
         {
            this.alfLog("error", "No child component provided", input, this);
         }
         return template;
      },

      /**
       * This is called from [createChildComponent]{@link module:aikau/vue/Base#createChildComponent}
       * to register a local component within the current component.
       *
       * @instance
       * @param  {object} input
       * @param  {string} input.template The template for the component to register
       * @return {object} A locally registered Vue.js component
       */
      registerComponent: function aikau_vue_Base__registerComponent(input) {
         var output = this.createChildComponents({
            template: input.template
         });

         var registeredComponent = this.getComponent();
         registeredComponent.template = output.template;
         registeredComponent.components = output.components;

         return registeredComponent;
      },
      
      /**
       * [createChildComponent description]
       * @param  {[type]} widget      [description]
       * @param  {[type]} output      [description]
       * @param  {[type]} ChildWidget [description]
       * @return {[type]}             [description]
       */
      createChildComponent: function aikau_vue_Base__createChildComponent(widget, output, ChildWidget) {
         // jshint maxcomplexity:false
         if (typeof ChildWidget === "function")
         {
            var child = new ChildWidget(widget.config || {});
            if (child)
            {
               var elementName;
               if (typeof child.getComponentElement === "function")
               {
                  elementName = child.getComponentElement();
               }
               else
               {
                  this.alfLog("error", "Child doesn't have a 'getElementName' function", child);
               }
               
               var registeredComponent;
               if (typeof child.registerComponent === "function")
               {
                  var template = this.getChildComponentTemplate({
                     child: child
                  });
                  if (template)
                  {
                     registeredComponent = child.registerComponent({
                        template: template
                     });
                  }
               }
               else
               {
                  this.alfLog("error", "Child doesn't have a 'registerComponent' function", child);
               }
               
               if (elementName && registeredComponent)
               {
                  var insert = "<" + elementName;
                  for (var key in widget.config)
                  {
                     if (key.indexOf("widgets") > -1)
                     {
                        // Don't handle widgets...
                     }
                     else if (widget.config.hasOwnProperty(key) && widget.config[key])
                     {
                        insert += " " + key + "='" + widget.config[key] + "'"; 
                     }
                  }

                  insert += "></" + elementName + ">";

                  output.inserts += insert;

                  // Need to add registered component...
                  output.components[elementName] = registeredComponent;
               }
            }
         }
      },

      /**
       * [createChildComponents description]
       * @param  {[type]} input [description]
       * @return {[type]}       [description]
       */
      createChildComponents: function aikau_vue_Base__createChildComponents(input) {
         // Create a string to hold the template of the component that will be registered...
         var output = {
            template: input.template,
            components: {},
            props: [],
            inserts: ""
         };
         
         if (this.widgets && typeof this.widgets.forEach === "function")
         {
            this.widgets.forEach(function(widget) {
               if (widget.name)
               {
                  require([widget.name], lang.hitch(this, this.createChildComponent, widget, output));
               }
            }, this);

            output.template = string.substitute(output.template, {
               widgets_slot: output.inserts
            });
         }

         return output;
      }
   });
});