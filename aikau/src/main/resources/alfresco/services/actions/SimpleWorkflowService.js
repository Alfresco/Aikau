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
 * @module alfresco/services/actions/SimpleWorkflowService
 * @extends module:alfresco/services/actions/WorkflowService
 * @author Dave Draper
 * @deprecated Since 1.0.18 - Use [alfresco/services/actions/WorkflowService]{@link module:alfresco/services/actions/WorkflowService} instead.
 */
define(["dojo/_base/declare",
        "alfresco/services/actions/WorkflowService"],
        function(declare, WorkflowService) {
   return declare([WorkflowService], {});
});