import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Importações do contexto e hooks
import { useClinica } from "../../Context/ClinicaContextFb";

const ConsultasPage = () => {
  // Estados e contexto
  const {
    consultas,
    adicionarConsulta,
    atualizarConsulta,
    removerConsulta,
    pacientes, // eslint-disable-next-line
    buscarPacientePorId,
    atualizarPaciente,
  } = useClinica();

  // Estados para gerenciamento do modal
  const [openModal, setOpenModal] = useState(false);
  const [consultaAtual, setConsultaAtual] = useState({
    pacienteId: "",
    data: "",
    hora: "",
    especialidade: "",
    status: "Agendada",
  });
  const [modoEdicao, setModoEdicao] = useState(false);

  // Funções de manipulação
  const handleAbrirModal = (consulta = null) => {
    if (consulta) {
      setConsultaAtual(consulta);
      setModoEdicao(true);
    } else {
      setConsultaAtual({
        pacienteId: "",
        data: "",
        hora: "",
        especialidade: "",
        status: "Agendada",
      });
      setModoEdicao(false);
    }
    setOpenModal(true);
  };

  const handleFecharModal = () => {
    setOpenModal(false);
  };

  const handleSalvarConsulta = async () => {
    try {
      // Encontra o paciente da consulta atual
      const paciente = pacientes.find((p) => p.id === consultaAtual.pacienteId);

      if (modoEdicao) {
        // Verifica mudança de status
        const consultaOriginal = consultas.find(
          (c) => c.id === consultaAtual.id
        );

        // Se estava agendada e mudou para concluída
        if (
          consultaOriginal.status === "Agendada" &&
          consultaAtual.status === "Concluída"
        ) {
          // Atualiza dataUltimaConsulta com a data da consulta
          await atualizarPaciente(paciente.id, {
            dataUltimaConsulta: consultaAtual.data,
          });
        }

        // Se estava sem agendamento e mudou para agendada
        if (
          consultaOriginal.status !== "Agendada" &&
          consultaAtual.status === "Agendada"
        ) {
          // Atualiza dataProximaConsulta com a data da consulta
          await atualizarPaciente(paciente.id, {
            dataProximaConsulta: consultaAtual.data,
          });
        }

        // Atualiza a consulta
        await atualizarConsulta(consultaAtual.id, consultaAtual);
      } else {
        // Para nova consulta com status Agendada
        if (consultaAtual.status === "Agendada") {
          await atualizarPaciente(paciente.id, {
            dataProximaConsulta: consultaAtual.data,
          });
        }

        // Adiciona nova consulta
        await adicionarConsulta(consultaAtual);
      }

      handleFecharModal();
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
    }
  };
  const handleExcluirConsulta = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta consulta?")) {
      await removerConsulta(id);
    }
  };

  // Renderização de status com cores
  const renderStatusChip = (status) => {
    const statusColors = {
      Agendada: "primary",
      Concluída: "success",
      Cancelada: "error",
    };

    return (
      <Chip
        label={status}
        color={statusColors[status] || "default"}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Consultas
      </Typography>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleAbrirModal()}
        sx={{ mb: 2 }}
      >
        Nova Consulta
      </Button>

      <Grid container spacing={2}>
        {consultas.map((consulta) => (
          <Grid item xs={12} md={6} lg={4} key={consulta.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  {pacientes.find((p) => p.id === consulta.pacienteId)?.nome ||
                    "Paciente não encontrado"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data: {consulta.data} - {consulta.hora}
                </Typography>
                <Typography variant="body2">
                  Especialidade: {consulta.especialidade}
                </Typography>
                {renderStatusChip(consulta.status)}

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleAbrirModal(consulta)}
                  >
                    Editar
                  </Button>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleExcluirConsulta(consulta.id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal de Cadastro/Edição de Consulta */}
      <Dialog
        open={openModal}
        onClose={handleFecharModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {modoEdicao ? "Editar Consulta" : "Nova Consulta"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Paciente</InputLabel>
                <Select
                  value={consultaAtual.pacienteId}
                  label="Paciente"
                  onChange={(e) =>
                    setConsultaAtual((prev) => ({
                      ...prev,
                      pacienteId: e.target.value,
                    }))
                  }
                >
                  {pacientes.map((paciente) => (
                    <MenuItem key={paciente.id} value={paciente.id}>
                      {paciente.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={consultaAtual.data}
                onChange={(e) =>
                  setConsultaAtual((prev) => ({
                    ...prev,
                    data: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Hora"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={consultaAtual.hora}
                onChange={(e) =>
                  setConsultaAtual((prev) => ({
                    ...prev,
                    hora: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Especialidade"
                value={consultaAtual.especialidade}
                onChange={(e) =>
                  setConsultaAtual((prev) => ({
                    ...prev,
                    especialidade: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={consultaAtual.status}
                  label="Status"
                  onChange={(e) =>
                    setConsultaAtual((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <MenuItem value="Agendada">Agendada</MenuItem>
                  <MenuItem value="Concluída">Concluída</MenuItem>
                  <MenuItem value="Cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharModal}>Cancelar</Button>
          <Button variant="contained" onClick={handleSalvarConsulta}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultasPage;
