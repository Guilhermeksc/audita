
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Risco {
  codigo: string;
  risco: string;
  descricao: string;
}

export interface RiscosResponse {
  licitacao: Risco[];
  execucao: Risco[];
  recursos_humanos: Risco[];
  patrimonio: Risco[];
  municiamento: Risco[];
}


@Injectable({
  providedIn: 'root'
})

export class RiscosService {

  private readonly apiUrl = '/api/identificacao_riscos';

  constructor(private http: HttpClient) {}

  // listarObjetos(): Observable<RiscoIdentificado[]> {
  // return this.http.get<RiscoIdentificado[]>(this.apiUrl);
  //}

  getRiscos(): Observable<RiscosResponse> {
    return this.http.get<RiscosResponse>('/assets/mocks/riscos.mock.json');
  }
  

  excluirObjeto(nr: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nr}`);
  }
  
  // Métodos futuros: adicionar, importar, exportar, gerar relatório etc.
}
