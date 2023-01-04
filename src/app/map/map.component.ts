import { Component, AfterViewInit } from '@angular/core';
import { ShortestPathService } from '../shortest-path.service';
import * as L from 'leaflet';
import { GeoJSON } from 'geojson';

class Point {
  private latlng: L.LatLng;
  private marker: L.Marker;
  private color: string;
  constructor(_lat_lng: L.LatLng, color: string) {
    this.color = color;
    this.latlng = _lat_lng;
    this.marker = L.marker(this.latlng, {
      //icon: L.icon({
      //  //iconSize: [25, 41],
      //  //iconAnchor: [13, 0],
      //  iconUrl: './marker-icon.png',
      //  shadowUrl: './marker-shadow.png',
      //}),
      //color: this.color,
      //fillColor: '#f03',
      //fillOpacity: 0.5,
      //radius: 100,
    });
    this.marker.bindPopup('<b>Coordonnées</b><br>' + this.latlng);
  }
  display(map: L.Map) {
    this.marker.addTo(map);
  }
  remove(map: L.Map) {
    this.marker.remove();
  }
  latLng(): L.LatLng {
    return this.latlng;
  }
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined = undefined;
  private departure: Point | undefined = undefined;
  private arrival: Point | undefined = undefined;
  private path: L.GeoJSON | undefined = undefined;
  constructor(private shortestPathService: ShortestPathService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [48.842, 2.385],
      zoom: 14,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 8,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.map.on('click', (e: any) => this.onMapClick(e));
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  computeShortestPath(departure: L.LatLng, arrival: L.LatLng) {
    this.shortestPathService
      .getShortestPath(departure, arrival)
      .subscribe((shortestpath: GeoJSON) => {
        console.log(shortestpath);
        const polylineStyle = {
          color: '#11ee33',
          weight: 5,
          opacity: 0.65,
        };
        this.path = L.geoJSON(shortestpath, { style: polylineStyle });
        if (this.map) {
          this.path.addTo(this.map);
        }
      });
  }
  onMapClick(e: any) {
    const latlng = e.latlng;
    if (!this.map) {
      return;
    }
    if (!this.departure) {
      this.departure = new Point(latlng, 'blue');
      this.departure.display(this.map);
      return;
    }
    if (!this.arrival) {
      this.arrival = new Point(latlng, 'red');
      this.arrival.display(this.map);
      this.computeShortestPath(this.departure.latLng(), this.arrival.latLng());
      return;
    }
    this.departure.remove(this.map);
    this.arrival.remove(this.map);
    this.path?.remove();
    this.path = undefined;
    this.departure = undefined;
    this.arrival = undefined;
    this.onMapClick(e);
  }
}
