/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * 
 * @module alfresco/layout/FullScreenWidgets
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["alfresco/core/ProcessWidgets",
        "dojo/_base/declare",
        "alfresco/core/FullScreenMixin",
        "dojo/_base/lang"], 
        function(ProcessWidgets, declare, FullScreenMixin, lang) {
   
   return declare([ProcessWidgets, FullScreenMixin], {
      
      /**
       * Extends the [inherited function]{@link module:alfresco/core/ProcessWidgets#postCreate} to 
       * subscribe to the full screen and full window topics defined in the 
       * [FullScreenMixin module]{@link module:alfresco/core/FullScreenMixin} and binds the topics
       * to the [toggleFullScreen function]{@link module:alfresco/core/FullScreenMixin#toggleFullScreen}.
       *
       * @instance
       */
      postCreate: function alfresco_layout_FullScreenWidgets__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.fullWindowTopic, lang.hitch(this, this.toggleFullScreen, true));
         this.alfSubscribe(this.fullScreenTopic, lang.hitch(this, this.toggleFullScreen, false));
      }
   });
});