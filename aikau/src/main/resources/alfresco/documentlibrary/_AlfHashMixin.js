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
 * Provides HTML5 style hash based history and location marking. This adopts the pattern originally used by
 * the Document Library in Alfresco Share but can be mixed into any widget that requires hashing. Ideally this
 * should only be mixed into a single widget on a page (e.g. the [DocumentList]{@link module:alfresco/documentlibrary/AlfDocumentList})
 * or multiple publications will occur on a hash change, but the activity of these publications can be tweaked 
 * with the careful application of the hashVarsForUpdate, hashVarsForUpdateRequired and 
 * hashVarsForUpdateMustEqual. 
 * 
 * @module alfresco/documentlibrary/_AlfHashMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 * @author Richard Smith
 * @example <caption>Sample configuration as applied with an [AlfHashList]{@link module:alfresco/lists/AlfHashList})</caption>
 * {
 *    name: "alfresco/lists/AlfHashList",
 *    config: {
 *       loadDataPublishTopic: "MY_TOPIC",
 *       useHash: true,
 *       // Trigger a data update when any of these hash variables is present in the hash string
 *       hashVarsForUpdate: [
 *          "one",
 *          "two",
 *          "three"
 *       ],
 *       // Only perform an update when all of these hash variables are still present in the hash string
 *       hashVarsForUpdateRequired: [
 *          "one",
 *          "two"
 *       ],
 *       // Only proceed with the data update when the hash variable 'view' is equal to 'my_view'
 *       hashVarsForUpdateMustEqual: [
 *          {
 *             name: "view",
 *             value: "my_view"
 *          }
 *       ],
 *       widgets: [
 *          {
 *             name: "alfresco/lists/views/AlfListView",
 *             config: {
 *                ...
 *             }
 *          }
 *       ]
 *    }
 * }
 */

define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/documentlibrary/_AlfFilterMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/hash",
        "dojo/_base/lang"], 
        function(declare, AlfCore, _AlfFilterMixin, _AlfDocumentListTopicMixin, hash, lang) {
   
   return declare([AlfCore, _AlfFilterMixin, _AlfDocumentListTopicMixin], {

      /**
       * Extends the constructor chain to subscribe to the "/dojo/hashchange" topic which is hitched
       * to [onHashChange]{@link module:alfresco/documentlibrary/_AlfHashMixin#onHashChange}.
       * @instance
       */
      constructor: function() {
         this.alfSubscribe("/dojo/hashchange", lang.hitch(this, "onHashChange"));
      },
      
      /**
       * Checks the initial state of the hash location. This is to ensure that bookmarks and copied
       * links work on page loading. It is possible to provide an optional hash string which if provided
       * will be used to set the current hash which in turn should trigger an hash change events.
       * 
       * @instance
       * @param {string} hashString An optional string to use as the hash. If not provided the current hash will be
       */
      initialiseFilter: function(hashString) {
         if (!hashString)
         {
            this.onHashChange(hash());
         }
         else
         {
            hash(hashString);
            this.onHashChange(hash());
         }
      },
      
      /**
       * Responds to changes in the page hash.
       * 
       * @instance
       * @param {object} payload The publication topic. This object needs to contain the attribute 'filter' for
       * anything to happen.
       */
      onHashChange: function alfresco_documentlibrary__AlfHashMixin__onHashChange(payload) {
         var filterObj = this.processFilter(payload);
         this.alfLog("log", "Publishing decoded filter", filterObj);
         this.alfPublish(this.hashChangeTopic, filterObj);
      },

      /**
       * Tests if a hashVar update should be performed by combining the results of payloadContainsUpdateableVar (does the hash 
       * containing ANYTHING we care about), payloadContainsRequiredUpdateableVars (does the hash contain EVERYTHING we care about) 
       * and payloadContainsEqualUpdateableVars (are there values in the hash that are EQUAL to what we care about). 
       *
       * @instance
       * @param {object} payload The payload object
       * @return {boolean}
       * @private
       */
      doHashVarUpdate: function alfresco_documentlibrary__AlfHashMixin__doHashVarUpdate(payload, updateInstanceValues, updateObject) {
         return this.payloadContainsUpdateableVar(payload, updateInstanceValues, updateObject) && 
                this.payloadContainsRequiredUpdateableVars(payload) && 
                this.payloadContainsEqualUpdateableVars(payload);
      },

      /**
       * Compares the payload object with the hashVarsForUpdate array of key names
       * Returns true if hashVarsForUpdate is empty
       * Returns true if the payload contains a key that is specified in hashVarsForUpdate
       * Returns false otherwise
       *
       * Using configuration, this function allows hash updates to be performed when a particular hash value changes.
       * 
       * @instance
       * @param {object} payload The payload object
       * @param {boolean} updateInstanceValues Indicates whether or not the list instance should be updated with the payload values
       * @return {boolean}
       */
      payloadContainsUpdateableVar: function alfresco_documentlibrary__AlfHashMixin__payloadContainsUpdateableVar(payload, updateInstanceValues, updateObject) {
         // jshint maxcomplexity:false
         var containsUpdateableVar = false;

         // No hashVarsForUpdate - return true
         if(!this.hashVarsForUpdate || this.hashVarsForUpdate.length === 0)
         {
            containsUpdateableVar = true;
            if (updateInstanceValues === true)
            {
               lang.mixin(updateObject || this, payload);
            }
         }
         else
         {
            // Iterate over the keys defined in hashVarsForUpdate - return true if the payload contains one of them
            for(var i=0; i < this.hashVarsForUpdate.length; i++)
            {
               if(this.hashVarsForUpdate[i] in payload)
               {
                  if (updateInstanceValues === true)
                  {
                     var objectToUpdate = updateObject || this;
                     objectToUpdate[this.hashVarsForUpdate[i]] = payload[this.hashVarsForUpdate[i]];
                  }
                  containsUpdateableVar = true;
               }
            }

            // This code block has been added to address hash related pagination issues reported in 
            // AKU-293 and AKU-302. We want to be able to support updates for hash parameters that
            // do NOT require updating instance values. At some point we should be able to remove
            // this code block with refactoring to the AlfSearchList and AlfDocumentList
            if (this._coreHashVars)
            {
               for(i=0; i < this._coreHashVars.length; i++)
               {
                  if(this._coreHashVars[i] in payload)
                  {
                     containsUpdateableVar = true;
                  }
               }
            }
         }
         return containsUpdateableVar;
      },

      /**
       * Compares the payload object with the hashVarsForUpdateRequired array of key names
       * Returns true if hashVarsForUpdateRequired is empty
       * Returns true if the payload contains all keys that are specified in hashVarsForUpdateRequired
       * Returns false otherwise
       *
       * Using configuration, this function allows hash updates to be performed only when a particular set of hash values is present. All 
       * of the defined keys must be present in the hash string.
       *
       * @instance
       * @param {object} payload The payload object
       * @return {boolean}
       * @private
       */
      payloadContainsRequiredUpdateableVars: function alfresco_documentlibrary__AlfHashMixin__payloadContainsRequiredUpdateableVars(payload) {
         // No hashVarsForUpdateRequired - return true
         if(!this.hashVarsForUpdateRequired || this.hashVarsForUpdateRequired.length === 0)
         {
            return true;
         }
         
         // Iterate over the keys defined in hashVarsForUpdateRequired - return false if the payload does not contains one of them
         for(var i=0; i < this.hashVarsForUpdateRequired.length; i++)
         {
            if(!(this.hashVarsForUpdateRequired[i] in payload))
            {
               return false;
            }
         }
         return true;
      },

      /**
       * Compares the payload object with the hashVarsForUpdateMustEqual array of key value pairs
       * Returns true if hashVarsForUpdateMustEqual is empty
       * Returns true if the payload contains the keys that are specified in hashVarsForUpdateMustEqual at the correct value
       * Returns false otherwise
       *
       * Using configuration, this function allows hash updates to be performed only when a particular hash value is present and equal 
       * to a set value.
       *
       * @instance
       * @param {object} payload The payload object
       * @return {boolean}
       * @private
       */
      payloadContainsEqualUpdateableVars: function alfresco_documentlibrary__AlfHashMixin__payloadContainsEqualUpdateableVars(payload) {
         // No hashVarsForUpdateMustEqual - return true
         if(!this.hashVarsForUpdateMustEqual || this.hashVarsForUpdateMustEqual.length === 0)
         {
            return true;
         }
         
         // Iterate over the keys defined in hashVarsForUpdateMustEqual - return false if the key is missing or of the wrong value
         for(var i=0; i < this.hashVarsForUpdateMustEqual.length; i++)
         {
            if(!(this.hashVarsForUpdateMustEqual[i].name in payload) || 
               payload[this.hashVarsForUpdateMustEqual[i].name] !== this.hashVarsForUpdateMustEqual[i].value)
            {
               return false;
            }
         }
         return true;
      }
   });
});