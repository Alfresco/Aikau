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
 * @module alfresco/creation/DropZone
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DropZone.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/dnd/Source",
        "dojo/dnd/Target",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/aspect",
        "alfresco/creation/DropZoneWrapper",
        "dojo/on"], 
        function(declare, _Widget, _Templated, template, AlfCore, lang, array, registry, Source, Target, domConstruct, domClass, aspect, DropZoneWrapper, on) {
   
   return declare([_Widget, _Templated, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DropZone.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      horizontal: false,
      
      /**
       * The target for dropping widgets onto.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      previewTarget: null,
      
      /**
       * A list of the initial items to add to the drop zone when it is first created.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      initialItems: null,
      
      /**
       * The types that this drop zone will accept. By default this is set to null but if not specified
       * in the configuration this will be initialised to ["widget"].
       *
       * @instance
       * @type {string[]}
       * @default null
       */
      acceptTypes: null,

      /**
       * @instance
       */
      postCreate: function alfresco_creation_DropZone__postCreate() {
         if (this.acceptTypes == null)
         {
            this.acceptTypes = ["widget"];
         }
         
         this.previewTarget = new Source(this.previewNode, { 
            accept: this.acceptTypes,
            creator: lang.hitch(this, "creator"),
            withHandles: true,
            horizontal: this.horizontal
         });

         // Create a new UUID to pass on to the widgets that are dropped into this instance
         // this is done so that this instance can subscribe to requests from it's direct dropped items
         this.childPubSubScope = this.generateUuid();
         
         // Capture wrappers being selected...
         aspect.after(this.previewTarget, "onMouseDown", lang.hitch(this, "onWidgetSelected"), true);
         
         // Capture widgets being dropped...
         aspect.after(this.previewTarget, "onDrop", lang.hitch(this, "refreshChildren"), true);
         
         // When additional nodes are created as a result of dropping them into the preview target it
         // will be necessary to publish the details of the available fields. This is done for the benefit
         // of any controls that are dependent upon that information.
         aspect.after(this.previewTarget, "insertNodes", lang.hitch(this, "publishAvailableFields"), true);
         
         // Subscribe to events containing data to re-render and existing item...
         this.alfSubscribe("ALF_UPDATE_RENDERED_WIDGET", lang.hitch(this, "updateItem"));
         
         // Subscribe to requests to publish the details of the fields that are available...
         this.alfSubscribe(this.childPubSubScope + "ALF_REQUEST_AVAILABLE_FORM_FIELDS", lang.hitch(this, "publishAvailableFields"), true);
         
         // Listen for widgets requesting to be deleted...
         on(this.previewNode, "onWidgetDelete", lang.hitch(this, "deleteItem"));
         
         // Add in any items that are included as instantiation arguments...
         // These would be included when a DropZone is created as the display
         // widget of a widget with children. The children will be the items to add.
         if (this.initialItems != null)
         {
            // var items = [];
            // array.forEach(this.initialItems, function (item, index) {
            //    items.push(this.alfGetData(item));
            // }, this);
            this.previewTarget.insertNodes(false, this.initialItems, false, null);
            // this.previewTarget.insertNodes(false, items, false, null);
         }

         if (this.value != null && this.value !== "")
         {
            array.forEach(this.value, function(widget, i) {
               var data = {
                  name: widget.name,
                  module: widget.module,
                  defaultConfig: widget.defaultConfig,
                  widgetsForDisplay: widget.widgetsForDisplay,
                  widgetsForConfig: widget.widgetsForConfig
               };
               var dndData = this.creator(data);
               this.previewTarget.insertNodes(true, [dndData.data]);
            }, this);
         }
      },
      
      /**
       * @instance
       * @returns {object[]} The currently available fields.
       */
      getAvailableFields: function alfresco_creation_DropZone__getAvailableFields() {
         var currentFields = [];
         for (var key in this.previewTarget.map)
         {
            var currentField = this.previewTarget.map[key];
            
            // Get the field name to use as the label (this can change) and the id (which should remain
            // static once created) to populate an individual option.
            var fieldName = lang.getObject("updatedConfig.defaultConfig.name", false, currentField.data);
            if (fieldName == null)
            {
               fieldName = lang.getObject("defaultConfig.name", false, currentField.data);
            }
            var fieldId = lang.getObject("updatedConfig.defaultConfig.fieldId", false, currentField.data);
            if (fieldId == null)
            {
               fieldId = lang.getObject("defaultConfig.fieldId", false, currentField.data);
            }
            currentFields.push({
               label: fieldName,
               value: fieldId
            });
         }
         return currentFields;
      },
      
      /**
       * Publishes an array of the names of all of the currently configured fields.
       * 
       * @instance
       */
      publishAvailableFields: function alfresco_creation_DropZone__publishAvailableFields() {
         var payload = {};
         payload.options = this.getAvailableFields();
         this.alfLog("log", "Publishing available fields:", payload, this);
         this.alfPublish(this.childPubSubScope + "ALF_FORM_FIELDS_UPDATE", payload, true);
      },
      
      /**
       * @instance
       * @param {object} evt The event.
       */
      deleteItem: function alfresco_creation_DropZone__deleteItem(evt) {
         this.alfLog("log", "Delete widget request detected", evt);
         
         if (evt.target != null && 
             evt.target.id != null &&
             this.previewTarget.getItem(evt.target.id) != null &&
             evt.widgetToDelete != null) 
         {
            var target = this.previewTarget.getItem(evt.target.id);
            var fieldId = lang.getObject("data.defaultConfig.fieldId", false, target),
                parentId = lang.getObject("data.parentId", false, target);
            if (fieldId != null && parentId != null)
            {
               // Remove all references in parent...
               this.removeReferencesFromParent(parentId, fieldId);

               // Delete from data model - setting to null is good enough...
               this.alfSetData(fieldId, null);
            }

            evt.widgetToDelete.destroyRecursive(false);
            this.previewTarget.delItem(evt.target.id);
            
            // If the last item has just been deleted the add the dashed border back...
            if (this.previewTarget.getAllNodes().length === 0)
            {
               domClass.remove(this.previewNode, "containsItems");
            }

            // Request that the any config display is cleared.
            // TODO: Currently this doesn't specify the item, we might not want to delete if the deleted item isn't currently selected.
            // Could check to see if it is the selected item? Or include item details in payload.
            this.alfPublish("ALF_CLEAR_CONFIGURE_WIDGET", {});
            
            // Emit the event to alert wrapping widgets to changes...
            this.refreshChildren();
            
            this.publishAvailableFields();
         }
      },
      
      /**
       * Handles updates to the configuration for a currently rendered item.
       * 
       * @instance
       */
      updateItem: function alfresco_creation_DropZone__updateItem(payload) {
         // Check that the updated item belongs to this DropZone instance (this is done to prevent
         // multiple DropZone instances trying to modify the wrong objects)...
         if (payload.node != null)
         {
            var myNode = array.some(this.previewTarget.getAllNodes(), function(node, i) {
               return payload.node.id == node.id;
            });
            if (myNode === true)
            {
               this.alfLog("log", "Updating item", payload);

               // TODO: Potentially fragile...
               var fieldId = payload.originalConfig.defaultConfig.fieldId;

               // Get the configuration for the widget that has been updated...
               var config = this.alfGetData(fieldId);
               if (config != null)
               {
                  // Get the keys to use to define the object (typically these are just "name" and "config")...
                  // However, they can be different, e.g. when defining publication data (i.e. "publishTopic" and "publishPayload")...
                  var itemNameKey = (config.itemNameKey != null) ? config.itemNameKey : "name",
                      itemConfigKey = (config.itemConfigKey != null) ? config.itemConfigKey : "config";

                  // Create a new widget definition object (overwriting the previous data if necessary)...
                  // Use the custom keys as necessary...
                  config.widgetConfig = {};
                  config.widgetConfig[itemNameKey] = config.module;
                  config.widgetConfig[itemConfigKey] = {};

                  // We need to keep a separate record of the updated config...
                  config.updatedConfig = {
                     defaultConfig: {},
                     additionalConfig: {}
                  };

                  // Set the main config...
                  var v;
                  for (var key in payload.updatedConfig.defaultConfig)
                  {
                     v = payload.updatedConfig.defaultConfig[key];
                     config.widgetConfig[itemConfigKey][key] = v;
                     lang.setObject(key, v, config.updatedConfig.defaultConfig);
                  }

                  // Set additional config...
                  for (key in payload.updatedConfig.additionalConfig)
                  {
                     v = payload.updatedConfig.additionalConfig[key];
                     config.widgetConfig[key] = v;
                     lang.setObject(key, v, config.updatedConfig.additionalConfig);
                  }

                  array.forEach(config.widgetsForConfig, lang.hitch(this, this.updateWidgetConfig, payload.updatedConfig));
                  // for (var i=0; i<config.widgetsForConfig.length; i++)
                  // {
                  //    // clonedConfig.widgetsForConfig[i].config.value = payload.updatedConfig[clonedConfig.widgetsForConfig[i].config.name];
                  //    if (config.widgetsForConfig[i].config.name)
                  //    {
                  //       this.updateWidgetConfig(payload.updatedConfig, config.widgetsForConfig[i], 0);
                  //       // config.widgetsForConfig[i].config.value = lang.getObject(config.widgetsForConfig[i].config.name, false, payload.updatedConfig);
                  //    }
                  // }
               }
               
               // Remove any existing widgets associated with the currently selected node,
               // however preserve the DOM so that it can be used as a reference for adding
               // the replacement widget (it will be removed afterwards)...
               array.forEach(this.previewTarget.getSelectedNodes(), function(node, i) {
                  var widget = registry.byNode(node);
                  if (widget)
                  {
                     widget.destroyRecursive(true);
                  }
               }, this);
               
               try
               {
                  // Create the updated object...
                  this.previewTarget.insertNodes(false, [config], true, payload.node);
               }
               catch(e)
               {
                  this.alfLog("log", "Error", e);
               }
               finally
               {
                  this.alfLog("log", "Finally");
               }
               
               // Remove the previous nodes...
               this.previewTarget.deleteSelectedNodes();

               // Emit the event to alert wrapping widgets to changes...
               this.refreshChildren();
               
               // Publish the details of the latest fields...
               this.publishAvailableFields();
            }
         }
      },
      
      /**
       * 
       * @instance
       * @param {string} parentId The ID of the parent to remove the child from
       * @param {string} childIdToRemove The ID of the child to remove
       */
      removeReferencesFromParent: function alfresco_creation_DropZone__removeReferencesFromParent(parentId, childIdToRemove) {
         if (parentId != null)
         {
            // The current item already has a parent - this means that we're doing a move...
            // Therefore we need to remove this as a child of the old parent...
            var oldParentConfig = this.alfGetData(parentId);
            if (oldParentConfig != null)
            {
               // Filter out the current child...
               // TODO: This should ONLY be done on drop - not drag !!
               oldParentConfig.children = array.filter(oldParentConfig.children, function(childId, index) {
                  return childId != childIdToRemove;
               }, this);
            }
            else
            {
               this.alfLog("warn", "Expected to find parentId in the data model", parentId, this);
            }
         }
      },

      /**
       * This handles the creation of the widget in the preview panel.
       * 
       * @instance
       */
      creator: function alfresco_creation_DropZone__creator(item, hint) {
         this.alfLog("log", "Creating", item, hint);
         
         var node = domConstruct.create("div");
         if (item.module != null && item.module !== "")
         {
            // Clone the supplied item... there are several potential possibilities for this
            // creator being called. Either an avatrar is required (should actually be handled
            // separately) a new field is being created or an existing field is being moved.
            // It's important that we create a fieldId if not defined (e.g. when creating a new
            // field) but preserve any existing values.
            var clonedItem = lang.clone(item); 
            var config = (clonedItem.defaultConfig != null) ? clonedItem.defaultConfig : {};
            if (config.fieldId === undefined)
            {
               config.fieldId = this.generateUuid();
            }
            
            // Preview the widget within the wrapper if requested or if no widgetsForDisplay
            // configuration has been provided...
            var widgets = null;
            var savedConfig = this.alfGetData(config.fieldId);
            if (savedConfig != null)
            {
               widgets = savedConfig.widgetsForDisplay;
            }
            else
            {
               // Initialise the widget config...
               // Create the initial widget config (this will be used if the widget is not changed from the defaults)...
               var itemNameKey = (clonedItem.itemNameKey != null) ? clonedItem.itemNameKey : "name",
                   itemConfigKey = (clonedItem.itemConfigKey != null) ? clonedItem.itemConfigKey : "config";
               clonedItem.widgetConfig = {};
               clonedItem.widgetConfig[itemNameKey] = clonedItem.module;
               clonedItem.widgetConfig[itemConfigKey] = {};
               for (var key in clonedItem.defaultConfig)
               {
                  var v = clonedItem.defaultConfig[key];
                  clonedItem.widgetConfig[itemConfigKey][key] = v;
               }

               // Initialise widgets for display...
               if (clonedItem.previewWidget === true || 
                   clonedItem.widgetsForDisplay == null ||
                   clonedItem.widgetsForDisplay.length === 0)
               {
                  widgets = [
                     {
                        name: clonedItem.module,
                        config: config
                     }
                  ];
               }
               else
               {
                  widgets = clonedItem.widgetsForDisplay;
               }
            }

            // Add in any additional configuration...
            if (this.widgetsForNestedConfig != null)
            {
               // Check to see if the item passed in has the "originalConfigWidgets" attribute set...
               // If it doesn't then this is a create triggered by dragging from the palette. If it has
               // the attribute set then this call has been triggered by an update...
               if (clonedItem.originalConfigWidgets === undefined)
               {
                  clonedItem.originalConfigWidgets = lang.clone(clonedItem.widgetsForConfig);
               }
               
               var clonedWidgetsForNestedConfig = lang.clone(this.widgetsForNestedConfig);
               if (savedConfig != null && savedConfig.updatedConfig != null)
               {
                  // Update the normal config values with the latest saved data...
                  array.forEach(clonedItem.originalConfigWidgets, function(widget, i) {
                     if (widget.config.name)
                     {
                        this.updateWidgetConfig(savedConfig.updatedConfig, widget, 0);
                        // var updatedValue = lang.getObject(widget.config.name, false, savedConfig.updatedConfig);
                        // if (updatedValue != null)
                        // {
                        //    widget.config.value = updatedValue;
                        // }
                     }
                  }, this);

                  // Update the additional config controls with the latest saved data...
                  array.forEach(clonedWidgetsForNestedConfig, lang.hitch(this, this.updateWidgetConfig, savedConfig.updatedConfig.additionalConfig));
                  // array.forEach(clonedWidgetsForNestedConfig, function(widget, i) {
                  //    if (widget.config.name)
                  //    {
                  //       var updatedValue = lang.getObject(widget.config.name, false, savedConfig.updatedConfig.additionalConfig);
                  //       if (updatedValue != null)
                  //       {
                  //          widget.config.value = updatedValue;
                  //       }
                  //    }
                  // }, this);
               }
               else
               {
                  // Make sure that each of the additional widgets is set with an up-to-date value...
                  clonedItem.widgetsForConfig = clonedItem.originalConfigWidgets.concat(clonedWidgetsForNestedConfig);
                  array.forEach(clonedItem.widgetsForConfig, lang.hitch(this, this.updateWidgetConfig, clonedItem));
                  // array.forEach(clonedItem.widgetsForConfig, function(widget, i) {
                  //    if (widget && widget.config && widget.config.name)
                  //    {
                  //       var updatedValue = lang.getObject(widget.config.name, false, clonedItem);
                  //       if (updatedValue != null)
                  //       {
                  //          widget.config.value = updatedValue;
                  //       }
                  //    }
                  // }, this);
               }
            }

            // Update the pubSubScope so that they can request available fields on the correct pubSubScope...
            array.forEach(clonedItem.widgetsForConfig, function(widget, index) {
               lang.setObject("config.pubSubScope", this.childPubSubScope, widget);
            }, this);

            // Update the configuration to set the ID of the parent...
            // The ID is either that of the parent DropZoneWrapper or the actual ID if there is no DropZoneWrapper
            // There won't be a DropZoneWrapper if this is the root DropZone (e.g. one created by a DropZoneFormControl)...
            var myUuid = this.getMyUuid();

            // Remove any references to the current widget from it's previous parent...
            this.removeReferencesFromParent(clonedItem.parentId, config.fieldId);

            // // Set a reference to the parent (if this is a move event then we're just updating the parent)...
            clonedItem.parentId = myUuid;
            // TODO: Re-subscribe to events such as available fields?
            
            // Get MY configuration from the data model...
            var myConfig = this.alfGetData(myUuid);
            if (myConfig == null)
            {
               // It's possible that configuration won't exist for root DropZones...
               this.alfLog("warn", "No entry in the data model for DropZone!", this);
            }
            else
            {
               // Make sure that there is configuration set for dropped child nodes...
               if (myConfig.children == null)
               {
                  myConfig.children = [];
               }
               myConfig.children.push(config.fieldId);
            }

            // Store the field id against the updated config...
            // This needs to be saved so it can be retrieved when inserting nodes again...
            this.alfSetData(config.fieldId, clonedItem);
            
            var widgetWrapper = new DropZoneWrapper({
               fieldId: config.fieldId,
               parentPubSubScope: this.childPubSubScope,
               pubSubScope: this.pubSubScope,
               widgets: widgets,
               moduleName: clonedItem.name
            }, node);
         }
         else
         {
            this.alfLog("log", "The requested item to create was missing a 'module' attribute", item, this);
         }
         
         // Add a class to indicate that items are present (removes the dashed border)...
         domClass.add(this.previewNode, "containsItems");
         return {node: widgetWrapper.domNode, data: clonedItem, type: ["widget"]};
      },
      
      /**
       *
       *
       * @instance
       * @param {object} configToUpdateFrom The configuration to update the widget config from
       * @param {object} widget The widget to update
       * @param {number} i The index of the widget
       */
      updateWidgetConfig: function alfresco_creation_DropZone__updateValues(configToUpdateFrom, widget, i) {
         if (widget.config.name)
         {
            var updatedValue = lang.getObject(widget.config.name, false, configToUpdateFrom);
            if (updatedValue != null)
            {
               widget.config.value = updatedValue;
            }
         }
         else if (widget.config.widgets)
         {
            array.forEach(widget.config.widgets, lang.hitch(this, this.updateWidgetConfig, configToUpdateFrom));
         }
      },

      /**
       * 
       *
       * @instance
       * @return {string} The UUID of the widget associated with this DropZone.
       */
      getMyUuid: function alfresco_creation_DropZone__getMyUuid() {
         // Update the configuration to set the ID of the parent...
         // The ID is either that of the parent DropZoneWrapper or the actual ID if there is no DropZoneWrapper
         // There won't be a DropZoneWrapper if this is the root DropZone (e.g. one created by a DropZoneFormControl)...
         var myUuid = lang.getObject("_dropZoneWrapperId", false, this);
         if (myUuid == null)
         {
            myUuid = this.id;
         }
         return myUuid;
      },

      /**
       * Although this function's name suggests it handles an nodes selection, there is no guarantee
       * that a node has actually been selected. This is simply attached to the mouseDown event.
       * 
       * @instance
       * @param {object} e The selection event
       */
      onWidgetSelected: function alfresco_creation_DropZone__onWidgetSelected(e) {
         var selectedNodes = this.previewTarget.getSelectedNodes();
         if (selectedNodes.length > 0 && selectedNodes[0] != null)
         {
            var selectedItem = this.previewTarget.getItem(selectedNodes[0].id);
            this.alfLog("log", "Widget selected", selectedItem);
            var payload = {
               pubSubScope: this.childPubSubScope,
               selectedNode: selectedNodes[0],
               selectedItem: selectedItem.data
            };
            this.alfPublish("ALF_CONFIGURE_WIDGET", payload);
         }
      },
      
      /**
       * This function is called as an after aspect of the onDrop function of the DND target. It is used
       * to capture widgets being added to or removed from the DropZone.
       * 
       * @instance
       */
      refreshChildren: function alfresco_creation_DropZone__refreshChildren() {
         this.alfLog("log", "Widgets updated");
         
         var myUuid = this.getMyUuid();
         var myConfig = this.alfGetData(myUuid);

         // It's necessary to ensure that the configuration accurately reflects the order of the
         // widgets in the DropZone. To do this we need to build a map of the id of each dropped
         // item to it's index in the DropZone
         var sourceOrderMap = {};
         var nodes = this.previewTarget.getAllNodes();
         array.forEach(nodes, function(node, i) {
            var item = this.previewTarget.getItem(node.id);
            var id = lang.getObject("data.updatedConfig.defaultConfig.fieldId", false, item);
            if (id == null)
            {
               id = lang.getObject("data.defaultConfig.fieldId", false, item);
            }
            sourceOrderMap[id] = i;
         }, this);

         // We now need to build the actual data represented by the items in the DropZone...
         // We're going to get the data from the data store and then ensure that it's order
         // matches the current order of the nodes representing each data item...
         var items = [];
         var updatedChildren = [];
         array.forEach(myConfig.children, function (item, index) {
            var itemData = this.alfGetData(item);
            var id = lang.getObject("updatedConfig.defaultConfig.fieldId", false, itemData);
            if (id == null)
            {
               id = lang.getObject("defaultConfig.fieldId", false, itemData);
            }
            var targetIndex = sourceOrderMap[id];
            items[targetIndex] = itemData;
            updatedChildren[targetIndex] = item;
         }, this);
         myConfig.children = updatedChildren;

         // Add the display widgets...
         myConfig.widgetsForDisplay = [
            {
               name: "alfresco/creation/DropZone",
               config: {
                  attributeKey: (this.attributeKey != null) ? this.attributeKey : "widgets",
                  horizontal: this.horizontal,
                  widgetsForNestedConfig: this.widgetsForNestedConfig,
                  initialItems: items
               }
            }
         ];

         // Emit an event that is intended to bubble up to an outer DropZoneControl...
         on.emit(this.domNode, "onWidgetUpdate", {
            bubbles: true,
            cancelable: true
         });
      }
   });
});