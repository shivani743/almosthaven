import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-exploreplaces',
  templateUrl: './exploreplaces.component.html',
  styleUrls: ['./exploreplaces.component.scss']
})
export class ExploreplacesComponent implements OnInit {
    
  lat = 22.4064172;
  long = 69.0750171;
  zoom=7;
  
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
  router: any;
  ngOnInit(): void {

  }

  backplace() {
    this.router.navigateByUrl("places");
  }
}
