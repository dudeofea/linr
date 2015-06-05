if (Meteor.isClient) {
	sug = [
		"I'm Jack's Medulla Oblongata",
		"I'm Jack's Colon",
		"I'm Jack's Raging Bile Duct",
		"I'm Jack's Broken Heart",
		"I'm Jack's Wasted Life",
		"I'm Jack's Complete Lack Of Surprise",
		"I'm Jack's Inflamed Sense Of Rejection",
		"I'm Jack's Smirking Revenge"
	];
	// counter starts at 0
	Session.setDefault('counter', 0);

	var refreshList = function(val, target){
		val = val.toLowerCase();
		var elem = document.getElementById('suggest');
		elem.innerHTML = '';
		if(val == ''){
			return;
		}
		var html = '';
		var ind;
		for (var i = 0; i < sug.length; i++) {
			ind = sug[i].toLowerCase().indexOf(val);
			if(ind >= 0){
				console.log('ind: ', ind);
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
		if(e.which == 8 && e.target.className == "type-box"){	//8 is backspace
			var str = String(e.target.value);
			refreshList(str.substr(0, str.length-1));
		}
	}, true);
	Template.typer.events({
		'keypress .type-box': function (e) {
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
			}else{
				refreshList(val);
			}
		}
	});
}

if (Meteor.isServer) {
	Meteor.startup(function () {
		// code to run on server at startup
	});
}
