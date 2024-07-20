// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface FlightInfoPayload {
  airline: string;
  arrivalDate: string;
  arrivalTime: string;
  flightNumber: string;
  numOfGuests: number;
  comments?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.api.url;
  private headers = new HttpHeaders(environment.api.headers);

  constructor(private http: HttpClient) {}

  submitFlightInfo(payload: FlightInfoPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload, { headers: this.headers }).pipe(
      tap((response) => console.log('Response:', response)),
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }
}
