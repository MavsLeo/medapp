import React, { useState, useEffect } from "react";
import { useClinica } from "../../Context/ClinicaContextFb";

const UploadExames = ({ pacienteId }) => {
  const { uploadExame, listarExames } = useClinica(); // Obtendo as funções do contexto
  const [selectedFile, setSelectedFile] = useState(null);
  const [exames, setExames] = useState([]);

  useEffect(() => {
    const fetchExames = async () => {
      try {
        const arquivos = await listarExames(pacienteId); // Busca os exames do paciente
        setExames(arquivos);
      } catch (error) {
        console.error("Erro ao listar exames:", error);
      }
    };

    fetchExames();
  }, [pacienteId, listarExames]);

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        await uploadExame(pacienteId, selectedFile); // Faz o upload do arquivo
        const arquivosAtualizados = await listarExames(pacienteId); // Atualiza a lista de exames
        setExames(arquivosAtualizados);
        alert("Exame enviado com sucesso!");
      } catch (error) {
        alert("Erro ao enviar o exame.");
      }
    }
  };

  return (
    <div>
      <h3>Exames do Paciente</h3>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Enviar Exame</button>

      <ul>
        {exames.map((exame, index) => (
          <li key={index}>
            <a href={exame.url} target="_blank" rel="noopener noreferrer">
              {exame.nome}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UploadExames;
