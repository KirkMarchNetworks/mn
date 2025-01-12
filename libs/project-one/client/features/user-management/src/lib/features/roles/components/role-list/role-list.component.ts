import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauComponent, TableauInput } from '@mn/project-one/client/components/tableau';
import { RoleEntity } from '@mn/project-one/shared/api-client';
import { RoleEntitySearchable, UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { UserService } from '../../../users/services/user.service';
import { ViewerComponent } from '../../../users/components/user-list/components/viewer/viewer.component';
import { ClientRouting } from '@mn/project-one/shared/models';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'lib-role-list',
  standalone: true,
  imports: [CommonModule, TableauComponent],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent {
  tableau = new TableauInput<RoleEntity>({
    columns: [
      {
        columnDef: 'id',
        header: $localize`I.D`,
        cell: element => element.id,
        sortable: {
          key: 'id'
        },
        searchable: {
          key: 'id'
        }
      },
      {
        columnDef: 'name',
        header: $localize`Name`,
        cell: element => element.name,
        sortable: {
          key: 'name'
        },
        searchable: {
          key: 'name'
        }
      },
      {
        columnDef: 'permissions',
        header: $localize`Permissions`,
        cell: element => element.permissions.map(p => p.permissionName).join(', '),
      },
    ],
    sortSearch: RoleEntitySearchable,
    service: inject(RoleService),
    paginator: {
      pageSize: 10
    },
    actions: [
      {
        show: () => true,
        title: item => {
          return `View Profile of ${item.name}`
        },
        route: item => ClientRouting.intelligentRetrieval.absolutePath()
      },
    ]
  })
}
