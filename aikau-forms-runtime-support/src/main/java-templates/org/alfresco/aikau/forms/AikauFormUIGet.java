/*
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
package org.alfresco.aikau.${underscore}${webscript.version}.forms;

import java.util.ArrayList;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.alfresco.web.scripts.forms.FormUIGet;

/**
 * Extension of the standard Share Forms Engine WebScript controller. This controller constructs
 * a full JSON rendering of the requested form data.
 * 
 * @author Dave Draper
 */
public class AikauFormUIGet extends FormUIGet
{
    @Override
    protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache)
    {
        Map<String, Object> model = super.executeImpl(req, status, cache);

        Map<String, Object> formData = (Map<String, Object>) model.get("form");
        ArrayList<Constraint> constraints = (ArrayList<Constraint>) formData.get("constraints");
        ArrayList<JSONObject> jsonConstraints = new ArrayList<JSONObject>();
        for (Constraint constraint: constraints)
        {
            try
            {
                JSONObject jsonConstraint = new JSONObject();
                jsonConstraint.put("id", constraint.getId());
                jsonConstraint.put("fieldId", constraint.getFieldId());
                jsonConstraint.put("event", constraint.getEvent());
                jsonConstraint.put("message", constraint.getMessage());
                jsonConstraint.put("params", constraint.getJSONParams());
                jsonConstraint.put("validationHandler", constraint.getValidationHandler());
                jsonConstraints.add(jsonConstraint);
            }
            catch(JSONException e)
            {
                
            }
        }

        ArrayList<Set> structures = (ArrayList<Set>) formData.get("structure");
        ArrayList<JSONObject> jsonStructures = new ArrayList<JSONObject>();
        for (Set structure: structures)
        {
            try
            {
                JSONObject jsonStructure = new JSONObject();
                jsonStructure.put("id", structure.getId());
                jsonStructure.put("fieldId", structure.getKind());
                jsonStructure.put("event", structure.getLabel());
                jsonStructure.put("message", structure.getTemplate());
                jsonStructure.put("params", structure.getAppearance());
                
                ArrayList<JSONObject> children = new ArrayList<JSONObject>();
                for (Element element: structure.getChildren())
                {
                    FieldPointer fieldPointer = (FieldPointer) element;
                    JSONObject child = new JSONObject();
                    child.put("id", fieldPointer.getId());
                    child.put("kind", fieldPointer.getKind());
                    children.add(child);
                }
                jsonStructure.put("children", children);
                jsonStructures.add(jsonStructure);
            }
            catch(JSONException e)
            {
                
            }
        }

        JSONObject jsonFields = new JSONObject();
        Map<String, Field> fields = (Map<String, Field>) formData.get("fields");
        for (Map.Entry<String, Field> entry: fields.entrySet())
        {
            try
            {
                Field field = entry.getValue();
                JSONObject jsonField = new JSONObject();
                jsonField.put("value", field.getValue());
                jsonField.put("configName", field.getConfigName());
                jsonField.put("content", field.getContent());
                jsonField.put("dataKeyName", field.getDataKeyName());
                jsonField.put("dataType", field.getDataType());
                jsonField.put("description", field.getDescription());
                jsonField.put("endpointDirection", field.getEndpointDirection());
                jsonField.put("endpointType", field.getEndpointType());
                jsonField.put("help", field.getHelp());
                jsonField.put("id", field.getId());
                jsonField.put("helpEncodeHtml", field.getHelpEncodeHtml());
                jsonField.put("indexTokenisationMode", field.getIndexTokenisationMode());
                jsonField.put("kind", field.getKind());
                jsonField.put("label", field.getLabel());
                jsonField.put("name", field.getName());
                jsonField.put("type", field.getType());
                
                FieldControl fieldControl = field.getControl();
                JSONObject jsonFieldControl = new JSONObject();
                jsonFieldControl.put("params", fieldControl.getParams());
                jsonFieldControl.put("template", fieldControl.getTemplate());
                jsonField.put("control", jsonFieldControl);
                jsonFields.put(entry.getKey(), jsonField);
            }
            catch(JSONException e)
            {
                
            }
        }

        formData.put("constraints", jsonConstraints);
        formData.put("structure", jsonStructures);
        formData.put("fields", jsonFields);
      
        JSONObject jo = new JSONObject(formData);
        model.put("jsonModelString", jo.toString());
        return model;
    }
}
