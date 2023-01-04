import { Injectable } from '@angular/core';
import {GeoJSON} from 'geojson'
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LatLng } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class ShortestPathService {
  constructor(private http: HttpClient) {}
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
  getShortestPath(
    departure: LatLng,
    arrival: LatLng
  ): Observable<GeoJSON> {
    const backUrl = 'http://localhost:12345/shortest_path';
    const options = {
      params: new HttpParams()
        .set('depLat', departure.lat)
        .set('depLong', departure.lng)
        .set('arrLat', arrival.lat)
        .set('arrLong', arrival.lng),
    };
    return this.http
      .get<GeoJSON>(backUrl, options)
      .pipe(catchError(this.handleError));
  }
}
