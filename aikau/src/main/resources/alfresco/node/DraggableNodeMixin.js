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
 * This module simply provides a set of attributes that define topic names for publications
 * and subscriptions. This should be mixed into any widget that wishes to use those topics
 * to ensure consistency. It also allows the actual values to be managed from a single file. 
 * 
 * @module alfresco/node/DraggableNodeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/dnd/Moveable",
        "dojo/_base/event",
        "dojo/dom-attr",
        "dojo/on",
        "dojo/_base/lang",
        "dojo/fx", 
        "dojo/aspect",
        "dojo/dom-style",
        "dojo/dom-geometry"],
        function(declare, AlfCore, Moveable, event, domAttr, on, lang, fx, aspect, domStyle, domGeom) {
   
   return declare([AlfCore], {
      
      /**
       * The DOM node to be dragged. If this is left as null then the "domNode" attribute will be used (assuming
       * there is one).
       * 
       * @instance
       * @type {element}
       */
      draggableNode: null,
      
      /**
       * This will be assigned a reference to the "dojo/dnd/Moveable" instance created by the 
       * [postCreate function]{@link module:alfresco/node/DraggableNodeMixin#onDragStart}
       * 
       * @instance
       * @type {object}
       */
      moveable: null,
      
      /**
       * This will be assigned a "dojo/dnd/Mover" instance when a drag is in-flight. It will be assigned in the 
       * call to [onDragStart]{@link module:alfresco/node/DraggableNodeMixin#onDragStart} as this is the first time
       * that a reference to the object is made available. A new "mover" is created on each move. The reference
       * is required to work around an unresolved bug in the Dojo DND code that causes the 2nd move event to 
       * allow "click" events to bubble. If the dragged DOM node is wrapped in an anchor element then this will
       * cause the link to be processed.
       * 
       * @instance
       * @type {object}
       */
      mover: null,
      
      /**
       * @instance
       */
      postCreate: function alfresco_node_DraggableNodeMixin__postCreate() {
         this.inherited(arguments);
         
         if (this.draggableNode == null && 
             this.domNode != null)
         {
            this.draggableNode = this.domNode;
         }
         if (this.draggableNode != null)
         {
            // It's important to set a delay (this is a measure of pixels NOT time) so that
            // regular click events can be processed...
            this.moveable = new Moveable(this.draggableNode, {
               delay: 20
            });
            // Use aspect to hitch some events to work around 2nd drag event bugs...
            aspect.before(this.moveable, "onMoveStart", lang.hitch(this, "onDragStart"));
            aspect.after(this.moveable, "onMoveStop", lang.hitch(this, "onDragEnd"), true);
            on(this.moveable.handle, "mousedown", lang.hitch(this, "onMouseDown"));
            on(this.moveable.handle, "mouseup", lang.hitch(this, "onMouseUp"));
            on(this.moveable.handle, "click", lang.hitch(this, "onDraggableClick"));
         }
      },
      
      onMouseDown: function alfresco_node_DraggableNodeMixin__onMouseDown(evt) {
         this.alfLog("log", "On mouse down", evt);
         var output = domGeom.position(this.draggableNode);
         this.alfLog("log", "Computed style: ", output.x, output.y);
         this.origX = output.x;
         this.origY = output.y;
      },
      
      /**
       * This function is called on any mouseup events that occur on the dragged node. This is
       * required because on the 2nd drag of any node the events are fired in the wrong order
       * (this is a bug in Dojo 1.9.0 that should be periodically checked for a fix) and would
       * result in a click event not being suppressed (this would allow links to be processed
       * at the end of the drag). If [mover]{@link module:alfresco/node/DraggableNodeMixin#mover}
       * as been assigned then this has been called at the end of a drag. Therefore we can 
       * call the "onMouseUp" function of the mover to get events processing correctly again.
       * 
       * @instance
       * @param {object} e The mouse up event
       */
      onMouseUp: function alfresco_node_DraggableNodeMixin__onMouseUp(e) {
         this.alfLog("log", "On Mouse Up", e);
         if (this.mover != null)
         {
            this.alfLog("log", "Calling mover onMouseUp");
            this.mover.onMouseUp(e);
            this.mover = null;
            event.stop(e);
         }
      },
      
      /**
       * Suppresses click events at the end of a drag.
       * 
       * @instance
       * @param {object} e The click event
       */
      onDraggableClick: function alfresco_node_DraggableNodeMixin__onDraggableClick(e) {
         this.alfLog("log", "On draggable click", e, this.dragInFlight);
         
         if (this.dragInFlight)
         {
            this.alfLog("log", "Cancelling in flight");
            event.stop(e);
            this.dragInFlight = false;
         }
      },
      
      /**
       * @instance
       * @type {number}
       * @default 0
       */
      origX: 0,
      
      /**
       * @instance
       * @type {number}
       * @default 0
       */
      origY: 0,
      
      /**
       * Captures the start of a new drag and sets the [dragInFlight]{@link module:alfresco/node/DraggableNodeMixin#dragInFlight}
       * flag to indicate that a drag has begun and sets the [mover]{@link module:alfresco/node/DraggableNodeMixin#mover}
       * attribute with the newly created dojo/dnd/Mover instance.
       * 
       * @instance
       * @param {object} mover The newly created dojo/dnd/Mover instance
       * @param {object} evt The event created.
       */
      onDragStart: function alfresco_node_DraggableNodeMixin__onDragStart(mover, evt) {
         this.alfLog("log", "Drag started", mover, evt);
         this.dragInFlight = true;
         this.mover = mover;
         
         // Set the current item on the dojo/dnd/Mover object so that drop targets know what it represents...
         this.mover.alfCurrentItem = this.currentItem;
      },
      
      /**
       * Returns the dragged node to its starting position if it hasn't been dropped onto a valid target.
       * 
       * @instance
       * @type {object}
       */
      onDragEnd: function alfresco_node_DraggableNodeMixin__onDragEnd(mover) {
         this.alfLog("log", "Drag ended", mover);
         if (mover.alfNodeDropClaimed)
         {
            this.alfLog("log", "Drop claimed!");
         }
         else
         {
            fx.slideTo({
               node: this.draggableNode,
               top: this.origY,
               left: this.origX,
               units: "px",
               onEnd: lang.hitch(this, "resetDraggableNodeStyle")
            }).play();
         }
      },
      
      /**
       * @instance
       */
      resetDraggableNodeStyle: function alfresco_node_DraggableNodeMixin__resetDraggableNodeStyle() {
         domStyle.set(this.draggableNode, {
            position: "inherit",
            top: "inherit",
            left: "inherit"
         });
      }
   });
});