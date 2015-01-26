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
 *
 * @module alfresco/core/NodeUtils
 * @author Dave Draper & David Webster
 */
define(["dojo/_base/lang",
        "dojo/_base/array"],
        function(lang, array) {

   return {

      /**
       * Converts the supplied NodeRef string into an object containing its composite attributes.
       *
       * @instance
       * @param {string} nodeRefInput
       * @return {object}
       */
      processNodeRef: function alfresco_core_NodeUtils__processNodeRef(nodeRefInput) {
         try
         {

            // Split the nodeRef and rebuild from composite parts, for clarity and to support input of uri node refs.
            var arr = nodeRefInput.replace(":/", "").split("/"),
               storeType = arr[0],
               storeId = arr[1],
               id = arr[2],
               uri = storeType + "/" + storeId + "/" + id,
               nodeRef = storeType + "://" + storeId + "/" + id;

            return (
            {
               nodeRef: nodeRef,
               storeType: storeType,
               storeId: storeId,
               id: id,
               uri: uri,
               toString: function()
               {
                  return nodeRef;
               }
            });
         }
         catch (e)
         {
            e.message = "Invalid nodeRef: " + nodeRef;
            throw e;
         }
      },

      /**
       * This method takes an array of node objects and turns it into an array containing just the nodeRef for
       * each node in the object.
       *
       * @param {Object[]} nodes
       * @returns {Array} nodeRefArray
       */
      nodeRefArray: function alfresco_core_NodeUtils__nodeRefArray(nodes) {

         if (!lang.isArray(nodes))
         {
            this.alfLog("error", "expected an array of nodes, but didn't receive one");
         }

         var nodeRefArray = array.map(nodes, function(node){
            if (node.nodeRef) {
               return node.nodeRef;
            }
         });

         return nodeRefArray;
      },

      /**
       * Takes the array of node objects, retrieves the nodeRefs and returns as a string.
       *
       * @param {Object[]} nodes
       * @returns {String} comma separated list of nodeRefs
       */
      nodeRefsString: function alfresco_core_NodeUtils_nodeRefString(nodes) {

         // Use nodeRefArray to extract the nodeRefs from the object.
         return this.nodeRefArray(nodes).join(',');
      },

      /**
       * Tries to get a common parent nodeRef for an action that requires one.
       *
       * @method getParentNodeRef
       * @param record {object} Object literal representing one file or folder to be actioned
       * @return {string|null} Parent nodeRef or null
       */
      getParentNodeRef: function dlA_getParentNodeRef(record)
      {
         var nodeRef = null;

         if (lang.isArray(record))
         {
            try
            {
               nodeRef = this.doclistMetadata.parent.nodeRef;
            }
            catch (e)
            {
               nodeRef = null;
            }

            if (nodeRef === null)
            {
               for (var i = 1, j = record.length, sameParent = true; i < j && sameParent; i++)
               {
                  sameParent = (record[i].parent.nodeRef == record[i - 1].parent.nodeRef);
               }

               nodeRef = sameParent ? record[0].parent.nodeRef : this.doclistMetadata.container;
            }
         }
         else
         {
            nodeRef = lang.getObject("record.parent.nodeRef", false, this);
         }

         return nodeRef;
      }
   };
});