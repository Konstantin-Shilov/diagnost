import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { defaultSurveyConfig } from "@/core/data/surveyConfig";
import type { DiagnosticResult } from "@/core/types";

// Roboto Regular font for Cyrillic support - base64 encoded
// This is a subset containing Latin and Cyrillic characters
let robotoFontLoaded = false;

async function loadRobotoFont(): Promise<string> {
  // Fetch Roboto font (TTF format) from cdnjs - reliable CDN for fonts
  const response = await fetch(
    "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf",
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  // Convert ArrayBuffer to base64
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export class PDFExportService {
  private static formatDate(date: Date): string {
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  private static getBurnoutLevelText(level: string): string {
    switch (level) {
      case "low":
        return "Низкий";
      case "moderate":
        return "Умеренный";
      case "high":
        return "Высокий";
      case "severe":
        return "Серьезный";
      case "critical":
        return "Критический";
      default:
        return level;
    }
  }

  private static getBurnoutColor(level: string): [number, number, number] {
    switch (level) {
      case "low":
        return [34, 197, 94]; // #22c55e
      case "moderate":
        return [234, 179, 8]; // #eab308
      case "high":
        return [249, 115, 22]; // #f97316
      case "severe":
        return [239, 68, 68]; // #ef4444
      case "critical":
        return [220, 38, 38]; // #dc2626
      default:
        return [107, 114, 128]; // #6b7280
    }
  }

  public static async exportToPDF(result: DiagnosticResult): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Load Roboto font for Cyrillic support
      if (!robotoFontLoaded) {
        try {
          const fontBase64 = await loadRobotoFont();
          pdf.addFileToVFS("Roboto-Regular.ttf", fontBase64);
          pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
          pdf.addFont("Roboto-Regular.ttf", "Roboto", "bold");
          robotoFontLoaded = true;
        } catch (fontError) {
          console.warn("Failed to load Roboto font, using fallback:", fontError);
        }
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;
      let yPos = margin;

      const fontFamily = robotoFontLoaded ? "Roboto" : "helvetica";

      // Set default font
      pdf.setFont(fontFamily);

      // Title
      pdf.setFontSize(20);
      pdf.setFont(fontFamily, "bold");
      const title = "Результаты диагностики эмоционального выгорания";
      pdf.text(title, pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      // Date
      pdf.setFontSize(10);
      pdf.setFont(fontFamily, "normal");
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Дата прохождения: ${this.formatDate(result.timestamp)}`, pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 15;

      // Reset text color
      pdf.setTextColor(31, 41, 55);

      // Summary boxes - using table for better layout
      const summaryData = [
        [
          "Общий балл",
          `${result.totalScore} из ${result.maxTotalScore} (${result.burnoutLevel.percentage}%)`,
        ],
        [
          "Уровень выгорания",
          `${this.getBurnoutLevelText(result.burnoutLevel.level)}\n${result.burnoutLevel.description}`,
        ],
      ];

      autoTable(pdf, {
        startY: yPos,
        head: [],
        body: summaryData,
        theme: "grid",
        styles: {
          font: fontFamily,
          fontSize: 11,
          cellPadding: 5,
          lineColor: [229, 231, 235],
          lineWidth: 0.1,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 50, fillColor: [249, 250, 251] },
          1: { cellWidth: contentWidth - 50 },
        },
        didParseCell: (data) => {
          if (data.row.index === 1 && data.column.index === 1) {
            data.cell.styles.textColor = this.getBurnoutColor(result.burnoutLevel.level);
            data.cell.styles.fontStyle = "bold";
          }
        },
      });

      yPos = (pdf as any).lastAutoTable.finalY + 10;

      // Greenberg Stage Section
      pdf.setFontSize(16);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("Стадия по модели Гринберга", margin, yPos);
      yPos += 8;

      pdf.setFontSize(11);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(31, 41, 55);
      pdf.text(
        `Стадия ${result.greenbergStage.stage}: ${result.greenbergStage.name}`,
        margin,
        yPos,
      );
      yPos += 6;

      pdf.setFont(fontFamily, "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);
      const descLines = pdf.splitTextToSize(result.greenbergStage.description, contentWidth);
      pdf.text(descLines, margin, yPos);
      yPos += descLines.length * 5 + 5;

      // Characteristics
      pdf.setFontSize(11);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(31, 41, 55);
      pdf.text("Характерные черты:", margin, yPos);
      yPos += 6;

      pdf.setFont(fontFamily, "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(75, 85, 99);

      for (const char of result.greenbergStage.characteristics) {
        // Check if we need a new page
        if (yPos > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPos = margin;
        }

        const charLines = pdf.splitTextToSize(`• ${char}`, contentWidth - 5);
        pdf.text(charLines, margin + 5, yPos);
        yPos += charLines.length * 5 + 2;
      }

      yPos += 5;

      // Check if we need a new page before recommendations
      if (yPos > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        yPos = margin;
      }

      // Recommendations Section
      pdf.setFontSize(16);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(21, 128, 61);
      pdf.text("Рекомендации", margin, yPos);
      yPos += 8;

      pdf.setFont(fontFamily, "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(55, 65, 81);

      for (let i = 0; i < result.recommendations.length; i++) {
        // Check if we need a new page
        if (yPos > pdf.internal.pageSize.getHeight() - 20) {
          pdf.addPage();
          yPos = margin;
        }

        const recText = `${i + 1}. ${result.recommendations[i]}`;
        const recLines = pdf.splitTextToSize(recText, contentWidth - 5);
        pdf.text(recLines, margin, yPos);
        yPos += recLines.length * 5 + 4;
      }

      yPos += 10;

      // Check if we need a new page for warning
      if (yPos > pdf.internal.pageSize.getHeight() - 40) {
        pdf.addPage();
        yPos = margin;
      }

      // Warning Section
      pdf.setFillColor(254, 242, 242);
      pdf.setDrawColor(239, 68, 68);
      pdf.setLineWidth(0.5);
      const warningHeight = 35;
      pdf.rect(margin, yPos - 3, contentWidth, warningHeight, "FD");

      yPos += 3;
      pdf.setFontSize(12);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(153, 27, 27);
      pdf.text("⚠ Важное предупреждение", margin + 3, yPos);
      yPos += 7;

      pdf.setFontSize(9);
      pdf.setFont(fontFamily, "normal");
      pdf.setTextColor(127, 29, 29);
      const warningText =
        "Данный тест НЕ ЯВЛЯЕТСЯ медицинским инструментом и не предназначен для постановки диагноза. Результаты носят исключительно информационный характер. При серьезных проблемах с психическим здоровьем обратитесь к квалифицированному специалисту.";
      const warningLines = pdf.splitTextToSize(warningText, contentWidth - 6);
      pdf.text(warningLines, margin + 3, yPos);

      // Start detailed answers on a new page
      pdf.addPage();
      yPos = margin;

      // Detailed Answers Section
      pdf.setFontSize(16);
      pdf.setFont(fontFamily, "bold");
      pdf.setTextColor(30, 64, 175);
      pdf.text("Детальные ответы", margin, yPos);
      yPos += 6;

      pdf.setFontSize(9);
      pdf.setFont(fontFamily, "normal");
      pdf.setTextColor(107, 114, 128);
      const subtitleText =
        "Ваши ответы на вопросы диагностики. Эта информация может быть полезна специалисту для более глубокого анализа вашего состояния.";
      const subtitleLines = pdf.splitTextToSize(subtitleText, contentWidth);
      pdf.text(subtitleLines, margin, yPos);
      yPos += subtitleLines.length * 4 + 6;

      // Process each block of responses
      for (const response of result.responses) {
        const block = defaultSurveyConfig.blocks.find((b) => b.id === response.blockId);
        if (!block) continue;

        // Check if we need a new page for the block
        if (yPos > pdf.internal.pageSize.getHeight() - 40) {
          pdf.addPage();
          yPos = margin;
        }

        // Block title
        pdf.setFontSize(12);
        pdf.setFont(fontFamily, "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text(block.title, margin, yPos);
        yPos += 2;

        // Underline
        pdf.setDrawColor(30, 64, 175);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPos, margin + contentWidth, yPos);
        yPos += 6;

        // Create table data for answers
        const answersData: string[][] = [];

        for (const answer of response.answers) {
          const question = block.questions.find((q) => q.id === answer.questionId);
          if (!question) continue;

          let answerLabel = "";
          if (typeof answer.value === "number") {
            if (question.scaleMin === 0 && question.scaleMax === 3) {
              const labels = ["Никогда", "Иногда", "Часто", "Постоянно"];
              answerLabel = `${answer.value} — ${labels[answer.value]}`;
            } else {
              answerLabel = `${answer.value}`;
            }
          } else {
            answerLabel = String(answer.value);
          }

          answersData.push([question.text, answerLabel]);
        }

        // Render table for this block
        autoTable(pdf, {
          startY: yPos,
          head: [],
          body: answersData,
          theme: "plain",
          styles: {
            font: fontFamily,
            fontSize: 9,
            cellPadding: 3,
            lineColor: [229, 231, 235],
            lineWidth: 0.1,
          },
          columnStyles: {
            0: { cellWidth: contentWidth * 0.7, textColor: [75, 85, 99] },
            1: {
              cellWidth: contentWidth * 0.3,
              fontStyle: "bold",
              textColor: [30, 64, 175],
              halign: "center",
              fillColor: [231, 243, 255],
            },
          },
          didDrawCell: (data) => {
            if (data.column.index === 0) {
              // Draw left border for question cells
              const { x, y, height } = data.cell;
              pdf.setDrawColor(30, 64, 175);
              pdf.setLineWidth(1);
              pdf.line(x, y, x, y + height);
            }
          },
        });

        yPos = (pdf as any).lastAutoTable.finalY + 8;
      }

      // Save the PDF
      const testDateObj = new Date(result.timestamp);
      const testDate = `${testDateObj.getFullYear()}-${String(testDateObj.getMonth() + 1).padStart(2, "0")}-${String(testDateObj.getDate()).padStart(2, "0")}`;
      const fileName = `diagnoz-vygoraniya-${testDate}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Не удалось создать PDF файл");
    }
  }
}
