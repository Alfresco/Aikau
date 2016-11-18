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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * <p>This module is intended as the replacement for [CoreWidgetProcessing]{@link module:alfresco/core/CoreWidgetProcessing}
 * and intends to be promise based and not use the live DOM for widget creation.</p>
 * 
 * @module aikau/core/ChildProcessing
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/Deferred",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/promise/all",
        "dijit/registry"], 
        function(declare, CoreWidgetProcessing, lang, array, Deferred, domAttr, domClass, domConstruct, domStyle, all, registry) {
   
   return declare([CoreWidgetProcessing], {
      
      /**
       * This function can be overridden to allow mixing modules the opportunity to perform post-processing
       * widgets once they have been created.
       * 
       * @instance
       * @param {object} input The input to the function
       * @param {object} input.widget The created widget
       */
      postCreationProcessing: function aikau_core_ChildProcessing__postCreationProcessing(input) {
         // jshint unused:false
      },

      /**
       * This function can be called to create child widgets.
       *
       * @instance
       * @param {object}   input The input to the function
       * @param {object[]} input.widgets An array of widget models to be created
       * @param {object}   input.targetNode The DOM node to attach the created widgets to
       * @returns {object} A promise of the children to be created.
       */
      createChildren: function aikau_core_ChildProcessing__createChildren(input) {
         var children = new Deferred();

         // TODO: Are we better using something like lodash here?
         if (lang.isArray(input.widgets))
         {
            // Create a map to hold all the promises (one for each child)...
            // This map will be passed to the promise/all function that will resolve when 
            // all the promises have been resolved...
            var promises = {};
         
            // Filter the children to ensure that only those child matching the filter rules
            // will be created...
            var filteredChildren = this.filterChildren({
               widgets: input.widgets
            });

            // Create each child widget...
            array.forEach(filteredChildren.widgets, lang.hitch(this, function(widget, index) {

               // Make a request to create the child, the response will be an object that will
               // contain an attribute that is the promised...
               var childData = this.createChild({
                  widget: widget,
                  index: index
               });

               // Add the promised child to the map of all promises, using the array index as the
               // key...
               promises[index] = childData.promisedChild;
            }));

            if (!this._childWidgets)
            {
               this._childWidgets = [];
            }

            // If the targetNode is already in the browser document, then we can
            // inform all the created children that they too are now in the browser
            // document once creation has completed...
            var targetNodeInDocument = document.body.contains(input.targetNode);
            
            // It is necessary to create a Deferred object for widgets at the "top" of the
            // creation chain that were not created in calls to this function. This ensures
            // that there is something to resolve...
            if (!this._addedToDocument)
            {
               this._addedToDocument = new Deferred();
            }

            // Use "all" here to add the created widgets to the targetNode once they have all been
            // created (or have failed to create)...
            all(promises).then(lang.hitch(this, lang.hitch(this, function(results) {
               
               // Create an array to hold all the child widgets that get created, this will be 
               // used as the value with which to resolve the returned promise...
               var createdChildren = [];
               for (var key in results) {
                  if (results.hasOwnProperty(key)) {
                     var childWidget = results[key];
                     if (childWidget)
                     {
                        // Add the created widget into the target node if provided...
                        if (input.targetNode)
                        {
                           childWidget.placeAt(input.targetNode, input.targetPosition || "last");
                        }

                        // Call post creation widget functioning...
                        this.postCreationProcessing({
                           widget: childWidget
                        });

                        // Create a new Deferred object for each child widget to be resolved when
                        // it is added to the document. Chain a call to the onAddedToDocument function
                        // using the widget itself as the execution scope...
                        if (typeof childWidget.onAddedToDocument === "function") 
                        {
                           if (!childWidget._addedToDocument)
                           {
                              childWidget._addedToDocument = new Deferred();
                           }
                           childWidget._addedToDocument.then(lang.hitch(childWidget, childWidget.onAddedToDocument));
                        }
                        
                        // Finally, add the widget to the array to used to resolve the returned promise...
                        createdChildren.push(childWidget);
                     }
                  }
               }
               
               // If this widget is already in the document then we can resolve its "added to document"
               // promise immediately, this will trigger a chained function to notify all the child widgets
               // that they are in the document...
               if (targetNodeInDocument)
               {
                  this._addedToDocument.resolve(); 
               }

               // Resove the promise with the created children...
               children.resolve(createdChildren);
            })));

            // TODO: Keep track of widgets to be destroyed?
         }
         else
         {
            // If there are no children to create then just resolve with an empty list
            children.resolve([]);
         }

         // We are going to return a promise chain here that will ultimately contain the created
         // widgets, but we want to insert a function in the chain to ensure that all the child
         // widgets "added to document" promises are resolved when the current widget is added 
         // to the document...
         return children.then(lang.hitch(this, function(widgets) {
            this._addedToDocument && this._addedToDocument.then(function() {
               array.forEach(widgets, function(widget) {
                  if (widget._addedToDocument && typeof widget._addedToDocument.resolve === "function")
                  {
                     widget._addedToDocument.resolve();
                  }
               });
            });
            return widgets;
         }));
      },
      
      /**
       * Used to process filter rules for each widget to determine whether or not is should or 
       * shouldn't be rendered.
       * 
       * @instance
       * @param {object}   input The input to the function
       * @param {object[]} input.widgets The widgets to filter
       * @return {object} The output object
       */
      filterChildren: function alfresco_core_ChildProcessing__filterChildren(input) {
         var output = {};

         // TODO: Add filtering based on CoreWidgetProcessing code later
         output.widgets = input.widgets;

         return output;
      },

      /**
       * Create a new child from the widget model provided.
       * 
       * @instance
       * @param {object} input
       * @param {object} input.widget The widget model to build
       * @returns {object} An object containing a promise to the created child
       */
      createChild: function aikau_core_ChildProcessing__createChild(input) {
         var output = {};

         var initArgs = this.processWidgetConfig(input.widget);

         var promisedWidget = new Deferred();
         output.promisedChild = promisedWidget.promise;

         var widget = input.widget;
         var requires = [widget.name];
         require(requires, lang.hitch(this, function(type) {
            this.createNewModuleInstance({
               Type: type,
               widget: widget,
               args: initArgs,
               promise: promisedWidget
            });
         }));

         return output;
      },

      /**
       * Create a new instance of a module using the initialiation arguments provided. Once the module
       * is created it is used to resolve the promise provided. It is strongly recommended that this
       * function not be overridden without a deep understanding of the code and an appreciation of the
       * risks to compatibility with future releases.
       * 
       * @instance
       * @param {object} input
       * @param {object} input.Type    The object type to create a new instance of
       * @param {object} input.widget  The configuration for the widget
       * @param {object} input.args    The configuration object for the widget
       * @param {object} input.promise The promise to resolve with the instantiated widget
       */
      createNewModuleInstance: function aikau_core_ChildProcessing__createNewModuleInstance(input) {
         if (typeof input.Type === "function")
         {
            try
            {
               var preferredDomNodeId;
               if (registry.byId(input.args.id))
               {
                  preferredDomNodeId = input.args.id;
                  input.args.id = input.widget.name.replace(/\//g, "_") + "___" + this.generateUuid();
               }

               // Instantiate the new widget
               var instantiatedWidget = new input.Type(input.args, domConstruct.create("div", {}));
               if (preferredDomNodeId)
               {
                  domAttr.set(instantiatedWidget.domNode, "id", preferredDomNodeId);
                  instantiatedWidget._alfPreferredWidgetId = preferredDomNodeId;
               }

               if (typeof instantiatedWidget.startup === "function")
               {
                  instantiatedWidget.startup();
               }

               var assignToScope = input.widget.assignToScope || this;
               if (input.widget.assignTo)
               {
                  assignToScope[input.widget.assignTo] = instantiatedWidget;
               }

               // Set any additional style attributes...
               if (input.args.style && instantiatedWidget.domNode)
               {
                  domStyle.set(instantiatedWidget.domNode, input.args.style);
               }

               // Look to see if we can add any additional CSS classes configured onto the instantiated widgets
               // This should cover any widgets created by a call to the processWidgets function but will
               // not capture widgets instantiated directly (which we should look to phase out) but this is
               // why "additionalCssClasses" may still be defined and set explicitly in some widgets.
               if (instantiatedWidget.domNode && input.args.additionalCssClasses)
               {
                  domClass.add(instantiatedWidget.domNode, input.args.additionalCssClasses);
               }

               input.promise.resolve(instantiatedWidget);
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred creating a widget", e, this);
               input.promise.resolve(null);
            }
         }
         else
         {
            this.alfLog("error", "The following widget could not be found, so is not included on the page '" +  input.widget.name + "'. Please correct the use of this widget in your page definition", this);
            input.promise.resolve(null);
         }
      }
   });
});