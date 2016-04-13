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
 * This module provide an alternative to {@link external:dijit/_TemplatedMixin} for widgets that construct their DOM instead of relying on
 * templated HTML. Widgets with full control over their DOM construction can be less expansive to instantiate at the expense of being
 * slightly less extendable / customizable (template is easier to override, but may also cause issues when base widgets rely on specific
 * structure).
 * 
 * @module alfresco/core/_ConstructedWidgetMixin
 * @extends module:alfresco/core/Core
 * @author Axel Faust
 * @since 1.0.6x
 */
define([ "dojo/_base/declare",
         "require",
         "alfresco/core/Core",
         "dojo/dom-construct",
         "service/constants/Default"], function(declare, require, Core, domConstruct, AlfConstants)
{
    return declare([ Core ], {
        
        /**
         * This flag can be used to suppress the inclusion of [debug WidgetInfo]{@link module:alfresco/debug/WidgetInfo}
         * instances for this widget, even when the [debug flag]{@link module:service/constants/Default#DEBUG} is set.
         *  
         * @instance
         * @type {boolean}
         * @default false
         * @since 1.0.6x
         */
        suppressWidgetInfo: false,
        
        /**
         * Overriden function to serve as a simple sub-lifecycle dispatcher for constructed widget instantiation.
         * 
         * @instance
         */
        buildRendering : function alfresco_core_ConstructedWidgetMixin__buildRendering() {
            this.buildDOMStructure(this.srcNodeRef);
            this.setupEvents();
        },
        
        /**
         * Creates the raw DOM structure of this widget. Constructing a DOM nodes with any custom configuration already
         * handled before the node is created is typically more efficient then repeated node modifications after cloning
         * a DOM template.
         * 
         * This will almost always be overriden within a specific widget.
         * 
         * @extensionPoint
         * @instance
         * 
         * @param {Node} [rootNode] - the node this widget should attach to
         */
        buildDOMStructure : function alfresco_core_ConstructedWidgetMixin__buildDOMStructure(rootNode) {
            var nodeProps = this._buildDOMNodeProperties();

            this.domNode = domConstruct.create("div", nodeProps, rootNode);
            this._setupWidgetInfo();
        },
        
        /**
         * Sets up all the DOM level events this widget needs to work.
         * 
         * This will almost always be overriden within a specific widget.
         * 
         * @extensionPoint
         * @instance
         */
        setupEvents : function alfresco_core_ConstructedWidgetMixin__setupEvents() {
            // extension point
        },
        
        _buildDOMNodeProperties : function alfresco_core_ConstructedWidgetMixin__buildDOMNodeProperties() {
            var nodeProps = {
                className : ""
            };
            
            if (AlfConstants.DEBUG && this.suppressWidgetInfo !== true)
            {
                nodeProps.className += "alfresco-debug-Info highlight";
            }
            
            if (this.additionalCssClasses)
            {
                nodeProps.className += " ";
                nodeProps.className += this.additionalCssClasses;
                // we dealt with that
                delete this.additionalCssClasses;
            }

            // baseClass may be inherited from dijit/_WidgetBase
            if (this.baseClass)
            {
                nodeProps.className += " ";
                nodeProps.className = (nodeProps.className || "") + this.baseClass;
            }
            
            if (this.style)
            {
                nodeProps.style = this.style;
                // we dealt with that
                delete this.style;
            }
            
            return nodeProps;
        },
        
        _setupWidgetInfo : function alfresco_core_ConstructedWidgetMixin__setupWidgetInfo() {
            var WidgetInfo, infoWidget;
            if (AlfConstants.DEBUG && this.suppressWidgetInfo !== true)
            {
               // can't have WidgetInfo as a dependency of this mixin since WidgetInfo mixes it itself
               WidgetInfo = require("alfresco/debug/WidgetInfo");
               if (!this.isInstanceOf(WidgetInfo))
               {
                   infoWidget = new WidgetInfo({
                      displayId : this.id || "",
                      displayType : this.declaredClass,
                      displayConfig: this.params
                   });
                   this.domNode.appendChild(infoWidget.domNode);
               }
            }
        }

    });
});