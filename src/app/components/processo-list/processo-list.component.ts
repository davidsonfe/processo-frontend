import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessoService } from '../../services/processo.service';
import { Processo } from '../../models/processo.model';
import { FormsModule } from '@angular/forms';
import { IbgeService } from '../../services/ibge.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-processo-list',
  templateUrl: './processo-list.component.html',
  styleUrls: ['./processo-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ProcessoListComponent implements OnInit {
  ufs: string[] = [];
  processos: Processo[] = [];
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;

  processo: Processo = {
    npu: '',
    dataCadastro: new Date().toISOString().split('T')[0], 
    municipio: '',
    uf: '',
    documento: undefined, 
  };
  modoEdicao: boolean = false;
  modoCadastro: boolean = false;
  loading: boolean = false;
  municipios: any[] | undefined;

  constructor(private ibgeService: IbgeService, private processoService: ProcessoService) {}

  ngOnInit(): void {
    this.carregarProcessos();
    this.carregarUfs();
  }

  carregarUfs(): void {
    this.ibgeService.getUfs().subscribe({
      next: (response) => {
        this.ufs = response;
        console.log('UFs carregadas:', this.ufs);
      },
      error: (error) => console.error('Erro ao carregar UFs:', error),
    });
  }
  
  async carregarMunicipios(): Promise<void> {
    if (this.processo.uf) {
      console.log('UF selecionada:', this.processo.uf);
  
      try {
        const response: any[] = await lastValueFrom(this.ibgeService.getMunicipios(this.processo.uf));
  
        // Verifica se os dados são objetos ou strings
        if (response.length > 0 && typeof response[0] === 'object' && 'nome' in response[0]) {
          // Caso seja um array de objetos, extrai os nomes
          this.municipios = response.map((municipio: { nome: string }) => municipio.nome);
        } else if (response.length > 0 && typeof response[0] === 'string') {
          // Caso seja um array de strings, usa diretamente
          this.municipios = response as string[];
        } else {
          // Caso contrário, define como vazio
          this.municipios = [];
        }
  
        console.log(`Municípios carregados para ${this.processo.uf}:`, this.municipios);
      } catch (error) {
        console.error('Erro ao carregar municípios:', error);
      }
    }
  }
  
  

  async carregarProcessos(page: number = 0): Promise<void> {
    this.loading = true;
    try {
      const response = await this.processoService.listarProcessos(page, this.pageSize);
      console.log('Resposta da API:', response); // Depuração
      this.processos = response.content;
      this.totalPages = response.totalPages;
      this.currentPage = response.number;
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    } finally {
      this.loading = false;
    }
  }

  abrirFormularioCadastro(processoEdicao?: any): void {
    if (processoEdicao) {
      this.modoCadastro = false;
      this.modoEdicao = true;
      this.processo = { 
        ...processoEdicao 
      };

      if (this.processo.dataCadastro) {
        this.processo.dataCadastro = this.processo.dataCadastro.split('T')[0];
      }
    } else {
      this.modoCadastro = true;
      this.modoEdicao = false;
      this.processo = {
        npu: '',
        dataCadastro: new Date().toISOString().split('T')[0], 
        municipio: '',
        uf: '',
        documento: undefined, 
      };
    }
  }

  fecharFormulario(): void {
    this.modoCadastro = false;
    this.modoEdicao = false;
    this.processo = {
      npu: '',
      dataCadastro: new Date().toISOString().split('T')[0],
      municipio: '',
      uf: '',
      documento: undefined, 
    };
  }

  formatarDataCadastro() {
    if (this.processo.dataCadastro) {
      const data = new Date(this.processo.dataCadastro);
      this.processo.dataCadastro = data.toISOString().split('T')[0]; 
    }
  }

  async salvarProcesso(): Promise<void> {
    this.loading = true;
    try {
      if (this.modoEdicao && this.processo.id) {
        await this.processoService.atualizarProcesso(this.processo.id, this.processo);
        if (this.processo.documento) {
          await this.processoService.uploadArquivo(this.processo.id, this.processo.documento);
        }
      } else {
        const processoCriado = await this.processoService.criarProcesso(this.processo, this.processo.documento!);
        if (this.processo.documento) {
          if (processoCriado.id !== undefined) {
            await this.processoService.uploadArquivo(processoCriado.id, this.processo.documento);
          } else {
            console.error('ID do processo criado é indefinido.');
          }
        }
      }
      this.fecharFormulario();
      this.carregarProcessos();
      alert('Processo salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar processo:', error);
      alert('Erro ao salvar processo. Verifique o console para mais detalhes.');
    } finally {
      this.loading = false;
    }
  }

  abrirDetalhes(processo: Processo): void {
    this.modoEdicao = true;
    this.modoCadastro = false;
    this.processo = { ...processo };

    if (this.processo.dataCadastro) {
      this.processo.dataCadastro = this.processo.dataCadastro.split('T')[0]; 
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.carregarProcessos(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.carregarProcessos(this.currentPage - 1);
    }
  }

  async deletarProcesso(npu: string | undefined): Promise<void> {
    console.log('NPU recebido:', npu); // Depuração
    if (!npu) {
        console.error('NPU do processo é indefinido.');
        alert('NPU do processo é inválido. Não foi possível excluir.');
        return;
    }
    try {
        await this.processoService.deletarProcessoPorNpu(npu); 
        this.carregarProcessos(); 
        alert('Processo excluído com sucesso!');
    } catch (error) {
        console.error(`Erro ao deletar processo com NPU ${npu}:`, error);
        alert('Erro ao excluir processo. Verifique o console para mais detalhes.');
    }
}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.processo.documento = file; 
    } else {
      alert('Por favor, selecione um arquivo PDF.');
    }
  }
}
