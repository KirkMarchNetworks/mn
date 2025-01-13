import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableauComponent, TableauInput } from '@mn/project-one/client/components/tableau';
import { ChannelImageWithDistanceEntity } from '@mn/project-one/shared/api-client';
import { ImageComponent } from '../../../search/components/image/image.component';
import { SearchQueryComponent } from '../../../../components/search-query/search-query.component';
import { ChannelImageWithDistanceEntitySearchable } from '@mn/project-one/shared/sort-search-page';
import { IntelligentRetrievalService } from '../../../../services/intelligent-retrieval.service';
import { ClientRouting } from '@mn/project-one/shared/models';

@Component({
  selector: 'lib-list',
  imports: [CommonModule, TableauComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  tableau = new TableauInput<ChannelImageWithDistanceEntity>({
    columns: [
      {
        columnDef: 'id',
        header: $localize`ID`,
        cell: element => element.id,
        limitCellLength: 5,
        hide: true
      },
      {
        columnDef: 'fileName',
        header: $localize`Image`,
        cell: element => element.fileName,
        cellComponent: {
          component: ImageComponent,
          input: element => element.fileName
        }
      },
      {
        columnDef: 'distance',
        header: $localize`Similarity`,
        cell: element => element.timestamp,
        sortable: {
          key: 'distance'
        },
      },
      {
        columnDef: 'timestamp',
        header: $localize`Timestamp`,
        cell: element => element.timestamp,
        searchable: {
          key: 'timestamp'
        }
      },
      {
        columnDef: 'deviceId',
        header: $localize`Device I.D`,
        limitCellLength: 5,
        cell: element => element.channel.device.id,
        sortable: {
          key: 'channel.device.id'
        },
        searchable: {
          key: 'channel.device.id'
        },
        hide: true
      },
      {
        columnDef: 'deviceName',
        header: $localize`Device Name`,
        cell: element => element.channel.device.name,
        searchable: {
          key: 'channel.device.name'
        }
      },
      {
        columnDef: 'channelId',
        header: $localize`Channel I.D`,
        cell: element => element.channel.id,
        limitCellLength: 5,
        showTooltip: element => element.channel.id.length > 5,
        searchable: {
          key: 'channel.id'
        }
      },
      {
        columnDef: 'channelName',
        header: $localize`Channel Name`,
        cell: element => element.channel.name,
        searchable: {
          key: 'channel.name'
        }
      },
    ],
    selection: {
      canSelect: false
    },
    menuItemStart: SearchQueryComponent,
    sortSearch: ChannelImageWithDistanceEntitySearchable,
    service: inject(IntelligentRetrievalService),
    additionalQueryParams: {
      [ IntelligentRetrievalService.searchQueryParamName ]: undefined
    },
    paginator: {
      pageSize: 10
    },
    actions: [
      {
        show: () => true,
        title: item => {
          return `View Profile of`
        },
        route: item => ClientRouting.intelligentRetrieval.absolutePath()
      },
    ]
  })
}