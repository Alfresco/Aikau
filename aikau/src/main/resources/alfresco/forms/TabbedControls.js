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
 * This extends the [AlfTabContainer]{@link module:alfresco/layout/AlfTabContainer} and mixes in
 * the [LayoutMixin]{@link module:alfresco/forms/LayoutMixin} to provide a tab container that form
 * controls can be placed. Each tab should be added as a
 * [ControlColumn]{@link module:alfresco/forms/ControlColumn} widget on which the tab title can
 * be configured.
 *
 * @example <caption>Example of form containing tabbed controls</caption>
 * {
 *   name: "alfresco/forms/Form",
 *   config: {
 *     okButtonPublishTopic: "SAVE_FORM",
 *     widgets: [
 *       {
 *         name: "alfresco/forms/TabbedControls",
 *         config: {
 *           widgets: [
 *             {
 *               name: "alfresco/forms/ControlColumn",
 *               title: "Tab 1",
 *               config: {
 *                 widgets: [
 *                   {
 *                     name: "alfresco/forms/controls/TextBox",
 *                     config: {
 *                       fieldId: "TB1",
 *                       name: "tb1",
 *                       label: "Text box in tab 1"
 *                     }
 *                   }
 *                 ]
 *               }
 *             },
 *             {
 *               name: "alfresco/forms/ControlColumn",
 *               title: "Tab 2",
 *               config: {
 *                 widgets: [
 *                   {
 *                     name: "alfresco/forms/controls/TextBox",
 *                     config: {
 *                       fieldId: "TB2",
 *                       name: "tb2",
 *                       label: "Text box in tab 2"
 *                     }
 *                   }
 *                 ]
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/forms/TabbedControls
 * @extends module:alfresco/layout/AlfTabContainer,
 * @mixes module:alfresco/forms/LayoutMixin
 * @author Dave Draper
 */
define(["alfresco/layout/AlfTabContainer",
        "alfresco/forms/LayoutMixin",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(HorizontalWidgets, LayoutMixin, declare, lang, array) {
   
   return declare([HorizontalWidgets, LayoutMixin], {
      
      /**
       * Overrides the [default]{@link module:alfresco/layout/AlfTabContainer#delayProcessingDefault} 
       * delayed processing setting so that all form fields will be created immediately so that their
       * validity can be processed.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      delayProcessingDefault: false,

      /**
       * This is used to track the form controls that exist within the tabs.
       *
       * @instance
       * @type {object[]}
       * @default null
       */
      _tabbedFormControls: null,

      /**
       * Overrides the [mixed in function]{@link module:alfresco/forms/LayoutMixin#getFormLayoutChildren}
       * to get the [current array of form controls]{@link module:alfresco/forms/TabbedControls#_tabbedFormControls}.
       *
       * @instance
       * @return {object[]} An array of the form controls to iterate over.
       */
      getFormLayoutChildren: function alfresco_forms_LayoutMixin__getFormLayoutChildren() {
         if (!this._tabbedFormControls)
         {
            this._tabbedFormControls = [];
            array.forEach(this.tabContainerWidget.getChildren(), lang.hitch(this, function(contentPane) {
               this._tabbedFormControls = this._tabbedFormControls.concat(contentPane.getChildren());
            }));
         }
         return this._tabbedFormControls;
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/layout/AlfTabContainer#onTabAdd} to
       * update the list of the currently available form controls.
       * 
       * @instance
       * @param {object} payload Details of the tab to delete
       */
      onTabAdd: function alfresco_layout_AlfTabContainer__onTabAdd(/*jshint unused:false*/ payload) {
         this.inherited(arguments);

         // Reset the current array and then recreate it...
         this._tabbedFormControls = null;
         this.getFormLayoutChildren();
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/layout/AlfTabContainer#onTabDelete} to
       * update the list of the currently available form controls.
       * 
       * @instance
       * @param {object} payload Details of the tab to delete
       */
      onTabDelete: function alfresco_layout_AlfTabContainer__onTabDelete(/*jshint unused:false*/ payload) {
         this.inherited(arguments);

         // Reset the current array and then recreate it...
         this._tabbedFormControls = null;
         this.getFormLayoutChildren();
      }
   });
});