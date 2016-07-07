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
 * Handles requests to redirect the browser to display different pages in either current or the new tab.
 *
 * @module alfresco/services/NavigationService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 * @author David Webster
 */
define(["dojo/_base/declare",
        "module",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "alfresco/services/BaseService",
        "alfresco/services/_NavigationServiceTopicMixin",
        "alfresco/util/hashUtils",
        "alfresco/util/urlUtils",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/dom-construct"],
        function(declare, module, ObjectTypeUtils, topics, urlTypes, BaseService, _NavigationServiceTopicMixin, hashUtils, urlUtils, array, lang, Deferred, domConstruct) {

   return declare([BaseService, _NavigationServiceTopicMixin], {

      /**
       * It is possible to configure the NavigationService to respond to one or more publications that result in page navigation.
       * This is the attribute that will be set to respond to those publications.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      subscriptions: null,

      /**
       * Sets up the subscriptions for the NavigationService. The [navigateToPageTopic]{@link module:alfresco/services/_NavigationServiceTopicMixin#navigateToPageTopic}
       * topic is handled by the [navigateToPage]{@link module:alfresco/services/NavigationService#navigateToPage} function and the
       * [reloadPageTopic]{@link module:alfresco/services/_NavigationServiceTopicMixin#reloadPageTopic} is handled by the
       * [reloadPage]{@link module:alfresco/services/NavigationService#reloadPage} function.
       *
       * @instance
       * @listens navigateToPageTopic
       * @listens reloadPageTopic
       * @listens postToPageTopic
       * @since 1.0.32
       * @listens module:alfresco/core/topics#NAVIGATE_TO_PAGE
       * @listens module:alfresco/core/topics#RELOAD_PAGE
       * @listens module:alfresco/core/topics#POST_TO_PAGE
       */
      registerSubscriptions: function alfresco_services_NavigationService__registerSubscriptions() {
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
         // jshint maxcomplexity:false

         // Update the URL based on the site and type properties of the data object
         var url = data.url;
         var urlType = data.type;
         if (urlType === urlTypes.PAGE_RELATIVE)
         {
            var site = lang.getObject("site", false, data);
            if (!site || !ObjectTypeUtils.isString(site))
            {
               site = lang.getObject("site.shortName", false, data);
            }

            if (site && ObjectTypeUtils.isString(site))
            {
               var siteStem = "/site/" + site + "/";
               if (url.indexOf(siteStem) === -1)
               {
                  url = siteStem + url;
               }
            }
         }
         url = urlUtils.convertUrl(url, urlType);

         // Encode Parameters?
         var encodeParams = (typeof data.encodeParams !== "undefined")? data.encodeParams : true;

         // Add parameters supplied
         if (data.queryParams && typeof data.queryParams === "object") {
            array.forEach(Object.keys(data.queryParams), function(prop) {
               url = urlUtils.addQueryParameter(url, prop, data.queryParams[prop], encodeParams);
            });
         }

         if (data.hashParams && typeof data.hashParams === "object") {
            array.forEach(Object.keys(data.hashParams), function(prop) {
               url = urlUtils.addHashParameter(url, prop, data.hashParams[prop], encodeParams);
            });
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
         if (data.type !== urlTypes.HASH && !data.url)
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
               if (data.type === urlTypes.HASH)
               {
                  hashUtils[data.modifyCurrent ? "updateHash" : "setHash"](url);
               }
               else if (!data.target || data.target === this.currentTarget)
               {
                  // Make a good attempt at ensuring that we're not trying to go back to the same page
                  // This has been added to ensure that the progress indicator is not shown when entering
                  // new search terms in the SearchBox when already on the Search page (in Share)... 
                  // This may require further enhancement...
                  var hashIndex = url.indexOf("#");
                  if ((hashIndex !== -1 && url.substring(0, hashIndex) === window.location.pathname) ||
                      (url === window.location.pathname))
                  {
                     window.location = url;
                  }
                  else if (url.indexOf("?a=true") !== -1 || 
                           url.indexOf("&a=true") !== -1)
                  {
                     window.location = url;
                  }
                  else
                  {
                     this.alfServicePublish(topics.PROGRESS_INDICATOR_ADD_ACTIVITY);
                     window.location = url;
                  }
               }
               else if (data.target === this.newTarget)
               {
                  window.open(url);
               }
               else if (data.target === this.namedTarget)
               {
                  if (data.targetName)
                  {
                     window.open(url, data.targetName);
                  }
                  else
                  {
                     this.alfLog("warn", "Tried to open named window, but did not specify 'targetName' property");
                  }
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
            if (!data.target || data.target === this.currentTarget)
            {
               this.alfServicePublish(topics.PROGRESS_INDICATOR_ADD_ACTIVITY);
               form.submit();
            }
            else
            {
               form.submit();
            }
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
         this.alfServicePublish(topics.PROGRESS_INDICATOR_ADD_ACTIVITY);
         window.location.reload(true);
      }
   });
});