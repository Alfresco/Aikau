model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
            loggingPreferences: {
               enabled: true,
               all: true,
               warn: true,
               error: true
            }
         }
      }
   ],
   widgets: [
      {
         name: "aikauTesting/CssOverrides"
      },
      {
         id: "ACCESSIBILITY_MENU",
         name: "alfresco/accessibility/AccessibilityMenu",
         config: {
            titleMsgKey: "access.key.links.message",
            menu: [
               {url: "#accesskey-skip", key: "s", msgKey: "skip.to.content.message"},
               {url: "#BUTTON", key: "b", msgKey: "Skip to button"},
               {url: "#TEXTBOX", key: "t", msgKey: "Skip to text box"},
               {url: "#MENU_ITEM", key: "m", msgKey: "Skip to menu"},
               {url: "/share/page/accessibility-help", key: "0", msgKey: "access.keys.message"},
               {url: "/share/page/user/admin/dashboard", key: "1", msgKey: "home.page.message"},
               {url: "/share/page/advsearch", key: "4", msgKey: "search.this.site.message"},
               {url: "/share/page/site-help", key: "6", msgKey: "accessibility.help.message"},
               {url: "/share/page/terms", key: "8", msgKey: "terms.and.conditions.message"},
               {url: "/share", key: "9", msg: "This is just a test message"},
               {url: "#accesskey-foot", key: "f", msgKey: "skip.to.foot.message"}
            ],
            targets: [
               {domid: "ACCESSIBILITY_MENU", targetid: "accesskey-skip", after: false},
               {domid: "ACCESSIBILITY_MENU", targetid: "accesskey-foot", after: true}
            ]
         }
      },
      {
         id: "BUTTON",
         name: "alfresco/buttons/AlfButton",
         config: {
            label: "Demonstrates focus",
            publishTopic: "BUTTON_FOCUS_SUCCESS"
         }
      },
      {
         id: "TEXTBOX",
         name: "alfresco/forms/controls/TextBox",
         config: {
            fieldId: "textbox",
            label: "Test",
            name: "test"
         }
      },
      {
         id: "MENU",
         name: "alfresco/menus/AlfMenuBar",
         config: {
            widgets: [
               {
                  id: "MENU_ITEM",
                  name: "alfresco/menus/AlfMenuBarItem",
                  config: {
                     label: "Menu Item",
                     publishTopic: "MENU_FOCUS_SUCCESS"
                  }
               }
            ]
         }
      },
      {
         name: "alfresco/logging/DebugLog"
      }
   ]
};