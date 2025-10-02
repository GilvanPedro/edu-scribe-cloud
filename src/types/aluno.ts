export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  data_nascimento: string;
  telefone?: string;
  endereco?: string;
  curso?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export type AlunoFormData = Omit<Aluno, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
