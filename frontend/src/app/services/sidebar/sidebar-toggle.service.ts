import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarToggleService {
  private isSidebarOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isSidebarOpen.asObservable();

  private sidebarWidth = new BehaviorSubject<string>('250px'); // 🔹 Sidebar aberta
  sidebarWidth$ = this.sidebarWidth.asObservable();

  toggleSidebar() {
    const newWidth = this.isSidebarOpen.value ? '0px' : '250px';
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
    this.sidebarWidth.next(newWidth);
  }
}
