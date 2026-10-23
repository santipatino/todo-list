import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AlertController,
  IonContent,
  IonFooter,
  IonHeader,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Category } from '@app/tasks/core/entities/category';
import { Task } from '@app/tasks/core/entities/task';
import { TasksInteractor } from '@app/tasks/core/interactors/tasks.interactor';
import { RemoteConfigService } from '@app/shared/services/remote-config.service';
import { BottomNavigationComponent } from '@app/shared/components/bottom-navigation/bottom-navigation.component';
import { TaskEditorComponent } from './components/task-editor/task-editor.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TasksConfig } from './tasks.config';

const ALL_CATEGORIES = 'all';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  templateUrl: './tasks.page.html',
  styleUrl: './tasks.page.scss',
  imports: [
    IonContent,
    IonFooter,
    IonHeader,
    IonItem,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
    BottomNavigationComponent,
    TaskEditorComponent,
    TaskListComponent,
  ],
})
export class TasksPage implements OnInit {
  public readonly config = TasksConfig;
  public readonly allCategoriesFilter = ALL_CATEGORIES;
  public readonly tasks = signal<Task[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly selectedCategoryId = signal(ALL_CATEGORIES);
  public readonly editingTask = signal<Task | null>(null);
  public readonly taskTitle = signal('');
  public readonly taskCategoryId = signal('');
  public readonly validationMessage = signal('');
  public readonly visibleTasks = computed(() => {
    const categoryId = this.selectedCategoryId();
    return categoryId === ALL_CATEGORIES
      ? this.tasks()
      : this.tasks().filter((task) => task.categoryId === categoryId);
  });
  public readonly emptyTaskMessage = computed(() =>
    this.selectedCategoryId() === ALL_CATEGORIES
      ? this.config.task.empty
      : this.config.task.emptyFiltered,
  );

  @ViewChild(TaskListComponent)
  private taskList?: TaskListComponent;

  private readonly tasksInteractor = inject(TasksInteractor);
  public readonly remoteConfig = inject(RemoteConfigService);
  private readonly alertController = inject(AlertController);

  public ngOnInit(): void {
    this.loadLocalData();
    void this.remoteConfig.initialize();
  }

  public ionViewWillEnter(): void {
    this.loadLocalData();
  }

  public async saveTask(): Promise<void> {
    const title = this.taskTitle().trim();
    if (!title) {
      this.validationMessage.set(this.config.validation.taskRequired);
      return;
    }

    const editingTask = this.editingTask();
    if (editingTask) {
      this.persistTasks(
        this.tasks().map((task) =>
          task.id === editingTask.id
            ? { ...task, title, categoryId: this.taskCategoryId() || undefined }
            : task,
        ),
      );
      this.resetTaskForm();
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      categoryId: this.taskCategoryId() || undefined,
    };
    this.persistTasks([...this.tasks(), task]);
    this.resetTaskForm();
    await this.taskList?.animateEnter(task.id);
  }

  public editTask(task: Task): void {
    this.editingTask.set(task);
    this.taskTitle.set(task.title);
    this.taskCategoryId.set(task.categoryId ?? '');
    this.validationMessage.set('');
  }

  public cancelTaskEdit(): void {
    this.resetTaskForm();
  }

  public toggleTask(task: Task): void {
    this.persistTasks(
      this.tasks().map((item) =>
        item.id === task.id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  public async confirmDeleteTask(task: Task): Promise<void> {
    const alert = await this.alertController.create({
      header: this.config.task.deleteTitle,
      message: this.config.task.deleteMessage,
      buttons: [
        { text: this.config.task.cancel, role: 'cancel' },
        {
          text: this.config.task.delete,
          role: 'destructive',
          handler: () => this.deleteTask(task),
        },
      ],
    });
    await alert.present();
  }

  private async deleteTask(task: Task): Promise<void> {
    await this.taskList?.animateLeave(task.id);
    this.persistTasks(this.tasks().filter((item) => item.id !== task.id));
    if (this.editingTask()?.id === task.id) {
      this.resetTaskForm();
    }
  }

  private loadLocalData(): void {
    const categories = this.tasksInteractor.getCategories();
    const tasks = this.tasksInteractor.getTasks();
    this.categories.set(categories);
    this.tasks.set(tasks);
    if (
      this.selectedCategoryId() !== ALL_CATEGORIES &&
      !categories.some((category) => category.id === this.selectedCategoryId())
    ) {
      this.selectedCategoryId.set(ALL_CATEGORIES);
    }
  }

  private persistTasks(tasks: Task[]): void {
    this.tasksInteractor.saveTasks(tasks);
    this.tasks.set(tasks);
  }

  private resetTaskForm(): void {
    this.taskTitle.set('');
    this.taskCategoryId.set('');
    this.editingTask.set(null);
    this.validationMessage.set('');
  }
}
