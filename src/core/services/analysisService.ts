import type {
  BurnoutLevel,
  DiagnosticResult,
  GreenbergStage,
  ScoringRules,
  SurveyResponse,
} from "@/core/types";

export class AnalysisService {
  private static calculateTotalScore(responses: SurveyResponse[]): number {
    let totalScore = 0;

    for (const response of responses) {
      if (response.blockId === "symptoms") {
        // 1. Подсчёт баллов по симптомам (0-3 за каждый)
        for (const answer of response.answers) {
          if (typeof answer.value === "number") {
            totalScore += answer.value;
          }
        }
      } else if (response.blockId === "state") {
        // 2. Определение состояния
        let energyScore = 0;
        let tensionScore = 0;
        let moodScore = 0;

        for (const answer of response.answers) {
          if (typeof answer.value === "number") {
            if (answer.questionId === "state_energy") {
              // Энергия: ≤3 → +3, 4-6 → +2, 7-10 → +1
              if (answer.value <= 3) energyScore = 3;
              else if (answer.value <= 6) energyScore = 2;
              else energyScore = 1;
            } else if (answer.questionId === "state_tension") {
              // Напряжение: ≥8 → +3, 6-7 → +2, 1-5 → +1
              if (answer.value >= 8) tensionScore = 3;
              else if (answer.value >= 6) tensionScore = 2;
              else tensionScore = 1;
            } else if (answer.questionId === "state_mood") {
              // Настроение (% негативных эмоций): ≥70% → +3, 50-69% → +2, <50% → +1
              if (answer.value >= 70) moodScore = 3;
              else if (answer.value >= 50) moodScore = 2;
              else moodScore = 1;
            }
          }
        }

        totalScore += energyScore + tensionScore + moodScore;
      } else if (response.blockId === "internal_causes") {
        // 3. Подсчёт баллов по внутренним причинам (0-2 за каждую)
        for (const answer of response.answers) {
          if (typeof answer.value === "number") {
            totalScore += answer.value;
          }
        }
      }
    }

    return totalScore;
  }

  private static getBurnoutLevel(score: number, rules: ScoringRules): BurnoutLevel {
    const { burnoutLevels } = rules;

    let level: BurnoutLevel["level"];
    let description: string;

    if (score >= burnoutLevels.critical.min) {
      level = "critical";
      description =
        "Критический уровень выгорания. Необходима немедленная помощь специалиста и кардинальные изменения в образе жизни.";
    } else if (score >= burnoutLevels.severe.min) {
      level = "severe";
      description =
        "Серьезный уровень выгорания. Настоятельно рекомендуется обратиться за профессиональной помощью.";
    } else if (score >= burnoutLevels.high.min) {
      level = "high";
      description =
        "Высокий уровень выгорания. Необходимо принимать активные меры для восстановления.";
    } else if (score >= burnoutLevels.moderate.min) {
      level = "moderate";
      description =
        "Умеренный уровень выгорания. Стоит обратить внимание на свое состояние и принять профилактические меры.";
    } else {
      level = "low";
      description =
        "Низкий уровень выгорания. Ваше состояние в пределах нормы, продолжайте следить за балансом.";
    }

    const maxTotalScore = 69; // Based on our new survey configuration: 10*3 + 3*3 + 15*2 = 30+9+30 = 69

    return {
      level,
      score,
      maxScore: maxTotalScore,
      percentage: Math.round((score / maxTotalScore) * 100),
      description,
    };
  }

  private static getGreenbergStage(score: number, rules: ScoringRules): GreenbergStage {
    const { greenbergStages } = rules;

    if (score >= greenbergStages[5].min) {
      return {
        stage: 5,
        name: "Пробивание стены",
        description: "Полное истощение, психосоматика, эмоциональная пустота",
        characteristics: [
          "Полное истощение",
          "Психосоматические заболевания",
          "Эмоциональная пустота",
          "Серьезные проблемы со здоровьем",
          "Социальная изоляция",
        ],
      };
    }
    if (score >= greenbergStages[4].min) {
      return {
        stage: 4,
        name: "Кризис",
        description: "Истощение, бессонница, тревога, конфликты",
        characteristics: [
          "Истощение",
          "Бессонница",
          "Тревога",
          "Конфликты",
          "Снижение продуктивности",
        ],
      };
    }
    if (score >= greenbergStages[3].min) {
      return {
        stage: 3,
        name: "Хронические симптомы",
        description: "Болезни, апатия, утрата интереса, формальность",
        characteristics: [
          "Болезни",
          "Апатия",
          "Утрата интереса",
          "Формальность",
          "Снижение качества работы",
        ],
      };
    }
    if (score >= greenbergStages[2].min) {
      return {
        stage: 2,
        name: "Недостаток топлива",
        description: "Хроническая усталость, раздражение, компенсация стимуляторами",
        characteristics: [
          "Хроническая усталость",
          "Раздражение",
          "Компенсация стимуляторами",
          "Снижение энтузиазма",
          "Первые признаки выгорания",
        ],
      };
    }
    return {
      stage: 1,
      name: "Медовый месяц",
      description: "Высокая энергия, лёгкое перенапряжение, энтузиазм",
      characteristics: [
        "Высокая энергия",
        "Лёгкое перенапряжение",
        "Энтузиазм",
        "Готовность к переработкам",
        "Высокая продуктивность",
      ],
    };
  }

  private static getRecommendations(burnoutLevel: BurnoutLevel, stage: GreenbergStage): string[] {
    const recommendations: string[] = [];

    // Base recommendations based on burnout level
    switch (burnoutLevel.level) {
      case "critical":
        recommendations.push(
          "🚨 Немедленно обратитесь к специалисту по психическому здоровью",
          "🏥 Рассмотрите возможность медицинского отпуска",
          "🔄 Кардинально пересмотрите свой образ жизни",
          "👥 Обратитесь за поддержкой к близким",
        );
        break;
      case "severe":
        recommendations.push(
          "👨‍⚕️ Обратитесь за профессиональной помощью",
          "⏰ Значительно сократите рабочую нагрузку",
          "🧘 Внедрите техники стресс-менеджмента",
          "💤 Обеспечьте качественный сон и отдых",
        );
        break;
      case "high":
        recommendations.push(
          "📋 Пересмотрите свои приоритеты и задачи",
          '🚫 Научитесь говорить "нет" лишним обязательствам',
          "🏃‍♂️ Увеличьте физическую активность",
          "🎯 Установите четкие границы между работой и личной жизнью",
        );
        break;
      case "moderate":
        recommendations.push(
          "⚖️ Следите за балансом работы и отдыха",
          "🧘‍♀️ Практикуйте техники релаксации",
          "📅 Планируйте регулярные перерывы",
          "💪 Развивайте навыки управления стрессом",
        );
        break;
      case "low":
        recommendations.push(
          "✅ Продолжайте следить за своим состоянием",
          "🎯 Поддерживайте текущий баланс",
          "📈 Развивайте навыки профилактики стресса",
          "🤝 Поддерживайте социальные связи",
        );
        break;
    }

    // Additional recommendations based on Greenberg stage
    if (stage.stage >= 3) {
      recommendations.push(
        "🗣️ Открыто обсудите свои проблемы с руководством",
        "🔄 Рассмотрите возможность смены деятельности или роли",
      );
    }

    if (stage.stage >= 4) {
      recommendations.push(
        "🌿 Возьмите продолжительный отпуск для восстановления",
        "🧠 Рассмотрите психотерапию или консультирование",
      );
    }

    return recommendations;
  }

  public static analyzeResults(
    responses: SurveyResponse[],
    scoringRules: ScoringRules,
  ): DiagnosticResult {
    const totalScore = this.calculateTotalScore(responses);
    const burnoutLevel = this.getBurnoutLevel(totalScore, scoringRules);
    const greenbergStage = this.getGreenbergStage(totalScore, scoringRules);
    const recommendations = this.getRecommendations(burnoutLevel, greenbergStage);

    return {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      responses,
      burnoutLevel,
      greenbergStage,
      totalScore,
      maxTotalScore: burnoutLevel.maxScore,
      recommendations,
    };
  }
}
