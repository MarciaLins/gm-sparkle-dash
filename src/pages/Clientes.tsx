import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: clientes } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const filteredClientes = (clientes || []).filter((cliente) =>
    (cliente.nome_cliente?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.email_contato?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (cliente.telefone_contato || '').includes(searchTerm)
  );

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Meus Clientes</h1>
          <p className="text-muted-foreground mt-2">Gerencie sua base de clientes</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.length > 0 ? (
                  filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nome_cliente}</TableCell>
                      <TableCell>{cliente.telefone_contato}</TableCell>
                      <TableCell>{cliente.email_contato}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Clientes;
