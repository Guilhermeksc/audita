import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DiarioOficial {
  ano: number;
  mes: string;
  tipo: string;
  orgao: string;
  data_publicacao: string;
  link_pdf: string;
  edicao: string;
  name: string;
  id_materia: string;
  identifica: string;
  texto_completo: string;
  registro?: string;
  auditado: boolean;
  comentario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiarioOficialService {
    private apiUrl = `${environment.apiUrl}/diario-oficial`;

  constructor(private http: HttpClient) {}

  getDiariosByMesAno(ano: number, mes: number): Observable<DiarioOficial[]> {
    return this.http.get<DiarioOficial[]>(`${this.apiUrl}/por-mes/${ano}/${mes}`);
  }

  getAvailableMonths(): Observable<{ ano: number; mes: number }[]> {
    return this.http.get<{ ano: number; mes: number }[]>(`${this.apiUrl}/meses-disponiveis`);
  }
} 