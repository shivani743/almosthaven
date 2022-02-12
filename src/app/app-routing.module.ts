import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlacesComponent } from './places/places.component';
import { ExploreplacesComponent } from './exploreplaces/exploreplaces.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)

  },
  {
    path: 'places',
    loadChildren: () => import('./places/places.module').then(m => m.PlacesModule)

  },
  {
    path: 'exploreplaces',
    loadChildren: () => import('./exploreplaces/exploreplaces.module').then(m => m.PlacesModule)

  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
