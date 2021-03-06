//object containing all lines typed by users
AllLines = new Mongo.Collection('lines');

if (Meteor.isClient) {
	/*sug = [
		"I'm Jack's Medulla Oblongata",
		"I'm Jack's Colon",
		"I'm Jack's Raging Bile Duct",
		"I'm Jack's Broken Heart",
		"I'm Jack's Wasted Life",
		"I'm Jack's Complete Lack Of Surprise",
		"I'm Jack's Inflamed Sense Of Rejection",
		"I'm Jack's Smirking Revenge",
		"The quality of mercy",
		"If music be the food of love; play on",
		"Parting is such sweet sorrow",
		"Simply the thing I am shall make me live",
		"O, had I but followed the arts!",
		"We have seen better days",
		"Virtue and genuine graces in themselves speak what no words can utter",
		"How poor are they that have not patience. What wound did ever heal but by degrees?",
		"As he was valiant, I honor him. But as he was ambitious, I slew him",
		"I'm not going to get into the ring with Tolstoy",
		"The writer must write what he has to say, not speak it",
		"Let him think that I am more man than I am and I will be so",
		"The best way to find out if you can trust somebody is to trust them",
		"Rome was not built in one day",
		"It takes two to tango",
		"Idle hands are the devil's tools",
		"Don't look a gift horse in the mouth",
		"Curiosity killed the cat",
		"A picture paints a thousand words",
		"Blood is thicker than water",
		"Obviously you’re not a golfer",
		"Hey, nice marmot",
		"Fuck it, Dude. Let’s go bowling",
		"This aggression will not stand, man",
		"This is what happens when you fuck a stranger in the ass, Larry",
		"Nobody fucks with the Jesus",
		"Yeah, well, you know, that’s just, like, your opinion, man",
		"The Dude abides",
		"Shut the fuck up, Donny",
		"That rug really tied the room together"
	];*/
	sug = [];
	sug_i = -1;
	cur_line = "";	//current line
	org_val = "";
	// counter starts at 0
	Session.setDefault('counter', 0);

	var refreshList = function(val, target){
		//query db for matching lines
		var reg = new RegExp(val, "i");
		var q = AllLines.find({line: {$regex: reg}}).fetch();
		sug = [];
		for (var i = 0; i < q.length; i++) {
			if(sug.indexOf(q[i].line) < 0){
				sug.push(q[i].line);
			}
		};
		val = val.toLowerCase();
		cur_line = val;
		printList(val);
	}

	var printList = function(val){
		//print off list
		var elem = document.getElementById('suggest');
		elem.innerHTML = '';
		if(val == ''){
			return;
		}
		var html = '';
		var ind;
		for (var i = sug_i+1; i < sug.length; i++) {
			ind = sug[i].toLowerCase().indexOf(val);
			if(ind >= 0){
				//console.log('ind: ', ind);
				html += '<li>';
				html += '<p class="before">'+sug[i].substr(0, ind).replace(/ /g, '&nbsp;')+'</p>';
				html += '<p class="main">'+sug[i].substr(ind, val.length).replace(/ /g, '&nbsp;')+'</p>';
				html += '<p class="after">'+sug[i].substr(ind+val.length).replace(/ /g, '&nbsp;')+'</p>';
				html += '</li>';
			}
		};
		elem.innerHTML = html;
	}

	window.addEventListener('keydown', function(e){
		if(e.target.className == "type-box-input"){	//if within our box
			if(e.which == 8){					//backspace
				console.log(this);
				var str = String(e.target.value);
				refreshList(str.substr(0, str.length-1));
			}else if(e.which == 38){			//up arrow, prev suggestion
				sug_i--;
			}else if(e.which == 39){			//right arrow, autocomplete
				if(sug_i >= 0){		
					document.getElementById('type-box-input').value = sug[sug_i];
					document.getElementById('type-box-before').innerHTML = '';
					document.getElementById('type-box-main').innerHTML = '';
					document.getElementById('type-box-after').innerHTML = '';
					printList('');
					sug_i = -1;
				}
				return;
			}else if(e.which == 40){			//down arrow, next choice
				sug_i++;
			}else{
				return;
			}
			if(e.which != 8){
				e.preventDefault();
			}
			if(cur_line == ""){
				sug_i = -1;
			}
			if(sug_i >= sug.length){
				sug_i = sug.length - 1;
			}
			if(sug_i < 0){
				sug_i = -1;
				document.getElementById('type-box-before').innerHTML = '';
				document.getElementById('type-box-main').innerHTML = '';
				document.getElementById('type-box-after').innerHTML = '';
				printList(cur_line);
				return;
			}
			//fill in box
			ind = sug[sug_i].toLowerCase().indexOf(cur_line);
			document.getElementById('type-box-before').innerHTML = sug[sug_i].substr(0, ind).replace(/ /g, '&nbsp;');
			document.getElementById('type-box-main').innerHTML = sug[sug_i].substr(ind, cur_line.length).replace(/ /g, '&nbsp;');
			var w = document.getElementById('type-box-main').offsetWidth;
			document.getElementById('type-box-after').innerHTML = sug[sug_i].substr(ind+cur_line.length).replace(/ /g, '&nbsp;');
			document.getElementById('type-box-after').style.left = w+"px";
			document.getElementById('type-box-input').value = cur_line;
			printList(cur_line);
		}
	}, true);
	Template.typer.events({
		'keypress .type-box-input': function (e) {
			var keynum;
			if(window.event){	//IE
				keynum = e.keyCode;
			}else{
				if(e.which){	// Netscape/Firefox/Opera	
					keynum = e.which;
				}
			}
			var val = e.target.value + String.fromCharCode(keynum);
			if(keynum == 13 && val != ""){	//Enter pressed
				//submit
				document.getElementById('typed').innerHTML += '<li>'+val+'</li>';
				e.target.value = "";
				refreshList("");
				//add to global database
				AllLines.insert({
					createdBy: Meteor.userId,
					createdAt: new Date(),
					line: val
				});
			}else{
				refreshList(val);
			}
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function(){
		//code to run on startup
	});
}
