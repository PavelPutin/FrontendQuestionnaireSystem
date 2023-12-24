import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {QuestionnaireService} from "../questionnaire.service";
import {Questionnaire} from "../questionnaire";
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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
  questionnaire: Questionnaire | undefined;
  hasAnswered: boolean;
  optionsFormGroup: FormGroup;
  formBuilder: FormBuilder = inject(FormBuilder);
  questionnaireId: string;

  constructor(private router: Router) {
    this.optionsFormGroup = new FormGroup<any>({});
    this.questionnaireId = this.route.snapshot.params['id'];
    this.questionnaireService.getQuestionnaireById(this.questionnaireId).then(questionnaire => {
      this.questionnaire = questionnaire;
      console.log(this.questionnaire?.multiple)
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
    this.hasAnswered = false
    this.questionnaireService.getHasUserAnsweredByQuestionnaireId(this.questionnaireId).then(result => {
      this.hasAnswered = result.result ? result.result : false;
    });
  }

  submitVote() {
    let selected: string[] | string = this.optionsFormGroup.value.options;
    if (typeof selected === "string") {
      selected = [selected];
    }
    this.questionnaireService.vote(this.questionnaireId, selected);
    this.hasAnswered = true;
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
}
