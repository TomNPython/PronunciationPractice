//video elements
let width = 400
let height = 0
let streaming = false

//DOM elements
const video = document.getElementById('video')
const canvas = document.getElementById('canvas')
const photos = document.getElementById('photos')
const photoButton = document.getElementById('photo-button')
const clearButton = document.getElementById('clear-button')
const sentence = document.getElementById('sentence-swap')
const swap = document.getElementById('swap')

//start video playing
navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => {
        video.srcObject = stream
        video.play()
    })
    .catch(err => { console.log(`Error: ${err}`)})

//take a picture from the video stream and display it (NB: refactor?)
function takePicture() {
    context = canvas.getContext('2d')

    if (height && width) {
        canvas.width = width / 2
        canvas.height = height / 2
    }
    context.drawImage(video, 0, 0, width / 2, height / 2)

    imgUrl = canvas.toDataURL('image/png')

    image = document.createElement('img')

    image.setAttribute('src', imgUrl)

    photos.appendChild(image)
}

let counter = 0; // how many pics taken
let isPlaying = false; // is the video recording pics now
let cleared = false; // has the container of pics been cleared


// start taking pictures using video stream
function timer() {
    counter = 0
    photos.innerHTML = ''
    cleared = false
    if (!isPlaying) {
    let pictureReel = setInterval(() => {
        if (counter >= 10 || cleared) {
            clearInterval(pictureReel)
            isPlaying = false
        }
        if (!cleared) {
        takePicture();
        
        counter++
        }
    }, 1000)
    isPlaying = true
}}

//stop taking pictures using the video screen and remove them from container (NB: refactor
// into separate functions!)
function clearCanvas() {
    photos.innerHTML = '';
    cleared = true;
    isPlaying = false
}

//Sentences to be displayed
const tongueTwisters = [`"Peter Piper picked a peck of pickled peppers. 
A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers? 
Where's the peck of pickled peppers Peter Piper picked?"`, `"How much wood would a woodchuck chuck 
if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood,
as a woodchuck would if a woodchuck could chuck wood."`, `"Betty bought a bit of butter.
But the butter Betty bought was bitter.
so Betty bought a better butter,
and it was better than the butter Betty bought before."`, `"Silly Sally swiftly shooed seven silly sheep.
The seven silly sheep Silly Sally shooed
Shilly-shallied south."`]

//change the sentence displayed
function swapSentence() {
    let randInt = Math.floor(Math.random() * tongueTwisters.length)
    console.log(randInt)
    sentence.textContent = tongueTwisters[randInt]
}

//Event listeners

video.addEventListener('canplay', function(e) {
    if (!streaming) {
        height = video.videoHeight / (video.videoWidth / width)

        video.style.height = height + 'px'
        video.style.width = width + 'px'

        streaming = true
    }
}, false)

photoButton.addEventListener('click', function(e) {
    timer()
    e.preventDefault()
})

clearButton.addEventListener('click', clearCanvas)

swap.addEventListener('click', swapSentence)

photoButton.addEventListener('click', swapSentence)
