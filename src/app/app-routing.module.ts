import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/lists', pathMatch: 'full' },
  { path: 'lists', loadChildren: './lists/loader.module#ListsLoaderModule' },
  { path: 'list/:id', loadChildren: './list/loader.module#ListLoaderModule' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  declarations: [],
})
export class AppRoutingModule {
}
