document.addEventListener('DOMContentLoaded', () => {

    let currentNumerator = 0;
    let currentDenominator = 0;
    let correctSimplifiedNumerator = 0;
    let correctSimplifiedDenominator = 0;
    let currentGCD = 1;

    let currentNum1 = 0;
    let currentDen1 = 0;
    let currentNum2 = 0;
    let currentDen2 = 0;
    let correctMultiplyNumerator = 0;
    let correctMultiplyDenominator = 0;

    const sections = document.querySelectorAll('main section');
    const navButtons = document.querySelectorAll('nav button, button.nav-button-inline');

    const taskNumeratorElement = document.getElementById('task-numerator');
    const taskDenominatorElement = document.getElementById('task-denominator');
    const userNumeratorInput = document.getElementById('user-numerator');
    const userDenominatorInput = document.getElementById('user-denominator');
    const checkShorteningBtn = document.getElementById('check-shortening-btn');
    const hintBtn = document.getElementById('hint-btn');
    const newShorteningTaskBtn = document.getElementById('new-shortening-task-btn');
    const shorteningFeedbackElement = document.getElementById('shortening-feedback');

    const mTaskNumerator1Element = document.getElementById('m-task-numerator1');
    const mTaskDenominator1Element = document.getElementById('m-task-denominator1');
    const mTaskNumerator2Element = document.getElementById('m-task-numerator2');
    const mTaskDenominator2Element = document.getElementById('m-task-denominator2');
    const mUserNumeratorInput = document.getElementById('m-user-numerator');
    const mUserDenominatorInput = document.getElementById('m-user-denominator');
    const mCheckAnswerBtn = document.getElementById('m-check-answer-btn');
    const mNewTaskBtn = document.getElementById('m-new-task-btn');
    const mFeedbackElement = document.getElementById('m-feedback');

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        if (b === 0) return a;
        return gcd(b, a % b);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });
        window.scrollTo(0, 0); // Scroll til toppen ved seksjonsbytte

        if (sectionId === 'practice') {
            generateNewShorteningTask();
        } else if (sectionId === 'multiply-practice') {
            generateNewMultiplyTask();
        }
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section; // Bruk data-section attributt
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });

    function showShorteningFeedback(message, type) {
        shorteningFeedbackElement.textContent = message;
        shorteningFeedbackElement.className = type;
    }

    function showMultiplyFeedback(message, type) {
        mFeedbackElement.textContent = message;
        mFeedbackElement.className = type;
    }

    function generateNewShorteningTask() {
        let factor;
        do {
            correctSimplifiedNumerator = getRandomInt(1, 10);
            correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20);
            while (gcd(correctSimplifiedNumerator, correctSimplifiedDenominator) !== 1) {
                correctSimplifiedNumerator = getRandomInt(1, 10);
                correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20);
            }
            factor = getRandomInt(2, 5);
            currentNumerator = correctSimplifiedNumerator * factor;
            currentDenominator = correctSimplifiedDenominator * factor;
        } while (currentNumerator === correctSimplifiedNumerator);

        currentGCD = gcd(currentNumerator, currentDenominator);

        taskNumeratorElement.textContent = currentNumerator;
        taskDenominatorElement.textContent = currentDenominator;

        userNumeratorInput.value = '';
        userDenominatorInput.value = '';
        showShorteningFeedback('', '');
        userNumeratorInput.disabled = false;
        userDenominatorInput.disabled = false;
        checkShorteningBtn.disabled = false;
        hintBtn.disabled = false;
        newShorteningTaskBtn.style.display = 'none';
    }

    function checkShorteningAnswer() {
        const userNum = parseInt(userNumeratorInput.value);
        const userDen = parseInt(userDenominatorInput.value);

        if (isNaN(userNum) || isNaN(userDen) || userDen <= 0 || userNum < 0 ) { // Nevner > 0, Teller >= 0
             showShorteningFeedback("Ugyldig input. Skriv inn heltall (nevner må være positiv).", "error");
            return;
        }

        if (currentNumerator * userDen !== currentDenominator * userNum) {
            showShorteningFeedback(`Feil. ${userNum}/${userDen} er ikke lik ${currentNumerator}/${currentDenominator}. Husk å dele teller og nevner med det samme tallet.`, "error");
            return;
        }

        if (gcd(userNum, userDen) === 1) {
             // Spesiell sjekk for 0: 0/1 er den enkleste formen for 0
             if (currentNumerator === 0 && userNum === 0 && userDen === 1) {
                 // OK
             } else if (currentNumerator !== 0 && userNum === 0) {
                  showShorteningFeedback(`Feil. ${userNum}/${userDen} er ikke lik ${currentNumerator}/${currentDenominator}.`, "error");
                  return;
             }
            showShorteningFeedback(`Perfekt! ${currentNumerator}/${currentDenominator} forkortes til ${userNum}/${userDen}. Helt riktig!`, "success");
            userNumeratorInput.disabled = true;
            userDenominatorInput.disabled = true;
            checkShorteningBtn.disabled = true;
            hintBtn.disabled = true;
            newShorteningTaskBtn.style.display = 'inline-block';
        } else {
            showShorteningFeedback(`Riktig verdi, men ${userNum}/${userDen} kan forkortes mer! Oppgi svaret på enkleste form.`, "info");
        }
    }

    function showShorteningHint() {
        if (currentGCD > 1) {
            showShorteningFeedback(`Hint: Største Felles Faktor (SFF) for ${currentNumerator} og ${currentDenominator} er ${currentGCD}. Del begge med dette tallet.`, "info");
        } else {
            showShorteningFeedback("Denne brøken kan ikke forkortes mer.", "info");
        }
    }

    function generateNewMultiplyTask() {
        currentNum1 = getRandomInt(1, 9);
        currentDen1 = getRandomInt(2, 10);
        currentNum2 = getRandomInt(1, 9);
        currentDen2 = getRandomInt(2, 10);

        let unsimplifiedNum = currentNum1 * currentNum2;
        let unsimplifiedDen = currentDen1 * currentDen2;

        let resultGcd = gcd(unsimplifiedNum, unsimplifiedDen);
        correctMultiplyNumerator = unsimplifiedNum / resultGcd;
        correctMultiplyDenominator = unsimplifiedDen / resultGcd;

        mTaskNumerator1Element.textContent = currentNum1;
        mTaskDenominator1Element.textContent = currentDen1;
        mTaskNumerator2Element.textContent = currentNum2;
        mTaskDenominator2Element.textContent = currentDen2;

        mUserNumeratorInput.value = '';
        mUserDenominatorInput.value = '';
        showMultiplyFeedback('', '');
        mUserNumeratorInput.disabled = false;
        mUserDenominatorInput.disabled = false;
        mCheckAnswerBtn.disabled = false;
        mNewTaskBtn.style.display = 'none';
    }

    function checkMultiplyAnswer() {
        const userNum = parseInt(mUserNumeratorInput.value);
        const userDen = parseInt(mUserDenominatorInput.value);

        if (isNaN(userNum) || isNaN(userDen) || userDen <= 0 || userNum < 0) {
            showMultiplyFeedback("Ugyldig input. Skriv inn heltall (nevner må være positiv).", "error");
            return;
        }

        let unsimplifiedNum = currentNum1 * currentNum2;
        let unsimplifiedDen = currentDen1 * currentDen2;

        if (unsimplifiedNum * userDen !== unsimplifiedDen * userNum) {
             showMultiplyFeedback(`Feil. (${currentNum1}/${currentDen1}) × (${currentNum2}/${currentDen2}) blir ${unsimplifiedNum}/${unsimplifiedDen}, som ikke er lik ${userNum}/${userDen}.`, "error");
            return;
        }

        if (userNum === correctMultiplyNumerator && userDen === correctMultiplyDenominator) {
             showMultiplyFeedback(`Helt riktig! (${currentNum1}/${currentDen1}) × (${currentNum2}/${currentDen2}) = ${userNum}/${userDen}. Godt jobbet!`, "success");
            mUserNumeratorInput.disabled = true;
            mUserDenominatorInput.disabled = true;
            mCheckAnswerBtn.disabled = true;
            mNewTaskBtn.style.display = 'inline-block';
        } else {
             if (gcd(userNum, userDen) > 1 || (userNum === 0 && userDen !== 1) ){
                 showMultiplyFeedback(`Riktig verdi, men ${userNum}/${userDen} kan forkortes mer! Det enkleste svaret er ${correctMultiplyNumerator}/${correctMultiplyDenominator}.`, "info");
             } else {
                 // Skal egentlig ikke hit hvis logikken er rett, men som en backup
                 showMultiplyFeedback(`Verdien er riktig, men forventet ${correctMultiplyNumerator}/${correctMultiplyDenominator}. Sjekk om ${userNum}/${userDen} er helt forkortet.`, "info");
                 mNewTaskBtn.style.display = 'inline-block';
             }
        }
    }

    // Legg til Enter-key funksjonalitet for input-feltene
    function handleEnterKey(event, checkButton) {
        if (event.key === "Enter") {
            event.preventDefault(); // Forhindre standard Enter-oppførsel (f.eks. form submit)
            if (!checkButton.disabled) {
                 checkButton.click(); // Simuler klikk på sjekk-knappen
            }
        }
    }

    userNumeratorInput.addEventListener('keypress', (e) => handleEnterKey(e, checkShorteningBtn));
    userDenominatorInput.addEventListener('keypress', (e) => handleEnterKey(e, checkShorteningBtn));
    mUserNumeratorInput.addEventListener('keypress', (e) => handleEnterKey(e, mCheckAnswerBtn));
    mUserDenominatorInput.addEventListener('keypress', (e) => handleEnterKey(e, mCheckAnswerBtn));


    checkShorteningBtn.addEventListener('click', checkShorteningAnswer);
    newShorteningTaskBtn.addEventListener('click', generateNewShorteningTask);
    hintBtn.addEventListener('click', showShorteningHint);

    mCheckAnswerBtn.addEventListener('click', checkMultiplyAnswer);
    mNewTaskBtn.addEventListener('click', generateNewMultiplyTask);

    // Initialiser appen
    showSection('intro');

});
