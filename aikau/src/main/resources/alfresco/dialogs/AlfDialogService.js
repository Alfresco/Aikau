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
 * This module has now been deprecated. The [DialogService]{@link module:alfresco/services/DialogService}
 * should be used instead. This module will be removed in version 2.0 of Aikau.
 *
 * @module alfresco/dialogs/AlfDialogService
 * @extends module:alfresco/services/DialogService
 * @author Dave Draper
 * @author David Webster
 * @deprecated Since 1.0.3 - use [alfresco/services/DialogService]{@link module:alfresco/services/DialogService} instead
 */
define(["dojo/_base/declare",
        "alfresco/services/DialogService"],
        function(declare, DialogService) {

   return declare([DialogService], {
   });
});