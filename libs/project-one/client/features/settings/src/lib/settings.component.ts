import { Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreUiProps, CoreUiRepo } from '@mn/project-one/client/repos/core-ui';
import { MatRadioModule } from '@angular/material/radio';
import type { ControlsOfType } from '@mn/project-one/client/models';

@Component({
  selector: 'lib-project-one-client-settings',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatRadioModule,
    ReactiveFormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly coreUiRepo = inject(CoreUiRepo);
  private readonly fb = inject(NonNullableFormBuilder);

  themeOptions = this.coreUiRepo.getThemeOptions();
  themeFormControl = new FormControl<CoreUiProps['theme']>(this.coreUiRepo.getTheme(), {
    nonNullable: true
  });

  directionOptions = this.coreUiRepo.getDirectionOptions();
  directionFormControl = new FormControl<CoreUiProps['direction']>(this.coreUiRepo.getDirection(), {
    nonNullable: true
  });

  sidenavOptions = this.coreUiRepo.getLayout();
  sidenavNavPositionSide: CoreUiProps['layout']['navigation']['position'] = 'side';
  sidenavNavPositionTop: CoreUiProps['layout']['navigation']['position'] = 'top';

  headerPositionFixed: CoreUiProps['layout']['header']['position'] = 'fixed';
  headerPositionStatic: CoreUiProps['layout']['header']['position'] = 'static';
  headerPositionAbove: CoreUiProps['layout']['header']['position'] = 'above';

  layoutHeaderFormGroup = this.fb.group<ControlsOfType<CoreUiProps['layout']['header']>>({
    visible: new FormControl(this.sidenavOptions.header.visible, {
      nonNullable: true,
    }),
    position: new FormControl(this.sidenavOptions.header.position, {
      nonNullable: true,
    }),
  });

  layoutNavigationFormGroup = this.fb.group<ControlsOfType<CoreUiProps['layout']['navigation']>>({
    position: new FormControl(this.sidenavOptions.navigation.position, {
      nonNullable: true,
    }),
    showUserPanel: new FormControl(this.sidenavOptions.navigation.showUserPanel, {
      nonNullable: true,
    }),
    allowMultipleExpanded: new FormControl(this.sidenavOptions.navigation.allowMultipleExpanded, {
      nonNullable: true,
    }),
  });

  constructor() {
    this.themeFormControl.valueChanges.subscribe(theme => {
      this.coreUiRepo.updateTheme(theme)
    });

    this.directionFormControl.valueChanges.subscribe(direction => {
      this.coreUiRepo.updateDirection(direction);
    });

    this.layoutHeaderFormGroup.valueChanges.subscribe(() => {
      this.coreUiRepo.updateLayoutHeader(this.layoutHeaderFormGroup.getRawValue());
    });

    this.layoutNavigationFormGroup.valueChanges.subscribe(() => {
      this.coreUiRepo.updateLayoutNavigation(this.layoutNavigationFormGroup.getRawValue());
    });

    // this.sidenavFormGroup.controls.allowMultipleExpanded.valueChanges.subscribe(allowMultipleExpanded => {
    //   this.coreUiRepo.updateSidenavOptions(allowMultipleExpanded);
    // });
  }
}
