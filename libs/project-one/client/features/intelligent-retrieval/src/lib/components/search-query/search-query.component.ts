import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject, input, Input,
  OnDestroy,
  OnInit, output,
  signal,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { mergeMap, Subscription, take, tap } from 'rxjs';
import { IntelligentRetrievalService } from '../../services/intelligent-retrieval.service';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ControlsOfType } from '@mn/project-one/client/models';
import {
  CreateSearchTextQueryRequestDto,
  SearchQueryEntity,
} from '@mn/project-one/shared/api-client';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'lib-intelligent-retrieval-search-query',
  standalone: true,
  imports: [
    CommonModule,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    MatSuffix,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
  ],
  templateUrl: './search-query.component.html',
  styleUrl: './search-query.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchQueryComponent implements OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('auto') autoComplete: MatAutocomplete | undefined;

  enableRouterUpdates = input(true);
  valueUpdated = output<string|null>();

  formGroup = inject(NonNullableFormBuilder).group<
    ControlsOfType<CreateSearchTextQueryRequestDto>
  >({
    query: new FormControl('', {
      nonNullable: true,
    }),
  });

  options = signal<SearchQueryEntity[]>([]);
  filteredOptions = signal<SearchQueryEntity[]>([]);

  // filteredOptions$ = combineLatest([
  //   toObservable(this.options)
  // ]).pipe(
  //   map(([value]) => {
  //     console.log('TEST');
  //     return this._filter(value);
  //   })
  // )

  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _service = inject(IntelligentRetrievalService);
  private _subscriptions = new Subscription();

  constructor() {
    this.formGroup.controls.query.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.submit(false);
      });
  }

  ngOnInit() {
    this._subscriptions.add(
      this._route.queryParamMap
        .pipe(
          take(1),
          mergeMap((queryParamMap) => {
            return this._service.getSearchQueries().pipe(
              tap((entities) => {
                this.options.set(entities);

                if (
                  queryParamMap.has(
                    IntelligentRetrievalService.searchQueryParamName
                  )
                ) {
                  const foundValue = entities.find(
                    (x) =>
                      x.id ===
                      queryParamMap.get(
                        IntelligentRetrievalService.searchQueryParamName
                      )
                  );

                  if (foundValue) {
                    this._updateValue(foundValue);
                  }
                }
              })
            );
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  displayFn(entity: SearchQueryEntity | string | null): string {
    if (entity && typeof entity !== 'string') {
      return entity.originalQuery || '';
    }
    return '';
  }

  test() {
    console.log('test');
  }

  submit(shouldCreateQuery = true) {
    // An invalid form means the user would like to create a new search query
    if (this.input) {
      if (shouldCreateQuery) {
        const query = this.input.nativeElement.value.trim();

        if (query) {
          this._subscriptions.add(
            this._service.createSearchTextQuery({ query }).subscribe({
              next: (value) => {
                this.options.update((searchQueries) => {
                  return [value, ...searchQueries];
                });
                this._updateValue(value);
              },
              error: (err) => {
                // TODO: Display model error
                console.log(err);
              },
            })
          );
        }
        return;
      }

      // Due to the way autocomple and non nullable formbuilder works, this can either be a string or a SearchQueryEntity
      const value = this.formGroup.controls.query.getRawValue() as
        | string
        | null
        | SearchQueryEntity;

      if (value && typeof value !== 'string') {
        this._updateRouterOrSendOutput(value.id);
        this._resetFilterValuesToDefault();
      }

      if (value === null) {
        this._updateRouterOrSendOutput(null);
        // console.log('Removed the searchQuery param');
      }
    }
  }

  private _updateRouterOrSendOutput(value: string | null) {
    if (this.enableRouterUpdates()) {
      this._router.navigate(['./'], {
        relativeTo: this._route,
        queryParams: {
          [IntelligentRetrievalService.searchQueryParamName]: value,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } else {
      this.valueUpdated.emit(value);
    }
  }

  filter() {
    if (this.input) {
      const filterValue = this.input.nativeElement.value.toLowerCase();
      return this.filteredOptions.set(
        this.options().filter((option) =>
          option.lowerCaseQuery?.includes(filterValue)
        )
      );
    }

    return this._resetFilterValuesToDefault();
  }

  private _resetFilterValuesToDefault() {
    this.filteredOptions.set(this.options());
  }
  private _updateValue(value: SearchQueryEntity) {
    this.filteredOptions.update(() => [value]);
    const valueString = value as unknown as string;
    this.formGroup.controls.query.setValue(valueString);
    setTimeout(() => {
      if (this.autoComplete) {
        this.autoComplete.options.first.select();
      }
    }, 0);
  }
}
