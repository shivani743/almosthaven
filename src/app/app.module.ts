import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { InterceptorService } from './core/services/http/interceptor.service';
import { LocalStorageService } from './core/services/storage/local-storage.service';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { FlightComponent } from './flight/flight.component';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';
const message = ['Plan your trips with YippieGo','Get the best experience with Yippiego','YippieGo is the best travel app'];
const configLoading: NgxUiLoaderConfig = {

  fgsSize: 50,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounceParty,
  fgsType: SPINNER.rectangleBounceParty, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness

  text: message[Math.floor(Math.random()*message.length)],


  // logoUrl: "../assets/images/logo/logo-1.png",



};
@NgModule({
  imports: [
    BrowserModule,
    NgxUiLoaderModule,
    CoreModule.forRoot(),
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    NgxUiLoaderModule.forRoot(configLoading),

    NgxUiLoaderRouterModule,

    NgxUiLoaderHttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    })
  ],


  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FlightComponent,
  ],

  exports: [
    MatChipsModule,
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },

    LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
