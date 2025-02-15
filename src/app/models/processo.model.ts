export interface Processo {
    id?: number; 
    npu: string;
    dataCadastro: string; 
    dataVisualizacao?: string | null; 
    municipio: string;
    uf: string;
    documento: File | undefined; 
  }