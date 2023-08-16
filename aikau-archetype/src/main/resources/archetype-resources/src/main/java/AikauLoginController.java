#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
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
package ${package};

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.extensions.surf.FrameworkUtil;
import org.springframework.extensions.surf.UserFactory;
import org.springframework.extensions.surf.exception.ConnectorServiceException;
import org.springframework.extensions.surf.mvc.LoginController;
import org.springframework.extensions.surf.support.AlfrescoUserFactory;
import org.springframework.extensions.surf.util.URLEncoder;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.connector.Connector;
import org.springframework.extensions.webscripts.connector.ConnectorContext;
import org.springframework.extensions.webscripts.connector.HttpMethod;
import org.springframework.extensions.webscripts.connector.Response;

/**
 * <p>This extends the standard {@link LoginController} to store the authenticated user's group membership information
 * as an {@link HttpSession} attribute so that it can be retrieved by the {@link AikauUserFactory} when creating
 * {@link AikauUser} instances.</p>
 * 
 * <p>This is to all intents and purposes the same as the ${groupId}.web.site.servlet.SlingshotLoginController class that is used by the
 * Alfresco Share application. It has been duplicated because at the time of writing it was not possible to place a
 * dependency on the SlingshotLoginController class due to the Maven project and publishing. The advantage of duplicating the code
 * however is that it allows freedom of customization.</p>
 * 
 * @author Dave Draper
 * @author Kevin Roast
 */
public class AikauLoginController extends LoginController
{
    public static String SESSION_ATTRIBUTE_KEY_USER_GROUPS = "_alf_USER_GROUPS";
    
    /**
     * Overrides the default behaviour to return a simple JSON response. 
     * 
     * @param request The {@link HttpServletRequest}
     * @param response The {@link HttpServletResponse}
     * @throws Exception
     */
    @Override
    protected void onSuccess(HttpServletRequest request, HttpServletResponse response) throws Exception
    {
        this.beforeSuccess(request, response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
    
    /**
     * Overrides the default behaviour to return a simple JSON response. 
     * 
     * @param request The {@link HttpServletRequest}
     * @param response The {@link HttpServletResponse}
     * @throws Exception
     */
    @Override
    protected void onFailure(HttpServletRequest request, HttpServletResponse response) throws Exception 
    {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
    
    /**
     * 
     * @param request
     * @param response
     * @throws Exception
     */
    protected void beforeSuccess(HttpServletRequest request, HttpServletResponse response) throws Exception
    {
        try
        {
            final HttpSession session = request.getSession();
            
            // Get the authenticated user name and use it to retrieve all of the groups that the user is a member of...
            String username = (String)request.getParameter(PARAM_USERNAME);
            if (username == null)
            {
                username = (String)session.getAttribute(UserFactory.SESSION_ATTRIBUTE_KEY_USER_ID);
            }
            
            if (username != null && session.getAttribute(SESSION_ATTRIBUTE_KEY_USER_GROUPS) == null)
            {
                Connector conn = FrameworkUtil.getConnector(session, username, AlfrescoUserFactory.ALFRESCO_ENDPOINT_ID);
                ConnectorContext c = new ConnectorContext(HttpMethod.GET);
                c.setContentType("application/json");
                Response res = conn.call("/api/people/" + URLEncoder.encode(username) + "?groups=true", c);
                if (Status.STATUS_OK == res.getStatus().getCode())
                {
                    // Assuming we get a successful response then we need to parse the response as JSON and then
                    // retrieve the group data from it...
                    // 
                    // Step 1: Get a String of the response...
                    String resStr = res.getResponse();
                    
                    // Step 2: Parse the JSON...
                    JSONParser jp = new JSONParser();
                    Object userData = jp.parse(resStr.toString());
    
                    // Step 3: Iterate through the JSON object getting all the groups that the user is a member of...
                    StringBuilder groups = new StringBuilder(512);
                    if (userData instanceof JSONObject)
                    {
                        Object groupsArray = ((JSONObject) userData).get("groups");
                        if (groupsArray instanceof org.json.simple.JSONArray)
                        {
                            for (Object groupData: (org.json.simple.JSONArray)groupsArray)
                            {
                                if (groupData instanceof JSONObject)
                                {
                                    Object groupName = ((JSONObject) groupData).get("itemName");
                                    if (groupName != null)
                                    {
                                        groups.append(groupName.toString()).append(',');
                                    }
                                }
                            }
                        }
                    }
                    
                    // Step 4: Trim off any trailing commas...
                    if (groups.length() != 0)
                    {
                        groups.delete(groups.length() - 1, groups.length());
                    }
                    
                    // Step 5: Store the groups on the session...
                    session.setAttribute(SESSION_ATTRIBUTE_KEY_USER_GROUPS, groups.toString());
                }
                else
                {
                    session.setAttribute(SESSION_ATTRIBUTE_KEY_USER_GROUPS, "");
                }
            }
        }
        catch (ConnectorServiceException e1)
        {
            throw new Exception("Error creating remote connector to request user group data.");
        }
    }
}
