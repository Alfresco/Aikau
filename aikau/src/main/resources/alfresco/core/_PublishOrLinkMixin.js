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
 * <p>This mixin makes it easy to add clickable functionality to a widget that will either publish a topic
 * or navigate to a page.</p>
 *
 * <p>By providing a publishTopic in the config, the widget will publish to that topic when clicked
 * (publishPayload, publishGlobal and publishToParent are also supported).</p>
 *
 * <p>By providing a targetUrl (and optional targetUrlType), the widget will act as a link when clicked</p>
 *
 * <p>This mixin derives its functionality from two other mixins in order to provide a simple way of
 * decorating a widget to add "clicking functionality". Please note though that the enhanced capabilities of
 * [_HtmlAnchorMixin]{@link module:alfresco/navigation/_HtmlAnchorMixin} and
 * [_PublishPayloadMixin]{@link module:alfresco/renderers/_PublishPayloadMixin} are also available to
 * anyone mixing in this class.</p>
 *
 * @module alfresco/core/_PublishOrLinkMixin
 * @extends module:alfresco/navigation/_HtmlAnchorMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Martin Doyle
 * @since 1.0.40
 */
define(["alfresco/enums/urlTypes",
        "alfresco/navigation/_HtmlAnchorMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/keys",
        "dojo/on"],
        function(urlTypes, _HtmlAnchorMixin, _PublishPayloadMixin, declare, lang, domClass, keys, on) {

   return declare([_HtmlAnchorMixin, _PublishPayloadMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/_PublishOrLinkMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/_PublishOrLinkMixin.css"}],

      /**
       * By default, clicks on the image will bubble up. To prevent click bubbling, simply set this to false.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.69
       */
      clickBubbling: true,

      /**
       * When set to true, the widget/anchors will be removed from the page tab-order by setting the tabindex to -1.
       * This overrides and changes the [inherited value]{@link alfresco/navigation/_HtmlAnchorMixin#excludeFromTabOrder}.
       *
       * @instance
       * @override
       * @see module:alfresco/navigation/_HtmlAnchorMixin#excludeFromTabOrder
       * @type {boolean}
       * @default
       */
      excludeFromTabOrder: false,

      /**
       * The title text to put on the generated link(s).
       *
       * @instance
       * @override
       * @type {string}
       * @default
       */
      label: null,

      /**
       * This is the URL to navigate to when the widget is clicked.
       *
       * @instance
       * @type {string}
       * @default
       */
      targetUrl: null,

      /**
       * Indicates how the target URL should be handled.
       *
       * @instance
       * @type {string}
       * @default [PAGE_RELATIVE]{@link module:alfresco/enums/urlTypes#PAGE_RELATIVE}
       */
      targetUrlType: urlTypes.PAGE_RELATIVE,

      /**
       * When set to true, all of the direct children of this widget's root node will be wrapped in a single anchor,
       * rather than the default [_HtmlAnchorMixin]{@link module:alfresco/navigation/_HtmlAnchorMixin} behaviour.
       * This overrides and changes the [inherited value]{@link alfresco/navigation/_HtmlAnchorMixin#wrapAllChildren}.
       *
       * @instance
       * @override
       * @see module:alfresco/navigation/_HtmlAnchorMixin#wrapAllChildren
       * @type {boolean}
       * @default
       */
      wrapAllChildren: true,

      /**
       * Run after widget created
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_core__PublishOrLinkMixin__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-core-PublishOrLinkMixin");
         if (this.targetUrl) {
            this.makeAnchor(this.targetUrl, this.targetUrlType);
         } else if (this.publishTopic) {
            this.domNode.setAttribute("tabIndex", this.excludeFromTabOrder ? -1 : 0);
            domClass.add(this.domNode, "alfresco-core-PublishOrLinkMixin--clickable");
            this.own(on(this.domNode, "click", lang.hitch(this, this.doPublish)));
            this.own(on(this.domNode, "keydown", lang.hitch(this, function(evt) {
               if (evt.keyCode === keys.ENTER) {
                  this.doPublish();
               }
            })));
         } else if (!this.clickBubbling) {
            this.own(on(this.domNode, "click", function(evt) {
               evt.stopPropagation();
            }));
         }
      },

      /**
       * Publish to the specified topic.
       *
       * @instance
       * @param {Object} evt The click-event that triggered the publish.
       */
      doPublish: function alfresco_core__PublishOrLinkMixin__doPublish(evt) {
         if (!this.clickBubbling) {
            evt.stopPropagation();
         }
         this.alfPublish(this.publishTopic, this.publishPayload, this.publishGlobal, this.publishToParent);
      }
   });
});