
const container = document.querySelector('.container')
const options = document.querySelector('.options')

const loopSelect = document.querySelector('.loop-select')
const loopOptions = document.querySelectorAll('.loop-option')
const octaveBlockOptions = document.querySelector('.block-menu')

const octaveOptions = document.querySelectorAll('.octave-option')
const keyOptions = document.querySelectorAll('.key-option')
const synthOptions = document.querySelectorAll('.synth-option')

const addBlock = document.querySelector('#add-block')
const begin = document.querySelector('#go')


let beatSteps = 16

function getParams() {
    for (let option of loopOptions) {
        option.addEventListener('click', () => {
            let selection = parseInt(option.innerText)
            if (isNaN(selection)) {
                //reveal an input and use its submitted value
            } else {
                beatSteps = selection
            }

            setTimeout(() => {
                loopSelect.style.top = '-12rem'
            }, 400)
            setTimeout(() => {
                octaveBlockOptions.style.top = '0'
            }, 700)
        })
    }

    let paramsObj = {}

    // TODO - duplication below - create one function, pass each group in as arg
    for (let option of octaveOptions) {
        option.addEventListener('click', () => {
            // remove .selected from all then apply to chosen one
            for (let option of octaveOptions) option.classList.remove('selected')
            option.classList.add('selected')

            let selection = parseInt(option.innerText)
            // add octave option to params object
            paramsObj.octave = selection
        })
    }
    for (let option of keyOptions) {
        option.addEventListener('click', () => {
            for (let option of keyOptions) option.classList.remove('selected')
            option.classList.add('selected')

            let selection = option.innerText
            // add key option to params object
            paramsObj.key = selection
        })
    }
    for (let option of synthOptions) {
        option.addEventListener('click', () => {
            for (let option of synthOptions) option.classList.remove('selected')
            option.classList.add('selected')

            let selection = option.innerText
            // add synth option to params object
            paramsObj.synth = selection
            console.log(paramsObj)

        })
    }

    // use params obj to call populateArrays() inside getParams
    // then call setup() within populateArrays()
    //function populateArrays(scale, octave, sawtooth = false, sine = false, membrane = false) {
    addBlock.addEventListener('click', () => {
        populateArrays(
            paramsObj.key === 'Major' ? CmajorScale : CminorScale,
            paramsObj.octave,
            paramsObj.synth === 'Sawtooth' ? true : false,
            paramsObj.synth === 'Sine' ? true : false,
            paramsObj.synth === 'Membrane' ? true : false
        )
    })

    begin.addEventListener('click', () => {
        options.classList.add('hidden')
        container.classList.remove('hidden')
        setup(notes)
    })

}

getParams()

const notes = []

const CmajorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].reverse()
const CminorScale = ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'].reverse()

// create inputs to choose scale and num of octaves

let lowerOctave,
    upperOctave

// TODO - if octave is in minor key, style differently, e.g blue v yellow..?

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

// TODO - show where on the loop is active
// check div can show time in the loop (e.g a background on each active one, making a sort ogf column?)
// use Tone.js time/ trasport...  to manipulate DOM elements   ??

/*
    req inputs: key 
                octave
                sawtooth/sine bool
                index where saw/sine begins true   
*/

// ****SETUP*****  HTML AND ADD LISTENERS

function setup(notesArray, noteRows = notes.length, beats = beatSteps) {

    // TODO info labels - if i%7 === 0, check for i in type arrays, return an element showing synth type
    for (let i = 0; i < noteRows; i++) {
        let noteRow = document.createElement('div')
        noteRow.classList.add('row')

        let infoBox = document.createElement('div')
        infoBox.classList.add('info-box')
        infoBox.innerHTML = ` <span>${notesArray[i]}<span/> `


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

// populateArrays(CmajorScale, 4)
// populateArrays(CmajorScale, 4, true)
// populateArrays(CmajorScale, 4, false, true)
// populateArrays(CmajorScale, 3, false, false, true)
// populateArrays(CmajorScale, 2, false, true, true)
// setup(notes)

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

    synths.push(synth)
}


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