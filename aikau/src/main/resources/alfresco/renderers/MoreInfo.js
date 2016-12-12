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
 * @module alfresco/renderers/MoreInfo
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/ObjectTypeUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_XhrActionsMixin",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/lists/views/layouts/Popup",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/event"],
        function(declare, BaseWidget, _OnDijitClickMixin, _XhrActionsMixin, ObjectProcessingMixin, 
                 ObjectTypeUtils, Popup, lang, domClass, event) {

   return declare([BaseWidget, _OnDijitClickMixin, _XhrActionsMixin, ObjectProcessingMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/MoreInfo"}]
       */
      cssRequirements: [{cssFile:"./css/MoreInfo.css"}],

      /**
       * The array of file(s) containing internationalised strings.
       *
       * @instance
       * @type {object}
       * @default [{i18nFile: "./i18n/MoreInfo.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/MoreInfo.properties"}],

      /**
       * This is the object that the property to be rendered will be retrieved from.
       *
       * @instance
       * @type {object}
       * @default
       */
      currentItem: null,

      /**
       * This is used to hold a reference to the information dialog that is popped up when the widget is clicked.
       * The dialog is not instantiated until the first time that a user requests additional information.
       *
       * @instance
       * @type {object}
       * @default
       */
      moreInfoDialog: null,

      /**
       * Used to indicate whether or not the info to display needs to be asynchronously retrieved. Defaults
       * to false assuming that all the data required is currently available in "currentItem".
       *
       * @instance
       * @type {boolean}
       * @default
       */
      xhrRequired: false,

      /**
       * Indicates whether or not the More Info icon should be dark (for displaying on a light background).
       * For historical reasons this defaults to false.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      darkIcon: false,

      /**
       *
       * @instance
       * @type {string}
       * @default
       */
      altText: "moreinfo.altTextWithContext.label",

      /**
       * The prefix string that indicates the start of text to highlight.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.93
       */
      highlightPrefix: "\u0000",

      /**
       * This is the property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#highlightProperty}
       * that should be used to identify the content with in the 
       * [renderedValue]{@link module:alfresco/renderers/Property#renderedValue} to highlight.
       * 
       * @instance
       * @type {string}
       * @default 
       * @since 1.0.93
       */
      highlightPostfix: "\u0003",

      /**
       * This is required for ensure that the alt text is meaningful. It is the value to include in the alt text
       * and title attributes that identifies the item to the user.
       *
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: "displayName",

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_MoreInfo__createWidgetDom() {
         this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-MoreInfo");
         this.domNode.setAttribute("tabindex", "0");
         this.domNode.setAttribute("alt", this.alfText);
         this.domNode.setAttribute("title", this.title);
         this.domNode.innerHTML = "&nbsp;";
         this._attach(this.domNode, "ondijitclick", lang.hitch(this, this.onMoreInfo));
      },

      /**
       * Gets the correct localized alt and title text.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_MoreInfo__postMixInProperties() {
         /*jshint eqnull:true*/
         if (this.altText == null)
         {
            this.altText = "";
         }
         else if (this.propertyToRender != null &&
                  this.currentItem != null &&
                  this.currentItem[this.propertyToRender])
         {

            this.altText = this.message(this.altText, {
               0: (this.currentItem != null ? this.currentItem[this.propertyToRender] : "")
            });
            this.altText = this.altText.replace(new RegExp(this.highlightPrefix, "g"), "").replace(new RegExp(this.highlightPostfix, "g"), "");
         }
         else
         {
            this.altText = this.message(this.altText);
         }
      },

      /**
       * Updates the CSS if required to
       *
       * @instance
       */
      postCreate: function alfresco_renderers_MoreInfo__postCreate() {
         if (this.darkIcon === true)
         {
            domClass.add(this.domNode, "darkIcon");
         }
      },

      /**
       * This is called when the user clicks on the "info" symbol and creates a new
       * [popup]{@link module:alfresco/lists/views/layouts/Popup} containing the info
       * to be displayed.
       *
       * @instance
       * @param {object} evt The click event.
       */
      onMoreInfo: function alfresco_renderers_MoreInfo__onMoreInfo(evt) {
         /*jshint eqnull:true*/
         event.stop(evt);
         if (this.moreInfoDialog == null)
         {
            if (this.xhrRequired === true)
            {
               this.getXhrData();
            }
            else
            {
               this.createMoreInfoDialog();
            }
         }
         else
         {
            this.moreInfoDialog.show();
         }
      },

      /**
       * Creates the dialog containing the information to be displayed
       *
       * @instance
       */
      createMoreInfoDialog: function alfresco_renderers_MoreInfo__createMoreInfoDialog() {
         var title = "";
         if (ObjectTypeUtils.isObject(this.currentItem) && lang.exists("displayName", this.currentItem))
         {
            title = lang.getObject("displayName", false, this.currentItem);
         }

         var widgetsContent = lang.clone(this.widgets);
         this.processObject(["processInstanceTokens"], widgetsContent);
         this.moreInfoDialog = new Popup({
            title: title,
            currentItem: this.currentItem,
            widgetsContent: widgetsContent,
            handleOverflow: false
         });
         this.moreInfoDialog.show();
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/_XhrActionsMixin#clearLoadingItem}
       * to intentionally perform no action.
       *
       * @instance
       */
      clearLoadingItem: function alfresco_renderers_MoreInfo__clearLoadingItem() {
         // No action by design.
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/_XhrActionsMixin#addXhrItems}
       * to create the dialog with the requested data by calling the
       * [createMoreInfoDialog function]{@link module:alfresco/renderers/MoreInfo#createMoreInfoDialog}.
       *
       * @instance
       */
      addXhrItems: function alfresco_renderers_MoreInfo__addXhrItems() {
         this.createMoreInfoDialog();
      },

      /**
       * The default set of allowed actions defined as a stringified array. This will be token switched into the
       * [Actions]{@link module:alfresco/renderers/Actions} widget. The reality is that unless an alternative value
       * is specified this will always be the action white-list for the [Actions]{@link module:alfresco/renderers/Actions}
       * when viewed in the More Info dialog.
       *
       * @instance
       */
      allowedActionsString: "["+
         "\"document-download\","+
         "\"document-view-content\","+
         "\"document-view-details\","+
         "\"folder-view-details\","+
         "\"document-edit-metadata\","+
         "\"document-inline-edit\","+
         "\"document-manage-granular-permissions\","+
         "\"document-manage-repo-permissions\","+
         "\"document-view-original\","+
         "\"document-view-working-copy\","+
         "\"folder-manage-rules\","+
         "\"document-view-googlemaps\","+
         "\"document-view-in-source-repository\","+
         "\"document-view-in-cloud\","+
         "\"document-delete\","+
         "\"document-edit-offline\","+
         "\"folder-download\","+
         "\"document-copy-to\","+
         "\"document-move-to\","+
         "\"document-locate\","+
         "\"document-assign-workflow\","+
         "\"document-cancel-editing\"]",

      /**
       * The default JSON model for the widgets to add to the dialog.
       * @instance
       * @type {object[]}
       *
       */
      widgets: [
         {
            name: "alfresco/lists/views/layouts/Table",
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
                                       name: "alfresco/renderers/Thumbnail",
                                       config: {
                                          renditionName: "imgpreview"
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
                                       name: "alfresco/renderers/Actions",
                                       config: {
                                          filterActions: true,
                                          allowedActionsString: "{allowedActionsString}"
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/InlineEditProperty",
                                       config: {
                                          propertyToRender: "node.properties.cm:name",
                                          permissionProperty: "node.permissions.user.Write",
                                          postParam: "prop_cm_name",
                                          renderSize: "large",
                                          publishTopic: "ALF_CRUD_CREATE",
                                          publishPayloadType: "PROCESS",
                                          publishPayloadModifiers: ["processCurrentItemTokens"],
                                          publishPayloadItemMixin: false,
                                          publishPayload: {
                                             url: "api/node/{jsNode.nodeRef.uri}/formprocessor",
                                             noRefresh: false,
                                             successMessage: "moreInfo.inlineEdit.update.success"
                                          },
                                          requirementConfig: {
                                             initialValue: true
                                          },
                                          validationConfig: [
                                             {
                                                validation: "regex",
                                                // NOTE: Ignore JSHint error on following line
                                                regex: "([\"\*\\\>\<\?\/\:\|]+)|([\.]?[\.]+$)",
                                                errorMessage: "moreinfo.invalid.name",
                                                invertRule: true
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/InlineEditProperty",
                                       config: {
                                          propertyToRender: "node.properties.cm:title",
                                          permissionProperty: "node.permissions.user.Write",
                                          postParam: "prop_cm_title",
                                          renderSize: "small",
                                          warnIfNotAvailable: true,
                                          warnIfNotAvailableMessage: "no.title.message",
                                          renderedValuePrefix: "(",
                                          renderedValueSuffix: ")",
                                          publishTopic: "ALF_CRUD_CREATE",
                                          publishPayloadType: "PROCESS",
                                          publishPayloadModifiers: ["processCurrentItemTokens"],
                                          publishPayloadItemMixin: false,
                                          publishPayload: {
                                             url: "api/node/{jsNode.nodeRef.uri}/formprocessor",
                                             noRefresh: false,
                                             successMessage: "moreInfo.inlineEdit.update.success"
                                          }
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/Version",
                                       config: {
                                          renderFilterMethod: "ALL",
                                          renderFilter: [
                                             {
                                                property: "node.isContainer",
                                                values: [false]
                                             },
                                             {
                                                property: "workingCopy.isWorkingCopy",
                                                values: [false],
                                                renderOnAbsentProperty: true
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/Date",
                                       config: {
                                          deemphasized: true,
                                          renderSize: "small"
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/Size",
                                       config: {
                                          deemphasized: true,
                                          renderSize: "small"
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 widgets: [
                                    {
                                       name: "alfresco/renderers/InlineEditProperty",
                                       config: {
                                          propertyToRender: "node.properties.cm:description",
                                          permissionProperty: "node.permissions.user.Write",
                                          renderSize: "small",
                                          postParam: "prop_cm_description",
                                          warnIfNotAvailable: true,
                                          warnIfNotAvailableMessage: "no.description.message",
                                          publishTopic: "ALF_CRUD_CREATE",
                                          publishPayloadType: "PROCESS",
                                          publishPayloadModifiers: ["processCurrentItemTokens"],
                                          publishPayloadItemMixin: false,
                                          publishPayload: {
                                             url: "api/node/{jsNode.nodeRef.uri}/formprocessor",
                                             noRefresh: false
                                          }
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  },
                  {
                     name: "alfresco/lists/views/layouts/Row",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/lists/views/layouts/Cell",
                              config: {
                                 renderFilter: [
                                    {
                                       property: "workingCopy.isWorkingCopy",
                                       values: [false],
                                       renderOnAbsentProperty: true
                                    }
                                ],
                                widgets: [
                                    {
                                       name: "alfresco/renderers/Favourite"
                                    },
                                    {
                                       name: "alfresco/renderers/Separator"
                                    },
                                    {
                                       name: "alfresco/renderers/Like"
                                    },
                                    {
                                       name: "alfresco/renderers/Separator"
                                    },
                                    {
                                       name: "alfresco/renderers/Comments"
                                    },
                                    {
                                       name: "alfresco/renderers/Separator",
                                       config: {
                                          renderFilter: [
                                             {
                                                property: "node.isContainer",
                                                values: [false]
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       name: "alfresco/renderers/QuickShare",
                                       config: {
                                          renderFilterMethod: "ALL",
                                          renderFilter: [
                                             {
                                                property: "node.isContainer",
                                                values: [false]
                                             },
                                             {
                                                property: "node.permissions.user.Write",
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
            }
         }
      ]
   });
});