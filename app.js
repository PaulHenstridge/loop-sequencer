const container = document.querySelector('.container')
const notes = ['G6', 'F6', 'E6', 'D6', 'C6', 'B5', 'A5', 'G4', 'F4', 'E4', 'D4', 'C4', 'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3', 'B2', 'A2']


function setup(notesArray, noteRows = 7, beats = 16) {
    for (let i = 0; i < noteRows; i++) {
        let soundRow = document.createElement('div')
        soundRow.classList.add('row')

        let infoBox = document.createElement('div')
        infoBox.classList.add('info-box')
        infoBox.innerText = notesArray[i]


        for (let j = 0; j < beats; j++) {
            let check = document.createElement('input')
            check.setAttribute('type', 'checkbox')
            if (j % 4 === 3) {
                check.style.marginRight = '3vw'
            }
            soundRow.appendChild(check)

            // if (j % 4 === 3 && j !== beats - 1) {
            //     let barSeparator = document.createElement('div')
            //     barSeparator.classList.add('bar-separator')
            //     soundRow.appendChild(barSeparator)
            // }
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

setup(notes, 21)




const rows = document.querySelectorAll('.row')
const startBtn = document.querySelector('#start')
let index = 0
let synths = []


for (let i = 0; i < rows.length; i++) {
    let synth = new Tone.Synth()
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
        case i < 28:
            synth.oscillator.type = ''

    }
    if (i + 1 < 7) {

    } else {
        if (i + 1 < 14) {

        }
        synths.push(new Tone.Synth())

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
                input = row.querySelector(`input:nth-child(${step + 1})`);
            if (input.checked) synth.triggerAttackRelease(note, '8n', time);
        }
        index++;
    }
    console.log(Tone.Transport.state)
    startBtn.addEventListener('click', async () => {
        // if (Tone.Transport.state !== 'started') {
        await Tone.start();
        console.log(Tone.Transport.state)
        // } else {
        //     Tone.Transport.stop();
        // }

        console.log("context started");
    })
}