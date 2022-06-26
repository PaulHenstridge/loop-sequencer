const container = document.querySelector('.container')
const notes = [
    'G6', 'F6', 'E6', 'D6', 'C6', 'B5', 'A5',
    'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3',
    'G3', 'F3', 'E3', 'D3', 'C3', 'B2', 'A2',
    'G5', 'F4', 'E4', 'D2', 'C2', 'B1', 'A1'
]
// find more elegant way of creating above array

// the html to form each check box label into a nice clickable thing that indicates when it is selected
// and can show time in the loop (e.g a background on each active one, making a sort ogf column?)

const checkHtml = `
<div class="cxBox"></div>
`

function setup(notesArray, noteRows = 28, beats = 16) {
    for (let i = 0; i < noteRows; i++) {
        let soundRow = document.createElement('div')
        soundRow.classList.add('row')

        let infoBox = document.createElement('div')
        infoBox.classList.add('info-box')
        infoBox.innerText = notesArray[i]

        // i want to expand the label element to style the checkboxes
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
            soundRow.appendChild(check)
            // soundRow.appendChild(checkLabel)
        }

        container.appendChild(soundRow)
        container.insertBefore(infoBox, soundRow)
        if (i % 7 === 6) {
            let separator = document.createElement('div')
            separator.classList.add('separator')
            container.appendChild(separator)
        }
    }
}

// opening screen will be options for no of rows/ ocrtaves/ octave sets..?
// and number of beats per loop.  will need horizontal scrolling for large numbers 
// and what key and scale (if not the same...) lkearn more music theory!!
// and tempo
// input values will be used to call setup()
setup(notes)




const rows = document.querySelectorAll('.row')
const startBtn = document.querySelector('#start')
let index = 0
let synths = []

// below numbers hard coded.  need to work form variables
for (let i = 0; i < rows.length; i++) {
    let synth = i < 21 ? new Tone.Synth() : new Tone.MembraneSynth()
    switch (true) {
        case i < 7:
            synth.oscillator.type = 'triangle'
            break
        case i < 14:
            synth.oscillator.type = 'sine'
            break
        case i < 21:
            synth.oscillator.type = 'sawtooth'
            break

    }

    synths.push(synth)


}

synths[0].oscillator.type = 'triangle'
synths[1].oscillator.type = 'sine'
synths[2].oscillator.type = 'sawtooth'

const gain = new Tone.Gain(0.6);
gain.toDestination();

synths.forEach(synth => synth.connect(gain));

Tone.Transport.scheduleRepeat(repeat, '8n');
Tone.Transport.start();


function repeat(time) {
    let step = index % 16;// <- needs to be numOfBeats
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
