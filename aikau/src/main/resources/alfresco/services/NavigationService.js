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
 * Handles requests to redirect the browser to display different pages in either current or the new tab.
 *
 * @module alfresco/services/NavigationService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 * @author David Webster
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/hash",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "service/constants/Default"],
        function(declare, AlfCore, _NavigationServiceTopicMixin, hash, array, lang, domConstruct, AlfConstants) {

   return declare([AlfCore, _NavigationServiceTopicMixin], {

      /**
       * It is possible to configure the NavigationService to respond to one or more publications that result in page navigation.
       * This is the attribute that will be set to respond to those publications.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      subscriptions: null,

      /**
       * Sets up the subscriptions for the NavigationService. The [navigateToPageTopic]{@link module:alfresco/services/_NavigationServiceTopicMixin#navigateToPageTopic}
       * topic is handled by the [navigateToPage]{@link module:alfresco/services/NavigationService#navigateToPage} function and the
       * [reloadPageTopic]{@link module:alfresco/services/_NavigationServiceTopicMixin#reloadPageTopic} is handled by the
       * [reloadPage]{@link module:alfresco/services/NavigationService#reloadPage} function.
       *
       * @instance
       * @param {array} args Constructor arguments
       *
       * @listens navigateToPageTopic
       * @listens reloadPageTopic
       * @listens postToPageTopic
       */
      constructor: function alfresco_services_NavigationService__constructor(args) {
         lang.mixin(this, args);

         this.alfSubscribe(this.navigateToPageTopic, lang.hitch(this, this.navigateToPage));
         this.alfSubscribe(this.reloadPageTopic, lang.hitch(this, this.reloadPage));
         this.alfSubscribe(this.postToPageTopic, lang.hitch(this, this.postToPage));
         if (this.subscriptions)
         {
            array.forEach(this.subscriptions, lang.hitch(this, this.setupNavigationSubscriptions));
         }
      },

      /**
       * Sets up a subscription to handle publications that occur on the page that should trigger navigation.
       *
       * @instance
       * @param {object} subscription The subscription to configure
       */
      setupNavigationSubscriptions: function alfresco_services_NavigationService__setupNavigationSubscriptions(subscription) {
         if (subscription && subscription.topic && subscription.url)
         {
            this.alfSubscribe(subscription.topic, lang.hitch(this, "navigateToPage", subscription));
         }
         else
         {
            this.alfLog("warn", "A NavigationService subscription was requested, but the subscription was missing one of the required attributes of 'topic' or 'url'", subscription, this);
         }
      },

      /**
       * Builds a URL from the supplied data object.
       * 
       * @instance
       * @param  {object} data The data object form which to construct the URL
       * @return {string} The built URL
       */
      buildUrl: function alfresco_services_NavigationService__buildUrl(data) {
         var url;
         if (!data.type || data.type === this.sharePageRelativePath || data.type === this.pageRelativePath)
         {
            var siteStem = "site/" + data.site + "/";
            url = data.url;

            // Cater for site urls that are sent from a non-site context.
            if (data.site && url.indexOf(siteStem) === -1)
            {
               url = siteStem + url;
            }
            url = AlfConstants.URL_PAGECONTEXT + url;
         }
         else if (data.type === this.contextRelativePath)
         {
            url = AlfConstants.URL_CONTEXT + data.url;
         }
         else if (data.type === this.fullPath || data.type === this.hashPath)
         {
            url = data.url;
         }
         else
         {
            this.alfLog("error", "An unknown URL type of '" + data.type + "' was provided for a navigation request", data, this);
         }
         return url;
      },

      /**
       * This is the default page navigation handler. It is called when the service receives a publication on
       * the [navigateToPageTopic]{@link module:alfresco/services/_NavigationServiceTopicMixin#navigateToPageTopic} topic. At the moment
       * it makes the assumption that the URL data will be relative to the Share page context.
       *
       * @instance
       * @param {object} data An object containing the information about the page to navigate to.
       * @todo explain what data can contain...
       */
      navigateToPage: function alfresco_services_NavigationService__navigateToPage(data) {
         // jshint maxcomplexity:false
         if (data.type !== this.hashPath && !data.url)
         {
            this.alfLog("error", "A page navigation request was made without a target URL defined as a 'url' attribute", data);
         }
         else
         {
            this.alfLog("log", "Page navigation request received:", data);
            var url = this.buildUrl(data);
            if (url || url === "")
            {
               // Determine the location of the URL...
               if (data.type === this.hashPath)
               {
                  hash(url);
               }
               else if (!data.target || data.target === this.currentTarget)
               {
                  window.location = url;
               }
               else if (data.target === this.newTarget)
               {
                  window.open(url);
               }
            }
         }
      },

      /**
       * Sometimes we need to navigate to a page using post data (e.g. Assign Workflow action)
       *
       * @instance
       * @param data
       */
      postToPage: function alfresco_services_NavigationService__postToPage(data) {
         var url = this.buildUrl(data);
         if (url)
         {
            var form = domConstruct.create("form");
            form.method = "POST";
            form.action = url;
            if (data.target === this.newTarget)
            {
               form.target = "_blank";
            }
            var parameters = data.parameters || {};
            for (var name in parameters)
            {
               if (parameters.hasOwnProperty(name))
               {
                  var value = parameters[name];
                  if (value)
                  {
                     var input;
                     input = domConstruct.create("input");
                     input.setAttribute("name", name);
                     input.setAttribute("type", "hidden");
                     input.value = value;
                     domConstruct.place(input, form);
                  }
               }
            }
            domConstruct.place(form, document.body);
            form.submit();
         }
      },

      /**
       * Reloads the current page. Despite the simplicity of the action, page refreshes should still be handled over the
       * pub/sub layer as this provides an opportunity for additional logging and other actions required by third party
       * extensions.
       *
       * @instance
       * @param {object} data An object containing additional information. NOTE: Currently, no additional data is processed
       */
      reloadPage: function alfresco_services_NavigationService__reloadPage(data) {
         this.alfLog("log", "Page reload request received:", data);
         window.location.reload(true);
      }
   });
});