import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListsModule } from './lists.module';
import { ListsComponent } from './lists.component';

@NgModule({
  imports: [
    CommonModule,
    ListsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListsComponent,
      },
    ]),
  ],
})
export class ListsLoaderModule {
}
