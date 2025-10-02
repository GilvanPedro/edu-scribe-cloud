import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Aluno, AlunoFormData } from '@/types/aluno';

interface AlunoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (aluno: AlunoFormData) => Promise<void>;
  aluno?: Aluno | null;
}

export function AlunoModal({ open, onClose, onSave, aluno }: AlunoModalProps) {
  const [formData, setFormData] = useState<AlunoFormData>({
    nome: '',
    matricula: '',
    email: '',
    data_nascimento: '',
    telefone: '',
    endereco: '',
    curso: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (aluno) {
      setFormData({
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email,
        data_nascimento: aluno.data_nascimento,
        telefone: aluno.telefone || '',
        endereco: aluno.endereco || '',
        curso: aluno.curso || '',
      });
    } else {
      setFormData({
        nome: '',
        matricula: '',
        email: '',
        data_nascimento: '',
        telefone: '',
        endereco: '',
        curso: '',
      });
    }
  }, [aluno, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {aluno ? 'Editar Aluno' : 'Novo Aluno'}
          </DialogTitle>
          <DialogDescription>
            {aluno ? 'Atualize as informações do aluno' : 'Preencha os dados do novo aluno'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                placeholder="Ex: João Silva"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula *</Label>
              <Input
                id="matricula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                required
                placeholder="Ex: 2024001"
                className="transition-smooth"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="email@exemplo.com"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData({ ...formData, data_nascimento: e.target.value })}
                required
                className="transition-smooth"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curso">Curso</Label>
              <Input
                id="curso"
                value={formData.curso}
                onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                placeholder="Ex: Engenharia"
                className="transition-smooth"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
              placeholder="Rua, número, bairro, cidade"
              className="transition-smooth"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-gradient-primary hover:opacity-90">
              {isLoading ? 'Salvando...' : aluno ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
