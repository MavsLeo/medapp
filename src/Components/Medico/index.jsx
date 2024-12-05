import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent, // eslint-disable-next-line
  Avatar,
  Container,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, // eslint-disable-next-line
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  LocalHospital as HospitalIcon,
  Favorite as HeartIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DelIcon,
  Edit as EditIcon,
  Report as ReportIcon,
  FilePresent as AnexarIcon,
} from "@mui/icons-material";
import { useClinica } from "../../Context/ClinicaContextFb";
import QRCode from "react-qr-code";

// Importar o contexto da clínica

const MedicDashboard = ({ medicoId, clinicaId }) => {
  console.log("Promps :>> ", medicoId, clinicaId);

  const {
    pacientes,
    medicos,
    clinicas,
    adicionarPaciente,
    atualizarPaciente,
    removerPaciente,
    listarExames,
    uploadExame,
    // buscarClinicaPorId,
  } = useClinica();

  console.log("pacientes :>> ", pacientes);
  console.log("medicos :>> ", medicos);
  console.log("clinicas :>> ", clinicas);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openPatientEditDialog, setOpenPatientEditDialog] = useState(false);
  const [openAddPatientDialog, setOpenAddPatientDialog] = useState(false);
  const [openUploadExameDialog, setOpenUploadExameDialog] = useState(false); // Controla a exibição do diálogo
  const [selectedFile, setSelectedFile] = useState(null); // Armazena o arquivo selecionado
  const [exames, setExames] = useState([]); // Lista de exames existentes para o paciente
  const [newMedicamento, setNewMedicamento] = useState({
    nome: "",
    dosagem: "",
  });
  const [editedMedicamento, setEditedMedicamento] = useState({
    nome: "",
    dosagem: "",
  });
  const [medico, setMedico] = useState("");
  const [clinica, setClinica] = useState("");

  console.log("Clinica: ", clinica);
  console.log("Médico: ", medico);

  const [newPatient, setNewPatient] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    medicacoes: [], // Array para medicamentos
    riscoCardiaco: "",
  });
  const [editedPatient, setEditedPatient] = useState({
    nome: "",
    dataNascimento: "",
    email: "",
    telefone: "",
    riscoCardiaco: "",
    medicacoes: [], // Array para medicamentos
    observacaoDoMedico: "",
  });
  const handleDeletePatient = (patient) => {
    removerPaciente(patient.id);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setOpenPatientDialog(true);
  };

  const handleAddMedicacao = (medicamento) => {
    setNewPatient((prev) => ({
      ...prev,
      medicacoes: [...prev.medicacoes, medicamento], // Adiciona o novo medicamento
    }));
  };

  const handleRemoveMedicacao = (index) => {
    setNewPatient((prev) => ({
      ...prev,
      medicacoes: prev.medicacoes.filter((_, i) => i !== index), // Remove pelo índice
    }));
  };

  const handleAddMedicacaoEdited = (medicamento) => {
    setEditedPatient((prev) => ({
      ...prev,
      medicacoes: [...prev.medicacoes, medicamento], // Adiciona o medicamento ao array
    }));
  };

  const handleRemoveMedicacaoEdited = (index) => {
    setEditedPatient((prev) => ({
      ...prev,
      medicacoes: prev.medicacoes.filter((_, i) => i !== index), // Remove pelo índice
    }));
  };

  const handleEditPatient = (patient) => {
    // Preencher o estado de edição com os dados do paciente selecionado
    setEditedPatient({
      id: patient.id,
      nome: patient.nome,
      dataNascimento: patient.dataNascimento,
      email: patient.email,
      telefone: patient.telefone,
      riscoCardiaco: patient.riscoCardiaco,
      medicacoes: patient.medicacoes || [], // Garante que seja um array
      observacaoDoMedico: patient.observacaoDoMedico || "",
    });

    // Abrir o diálogo de edição
    setOpenPatientEditDialog(true);
  };
  const handleEditExames = (patient) => {
    // Preencher o estado de edição com os dados do paciente selecionado
    setEditedPatient({
      id: patient.id,
      nome: patient.nome,
      dataNascimento: patient.dataNascimento,
      email: patient.email,
      telefone: patient.telefone,
      riscoCardiaco: patient.riscoCardiaco,
      medicacoes: patient.medicacoes || [], // Garante que seja um array
      observacaoDoMedico: patient.observacaoDoMedico || "",
    });

    // Abrir o diálogo de edição
    setOpenUploadExameDialog(true);
    listarExames(editedPatient.id).then(setExames).catch(console.error); // Atualiza a lista ao abrir
  };

  const handleSaveEditPatient = () => {
    // Atualizar o paciente com os dados editados
    atualizarPaciente(editedPatient.id, editedPatient);

    // Fechar o diálogo
    setOpenPatientEditDialog(false);
  };

  const handleAddPatient = () => {
    adicionarPaciente(newPatient);
    setOpenAddPatientDialog(false);
    setNewPatient({
      nome: "",
      dataNascimento: "",
      email: "",
      telefone: "",
      medicacoes: [], // Reseta os medicamentos
      riscoCardiaco: "",
    });
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Alto":
        return "error";
      case "Moderado":
        return "warning";
      default:
        return "success";
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Cabeçalho do Painel */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#1976d2",
              color: "white",
              p: 2,
              borderRadius: 2,
            }}
          >
            {clinica ? (
              clinica.logo ? (
                <img
                  className="rounded me-2"
                  style={{
                    backgroundColor: "#fff",
                    width: "10rem",
                  }}
                  alt="logo"
                  src={clinica.logo}
                />
              ) : (
                <HospitalIcon sx={{ mr: 2, fontSize: 40 }} />
              )
            ) : (
              <HospitalIcon sx={{ mr: 2, fontSize: 40 }} />
            )}
            <Box>
              <Typography variant="h4">Painel Médico</Typography>
              <Typography variant="subtitle1">
                {medico.nomeSocial} - {medico.especialidade}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Estatísticas Rápidas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ marginBottom: "1rem" }}>
            <CardContent>
              {clinica && medico ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    {clinica.nomeResumo}
                  </Typography>
                  {clinica.logo ? (
                    <img
                      className="rounded"
                      style={{
                        backgroundColor: "#fff",
                        width: "10rem",
                      }}
                      alt="logo"
                      src={clinica.logo}
                    />
                  ) : (
                    <HospitalIcon sx={{ mr: 2, fontSize: 40 }} />
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    Escolha de Médico
                  </Typography>
                  <FormControl sx={{ m: 1, width: "80%" }}>
                    <InputLabel id="multiple-Medico-label">Medico</InputLabel>
                    <Select
                      labelId="multiple-Medico-label"
                      id="multiple-Medico"
                      value={medico}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setMedico(selected);
                      }}
                    >
                      {medicos.map((medico) => (
                        <MenuItem key={medico.id} value={medico}>
                          {medico.nomeSocial}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="h6" gutterBottom>
                    Escolha de Clinica
                  </Typography>
                  <FormControl sx={{ m: 1, width: "80%" }}>
                    <InputLabel id="multiple-clinica-label">Clinica</InputLabel>
                    <Select
                      labelId="multiple-clinica-label"
                      id="multiple-clinica"
                      value={clinica}
                      onChange={(e) => {
                        const selected = e.target.value;
                        setClinica(selected);
                      }}
                    >
                      {clinicas.map((clinica) => (
                        <MenuItem key={clinica.id} value={clinica}>
                          {clinica.nomeResumo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estatísticas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {pacientes.length}
                    </Typography>
                    <Typography variant="body2">Total Pacientes</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error">
                      {
                        pacientes.filter((p) => p.riscoCardiaco === "Alto")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2">Risco Alto</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Pacientes */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Meus Pacientes</Typography>
                <IconButton
                  color="primary"
                  onClick={() => setOpenAddPatientDialog(true)}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Idade</TableCell>
                      <TableCell>Risco</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pacientes.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>{patient.nome}</TableCell>
                        <TableCell>
                          {patient.dataNascimento
                            ? new Date().getFullYear() -
                              new Date(patient.dataNascimento).getFullYear()
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={patient.riscoCardiaco || "Não Avaliado"}
                            color={getRiskColor(patient.riscoCardiaco)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            title="Visualizar"
                            onClick={() => handleViewPatient(patient)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            title="Editar"
                            onClick={() => handleEditPatient(patient)}
                            color="success"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            title="Anexar"
                            onClick={() => handleEditExames(patient)}
                            color="secondary"
                          >
                            <AnexarIcon />
                          </IconButton>
                          <IconButton
                            title="Excluir Paciente"
                            onClick={() => handleDeletePatient(patient)}
                            color="error"
                          >
                            <DelIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas de Risco */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WarningIcon
                  color="error"
                  sx={{ verticalAlign: "middle", mr: 1 }}
                />
                Alertas de Risco
              </Typography>
              {pacientes
                .filter((p) => p.riscoCardiaco === "Alto")
                .map((patient) => (
                  <Box
                    key={patient.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#fff3e0",
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <HeartIcon color="error" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" color="error">
                        {patient.nome} - Risco Cardíaco Alto
                      </Typography>
                      <Typography variant="body2">
                        Contato: {patient.telefone || "Não cadastrado"}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Detalhes do Paciente */}
      <Dialog
        open={openPatientDialog}
        onClose={() => setOpenPatientDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Detalhes do Paciente</DialogTitle>
        <DialogContent>
          {selectedPatient && (
            <Box>
              <Typography>Nome: {selectedPatient.nome}</Typography>
              <Typography>
                Idade:{" "}
                {new Date().getFullYear() -
                  new Date(selectedPatient.dataNascimento).getFullYear()}
              </Typography>
              <Typography>
                Risco Cardíaco:
                <Chip
                  label={selectedPatient.riscoCardiaco || "Não Avaliado"}
                  color={getRiskColor(selectedPatient.riscoCardiaco)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography>Email: {selectedPatient.email}</Typography>
              <Typography>Telefone: {selectedPatient.telefone}</Typography>
              <Typography>
                Observações: {selectedPatient.observacaoDoMedico}
              </Typography>
              <Typography>
                Medicametos:{" "}
                {selectedPatient.medicacoes
                  ? selectedPatient.medicacoes
                      .map((med) => `${med.nome} (${med.dosagem})`)
                      .join(", ")
                  : "Nenhuma medicação informada"}
              </Typography>
              <Link
                href={`http://192.168.0.99:3000/paciente/${selectedPatient.id}`}
                target="_blank"
              >
                <QRCode
                  title={`http://192.168.0.99:3000/paciente/${selectedPatient.id}`}
                  value={`http://192.168.0.99:3000/paciente/${selectedPatient.id}`}
                />
              </Link>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* Dialog de Adicionar Paciente */}
      <Dialog
        open={openAddPatientDialog}
        onClose={() => setOpenAddPatientDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Adicionar Novo Paciente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={newPatient.nome}
            onChange={(e) =>
              setNewPatient({ ...newPatient, nome: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPatient.dataNascimento}
            onChange={(e) =>
              setNewPatient({ ...newPatient, dataNascimento: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newPatient.email}
            onChange={(e) =>
              setNewPatient({ ...newPatient, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Telefone"
            type="tel"
            fullWidth
            value={newPatient.telefone}
            onChange={(e) =>
              setNewPatient({ ...newPatient, telefone: e.target.value })
            }
          />
          {/* Medicamentos */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Medicamentos de Uso Contínuo
          </Typography>
          {newPatient.medicacoes.map((med, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {med.nome} ({med.dosagem})
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleRemoveMedicacao(index)}
              >
                Remover
              </Button>
            </Box>
          ))}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Medicamento"
              fullWidth
              value={newMedicamento.nome || ""}
              onChange={(e) =>
                setNewMedicamento((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
            <TextField
              label="Dosagem"
              fullWidth
              value={newMedicamento.dosagem || ""}
              onChange={(e) =>
                setNewMedicamento((prev) => ({
                  ...prev,
                  dosagem: e.target.value,
                }))
              }
            />
            <Button
              variant="contained"
              onClick={() => {
                if (newMedicamento.nome && newMedicamento.dosagem) {
                  handleAddMedicacao(newMedicamento);
                  setNewMedicamento({ nome: "", dosagem: "" }); // Limpa os campos
                }
              }}
            >
              <AddIcon />
            </Button>
          </Box>
          {/*Risco Cardiaco*/}
          <FormControl>
            <FormLabel id="row-radio-risco">Risco Cardiaco</FormLabel>
            <RadioGroup
              row
              aria-labelledby="row-radio-risco"
              id="row-radio-risco-grupo"
              defaultValue="Baixo"
              onChange={(e) =>
                setNewPatient({ ...newPatient, riscoCardiaco: e.target.value })
              }
            >
              <FormControlLabel
                value="Baixo"
                control={<Radio color="success" />}
                label="Baixo"
              />
              <FormControlLabel
                value="Moderado"
                control={<Radio color="warning" />}
                label="Moderado"
              />
              <FormControlLabel
                value="Alto"
                control={<Radio color="error" />}
                label="Alto"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPatientDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleAddPatient} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog de Editar Paciente */}
      <Dialog
        open={openPatientEditDialog}
        onClose={() => setOpenPatientEditDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Editar Paciente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={editedPatient.nome}
            onChange={(e) =>
              setEditedPatient({ ...editedPatient, nome: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editedPatient.dataNascimento}
            onChange={(e) =>
              setEditedPatient({
                ...editedPatient,
                dataNascimento: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editedPatient.email}
            onChange={(e) =>
              setEditedPatient({ ...editedPatient, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Telefone"
            type="tel"
            fullWidth
            value={editedPatient.telefone}
            onChange={(e) =>
              setEditedPatient({ ...editedPatient, telefone: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Observação do Médico"
            multiline
            rows={4}
            fullWidth
            value={editedPatient.observacaoDoMedico}
            onChange={(e) =>
              setEditedPatient({
                ...editedPatient,
                observacaoDoMedico: e.target.value,
              })
            }
          />

          {/* Medicamentos */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Medicamentos de Uso Contínuo
          </Typography>
          {editedPatient.medicacoes.map((med, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mb: 1 }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {med.nome} ({med.dosagem})
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleRemoveMedicacaoEdited(index)}
              >
                Remover
              </Button>
            </Box>
          ))}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <TextField
              label="Medicamento"
              fullWidth
              value={editedMedicamento.nome || ""}
              onChange={(e) =>
                setEditedMedicamento((prev) => ({
                  ...prev,
                  nome: e.target.value,
                }))
              }
            />
            <TextField
              label="Dosagem"
              fullWidth
              value={editedMedicamento.dosagem || ""}
              onChange={(e) =>
                setEditedMedicamento((prev) => ({
                  ...prev,
                  dosagem: e.target.value,
                }))
              }
            />
            <Button
              variant="contained"
              onClick={() => {
                if (editedMedicamento.nome && editedMedicamento.dosagem) {
                  handleAddMedicacaoEdited(editedMedicamento);
                  setEditedMedicamento({ nome: "", dosagem: "" }); // Limpa os campos
                }
              }}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <FormControl>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                Risco Cardíaco
              </Typography>
              <RadioGroup
                row
                id="row-radio-risco-grupo"
                value={editedPatient.riscoCardiaco}
                onChange={(e) =>
                  setEditedPatient({
                    ...editedPatient,
                    riscoCardiaco: e.target.value,
                  })
                }
              >
                <FormControlLabel
                  value="Baixo"
                  control={<Radio color="success" />}
                  label="Baixo"
                />
                <FormControlLabel
                  value="Moderado"
                  control={<Radio color="warning" />}
                  label="Moderado"
                />
                <FormControlLabel
                  value="Alto"
                  control={<Radio color="error" />}
                  label="Alto"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientEditDialog(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEditPatient} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      {/*Dialog Para adcionar exames*/}
      <Dialog
        open={openUploadExameDialog}
        onClose={() => setOpenUploadExameDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enviar Exames</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Selecione um arquivo PDF para associar ao paciente
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button
              variant="contained"
              disabled={!selectedFile}
              onClick={async () => {
                try {
                  if (selectedFile) {
                    await uploadExame(editedPatient.id, selectedFile); // Envia o arquivo
                    const arquivosAtualizados = await listarExames(
                      editedPatient.id
                    ); // Atualiza a lista de exames
                    setExames(arquivosAtualizados);
                    alert("Exame enviado com sucesso!");
                    setSelectedFile(null); // Limpa o estado do arquivo
                  }
                } catch (error) {
                  alert("Erro ao enviar o exame.");
                }
              }}
            >
              Enviar
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
            Exames Enviados
          </Typography>
          {exames.length > 0 ? (
            <List>
              {exames.map((exame, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={exame.nome}
                    secondary={
                      <Link href={exame.url} target="_blank" rel="noopener">
                        Visualizar
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2">Nenhum exame enviado ainda.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadExameDialog(false)}>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicDashboard;