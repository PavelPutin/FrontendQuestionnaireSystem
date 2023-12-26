import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {NgIf} from "@angular/common";
import {User} from "../user";
import {catchError, Observable, of} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  hasAuthenticated = false;
  user: User | undefined;
  auth: AuthenticationService = inject(AuthenticationService);

  constructor() {
  }

  ngOnInit() {
    this.auth.authenticate()
      .pipe<User | undefined>(
        catchError(this.handleError("login", undefined))
      ).subscribe(user => {
        this.user = user;
        this.hasAuthenticated = true;
    })
  }

  logout() {
    this.auth.logout();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.hasAuthenticated = false;
      return of(result as T);
    }
  }
}
