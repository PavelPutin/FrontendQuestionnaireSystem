import {Component, inject} from '@angular/core';
import {PopularComponent} from "../popular/popular.component";
import {QuestionnaireBrief} from "../questionnaire-brief";
import {QuestionnaireService} from "../questionnaire.service";
import {NgForOf} from "@angular/common";
import {PaginatedQuestionnaires} from "../paginated-questionnaires";

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
  questionnaireService: QuestionnaireService = inject(QuestionnaireService);

  constructor() {
  }

  ngOnInit() {
    this.getQuestionnaires()
  }

  getQuestionnaires(): void {
    this.questionnaireService.getQuestionnaires().then((questionnaires: PaginatedQuestionnaires) => {
      this.questionnaires = questionnaires.briefDTOList;
      this.paginationLabels = this.updatePaginationLabels(questionnaires);
    })
  }

  acceptFilter(questionnaireName: string, authorName: string) {

  }

  private updatePaginationLabels(questionnaires: PaginatedQuestionnaires): string[] {
    let paginationLabels: string[] = [];
    if (questionnaires.number < 5) {
      for (let i = 1; i <= 5 && i <= questionnaires.totalPages; i++) {
        if (i == 5 && questionnaires.totalPages > 5) {
          paginationLabels[i - 1] = "...";
        } else {
          paginationLabels[i - 1] = i + '';
        }
      }
    }
    return paginationLabels;
  }
}
