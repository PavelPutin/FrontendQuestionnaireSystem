import {Component, inject} from '@angular/core';
import {PopularComponent} from "../popular/popular.component";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {QuestionnaireService} from "../questionnaire.service";
import {NgForOf} from "@angular/common";
import {PaginatedQuestionnaires} from "../paginated-questionnaires";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-questionnaire-overview',
  standalone: true,
  imports: [
    PopularComponent,
    NgForOf
  ],
  templateUrl: './questionnaire-overview.component.html',
  styleUrl: './questionnaire-overview.component.css'
})
export class QuestionnaireOverviewComponent {
  questionnaires: QuestionnaireBrief[] = [];
  paginationLabels: string[] = [];
  questionnaireNameSearch: string | undefined = undefined;
  authorNameSearch: string | undefined = undefined;
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  constructor() {
  }

  ngOnInit() {
    this.getQuestionnaires(0);
  }

  getQuestionnaires(pageNumber: number): void {
    this.questionnaireService.getQuestionnaires(pageNumber, this.questionnaireNameSearch, this.questionnaireNameSearch).then((questionnaires: PaginatedQuestionnaires) => {
      this.questionnaires = questionnaires.briefDTOList;
      this.paginationLabels = this.updatePaginationLabels(questionnaires);
    });
  }

  acceptFilter(questionnaireNameSearch: string, authorNameSearch: string) {
    this.questionnaireNameSearch = questionnaireNameSearch;
    this.authorNameSearch = authorNameSearch;
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
