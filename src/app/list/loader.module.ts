import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListModule } from './list.module';
import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    ListModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
  ],
})
export class ListLoaderModule {
}
