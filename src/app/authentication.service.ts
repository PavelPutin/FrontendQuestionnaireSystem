import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, Subscription, tap} from "rxjs";
import {User} from "./user";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  url = "http://localhost:8080/auth/login";

  constructor(private http: HttpClient, private router: Router) {
    this.authenticate();
  }

  authenticate(redirect?: string) {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");

    return this.http.post<User | undefined>(this.url, {username: username, password: password}, {headers: header});
  }

  getHeader(): { authorization: string} {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    return {authorization: "Basic " + btoa(username + ":" + password)};
  }

  logout() {
    return this.http.post("http://localhost:8080/auth/logout", {}, {headers: this.getHeader()})
      .pipe(
        tap(_ => {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        })
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
