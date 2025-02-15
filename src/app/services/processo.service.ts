import { Injectable } from '@angular/core';
import axios from 'axios';
import { Processo } from '../models/processo.model';

@Injectable({
  providedIn: 'root',
})
export class ProcessoService {
  private apiUrl = 'http://localhost:8080/processos'; 

 
  async listarProcessos(page: number = 0, size: number = 10): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}`, { params: { page, size } });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error(`Erro da API (${error.response.status}):`, error.response.data);
      } else if (error.request) {
        console.error('Erro de conexão com a API:', error.message);
      } else {
        console.error('Erro inesperado:', error.message);
      }
      throw error;
    }
  }

  
  async criarProcesso(processo: Processo, arquivo: File): Promise<Processo> {
    if (!(arquivo instanceof File)) {
      throw new Error('O arquivo enviado não é válido.');
    }
  
    const formData = new FormData();
    formData.append('npu', processo.npu);
    
    
    const dataCadastro = new Date(processo.dataCadastro);
    formData.append('dataCadastro', dataCadastro.toISOString().split('T')[0]); 
  
    formData.append('municipio', processo.municipio);
    formData.append('uf', processo.uf);
    formData.append('documento', arquivo); 
  
    try {
      const response = await axios.post(this.apiUrl, formData);
      console.log('Processo criado com sucesso:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Erro da API:', error.response.status);
        console.error('Resposta da API:', error.response.data);
      } else {
        const err = error as Error;
        console.error('Erro inesperado:', err.message);
      }
      throw error;
    }
  }
  

  
  async atualizarProcesso(id: number, processo: Processo): Promise<void> {
    try {
      await axios.put(`${this.apiUrl}/${id}`, processo);
      console.log(`Processo com ID ${id} atualizado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao atualizar processo com ID ${id}:`, error);
      throw error;
    }
  }

  
  async deletarProcessoPorNpu(npu: string): Promise<void> {
    try {
        await axios.delete(`${this.apiUrl}/npu/${npu}`); 
    } catch (error) {
        console.error('Erro ao deletar processo por NPU:', error);
        throw error;
    }
}

  
  async uploadArquivo(idProcesso: number, arquivo: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', arquivo); 
  
    try {
      const response = await axios.post(`${this.apiUrl}/${idProcesso}/upload`, formData, {
        headers: {
         // 'Content-Type': 'multipart/form-data',
        },
      });
      console.log(`Arquivo enviado com sucesso para o processo com ID ${idProcesso}:`, response.data);
    } catch (error) {
      console.error(`Erro ao enviar arquivo para o processo com ID ${idProcesso}:`, error);
      throw error;
    }
  }
  
}
