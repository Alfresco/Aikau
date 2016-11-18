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
 * <p>This widget is intended to ultimately to replace the 
 * [DocumentPicker]{@link module:alfresco/forms/controls/DocumentPicker} but at the moment it is still
 * in development and not ready for production use. However it is currently included in Aikau releases 
 * for feedback and community collaboration. See https://issues.alfresco.com/jira/browse/AKU-1033 for the
 * complete of tasks remaining to complete the first cut of the widget. It is however currently functional
 * in that it can be used to select files.</p>
 *
 * <p>A number of services (or customized equivalents) need to be included on a page for this picker to be 
 * functional, these are:
 * <ul><li>alfresco/services/SearchService</li>
 * <li>alfresco/services/SiteService</li>
 * <li>alfresco/services/DialogService</li>
 * <li>alfresco/services/DocumentService</li></ul></p>
 * 
 * @module alfresco/forms/controls/FilePicker
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @since 1.0.81
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/topics",
        "dijit/registry",
        "dojo/_base/array",
        "dojo/_base/lang"],
        function(declare, BaseFormControl, CoreWidgetProcessing, ObjectTypeUtils, topics, registry, array, lang) {

   return declare([BaseFormControl, CoreWidgetProcessing], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/FilePicker.properties"}],

      /**
       * An array of sites available the current user. This will be generated the first time that 
       * [onRecentSitesOptionsRequest]{@link module:alfresco/forms/controls/FilePicker#onAllSitesOptionsRequest}
       * is called.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      allSites: null,

      /**
       * This is the property that is used to uniquely identify each 
       * [item]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} that is picked. Ultimately this
       * will be the data that is used as the value of the form control.
       * 
       * @instance
       * @type {string}
       * @default
       */
      itemKeyProperty: "nodeRef",

      /**
       * Indicates whether or not more than one can be picked.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      multipleItemSelection: false,

      /**
       * An array of the favourite sites. This will be generated the first time that 
       * [onFavouriteSitesOptionsRequest]{@link module:alfresco/forms/controls/FilePicker#onFavouriteSitesOptionsRequest}
       * is called.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      favouriteSites: null,

      /**
       * An array of the recent sites. This will be generated the first time that 
       * [onRecentSitesOptionsRequest]{@link module:alfresco/forms/controls/FilePicker#onRecentSitesOptionsRequest}
       * is called.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      recentSites: null,

      /**
       * The root node at which to start repository browsing.
       * 
       * @instance
       * @type {string}
       * @default
       */
      repositoryRootNode: "alfresco://company/home",

      /**
       * Used to track the files that have been selected.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      selectedFiles: null,

      /**
       * Indicates whether or not the "All Sites" tab in the picker dialog should be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showAllSites: true,

      /**
       * Indicates whether or not the "Favourite Sites" tab in the picker dialog should be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showFavouriteSites: true,

      /**
       * Indicates whether or not the "Recent Sites" tab in the picker dialog should be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showRecentSites: true,

      /**
       * Indicates whether or not the "Search" tab in the picker dialog should be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showSearch: true,

      /**
       * Indicates whether or not the "Repository" tab in the picker dialog should be displayed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showRepository: true,

      /**
       * 
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_FilePicker__createFormControl() {
         
         this.setupPubSubData();

         // We need to process the widgets for the search view to ensure the generated topics are available...
         // We need to clone the model to prevent the first topic generated being reused between all picker instances...
         var widgetsForSearchView = lang.clone(this.widgetsForSearchView);
         this.processObject(["processInstanceTokens"], widgetsForSearchView);
         this.widgetsForSearchView = widgetsForSearchView;

         var widgetsForBrowseView = lang.clone(this.widgetsForBrowseView);
         this.processObject(["processInstanceTokens"], widgetsForBrowseView);
         this.widgetsForBrowseView = widgetsForBrowseView;

         var widgets = lang.clone(this.widgetsForDialog);
         this.processObject(["processInstanceTokens"], widgets);

         this._dialogId = this.id + "_FILE_PICKER_DIALOG";

         var button = this.createWidget({
            name: "alfresco/layout/VerticalWidgets",
            config: {
               widgets: [
                  {
                     id: this.id + "_SELECTED_FILES",
                     name: "alfresco/layout/DynamicWidgets",
                     config: {
                        subscriptionTopic: this.showSelectedFilesTopic,
                        subscribeGlobal: true
                     }
                  },
                  {
                     id: this.id + "_SHOW_FILE_PICKER_DIALOG",
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: "filepicker.dialog.title",
                        publishTopic: topics.CREATE_DIALOG,
                        publishPayload: {
                           dialogId: this._dialogId,
                           dialogTitle: "filepicker.dialog.title", 
                           widgetsContent: widgets,
                           contentWidth: "800px",
                           contentHeight: "700px",
                           handleOverflow : false,
                           widgetsButtons: [
                              {
                                 id: this.id + "_CONFIRMATION_BUTTON",
                                 name: "alfresco/buttons/AlfButton",
                                 config: {
                                    label: "filepicker.dialog.confirmation.label",
                                    publishTopic: this.confirmFileSelectionTopic,
                                    additionalCssClasses: "call-to-action"
                                 }
                              },
                              {
                                 id: this.id + "_CANCELLATION_BUTTON",
                                 name: "alfresco/buttons/AlfButton",
                                 config: {
                                    label: "filepicker.dialog.cancellation.label",
                                    publishTopic: this.cancelFileSelectionTopic
                                 }
                              }
                           ],
                           publishOnShow: [
                              {
                                 publishTopic: this.addPreviouslySelectedFilesTopic,
                                 publishGlobal: true
                              }
                           ]
                        },
                        publishGlobal: true
                     }
                  }
               ]
            }
         });
         return button;
      },

      /**
       * This function generates the scopes, topics and subscriptions required to prevent this 
       * picker instance (or any of its nested widgets) from inadvertently communicating with
       * other instances or widgets.
       * 
       * @instance
       */
      setupPubSubData: function alfresco_forms_controls_FilePicker__setupPubSubData() {
         // This topic is used for publishing to the DynamicWidgets that will show the selected
         // files in the main form control (i.e. NOT in the dialog)...
         this.showSelectedFilesTopic = "SSF_" + this.generateUuid();

         // Scoping of tabs is required...
         this.searchTabScope = "STS_" + this.generateUuid();
         this.recentSitesTabScope = "RSTB_" + this.generateUuid();
         this.favouriteSitesTabScope = "FSTS_" + this.generateUuid();
         this.allSitesTabScope = "ASTS_" + this.generateUuid();
         this.repositoryTabScope = "RTS_" + this.generateUuid();

         // Generate some unique topics for this form control to avoid any cross-contamination
         // of other instances of the widget within the same scope...
         this.recentSitesRequestTopic = "RSRT_" + this.generateUuid();
         this.favouriteSitesRequestTopic = "FSRT_" + this.generateUuid();
         this.showRecentSiteBrowserTopic = "SRSBT_" + this.generateUuid();
         this.showFavouriteSiteBrowserTopic = "SFSBT_" + this.generateUuid();
         this.allSitesRequestTopic = "ASRT_" + this.generateUuid();
         this.showSiteBrowserTopic = "SASBT_" + this.generateUuid();

         // Generate topics for selecting and removing items...
         this.addFileTopic = "AFT_" + this.generateUuid();
         this.alfSubscribe(this.addFileTopic, lang.hitch(this, this.onFileSelected), true);
         this.removeFileTopic = "RFT_" + this.generateUuid();
         this.alfSubscribe(this.removeFileTopic, lang.hitch(this, this.onFileRemoved), true);

         this.updateSelectedFilesTopic = "USFT_" + this.generateUuid();

         // Generate and subscribe to a topic for populating the dialog with the previously selected
         // files when it is first displayed...
         this.addPreviouslySelectedFilesTopic = "APSFT_" + this.generateUuid();
         this.alfSubscribe(this.addPreviouslySelectedFilesTopic, lang.hitch(this, this.addPreviouslySelectedFiles), true);

         // Generate a topic for confirming the file selection...
         this.confirmFileSelectionTopic = "ConFST_" + this.generateUuid();
         this.alfSubscribe(this.confirmFileSelectionTopic, lang.hitch(this, this.onFileSelectionConfirmed), true);
         this.cancelFileSelectionTopic = "CanFST_" + this.generateUuid();

         // Set up the subscriptions to handle publication of the generated topics...
         this.alfSubscribe(this.recentSitesRequestTopic, lang.hitch(this, this.onRecentSitesOptionsRequest), true);
         this.alfSubscribe(this.favouriteSitesRequestTopic, lang.hitch(this, this.onFavouriteSitesOptionsRequest), true);
         this.alfSubscribe(this.allSitesRequestTopic, lang.hitch(this, this.onAllSitesOptionsRequest), true);
         
         // Set up subscription to valueChangeOf generated Select control fieldIds for recent and favourite sites
         this.alfSubscribe(this.recentSitesTabScope + "_valueChangeOf_RECENT_SITE_SELECTION", lang.hitch(this, this.onShowSiteBrowser, this.showRecentSiteBrowserTopic), true);
         this.alfSubscribe(this.favouriteSitesTabScope + "_valueChangeOf_FAVOURITE_SITE_SELECTION", lang.hitch(this, this.onShowSiteBrowser, this.showFavouriteSiteBrowserTopic), true);
         this.alfSubscribe(this.allSitesTabScope + "_valueChangeOf_SITE_SELECTION", lang.hitch(this, this.onShowSiteBrowser, this.showSiteBrowserTopic), true);
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue}
       * to return the current value that has been generated.
       *
       * @instance
       * @extendable
       * @returns {object} The current value of the field.
       */
      getValue: function alfresco_forms_controls_FilePicker__getValue() {
         var value = this.value;
         if (value && this.valueDelimiter && ObjectTypeUtils.isArray(value))
         {
            value = value.join(this.valueDelimiter);
         }
         else if (!value && !this.valueDelimiter)
         {
            // When we don't have a value and we're not using the valueDelimiter we want to always
            // ensure that the default value is an empty array and NOT an empty string. This needs
            // to be done for the purposes of ensuring that form rules configured for FilePicker
            // widgets behave as expected as they will be written for arrays and not strings!
            value = [];
         }
         return value;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue}
       * to make sure that all Node details are retrieved for the values being set. This allows only a 
       * NodeRef to be set as a file value but for the metadata to be retrieved and displayed.
       * 
       * @instance
       * @param {object} value The value to set
       */
      setValue: function alfresco_forms_controls_FilePicker__setValue(value) {
         if (ObjectTypeUtils.isString(value))
         {
            if (this.valueDelimiter)
            {
                value = value.split(this.valueDelimiter);
            }
            else
            {
                value = [value];
            }
            
            value = array.map(value, function(valueItem) {
                var v = {};
                v[this.itemKeyProperty] = valueItem;
                return v;
            }, this);
         }

         if (value && ObjectTypeUtils.isArray(value))
         {
            if (!this.multipleItemSelection && value.length > 1)
            {
                this.alfLog("warn", "More than one element in value array set for single-selection FilePicker - only using first element", value, this);
                value = [value[0]];
            }
             
            // Because it might be necessary to retrieve the metadata for the files we need to keep
            // track of the all the values that will be handled. We can't set this.value and
            // this.selectedFiles until all metadata has been asynchronously retrieved (otherwise the
            // form value will be set with calls to getValue because the data has been retrieved). 
            // Tracking the metadata retrieval and using tmp values ensures the form value is correct
            // on load...
            var valueCount = value.length;
            var tmpValue, tmpSelectedFiles = [];
            
            tmpValue = this.multipleItemSelection ? [] : null;

            // This is possibly not the optimal way of achiving this, but it is expected that only 
            // a small number of files will be pre-selected at a time (and there is no other REST 
            // API available for retrieving the metadata in bulk). Ideally we would make a request
            // for the metadata for the supplied list of NodeRefs.
            array.forEach(value, function(file) {
               if (lang.getObject(this.itemKeyProperty, false, file))
               {
                  // Set up a one-time subscription for retrieving the metadata for the node, this
                  // will be done when no "displayName" attribute is provided (expected when the
                  // file is normalised) but a "nodeRef" is available. 
                  var responseTopic = this.generateUuid();
                  var handle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, function(payload) {
                     this.alfUnsubscribe(handle);

                     // Get the node data and normalise it (so that it will work with the view),
                     // then update both the value and the selected files array and publish the request
                     // to update selected files... the result should be that the value is rendered correctly...
                     var updatedFile = payload.response.item;
                     this.normaliseFile(updatedFile);
                     
                     var itemKey = lang.getObject(this.itemKeyProperty, false, updatedFile);
                     if (this.multipleItemSelection)
                     {
                         tmpValue.push(itemKey);
                     }
                     else
                     {
                         tmpValue = itemKey;
                     }
                     tmpSelectedFiles.push(updatedFile);

                     valueCount--;

                     if (valueCount === 0)
                     {
                        this.selectedFiles = tmpSelectedFiles;
                        this.value = tmpValue;
                        this.updateSelectedFiles(this.showSelectedFilesTopic);
                        this.onValueChangeEvent(this.name, null, tmpValue);
                     }
                  }), true);

                  this.alfServicePublish(topics.GET_DOCUMENT, {
                     alfResponseTopic: responseTopic,
                     nodeRef: lang.getObject(this.itemKeyProperty, false, file) 
                  });
               }
            }, this);
         }
         else
         {
            this.alfLog("warn", "Non-array value tried to be set for FilePicker", value, this);
         }
      },
      
      /**
       * 
       * @instance
       * @param {string}   requestTopic  The topic to publish on to request the sites
       * @param {object[]} options       The array to populate with the site options
       * @param {string}   responseTopic The topic to publish the retrieved sites on.
       */
      getSiteOptions: function alfresco_forms_controls_FilePicker__getSiteOptions(requestTopic, options, responseTopic) {
         // Setup a one-time subscription for requesting the recent sites for the user...
         var sitesTopic = this.generateUuid();
         var handle = this.alfSubscribe(sitesTopic + "_SUCCESS", lang.hitch(this, function(pl) {
            this.alfUnsubscribe(handle);
            array.forEach(pl.response, lang.hitch(this, function(site) {
               options.push({
                  label: site.title,
                  value: site.shortName
               });
            }), this);

            this.alfPublish(responseTopic, {
               options: options
            }, true);
         }), true);

         this.alfServicePublish(requestTopic, {
            alfResponseTopic: sitesTopic
         });
      },

      /**
       * This function is called when the dialog is opened. It calls 
       * [updateSelectedFiles]{@link module:alfresco/forms/controls/FilePicker#updateSelectedFiles}
       * to ensure that the previously selected files are shown in the dialog.
       * 
       * @instance
       */
      addPreviouslySelectedFiles: function alfresco_forms_controls_FilePicker__addPreviouslySelectedFiles() {
         this.updateSelectedFiles(this.updateSelectedFilesTopic);
      },

      /**
       * Because files can be sourced from both the Search and Document Library APIs it is necessary 
       * to normalise the file data for display purposes to ensure that all the expected properties
       * are available to be rendered by the view.
       *
       * @instance
       * @param {object} file The file to be normalised.
       */
      normaliseFile: function alfresco_forms_controls_FilePicker__normaliseFile(file) {
         !!!file.displayName && (file.displayName = lang.getObject("node.properties.cm:name", false, file) || "");
         !!!file.title && (file.title = lang.getObject("node.properties.cm:title", false, file) || "");
         !!!file.description && (file.description = lang.getObject("node.properties.cm:description", false, file) || "");
         !!!file.nodeRef && (file.nodeRef = lang.getObject("node.nodeRef", false, file) || "");
         !!!file.modifiedOn && (file.modifiedOn = lang.getObject("node.properties.cm:modified.iso8601", false, file) || "");
         !!!file.modifiedBy && (file.modifiedBy = lang.getObject("node.properties.cm:modifier.displayName", false, file) || "");
         !!!file.site && (file.site = lang.getObject("location.site", false, file) || {});
         !!!file.site.shortName && (file.site.shortName = lang.getObject("location.site.name", false, file) || "");
         !!!file.path && (file.path = lang.getObject("location.path", false, file) || "");
      },

      /**
       * Handles selection of files anywhere within the picker.
       * 
       * @instance
       * @param  {object} payload The details of the file that has been selected.
       */
      onFileSelected: function alfresco_forms_controls_FilePicker__onFileSelected(payload) {
         this.normaliseFile(payload);

         // Check to see whether or not the file has already been selected...
         var fileAlreadySelected = false;
         if (this.selectedFiles)
         {
            var newKey = lang.getObject(this.itemKeyProperty, false, payload);
            fileAlreadySelected = array.some(this.selectedFiles, function(file) {
               var existingKey = lang.getObject(this.itemKeyProperty, false, file);
               return newKey === existingKey;
            }, this);
         }

         if (fileAlreadySelected)
         {
            // No action required. The file has previously been selected.
         }
         else if (this.multipleItemSelection)
         {
            // Initialise the selected files array if it is still null and then add the latest
            // file that has been selected...
            !!!this.selectedFiles && (this.selectedFiles = []);
            this.selectedFiles.push(payload);
         }
         else
         {
            this.selectedFiles = [payload];
         }

         this.updateSelectedFiles(this.updateSelectedFilesTopic);
      },

      /**
       * Handles requests to remove a previously picked item. Both from within the dialog 
       * and the main control itself.
       * 
       * @instance
       * @param {object} payload The file that has been removed
       */
      onFileRemoved: function alfresco_forms_controls_FilePicker__onFileRemoved(payload) {
         var keyToRemove = lang.getObject(this.itemKeyProperty, false, payload);
         this.selectedFiles = array.filter(this.selectedFiles, function(file) {
            var existingKey = lang.getObject(this.itemKeyProperty, false, file);
            return keyToRemove !== existingKey;
         }, this);
         
         // We need to toggle between removing items in the dialog and in the main control..
         // This can be determined by whether or not the picker dialog is displayed...
         var dialog = registry.byId(this._dialogId);
         if (dialog && dialog._isShown())
         {
            this.updateSelectedFiles(this.updateSelectedFilesTopic);
         }
         else
         {
            this.onFileSelectionConfirmed();
         }
      },

      /**
       * This function is called to update the display of selected items. The supplied topic is published
       * in order for a [DynamicWidgets]{@link module:alfresco/layout/DynamicWidgets} widget to update 
       * its display with a view of the currently selected files. 
       * 
       * @instance
       * @param {string} topic The topic to publish the widgets model on.
       */
      updateSelectedFiles: function alfresco_forms_controls_FilePicker__updateSelectedFiles(topic) {
         var widgetsForSelectedFilesView = lang.clone(this.widgetsForSelectedFilesView);
         this.processObject(["processInstanceTokens"], widgetsForSelectedFilesView);
         this.alfPublish(topic, {
            widgets: widgetsForSelectedFilesView
         }, true);
      },

      /**
       * This function is called when the user confirms that they have completed file selection.
       *
       * @instance
       */
      onFileSelectionConfirmed: function alfresco_forms_controls_FilePicker__onFileSelectionConfirmed() {
         var updatedValue = this.multipleItemSelection ? [] : null;
         
         if (this.selectedFiles)
         {
            array.forEach(this.selectedFiles, function(file) {
               var itemKey = lang.getObject(this.itemKeyProperty, false, file);
               if (itemKey)
               {
                  if (this.multipleItemSelection)
                  {
                      updatedValue.push(itemKey);
                  }
                  else
                  {
                      updatedValue = itemKey;
                  }
               }
            }, this);
         }

         this.updateSelectedFiles(this.showSelectedFilesTopic);
         var oldValue = this.value;
         this.value = updatedValue;
         this.onValueChangeEvent(this.name, oldValue, updatedValue);
      },

      /**
       * 
       * @instance
       * @param  {object} payload The request for sites. This contains the responseTopic to publish the options on.
       */
      onAllSitesOptionsRequest: function alfresco_forms_controls_FilePicker__onAllSitesOptionsRequest(payload) {
         var optionsTopic = payload.responseTopic;
         // NOTE: Commented code to ensure a recent site can be viewed without changing option...
         // if (!this.recentSites)
         // {
            this.allSites = [];
            this.getSiteOptions(topics.GET_SITES, this.allSites, optionsTopic);
         // }
         // else
         // {
         //    this.alfPublish(optionsTopic, {
         //       options: this.recentSites
         //    }, true);
         // }
      },

      /**
       * 
       * @instance
       * @param  {object} payload The request for recent sites. This contains the responseTopic to publish the options on.
       */
      onRecentSitesOptionsRequest: function alfresco_forms_controls_FilePicker__onRecentSitesOptionsRequest(payload) {
         var optionsTopic = payload.responseTopic;
         // NOTE: Commented code to ensure a recent site can be viewed without changing option...
         // if (!this.recentSites)
         // {
            this.recentSites = [];
            this.getSiteOptions(topics.GET_RECENT_SITES, this.recentSites, optionsTopic);
         // }
         // else
         // {
         //    this.alfPublish(optionsTopic, {
         //       options: this.recentSites
         //    }, true);
         // }
      },

      /**
       * 
       * @instance
       * @param  {object} payload The request for favourite sites. This contains the responseTopic to publish the options on.
       */
      onFavouriteSitesOptionsRequest: function alfresco_forms_controls_FilePicker__onFavouriteSitesOptionsRequest(payload) {
         var optionsTopic = payload.responseTopic;
         // NOTE: Commented code to ensure a favourite site can be viewed without changing option...
         // if (!this.favouriteSites)
         // {
            this.favouriteSites = [];
            this.getSiteOptions(topics.GET_FAVOURITE_SITES, this.favouriteSites, optionsTopic);
         // }
         // else
         // {
         //    this.alfPublish(optionsTopic, {
         //       options: this.favouriteSites
         //    }, true);
         // }
      },

      /**
       * This function is called whenever the user changes the site that they want to browse for files in. This
       * site can be from the drop-down showing favourites or recent sites, but the effect is the same - to 
       * update a [DynamicWidgets]{@link module:alfresco/layout/DynamicWidgets} widget with a model that allows
       * the user to browse the selected site.
       * 
       * @instance
       * @param {string} topic The topic to publish a new widget model on
       * @param {object} payload The payload of the changed selecte widget containing the new site browse
       */
      onShowSiteBrowser: function alfresco_forms_controls_FilePicker__onShowSiteBrowser(topic, payload) {
         this.alfPublish(topic, {
            widgets: [
               {
                  name: "alfresco/layout/HorizontalWidgets",
                  config: {
                     widgets: [
                        {
                           name: "alfresco/navigation/PathTree",
                           config: {
                              siteId: payload.value,
                              containerId: "documentLibrary",
                              rootNode: null,
                              showRoot: true,
                              rootLabel: "filepicker.sites.tree.root.label", // TODO: correct folder name?
                              useHash: false
                           }
                        },
                        {
                           name: "alfresco/layout/VerticalWidgets",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/Paginator",
                                    config: {
                                       pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                       documentsPerPage: 10,
                                       pageSizes: [5,10,20]
                                    }
                                 },
                                 {
                                    name: "alfresco/documentlibrary/AlfDocumentList",
                                    config: {
                                       pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                       currentPageSize: 10,
                                       waitForPageWidgets: false,
                                       rawData: false,
                                       useHash: false,
                                       siteId: payload.value,
                                       containerId: "documentLibrary",
                                       rootNode: null,
                                       usePagination: true,
                                       showFolders: true,
                                       sortAscending: true,
                                       sortField: "cm:name", // TODO: Check this
                                       widgets: this.widgetsForBrowseView
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ]
         }, true);
      },

      /**
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForSelectedFilesView: [
         {
            id: "{id}_SELECTED_FILES_VIEW",
            name: "alfresco/lists/views/AlfListView",
            config: {
               noItemsMessage: "filepicker.noitems.message",
               currentData: {
                  items: "{selectedFiles}"
               },
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 width: "40px",
                                 widgets: [
                                    {
                                       id: "{id}_SELECTED_FILES_THUMBNAIL",
                                       name: "alfresco/search/SearchThumbnail",
                                       config: {
                                          width: "32px",
                                          showDocumentPreview: true
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
                                       id: "{id}_SELECTED_FILES_NAME",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "displayName",
                                          renderSize: "large"
                                       }
                                    },
                                    {
                                       id: "{id}_SELECTED_FILES_TITLE",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "title",
                                          renderSize: "small",
                                          renderedValuePrefix: "(",
                                          renderedValueSuffix: ")"
                                       }
                                    },
                                    {
                                       id: "{id}_SELECTED_FILES_DATE",
                                       name: "alfresco/renderers/Date",
                                       config: {
                                          renderSize: "small",
                                          deemphasized: true,
                                          renderOnNewLine: true,
                                          modifiedDateProperty: "modifiedOn",
                                          modifiedByProperty: "modifiedBy"
                                       }
                                    },
                                    {
                                       id: "{id}_SELECTED_FILES_DESCRIPTION",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "description",
                                          renderSize: "small",
                                          renderOnNewLine: true
                                       }
                                    },
                                    {
                                       id: "{id}_SELECTED_FILES_SITE",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "site.title",
                                          renderSize: "small",
                                          label: "filepicker.item.site.prefix",
                                          renderOnNewLine: true
                                       }
                                    },
                                    {
                                       id: "{id}_SELECTED_FILES_PATH",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "path",
                                          renderSize: "small",
                                          label: "filepicker.item.folder.prefix",
                                          renderOnNewLine: true
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
                                       id: "{id}_SELECTED_FILES_REMOVE",
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          iconClass: "delete-16",
                                          publishTopic: "{removeFileTopic}",
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: true
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
      ],

      /**
       * The model used for the view when browsing folders returned by the 
       * [DocumentService]{@link module:alfresco/services/DocumentService}.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForBrowseView: [
         {
            id: "{id}_BROWSE_VIEW",
            name: "alfresco/lists/views/AlfListView",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       id: "{id}_BROWSE_THUMBNAIL",
                                       name: "alfresco/renderers/Thumbnail",
                                       config: {
                                          width: "32px",
                                          showDocumentPreview: true
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
                                       id: "{id}_BROWSE_NAME",
                                       name: "alfresco/renderers/InlineEditPropertyLink",
                                       config: {
                                          propertyToRender: "node.properties.cm:name",
                                          permissionProperty: "prevent.editing", // Hack to work around lack of mixin in PropertyLink
                                          renderSize: "large"
                                       }
                                    },
                                    {
                                       id: "{id}_BROWSE_TITLE",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "node.properties.cm:title",
                                          renderSize: "small",
                                          renderedValuePrefix: "(",
                                          renderedValueSuffix: ")"
                                       }
                                    },
                                    {
                                       id: "{id}_BROWSE_DATE",
                                       name: "alfresco/renderers/Date",
                                       config: {
                                          propertyToRender: "node.properties.cm:title",
                                          renderSize: "small",
                                          deemphasized: true,
                                          renderOnNewLine: true
                                       }
                                    },
                                    {
                                       id: "{id}_BROWSE_DESCRIPTION",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "node.properties.cm:description",
                                          renderSize: "small",
                                          renderOnNewLine: true
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
                                       id: "{id}_BROWSE_ADD",
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishTopic: "{addFileTopic}",
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: true,
                                          renderFilter: [
                                             {
                                                property: "node.isContainer",
                                                values: [false]
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
            }
         }
      ],

      /**
       * This is the model for the search view.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForSearchView: [
         {
            id: "{id}_SEARCH_VIEW",
            name: "alfresco/lists/views/AlfListView",
            config: {
               widgets: [
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       id: "{id}_SEARCH_THUMBNAIL",
                                       name: "alfresco/search/SearchThumbnail",
                                       config: {
                                          width: "32px",
                                          showDocumentPreview: true
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
                                       id: "{id}_SEARCH_NAME",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "displayName",
                                          renderSize: "large"
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_TITLE",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "title",
                                          renderSize: "small",
                                          renderedValuePrefix: "(",
                                          renderedValueSuffix: ")"
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_DATE",
                                       name: "alfresco/renderers/Date",
                                       config: {
                                          renderSize: "small",
                                          deemphasized: true,
                                          renderOnNewLine: true,
                                          modifiedDateProperty: "modifiedOn",
                                          modifiedByProperty: "modifiedBy"
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_DESCRIPTION",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "description",
                                          renderSize: "small",
                                          renderOnNewLine: true
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_SITE",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "site.title",
                                          renderSize: "small",
                                          label: "filepicker.item.site.prefix",
                                          renderOnNewLine: true
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_PATH",
                                       name: "alfresco/renderers/Property",
                                       config: {
                                          propertyToRender: "path",
                                          renderSize: "small",
                                          label: "filepicker.item.folder.prefix",
                                          renderOnNewLine: true
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
                                       id: "{id}_SEARCH_ADD",
                                       name: "alfresco/renderers/PublishAction",
                                       config: {
                                          publishTopic: "{addFileTopic}",
                                          publishPayloadType: "CURRENT_ITEM",
                                          publishGlobal: true
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
      ],

      /**
       * The model to use in the file selection dialog.
       *
       * @instance
       * @type {object[]}
       */
      widgetsForDialog: [
         {
            name: "alfresco/layout/FixedHeaderFooter",
            config: {
               heightMode: "DIALOG",
               widgetsForHeader: [
                  {
                     id: "{id}_SELECTED_FILES",
                     name: "alfresco/layout/VerticalWidgets",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/layout/DynamicWidgets",
                              config: {
                                 subscriptionTopic: "{updateSelectedFilesTopic}",
                                 subscribeGlobal: true
                              }
                           }
                        ]
                     }
                  }
               ],
               widgets: [
                  {
                     id: "{id}_TABCONTAINER",
                     name: "alfresco/layout/AlfTabContainer",
                     config: {
                        padded: true,
                        currentItem: {
                           showSearch: "{showSearch}",
                           showRepository: "{showRepository}",
                           showAllSites: "{showAllSites}",
                           showFavouriteSites: "{showFavouriteSites}",
                           showRecentSites: "{showRecentSites}"
                        },
                        widgets: [
                           {
                              id: "{id}_SEARCH_TAB",
                              title: "filepicker.search.tab.label",
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                 pubSubScope: "{searchTabScope}",
                                 widgetMarginTop: 10,
                                 widgets: [
                                    {
                                       id: "{id}_SEARCH_FIELD",
                                       name: "alfresco/forms/SingleComboBoxForm",
                                       config: {
                                          useHash: true,
                                          okButtonLabel: "filepicker.search.button.label",
                                          okButtonPublishTopic : "ALF_SET_SEARCH_TERM",
                                          okButtonPublishGlobal: false,
                                          okButtonIconClass: "alf-white-search-icon",
                                          okButtonClass: "call-to-action",
                                          textFieldName: "searchTerm",
                                          textBoxIconClass: "alf-search-icon",
                                          textBoxCssClasses: "long hiddenlabel",
                                          queryAttribute: "term",
                                          optionsPublishTopic: "ALF_AUTO_SUGGEST_SEARCH",
                                          optionsPublishPayload: {
                                             resultsProperty: "response.suggestions"
                                          }
                                       }
                                    },
                                    {
                                       name: "alfresco/lists/Paginator",
                                       config: {
                                          pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                          documentsPerPage: 10,
                                          pageSizes: [5,10,20]
                                       }
                                    },
                                    {
                                       id: "{id}_SEARCH_RESULTS",
                                       name: "alfresco/documentlibrary/AlfSearchList",
                                       config: {
                                          _resetVars: ["facetFilters"], // NOTE: Stops query being reset...
                                          query: {
                                             datatype: "cm:content" // NOTE: Restricts search to files!
                                          },
                                          pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                          currentPageSize: 10,
                                          waitForPageWidgets: false,
                                          loadDataImmediately: false,
                                          useHash: false,
                                          selectedScope: "repo",
                                          useInfiniteScroll: false,
                                          siteId: null,
                                          rootNode: null, 
                                          repo: true,
                                          widgets: "{widgetsForSearchView}"
                                       }
                                    }
                                 ],
                                 renderFilter: [
                                    {
                                       property: "showSearch",
                                       values: [true]
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_RECENT_SITES_TAB",
                              title: "filepicker.recent.tab.label",
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                 pubSubScope: "{recentSitesTabScope}",
                                 widgetMarginTop: 10,
                                 widgets: [
                                    {
                                       id: "{id}_SELECT_RECENT_SITE",
                                       name: "alfresco/forms/controls/Select",
                                       config: {
                                          fieldId: "RECENT_SITE_SELECTION",
                                          label: "filepicker.recent.site.selection.label",
                                          name: "recentSite",
                                          optionsConfig: {
                                             publishTopic: "{recentSitesRequestTopic}"
                                          }
                                       }
                                    },
                                    {
                                       id: "{id}_RECENT_SITES",
                                       name: "alfresco/layout/DynamicWidgets",
                                       config: {
                                          subscriptionTopic: "{showRecentSiteBrowserTopic}",
                                          subscribeGlobal: true
                                       }
                                    }
                                 ],
                                 renderFilter: [
                                    {
                                       property: "showRecentSites",
                                       values: [true]
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_FAVOURITE_SITES_TAB",
                              title: "filepicker.favourite.tab.label",
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                 pubSubScope: "{favouriteSitesTabScope}",
                                 widgetMarginTop: 10,
                                 widgets: [
                                    {
                                       id: "{id}_SELECT_FAVOURITE_SITE",
                                       name: "alfresco/forms/controls/Select",
                                       config: {
                                          fieldId: "FAVOURITE_SITE_SELECTION",
                                          label: "filepicker.favourite.site.selection.label",
                                          name: "favouriteSite",
                                          optionsConfig: {
                                             publishTopic: "{favouriteSitesRequestTopic}"
                                          }
                                       }
                                    },
                                    {
                                       id: "{id}_FAVOURITE_SITES",
                                       name: "alfresco/layout/DynamicWidgets",
                                       config: {
                                          subscriptionTopic: "{showFavouriteSiteBrowserTopic}",
                                          subscribeGlobal: true
                                       }
                                    }
                                 ],
                                 renderFilter: [
                                    {
                                       property: "showFavouriteSites",
                                       values: [true]
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_ALL_SITES_TAB",
                              title: "filepicker.allsites.tab.label",
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                 pubSubScope: "{allSitesTabScope}",
                                 widgetMarginTop: 10,
                                 widgets: [
                                    {
                                       id: "{id}_SELECT_SITE",
                                       name: "alfresco/forms/controls/Select",
                                       config: {
                                          fieldId: "SITE_SELECTION",
                                          label: "filepicker.site.selection.label",
                                          name: "site",
                                          optionsConfig: {
                                             publishTopic: "{allSitesRequestTopic}"
                                          }
                                       }
                                    },
                                    {
                                       id: "{id}_FAVOURITE_SITES",
                                       name: "alfresco/layout/DynamicWidgets",
                                       config: {
                                          subscriptionTopic: "{showSiteBrowserTopic}",
                                          subscribeGlobal: true
                                       }
                                    }
                                 ],
                                 renderFilter: [
                                    {
                                       property: "showAllSites",
                                       values: [true]
                                    }
                                 ]
                              }
                           },
                           {
                              id: "{id}_REPOSITORY_TAB",
                              title: "filepicker.repository.tab.label",
                              name: "alfresco/layout/VerticalWidgets",
                              config: {
                                 pubSubScope: "{repositoryTabScope}",
                                 widgetMarginTop: 10,
                                 widgets: [
                                    {
                                       name: "alfresco/layout/HorizontalWidgets",
                                       config: {
                                          widgets: [
                                             {
                                                name: "alfresco/navigation/PathTree",
                                                config: {
                                                   siteId: null,
                                                   containerId: null,
                                                   rootNode: "{repositoryRootNode}",
                                                   rootLabel: "filepicker.repository.tree.root.label",
                                                   useHash: false
                                                }
                                             },
                                             {
                                                name: "alfresco/layout/VerticalWidgets",
                                                config: {
                                                   widgets: [
                                                      {
                                                         name: "alfresco/lists/Paginator",
                                                         config: {
                                                            pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                                            documentsPerPage: 10,
                                                            pageSizes: [5,10,20]
                                                         }
                                                      },
                                                      {
                                                         name: "alfresco/documentlibrary/AlfDocumentList",
                                                         config: {
                                                            pageSizePreferenceName: "org.alfresco.share.filepicker.documentsPerPage",
                                                            currentPageSize: 10,
                                                            waitForPageWidgets: false,
                                                            rawData: false,
                                                            useHash: false,
                                                            siteId: null,
                                                            containerId: null,
                                                            rootNode: null,
                                                            usePagination: true,
                                                            showFolders: true,
                                                            sortAscending: true,
                                                            sortField: "cm:name", // TODO: Check this
                                                            widgets: "{widgetsForBrowseView}"
                                                         }
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ],
                                 renderFilter: [
                                    {
                                       property: "showRepository",
                                       values: [true]
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