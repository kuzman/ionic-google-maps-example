import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, Platform } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  LatLng,
  GoogleMapOptions,
  MarkerOptions,
  Marker
} from '@ionic-native/google-maps';

interface Item {
  lat: Number;
  lng: Number;
}

interface Items extends Array<Item>{}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public map: GoogleMap;
  public mapRendered: Boolean = false;

  constructor(public navCtrl: NavController, private platform: Platform, public http: HttpClient) {
    this.platform.ready().then(() => {
      this.loadMap();
    });
  }

  loadMap() {
    const element: HTMLElement = document.getElementById('map');
    const mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 48.859489,
          lng: 2.320582
        },
        tilt: 20,
        zoom: 14,
      },
      controls: {
        zoom: true,
        compass: false,
        myLocationButton: true,
        indoorPicker: false
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true,
      },
      styles: [],
      preferences: {
        zoom: {
            minZoom: 11
        },
        building: true,
      }
    };

    this.map = GoogleMaps.create(element, mapOptions);

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready');
      this.mapRendered = true;
      this.loadMarkers();
    });
  }

  loadMarkers() {
    this.http.get<Items>('./assets/data/data.json')
      .subscribe(data => {
        data.forEach(item => this.createMarkers(item));
      });
  }

  createMarkers(item) {
    const pos: LatLng = new LatLng(item.lat, item.lng);
    const markerOptions: MarkerOptions = {
      title: 'Markers',
      icon: 'blue',
      animation: 'DROP',
      position: pos
    };
    this.map.addMarker(markerOptions)
      .then((marker: Marker) => {
        console.log('Marker Added');
      });

  }

}
