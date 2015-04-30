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
 * <p>This service handles requests to create new nodes from templates found in the Alfresco Repository
 * Data Dictionary. The templates will be found in the "Node Templates" and "Space Templates" folders.
 * When creating a folder template the user will be prompted to override the name, title and description
 * of the template, but when creating a node template the source node will just be directly copied.</p>
 *
 * @module alfresco/services/actions/CreateTemplateContentService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang"],
        function(declare, AlfCore, AlfCoreXhr, AlfConstants, lang) {

   return declare([AlfCore, AlfCoreXhr], {

      /**
       * An array of the i18n files to use with this service.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CreateTemplateContentService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CreateTemplateContentService.properties"}],

      /**
       * Sets up the service using the configuration provided. This will check to see what aspects are available,
       * addable and removable. If no addble or removable aspects are explicitly configured then it is assumed that
       * all available aspects are both addable and removable. Only aspects that are configured as being available
       * will be displayed in the manage aspects picker, only aspects that are addable can be added in the manage
       * aspects picker and only aspects that are removable can be removed in the manage aspects picker.
       *
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_actions_CreateTemplateContentService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_CREATE_TEMPLATE_CONTENT", lang.hitch(this, this.onCreateTemplateContent));
      },

      /**
       * Creates new content based on the nodeRef supplied.
       *
       * @instance
       * @param {object} payload
       */
      onCreateTemplateContent: function alfresco_services_ActionService__createTemplateContent(payload) {
         if (payload.sourceNodeRef && payload.targetNodeRef)
         {
            if (payload.templateType === "folder")
            {
               // For folder templates we need to request additional information from the user (as they
               // have the opportunity to rename the folder change the title and description)
               this.onPromptForOverrides(payload);
            }
            else
            {
               // For node template types, just make the XHR request to create the node...
               this.createTemplate(payload);
            }
         }
         else
         {
            this.alfLog("error", "A request was made to create by content by template but either the 'sourceNodeRef' or 'targetNodeRef' was not provided", payload, this);
         }
      },

      /**
       * This function requests a dialog to prompt the user as to whether they wish to override any of the 
       * default template data for the new content item.
       *
       * @instance
       * @param {object} payload The payload containing the request data.
       */
      onPromptForOverrides: function alfresco_services_ActionService__onPromptForOverrides(payload) {
         var subscriptionTopic = this.generateUuid();
         var subscriptionHandle = this.alfSubscribe(subscriptionTopic, lang.hitch(this, this.onOverridesProvided));
         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogId: "ALF_CREATE_FOLDER_TEMPLATE_NODE",
            dialogTitle: this.message("create.template.content.dialog.title"),
            formSubmissionTopic: subscriptionTopic,
            formSubmissionPayloadMixin: {
               sourceNodeRef: payload.sourceNodeRef,
               targetNodeRef: payload.targetNodeRef,
               subscriptionHandle: subscriptionHandle,
               urlSuffix: "folder-templates"
            },
            widgets: [
               {
                  id: "FOLDER_TEMPLATE_NAME",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "name",
                     label: this.message("create.template.content.name.label"),
                     description: this.message("create.template.content.name.description"),
                     value: payload.name || ""
                  }
               },
               {
                  id: "FOLDER_TEMPLATE_TITLE",
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "title",
                     label: this.message("create.template.content.title.label"),
                     description: this.message("create.template.content.title.description"),
                     value: payload.title || ""
                  }
               },
               {
                  id: "FOLDER_TEMPLATE_DESCRIPTION",
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     name: "description",
                     label: this.message("create.template.content.description.label"),
                     description: this.message("create.template.content.description.description"),
                     value: payload.description || ""
                  }
               }
            ]
         });
      },

      /**
       * Handles overrides provided by the user, simply unsubscribes any subscription handles contained in
       * the payload and then calls [createTemplate]{@link module:alfresco/services/actions/CreateTemplateContentService#createTemplate}
       * to create the content. 
       * 
       * @param {object} payload The payload from the original request.
       */
      onOverridesProvided: function alfresco_services_ActionService__onOverridesProvided(payload) {
         if (payload.subscriptionHandle)
         {
            this.alfUnsubscribe(payload.subscriptionHandle);
         }
         this.createTemplate(payload);
      },

      /**
       * Makes the XHR request to create the templated content.
       *
       * @instance
       * @param {string} sourceNodeRef The NodeRef of the node to use as the template
       * @param {string} targetNodeRef The NodeRef of the node to create the new content in
       */
      createTemplate: function alfresco_services_ActionService__createTemplate(payload) {
         var url = AlfConstants.PROXY_URI + "slingshot/doclib/" + (payload.urlSuffix || "node-templates");
         var data = {
            parentNodeRef: payload.targetNodeRef,
            sourceNodeRef: payload.sourceNodeRef
         };

         // Add in any additional data provided through user overrides...
         if (payload.name)
         {
            data.prop_cm_name = payload.name;
         }
         if (payload.title)
         {
            data.prop_cm_title = payload.title;
         }
         if (payload.description)
         {
            data.prop_cm_description = payload.description;
         }

         // Make the request to create the node from the template...
         this.serviceXhr({url : url,
                          node: payload.sourceNodeRef,
                          data: data,
                          method: "POST",
                          successCallback: this.templateContentCreateSuccess,
                          failureCallback: this.templateContentCreateFailure,
                          callbackScope: this});
      },

      /**
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      templateContentCreateSuccess: function alfresco_services_ActionService__templateContentCreateSuccess(response, /*jshint unused:false*/ originalRequestConfig) {
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message("create.template.content.success", {
               0: response.name
            })
         });
         this.alfPublish("ALF_NODE_CREATED", {
            name: response.name,
            parentNodeRef: originalRequestConfig.data.parentNodeRef,
            highlightFile: response.name
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {});
      },

      /**
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      templateContentCreateFailure: function alfresco_services_ActionService__templateContentCreateSuccess(response, /*jshint unused:false*/ originalRequestConfig) {
         this.alfPublish("ALF_DISPLAY_PROMPT", {
            title: this.message("create.template.content.failure.title"),
            message: this.message("create.template.content.failure.message", {
               0: response.name
            })
         });
      }
   });
});