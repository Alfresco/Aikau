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
 * This module provides a common base for any widget be it {@link externa:dijit/_TemplatedMixin}
 * or {@link module:alfresco/core/_ConstructedWidgetMixin}, providing added base functionality
 * (in addition to {@link external:dijit/_WidgetBase}) for handling setup / destruction of widgets
 * swhile detached from the live DOM.
 * 
 * @module alfresco/core/BaseWidget
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Axel Faust
 * @since 1.0.6x
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "dojo/dom-class",
        "dojo/has"], function(declare, _WidgetBase, Core, domAttr, has) {
    
    // check if we run on IE so we don't activate our preemptive 2.0 empty behaviour (to improve performance)
    // see https://bugs.dojotoolkit.org/ticket/16957
    // newer (unaffected) IEs are reported as either trident or edge
    var isEmptyLeakAffected = has("ie");
    
    return declare([_WidgetBase, Core], {
        
        /**
         * This keeps track of wether this instances DOM node is attached to the live DOM tree.
         *
         * @instance
         * @type {boolean}
         * @default false
         */
        _attachedToLiveDOM: false,
        
        /**
         * Implements the widget life-cycle method to early detect attachment to the live DOM.
         * 
         * @instance
         */
        postCreate: function alfresco_core_BaseWidget__postCreate() {
            if (document.body.contains(this.domNode))
            {
                // consider ourselves to be attached already (CoreWidgetProcessing should still call attachedToLiveDOM at appropriate time in lifecycle)
                this._attachedToLiveDOM = true;
            }
            this.inherited(arguments);
        },
        
        /**
         * This is an extension point for handling the attachment of this instances DOM node from the live DOM tree.
         * Overriding functions MUST call "inherited".
         *
         * @extensionPoint
         * @instance
         */
        attachedToLiveDOM: function alfresco_core_BaseWidget__attachedToLiveDOM() {
            this._attachedToLiveDOM = true;
        },
        
        /**
         * This is an extension point for handling the detachment of this instances DOM node from the live DOM tree.
         * Overriding functions MUST call "inherited".
         *
         * @extensionPoint
         * @instance
         */
        detachedFromLiveDOM: function alfresco_core_BaseWidget__detachedFromLiveDOM() {
            this._attachedToLiveDOM = false;
        },
        
        /**
         * Overriden function to ensure this instances DOM node is detached from the live DOM tree before its actual destruction.
         * 
         * @instance
         */
        destroy: function alfresco_core_BaseWidget__destroy(preserveDom) {
            // avoid doing the full destruction while attached to the live DOM
            if (this._attachedToLiveDOM === true && this.domNode && document.body.contains(this.domNode))
            {
                this.domNode.parentNode.removeChild(this.domNode);
                this.detachedFromLiveDOM();
            }
            
            this.inherited(arguments);
        },
        
        applyAttributes : function alfresco_core_BaseWidget__applyAttributes() {
            // Aikau widget config can be very complex and contain primarily non-DOM attributes
            // applyAttributes can incur significant overhead if we keep params
            // dijit/_WidgetBase still considers any properties supported by widget setters + mixed in from params
            var params = this.params;
            this.params = null;
            
            this.inherited(arguments);
            
            this.params = params;
        },
        
        /**
         * Overriden function to ensure this instances DOM node is detached from the live DOM tree before its actual destruction.
         * 
         * @instance
         */
        destroyRecursive: function alfresco_core_BaseWidget__destroyRecursive(preserveDom) {
            // avoid doing the full destruction while attached to the live DOM
            if (this._attachedToLiveDOM === true && this.domNode && document.body.contains(this.domNode))
            {
                this.domNode.parentNode.removeChild(this.domNode);
                this.detachedFromLiveDOM();
            }
            
            this.inherited(arguments);
        },
        
        /**
         * Overriden function to avoid applying the default domConstruct.empty behaviour in browsers that are not affected by DOM-related memory leaks.
         * 
         * @instance
         */
        destroyRendering: function alfresco_core_BaseWidget__destroyRendering(preserveDom) {
            var domNode;
            if (!isEmptyLeakAffected)
            {
                // for performance we want to avoid the default domConstruct.empty behaviour using innerHTML to address a memory leak in old IE
                domNode = this.domNode;
                delete this.domNode;
                
                this.inherited(arguments);
                
                // now do what domConstruct.empty would have done
                if (domNode !== undefined && domNode !== null)
                {
                    if (preserveDom === true)
                    {
                        domAttr.remove(domNode, "widgetId");
                    }
                    else
                    {
                        while (domNode.lastChild)
                        {
                            domNode.removeChild(domNode.lastChild);
                        }

                        if (domNode.parentNode)
                        {
                            domNode.parentNode.removeChild(domNode);
                        }
                    }
                }
            }
            else
            {
                this.inherited(arguments);
            }
        }
        
    });
});