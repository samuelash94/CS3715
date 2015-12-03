var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

//this function is a duplicate of handleTravellerPost from itinerary.js. Ideally this function
//would replace that function entirely

//note: all this does right now is it automatically writes to message.txt (see httpserver),
//and does nothing when the button "Test" is pushed on barbados.html

function handleTravellerPost1(){
	/*//function begins by taking in all the necessary fields, throwing alerts
	// and returning out of the function if they are blank or invalid
	window.commentTitleInput = document.getElementById("title");
	window.commentTitle = window.commentTitleInput.value;
	if (window.commentTitle == "" || window.commentTitle == null){
		alert("Comment title is required");
		return;
	}
	window.customerNameInput = document.getElementById("username");
	window.customerName = window.customerNameInput.value;
	if (window.customerName == "" || window.customerName == null){
		alert("Name (anonymous or otherwise) is required");
		return;
	}
	window.ratingInput = document.getElementById("rating");
	window.rating = window.ratingInput.value;
	if (window.rating == "" || window.rating == null){
		alert("Trip rating (1-5) is required");
		return;
	}else if (window.rating < 1 || window.rating > 5){
		alert("Invalid rating. Must be from 1-5.");
		return;
	}
	window.reviewInput = document.getElementById("reviewtext");
	window.review = window.reviewInput.value;
	if (window.review == "" || window.review == null){
		alert("Review (short or long) is required");
		return;
	}*/
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();

	if (mm == 1){
		mm = "January";		
	}else if (mm == 2){
		mm = "February";
	}else if (mm == 3){
		mm = "March";
	}else if (mm == 4){
		mm = "April";
	}else if (mm == 5){
		mm = "May";
	}else if (mm == 6){
		mm = "June";
	}else if (mm == 7){
		mm = "July";
	}else if (mm == 8){
		mm = "August";
	}else if (mm == 9){
		mm = "September";
	}else if (mm == 10){
		mm = "October";
	}else if (mm == 11){
		mm = "November";
	}else if (mm == 12){
		mm = "December";
	}

	today = mm+' '+dd+', '+yyyy;
	
	var newReview =  "<p>Just some html</p>"
	
	//var rev = window.review;
	//var reviewArray = getReviewArray();
	//var key = "review_" + reviewArray.length;
	
	//newReview.setAttribute("class","review");
	
	fs.appendFile('../message.txt', newReview, function (err) {
		 if (err) throw err;
		 console.log('It\'s saved! in same location.');
	});
	alert("button was clicked.");
};