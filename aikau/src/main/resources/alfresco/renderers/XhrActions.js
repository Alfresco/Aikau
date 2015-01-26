/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * <p>This module extends the standard [actions renderer]{@link module:alfresco/renderers/Actions} to 
 * provide the capability to asynchronously retrieve the actions for a specific Alfresco document or 
 * folder when only the NodeRef is known.</p>
 *
 * @module alfresco/renderers/XhrActions
 * @extends module:alfresco/renderers/Actions
 * @mixes module:alfresco/renderers/_XhrActionsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Actions",
        "alfresco/renderers/_XhrActionsMixin"], 
        function(declare, Actions, _XhrActionsMixin) {

   return declare([Actions, _XhrActionsMixin], {
      // Note: It might appear as though this widget does nothing, but actually it's
      //       the simple act of extending Actions and mixing in the _XhrActionsMixin that
      //       this module provides.
   });
});