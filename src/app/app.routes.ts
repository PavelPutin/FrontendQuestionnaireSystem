import { Routes } from '@angular/router';
import {QuestionnaireOverviewComponent} from "./questionnaire-overview/questionnaire-overview.component";

export const routes: Routes = [
  {
    path: '',
    component: QuestionnaireOverviewComponent,
    title: "Обзор анкет"
  }
];
