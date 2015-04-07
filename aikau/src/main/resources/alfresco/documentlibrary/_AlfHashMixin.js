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
 * or multiple publications will occur on a hash change (although this in itself shouldn't be a major problem if
 * subscribers check for changes to their current status). 
 * 
 * @module alfresco/documentlibrary/_AlfHashMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
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
      }
   });
});