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
 */
define(["dojo/_base/declare",
        "dojo/Stateful",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/string"], 
        function(declare, Stateful, Core, lang, string) {

   return declare([Stateful, Core], {
      
      getComponentElement: function aikau_vue_Base__getComponentElement() {
         this.alfLog("warn", "The 'getComponentElement' function has not been overridden", this);
         return "";
      },

      getComponentProps: function aikau_vue_Base__getComponentProps() {
         return [];
      },

      getRegisteredComponent: function aikau_vue_Base__getRegisteredComponent() {
         return this.registeredComponent;
      },

      getComponentTemplate: function aikau_vue_Base_getComponentTemplate() {
         return "<span>Not overridden!</span>";
      },

      registerComponent: function aikau_vue_Base__registerComponent(input) {
         // This is a fixed template into which Vue components should be added...
         var output = this.createChildComponents({
            template: input.template
         });

         this.registeredComponent = {
            template: output.template,
            components: output.components,
            props: this.getComponentProps()
         };

         return this.registeredComponent;
      },

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
                  registeredComponent = child.registerComponent({
                     template: child.getComponentTemplate()
                  });
               }
               else
               {
                  this.alfLog("error", "Child doesn't have a 'getRegisteredComponent' function", child);
               }
               
               if (elementName && registeredComponent)
               {
                  var insert = "<" + elementName;
                  for (var key in widget.config)
                  {
                     if (key.indexOf("widgets") > 0)
                     {
                        // Don't handle widgets...
                     }
                     else if (key === "props")
                     {
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
                     }
                  }

                  insert += "></" + elementName + ">";

                  output.template = string.substitute(output.template, {
                     widgets_slot: insert
                  });

                  // Need to add registered component...
                  output.components[elementName] = registeredComponent;
               }
            }
         }
      },

      createChildComponents: function aikau_vue_Base__createChildComponents(input) {
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
                  require([widget.name], lang.hitch(this, this.createChildComponent, widget, output));
               }
            }, this);
         }

         return output;
      }
   });
});