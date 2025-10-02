import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlunoModal } from '@/components/AlunoModal';
import { AlunosTable } from '@/components/AlunosTable';
import { toast } from 'sonner';
import { Aluno, AlunoFormData } from '@/types/aluno';
import { GraduationCap, Plus, LogOut, Users } from 'lucide-react';
import { User, Session } from '@supabase/supabase-js';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAlunos();
    }
  }, [user]);

  const fetchAlunos = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlunos(data || []);
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao carregar alunos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAluno = async (formData: AlunoFormData) => {
    if (!user) return;

    try {
      if (selectedAluno) {
        const { error } = await supabase
          .from('alunos')
          .update(formData)
          .eq('id', selectedAluno.id);

        if (error) throw error;
        toast.success('Aluno atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('alunos')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) {
          if (error.code === '23505') {
            toast.error('Esta matrícula já está cadastrada');
            throw error;
          }
          throw error;
        }
        toast.success('Aluno cadastrado com sucesso!');
      }
      fetchAlunos();
      setIsModalOpen(false);
      setSelectedAluno(null);
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      if (!error || !(error as any).code) {
        toast.error('Erro ao salvar aluno');
      }
      throw error;
    }
  };

  const handleDeleteAluno = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      const { error } = await supabase.from('alunos').delete().eq('id', id);

      if (error) throw error;
      toast.success('Aluno excluído com sucesso!');
      fetchAlunos();
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      toast.error('Erro ao excluir aluno');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  const handleNewAluno = () => {
    setSelectedAluno(null);
    setIsModalOpen(true);
  };

  const handleEditAluno = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsModalOpen(true);
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sistema de Gerenciamento</h1>
              <p className="text-sm text-muted-foreground">Gestão de Alunos</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-primary text-primary-foreground shadow-glow border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Bem-vindo de volta!</CardTitle>
                  <CardDescription className="text-primary-foreground/90">
                    Gerencie seus alunos de forma simples e eficiente
                  </CardDescription>
                </div>
                <div className="bg-white/20 rounded-full p-4">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-lg p-4 flex-1">
                  <p className="text-sm text-primary-foreground/80">Total de Alunos</p>
                  <p className="text-3xl font-bold mt-1">{alunos.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Alunos</CardTitle>
                <CardDescription>Visualize e gerencie todos os alunos cadastrados</CardDescription>
              </div>
              <Button onClick={handleNewAluno} className="bg-gradient-primary hover:opacity-90 gap-2">
                <Plus className="w-4 h-4" />
                Novo Aluno
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Carregando alunos...</p>
              </div>
            ) : (
              <AlunosTable alunos={alunos} onEdit={handleEditAluno} onDelete={handleDeleteAluno} />
            )}
          </CardContent>
        </Card>
      </main>

      <AlunoModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAluno(null);
        }}
        onSave={handleSaveAluno}
        aluno={selectedAluno}
      />
    </div>
  );
}
