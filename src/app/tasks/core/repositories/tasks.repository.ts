import { Category } from '@app/tasks/core/entities/category';
import { Task } from '@app/tasks/core/entities/task';

export abstract class TasksRepository {
  public abstract getTasks(): Task[];
  public abstract saveTasks(tasks: Task[]): void;
  public abstract getCategories(): Category[];
  public abstract saveCategories(categories: Category[]): void;
}
