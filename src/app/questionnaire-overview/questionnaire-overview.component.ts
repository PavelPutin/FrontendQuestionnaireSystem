import { Component } from '@angular/core';
import {PopularComponent} from "../popular/popular.component";

@Component({
  selector: 'app-questionnaire-overview',
  standalone: true,
  imports: [
    PopularComponent
  ],
  templateUrl: './questionnaire-overview.component.html',
  styleUrl: './questionnaire-overview.component.css'
})
export class QuestionnaireOverviewComponent {

}
