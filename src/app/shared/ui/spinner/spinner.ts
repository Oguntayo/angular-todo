import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: `
    <div class="spinner" role="status" aria-label="Loading">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle class="spinner__track" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="2"/>
        <path class="spinner__arc" d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>`,
  styleUrl: './spinner.scss'
})
export class Spinner {}
