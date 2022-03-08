import { formatDate, ViewportScroller } from '@angular/common';
import { ConditionalExpr } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
declare var google: any;
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {


  data: any;
  hide: boolean = false;
  public lat: any;
  placeName: any;
  public lng: any;
  public zoom = '';
  public mapHeight = '';
  currentCenter = { lat: null, lng: null };
  place_id: any;
  mapClickListener: any;
trip:any;
  values: any = [];
  destination = "";
  Addplaces: any = [];
  newArr:any[] =[];
  best: any[] = [];
  range: any;
  startDate: any;
  endDate: any;
  datasource_dates: any;
  dates: any
trip_id:any;
  addresses: any;
  place_ids: any = [];
  scroller: any;
  constructor(private route: ActivatedRoute, scroller: ViewportScroller, private router: Router, private server: ServerService) {
    this.route.params.subscribe(params => {

      this.trip_id = params['id']
      console.log(this.trip_id)
    });


    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

  }
  markers: any[] = [];
  ngOnInit(): void {

    const p: any = localStorage.getItem('plan')
    this.data = JSON.parse(p)

    this.placeName = this.data.placesInfo[0].place_name;
    const placesInfo = this.data.placesInfo
    this.startDate = this.data.startDate
    this.endDate = this.data.endDate

    var date1 = formatDate(new Date(this.startDate), 'yyyy-MM-dd', 'en_US')
    var date2 = formatDate(new Date(this.endDate), 'yyyy-MM-dd', 'en_US')

    this.dates = this.dateRange(date1, date2);

this.getPlaces(placesInfo[0].placeName)
    for (let i = 0; i < placesInfo.length; i++) {
      this.place_id = placesInfo[i].place_id
      const mar = {
        lat: placesInfo[i].location.lat,
        lng: placesInfo[i].location.lng,
        label: placesInfo[i].formatted_address,
        summary: placesInfo[i].summary,
        formatted_address: placesInfo[i].placeaddress,
      }
      this.markers.push(mar)
    }
    this.server.TripById(this.trip_id).subscribe((po:any) => {
this.trip = po
this.best = this.trip.tripObj.placesInfo[0].bestPlaces
if(this.trip.tripObj.itinerary.length > 0){
  this.newArr = po.tripObj.itinerary
  console.log(this.newArr)
}
     else {
       this.newArr =[]
       console.log(this.newArr)
     }
    })
  }
  goDown1() {
    this.scroller.scrollToAnchor("targetRed");
  }
  change() {
    this.searchh()
  }
  public mapReadyHandler(map: any) {

    map.setOptions({
      zoomControl: 'true',
      zoomControlOptions: {
      }
  });
    map.addListener('click', (e: any) => {

    });
  }
  removevalue(i: number) {
    this.values.splice(i, 1);
  }
  addvalue() {
    this.values.push({ value: "" });
  }
  dateRange(startDate: any, endDate: any, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    var converted_dates;
    var date;
    var day;
    var month;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    while (currentDate <= new Date(endDate)) {
      converted_dates = formatDate(new Date(currentDate), 'dd-MMM', 'en_US')
      dateArray.push(converted_dates);
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    var dateArray1 = new Array();
    for (var i in dateArray) {
      date = dateArray[i].split("-")[0]
      month = dateArray[i].split("-")[1].toString();
      day = days[new Date(dateArray[i]).getDay()]
      dateArray1.push({ date, month, day });
    }
    return dateArray1;
  }
  Navigate1() {
    this.router.navigateByUrl(`exploreplaces/${this.trip_id}`);
  }
  searchh() {
    this.server.getPlacesSuggestions(this.destination).subscribe((data: any) => {

      this.addresses = data;
    })
  }
  displayFn(address: any) {
    if (address) {
      return address.description;
    }
  }
  onSelectPlace(address: any, index:any) {
console.log(address,index )
this.destination = address.place_id
this.server.getPlacesdets(this.destination).subscribe((data: any) => {
console.log(data)
  const obj = {
    place_name: data?.name,
    place_photo: data?.photos?.[0],
    address: data?.formatted_address,
    types: data?.types,
    website: data?.website,
    summary: data?.summary,
    ind: index,
  }

this.newArr.push(obj)
console.log(this.newArr)
this.trip.tripObj['itinerary'] = this.newArr
console.log(this.trip)
this.server.postToTrip(this.trip_id, this.trip.tripObj).subscribe((dataa: any) => {
  console.log(dataa)
})


})

  }
  y(address: any) {
    if (this.place_ids.includes(address.place_id)) {

      this.place_ids.splice(this.place_ids.indexOf(address.place_id), 1);
    }
  }
  async getPlaces (placeName:any) {
        (this.server.getMonuments(placeName)).subscribe(
          (data: any) => {

          });
  }
  onClick() {
    if(this.hide) {
      this.hide = false;
    }
    else {
      this.hide = true;
    }
  }
  addPlace(index: any) {

this.server.getPlacesdets(this.destination).subscribe((data: any) => {

  const obj = {
    place_name: data?.name,
    place_photo: data?.photos[0],
    address: data?.formatted_address,
    types: data?.types,
    website: data?.website,
    summary: data?.summary,
    ind: index,
  }
this.newArr.push(obj)
})
  }
}
