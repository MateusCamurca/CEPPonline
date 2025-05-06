
/*
  CEPPonline - Sistema de Gestão Escolar
  --------------------------------------------------
  Descrição:
  - Aplicação React para professores lançarem notas e frequência.
  - Secretarias podem cadastrar alunos e turmas, importar/exportar backups.
  - Geração de boletins individuais ou em lote em PDF.

  Recursos:
  - Armazenamento local (localStorage)
  - Relatórios simples com jsPDF
  - Exportação e importação de dados (.json)
  - Código modular e de fácil expansão
*/

import jsPDF from "jspdf";
import "jspdf-autotable";

const handleExportarBackup = () => {
  const dados = {
    turmas,
    alunosPorTurma,
    notas,
    frequencias,
  };
  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `backup-cepponline-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
};

const handleImportarBackup = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const dados = JSON.parse(e.target.result);
      if (dados.turmas && dados.alunosPorTurma && dados.notas && dados.frequencias) {
        setTurmas(dados.turmas);
        setAlunosPorTurma(dados.alunosPorTurma);
        setNotas(dados.notas);
        setFrequencias(dados.frequencias);
        alert("Backup importado com sucesso!");
      } else {
        alert("Arquivo inválido ou incompleto.");
      }
    } catch (err) {
      alert("Erro ao ler o arquivo.");
    }
  };
  reader.readAsText(file);
};

const handleGerarBoletimPDF = (aluno) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Boletim Escolar - CEPPonline", 20, 20);

  doc.setFontSize(12);
  doc.text(`Aluno: ${aluno}`, 20, 40);
  doc.text(`Nota: ${notas[aluno] || "-"}`, 20, 50);
  doc.text(`Frequência: ${frequencias[aluno] || "-"}`, 20, 60);

  doc.save(`boletim-${aluno}.pdf`);
};

const handleGerarBoletinsDaTurma = (turmaId) => {
  const alunos = alunosPorTurma[turmaId] || [];
  alunos.forEach((aluno) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Boletim Escolar - CEPPonline", 20, 20);

    doc.setFontSize(12);
    doc.text(`Aluno: ${aluno}`, 20, 40);
    doc.text(`Nota: ${notas[aluno] || "-"}`, 20, 50);
    doc.text(`Frequência: ${frequencias[aluno] || "-"}`, 20, 60);

    doc.save(`boletim-${aluno}.pdf`);
  });
};

// Inserção dos botões diretamente no painel da secretaria
<div className="space-y-2 mt-4">
  <Button onClick={handleExportarBackup} className="w-full">
    Exportar Backup
  </Button>
  <Label className="block text-sm">Importar Backup:</Label>
  <Input type="file" accept="application/json" onChange={handleImportarBackup} />
</div>

// Botões de exemplo:
// <Button onClick={() => handleGerarBoletimPDF("Ana")}>Boletim de Ana (PDF)</Button>
// <Button onClick={() => handleGerarBoletinsDaTurma("1")}>Boletins do 5º Ano A</Button>
