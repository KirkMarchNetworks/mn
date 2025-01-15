import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauComponent, TableauInput } from '@mn/project-one/client/components/tableau';
import { IntelligentRetrievalEventEntity } from '@mn/project-one/shared/api-client';
import { IntelligentRetrievalEventEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { ClientRouting } from '@mn/project-one/shared/models';
import { IntelligentRetrievalEventService } from '../../services/intelligent-retrieval-event.service';
import { AddButtonComponent } from './components/add-button.component';

@Component({
  selector: 'lib-list',
  imports: [CommonModule, TableauComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  tableau = new TableauInput<IntelligentRetrievalEventEntity>({
    columns: [
      {
        columnDef: 'id',
        header: $localize`ID`,
        cell: (element) => element.id,
        limitCellLength: 5,
        hide: true,
      },
      {
        columnDef: 'name',
        header: $localize`Name`,
        cell: (element) => element.name,
      },
      {
        columnDef: 'originalQuery',
        header: $localize`Query`,
        cell: (element) => {
          const originalQuery = element.searchQuery.originalQuery;
          if (originalQuery) {
            return originalQuery;
          }
          return '';
        },
        sortable: {
          key: 'searchQuery.originalQuery',
        },
        searchable: {
          key: 'searchQuery.originalQuery',
        },
      },
      {
        columnDef: 'similarityScore',
        header: $localize`Similarity`,
        cell: (element) => element.similarityScore.toString(),
      },
      {
        columnDef: 'createdAt',
        header: $localize`Created At`,
        cell: (element) => element.createdAt,
        hide: true,
      },
    ],
    selection: {
      canSelect: false,
    },
    menuItemStart: AddButtonComponent,
    sortSearch: IntelligentRetrievalEventEntitySearchable,
    service: inject(IntelligentRetrievalEventService),
    paginator: {
      pageSize: 10,
    },
    actions: [
      {
        show: () => true,
        title: (item) => {
          return `View Profile of`;
        },
        route: (item) => ClientRouting.intelligentRetrieval.absolutePath(),
      },
    ],
  });
}
