import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule, MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OvniGamesModule } from '@ovnigames/framework';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ListComponent,
  ],
  exports: [
    ListComponent,
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDatetimeModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDatetimepickerModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    OvniGamesModule,
    MatAutocompleteModule,
    MatIconModule,
    RouterModule,
  ],
})
export class ListModule {
}
