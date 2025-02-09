import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpRequestService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getRequest(urlRoute: string) {
    return this.http
      .get<any>(this.apiUrl + urlRoute, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .pipe(catchError((error) => this.handleError(error)));
  }

  postRequest(urlRoute: string, data: any) {
    return this.http
      .post<any>(this.apiUrl + urlRoute, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  putRequest(urlRoute: string, data: any) {
    return this.http
      .put<any>(this.apiUrl + urlRoute, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  deleteRequest(urlRoute: string, data: any) {
    return this.http
      .delete<any>(this.apiUrl + urlRoute, data)
      .pipe(catchError((error) => this.handleError(error)));
  }

  // Error handling
  handleError(error: any): Observable<any> {
    let errorMessage = {
      status: false,
      success: false,
      status_code: 500,
      response: '',
      data: [],
      debug: [],
    };
    if (error.error instanceof ErrorEvent) {
      // Get client-side error

      errorMessage = {
        status: false,
        success: false,
        status_code: error.error.status,
        response: error.error.data,
        data: [],
        debug: [],
      };
    } else {
      // Get server-side error
      if (error.status == 401) {
        errorMessage = {
          status: false,
          success: false,
          status_code: 503,
          response: 'Server Unavailable',
          data: [],
          debug: error.error.debug,
        };
      } else if (error.status == 400) {
        errorMessage = {
          status: false,
          success: false,
          status_code: error.status,
          response: error.error.data,
          data: [],
          debug: error.error.debug,
        };
      } else if (error.status == 400) {
        errorMessage = {
          status: false,
          success: false,
          status_code: error.status,
          response: error.error.data,
          data: [],
          debug: error.error.debug,
        };
      } else if (error.status == 405) {
        errorMessage = {
          status: false,
          success: false,
          status_code: error.status,
          response: error.error.data,
          data: [],
          debug: error.error.debug,
        };
      } else {
        errorMessage = {
          status: false,
          success: false,
          status_code: 0,
          response: 'Http Error Response',
          data: [],
          debug: [],
        };
      }
    }

    return throwError(errorMessage);
  }
}
