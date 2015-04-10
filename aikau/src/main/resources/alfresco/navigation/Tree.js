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
 * @module alfresco/navigation/Tree
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Tree.html",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/core/Core",
        "service/constants/Default",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/dom-construct",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/navigation/TreeStore",
        "dijit/tree/ObjectStoreModel",
        "dijit/Tree"], 
        function(declare, _Widget, _Templated, template, _PublishPayloadMixin, AlfCore, AlfConstants, _AlfDocumentListTopicMixin, 
                 _NavigationServiceTopicMixin, domConstruct, lang, array, TreeStore, ObjectStoreModel, Tree) {
   
   return declare([_Widget, _Templated, _PublishPayloadMixin, AlfCore, _AlfDocumentListTopicMixin, _NavigationServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Tree.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Tree.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Tree.css"}]
       */
      cssRequirements: [{cssFile:"./css/Tree.css"}],
      
      /**
       * Additional space separated CSS classes to be applied to the root DOM node of the widget.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      customCssClasses: "",
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {string}
       * @default null
       */
      siteId: null,
       
      /**
       * This should be set when the current context is a site, typically this will be set to "documentlibrary"
       * 
       * @instance
       * @type {string}
       * @default null
       */
      containerId: null,
      
      /**
       * This should be set if "siteId" is not set.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      rootNode: null,
      
      /**
       * @instance
       * @type {string}
       * @default "documentlibrary.root.label"
       */
      rootLabel: "documentlibrary.root.label",
      
      /**
       * This is the value that should be given to the root node. This node is not actually requested
       * but is simply generated on instantiation. The value assigned to it is important because it will
       * be included as the filter data when it is clicked.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      rootValue: "",
      
      /**
       * @instance
       * @type {string}
       * @default "docListTreePref"
       */
      filterPrefsName: "docListTreePref",

       /**
       * This is an array of Regular Expressions that should match pathes to show. At least one of the 
       * Regular Expressions in the array needs to pass true for the tree node to be displayed. To show
       * all paths this should be left as null (the default value).
       *
       * @instance
       * @type {array}
       * @default null
       */
      filterPaths: null,

      /**
       * Indicates whether or not the root node of the tree should be displayed or not.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      showRoot: true,
      
      /**
       * @instance
       * @return {string} The root of the URL to use when requesting child nodes.
       */
      getTargetUrl: function alfresco_navigation_Tree__getTargetUrl() {
         var url = null;
         if (this.siteId !== null && this.containerId !== null)
         {
            url = AlfConstants.PROXY_URI + "slingshot/doclib/treenode/site/" + this.siteId + "/documentlibrary";
         }
         else if (this.rootNode !== null)
         {
            url = AlfConstants.PROXY_URI + "slingshot/doclib/treenode/node/alfresco/company/home";
         }
         else
         {
            this.alfLog("error", "Cannot create a tree without 'siteId' and 'containerId' or 'rootNode' attributes", this);
         }
         return url;
      },
      
      /**
       * Gets an object containing the query parameters to include when requesting child nodes. The object returned
       * will differ slightly depending upon whether the tree is configured to represent a site or a general node. 
       * A general node query will include a library root parameter (this will typically map to either company home,
       * user home or shared files but can be any valid node). 
       * 
       * @instance
       * @return {object} The query object to include when requesting child nodes.
       */
      getTargetQueryObject: function alfresco_navigation_Tree__getTargetQueryObject() {
         var query = {
            perms: "false",
            children: "false",
            max: "-1"
         };
         if (this.siteId !== null && this.containerId !== null)
         {
            // No changes to the default query
         }
         else if (this.rootNode !== null)
         {
            query.max = "500";
            query.libraryRoot = this.rootNode;
         }
         return query;
      },
      
      /**
       * Creates the a dijit/Tree widget.
       * 
       * @instance
       */
      postCreate: function alfresco_navigation_Tree__postCreate() {

         this.showRoot = this.showRoot !== null ? this.showRoot : true;

         // Create a new tree store using the the siteId as part of the URL
         this.treeStore = new TreeStore({
            target: this.getTargetUrl(),
            targetQueryObject: this.getTargetQueryObject(),
            filterPaths: this.filterPaths
         });
         
         // Create the object store...
         // It is important that we set a root object. This should reflect correct location and label of the
         // document library location...
         this.treeModel = new ObjectStoreModel({
            root: {
               id: this.id + "_ROOT",
               name: this.encodeHTML(this.message(this.rootLabel)),
               value: this.rootValue,
               path: this.rootValue + "/"
            },
            store: this.treeStore,
            query: {}
         });
         
         // Create the tree and add it to our widget...
         this.tree = new Tree({
            model: this.treeModel,
            showRoot: this.showRoot,
            onClick: lang.hitch(this, this.onClick),
            onOpen: lang.hitch(this, this.onNodeExpand),
            onClose: lang.hitch(this, this.onNodeCollapse)
         });
         this.tree.placeAt(this.domNode);
         this.tree.startup();
      },
      
      /**
       * This is the topic that is published when a node on the tree is clicked. The data applied
       * to the filter is the the value of the node clicked. By default it is expected that the
       * tree represents a location so the default id is "ALF_DOCUMENTLIST_PATH_CHANGED". 
       * 
       * @instance
       * @type {string}
       * @default "ALF_DOCUMENTLIST_PATH_CHANGED"
       */
      publishTopic: "ALF_DOCUMENTLIST_PATH_CHANGED",

      /**
       * By default the payload type will the the current item. This will automatically be set
       * to be the tree node clicked.
       *
       * @instance
       * @type {string}
       * @default "CURRENT_ITEM"
       */
      publishPayloadType: "CURRENT_ITEM",

      /**
       * @instance
       * @param {object} item The store item represented by the clicked node
       * @param {object} node The node on the tree that was clicked
       * @param {object} evt The click event
       */
      onClick: function alfresco_navigation_Tree__onClick(item, node, evt) {
         this.alfLog("log", "Tree Node clicked", item, node, evt);

         // Assign the clicked item as the currentItem value so that it can be used in payload generation...
         this.currentItem = item;
         if (!this.currentItem.nodeRef)
         {
            this.currentItem.nodeRef = this.rootNode;
         }

         this.publishPayload = lang.clone(this.publishPayload);
         var generatedPayload = this.getGeneratedPayload(true);
         this.alfPublish(this.publishTopic, generatedPayload, this.publishGlobal);
      },
      
      /**
       * @instance
       * @param {object} item The store item represented by the opened node
       * @param {object} node The node on the tree that was opened
       */
      onNodeExpand: function alfresco_navigation_Tree__onNodeExpand(item, node) {
         if (node !== null && node._loadDeferred !== null && node._loadDeferred !== undefined)
         {
            this.alfLog("log", "Wait for node expand before rezize", node._loadDeferred);
            node._loadDeferred.then(lang.hitch(this, this.requestSidebarResize));
         }
      },
      
      /**
       * @instance
       * @param {object} item The store item represented by the collapsed node
       * @param {object} node The node on the tree that was collapsed
       */
      onNodeCollapse: function alfresco_navigation_Tree__onNodeExpand(item, node) {
         if (node !== null && node._collapseDeferred !== null && node._collapseDeferred !== undefined)
         {
            this.alfLog("log", "Wait for node collapse before rezize", node._collapseDeferred);
            node._loadDeferred.then(lang.hitch(this, this.requestSidebarResize));
         }
      },
      
      /**
       * Publishes a request to resize the side bar (if the tree is not in a side bar then this will
       * have no effect).
       * 
       * @instance
       */
      requestSidebarResize: function alfresco_navigation_Tree__requestSidebarResize() {
         this.alfPublish("ALF_RESIZE_SIDEBAR", {});
      }
   });
});