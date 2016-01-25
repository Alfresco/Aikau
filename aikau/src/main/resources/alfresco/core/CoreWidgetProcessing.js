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
 * This mixin in provides all the functions required for widgets that wish to process sub-widgets.
 *
 * @module alfresco/core/CoreWidgetProcessing
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @mixinSafe
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/ObjectTypeUtils",
        "dijit/registry",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-attr",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/Deferred",
        "service/constants/Default",
        "alfresco/debug/WidgetInfo"],
        function(declare, AlfCore, ObjectProcessingMixin, ObjectTypeUtils, registry, array, lang, domAttr, domConstruct, domClass, domStyle, Deferred, AlfConstants, WidgetInfo) {

   return declare([AlfCore, ObjectProcessingMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CoreWidgetProcessing.css"}]
       */
      cssRequirements: [{cssFile:"./css/CoreWidgetProcessing.css"}],

      /**
       * The current item to act upon
       *
       * @instance
       * @type {object}
       * @default
       */
      currentItem: null,

      /**
       * This string is used to identify locations of counts of widgets that are being processed.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       */
      _countDownLocationPrefix: "_processingCountDown",

      /**
       * This string is used to identify locations where processed widgets can be referenced. This location
       * will either be populated with an array of widgets or with a promise that will be resolved once all the
       * widgets have been created. This should not be set or configured.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       */
      _processedWidgetsLocationPrefix: "_processedWidgets",

      /**
       * This string is used to identify locations of arrays where widgets that are being created will be stored. 
       * THis should not be set or configured.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.36
       */
      _processingWidgetsLocationPrefix: "_processingWidgets",

      /**
       * Used to keep track of all the widgets created as a result of a call to the 
       * [processWidgets]{@link module:alfresco/core/Core#processWidgets} function. This should not be referenced directly,
       * instead the [getProcessedWidgets]{@link module:alfresco/core/Core#getProcessedWidgets} should be called.
       *
       * @instance
       * @type {Array}
       * @default
       */
      _processedWidgets: null,

      /**
       * As of 1.0.36 this is no longer used and it should not be referenced
       *
       * @instance
       * @type {number}
       * @default
       * @deprecated Since 1.0.36
       */
      _processedWidgetCountdown: null,
      
      /**
       * This function can be used to retrieve the widgets that have been processed by a call to 
       * [processWidgets]{@link module:alfresco/core/CoreWidgetProcessing#processWidgets}. It return a promise
       * of the widgets that will be created an as such calls to this function should be protected through
       * the use of dojo/when. It is not recommended to use this function, instead it is better to extend
       * the [allWidgetsProcessed]{@link module:alfresco/core/CoreWidgetProcessing#allWidgetsProcessed} function
       * as this will only be called when widget processing has completed and is passed an argument of the
       * widgets that were created.
       * 
       * @instance
       * @param  {string} processWidgetsId The ID mapped to the original processWidgets call
       * @return {object[]|promise} The array of processed widgets or a promise of them
       * @since 1.0.36
       */
      getProcessedWidgets: function alfresco_core_CoreWidgetProcessing__getProcessedWidgets(processWidgetsId) {
         var widgets;
         var processedWidgets = lang.getObject(this.getWidgetProcessingLocation(processWidgetsId, this._processedWidgetsLocationPrefix), false, this);
         if (processedWidgets)
         {
            widgets = processedWidgets.promise;
         }
         else
         {
            widgets = [];
         }
         return widgets;
      },

      /**
       * This function is used to get the dot-notation property of the key attributes used when processing widgets. When
       * a processWidgetsId is provided, the location will be a location within a map. The supplied prefix indicates
       * the type of property required - this will either be the remaining count of widgets to process, the array of
       * widgets processed so far or the promise of all the widgets when processing is complete.
       * 
       * @instance
       * @param  {string} processWidgetsId The ID mapped to the original processWidgets call
       * @param {string} prefix Expected to be either [_processedWidgetsLocationPrefix]{@link module:alfresco/core/CoreWidgetProcessing#_processedWidgetsLocationPrefix}
       * or [_processingWidgetsLocationPrefix]{@link module:alfresco/core/CoreWidgetProcessing#_processingWidgetsLocationPrefix}
       * @return {string} A dot-notation property to set or retrieve the processed widgets
       * @since 1.0.36
       */
      getWidgetProcessingLocation: function alfresco_core_CoreWidgetProcessing__getWidgetProcessingLocation(processWidgetsId, prefix) {
         var location = prefix;
         if (processWidgetsId)
         {
            location = prefix + "Map." + processWidgetsId;
         }
         return location;
      },

      /**
       * This function can be used to instantiate an array of widgets. Each widget configuration in supplied
       * widgets array is passed to the [processWidget]{@link module:alfresco/core/Core#processWidget} function
       * to handle it's creation.
       *
       * @callable
       * @instance
       * @param {array} widgets An array of the widget definitions to instantiate
       * @param {element} rootNode The DOM node which should be used to add instantiated widgets to
       * @param {string} processWidgetsId An optional ID that might have been provided to map the results of the call to
       */
      processWidgets: function alfresco_core_CoreWidgetProcessing__processWidgets(widgets, rootNode, processWidgetsId) {
         // There are two options for providing configuration, either via a JSON object or
         // via a URL to asynchronously retrieve the configuration. The configuration object
         // takes precedence as it will be faster by virtue of not requiring a remote call.
         try
         {
            // For the moment we'll just ignore handling the configUrl...
            if (widgets && widgets instanceof Array)
            {
               // Reset the processing complete flag... NOTE: THIS CAN NO LONGER BE RELIED ON UNLESS ONLY USED FOR SINGLE REQUESTS
               this.widgetProcessingComplete = false;

               // Reset all the data for this call... we create a Deferred object for anyone trying to get the widgets before
               // they've all be created, a countdown to track all the widgets that need to be created and an array to add widgets
               // to as they are created...
               lang.setObject(this.getWidgetProcessingLocation(processWidgetsId, this._countDownLocationPrefix), widgets.length, this);
               lang.setObject(this.getWidgetProcessingLocation(processWidgetsId, this._processedWidgetsLocationPrefix), new Deferred(), this);
               lang.setObject(this.getWidgetProcessingLocation(processWidgetsId, this._processingWidgetsLocationPrefix), [], this);
               
               // Iterate over all the widgets in the configuration object and add them...
               array.forEach(widgets, lang.hitch(this, this.processWidget, rootNode, processWidgetsId));
            }
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred processing widgets", e);
         }
      },

      /**
       * Creates a widget from the supplied configuration. The creation of each widgets DOM node
       * is delegated to the [createWidgetDomNode]{@link module:alfresco/core/Core#createWidgetDomNode} function
       * and the actual instantiation of the widget is handled by the [createWidget]{@link module:alfresco/core/Core#createWidget} function.
       * Before creation of the widget begins the [filterWidget]{@link module:alfresco/core/Core#filterWidget} function is
       * called to confirm that the widget should be created. This allows extending classes the opportunity filter
       * out widget creation in specific circumstances.
       *
       * @instance
       * @param {element} rootNode The DOM node where the widget should be created.
       * @param {string} processWidgetsId An optional ID that might have been provided to map the results of multiple calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * @param {object} widgetConfig The configuration for the widget to be created
       * @param {number} index The index of the widget configuration in the array that it was taken from
       */
      processWidget: function alfresco_core_CoreWidgetProcessing__processWidget(rootNode, processWidgetsId, widgetConfig, index) {
         if (widgetConfig)
         {
            if (this.filterWidget(widgetConfig, index, processWidgetsId))
            {
               var domNode = this.createWidgetDomNode(widgetConfig, rootNode, widgetConfig.className || "");
               this.createWidget(widgetConfig, domNode, this._registerProcessedWidget, this, index, processWidgetsId);
            }
         }
         else
         {
            this.alfLog("warn", "Could not process widget because it was missing configuration - check 'widgets' array for empty elements", this, index);
            var location = this.getWidgetProcessingLocation(processWidgetsId, this._countDownLocationPrefix);
            var countdown = lang.getObject(location, false, this);
            lang.setObject(location, countdown - 1, this);
         }
      },

      /**
       * This function registers the creation of a widget. It decrements the
       * [_processedWidgetCountdown]{@link module:alfresco/core/Core#_processedWidgetCountdown} attribute
       * and calls the [allWidgetsProcessed]{@link module:alfresco/core/Core#allWidgetsProcessed} function when it reaches zero.
       *
       * @instance
       * @param {object} widget The widget that has just been processed.
       * @param {number} index The target index of the widget
       * @param {string} processWidgetsId An optional ID that might have been provided to map the results of multiple calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       */
      _registerProcessedWidget: function alfresco_core_CoreWidgetProcessing___registerProcessedWidget(widget, index, processWidgetsId) {
         // Decrement the count as another widget is registered...
         var countDownLocation = this.getWidgetProcessingLocation(processWidgetsId, this._countDownLocationPrefix);
         var countdown = lang.getObject(countDownLocation, false, this) - 1;
         lang.setObject(countDownLocation, countdown, this);

         this.alfLog("log", "Widgets expected: ", countdown, this.id);
         
         // 1.0.35 UPDATE
         // If an "processWidgetsId" attribute is provided then we want to make sure that multiple calls to processWidgets
         // will not result in a _processedWidgets attribute containing results different calls. Therefore we want to map each
         // call to its own array... We still retain the original _processedWidgets object for backwards compatibility. The reason
         // for this is to ensure that in the event of an XHR request being made for a dependency that the asynchronous processing
         // is handled correctly.
         var location = this.getWidgetProcessingLocation(processWidgetsId, this._processingWidgetsLocationPrefix);
         var processedWidgets = lang.getObject(location, false, this);
         
         if (widget)
         {
            if (!index || index === 0 || isNaN(index))
            {
               processedWidgets.push(widget);
            }
            else
            {
               processedWidgets[index] = widget;
            }

            // Handle any dynamic visibility and invisibility rules...
            this.setupVisibilityConfigProcessing(widget, false);
            this.setupVisibilityConfigProcessing(widget, true);
         }
         else
         {
            this.alfLog("warn", "No widget supplied following registration", this);
         }

         if (countdown === 0)
         {
            // Double-check that no empty elements are in the array of processed widgets...
            // This could still be possible when indices have been used to set array contents...
            processedWidgets = array.filter(processedWidgets, function(item) {
               return (item !== null && typeof item !== "undefined");
            }, this);

            // IMPORTANT: We need to reset the processedWidgets with the filtered version...
            var promise = lang.getObject(this.getWidgetProcessingLocation(processWidgetsId, this._processedWidgetsLocationPrefix), false, this);
            promise.resolve(processedWidgets);

            this.allWidgetsProcessed(processedWidgets, processWidgetsId);
            this.widgetProcessingComplete = true; // NOTE: Not safe to refer to when calling processWidgets multiple times from a single widget
            this.alfPublish("ALF_WIDGET_PROCESSING_COMPLETE", {}, true);
         }
      },

      /**
       * Sets up the dynamic visibility handling for the supplied widget.
       * 
       * @instance
       * @param {object} widget The widget to process the config of
       * @param {string} configAttribute The attribute to use in the widget config for rules
       * @param {boolean} negate Whether or not to negate the evaluated rule
       */
      setupVisibilityConfigProcessing: function alfresco_core_CoreWidgetProcessing__setupVisibilityConfigProcessing(widget, negate) {
         // Set a default for negation if not provided...
         negate = (negate != null) ? negate : false;

         // Based on the negate value we'll determine which configuration attribute to look at...
         var configAttribute = negate ? "invisibilityConfig" : "visibilityConfig";

         // If the widget has dynamic visibility behaviour configured then we need to set up the necessary
         // subscriptions to handle the rules that have been defined. We will set the initial visibility
         // as requested and then set up the subcriptions...
         if (widget[configAttribute])
         {
            var initialValue = lang.getObject(configAttribute + ".initialValue", false, widget);
            initialValue = negate ? !initialValue : initialValue;
            if (initialValue != null && initialValue === false)
            {
               // Hide the widget if requested to initially...
               domStyle.set(widget.domNode, "display", "none");
            }
            var rules = lang.getObject(configAttribute + ".rules", false, widget);
            if (rules)
            {
               array.forEach(rules, function(rule) {
                  var topic = rule.topic,
                      attribute = rule.attribute,
                      is = rule.is,
                      isNot = rule.isNot,
                      strict = rule.strict != null ? rule.strict : true,
                      useCurrentItem = rule.useCurrentItem != null ? rule.useCurrentItem : false;
                  if (topic && attribute && (is || isNot))
                  {
                     var rulesObj = {
                           attribute: attribute,
                           lookupObject: useCurrentItem && widget.currentItem,
                           is: is,
                           isNot: isNot,
                           negate: negate,
                           strict: strict
                        },
                        successCallback = lang.hitch(this, this.onVisibilityProcessedSuccess, widget),
                        failureCallback = lang.hitch(this, this.onVisibilityProcessedFailure, widget);
                     widget.alfConditionalSubscribe(topic, rulesObj, successCallback, failureCallback);
                  }
               }, this);
            }
         }
      },

      /**
       * Called when visibility config on a widget has passed rule-evaluation.
       *
       * @instance
       * @param {object} widget The widget under test
       * @since 1.0.44
       */
      onVisibilityProcessedSuccess: function alfresco_core_CoreWidgetProcessing__onVisibilityProcessedSuccess(widget) {
         domStyle.set(widget.domNode, "display", "");
         if (typeof widget.alfPublishResizeEvent === "function")
         {
            widget.alfPublishResizeEvent(widget.domNode);
         }
      },

      /**
       * Called when visibility config on a widget has failed rule-evaluation.
       *
       * @instance
       * @param {object} widget The widget under test
       * @since 1.0.44
       */
      onVisibilityProcessedFailure: function alfresco_core_CoreWidgetProcessing__onVisibilityProcessedFailure(widget) {
         domStyle.set(widget.domNode, "display", "none");
      },

      /**
       * This function is called whenever a widget configured with a dynamic visibility rule is triggered
       * by a publication. The configured rules are processed and the widget is displayed or hidden
       * accordingly
       *
       * @instance
       * @param {object} widget The widget to control the visibility of
       * @param {array} is The values that the payload value can be for the widget to be visible
       * @param {array} isNot The values that the payload value must not be for the widget to be visible
       * @param {string} attribute The dot-notation attribute to retrieve from the payload
       * @param {boolean} negate Whether or not the to negate the evaluated rule (e.g evaluated visible become invisible)
       * @param {object} payload The publication payload triggering the visibility processing
       * @deprecated Since 1.0.44 - See [setupVisibilityConfigProcessing]{@link module:alfresco/core/CoreWidgetProcessing#setupVisibilityConfigProcessing} source code for current technique for evaluating visibility
       */
      processVisibility: function alfresco_core_CoreWidgetProcessing__processVisibility(widget, is, isNot, attribute, negate, strict, useCurrentItem, payload) {
         var target = lang.getObject(attribute, false, payload);

         // Assume that its NOT valid value (we'll only do the actual test if its not set to an INVALID value)...
         // UNLESS there are no valid values specified (in which case any value is valid apart form those in the invalid list)
         var isValidValue = (typeof is === "undefined" || is.length === 0);

         // Initialise the invalid value to be false if no invalid values have been declared (and only check values if defined)...
         var isInvalidValue = (typeof isNot !== "undefined" && isNot.length > 0);
         if (isInvalidValue)
         {
            // Check to see if the current value is set to an invalid value (i.e. a value that negates the rule)
            isInvalidValue = array.some(isNot, lang.hitch(this, "visibilityRuleComparator", target, widget, useCurrentItem));
         }

         // Check to see if the current value is set to a valid value...
         if (!isInvalidValue && typeof is !== "undefined" && is.length > 0)
         {
            isValidValue = array.some(is, lang.hitch(this, "visibilityRuleComparator", target, widget, useCurrentItem));
         }

         var evaluationPassed = isValidValue && !isInvalidValue;
         if (evaluationPassed)
         {
            // Handle successful evaluation, the widget will be displayed or hidden depending on the 
            // negate value (e.g. if negated the evaluated position is hidden, not displayed)...
            if (negate)
            {
               domStyle.set(widget.domNode, "display", "none");
            }
            else
            {
               domStyle.set(widget.domNode, "display", "");
               if (typeof widget.alfPublishResizeEvent === "function")
               {
                  widget.alfPublishResizeEvent(widget.domNode);
               }
            }
         }
         else if (strict)
         {
            // If evaluation has failed and we're running in "strict" mode then we need to show
            // or hide the widget as dictated by the "negate" variable...
            if (negate)
            {
               domStyle.set(widget.domNode, "display", "");
               if (typeof widget.alfPublishResizeEvent === "function")
               {
                  widget.alfPublishResizeEvent(widget.domNode);
               }
            }
            else
            {
               domStyle.set(widget.domNode, "display", "none");
            }
         }
      },

      /**
       * This function compares the supplied values for equality. It is called from the
       * [processVisibility function]{@link module:alfresco/core/CoreWidgetProcessing#processVisibility} to compare
       * the current value with the configured rules for dynamically hiding and displaying a widget
       * triggered by publications
       *
       * @instance
       * @param {string} targetValue The target value supplied
       * @param {boolean} useCurrentItem Indicates whether or not the values to check are attributes of the "currentItem"
       * @param {string} currValue The value from the current rule being processed
       * @returns {boolean} true if the values match and false otherwise
       * @deprecated Since 1.0.44 - See [setupVisibilityConfigProcessing]{@link module:alfresco/core/CoreWidgetProcessing#setupVisibilityConfigProcessing} source code for current technique for evaluating visibility
       */
      visibilityRuleComparator: function alfresco_core_CoreWidgetProcessing__visibilityRuleComparator(targetValue, widget, useCurrentItem, currValue) {
         if (targetValue == null && currValue == null)
         {
            return true;
         }
         else if (targetValue != null &&
                  typeof targetValue.toString === "function" &&
                  currValue != null &&
                  typeof currValue.toString === "function")
         {
            if (useCurrentItem === true && widget.currentItem)
            {
               var c = lang.getObject(currValue.toString(), false, widget.currentItem);
               return c === targetValue.toString();
            }
            else
            {
               return currValue.toString() === targetValue.toString();
            }
         }
         else
         {
            return false;
         }
      },

      /**
       * This is set from false to true after the [allWidgetsProcessed]{@link module:alfresco/core/Core#allWidgetsProcessed}
       * extension point function is called. It can be used to check whether or not widget processing is complete.
       * This is to allow for checks that widget processing has been completed BEFORE attaching a listener to the
       * [allWidgetsProcessed]{@link module:alfresco/core/Core#allWidgetsProcessed} function.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      widgetProcessingComplete: false,

      /**
       * This is an extension point for handling the completion of calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @extensionPoint
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       * @param {string} processWidgetsId An optional ID that might have been provided to map the results of multiple calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       */
      allWidgetsProcessed: function alfresco_core_CoreWidgetProcessing__allWidgetsProcessed(widgets, processWidgetsId) {
         // jshint unused:false
         this.alfLog("log", "All widgets processed");
      },

      /**
       * Creates a new DOM node for a widget to use. The DOM node contains a child <div> element
       * that the widget will be attached to and an outer <div> element that additional CSS classes
       * can be applied to.
       *
       * @instance
       * @param {object} widget The widget definition to create the DOM node for
       * @param {element} rootNode The DOM node to create the new DOM node as a child of
       * @param {string} rootClassName A string containing one or more space separated CSS classes to set on the DOM node
       */
      createWidgetDomNode: function alfresco_core_CoreWidgetProcessing__createWidgetDomNode(widget, rootNode, rootClassName) {
         // Add a new <div> element to the "main" domNode (defined by the "data-dojo-attach-point"
         // in the HTML template)...
         var tmp = rootNode;
         if (rootClassName)
         {
            tmp = domConstruct.create("div", { className: rootClassName}, rootNode);
         }
         return domConstruct.create("div", {}, tmp);
      },

      /**
       * This function is used to build the configuration used to instantiate a widget.
       * 
       * @instance
       * @param  {object} widget The widget configuration build configuration for
       * @return {object} The arguments that can be used when instantiating the widget configuration processed
       */
      processWidgetConfig: function alfresco_core_CoreWidgetProcessing__processWidgetConfig(widget) {
         // jshint maxcomplexity:false
         // Make sure we have an instantiation args object...
         var initArgs = (widget && widget.config && (typeof widget.config === "object")) ? widget.config : {};

         // Ensure that each widget has a unique id. Without this Dojo seems to occasionally
         // run into trouble trying to re-use an existing id...
         if (typeof initArgs.id === "undefined")
         {
            // Attempt to use the model ID as the DOM ID if available, but if not just generate an ID
            // based on the module name...
            if (!widget.id || lang.trim(widget.id) === "")
            {
               initArgs.id = widget.name.replace(/\//g, "_") + "___" + this.generateUuid();
            }
            else
            {
               initArgs.id = widget.id;
            }
         }

         if (initArgs.generatePubSubScope === true)
         {
            // Generate a new pubSubScope if requested to...
            initArgs.pubSubScope = this.generateUuid();
         }
         else if (initArgs.pubSubScope === undefined)
         {
            // ...otherwise inherit the callers pubSubScope if one hasn't been explicitly configured...
            initArgs.pubSubScope = this.pubSubScope;
         }

         // Pass on the pub/sub scope from the parent...
         if (initArgs.pubSubScope === this.pubSubScope)
         {
            // If the scope is inherited then also inherit the parent scope...
            if (!this.parentPubSubScope)
            {
               // ...set as global if not set already
               initArgs.parentPubSubScope = "";
            }
            else
            {
               // ...but try to inherit...
               initArgs.parentPubSubScope = this.parentPubSubScope;
            }
         }
         else
         {
            // If the scope has changed then inherit the my scope...
            initArgs.parentPubSubScope = this.pubSubScope;
         }

         if (initArgs.dataScope === undefined)
         {
            initArgs.dataScope = this.dataScope;
         }

         if (initArgs.currentItem === undefined)
         {
            initArgs.currentItem = this.currentItem;
         }
         if (initArgs.currentMetadata === undefined)
         {
            initArgs.currentMetadata = this.currentMetadata;
         }
         if (initArgs.groupMemberships === undefined)
         {
            initArgs.groupMemberships = this.groupMemberships;
         }
         return initArgs;
      },

      /**
       * This method will instantiate a new widget having requested that its JavaScript resource and
       * dependent resources be downloaded. In principle all of the required resources should be available
       * if the widget is being processed in the context of the Surf framework and dependency analysis of
       * the page has been completed. However, if this is being performed as an asynchronous event it may
       * be necessary for Dojo to request additional modules. This is why the callback function is required
       * to ensure that successfully instantiated modules can be kept track of.
       *
       * @instance
       * @param {object} widget The configuration for the widget
       * @param {element} domNode The DOM node to attach the widget to
       * @param {function} callback A function to call once the widget has been instantiated
       * @param {object} callbackScope The scope with which to call the callback
       * @param {number} index The index of the widget to create (this will effect it's location in the
       * [_processedWidgets]{@link module:alfresco/core/Core#_processedWidgets} array)
       * @return {object|promise} Either the created widget or the promise of a widget
       */
      createWidget: function alfresco_core_CoreWidgetProcessing__createWidget(widget, domNode, callback, callbackScope, index, processWidgetsId) {
         var _this = this;
         this.alfLog("log", "Creating widget: ",widget);
         var initArgs = this.processWidgetConfig(widget);

         // In certain circumstances there is the possibility that Surf will not have been able to correctly
         // identify all the dependencies for the widget that is being created. In this case we will return
         // the promise of a widget and only register the widget once all the dependencies have been retrieved
         // and the widget has been instantiated. This ensures that the allWidgetsProcessed function is never
         // called until all widgets have truly been created.
         var promisedWidget = new Deferred();
         promisedWidget.then(lang.hitch(this, function(resolvedWidget) {
            if (callback)
            {
               callback.call((callbackScope || this), resolvedWidget, index, processWidgetsId);
            }
         }));

         // Create a reference for the widget to be added to. Technically the require statement
         // will need to asynchronously request the widget module - however, assuming the widget
         // has been included in such a way that it will have been included in the generated
         // module cache then the require call will actually process synchronously and the widget
         // variable will be returned with an assigned value...
         var instantiatedWidget;

         // Dynamically require the specified widget
         // The use of indirection is done so modules will not rolled into a build (should we do one)
         var requires = [widget.name];
         require(requires, function(WidgetType) {
            // jshint maxcomplexity:false
            // Just to be sure, check that no widget doesn't already exist with that id and
            // if it does, generate a new one...
            if (typeof WidgetType === "function")
            {
               try
               {
                  var preferredDomNodeId;
                  if (registry.byId(initArgs.id))
                  {
                     preferredDomNodeId = initArgs.id;
                     initArgs.id = widget.name.replace(/\//g, "_") + "___" + _this.generateUuid();
                  }

                  // Instantiate the new widget
                  // This is an asynchronous response so we need a callback method...
                  instantiatedWidget = new WidgetType(initArgs, domNode);
                  if (!_this.widgetsToDestroy)
                  {
                     _this.widgetsToDestroy = [];
                     _this.widgetsToDestroy.push(widget);
                  }

                  if (preferredDomNodeId)
                  {
                     domAttr.set(instantiatedWidget.domNode, "id", preferredDomNodeId);
                     instantiatedWidget._alfPreferredWidgetId = preferredDomNodeId;
                  }

                  _this.alfLog("log", "Created widget", instantiatedWidget);
                  if (typeof instantiatedWidget.startup === "function")
                  {
                     instantiatedWidget.startup();
                  }
               
                  if (widget.assignTo)
                  {
                     _this[widget.assignTo] = instantiatedWidget;
                  }

                  // Set any additional style attributes...
                  if (initArgs.style && instantiatedWidget.domNode)
                  {
                     domStyle.set(instantiatedWidget.domNode, initArgs.style);
                  }

                  // Create a node for debug mode...
                  if (AlfConstants.DEBUG && instantiatedWidget.domNode)
                  {
                     domClass.add(instantiatedWidget.domNode, "alfresco-debug-Info highlight");
                     var infoWidget = new WidgetInfo({
                        displayId: widget.id || "",
                        displayType: widget.name,
                        displayConfig: initArgs
                     }).placeAt(instantiatedWidget.domNode);
                     domConstruct.place(infoWidget.domNode, instantiatedWidget.domNode, "first");
                  }

                  // Look to see if we can add any additional CSS classes configured onto the instantiated widgets
                  // This should cover any widgets created by a call to the processWidgets function but will
                  // not capture widgets instantiated directly (which we should look to phase out) but this is
                  // why "additionalCssClasses" may still be defined and set explicitly in some widgets.
                  if (instantiatedWidget.domNode && initArgs.additionalCssClasses)
                  {
                     domClass.add(instantiatedWidget.domNode, initArgs.additionalCssClasses);
                  }
                  promisedWidget.resolve(instantiatedWidget);
               }
               catch (e)
               {
                  _this.alfLog("error", "The following error occurred creating a widget", e, _this);
                  promisedWidget.resolve(null);
                  return null;
               }
            }
            else
            {
               _this.alfLog("error", "The following widget could not be found, so is not included on the page '" +  widget.name + "'. Please correct the use of this widget in your page definition", _this);
               promisedWidget.resolve(null);
            }
         });

         if (!widget)
         {
            this.alfLog("warn", "A widget was not declared so that it's modules were included in the loader cache", widget, this);
         }
         return instantiatedWidget || promisedWidget.promise;
      },

      /**
       * Overrides [filterWidget]{@link module:alfresco/core/Core#filterWidget} to check for a "renderFilter" attribute
       * included in the supplied widget configuration. This is then used to determine whether or not the widget
       * should be created or not.
       *
       * @instance
       * @param {object} widgetConfig The configuration for the widget to be created
       * @returns {boolean} The result of the filter evaluation or true if no "renderFilter" is provided
       */
      filterWidget: function alfresco_core_CoreWidgetProcessing__filterWidget(widgetConfig, index, processWidgetsId) {
         var shouldRender = this.processAllFilters(widgetConfig.config);
         if (!shouldRender)
         {
            // It is not always necessary to call the _registerProcessedWidget. This is relevant for widgets
            // that work through an entire model before performing any processing (e.g. alfresco/core/FilteredPage)
            this._registerProcessedWidget(null, index, processWidgetsId);
         }
         return shouldRender;
      },

      /**
       * Processes filter configuration. This looks for either "renderFilters" (e.g. a filter containing
       * sub-filters) or "renderFilter" (i.e. a single filter containing one or more rules to evaluate).
       * It then delegates processing to the appropriate function
       *
       * @instance
       * @param  {object} filterConfig The configuration to inspect
       * @return {boolean} True if all filters have evaluated successfully and false otherwise.
       */
      processAllFilters: function alfresco_core_CoreWidgetProcessing__processAllFilters(filterConfig) {
         var shouldRender = true;
         if (filterConfig && filterConfig.renderFilters)
         {
            // If "renderFilters" (i.e. more than one "renderFilter" - see following else/if block)
            var renderFiltersConfig = filterConfig.renderFilters;
            var renderFiltersMethod = lang.getObject("renderFilterMethod", false, filterConfig);
            shouldRender = this.processMultipleFilters(renderFiltersConfig, renderFiltersMethod);
         }
         else if (filterConfig && filterConfig.renderFilter)
         {
            // If filter configuration is provided, then switch the default so that rendering will NOT occur...
            // Check that the object has a the supplied property...
            var renderFilterConfig = filterConfig.renderFilter;
            var renderFilterMethod = lang.getObject("renderFilterMethod", false, filterConfig);
            shouldRender = this.processSingleFilter(renderFilterConfig, renderFilterMethod);
         }
         return shouldRender;
      },

      /**
       * This function is used to to determine whether or not a filter containing multiple sub-filters evaluates to true. 
       * The sub-filters themselves can contain further nested filters.
       *
       * @instance
       * @param  {object[]} renderFilterConfig The configuration for the filter array
       * @param  {string} renderFilterMethod Either ANY or ALL 
       * @return {boolean} True if the filter passes and false otherwise
       */
      processMultipleFilters: function alfresco_core_CoreWidgetProcessing__processMultipleFilters(renderFiltersConfig, renderFilterMethod) {
         var shouldRender = true;
         if (!ObjectTypeUtils.isArray(renderFiltersConfig))
         {
            // Invalid configuration counts as being allowed to render...
            this.alfLog("warn", "A request was made to filter a widget, but the 'renderFilters' configuration was not an array", this, renderFiltersConfig, renderFilterMethod);
            shouldRender = true;
         }
         else
         {
            // Check that the widget passes all the filter checks...
            if (!renderFilterMethod || lang.trim(renderFilterMethod) === "ALL")
            {
               // Handle AND logic (all filters must pass)
               shouldRender = array.every(renderFiltersConfig, lang.hitch(this, this.processAllFilters));
            }
            else
            {
               // Handle OR logic (only one filter needs to pass)
               shouldRender = array.some(renderFiltersConfig, lang.hitch(this, this.processAllFilters));
            }
         }
         return shouldRender;
      },

      /**
       * This function is used to to determine whether or not a single filter evaluates to true. Note that a single
       * filter can consist of multiple rules where all rules or just one rule must evaluate to true in order for
       * the filter to pass.
       *
       * @instance
       * @param  {object[]} renderFilterConfig The configuration for the filter array
       * @param  {string} renderFilterMethod Either ANY or ALL 
       * @return {boolean} True if the filter passes and false otherwise
       */
      processSingleFilter: function alfresco_core_CoreWidgetProcessing__processSingleFilter(renderFilterConfig, renderFilterMethod) {
         var shouldRender = true;
         if (!ObjectTypeUtils.isArray(renderFilterConfig))
         {
            this.alfLog("warn", "A request was made to filter a widget, but the 'renderFilter' configuration was not an array", this, renderFilterConfig, renderFilterMethod);
            shouldRender = true;
         }
         else
         {
            // Check that the widget passes all the filter checks...
            if (!renderFilterMethod || lang.trim(renderFilterMethod) === "ALL")
            {
               // Handle AND logic (all filters must pass)
               shouldRender = array.every(renderFilterConfig, lang.hitch(this, this.processFilterConfig));
            }
            else
            {
               // Handle OR logic (only one filter needs to pass)
               shouldRender = array.some(renderFilterConfig, lang.hitch(this, this.processFilterConfig));
            }
         }
         return shouldRender;
      },

      /**
       * @instance
       * @param {object} renderFilterConfig The filter configuration to process
       * @param {number} index The index of the filter configuration
       * @returns {boolean} True if the filter criteria have been met and false otherwise.
       */
      processFilterConfig: function alfresco_core_WidgetsProcessingFilterMixin__processFilterConfig(renderFilterConfig, /*jshint unused:false*/ index) {
         var passesFilter = false;
         if (this.filterPropertyExists(renderFilterConfig))
         {
            // Compare the property value against the applicable values...
            var renderFilterProperty = this.getRenderFilterPropertyValue(renderFilterConfig);
            if (renderFilterConfig.value)
            {
               // See AKU-781 - We now allow client-side properties to be compared...
               switch (renderFilterConfig.comparator) {
                  case "lessThan":
                     passesFilter = renderFilterProperty < renderFilterConfig.value;
                     break;
                  case "greaterThan":
                     passesFilter = renderFilterProperty > renderFilterConfig.value;
                     break;
                  default:
                     passesFilter = renderFilterProperty === renderFilterConfig.value;
               }
            }
            else if (renderFilterConfig.values)
            {
               // Check that the target property matches one of the supplied values...
               var renderFilterValues = this.getRenderFilterValues(renderFilterConfig);
               passesFilter = array.some(renderFilterValues, lang.hitch(this, this.processFilter, renderFilterConfig, renderFilterProperty));
            }
            else if (renderFilterConfig.contains)
            {
               // Check that the target property is an array containing ONE of the target values...
               passesFilter = array.some(renderFilterConfig.contains, lang.hitch(this, this.processFilterArray, renderFilterConfig, renderFilterProperty));
            }
            else if (renderFilterConfig.containsAll)
            {
               // Check that the target property is an array containing ALL of the target values...
               passesFilter = array.every(renderFilterConfig.containsAll, lang.hitch(this, this.processFilterArray, renderFilterConfig, renderFilterProperty));
            }
         }
         else if (renderFilterConfig.renderOnAbsentProperty === true)
         {
            passesFilter = true;
         }
         else
         {
            passesFilter = false;
         }
         if (renderFilterConfig.negate === true)
         {
            // Negate the result...
            passesFilter = !passesFilter;
         }
         else
         {
            // No action, leave result as it is...
         }
         this.alfLog("log", "Render filter result", passesFilter, this.currentItem, renderFilterConfig);
         return passesFilter;
      },

      /**
       * This function is used to compare the value of all the elements in the supplied targetArray against the 
       * value of the supplied currValue. If a match is found then this will return true.
       * 
       * @instance
       * @param  {object} renderFilterConfig The complete configuration for the render filter
       * @param  {array} targetArray The array of values to compare against the supplied currValue
       * @param  {string|boolean} currValue The value to compare against all the elements in the targetArray
       * @return {boolean} Indicates whether or not the supplied currValue has been found in the targetArray
       */
      processFilterArray: function alfresco_core_CoreWidgetProcessing__processFilterArray(renderFilterConfig, targetArray, currValue) {
         var foundCurrValue = false;
         if (ObjectTypeUtils.isArray(targetArray))
         {
            if (typeof currValue === "boolean")
            {
               currValue = currValue.toString();
            }

            // Substitute any tokens in the current value to search for...
            if (renderFilterConfig.substituteTokens === true)
            {
               currValue = this.substituteFilterTokens(currValue);
            }
            
            foundCurrValue = array.some(targetArray, function(arrayValue) {
               if (typeof arrayValue === "boolean")
               {
                  arrayValue = arrayValue.toString();
               }
               return arrayValue === currValue;
            });
         }
         return foundCurrValue;
      },

      /**
       * This function is called from both [processFilter]{@link module:alfresco/core/CoreWidgetProcessing#processFilter}
       * and [processFilterArray]{@link module:alfresco/core/CoreWidgetProcessing#processFilterArray} to substitute
       * any tokens found in the target values with matching dot-notation properties found in the currentItem and
       * currentMetadata objects if they are available.
       * 
       * @instance
       * @param  {*} value The value to look for tokens in
       * @return {string} The value with any tokens substituted
       * @since 1.0.43
       */
      substituteFilterTokens: function alfresco_core_CoreWidgetProcessing__substituteFilterTokens(value) {
         if (this.currentItem)
         {
            value = this.processCurrentItemTokens(value);
         }
         if (this.currentMetadata)
         {
            value = this.processCurrentMetadataTokens(value);
         }
         return value;
      },

      /**
       * This is called from the [filterWidget]{@link module:alfresco/core/WidgetsProcessingFilterMixin#filterWidget} function
       * for each acceptable filter value and compares it against the supplied target value.
       *
       * @instance
       * @param {object} renderFilterConfig The configuration for the filter
       * @param {string|boolean|number} target The target object to match (ideally this should be a string, boolean or a number
       * @returns {boolean} true If the supplied value matches the target value and false otherwise.
       */
      processFilter: function alfresco_core_WidgetsProcessingFilterMixin__processFilter(renderFilterConfig, target, currValue) {
         if (ObjectTypeUtils.isString(currValue))
         {
            currValue = lang.trim(currValue);
         }

         // Substitute any tokens in the current value to search for...
         if (renderFilterConfig.substituteTokens === true)
         {
            currValue = this.substituteFilterTokens(currValue);
         }
         
         // Convert booleans to strings for simple comparison...
         // This is necessary because when creating pages dynamically the boolean values
         // will end up as strings so the comparison won't work.
         if (typeof target === "boolean")
         {
            target = target.toString();
         }
         if (typeof currValue === "boolean")
         {
            currValue = currValue.toString();
         }
         return currValue === target;
      },

      /**
       * Checks to see whether or not the supplied filter property is a genuine attribute of the
       * [currentItem]{@link module:alfresco/core/WidgetsProcessingFilterMixin#currentItem}.
       *
       * @instance
       * @param {{property: string, values: string[]|string}} renderFilterConfig The filter configuration to process.
       * @returns {boolean} true if the property exists and false if it doesn't.
       */
      filterPropertyExists: function alfresco_core_WidgetsProcessingFilterMixin__filterPropertyExists(renderFilterConfig) {
         var targetObject = this.currentItem;
         if (renderFilterConfig.target && this[renderFilterConfig.target])
         {
            targetObject = this[renderFilterConfig.target];
         }
         return (ObjectTypeUtils.isString(renderFilterConfig.property) && ObjectTypeUtils.isObject(targetObject) && lang.exists(renderFilterConfig.property, targetObject));
      },

      /**
       * Processes the "filterProperty" attribute defined in the filter configuration (which is expected to be a dot notation path to an attribute
       * of the [currentItem]{@link module:alfresco/core/WidgetsProcessingFilterMixin#currentItem}. This
       * property is then retrieved from [currentItem]{@link module:alfresco/core/WidgetsProcessingFilterMixin#currentItem}
       * and returned so that it can be compared against the "values" configuration. Retrieval of the
       *
       * @instance
       * @param {{property: string, values: string[]|string}} renderFilter The filter configuration to process.
       * @returns {object} The property of [currentItem]{@link module:alfresco/core/WidgetsProcessingFilterMixin#currentItem} defined
       * by the "property" attribute of the filter configuration.
       */
      getRenderFilterPropertyValue: function alfresco_core_WidgetsProcessingFilterMixin__getRenderFilterPropertyValue(renderFilterConfig) {
         var targetObject = this.currentItem;
         if (renderFilterConfig.target && lang.exists(renderFilterConfig.target))
         {
            targetObject = lang.getObject(renderFilterConfig.target);
         }
         else if (renderFilterConfig.target && this[renderFilterConfig.target])
         {
            targetObject = this[renderFilterConfig.target];
         }
         return lang.getObject(renderFilterConfig.property, false, targetObject);
      },

      /**
       *
       * @instance
       * @param {{property: string, values: string[]|string}} renderFilter The filter configuration to process.
       * @returns {string} The name of the filter
       */
      getCustomRenderFilterProperty: function alfresco_core_WidgetsProcessingFilterMixin__getCustomRenderFilterProperty(currentItem) {
         var result = null;
         if (currentItem instanceof Boolean || typeof currentItem === "boolean")
         {
            result = currentItem ? "folder" : "document";
         }
         return result;
      },

      /**
       * Attempt to convert the supplied filter value into an array. Filter values should be configured as an array of
       * strings but this also allows single strings to be used (which are converted into a single element array) but
       * if all else fails then an empty array will be returned.
       *
       * @instance
       * @param {{property: string, values: string[]|string}} renderFilter The filter configuration to process.
       * @returns {string[]} An array (assumed to be of strings) that is either empty, the same array supplied as an argument or a single
       * string element supplied as an argument.
       */
      getRenderFilterValues: function alfresco_core_WidgetsProcessingFilterMixin__getRenderFilterValues(renderFilter) {
         var result = null;
         if (ObjectTypeUtils.isArray(renderFilter.values))
         {
            result = renderFilter.values;
         }
         else if (ObjectTypeUtils.isString(renderFilter.values))
         {
            result = [renderFilter.values];
         }
         else
         {
            result = [];
         }
         return result;
      }
   });
});
