// Globale variabler for den nåværende oppgaven
let currentNumerator = 0;
let currentDenominator = 0;
let correctSimplifiedNumerator = 0;
let correctSimplifiedDenominator = 0;
let currentGCD = 1; // Største Felles Faktor (Greatest Common Divisor)

// DOM-element referanser
const sections = document.querySelectorAll('main section');
const taskNumeratorElement = document.getElementById('task-numerator');
const taskDenominatorElement = document.getElementById('task-denominator');
const userNumeratorInput = document.getElementById('user-numerator');
const userDenominatorInput = document.getElementById('user-denominator');
const checkAnswerBtn = document.getElementById('check-answer-btn');
const hintBtn = document.getElementById('hint-btn');
const newTaskBtn = document.getElementById('new-task-btn');
const feedbackElement = document.getElementById('feedback');

// --- Hjelpefunksjoner ---

// Viser riktig seksjon, skjuler resten
function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    // Start en ny oppgave hvis vi går til øvingsseksjonen
    if (sectionId === 'practice') {
        generateNewTask();
    }
}

// Funksjon for å finne Største Felles Faktor (GCD/SFF) - Euklids algoritme
function gcd(a, b) {
    if (b === 0) {
        return a;
    }
    return gcd(b, a % b);
}

// Genererer tilfeldig heltall mellom min (inkludert) og max (inkludert)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Viser tilbakemelding til brukeren
function showFeedback(message, type) {
    feedbackElement.textContent = message;
    feedbackElement.className = type; // Setter CSS-klasse (success, error, info)
}

// --- Kjernefunksjoner ---

// Genererer en ny brøk-oppgave som kan forkortes
function generateNewTask() {
    let num, den, factor;

    // Sørg for at brøken faktisk *kan* forkortes
    do {
        // Lag en grunnbrøk som er ferdig forkortet
        correctSimplifiedNumerator = getRandomInt(1, 10);
        correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20); // Nevner > Teller
        // Sjekk om den er forenklet (gcd=1), hvis ikke, prøv igjen
        while (gcd(correctSimplifiedNumerator, correctSimplifiedDenominator) !== 1) {
            correctSimplifiedNumerator = getRandomInt(1, 10);
            correctSimplifiedDenominator = getRandomInt(correctSimplifiedNumerator + 1, 20);
        }

        // Velg en felles faktor å multiplisere med (større enn 1)
        factor = getRandomInt(2, 5);

        // Lag den uforkortede brøken
        currentNumerator = correctSimplifiedNumerator * factor;
        currentDenominator = correctSimplifiedDenominator * factor;

    } while (currentNumerator === correctSimplifiedNumerator); // Dobbeltsjekk at den faktisk *ble* multiplisert

    // Beregn SFF for den nye brøken (brukes for hint og sjekking)
    currentGCD = gcd(currentNumerator, currentDenominator);

    // Vis brøken i HTML
    taskNumeratorElement.textContent = currentNumerator;
    taskDenominatorElement.textContent = currentDenominator;

    // Tilbakestill inputfelt og feedback
    userNumeratorInput.value = '';
    userDenominatorInput.value = '';
    showFeedback('', ''); // Tøm feedback
    userNumeratorInput.disabled = false;
    userDenominatorInput.disabled = false;
    checkAnswerBtn.disabled = false;
    hintBtn.disabled = false;
    newTaskBtn.style.display = 'none'; // Skjul "Ny oppgave"-knappen
}

// Sjekker brukerens svar
function checkAnswer() {
    const userNum = parseInt(userNumeratorInput.value);
    const userDen = parseInt(userDenominatorInput.value);

    // Input validering
    if (isNaN(userNum) || isNaN(userDen) || userNum <= 0 || userDen <= 0) {
        showFeedback("Ugyldig input. Skriv inn positive tall for teller og nevner.", "error");
        return;
    }

    // Sjekk om brukerens brøk er EKIVALENT med den originale
    // Vi kryssmultipliserer: originalNum * userDen === originalDen * userNum
    if (currentNumerator * userDen !== currentDenominator * userNum) {
        showFeedback(`Feil. ${userNum}/${userDen} er ikke lik ${currentNumerator}/${currentDenominator}. Husk å dele teller og nevner med det *samme* tallet.`, "error");
        return;
    }

    // Sjekk om brukerens brøk er FULLSTENDIG forkortet
    // Dette betyr at gcd(userNum, userDen) må være 1
    if (gcd(userNum, userDen) === 1) {
        // Riktig og fullstendig forkortet!
        showFeedback(`Korrekt! ${currentNumerator}/${currentDenominator} forkortes til ${userNum}/${userDen}. Godt jobbet!`, "success");
        // Deaktiver input og vis "Ny oppgave"-knapp
        userNumeratorInput.disabled = true;
        userDenominatorInput.disabled = true;
        checkAnswerBtn.disabled = true;
        hintBtn.disabled = true;
        newTaskBtn.style.display = 'inline-block';
    } else {
        // Riktig (ekvivalent), men ikke fullstendig forkortet
        showFeedback(`Riktig at ${userNum}/${userDen} er lik ${currentNumerator}/${currentDenominator}, men brøken kan forkortes enda mer! Prøv igjen.`, "info");
        // Ikke deaktiver input, la eleven prøve mer
    }
}

// Viser hint (SFF)
function showHint() {
    if (currentGCD > 1) {
        showFeedback(`Hint: Prøv å dele både teller (${currentNumerator}) og nevner (${currentDenominator}) med ${currentGCD}. Det er den Største Felles Faktor.`, "info");
    } else {
        // Dette skal i teorien ikke skje pga generateNewTask logikk, men greit å ha
        showFeedback("Denne brøken kan ikke forkortes mer.", "info");
    }
}


// --- Event Listeners ---
checkAnswerBtn.addEventListener('click', checkAnswer);
newTaskBtn.addEventListener('click', generateNewTask);
hintBtn.addEventListener('click', showHint);

// Initialisering når siden lastes
window.onload = () => {
    showSection('intro'); // Vis introduksjonen først
    // generateNewTask(); // Kan kalles her hvis du vil starte direkte på øving
};
