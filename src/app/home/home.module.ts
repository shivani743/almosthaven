import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

//Angular Material Components
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // GooglePlaceModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule

  ],
  declarations: [
    HomeComponent
  ],

})
export class HomeModule { }
