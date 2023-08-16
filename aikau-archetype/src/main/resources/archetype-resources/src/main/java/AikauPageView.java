#set( $symbol_pound = '#' )
#set( $symbol_dollar = '$' )
#set( $symbol_escape = '\' )
/*
 * Copyright (C) 2005-2011 Alfresco Software Limited.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.

 * As a special exception to the terms and conditions of version 2.0 of 
 * the GPL, you may redistribute this Program in connection with Free/Libre 
 * and Open Source Software ("FLOSS") applications as described in Alfresco's 
 * FLOSS exception.  You should have recieved a copy of the text describing 
 * the FLOSS exception, and it is also available here: 
 * http://www.alfresco.com/legal/licensing
 */
package ${package};

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.extensions.config.RemoteConfigElement;
import org.springframework.extensions.config.WebFrameworkConfigElement;
import org.springframework.extensions.config.RemoteConfigElement.EndpointDescriptor;
import org.springframework.extensions.surf.ModelObjectService;
import org.springframework.extensions.surf.RequestContext;
import org.springframework.extensions.surf.TemplatesContainer;
import org.springframework.extensions.surf.exception.CredentialVaultProviderException;
import org.springframework.extensions.surf.exception.PlatformRuntimeException;
import org.springframework.extensions.surf.mvc.PageView;
import org.springframework.extensions.surf.render.RenderService;
import org.springframework.extensions.surf.resource.ResourceService;
import org.springframework.extensions.surf.site.AuthenticationUtil;
import org.springframework.extensions.surf.support.AlfrescoUserFactory;
import org.springframework.extensions.surf.types.Page;
import org.springframework.extensions.surf.types.Theme;
import org.springframework.extensions.webscripts.connector.User;

/**
 * Slingshot implementation of PageView object.
 * <p>
 * Adds a override to the initial setup of the request context, this is used to identify
 * page objects with a theme override - allowing a theme per site or even a theme per
 * page. Currently the UI only provides a mechanism to set the theme on a per application
 * and per site basis.
 * 
 * @author Kevin Roast
 */
public class AikauPageView extends PageView
{
    // Redirect session parameters
    public static final String REDIRECT_URI   = "_redirectURI";
    public static final String REDIRECT_QUERY = "_redirectQueryString";
    
    private RemoteConfigElement config;
    
    /**
     * Construction
     * 
     * @param webFrameworkConfiguration
     * @param modelObjectService
     * @param resourceService
     * @param renderService
     * @param templatesContainer
     */
    public AikauPageView(WebFrameworkConfigElement webFrameworkConfiguration,
            ModelObjectService modelObjectService, ResourceService resourceService, RenderService renderService,
            TemplatesContainer templatesContainer)
    {
        super(webFrameworkConfiguration, modelObjectService, resourceService, renderService, templatesContainer);
    }
    
    @Override
    protected void prepareResponse(HttpServletRequest request, HttpServletResponse response)
    {
        response.setHeader("Cache-Control", "no-cache");
    }

    /* (non-Javadoc)
     * @see org.springframework.extensions.surf.mvc.AbstractWebFrameworkView${symbol_pound}validateRequestContext(org.springframework.extensions.surf.RequestContext, javax.servlet.http.HttpServletRequest)
     */
    @Override
    protected void validateRequestContext(RequestContext rc, HttpServletRequest req)
        throws Exception
    {
        super.validateRequestContext(rc, req);
        
        String themeId = null;
        
        // test to see if this is a site page
        String siteId = rc.getUriTokens().get("site");
        if (siteId != null)
        {
            // find the site dashboard page - and look for a theme override
            Page dashboard = getObjectService().getPage("site/" + siteId + "/dashboard");
            if (dashboard != null)
            {
                themeId = dashboard.getProperty("theme");
            }
        }
        else
        {
            // examine current page directly for custom properties with a theme override
            // this allows a different theme per page
            themeId = rc.getPage().getProperty("theme");
        }
        
        // if themeId different to current theme then look it up
        if (themeId != null && themeId.length() != 0 && !rc.getThemeId().equals(themeId))
        {
            Theme theme = getObjectService().getTheme(themeId);
            if (theme != null)
            {
                // found a valid theme - set it current ready for page rendering
                rc.setTheme(theme);
            }
        }
    }
    
    @Override
    protected boolean loginRequiredForPage(RequestContext context, HttpServletRequest request, Page page)
    {
        boolean externalAuth = false;
        EndpointDescriptor descriptor = getRemoteConfig(context).getEndpointDescriptor(AlfrescoUserFactory.ALFRESCO_ENDPOINT_ID);
        if (descriptor != null)
        {
            externalAuth = descriptor.getExternalAuth();
        }
        
        boolean login = false;
        User user = context.getUser();
        switch (page.getAuthentication())
        {
            case guest:
            {
                login = (user == null);
                break;
            }
            
            // Enhanced test over the super class implementation - to check that the user has credentials to
            // use the default "alfresco" endpoint - ensures that say a user ID is in the session from
            // access to an RSS feed endpoint, they are not given permission to proceed until after a full login
            case user:
            {
                try
                {
                    login = (user == null || AuthenticationUtil.isGuest(user.getId())) ||
                            (!context.getServiceRegistry().getConnectorService().getCredentialVault(
                                request.getSession(), user.getId()).hasCredentials(AlfrescoUserFactory.ALFRESCO_ENDPOINT_ID) &&
                             externalAuth == false);
                }
                catch (CredentialVaultProviderException err)
                {
                    throw new PlatformRuntimeException("Unable to retrieve credentials for current user.", err);
                }
                break;
            }
            
            case admin:
            {
                try
                {
                    login = (user == null || !user.isAdmin()) ||
                            (!context.getServiceRegistry().getConnectorService().getCredentialVault(
                                request.getSession(), user.getId()).hasCredentials(AlfrescoUserFactory.ALFRESCO_ENDPOINT_ID) &&
                             externalAuth == false);
                }
                catch (CredentialVaultProviderException err)
                {
                    throw new PlatformRuntimeException("Unable to retrieve credentials for current user.", err);
                }
                if (login)
                {
                    // special case for admin - need to clear user context before
                    // we can login again to "upgrade" our user authentication level
                    AuthenticationUtil.clearUserContext(request);
                }
                break;
            }
        }
        return login;
    }
    
    @Override
    protected String buildLoginRedirectURL(HttpServletRequest request)
    {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute(REDIRECT_URI) != null)
        {
            String redirectUrl = session.getAttribute(REDIRECT_URI) +
                    (session.getAttribute(REDIRECT_QUERY) != null ? ("?" + session.getAttribute(REDIRECT_QUERY)) : "");
            session.removeAttribute(REDIRECT_URI);
            session.removeAttribute(REDIRECT_QUERY);
            return redirectUrl;
        }
        return super.buildLoginRedirectURL(request);
    }
    
    /**
     * Gets the remote config.
     * 
     * @return the remote config
     */
    private RemoteConfigElement getRemoteConfig(RequestContext context)
    {
        if (this.config == null)
        {
            // retrieve the remote configuration
            this.config = (RemoteConfigElement)context.getServiceRegistry().getConfigService().getConfig("Remote").getConfigElement("remote");
        }
        
        return this.config;
    }
}