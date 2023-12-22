import {inject, Injectable} from '@angular/core';
import {QuestionnaireBrief} from "./questionnaire-brief";
import {PaginatedQuestionnaires} from "./paginated-questionnaires";
import {Questionnaire} from "./questionnaire";
import {routes} from "./app.routes";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  url = 'http://localhost:8080/questionnaire'
  router: Router = inject(Router);
  constructor() { }

  async getQuestionnaires(pageNumber: number, questionnaireNameSearch: string | undefined, authorNameSearch: string | undefined): Promise<PaginatedQuestionnaires> {
    const urlParams = new URLSearchParams();
    urlParams.append("pageNumber", pageNumber.toString());
    if (questionnaireNameSearch) {
      urlParams.append("questionnaireNameSearch", questionnaireNameSearch);
    }
    if (authorNameSearch) {
      urlParams.append("authorNameSearch", authorNameSearch);
    }

    const data = await fetch(`${this.url}?` + urlParams);
    return await data.json() ?? [];
  }

  async getPopularQuestionnaire(): Promise<QuestionnaireBrief[]> {
    const data = await fetch(`${this.url}/popular`);
    return await data.json() ?? [];
  }

  async getQuestionnaireById(uuid: string): Promise<Questionnaire> {
    const data = await fetch(`${this.url}/${uuid}`, {
      headers: {
        "Authorization": "Basic " + btoa("qwerty:qwerty")
      }
    });
    if (data.status == 404) {
      this.router.navigate(["/details", uuid, "notfound"]).then();
    }
    return await data.json() ?? [];
  }
}
