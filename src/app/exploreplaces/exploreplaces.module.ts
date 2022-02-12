import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreplacesRoutingModule } from './exploreplaces-routing.module';
import { ExploreplacesComponent } from './exploreplaces.component';
import { AgmCoreModule } from '@agm/core';



@NgModule({
  declarations: [
    ExploreplacesComponent
  ],
  imports: [
    CommonModule,
    ExploreplacesRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    })

  ]
})
export class PlacesModule { }
