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
 * This mixin acts as an interface for widgets displaying uploads' progress, and all widgets used for displaying
 * uploads' progress through the [UploadService]{@link module:alfresco/services/UploadService} should extend it.
 *
 * @module alfresco/upload/_UploadsDisplayMixin
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Martin Doyle
 * @since 1.0.50
 * @deprecated Since 1.0.60 - Use [UploadsDisplayInterface]{@link module:alfresco/upload/UploadsDisplayInterface} instead
 */
define(["alfresco/core/Core",
        "alfresco/upload/UploadsDisplayInterface",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/_base/declare"], 
        function(AlfCore, UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, declare) {

   return declare([UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, AlfCore], {});
});