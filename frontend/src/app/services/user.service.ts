import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private nomeCompleto: string = '';
  private perfis: string[] = [];
  private perfilAtivo: string = '';

  constructor() {
    this.restoreUserData();
  }

  setUserData(user: any) {
    this.nomeCompleto = user?.nome || 'Usuário';
    this.perfis = user?.perfis || [];
    this.perfilAtivo = user?.perfil_ativo || this.perfis[0] || '';
  }

  restoreUserData() {
    const saved = localStorage.getItem('user_data');
    if (saved) {
      const user = JSON.parse(saved);
      this.setUserData(user);
    }
  }

  getUserName(): string {
    return this.nomeCompleto;
  }

  getPerfis(): string[] {
    return this.perfis;
  }

  getPerfilAtivo(): string {
    return this.perfilAtivo;
  }

  setPerfilAtivo(perfil: string) {
    this.perfilAtivo = perfil;

    // atualiza também no localStorage
    const saved = localStorage.getItem('user_data');
    if (saved) {
      const user = JSON.parse(saved);
      user.perfil_ativo = perfil;
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }
}