import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreplacesComponent } from './exploreplaces.component';

const routes: Routes = [
  {
    path: '',
    component: ExploreplacesComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreplacesRoutingModule { }
