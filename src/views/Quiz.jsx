import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import FloatingStarsCanvas from "../components/FloatingStarsCanvas";
import { FaQuestion, FaListAlt, FaTachometerAlt, FaRegSmileBeam, FaCogs } from "react-icons/fa";

const Quiz = () => {
    const nickname = useSelector((state) => state.appVars.nickname)
    const questionTimeLimit = 10;
    const [questionNumber, setQuestionNumber] = useState(10)
    const [category, setCategory] = useState("any")
    const [difficulty, setDifficulty] = useState("any")
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [trueCount, setTrueCount] = useState(0)
    const [currentAnswer, setCurrentAnswer] = useState(null)
    const [timeLeft, setTimeLeft] = useState(0)
    const [quizEnded, setQuizEnded] = useState(false)
    const [isAnswerDisabled, setIsAnswerDisabled] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    const startQuiz = () => {
        fetch(`https://opentdb.com/api.php?${questionNumber == 'any' ? '' : `amount=${questionNumber}`}&${category == 'any' ? '' : `category=${category}`}&${difficulty == 'any' ? '' : `difficulty=${difficulty}`}&type=multiple`)
            .then((response) => { return response.json() })
            .then((response) => {
                let questions = response.results;
                questions.map(question => {
                    question['shuffled_answers'] = shuffleArray([question.correct_answer, ...question.incorrect_answers]);
                })
                setQuizEnded(false);
                setQuestions(questions);
            })
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle algoritması
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {

        if (questions.length < 1) return;
        // Sayaç başlangıcı
        setTimeLeft(questionTimeLimit);

        // Sayaç fonksiyonu
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {

                if (prevTimeLeft < 1) {
                    if (!currentAnswer) answerQuestion()
                    clearInterval(timer); // Süre bittiğinde sayaç durdurulur
                    return 0
                }

                return prevTimeLeft - 1;
            });
        }, 1000);

        // Component unmount olursa veya yeni soruya geçilirse sayaç temizlenir
        return () => clearInterval(timer);
    }, [currentIndex, questions]);

    const answerQuestion = (answer) => {
        if (isAnswerDisabled) return; // Eğer seçenek devre dışı bırakıldıysa, tıklamaya izin verme

        // Eğer daha önce cevap verildiyse, sadece ilk doğru tıklamada sayıyı artır
        if (!currentAnswer) setCurrentAnswer(answer);

        // İlk doğru cevabı verdiğinde doğru sayısını artır
        if (answer === questions[currentIndex].correct_answer && currentAnswer !== questions[currentIndex].correct_answer) {
            setTrueCount(trueCount + 1);
        }

        // Cevap verildikten sonra timerı durdur
        setTimeLeft(0);

        // Seçeneklerin tıklanmasını engelle
        setIsAnswerDisabled(true);

        // Cevapla ilgili bilgiyi state'e kaydet
        setAnsweredQuestions((prev) => [...prev, { index: currentIndex, answer, isCorrect: answer === questions[currentIndex].correct_answer }]);

        // 2 saniye sonra, cevabı sıfırla ve sonraki soruya geç
        setTimeout(() => {
            setCurrentAnswer(null); // Cevap sıfırlandı
            if (currentIndex === (questions.length - 1)) setQuizEnded(true); // Quiz bitti mi?
            else setCurrentIndex(currentIndex + 1); // Sonraki soruya geç
            setIsAnswerDisabled(false); // Seçenekleri tekrar aktif yap
        }, 2000);
    };

    const restartQuiz = () => {

        setQuestionNumber(10);
        setCategory("any");
        setDifficulty("any");
        setQuestions([]);
        setCurrentIndex(0);
        setCurrentAnswer(null);
        setTimeLeft(0);
        setQuizEnded(false);
        setTrueCount(0);
    }
    const getCompletionMessage = () => {
        const percentage = (trueCount / questions.length) * 100;

        if (percentage === 100) {
            return "Excellent work! Absolute masterpiece... 🎉";
        } else if (percentage >= 75) {
            return "Congratulations, very good job. Let's try with harder one 🎉";
        } else if (percentage >= 50) {
            return "Just an average work. Maybe you should try your luck with an easier test? 🥸";
        } else {
            return "Maybe you should try your luck with a children's test, you might have better chances. 😆";
        }
    };

    return (
        questions.length > 0 ?
            (
                quizEnded ?
                    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-orange-400 px-6 text-gray-800 overflow-hidden z-0">
                        <FloatingStarsCanvas starCount={150}></FloatingStarsCanvas>
                        <div className="bg-white/95 p-8 text-center shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center flex-col gap-6 z-50 transition-all duration-300">
                            <h1 className="text-5xl font-pacifico tracking-tight text-orange-400 p-4 z-50 transition-all">
                                Halo's Quiz Results
                            </h1>
                            <span className="text-2xl text-orange-500 font-bold">True Count: {trueCount}/{questions.length} Score:{Math.round((trueCount / questions.length) * 100)}</span>
                            <span className="text-xl">{getCompletionMessage()}</span>
                            <button
                                onClick={() => restartQuiz()}
                                className="w-full font-poppins bg-orange-400 text-white font-medium py-3 rounded-xl shadow-lg transition duration-300 hover:scale-105 transform hover:shadow-2xl hover:bg-white hover:text-orange-500 hover:border-2 hover:border-orange-500">
                                Start a New Test!
                            </button>
                        </div>
                    </div>

                    :
                    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-orange-400 px-6 text-gray-800 overflow-hidden z-0">
                        <FloatingStarsCanvas starCount={150}></FloatingStarsCanvas>

                        <div className="bg-white/95 p-8 shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center flex-col gap-6 z-50 transition-all duration-300">
                            <div className="flex justify-center w-[120px] h-[120px] mb-6 z-50">
                                <CircularProgressbar value={(timeLeft / questionTimeLimit) * 100} text={timeLeft} styles={buildStyles({
                                    textSize: '20px',
                                    pathColor: `#fb923c`,
                                    textColor: '#fb923c',
                                    trailColor: '#fefefe3d',
                                    backgroundColor: '#f97316',
                                })} />
                            </div>
                            <span className="text-orange-400 font-bold text-2xl mb-2">Question {currentIndex + 1}</span>
                            <span className="text-black text-center font-medium text-lg mb-4" dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }} ></span>
                            <div className="space-y-4 w-full">
                                {
                                    questions[currentIndex]['shuffled_answers'].map(answer =>
                                        <button key={answer} onClick={() => answerQuestion(answer)}
                                            disabled={isAnswerDisabled}
                                            className={'w-full py-3 px-4 rounded-lg  border-2 font-semibold ' +
                                                (
                                                    answeredQuestions.some((q) => q.index === currentIndex && q.answer === answer) // Eğer cevap verildiyse
                                                        ? // Cevap verildiyse, doğru/yanlış durumu kontrol edilerek renk verilir
                                                        (answer === questions[currentIndex].correct_answer
                                                            ? 'bg-green-500 text-white' // Doğru cevap
                                                            : 'bg-red-500 text-white') // Yanlış cevap
                                                        : 'bg-white text-orange-400' // Eğer henüz cevap verilmediyse normal renk
                                                )}
                                            dangerouslySetInnerHTML={{ __html: answer }}
                                        ></button>)
                                }
                            </div>
                            <h1 className="text-3xl font-pacifico tracking-tight text-orange-400 z-50 transition-all">
                                Halo's Quiz
                            </h1>
                        </div>
                    </div>
            )
            :
            <div className="relative font-poppins min-h-screen w-full flex flex-col items-center justify-center bg-orange-400 px-6 text-gray-800 overflow-hidden z-0">
                <FloatingStarsCanvas starCount={150}></FloatingStarsCanvas>
                <h1 className="text-5xl font-pacifico tracking-tight text-white p-10 z-50 transition-all">
                    Halo's Quiz
                </h1>
                <div className="bg-white/95 p-12 shadow-xl shadow-gray-400 rounded-xl flex items-center justify-center flex-col gap-6 z-50 transition-all duration-300">
                    <span className="text-xl text-black z-50">Hey <b className="text-orange-400">{nickname}</b>! Choose your settings and then start your test! 🤩</span>
                    <div className="space-y-4 w-auto z-50">
                        <div className="flex flex-col">
                            <span className="font-medium text-orange-500 flex items-center gap-2">
                                <FaQuestion /> Number of Questions
                            </span>
                            <input
                                onChange={e => setQuestionNumber(e.target.value)}
                                value={questionNumber}
                                type="number"
                                className="bg-white border-2 border-orange-500 text-orange-500 rounded-lg w-full p-3 transition-all focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-orange-500 flex items-center gap-2">
                                <FaListAlt /> Category
                            </span>
                            <select
                                onChange={e => setCategory(e.target.value)}
                                value={category}
                                className="bg-white border-2 border-orange-500 text-orange-500 rounded-lg w-full p-3 transition-all  focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            >
                                <option value="any">Any Category</option>
                                <option value="9">General Knowledge</option><option value="10">Entertainment: Books</option><option value="11">Entertainment: Film</option><option value="12">Entertainment: Music</option><option value="13">Entertainment: Musicals &amp; Theatres</option><option value="14">Entertainment: Television</option><option value="15">Entertainment: Video Games</option><option value="16">Entertainment: Board Games</option><option value="17">Science &amp; Nature</option><option value="18">Science: Computers</option><option value="19">Science: Mathematics</option><option value="20">Mythology</option><option value="21">Sports</option><option value="22">Geography</option><option value="23">History</option><option value="24">Politics</option><option value="25">Art</option><option value="26">Celebrities</option><option value="27">Animals</option><option value="28">Vehicles</option><option value="29">Entertainment: Comics</option><option value="30">Science: Gadgets</option><option value="31">Entertainment: Japanese Anime &amp; Manga</option><option value="32">Entertainment: Cartoon &amp; Animations</option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-orange-500 flex items-center gap-2">
                                <FaTachometerAlt /> Difficulty
                            </span>
                            <select
                                onChange={e => setDifficulty(e.target.value)}
                                value={difficulty}
                                className="bg-white border-2 border-orange-500 text-orange-500 rounded-lg w-full p-3 transition-all focus:ring-2 focus:ring-orange-400 focus:outline-none"
                            >
                                <option value="any">Any Difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => startQuiz()}
                        className="w-full font-poppins bg-orange-400 text-white font-medium py-3 rounded-xl shadow-lg transition duration-300 hover:scale-105 transform hover:shadow-2xl hover:bg-white hover:text-orange-500 hover:border-2 hover:border-orange-500"
                    >
                        Start
                    </button>

                </div>
            </div>
    )
}
export default Quiz
