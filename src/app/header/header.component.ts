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
  user: User | undefined;
  auth: AuthenticationService = inject(AuthenticationService);

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.auth.authenticate().subscribe(user => {
        this.user = user;
    })
  }

  logout() {
    this.auth.logout().subscribe(_ =>
      this.router.navigateByUrl("/").then()
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("can't authenticate");
      console.error(error)
      return of(result as T);
    }
  }
}
