/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This module has been created to be mixed into layout modules that need to resize themselves as their child
 * widgets are dynamically displayed or hidden. The [getVisibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#getVisibilityRuleTopics}
 * function should be called before widgets are created (i.e. before any call to [processWidgets]{@link module:alfresco/core/CoreWidgetProcessing#processWidgets})
 * and the [subscribeToVisibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#subscribeToVisibilityRuleTopics}
 * function should be called after widget processing has been completed (i.e. in an extension to 
 * [allWidgetsProcessed]{@link module:alfresco/core/CoreWidgetProcessing#allWidgetsProcessed}).
 * 
 * @module alfresco/layout/DynamicVisibilityResizingMixin
 * @author Dave Draper
 * @since 1.0.38
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, lang, array) {
   
   return declare([], {
      
      /**
       * This array is setup when the [getVisibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#getVisibilityRuleTopics}
       * is called and each topic is then subscribed to in order to trigger resize events when widgets are displayed or hidden.
       *
       * @instance
       * @type {string[]}
       * @default
       */
      visibilityRuleTopics: null,

      /**
       * This function can be called to check all the supplied widgets for dynamic visibility configuration so that 
       * subscriptions can be created on the same rules to trigger resizing as widgets are displayed or hidden.
       * 
       * @instance
       * @param {object[]} widgets The widgets to check for visibility/invisibility configuration
       * @return {string[]} An array of the topics that are using in dynamic visibility/invisibility configuration
       */
      getVisibilityRuleTopics: function alfresco_layout_DynamicVisibilityResizingMixin__getVisibilityRuleTopics(widgets) {
         var topicNames = {};
         array.forEach(widgets, function(widget) {
            var visibilityRules = lang.getObject("config.visibilityConfig.rules", false, widget) || [];
            var invisibilityRules = lang.getObject("config.invisibilityConfig.rules", false, widget) || [];
            array.forEach(visibilityRules.concat(invisibilityRules), function(rule) {
               if (rule.topic) {
                  topicNames[rule.topic] = true;
               }
            });
         });
         return Object.keys(topicNames);
      },

      /**
       * Iterates over the [visibilityRuleTopics]{@link module:alfresco/layout/DynamicVisibilityResizingMixin#visibilityRuleTopics}
       * and creates a subscription for each one bound to the supplied function.
       * 
       * @instance
       * @param {function} func The function to bind each subscription to.
       */
      subscribeToVisibilityRuleTopics: function alfresco_layout_DynamicVisibilityResizingMixin__subscribeToVisibilityRuleTopics(func) {
         if (this.visibilityRuleTopics)
         {
            array.forEach(this.visibilityRuleTopics, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, func));
            }, this);
         }
      }
   });
});