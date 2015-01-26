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
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/when"], 
        function(declare, Tree, _AlfDocumentListTopicMixin, lang, array, when) {
   
   return declare([Tree, _AlfDocumentListTopicMixin], {
      
      /**
       * Extends the inherited function to subscribe to the [hashChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic}
       * topic passing the [onFilterChange function]{@link module:alfresco/navigation/PathTree#onFilterChange} as the callback handler.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_navigation_PathTree__postMixInProperties() {
         this.inherited(arguments);
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, "onFilterChange"));
      },
      
      /**
       * When the filter is updated to represent a path then this callback function will ensure
       * that the tree expands all of the relevant nodes to display that path. 
       * 
       * @instance
       * @param {object} payload 
       */
      onFilterChange: function alfresco_navigation_PathTree__onFilterChange(payload) {
         if (payload != null && 
             payload.path != null)
         {
            this.alfLog("log", "Filter updated", payload);
            var pathElements = payload.path.split("/");
            
            if (this.tree != null && pathElements.length > 0)
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
         if (node != null && !node.isExpanded)
         {
            // It's almost certain that the node won't be expanded when first requested, and this is likely
            // to be because the data load is deferred (e.g. awaiting the results of the XHR request to get
            // it's children). In this event it is necessary to wait for the results to be available before
            // continuing to expand nodes on the path...
            this.alfLog("log", "Node load deferred", node._loadDeferred);
            node._loadDeferred.then(lang.hitch(this, "expandPathElement", node, pathElements));
         }
         else if (node != null &&
                  pathElements != null &&
                  pathElements.length > 0)
         {
            // If the node is expanded and there are more path elements to process then we can
            // immediately find the target node for the next path element and expand it...
            var childNodes = node.getChildren(),
                pathElement = pathElements.shift(),
                filteredNodes = array.filter(childNodes, function(item) {
               return item.item.name == pathElement;
            });
            if (filteredNodes.length == 1)
            {
               // There should only ever be one result, but it's important to check...
               // at least an invalid path (e.g. to a deleted or moved folder) will not
               // be processed. There should never be more than 1 result!
               var targetChildNode = filteredNodes[0];
               this.tree._expandNode(targetChildNode);
               this.expandPathElement(targetChildNode, pathElements);
            }
         }
      }
   });
});