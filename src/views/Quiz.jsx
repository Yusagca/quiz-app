import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'; 


const Quiz = () => {
    const nickname = useSelector((state) => state.appVars.nickname)
    const questionTimeLimit = 10;
    const [ questionNumber, setQuestionNumber ] = useState(10)
    const [ category, setCategory ] = useState("any")
    const [ difficulty, setDifficulty ] = useState("any")
    const [ questions, setQuestions ] = useState([])
    const [ currentIndex, setCurrentIndex ] = useState(0)
    const [ trueCount, setTrueCount ] = useState(0)
    const [ currentAnswer, setCurrentAnswer ] = useState(null)
    const [ timeLeft, setTimeLeft ] = useState(0)
    const [ quizEnded, setQuizEnded ] = useState(false)

    const startQuiz = () => {
        fetch(`https://opentdb.com/api.php?${questionNumber == 'any' ? '' : `amount=${questionNumber}`}&${category == 'any' ? '' : `category=${category}`}&${difficulty == 'any' ? '' : `difficulty=${difficulty}`}&type=multiple`)
        .then((response) =>{ return response.json() })
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

        if(questions.length < 1) return;
        // Sayaç başlangıcı
        setTimeLeft(questionTimeLimit);

        // Sayaç fonksiyonu
        const timer = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                
                if (prevTimeLeft < 1) {
                    if(!currentAnswer) answerQuestion()
                    clearInterval(timer); // Süre bittiğinde sayaç durdurulur
                    //setCurrentIndex((prevIndex) => prevIndex + 1); // Sonraki soruya geçiş
                    //return questionTimeLimit; // Süreyi sıfırla
                    return 0
                }
                
                return prevTimeLeft - 1;
            });
        }, 1000);

        // Component unmount olursa veya yeni soruya geçilirse sayaç temizlenir
        return () => clearInterval(timer);
    }, [currentIndex, questions]);


    const answerQuestion = (answer) => {
        if(!answer) setCurrentAnswer('_______')
        else setCurrentAnswer(answer)
        if(answer == questions[currentIndex].correct_answer) {
            setTrueCount(trueCount + 1)
        }
        setTimeLeft(0);
        setTimeout(() => {
            setCurrentAnswer('')
            if(currentIndex == (questions.length - 1)) setQuizEnded(true)
            else setCurrentIndex(currentIndex + 1)
        }, 3000);
    }

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


    return (
        questions.length > 0 ?
        (
            quizEnded ? 
            <div className="flex flex-col text-center text-white">
                <span className="text-2xl">QUİZ BİTTİ!</span>
                <span className="text-3xl">{trueCount} soruya doğru cevap verdin.</span>
                <button onClick={() => restartQuiz()} className='mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'>Yeni bir quize başla</button>
            </div>
            :
            <div className="flex flex-col" style={{maxWidth: '800px', width: '800px'}}>
                <div className="flex flex-auto items-center justify-center">
                    <div style={{ width: 200, height: 200 }}>
                        <CircularProgressbar value={(timeLeft / questionTimeLimit) * 100} text={timeLeft} styles={buildStyles({
                            textSize: '12px',
                            pathColor: `#fff`,
                            textColor: '#fff',
                            trailColor: '#fefefe3d',
                            backgroundColor: '#3e98c7',
                        })}
    />;
                    </div>
                </div>
                <span className="text-white font-bold text-3xl">{currentIndex + 1}.soru:</span>
                <span className="text-white font-medium text-xl" dangerouslySetInnerHTML={{ __html: questions[currentIndex].question }} ></span>
                <div className="flex flex-col">
                    {
                        questions[currentIndex]['shuffled_answers'].map(answer =>
                        <button key={answer} onClick={() => answerQuestion(answer)}
                            className={ 'mt-6 hover:bg-grey-500 bg-white font-bold py-2 px-4 rounded-lg ' +
                                    (
                                        (currentAnswer && answer == questions[currentIndex].correct_answer) ? 'text-green-600' : 
                                        (currentAnswer && answer == currentAnswer && currentAnswer != questions[currentIndex].correct_answer ? 'text-red-600' : '')
                                    )}
                                    dangerouslySetInnerHTML={{ __html: answer }}
                            ></button>)
                    }
                </div>
            </div>
        )
        :
        <div className="flex flex-col">
            <span className="text-white font-medium text-lg">Merhaba <b>{nickname}</b>, quize başlamak için lütfen nasıl bir quiz istediğini seç</span>
            <div className="flex flex-col text-white mt-4">
                <div className="flex flex-col mt-2">
                    <span>Soru sayısı</span>
                    <input onChange={e => setQuestionNumber(e.target.value)} value={questionNumber} type="number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>
                <div className="flex flex-col mt-2">
                    <span>Kategori</span>
                    <select onChange={e => setCategory(e.target.value)} value={category} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="any">Any Category</option>
			            <option value="9">General Knowledge</option><option value="10">Entertainment: Books</option><option value="11">Entertainment: Film</option><option value="12">Entertainment: Music</option><option value="13">Entertainment: Musicals &amp; Theatres</option><option value="14">Entertainment: Television</option><option value="15">Entertainment: Video Games</option><option value="16">Entertainment: Board Games</option><option value="17">Science &amp; Nature</option><option value="18">Science: Computers</option><option value="19">Science: Mathematics</option><option value="20">Mythology</option><option value="21">Sports</option><option value="22">Geography</option><option value="23">History</option><option value="24">Politics</option><option value="25">Art</option><option value="26">Celebrities</option><option value="27">Animals</option><option value="28">Vehicles</option><option value="29">Entertainment: Comics</option><option value="30">Science: Gadgets</option><option value="31">Entertainment: Japanese Anime &amp; Manga</option><option value="32">Entertainment: Cartoon &amp; Animations</option>
                    </select>
                </div>
                <div className="flex flex-col mt-2">
                    <span>Zorluk</span>
                    <select onChange={e => setDifficulty(e.target.value)} value={difficulty} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="any">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>
            <button onClick={() => startQuiz()} className='mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'>Başla</button>
        </div>
    )
}
export default Quiz