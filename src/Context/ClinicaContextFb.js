import { useState, useEffect, createContext, useContext } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // Certifique-se de apontar para a configuração correta

const ClinicaContext = createContext();

export const ClinicaProvider = ({ children }) => {
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [clinicas, setClinicas] = useState([]);

  // Função para carregar dados de uma coleção
  const carregarDados = async (colecao, setState) => {
    try {
      const snapshot = await getDocs(collection(db, colecao));
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id, // O ID do documento gerado automaticamente
        ...doc.data(),
      }));
      setState(dados);
    } catch (error) {
      console.error(`Erro ao carregar dados de ${colecao}:`, error);
    }
  };

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarDados("pacientes", setPacientes);
    carregarDados("medicos", setMedicos);
    carregarDados("clinicas", setClinicas);
  }, []);

  // Funções CRUD
  const adicionarPaciente = async (novoPaciente) => {
    try {
      const docRef = await addDoc(collection(db, "pacientes"), novoPaciente);
      setPacientes((prev) => [...prev, { id: docRef.id, ...novoPaciente }]);
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
    }
  };

  const atualizarPaciente = async (id, dadosAtualizados) => {
    try {
      await updateDoc(doc(db, "pacientes", id), dadosAtualizados);
      setPacientes((prev) =>
        prev.map((paciente) =>
          paciente.id === id ? { ...paciente, ...dadosAtualizados } : paciente
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar paciente:", error);
    }
  };

  const removerPaciente = async (id) => {
    try {
      await deleteDoc(doc(db, "pacientes", id));
      setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
    } catch (error) {
      console.error("Erro ao remover paciente:", error);
    }
  };

  const adicionarMedico = async (novoMedico) => {
    try {
      const docRef = await addDoc(collection(db, "medicos"), novoMedico);
      setMedicos((prev) => [...prev, { id: docRef.id, ...novoMedico }]);
    } catch (error) {
      console.error("Erro ao adicionar médico:", error);
    }
  };

  const atualizarMedico = async (id, dadosAtualizados) => {
    try {
      await updateDoc(doc(db, "medicos", id), dadosAtualizados);
      setMedicos((prev) =>
        prev.map((medico) =>
          medico.id === id ? { ...medico, ...dadosAtualizados } : medico
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar médico:", error);
    }
  };

  const removerMedico = async (id) => {
    try {
      await deleteDoc(doc(db, "medicos", id));
      setMedicos((prev) => prev.filter((medico) => medico.id !== id));
    } catch (error) {
      console.error("Erro ao remover médico:", error);
    }
  };

  const adicionarClinica = async (novaClinica) => {
    try {
      const docRef = await addDoc(collection(db, "clinicas"), novaClinica);
      setClinicas((prev) => [...prev, { id: docRef.id, ...novaClinica }]);
    } catch (error) {
      console.error("Erro ao adicionar clínica:", error);
    }
  };

  const atualizarClinica = async (id, dadosAtualizados) => {
    try {
      await updateDoc(doc(db, "clinicas", id), dadosAtualizados);
      setClinicas((prev) =>
        prev.map((clinica) =>
          clinica.id === id ? { ...clinica, ...dadosAtualizados } : clinica
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar clínica:", error);
    }
  };

  const removerClinica = async (id) => {
    try {
      await deleteDoc(doc(db, "clinicas", id));
      setClinicas((prev) => prev.filter((clinica) => clinica.id !== id));
    } catch (error) {
      console.error("Erro ao remover clínica:", error);
    }
  };

  // Funções de busca por ID
  const buscarPacientePorId = async (id) => {
    try {
      const docRef = doc(db, "pacientes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error("Paciente não encontrado!");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar paciente:", error);
      return null;
    }
  };

  const buscarMedicoPorId = async (id) => {
    try {
      const docRef = doc(db, "medicos", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error("Médico não encontrado!");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar médico:", error);
      return null;
    }
  };

  const buscarClinicaPorId = async (id) => {
    try {
      const docRef = doc(db, "clinicas", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.error("Clínica não encontrada!");
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar clínica:", error);
      return null;
    }
  };

  return (
    <ClinicaContext.Provider
      value={{
        pacientes,
        medicos,
        clinicas,
        adicionarPaciente,
        atualizarPaciente,
        removerPaciente,
        adicionarMedico,
        atualizarMedico,
        removerMedico,
        adicionarClinica,
        atualizarClinica,
        removerClinica,
        buscarPacientePorId,
        buscarMedicoPorId,
        buscarClinicaPorId,
      }}
    >
      {children}
    </ClinicaContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useClinica = () => useContext(ClinicaContext);

// // Configuração do Firebase (substitua com suas credenciais)
// const firebaseConfig = {
//   apiKey: "AIzaSyBru30cnhERZUj0FByaU6FjT0aOTav9pLk",
//   authDomain: "medapp-4cca2.firebaseapp.com",
//   projectId: "medapp-4cca2",
//   storageBucket: "medapp-4cca2.firebasestorage.app",
//   messagingSenderId: "846443970623",
//   appId: "1:846443970623:web:70ed4a1a5cee9fd3ba788a",
//   measurementId: "G-YSEHKGL1TW",
//   // ... outros detalhes de configuração
// };
