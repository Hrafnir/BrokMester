document.addEventListener('DOMContentLoaded', () => {
    // --- Globale variabler ---
    // For forkorting
    let currentNumerator = 0;
    let currentDenominator = 0;
    let correctSimplifiedNumerator = 0;
    let correctSimplifiedDenominator = 0;
    let currentGCD = 1;

    // For multiplikasjon
    let currentNum1 = 0;
    let currentDen1 = 0;
    let currentNum2 = 0;
    let currentDen2 = 0;
    let correctMultiplyNumerator = 0;
    let correctMultiplyDenominator = 0;

    // --- DOM-element referanser ---
    const sections = document.querySelectorAll('main section');
    const navButtons = document.querySelectorAll('nav button');

    // Forkorting Elementer
    const taskNumeratorElement = document.getElementById('task-numerator');
    const taskDenominatorElement = document.getElementById('task-denominator');
    const userNumeratorInput = document.getElementById('user-numerator');
    const userDenominatorInput = document.getElementById('user-denominator');
    const checkShorteningBtn = document.getElementById('check-answer-btn'); // Tydeligere navn
    const hintBtn = document.getElementById('hint-btn');
    const newShorteningTaskBtn = document.getElementById('new-task-btn'); // Tydeligere navn
    const shorteningFeedbackElement = document.getElementById('feedback'); // Tydeligere navn

    // Multiplikasjon Elementer
    const mTaskNumerator1Element = document.getElementById('m-task-numerator1');
    const mTaskDenominator1Element = document.getElementById('m-task-denominator1');
    const mTaskNumerator2Element = document.getElementById('m-task-numerator2');
    const mTaskDenominator2Element = document.getElementById('m-task-denominator2');
    const mUserNumeratorInput = document.getElementById('m-user-numerator');
    const mUserDenominatorInput = document.getElementById('m-user-denominator');
    const mCheckAnswerBtn = document.getElementById('m-check-answer-btn');
    const mNewTaskBtn = document.getElementById('m-new-task-btn');
    const mFeedbackElement = document.getElementById('m-feedback');

    // --- Hjelpefunksjoner ---

    // Funksjon for å finne Største Felles Faktor (GCD/SFF) - Euklids algoritme
    function gcd(a, b) {
        a = Math.abs(a); // Sikre positive tall for algoritmen
        b = Math.abs(b);
        if (b === 0) {
            return a;
        }
        return gcd(b, a % b);
    }

    // Genererer tilfeldig heltall mellom min (inkludert) og max (inkludert)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // --- Navigasjon ---
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });

        // Generer relevant oppgave når øvingsseksjon vises
        if (sectionId === 'practice') {
            generateNewShorteningTask();
        } else if (sectionId === 'multiply-practice') {
            generateNewMultiplyTask();
        }
    }

    // Legg til klikk-event for navigasjonsknapper
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hent sectionId fra knappens onclick-attributt (litt "hacky", men funker for dette oppsettet)
            const onclickAttr = button.getAttribute('onclick');
            const sectionId = onclickAttr.substring(onclickAttr.indexOf('\'') + 1, onclickAttr.lastIndexOf('\''));
            showSection(sectionId);
        });
    });

    // --- Feedback Funksjoner ---
    function showShorteningFeedback(message, type) {
        shorteningFeedbackElement.textContent = message;
        shorteningFeedbackElement.className = type; // Setter CSS-klasse (success, error, info)
    }

    function showMultiplyFeedback(message, type) {
        mFeedbackElement.textContent = message;
        mFeedbackElement.className = type; // Setter CSS-klasse (success, error, info)
    }

    // --- Kjernefunksjoner Forkorting ---
    function generateNewShorteningTask() {
        let num, den, factor;
        do {
            // Lag en grunnbrøk som er ferdig forkortet
            correctSimplifiedNumerator = getRandomInt(1, 10);
            correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20); // Nevner > Teller
            while (gcd(correctSimplifiedNumerator, correctSimplifiedDenominator) !== 1) {
                correctSimplifiedNumerator = getRandomInt(1, 10);
                correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20);
            }
            // Velg en felles faktor å multiplisere med (> 1)
            factor = getRandomInt(2, 5);
            currentNumerator = correctSimplifiedNumerator * factor;
            currentDenominator = correctSimplifiedDenominator * factor;
        } while (currentNumerator === correctSimplifiedNumerator); // Sikrer at den *ble* multiplisert

        currentGCD = gcd(currentNumerator, currentDenominator);

        // Vis brøken
        taskNumeratorElement.textContent = currentNumerator;
        taskDenominatorElement.textContent = currentDenominator;

        // Tilbakestill UI
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

        if (isNaN(userNum) || isNaN(userDen) || userNum <= 0 || userDen <= 0) {
            showShorteningFeedback("Ugyldig input. Skriv inn positive heltall.", "error");
            return;
        }

        // 1. Sjekk om brukerens brøk er ekvivalent med originalen
        if (currentNumerator * userDen !== currentDenominator * userNum) {
            showShorteningFeedback(`Feil. ${userNum}/${userDen} er ikke lik ${currentNumerator}/${currentDenominator}. Husk å dele teller og nevner med det *samme* tallet.`, "error");
            return;
        }

        // 2. Sjekk om den er fullstendig forkortet (GCD=1)
        if (gcd(userNum, userDen) === 1) {
            showShorteningFeedback(`Perfekt! ${currentNumerator}/${currentDenominator} forkortes til ${userNum}/${userDen}. Helt riktig!`, "success");
            userNumeratorInput.disabled = true;
            userDenominatorInput.disabled = true;
            checkShorteningBtn.disabled = true;
            hintBtn.disabled = true;
            newShorteningTaskBtn.style.display = 'inline-block';
        } else {
            showShorteningFeedback(`Riktig at ${userNum}/${userDen} er lik ${currentNumerator}/${currentDenominator}, men den kan forkortes enda mer! Prøv igjen.`, "info");
        }
    }

    function showShorteningHint() {
        if (currentGCD > 1) {
            showShorteningFeedback(`Hint: Prøv å dele både ${currentNumerator} og ${currentDenominator} med ${currentGCD}. Det er den Største Felles Faktor (SFF).`, "info");
        } else {
            showShorteningFeedback("Denne brøken kan ikke forkortes mer.", "info");
        }
    }

    // --- Kjernefunksjoner Multiplikasjon ---
    function generateNewMultiplyTask() {
        // Generer to tilfeldige brøker
        currentNum1 = getRandomInt(1, 8);
        currentDen1 = getRandomInt(2, 9);
        currentNum2 = getRandomInt(1, 8);
        currentDen2 = getRandomInt(2, 9);

        // Beregn det uforkortede produktet
        let unsimplifiedNum = currentNum1 * currentNum2;
        let unsimplifiedDen = currentDen1 * currentDen2;

        // Beregn det korrekte, forkortede svaret
        let resultGcd = gcd(unsimplifiedNum, unsimplifiedDen);
        correctMultiplyNumerator = unsimplifiedNum / resultGcd;
        correctMultiplyDenominator = unsimplifiedDen / resultGcd;

        // Vis oppgaven
        mTaskNumerator1Element.textContent = currentNum1;
        mTaskDenominator1Element.textContent = currentDen1;
        mTaskNumerator2Element.textContent = currentNum2;
        mTaskDenominator2Element.textContent = currentDen2;

        // Tilbakestill UI
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

        if (isNaN(userNum) || isNaN(userDen) || userNum <= 0 || userDen <= 0) {
            showMultiplyFeedback("Ugyldig input. Skriv inn positive heltall for svaret.", "error");
            return;
        }

        // 1. Beregn det uforkortede produktet av oppgaven
        let unsimplifiedNum = currentNum1 * currentNum2;
        let unsimplifiedDen = currentDen1 * currentDen2;

        // 2. Sjekk om brukerens svar er ekvivalent med det uforkortede produktet
        if (unsimplifiedNum * userDen !== unsimplifiedDen * userNum) {
            showMultiplyFeedback(`Feil. (${currentNum1}/${currentDen1}) × (${currentNum2}/${currentDen2}) er ikke lik ${userNum}/${userDen}. Husk: teller × teller og nevner × nevner.`, "error");
            return;
        }

        // 3. Hvis ekvivalent, sjekk om det er fullstendig forkortet ved å sammenligne med det forhåndsberegnede korrekte svaret
        if (userNum === correctMultiplyNumerator && userDen === correctMultiplyDenominator) {
             showMultiplyFeedback(`Helt riktig! (${currentNum1}/${currentDen1}) × (${currentNum2}/${currentDen2}) = ${userNum}/${userDen}. Svaret er også forkortet!`, "success");
            mUserNumeratorInput.disabled = true;
            mUserDenominatorInput.disabled = true;
            mCheckAnswerBtn.disabled = true;
            mNewTaskBtn.style.display = 'inline-block';
        } else {
            // Svaret er ekvivalent, men ikke (nødvendigvis) den vi forventet som fullt forkortet
             // Sjekk om brukerens svar kan forkortes mer
            if (gcd(userNum, userDen) > 1) {
                 showMultiplyFeedback(`Svaret ${userNum}/${userDen} har riktig verdi, men det kan forkortes mer! Oppgi svaret på enkleste form.`, "info");
            } else {
                // Dette betyr at brukerens svar er forkortet, men ikke likt vårt `correctMultiply...`
                // Kan skje ved f.eks. 0/5 vs 0/1 - bør ideelt sett unngå 0 i oppgaver/svar
                 showMultiplyFeedback(`Verdien ${userNum}/${userDen} er riktig og forkortet, men sjekk om du regnet helt rett. Forventet ${correctMultiplyNumerator}/${correctMultiplyDenominator}`, "info");
                 mNewTaskBtn.style.display = 'inline-block'; // La dem gå videre
            }
        }
    }


    // --- Event Listeners for knapper ---
    // Forkorting
    checkShorteningBtn.addEventListener('click', checkShorteningAnswer);
    newShorteningTaskBtn.addEventListener('click', generateNewShorteningTask);
    hintBtn.addEventListener('click', showShorteningHint);

    // Multiplikasjon
    mCheckAnswerBtn.addEventListener('click', checkMultiplyAnswer);
    mNewTaskBtn.addEventListener('click', generateNewMultiplyTask);


    // --- Initialisering ved last ---
    showSection('intro'); // Start med introduksjonen

}); // Slutt på DOMContentLoaded
