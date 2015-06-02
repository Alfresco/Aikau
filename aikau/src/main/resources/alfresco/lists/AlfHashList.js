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
 * This extends the [basic list]{@link module:alfresco/lists/AlfList} to provide support
 * for reloading data based on relevant changes to the browser URL hash. The hash parameters that
 * are relevant (i.e. that when changed should cause the data to be reloaded) should be defined 
 * in the [hashVarsForUpdate attribute]{@link module:alfresco/lists/AlfHashList#hashVarsForUpdate}.
 * 
 * @module alfresco/lists/AlfHashList
 * @extends module:alfresco/lists/AlfList
 * @mixes module:alfresco/documentlibrary/_AlfHashMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfList", 
        "alfresco/documentlibrary/_AlfHashMixin",
        "dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query"], 
        function(declare, AlfList, _AlfHashMixin, lang, hash, ioQuery) {
   
   return declare([AlfList, _AlfHashMixin], {
      
      /**
       * Indicates whether the location should be driven by changes to the browser URL hash
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useHash: false,

      /**
       * An array of hash variables that when changed will trigger a reload
       *
       * @instance
       * @type {array}
       * @default []
       */
      hashVarsForUpdate: [],

      /**
       * Indicates whether or not changing URL hash parameters should be set as instance variables
       * on the list.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      updateInstanceValues: false,

      /**
       * Indicates whether or not the [hashVarsForUpdate]{@link module:alfresco/lists/AlfHashList#hashVarsForUpdate}
       * that are present in the current hash should be mapped directly into the 
       * [loadDataPublishPayload]{@link module:alfresco/lists/AlfList#loadDataPublishPayload}.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      mapHashVarsToPayload: false,

      /**
       * Determines whether or not a locally stored hash value should be maintained and re-used in the event of 
       * a hash not being found in the URL. This was added to support the scenario where a user might leave and 
       * then return to a page having lost the hash (e.g. actions on search).
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      useLocalStorageHashFallback: false,

      /**
       * The key to use for storing the hash when the [useLocalStorageHashFallback]{@link module:alfresco/lists/AlfHashList#useLocalStorageHashFallback}
       * is set to true.
       *
       * @instance
       * @type {string}
       * @default "ALF_LOCAL_STORAGE_HASH"
       */
      useLocalStorageHashFallbackKey: "ALF_LOCAL_STORAGE_HASH",

      /**
       * The AlfHashList is intended to work co-operatively with other widgets on a page to assist with
       * setting the data that should be retrieved. As related widgets are created and publish their initial
       * state they may trigger requests to load data. As such, data loading should not be started until
       * all the widgets on the page are ready. This function extends the [inherited function]{@link module:alfresco/lists/AlfList#onPageWidgetsReady}
       * to honour the [useHash configuration]{@link module:alfresco/lists/AlfList#useHash} and load data
       * appropriately.
       *
       * @instance
       * @param {object} payload
       */
      onPageWidgetsReady: function alfresco_lists_AlfHashList__onPageWidgetsReady(/*jshint unused:false*/payload) {
         // Remove the subscription to ensure it's only processed once...
         this.alfUnsubscribe(this.pageWidgetsReadySubcription);

         this._readyToLoad = true;
         if (this.useHash)
         {
            // Only subscribe to filter changes if 'useHash' is set to true. This is because multiple DocLists might
            // be required on the same page and they can't all feed off the hash to drive the location.
            this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onHashChanged));

            var hashString = hash();
            if (hashString === "" && 
                this.useLocalStorageHashFallback === true && 
                ("localStorage" in window && window.localStorage !== null))
            {
               // No hash has been provided, check local storage for last hash...
               var locallyStoredHash = localStorage.getItem(this.useLocalStorageHashFallbackKey);
               hashString = (locallyStoredHash !== null) ? locallyStoredHash : "";
               this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.updateLocallyStoredHash));
            }
            else if (hashString !== "" && 
                     this.useLocalStorageHashFallback === true && 
                     ("localStorage" in window && window.localStorage !== null))
            {
               // Store the initial hash...
               localStorage.setItem(this.useLocalStorageHashFallbackKey, hash());
            }

            var currHash = ioQuery.queryToObject(hashString);
            if(!this.doHashVarUpdate(currHash))
            {
               if (this.currentFilter)
               {
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                     url: ioQuery.objectToQuery(this.currentFilter),
                     type: "HASH"
                  }, true);
               }
               else
               {
                  this.loadData();
               }
            }
            else
            {
               // When using hashes (e.g. a URL fragment in the browser address bar) then we need to 
               // actually get the initial filter and use it to generate the first data set...
               this.initialiseFilter(hashString); // Function provided by the _AlfHashMixin
            }
         }
         else
         {
            // When not using a URL hash (e.g. because this DocList is being used as a secondary item - 
            // maybe as part of a picker, etc) then we need to load the initial data set using the instance
            // variables provided. We also need to subscribe to topics that indicate that the location has 
            // changed. Each view renderer that registers a link will need to set a "linkClickTopic" and this
            // should be matched by the "linkClickTopic" of this instance)
            this.alfSubscribe(this.linkClickTopic, lang.hitch(this, this.onItemLinkClick));
            if (this.currentData)
            {
               this.processLoadedData(this.currentData);
               this.renderView();
            }
            else
            {
               this.loadData();
            }
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#updateLoadDataPayload} to map
       * the [hashVarsForUpdate]{@link module:alfresco/lists/AlfHashList#hashVarsForUpdate} values into the
       * [loadDataPublishPayload]{@link module:alfresco/lists/AlfList#loadDataPublishPayload} if 
       * [mapHashVarsToPayload]{@link module:alfresco/lists/AlfHashList#mapHashVarsToPayload}
       * is set to true.
       *
       * @instance
       * @param {object} payload The payload to update
       */
      updateLoadDataPayload: function alfresco_lists_AlfHashList__updateLoadDataPayload(payload) {
         this.inherited(arguments);
         if (this.mapHashVarsToPayload)
         {
            var hashString = hash();
            var currHash = ioQuery.queryToObject(hashString);
            for(var i=0; i < this.hashVarsForUpdate.length; i++)
            {
               if(this.hashVarsForUpdate[i] in currHash)
               {
                  payload[this.hashVarsForUpdate[i]] = currHash[this.hashVarsForUpdate[i]];
               }
            }
         }
      },

      /**
       * Sets the current hash in the local storage.
       *
       * @instance
       * @param {object} payload
       */
      updateLocallyStoredHash: function alfresco_lists_AlfHashList__onHashChanged(/*jshint unused:false*/payload) {
         // Save the hash to local storage if required...
         if(this.useLocalStorageHashFallback === true && 
            ("localStorage" in window && window.localStorage !== null))
         {
            localStorage.setItem(this.useLocalStorageHashFallbackKey, hash());
         }
      },

      /**
       * This function is called whenever the browser URL hash fragment is changed.e end of the fragment
       * 
       * @instance
       * @param {object} payload
       */
      onHashChanged: function alfresco_lists_AlfHashList__onHashChanged(payload) {
         // Process the hash...
         if(this.doHashVarUpdate(payload, this.updateInstanceValues))
         {
            this._updateCoreHashVars(payload);
            if (this._readyToLoad)
            {
               this.loadData();
            }
         }
      },

      /**
       * This is an extension point function that is provided to allow core URL hash parameters to be
       * addressed when the URL hash change triggers a reload. For example this allows the
       * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList} to address
       * hash parameters relating to sorting and pagination and the 
       * [AlfDocumentList]{@link module:alfresco/documentlibrary/AlfDocumentList} to further address
       * hash parameters relating to filtering.
       *
       * @instance
       * @param {object} hashParameters An object containing the current hash parameters
       */
      _updateCoreHashVars: function alfresco_lists_AlfHashList___updateCoreHashVars(hashParameters) {
         // jshint unused:false
         // No action by default
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#onDataLoadSuccess} to check
       * whether or not a URL hash parameter is set to indicate a particular item to bring into view.
       * This URL hash parameter checked is the "currentItem" and if this is found it will publish the
       * value on the "ALF_BRING_ITEM_INTO_VIEW" topic.
       * 
       * @param  {object} payload The payload containing the loaded data.
       * @fires module:alfresco/lists/views/ListRenderer~event:ALF_BRING_ITEM_INTO_VIEW
       */
      onDataLoadSuccess: function alfresco_lists_AlfHashList__onDataLoadSuccess(/*jshint unused:false*/ payload) {
         this.inherited(arguments);
         var hashString = hash();
         var currHash = ioQuery.queryToObject(hashString);
         if (currHash.currentItem)
         {
            this.alfPublish("ALF_BRING_ITEM_INTO_VIEW", {
               item: currHash.currentItem
            });
         }
      }
   });
});