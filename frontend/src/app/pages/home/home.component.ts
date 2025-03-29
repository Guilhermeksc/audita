import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarToggleService } from '../../services/sidebar/sidebar-toggle.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sidebarWidth = '250px';

  constructor(
    private sidebarService: SidebarToggleService,
    private router: Router
  ) {
    this.sidebarService.sidebarWidth$.subscribe(width => {
      this.sidebarWidth = width;
    });
  }

  ngOnInit() {
    // Subscribe to router events to handle navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Force change detection or handle route change
      console.log('Route changed:', this.router.url);
    });
  }
}
