import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {NgIf} from "@angular/common";
import {User} from "../user";
import {catchError, Observable, of, tap} from "rxjs";

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
      .pipe(
        tap(_ => this.hasAuthenticated = true),
        catchError(this.handleError<User | undefined>("login"))
      ).subscribe(user => {
        this.user = user;
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
