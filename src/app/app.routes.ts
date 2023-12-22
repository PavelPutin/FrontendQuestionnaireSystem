import { Routes } from '@angular/router';
import {QuestionnaireOverviewComponent} from "./questionnaire-overview/questionnaire-overview.component";
import {LoginComponent} from "./login/login.component";
import {QuestionnaireDetailComponent} from "./questionnaire-detail/questionnaire-detail.component";
import {RegistrationComponent} from "./registration/registration.component";
import {ProfileComponent} from "./profile/profile.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const routes: Routes = [
  {
    path: '',
    component: QuestionnaireOverviewComponent,
    title: "Обзор анкет"
  },
  {
    path: 'login',
    component: LoginComponent,
    title: "Вход"
  },
  {
    path: 'details/:id',
    component: QuestionnaireDetailComponent,
    title: "Анкета"
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    title: "Регистрация"
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    title: "Профиль"
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
    title: "Ресурс не найден"
  }
];
