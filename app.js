const start = $('#start');
const content = $('#content');

// reaction
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if(!SpeechRecognition){
	content.append('<p>your browser doesn\'t support SpeechRecognition, please switch google chrome</p>');
}
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';

recognition.onresult = (event) => {
	console.log(event);
	const result = event.results[0][0].transcript;
	console.log(result);
	let text = getResponse(result);
	content.append('<p>you said: ' + result + '</P>' );
	content.append('<p>this page said: ' + text + '</p>')
	readOutLoud(text);
};

start.click(recognition.start);

// respnose
const response = [];
function addReaction(req, res){
	var index = response.findIndex(function(index){
		return item.keywords === req
	});
	
	if(index === -1){
		//add a new reaction
		response.push({
			keywords: req,
			res: [res]
		});
	}else{
		// update an old one
		response[index].res.push(res);
	}
}

// add some data to response
addReaction('hello', 'hello');
addReaction('what\'s your age', 'five');
addReaction('ok google', 'I live in google chrome, but I\'m not google assistant');
addReaction('ok google', 'does google assistant looks like me?');
addReaction('how are you', 'I\'m fine');
addReaction('how are you', 'Not bad');
addReaction('good night', 'Good noght');
addReaction('good night', 'Have a nice dream');


function getResponse(msg){
	msg = msg.toLowerCase();
	rate = [];
	for(let i in response){
		let count = 0;
		
		let that = response[i].keywords.split(' ');
		for(let j in that){
			console.log('msg', msg, that[j]);
			if(msg.includes(that[j])){
				count ++;
				console.log('normal', that, '++');
			}
			let position = Math.abs(((j-0+1)/(that.length+1)) - ((msg.indexOf(that[j])+1)/(msg.length+1)));
			console.log('position', position);
			if(position < 0.1){
				count ++;
				console.log('position', that, '++');
			}
		}
		console.log(that, count + msg.length - 1, response[i].keywords.length);
		if(count){
			rate.push((count + msg.length - 1)/response[i].keywords.length);
		}else{
			rate.push(0);
		}

		console.log('============');
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
	let res_ = response[max].res;
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
