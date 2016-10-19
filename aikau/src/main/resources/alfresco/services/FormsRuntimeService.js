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
 * <b>IMPORTANT NOTE: This service is not fully complete yet and does not guarantee full support for the
 * rendering all configured forms defined in XML for the forms runtime. It requires the 
 * "aikau-forms-runtime-support" JAR file to be available in the "share/WEB-INF/lib" folder and it will
 * only work on Share. This has been made available early to for the purposes of collaborative development
 * with the Alfresco Community.</b>
 * 
 * @module alfresco/services/FormsRuntimeService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.76
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/NodeUtils",
        "alfresco/core/topics",
        "service/constants/Default",
        "webscripts/defaults",
        "dojo/_base/array",
        "dojo/_base/lang",
        "jquery",
        // No call backs from here...
        "alfresco/forms/Form",
        "alfresco/forms/ControlRow",
        "alfresco/renderers/Boolean",
        "alfresco/forms/controls/CheckBox",
        "alfresco/forms/controls/DateRange",
        "alfresco/forms/controls/DateTextBox",
        "alfresco/forms/controls/FilePicker",
        "alfresco/forms/controls/FilteringSelect",
        "alfresco/forms/controls/MultiSelectInput",
        "alfresco/forms/controls/NumberSpinner",
        "alfresco/forms/controls/Select",
        "alfresco/forms/controls/TextArea",
        "alfresco/forms/controls/TextBox",
        "alfresco/forms/controls/Transitions",
        "alfresco/node/MetadataGroups",
        "alfresco/renderers/Date",
        "alfresco/renderers/Property",
        "alfresco/renderers/Size"],
        function(declare, BaseService, CoreXhr, NodeUtils, topics, AlfConstants, webScriptDefaults, array, lang, $) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/FormsRuntimeService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/FormsRuntimeService.properties"}],

      /**
       * 
       * @instance
       * @type {object}
       */
      controlMappings: {

         // To save duplication of data there will always be a fallback check on default
         // control mappings, this allows there to be flexibility in configuration and mapping
         // on "kind" (type) specific mapping...
         "default": {
            "/org/alfresco/components/form/controls/association.ftl": {
               name: "alfresco/forms/controls/FilePicker",
               config: {
                  valueDelimiter: ",",
                  addedAndRemovedValues: true
               }
            },

            "/org/alfresco/components/form/controls/authority.ftl": {
               name: "alfresco/forms/controls/MultiSelectInput",
               config: {
                  width: "400px",
                  valueDelimiter: ",",
                  addedAndRemovedValues: true,
                  optionsConfig: {
                     labelAttribute: "name",
                     queryAttribute: "name",
                     valueAttribute: "nodeRef",
                     publishTopic: topics.GET_AUTHORITIES,
                     publishPayload: {
                        resultsProperty: "response.data.items"
                     }
                  }
               }
            },

            "/org/alfresco/components/form/controls/category.ftl": {
               name: "alfresco/forms/controls/MultiSelectInput",
               config: {
                  name: "tags",
                  width: "400px",
                  valueDelimiter: ",",
                  optionsConfig: {
                     queryAttribute: "name",
                     valueAttribute: "nodeRef",
                     labelAttribute: "name",
                     publishTopic: "ALF_RETRIEVE_CURRENT_TAGS",
                     publishPayload: {
                        resultsProperty: "response.data.items"
                     }
                  }
               }
            },
            "/org/alfresco/components/form/controls/checkbox.ftl": {
               name: "alfresco/forms/controls/CheckBox"
            },
            "/org/alfresco/components/form/controls/date.ftl": {
               name: "alfresco/forms/controls/DateTextBox",
               config: {
                  unsetReturnValue: ""
               }
            },
            "/org/alfresco/components/form/controls/daterange.ftl": {
               name: "alfresco/forms/controls/DateRange",
               config: {
                  valueFormatSelector: "datetime"
               }
            },
            "/org/alfresco/components/form/controls/workflow/email-notification.ftl": {
               name: "alfresco/forms/controls/CheckBox"
            },
            "/org/alfresco/components/form/controls/info.ftl": {
               name: "alfresco/renderers/Property"
            },
            "/org/alfresco/components/form/controls/mimetype.ftl": {
               name: "alfresco/forms/controls/FilteringSelect",
               config: {
                  optionsConfig: {
                     queryAttribute: "label",
                     publishTopic: topics.GET_FORMS_FORMS_RUNTIME_MIMETYPES,
                     publishPayload: {
                        resultsProperty: "options"
                     }
                  }
               }
            },
            "/org/alfresco/components/form/controls/number.ftl": {
               name: "alfresco/forms/controls/NumberSpinner",
               config: {
                  permittedDecimalPlaces: 10
               }
            },

            "/org/alfresco/components/form/controls/workflow/taskowner.ftl": {
               name: "alfresco/renderers/User",
               config: {

               }
            },

            "/org/alfresco/components/form/controls/workflow/packageitems.ftl": {
               name: "alfresco/forms/controls/FilePicker",
               config: {
                  valueDelimiter: ",",
                  addedAndRemovedValues: true
               }
            },
            "/org/alfresco/components/form/controls/percentage-approve.ftl": {
               name: "alfresco/forms/controls/NumberSpinner",
               config: {
                  min: 0,
                  max: 100
               }
            },
            "/org/alfresco/components/form/controls/workflow/priority.ftl": {
               name: "alfresco/forms/controls/Select",
               config: {
                  optionsConfig: {
                     fixed: [
                        {
                           label: "priority.high", value: "1"
                        },
                        {
                           label: "priority.medium", value: "2"
                        },
                        {
                           label: "priority.low", value: "3"
                        }
                     ]
                  }
               }
            },
            "/org/alfresco/components/form/controls/readonly.ftl": {
               name: "alfresco/forms/controls/TextBox",
               config: {
                  disablementConfig: {
                     initialValue: true
                  }
               }
            },
            "/org/alfresco/components/form/controls/selectone.ftl": {
               name: "alfresco/forms/controls/Select"
            },
            "/org/alfresco/components/form/controls/textarea.ftl": {
               name: "alfresco/forms/controls/TextArea"
            },
            "/org/alfresco/components/form/controls/textfield.ftl": {
               name: "alfresco/forms/controls/TextBox"
            }
         },

         // The following mappings are "kind" (type) specific and within each
         // "kind" are view mode specific mappings...
         node: {
            edit: {

            },

            // The "view" mode of the "node" kind is different in that it displays the
            // data as renderers rather than form controls...
            view: {
               "/org/alfresco/components/form/controls/checkbox.ftl": {
                  name: "alfresco/renderers/Boolean"
               },
               "/org/alfresco/components/form/controls/date.ftl": {
                  name: "alfresco/renderers/Date",
                  config: {
                     simple: true
                     // modifiedDateProperty: "prop_cm_modified",
                     // modifiedByProperty: "prop_cm_modifier"
                  }
               },
               "/org/alfresco/components/form/controls/mimetype.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/number.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/readonly.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/size.ftl": {
                  name: "alfresco/renderers/Size"
               },
               "/org/alfresco/components/form/controls/textfield.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/textarea.ftl": {
                  name: "alfresco/renderers/Property"
               }
            }
         },

         task: {
            edit: {

               "/org/alfresco/components/form/controls/workflow/transitions.ftl": {
                  name: "alfresco/forms/controls/Transitions"
               }
            },

            view: {
               prop_bpm_dueDate: {
                  name: "alfresco/renderers/Date",
                  config: {
                     simple: true
                  }
               },

               "/org/alfresco/components/form/controls/info.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/workflow/priority.ftl": {
                  name: "alfresco/renderers/Property"
               },
               "/org/alfresco/components/form/controls/selectone.ftl": {
                  name: "alfresco/renderers/Property" 
               }
            }
         },

         workflow: {
            create: {

            }
         }
      },

      /**
       * This has been added to support the slightly unsual scenarios where the configured
       * parameter name in the form is not the parameter name that should be substitued. This
       * was originally added to support the case of "Advanced Search" forms where the
       * "prop_cm_modified" parameter name should be modified to be "prop_cm_modified-date-range"
       * 
       * @instance
       * @type {object}
       * @since 1.0.91
       */
      propertyNameMapping: {
         type: {
            edit: {
               prop_cm_modified: "prop_cm_modified-date-range"
            }
         }
      },

      /**
       * Maps the XML constraint configuration specifying YUI2 based Share functions to Regular expression
       * configuration for form validation.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.77
       */
      constraintMappings: {
         "Alfresco.forms.validation.fileName": {
            pattern: "([\"\*\\\>\<\?\/\:\|]+)|([\.]?[\.]+$)|(^[ \t]+|[ \t]+$)",
            match: false
         },
         "Alfresco.forms.validation.wikiTitle": {
            pattern: "([#\\\?\/\|]+)|([\.]?[\.]+$)",
            match: false
         },
         "Alfresco.forms.validation.nodeRef": {
            pattern: "^[^\:^ ]+\:\/\/[^\:^ ]+\/[^ ]+$",
            match: true
         },
         "Alfresco.forms.validation.phone": {
            pattern: "^[0-9\(\)\[\]\-\+\*#\\:\/,; ]+$",
            match: true
         },
         "Alfresco.forms.validation.time": {
            pattern: "^([0-1]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$",
            match: true
         },
         "Alfresco.forms.validation.url": {
            pattern: "(ftp|http|https):\/\/[\w\-_]+(\.[\w\-_]+)*([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?",
            match: true
         }
         // TODO: "Alfresco.forms.validation.email" not handled yet due to complexity

      },

      /**
       * Custom control mappings to check before the default control mappings.
       * 
       * @instance
       * @type {string}
       * @default
       */
      customControlMappings: null,

      /**
       * This will be populated with MIME type options the first time the 
       * "/org/alfresco/components/form/controls/mimetype.ftl" is mapped to a
       * formcontrol and used. It prevents multiple XHR for data that is unlikely to
       * change unnecessary.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.77
       */
      _loadedMimeTypes: null,

      /**
       * 
       * 
       * @instance
       * @listens module:alfresco/core/topics#REQUEST_FORM
       * @listens module:alfresco/core/topics#GET_FORMS_FORMS_RUNTIME_MIMETYPES
       */
      registerSubscriptions: function alfresco_services_FormsRuntimeService__registerSubscriptions() {
         this.alfSubscribe(topics.REQUEST_FORM, lang.hitch(this, this.onFormRequest));
         this.alfSubscribe(topics.GET_FORMS_FORMS_RUNTIME_MIMETYPES, lang.hitch(this, this.onMimeTypesRequest));
      },

      /**
       * Handles requests to load the available MIME types to display as 
       * [form control]{@link module:alfresco/forms/controls/BaseFormControl} options. If the
       * MIME types have already been loaded the previously loaded values will be returned
       * by called [publishMimeTypeOptions]{@link module:alfresco/services/FormsRuntimeService#publishMimeTypeOptions}.
       * 
       * @instance
       * @param {object} payload The details for the options request.
       * @since 1.0.77
       */
      onMimeTypesRequest: function alfresco_services_FormsRuntimeService__onMimeTypesRequest(payload) {
         if (!this._loadedMimeTypes)
         {
            this.serviceXhr({
               url : AlfConstants.URL_SERVICECONTEXT + "utils/mimetypemap",
               data: payload,
               method: "GET",
               successCallback: this.onMimeTypesLoaded,
               failureCallback: function() { /* No action required */ },
               progressCallback: function() { /* No action required */ },
               callbackScope: this
            });
         }
         else
         {
            this.publishMimeTypeOptions(payload);
         }
      },

      /**
       * Handles successful requests for available MIME types, converts the response into a
       * structure that is appropriate for [form controls]{@link module:alfresco/forms/controls/BaseFormControls},
       * stores the data in [_loadedMimeTypes]{@link module:alfresco/services/FormsRuntimeService#_loadedMimeTypes}
       * and calls [publishMimeTypeOptions]{@link module:alfresco/services/FormsRuntimeService#publishMimeTypeOptions}
       * to publish the available options.
       * 
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       * @since 1.0.77
       */
      onMimeTypesLoaded: function alfresco_services_FormsRuntimeService__onMimeTypesLoaded(response, originalRequestConfig) {
         if (response && response.mimetypes)
         {
            var mimetypes = response.mimetypes;
            this._loadedMimeTypes = [];
            array.forEach(Object.keys(mimetypes), function(value) {
               this._loadedMimeTypes.push({
                  label: mimetypes[value],
                  value: value
               });
            }, this);

            // Sort alphabetically by label...
            this._loadedMimeTypes.sort(function(a,b) {
               var nameA = a.label.toUpperCase();
               var nameB = b.label.toUpperCase();
               if (nameA < nameB) {
                  return -1;
               }
               if (nameA > nameB) {
                  return 1;
               }
               return 0;
            });

            // Add "Unknown" type in first...
            this._loadedMimeTypes.unshift({
               label: this.message("formsruntimeservice.unknown.mimetype"),
               value: ""
            });

            this.publishMimeTypeOptions(originalRequestConfig.data);
         }
      },

      /**
       * Publishes the [available MIME type options]{@link module:alfresco/services/FormsRuntimeService#_loadedMimeTypes}.
       * 
       * @instance
       * @param {object} payload The details for the options request.
       * @since 1.0.77
       */
      publishMimeTypeOptions: function(data) {
         var topic;
         if (data.alfResponseTopic)
         {
            topic = (data.alfResponseScope || "") + data.alfResponseTopic;
         }
         else
         {
            topic = data.responseTopic;
         }
         this.alfPublish(topic, {
            options: this._loadedMimeTypes
         });
      },
      
      /**
       * 
       * 
       * @instance
       */
      onFormRequest: function alfresco_services_FormsRuntimeService__onFormRequest(payload) {
         if (payload.itemKind &&
             payload.itemId &&
             payload.mode)
         {
            var itemId = payload.itemId;
            var url = AlfConstants.URL_SERVICECONTEXT + "aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form" +
                      "?itemKind=" + payload.itemKind + 
                      "&itemId=" + itemId + 
                      "&formId=" + (payload.formId || "null") + 
                      "&mode=" + payload.mode;

            var successTopic = payload.alfSuccessTopic || 
                               payload.alfResponseTopic ||
                               (payload.alfTopic + "_SUCCESS");

            this.serviceXhr({url : url,
                             method: "GET",
                             formConfig: payload.formConfig,
                             alfDestination: payload.alfDestination,
                             alfSuccessTopic: successTopic,
                             successCallback: this.onFormLoaded,
                             failureCallback: this.onFormLoadFailure,
                             callbackScope: this});
         }
         else
         {
            this.alfLog("error", "A request was made to retrieve a form that was missing one of 'itemKind', 'itemId', 'formId' or 'mode' attributes", payload, this);
         }
      },

      /**
       * Returns the number of columns that should be used for the 
       * [ControlRow]{@link module:alfresco/forms/ControlRow} for the supplied structure. The
       * "message" attribute in the structure contains the name of a template that can
       * be mapped to a number of controls.
       * 
       * @instance
       * @return {number|null} The number of columns or null if they can't be determined
       * @since 1.0.86
       */
      getColumnsForControlRow: function alfresco_services_FormsRuntimeService__getColumnsForControlRow(structureElement) {
         var columns = null;
         if (structureElement.message)
         {
            switch (structureElement.message) {
               case "/org/alfresco/components/form/2-column-set.ftl":
                  columns = 2;
                  break;

               case "/org/alfresco/components/form/2-column-wide-left-set.ftl":
                  columns = 2;
                  break;

               case "/org/alfresco/components/form/3-column-set.ftl":
                  columns = 3;
                  break;

               default:
                  this.alfLog("warn", "Could not find a layout structure for ", structureElement.message, this);
            }
         }
         return columns;
      },

      /**
       * The form data is returned as a JSON object that needs to be parsed and the data mapped to Aikau
       * configuration.
       * 
       * @instance
       * @param {object} response The response will be the form configuration to render
       * @param {object} originalReqeuestConfig The object used when making the XHR request that resulted in this callback
       */
      onFormLoaded: function alfresco_services_FormsRuntimeService__onFormLoaded(response, originalRequestConfig) {
         if (response.structure &&
             response.fields &&
             response.constraints)
         {
            var widgets = [];
            if (response["arguments"].itemKind === "node" && response.mode === "view")
            {
               var properties = [];
               var metadataGroup = {
                  name: "alfresco/node/MetadataGroups",
                  config: {
                     currentItem: response.data,
                     groups: [
                        {
                           title: this.message("formsruntimeservice.properties"), // TODO: Need to figure out correct value here...
                           widgets: properties
                        }
                     ]
                  }
               };

               array.forEach(response.structure, function(structureElement) {
                  if (structureElement.children)
                  {
                     array.forEach(structureElement.children, lang.hitch(this, this.addField, properties, response));
                  }
               }, this);

               widgets.push(metadataGroup);
            }
            else
            {
               // Check for an optional ID for the form...
               var formId = lang.getObject("formConfig.formId", false, originalRequestConfig);

               // Mixin in any additional data to include in the payload...
               var formSubmissionPayloadMixin = lang.getObject("formConfig.formSubmissionPayloadMixin", false, originalRequestConfig);
               var okButtonPublishPayload = {
                  url: response.submissionUrl,
                  urlType: "FULL",
                  alf_destination: originalRequestConfig.alfDestination
               };
               formSubmissionPayloadMixin && lang.mixin(okButtonPublishPayload, formSubmissionPayloadMixin);

               var okButtonPublishTopic = lang.getObject("formConfig.okButtonPublishTopic", false, originalRequestConfig);
               var widgetsBefore = lang.getObject("formConfig.widgetsBefore", false, originalRequestConfig) || [];

               var formControls = lang.clone(widgetsBefore);
               var formConfig = {
                  id: formId,
                  name: "alfresco/forms/Form",
                  config: {
                     showOkButton: response.showSubmitButton,
                     showCancelButton: response.showCancelButton,
                     okButtonPublishTopic: okButtonPublishTopic || (response.method === "post" ? "ALF_CRUD_CREATE" : "ALF_CRUD_UPDATE"),
                     okButtonPublishPayload: okButtonPublishPayload,
                     okButtonPublishGlobal: true,
                     value: response.data,
                     widgets: formControls,
                     formSubmissionTriggerTopic: topics.TRIGGER_FORM_SUBMISSION
                  }
               };

               var okButtonLabel = lang.getObject("formConfig.okButtonLabel", false, originalRequestConfig);
               if (okButtonLabel)
               {
                  formConfig.config.okButtonLabel = okButtonLabel;
               }

               // Iterate over the structure array and add the the form controls for all of the fields
               // that it contains...
               // TODO: Need to handle the different structures that are available...
               array.forEach(response.structure, function(structureElement) {
                  var rowControls = [];
                  var structureWidget = {
                     name: "alfresco/forms/ControlRow",
                     config: {
                        title: structureElement.params === "title" ? structureElement.event : null,
                        widgets: rowControls
                     }
                  };
                  formControls.push(structureWidget);
                  
                  var columns = this.getColumnsForControlRow(structureElement);
                  if (columns)
                  {
                     while (structureElement.children.length)
                     {
                        var childrenToAdd = structureElement.children.splice(0, columns);
                        if (childrenToAdd)
                        {
                           array.forEach(childrenToAdd, lang.hitch(this, this.addField, rowControls, response));
                        }
                        if (structureElement.children.length)
                        {
                           rowControls = [];
                           structureWidget = {
                              name: "alfresco/forms/ControlRow",
                              config: {
                                 widgets: rowControls
                              }
                           };
                           formControls.push(structureWidget);
                        }
                     }
                  }
                  else
                  {
                     // Select the appropriate target for the form controls, at the moment this assumes
                     // that if a "message" attribute is provided then all form controls go into the same
                     // row - however, that needs to be validated, it might be necessary to iterate over the
                     // controls to ensure that the appropriate number of controls are added per row.
                     var targetForControls = structureElement.message ? rowControls : formControls;
                     if (structureElement.children)
                     {
                        array.forEach(structureElement.children, lang.hitch(this, this.addField, targetForControls, response));
                     }
                  }

               }, this);

               widgets.push(formConfig);
            }
            
            var useDialog = lang.getObject("formConfig.useDialog", false, originalRequestConfig);
            if (useDialog)
            {
               var dialogTitle = lang.getObject("formConfig.dialogTitle", false, originalRequestConfig);
               var dialogId = lang.getObject("formConfig.formId", false, originalRequestConfig);
               this.alfServicePublish(topics.CREATE_FORM_DIALOG, {
                  dialogId: dialogId,
                  dialogTitle: dialogTitle,
                  formSubmissionTopic: formConfig.config.okButtonPublishTopic,
                  formSubmissionGlobal: true,
                  formSubmissionPayloadMixin: formConfig.config.okButtonPublishPayload,
                  formValue: formConfig.config.value,
                  widgets: formConfig.config.widgets,
                  formSubmissionTriggerTopic: topics.TRIGGER_FORM_SUBMISSION
               });
            }
            else
            {
               this.alfPublish(originalRequestConfig.alfSuccessTopic, {
                  widgets: widgets
               });
            }
         }
      },

      /**
       * Called from [onFormLoaded]{@link module:alfresco/services/FormsRuntimeService#onFormLoaded} for
       * each structural element in the form. Each structural element will typically represent a field
       * to be rendered.
       * 
       * @instance
       * @param {object[]} widgets The array of widgets to add the widget for the field to
       * @param {object} formConfig The full configuration for the form being rendered
       * @param {object} structureElement The current structural element defining a field to be rendered
       */
      addField: function alfresco_services_FormsRuntimeService__addField(widgets, formConfig, structureElement) {
         // if (structureElement && 
         //     structureElement.id && 
         //     typeof formConfig.data[structureElement.id] !== "undefined")
         // NOTE: It's not clear how we should treat fields that have no associated data, in some cases this
         //       prevents the form from being posted (on edit - last accessed), but in workflow not all fields
         //       having matching data.
         if (structureElement && 
             structureElement.id)
         {
            // TODO: Do we need to consider "kind" attributes on the structureElement other than "field" ???
            
            // Look up the target field referenced in the structure element...
            var targetField = formConfig.fields[structureElement.id];
            if (targetField )
            {
               // We need to get the control template from the field configuration. This will be a Surf/YUI2 
               // reference which is fairly meaningless in the context of Aikau, however we can use this to 
               // map to an Aikau form control...
               var controlTemplate = lang.getObject("control.template", false, targetField);
               if (controlTemplate)
               {
                  var widget;
                  if (formConfig["arguments"].itemKind === "node" && formConfig.mode === "view")
                  {
                     // The "view" mode for the "node" kind is treated differently from all other
                     // form renderings...
                     widget = this.getViewProperty(targetField, controlTemplate, formConfig);
                  }
                  else
                  {
                     widget = this.getEditFormControl(targetField, controlTemplate, formConfig);
                  }
                  widget && widgets.push(widget);
               }
            }
         }
      },

      /**
       * Called from [addField]{@link module:alfresco/services/FormsRuntimeService#addField} 
       * and [getViewProperty]{@link module:alfresco/services/FormsRuntimeService#getViewProperty} to
       * find the Aikau control widget that has been mapped to the supplied controlTemplate.
       * 
       * @instance
       * @param {object} formConfig The full configuration for the form being rendered
       * @param {object} targetField The configuration for the field to render.
       * @param {string} controlTemplate The name of the template to be mapped to a widget
       * @param {object} mappings The mappings configuration object to explore
       * @return {object} The mapped control.
       * @since 1.0.77
       */
      getMappedControl: function alfresco_services_FormsRuntimeService__getMappedControl(formConfig, targetField, controlTemplate, mappings) {
         var kind = formConfig["arguments"].itemKind;
         var mode = formConfig.mode;
         var control;
         if (mappings)
         {
            var kindMapping = mappings[kind];
            if (kindMapping)
            {
               var modeMapping = kindMapping[mode];
               if (modeMapping)
               {
                  control = modeMapping[targetField.dataKeyName];
                  if (!control)
                  {
                     control = modeMapping[controlTemplate];
                  }
               }
               if (!control)
               {
                  control = kindMapping[controlTemplate];
               }
            }
            if (!control)
            {
               control = mappings["default"][controlTemplate];
            }
         }
         return control;
      },

      /**
       * Called from [addField]{@link module:alfresco/services/FormsRuntimeService#addField} to create
       * a "view" mode widget for the field supplied.
       * 
       * @instance
       * @param  {object} targetField The configuration for the field to render.
       * @param  {string} controlTemplate The name of the template to be mapped to a widget
       * @param {object} formConfig The full configuration for the form being rendered
       * @return {object} A model for the widget to be used to render the property.
       */
      getViewProperty: function alfresco_services_FormsRuntimeService__getViewProperty(targetField, controlTemplate, formConfig) {
         var widget;
         var formControl = this.getMappedControl(formConfig, targetField, controlTemplate, this.customControlMappings) ||
                           this.getMappedControl(formConfig, targetField, controlTemplate, this.controlMappings);
         if (formControl)
         {
            widget = lang.clone(formControl);
            var data = {
               id: targetField.name.toUpperCase(),
               label: targetField.label,
               config: {
                  propertyToRender: targetField.dataKeyName
               }
            };
            $.extend(true, widget, data);
         }
         else
         {
            this.alfLog("warn", "Could not find a mapping for ", controlTemplate, this);
         }
         return widget;
      },

      /**
       * Called from [addField]{@link module:alfresco/services/FormsRuntimeService#addField} to create
       * a "edit" mode widget for the field supplied.
       * 
       * @instance
       * @param {object} targetField The configuration for the field to render.
       * @param {string} controlTemplate The name of the template to be mapped to a widget
       * @param {object} formConfig The full configuration for the form being rendered
       * @return {object} A model for the widget to be used to render the property.
       */
      getEditFormControl: function alfresco_services_FormsRuntimeService__addFormControl(targetField, controlTemplate, formConfig) {
         var widget;
         
         var formControl = this.getMappedControl(formConfig, targetField, controlTemplate, this.customControlMappings) ||
                           this.getMappedControl(formConfig, targetField, controlTemplate, this.controlMappings);
         if (formControl)
         {
            var kind = formConfig["arguments"].itemKind;
            var mode = formConfig.mode;
            var name = lang.getObject(kind + "." + mode + "." + targetField.name, false, this.propertyNameMapping) || targetField.name;

            widget = lang.clone(formControl);
            var data = {
               id: targetField.name.toUpperCase(),
               config: {
                  currentItem: formConfig.data,
                  fieldId: targetField.name.toUpperCase(),
                  propertyToRender: name, // NOTE: Hedging bets for renderers
                  name: name,
                  label: targetField.label,
                  description: targetField.description
               }
            };
            $.extend(true, widget, data);

            if (formConfig.constraints)
            {
               array.forEach(formConfig.constraints, function(constraint) {
                  if (constraint.fieldId === targetField.name)
                  {
                     this.addConstraint(widget, constraint);
                  }
               }, this);
            }

            // Add any option configuration that may be present...
            this.addOptions(widget, targetField);
            
         }
         else
         {
            this.alfLog("warn", "Could not find a mapping for ", controlTemplate, this);
         }
         return widget;
      },

      /**
       * 
       * @instance
       * @param {object} widget The widget model to add the constraint to
       * @param {object} constraint The constraint configuration
       */
      addConstraint: function alfresco_services_FormsRuntimeService__addConstraint(widget, constraint) {
         if (constraint.id === "MANDATORY")
         {
            widget.config.requirementConfig = {
               initialValue: true
            };
         }
         else if (constraint.id === "REGEX")
         {
            var regex = this.constraintMappings[constraint.validationHandler];
            if (regex)
            {
               if (!widget.config.validationConfig)
               {
                  widget.config.validationConfig = [];
               }
               widget.config.validationConfig.push({
                  validation: "regex",
                  regex: regex.pattern,
                  invertRule: !regex.match,
                  errorMessage: constraint.message
               });
            }
         }
         // TODO: Need to address these constraints !!!
         else if (constraint.id === "NUMBER") {}
         else if (constraint.id === "MINMAX") {}
         else if (constraint.id === "LIST") {}
         else if (constraint.id === "LENGTH") {}
      },

      /**
       * Adds options to the supplied widget. The options are derived from the "options" and
       * "optionSeparator" attributes of the "params" configuration for the control of the
       * supplied targetField.
       * 
       * @instance
       * @param {object} widget The widget to add option to
       * @param {object} targetField The data for the field to check for options data
       * @since 1.0.77
       */
      addOptions: function alfresco_services_FormsRuntimeService__addOptions(widget, targetField) {
         if (!widget.config.optionsConfig)
         {
            var options = lang.getObject("control.params.options", false, targetField);
            var optionSeparator = lang.getObject("control.params.optionSeparator", false, targetField);
            if (options && optionSeparator)
            {
               var optionsConfig = {
                  fixed: []
               };
               var optionsArray = options.split(optionSeparator);
               array.forEach(optionsArray, function(option) {
                  var optionComponents = option.split("|");
                  optionsConfig.fixed.push({
                     value: optionComponents[0],
                     label: optionComponents[optionComponents.length - 1]
                  });
               }, this);
               widget.config.optionsConfig = optionsConfig;
            }
         }
      },

      /**
       * 
       * 
       * @instance
       */
      onFormLoadFailure: function alfresco_services_FormsRuntimeService__onFormLoadFailure(/*jshint unused: false*/response, originalRequestConfig) {
         // TODO: Need to handle failures appropriately...
      }
   });
});
