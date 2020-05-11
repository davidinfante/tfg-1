import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {NotFoundComponent} from './not-found/not-found.component';

const routes: Routes = [
  { path: '**', component: NotFoundComponent}, // 404 component
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }