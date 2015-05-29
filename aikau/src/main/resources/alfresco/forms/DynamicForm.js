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
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, "onFormRedrawRequest"));
         this.inherited(arguments);
      },

      /**
       * This is the property in the payload published on the 
       * [subscriptionTopic]{@link module:alfresco/forms/DynamicForm#subscriptionTopic}
       * that contains the JSON model to render as form widgets.
       *
       * @instance
       * @type {string}
       * @default "value"
       */
      formWidgetsProperty: "value",

      /**
       * This indicates whether or not the 
       * [formWidgetsProperty]{@link module:alfresco/forms/DynamicForm#formWidgetsProperty} is 
       * expected to be "stringified" (e.g. it is pure JSON that requires parsing). If this is set to
       * true (which is the default) then an attempt will be made to parse any data found.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      formWidetsPropertyStringified: true,

      /**
       * This is the property in the payload published on the 
       * [subscriptionTopic]{@link module:alfresco/forms/DynamicForm#subscriptionTopic}
       * that contains a value to set on the form.
       *
       * @instance
       * @type {string}
       * @default null
       */
      formValueProperty: null,

      /**
       * This function is called whenever the [subscriptionTopic]{@link module:alfresco/forms/DynamicForm#subscriptionTopic}
       * is published on. 
       * 
       * @instance
       * @param {object} payload A payload containing a 'value' attribute with the the JSON model to render
       */
      onFormRedrawRequest: function alfresco_forms_DynamicForm__onFormRedrawRequest(payload) {
         var widgetModel = lang.getObject(this.formWidgetsProperty, false, payload);
         if (!widgetModel)
         {
            this.alfLog("warn", "No '" + this.formWidgetsProperty + "' attribute found in redraw form request payload", payload, this);
         }
         else
         {
            // Destroy all the previous form fields...
            if (this._form)
            {
               this._form.destroyDescendants(false);
            }
            try
            {
               // It's important to clear the payload of the "OK" button to ensure that old form
               // data does not get published
               // TODO: This should also be done for additional buttons, but is harder to do without preserving
               //       the default publishPayload for them.
               if (this.okButton)
               {
                  this.okButton.publishPayload = {};
               }
               if (this.formWidetsPropertyStringified)
               {
                  try
                  {
                     var widgets = JSON.parse(widgetModel);
                     this.processWidgets(widgets, this._form.domNode);
                  }
                  catch(e)
                  {
                     this.alfLog("error", "The following error occurred attempting to parse a DynamicForm widget model", e, this, widgetModel);
                  }
               }
               else
               {
                  this.processWidgets(widgetModel, this._form.domNode);
               }

               if (this.formValueProperty)
               {
                  var value = lang.getObject(this.formValueProperty, false, payload);
                  if (value)
                  {
                     this.setValue(value);
                  }
               }

               if (payload.formSubmissionTopic && this.okButton)
               {
                  this.okButton.publishTopic = payload.formSubmissionTopic;
               }
            }
            catch (e)
            {
               this.alfLog("error", "An error occurred redrawing the form", e, this);
            }
         }
      }

   });
});