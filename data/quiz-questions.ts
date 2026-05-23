import type { QuizQuestion } from "@/types"

export const quizQuestionsByDate: Record<string, QuizQuestion[]> = {
  "2026-06-11": [
    {
      id: "q1",
      question: "Which country has won the most FIFA World Cup titles?",
      options: ["Germany", "Argentina", "Brazil", "Italy"],
      correctAnswer: 2,
      category: "history",
    },
    {
      id: "q2",
      question: "How many teams are participating in the 2026 World Cup?",
      options: ["32", "40", "48", "64"],
      correctAnswer: 2,
      category: "trivia",
    },
    {
      id: "q3",
      question: "Which three countries are co-hosting the 2026 World Cup?",
      options: [
        "USA, Canada, Mexico",
        "USA, Brazil, Argentina",
        "Spain, Portugal, Morocco",
        "UK, France, Germany",
      ],
      correctAnswer: 0,
      category: "trivia",
    },
    {
      id: "q4",
      question: "Who scored the fastest goal in World Cup history?",
      options: ["Ronaldo", "Hakan Sukur", "Clint Dempsey", "Kylian Mbappe"],
      correctAnswer: 1,
      category: "history",
    },
    {
      id: "q5",
      question: "Which player has scored the most goals in World Cup history?",
      options: ["Pele", "Miroslav Klose", "Ronaldo Nazario", "Just Fontaine"],
      correctAnswer: 1,
      category: "history",
    },
  ],
  "2026-06-12": [
    {
      id: "q6",
      question: "Which country won the 2022 FIFA World Cup in Qatar?",
      options: ["France", "Brazil", "Argentina", "Croatia"],
      correctAnswer: 2,
      category: "history",
    },
    {
      id: "q7",
      question: "What is the official match ball for the 2026 World Cup called?",
      options: ["Telstar", "Brazuca", "Al Rihla", "Vamos 26"],
      correctAnswer: 3,
      category: "trivia",
    },
    {
      id: "q8",
      question:
        "Which venue will host the 2026 World Cup Final?",
      options: [
        "SoFi Stadium, LA",
        "MetLife Stadium, NJ",
        "AT&T Stadium, Dallas",
        "Azteca Stadium, Mexico City",
      ],
      correctAnswer: 1,
      category: "trivia",
    },
    {
      id: "q9",
      question: "How many World Cups has Lionel Messi played in (including 2026)?",
      options: ["4", "5", "6", "3"],
      correctAnswer: 1,
      category: "history",
    },
    {
      id: "q10",
      question: "Which team has made the most World Cup appearances without winning?",
      options: ["Netherlands", "Mexico", "Belgium", "Portugal"],
      correctAnswer: 0,
      category: "history",
    },
  ],
}

export function getQuestionsForDate(date: string): QuizQuestion[] {
  return quizQuestionsByDate[date] || quizQuestionsByDate["2026-06-11"]
}
