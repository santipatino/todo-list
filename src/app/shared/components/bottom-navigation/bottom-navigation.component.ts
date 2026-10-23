import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/angular';
import { BottomNavigationConfig } from './bottom-navigation.config';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  template: `
    <ion-tab-bar>
      <ion-tab-button
        [routerLink]="['/tasks']"
        [selected]="activeTab() === 'tasks'"
      >
        <ion-icon name="list-outline"></ion-icon>
        <ion-label>{{ config.tasks }}</ion-label>
      </ion-tab-button>
      <ion-tab-button
        [routerLink]="['/categories']"
        [selected]="activeTab() === 'categories'"
      >
        <ion-icon name="folder-open-outline"></ion-icon>
        <ion-label>{{ config.categories }}</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  `,
  imports: [IonIcon, IonLabel, IonTabBar, IonTabButton, RouterLink],
})
export class BottomNavigationComponent {
  public readonly activeTab = input.required<'tasks' | 'categories'>();
  public readonly config = BottomNavigationConfig;
}
