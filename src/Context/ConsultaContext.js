import React, { createContext, useState } from "react";
const ConsultaContext = createContext;

export const ConsultaProvider = ({ children }) => {
  const [consultas, setConsultas] = useState(() => {
    const savedConsultas = localStorage.getItem("consultas");
    return savedConsultas ? JSON.parse(savedConsultas) : [];
  });
  const agendarConsulta = (pacienteId, dadosConsulta) => {
    const novaConsulta = {
      id: uuidv4(),
      pacienteId,
      dataAgendamento: new Date().toISOString(),
      ...dadosConsulta,
      status: "Agendada",
    };

    // Adiciona consulta à lista de consultas
    setConsultas([...consultas, novaConsulta]);

    // Atualiza histórico de consultas do paciente
    setPacientes(
      pacientes.map((paciente) =>
        paciente.id === pacienteId
          ? {
              ...paciente,
              historicoConsultas: [
                ...(paciente.historicoConsultas || []),
                novaConsulta,
              ],
            }
          : paciente
      )
    );

    return novaConsulta;
  };

  const atualizarStatusConsulta = (consultaId, novoStatus) => {
    const consultasAtualizadas = consultas.map((consulta) =>
      consulta.id === consultaId
        ? { ...consulta, status: novoStatus }
        : consulta
    );
    setConsultas(consultasAtualizadas);
  };

  const buscarConsultasPaciente = (pacienteId) => {
    return consultas.filter((consulta) => consulta.pacienteId === pacienteId);
  };
  return (
    <ConsultaContext.Provider
      value={{
        // Estados
        consultas,
        // Funções de Consultas
        agendarConsulta,
        atualizarStatusConsulta,
        buscarConsultasPaciente,

        // Setters diretos (caso precise)
        setConsultas,
      }}
    >
      {children}
    </ConsultaContext.Provider>
  );
};
