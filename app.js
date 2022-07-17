
const container = document.querySelector('.container'),
    options = document.querySelector('.options'),
    beatOptions = document.querySelectorAll('.beat-option')

let beatSteps = 16


function getParams() {

    for (let option of beatOptions) {
        option.addEventListener('click', () => {
            let selection = parseInt(option.innerText)
            if (isNaN(selection)) {
                //reveal an input and use its submitted value
            } else {
                beatSteps = selection
            }

            setTimeout(() => {
                for (option of beatOptions) option.style.opacity = '0'
            }, 500)
        })
    }
    // container.classList.add('hidden')

}

getParams()
// this is number of berats before it loops, also number of steps in the tone repeat, same same...


const notes = []
//     'G6', 'F6', 'E6', 'D6', 'C6', 'B5', 'A5',
//     'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3',
//     'G3', 'F3', 'E3', 'D3', 'C3', 'B2', 'A2',
//     'G5', 'F4', 'E4', 'D2', 'C2', 'B1', 'A1'
// ]

const CmajorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].reverse()
const CminorScale = ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'].reverse()

// create inputs to choose scale and num of octaves
// get rid of synth choice shite below
// long term add options for synth choice

let lowerOctave,
    upperOctave


/*
options:   default - full 7 octaves major, default synth

       custom - choose options for each octave block and add individually

*/

// choose major or minor for each octave
// and ability to repeat, customise...

// if octave is in minor key, style differently, e.g blue v yellow..?

let sawtoothIdxs = []
let sineIdxs = []
let membraneIdxs = []

// if sine or saw are passed in as true the index in notes where to begin is saved ot the array
// set synths at next 7 idxs to that synth.type
function populateArrays(scale, octave, sawtooth = false, sine = false, membrane = false) {

    // adding 7 indices to array so whole octave is returned with chosen synth type
    const createSeven = (index, array) => {
        for (let i = index; i < index + 7; i++) {
            array.push(i)
        }
    }

    // push to synth type idxs
    if (sawtooth) createSeven(notes.length, sawtoothIdxs)
    if (sine) createSeven(notes.length, sineIdxs)
    if (membrane) createSeven(notes.length, membraneIdxs)

    // push to notes array
    scale.forEach(note => {
        notes.push(`${note}${octave}`) // maybe need to unshift rather than push?
    })

}



// check div can show time in the loop (e.g a background on each active one, making a sort ogf column?)

// use Tone.js time/ trasport...  to manipulate DOM elements   ??

/*

    req inputs : octaves array
                sawtooth/sine bool
                index where saw/sine begins true   (casn i get that from notes.length??)
    options: major or minor
            select octaves
            add drums  - add as synth type?

    keep below but use settings to create notes[]
    make noteRows = notes.length
    make beats and steps in repreat func a variable
*/


// CREATE HTML AND ADD LISTENERS

function setup(notesArray, noteRows = notes.length, beats = beatSteps) {

    // info labels - if i%7 === 0, check for i in type arrays, return an element showing synth type
    for (let i = 0; i < noteRows; i++) {
        let noteRow = document.createElement('div')
        noteRow.classList.add('row')

        let infoBox = document.createElement('div')
        infoBox.classList.add('info-box')
        infoBox.innerText = notesArray[i]


        for (let j = 0; j < beats; j++) {
            let check = document.createElement('div')
            check.setAttribute('data-status', 'off')
            check.classList.add('check')
            check.setAttribute('id', `r${i}b${j}`) //r=row, b=beat, so eg: r2b5
            check.addEventListener('click', () => {
                check.dataset.status = check.dataset.status === 'off' ? 'on' : 'off'
                check.style.backgroundColor = check.dataset.status === 'off' ? 'black' : 'yellow'
            })
            //seperate 4 beat bars
            if (j % 4 === 3) {                 // if (!(j+1 %4))
                check.style.marginRight = '3vw'
            }
            noteRow.appendChild(check)
        }

        container.appendChild(noteRow)
        container.insertBefore(infoBox, noteRow)
        if (i % 7 === 6) {
            let separator = document.createElement('div')
            separator.classList.add('separator')
            container.appendChild(separator)
        }
    }
}

//  FUNCTION CALLS  ####################################

populateArrays(CmajorScale, 4)
populateArrays(CmajorScale, 4, true)
populateArrays(CmajorScale, 4, false, true)
populateArrays(CmajorScale, 3, false, false, true)
populateArrays(CmajorScale, 2, false, true, true)
setup(notes)

// #####################################################


const rows = document.querySelectorAll('.row')
const startBtn = document.querySelector('#start')
let index = 0
let synths = []
const tempoSlider = document.querySelector('#tempo')

// when to run this? page reload needed?
// const loopDuration = document.querySelector('input[name="no-of-bars"]:checked').value;

// tempoSlider.addEventListener('change', () => {
//     let tempo = tempoSlider.value
//     Tone.Transport.bpm.value = tempo
// })

//  CREATE SYNTHS
for (let i = 0; i < rows.length; i++) {
    let synth = membraneIdxs.includes(i) ? new Tone.MembraneSynth() : new Tone.Synth()
    // if i is in either synthType array, run func to count 7 on and make all that type
    if (sawtoothIdxs.includes(i)) synth.oscillator.type = 'sawtooth'
    if (sineIdxs.includes(i)) synth.oscillator.type = 'sine'




    // let synth = i < rows.length - 7 ? new Tone.Synth() : new Tone.MembraneSynth()


    // switch (true) {
    //     case i < 7:
    //         synth.oscillator.type = 'triangle'
    //         break
    //     case i < 14:
    //         synth.oscillator.type = 'sine'
    //         break
    //     case i < 21:
    //         synth.oscillator.type = 'sawtooth'
    //         break

    // }

    synths.push(synth)
}



// synths[0].oscillator.type = 'triangle'
// synths[1].oscillator.type = 'sine'
// synths[2].oscillator.type = 'sawtooth'

const gain = new Tone.Gain(0.6);
gain.toDestination();

synths.forEach(synth => synth.connect(gain));

Tone.Transport.scheduleRepeat(repeat, '8n');

Tone.Transport.start();


function repeat(time) {
    let step = index % beatSteps;// <- needs to be numOfBeats - make variable
    for (let i = 0; i < rows.length; i++) {
        let synth = synths[i],
            note = notes[i],
            row = rows[i],
            input = row.querySelector(`div:nth-child(${step + 1})`);
        if (input.dataset.status !== 'off') synth.triggerAttackRelease(note, '8n', time);
    }
    index++;
}

console.log(Tone.Transport.state)
startBtn.addEventListener('click', async () => {
    if (Tone.Transport.state !== 'started') {
        startBtn.innerText = 'STOP'
        Tone.Transport.start();
        await Tone.start();

    } else {
        startBtn.innerText = 'START'
        Tone.Transport.stop();
    }
})

/*
this prob makes sense as a react app.
I want each set of (7) rows/notes/sounds to be independent component
allowing to select octave, notes, sounds, synth etc on the fly, not at beginning.

would also take other 'global' variables e.g tempo.  
*/


function saveChoon() {
    // for aach check in each row, if data is yes record it in saved array
    // make an object (in book)
    // save to local storage  ==> to DB

}

function recreateChoon() {
    // take saved object
    // apply variales to app
    // set up sequencer with selections, ready to play
}