import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  // @Input() placeName: string = 'Delhi';
  // @Input() date: string = '2022-02-02';
  @Input() data: any;
  public lat = 22.4064172;;
  public lng = 69.0750171;
  public zoom = '4';
  public mapHeight = '';
  currentCenter = { lat: null, lng: null };

  map: any;
  mapClickListener: any;


  
  constructor(private route: ActivatedRoute, private router: Router) {

    // this.route.queryParams.subscribe(params => {
    //   this.placeName = params['placeName'];
    //   this.date = params['date'];
    // })
  }
  markers = [
    {
        lat: 21.1594627,
        lng: 72.6822083,
        label: 'Surat'
    },
    {
        lat: 23.0204978,
        lng: 72.4396548,
        label: 'Ahmedabad'
    },
    {
        lat: 22.2736308,
        lng: 70.7512555,
        label: 'Rajkot'
    }
];
  ngOnInit(): void {

  }
  public mapReadyHandler(map: any) {
    console.log(map)
    map.addListener('click', (e: any) => {
      console.log(e)
    });
  }


}
