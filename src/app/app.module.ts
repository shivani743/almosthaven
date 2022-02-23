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
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';





@NgModule({
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    AppRoutingModule,
    HomeModule,
    HttpClientModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    })
  ],


  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
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
