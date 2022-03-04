import { formatDate } from '@angular/common';
import { ConditionalExpr } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

declare var google: any;


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  // @Input() placeName: string = 'Delhi';
  // @Input() date: string = '2022-02-02';
  campaignOne!: FormGroup;
  campaignTwo: FormGroup;
  data: any;
  public lat: any;
  public lng: any;
  public zoom = '';
  public mapHeight = '';
  currentCenter = { lat: null, lng: null };
  place_id: any;
  mapClickListener: any;
  // values = [{value: ""}];
  values: any = [];
  destination = "";
  Addplaces: any = [];
  range: any;
  startDate: any;
  endDate: any;
  datasource_dates: any;
  dates: any
  server: any;
  addresses: any;
  place_ids: any = [];


  constructor(private route: ActivatedRoute, private router: Router) {

    //     this.route.queryParams.subscribe(params => {
    //       this.data = params['data'];
    // console.log(this.data)
    //     })
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19)),
    });
  }

  markers: any[] = [];
  ngOnInit(): void {
    const p: any = localStorage.getItem('plan')
    this.data = JSON.parse(p)
    console.log(this.data)
    const placesInfo = this.data.placesInfo

    this.startDate = this.data.startDate
    this.endDate = this.data.endDate
    console.log(this.startDate);

    var date1 = formatDate(new Date(this.startDate), 'yyyy-MM-dd', 'en_US')
    var date2 = formatDate(new Date(this.endDate), 'yyyy-MM-dd', 'en_US')
    // var date_range = date1 + "-" + date2;
    // alert(date_range)

    this.dates = this.dateRange(date1, date2);
    console.log(this.dates)
    //  alert(this.dates[1].month)
    // this.datasource_dates=JSON.parse(JSON.stringify(dates))

    for (let i = 0; i < placesInfo.length; i++) {
      this.place_id = placesInfo[i].place_id
      const mar = {
        lat: placesInfo[i].location.lat,
        lng: placesInfo[i].location.lng,
        label: placesInfo[i].formatted_address,
        summary: placesInfo[i].summary,
        // formatted_address: placesInfo[i]?.format_address,
      }
      this.markers.push(mar)
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value)),
    );

  }

  change() {
    this.searchh()
  }
  onSelectionChanged(e: any) {
    console.log(e)
  }
  searchh() {
    this.server.getPlacesSuggestions(this.destination).subscribe((data: any) => {
      console.log(data)
      this.addresses = data;
    })
  }
  displayFn(address: any) {
    if (address) {

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
  public mapReadyHandler(map: any) {
    console.log(map)
    map.addListener('click', (e: any) => {
      console.log(e)
    });
  }

  //* note section start here*//
  removevalue(i: number) {
    this.values.splice(i, 1);
  }

  addvalue() {
    this.values.push({ value: "" });
  }
  //* note section end here*//

  //* Add Places section start here*//
  // removePlacesValue(i: number) {
  //   this.Addplaces.splice(i, 1);
  // }

  // addPlacesValue() {
  //   this.Addplaces.push({ value: "" });
  // }
  //* Add Places section end here*//

  //* Add Places dropdown section here*//

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  dateRange(startDate: any, endDate: any, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    var converted_dates;
    var date;
    var month;
    while (currentDate <= new Date(endDate)) {
      converted_dates = formatDate(new Date(currentDate), 'dd-MMM', 'en_US')
      dateArray.push(converted_dates);
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    var dateArray1 = new Array();
    for (var i in dateArray) {
      // var jsonObj = new Object();
      // jsonObj.date = dateArray[i];
      date = dateArray[i].split("-")[0]
      month = dateArray[i].split("-")[1].toString();
      //alert(dateArray[i])
      // alert(temp1)
      // alert(temp2)
      dateArray1.push({ date, month });
    }
    return dateArray1;
  }
}


