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
 * This module is used exclusively in client-debug mode in order to provide information about a specific
 * widget. It is intended to provide a developer with information about the ID of a widget and a code
 * snippet that can be used in a Surf Extension to find the widget in the model in order to work with it.
 * 
 * @module alfresco/debug/WidgetInfo
 * @extends module:aikau/core/BaseWidget
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/WidgetInfoData.html",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/_base/lang",
        "dojo/string"], 
        function(declare, BaseWidget, _OnDijitClickMixin, dataTemplate, TooltipDialog, popup, lang, string) {
   
   return declare([BaseWidget, _OnDijitClickMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/WidgetInfo.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/WidgetInfo.properties"}],
      
      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.100
       */
      createWidgetDom: function alfresco_debug_WidgetInfo__createWidgetDom() {
         this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-debug-WidgetInfo");
         
         var imgNode = document.createElement("img");
         imgNode.classList.add("image");
         imgNode.setAttribute("src", this.imgSrc);
         imgNode.setAttribute("alt", this.altText);
         this._attach(imgNode, "ondijitclick", lang.hitch(this, this.showInfo));

         this.domNode.appendChild(imgNode);
      },

      /**
       * Sets up the image source and it's alt text.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_debug_WidgetInfo__postMixInProperties() {
         this.imgSrc = require.toUrl("alfresco/debug/css/images/info-16.png");
         if (this.displayId)
         {
            this.altText = this.message("widgetInfo.alt.text", {
               0: this.displayId
            });
         }
         else
         {
            this.altText = this.message("widgetInfo.unknown.alt.text");
         }
      },

      /**
       * Handles clicking on the info image and displays a tooltip dialog with information about the
       * selecte widget.
       * 
       * @instance
       * @param {object} evt Dojo-normalised event object
       */
      showInfo: function alfresco_debug_WidgetInfo__showInfo(evt) {
         if (!this.ttd)
         {
            this.displayIdLabel = this.message("widgetInfo.displayId.label");
            this.displayTypeLabel = this.message("widgetInfo.displayType.label");
            this.displaySnippetLabel = this.message("widgetInfo.displaySnippetLabel.label");
            if (this.displayId !== "")
            {
               this.displaySnippet = "widgetUtils.findObject(model.jsonModel.widgets, \"id\", \"" + this.displayId + "\");";
            }
            else
            {
               this.displaySnippet = "// No widget ID defined";
            }
            var content = string.substitute(dataTemplate, this);
            this.ttd = new TooltipDialog({
               id: this.id + "___TOOLTIP",
               baseClass: "alfresco-debug-WidgetInfoDialog",
               content: content,
               onShow: function(){
                 this.focus();
               },
               _onBlur: function(){
                  popup.close(this.ttd);
               }
            });
         }

         popup.open({
            popup: this.ttd,
            around: this.domNode,
            onCancel: function(){
               popup.close(this.ttd);
            }
         });

         // Prevent bubbling
         evt && evt.stopPropagation();
      }
   });
});