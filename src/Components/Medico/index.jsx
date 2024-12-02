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
  TableRow,// eslint-disable-next-line
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
  Radio
} from '@mui/material';
import { 
  LocalHospital as HospitalIcon, 
  Favorite as HeartIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Delete as DelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useClinica } from '../../Context/ClinicaContext ';

// Importar o contexto da clínica

const MedicDashboard = ({medicoId,clinicaId}) => {
console.log('Promps :>> ', medicoId , clinicaId);

  const { 
    pacientes, 
    medicos,
    clinicas,
    adicionarPaciente,
    atualizarPaciente,
    removerPaciente,
    buscarMedicoPorId,
    buscarClinicaPorId,
  } = useClinica();

  console.log('pacientes :>> ', pacientes);
  console.log('medicos :>> ', medicos);
  console.log('clinicas :>> ', clinicas);
  console.log("Médico: ",buscarMedicoPorId('3fc15401-10ba-4ce2-8cdc-d3a8b23eabff'))
  console.log("Clinica: " ,buscarClinicaPorId('d389ff80-2404-4ba3-8f83-f2b3c58c6df9'))

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openPatientDialog, setOpenPatientDialog] = useState(false);
  const [openPatientEditDialog, setOpenPatientEditDialog] = useState(false);
  const [openAddPatientDialog, setOpenAddPatientDialog] = useState(false);
  const medico = buscarMedicoPorId('3fc15401-10ba-4ce2-8cdc-d3a8b23eabff');
  const clinica = buscarClinicaPorId('aa48f83e-036f-4432-995d-cf2f57f77e2c');
  const [newPatient, setNewPatient] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    riscoCardiaco: ''
  });
  const [editedPatient, setEditedPatient] = useState({
    nome: '',
    dataNascimento: '',
    email: '',
    telefone: '',
    riscoCardiaco: '',
    observacaoDoMedico: ''
  });
  const handleDeletePatient = (patient) => {
    removerPaciente(patient.id)
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setOpenPatientDialog(true);
  };

  const handleEditPatient = (patient) => {
    // Preencher o estado de edição com os dados do paciente selecionado
    setEditedPatient({
      id:patient.id,
      nome: patient.nome,
      dataNascimento: patient.dataNascimento,
      email: patient.email,
      telefone: patient.telefone,
      riscoCardiaco: patient.riscoCardiaco,
      observacaoDoMedico: patient.observacaoDoMedico || ''
    });
    
    // Abrir o diálogo de edição
    setOpenPatientEditDialog(true);
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
      nome: '',
      dataNascimento: '',
      email: '',
      telefone: '',
      riscoCardiaco: ''
    });
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Alto': return 'error';
      case 'Moderado': return 'warning';
      default: return 'success';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Cabeçalho do Painel */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              p: 2, 
              borderRadius: 2 
            }}
          >
            {clinica.logo ? <img className='rounded' style={{ backgroundColor:"#fff",width: "10rem", }} alt="logo" src={clinica.logo} />:<HospitalIcon sx={{ mr: 2, fontSize: 40 }} />}
            <Box>
              <Typography variant="h4">Painel Médico</Typography>
              <Typography variant="subtitle1">{medico.nomeSocial} - {medico.especialidade}</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Estatísticas Rápidas */}
        <Grid item xs={12} md={4}>
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
                    <Typography variant="body2">
                      Total Pacientes
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="error">
                      {pacientes.filter(p => p.riscoCardiaco === 'Alto').length}
                    </Typography>
                    <Typography variant="body2">
                      Risco Alto
                    </Typography>
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
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2 
                }}
              >
                <Typography variant="h6">
                  Meus Pacientes
                </Typography>
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
                            ? new Date().getFullYear() - new Date(patient.dataNascimento).getFullYear()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={patient.riscoCardiaco || 'Não Avaliado'} 
                            color={getRiskColor(patient.riscoCardiaco)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            title='Visualizar' 
                            onClick={() => handleViewPatient(patient)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            title='Editar' 
                            onClick={() => handleEditPatient(patient)}
                            color="success"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                          title='Excluir Paciente' 
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
                <WarningIcon color="error" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Alertas de Risco
              </Typography>
              {pacientes
                .filter(p => p.riscoCardiaco === 'Alto')
                .map(patient => (
                  <Box 
                    key={patient.id} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: '#fff3e0', 
                      p: 2, 
                      borderRadius: 2,
                      mb: 1 
                    }}
                  >
                    <HeartIcon color="error" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" color="error">
                        {patient.nome} - Risco Cardíaco Alto
                      </Typography>
                      <Typography variant="body2">
                        Contato: {patient.telefone || 'Não cadastrado'}
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
                Idade: {new Date().getFullYear() - new Date(selectedPatient.dataNascimento).getFullYear()}
              </Typography>
              <Typography>
                Risco Cardíaco: 
                <Chip 
                  label={selectedPatient.riscoCardiaco || 'Não Avaliado'} 
                  color={getRiskColor(selectedPatient.riscoCardiaco)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography>Email: {selectedPatient.email}</Typography>
              <Typography>Telefone: {selectedPatient.telefone}</Typography>
              <Typography>Observações: {selectedPatient.observacaoDoMedico}</Typography>
              <Typography>Medicametos: {selectedPatient.medicacoes ? selectedPatient.medicacoes.map(med => `${med.nome} (${med.dosagem})`).join(", "): "Nenhuma medicação informada"}</Typography>
              <Typography>Id: {selectedPatient.id}</Typography>
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
            onChange={(e) => setNewPatient({...newPatient, nome: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newPatient.dataNascimento}
            onChange={(e) => setNewPatient({...newPatient, dataNascimento: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newPatient.email}
            onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Telefone"
            type="tel"
            fullWidth
            value={newPatient.telefone}
            onChange={(e) => setNewPatient({...newPatient, telefone: e.target.value})}
          />
          <FormControl>
            <FormLabel id='row-radio-risco'>Risco Cardiaco</FormLabel>
            <RadioGroup 
              row 
              aria-labelledby='row-radio-risco'
              id='row-radio-risco-grupo' 
              defaultValue="Baixo"
              onChange={(e) => setNewPatient({...newPatient, riscoCardiaco: e.target.value})}>
                <FormControlLabel value="Baixo"  control={<Radio color='success'/> } label="Baixo" />
                <FormControlLabel value="Moderado"  control={<Radio color='warning'/>} label="Moderado" />
                <FormControlLabel value="Alto"  control={<Radio color='error'/>} label="Alto" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddPatientDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddPatient} color="primary">Adicionar</Button>
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
            onChange={(e) => setEditedPatient({...editedPatient, nome: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Data de Nascimento"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={editedPatient.dataNascimento}
            onChange={(e) => setEditedPatient({...editedPatient, dataNascimento: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editedPatient.email}
            onChange={(e) => setEditedPatient({...editedPatient, email: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Telefone"
            type="tel"
            fullWidth
            value={editedPatient.telefone}
            onChange={(e) => setEditedPatient({...editedPatient, telefone: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Observação do Médico"
            multiline
            rows={4}
            fullWidth
            value={editedPatient.observacaoDoMedico}
            onChange={(e) => setEditedPatient({...editedPatient, observacaoDoMedico: e.target.value})}
          />
          <FormControl>
            <FormLabel id='row-radio-risco'>Risco Cardíaco</FormLabel>
            <RadioGroup 
              row 
              aria-labelledby='row-radio-risco'
              id='row-radio-risco-grupo' 
              value={editedPatient.riscoCardiaco}
              onChange={(e) => setEditedPatient({...editedPatient, riscoCardiaco: e.target.value})}
            >
              <FormControlLabel value="Baixo" control={<Radio color='success'/> } label="Baixo" />
              <FormControlLabel value="Moderado" control={<Radio color='warning'/>} label="Moderado" />
              <FormControlLabel value="Alto" control={<Radio color='error'/>} label="Alto" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPatientEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveEditPatient} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MedicDashboard;