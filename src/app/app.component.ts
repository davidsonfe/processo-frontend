import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProcessoListComponent } from './components/processo-list/processo-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'processo-frontend';
}
