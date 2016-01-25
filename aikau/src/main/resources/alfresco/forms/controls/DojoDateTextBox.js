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
 * @module alfresco/forms/controls/DojoDateTextBox
 * @extends module:alfresco/forms/controls/DateTextBox
 * @author Dave Draper
 * @deprecated Since 1.0.3 - use [alfresco/forms/controls/DateTextBox]{@link module:alfresco/forms/controls/DateTextBox} instead
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/DateTextBox"],
        function(declare, DateTextBox) {
   return declare([DateTextBox], {});
});