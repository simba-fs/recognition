const start = $('.start');
const content = $('.content');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';

console.log(recognition);

recognition.onstart = () => {
	console.log('voice is activated, you can to microphone');
};

recognition.onresult = (event) => {
	const result = event.results[0][0].transcript;
	console.log(result);
	content.text(result);
	readOutLoud(result)
};

start.click(()=>{
	recognition.start();
});

function readOutLoud(msg){
	const speech = new SpeechSynthesisUtterance();
	speech.text = msg;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
	speech.lang = 'en-US';

	console.log(speech);

	window.speechSynthesis.speak(speech);
}
