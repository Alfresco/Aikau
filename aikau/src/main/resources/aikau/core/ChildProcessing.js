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
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/Deferred",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dijit/registry",
        "service/constants/Default",
        "alfresco/debug/WidgetInfo"], 
        function(declare, CoreWidgetProcessing, topics, lang, array, Deferred, domAttr, domClass, domConstruct, domStyle, 
                registry, AlfConstants, WidgetInfo) {
   
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
         var children = new Promise(lang.hitch(this, function(resolve) {
            if (lang.isArray(input.widgets))
            {
               // Create a map to hold all the promises (one for each child)...
               // This map will be passed to the promise/all function that will resolve when 
               // all the promises have been resolved...
               var promises = [];
            
               // Filter the children to ensure that only those child matching the filter rules
               // will be created...
               var filteredChildren = this.filterChildren({
                  widgets: input.widgets
               });

               // Some widgets require post processing that can only occur AFTER they have been
               // added to the live document (typically when checking the dimensions into which
               // they have been assigned). Therefore we need to notify all widgets when they
               // are added to the document. If the supplied targetNode is already in the live
               // document then we can create an array to capture all the widgets that will be
               // created. Once everything has completed the widgets can be notified that they
               // are in the document. 
               // 
               // NOTE: It is essential that this array is cascaded to all child widgets so that 
               //       they can add their own children to it!
               var targetNodeInDocument = document.body.contains(input.targetNode);
               if (targetNodeInDocument) 
               {
                  this.addedToDocumentNotificationList = [];
               }
               
               filteredChildren.widgets.forEach(function(widget, index) {

                  // Make a request to create the child, the response will be an object that will
                  // contain an attribute that is the promised...
                  var promisedChild = this.createChild({
                     widget: widget,
                     index: index
                  });
                  promises.push(promisedChild);

               }, this);

               if (!this._childWidgets)
               {
                  this._childWidgets = [];
               }

               // Use "all" here to add the created widgets to the targetNode once they have all been
               // created (or have failed to create)...
               Promise.all(promises).then(lang.hitch(this, function(results) {
                  
                  // Create an array to hold all the child widgets that get created, this will be 
                  // used as the value with which to resolve the returned promise...
                  var createdChildren = [];
                  results.forEach(function(childWidget) {
                     if (childWidget.widget)
                     {
                        // Handle any dynamic visibility and invisibility rules...
                        this.setupVisibilityConfigProcessing(childWidget.widget, false);
                        this.setupVisibilityConfigProcessing(childWidget.widget, true);

                        // Add the created widget into the target node if provided...
                        if (input.targetNode)
                        {
                           childWidget.widget.placeAt(input.targetNode, input.targetPosition || "last");
                        }

                        // Call post creation widget functioning...
                        this.postCreationProcessing({
                           widget: childWidget
                        });
                        
                        // Finally, add the widget to the array to used to resolve the returned promise...
                        createdChildren.push(childWidget.widget);
                     }
                  }, this);

                  // If this widget is already in the live document then we can notify all the 
                  // widgets created that they are now in the document...
                  if (targetNodeInDocument)
                  {
                     this.addedToDocumentNotificationList.forEach(function(widget) {
                        if (typeof widget.startup === "function")
                        {
                           widget.startup();
                        }
                     });
                  }

                  // Resove the promise with the created children...
                  this.alfPublish(topics.WIDGET_PROCESSING_COMPLETE, null, true);
                  resolve(createdChildren);
               }));

               // TODO: Keep track of widgets to be destroyed?
            }
            else
            {
               // If there are no children to create then just resolve with an empty list
               resolve([]);
            }

         }));
         return children;
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
      filterChildren: function aikau_core_ChildProcessing__filterChildren(input) {
         var output = {};
         if (input.widgets)
         {
            output.widgets = input.widgets.filter(this.filterWidget, this);
         }
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
         var initArgs = this.processWidgetConfig(input.widget);
         
         initArgs.addedToDocumentNotificationList = this.addedToDocumentNotificationList;

         var promisedWidget = new Promise(lang.hitch(this, function(resolve) {
            var widget = input.widget;
            var requires = [widget.name];
            require(requires, lang.hitch(this, function(type) {
               resolve(this.createNewModuleInstance({
                  Type: type,
                  widget: widget,
                  args: initArgs,
                  promise: promisedWidget
               }));
            }));
         }));
         return promisedWidget;
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
         // jshint maxcomplexity:false, maxstatements:false
         var instantiatedWidget;
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
               instantiatedWidget = new input.Type(input.args, domConstruct.create("div", {}));
               if (preferredDomNodeId)
               {
                  domAttr.set(instantiatedWidget.domNode, "id", preferredDomNodeId);
                  instantiatedWidget._alfPreferredWidgetId = preferredDomNodeId;
               }

               if (this.addedToDocumentNotificationList)
               {
                  this.addedToDocumentNotificationList.push(instantiatedWidget);
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

               // Create a node for debug mode...
               if (AlfConstants.DEBUG && instantiatedWidget.domNode)
               {
                  domClass.add(instantiatedWidget.domNode, "alfresco-debug-Info highlight");
                  var infoWidget = new WidgetInfo({
                     displayId: input.widget.id || "",
                     displayType: input.widget.name,
                     displayConfig: input.args
                  }).placeAt(instantiatedWidget.domNode);
                  domConstruct.place(infoWidget.domNode, instantiatedWidget.domNode, "first");
               }

               // Look to see if we can add any additional CSS classes configured onto the instantiated widgets
               // This should cover any widgets created by a call to the processWidgets function but will
               // not capture widgets instantiated directly (which we should look to phase out) but this is
               // why "additionalCssClasses" may still be defined and set explicitly in some widgets.
               if (instantiatedWidget.domNode && input.args.additionalCssClasses)
               {
                  domClass.add(instantiatedWidget.domNode, input.args.additionalCssClasses);
               }
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred creating a widget", e, this);
            }
         }
         else
         {
            this.alfLog("error", "The following widget could not be found, so is not included on the page '" +  input.widget.name + "'. Please correct the use of this widget in your page definition", this);
         }
         return {
            widget: instantiatedWidget
         };
      }
   });
});