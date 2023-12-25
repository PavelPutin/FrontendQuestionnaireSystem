import {Component, inject} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {NgIf} from "@angular/common";

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
  authenticationService: AuthenticationService = inject(AuthenticationService);

  constructor(private router: Router) {
  }

  logout() {
    this.authenticationService.logout();
  }
}
