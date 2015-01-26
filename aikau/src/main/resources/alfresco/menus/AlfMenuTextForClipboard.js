/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * <p>This widget was written with the intention of making it easy to copy-and-paste text from within a 
 * [drop-down menu]{@link module:alfresco/menus/AlfMenuBarPopup}. It was written to implement the
 * "Quick Share" menu in the Document Library where a user is able to quickly access the link to the shared
 * document from within the menu.</p>
 * <p>It is intended to be placed inside a [cascading menu]{@link module:alfresco/menus/AlfCascadingMenu} so that
 * when a user expands the cascade using the keyboard the text is immediately highlighted so that they can simply
 * use CTRL-C to capture it.</p>
 * <p>Sample configuration: </p>
 * <p><pre>{
 *    name: "alfresco/menus/AlfCascadingMenu",
 *     config: {
 *        id: "MyCascade",
 *        label: "Copy some text...",
 *        widgets: [
 *           {
 *              name: "alfresco/menus/AlfMenuTextForClipboard",
 *              config: {
 *                 id: "MyTextToCopy",
 *                 label: "Copy me: ",
 *                 textForClipboard: "Some sample text"
 *              }
 *           }
 *        ]
 *     }
 *  }</pre></p>
 * @module alfresco/menus/AlfMenuTextForClipboard
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfMenuTextForClipboard.html",
        "alfresco/core/Core",
        "dojo/dom-attr"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, domAttr) {
   
   /**
    * This class has been created to act as the main container for the popup referenced by "alfresco/menus/AlfMenuBarPopup".
    * It currently just acts as a container object but is intended to allow instances of "alfresco/menus/AlfMenuGroup" to be
    * added into a menu bar popup.
    */
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfMenuTextForClipboard.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfMenuTextForClipboard.css"}],
      
      /**
       * A label for the text to be copied. This can be a i18n key for translation or a specific label.
       * It can be left as null or the empty string if a label is not required.
       * @instance
       * @type {string}
       * @default null
       */
      label: null,

      /**
       * The text to be made available for copying. 
       *
       * @instance
       * @type {string}
       * @default null
       */
      textForClipboard: null,

      /**
       * This ensures that the label 
       * @instance
       */
      postMixInProperties: function alfresco_menus_AlfMenuTextForClipboard__postMixInProperties() {
         if (this.label != null)
         {
            this.label = this.encodeHTML(this.message(this.label));
         }
         else
         {
            this.label = "";
         }
         if (this.textForClipboard != null)
         {
            this.textForClipboard = this.encodeHTML(this.textForClipboard);
         }
         else
         {
            this.textForClipboard = "";
         }
      },
      
      /**
       * When the widget gains focus the input element should be selected so that it's contents can be
       * easily copied to the keyboard
       * 
       * @instance
       */
      focus: function alfresco_menus_AlfMenuTextForClipboard__focus() {
         domAttr.set(this.inputNode, "value", this.textForClipboard);
         this.inputNode.select();
      }
   });
});