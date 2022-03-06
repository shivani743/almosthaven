import { Component } from '@angular/core';
import { ServerService } from './services/server.service';

import { DeviceDetectorService } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inspi';
  private sampleId = "Aap_uEDAR9L9IRJLWSjOKhTCSsziKeN7BQw7qerqNI2FdQN0pNKNPF5t4c2mdslJocY7Fx3axAUPy7lA8ath9yNBfXi2H8NvZHf33P4YPbWid9Zt6s8tmfVq7Wkf1to813ov5FlNML_G3ZVwN1IOJZAuCVtQIpmZY6kF1qSV050Qo2ZhSaE";
  private height = 480
  private width = 640
  constructor(private server: ServerService, private device: DeviceDetectorService, private http: HttpClient) {

  }
ipaddress:any;
  async ngOnInit() {
    // const res = await this.server.getPlaces('Goa')
    // console.log(res, "saty")
    console.log(this.device.getDeviceInfo())
this.getIPAddress()
  }

  getIPAddress()
  {
    // this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
    //   this.ipaddress = res.ip;
    //   console.log(this.ipaddress)
    // });
  }

}



