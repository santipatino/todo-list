import { Injectable } from '@angular/core';
import { Category } from '@app/tasks/core/entities/category';
import { Task } from '@app/tasks/core/entities/task';
import { TasksRepository } from '@app/tasks/core/repositories/tasks.repository';

const TASKS_STORAGE_KEY = 'todo-list.tasks.v1';
const CATEGORIES_STORAGE_KEY = 'todo-list.categories.v1';

export class LocalTasksRepository implements TasksRepository {
  public getTasks(): Task[] {
    return this.read<Task>(TASKS_STORAGE_KEY, this.isTask);
  }

  public saveTasks(tasks: Task[]): void {
    this.write(TASKS_STORAGE_KEY, tasks);
  }

  public getCategories(): Category[] {
    return this.read<Category>(CATEGORIES_STORAGE_KEY, this.isCategory);
  }

  public saveCategories(categories: Category[]): void {
    this.write(CATEGORIES_STORAGE_KEY, categories);
  }

  private read<T>(key: string, isValid: (value: unknown) => value is T): T[] {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue === null) {
        return [];
      }

      const parsedValue: unknown = JSON.parse(storedValue);
      return Array.isArray(parsedValue) ? parsedValue.filter(isValid) : [];
    } catch {
      return [];
    }
  }

  private write<T>(key: string, value: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the app usable if device storage is unavailable or full.
    }
  }

  private isTask(value: unknown): value is Task {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const task = value as Partial<Task>;
    return (
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.completed === 'boolean' &&
      (task.categoryId === undefined || typeof task.categoryId === 'string')
    );
  }

  private isCategory(value: unknown): value is Category {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const category = value as Partial<Category>;
    return typeof category.id === 'string' && typeof category.name === 'string';
  }
}
