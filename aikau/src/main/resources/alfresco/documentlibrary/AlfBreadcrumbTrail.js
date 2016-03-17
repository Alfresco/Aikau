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
 * <p>This widget can be used to render breadcrumb trails. It can be used either to render a fixed set of breadcrumbs (e.g.
 * where you might want to render some information about a fixed location of a page) or it can be used to render path
 * based data. When rendering path based data it is possible to get the path from the
 * [browser URL hash]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#useHash} or from explicitly configured
 * [path publishing topics]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#pathChangeTopic}. When rendering
 * a path based breadcrumb trail it is expected that the last item in the trail  represents the
 * current location and clicking it can either navigate the user to another page (in which case you should set the
 * [lastBreadcrumbPublishTopic]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#lastBreadcrumbPublishTopic} and other associated
 * attributes). Clicking on any other breadcrumb in the trail is expected to simply publish information about the selected
 * path.<p>
 * 
 * <p>Each element in the trail is rendered by the [AlfBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumb}
 * widget. This module should be extended and the 
 * [renderBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#lastBreadcrumbPublishTopic#renderBreadcrumb} function
 * overridden if an alternative widget needs to be used.</p>
 * 
 * @module alfresco/documentlibrary/AlfBreadcrumbTrail
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfBreadcrumbTrail.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/documentlibrary/AlfBreadcrumb",
        "alfresco/util/hashUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, template,  AlfCore, CoreWidgetProcessing, _AlfDocumentListTopicMixin, 
                 _PublishPayloadMixin, AlfBreadcrumb, hashUtils, lang, array, domConstruct, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, _PublishPayloadMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfBreadcrumbTrail.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfBreadcrumbTrail.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfBreadcrumbTrail.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfBreadcrumbTrail.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * An array of fixed breadcrumbs to render. Each breadcrumb needs to have a "label" attribute and can
       * also optionally include "publishTopic" and "publishPayload" attributes if clicking on the breadcrumb
       * should have an action.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      breadcrumbs: null,

      /**
       * A path to use as a breadcrumb trail. This is a simple alternative to defining invidual breadcrumbs
       * but gives less flexibility over what clicking on the breadcrumbs do.
       *
       * @instance
       * @type {string}
       * @default
       */
      currentPath: "/",

      /**
       * Indicates whether or not to hide the breadcrumb trail when first instantiated.
       * @instance 
       * @type{boolean}
       * @default
       */
      hide: false,
      
      /**
       * This indicates that the final breadcrumb in the trail  is 
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      lastBreadcrumbIsCurrentNode: false,

      /**
       * This is the topic that is published when the final breadcrumb in the trail is clicked.
       *
       * @instance
       * @type {string}
       * @default
       */
      lastBreadcrumbPublishTopic: null,

      /**
       * This is the payload that is published when the final breadcrumb in the trail is clicked.
       *
       * @instance
       * @type {object}
       * @default
       */
      lastBreadcrumbPublishPayload: null,

      /**
       * Indicates whether or not the clicking on the last breadcrumb publishes on the gloabl scope. This 
       * defaults to true because it is expected that the last breadcrumb will be a page navigation and
       * therefore need to publish to a globally subscribing 
       * [NavigationService]{@link module:alfresco/services/NavigationServce}.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      lastBreadcrumbPublishGlobal: true,

      /**
       * Indicates whether or not the clicking on the last breadcrumb publishes on the parent scope
       *
       * @instance
       * @type {boolean}
       * @default
       */
      lastBreadcrumbPublishToParent: false,

      /**
       * This is the type of payload that is published when the final breadcrumb in the trail is clicked. 
       * By default it will use the 
       * [lastBreadcrumbPublishPayload]{@link module:alfresco/documentlibrary/AlfBreadCrumbTrail#lastBreadcrumbPublishPayload} 
       * exactly as it is configured.
       *
       * @instance
       * @type {string}
       * @default
       */
      lastBreadcrumbPublishPayloadType: "CONFIGURED",

      /**
       * Indicate whether or not the "currentItem" object will be mixed into the 
       * [lastBreadcrumbPublishPayload]{@link module:alfresco/documentlibrary/AlfBreadCrumbTrail#lastBreadcrumbPublishPayload}.
       * By default this is set to false because it is not expected that there will typically be a "currentItem" object set.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      lastBreadcrumbPublishPayloadItemMixin: false,

      /**
       * An array of the modifying functions that will be applied to the 
       * [lastBreadcrumbPublishPayload]{@link module:alfresco/documentlibrary/AlfBreadCrumbTrail#lastBreadcrumbPublishPayload}
       * if the 
       * [lastBreadcrumbPublishPayloadType]{@link module:alfresco/documentlibrary/AlfBreadCrumbTrail#lastBreadcrumbPublishPayloadType}
       * is configured to be "PROCESS".
       *
       * @instance
       * @type {string[]}
       * @default
       */
      lastBreadcrumbPublishPayloadModifiers: null,

      /**
       * The label for the root of the breadcrumb trail.
       * 
       * @instance
       * @type {string}
       * @default
       */
      rootLabel: "root.label",

      /**
       * Indicates whether or not to display a root label for the breadcrumb trail.
       * This label will effectively represent "/"
       * 
       * @instance
       * @type {boolean} 
       * @default
       */
      showRootLabel: true,
         
      /**
       * Indicates whether the browser URL hash will be used to provide the breadcrumb trail. If this is
       * set to true then the breadcrumb trail will be re-rendered as the hash changes.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useHash: false,

      /**
       * This boolean flag is used to indicate whether or not a filter is being displayed rather than
       * a breadcrumb trail. This should not be configured or changed as it is used to maintain the
       * internal state of the widget. It is necessary to keep track of whether or not a filter is 
       * displayed to determine what actions to take when the 
       * [current node changes]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#onCurrentNodeChange}.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      _filterDisplayed: false,

      /**
       * Implements the Dojo widget lifecycle function to subscribe to the relevant topics that
       * provide information on path and filter changes. 
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfBreadcrumbTrail__postCreate() {
         this.alfSubscribe(this.showPathTopic, lang.hitch(this, this.onShowBreadcrumb));
         this.alfSubscribe(this.filterSelectionTopic, lang.hitch(this, this.onFilterSelection));
         this.alfSubscribe("ALF_DOCUMENTLIST_CATEGORY_CHANGED", lang.hitch(this, this.onFilterSelection));
         this.alfSubscribe(this.docListTagChangedTopic, lang.hitch(this, this.onFilterSelection));

         if (this.breadcrumbs)
         {
            // Render a fixed breadcrumb trail...
            array.forEach(this.breadcrumbs, lang.hitch(this, this.renderBreadcrumb));
         }
         else
         {
            // When the "lastBreadcrumb" represents the current node (e.g. when the breadcrumb trail represents
            // a location in a Document Library for example) then it is necessary to subscribe to changes
            // of the current node...
            if (this.lastBreadcrumbIsCurrentNode === true)
            {
               this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.onCurrentNodeChange));
            }

            if (this.currentPath)
            {
               this.renderPathBreadcrumbTrail();
            }
            if (this.useHash === true)
            {
               // Subscribe using the widgets own scope (don't assume global) because the topic published
               // will in practice be published at a share scope (i.e. when used in the context of a 
               // scoped Document Library the hash change publication will be scoped, not global)...
               this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onHashChanged));
               this.onHashChanged(hashUtils.getHash());
            }
            else if (this.pathChangeTopic)
            {
               this.alfSubscribe(this.pathChangeTopic, lang.hitch(this, this.onPathChanged));
            }
         }
      },

      /**
       * The current Node that content will be worked relative to.
       * 
       * @instance
       * @type {object}
       * @default
       */
      currentNode: null,
      
      /**
       * This handles publications on the [metadataChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#metadataChangeTopic}
       * topic to set the location of the current folder (e.g the last crumb in the trail). This information is required
       * because the last crumb navigates to the details page for the node rather than just the list view of the crumb. 
       * 
       * @instance
       * @param {object} payload 
       */
      onCurrentNodeChange: function alfresco_documentlibrary_AlfBreadcrumbTrail__onCurrentNodeChange(payload) {
         if (payload && payload.node)
         {
            this.currentNode = payload.node;
            if (this._filterDisplayed === false)
            {
               // It's necessary to re-render the breadcrumb trail after the current node changes because on initial
               // page load the current node update will occur after the breadcrumb has been rendered for the first time...
               // Currently this can result in the breadcrumb rendering twice, but at least it will be accurate (only 
               // remove this line when verifying initial page loading results)...
               this.renderPathBreadcrumbTrail();
            }
         }
         else
         {
            this.alfLog("error", "A request was made to update the current NodeRef, but no 'node' property was provided in the payload: ", payload);
         }
      },

      /**
       * Handle hash-change events
       *
       * @instance
       * @param {object} newHash The new hash value
       * @since 1.0.60
       */
      onHashChanged: function alfresco_documentlibrary_AlfBreadcrumbTrail__onHashChanged(newHash) {
         if (newHash.path) {
            this.onPathChanged(newHash);
         } else if (newHash.filter && newHash.description) {
            this.onFilterSelection(newHash);
         }
      },
      
      /**
       * This handles publications on the [hashChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic}
       * topic and updates the [currentPath]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#currentPath} attribute and calls the
       * [renderBreadcrumbTrail]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#renderBreadcrumbTrail} function to re-render the
       * breadcrumb trail.
       *  
       * @instance
       * @param {object} payload The details of the path change. The object must have both 'filterId' and 'filterData' attributes
       */
      onPathChanged: function alfresco_documentlibrary_AlfBreadcrumbTrail__onPathChanged(payload) {
         this.alfLog("log", "Detected path change", payload);
         if (payload && payload.path)
         {
            this._filterDisplayed = false;
            this.currentPath = payload.path;
            this.renderPathBreadcrumbTrail();
            if(this.useHash === true) {
               hashUtils.updateHash({
                  description: null
               }, true);
            }

         }
      },
     
      /**
       * Renders a breadcrumb.
       * 
       * @param {object} breadcrumb The configuration for the breadcrumb
       * @param {number} index The index of the breadcrumb
       */
      renderBreadcrumb: function alfresco_documentlibrary_AlfBreadcrumbTrail__renderBreadcrumb(breadcrumb, /*jshint unused:false*/ index) {
         if (breadcrumb.label)
         {
            var bc = this.createWidget({
               name: "alfresco/documentlibrary/AlfBreadcrumb",
               config: breadcrumb
            });
            bc.placeAt(this.containerNode);
         }
      },

      /**
       * Renders an individual [AlfBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumb} in the breadcrumb trail.
       * 
       * @instance
       * @param {string} folderName The name of the folder to render
       * @param {integer} index The index of the folder in array of breadcrumbs
       */
      renderPathBreadcrumb: function alfresco_documentlibrary_AlfBreadcrumbTrail__renderPathBreadcrumb(paths, folderName, index) {
         var path = paths.slice(0, index+1).join("/");
         var config = {
            label: folderName,
            path: path
         };
         if (index < paths.length -1)
         {
            if (this.useHash === true)
            {
               config.publishTopic = "ALF_NAVIGATE_TO_PAGE";
               config.publishPayload = {
                  url: "path=" + (path || "/"),
                  type: "HASH",
                  target: "CURRENT",
                  modifyCurrent: true
               };
               config.publishGlobal = true;
            }
            else
            {
               config.publishTopic = this.pathChangeTopic;
               config.publishPayload = {
                  path: (path || "/")
               };
            }
         }
         else if (this.lastBreadcrumbPublishTopic)
         {
            config.publishTopic = this.lastBreadcrumbPublishTopic;
            config.publishPayload = this.generatePayload(this.lastBreadcrumbPublishPayload, this.currentItem, null, this.lastBreadcrumbPublishPayloadType, this.lastBreadcrumbPublishPayloadItemMixin, this.lastBreadcrumbPublishPayloadModifiers);
            config.publishGlobal = this.lastBreadcrumbPublishGlobal;
            config.publishToParent = this.lastBreadcrumbPublishToParent;
         }
         this.renderBreadcrumb(config);
      },
      
      /**
       * Renders the breadcrumb trail by calling the [renderBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#renderBreadcrumb}
       * function for each element in the current path.
       * 
       * @instance
       */
      renderPathBreadcrumbTrail: function alfresco_documentlibrary_AlfBreadcrumbTrail__renderPathBreadcrumbTrail() {
         if (this.currentPath)
         {
            domConstruct.empty(this.containerNode);

            if (this.currentPath[0] !== "/")
            {
               this.currentPath = "/" + this.currentPath;
            }
            var paths = this.currentPath.split("/");
            if (this.currentPath === "/")
            {
               paths = ["/"];
            }
            if (paths[paths.length-1] === "")
            {
               paths.pop();
            }

            var displayPaths = paths.concat();
            if (this.rootLabel)
            {
               displayPaths[0] = this.message(this.rootLabel);
            }

            if (!this.showRootLabel)
            {
               displayPaths.shift();
               paths.shift();
            }
            
            array.forEach(displayPaths, lang.hitch(this, this.renderPathBreadcrumb, paths));
            
            if (this.hide) 
            {
               domClass.add(this.domNode, "hidden");
            }
            else
            {
               domClass.remove(this.domNode, "hidden");
            }
         }
      },
      
      /**
       * This handles publications on the [onShowBreadcrumb]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#onShowBreadcrumb}
       * topic to change the breadcrumb trail visibility.
       * 
       * @instance
       * @param {object} payload Must contain a "selected" attribute which should map to whether or not the trail is shown or not. 
       */
      onShowBreadcrumb: function alfresco_documentlibrary_AlfBreadcrumbTrail__onShowBreadcrumb(payload) {
         if (payload && (payload.selected || payload.selected === false))
         {
            this.hide = !payload.selected;
            if (this.hide) 
            {
               domClass.add(this.domNode, "hidden");
            }
            else
            {
               domClass.remove(this.domNode, "hidden");
            }
         }
      },
      
      /**
       * This handles publications on the [filterSelectionTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#filterSelectionTopic} topic
       * to show when a filter is selected. The rendered path is replaced with the details of the filter.
       * 
       * @instance
       */
      onFilterSelection: function alfresco_documentlibrary_AlfBreadcrumbTrail__onFilterSelection(payload) {
         // Empty the current breadcrumb trail...
         if (payload && payload.description)
         {
            domConstruct.empty(this.containerNode);
            this._filterDisplayed = true;
            this.renderBreadcrumb({
               label: payload.description
            });
            if(this.useHash === true) {
               if(!hashUtils.getHash().description) {
                  hashUtils.updateHash({
                     description: payload.description
                  }, true);
               }
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to display filter information but no description was provided: ", payload);
         }
      }
   });
});