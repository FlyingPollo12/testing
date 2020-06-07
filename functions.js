var counties = [ "Adams", "Ashland", "Barron", "Bayfield", "Brown", "Buffalo", "Burnett", "Calumet", "Chippewa", "Clark", "Columbia", "Crawford", "Dane", "Dodge", "Door", "Douglas", "Dunn", "Eau Claire", "Florence", "Fond Du Lac", "Forest", "Grant", "Green", "Green Lake", "Iowa", "Iron", "Jackson", "Jefferson", "Juneau", "Kenosha", "Kewaunee", "La Crosse", "Lafayette", "Langlade", "Lincoln", "Manitowoc", "Marathon", "Marinette", "Marquette", "Menominee", "Milwaukee", "Monroe", "Oconto", "Oneida", "Outagamie", "Ozaukee", "Pepin", "Pierce", "Polk", "Portage", "Price", "Racine", "Richland", "Rock", "Rusk", "St. Croix", "Sauk", "Sawyer", "Shawano", "Sheboygan", "Taylor", "Trempealeau", "Vernon", "Vilas", "Walworth", "Washburn", "Washington", "Waukesha", "Waupaca", "Waushara", "Winnebago", "Wood" ]
var Acur, Anext; //arrays for all data to be downloaded

var curMonth; //for running through Acur
var start, end, curYear;
var dlYear; //to remember which year is to be downloaded on range START-END that user supplies
var intervalID;
var LOOP_INTERVAL = 200;

var req = new XMLHttpRequest();
var reqCode; //Signifies what to do with data received
			// 0 : store into Acur
			// 1 : store into Anext



window.onload = function() {
	var str = "";
	var p = document.getElementById("para");
	var newText, newElem;
	
	counties.forEach(function(cur, index, array) {
		str = cur + ": ";
		newElem = document.createElement("p");
		newElem.id = cur;
		newText = document.createTextNode(str);
		document.body.insertBefore(newElem, p);
		newElem.appendChild(newText);
	});
}



function playbtn() {
	//grab start-end from input fields
	start = document.getElementById("start").value;
	end = document.getElementById("end").value;
	
	if (start == "" || end == "") { //------------------------------------------- needs to be updated! " " is invalid!!
		alert("Value null.. please enter both start and end values!");
		return;
	}
		
	//download Acur and Anext
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//server responded and without error
			var  vals = JSON.parse(this.responseText);
			
			vals.forEach(function(cur, index, array) {
				console.log("REQ_CODE: "+reqCode);
				console.log(cur);
			});
			
			switch(reqCode) {
				case 0:
					Acur = vals;
					
					//now that this has been recieved, Anext can be prepared
					dlNext(1);
					break;
				case 1:
					Anext = vals;
					break;
				default:
					break;
			}
		}
	}
	
	dlYear = curYear = start;
	
	dlNext(0);//calling dlNext with code:0 will also call with code:1 when ready
	
	//call nextCur to load current month to screen
	//		which also starts loop to pull next data sets from array
	curMonth = 0;
	intervalID = setInterval("nextCur()", LOOP_INTERVAL);
}
function stopLoop() {
	clearInterval(intervalID);
	return;
}

function nextCur() {
	//grabs data for current month for all counties 
	//	and updates screen accordingly
	var str = Acur[curMonth];
	var month = str.split(",");
	updateValues(month);
	
	curMonth++;
	if (curMonth > 11) {
		//done with Acur, transfer and download next Anext
		Acur = Anext;
		dlNext(1);
		curYear++;
		if (curYear > end) {
			alert("Done!");
			stopLoop();
		}
		curMonth = 0;
	}
}

function dlNext(code) {
	req.open("POST", "retrieve.php", true);
	reqCode = code;
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.send("year="+dlYear);
	
	dlYear++;
}

function updateValues(A) {
	//updates the screen with data from array A
	var elem;
	counties.forEach(function(cur, index, array) {
		console.log("County="+cur+" : i="+index);
		elem = document.getElementById(cur);
		elem.textContent = (cur+": "+A[index]);
	});
	
	//update year and month
	elem = document.getElementById("year");
	elem.textContent = (curYear);
	
	elem = document.getElementById("month");
	elem.textContent = (curMonth+1); //set on 0-11... need +1 for display
}