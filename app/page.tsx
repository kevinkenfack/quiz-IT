"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import confetti from "canvas-confetti"
import { toast } from "sonner"

const questions = [
  {
    question: "Quel langage de programmation a été créé par Dennis Ritchie en 1972?",
    choices: ["COBOL", "C", "Python", "Langage des Schtroumpfs"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quel est le nom du premier ordinateur électronique, construit en 1946?",
    choices: ["ENIAC", "EDVAC", "UNIVAC", "Terminator"],
    correctAnswerIndex: 0,
  },
  {
    question: "Qu'est-ce que l'algorithme de recherche Google?",
    choices: ["PageRank", "GoogleBot", "Bing", "Jus de cerveau"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel langage de programmation a été créé par Yukihiro Matsumoto?",
    choices: ["Ruby", "JavaScript", "Python", "Java"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel système d'exploitation a été développé par Linus Torvalds?",
    choices: ["Windows", "macOS", "Android", "Linux"],
    correctAnswerIndex: 3,
  },
  {
    question: "Quel est le protocole utilisé pour transférer des fichiers sur le web?",
    choices: ["HTTP", "FTP", "SMTP", "Protocole de transfert de pizzas"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quelle est la principale utilisation du langage de programmation SQL?",
    choices: ["Gestion de base de données", "Développement web", "Calcul scientifique", "Rédaction de romans"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quelle entreprise a développé le langage de programmation Java?",
    choices: ["Microsoft", "Apple", "Sun Microsystems", "Pieds Nickelés Inc."],
    correctAnswerIndex: 2,
  },
  {
    question: "Quelle est la principale différence entre IPv4 et IPv6?",
    choices: ["Taille de l'adresse IP", "Vitesse de connexion", "Sécurité", "Goût de la pizza"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel est le nom du superordinateur développé par IBM qui a joué au jeu 'Jeopardy!'?",
    choices: ["Deep Blue", "Watson", "AlphaGo", "Super Skynet"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quelle est la principale utilisation du langage de programmation R?",
    choices: ["Développement web", "Calcul scientifique", "Intelligence artificielle", "Création de memes"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quel est le nom du langage de balisage utilisé pour structurer le contenu d'une page web?",
    choices: ["HTML", "CSS", "JavaScript", "Gâteau au chocolat"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel est le nom de l'unité de mesure de la capacité de stockage des disques durs?",
    choices: ["Byte", "Bit", "Nibble", "Croissant"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quelle technologie est utilisée pour créer des images 3D dans les navigateurs web?",
    choices: ["WebGL", "HTML5", "CSS3", "Peinture à l'huile"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel est le nom de l'inventeur de la machine à écrire?",
    choices: ["Christopher Latham Sholes", "Charles Babbage", "Herman Hollerith", "Chapelier Fou"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quelle est la vitesse de la lumière dans la fibre optique?",
    choices: ["300 000 km/s", "225 000 km/s", "200 000 km/s", "1 escargot/s"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quel est le nom du format d'image sans perte de qualité?",
    choices: ["JPEG", "GIF", "PNG", "Format dinosaure"],
    correctAnswerIndex: 2,
  },
  {
    question: "Quel est le nom du célèbre test d'intelligence artificielle proposé par Alan Turing?",
    choices: ["Le test de Turing", "Le test de Farnsworth", "Le test de Voight-Kampff", "Le test des petits pois"],
    correctAnswerIndex: 0,
  },
  {
    question: "Quel est le nom du réseau de neurones développé par Google pour la reconnaissance d'image?",
    choices: ["Inception", "ResNet", "VGG", "PicassoNet"],
    correctAnswerIndex: 0,
  },
  {
    question: "Qui est le fondateur de l'entreprise SpaceX?",
    choices: ["Jeff Bezos", "Richard Branson", "Elon Musk", "Buzz l'Éclair"],
    correctAnswerIndex: 2,
  },
  {
    question: "Quel protocole est utilisé pour sécuriser les communications sur le Web ?",
    choices: ["HTTP", "HTTPS", "FTP", "SMTP"],
    correctAnswerIndex: 1,
  },
  {
    question: "Lequel des suivants est un exemple de système de gestion de versions décentralisé ?",
    choices: ["SVN", "CVS", "Git", "Mercurial"],
    correctAnswerIndex: 2,
  },
  {
    question: "Quel terme désigne un ensemble de règles permettant à des ordinateurs de communiquer sur un réseau ?",
    choices: ["API", "Protocole", "Framework", "Syntaxe"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quel type de logiciel malveillant se propage en se répliquant sur d'autres ordinateurs ou réseaux ?",
    choices: ["Virus", "Cheval de Troie", "Ver", "Ransomware"],
    correctAnswerIndex: 2,
  },
  {
    question:
      "En programmation orientée objet, quel concept permet à une classe d'hériter des propriétés et méthodes d'une autre classe ?",
    choices: ["Encapsulation", "Polymorphisme", "Héritage", "Abstraction"],
    correctAnswerIndex: 2,
  },
  {
    question: "Quelle entreprise a initialement développé le framework JavaScript Angular ?",
    choices: ["Facebook", "Google", "Microsoft", "Twitter"],
    correctAnswerIndex: 1,
  },
  {
    question: "Quel est le nom de l'assistant virtuel développé par Apple ?",
    choices: ["Alexa", "Cortana", "Siri", "Google Assistant"],
    correctAnswerIndex: 2,
  },
  {
    question:
      "Lequel de ces langages est principalement utilisé pour le développement d'applications mobiles sur iOS ?",
    choices: ["Java", "Kotlin", "Swift", "C#"],
    correctAnswerIndex: 2,
  },
  {
    question: "Quel type de base de données stocke les données dans des tables avec des lignes et des colonnes ?",
    choices: ["NoSQL", "Relationnelle (SQL)", "Graph", "Orientée document"],
    correctAnswerIndex: 1,
  },
  {
    question: "Que signifie l'acronyme 'CPU' en informatique ?",
    choices: ["Central Processing Unit", "Computer Personal Unit", "Control Processing Unit", "Core Programming Unit"],
    correctAnswerIndex: 0,
  },
]

type Screen = "start" | "quiz" | "end"

export default function QuizApp() {
  const [screen, setScreen] = useState<Screen>("start")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswerIndex, setUserAnswerIndex] = useState<number | null>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const startQuiz = () => {
    setScreen("quiz")
  }

  const answerQuestion = (answerIndex: number) => {
    if (answered) return

    setAnswered(true)
    setUserAnswerIndex(answerIndex)

    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex

    if (isCorrect) {
      setScore((prev) => prev + 1)
      // Toast de succès
      toast.success("🎉 Excellente réponse !", {
        description: "Bravo, tu connais bien l'informatique !",
        duration: 1500,
      })
      // Confettis pour chaque bonne réponse
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#22c55e", "#16a34a", "#15803d"],
      })
    } else {
      // Toast d'erreur avec la bonne réponse
      toast.error("❌ Dommage !", {
        description: `La bonne réponse était : ${currentQuestion.choices[currentQuestion.correctAnswerIndex]}`,
        duration: 2000,
      })
    }

    setTimeout(() => {
      setAnswered(false)
      setUserAnswerIndex(null)

      if (currentQuestionIndex + 1 >= questions.length) {
        setScreen("end")
      } else {
        setCurrentQuestionIndex((prev) => prev + 1)
      }
    }, 2000)
  }

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 160,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe", "#ffffff"],
    })
  }

  const restartQuiz = () => {
    setScreen("start")
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnswered(false)
    setUserAnswerIndex(null)
  }

  const getButtonClass = (index: number) => {
    const baseClass = "h-auto p-4 text-left justify-start whitespace-normal transition-all duration-300 transform"

    if (!answered) {
      return `${baseClass} bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700 hover:scale-[1.02]`
    }

    if (index === currentQuestion.correctAnswerIndex) {
      return `${baseClass} bg-green-600 hover:bg-green-600 text-white border-green-500 scale-[1.02] shadow-lg shadow-green-500/25`
    }

    if (index === userAnswerIndex && index !== currentQuestion.correctAnswerIndex) {
      return `${baseClass} bg-red-600 hover:bg-red-600 text-white border-red-500 scale-[1.02] shadow-lg shadow-red-500/25`
    }

    return `${baseClass} bg-zinc-700 text-zinc-400 border-zinc-600 opacity-50`
  }

  const getAnswerIcon = (index: number) => {
    if (!answered) return null

    if (index === currentQuestion.correctAnswerIndex) {
      return <span className="text-white text-xl font-bold">✓</span>
    }

    if (index === userAnswerIndex && index !== currentQuestion.correctAnswerIndex) {
      return <span className="text-white text-xl font-bold">✗</span>
    }

    return null
  }

  const getScoreMessage = () => {
    if (score < 9)
      return { emoji: "😞", message: "Oh non! Tu peux faire mieux. Tu as sûrement besoin de plus de connaissances." }
    if (score < 18)
      return { emoji: "🙂", message: "Pas mal, mais il y a encore des choses à apprendre. Continue à étudier!" }
    if (score < 25) return { emoji: "😀", message: "Bravo! Bon score! Tu es sur la bonne voie." }
    return { emoji: "🎉", message: "Félicitations! Tu es un expert en informatique!" }
  }

  useEffect(() => {
    if (screen === "end" && score >= 25) {
      launchConfetti()
    }
  }, [screen, score])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
        {screen === "quiz" && (
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                Question {currentQuestionIndex + 1} / {questions.length}
              </Badge>
              <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">
                Score: {score}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 bg-zinc-800" />
          </div>
        )}

        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            {screen === "start" && "Quiz Informatique"}
            {screen === "quiz" && "Teste ton niveau !"}
            {screen === "end" && "Résultats"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {screen === "start" && "Teste ton niveau de culture informatique"}
            {screen === "quiz" && "Choisis la bonne réponse"}
            {screen === "end" && `Score final : ${score} / ${questions.length}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {screen === "start" && (
            <div className="text-center">
              <Button onClick={startQuiz} size="lg" className="bg-blue-600 hover:bg-blue-700">
                Je commence
              </Button>
            </div>
          )}

          {screen === "quiz" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white leading-relaxed">{currentQuestion.question}</h3>
              <div className="grid gap-3">
                {currentQuestion.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => answerQuestion(index)}
                    disabled={answered}
                    className={getButtonClass(index)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <span className="font-medium mr-3 text-zinc-400">{String.fromCharCode(65 + index)}.</span>
                        <span>{choice}</span>
                      </div>
                      {getAnswerIcon(index)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {screen === "end" && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
              <p className="text-lg text-zinc-300 leading-relaxed">{getScoreMessage().message}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={restartQuiz} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Recommencer le quiz
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
