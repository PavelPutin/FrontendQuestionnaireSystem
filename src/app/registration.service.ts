import { Injectable } from '@angular/core';
import {RegistrationData} from "./registration/registration-data";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  url = "http://localhost:8080/auth/registration";
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  registerUser(registrationData: RegistrationData) {
    console.log("from register");
    this.http.post(this.url, registrationData)
      .pipe(
        tap(_ => {
          console.log("from register tap");
          localStorage.setItem("username", registrationData.username);
          localStorage.setItem("password", registrationData.password);
          this.authenticationService.authenticate();
        }),
        catchError(this.handleError("register"))
      ).subscribe();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
