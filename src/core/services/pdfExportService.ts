import jsPDF from "jspdf";

import type { DiagnosticResult } from "@/core/types";

export class PDFExportService {
  private static addUnicodeSupport(doc: jsPDF) {
    // Add font for Cyrillic support
    // Note: In a real application, you would need to add a proper font file
    // For now, we'll use the default font with some workarounds
  }

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

  private static addText(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    options: {
      fontSize?: number;
      fontStyle?: string;
      maxWidth?: number;
      align?: "left" | "center" | "right";
    } = {},
  ): number {
    const { fontSize = 12, fontStyle = "normal", maxWidth = 170, align = "left" } = options;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);

    // Convert Cyrillic to basic transliteration for better PDF compatibility
    const transliteratedText = text.replace(/[а-я]/gi, (match) => {
      const cyrillicMap: { [key: string]: string } = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ь: "",
        ы: "y",
        ъ: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return cyrillicMap[match.toLowerCase()] || match;
    });

    if (maxWidth) {
      const lines = doc.splitTextToSize(transliteratedText, maxWidth);
      lines.forEach((line: string, index: number) => {
        const lineY = y + index * (fontSize * 0.4);
        if (align === "center") {
          doc.text(line, x, lineY, { align: "center" });
        } else if (align === "right") {
          doc.text(line, x, lineY, { align: "right" });
        } else {
          doc.text(line, x, lineY);
        }
      });
      return y + lines.length * (fontSize * 0.4);
    }
    doc.text(transliteratedText, x, y, { align });
    return y + fontSize * 0.4;
  }

  public static async exportToPDF(result: DiagnosticResult): Promise<void> {
    const doc = new jsPDF();
    let currentY = 20;

    this.addUnicodeSupport(doc);

    // Title
    currentY = this.addText(doc, "Rezultaty diagnostiki emocionalnogo vygoraniya", 105, currentY, {
      fontSize: 18,
      fontStyle: "bold",
      align: "center",
    });

    currentY += 15;

    // Date
    currentY = this.addText(
      doc,
      `Data prohozhdenia: ${this.formatDate(result.timestamp)}`,
      20,
      currentY,
      {
        fontSize: 12,
      },
    );

    currentY += 15;

    // Overall Score Section
    currentY = this.addText(doc, "OBSCHY BALL", 20, currentY, {
      fontSize: 16,
      fontStyle: "bold",
    });

    currentY += 5;
    currentY = this.addText(
      doc,
      `${result.totalScore} iz ${result.maxTotalScore} (${result.burnoutLevel.percentage}%)`,
      20,
      currentY,
      {
        fontSize: 14,
      },
    );

    currentY += 15;

    // Burnout Level Section
    currentY = this.addText(doc, "UROVEN VYGORANIYA", 20, currentY, {
      fontSize: 16,
      fontStyle: "bold",
    });

    currentY += 5;
    currentY = this.addText(
      doc,
      this.getBurnoutLevelText(result.burnoutLevel.level).toUpperCase(),
      20,
      currentY,
      {
        fontSize: 14,
        fontStyle: "bold",
      },
    );

    currentY += 5;
    currentY = this.addText(doc, result.burnoutLevel.description, 20, currentY, {
      fontSize: 11,
      maxWidth: 170,
    });

    currentY += 15;

    // Greenberg Stage Section
    currentY = this.addText(
      doc,
      `STADIYA PO MODELI GRINBERGA: ${result.greenbergStage.stage}`,
      20,
      currentY,
      {
        fontSize: 16,
        fontStyle: "bold",
      },
    );

    currentY += 5;
    currentY = this.addText(doc, result.greenbergStage.name, 20, currentY, {
      fontSize: 14,
      fontStyle: "bold",
    });

    currentY += 5;
    currentY = this.addText(doc, result.greenbergStage.description, 20, currentY, {
      fontSize: 11,
      maxWidth: 170,
    });

    currentY += 10;

    // Characteristics
    currentY = this.addText(doc, "Harakternye cherty:", 20, currentY, {
      fontSize: 12,
      fontStyle: "bold",
    });

    result.greenbergStage.characteristics.forEach((characteristic) => {
      currentY += 5;
      currentY = this.addText(doc, `• ${characteristic}`, 25, currentY, {
        fontSize: 11,
        maxWidth: 165,
      });
    });

    currentY += 15;

    // Recommendations Section
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    currentY = this.addText(doc, "REKOMENDACII", 20, currentY, {
      fontSize: 16,
      fontStyle: "bold",
    });

    result.recommendations.forEach((recommendation, index) => {
      currentY += 8;

      if (currentY > 270) {
        doc.addPage();
        currentY = 20;
      }

      // Remove emoji and clean up recommendation text
      const cleanRecommendation = recommendation.replace(/[^\w\s\-.,!?:()]/g, "");

      currentY = this.addText(doc, `${index + 1}. ${cleanRecommendation}`, 20, currentY, {
        fontSize: 11,
        maxWidth: 170,
      });
    });

    // Disclaimer
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    } else {
      currentY += 20;
    }

    currentY = this.addText(doc, "VAZHNOE PREDUPREZHDENIE", 20, currentY, {
      fontSize: 14,
      fontStyle: "bold",
    });

    currentY += 5;
    const disclaimer =
      "Dannyy test NE YAVLYAETSYA medicinskim instrumentom i ne prednaznachen dlya postanovki diagnoza. Rezultaty nosyat isklyuchitelno informacionnyy harakter. Pri seryoznyh problemah s psihicheskim zdorovem obratites k kvalificirovannomu specialistu.";

    currentY = this.addText(doc, disclaimer, 20, currentY, {
      fontSize: 10,
      maxWidth: 170,
    });

    // Save the PDF
    const fileName = `burnout-diagnosis-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  }
}
