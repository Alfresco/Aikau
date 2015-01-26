/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/forms/controls/MultipleEntryCreator
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/MultipleEntryCreator.html",
        "alfresco/core/Core",
        "alfresco/forms/controls/MultipleEntryElementWrapper",
        "alfresco/forms/controls/MultipleEntryElement",
        "alfresco/forms/controls/SimpleMultipleEntryElement",
        "dojo/_base/array",
        "dijit/focus",
        "dijit/registry",
        "dojo/aspect",
        "dojo/dnd/Source",
        "dojo/dom-construct"], 
        function(declare, _Widget, _Templated, _OnDijitClickMixin, template, AlfCore, MultipleEntryElementWrapper, 
                 MultipleEntryElement, SimpleMultipleEntryElement, array, focusUtil, registry, aspect, Source, domConstruct) {
   
   return declare([_Widget, _Templated, _OnDijitClickMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/MultipleEntryCreator.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/MultipleEntryCreator.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This is the altText that is used for the add entry button.
       * 
       * @instance
       * @type {string}
       * @default "multiple-entry.add"
       */
      addEntryAltText: "multiple-entry.add",

      /**
       * This is the source of the image used for the add entry button
       *
       * @instance
       * @type {string}
       * @default null
       */
      addEntryImageSrc: null,

      /**
       * This is the source of the image used for the add entry button
       *
       * @instance
       * @type {string}
       * @default "add-icon-16.png"
       */
      addEntryImage: "add-icon-16.png",

      /**
       * This constructor ensures that valid data has been set.
       * @instance
       */
      constructor: function alfresco_forms_controls_MultipleEntryCreator__constructor(args) {
         declare.safeMixin(this, args);
         // The data supplied to the widget will be some form of JSON. It should be an array
         // where each element will correspond to a MultipleEntryElement.
         
         // The supplied value should correspond to the JSON that we want to represent...
         // We need to construct the element configuration from this...
         
         if (typeof this.value == "undefined" || this.value == null)
         {
            // If no value has been set then we can just make the value an empty array and
            // also make the elements attribute an empty array.
            this.value = [];
            this.elements = [];
         }
         else if (this.value instanceof Array)
         {
            // The value supplied should be a JSON array where each entry represents a widget
            // to render. If this is the case then we will just set the elements object as
            // the value.
            // TODO: Should we be doing more defensive checking of the content?? e.g. is each element an object
            this.elements = this.value;
         }
         else
         {
            this.alfLog("log", "The value assigned to the MultipleEntryCreator '" + this.name + "' was not a JSON array", this.value);
         }
      },

      /**
       * Indicates whether or not re-ordering should be enabled through the use of drag and drop
       * @instance
       * @type {boolean}
       * @default false
       */
      enableDND: false,
      
      /**
       * This is a refrence to the Drag-And-Drop source container. This will be set to be the
       * "currentEntries" node during the constructor (unless overridden by and extending class)
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _dndSource : null,
      
      /**
       * This function is used to create drag and drop elements from the supplied item data. It is used
       * to construct BOTH avatars (the item when being dragged) and item templates. The item template is 
       * constructed by the createElementWrapper function
       * 
       * @instance
       * @param {object} item The item to create an avatar or element for
       * @param {string} hint Indicates what to create
       * @return {object} 
       */
      dndCreator: function alfresco_forms_controls_MultipleEntryCreator__dndCreator(item, hint) {
         
         var type = this.getDNDType(); 
         var node; // The node will either be the avatar or the wrapper...
         if (hint === "avatar")
         {
            // We're being requested to create the avatar...
            var widget = this.getDNDAvatarWidget(item);
            node = this.createDNDAvatarNode(widget);
         }
         else
         {
            // We're creating a regular entry in the creator...
            node = this.createElementWrapper(item).domNode;
         }
         
         return { node: node, data: item, type: type };
      },
      
      /**
       * This function is called whenever a Drag-And-Drop avatar is required. This takes the approach
       * that the item may not contain all the information available in the associated Drag-And-Drop
       * Source object so it retrieves all the currently selected nodes (when a Drag-And-Drop operation
       * starts the nodes being moved will be selected) and finds the widget mapped to the node of the
       * item supplied. This widget contains all of the information required to pass on to the 
       * "createDNDAvatarNode" function.
       * 
       * @instance
       * @param {object} item The item to create an object for
       */
      getDNDAvatarWidget: function alfresco_forms_controls_MultipleEntryCreator__getDNDAvatarWidget(item) {
         var widget = null;
         var selectedNodes = this._dndSource.getSelectedNodes();
         array.forEach(selectedNodes, function(node, index) {
            var wrapper = registry.byNode(node);
            
            // This ultra-cautious - but to avoid potential errors we're going to check that
            // the data structure we expect is in place. We're looking to check that the item
            // is the represented by the current selected node.
            if (wrapper && wrapper.widget && wrapper.widget.value && 
                item._alfMultipleElementId == wrapper.widget.value._alfMultipleElementId)
            {
               widget = wrapper.widget;
            }
            else
            {
               this.alfLog("warn", "MultipleEntryCreator.getDNDAvatarWidget function was expecting 'wrapper.widget.value._alfMultipleElementId' attribute:", wrapper);
            }
         });
         return widget;
      },
      
      /**
       * This creates the default Avatar DOM node for a MultipleEntryElement. It is nothing more than a basic
       * DIV element where the inner HTML is set to the value field of the widget value. This function should
       * be overridden by extending classes to make sure that the Avatar shows the appropriate information.
       * 
       * @instance
       * @param {object} widget
       */
      createDNDAvatarNode: function alfresco_forms_controls_MultipleEntryCreator__createDNDAvatarNode(widget) {
         return domConstruct.create("div", { innerHTML: this.encodeHTML((widget && widget.value && widget.value.value) ? widget.value.value : "")});
      },
      
      /**
       * This is the list of elements to display/edit. It will be instantiated in the constructor.
       * @instance
       * @default null 
       */
      elements: null,
      
      /**
       * Keeps track of all the wrapper objects - should this be a map??
       * @instance
       * @default
       */
      elementWrappers: null,
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_forms_controls_MultipleEntryCreator__postMixInProperties() {
         if (this.addEntryImageSrc == null || this.addEntryImageSrc == "")
         {
            this.addEntryImageSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.addEntryImage;
         }
         this.addEntryAltText = this.message(this.addEntryAltText);
      },

      /**
       * Creates each element to display/edit
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_MultipleEntryCreator__postCreate() {
         // Setup up the initial contents of the widget... 
         // Drag-and-drop...
         /*
          * Make the current entries become a dnd source.
          * The createElementWrapper function can be re-used as the creator...
          */
         if (this.enableDND)
         {
            this._dndSource = new Source(this.currentEntries, {
               copyOnly: false,
               selfCopy: false,
               selfAccept: true,
               accept: this.getAcceptedDNDTypes(),
               creator: dojo.hitch(this, "dndCreator")
            });
         }
         this.createEntries(this.elements);
      },
      
      /**
       * This function is called to return the list of Drag-And-Drop types that are accepted by
       * the MultipleEntryCreator. By default it returns the value returned by calling the
       * "getDNDType" function as only element in an array. This function should be overridden
       * if the extending class wishes to support other types being droppped into it.
       * 
       * @instance
       * @returns {string[]}
       */
      getAcceptedDNDTypes: function alfresco_forms_controls_MultipleEntryCreator__getAcceptedDNDTypes() {
         return [this.getDNDType()];
      },
      
      /**
       * This function returns the Drag-And-Drop type to assign to each element. By default
       * this returns "MultipleEntryElementWrapper". This function should be overridden by
       * extending classes to specify more specific data. This is especially important if 
       * the accepted types that can be dropped needs to be constrained.
       * 
       * @instance
       * @returns {string}
       */
      getDNDType: function alfresco_forms_controls_MultipleEntryCreator__getDNDType() {
         return "MultipleEntryElementWrapper";
      },
      
      /**
       * This function is used to create all of the entries. It is provided for use at both widget
       * instantiation and when a new value is passed. It will iterate over the supplied array
       * and create wrappers and elements for each entry.
       * 
       * @instance
       */
      createEntries: function alfresco_forms_controls_MultipleEntryCreator__createEntries(elements) {
         if (elements == null) 
         {
            elements = [];
         }
         if (this.enableDND)
         {
            this._dndSource.insertNodes(false, elements);
         }
         else
         {
            // Iterate over the list of elements and create a wrapper containing each element...
            this.alfLog("log", "Creating entries for MultipleEntryCreator", elements);
            array.forEach(elements, function(element, index) {
               if (element != null)
               {
                  var wrapper = this.createElementWrapper(element, true);
                  if (wrapper.widget)
                  {
                     wrapper.widget.createReadDisplay();
                  }
               }
               else
               {
                  this.alfLog("log", "An element in the value for MultipleEntryCreatory '" + this.name + "' was not an Object", element);
               }
            }, this);
         }
      },
      
      /**
       * Creates the wrapper that wraps the widget. Calls "createElementWidget" to create the widget.
       * 
       * @instance
       * @param {object} elementConfig
       * @param {boolean} previouslyExisted Indicates that the element previously existed.
       */
      createElementWrapper: function alfresco_forms_controls_MultipleEntryCreator__createElementWrapper(elementConfig, previouslyExisted) {
         // Create the element widget from the element configuration and then create a new
         // wrapper to hold it and add the wrapper at the end of the list of entries...
         this.alfLog("log", "Creating MultipleEntryElementWrapper", elementConfig);
         var _this = this;
         
         // It's important that we pass on the pubSubScope correctly when instantiating the elements...
         var elementWidget = this.createElementWidget({pubSubScope: this.pubSubScope,
                                                       dataScope: this.dataScope,
                                                       elementConfig: elementConfig,
                                                       widgets: this.widgets,
                                                       valueDisplayMap: this.valueDisplayMap,
                                                       readDisplayAttribute: this.readDisplayAttribute});
         var wrapper = new MultipleEntryElementWrapper({creator: this,
                                                        previouslyExisted: previouslyExisted, 
                                                        widget: elementWidget});
         aspect.after(wrapper, "blurWrapper", function(deferred) {
            _this.alfLog("log", "Wrapper 'blurWrapper' function processed");
            _this.validationRequired();
         });
         wrapper.placeAt(this.currentEntries);
         return wrapper;
      },
      
      /**
       * @instance
       */
      validationRequired: function alfresco_forms_controls_MultipleEntryCreator__validationRequired() {
         // This function does nothing but is used purely so that a form control can wrap it.
         this.alfLog("log", "Validation Required function called");
      },
      
      /**
       * This function should be extended by concrete implementations to create the element to go in the
       * element wrapper.
       * 
       * @instance
       * @param {object} config The configuration to instantiate the element with
       * @returns {object} A nwe MultipleEntryElement instance.
       */
      createElementWidget: function alfresco_forms_controls_MultipleEntryCreator__createElementWidget(config) {
         // Relies on the dependency already being in the Dojo cache!
         var widget = null;
         var requires = [this.elementWidget];
         require(requires, function(WidgetType) {
            widget = new WidgetType(config);
         });
         return widget;
      },
      
      /**
       * This function is called when the add entry button is clicked. We need to add a new element in edit mode.
       * 
       * @instance
       * @param {object} e
       */
      addEntry: function alfresco_forms_controls_MultipleEntryCreator__addEntry(e) {
         var wrapper;
         var elementConfig = {};
         if (this.enableDND)
         {
            // By clearing the previously selected nodes we will be able to select the node
            // that we add (indicated by the boolean argument to the "insertNodes" function).
            // This means that we can then retrieve the node we've just added and obtain
            // the wrapperElement created for it. This allows us to then put the wrapper into
            // edit mode.
            this._dndSource.selectNone();
            this._dndSource.insertNodes(true, [elementConfig]);
            var selected = this._dndSource.getSelectedNodes();
            if (selected instanceof Array && selected.length >0)
            {
               wrapper = registry.byNode(selected[0]);
               if (wrapper)
               {
                  wrapper.editElement(e);
               }
            }
         }
         else
         {
            // When Drag-And-Drop is not enabled we can just create the wrapper as usual 
            // and return it...
            wrapper = this.createElementWrapper(elementConfig);
            wrapper.editElement(e);
            focusUtil.focus(wrapper.widget);
         }
         return wrapper;
      },
      
      /**
       * Deletes the wrapper provided.
       * 
       * @instance
       */
      deleteEntry: function alfresco_forms_controls_MultipleEntryCreator__deleteEntry(wrapper) {
         wrapper.destroy(false);
         this.validationRequired();
      },
      
      /**
       * @instance
       * @returns {object}
       */
      getValue: function alfresco_forms_controls_MultipleEntryCreator__getValue() {
         var value = [];
         var wrappers = registry.findWidgets(this.currentEntries);
         array.forEach(wrappers, function(wrapper, index) {
            var widget = wrapper.widget;
            if (typeof widget.getValue == "function")
            {
               value.push(widget.getValue());
            }
            else
            {
               this.alfLog("warn", "The following widget has no getValue() function", widget);
            }
         }, this);
         return value;
      },
      
      /**
       * @instance
       * @param {object} value
       */
      setValue: function alfresco_forms_controls_MultipleEntryCreator__setValue(value) {
         // Destroy all the wrapper widgets
         this.alfLog("log", "Setting value of MultipleEntryCreator", this, value);
         var wrappers = registry.findWidgets(this.currentEntries);
         array.forEach(wrappers, function(wrapper, index) {
            wrapper.destroyRecursive();
         });
         if (!value instanceof Array)
         {
            this.alfLog("warn", "The value provided to the MultipleEntryCreator setValue was not an array:", value);
         }
         else
         {
            // Create all the entries defined.
            this.createEntries(value);
         }
      },
      
      /**
       * @instance
       * @returns {boolean}
       */
      validate: function alfresco_forms_controls_MultipleEntryCreator__validate() {
         var valid = true;
         var wrappers = registry.findWidgets(this.currentEntries);
         var _this = this;
         array.forEach(wrappers, function(wrapper, index) {
            valid = valid && wrapper.widget.validate();
         });
         return valid;
      }
   });
});