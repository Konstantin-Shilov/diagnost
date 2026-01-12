import { ClientOnly } from "@/common/shared/utils/ClientOnly";
import { ResultsContainer } from "@/components/Results";
import { Text, Title } from "@/components/Typography";
import { PDFExportService } from "@/core/services/pdfExportService";
import { useResultsStore } from "@/core/store";

import styles from "./Results.module.css";

type Props = {
  id: string;
};

export const ResultPage = ({ id }: Props) => (
  <ClientOnly>
    <Page id={id} />
  </ClientOnly>
);

export const Page = ({ id }: Props) => {
  const { getResult, currentResult } = useResultsStore();
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
};
