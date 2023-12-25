import {Component, inject} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {User} from "../user";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../user.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {CountryService} from "../country.service";
import {Country} from "../country";
import {tap} from "rxjs";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  countryService: CountryService = inject(CountryService);
  countries: Country[] = [];
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
  editProfileForm: FormGroup = new FormGroup({
    age: new FormControl(),
    gender: new FormControl(),
    maritalStatus: new FormControl(),
    country: new FormControl()
  });
  isEditing = false;

  constructor(private userService: UserService) {
    let userId = this.route.snapshot.params['id'];
    this.userService.getById(userId).subscribe(user => {
      this.user = user;
      if (typeof user !== "undefined") {
        // @ts-ignore
        this.maritalStatus = this.internalizationMaritalStatus[user.gender][user.maritalStatus];
        this.setDefaultFormControlsValue();
      }
    });
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    })
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.setDefaultFormControlsValue();
  }

  private setDefaultFormControlsValue() {
    if (typeof this.user !== "undefined") {
      this.editProfileForm.controls["age"].setValue(this.user.age);
      this.editProfileForm.controls["gender"].setValue(this.user.gender);
      this.editProfileForm.controls["maritalStatus"].setValue(this.user.maritalStatus);
      this.editProfileForm.controls["country"].setValue(this.user.country?.id);
    }
  }

  submitUpdate() {
    this.isEditing = false;
    if (typeof this.user !== "undefined") {
      this.userService.updateUser(this.user.id, {
        age: Number(this.editProfileForm.value.age),
        gender: this.editProfileForm.value.gender,
        maritalStatus: this.editProfileForm.value.maritalStatus,
        country: this.editProfileForm.value.country
      }).subscribe();
    }
  }
}
