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
 * <p>This extends the standard [document list]{@link module:alfresco/documentlibrary/AlfDocumentList} to 
 * define a document list specifically for selecting properties. It was
 * written to be used as part of a [picker]{@link module:alfresco/pickers/Picker} and specifically one that
 * is used as a form control.</p>
 * 
 * @module alfresco/pickers/PropertyPicker
 * @extends module:alfresco/documentlibrary/AlfDocumentList
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/AlfDocumentList",
        "dojo/_base/lang"], 
        function(declare, AlfDocumentList, lang) {
   
   return declare([AlfDocumentList], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/PropertyPicker.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/PropertyPicker.properties"}],

      /**
       * Indicates whether the location should be driven by changes to the browser URL hash
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useHash: false,

      /**
       * Override the [inherited value]{@link module:alfresco/documentlibrary/AlfDocumentList#waitForPageWidgets} because
       * this widget is typically created after the page has loaded.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      waitForPageWidgets: false,

      /**
       * This attribute has been added to support the scenario where properties can be selected from either a global
       * list or from a sub-picker that narrows them down to either aspect or type. It is required because a sub-picker
       * needs to publish to the parent but the primary picker doesn't. This is used by the [PropertyPicker]{@link module:alfresco/forms/controls/PropertyPicker}
       * form control when defining the picker configuration.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      publishPickedItemsToParent: false,

      /**
       * Overrides inherited function to do a no-op. The pick action should be handled by a 
       * [PublishAction widget]{@link module:alfresco/renderers/PublishAction}.
       *
       * @instance
       * @param {object} payload
       */
      onFolderClick: function alfresco_pickers_PropertyPicker__onFolderClick(payload) {
         // No action.
      },

      /**
       * Overrides inherited function to do a no-op. The pick action should be handled by a 
       * [PublishAction widget]{@link module:alfresco/renderers/PublishAction}.
       *
       * @instance
       * @param {object} payload
       */
      onDocumentClick: function alfresco_pickers_PropertyPicker__onFolderClick(payload) {
         // No action.
      },

      /**
       * This is the message to display when no view is selected. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */
      noViewSelectedMessage: "propPicker.no.view.message",

      /**
       * This is the message to display when no view is selected. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      noDataMessage: "propPicker.no.data.message",

      /**
       * This is the message to display when no data is available. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      fetchingDataMessage: "propPicker.loading.data.message",

      /**
       * This is the message to display whilst data is being loaded. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      renderingViewMessage: "propPicker.rendering.data.message",

      /**
       * This is the message to display when an error occurs rendering data. Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      fetchingMoreDataMessage: "propPicker.loading.data.message",

      /**
       * This is the message to display when data cannot be loaded Message keys will be localized
       * where possible.
       *
       * @instance
       * @type {string}
       * @default
       */

      dataFailureMessage: "propPicker.data.failure.message",

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#postCreate} to update the publishToParent
       * attribute of the [PublishAction widget]{@link module:alfresco/renderers/PublishAction} defined in the 
       * [widgets]{@link module:alfresco/pickers/PropertyPicker#widgets} attribute to use the configured
       * [publishPickedItemsToParent]{@link module:alfresco/pickers/PropertyPicker#publishPickedItemsToParent} value.
       *
       * @instance
       */
      postCreate: function alfresco_lists_AlfList__postCreate() {
         if (this.widgets)
         {
            var widgets = lang.clone(this.widgets);
            // TODO: This really isn't ideal coding and somewhat breaks the ideals that Aikau strives for, however it will
            // work for now and is something we should iterate over in the future to improve.
            if(this.publishPickedItemsToParent === true)
            {
               lang.setObject("0.config.widgets.0.config.widgets.1.config.widgets.0.config.publishToParent", this.publishPickedItemsToParent, widgets);
            }
            this.processWidgets(widgets);
         }
      },

      /**
       * The default widgets for the picker. This can be overridden at instantiation based on what is required to be 
       * displayed in the picker.
       *
       * @instance
       * @type {object}
       */
      widgets: [
         {
            name: "alfresco/documentlibrary/views/AlfDocumentListView",
            config: {
               noItemsMessage: "propPicker.no.data.message",
               widgets: [
                  {
                     name: "alfresco/documentlibrary/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "name"
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "title",
                                          renderedValuePrefix: "(",
                                          renderedValueSuffix: ")",
                                          renderSize: "small"
                                       }
                                    }
                                 ]
                              }
                           },
                           {
                              name: "alfresco/documentlibrary/views/layouts/Cell",
                              config: {
                                 width: "20px",
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: false,
                                          publishToParent: false
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
         }
      ]
   });
});