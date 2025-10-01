// Página de teste extremamente simples para o Visual Editor
export default function TestVisualEditor() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Teste do Visual Editor
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        Esta é uma página de teste com elementos HTML puros.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Card 1</h2>
          <p className="text-muted-foreground">
            Tente selecionar este card com o Visual Editor.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Card 2</h2>
          <p className="text-muted-foreground">
            Este é outro card de teste simples.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <button className="bg-accent text-accent-foreground px-6 py-3 rounded-md hover:bg-accent/90">
          Botão de Teste
        </button>
      </div>

      <div className="mt-8 bg-secondary p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Seção de Teste
        </h3>
        <p className="text-muted-foreground">
          Todos os elementos desta página são estáticos e não dependem de React Query, Supabase ou qualquer estado dinâmico.
        </p>
      </div>
    </div>
  );
}
