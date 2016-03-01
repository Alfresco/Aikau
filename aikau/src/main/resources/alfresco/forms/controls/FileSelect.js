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
 * @module alfresco/forms/controls/FileSelect
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/html/FileInput",
        "dojo/_base/lang"], 
        function(BaseFormControl, declare, FileInput, lang) {
   
   return declare([BaseFormControl], {
      
      /**
       * Configuring this attribute to be true will result in the wrapped [FileInput]{@link module:alfresco/html/FileInput}
       * widget being recreated each time that file or files are selected. This option was added to support a specific
       * use case, see https://issues.alfresco.com/jira/browse/AKU-834 for details.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.57
       */
      recreateControlOnSelect: false,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_FileSelect__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_FileSelect__createFormControl(config, /*jshint unused:false*/ domNode) {
         return new FileInput(config);
      },

      /**
       * Recreate the control (part of fix for AKU-834)
       *
       * @instance
       * @since 1.0.57
       */
      recreateControl: function alfresco_forms_controls_FileSelect__recreateControl() {
         var config = {
            id: this.wrappedWidget.id,
            name: this.name
         };
         this.wrappedWidget.destroy();
         this.wrappedWidget = this.createFormControl(config);
         this.wrappedWidget.placeAt(this._controlNode);
         this.setupChangeEvents();
      },
      
      /**
       * Overrides the default change events to use blur events on the text box. This is done so that we can validate
       * on every single keypress. However, we need to keep track of old values as this information is not readily
       * available from the text box itself.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_FileSelect__setupChangeEvents() {
         if (this.wrappedWidget)
         {
            this.wrappedWidget.on("change", lang.hitch(this, this.onFilesSelected));
         }
      },

      /**
       * @instance
       * @param {object} evt The onchange event
       */
      onFilesSelected: function alfresco_forms_controls_FileSelect__onFilesSelected(evt) {
         this.alfLog("log", "Files selected", evt, this);
         this.onValueChangeEvent(this.name, this.lastValue, this.wrappedWidget.getValue());
         if (this.recreateControlOnSelect)
         {
            this.recreateControl(); // This is needed to fix AKU-834
         }
      }
   });
});