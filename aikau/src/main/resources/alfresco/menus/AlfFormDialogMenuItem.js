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
 * <p>This should be used in a [drop-down menu]{@link module:alfresco/menus/AlfMenuBarPopup}, [cascade]{@link module:alfresco/menus/AlfCascadingMenu}
 * or [group]{@link module:alfresco/menus/AlfMenuGroup} as a quick method of displaying a dialog containing a form. The dialog title and labels for the
 * confirmation and cancel buttons but be configured along with all the form controls that should be displayed in the dialog.</p>
 * <p>This module mixes the [_AlfCreateFormDialogMixin]{@link module:alfresco/dialogs/_AlfCreateFormDialogMixin}
 * into the [AlfMenuItem]{@link module:alfresco/menus/AlfMenuItem}. The source for this module is completely empty
 * because all of the work is actually done by the two mixed modules.</p>
 * <p>Sample configuration:</p>
 * <p><pre>{
 *   name: "alfresco/menus/AlfFormDialogMenuItem",
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
 * }</pre></p>
 * 
 * @module alfresco/menus/AlfFormDialogMenuItem
 * @extends alfresco/menus/AlfMenuItem
 * @mixes module:alfresco/dialogs/_AlfCreateFormDialogMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuItem",
        "alfresco/dialogs/_AlfCreateFormDialogMixin"], 
        function(declare, AlfMenuItem, _AlfCreateFormDialogMixin) {
   
   return declare([AlfMenuItem, _AlfCreateFormDialogMixin], {
   });
});