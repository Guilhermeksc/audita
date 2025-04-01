import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AmparoLegal {
  codigo: number;
  descricao: string;
  nome: string;
}

export interface PNCPModel {
  valorTotalHomologado: string;
  sequencialCompra: number;
  anoCompra: number;
  numeroCompra: string;
  processo: string;
  codigoUnidade: string;
  nomeUnidade: string;
  ufSigla: string;
  modoDisputaNome: string;
  amparoLegal: AmparoLegal; // Propriedade adicionada
}

@Injectable({
  providedIn: 'root'
})

export class PNCPModelService {

  private readonly apiUrl = '/api/dispensa-eletronica';

  constructor(private http: HttpClient) {}

  listarObjetos(): Observable<PNCPModel[]> {
   return this.http.get<PNCPModel[]>(this.apiUrl);
  }

  // listarObjetos(): Observable<PNCPModel[]> {
  //   return this.http.get<PNCPModel[]>('/assets/mocks/dispensa-eletronica.mock.json');
  // }

  excluirObjeto(nr: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nr}`);
  }
  
  // Métodos futuros: adicionar, importar, exportar, gerar relatório etc.
}
