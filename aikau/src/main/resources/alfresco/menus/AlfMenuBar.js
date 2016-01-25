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
 * <p>This widget is the base to be used when constructing menus. Typically this widget should be configured with
 * a combination of [menu bar items]{@link module:alfresco/menus/AlfMenuBarItem} and
 * [popup menus]{@link module:alfresco/menus/AlfMenuBarPopup} (although custom menu widgets could also be included).
 * This widget supports keyboard navigation using the cursor keys and enter or space for selection (please note that
 * using the tab key will jump to the next widget - tab is not used to navigate items within the menu bar).</p>
 * <p>The default menu bar behaviour is for all [popup menus]{@link module:alfresco/menus/AlfMenuBarPopup} to appear
 * below the menu bar, however it is possible to configure this widget so that they appear above the menu bar by 
 * configuring the [popupMenusAbove]{@link module:alfresco/menus/AlfMenuBar#popupMenusAbove} attribute to be true.</p>
 *
 * @example <caption>Typical menu bar configuration</caption>
 * {
 *   name: "alfresco/menus/AlfMenuBar",
 *   config: {
 *     widgets: [
 *        {
 *          name: "alfresco/menus/AlfMenuBarItem",
 *          config: {
 *            label: "Do something",
 *            publishTopic: "DO_SOMETHING",
 *            publishPayload: {
 *               data: "INFO_ABOUT_WHAT_TO_DO"
 *            }
 *          }
 *        }
 *     ]
 *   }
 * }
 *
 * @example <caption>Configuring a menu bar with popups above</caption>
 * {
 *   name: "alfresco/menus/AlfMenuBar",
 *   config: {
 *     popupMenusAbove: true,
 *     widgets: [
 *        {
 *          name: "alfresco/menus/AlfMenuBarPopup",
 *          config: {
 *            label: "More options...",
 *            widgets: [
 *              {
 *                name: "alfresco/menus/AlfMenuItem",
 *                config: {
 *                  label: "Do something",
 *                  publishTopic: "DO_SOMETHING",
 *                  publishPayload: {
 *                    data: "INFO_ABOUT_WHAT_TO_DO"
 *                  }
 *                }
 *              }
 *            ]
 *          }
 *        }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/menus/AlfMenuBar
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfMenuBar.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/array",
        "dijit/MenuBar"], 
        function(declare, _WidgetBase, _TemplatedMixin, template,  AlfCore, CoreWidgetProcessing, array, MenuBar) {

   /**
    * This is a customization of the default dijit/MenuBar implementation to allow menu popups to be locked.
    * The reason that this feature was implemented was because it was observed that including the dijit/form/Textarea
    * widget (and presumably other widgets) within a popup menu resulted in focus issues occurring following
    * user input that would cause the popups to close inappropriately. This customization is something of a hack
    * as a "proper" solution could not be found to control the focus stack and associated events adequately. This
    * problem was found specifically when implementing the alfresco/header/UserStatus widget.
    */
   var CustomMenuBar = declare([MenuBar, AlfCore], {
      
      /**
       * This boolean attribute is used as an indicator of whether or not the MenuBar popups should
       * be locked in the open state.
       * 
       * @instance
       * @type {boolean}
       */
      _lockPopupsOpen: false,

      /**
       * Overriden to only allow the default implementation to execute if the _lockPopupsOpen attribute
       * is set to false. 
       * 
       * @instance
       */
      _closeChild: function alfresco_menus_AlfMenuBar_CustomMenuBar___closeChild(){
         this.alfLog("log", "Custom MenuBar _closeChild");
         if (this._lockPopupsOpen)
         {
            // No action required.
         }
         else
         {
            this.inherited(arguments);
         }
      }
   });
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {String}
       */
      i18nScope: "org.alfresco.Menus",
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/AlfMenuBar.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfMenuBar.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * In some circumstances it may be required to have the [popup menus]{@link module:alfresco/menus/AlfMenuBarPopup}
       * appear above the menu bar (e.g. if the menu bar is at the bottom of a page or layout control). This attribute
       * can be configured to be true in order to support that requirement. The default value is false which will result
       * in [popup menus]{@link module:alfresco/menus/AlfMenuBarPopup} being displayed below the menu bar.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      popupMenusAbove: false,

      /**
       * A reference to the MenuBar
       * 
       * @instance
       * @type {Object}
       */
      _menuBar: null,
      
      /**
       * This function has been provided to set the _lockPopupsOpen attribute in the custom MenuBar implementation
       * (declared above) to prevent the _closeChild function from executing. This function (and the associated
       * custom MenuBar) has been implemented to handle calls from the alfresco/header/UserStatus widget which
       * needs to prevent the MenuBar from closing popups when the dijit/form/Textarea used for capturing user 
       * status has focus.
       * 
       * @instance
       * @param b {boolean}
       */
      lockPopupsOpen: function alfresco_menus_AlfMenuBar__lockPopupsOpen(b) {
         this._menuBar._lockPopupsOpen = b; 
      },
      
      /**
       * Instantiates the MenuBar (a custom declared implementation) and processes the widgets assigned to ensure
       * that the labels are localized before being sent for processing.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBar__postCreate() {
         this._menuBar = new CustomMenuBar({
            _orient: this.popupMenusAbove === true ? ["above"] : ["below"]
         });
         this._menuBar.placeAt(this.containerNode);

         if (this.widgets && this.widgets instanceof Array)
         {
            // Convert any i18n keys into the translated labels...
            array.forEach(this.widgets, function(entry) {
               if (entry.config && entry.config.label)
               {
                  entry.config.label = this.message(entry.config.label);
               }
            }, this);
            
            // Process all the widgets, when complete the allWidgetsProcessed function will be called
            // with all the instantiated menu widgets passed as an argument. These will then be added
            // to the menu bar to complete the creation process.
            this.processWidgets(this.widgets);
         }
      },
      
      /**
       * Implements the callback to add all of the widgets into the MenuBar.
       * 
       * @instance
       * @param widgets The widgets that have been successfully instantiated.
       */
      allWidgetsProcessed: function alfresco_menus_AlfMenuBar__allWidgetsProcessed(widgets) {
         array.forEach(widgets, function(entry) {
            this._menuBar.addChild(entry);
         }, this);
      }
   });
});