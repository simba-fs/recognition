const start = $('.start');
const content = $('.content');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!SpeechRecognition){
	content.append('<p>your browser doesn\'t support SpeechRecognition, please switch google chrome</p>');
}
const recognition = new SpeechRecognition();

const res = [{
		keywords: 'how are you'.split(' '),
		res: ['I\'am fine.', 'Not bad']
	},{
		keywords: ['good morning'],
		res: ['Good morning']
	},{
		keywords: ['good night'],
		res: ['good night', 'Have a good dream']
	},{
		keywords: 'ok google',
		res: ['I live in google chrome, but I am not google assistant', 'does google assistant looks like me?', 'my pleasure']
	},{
		keywords: 'what is your age',
		res: ['In fact, I\'m born last sunday', 'I cannot tell you']
	},{
		keywords: 'hello',
		res: ['hello, what can I help you?']
	}
]

recognition.lang = 'en-US';

recognition.onstart = () => {
	console.log('voice is activated, you can to microphone');
};

recognition.onresult = (event) => {
	console.log(event);
	const result = event.results[0][0].transcript;
	console.log(result);
	let text = response(result);
	content.append('<p>you said: ' + result + '</P>' );
	content.append('<p>this page said: ' + text + '</p>')
	readOutLoud(text);
};

start.click(()=>{
	recognition.start();
});

function response(msg){
	rate = [];
	for(let i in res){
		let count = 0;
		
		let that = res[i].keywords;
		for(let j in that){
			if(msg.includes(that[j])){
				count ++;
			}
		}
		if(count){
			rate.push(count/res[i].keywords.length);
		}else{
			rate.push(0);
		}
	}
	console.log(rate);
	console.log(rate.filter(function(item){return item >= 0.5}).length);
	if(rate.filter(function(item){return item >= 0.5}).length == 0){
		return 'sorry, I cannot understand what you said';
	}

	let max = 0;

	for(let i in rate){
		if(rate[i] >= 0.5 && rate[i] > rate[max]){
			max = i;
		}
	}
	let res_ = res[max].res;
	let finalIndex = Math.random() * res_.length;
	return res_[Math.floor(finalIndex)];
}

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
