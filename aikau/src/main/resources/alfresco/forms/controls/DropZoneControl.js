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
 * @module alfresco/forms/controls/DropZoneControl
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/creation/DropZone",
        "dojo/json",
        "dojo/on",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(BaseFormControl, declare, DropZone, dojoJSON, on, lang, array) {
   
   return declare([BaseFormControl], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/DropZoneControl.css"}]
       */
      cssRequirements: [{cssFile:"./css/DropZoneControl.css"}],
      
      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DropZoneControl__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.pubSubScope,
            acceptTypes: this.acceptTypes
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_DropZoneControl__createFormControl(config, domNode) {
         // Set the value in the data model (this is so that it can be updated with dropped child references)
         // ...see DropZone.creator() function...
         this.alfSetData(config.id, (config.value != null) ? config.value : {});
         return new DropZone(config);
      },
      
      /**
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_DropZoneControl__setupChangeEvents() {
         // Initialise the current value...
         this.onUpdateValue();
         on(this.domNode, "onWidgetUpdate", lang.hitch(this, "onUpdateValue"));
      },
      
      /**
       * 
       * @instance
       * @returns {string} The widgets defined in the preview pane
       */
      onUpdateValue: function alfresco_forms_controls_DropZoneControl__onUpdateValue() {
         this.alfLog("log", "Updating DropZoneControl value...");
         var value = {
            editorConfig: "",
            widgetsConfig: ""
         };
         var childData = [];
         var config = this.alfGetData(this.wrappedWidget.id);
         if (config != null)
         {
            if (config.widgetsForDisplay != null)
            {
               var items = lang.getObject("widgetsForDisplay.0.config.initialItems", false, config);
               if (items != null)
               {
                  value.editorConfig = items;
               }
               // get config.initialItems
               // value.editorConfig = config.widgetsForDisplay;
            }
            if (config.children != null)
            {
               array.forEach(config.children, lang.hitch(this, "processChildren", childData));
               value.widgetsConfig = childData;
            }
         }
         this.value = value;
         this.validate();
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue} to
       * call the getValue function of the wrapped [DropZone]{@link module:alfresc/creation/DropZone} control
       *
       * @instance
       * @returns {object} Returns the current value
       */
      getValue: function alfresco_forms_controls_DropZoneControl__getValue() {
         return this.value;
      },

      /**
       * Retrieves the configuration for the provide child UUID and adds the processed configuration 
       * to the supplied array.
       *
       * @instance
       * @param {array} childData An array to add the processed child configuration to
       * @param {string} child The UUID of the child to retrieve the configuration for
       * @param {number} index The index of the child in the parent array
       */
      processChildren: function alfresco_forms_controls_DropZoneControl__processChildren(childData, child, index) {
         var childConfig = this.alfGetData(child);
         var subChildData = [];
         array.forEach(childConfig.children, lang.hitch(this, "processChildren", subChildData));
         if (childConfig.widgetConfig != null)
         {
            var itemConfigKey = (childConfig.itemConfigKey != null) ? childConfig.itemConfigKey : "config";
            // Check to see how the configuration should be mixed in...
            // In some circumstances the dropped items should be mixed directly into the configuration,
            // for example when dropping a publication into a button or menu item we want the publishTopic
            // and publishPayload attributes to be direct attributes of config and not config.widgets.
            if (childConfig.mixDroppedItemsIntoConfig === true)
            {
               array.forEach(subChildData, function(subChild) {
                  lang.mixin(childConfig.widgetConfig[itemConfigKey], subChild);
               }, this);
            }
            else
            {
               // Check the target attribute for dropped children. By default it will be set to widgets
               // since this is the most common attribute, however there may be other circumstances
               // where alternatives are required...
               var subChildDataAttribute = lang.getObject("widgetsForDisplay.0.config.attributeKey", false, childConfig);
               if (subChildDataAttribute != null && lang.trim(subChildDataAttribute) !== "")
               {
                  // No action required. Retrieved key from drop zone
               }
               else
               {
                  // Get item key from config
                  subChildDataAttribute = childConfig.droppedItemsConfigAttribute;
                  if (subChildDataAttribute == null || lang.trim(subChildDataAttribute) === "")
                  {
                     subChildDataAttribute = "widgets";
                  }
               }
               childConfig.widgetConfig[itemConfigKey][subChildDataAttribute] = subChildData;
            }
            childData.push(childConfig.widgetConfig);
         }
      }
   });
});