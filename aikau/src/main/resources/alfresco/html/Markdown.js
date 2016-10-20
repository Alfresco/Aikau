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
 * <p>A simple markdown rendering widget. This module uses [Showdown]{@link https://github.com/showdownjs/showdown} to convert
 * markdown to HTML. In order to prevent any malicious content from being added to the browser DOM, all generated HTML is
 * passed through the "stripUnsafeHTML" function provided on the server by Surf. This does require an XHR call to made which
 * may reduce rendering speed - but ensures that the widget is not prone to XSS style attacks.</p>
 * <p>It is possible to provide initial rendering via the [markdown]{@link module:alfresco/html/Markdown#markdown} attribute
 * and it is also possible to allow markdown to be dynamically updated by configuring one or more 
 * [subscriptionTopics]{@link module:alfresco/html/Markdown#subscriptionTopics}.</p>
 *
 * @example <caption>Simple markdown example:</caption>
 * {
 *   name: "alfresco/html/Markdown",
 *   config: {
 *     markdown: "# H1\n## H2"
 *   }
 * }
 *
 * @example <caption>Example with subscription topics for dynamic updates:</caption>
 * {
 *   name: "alfresco/html/Markdown",
 *   config: {
 *     markdown: "# H1\n## H2",
 *     subscriptionTopics: ["UPDATE_MARKDOWN","CHANGE_CONTENT"]
 *   }
 * }
 * 
 * @module alfresco/html/Markdown
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.53
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Markdown.html",
        "alfresco/core/CoreXhr",
        "webscripts/defaults",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "showdown"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, CoreXhr, webScriptDefaults, AlfConstants, lang, array, showdown) {
   
   return declare([_WidgetBase, _TemplatedMixin, CoreXhr], {

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Some initial markdown content to convert to HTML.
       * 
       * @instance
       * @type {string}
       * @default
       */
      markdown: null,

      /**
       * An array of topics to subscribe to that when published on will update the data. Payloads published on the topics must
       * contain an attribute called 'markdown' in order to the requested data to be rendered.
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      subscriptionTopics: null,

      /**
       * This is used to store the last requested markdown update when a [request is in progress]{@link module:alfresco/html/Markdown#_requestInProgress}
       * to sanitize the HTML generated from the last markdown update request.
       *
       * @instance
       * @type {string}
       * @default
       */
      _pendingMarkdown: null,

      /**
       * This boolean flag is used internally to indicate whether or not a request is currently being made to sanitize the HTML
       * rendered for markdown provided. If this flag is set to true then markdown update requests will be stored assigned to 
       * [_pendingMarkdown]{@link module:alfresco/html/Markdown#_pendingMarkdown} and will be converted to HTML and sanitized
       * once the request in progress is made.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      _requestInProgress: false,

      /**
       * Subscribes to any [subscriptionTopics]{@link module:alfresco/html/Markdown#subscriptionTopics}, initializes the 
       * markdown converter and if any [markdown]{@link module:alfresco/html/Markdown#markdown} has been initially provided calls 
       * [updateMarkdown]{@link module:alfresco/html/Markdown#updateMarkdown} to render and sanitize the HTML for it.
       * 
       * @instance
       */
      postCreate: function alfresco_html_Markdown__postCreate() {
         if (this.subscriptionTopics)
         {
            array.forEach(this.subscriptionTopics, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, this.onMarkdownUpdate));
            }, this);
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
       * Converts the supplied markdown into HTML and then makes an XHR request to Surf to sanitize the
       * generated HTML of any malicious content in order to prevent XSS-style attacks.
       * 
       * @instance
       * @param {string} markdown The markdown to convert to HTML
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
              // Set the flag to indicate that a request is about to be made...
              // TODO: We could potentially optimize this code by logging a timestamp in the request (or similar) and allow requests to be
              //       processed together and then just render the last request...
              this._requestInProgress = true;

               // Convert markdown to HTML...
               var html = this.converter.makeHtml(markdown);

               // Sanitize the output to ensure it is safe to render...
               var url = AlfConstants.URL_SERVICECONTEXT + webScriptDefaults.WEBSCRIPT_VERSION + "/sanitize/data";
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
       * This is called on both successful and failing attempts to sanitize the HTML rendered from the requested
       * markdown. It resets the [_requestInProgress]{@link module:alfresco/html/Markdown#_requestInProgress} flag
       * so that calls to [updateMarkdown]{@link module:alfresco/html/Markdown#updateMarkdown} can be processed.
       * If data has been stored in [_pendingMarkdown]{@link module:alfresco/html/Markdown#_pendingMarkdown} from
       * a request that was made whilst the last markdown request was being sanitized then that data will be
       * passed to [updateMarkdown]{@link module:alfresco/html/Markdown#updateMarkdown}.
       * 
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
       * Handles requests to render new markdown that are provided through the publication on a topic defined within the
       * [subscriptionTopics]{@link module:alfresco/html/Markdown#subscriptionTopics}.
       * 
       * @instance
       * @param {object} payload A payload containing a 'markdown' attribute with the markdown to convert to HTML
       */
      onMarkdownUpdate: function alfresco_html_Markdown__onMarkdownUpdate(payload) {
         payload.markdown && this.updateMarkdown(payload.markdown);
      },

      /**
       * @instance
       * @param  {object} response The reponse of the request to sanitize the converted markdown.
       * @param  {object} originalRequestConfig The configuration used to make the sanitize XHR request.
       */
      sanitizeSuccess: function alfresco_html_Markdown__sanitizeSuccess(response, /*jshint unused:false*/ originalRequestConfig) {
         this.domNode.innerHTML = response.data;
         this.checkForPendingMarkdown();
      },

      /**
       * This function is called when requests to sanitize the HTML generated from markdown cannot be processed. It simply
       * outputs a warning. Nothing is updated.
       * 
       * @instance
       * @param  {object} response The reponse of the request to sanitize the converted markdown.
       * @param  {object} originalRequestConfig The configuration used to make the sanitize XHR request.
       */
      sanitizeFailure: function alfresco_html_Markdown__sanitizeFailure(response, originalRequestConfig) {
         this.alfLog("warn", "It was not possible to sanitize the converted markdown", response, originalRequestConfig, this);
         this.checkForPendingMarkdown();
      }
   });
});