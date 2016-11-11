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
 * This extends the [standard tree]{@link module:alfresco/navigation/Tree} to handle path filtering updates
 * to ensure that the tree expands all nodes on the path. 
 * 
 * @module alfresco/navigation/PathTree
 * @extends module:alfresco/navigation/Tree
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/navigation/Tree",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/query",
        "dojo/NodeList-dom"], 
        function(declare, Tree, _AlfDocumentListTopicMixin, topics, lang, array, domClass, query) {
   
   return declare([Tree, _AlfDocumentListTopicMixin], {
      
      /**
       * This determines whether or not to subcribe to the 
       * [hash change topic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic}
       * or the [path change topic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#pathChangeTopic}.
       * Although the path tree doesn't make changes to the browser URL hash, it can be driven from them to that
       * it expands tree nodes to reflect the path attribute set as a hash parameter.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useHash: true,

      /**
       * Extends the inherited function to subscribe to the [hashChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic}
       * topic passing the [onFilterChange function]{@link module:alfresco/navigation/PathTree#onFilterChange} as the callback handler.
       * 
       * @instance
       * @listens module:alfresco/core/topics#CONTENT_DELETED
       */
      postMixInProperties: function alfresco_navigation_PathTree__postMixInProperties() {
         this.inherited(arguments);
         if (this.useHash === true)
         {
            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         }
         else
         {
            this.alfSubscribe(this.pathChangeTopic, lang.hitch(this, this.onFilterChange));
         }

         this.alfSubscribe(topics.CONTENT_CREATED, lang.hitch(this, this.onContentCreated));
         this.alfSubscribe(topics.CONTENT_DELETED, lang.hitch(this, this.onContentDeleted));
      },

      /**
       * Handles the refreshing of a particular node in the tree. In order to perform the refresh
       * it is necessary to remove any cached data from the model relating to the children of the node
       * and to make sure any previously loaded data is removed from the node itself. The tree node
       * is collapsed and expanded to render the latest data. This function is called from the
       * [onContentCreated]{@link module:alfresco/navigaion/PathTree#onContentCreated} and
       * [onContentDeleted]{@link module:alfresco/navigaion/PathTree#onContentDeleted} functions to 
       * refresh the tree when folders are created and deleted.
       * 
       * @instance
       * @param  {object} treeNode The node widget to refresh in the tree.
       * @since 1.0.48
       */
      refreshTreeNode: function alfresco_navigation_PathTree__refreshTreeNode(treeNode) {
         var id = treeNode.getIdentity(); // This should be a nodeRef - we need to remove this from the cache...
         
         // Remove the parentId from the cached data of the model for the tree. This means that in the getChildren
         // function of the tree that there won't be data available to re-use...
         delete this.tree.model.childrenCache[id]; 

         // It is necessary to collapse the node before deleting the _loadDeferred data from it otherwise
         // an exception will occur in the _expandNode function 
         this.tree._collapseNode(treeNode);

         // Delete the previously loaded data from the node. This means that in the _expandNode function
         // of the tree that it will force the tree to reload.
         delete treeNode._loadDeferred;

         // Finally expand the node, because the cache and loading promise have been deleted then a
         // request will be made to fetch the current state.
         this.tree._expandNode(treeNode);
      },

      /**
       * This function attempts to [refresh the node]{@link module:alfresco/navigaion/PathTree#refreshTreeNode} 
       * that content has just been created in.
       * 
       * @instance
       * @param  {object} payload A payload containing the nodeRef of the created object and the
       * nodeRef of the node it was created as a child of.
       * @since 1.0.48
       */
      onContentCreated: function alfresco_navigation_PathTree__onContentCreated(payload) {
         if (payload.parentNodeRef)
         {
            var parentTreeNode = this.tree._itemNodesMap[payload.parentNodeRef];
            if (parentTreeNode && parentTreeNode.length)
            {
               parentTreeNode = parentTreeNode[0];
               this.refreshTreeNode(parentTreeNode);
            }
            else
            {
               // For the root node, the supplied parentNoderef will be undefined - therefore
               // we need to use the ROOT id (which is known)...
               parentTreeNode = this.tree._itemNodesMap[this.id + "_ROOT"];
               if (parentTreeNode && parentTreeNode.length)
               {
                  parentTreeNode = parentTreeNode[0];
                  this.refreshTreeNode(parentTreeNode);
               }
            }
         }
         else
         {
            this.alfLog("warn", "A publication was made indicating that content was created, but no 'parentNodeRef' was provided in the payload", payload, this);
         }
      },

      /**
       * This function attempts to [refresh the node]{@link module:alfresco/navigaion/PathTree#refreshTreeNode} 
       * that content has just been deleted from.
       * 
       * @instance
       * @param  {object} payload A payload containing an array of nodeRefs for the deleted nodes.
       * @since 1.0.48
       */
      onContentDeleted: function alfresco_navigation_PathTree__onContentDeleted(payload) {
         if (payload.nodeRefs && payload.nodeRefs.length)
         {
            var nodeRef = payload.nodeRefs[0];
            var treeNode = this.tree._itemNodesMap[nodeRef];
            if (treeNode && treeNode.length)
            {
               // If the parent node has not been expanded then the deleted item will not have been rendered
               // in the tree, therefore we need to be sure that it is in the tree before attempting to refresh.
               treeNode = treeNode[0];
               var parentTreeNode = treeNode.getParent();
               this.refreshTreeNode(parentTreeNode);
            }
         }
         else
         {
            this.alfLog("warn", "A publication was made indicating that content was deleted, but no 'nodeRefs' were provided in the payload", payload, this);
         }
      },
      
      /**
       * When the filter is updated to represent a path then this callback function will ensure
       * that the tree expands all of the relevant nodes to display that path. 
       * 
       * @instance
       * @param {object} payload 
       */
      onFilterChange: function alfresco_navigation_PathTree__onFilterChange(payload) {
         if (payload && payload.path !== null && payload.path !== undefined)
         {
            this.alfLog("log", "Filter updated", payload);

            // See AKU-1118... add a forward slash prefix if missing...
            var path = payload.path;
            if (path[0] !== "/")
            {
               path = "/" + path;
            }

            var pathElements = path.split("/");
            if (this.tree !== null && this.tree !== undefined && pathElements.length > 0)
            {
               var rootNode = this.tree.getChildren()[0];
               pathElements.shift();
               this.expandPathElement(rootNode, pathElements);
            }
         }
      },
      
      /**
       * Expands the child of the target node that matches the next element on the supplied
       * path. It then recursively calls it self until all tree nodes representing the current
       * path have been expanded.
       * 
       * @instance
       * @param {object} node The tree node to check the children of
       * @param {string[]} pathElements The array of remaining path elements to process (the first element will be searched for)
       */
      expandPathElement: function alfresco_navigation_PathTree__expandPathElement(node, pathElements) {
         this.alfLog("log", "Expanding path nodes: ", node, pathElements);
         if (node !== null && !node.isExpanded)
         {
            // It's almost certain that the node won't be expanded when first requested, and this is likely
            // to be because the data load is deferred (e.g. awaiting the results of the XHR request to get
            // it's children). In this event it is necessary to wait for the results to be available before
            // continuing to expand nodes on the path...
            this.alfLog("log", "Node load deferred", node._loadDeferred);
            node._loadDeferred.then(lang.hitch(this, "expandPathElement", node, pathElements));
         }
         else if (node !== null &&
                  pathElements !== null &&
                  pathElements.length > 0)
         {
            // If the node is expanded and there are more path elements to process then we can
            // immediately find the target node for the next path element and expand it...
            var childNodes = node.getChildren(),
                pathElement = pathElements.shift(),
                filteredNodes = array.filter(childNodes, function(item) {
               // NOTE: Compare the value, not the name as the name can be switched (e.g. documentLibrary 
               //       becomes Document Library, see "updateChild" function in TreeStore).
               return item.item.value === pathElement;
            });
            if (filteredNodes.length === 1)
            {
               // There should only ever be one result, but it's important to check...
               // at least an invalid path (e.g. to a deleted or moved folder) will not
               // be processed. There should never be more than 1 result!
               var targetChildNode = filteredNodes[0];
               query(".dijitTreeRowSelected", this.tree.domNode).removeClass("dijitTreeRowSelected");
               domClass.add(targetChildNode.rowNode, "dijitTreeRowSelected");
               this.tree._expandNode(targetChildNode);
               this.expandPathElement(targetChildNode, pathElements);
            }
            else
            {
               // Select the last expanded node
               query(".dijitTreeRowSelected", this.tree.domNode).removeClass("dijitTreeRowSelected");
               domClass.add(node.rowNode, "dijitTreeRowSelected");
            }
         }
      }
   });
});