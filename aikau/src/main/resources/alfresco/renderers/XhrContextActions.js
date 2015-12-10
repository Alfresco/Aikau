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
 * <p>This module extends the standard [actions renderer]{@link module:alfresco/renderers/Actions} to 
 * provide the capability to asynchronously retrieve the actions for a specific Alfresco document or 
 * folder when only the NodeRef is known.</p>
 *
 * @module alfresco/renderers/XhrContextActions
 * @extends module:alfresco/renderers/ContextActions
 * @mixes module:alfresco/renderers/_XhrActionsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/ContextActions",
        "alfresco/renderers/_XhrActionsMixin"], 
        function(declare, ContextActions, _XhrActionsMixin) {

   return declare([ContextActions, _XhrActionsMixin], {
      // NOTE: The key thing about this module is the mixing of ContextActions and _XhrActionsMixin
   });
});