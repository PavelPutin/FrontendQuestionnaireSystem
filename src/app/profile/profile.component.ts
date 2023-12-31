import {Component, inject} from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {User} from "../user";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserService} from "../user.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CountryService} from "../country.service";
import {Country} from "../country";
import {catchError, Observable, of, tap} from "rxjs";
import {Questionnaire} from "../questionnaire";
import {QuestionnaireService} from "../questionnaire.service";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {PaginatedQuestionnaires} from "../paginated-questionnaires";
import {CookieService} from "../cookie.service";
import {QuestionnaireCreationComponent} from "../questionnaire-creation/questionnaire-creation.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    RouterLink,
    NgIf,
    QuestionnaireCreationComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  countryService: CountryService = inject(CountryService);
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  cookieService: CookieService = inject(CookieService);
  auth: AuthenticationService = inject(AuthenticationService);

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
  questionnaires: QuestionnaireBrief[] = [];
  selected: Questionnaire | undefined;
  paginationLabels: string[] = [];
  creation = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.auth.authenticate()
      .pipe<User | undefined>(
        catchError(this.handleError("open profile", undefined))
      ).subscribe(user => {
        this.user = user;

        if (typeof user !== "undefined") {
          // @ts-ignore
          this.maritalStatus = this.internalizationMaritalStatus[user.gender][user.maritalStatus];
          this.setDefaultFormControlsValue();
        }

        let pageNumber = this.setPageNumber();
        this.getQuestionnaires(pageNumber);

        this.countryService.getCountries().subscribe(countries => {
          this.countries = countries;
        })
    });
  }

  getQuestionnaires(pageNumber: number) {
    this.cookieService.setCookie("profilePageNumber", pageNumber.toString());
    this.questionnaireService.getQuestionnaires(
      pageNumber,
      undefined,
      this.user?.username
    ).then((questionnaires: PaginatedQuestionnaires) => {
      this.questionnaires = questionnaires.briefDTOList;
      this.paginationLabels = this.updatePaginationLabels(questionnaires);
    });
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
    this.setDefaultFormControlsValue();
  }

  onCreated() {
    this.creation = false;
    let pageNumber = this.setPageNumber();
    this.getQuestionnaires(pageNumber);
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
    if (typeof this.user !== "undefined") {
      this.userService.updateUser(this.user.id, {
        age: Number(this.editProfileForm.value.age),
        gender: this.editProfileForm.value.gender,
        maritalStatus: this.editProfileForm.value.maritalStatus,
        country: this.editProfileForm.value.country
      }).pipe(tap(user => {
        this.isEditing = false;
      })).subscribe(_ => {
        this.auth.authenticate()
          .subscribe(user => {
            this.user = user;
            if (typeof user !== "undefined") {
              // @ts-ignore
              this.maritalStatus = this.internalizationMaritalStatus[user.gender][user.maritalStatus];
              this.setDefaultFormControlsValue();
            }
          });
      });
    }
  }

  select(questionnaire: QuestionnaireBrief) {
    this.questionnaireService.getQuestionnaireById(questionnaire.id).then(result => {
      this.selected = result;
    })
  }

  startCreation() {
    this.creation = true;
  }

  cancelCreation() {
    this.creation = false;
  }

  delete(uuid: string) {
    this.questionnaireService.delete(uuid)
      .pipe(
        tap(_ => {
          this.selected = undefined;
          let pageNumber = this.setPageNumber();
          this.getQuestionnaires(pageNumber);
        })
      ).subscribe();
  }

  private updatePaginationLabels(questionnaires: PaginatedQuestionnaires): string[] {
    let paginationLabels: string[] = [];
    if (questionnaires.number < 5) {
      for (let i = 1; i <= 5 && i <= questionnaires.totalPages; i++) {
        paginationLabels[i - 1] = i + '';
      }
    }
    return paginationLabels;
  }

  protected readonly Number = Number;

  private setPageNumber(): number {
    let pageNumber = Number(this.cookieService.getCookie("profilePageNumber"));
    if (isNaN(pageNumber)) {
      pageNumber = 0;
      this.cookieService.setCookie("profilePageNumber", "0");
    }
    return pageNumber;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.router.navigateByUrl("/login").then();
      return of(result as T);
    }
  }
}
