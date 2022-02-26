import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';


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

    for (let i = 0; i < placesInfo.length; i++) {
      this.place_id = placesInfo[i].place_id
      const mar = {
        lat: placesInfo[i].location.lat,
        lng: placesInfo[i].location.lng,
        label: placesInfo[i].formatted_address,
        summary: placesInfo[i].summary,
      }
      this.markers.push(mar)
    }


    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => this._filter(value)),
    );

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
  removePlacesValue(i: number) {
    this.Addplaces.splice(i, 1);
  }

  addPlacesValue() {
    this.Addplaces.push({ value: "" });
  }
  //* Add Places section end here*//

  //* Add Places dropdown section here*//

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  onSelectPlace(data: any) {
    // alert(data)
  }
  change() {
    if (this.destination.trim() != "" && this.destination != null) {
      alert(this.destination)
      this.addPlacesValue();
    }
  }


}


