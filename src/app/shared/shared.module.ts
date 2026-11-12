import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Base shared components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { AlertMessageComponent } from './components/alert-message/alert-message.component';

// Podman Desktop Design System Components
import {
  PdButtonComponent,
  PdInputComponent,
  PdSelectComponent,
  PdCardComponent,
  PdBadgeComponent,
  PdSearchInputComponent,
  PdPageHeaderComponent,
  PdModalComponent,
  PdEmptyStateComponent,
  PdFormSectionComponent,
} from './components/podman';

const PODMAN_COMPONENTS = [
  PdButtonComponent,
  PdInputComponent,
  PdSelectComponent,
  PdCardComponent,
  PdBadgeComponent,
  PdSearchInputComponent,
  PdPageHeaderComponent,
  PdModalComponent,
  PdEmptyStateComponent,
  PdFormSectionComponent,
];

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertMessageComponent,
    ...PODMAN_COMPONENTS,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    LoadingSpinnerComponent,
    AlertMessageComponent,
    ...PODMAN_COMPONENTS,
  ],
})
export class SharedModule {}
