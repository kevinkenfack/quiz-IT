// tests.js

// Minimal mock of yourQuestionsData for testing
const yourQuestionsData = [
    { question: "Q1", choices: ["A", "B"], correctAnswerIndex: 0 },
    { question: "Q2", choices: ["C", "D"], correctAnswerIndex: 1 },
    { question: "Q3", choices: ["E", "F"], correctAnswerIndex: 0 }
];

// Mock confetti for testing purposes
const confetti = {
  create: function() {
    return function() { /* Mocked confetti function */ };
  }
};

// The quizApp function, copied from index.html for isolated testing.
// (Ideally, this would be in a shared .js file if we were refactoring for testability)
function quizApp() {
  return {
    screen: 'start',
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answered: false,
    userAnswerIndex: null,
    init() {
      this.questions = yourQuestionsData; 
    },
    startQuiz() {
      this.screen = 'quiz';
    },
    get currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    buttonClass(index) { /* Not directly tested for logic, only for state changes it depends on */ },
    answerQuestion(answerIndex) {
      if (this.answered) return;
      this.answered = true;
      this.userAnswerIndex = answerIndex;
      if (answerIndex === this.currentQuestion.correctAnswerIndex) {
        this.score += 1;
      }
      // For testing, we'll ignore the setTimeout behavior or test state before it.
      // To fully test the async part, a more complex setup or promises would be needed.
      // For now, let's focus on synchronous changes.
      // The original setTimeout is:
      // setTimeout(() => {
      //   this.answered = false;
      //   this.userAnswerIndex = null;
      //   this.currentQuestionIndex += 1;
      //   if (this.currentQuestionIndex >= this.questions.length) {
      //     this.screen = 'end';
      //   }
      // }, 1000);

      // Simplified for testing the immediate effect:
      // The state changes that would happen in setTimeout are handled by _advanceQuestion
      // for testing purposes.
    },
    // Helper for tests to advance state like the timeout would
    _advanceQuestion() {
        this.answered = false;
        this.userAnswerIndex = null;
        this.currentQuestionIndex += 1;
        if (this.currentQuestionIndex >= this.questions.length) {
            this.screen = 'end';
        }
    },
    launchConfetti() { /* Not directly tested for logic, but called if score is high */ },
    restartQuiz() {
      this.screen = 'start';
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.answered = false;
      this.userAnswerIndex = null;
      this.init(); // Re-initialize questions
    }
  };
}


// --- Test Harness ---
let testsRun = 0;
let testsPassed = 0;

function describe(description, fn) {
    console.log(`
--- ${description} ---`);
    fn();
}

function it(description, fn) {
    testsRun++;
    try {
        fn();
        console.log(`  ✅ PASS: ${description}`);
        testsPassed++;
    } catch (e) {
        console.error(`  ❌ FAIL: ${description}`);
        console.error(`    ${e.message}`);
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}. Expected "${expected}", got "${actual}".`);
    }
}

// --- Test Suites ---
describe('Quiz App Logic', () => {
    it('should initialize with correct default values', () => {
        const app = quizApp();
        app.init(); // Initialize with mock yourQuestionsData
        assertEqual(app.screen, 'start', 'Initial screen');
        assertEqual(app.currentQuestionIndex, 0, 'Initial question index');
        assertEqual(app.score, 0, 'Initial score');
        assertEqual(app.questions.length, yourQuestionsData.length, 'Questions loaded');
    });

    it('should change screen to "quiz" when startQuiz is called', () => {
        const app = quizApp();
        app.init();
        app.startQuiz();
        assertEqual(app.screen, 'quiz', 'Screen after startQuiz');
    });

    it('should return the current question', () => {
        const app = quizApp();
        app.init();
        app.currentQuestionIndex = 1; // Manually set for testing this getter
        assertEqual(app.currentQuestion.question, 'Q2', 'Current question content');
    });

    it('should increment score for a correct answer', () => {
        const app = quizApp();
        app.init();
        app.startQuiz(); // Screen is 'quiz', index is 0
        
        app.answerQuestion(0); // Q1, correct answer is index 0
        assertEqual(app.score, 1, 'Score after correct answer');
        assertEqual(app.answered, true, 'Answered state after answering');
    });

    it('should not increment score for an incorrect answer', () => {
        const app = quizApp();
        app.init();
        app.startQuiz(); // Screen is 'quiz', index is 0

        app.answerQuestion(1); // Q1, correct answer is index 0, user chose 1 (incorrect)
        assertEqual(app.score, 0, 'Score after incorrect answer');
        assertEqual(app.answered, true, 'Answered state after answering');
    });
    
    it('should advance to the next question and reset answered state (simulating timeout via _advanceQuestion)', () => {
        const app = quizApp();
        app.init();
        app.startQuiz();
        
        app.answerQuestion(0); // Answer Q1
        // Manually call _advanceQuestion to simulate progression after timeout
        app._advanceQuestion(); 
        
        assertEqual(app.currentQuestionIndex, 1, 'Question index after advancing');
        assertEqual(app.answered, false, 'Answered state after advancing');
        assertEqual(app.userAnswerIndex, null, 'User answer index after advancing');
    });

    it('should change screen to "end" after all questions are answered', () => {
        const app = quizApp();
        app.init();
        app.startQuiz();

        // Answer all questions
        app.answerQuestion(yourQuestionsData[0].correctAnswerIndex); // Q1
        app._advanceQuestion();
        
        app.answerQuestion(yourQuestionsData[1].correctAnswerIndex); // Q2
        app._advanceQuestion();
        
        app.answerQuestion(yourQuestionsData[2].correctAnswerIndex); // Q3
        app._advanceQuestion(); // This should set screen to 'end'

        assertEqual(app.currentQuestionIndex, yourQuestionsData.length, 'Question index after all questions');
        assertEqual(app.screen, 'end', 'Screen after all questions answered');
    });

    it('should reset the quiz to initial state when restartQuiz is called from end screen', () => {
        const app = quizApp();
        app.init(); // Initial setup

        // Simulate going to the end of the quiz
        app.currentQuestionIndex = app.questions.length; // Or some other way to get to 'end' screen
        app.screen = 'end';
        app.score = 5; // Arbitrary score
        app.answered = true; // State it might be in at the end
        app.userAnswerIndex = 0; // Arbitrary state

        app.restartQuiz();

        assertEqual(app.screen, 'start', 'Screen after restart');
        assertEqual(app.currentQuestionIndex, 0, 'Current question index after restart');
        assertEqual(app.score, 0, 'Score after restart');
        assertEqual(app.answered, false, 'Answered state after restart');
        assertEqual(app.userAnswerIndex, null, 'User answer index after restart');
        // Verify questions are still initialized (init() was called)
        assertEqual(app.questions.length, yourQuestionsData.length, 'Questions array after restart'); 
    });
});

// --- Summary ---
// This part would normally be run in a test environment if tests were executed.
// For this task, defining the functions and tests as a string for file creation is sufficient.
// To run these tests, one would typically include this script in an HTML page with the quizApp
// or use a JavaScript test runner like Jest, Mocha, etc., after refactoring quizApp to be importable.

// console.log(`
// --- Test Summary ---`);
// console.log(`Total tests: ${testsRun}`);
// console.log(`Passed: ${testsPassed}`);
// console.log(`Failed: ${testsRun - testsPassed}`);
// console.log("To run these tests, open index.html (if linked) or use a JS test runner.");
// runAllTests(); // This would be called in a test execution context
