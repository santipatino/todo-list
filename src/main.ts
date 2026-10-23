import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { LocalTasksRepository } from './app/features/tasks/data/repositories/local-tasks.repository';
import { TasksRepository } from './app/features/tasks/core/repositories/tasks.repository';
import { addIcons } from 'ionicons';
import {
  addOutline,
  checkmarkOutline,
  closeOutline,
  createOutline,
  folderOpenOutline,
  listOutline,
  trashOutline,
} from 'ionicons/icons';

addIcons({
  'add-outline': addOutline,
  'checkmark-outline': checkmarkOutline,
  'close-outline': closeOutline,
  'create-outline': createOutline,
  'folder-open-outline': folderOpenOutline,
  'list-outline': listOutline,
  'trash-outline': trashOutline,
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
    { provide: TasksRepository, useClass: LocalTasksRepository },
  ],
});
