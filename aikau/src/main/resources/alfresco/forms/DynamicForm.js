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
 * This module extends the standard [Form widget]{@link module:alfresco/forms/Form} to provide the ability
 * to dynamically re-draw a form based on payload published to a subscribed topic. The idea is that the 
 * displayed form can change (e.g. as the users picks a specific form type from a drop-down or radio buttons)
 * 
 * @module alfresco/forms/DynamicForm
 * @extends module:alfresco/forms/Form
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/Form",
        "dojo/_base/lang",
        "dojo/json"], 
        function(declare, Form, lang, dojoJson) {
   
   return declare([Form], {
      
      /**
       * The topic that will be subscribed to in the [postCreate]{@link module:alfresco/forms/DynamicForm#postCreate}
       * function to trigger the redrawing of the form. It is expected that this will be configured with a custom value
       * but a default value is provided.
       *
       * @instance
       * @type {string}
       * @default "ALF_DYNAMIC_FORM_UPDATE"
       */
      subscriptionTopic: "ALF_DYNAMIC_FORM_UPDATE",

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_forms_DynamicForm__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, "onFormRedrawRequest"));
      },

      /**
       * This function is called whenever the [subscriptionTopic]{@link module:alfresco/forms/DynamicForm#subscriptionTopic}
       * is published on. The payload is expected to contain a 'value' attribute containing the JSON model to use to render
       * the new form.
       * 
       * @instance
       * @param {object} payload A payload containing a 'value' attribute with the the JSON model to render
       */
      onFormRedrawRequest: function alfresco_forms_DynamicForm__onFormRedrawRequest(payload) {
         var value = lang.getObject("value", false, payload);
         if (value == null)
         {
            this.alfLog("warn", "No 'value' attribute found in redraw form request payload", payload, this);
         }
         else
         {
            // Destroy all the previous form fields...
            if (this._form != null)
            {
               this._form.destroyDescendants(false);
            }
            try
            {
               // It's important to clear the payload of the "OK" button to ensure that old form
               // data does not get published
               // TODO: This should also be done for additional buttons, but is harder to do without preserving
               //       the default publishPayload for them.
               if (this.okButton != null)
               {
                  this.okButton.publishPayload = {};
               }
               var widgets = dojoJson.parse(value);
               this.processWidgets(widgets, this._form.domNode);
            }
            catch (e)
            {
               this.alfLog("error", "An error occurred redrawing the form", e, value, this);
            }
         }
      }

   });
});