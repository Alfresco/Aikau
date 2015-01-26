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
 * This can be mixed in to any widget that represents any Alfresco container (e.g. any of the renderers, such as a 
 * [Thumbnail]{@link module:alfresco/renderers/Thumbnail}). The [addNodeDropTarget]{@link module:alfresco/node/DraggableNodeMixin#addNodeDropTarget} 
 * function will then allow that widget to become a valid target for widgets that have the [DraggableNodeMixin]{@link module:alfresco/node/DraggableNodeMixin}
 * mixed into them.
 * 
 * @module alfresco/node/NodeDropTargetMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/mouse",
        "dojo/on",
        "dojo/_base/lang",
        "dojo/dom-class"],
        function(declare, AlfCore, mouse, on, lang, domClass) {
   
   return declare([AlfCore], {
      
      /**
       * The DOM node to be set as target. If this is left as null then the "domNode" attribute will be used (assuming
       * there is one).
       * 
       * @instance
       * @type {element}
       * @default null
       */
      targetNode: null,
      
      /**
       * The DOM node to listen for drop events on. 
       * 
       * @instance
       * @type {element}
       * @default null
       */
      dropTarget: null,
      
      /**
       * Indicates whether or not a move action is currently "in-flight". This is set by callback handlers for the
       * events published by the Dojo DND manager.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      dropTargetEnabled: false,
      
      /**
       * Sets up the supplied node as a drop target.
       * 
       * @instance
       */
      addNodeDropTarget: function alfresco_node_NodeDropTargetMixin__addNodeDropTarget(node) {
         this.inherited(arguments);

         this.targetNode = node;
         
         // When a move starts, listen for mouseover events...
         this.mouseEnterHandle = on(this.targetNode, mouse.enter, lang.hitch(this, "onMouseEnter"));
         this.mouseLeaveHandle = on(this.targetNode, mouse.leave, lang.hitch(this, "onMouseLeave"));
         this.alfSubscribe("/dnd/move/start", lang.hitch(this, "onMoveStarted"));
         this.alfSubscribe("/dnd/move/stop", lang.hitch(this, "onMoveStopped"));
      },
      
      /**
       * Indicates whether or not the drop target is able to process a drop event that occurs. This
       * attribute is set to true by the [onMouseEnter function]{@link module:alfresco/node/NodeDropTargetMixin#onMouseEnter}
       * and set to false by the [onMouseLeave function]{@link module:alfresco/node/NodeDropTargetMixin#onMouseLeave}
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      shouldProcessDrop: false,
      
      /**
       * Handler for the mouse entering the [dropTarget]{@link module:alfresco/node/NodeDropTargetMixin#dropTarget} element.
       * This sets the [shouldProcessDrop]{@link module:alfresco/node/NodeDropTargetMixin#shouldProcessDrop} attribute to true
       * so that if a drop occurs this target will process it.
       * 
       * @instance
       * @param {object} evt
       */
      onMouseEnter: function alfresco_node_NodeDropTargetMixin__onMouseEnter(evt) {
         this.shouldProcessDrop = true && this.dropTargetEnabled;
         if (this.shouldProcessDrop)
         {
            this.addDndHighlight();
         }
      },
      
      /**
       * Handler for the mouse leaving the [dropTarget]{@link module:alfresco/node/NodeDropTargetMixin#dropTarget} element.
       * This sets the [shouldProcessDrop]{@link module:alfresco/node/NodeDropTargetMixin#shouldProcessDrop} attribute to true
       * so that if a drop occurs this target will process it.
       * 
       * @instance
       * @param {object} evt
       */
      onMouseLeave: function alfresco_node_NodeDropTargetMixin__onMouseLeave(evt) {
         this.shouldProcessDrop = false;
         if (!this.shouldProcessDrop || !this.dropTargetEnabled)
         {
            this.removeDndHighlight();
         }
      },
      
      /**
       * Handles move events starting. This sets the [dropTargetEnabled]{@link module:alfresco/node/NodeDropTargetMixin#dropTargetEnabled}
       * attribute to true to indicate that a move is in-flight and that this target could potentially process the drop. Currently
       * this applies to all move events but could be updated/overridden to check for more specific move targets.
       * 
       * @instance
       * @param {object} mover The dojo/dnd/Mover object representing the moved element
       */
      onMoveStarted: function alfresco_node_NodeDropTargetMixin__onMoveStarted(mover) {
         this.dropTargetEnabled = true; 
      },
      
      /**
       * Handles drop events that occur when a move completes (e.g. on a "mouseup" event to end a drag). If the drop
       * occurred within the [dropTarget]{@link module:alfresco/node/NodeDropTargetMixin#dropTarget} element (as 
       * indicated by the [shouldProcessDrop]{@link module:alfresco/node/NodeDropTargetMixin#shouldProcessDrop} attribute)
       * then an attempt will be made to move the node represented by the mover argument.
       * 
       * @instance
       * @param {object} mover
       */
      onMoveStopped: function alfresco_node_NodeDropTargetMixin__onMoveStopped(mover) {
         // When a move stops, cease listening for mouseover events...
         this.dropTargetEnabled = false;
         if (this.shouldProcessDrop)
         {
            var sourceNodeRef = null;
            
            // Get the nodeRef of the item to be moved...
            if (mover.alfCurrentItem != null && lang.exists("jsNode.nodeRef.nodeRef", mover.alfCurrentItem))
            {
               sourceNodeRef = lang.getObject("jsNode.nodeRef.nodeRef", false, mover.alfCurrentItem);
            }
            
            var targetNodeRefUri = this.getDropTargetNodeRefUri(),
                targetPath = this.getDropTargetPath();
            
            if (sourceNodeRef != null && (targetNodeRefUri != null || targetPath != null))
            {
               mover.alfNodeDropClaimed = true;
               this.alfPublish("ALF_MOVE_DOCUMENTS", {
                  sourceNodeRefs: [sourceNodeRef],
                  targetNodeRefUri: targetNodeRefUri,
                  targetPath: targetPath
               });
            }
         }
      },
      
      /**
       * @instance
       * @returns {string} The URI fragment representation of a NodeRef (e.g. without the double forward slash and colon)
       */
      getDropTargetNodeRefUri: function alfresco_node_NodeDropTargetMixin__getDropTargetNodeRefUri() {
         var targetNodeRefUri = null;
         if (lang.exists("jsNode.nodeRef.uri", this.currentItem))
         {
            targetNodeRefUri = lang.getObject("jsNode.nodeRef.uri", false, this.currentItem);
         }
         return targetNodeRefUri;
      },
      
      /**
       * @instance
       * @returns {string} The path to the drop target.
       */
      getDropTargetPath: function alfresco_node_NodeDropTargetMixin__getDropTargetPath() {
         var path = null;
         if (this.path != null)
         {
            path = this.path;
         }
         return path;
      },
      
      /**
       * This should be overridden to add highlighting when an item is dragged over the target.
       * 
       * @instance
       */
      addDndHighlight: function alfresco_node_NodeDropTargetMixin__addDragEnterHighlight() {
         domClass.add(this.domNode, "dndHighlight");
      },
      
      /**
       * This should be overridden to remove highlighting when an item is dragged out of the target
       * 
       * @instance
       */
      removeDndHighlight: function alfresco_node_NodeDropTargetMixin__addDragEnterHighlight() {
         // No action by default
         domClass.remove(this.domNode, "dndHighlight");
      }
   });
});