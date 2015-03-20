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
 * @module alfresco/dnd/DroppedFormControlWrapper
 * @extends module:alfresco/dnd/DroppedNestingItemWrapper
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dnd/DroppedNestingItemWrapper",
        "alfresco/core/ObjectProcessingMixin"], 
        function(declare, DroppedItemWrapper, ObjectProcessingMixin) {
   
   return declare([DroppedItemWrapper, ObjectProcessingMixin], {

      /**
       * Extends the inherited function to add in any other form controls
       * 
       * @param {object} item The current item being edited.
       * @param {promise} resolvedPromise A resolved promise that is expected to contain a widgets array
       */
      onEditConfig: function alfresco_dnd_DroppedFormControlWrapper__onEditConfig(item, resolvedPromise) {
         this.currentItem = {};
         this.currentItem.formControlOptions = this.formControlOptions;
         this.processObject(["processCurrentItemTokens"], resolvedPromise.widgets);
         this.inherited(arguments);
      }
   });
});