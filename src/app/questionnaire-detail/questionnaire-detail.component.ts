import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {QuestionnaireService} from "../questionnaire.service";
import {Questionnaire} from "../questionnaire";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthenticationService} from "../authentication.service";
import {catchError, Observable, of} from "rxjs";

@Component({
  selector: 'app-questionnaire-detail',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './questionnaire-detail.component.html',
  styleUrl: './questionnaire-detail.component.css'
})
export class QuestionnaireDetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);
  formBuilder: FormBuilder = inject(FormBuilder);
  auth: AuthenticationService = inject(AuthenticationService);

  questionnaire: Questionnaire | undefined;
  hasAnswered: boolean = false;
  optionsFormGroup: FormGroup;
  questionnaireId: string;

  constructor(private router: Router) {
    this.optionsFormGroup = new FormGroup<any>({});
    this.questionnaireId = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.auth.authenticate()
      .pipe(
        catchError(this.handleError("getQuestionnaireDetails"))
      ).subscribe(_ => {
        this.questionnaireService.getHasUserAnsweredByQuestionnaireId(this.questionnaireId).then(result => {
        this.hasAnswered = result.result ? result.result : false;
        this.questionnaireService.getQuestionnaireById(this.questionnaireId).then(questionnaire => {
          this.questionnaire = questionnaire;
          if (this.questionnaire?.multiple) {
            this.optionsFormGroup = this.formBuilder.group({
              options: this.formBuilder.array([], Validators.required)
            });
          } else {
            this.optionsFormGroup = new FormGroup<any>({
              options: new FormControl()
            });
            if (this.hasAnswered) {
              this.optionsFormGroup.controls["options"].disable();
            }
          }
        });
      });
    });

  }

  submitVote() {
    let selected: string[] | string = this.optionsFormGroup.value.options;
    if (typeof selected === "string") {
      selected = [selected];
    }
    this.questionnaireService.vote(this.questionnaireId, selected).subscribe(_ => {
      this.hasAnswered = true;
    })

  }

  controlOnChange(e: Event) {
    const optionsArray: FormArray = this.optionsFormGroup.get('options') as FormArray;
    // @ts-ignore
    if (e.target.checked) {
      // @ts-ignore
      optionsArray.push(new FormControl(e.target.value));
    } else {
      // @ts-ignore
      const index = options.controls.findIndex(option => option.value === e.target.value);
      optionsArray.removeAt(index);
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.router.navigateByUrl("/login").then();
      return of(result as T);
    }
  }
}
