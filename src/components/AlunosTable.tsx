import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { Aluno } from '@/types/aluno';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlunosTableProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: string) => void;
}

export function AlunosTable({ alunos, onEdit, onDelete }: AlunosTableProps) {
  if (alunos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum aluno cadastrado ainda.</p>
        <p className="text-muted-foreground text-sm mt-2">Clique em "Novo Aluno" para começar.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Matrícula</TableHead>
            <TableHead className="font-semibold">Nome</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Telefone</TableHead>
            <TableHead className="font-semibold">Curso</TableHead>
            <TableHead className="font-semibold">Data Nasc.</TableHead>
            <TableHead className="text-right font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id} className="hover:bg-muted/30 transition-smooth">
              <TableCell className="font-medium">{aluno.matricula}</TableCell>
              <TableCell>{aluno.nome}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{aluno.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {aluno.telefone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{aluno.telefone}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>{aluno.curso || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {format(new Date(aluno.data_nascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(aluno)}
                    className="hover:bg-primary hover:text-primary-foreground transition-smooth"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(aluno.id)}
                    className="hover:bg-destructive hover:text-destructive-foreground transition-smooth"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
