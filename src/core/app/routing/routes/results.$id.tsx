import { createFileRoute } from "@tanstack/react-router";

import { ResultsContainer } from "@/components/Results";
import { PDFExportService } from "@/core/services/pdfExportService";
import { useResultsStore } from "@/core/store";

export const Route = createFileRoute("/results/$id")({
  component: ResultPage,
});

function ResultPage() {
  const { id } = Route.useParams();
  const { getResult, currentResult } = useResultsStore();

  // Try to get result from current result first, then from stored results
  const result = currentResult?.id === id ? currentResult : getResult(id);

  if (!result) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <h1>Результат не найден</h1>
        <p>Результат с ID {id} не найден.</p>
        <p>
          <a href="/survey" style={{ color: "#007bff" }}>
            Пройти диагностику заново
          </a>
        </p>
      </div>
    );
  }

  const handleExportPDF = async () => {
    try {
      await PDFExportService.exportToPDF(result);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Произошла ошибка при экспорте PDF");
    }
  };

  return (
    <ResultsContainer
      result={result}
      onExportPDF={handleExportPDF}
      onSaveResult={() => {
        // Result is already saved, show confirmation
        alert("Результат уже сохранен в истории");
      }}
    />
  );
}
