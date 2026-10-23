import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: '<p class="empty-state" role="status">{{ message() }}</p>',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  public readonly message = input.required<string>();
}
