import { inject, Injectable } from '@angular/core';
import { AnimationController } from '@ionic/angular';

const ROW_ANIMATION_DURATION_MS = 180;

@Injectable({ providedIn: 'root' })
export class UiMotionService {
  private readonly animationController = inject(AnimationController);

  public async enter(element: HTMLElement): Promise<void> {
    if (this.prefersReducedMotion()) {
      return;
    }

    await this.animationController.create()
      .addElement(element)
      .duration(ROW_ANIMATION_DURATION_MS)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(0.5rem)', 'translateY(0)')
      .play();
  }

  public async leave(element: HTMLElement): Promise<void> {
    if (this.prefersReducedMotion()) {
      return;
    }

    await this.animationController.create()
      .addElement(element)
      .duration(ROW_ANIMATION_DURATION_MS)
      .easing('ease-in')
      .fromTo('opacity', '1', '0')
      .fromTo('transform', 'translateY(0)', 'translateY(-0.5rem)')
      .play();
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
