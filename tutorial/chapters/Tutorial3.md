Previous: [How to Create a new Widget](./Tutorial2.md),
Next: [Configuring Logging and Debug](./Tutorial4.md)

## Tutorial 3 - Create a Composite Widget

When you generated your new client from the Maven Archetype in [Tutorial 1](./Tutorial1.md), you were provided with a home page containing a header bar. We’re going to want that header to appear on every page in our application but it’s constructed from lots of individual widgets. You don’t really want to copy and paste 60 lines of model between pages - not least because it will immediately introduce maintenance issues if you want to make any changes.

One of the ways in which we can address this problem is to create a composite widget containing our header model which we can then reference in every page. We are then able to make changes to the header in one file and the changes will be pervasive across the entire application.

### Step 1. Create the JavaScript file
Let’s start by creating a new JavaScript file that defines our header widget. Create a file in the `<PROJECT>/src/main/webapp/js/tutorial` folder called `Header.js` with the following contents:

```JAVASCRIPT
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets"], 
        function(declare, ProcessWidgets) {
   
  return declare([ProcessWidgets], {
      
  });
});
```

This is the basic template for a composite widget. If you remember from the [previous tutorial](./Tutorial2.md) the `define` function is for specifying the resources that the widget is dependant upon and the `declare` function is for defining the widget itself.

Our composite widget extends the `alfresco/core/ProcessWidgets` module. The ProcessWidgets module is an abstract widget that will process a model assigned to the `widgets` instance variable.

### Step 2. Add a model
To complete our widget we just need to move our header model from our home page JavaScript controller to our widget so that it looks like this:

```JAVASCRIPT
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets"], 
        function(declare, ProcessWidgets) {
   
   return declare([ProcessWidgets], {

      widgets: [
         {
            id: "HEADER_BAR",
            name: "alfresco/header/Header",
            config: {
               widgets: [
                  {
                     id: "APP_MENU_BAR",
                     name: "alfresco/header/AlfMenuBar",
                     align: "left",
                     config: {
                        widgets: [
                           {
                              id: "HOME",
                              name: "alfresco/menus/AlfMenuBarItem",
                              config: {
                                 label: "Home",
                                 targetUrl: "ap/ws/home"
                              }
                           }
                        ]
                     }
                  },
                  {
                     id: "USER_MENU_BAR",
                     name: "alfresco/header/AlfMenuBar",
                     align: "right",
                     config: {
                        widgets: [
                           {
                              id: "USER_MENU",
                              name: "alfresco/header/AlfMenuBarPopup",
                              config: {
                                 label: "User Menu",
                                 widgets: [
                                    {
                                       id: "HEADER_USER_MENU",
                                       name: "alfresco/menus/AlfMenuGroup",
                                       config: {
                                          widgets: [
                                             {
                                                id: "LOGOUT",
                                                name: "alfresco/header/AlfMenuItem",
                                                config:
                                                {
                                                   label: "Logout",
                                                   iconClass: "alf-user-logout-icon",
                                                   publishTopic: "ALF_DOLOGOUT"
                                                }
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              }
                           }
                        ]
                     }
                  }
               ]
            }
         }
      ]
   });
});
```

This may look a little complicated at first, but it is just a structure of nested widgets, and once we have this right we can reuse it anywhere in our application without having to duplicate the code again.

### Step 3. Reference the composite widget
We can now replace the section of model that we’ve copied with our new composite widget. Depending upon how you've previously edited the mode, the composite widget should replace the widget with the id "HEADER_BAR" that you should find at around line 18. After editing that section of the file should look something like this:

```JAVASCRIPT
widgets: [
  {
    id: "MAIN_VERTICAL_LAYOUT",
    name: "alfresco/layout/VerticalWidgets",
    config: 
      {
        widgets: [
          // COMPOSITE WIDGET ADDED HERE...
          {
            name: "tutorial/Header"
          },
          // THIS IS THE REST OF THE ORIGINAL JSON MODEL...
          {
            id: "HEADER_TITLE_BAR",
            name: "alfresco/layout/LeftAndRight",
```

When you reload the page you should see the header exactly as it was before. Now you have a header widget that is being reused in each page of your client.

Previous: [How to Create a new Widget](./Tutorial2.md),
Next: [Configuring Logging and Debug](./Tutorial4.md)
