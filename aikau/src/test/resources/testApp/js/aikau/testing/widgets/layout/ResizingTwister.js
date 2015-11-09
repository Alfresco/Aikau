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
 * This twister will publish a resize event when it changes size (i.e. whenever it's toggled)
 * 
 * @module aikauTesting/widgets/layout/ResizingTwister
 * @extends alfresco/layout/Twister
 * @author Martin Doyle
 */
define([
      "alfresco/core/ResizeMixin",
      "alfresco/layout/Twister",
      "dojo/_base/declare"
   ],
   function(ResizeMixin, Twister, declare) {
      return declare([Twister, ResizeMixin], {

         /**
          * This is run after the widget has been created, and before any sub-widgets.
          * 
          * @instance
          * @override
          */
         postCreate: function() {
            this.inherited(arguments);
            this.addResizeListener(this.domNode);
         }
      });
   });