var v = null;
var xhr = new XMLHttpRequest();
xhr.open('GET', '../data/volunteers.json');
xhr.send();
xhr.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		v = JSON.parse(this.responseText);
		dlist = document.getElementById('dlist');

		for (var dist in v) {
			dopt = document.createElement("OPTION");
			dtext = document.createTextNode(titleCase(dist));
			dopt.appendChild(dtext);
			dlist.appendChild(dopt);
		}
	}
}

sel = document.getElementById('dlist');
sel.setAttribute('onchange', 'javascript: fetch()')

function fetch() {
	console.log('fetch running..')
	dist = document.getElementById('dlist').value.toUpperCase();
	dispdiv = document.getElementById('voldisp');
	dispdiv.innerHTML = "";
	

	for (var name in v[dist]) {
		console.log('Writing Names and Numbers');

		card = document.createElement('DIV');
		card.setAttribute('class', 'contact-card pure-u-1 pure-u-md-1-3 pure-u-lg-1-3');
		dispdiv.appendChild(card)

		vname = document.createElement('H5');
		vname.setAttribute('class', 'contact-card')
		vnametxt = document.createTextNode(name)
		vname.appendChild(vnametxt)
		card.appendChild(vname);


		vnum = document.createElement('P');
		vnum.setAttribute('class', 'contact-card')
		vnumtxt = document.createTextNode(v[dist][name])
		vnum.appendChild(vnumtxt)
		card.appendChild(vnum);

		call = document.createElement('A');
		call.setAttribute('class', 'pure-button pure-button-primary ccall')
		call.setAttribute('href', 'tel:'+v[dist][name])
		call.appendChild(document.createTextNode("Call"))
		card.appendChild(call);
		console.log('iteration end');
	}
}

function titleCase(sentence) {
	if (sentence.length !== 0) {
    	var sentence = sentence.toLowerCase().split(" ");
      	for(var i = 0; i< sentence.length; i++){
        	sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
      	}
   		return sentence.join(" ");
   	}
   	else {
   		return sentence
   	}
}