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
      for (const answer of response.answers) {
        if (typeof answer.value === "number") {
          totalScore += answer.value;
        }
      }
    }

    return totalScore;
  }

  private static getBurnoutLevel(score: number, rules: ScoringRules): BurnoutLevel {
    const { burnoutLevels } = rules;

    let level: BurnoutLevel["level"] = "low";
    let description = "";

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

    const maxTotalScore = 150; // Based on our survey configuration

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
        name: "Привычное выгорание",
        description: "Полное физическое и эмоциональное истощение",
        characteristics: [
          "Хроническое истощение",
          "Полная апатия к работе",
          "Физические симптомы",
          "Социальная изоляция",
          "Серьезные проблемы со здоровьем",
        ],
      };
    }
    if (score >= greenbergStages[4].min) {
      return {
        stage: 4,
        name: "Выгорание",
        description: "Апатия, цинизм и желание избежать работы",
        characteristics: [
          "Апатия и равнодушие",
          "Цинизм",
          "Снижение продуктивности",
          "Избегание обязанностей",
          "Проблемы с концентрацией",
        ],
      };
    }
    if (score >= greenbergStages[3].min) {
      return {
        stage: 3,
        name: "Хроническое недовольство",
        description: "Раздражительность и недовольство работой",
        characteristics: [
          "Постоянное раздражение",
          "Недовольство условиями",
          "Конфликты с коллегами",
          "Снижение качества работы",
          "Частые жалобы",
        ],
      };
    }
    if (score >= greenbergStages[2].min) {
      return {
        stage: 2,
        name: "Застой",
        description: "Снижение энтузиазма и мотивации",
        characteristics: [
          "Потеря интереса",
          "Снижение энтузиазма",
          "Рутинность в работе",
          "Уменьшение креативности",
          "Первые признаки усталости",
        ],
      };
    }
    return {
      stage: 1,
      name: "Медовый месяц",
      description: "Высокая мотивация и энергия",
      characteristics: [
        "Высокая мотивация",
        "Энтузиазм",
        "Готовность к переработкам",
        "Оптимизм",
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
