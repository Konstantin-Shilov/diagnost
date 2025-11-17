import { createFileRoute } from "@tanstack/react-router";

import { ResultsContainer } from "@/components/Results";
import { Text, Title } from "@/components/Typography";
import { PDFExportService } from "@/core/services/pdfExportService";
import { useResultsStore } from "@/core/store";

import styles from "./results.$id.module.css";

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
      <div className={styles.notFound}>
        <Title size="lg" level="h1" semantic="negative">
          Результат не найден
        </Title>
        <Text variant="secondary">Результат с ID {id} не найден.</Text>
        <Text>
          <a href="/survey" className={styles.link}>
            Пройти диагностику заново
          </a>
        </Text>
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

  return <ResultsContainer result={result} onExportPDF={handleExportPDF} />;
}
