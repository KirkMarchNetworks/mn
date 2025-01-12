import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import { DataComponentInterface } from '@mn/project-one/client/components/tableau';
import { UserEntity } from '@mn/project-one/shared/api-client';

@Component({
  selector: 'lib-user-list-viewer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatTooltipModule],
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewerComponent implements DataComponentInterface<UserEntity> {
  @Input({ required: true }) data!: UserEntity;
}
