import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauComponent, TableauInput } from '@mn/project-one/client/components/tableau';
import { TenantEntity } from '@mn/project-one/shared/api-client';
import { UserEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { ClientRouting } from '@mn/project-one/shared/models';
import { TenantManagementService } from '../../services/tenant-management.service';

@Component({
  selector: 'lib-user-list',
  standalone: true,
  imports: [CommonModule, TableauComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  tableau = new TableauInput<TenantEntity>({
    columns: [
      {
        columnDef: 'name',
        header: $localize`Name`,
        cell: element => element.name,
      },
      {
        columnDef: 'email',
        header: $localize`Email`,
        cell: element => element.email,
      },
      {
        columnDef: 'id',
        header: $localize`I.D`,
        cell: element => element.id,
      },
      {
        columnDef: 'licenses',
        header: $localize`Licenses`,
        cell: element => element.licenses.map(x => x.name).join(','),
      },
    ],
    sortSearch: UserEntitySearchable,
    service: inject(TenantManagementService),
    paginator: {
      pageSize: 100
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
