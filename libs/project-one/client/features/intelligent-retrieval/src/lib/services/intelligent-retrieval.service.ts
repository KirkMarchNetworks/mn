import { inject, Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import {
  FindAllParamsInterface,
  TableauBaseService,
} from '@mn/project-one/client/components/tableau';
import {
  ChannelImageWithDistanceEntity,
  CreateSearchTextQueryRequestDto,
  GenerativeModelEnum,
  IntelligentRetrievalApiService, IntelligentRetrievalSearchQueryApiService, IntelligentRetrievalSettingsApiService,
  UpdateSettingsRequestDto
} from '@mn/project-one/shared/api-client';
import { withPagination } from '@ngneat/elf-pagination';
import { EMPTY, map, mergeMap, Observable, of, take, tap } from 'rxjs';
import { DialogService } from '@mn/project-one/client/services/dialog';
import { TagTypeEnum } from '@mn/project-one/client/components/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class IntelligentRetrievalService extends TableauBaseService<ChannelImageWithDistanceEntity> {
  static searchQueryParamName = 'searchQuery';

  private _dialogService = inject(DialogService);
  private _apiService = inject(IntelligentRetrievalApiService);
  private _searchQueryService = inject(IntelligentRetrievalSearchQueryApiService);
  private _settingsService = inject(IntelligentRetrievalSettingsApiService);

  private store;

  constructor(private service: IntelligentRetrievalApiService) {
    const store = createStore(
      { name: 'channelImages' },
      withEntities<ChannelImageWithDistanceEntity>(),
      withPagination({ initialPage: 0 }),
      withProps<{ generativeModel: GenerativeModelEnum | null }>({
        generativeModel: null,
      })
    );

    const findAll = (params: FindAllParamsInterface) => {
      const { take, skip, sort, search } = params;

      let searchQuery = '';

      if (params[IntelligentRetrievalService.searchQueryParamName]) {
        searchQuery = params[
          IntelligentRetrievalService.searchQueryParamName
        ] as string;
      }

      return service.intelligentRetrievalControllerFindAll(
        searchQuery,
        take,
        skip,
        sort,
        search
      );
    };

    super({
      store,
      findAll,
    });

    this.store = store;
  }

  getGenerativeModel$ = () =>
    this.store.pipe(select((state) => state.generativeModel));

  getSearchQueries() {
    return this._searchQueryService.searchQueryControllerGetSearchQueries();
  }

  createSearchTextQuery(dto: CreateSearchTextQueryRequestDto) {
    return this._searchQueryService.searchQueryControllerCreate(
      dto
    );
  }

  private _blobToBase64(blob: Blob) {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
    });
  }

  getImageDataUrl(fileName: string): Observable<string> {
    return this._apiService
      .intelligentRetrievalControllerGetImage(fileName)
      .pipe(mergeMap((blob) => this._blobToBase64(blob)));
  }

  getSettings() {
    return this.getGenerativeModel$().pipe(
      take(1),
      mergeMap((generativeModel) => {
        if (!generativeModel) {
          return this._settingsService
            .settingsControllerGetSettings()
            .pipe(
              map((settings) => {
                this.store.update((state) => ({
                  ...state,
                  generativeModel: settings.generativeModel,
                }));
                return settings.generativeModel;
              })
            );
        }
        return of(generativeModel);
      })
    );
  }

  upsertSettings(dto: UpdateSettingsRequestDto) {
    return this._apiService.intelligentRetrievalControllerGetImageCount().pipe(
      mergeMap((count) =>
        this._dialogService.customConfirmation({
          message: [
            {
              tagType: TagTypeEnum.Paragraph,
              tagValue: `You will need to vectorize ${count} images with this new model and it'll cost you $, are you sure you'd like to continue?`
            },
          ],
        })
      ),
      mergeMap(shouldUpdate => {
        if (shouldUpdate) {
          return this._upsertSettings(dto)
        }
        return EMPTY;
      })
    );
  }

  private _upsertSettings(dto: UpdateSettingsRequestDto) {
    return this._settingsService
      .settingsControllerUpsertSettings(dto)
      .pipe(
        tap((settings) => {
          this.store.update((state) => ({
            ...state,
            generativeModel: settings.generativeModel,
          }));
        })
      );
  }
}
