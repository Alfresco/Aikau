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
 * <p>This widget provides a way in which a widget model can be displayed when the mouse moves over another
 * widget. To use this tooltip you need to define a 
 * [widgets model to immediately render]{@link module:alfresco/misc/AlfTooltipDialog#widgets} and then another
 * [widget model]{@link module:alfresco/misc/AlfTooltipDialog#widgetsForTooltip} that will be displayed in the
 * tooltip when the mouse moves over any of the widgets in the first model.</p>
 * 
 * @example <caption>Example configuration:</caption>
 * {
 *    name: "alfresco/layout/ClassicWindow",
 *    config: {
 *    title: "Tooltip displays on mouse over logo",
 *    widgets: [
 *       {
 *          name: "alfresco/misc/AlfTooltip",
 *          config: {
 *             widgets: [
 *                {
 *                   name: "alfresco/logo/Logo"
 *                }
 *             ],
 *             widgetsForTooltip: [
 *                {
 *                   name: "alfresco/html/Label",
 *                   config: {
 *                      label: "This is the tooltip content"
 *                   }
 *                }
 *             ]
 *          }
 *       }
 *    ]
 * }
 * 
 * @module alfresco/misc/AlfTooltip
 * @extends external:dijit/Menu
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/AlfTooltip.html",
        "dijit/TooltipDialog",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/on",
        "dijit/popup"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, TooltipDialog, AlfCore, CoreWidgetProcessing,
                 lang, domConstruct, on, popup) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This is the widget model that will be displayed inside the tooltip.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      widgetsForTooltip: null,

      /**
       * This is the widget model that will be immediately rendered. When the mouse is moved over any
       * of the widgets in this model then the tooltip will be created (if it hasn't previously been created)
       * and will then be displayed.
       * 
       * @instance
       * @type {array}
       * @default null
       */
      widgets: null,

      /**
       * A reference to the dijit/TooltipDialog that will be created.
       *
       * @instance
       * @type {object}
       * @default null
       */
      _tooltip: null,

      /**
       * The width of the tooltip. Default is 300 pixels wide.
       *
       * @instance
       * @type {string}
       * @default "300px"
       */
      width: "300px",

      /**
       * This is called to display the tooltip when the mouse goes over the target area. If the 
       * tooltip hasn't been created at this point then it will be created.
       * 
       * @instance
       */
      onShowTooltip: function alfresco_misc_AlfTooltip__onShowTooltip() {
         if (!this._tooltip)
         {
            this.dialogContent = domConstruct.create("div");
            this.processWidgets(this.widgetsForTooltip, this.dialogContent);
            this._tooltip = new TooltipDialog({
               id: this.id + "_TOOLTIP",
               style: this.width,
               content: this.dialogContent,
               onMouseLeave: lang.hitch(this, this.onHideTooltip)
            });
         }
         popup.open({
            popup: this._tooltip,
            around: this.domNode
         });
      },

      /**
       * Called to hide the tooltip. This is done when the mouse leaves the target area by default.
       * 
       * @instance
       */
      onHideTooltip: function alfresco_misc_AlfTooltip__onHideTooltip() {
         popup.close(this._tooltip);
      },

      /**
       * Sets up the mouse over listener for displaying the tooltip (if
       * [widgetsForTooltip]{@link module:alfresco/misc/AlfTooltipDialog#widgetsForTooltip} contains a widget
       * model) and then processes [widgets]{@link module:alfresco/misc/AlfTooltipDialog#widgets}.
       * 
       * @instance
       */
      postCreate: function alfresco_misc_AlfTooltip__postCreate() {
         if (this.widgetsForTooltip)
         {
            on(this.domNode, "mouseover", lang.hitch(this, this.onShowTooltip));
         }
         else
         {
            this.alfLog("warn", "A tooltip dialog was configured without a 'widgetsForTooltip' attribute", this);
         }

         if (this.widgets)
         {
            this.processWidgets(this.widgets, this.domNode);
         }
      }
   });
});