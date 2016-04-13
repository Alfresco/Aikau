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
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/BaseWidget",
        "alfresco/core/_ConstructedWidgetMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/WidgetInfoData.html",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/on",
        "dijit/a11yclick",
        "dijit/TooltipDialog",
        "dijit/popup",
        "dojo/string"], 
        function(declare, BaseWidget, _ConstructedWidgetMixin, _OnDijitClickMixin, dataTemplate, lang, domConstruct, on, a11yclick, TooltipDialog, popup, string) {
   
   return declare([BaseWidget, _ConstructedWidgetMixin, _OnDijitClickMixin], {
      
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
       * Builds the DOM structure.
       * 
       * @instance buildDOMStructure
       */
      buildDOMStructure : function alfresco_debug_WidgetInfo__buildDOMStructure(rootNode) {
          var nodeProps = this._buildDOMNodeProperties();
          
          nodeProps.className += " ";
          nodeProps.className += "alfresco-debug-WidgetInfo";
          
          this.domNode = domConstruct.create("div", nodeProps, rootNode);
          
          nodeProps = {
              className : "image",
              src : this.imgSrc,
              alt : this.altText
           };
          this.imgNode = domConstruct.create("img", nodeProps, this.domNode);
      },
      
      setupEvents : function alfresco_debug_WidgetInfo__setupEvents() {
          this.own(on(this.imgNode, a11yclick, lang.hitch(this, this.showInfo)));
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