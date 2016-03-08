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
 * 
 *
 * @module alfresco/services/actions/EditOnlineService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.60
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/PathUtils",
        "alfresco/core/topics",
        "alfresco/core/ArrayUtils",
        "service/constants/Default",
        "alfresco/core/FileIconUtils",
        "alfresco/core/ObjectTypeUtils", 
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/sniff",
        "alfresco/forms/controls/Select"],
        function(declare, BaseService, AlfCoreXhr, PathUtils, topics, ArrayUtils, AlfConstants, FileIconUtils, ObjectTypeUtils, lang, array, sniff) {

   return declare([BaseService, AlfCoreXhr, PathUtils], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/EditOnlineService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/EditOnlineService.properties"}],

      /**
       * A map of file extensions to the application MIME type.
       * 
       * @instance
       * @type {object}
       */
      extensionMap: {
         doc: "application/msword",
         docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
         docm: "application/vnd.ms-word.document.macroenabled.12",
         dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
         dotm: "application/vnd.ms-word.template.macroenabled.12",

         ppt: "application/vnd.ms-powerpoint",
         pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
         pptm: "application/vnd.ms-powerpoint.presentation.macroenabled.12",
         ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
         ppsm: "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
         potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
         potm: "application/vnd.ms-powerpoint.template.macroenabled.12",
         ppam: "application/vnd.ms-powerpoint.addin.macroenabled.12",
         sldx: "application/vnd.openxmlformats-officedocument.presentationml.slide",
         sldm: "application/vnd.ms-powerpoint.slide.macroEnabled.12",

         xls: "application/vnd.ms-excel",
         xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
         xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
         xltm: "application/vnd.ms-excel.template.macroenabled.12",
         xlam: "application/vnd.ms-excel.addin.macroenabled.12",
         xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12"
      },

      /**
       * A map of file extensions to Microsoft protocol names.
       * 
       * @instance
       * @type {object}
       */
      msProtocolNames: {
         "doc"  : "ms-word",
         "docx" : "ms-word",
         "docm" : "ms-word",
         "dot"  : "ms-word",
         "dotx" : "ms-word",
         "dotm" : "ms-word",
         "xls"  : "ms-excel",
         "xlsx" : "ms-excel",
         "xlsb" : "ms-excel",
         "xlsm" : "ms-excel",
         "xlt"  : "ms-excel",
         "xltx" : "ms-excel",
         "xltm" : "ms-excel",
         "ppt"  : "ms-powerpoint",
         "pptx" : "ms-powerpoint",
         "pot"  : "ms-powerpoint",
         "potx" : "ms-powerpoint",
         "potm" : "ms-powerpoint",
         "pptm" : "ms-powerpoint",
         "pps"  : "ms-powerpoint",
         "ppsx" : "ms-powerpoint",
         "ppam" : "ms-powerpoint",
         "ppsm" : "ms-powerpoint",
         "sldx" : "ms-powerpoint",
         "sldm" : "ms-powerpoint"
      },

      /**
       * Registers change type subscriptions.
       *
       * @instance
       * @listens module:alfresco/core/topics#EDIT_ONLINE_REQUEST
       */
      registerSubscriptions: function alfresco_services_actions_EditOnlineService__registerSubscriptions() {
         this.alfSubscribe(topics.EDIT_ONLINE_REQUEST, lang.hitch(this, this.onEditOnlineRequest));
      },

      /**
       * 
       * @instance
       * @param {object} item The item to perform the action on
       */
      onEditOnlineRequest: function alfresco_services_actions_EditOnlineService__onEditOnlineRequest(payload) {
         var item = payload.node;
         this.serviceXhr({
            method: "GET",
            item: item,
            url: AlfConstants.PROXY_URI + "slingshot/doclib2/node/"  + item.nodeRef.replace("://", "/"),
            successCallback: this.internalEditOnlineAos,
            callbackScope: this
         });
      },

      /**
       * 
       * @instance
       * @param  {[type]} response              [description]
       * @param  {[type]} originalRequestConfig [description]
       */
      internalEditOnlineAos: function alfresco_services_actions_EditOnlineService__internalEditOnlineAos(response, originalRequestConfig) {
         var item = originalRequestConfig.item;
         var jsonNode = JSON.parse(response.serverResponse.responseText);
         if (jsonNode)
         {
            var node = jsonNode.item.node;
            if (node.isLocked)
            {
               var checkedOut = ArrayUtils.arrayContains(node.aspects,"cm:checkedOut");
               var lockOwner = node.properties["cm:lockOwner"]; 
               var differentLockOwner = lockOwner.userName !== AlfConstants.USERNAME;

               // If locked for offline editing, ask for user's confirmation to continue with online editing
               if (checkedOut && differentLockOwner)
               { 
                  this.onAlreadyLockedConfirmation(item, lockOwner);
               }
               else
               {
                  this.triggerEditOnlineAos(item);
               }
            }
            else
            {
               this.triggerEditOnlineAos(item);
            }
         }
      },

      /**
       * 
       * @instance
       * @param  {[type]} record    [description]
       * @param  {[type]} lockOwner [description]
       */
      onAlreadyLockedConfirmation: function alfresco_services_actions_EditOnlineService__onAlreadyLockedConfirmation(record, lockOwner) {
          var me = this;
          Alfresco.util.PopupManager.displayPrompt(
          {
              title: this.msg("message.edit-online-aos.edit_offline_locked.title", lockOwner.displayName.length > 0 ? lockOwner.displayName : lockOwner.userName ),
              text: this.msg("message.edit-online-aos.edit_offline_locked.message"),
              buttons: [
                  {
                      text: this.msg("message.edit-online-aos.edit_offline_locked.confirm"),
                      handler: function dlA_onAlreadyLockedConfirmation_confirm()
                      {
                          this.destroy();
                          me.triggerEditOnlineAos(record);
                      }
                  },
                  {
                      text: this.msg("message.edit-online-aos.edit_offline_locked.cancel"),
                      handler: function dlA_onAlreadyLockedConfirmation_cancel()
                      {
                          this.destroy();
                      },
                      isDefault: true
                  }
              ]
          });
      },
      
      /**
       * 
       * @instance
       * @param  {[type]} record [description]
       */
      triggerEditOnlineAos: function alfresco_services_actions_EditOnlineService__triggerEditOnlineAos(record) {
         if (!ObjectTypeUtils.isValueSet(record.onlineEditUrlAos))
         {
            record.onlineEditUrlAos = Alfresco.util.onlineEditUrlAos(this.doclistMetadata.custom.aos, record);
         }

         var fileExtension = Alfresco.util.getFileExtension(record.location.file);
         fileExtension = fileExtension != null ? fileExtension.toLowerCase() : fileExtension;
         var protocolHandler = this.getProtocolForFileExtension(fileExtension);

         if(protocolHandler === undefined)
         {
            Alfresco.logger.error("onActionEditOnlineAos", "No protocol handler available for file extension.");
            return;
         }

         var officeLauncher = new EmbeddedOfficeLauncher();

         if(officeLauncher.isIOS())
         {
            this.launchOfficeOnIos(officeLauncher, protocolHandler, record.onlineEditUrlAos);
            return;
         }

         // detect if we are on a supported operating system
         if(!officeLauncher.isWin() && !officeLauncher.isMac())
         {
             Alfresco.util.PopupManager.displayMessage(
             {
                text: this.msg("message.edit-online-aos.no_supported_environment")
             });
             return;
         }

         // if we have a working PlugIn (ActiveX or NPAPI), use it. Otherwise we use the protocol handler (e.g. Chrome w/o PlugIn)
         if(officeLauncher.isAvailable())
         {
             this.launchOfficeByPlugin(officeLauncher, record.onlineEditUrlAos);
         }
         else
         {
             this.tryToLaunchOfficeByMsProtocolHandler(officeLauncher, protocolHandler, record.onlineEditUrlAos);
         }

         return;
      },

      /**
       * 
       * @instance
       * @param  {[type]} officeLauncher [description]
       * @param  {[type]} url            [description]
       */
      launchOfficeByPlugin: function alfresco_services_actions_EditOnlineService__launchOfficeByPlugin(officeLauncher, url) {
         var checker, dlg;
         var isNotIE = (officeLauncher.isFirefox() || officeLauncher.isChrome() || officeLauncher.isSafari());
         if (!officeLauncher.EditDocument(url))
         {
            // check if the Plug-In has been blocked
            if (officeLauncher.isControlNotActivated() && isNotIE)
            {
               checker = window.setInterval(function()
               {
                  if (officeLauncher.isControlActivated())
                  {
                     window.clearInterval(checker);
                     dlg.destroy();
                     window.setTimeout(function()
                     {
                        if (!officeLauncher.EditDocument(url))
                        {
                           if (officeLauncher.getLastControlResult() !== -2)
                           {
                              var errorDetails = officeLauncher.getLastControlResult() !== false ? " (Error code: " + officeLauncher.getLastControlResult() + ")" : "";
                              Alfresco.util.PopupManager.displayMessage(
                              {
                                 text: this.msg("message.edit-online-aos.starting_office_failed") + errorDetails
                              });
                           }
                        }
                        else
                        {
                           YAHOO.Bubbling.fire("metadataRefresh");
                        }
                     }, 50);
                  }
               }, 250);
               var dlg = new YAHOO.widget.SimpleDialog("prompt",
               {
                        close: false,
                        constraintoviewport: true,
                        draggable: false,
                        effect: null,
                        modal: true,
                        visible: true,
                        zIndex: 9999
               });
               var dlgMessageKey = "message.edit-online-aos.plugin_blocked.body.firefox";
               if(officeLauncher.isFirefox())
               {
                   dlgMessageKey = "message.edit-online-aos.plugin_blocked.body.firefox";
               }
               else if(officeLauncher.isChrome())
               {
                   dlgMessageKey = "message.edit-online-aos.plugin_blocked.body.chrome";
               }
               else if(officeLauncher.isSafari())
               {
                   dlgMessageKey = "message.edit-online-aos.plugin_blocked.body.safari";
               }
               dlg.setHeader(this.msg("message.edit-online-aos.plugin_blocked.caption"));
               dlg.setBody(this.msg(dlgMessageKey));
               dlg.cfg.queueProperty("buttons", [ {
                     text: this.msg("message.edit-online-aos.plugin_blocked.button_dismiss"),
                     handler: function() {
                        window.clearInterval(checker);
                        this.destroy();
                     },
                     isDefault: true
               }]);
               dlg.render(document.body);
               dlg.center();
               dlg.show();
            }
            else
            {
               if (officeLauncher.getLastControlResult() !== -2)
               {
                  // error message only required if user did not cancel (result === -2)
                  var errorDetails = officeLauncher.getLastControlResult() !== false ? " (Error code: " + officeLauncher.getLastControlResult() + ")" : "";
                  Alfresco.util.PopupManager.displayMessage(
                  {
                     text: this.msg("message.edit-online-aos.starting_office_failed") + errorDetails
                  });
               }
            }
         }
         else
         {
            YAHOO.Bubbling.fire("metadataRefresh");
         }
      },

      /**
       * 
       * @instance
       * @param  {[type]} officeLauncher  [description]
       * @param  {[type]} protocolHandler [description]
       * @param  {[type]} url             [description]
       */
      tryToLaunchOfficeByMsProtocolHandler: function alfresco_services_actions_EditOnlineService__tryToLaunchOfficeByMsProtocolHandler(officeLauncher, protocolHandler, url) {
          var protocolUrl = protocolHandler + ":ofe%7Cu%7C" + url;
          var protocolHandlerPresent = false;

          var input = document.createElement("input");
          var inputTop = document.body.scrollTop + 10;
          input.setAttribute("style", "z-index: 1000; background-color: rgba(0, 0, 0, 0); border: none; outline: none; position: absolute; left: 10px; top: "+inputTop+"px;");
          document.getElementsByTagName("body")[0].appendChild(input);
          input.focus();
          input.onblur = function() {
              protocolHandlerPresent = true;
          };
          input.context = this;
          location.href = protocolUrl;
          setTimeout(function()
          {
              input.onblur = null;
              input.remove();
              if(!protocolHandlerPresent)
              {
                  Alfresco.util.PopupManager.displayMessage(
                  {
                      text: input.context.msg("message.edit-online-aos.supported_office_version_required")
                  });
              }
          }, 500);
      },

      /**
       * 
       * @instance
       * @param  {[type]} officeLauncher  [description]
       * @param  {[type]} protocolHandler [description]
       * @param  {[type]} url             [description]
       */
      launchOfficeOnIos: function alfresco_services_actions_EditOnlineService__launchOfficeOnIos(officeLauncher, protocolHandler, url) {
         var protocolUrl = protocolHandler + ":ofe%7Cu%7C" + officeLauncher.encodeUrl(url);
         var iframe = document.createElement("iframe");
         iframe.setAttribute("style", "display: none; height: 0; width: 0;");
         document.getElementsByTagName("body")[0].appendChild(iframe);
         iframe.src = protocolUrl;
      }
   });
});