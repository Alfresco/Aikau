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
 * This module has now been deprecated.
 * 
 * @module alfresco/forms/controls/DojoValidationTextBox
 * @extends module:alfresco/forms/controls/TextBox
 * @author Dave Draper
 * @deprecated Since 1.0.3 - use [alfresco/forms/controls/TextBox]{@link module:alfresco/forms/controls/TextBox} instead.
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/TextBox"], 
        function(declare, TextBox) {
   
   return declare([TextBox], {});
});