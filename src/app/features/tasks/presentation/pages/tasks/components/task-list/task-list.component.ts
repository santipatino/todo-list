import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  input,
  output,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
} from '@ionic/angular';
import { Category } from '@app/features/tasks/core/entities/category';
import { Task } from '@app/features/tasks/core/entities/task';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';
import { UiMotionService } from '@app/shared/services/ui-motion.service';
import { TasksConfig } from '@app/features/tasks/presentation/pages/tasks/tasks.config';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  imports: [
    CommonModule,
    EmptyStateComponent,
    IonButton,
    IonButtons,
    IonCheckbox,
    IonChip,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
  ],
})
export class TaskListComponent {
  public readonly config = TasksConfig;
  public readonly tasks = input.required<Task[]>();
  public readonly categories = input<Category[]>([]);
  public readonly emptyMessage = input.required<string>();
  public readonly taskToggled = output<Task>();
  public readonly editRequested = output<Task>();
  public readonly deleteRequested = output<Task>();

  @ViewChildren('taskRow', { read: ElementRef })
  private taskRows!: QueryList<ElementRef<HTMLElement>>;

  private readonly uiMotion = inject(UiMotionService);

  public categoryNameFor(task: Task): string | undefined {
    return this.categories().find((category) => category.id === task.categoryId)
      ?.name;
  }

  public async animateEnter(taskId: string): Promise<void> {
    await this.nextFrame();
    const row = this.findTaskRow(taskId);
    if (row) {
      await this.uiMotion.enter(row);
    }
  }

  public async animateLeave(taskId: string): Promise<void> {
    const row = this.findTaskRow(taskId);
    if (row) {
      await this.uiMotion.leave(row);
    }
  }

  private findTaskRow(taskId: string): HTMLElement | undefined {
    return this.taskRows?.find(
      (row) => row.nativeElement.dataset['taskId'] === taskId,
    )?.nativeElement;
  }

  private nextFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
}
