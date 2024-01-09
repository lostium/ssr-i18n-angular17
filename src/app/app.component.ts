import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ssr-i18n-angular17';
  links = [
    { title: $localize`Explore the Docs`, link: 'https://angular.dev' },
    {
      title: $localize`Learn with Tutorials`,
      link: 'https://angular.dev/tutorials',
    },
    { title: $localize`CLI Docs`, link: 'https://angular.dev/tools/cli' },
    {
      title: $localize`Angular Language Service`,
      link: 'https://angular.dev/tools/language-service',
    },
    {
      title: $localize`Angular DevTools`,
      link: 'https://angular.dev/tools/devtools',
    },
  ];
}
