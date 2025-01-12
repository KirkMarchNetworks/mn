import { CdkDrag, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MtxDrawer,
  MtxDrawerModule,
  MtxDrawerRef,
} from '@ng-matero/extensions/drawer';
import { CoreUiRepo } from '@mn/project-one/client/repos/core-ui';

@Component({
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrl: './customizer.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CdkDrag,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MtxDrawerModule,
  ],
})
export class CustomizerComponent {
  @Output() optionsChange = new EventEmitter<any>();

  private readonly coreUiRepo = inject(CoreUiRepo);
  private readonly drawer = inject(MtxDrawer);
  private readonly fb = inject(FormBuilder);

  private dragging = false;

  private drawerRef?: MtxDrawerRef;

  onDragStart(event: CdkDragStart) {
    this.dragging = true;
  }

  openPanel(templateRef: TemplateRef<any>) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }

    const direction = this.coreUiRepo.getDirection();
    this.drawerRef = this.drawer.open(templateRef, {
      position: direction === 'rtl' ? 'left' : 'right',
      width: '320px',
    });

    this.drawerRef.afterOpened().subscribe(() => {
      console.log('Drawer is open.');
    });

    this.drawerRef.afterDismissed().subscribe(() => {
      console.log('Drawer is closed.');
    });
  }
}
