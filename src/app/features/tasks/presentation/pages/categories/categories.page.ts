import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Category } from '@app/features/tasks/core/entities/category';
import { Task } from '@app/features/tasks/core/entities/task';
import { TasksInteractor } from '@app/features/tasks/core/interactors/tasks.interactor';
import { BottomNavigationComponent } from '@app/shared/components/bottom-navigation/bottom-navigation.component';
import { EmptyStateComponent } from '@app/shared/components/empty-state/empty-state.component';
import { UiMotionService } from '@app/shared/services/ui-motion.service';
import { CategoriesConfig } from './categories.config';

@Component({
  selector: 'app-categories-page',
  standalone: true,
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  imports: [
    CommonModule,
    EmptyStateComponent,
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonTitle,
    IonToolbar,
    BottomNavigationComponent,
  ],
})
export class CategoriesPage implements OnInit {
  public readonly config = CategoriesConfig;
  public readonly categories = signal<Category[]>([]);
  public readonly validationMessage = signal('');
  public categoryName = '';
  public editingCategoryId = signal<string | null>(null);
  public categoryEditName = '';

  @ViewChildren('categoryRow', { read: ElementRef })
  private categoryRows!: QueryList<ElementRef<HTMLElement>>;

  private readonly tasksInteractor = inject(TasksInteractor);
  private readonly alertController = inject(AlertController);
  private readonly uiMotion = inject(UiMotionService);

  public ngOnInit(): void {
    this.categories.set(this.tasksInteractor.getCategories());
  }

  public async addCategory(): Promise<void> {
    const name = this.categoryName.trim();
    if (!name) {
      this.validationMessage.set(this.config.validation.categoryRequired);
      return;
    }

    if (this.hasDuplicateName(name)) {
      this.validationMessage.set(this.config.validation.categoryDuplicate);
      return;
    }

    const category = { id: crypto.randomUUID(), name };
    const categories = [...this.categories(), category];
    this.tasksInteractor.saveCategories(categories);
    this.categories.set(categories);
    this.categoryName = '';
    this.validationMessage.set('');
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => resolve()),
    );
    const row = this.findCategoryRow(category.id);
    if (row) {
      await this.uiMotion.enter(row);
    }
  }

  public startEdit(category: Category): void {
    this.editingCategoryId.set(category.id);
    this.categoryEditName = category.name;
    this.validationMessage.set('');
  }

  public saveEdit(category: Category): void {
    const name = this.categoryEditName.trim();
    if (!name) {
      this.validationMessage.set(this.config.validation.categoryRequired);
      return;
    }

    if (this.hasDuplicateName(name, category.id)) {
      this.validationMessage.set(this.config.validation.categoryDuplicate);
      return;
    }

    const categories = this.categories().map((item) =>
      item.id === category.id ? { ...item, name } : item,
    );
    this.tasksInteractor.saveCategories(categories);
    this.categories.set(categories);
    this.cancelEdit();
  }

  public cancelEdit(): void {
    this.editingCategoryId.set(null);
    this.categoryEditName = '';
    this.validationMessage.set('');
  }

  public async confirmDelete(category: Category): Promise<void> {
    const alert = await this.alertController.create({
      header: this.config.category.deleteTitle,
      message: this.config.category.deleteMessage,
      buttons: [
        { text: this.config.cancel, role: 'cancel' },
        {
          text: this.config.actions.delete,
          role: 'destructive',
          handler: () => this.deleteCategory(category),
        },
      ],
    });
    await alert.present();
  }

  public trackCategory(_index: number, category: Category): string {
    return category.id;
  }

  private async deleteCategory(category: Category): Promise<void> {
    const row = this.findCategoryRow(category.id);
    if (row) {
      await this.uiMotion.leave(row);
    }

    const categories = this.categories().filter(
      (item) => item.id !== category.id,
    );
    const tasks: Task[] = this.tasksInteractor
      .getTasks()
      .map((task) =>
        task.categoryId === category.id
          ? { ...task, categoryId: undefined }
          : task,
      );
    this.tasksInteractor.saveCategories(categories);
    this.tasksInteractor.saveTasks(tasks);
    this.categories.set(categories);
    if (this.editingCategoryId() === category.id) {
      this.cancelEdit();
    }
  }

  private hasDuplicateName(name: string, excludedId?: string): boolean {
    const normalizedName = name.toLocaleLowerCase();
    return this.categories().some(
      (category) =>
        category.id !== excludedId &&
        category.name.toLocaleLowerCase() === normalizedName,
    );
  }

  private findCategoryRow(categoryId: string): HTMLElement | undefined {
    return this.categoryRows?.find(
      (row) => row.nativeElement.dataset['categoryId'] === categoryId,
    )?.nativeElement;
  }
}
