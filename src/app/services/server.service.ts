import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(
    private http: HttpClient

  ) {


  }
  private BASE_URL = 'http://localhost:3000/user/';
  private sample_photo_id = 'Aap_uEBLF3KN_DIY00w1ORDNCndNVnZbbt5Y5hGrKAK1L4f5n8Ln1Pq7oJBJcSfORwAcGk8u2Zr8kRKBJyZtFLYIQfbBrS37Z0fBN_ueJPjwipezOnx5BEaXl519BTdQ6G1ydEg_wXJYG7lTL1Yo1UJotkButvErzQeaZQfrrIdhdg2seLfM';
  private sampleWidth = 4000;
  private sampleHeight = 1800
  private API_URL = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${this.sample_photo_id}&maxheight=${this.sampleHeight}&maxwidth=${this.sampleWidth}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`



  getPlacesPhotos(referenceId: string, height: number, width: number) {
    const url = `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${referenceId}&maxheight=${height}&maxwidth=${width}&key=AIzaSyDQ5zkRAqnqlutX6MDp2FgCF8bkRb7oD7Q`

    return this.http.get(url);
  }
  getPlacesSuggestions(placeName: any) {
    const url = this.BASE_URL + 'suggestplace?query=' + placeName;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const req = this.http.get(url, { headers: headers })
    return req
  }
  getPlacesdets(place_id: any) {
    const url = this.BASE_URL + 'placedetails/' + place_id;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const req = this.http.get(url, { headers: headers })
    return req
  }
  TripById(place_id: any) {
    const url = this.BASE_URL + 'tripbyid/' + place_id;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const req = this.http.get(url, { headers: headers })
    return req
  }

firstCall(place_ids:any[]) {
  const url = this.BASE_URL + 'getplan';
  // const token = localStorage.getItem('token')
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  })
  const req = this.http.post(url, JSON.stringify(place_ids), { headers: headers })
  return req

}
  postPlan(ip:any, payload: any) {
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',

    })
    // Authorization: `Bearer ` + token,
    return this.http.post(this.BASE_URL + 'getPlan/'+ip  , JSON.stringify(payload), { headers: headers })
  }
   postToTrip(id:any, obj: any) {
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',

    })
    // Authorization: `Bearer ` + token,
    return this.http.post(this.BASE_URL + 'tripupdate/'+id  , JSON.stringify(obj), { headers: headers })
  }

  getPlaces(placeName: string) {
    const url = this.BASE_URL + 'suggestplace/' + placeName;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(url, { headers: headers })

  }
   getUserByIp(ip: any) {
    const url = this.BASE_URL + 'userbyip/' + ip;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(url, { headers: headers })

  }

   getPlaceById(id: any) {
    const url = this.BASE_URL + 'tripbyid/' + id;
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http.get(url, { headers: headers })

  }

   getSpa(placeName: string) {
    const url = this.BASE_URL + 'textsearch';
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = {
      'text': "Spa in " + placeName
    }
    return  this.http.post(url, body, { headers: headers })

  }
   getMonuments(placeName: string) {
    const url = this.BASE_URL + 'textsearch';
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = {
      'text': "Monuments in " + placeName
    }
    return  this.http.post(url, body, { headers: headers })

  }
   getClubs(placeName: string) {
    const url = this.BASE_URL + 'textsearch';
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = {
      'text': "Clubs in " + placeName
    }
    return this.http.post(url, body, { headers: headers })

  }
   getCafes(placeName: string) {
    const url = this.BASE_URL + 'textsearch';
    // const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    const body = {
      'text': "Cafes in " + placeName
    }
    return  this.http.post(url, body, { headers: headers })

  }

}
