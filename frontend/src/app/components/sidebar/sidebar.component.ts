import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SidebarToggleService } from '../../services/sidebar/sidebar-toggle.service';
import { MatIconModule } from '@angular/material/icon';

interface MenuItem {
  title: string;
  icon: string;
  children: (string | SubMenuItem)[];
  expanded: boolean;
}

interface SubMenuItem {
  title: string;
  children: string[];
  expanded: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isOpen = true;

  menuItems: MenuItem[] = [
    { title: 'PAINT-RAINT', icon: 'assets/icons/svg/menu_icon.svg', children: [
      {
        title: 'PAINT',
        children: [
          'Cadastro Objetos Auditáveis',
          'Objetivos Navais',
          'Ações Orçamentárias', 
          'Anexo A - Objetos Auditáveis',
          'Anexo B - Organizações Militares Representativas'
        ],
        expanded: false
      },
      'RAINT'
    ], expanded: true },
    { title: 'PLANEJAMENTO', icon: 'assets/icons/svg/menu_icon.svg', children: ['Planejamento'], expanded: true },
    { title: 'EXECUÇÃO', icon: 'assets/icons/svg/menu_icon.svg', children: [
      'Testes com base na Matriz de Planejamento',
      'PT',
      'Matriz de Achados',
      {
        title: 'Relatórios',
        children: ['Relatório Preliminar', 'Relatório Final'],
        expanded: false
      }
    ],
    expanded: true
    },   
    { title: 'MONITORAMENTO', icon: 'assets/icons/svg/menu_icon.svg', children: [
      'Monitoramento'
    ],
    expanded: true
    },
    { title: 'PGMQ', icon: 'assets/icons/svg/menu_icon.svg', children: [
      'Acompanhamento das etapas do processo de Auditoria',
      'Alerta de supervisionamento à conclusão de cada etapa',
      'Avaliação periódica (modelo IA-CM)',
    ],
    expanded: true
    }, 
    { title: 'ANÁLISE DE RISCOS', icon: 'assets/icons/svg/menu_icon.svg', children: [
      'Inserção de dados do TCU/TCE para subsidiar o PAINT (Matriz de riscos)',
      'Definição de escopo',
      'Importar planilhas de acompanhamento retroativas',
      'Extração de relatórios para Solicitação de Auditoria e para COFAMAR',
    ],
    expanded: true
    },             
    { title: 'CCIMAR-12', icon: 'assets/icons/svg/menu_icon.svg', children: [
        {
          title: 'Diário Oficial da União (DOU)',
          children: ['Acompanhamento', 'Pesquisar Histórico', 'Pesquisar data específica'],
          expanded: false
        },
        'Análise Processual de Alta Materialidade',
        {
          title: 'Preço homologado acima do Estimado',
          children: ['Dispensa Eletrônica', 'Pregão Eletrônico', 'Credenciamento', 'Concorrência'],
          expanded: false
        },
        'Fragilidade da Estimativa da Demanda',
        'Restrição para Contratação'
      ],
      expanded: true
    },
    { title: 'CCIMAR-13', icon: 'assets/icons/svg/menu_icon.svg', children: ['Despesa', 'Orçamento'], expanded: true },
    { title: 'CCIMAR-14', icon: 'assets/icons/svg/menu_icon.svg', children: ['Pessoal'], expanded: true },
    { title: 'CCIMAR-15', icon: 'assets/icons/svg/menu_icon.svg', children: ['Patrimônio', 'Subsistência'], expanded: true },
    { title: 'CCIMAR-16', icon: 'assets/icons/svg/menu_icon.svg', children: ['Webscraping', 'API', 'RPA'], expanded: true },
  ];

  private routeMap: { [key: string]: string } = {
    'PAINT': 'paint',
    'RAINT': 'raint',
    'Análise Processual de Alta Materialidade': 'alta-materialidade',
    'Preço homologado acima do Estimado': 'homologado-estimado',
    'Diário Oficial da União (DOU)': 'diario-oficial',
    'Fragilidade da Estimativa da Demanda': 'fragilidade-demanda',
    'Restrição para Contratação': 'restricao-contratacao',
    'Pesquisar Histórico': 'pesquisar-historico',
    'Pesquisar data específica': 'pesquisar-data-especifica',
    'Dispensa Eletrônica': 'dispensa-eletronica',
    'Pregão Eletrônico': 'pregao-eletronico',
    'Credenciamento': 'credenciamento',
    'Concorrência': 'concorrencia',
    'Acompanhamento': 'acompanhamento',
    'Cadastro Objetos Auditáveis': 'cadastro-objetos',
    'Objetivos Navais': 'objetivos-navais',
    'Ações Orçamentárias': 'acoes-orcamentarias',
    'Anexo A - Objetos Auditáveis': 'anexo-a',
    'Anexo B - Organizações Militares Representativas': 'anexo-b'
  };

  constructor(
    private sidebarService: SidebarToggleService,
    private router: Router
  ) {
    this.sidebarService.isOpen$.subscribe(state => this.isOpen = state);
  }

  navigate(section: string, option: string | SubMenuItem) {
    const optionText = typeof option === 'string' ? option : option.title;
    let route = this.routeMap[optionText] || this.slugify(optionText);
    
    // Handle nested navigation
    if (optionText === 'Diário Oficial da União (DOU)') {
      route = `home/${this.slugify(section)}/${route}`;
    } else if (this.isChildOfDOU(optionText)) {
      route = `home/${this.slugify(section)}/diario-oficial/${route}`;
    } else if (this.isChildOfHomologadoEstimado(optionText)) {
      route = `home/${this.slugify(section)}/homologado-estimado/${route}`;
    } else if (this.isChildOfPaint(optionText)) {
      route = `home/${this.slugify(section)}/paint/${route}`;
    } else {
      route = `home/${this.slugify(section)}/${route}`;
    }

    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  private isChildOfDOU(optionText: string): boolean {
    const douChildren = ['Acompanhamento', 'Pesquisar Histórico', 'Pesquisar data específica'];
    return douChildren.includes(optionText);
  }

  private isChildOfHomologadoEstimado(optionText: string): boolean {
    const homologadoEstimadoChildren = ['Dispensa Eletrônica', 'Pregão Eletrônico', 'Credenciamento', 'Concorrência'];
    return homologadoEstimadoChildren.includes(optionText);
  }

  private isChildOfPaint(optionText: string): boolean {
    const paintChildren = [
      'Cadastro Objetos Auditáveis',
      'Objetivos Navais',
      'Ações Orçamentárias',
      'Anexo A - Objetos Auditáveis',
      'Anexo B - Organizações Militares Representativas'
    ];
    return paintChildren.includes(optionText);
  }

  private slugify(text: string): string {
    return text.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  }

  toggleExpand(item: any) {
    item.expanded = !item.expanded;
  }

  isSubMenuItem(item: string | SubMenuItem): item is SubMenuItem {
    return typeof item === 'object' && item !== null && 'title' in item;
  }
}
