const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const moment = require('moment')
const words = ['html', 'css', 'javascript', 'node package manager', 'mysql', 'monogo', 'linux', 'visual studio code', 'sql servers']

let start = ''

// array of letters guessed
let lettersGuessed = []
// count number of letters in word
let lettersGuessedCount = 0

// number of wrong guesses allowed
let guessesLeft = 10

// function to get random element from an array
const getRandom = arr => arr[Math.floor(Math.random() * arr.length)]
// function to generate string of blanks from provided strings
const genBlanks = str => {
  let blankStr = ''
  const strArr = str.split('')
  strArr.forEach(char => {
    // check handls if string has spaces between words
    if (char !== ' ') {
      blankStr += '_ '
    } else {
      blankStr += '  '
    }
  })
  return blankStr
}
// function to fill in blanks with guessed letter
const fillBlanks = (letter, words, blanks) => {
  let blankArr = blanks.split(' ')
  let wordArr = words.split('')
  let i = 0
  wordArr.forEach(char => {
    if (char === letter) {
      blankArr[i] = letter
      lettersGuessedCount++
    }

    i += char === ' ' ? 2 : 1
  })

  return blankArr.join(' ')
}

const fillLeaderboard = (word, lapse) => {
  inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'Please Type In Your Name: '
  })
  .then(({ name }) => {
    console.log(word, lapse, name)
  })
}
// function to confirm whether the use has lost or won the game
const checkStatus = (word, blanks) => {
  const wordNoSpaces = word.split(' ').join('')
  if (lettersGuessedCount === wordNoSpaces.length) {
    const lapse = moment().format('X') - start
    console.log(`
    -----Congrats! You Won The Game-----
    The word was: ${word}
    It took you ${lapse}seconds to finish the game!
    `)
    fillLeaderboard(word, lapse)
  } else if (guessesLeft <= 0) {
    console.log(`
    -----Oh No! You Lost The Game!-----
    the word was: ${word}
    You were ${wordNoSpaces.length - lettersGuessedCount}
    letters away from winning
    `)
  } else {
    gameMove(word, blanks)
  }
}

const gameMove = (word, blanks) => {
  console.log(blanks)
  inquirer.prompt({
    type: 'input',
    name: 'letter',
    message: 'Guess a Letter:',
    validate: function (input) {
      let inp = input.toLowerCase()
      // confirme that what they types is a letter and only 1
      if (!input.match(/[a-z]/i)) {
        return 'Please Guess A Letter'
      } else if (input.length > 1) {
        return 'Please Guess Only 1 Letter'
      } else if (lettersGuessed.indexOf(inp) !== -1) {
        return 'You Already Guessed That Letter'
      } else {
        return true
      }
    }
  }).then(({ letter }) => {
    const ltr = letter.toLowerCase()
    let isCorrect = word.indexOf(ltr) !== -1
    lettersGuessed.push(ltr)
    guessesLeft -= isCorrect ? 0 : 1
    console.log(`
    -----${isCorrect ? 'Correct' : 'Incorrect'} Guess!-----
    Already Guessed Letters: ${lettersGuessed.join(', ')}
    Guesses Left: ${guessesLeft - 1}
    `)
    checkStatus(word, isCorrect ? fillBlanks(ltr, word, blanks) : blanks)
  })
  .catch(e => console.log(e))
}
//  what to do when use begins new game
const newGame = () => {
  start = moment().format('X')
  const randWord = getRandom(words)
  const blanks = genBlanks(randWord)

  console.log(randWord)
  gameMove(randWord, blanks)
}

//  what to do when use asks to view leaderboard
const leaderboard = () => {
  fs.readFile('leaderboard.txt', 'utf8', (e, data) => {
    if (e) {
      console.log(e)
    }
    let submissions = data.split(' | ')
    submissions.pop()

    submissions.sort((a, b) => {
   
    })
  })

}

// what to do when user asked to exit the game
const exitGame = () => {
  inquirer.prompt({
    type: 'list',
    name: 'choice',
    message: 'Are You Sure?',
    choices: ['Yes', 'No', 'Maybe']
  })
    .then(({ choice }) => {
      switch (choice) {
        case 'Yes':
          process.exit()
          break
        case 'No':
          main()
          break
        case 'Maybe':
          console.log('Make Up Your Mind.')
          exitGame()
          break
      }
    })
    .catch(e => console.log(e))
}
// function to display main menu and navigate user through application
const main = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What Would You Like To Do?',
    choices: ['New Game', 'Leaderboard', 'EXIT']
  })
    .then(({ action }) => {
      switch (action) {
        case 'New Game':
          newGame()
          break
        case 'Leaderboard':
          leaderboard()
          break
        case 'EXIT':
          exitGame()
          break
      }
    })
    .catch(e => console.log(e))
}

main()
