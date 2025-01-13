import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import type { ControlsOfType } from '@mn/project-one/client/models';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import {
  GenerativeModelEnum,
  UpdateSettingsRequestDto,
} from '@mn/project-one/shared/api-client';
import { IntelligentRetrievalService } from '../../services/intelligent-retrieval.service';
import { Subscription } from 'rxjs';
import { filterNil } from '@ngneat/elf';

@Component({
  selector: 'lib-project-one-client-intelligent-retrieval-settings',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
  GenerativeModelEnum = GenerativeModelEnum;

  formGroup = inject(NonNullableFormBuilder).group<
    ControlsOfType<UpdateSettingsRequestDto>
  >({
    generativeModel: new FormControl(
      GenerativeModelEnum.AmazonTitanEmbedImageV1,
      {
        nonNullable: true,
      }
    ),
  });

  private _intialValue: GenerativeModelEnum | null = null;
  private readonly service = inject(IntelligentRetrievalService);
  private _subscriptions = new Subscription();

  ngOnInit() {
    this._subscriptions.add(
      this.service
        .getGenerativeModel$()
        .pipe(filterNil())
        .subscribe((value) => {
          this._intialValue = value;
          this.formGroup.patchValue({
            generativeModel: value,
          });
        })
    );
  }

  ngOnDestroy() {
    this._subscriptions.unsubscribe();
  }

  submit() {
    if (this.formGroup.invalid) {
      return;
    }

    const { generativeModel } = this.formGroup.getRawValue();

    if (this._intialValue !== generativeModel) {
      this._subscriptions.add(
        this.service.upsertSettings(this.formGroup.getRawValue()).subscribe()
      );
    }
  }
}
