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
 * A button on a form dialog
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *   name: "alfresco/buttons/AlfFormDialogButton",
 *     config: {
 *        id: "MyFormDialogMenuItem",
 *        label: "Create Form Dialog",
 *        dialogTitle: "My Dialog",
 *        dialogConfirmationButtonTitle : "Post",
 *        dialogCancellationButtonTitle : "Close",
 *        formSubmissionTopic: "FORM_SUBMIT",
 *        widgets: [
 *           {
 *              name: "alfresco/forms/controls/DojoValidationTextBox",
 *              config: {
 *                 name: "post_param",
 *                 label: "Enter text",
 *                 value: ""
 *              }
 *           }
 *        ]
 *     }
 * }
 * 
 * @module alfresco/buttons/AlfFormDialogButton
 * @extends alfresco/menus/AlfMenuItem
 * @mixes module:alfresco/dialogs/_AlfCreateFormDialogMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/buttons/AlfButton",
        "alfresco/dialogs/_AlfCreateFormDialogMixin"], 
        function(declare, AlfMenuItem, _AlfCreateFormDialogMixin) {
   
   return declare([AlfMenuItem, _AlfCreateFormDialogMixin], {
   });
});