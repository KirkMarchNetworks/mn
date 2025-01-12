import { inject, Injectable } from '@angular/core';
import { Menu, MenuService } from '@mn/project-one/client/services/menu';
import { ClientRouting, SuperAdminRoleId } from '@mn/project-one/shared/models';
import { CoreRepo } from '@mn/project-one/client/repos/core';
import { firstValueFrom, skip } from 'rxjs';
import { UserEntity } from '@mn/project-one/shared/api-client';

@Injectable({
  providedIn: 'root',
})
export class InitializationService {
  private readonly _menuService = inject(MenuService);
  private readonly _coreRepo = inject(CoreRepo);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  async load() {
    await firstValueFrom(this._coreRepo.initialized$)
    const user = await firstValueFrom(this._coreRepo.user$);
    this._setMenu(user);

    this._coreRepo.user$.pipe(
      skip(1)
    ).subscribe(user => {
      this._setMenu(user);
    });
  }

  // TODO: Fix all this
  private _setMenu(user: UserEntity | null) {
    if (user) {
      this._menuService.set(authenticatedMenu());

      if (user.role.id === SuperAdminRoleId) {
        this._menuService.prepend({
          "route": ClientRouting.superAdmin.absolutePath(),
          "name": "Super Admin",
          "type": "sub",
          "icon": "admin_panel_settings",
          "children": [
            {
              "route": ClientRouting.superAdmin.children.tenantManagement.absolutePath(),
              "name": "Tenant Management",
              "type": "link",
            },
          ]
        },)
      }
    } else {
      this._menuService.set(unauthenticatedMenu());
    }
  }
}

const aboutMenu: () => Menu = () => ({
  "route": ClientRouting.about.absolutePath(),
  "name": "About",
  "type": "link",
  "icon": "info",
})

const unauthenticatedMenu: () => Menu[] = () => [
  {
    "route": ClientRouting.login.absolutePath(),
    "name": "Login",
    "type": "link",
    "icon": "lock",
  },
  aboutMenu()
]


const authenticatedMenu: () => Menu[] = () => [
  {
    "route": ClientRouting.main.absolutePath(),
    "name": "Evidence Vault",
    "type": "link",
    "icon": "cloud",
  },
  {
    "route": ClientRouting.intelligentRetrieval.absolutePath(),
    "name": "Intelligent Retrieval",
    "type": "sub",
    "icon": "search",
    "children": [
      {
        "route": ClientRouting.intelligentRetrieval.children.search.absolutePath(),
        "name": "Search",
        "type": "link",
      },
      {
        "route": ClientRouting.intelligentRetrieval.children.upload.absolutePath(),
        "name": "Upload",
        "type": "link"
      },
      {
        "route": ClientRouting.intelligentRetrieval.children.settings.absolutePath(),
        "name": "Settings",
        "type": "link"
      }
    ]
  },
  {
    "route": ClientRouting.userManagement.absolutePath(),
    "name": "User Management",
    "type": "sub",
    "icon": "manage_accounts",
    "children": [
      {
        "route": ClientRouting.userManagement.children.users.absolutePath(),
        "name": "Users",
        "type": "link",
      },
      {
        "route": ClientRouting.userManagement.children.roles.absolutePath(),
        "name": "Roles",
        "type": "link"
      }
    ]
  },
  {
    "route": ClientRouting.settings.absolutePath(),
    "name": "Settings",
    "type": "link",
    "icon": "settings",
  },
  aboutMenu(),
  {
    "route": "menu-level",
    "name": "Deep Menu Example",
    "type": "sub",
    "icon": "subject",
    "children": [
      {
        "route": "level-1-1",
        "name": "level-1-1",
        "type": "sub",
        "children": [
          {
            "route": "level-2-1",
            "name": "level-2-1",
            "type": "sub",
            "children": [
              {
                "route": "level-3-1",
                "name": "level-3-1",
                "type": "sub",
                "children": [
                  {
                    "route": "level-4-1",
                    "name": "level-4-1",
                    "type": "sub",
                    "children": [
                      {
                        "route": "level-4-1",
                        "name": "level-4-1",
                        "type": "sub",
                        "children": [
                          {
                            "route": "level-4-1",
                            "name": "level-4-1",
                            "type": "link"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "route": "level-2-2",
            "name": "level-2-2",
            "type": "link"
          }
        ]
      },
      {
        "route": "level-1-2",
        "name": "level-1-2",
        "type": "link"
      }
    ],
    "permissions": {
      "only": "ADMIN"
    }
  }
]

// const menu: Menu[] = [
//   {
//     "route": "dashboard",
//     "name": "dashboard",
//     "type": "link",
//     "icon": "dashboard",
//     "badge": {
//       "color": "red-50",
//       "value": "5"
//     }
//   },
//   {
//     "route": "design",
//     "name": "design",
//     "type": "sub",
//     "icon": "color_lens",
//     "label": {
//       "color": "azure-50",
//       "value": "New"
//     },
//     "children": [
//       {
//         "route": "colors",
//         "name": "colors",
//         "type": "link",
//       },
//       {
//         "route": "icons",
//         "name": "icons",
//         "type": "link",
//       }
//     ],
//     "permissions": {
//       "only": [
//         "ADMIN",
//         "MANAGER"
//       ]
//     }
//   },
//   {
//     "route": "material",
//     "name": "material",
//     "type": "sub",
//     "icon": "favorite",
//     "children": [
//       {
//         "route": "",
//         "name": "form-controls",
//         "type": "sub",
//         "children": [
//           {
//             "route": "autocomplete",
//             "name": "autocomplete",
//             "type": "link"
//           },
//           {
//             "route": "checkbox",
//             "name": "checkbox",
//             "type": "link"
//           },
//           {
//             "route": "datepicker",
//             "name": "datepicker",
//             "type": "link"
//           },
//           {
//             "route": "form-field",
//             "name": "form-field",
//             "type": "link"
//           },
//           {
//             "route": "input",
//             "name": "input",
//             "type": "link"
//           },
//           {
//             "route": "radio",
//             "name": "radio",
//             "type": "link"
//           },
//           {
//             "route": "select",
//             "name": "select",
//             "type": "link"
//           },
//           {
//             "route": "slider",
//             "name": "slider",
//             "type": "link"
//           },
//           {
//             "route": "slide-toggle",
//             "name": "slide-toggle",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "",
//         "name": "navigation",
//         "type": "sub",
//         "children": [
//           {
//             "route": "menu",
//             "name": "menu",
//             "type": "link"
//           },
//           {
//             "route": "sidenav",
//             "name": "sidenav",
//             "type": "link"
//           },
//           {
//             "route": "toolbar",
//             "name": "toolbar",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "",
//         "name": "layout",
//         "type": "sub",
//         "children": [
//           {
//             "route": "card",
//             "name": "card",
//             "type": "link"
//           },
//           {
//             "route": "divider",
//             "name": "divider",
//             "type": "link"
//           },
//           {
//             "route": "expansion",
//             "name": "expansion",
//             "type": "link"
//           },
//           {
//             "route": "grid-list",
//             "name": "grid-list",
//             "type": "link"
//           },
//           {
//             "route": "list",
//             "name": "list",
//             "type": "link"
//           },
//           {
//             "route": "stepper",
//             "name": "stepper",
//             "type": "link"
//           },
//           {
//             "route": "tab",
//             "name": "tab",
//             "type": "link"
//           },
//           {
//             "route": "tree",
//             "name": "tree",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "",
//         "name": "buttons-indicators",
//         "type": "sub",
//         "children": [
//           {
//             "route": "button",
//             "name": "button",
//             "type": "link"
//           },
//           {
//             "route": "button-toggle",
//             "name": "button-toggle",
//             "type": "link"
//           },
//           {
//             "route": "badge",
//             "name": "badge",
//             "type": "link"
//           },
//           {
//             "route": "chips",
//             "name": "chips",
//             "type": "link"
//           },
//           {
//             "route": "icon",
//             "name": "icon",
//             "type": "link"
//           },
//           {
//             "route": "progress-spinner",
//             "name": "progress-spinner",
//             "type": "link"
//           },
//           {
//             "route": "progress-bar",
//             "name": "progress-bar",
//             "type": "link"
//           },
//           {
//             "route": "ripple",
//             "name": "ripple",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "",
//         "name": "popups-modals",
//         "type": "sub",
//         "children": [
//           {
//             "route": "bottom-sheet",
//             "name": "bottom-sheet",
//             "type": "link"
//           },
//           {
//             "route": "dialog",
//             "name": "dialog",
//             "type": "link"
//           },
//           {
//             "route": "snack-bar",
//             "name": "snackbar",
//             "type": "link"
//           },
//           {
//             "route": "tooltip",
//             "name": "tooltip",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "data-table",
//         "name": "data-table",
//         "type": "sub",
//         "children": [
//           {
//             "route": "paginator",
//             "name": "paginator",
//             "type": "link"
//           },
//           {
//             "route": "sort",
//             "name": "sort",
//             "type": "link"
//           },
//           {
//             "route": "table",
//             "name": "table",
//             "type": "link"
//           }
//         ]
//       }
//     ],
//     "permissions": {
//       "except": [
//         "MANAGER",
//         "GUEST"
//       ]
//     }
//   },
//   {
//     "route": "permissions",
//     "name": "permissions",
//     "type": "sub",
//     "icon": "lock",
//     "children": [
//       {
//         "route": "role-switching",
//         "name": "role-switching",
//         "type": "link"
//       },
//       {
//         "route": "route-guard",
//         "name": "route-guard",
//         "type": "link",
//         "permissions": {
//           "except": "GUEST"
//         }
//       },
//       {
//         "route": "test",
//         "name": "test",
//         "type": "link",
//         "permissions": {
//           "only": "ADMIN"
//         }
//       }
//     ]
//   },
//   {
//     "route": "media",
//     "name": "media",
//     "type": "sub",
//     "icon": "image",
//     "children": [
//       {
//         "route": "gallery",
//         "name": "gallery",
//         "type": "link"
//       }
//     ]
//   },
//   {
//     "route": "forms",
//     "name": "forms",
//     "type": "sub",
//     "icon": "description",
//     "children": [
//       {
//         "route": "elements",
//         "name": "form-elements",
//         "type": "link"
//       },
//       {
//         "route": "dynamic",
//         "name": "dynamic-form",
//         "type": "link"
//       },
//       {
//         "route": "select",
//         "name": "select",
//         "type": "link"
//       },
//       {
//         "route": "datetime",
//         "name": "datetime",
//         "type": "link"
//       }
//     ],
//     "permissions": {
//       "except": "GUEST"
//     }
//   },
//   {
//     "route": "tables",
//     "name": "tables",
//     "type": "sub",
//     "icon": "format_line_spacing",
//     "children": [
//       {
//         "route": "kitchen-sink",
//         "name": "kitchen-sink",
//         "type": "link"
//       },
//       {
//         "route": "remote-data",
//         "name": "remote-data",
//         "type": "link"
//       }
//     ],
//     "permissions": {
//       "except": "GUEST"
//     }
//   },
//   {
//     "route": "profile",
//     "name": "profile",
//     "type": "sub",
//     "icon": "person",
//     "children": [
//       {
//         "route": "overview",
//         "name": "overview",
//         "type": "link"
//       },
//       {
//         "route": "settings",
//         "name": "settings",
//         "type": "link"
//       }
//     ]
//   },
//   {
//     "route": "https://ng-matero.github.io/extensions/",
//     "name": "extensions",
//     "type": "extTabLink",
//     "icon": "extension",
//     "permissions": {
//       "only": "ADMIN"
//     }
//   },
//   {
//     "route": "/",
//     "name": "sessions",
//     "type": "sub",
//     "icon": "question_answer",
//     "children": [
//       {
//         "route": "403",
//         "name": "403",
//         "type": "link"
//       },
//       {
//         "route": "404",
//         "name": "404",
//         "type": "link"
//       },
//       {
//         "route": "500",
//         "name": "500",
//         "type": "link"
//       }
//     ],
//     "permissions": {
//       "only": "ADMIN"
//     }
//   },
//   {
//     "route": ClientRouting.intelligentRetrieval.absolutePath(),
//     "name": "Intelligent Retrieval",
//     "type": "sub",
//     "icon": "search",
//     "children": [
//       {
//         "route": ClientRouting.intelligentRetrieval.children.search.absolutePath(),
//         "name": "Search",
//         "type": "link",
//       },
//       {
//         "route": ClientRouting.intelligentRetrieval.children.upload.absolutePath(),
//         "name": "Upload",
//         "type": "link"
//       }
//     ]
//   },
//   {
//     "route": "menu-level",
//     "name": "menu-level",
//     "type": "sub",
//     "icon": "subject",
//     "children": [
//       {
//         "route": "level-1-1",
//         "name": "level-1-1",
//         "type": "sub",
//         "children": [
//           {
//             "route": "level-2-1",
//             "name": "level-2-1",
//             "type": "sub",
//             "children": [
//               {
//                 "route": "level-3-1",
//                 "name": "level-3-1",
//                 "type": "sub",
//                 "children": [
//                   {
//                     "route": "level-4-1",
//                     "name": "level-4-1",
//                     "type": "sub",
//                     "children": [
//                       {
//                         "route": "level-4-1",
//                         "name": "level-4-1",
//                         "type": "sub",
//                         "children": [
//                           {
//                             "route": "level-4-1",
//                             "name": "level-4-1",
//                             "type": "link"
//                           }
//                         ]
//                       }
//                     ]
//                   }
//                 ]
//               }
//             ]
//           },
//           {
//             "route": "level-2-2",
//             "name": "level-2-2",
//             "type": "link"
//           }
//         ]
//       },
//       {
//         "route": "level-1-2",
//         "name": "level-1-2",
//         "type": "link"
//       }
//     ],
//     "permissions": {
//       "only": "ADMIN"
//     }
//   }
// ]

