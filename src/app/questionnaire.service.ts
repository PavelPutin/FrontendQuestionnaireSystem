import {inject, Injectable} from '@angular/core';
import {QuestionnaireBrief} from "./questionnaire-brief";
import {PaginatedQuestionnaires} from "./paginated-questionnaires";
import {Questionnaire} from "./questionnaire";
import {routes} from "./app.routes";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  url = 'http://localhost:8080/questionnaire'
  router: Router = inject(Router);
  auth: AuthenticationService = inject(AuthenticationService);
  constructor(private http: HttpClient) { }

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
      headers: this.auth.getHeader()
    });
    if (data.status == 404) {
      this.router.navigate(["/details", uuid, "notfound"]).then();
    }
    if (data.status == 401) {
      this.router.navigateByUrl("/login").then();
    }
    return await data.json() ?? [];
  }

  async getHasUserAnsweredByQuestionnaireId(uuid: string): Promise<{ result: boolean }> {
    const data = await fetch(`${this.url}/${uuid}/hasAnswered`, {
      headers: this.auth.getHeader()
    });
    if (data.status == 404) {
      this.router.navigate(["/details", uuid, "notfound"]).then();
    }
    if (data.status == 401) {
      this.router.navigateByUrl("/login").then();
    }
    return await data.json() ?? undefined;
  }

  vote(uuid: string, optionsId: string[]) {
    const httpOptions = {
      headers: this.auth.getHeader()
    }
    return this.http.post(`${this.url}/${uuid}/vote`, {
      "optionsId": optionsId
    }, httpOptions);
  }
}
