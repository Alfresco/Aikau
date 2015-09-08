/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * <p>Extends the standard [picker form control]{@link module:alfresco/forms/controls/Picker} to allow the user to select containers
 * (essentially folders) from the Alfresco repository.</p>
 *
 * <p>TODO: Update so that this is configurable for only selecting containers the user has write permission on</p>
 *
 * @module alfresco/forms/controls/ContainerPicker
 * @extends module:alfresco/forms/controls/Picker
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
         "alfresco/forms/controls/Picker",
         "alfresco/pickers/ContainerPicker"],
        function(declare, Picker) {

   return declare([Picker], {

      /**
       * Overrides the default itemKey to be "nodeRef" as this is likely to be the most important attribute
       * when selecting a container.
       *
       * @instance
       * @type {string}
       * @default
       */
      itemKey: "nodeRef",

      /**
       * Overrides the default picker module.
       *
       * @instance
       * @type {string}
       * @default
       */
      pickerWidget: "alfresco/pickers/ContainerPicker",
      
      /**
       * This should be overridden to define the widget model for rendering the picker that appears within the
       * dialog.
       *
       * @instance
       * @type {object}
       */
      configForPickedItems: {
         singleItemMode: true,
         widgets: [
            {
               name: "alfresco/lists/views/layouts/Row",
               config: {
                  widgets: [
                     {
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           width: "20px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/FileType",
                                 config: {
                                    size: "small",
                                    renderAsLink: false,
                                    currentItem: {
                                       node: {
                                          type: "cm:folder",
                                          nodeRef: "dummy://data/value"
                                       }
                                    }
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/renderers/Property",
                                 config: {
                                    propertyToRender: "name",
                                    renderAsLink: false
                                 }
                              }
                           ]
                        }
                     },
                     {
                        name: "alfresco/lists/views/layouts/Cell",
                        config: {
                           width: "20px",
                           widgets: [
                              {
                                 name: "alfresco/renderers/PublishAction",
                                 config: {
                                    iconClass: "delete-16",
                                    publishTopic: "ALF_ITEM_REMOVED",
                                    publishPayloadType: "CURRENT_ITEM"
                                 }
                              }
                           ]
                        }
                     }
                  ]
               }
            }
         ]
      }
   });
});