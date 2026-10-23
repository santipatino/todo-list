import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonInput, IonSelect, IonSelectOption } from '@ionic/angular';
import { Category } from '@app/tasks/core/entities/category';
import { TasksConfig } from '@app/tasks/presentation/pages/tasks/tasks.config';

@Component({
  selector: 'app-task-editor',
  standalone: true,
  templateUrl: './task-editor.component.html',
  styleUrl: './task-editor.component.scss',
  imports: [FormsModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonInput, IonSelect, IonSelectOption],
})
export class TaskEditorComponent {
  public readonly config = TasksConfig;
  public readonly title = input.required<string>();
  public readonly taskTitleChanged = output<string>();
  public readonly categoryId = input.required<string>();
  public readonly categoryChanged = output<string>();
  public readonly categories = input<Category[]>([]);
  public readonly editing = input(false);
  public readonly message = input('');
  public readonly taskSaved = output<void>();
  public readonly editCancelled = output<void>();
}
