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
 * This extends the [Twister]{@link module:alfresco/layout/Twister} and mixes in
 * the [LayoutMixin]{@link module:alfresco/forms/LayoutMixin} to provide a collapsible section
 * into which form controls can be placed. 
 *
 * @example <caption>Example form with a CollapsibleSection</caption>
 * {
 *   name: "alfresco/forms/Form",
 *   config: {
 *     okButtonPublishTopic: "SAVE_FORM",
 *     widgets: [
 *       {
 *         name: "alfresco/forms/CollapsibleSection",
 *         config: {
 *           label: "Section"
 *           widgets: [
 *             {
 *               name: "alfresco/forms/controls/TextBox",
 *               config: {
 *               fieldId: "TB1",
 *               name: "tb1",
 *               label: "Text box"
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/forms/CollapsibleSection
 * @extends module:alfresco/layout/Twister,
 * @mixes module:alfresco/forms/LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/layout/Twister",
        "alfresco/forms/LayoutMixin"], 
        function(declare, Twister, LayoutMixin) {
   
   return declare([Twister, LayoutMixin], {
      // NOTE: All the code for this widget is provided by the mixing of Twister and LayoutMixin
   });
});