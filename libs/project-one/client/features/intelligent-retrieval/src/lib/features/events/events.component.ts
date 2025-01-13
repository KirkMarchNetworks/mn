import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import type { ControlsOfType } from '@mn/project-one/client/models';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import {
  CreateIntelligentRetrievalEventRequestDto,
  ForgotPasswordRequestDto,
  GenerativeModelEnum,
  UpdateSettingsRequestDto
} from '@mn/project-one/shared/api-client';
import { IntelligentRetrievalService } from '../../services/intelligent-retrieval.service';
import { Subscription } from 'rxjs';
import { filterNil } from '@ngneat/elf';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatSlider, MatSliderModule, MatSliderThumb } from '@angular/material/slider';
import { SearchQueryComponent } from '../../components/search-query/search-query.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-project-one-client-intelligent-retrieval-events',
  standalone: true,
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
    MatSliderModule,
    RouterOutlet,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnDestroy {
  GenerativeModelEnum = GenerativeModelEnum;

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

  private _intialValue: GenerativeModelEnum | null = null;
  private readonly service = inject(IntelligentRetrievalService);
  private _subscriptions = new Subscription();

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    // const { generativeModel } = this.formGroup.getRawValue();
    //
    // if (this._intialValue !== generativeModel) {
    //   this._subscriptions.add(
    //     this.service.updateSettings(this.formGroup.getRawValue()).subscribe()
    //   );
    // }
  }
}
