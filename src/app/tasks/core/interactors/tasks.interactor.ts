import { inject, Injectable } from '@angular/core';
import { Category } from '@app/tasks/core/entities/category';
import { Task } from '@app/tasks/core/entities/task';
import { TasksRepository } from '@app/tasks/core/repositories/tasks.repository';

@Injectable({ providedIn: 'root' })
export class TasksInteractor {
  private readonly repository = inject(TasksRepository);

  public getTasks(): Task[] {
    return this.repository.getTasks();
  }

  public saveTasks(tasks: Task[]): void {
    this.repository.saveTasks(tasks);
  }

  public getCategories(): Category[] {
    return this.repository.getCategories();
  }

  public saveCategories(categories: Category[]): void {
    this.repository.saveCategories(categories);
  }
}
