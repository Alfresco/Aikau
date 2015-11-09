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
 * Use this widget to render a grid. Every widget rendered within it will be added so that if a row
 * contains the number of widgets defined by [columns]{@link module:alfresco/lists/views/layouts/Grid#columns]
 * a new row will be started for the next processed widget.
 *
 * @module alfresco/lists/views/layouts/Grid
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/ResizeMixin",
        "dijit/_KeyNavContainer",
        "dojo/text!./templates/Grid.html",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/core/Core",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "dojo/keys",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-attr",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-geometry",
        "dojo/query",
        "dojo/dom-style",
        "dijit/registry",
        "dijit/focus"],
        function(declare, _WidgetBase, _TemplatedMixin, ResizeMixin, _KeyNavContainer, template, _MultiItemRendererMixin,
                 AlfCore, _LayoutMixin, keys, lang, array, domAttr, domClass, domConstruct, domGeom, query, domStyle,
                 registry, focusUtil) {

   return declare([_WidgetBase, _TemplatedMixin, ResizeMixin, _KeyNavContainer, _MultiItemRendererMixin, AlfCore, _LayoutMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Grid.css"}]
       */
      cssRequirements: [{cssFile:"./css/Grid.css"}],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * This is the number of columns in the grid.
       *
       * @instance
       * @type {number}
       * @default
       */
      columns: 4,

      /**
       * This is used to keep track of any empty cells that are created as a result of calling 
       * [completeRow]{@link module:alfresco/lists/views/layouts/Grid#completeRow} so that they
       * can be destroyed when more results are added (when used within an infinite scrolling
       * list).
       * 
       * @instance
       * @type {element[]}
       * @default
       * @since 1.0.40
       */
      emptyCells: null,

      /**
       * Indicates whether the number of columns is fixed for resize events. This means that
       * the thumbnail size can change. 
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      fixedColumns: true,

      /**
       * The label to use for the next link. This defaults to null, so MUST be set for the next link to be displayed.
       *
       * @instance
       * @type {string}
       * @default
       */
      nextLinkLabel: null,

      /**
       * The topic to publish when the next link is clicked.
       *
       * @instance
       * @type {string}
       * @default
       */
      nextLinkPublishTopic: null,

      /**
       * When set to true this will show a link for requesting more data (if available). This should be used when
       * the grid is rendering data in an infinite scroll view. It is required because when the grid cells are small
       * the data may not be sufficient to allow the scrolling events to occur that will request more data.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showNextLink: false,

      /**
       * The size of each thumbnail. This is only used when
       * [columns are not fixed]{@link module:alfresco/lists/views/layouts/Grid#fixedColumns}.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      thumbnailSize: null,

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Grid__postCreate() {
         this.inherited(arguments);
         if (this.currentItem)
         {
            if (this.widgets)
            {
               this.processWidgets(this.widgets, this.containerNode);
            }
         }

         this.setupKeyboardNavigation();

         // Update the grid as the window changes...
         this.alfSetupResizeSubscriptions(this.resizeCells, this);
      },

      /**
       * Overrides the [superclass implementation]{@link module:alfresco/lists/views/AlfListView#setupKeyboardNavigation}
       * to move to the next/previous item using the left and right cursor keys and the up/down keys to access the cell directly
       * above or below.
       *
       * @instance
       */
      setupKeyboardNavigation: function alfresco_lists_views_layouts_Grid__setupKeyboardNavigation() {
         // this.connectKeyNavHandlers([keys.LEFT_ARROW], [keys.RIGHT_ARROW]);
         this._keyNavCodes[keys.UP_ARROW] = lang.hitch(this, this.focusOnCellAbove);
         this._keyNavCodes[keys.RIGHT_ARROW] = lang.hitch(this, this.focusOnCellRight);
         this._keyNavCodes[keys.DOWN_ARROW] = lang.hitch(this, this.focusOnCellBelow);
         this._keyNavCodes[keys.LEFT_ARROW] = lang.hitch(this, this.focusOnCellLeft);
      },

      /**
       * This is called whenever focus leaves a child widget. It will call the blur function
       * of the currently focused widget if it has one.
       *
       * @instance
       */
      _onChildBlur: function alfresco_lists_views_layouts_Grid___onChildBlur(focusedChild) {
         if (typeof focusedChild.blur === "function")
         {
            focusedChild.blur();
         }
         domClass.remove(focusedChild.domNode, "alfresco-lists-views-layouts-Grid__cell--focused");
      },

      /**
       * This function ensures that the widget requested to be focused has a focus function
       * and if so calls the "focusChild" function provided by the _KeyNavContainer. Otherwise
       * it manually takes care of setting the focus.
       *
       * @instance
       * @param {object} widget The widget to focus
       * @since 1.0.43
       */
      focusOnCell: function alfresco_lists_views_layouts_Grid__focusOnCell(widget) {
         if (typeof widget.focus === "function")
         {
            this.focusChild(widget);
         }
         else
         {
            if(this.focusedChild && widget !== this.focusedChild){
               this._onChildBlur(this.focusedChild);  // used to be used by _MenuBase
            }
            if (widget.domNode)
            {
               domAttr.set(widget.domNode, "tabIndex", this.tabIndex); // for IE focus outline to appear, must set tabIndex before focus
               focusUtil.focus(widget.domNode);
            }
         }
         domClass.add(widget.domNode, "alfresco-lists-views-layouts-Grid__cell--focused");
      },

      /**
       *
       *
       * @instance
       */
      focusOnCellLeft: function alfresco_lists_views_layouts_Grid__focusOnCellLeft() {
         var target = null,
             focusIndex = this.getIndexOfChild(this.focusedChild),
             allChildren = this.getChildren(),
             childCount = this.getChildren().length;
         if (focusIndex > 0)
         {
            target = allChildren[focusIndex-1];
         }
         else
         {
            target = allChildren[childCount-1];
         }
         this.focusOnCell(target);
      },

      /**
       *
       *
       * @instance
       */
      focusOnCellRight: function alfresco_lists_views_layouts_Grid__focusOnCellLeft() {
         var target = null,
             focusIndex = this.getIndexOfChild(this.focusedChild),
             allChildren = this.getChildren(),
             childCount = this.getChildren().length;
         if (focusIndex < childCount-1)
         {
            target = allChildren[focusIndex+1];
         }
         else
         {
            target = allChildren[0];
         }
         this.focusOnCell(target);
      },

      /**
       * Gives focus to the cell immediately above the currently focused cell. If the focused cell is on the
       * first row then it will select the cell in the same column on the last column (and if there isn't a cell
       * in the same column on the last row then the last item is selected).
       *
       * @instance
       */
      focusOnCellAbove: function alfresco_lists_views_layouts_Grid__focusOnCellAbove() {
         var target = null,
             focusIndex = this.getIndexOfChild(this.focusedChild),
             focusColumn = (focusIndex % this.columns) + 1,
             allChildren = this.getChildren(),
             childCount = this.getChildren().length;
         if (focusIndex - this.columns < 0)
         {
            // Go to last row
            var rem = childCount % this.columns;
            if (rem === 0 || rem >= focusColumn)
            {
               // Get the matching column on the last row...
               target = allChildren[childCount - (this.columns - focusColumn) + 1];
            }
            else
            {
               // Focus the last child...
               target = allChildren[childCount-1];
            }
         }
         else
         {
            target = allChildren[focusIndex - this.columns];
         }
         this.focusOnCell(target);
      },

      /**
       * Gives focus to the cell immediately below the currently focused cell. If the currently focused
       * cell is on the last row then the cell in the same column on the first row is selected.
       *
       * @instance
       */
      focusOnCellBelow: function alfresco_lists_views_layouts_Grid__focusOnCellBelow() {
         var target = null,
             focusIndex = this.getIndexOfChild(this.focusedChild),
             focusColumn = (focusIndex % this.columns),
             allChildren = this.getChildren(),
             childCount = this.getChildren().length;
         if ((focusIndex + this.columns) >= childCount)
         {
            target = allChildren[focusColumn];
         }
         else
         {
            target = allChildren[focusIndex + this.columns];
         }
         this.focusOnCell(target);
      },

      /**
       * Gets the content box of the containing DOM node of the grid and then iterates over all the cells in the grid calling
       * the [resizeCell]{@link module:alfresco/lists/views/layouts/Grid#resizeCell] function for each with the desired width.
       * The width to set is the available width divided by the number of columns to display.
       *
       * @instance resizeCells
       */
      resizeCells: function alfresco_lists_views_layouts_Grid__resizeCells() {
         this.alfLog("info", "Resizing");
         var node = lang.getObject("containerNode.parentNode", false, this);
         if (node)
         {
            var marginBox = domGeom.getContentBox(node); // NOTE: Get the parent node for the size because the table will grow outside of its allotted area
            if (this.fixedColumns === true)
            {
               var widthToSet = (Math.floor(marginBox.w / this.columns) - 4) + "px";
               query("tr > td", node).forEach(lang.hitch(this, this.resizeCell, marginBox, widthToSet));
            }
            else
            {
               // When not resizing based on fixed columns it is necessary to work out the containable
               // number of columns for the configured thumbnail size and then update the grid width
               // as necessary to ensure neat spacing of thumbnails...
               var remainingSpace = marginBox.w % this.thumbnailSize;
               var gridWidth = marginBox.w - remainingSpace;
               if (gridWidth)
               {
                  var columns = gridWidth / this.thumbnailSize;
                  if (columns !== this.columns)
                  {
                     // If the number of columns containable has changed then it is necessary to completely
                     // re-render the layout, so the existing widgets need to be destroyed and then recreated
                     this.columns = columns;

                     // Find and destroy all the existing widgetrs...
                     var widgets = registry.findWidgets(this.containerNode);
                     array.forEach(widgets, function(widget) {
                        widget.destroy();
                     });
                     domConstruct.empty(this.containerNode);
                     
                     // Re-render the data for the new columns...
                     this.renderData();
                  }

                  // Resize the cells and widgets...
                  domStyle.set(this.domNode, "width", gridWidth + "px");
                  query("tr > td", node).forEach(lang.hitch(this, this.resizeCell, marginBox, this.thumbnailSize + "px"));
               }
            }
         }
      },

      /**
       * Sets the width of an individual cell.
       *
       * @instance resizeCell
       * @param {Object} containerNodeMarginBox The margin box for the container nodes parent
       * @param {number} widthToSet The widget for the cell (in pixels)
       * @param {element} node The node to set width on
       * @param {number} index The current index of the element in the array
       */
      resizeCell: function alfresco_lists_views_layouts_Grid__resizeCell(containerNodeMarginBox, widthToSet, node, /*jshint unused:false*/ index) {
         domStyle.set(node, {"width": widthToSet});
         var dimensions = {
               w: widthToSet,
               h: null
            },
            widgetsToResize = query("[widgetId]", node); // Resize all contained widgets, not just immediate children.

         array.forEach(widgetsToResize, lang.hitch(this, "resizeWidget", dimensions));
      },

      /**
       * This function will check to see if there is a widget associated with the DOM node provided as an argument and if that
       * widget has a resize function it will call it with the supplied dimensions.
       *
       * @instance
       * @param {object} dimensions The object containing the width and height for the widget.
       * @param {object} widgetNode The DOM node that possibly has a widget associated. Use registry to check
       * @param {number} index The index of the node
       */
      resizeWidget: function alfresco_lists_views_layouts_Grid__resizeWidget(dimensions, widgetNode, /*jshint unused:false*/ index) {
         var widget = registry.byNode(widgetNode);
         if (widget && typeof widget.resize === "function")
         {
            widget.resize(dimensions);
         }
      },

      /**
       * Overridden to add an additional TD elements for each cell in the grid. It will also create a new TR element if
       * the end of the current row has been reached.
       *
       * @instance
       * @param {object} widget The widget definition to create the DOM node for
       * @param {element} rootNode The DOM node to create the new DOM node as a child of
       * @param {string} rootClassName A string containing one or more space separated CSS classes to set on the DOM node
       */
      createWidgetDomNode: function alfresco_lists_views_layouts_Grid__createWidgetDomNode(widget, rootNode, /*jshint unused:false*/ rootClassName) {
         var nodeToAdd = rootNode;
         if (this.currentIndex % this.columns === 0)
         {
            // Create a new row if the maximum number of columns has been exceeded...
            var newRow = domConstruct.create("TR", {}, rootNode);
            nodeToAdd = domConstruct.create("TD", {}, newRow);
         }
         else
         {
            var lastNode = rootNode.children[rootNode.children.length-1];
            nodeToAdd = domConstruct.create("TD", {}, lastNode);
         }

         // Add a new cell...
         return domConstruct.create("DIV", {}, nodeToAdd);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#renderNextItem}
       * to ensure that any DOM elements added for allowing the user to retrieve more items is destroyed. These will
       * have been created by the [allItemsRendered function]{@link module:alfresco/lists/views/layouts/Grid#allItemsRendered}
       * when more data is available.
       *
       * @instance
       */
      renderNextItem: function alfresco_lists_views_layouts_Grid__renderNextItem() {
         if (this.nextLinkDisplay)
         {
            this.nextLinkDisplay.destroy();
            this.nextLinkDisplay = null;
         }
         if (this.emptyCells)
         {
            array.forEach(this.emptyCells, function(emptyCell) {
               domConstruct.destroy(emptyCell);
            });
            this.emptyCells = [];
         }
         this.inherited(arguments);
      },

      /**
       * To ensure that the grid items are spaced correctly when there are less items
       * in the final row than there are columns, it is necessary to create empty cells
       * to fill the final columns in the row.
       * 
       * @instance
       * @since 1.0.40
       */
      completeRow: function alfresco_lists_views_layouts_Grid__completeRow(lastColumn) {
         if (!this.emptyCells)
         {
            this.emptyCells = [];
         }
         for (var i=lastColumn; i<this.columns; i++)
         {
            var cell = domConstruct.create("TD", {
               className: "alfresco-lists-views-layouts-Grid__emptyCell"
            }, this.domNode.lastChild);
            this.emptyCells.push(cell);
         }
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#allItemsRendered}
       * to create a link for retrieving more data when
       *
       * @instance
       */
      allItemsRendered: function alfresco_lists_views_layouts_Grid__allItemsRendered() {
         var lastColumn = this.currentIndex % this.columns;
         if (lastColumn !== 0)
         {
            this.completeRow(lastColumn);
         }
         
         if(this.showNextLink &&
            ((this.totalRecords > (this.startIndex + this.currentPageSize)) ||
             this.currentData.totalRecords < this.currentData.numberFound ||
             this.currentData.totalRecords > this.currentData.items.length))
         {
            if (lastColumn === 0)
            {
               // We need to create a new row for the "Show Next" link because the previous row is complete...
               domConstruct.create("TR", {}, this.domNode);
               this.completeRow(lastColumn);
            }

            this.nextLinkDisplay = this.createWidget({
               name: "alfresco/layout/VerticalWidgets",
               assignTo: "nextLinkDisplay",
               config: {
                  widgets: [
                     {
                        name: "alfresco/renderers/PropertyLink",
                        config: {
                           currentItem: {
                              label: this.nextLinkLabel
                           },
                           propertyToRender: "label",
                           renderSize: "small",
                           useCurrentItemAsPayload: false,
                           publishTopic: this.nextLinkPublishTopic,
                           publishPayloadType: "CONFIGURED",
                           publishPayload: {}
                        }
                     }
                  ]
               }
            });
            this.nextLinkDisplay.placeAt(this.emptyCells[0]);
         }
      }
   });
});