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
 * This module has been provided to support the 
 * [FormsRuntimeService]{@link module:alfresco/services/FormsRuntimeService} to address
 * the requirements of rendering [buttons]{@link module:alfresco/buttons/AlfButton} for 
 * each transition available when editing a workflow task.
 * 
 * @module alfresco/forms/controls/Transitions
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 * @since 1.0.86
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        // No callbacks from here...
        "alfresco/layout/DynamicWidgets",
        "alfresco/buttons/AlfButton"], 
        function(declare, BaseFormControl, CoreWidgetProcessing, topics, array, lang) {
   
   return declare([BaseFormControl, CoreWidgetProcessing], {
      
      /**
       * This will be set to a generated topic that is published when 
       * [a value is set]{@link module:alfresco/forms/controls/Transitions#setValue}
       * and is subscribed to by a [DynamicWidgets]{@link module:alfresco/layout/DynamicWidgets}.
       * The payload is a widgets model containing a [button]{@link module:alfresco/buttons/AlfButton}
       * for each transition available.
       * 
       * @instance
       * @type {string}
       * @default
       */
      transitionButtonsUpdateTopic: null,

      /**
       * This will be set to a generated topic that is published whenever a user makes a transition.
       * The transition will be handled by [onTransition]{@link module:alfresco/forms/controls/Transitions#onTransition}.
       * 
       * @instance
       * @type {string}
       * @default
       */
      transitionTopic: null, 

      /**
       * This will be set by [onTransition]{@link module:alfresco/forms/controls/Transitions#onTransition} whenever
       * a user makes a transition and will be returned by 
       * [getValue]{@link module:alfresco/forms/controls/Transitions#getValue}.
       *
       * @instance
       * @type {string}
       * @default
       */
      transitionValue: null,

      /**
       * Creates a new [DynamicWidgets]{@link module:alfresco/layout/DynamicWidgets} that is used to 
       * render [buttons]{@link module:alfresco/buttons/AlfButton} for each transition available.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_Transitions__createFormControl(config, /*jshint unused:false*/ domNode) {
         return this.createWidget({
            name: "alfresco/layout/DynamicWidgets",
            config: {
               subscriptionTopic: this.transitionButtonsUpdateTopic
            }
         });
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue}
       * to return [transitionValue]{@link module:alfresco/forms/controls/Transitions#transitionValue}.
       * 
       * @instance
       * @returns {string} Returns the transition (if one has been made)
       */
      getValue: function alfresco_forms_controls_Transitions__getValue() {
         return this.transitionValue;
      },

      /**
       * Handles the user making a transition. The 
       * [transition value]{@link module:alfresco/forms/controls/Transitions#transitionValue} is updated
       * and a [topic]{@link module:alfresco/core/topics#TRIGGER_FORM_SUBMISSION} is published to request
       * that the [form]{@link module:alfresco/forms/Form} be submitted.
       *  
       * @instance
       * @fires module:alfresco/core/topics#TRIGGER_FORM_SUBMISSION
       */
      onTransition: function alfresco_forms_controls_Transitions__onTransition(payload) {
         this.transitionValue = payload.transition;
         this.onValueChangeEvent(this.name, null, payload.transition);
         this.alfPublish(topics.TRIGGER_FORM_SUBMISSION);
      },

      /**
       * Generates the [transitionTopic]{@link module:alfresco/forms/controls/Transitions#transitionTopic}
       * and [transitionButtonsUpdateTopic]{@link module:alfresco/forms/controls/Transitions#transitionButtonsUpdateTopic}
       * and then sets up the subscription to handle transitions being made.
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_Transitions__postCreate() {
         this.transitionTopic = this.generateUuid();
         this.transitionButtonsUpdateTopic = this.generateUuid();
         this.alfSubscribe(this.transitionTopic, lang.hitch(this, this.onTransition));
         this.inherited(arguments);
      },

      /**
       * Processes the supplied value to derive transitions and then publishes a request to
       * render each transition as a [button]{@link module:alfresco/buttons/AlfButton}.
       * 
       * @instance
       * @param {string} value The value to derive transitions from.
       */
      setTransitions: function alfresco_forms_controls_Transitions__setTransitions(value) {
         if (value)
         {
            var transitions = value.split(",");
            var widgets = array.map(transitions, function(transition) {
               var transitionInfo = transition.split("|");
               return {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: transitionInfo[1],
                     publishTopic: this.transitionTopic,
                     publishPayload: {
                        transition: transitionInfo[0]
                     }
                  }
               };
            }, this);

            // Publish the generated widgets model so that the DynamicWidgets (the wrappedWidget)
            // can render them...
            this.alfPublish(this.transitionButtonsUpdateTopic, {
               widgets: widgets
            });
         }
      },

      /**
       * Overrides the 
       * [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setupChangeEvents}
       * to intentionally do nothing.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_Transitions__setupChangeEvents() {
         // No action required.
      },

      /**
       * Calls [setTransitions]{@link module:alfresco/forms/controls/Transitions#setTransitions}
       * to process the transition data render 
       * [buttons]{@link module:alfresco/buttons/AlfButton} for each transition available.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_Transitions__setValue(value) {
         if (this.deferValueAssigment)
         {
            this.inherited(arguments);
         }
         else
         {
            if (this.wrappedWidget)
            {
               this.setTransitions(value);
            }
         }
      }
   });
});