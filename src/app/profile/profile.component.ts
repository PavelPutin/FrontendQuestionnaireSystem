import {Component, inject} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {User} from "../user";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  user: User | undefined;
  maritalStatus: string = "";
  internalizationMaritalStatus = {
    "male": {
      married: 'женат',
      divorced: 'разведён',
      was_not_married: 'не был женат'
    },
    "female": {
      married: 'замужем',
      divorced: 'разведёна',
      was_not_married: 'не был замужем'
    }
  }

  constructor(private userService: UserService) {
    let userId = this.route.snapshot.params['id'];
    this.userService.getById(userId).subscribe(user => {
      this.user = user;
      if (typeof user !== "undefined") {
        // @ts-ignore
        this.maritalStatus = this.internalizationMaritalStatus[user.gender][user.maritalStatus];
      }
    });
  }

  ngOnInit() {

  }
}
