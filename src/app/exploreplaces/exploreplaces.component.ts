import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ServerService } from '../services/server.service';


@Component({
  selector: 'app-exploreplaces',
  templateUrl: './exploreplaces.component.html',
  styleUrls: ['./exploreplaces.component.scss']
})
export class ExploreplacesComponent implements OnInit {
    constructor(private route: ActivatedRoute, private router: Router, private server: ServerService) {}
    public trip_id:any
    placeName:any;
      lat = 22.4064172;
  long = 69.0750171;
  zoom=7;

  markers:any = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params,"Saty")
      this.trip_id = params['id']
    });



    this.server.getPlaceById(this.trip_id).subscribe((data: any) => {
      console.log(data)
      const pla = data.tripObj.placesInfo[0].formatted_address
      this.placeName = pla
      console.log(this.placeName)

    });

    (this.server.getClubs(this.placeName)).subscribe(
      (data: any) => {
        console.log(data)
        for (let index = 0; index < data.length; index++) {

          const element = data[index];
          const mar = {
            lat: element.coordinates.lat,
            lng: element.coordinates.lng,
            label: element.formatted_address,

          }
          console.log(mar)
          this.markers.push(mar)
        }

      });

      (this.server.getCafes(this.placeName)).subscribe(
        (data: any) => {
          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            const mar = {
              lat: element.coordinates.lat,
              lng: element.coordinates.lng,
              label: element.formatted_address,

            }
            this.markers.push(mar)
          }

        });

        (this.server.getMonuments(this.placeName)).subscribe(
          (data: any) => {
            for (let index = 0; index < data.length; index++) {
              const element = data[index];
              const mar = {
                lat: element.coordinates.lat,
                lng: element.coordinates.lng,
                label: element.formatted_address,

              }
              this.markers.push(mar)
            }

          });
          (this.server.getSpa(this.placeName)).subscribe(
            (data: any) => {
              for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const mar = {
                  lat: element.coordinates.lat,
                  lng: element.coordinates.lng,
                  label: element.formatted_address,

                }
                this.markers.push(mar)
              }

            });

  }

  backplace() {
    this.router.navigateByUrl("places");
  }
}
