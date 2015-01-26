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
 * This module can be mixed into any other widget that has a requirement to make it's DOM element
 * either full-screen or full-window. However, rather than making the actual DOM element full screen or
 * window it actually maximises the size of the DOM element so that it fills the window and then the document
 * body is made full screen (or window). This is done so that any popups or dialogs that are placed outside
 * of the target element will still be displayed.
 * 
 * @module alfresco/core/FullScreenMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-class",
        "dojo/has",
        "dojo/_base/window"], 
        function(declare, AlfCore, lang, on, domClass, has, win) {
   
   // Define the classes that will be re-used throughout the mixin...
   var fullScreenClass = "alfresco-core-FullScreenMixin-fullScreen",
       fullWindowClass = "alfresco-core-FullScreenMixin-fullWindow",
       enteringFullScreenClass = "alfresco-core-FullScreenMixin-enteringFullScreen",
       enteringTrueFullScreenClass = "alfresco-core-FullScreenMixin-enteringTrueFullScreen",
       trueFullScreenClass = "alfresco-core-FullScreenMixin-trueFullScreen";

   return declare([AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/FullScreenMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/FullScreenMixin.css"}],

      /**
       * The current full screen mode
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      isWindowOnly: true,
      
      /**
       * The topic to publish on to toggle full window mode.
       *
       * @instance
       * @type {string}
       * @default "ALF_FULL_WINDOW"
       */
      fullWindowTopic: "ALF_FULL_WINDOW",

      /**
       * The topic to publish on to toggle full screen mode.
       *
       * @instance
       * @type {string}
       * @default "ALF_FULL_SCREEN"
       */
      fullScreenTopic: "ALF_FULL_SCREEN",

      /**
       * Toggles full-screen mode for the current context element
       *
       * @instance
       */
      toggleFullScreen: function alfresco_core_FullScreenMixin__toggleFullScreen(isWindowOnly, payload) {
         if (payload.selected === true)
         {
            if (this.domNode != null)
            {
               if (!dojo.doc.fullscreen && !dojo.doc.mozFullScreen && !dojo.doc.webkitFullScreen)
               {
                  this.requestFullScreen(isWindowOnly);
               }
               else
               {
                  this.cancelFullScreen();
               }
            }
         }
         else
         {
            this.cancelFullScreen();
         }
      },
      
      /**
       * Enters full-screen mode for the current context element
       *
       * @instance
       * @param {boolean} isWindowOnly Indicates whether to make the element the size of the window
       */
      requestFullScreen: function alfresco_core_FullScreenMixin__requestFullScreen(isWindowOnly) {
         this.isWindowOnly = (isWindowOnly != null) ? isWindowOnly : false;

         // Always enter full window mode first... this is done so that popups that are outide the target
         // DOM element can still be displayed. We're going to make the document body NOT the target DOM
         // element the full screen, but we want to fill the body first...
         this.toggleFullWindow(true);

         if (!isWindowOnly)
         {
            // If we're requesting full screen, now try make the document body full screen...
            var body = win.body();
            if (body.requestFullscreen || body.mozRequestFullScreen || body.webkitRequestFullScreen)
            {
               domClass.add(this.domNode, fullScreenClass);
               domClass.add(this.domNode, enteringFullScreenClass);
            }
            if (body.requestFullscreen)
            {
               body.requestFullscreen();
            }
            else if (body.mozRequestFullScreen)
            {
               body.mozRequestFullScreen();
            }
            else if (this.domNode.webkitRequestFullScreen)
            {
               // TODO Safari bug doesn't support keyboard input
               if (has("safari") && !has("chrome"))
               {
                  body.webkitRequestFullScreen();
               }
               else
               {
                  body.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
               }
            }
            else
            {
               // Full screen mode isn't supported by the browser so just leave in full window mode
               // as it currently is...
            }
         }
      },
      
      /**
       * Exits full-screen mode for the current context element
       *
       * @instance
       */
      cancelFullScreen: function alfresco_core_FullScreenMixin__cancelFullScreen() {
         if (dojo.doc.exitFullscreen)
         {
            dojo.doc.exitFullscreen();
         }
         else if (dojo.doc.mozCancelFullScreen)
         {
            dojo.doc.mozCancelFullScreen();
         }
         else if (dojo.doc.webkitCancelFullScreen)
         {
            dojo.doc.webkitCancelFullScreen();
         }
         this.toggleFullWindow(false);
      },
      
      /**
       * Handles changes to the full screen mode
       *
       * @instance
       */
      onFullScreenChange: function alfresco_core_FullScreenMixin__onFullScreenChange() {
         if (this.domNode != null)
         {
            if (domClass.contains(this.domNode, enteringFullScreenClass))
            {
               domClass.remove(this.domNode, enteringTrueFullScreenClass);
               // Let resizing take place then add the true-fullscreen class
               var _this = this;
               setTimeout(function()
               {
                  domClass.add(_this.domNode, trueFullScreenClass);
               }, 1000);
            }
            else
            {
               if (domClass.contains(this.domNode, trueFullScreenClass))
               {
                  if (domClass.contains(this.domNode, fullScreenClass))
                  {
                     // Exiting true fullscreen complete
                     domClass.remove(this.domNode, fullScreenClass);
                     domClass.remove(this.domNode, trueFullScreenClass);
                     this.onFullScreenExitComplete();
                  }
               }
               else
               {
                  // We've probably been programatically called in fullwindow mode
                  if (!domClass.contains(this.domNode, fullScreenClass))
                  {
                     domClass.add(this.domNode, fullScreenClass);
                     this.onFullScreenEnterComplete();
                  }
                  else
                  {
                     domClass.remove(this.domNode, fullScreenClass);
                     this.onFullScreenExitComplete();
                  }
               }
            }
         }
      },
      
      /** 
       * This function is called when entering fullscreen mode. It should be overridden by mixing modules
       * if they need to perform some post processing.
       *
       * @instance
       */
      onFullScreenEnterComplete: function alfresco_core_FullScreenMixin__onFullScreenEnterComplete() {
         // No action be default - extension point only.
      },

      /** 
       * This function is called when exiting fullscreen mode. It should be overridden by mixing modules
       * if they need to perform some post processing.
       *
       * @instance
       */
      onFullScreenExitComplete: function alfresco_core_FullScreenMixin__onFullScreenExitComplete() {
         // No action be default - extension point only.
      },

      /**
       * Toggles full-window mode for the current context element for browsers that don't support full-screen or
       * explicit setting of params.isWindowOnly=true.
       *
       * @instance
       * @param {boolean} enable Whether to enable the mode
       */
      toggleFullWindow: function alfresco_core_FullScreenMixin__toggleFullWindow(enable) {
         if (this.domNode != null)
         {
            if (enable === true && !domClass.contains(this.domNode, fullWindowClass))
            {
               domClass.add(this.domNode, fullWindowClass);
               // By using on.once the keyup capture will only occur once (i.e. the listener
               // is removed once the esc key has been used)...
               on.once(win.body(), "keyup", lang.hitch(this, this.onKeyUp));
            }
            else
            {
               domClass.remove(this.domNode, fullWindowClass);
            }
            this.onFullScreenChange();
         }
      },

      /**
       * This function is called when a key is pressed in full screen or full window mode. If the 
       * key that has been pressed happens to be the the ESCAPE key then the current mode is exited.
       *
       * @instance
       * @param {object} evt The key up event
       */
      onKeyUp: function alfresco_core_FullScreenMixin__onKeyUp(evt) {
         if (evt.keyCode == 27)
         {
            this.alfPublish(this.fullScreenTopic, {
               selected: false
            });
            this.alfPublish(this.fullWindowTopic, {
               selected: false
            });
            this.toggleFullWindow(false);
         }
      }
   });
});