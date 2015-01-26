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
 * @module alfresco/header/CurrentUserStatus
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/CurrentUserStatus.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-class",
        "alfresco/dialogs/AlfDialog",
        "alfresco/buttons/AlfButton",
        "dijit/form/Textarea",
        "alfresco/core/TemporalUtils"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, on, domClass, AlfDialog, AlfButton, TextArea, TemporalUtils) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, TemporalUtils], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/CurrentUserStatus"}]
       */
      cssRequirements: [{cssFile:"./css/CurrentUserStatus.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CurrentUserStatus"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CurrentUserStatus.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This indicates whether or not the current user status is known. It is initialised to null but will be set
       * with a boolean value during the postCreate function to indicate whether or not a status was passed as an
       * argument. This could be useful when making a decision on how the status is displayed.
       * 
       * @instance
       * @type {boolean}
       */
      unknownStatus: null,
      
      /**
       * This represents the current user status. It should be provided with a value when the widget is instantiated.
       * 
       * @instance
       * @type {string}
       */
      userStatus: "",
      
      /**
       * This represents the time of the last user status update. It should be provided with a value when the widget
       * is instantiated.
       * 
       * @instance
       * @type {string}
       */
      userStatusTime: null,
      
      /**
       * 
       * @instance
       */
      postCreate: function alfresco_header_CurrentUserStatus__postCreate() {
         // Subscribe to user status updates...
         // This ensures that user status updates can be updated from events other than the user just entering
         // data into the status box...
         this.alfSubscribe("ALF_USER_STATUS_UPDATED", lang.hitch(this, "statusUpdated"));
         
         // Handle requests to set the user status...
         this.alfSubscribe("ALF_SET_USER_STATUS", lang.hitch(this, "showStatusDialog"));
         
         // Check that there is a valid user status and set it appropriately if not...
         if (this.userStatus == "")
         {
            domClass.add(this.statusNode, "blank");
            this.userStatus = this.message("unknown.status.label");
         }
         else
         {
            domClass.remove(this.statusNode, "blank");
         }
         
         // Set the current status...
         this.statusNode.innerHTML = this.userStatus.replace(/\n/g, "<br>").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

         // Set the relative time (the time supplied should be in ISO8061 standard)...
         this.setStatusRelativeTime();
      },
      
      /**
       * This attribute is used to hold a reference to a [dialog]{@link module:alfresco/dialogs/AlfDialog} that can be
       * used to set the user status. It is created on the first call to the [showStatusDialog function]{@link module:alfresco/services/LoggingService#showStatusDialog}.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      statusDialog: null,
      
      /**
       * This is the topic used to subscribe to requests to save logging preferences updated by the 
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       * 
       * @instance
       * @type {string}
       * @default "ALF_POST_NEW_USER_STATUS"
       */
      postNewUserStatusTopic: "ALF_POST_NEW_USER_STATUS",
      
      /**
       * This is the topic used to subscribe to requests to cancel logging preferences updates set in the 
       * [preferences dialog]{@link module:alfresco/services/LoggingService#detailsDialog}.
       * 
       * @instance
       * @type {string}
       * @default "ALF_CANCEL_USER_STATUS_UPDATE"
       */
      cancelUserStatusUpdateTopic: "ALF_CANCEL_USER_STATUS_UPDATE",
      
      /**
       * @instance
       * @param {object} payload
       */
      showStatusDialog: function alfresco_header_CurrentUserStatus__showStatusDialog(payload) {
         if (this.statusDialog == null)
         {
            this.alfSubscribe(this.postNewUserStatusTopic, lang.hitch(this, "postStatus"));
            this.statusDialog = new AlfDialog({
               title: this.message("status.dialog.title"),
               widgetsContent: [
                  {
                     name: "dijit/form/Textarea",
                     config: {
                        id: this.id + "_STATUS_TEXTAREA",
                        name: "status",
                        value: this.unknownStatus ? "" : this.userStatus,
                        style: "width:400px"
                     }
                  }
               ],
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("post.button.label"),
                        publishTopic: this.postNewUserStatusTopic,
                        publishPayload: payload
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("cancel.button.label"),
                        publishTopic: this.cancelUserStatusUpdateTopic,
                        publishPayload: payload
                     }
                  }
               ]
            });
         }
         this.statusDialog.show();
      },
      
      /**
       * This function was originally copied from header.js. PLEASE NOTE: That it still uses the Alfresco.util.relativeTime function which 
       * will be available in Share for the considerable future but at some point this function will need to be ported to the Dojo framework.
       * 
       * @instance
       */
      setStatusRelativeTime: function alfresco_header_CurrentUserStatus__setStatusRelativeTime()
      {
         var relativeTime = (this.userStatusTime == "" || this.userStatusTime == null) ? this.message("status.never-updated") : this.getRelativeTime(this.userStatusTime);
         this.lastUpdateNode.innerHTML = this.message("status.updated", [relativeTime]);
      },
      
      /**
       * Called when the user clicks on the post button from the dialog
       * 
       * @instance
       * @param {object} payload The click event
       */
      postStatus: function alfresco_header_CurrentUserStatus__postStatus(payload) {
         var newStatus = payload.dialogContent[0].getValue();
         this.alfLog("log", "Status payload", payload, newStatus);
         this.alfPublish("ALF_UPDATE_USER_STATUS", {
            status: newStatus
         });
      },
      
      /**
       * This is the handler called when "ALF_USER_STATUS_UPDATED" topics are published. It retrieves
       * the new status (if available) and status update time (if available) and displays them in 
       * the widget.
       *
       * @instance
       * @param {object} payload
       */
      statusUpdated: function alfresco_header_CurrentUserStatus__statusUpdated(payload)
      {
         this.alfLog("log", "User status update", payload);
         
         // Update the user status if provided in the publication payload...
         if (payload.userStatus != null)
         {
            this.userStatus = payload.userStatus;
            if (this.userStatus == "")
            {
               domClass.add(this.statusNode, "blank");
               this.userStatus = this.message("unknown.status.label");
            }
            else
            {
               domClass.remove(this.statusNode, "blank");
            }
            this.statusNode.innerHTML = this.userStatus.replace(/\n/g, "<br>").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
         }
         else
         {
            // No action required.
         }
         
         // Update the user status update time if provided in the publication payload...
         if (payload.userStatusTime)
         {
            this.userStatusTime = payload.userStatusTime;
            this.setStatusRelativeTime();
         }
      }
   });
});