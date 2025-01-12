import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauComponent, TableauInput } from '@mn/project-one/client/components/tableau';
import { UserEntity } from '@mn/project-one/shared/api-client';
import { UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { ClientRouting } from '@mn/project-one/shared/models';
import { UserService } from '../../services/user.service';
import { ViewerComponent } from './components/viewer/viewer.component';

@Component({
  selector: 'lib-user-list',
  standalone: true,
  imports: [CommonModule, TableauComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  tableau = new TableauInput<UserEntity>({
    idKey: 'publicId',
    columns: [
      {
        columnDef: 'username',
        header: $localize`Username`,
        cell: element => element.username,
        sortable: {
          key: 'username'
        },
        searchable: {
          key: 'username'
        }
      },
      {
        columnDef: 'email',
        header: $localize`Email`,
        cell: element => element.email,
        sortable: {
          key: 'email'
        },
        searchable: {
          key: 'email'
        }
      },
      {
        columnDef: 'enabled',
        header: $localize`Enabled`,
        cell: element => element.enabled ? 'True' : 'False',
        searchable: {
          key: 'enabled'
        }
      },
      {
        columnDef: 'roleName',
        header: $localize`Role`,
        cell: element => element.role.name,
        sortable: {
          key: 'role.name'
        },
        searchable: {
          key: 'role.name'
        }
      },
      {
        columnDef: 'publicId',
        header: $localize`ID`,
        cell: element => element.publicId,
        searchable: {
          key: 'publicId'
        }
      },
    ],
    sortSearch: UserEntitySearchable,
    service: inject(UserService),
    expand: {
      show: true,
      component: ViewerComponent
    },
    paginator: {
      pageSize: 10
    },
    actions: [
      {
        show: () => true,
        title: item => {
          return `View Profile of ${item.username}`
        },
        route: item => ClientRouting.intelligentRetrieval.absolutePath()
      },
    ]
  })
}
