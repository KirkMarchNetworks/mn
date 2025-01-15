import { ChangeDetectionStrategy, Component, inject, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { SearchQueryComponent } from '../../../../components/search-query/search-query.component';
import { MatInput } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import type { ControlsOfType } from '@mn/project-one/client/models';
import { CreateIntelligentRetrievalEventRequestDto } from '@mn/project-one/shared/api-client';
import { IntelligentRetrievalService } from '../../../../services/intelligent-retrieval.service';
import { Subscription } from 'rxjs';
import { IntelligentRetrievalEventService } from '../../services/intelligent-retrieval-event.service';

@Component({
  selector: 'lib-project-one-client-intelligent-retrieval-events-create',
  imports: [
    MatButtonToggleModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    SearchQueryComponent,
    MatError,
    MatInput,
    NgIf,
    MatSliderModule
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateComponent implements OnDestroy {

  private readonly _service = inject(IntelligentRetrievalEventService);
  private readonly _subscriptions = new Subscription();

  formGroup = inject(NonNullableFormBuilder).group<
    ControlsOfType<CreateIntelligentRetrievalEventRequestDto>
  >({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    searchQueryId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    similarityScore: new FormControl(30, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  searchQueryUpdated(value: string|null) {
    this.formGroup.patchValue({
      searchQueryId: value ?? ''
    })
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    this._subscriptions.add(
      this._service.createEvent(this.formGroup.getRawValue()).subscribe()
    );
  }
}
