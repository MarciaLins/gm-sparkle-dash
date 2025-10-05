export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alocacao_equipe: {
        Row: {
          created_at: string | null
          id: number
          id_evento: number | null
          id_membro_equipe: number | null
          valor_acordado: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_evento?: number | null
          id_membro_equipe?: number | null
          valor_acordado?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_evento?: number | null
          id_membro_equipe?: number | null
          valor_acordado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "alocacao_equipe_id_evento_fkey"
            columns: ["id_evento"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alocacao_equipe_id_membro_equipe_fkey"
            columns: ["id_membro_equipe"]
            isOneToOne: false
            referencedRelation: "equipe"
            referencedColumns: ["id"]
          },
        ]
      }
      cliente: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      clientes: {
        Row: {
          created_at: string | null
          email_contato: string | null
          id: number
          nome_cliente: string | null
          observacoes_ia: string | null
          telefone_contato: string | null
        }
        Insert: {
          created_at?: string | null
          email_contato?: string | null
          id?: number
          nome_cliente?: string | null
          observacoes_ia?: string | null
          telefone_contato?: string | null
        }
        Update: {
          created_at?: string | null
          email_contato?: string | null
          id?: number
          nome_cliente?: string | null
          observacoes_ia?: string | null
          telefone_contato?: string | null
        }
        Relationships: []
      }
      equipe: {
        Row: {
          created_at: string | null
          funcao_membro: string | null
          id: number
          nome_membro: string | null
          tipo_pagamento: string | null
          valor_pagamento: number | null
        }
        Insert: {
          created_at?: string | null
          funcao_membro?: string | null
          id?: number
          nome_membro?: string | null
          tipo_pagamento?: string | null
          valor_pagamento?: number | null
        }
        Update: {
          created_at?: string | null
          funcao_membro?: string | null
          id?: number
          nome_membro?: string | null
          tipo_pagamento?: string | null
          valor_pagamento?: number | null
        }
        Relationships: []
      }
      eventos: {
        Row: {
          created_at: string | null
          custo_total_estimado: number | null
          data_fim: string | null
          data_inicio: string | null
          id: number
          id_cliente: number | null
          local_evento: string | null
          lucro_liquido_estimado: number | null
          margem_lucro_percentual: number | null
          nome_evento: string | null
          status_evento: string | null
          tipo_evento: string | null
          valor_minimo_negociacao: number | null
          valor_proposta_final: number | null
          valor_sugerido_ia: number | null
        }
        Insert: {
          created_at?: string | null
          custo_total_estimado?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: number
          id_cliente?: number | null
          local_evento?: string | null
          lucro_liquido_estimado?: number | null
          margem_lucro_percentual?: number | null
          nome_evento?: string | null
          status_evento?: string | null
          tipo_evento?: string | null
          valor_minimo_negociacao?: number | null
          valor_proposta_final?: number | null
          valor_sugerido_ia?: number | null
        }
        Update: {
          created_at?: string | null
          custo_total_estimado?: number | null
          data_fim?: string | null
          data_inicio?: string | null
          id?: number
          id_cliente?: number | null
          local_evento?: string | null
          lucro_liquido_estimado?: number | null
          margem_lucro_percentual?: number | null
          nome_evento?: string | null
          status_evento?: string | null
          tipo_evento?: string | null
          valor_minimo_negociacao?: number | null
          valor_proposta_final?: number | null
          valor_sugerido_ia?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro: {
        Row: {
          categoria: string | null
          created_at: string | null
          descricao: string | null
          id: number
          id_evento: number | null
          status: string | null
          tipo: string | null
          valor: number | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          id_evento?: number | null
          status?: string | null
          tipo?: string | null
          valor?: number | null
        }
        Update: {
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: number
          id_evento?: number | null
          status?: string | null
          tipo?: string | null
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_id_evento_fkey"
            columns: ["id_evento"]
            isOneToOne: false
            referencedRelation: "eventos"
            referencedColumns: ["id"]
          },
        ]
      }
      lista_espera: {
        Row: {
          created_at: string | null
          data_desejada: string | null
          id: number
          id_cliente: number | null
        }
        Insert: {
          created_at?: string | null
          data_desejada?: string | null
          id?: number
          id_cliente?: number | null
        }
        Update: {
          created_at?: string | null
          data_desejada?: string | null
          id?: number
          id_cliente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lista_espera_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      pacotes_servicos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          descricao: string
          detalhes: string[] | null
          id: number
          nome: string
          ordem_exibicao: number
          preco_base: number
          preco_tipo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao: string
          detalhes?: string[] | null
          id?: never
          nome: string
          ordem_exibicao?: number
          preco_base: number
          preco_tipo: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao?: string
          detalhes?: string[] | null
          id?: never
          nome?: string
          ordem_exibicao?: number
          preco_base?: number
          preco_tipo?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      propostas: {
        Row: {
          created_at: string
          data_evento: string | null
          detalhes_conversa: Json | null
          email_cliente: string
          id: number
          local_evento: string | null
          nome_cliente: string
          observacoes: string | null
          status: string
          telefone_cliente: string | null
          tipo_evento: string
          updated_at: string
          valor_proposta: number | null
        }
        Insert: {
          created_at?: string
          data_evento?: string | null
          detalhes_conversa?: Json | null
          email_cliente: string
          id?: never
          local_evento?: string | null
          nome_cliente: string
          observacoes?: string | null
          status?: string
          telefone_cliente?: string | null
          tipo_evento: string
          updated_at?: string
          valor_proposta?: number | null
        }
        Update: {
          created_at?: string
          data_evento?: string | null
          detalhes_conversa?: Json | null
          email_cliente?: string
          id?: never
          local_evento?: string | null
          nome_cliente?: string
          observacoes?: string | null
          status?: string
          telefone_cliente?: string | null
          tipo_evento?: string
          updated_at?: string
          valor_proposta?: number | null
        }
        Relationships: []
      }
      servicos: {
        Row: {
          created_at: string | null
          id: number
          nome_servico: string | null
          preco_base: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nome_servico?: string | null
          preco_base?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nome_servico?: string | null
          preco_base?: number | null
        }
        Relationships: []
      }
      sofia_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          sofia_response: string | null
          user_message: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          sofia_response?: string | null
          user_message: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          sofia_response?: string | null
          user_message?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
