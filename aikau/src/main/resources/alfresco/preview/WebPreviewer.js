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
 * This module is currently a BETA
 *
 * @module alfresco/preview/WebPreviewer
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/window",
        "dojo/dom-style",
        "dojo/sniff"],
        function(declare, _Widget, Core, AlfConstants, lang, on, dom, domConstruct, domGeom, win, domStyle, sniff) {

   return declare([_Widget, Core], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/WebPreviewer.css"}]
       */
      cssRequirements: [{cssFile:"./css/WebPreviewer.css"}],

      /**
       *
       * @instance
       * @param {object[]} args
       */
      constructor: function alfresco_preview_WebPreviewer__constructor(args) {
         lang.mixin(args);

         this.attributes = {
            src: null,
            paging: "false",
            disableI18nInputFix: "false",
            showFullScreenButton: "true",
            showFullWindowButton: "true"
         };
      },

      /**
       *
       *
       * @instance
       */
      setAttributes: function alfresco_preview_WebPreviewer__setAttributes(attributes) {
         var clonedAttributes = lang.clone(attributes);
         lang.mixin(this.attributes, clonedAttributes);
      },


      /**
       * Reference to the div in which the flash movie is placed.
       *
       * @instance
       * @type {HTMLElement}
       * @defaul null
       */
      swfDiv: null,

      /**
       * Remember if we are in full window mode or not, if we are we shall not sync position with the previewer placeholder
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      fullWindowMode: false,

      /**
       * Tests if the plugin can be used in the users browser.
       *
       * @instance
       * @return {String} Returns nothing if the plugin may be used, otherwise returns a message containing the reason
       * it cant be used as a string.
       */
      report: function alfresco_preview_WebPreviewer__report()
      {
         if (!this.previewManager.hasRequiredFlashPlayer(9, 0, 124))
         {
            return this.previewManager.message("label.noFlash");
         }
      },

      /**
       * Display the node.
       *
       * @instance
       */
      display: function alfresco_preview_WebPreviewer__display() {
         var ctx = this.resolveUrls();

         // To support "full window" we create a new div that will float above the rest of the ui
         this.createSwfDiv();

         // Create flash web preview by using swfobject
         // Note! "WebPreviewer_" is used and must match in global js callback methods
         var swfId = "WebPreviewer_" + this.previewManager.id;
         var so = new YAHOO.deconcept.SWFObject(AlfConstants.URL_CONTEXT + "res/components/preview/WebPreviewer.swf",
               swfId, "100%", "100%", "9.0.45");
         so.addVariable("fileName", this.previewManager.name);
         so.addVariable("paging", this.attributes.paging);
         so.addVariable("url", ctx.url);
         // so.addVariable("jsCallback", "Alfresco_WebPreview_WebPreviewerPlugin_onWebPreviewerEvent");
         so.addVariable("i18n_actualSize", this.previewManager.message("preview.actualSize"));
         so.addVariable("i18n_fitPage", this.previewManager.message("preview.fitPage"));
         so.addVariable("i18n_fitWidth", this.previewManager.message("preview.fitWidth"));
         so.addVariable("i18n_fitHeight", this.previewManager.message("preview.fitHeight"));
         so.addVariable("i18n_fullscreen", this.previewManager.message("preview.fullscreen"));
         so.addVariable("i18n_fullwindow", this.previewManager.message("preview.fullwindow"));
         so.addVariable("i18n_fullwindow_escape", this.previewManager.message("preview.fullwindowEscape"));
         so.addVariable("i18n_page", this.previewManager.message("preview.page"));
         so.addVariable("i18n_pageOf", this.previewManager.message("preview.pageOf"));

         so.addVariable("show_fullscreen_button", this.attributes.showFullScreenButton);
         so.addVariable("show_fullwindow_button", this.attributes.showFullWindowButton);
         so.addVariable("disable_i18n_input_fix", this.disableI18nInputFix());

         so.addParam("allowNetworking", "all");
         so.addParam("allowScriptAccess", "sameDomain");
         so.addParam("allowFullScreen", "true");
         so.addParam("wmode", "transparent");

         // Finally create (or recreate) the flash web preview in the new div
         so.write(this.swfDiv);

         /**
          * FF3 and SF4 hides the browser cursor if the flashmovie uses a custom cursor
          * when the flash movie is placed/hidden under a div (which is what happens if a dialog
          * is placed on top of the web previewer) so we must turn off custom cursor
          * when the html environment tells us to.
          */
         on(this.swfDiv, "mouseover", lang.hitch(this, "onMouseOver", swfId));
         on(this.swfDiv, "mouseout", lang.hitch(this, "onMouseOut", swfId));

         // Place the real flash preview div on top of the shadow div
         this.synchronizeSwfDivPosition();
      },

      /**
       *
       * @instance
       * @param {object} evt
       */
      onMouseOver: function alfresco_preview_WebPreviewer__onMouseOver(swfId, evt) {
         var swf = dom.byId(swfId);
         if (swf && typeof swf.setMode === "function")
         {
            swf.setMode("active");
         }
      },

      /**
       *
       * @instance
       * @param {object} evt
       */
      onMouseOut: function alfresco_preview_WebPreviewer__onMouseOut(swfId, evt) {
         var swf = dom.byId(swfId);
         if (swf && typeof swf.setMode === "function")
         {
            swf.setMode("inactive");
         }
      },

      /**
       * Helper method to get the urls to use depending on the given attributes.
       *
       * @instance
       * @return {object} An object containing urls.
       */
      resolveUrls: function alfresco_preview_WebPreviewer__resolveUrls()
      {
         return {
            url: this.attributes.src ? this.previewManager.getThumbnailUrl(this.attributes.src) : this.previewManager.getContentUrl()
         };
      },

      /**
       * Called from the WebPreviewer when a log message has been logged.
       *
       * @instance
       * @param {string} msg The log message
       * @param {string} level The log level
       * @param {string} objectId The id of the embed/object tag that holds WebPreviewer.swf
       */
      onWebPreviewerLogging: function alfresco_preview_WebPreviewer__onWebPreviewerLogging(msg, level, objectId)
      {
         this.alfLog(level, "WebPreviewer(" + objectId + "): " + msg);
      },

      /**
       * Called from the WebPreviewer when an event or error is dispatched.
       *
       * @instance
       * @param {object} event an WebPreview message
       * @param {string} objectId The id of the embed/object tag that holds WebPreviewer.swf
       */
      onWebPreviewerEvent: function alfresco_preview_WebPreviewer__onWebPreviewerEvent(event, objectId)
      {
         if (event.event)
         {
            if (event.event.type == "onFullWindowClick")
            {
               this.fullWindowMode = true;
               var vs = win.getBox();
               domStyle.set(this.swfDiv, {
                  left: vs.x + "px",
                  top: vs.y + "px",
                  width: vs.w + "px",
                  height: vs.h + "px",
                  zIndex: 1000
               });
            }
            else if (event.event.type == "onFullWindowEscape")
            {
               this.fullWindowMode = false;
               this.synchronizeSwfDivPosition();
            }
         }
         else if (event.error)
         {
            // Inform the user about the failure
            var message = "Error";
            if (event.error.code)
            {
               message = this.previewManager.message("error." + event.error.code);
            }
            Alfresco.util.PopupManager.displayMessage(
            {
               text: message
            });
         }
      },

      /**
       *
       * Overriding this method to implement a os/browser version dependent version that decides
       * if the i18n fix described for the disableI18nInputFix option shall be disabled or not.
       *
       * @instance
       * @return {boolean}
       */
      disableI18nInputFix: function alfresco_preview_WebPreviewer__resolvePreview(event)
      {
         // Override this method if you want to turn off the fix for a specific client
         return this.attributes.disableI18nInputFix;
      },

      /**
       * To support full window mode an extra div (realSwfDivEl) is created with absolute positioning
       * which will have the same position and dimensions as shadowSfwDivEl.
       * The realSwfDivEl element is to make sure the flash move is on top of all other divs and
       * the shadowSfwDivEl element is to make sure the previewer takes the screen real estate it needs.
       *
       * @instance
       */
      createSwfDiv: function alfresco_preview_WebPreviewer__createSwfDiv()
      {
         if (!this.swfDiv)
         {

            // MNT-12816 - Calculate specific height for div by using height of dialogPane
            var dialogPane = document.getElementsByClassName("dijitDialogPaneContent")[0],
                swfDivHeight = "100%",
                footer;

            if (dialogPane)
            {
               footer = dialogPane.lastChild;
               if (footer)
               {
                  swfDivHeight = dialogPane.clientHeight - footer.clientHeight;
                  swfDivHeight += "px";
               }
            }

            var element = this.previewManager.getPreviewerElement();
            domConstruct.empty(element);
            var realSwfDivEl = domConstruct.create("div", {
               id: this.previewManager.id + "-full-window-div",
               style: {
                  height: swfDivHeight
               },
               className: "web-preview real"
            }, element);
            this.swfDiv = realSwfDivEl;
         }
      },

      /**
       * Positions the one element over another
       *
       * @instance
       */
      synchronizeSwfDivPosition: function alfresco_preview_WebPreviewer__synchronizePosition()
      {
         if (!this.fullWindowMode)
         {
            var element = this.previewManager.getPreviewerElement();
            if (element != null)
            {
               var posOutput = domGeom.position(element);
               domStyle.set(this.swfDiv, {
                  left: posOutput.x + "px",
                  top: posOutput.y + "px",
                  width: posOutput.w + "px",
                  height: posOutput.h + "px",
                  zIndex: 1000
               });
            }
         }
      }
   });
});