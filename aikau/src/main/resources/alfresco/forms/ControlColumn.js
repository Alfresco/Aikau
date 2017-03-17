/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This extends the [VerticalWidgets]{@link module:alfresco/layout/VerticalWidgets} and mixes in
 * the [LayoutMixin]{@link module:alfresco/forms/LayoutMixin} to provide a basic layout container
 * for stacking form controls vertically. This can be used in conjunction with other form control
 * layout widgets such as [TabbedControls]{@link module:alfresco/forms/TabbedControls} and
 * [ControlRow]{@link module:alfresco/forms/ControlRow} to create interesting layouts for forms.
 * 
 * @module alfresco/forms/ControlColumn
 * @extends module:alfresco/layout/VerticalWidgets,
 * @mixes module:alfresco/forms/LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/layout/VerticalWidgets",
        "alfresco/forms/LayoutMixin"], 
        function(declare, VerticalWidgets, LayoutMixin) {
   return declare([VerticalWidgets, LayoutMixin], {});
});