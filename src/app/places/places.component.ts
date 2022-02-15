import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  // @Input() placeName: string = 'Delhi';
  // @Input() date: string = '2022-02-02';
  data: any;
  public lat: any;
  public lng: any;
  public zoom = '';
  public mapHeight = '';
  currentCenter = { lat: null, lng: null };
  place_id:any;
  map: any;
  mapClickListener: any;
  constructor(private route: ActivatedRoute, private router: Router) {

//     this.route.queryParams.subscribe(params => {
//       this.data = params['data'];
// console.log(this.data)
//     })
  }
  markers: any[] = [];
  ngOnInit(): void {
    const p:any = localStorage.getItem('plan')
    this.data = JSON.parse(p)
    console.log(this.data)
    const placesInfo = this.data.placesInfo

    for (let i = 0; i < placesInfo.length; i++) {
      this.place_id = placesInfo[i].place_id
      const mar = {
        lat: placesInfo[i].location.lat,
        lng: placesInfo[i].location.lng,
        label: placesInfo[i].formatted_address,
        summary: placesInfo[i].summary

      }
      this.markers.push(mar)

    }
  }
  public mapReadyHandler(map: any) {
    console.log(map)
    map.addListener('click', (e: any) => {
      console.log(e)
    });
  }
}
