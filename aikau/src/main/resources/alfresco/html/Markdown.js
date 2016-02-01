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
 * @module alfresco/html/Markdown
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Markdown.html",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "showdown"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreXhr, AlfConstants, lang, array, showdown) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreXhr], {

      i18nRequirements: [{i18nFile: "./i18n/Markdown.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Markdown.css"}]
       */
      cssRequirements: [{cssFile:"./css/Markdown.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * An array of topics to subscribe to that when published on will update the data.
       * 
       * @instance
       * @type {string[]}
       */
      subscriptionTopics: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_html_Markdown__postCreate() {

         if (this.subscriptionTopics)
         {
            array.forEach(this.subscriptionTopics, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, this.onMarkdownUpdate));
            } ,this);
         }
         
         this.converter = new showdown.Converter({
            strikethrough: true,
            tables: true
         });
         this._converterReady = true;

         // If we have initial markdown then ensure that it is safe to be used...
         this.markdown && this.updateMarkdown(this.markdown);
         
      },

      /**
       * @instance
       */
      updateMarkdown: function alfresco_html_Markdown__updateMarkdown(markdown) {
         if (markdown)
         {
            if (this._requestInProgress)
            {
               this._pendingMarkdown = markdown;
            }
            else
            {
               // Convert markdown to HTML...
               var html = this.converter.makeHtml(markdown);

               // Sanitize the output to ensure it is safe to render...
               var url = AlfConstants.URL_SERVICECONTEXT + "sanitize/data";
               if (url) {
                  this.serviceXhr({
                     url: url,
                     data: {
                        data: html
                     },
                     method: "POST",
                     successCallback: this.sanitizeSuccess,
                     failureCallback: this.sanitizeFailure,
                     callbackScope: this
                  });
               }
            }
         }
      },

      /**
       * @instance
       */
      checkForPendingMarkdown: function alfresco_html_Markdown__checkForPendingMarkdown() {
         this._requestInProgress = false;
         if (this._pendingMarkdown)
         {
            this.updateMarkdown(this._pendingMarkdown);
            this._pendingMarkdown = null;
         }
      },

      /**
       * @instance
       */
      onMarkdownUpdate: function alfresco_html_Markdown__onMarkdownUpdate(payload) {
         payload.markdown && this.updateMarkdown(payload.markdown);
      },

      /**
       * @instance
       * @param  {object} response
       * @param  {object} originalRequestConfig
       */
      sanitizeSuccess: function alfresco_html_Markdown__sanitizeSuccess(response, /*jshint unused:false*/ originalRequestConfig) {
         this.domNode.innerHTML = response.data;
      },

      /**
       * @instance
       * @param  {object} response
       * @param  {object} originalRequestConfig
       */
      sanitizeFailure: function alfresco_html_Markdown__sanitizeFailure(response, originalRequestConfig) {
         this.alfLog("warn", "It was not possible to sanitize the converted markdown", response, originalRequestConfig, this);
      }
   });
});