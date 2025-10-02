import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-6 shadow-glow animate-scale-in">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Sistema de Gerenciamento de Alunos
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Gerencie seus alunos de forma simples, rápida e eficiente com nossa plataforma moderna
          </p>
          
          <div className="flex gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-lg"
            >
              Começar Agora
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline"
              className="text-lg px-8 py-6"
            >
              Fazer Login
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Gestão Completa</h3>
              <p className="text-muted-foreground text-sm">
                CRUD completo com todas as operações necessárias para gerenciar seus alunos
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Interface Moderna</h3>
              <p className="text-muted-foreground text-sm">
                Design limpo e intuitivo para facilitar o dia a dia da gestão educacional
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md border hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Seguro e Confiável</h3>
              <p className="text-muted-foreground text-sm">
                Sistema seguro com autenticação e proteção de dados dos seus alunos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
