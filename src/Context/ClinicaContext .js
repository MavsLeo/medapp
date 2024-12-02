import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Contexto da Clínica
const ClinicaContext = createContext();

// Provider do contexto
export const ClinicaProvider = ({ children }) => {
  // Estados iniciais com estruturas mais completas
  const [pacientes, setPacientes] = useState(() => {
    // Recuperar dados do localStorage na inicialização
    const savedPacientes = localStorage.getItem('pacientes');
    return savedPacientes 
      ? JSON.parse(savedPacientes) 
      : [
        {
          id: uuidv4(),
          nome: 'João Silva',
          dataNascimento: '1978-05-15',
          email: 'joao.silva@email.com',
          telefone: '(11) 98765-4321',
          riscoCardiaco: 'Alto',
          medicacoes: [
            { nome: 'Metoprolol', dosagem: '50mg' },
            { nome: 'Atorvastatina', dosagem: '20mg' }
          ],
          observacoesDoMedico: "Manter dieta e exercícios regulares. Monitorar pressão arterial.",
          historicoConsultas: []
        }
      ];
  });
  const [medicos, setMedicos] = useState(() => {
    // Recuperar dados do localStorage na inicialização
    const savedmedicos = localStorage.getItem('medicos');
    return savedmedicos 
      ? JSON.parse(savedmedicos) 
      : [
        {
          id: uuidv4(), // identificador único
          nome: 'Dr. Henrique José Portela Junior', // nome completo do médico
          nomeSocial: 'Dr. João', // nome social ou como prefere ser chamado
          especialidade: 'Cardiologia', // especialidade médica
          crm: '12345-RJ', // número do Conselho Regional de Medicina
          email: 'joao.silva@clinica.com.br', // email profissional
          telefone: '21987654321', // telefone profissional
          dataNascimento: '1980-05-15', // data de nascimento
          genero: 'Masculino', // gênero
          fotoPerfil: 'url_da_foto', // URL da foto do médico (opcional)
          consultorioId: 'uuid_da_clinica', // ID da clínica onde trabalha
          diasAtendimento: ['segunda', 'quarta', 'sexta'], // dias de atendimento
          horariosAtendimento: {
            inicio: '08:00',
            fim: '18:00'
          },
          planosSaude: ['Unimed', 'Bradesco Saúde'], // planos de saúde atendidos
          valorConsulta: 250.00, // valor da consulta
          formacao: [
            {
              instituicao: 'Universidade Federal do Rio de Janeiro',
              curso: 'Medicina',
              anoFormacao: 2005
            }
          ],
          especializacoes: [
            'Cardiologia Intervencionista',
            'Ergometria'
          ],
          ativo: true // status de atividade do médico
        }
      ];
  });

  const [consultas, setConsultas] = useState(() => {
    const savedConsultas = localStorage.getItem('consultas');
    return savedConsultas 
      ? JSON.parse(savedConsultas) 
      : [];
  });

  const [clinicas, setClinicas] = useState(() => {
    // Recuperar dados do localStorage na inicialização
    const savedClinicas = localStorage.getItem('Clinicas');
    return savedClinicas 
      ? JSON.parse(savedClinicas) 
      : [
        {
          id: uuidv4(),
          nome: 'Hospital do Coração e Clinicas de Nova Iguaçu EMCOR',
          nomeResumo: 'Hospital EMCOR',
          cnpj: ' 32074452000104',
          email: 'atendimento@hospitalemcor.com.br',
          telefone: '2137598100',
          Endereço: 'Rua Nelson Ramos',
          numero: '733',
          uf:'RJ',
          cidade: 'Nova Iguaçu',
          bairro: 'Centro',
          CEP: "26210140"

        }
      ];
  });

  // Salvar no localStorage sempre que pacientes ou consultas mudarem
  useEffect(() => {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
  }, [pacientes]);

  useEffect(() => {
    localStorage.setItem('consultas', JSON.stringify(consultas));
  }, [consultas]);

  useEffect(() => {
    localStorage.setItem('clinicas', JSON.stringify(clinicas));
  }, [clinicas]);
  useEffect(() => {
    localStorage.setItem('medicos', JSON.stringify(medicos));
  }, [medicos]);

  // Funções de gerenciamento de pacientes
  const adicionarPaciente = (novoPaciente) => {
    const pacienteComId = {
      ...novoPaciente,
      id: uuidv4(), // Gera um ID único
      dataCadastro: new Date().toISOString(),
      observacaoDoMedico: novoPaciente.observacaoDoMedico || '',
      historicoConsultas: []
    };
    setPacientes([...pacientes, pacienteComId]);
    return pacienteComId;
  };

  const atualizarPaciente = (id, dadosAtualizados) => {
    setPacientes(pacientes.map(paciente => 
      paciente.id === id 
        ? { 
            ...paciente, 
            ...dadosAtualizados,
            dataUltimaAtualizacao: new Date().toISOString() 
          } 
        : paciente
    ));
  };

  const removerPaciente = (id) => {
    setPacientes(pacientes.filter(paciente => paciente.id !== id));
  };

  // Funções de gerenciamento de consultas
  const agendarConsulta = (pacienteId, dadosConsulta) => {
    const novaConsulta = {
      id: uuidv4(),
      pacienteId,
      dataAgendamento: new Date().toISOString(),
      ...dadosConsulta,
      status: 'Agendada'
    };

    // Adiciona consulta à lista de consultas
    setConsultas([...consultas, novaConsulta]);

    // Atualiza histórico de consultas do paciente
    setPacientes(pacientes.map(paciente => 
      paciente.id === pacienteId
        ? { 
            ...paciente, 
            historicoConsultas: [...(paciente.historicoConsultas || []), novaConsulta]
          }
        : paciente
    ));

    return novaConsulta;
  };

  const atualizarStatusConsulta = (consultaId, novoStatus) => {
    const consultasAtualizadas = consultas.map(consulta => 
      consulta.id === consultaId 
        ? { ...consulta, status: novoStatus }
        : consulta
    );
    setConsultas(consultasAtualizadas);
  };

  // Funções de busca
  const buscarPacientePorId = (id) => {
    return pacientes.find(paciente => paciente.id === id);
  };

  const buscarConsultasPaciente = (pacienteId) => {
    return consultas.filter(consulta => consulta.pacienteId === pacienteId);
  };

  return (
    <ClinicaContext.Provider value={{
      // Estados
      pacientes,
      consultas,
      clinicas,
      medicos,

      // Funções de Pacientes
      adicionarPaciente,
      atualizarPaciente,
      removerPaciente,
      buscarPacientePorId,

      // Funções de Consultas
      agendarConsulta,
      atualizarStatusConsulta,
      buscarConsultasPaciente,

      // Setters diretos (caso precise)
      setPacientes,
      setConsultas,
      setClinicas,
      setMedicos
    }}>
      {children}
    </ClinicaContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useClinica = () => useContext(ClinicaContext);

// Exemplo de componente usando o contexto
export const ExemploPacientes = () => {
  const { 
    pacientes, 
    adicionarPaciente, 
    agendarConsulta 
  } = useClinica();

  const handleAdicionarPaciente = () => {
    const novoPaciente = {
      nome: 'Maria Souza',
      dataNascimento: '1985-03-22',
      email: 'maria.souza@email.com'
    };

    const pacienteCriado = adicionarPaciente(novoPaciente);
    
    // Agendar primeira consulta
    agendarConsulta(pacienteCriado.id, {
      tipo: 'Consulta Inicial',
      data: new Date('2024-07-15').toISOString()
    });
  };

  return (
    <div>
      <h2>Pacientes Cadastrados</h2>
      {pacientes.map(paciente => (
        <div key={paciente.id}>
          {paciente.nome} - {paciente.riscoCardiaco || 'Sem avaliação'}
        </div>
      ))}
      <button onClick={handleAdicionarPaciente}>
        Adicionar Paciente
      </button>
    </div>
  );
};