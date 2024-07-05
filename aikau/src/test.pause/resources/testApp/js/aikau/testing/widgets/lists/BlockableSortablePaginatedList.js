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
 * This extends the regular paginating list to support the ability to simulate that a request is in progress.
 * 
 * @module aikauTesting/widgets/lists/BlockableSortablePaginatedList
 * @extends module:alfresco/lists/AlfSortablePaginatedList
 * @author Dave Draper
 * @since 1.0.75
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "dojo/_base/lang"], 
        function(declare, AlfSortablePaginatedList, lang) {
   
   return declare([AlfSortablePaginatedList], {
      
      /**
       * Called after properties mixed into instance
       *
       * @instance
       */
      postMixInProperties: function aikauTesting_widgets_lists_BlockableSortablePaginatedList__postMixInProperties() {
         this.inherited(arguments);

         // Set up a subscription to block requests...
         this.alfSubscribe("BLOCK_REQUESTS", lang.hitch(this, function(payload) {
            this.requestInProgress = payload.value;
         }));
      }
   });
});