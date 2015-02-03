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
 * This extends [AlfDialog]{@link module:alfresco/dialogs/AlfDialog} to mixin
 * [_MultiItemRendererMixin]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin} so that
 * the individual item data can be rendered correctly. Although this widget appears to add no new
 * functions the additional capability is entirely added via the mixin module.
 * 
 * @module alfresco/lists/views/layouts/Popup
 * @extends module:alfresco/dialogs/AlfDialog
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dialogs/AlfDialog",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin"], 
        function(declare, AlfDialog, _MultiItemRendererMixin) {
   
   return declare([AlfDialog, _MultiItemRendererMixin], {});
});