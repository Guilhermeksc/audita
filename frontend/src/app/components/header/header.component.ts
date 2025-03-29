import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarToggleService } from '../../services/sidebar/sidebar-toggle.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { ChangeProfileDialogComponent } from '../change-profile-dialog/change-profile-dialog.component'; // criar

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  appTitle = 'AuditaPro';
  version = 'V.0.0.1';
  userName: string = 'Guest';
  perfilAtivo: string = '';

  constructor(
    private userService: UserService,
    private sidebarService: SidebarToggleService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();
    this.perfilAtivo = this.userService.getPerfilAtivo();
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  changeProfile() {
    this.dialog.open(ChangeProfileDialogComponent, {
      panelClass: 'custom-dialog'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.perfilAtivo = result;
        this.userService.setPerfilAtivo(result);
      }
    });
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent);
  }

  logout() {
    this.authService.logout();
  }
}
