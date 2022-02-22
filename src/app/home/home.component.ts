import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerService } from '../services/server.service';
import { v4 as uuidv4 } from 'uuid';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
declare var google: any;

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
// import {MatChipInputEvent} from '@angular/material';

export interface Fruit {
  name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  destination: any;
  addresses: any;
  place_ids: any = [];
  startDate: any;
  endDate: any;
  resp: any;
  campaignOne!: FormGroup;
  datee: any;



  // visible = true;
  // selectable = true;
  // removable = true;
  // addOnBlur = true;
  // readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // fruits: Fruit[] = [
  //   {name: 'Lemon'},
  //   {name: 'Lime'},
  //   {name: 'Apple'},
  // ];




  constructor(private route: ActivatedRoute, private router: Router, private server: ServerService) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.campaignOne = new FormGroup({
      start: new FormControl(''),
      end: new FormControl(''),
    });

  }
  ngOnInit() {
    // this.searchh()
    console.log(this.campaignOne)

  }
  start(type: any, e: any) {

    this.startDate = new Date(e.value);

  }
  end(type: any, e: any) {
    this.endDate = new Date(e.value);

  }
  change() {

    this.searchh()

  }
  onSelectionChanged (e: any) {
console.log(e)
  }
  searchh() {
    this.server.getPlacesSuggestions(this.destination).subscribe((data: any) => {
      console.log(data)
      this.addresses = data;
    })
  }
displayFn(address:any) {
  if(address){

  return address.description;
  }
}

  onSelectPlace(address: any) {
console.log(address)
    if (this.place_ids.length == 0) {
      this.place_ids.push(address.place_id);
    } else {
      if (this.place_ids.includes(address.place_id)) {
        console.log('found');
        // this.place_ids.splice(this.place_ids.indexOf(id), 1);
      } else {
        console.log('not found');
        this.place_ids.push(address.place_id);
      }
    }
    console.log(this.place_ids);
  }
  y(address: any) {
    if (this.place_ids.includes(address.place_id)) {
      console.log('found');
      this.place_ids.splice(this.place_ids.indexOf(address.place_id), 1);
    }
  }
  getPlan() {

const myId = uuidv4();
console.log(myId)
    if (this.startDate != null || this.startDate != undefined || this.startDate != '' ||
      this.endDate != null || this.endDate != undefined || this.endDate != '') {
      const payload = {
        "startDate": this.startDate,
        "endDate": this.endDate,
        "place_ids": this.place_ids
      }
      this.server.postPlan(payload).subscribe((res) => {
        this.resp = res;
console.log(res)
        localStorage.setItem('plan', JSON.stringify(this.resp));
        this.router.navigate([`/places`]);
      }),
        (err: any) => {
          console.log(err)
        }
    } else {
      alert("Enter start Date or End Date")
    }
  }





  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.fruits.push({name: value.trim()});
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  // remove(fruit: Fruit): void {
  //   const index = this.fruits.indexOf(fruit);

  //   if (index >= 0) {
  //     this.fruits.splice(index, 1);
  //   }
  // }
}
