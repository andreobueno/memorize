<!-- Memorize Web Game developed by Andre O. Bueno - 11-20-13 
     contact: andre.obueno@dc.ufscar.br -->


var lvl = 1;
var numBlocksVertical = 3;
var numBlocksHorizontal = 3;
var numBlocksInSequence;
var pos;
var posClicked;
var time;
var counter;
var map = Create2DArray(numBlocksVertical);
var playerMap = Create2DArray(numBlocksVertical);
var rowNumber, columnNumber;	
var gameTimer;
var numBlocksClicked;
var numSeconds;	
var playerName;
var player;
var posSucced, posFailed, numSeqsReceived;
var numPlayers = 0;
var winners = new Array();
var losers = new Array();
var playing;



function Create2DArray(rows) {
		var arr = [];
		for (var i=0;i<rows;i++) {
			arr[i] = [];
		}
		return arr;
	}
	
function fill2DArray(array){
	for(var i = 0; i < numBlocksVertical; i++)
		for (var j = 0; j < numBlocksHorizontal; j++)
			array[i][j] = 0;
}

/*	This function is responsible for generates and paint a random block.
	Besides, it stores the value of the block in the sequence (first to appear, second to appear, third to appear, etc.) 
	in its position in the map array (a 2 dimensional array containing 0s in positions that are not part of the sequence.	
*/
function paint(){	
	
	do {
		rowNumber = Math.floor(Math.random()*numBlocksVertical);
		columnNumber = Math.floor(Math.random()*numBlocksHorizontal);		
	} while (map[rowNumber][columnNumber]!=0)
	$("#" + rowNumber + "x" + columnNumber + "").css({ backgroundColor: '#2834b8' });	
	map[rowNumber][columnNumber] = pos;
	pos++;
}

// Calls the paint function in order to create a whole sequence of blocks with numBlocksInSequence blocks;	
function generateSequence(time){
	paint();
	for(var x = 1; x < numBlocksInSequence; x++){
		setTimeout(paint, time);
		time += 1000;
	}		
	return time;
}

/* This function looks into the array to find the blocks in the sequence and set their color back to normal.	
*/
function cleanSequence(array){
	for(var i = 0; i < numBlocksVertical; i++)
		for (var j = 0; j < numBlocksHorizontal; j++)
			if (array[i][j] != 0)
				$("#" + i + "x" + j + "").css({ backgroundColor: '#98bf21' });
}

function compareArrays(array1, array2){
	for(var i=0; i < numBlocksVertical; i++)		
		for(var j=0; j < numBlocksHorizontal; j++)
			if (array1[i][j] != array2[i][j])
				return false;
	return true;	
}	


var interval = setInterval(function() {

$("#time_left").text(counter + " secs.");
counter--;
if (counter == -1) {
	// Display a login box
	clearInterval(interval);
}
}, 1000);

Array.prototype.clear = function(){
	this.length = 0;
};
	
	
function next_lvl(){
	$("#players_succed h3").remove();
	$("#players_failed h3").remove();
	
	$("#results").delay(1000).hide();
	$("#blocks").show();
	lvl++;	
	$("#div_lvl").append("<h2 align='center'>LEVEL "+lvl+"</h2>");
	$("#div_lvl").show();
		
	time = 0;		
	setTimeout(function(){			
		prepareLvl();
	}, 1000);		
}	

function prepareLvl(){
		// fill the array with 0s in all positions. 
		fill2DArray(map);
		numBlocksInSequence = lvl;
		pos = 1;
		posSucced = 0;
		posFailed = 0;
		numSeqsReceived = 0;				
				
		//generates a sequence and returns the time when a new action must be executed;
		time = generateSequence(1000);
		
		setTimeout(function(){
			//alert("Now it's your turn!\nREADY?\nPress Ok to Play.");
			//counter = 10;
			var thingNumBlocks = $.ThingBroker({debug:true});
			thingNumBlocks.postEvent("thingNumBlocks", {"nro_blocks":numBlocksInSequence});
		}, time);				
		
		setTimeout(function(){
			cleanSequence(map);	
			$("#blocks").delay(1000).hide();
			$("#div_lvl h2").remove();
			$("#div_lvl").delay(1000).hide();			
			// Send an event to the Memorize_mobUbi.html to start the game;
			time +=1000;					
		}, time);
		
		setTimeout(function(){
			//$("#blocks").delay(1000).hide();
			$("#countdown").show();
		}, time);
	}

function init() {
   var touchzone = document.getElementById("play_ubi");
   touchzone.addEventListener("touchstart", start, false);
   
   var block0x0 = document.getElementById("0x0");
   block0x0.addEventListener("touchstart", handleTouch, false);   
   
   var block0x1 = document.getElementById("0x1");
   block0x1.addEventListener("touchstart", handleTouch, false); 
   
   var block0x2 = document.getElementById("0x2");
   block0x2.addEventListener("touchstart", handleTouch, false); 
   
   var block1x0 = document.getElementById("1x0");
   block1x0.addEventListener("touchstart", handleTouch, false); 
   
   var block1x1 = document.getElementById("1x1");
   block1x1.addEventListener("touchstart", handleTouch, false); 
   
   var block1x2 = document.getElementById("1x2");
   block1x2.addEventListener("touchstart", handleTouch, false); 
   
   var block2x0 = document.getElementById("2x0");
   block2x0.addEventListener("touchstart", handleTouch, false); 
   
   var block2x1 = document.getElementById("2x1");
   block2x1.addEventListener("touchstart", handleTouch, false); 
   
   var block2x2 = document.getElementById("2x2");
   block2x2.addEventListener("touchstart", handleTouch, false); 
}

function start(){
	playerName = "Physical Object";
	var player_confirm = $.ThingBroker({debug:true});
	console.log("name sent = " + playerName);
	player_confirm.postEvent("thingPlayersName", {"name": playerName});
	playing = true;
	
	$("#signup_div").delay(1000).hide();
	$("#wait_div").show();

	/* A listener here waits until all the players are ready, so, someone pushs a button in the Big display starting the game 
	   for while, let's use the PLAY button for that.*/		
}

	
	
	
	
	
	
	// A function to handle the element click
    var handleClick = function(){
	
		//console.log("numBlocksClicked before time = " + numBlocksClicked);		
		//console.log("Im in the handle function");
		
		// starts the timer
		//if(numBlocksClicked==0) gameTimer = setInterval(function(){numSeconds++;},1000);
		
		// counts the number of clicks
		numBlocksClicked++;
		
		// execute the action actived by a click
		
		//console.log("numBlocksClicked = " + numBlocksClicked);
		//console.log("numBlocksInSequence = " + numBlocksInSequence);
      
		var valueId = $(this).attr("id");
		var posClicked = valueId.split("x");
		//console.log("posClicked[0] = " + posClicked[0] + ", posClicked[1] = " + posClicked[1]);
		$(this).css({ backgroundColor: '#2834b8' });
		playerMap[posClicked[0]][posClicked[1]] = numBlocksClicked;
	  
 	    // if numBlocksClicked = numTotalBlocksInSequence, then, this level has ended
		if(numBlocksClicked == numBlocksInSequence){
		//	console.log("I've finished and I will send the seq");
            // removes the timer
            //clearInterval(gameTimer);
            // Show results
			setTimeout(function(){				
				//Send the player name and its sequence to the Big analyse and give a result;
				var e = $.ThingBroker({debug:true, container:false});
				e.postEvent("thingSeqs", {"name":playerName, "sequence": playerMap});
								
				$("#blocks_div").delay(1000).hide();
				$("#result_div").show();
			}, 300);            
        }	
		//console.log("i've passed the if...");
    }
	
	// A function to handle the touch event
    function handleTouch(){
	
		//console.log("numBlocksClicked before time = " + numBlocksClicked);		
	//	console.log("Im in the handle function");
		
		// starts the timer
		//if(numBlocksClicked==0) gameTimer = setInterval(function(){numSeconds++;},1000);
		
		// counts the number of clicks
		numBlocksClicked++;
		
		// execute the action actived by a click
		
	//	console.log("numBlocksClicked = " + numBlocksClicked);
		//console.log("numBlocksInSequence = " + numBlocksInSequence);
      
		var valueId = $(this).attr("id");
		var posClicked = valueId.split("x");
		//console.log("posClicked[0] = " + posClicked[0] + ", posClicked[1] = " + posClicked[1]);
		$(this).css({ backgroundColor: '#2834b8' });
		playerMap[posClicked[0]][posClicked[1]] = numBlocksClicked;
	  
 	    // if numBlocksClicked = numTotalBlocksInSequence, then, this level has ended
		if(numBlocksClicked == numBlocksInSequence){
			console.log("I've finished and I will send the seq");
            // removes the timer
            //clearInterval(gameTimer);
            // Show results
			setTimeout(function(){				
				//Send the player name and its sequence to the Big analyse and give a result;
				var e = $.ThingBroker({debug:true});
				e.postEvent("thingSeqs", {"name":playerName, "sequence": playerMap});
								
				$("#blocks_div").delay(1000).hide();
				$("#result_div").show();
			}, 300);            
        }	
		//console.log("i've passed the if...");
    }
