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
         name: "aikau/layout/Layout",
         config: {
            widgets: [
               {
                  name: "aikau/layout/Header",
                  config: {
                     widgets: [
                        {
                           name: "aikau/layout/HeaderRow",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/logo/Logo",
                                    config: {
                                       title: "Material Designed Aikau"
                                    }
                                 },
                                 {
                                    name: "aikau/layout/Title",
                                    config: {
                                       title: "Material Designed Aikau"
                                    }
                                 },
                                 {
                                    name: "aikau/layout/Spacer"
                                 },
                                 {
                                    name: "aikau/layout/Title",
                                    config: {
                                       title: "Miya Hwang"
                                    }
                                 },
                                 {
                                    name: "aikau/buttons/Button",
                                    config: {
                                       buttonClasses: "mdl-button--icon",
                                       leadingIcon: "notifications"
                                    }
                                 },
                                 {
                                    name: "aikau/buttons/Button",
                                    config: {
                                       buttonClasses: "mdl-button--icon",
                                       leadingIcon: "apps"
                                    }
                                 },
                                 {
                                    name: "aikau/buttons/Button",
                                    config: {
                                       buttonClasses: "mdl-button--icon",
                                       leadingIcon: "settings"
                                    }
                                 },
                                 {
                                    name: "aikau/buttons/Button",
                                    config: {
                                       buttonClasses: "mdl-button--icon",
                                       leadingIcon: "input"
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               },
               {
                  name: "aikau/layout/Drawer",
                  config: {
                     fixed: true,
                     widgets: [
                        {
                           name: "aikau/buttons/Button",
                           config: {
                              buttonClasses: "mdl-button--raised mdl-button--colored mdl-button--accent",
                              trailingIcon: "arrow_drop_down",
                              label: "New"
                           }
                        },
                        {
                           name: "aikau/menus/Menu",
                           config: {
                              label: "Company Libraries",
                              leadingIcon: "group_work",
                              trailingIcon: "expand_more",
                              widgets: [
                                 {
                                    name: "aikau/menus/MenuItem",
                                    config: {
                                       title: "Help"
                                    }
                                 }
                              ]
                           }
                        },
                        {
                           name: "aikau/menus/Menu",
                           config: {
                              label: "Smart Folders",
                              leadingIcon: "folder_special",
                              trailingIcon: "expand_more",
                              widgets: [
                                 {
                                    name: "aikau/menus/MenuItem",
                                    config: {
                                       title: "Help"
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
};