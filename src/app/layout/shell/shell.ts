import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  imports: [Header, Sidebar, Footer, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  readonly mobileSidebarOpen = signal(false);

  toggleMobileSidebar() {
    this.mobileSidebarOpen.update(v => !v);
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen.set(false);
  }
}