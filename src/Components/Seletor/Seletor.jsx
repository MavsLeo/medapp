import { Button, Container, FormControl, InputLabel, MenuItem, Paper, Select } from '@mui/material'
import React, { useState } from 'react'
import { useClinica } from '../../Context/ClinicaContext '


function Seletor({setMedicoId, setClinicaId}) {// eslint-disable-next-line
    const {medicos, clinicas} =useClinica('')
    const [medicoSelecionado, setMedicoSelecionado] = useState('');
    const [clinicaSelecionado, setClinicaSelecionado] = useState('');
    console.log('medicos :>> ', medicos);
  return (
    <Container 
        maxWidth="xs"sx={{ 
            height: '100dvh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: 2  
          }}>
            <Paper elevation={3} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              backgroundColor: '#f4f4f4'
            }}>
      <FormControl sx={{ m: 1, width: 300 }} >
        <InputLabel id="multiple-medico-label">Médicos</InputLabel>
        <Select 
            labelId="multiple-medico-label"
            id="multiple-medico"
            value={medicoSelecionado}
            onChange={(e) => {
                const selectedId = e.target.value;
                setMedicoSelecionado(selectedId);
                setMedicoId(selectedId);
            }}
            >
            {medicos.map((medico) => (
                <MenuItem 
                key={medico.id} 
                value={medico.id}
                >
                    {medico.nomeSocial}
                </MenuItem>
            ))}
            </Select>
    </FormControl>
    <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-clinica-label">Clinica</InputLabel>
        <Select 
            labelId="multiple-clinica-label"
            id="multiple-clinica"
            value={clinicaSelecionado}
            onChange={(e) => {
                const selectedId = e.target.value;
                setClinicaSelecionado(selectedId);
                setClinicaId(selectedId);
            }}
            >
            {clinicas.map((clinica) => (
                <MenuItem 
                key={clinica.id} 
                value={clinica.id}
                >
                    {clinica.nomeResumo}
                </MenuItem>
            ))}
            </Select>
            <Button href='/dashboard'>Ir</Button>
    </FormControl>
    </Paper>
    </Container>
  )
}

export default Seletor