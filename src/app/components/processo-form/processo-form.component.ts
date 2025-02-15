import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProcessoService } from '../../services/processo.service';
import { IbgeService } from '../../services/ibge.service';
import { Router } from '@angular/router'; // Importe o Router


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-processo-form',
  templateUrl: './processo-form.component.html',
  providers: [ProcessoService, IbgeService],
})
export class ProcessoFormComponent implements OnInit {
  processo: any = {}; 
  processos: any[] = []; 
  selectedProcesso: any = null;
  currentPage: number = 0;
  totalPages: number = 1;
  estados: any[] = [];
  municipios: any[] = [];

  constructor(private processoService: ProcessoService, private ibgeService: IbgeService,  private router: Router) {}

  async ngOnInit() {
    
    await this.listarProcessos();
  }

  async listarProcessos() {
    try {
      const response = await this.processoService.listarProcessos(this.currentPage, 10);
      this.processos = response.content;
      this.totalPages = response.totalPages;
    } catch (error) {
      console.error('Erro ao listar processos:', error);
    }
  }

  async salvarProcesso() {
    try {
      if (this.processo.id) {
        await this.processoService.atualizarProcesso(this.processo.id, this.processo);
      } else {
        
        await this.processoService.criarProcesso(this.processo, this.processo.documento!);
      }
      this.processo = {}; 
      await this.listarProcessos();
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
    }
  }
  

  abrirDetalhes(processo: any) {
    this.selectedProcesso = processo;
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.listarProcessos();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.listarProcessos();
    }
  }

  trackByProcessoId(index: number, processo: any) {
    return processo.id;
  }
  

  // async carregarEstados() {
  //   try {
  //     this.estados = await this.ibgeService.listarEstados();
  //   } catch (error) {
  //     console.error('Erro ao carregar estados:', error);
  //   }
  // }

  // async carregarMunicipios() {
  //   if (this.processo.uf) {
  //     try {
  //       this.municipios = await this.ibgeService.listarMunicipios(this.processo.uf);
  //     } catch (error) {
  //       console.error('Erro ao carregar municípios:', error);
  //     }
  //   }
  // }

  
  voltar(): void {
    this.router.navigate(['/']); // Navega para a rota principal
  }
}
