import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ObjetoAuditavel {
  nr: number;
  tipo_de_servico: string;
  descricao: string;
  objetivo_auditoria: string;
  origem_demanda: string;
  inicio: string;
  conclusao: string;
  hh: number;
  situacao: string;
  observacoes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObjetosAuditaveisService {
  private readonly apiUrl = '/api/objetos-auditaveis';

  constructor(private http: HttpClient) {}

  // listarObjetos(): Observable<ObjetoAuditavel[]> {
  //  return this.http.get<ObjetoAuditavel[]>(this.apiUrl);
  //}

  listarObjetos(): Observable<ObjetoAuditavel[]> {
    return this.http.get<ObjetoAuditavel[]>('/assets/mocks/objetos-auditaveis.mock.json');
  }

  excluirObjeto(nr: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nr}`);
  }
  

  
  // Métodos futuros: adicionar, importar, exportar, gerar relatório etc.
}
