import {Component, inject} from '@angular/core';
import {PopularComponent} from "../popular/popular.component";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {QuestionnaireService} from "../questionnaire.service";
import {NgForOf} from "@angular/common";
import {PaginatedQuestionnaires} from "../paginated-questionnaires";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-questionnaire-overview',
  standalone: true,
  imports: [
    PopularComponent,
    ReactiveFormsModule,
    NgForOf,
    RouterLink
  ],
  templateUrl: './questionnaire-overview.component.html',
  styleUrl: './questionnaire-overview.component.css'
})
export class QuestionnaireOverviewComponent {
  questionnaires: QuestionnaireBrief[] = [];
  paginationLabels: string[] = [];
  searchFormGroup = new FormGroup({
    questionnaireNameSearch: new FormControl(),
    authorNameSearch: new FormControl()
  })
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  constructor() {
  }

  ngOnInit() {
    this.getQuestionnaires(0);
  }

  getQuestionnaires(pageNumber: number): void {
    console.log(this.searchFormGroup.value.questionnaireNameSearch);
    console.log(this.searchFormGroup.value.authorNameSearch);
    this.questionnaireService.getQuestionnaires(pageNumber, this.searchFormGroup.value.questionnaireNameSearch, this.searchFormGroup.value.authorNameSearch).then((questionnaires: PaginatedQuestionnaires) => {
      this.questionnaires = questionnaires.briefDTOList;
      this.paginationLabels = this.updatePaginationLabels(questionnaires);
    });
  }

  acceptFilter() {
    this.getQuestionnaires(0);
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
}
