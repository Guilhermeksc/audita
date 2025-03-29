import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { PlanejamentoComponent } from './modules/ccimar-10/planejamento/planejamento.component';
import { PaintComponent } from './modules/ccimar-11/paint/paint.component';
import { RaintComponent } from './modules/ccimar-11/raint/raint.component';
import { DiarioOficialComponent } from './modules/ccimar-12/diario-oficial/diario-oficial.component';
import { AltaMaterialidadeComponent } from './modules/ccimar-12/alta-materialidade/alta-materialidade.component';
import { HomologadoEstimadoComponent } from './modules/ccimar-12/homologado-estimado/homologado-estimado.component';
import { AcompanhamentoComponent } from './modules/ccimar-12/diario-oficial/acompanhamento/acompanhamento.component';
import { PesquisarHistoricoComponent } from './modules/ccimar-12/diario-oficial/pesquisar-historico/pesquisar-historico.component';
import { PesquisarDataComponent } from './modules/ccimar-12/diario-oficial/pesquisar-data/pesquisar-data.component';
import { AuthGuard, AuthChildGuard } from './services/auth.guard';
import { DispensaEletronicaComponent } from './modules/ccimar-12/homologado-estimado/dispensa-eletronica/dispensa-eletronica.component';
import { PregaoEletronicoComponent } from './modules/ccimar-12/homologado-estimado/pregao-eletronico/pregao-eletronico.component';
import { ConcorrenciaComponent } from './modules/ccimar-12/homologado-estimado/concorrencia/concorrencia.component';
import { CredenciamentoComponent } from './modules/ccimar-12/homologado-estimado/credenciamento/credenciamento.component';
import { CadastroObjetosAuditaveisComponent } from './modules/ccimar-11/paint/cadastro-objetos-auditaveis/cadastro-objetos-auditaveis.component';
import { AcoesOrcamentariasComponent } from './modules/ccimar-11/paint/acoes-orcamentarias/acoes-orcamentarias.component';
import { AnexoAObjetosAuditaveisComponent } from './modules/ccimar-11/paint/anexo-a-objetos-auditaveis/anexo-a-objetos-auditaveis.component';
import { AnexoBOmRepresentativasComponent } from './modules/ccimar-11/paint/anexo-b-om-representativas/anexo-b-om-representativas.component';
import { ObjetivosNavaisComponent } from './modules/ccimar-11/paint/objetivos-navais/objetivos-navais.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // 🔹 Home será a base das rotas
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],  
    canActivateChild: [AuthChildGuard],  
    children: [
      // CCIMAR-10
      {
        path: 'ccimar-10',
        children: [{ path: 'planejamento', component: PlanejamentoComponent }]
      },
      // CCIMAR-11
      {
        path: 'ccimar-11',
        children: [
          { 
            path: 'paint',
            children: [
              { path: '', component: PaintComponent },
              { path: 'cadastro-objetos', component: CadastroObjetosAuditaveisComponent },
              { path: 'objetivos-navais', component: ObjetivosNavaisComponent },
              { path: 'acoes-orcamentarias', component: AcoesOrcamentariasComponent },
              { path: 'anexo-a', component: AnexoAObjetosAuditaveisComponent },
              { path: 'anexo-b', component: AnexoBOmRepresentativasComponent }
            ]
          },
          { path: 'raint', component: RaintComponent }
        ]
      },
      // CCIMAR-12
      {
        path: 'ccimar-12',
        children: [
          { 
            path: 'diario-oficial',
            children: [
              { path: '', component: DiarioOficialComponent },
              { path: 'acompanhamento', component: AcompanhamentoComponent },
              { path: 'pesquisar-historico', component: PesquisarHistoricoComponent },
              { path: 'pesquisar-data-especifica', component: PesquisarDataComponent }
            ]
          },
          { path: 'alta-materialidade', component: AltaMaterialidadeComponent },
          { 
            path: 'homologado-estimado',
            children: [
              { path: '', component: HomologadoEstimadoComponent },
              { path: 'dispensa-eletronica', component: DispensaEletronicaComponent },
              { path: 'pregao-eletronico', component: PregaoEletronicoComponent }, 
              { path: 'concorrencia', component: ConcorrenciaComponent },
              { path: 'credenciamento', component: CredenciamentoComponent }
            ]
          }
        ]
      },
      // Outras seções CCIMAR-13 a CCIMAR-16 podem ser adicionadas aqui...
    ]
  },

  // Redirecionamento padrão
  { path: '**', redirectTo: 'home' }
];
