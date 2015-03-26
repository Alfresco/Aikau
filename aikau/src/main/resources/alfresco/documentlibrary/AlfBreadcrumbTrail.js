/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * Used to represent the path or filter that is currently being displayed. When a path is being rendered
 * each element in the path is rendered by an individual [AlfBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumb}
 * 
 * @module alfresco/documentlibrary/AlfBreadcrumbTrail
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfBreadcrumbTrail.html",
        "alfresco/core/Core",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/documentlibrary/AlfBreadcrumb",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/on"], 
        function(declare, _WidgetBase, _TemplatedMixin, template,  AlfCore, _AlfDocumentListTopicMixin, AlfBreadcrumb, lang, array, domConstruct, domClass, on) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, _AlfDocumentListTopicMixin], {
      
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
       * Indicates whether or not to hide the breadcrumb trail when first instantiated.
       * @instance 
       * @type{boolean}
       * @default false
       */
      hide: false,
      
      /**
       * The label for the root of the breadcrumb trail.
       * 
       * @instance
       * @type {string}
       * @default "root.label"
       */
      rootLabel: "root.label",

      /**
       * Indicates whether or not to display a root label for the breadcrumb trail.
       * This label will effectively represent "/"
       * 
       * @instance
       * @type {boolean} 
       * @default true
       */
      showRootLabel: true,
         
      /**
       * Implements the Dojo widget lifecycle function to subscribe to the relevant topics that
       * provide information on path and filter changes. 
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfBreadcrumbTrail__postCreate() {
         this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.handleCurrentNodeChange));
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onPathChanged));
         this.alfSubscribe(this.showPathTopic, lang.hitch(this, this.onShowBreadcrumb));
         this.alfSubscribe(this.filterSelectionTopic, lang.hitch(this, this.onFilterSelection));
         this.alfSubscribe("ALF_DOCUMENTLIST_CATEGORY_CHANGED", lang.hitch(this, this.onFilterSelection));
         this.alfSubscribe("ALF_DOCUMENTLIST_TAG_CHANGED", lang.hitch(this, this.onFilterSelection));

         if (this.currentPath != null)
         {
            this.renderBreadcrumbTrail();
         }
         var currentFolderNodeRef = lang.getObject("_currentNode.parent.nodeRef", false, this);
         if (currentFolderNodeRef != null)
         {
            this._currentFolderUrl = "folder-details?nodeRef=" + currentFolderNodeRef;
         }
      },

      /**
       * The current Node that content will be worked relative to.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _currentNode: null,
      
      /**
       *  A URL to the current folder. This will get set when the 
       * current node changes. It will be set so that breadcrumb links to the current folder can display
       * the folder details rather than just changing the DocumentList filter.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      _currentFolderUrl: null,
      
      /**
       * This handles publications on the [metadataChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#metadataChangeTopic}
       * topic to set the location of the current folder (e.g the last crumb in the trail). This information is required
       * because the last crumb navigates to the details page for the node rather than just the list view of the crumb. 
       * 
       * @instance
       * @param {object} payload 
       */
      handleCurrentNodeChange: function alfresco_documentlibrary_AlfBreadcrumbTrail__handleCurrentNodeChange(payload) {
         if (payload && payload.node)
         {
            this._currentNode = payload.node;
            if (payload.node.parent && payload.node.parent.nodeRef)
            {
               this._currentFolderUrl = "folder-details?nodeRef=" + payload.node.parent.nodeRef;
               this.renderBreadcrumbTrail();
            }
         }
         else
         {
            this.alfLog("error", "A request was made to update the current NodeRef, but no 'node' property was provided in the payload: ", payload);
         }
      },
      
      /**
       * The path to display. This can be set on instantiation to indicate the initial path to display but will
       * be updated each time the path is changed. 
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      currentPath: "",
      
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
         if (payload && payload.path != null)
         {
            this.currentPath = payload.path;
            this.renderBreadcrumbTrail();
         }
      },
     
      /**
       * Renders an individual [AlfBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumb} in the breadcrumb trail.
       * 
       * @instance
       * @param {string} folderName The name of the folder to render
       * @param {integer} index The index of the folder in array of breadcrumbs
       */
      renderBreadcrumb: function alfresco_documentlibrary_AlfBreadcrumbTrail__renderBreadcrumb(paths, folderName, index) {
         // Construct the new path that the breadcrumb should link to...
         var path = paths.slice(0, index+1).join("/");
         
         // Create the breadcrumb...
         
         var breadcrumb = new AlfBreadcrumb({label: folderName,
                                             path: path});
         domConstruct.place(breadcrumb.domNode, this.containerNode, "last");
         
         // Create a breadcrumb separator if required...
         if (index < paths.length -1)
         {
            var breadcrumbSeparator = domConstruct.create("span", { innerHTML: "&nbsp;" });
            domClass.add(breadcrumbSeparator, "alf-folder-separator");
            domConstruct.place(breadcrumbSeparator, this.containerNode);
         }
         else
         {
            // For the last breadcrumb - set a target URL for the last folder...
            if (this._currentFolderUrl)
            {
               breadcrumb.targetUrl = this._currentFolderUrl;
            }
         }
      },
      
      /**
       * Renders the breadcrumb trail by calling the [renderBreadcrumb]{@link module:alfresco/documentlibrary/AlfBreadcrumbTrail#renderBreadcrumb}
       * function for each element in the current path.
       * 
       * @instance
       */
      renderBreadcrumbTrail: function alfresco_documentlibrary_AlfBreadcrumbTrail__renderBreadcrumbTrail() {
         
         // Empty the current breadcrumb trail...
         domConstruct.empty(this.containerNode);
         
         // Build an array of the breadcrumbs...
         var paths = this.currentPath.split("/");
         if (this.currentPath === "/")
         {
            paths = ["/"];
         }
         if (paths[paths.length-1] == "")
         {
            paths.pop();
         }
         
         var displayPaths = paths.concat();
         displayPaths[0] = this.message(this.rootLabel);
         
         if (!this.showRootLabel)
         {
            // Remove the root element so that it doesn't show...
            displayPaths.shift();
            paths.shift();
         }
         
         array.forEach(displayPaths, lang.hitch(this, "renderBreadcrumb", paths));
         
         if (this.hide) 
         {
            domClass.add(this.domNode, "hidden");
         }
         else
         {
            domClass.remove(this.domNode, "hidden");
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
         if (payload && payload.selected != null)
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
       * to show when a filter is selected. The the rendered path is replaced with the details of the filter.
       * 
       * @instance
       */
      onFilterSelection: function alfresco_documentlibrary_AlfBreadcrumbTrail__onFilterSelection(payload) {
         // Empty the current breadcrumb trail...
         if (payload != null && payload.description != null)
         {
            domConstruct.empty(this.containerNode);
            domConstruct.create("div", {
               innerHTML: payload.description
            }, this.containerNode);
         }
         else
         {
            this.alfLog("warn", "A request was made to display filter information but no description was provided: ", payload);
         }
      }
   });
});