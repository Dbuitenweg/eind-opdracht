// hulp gekregen van me vriendin met het structuren van zinnen
// Definieer selectoren om belangrijke elementen van de pagina op te halen
const selectors = {
    boardContainer: document.querySelector('.board-container'),
    start: document.querySelector('button'),
     restart: document.querySelector('#restart'),
    moves: document.querySelector('.moves'),
    board: document.querySelector('.board'),
    win: document.querySelector('.win'),
    timer: document.querySelector('.timer')
}
// Functie om het spel te herstarten
const restartGame = () =>{
    clearInterval(state.loop);
    state.gameStarted = false;
     state.totalTime = 0;
    state.totalFlips = 0;
    state.flippedCards = 0;
    selectors.moves.innerText = '0 moves';
    selectors.timer.innerText = 'Time: 0 sec';
    selectors.boardContainer.classList.remove('flipped');
}
// Functie om de pagina te vernieuwen
function refreshPage() {
    location.reload();
}
// Definieer de initiële spelstatus
const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}
// Functie om een array willekeurig te schudden
const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}
// Functie om een willekeurig aantal items uit een array te selecteren
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}
// Functie om het spel te genereren
const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')  

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const emojis = ['🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🥭']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 4) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}
// Functie om het spel te starten
const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.timer.innerText = `Time: ${state.totalTime} sec`
        selectors.moves.innerText = `${state.totalFlips} moves`
    }, 1000)
}
// Functie om omgedraaide kaarten terug te draaien als ze niet overeenkomen
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}
// Functie om een kaart om te draaien
const flipCard = card => {
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 750)
    }
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 750)
    }
}
// Functie om eventlisteners toe te voegen
const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}
// Genereer het spel wanneer de pagina laadt
generateGame()
// Voeg eventlisteners toe aan de elementen
attachEventListeners()