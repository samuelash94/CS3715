window.onload = init;
function init(){
    var reviewArray = getReviewArray();
    var responseArray = getResponseArray();
    var deletedCommentArray = getDeletedCommentArray();
    for (var i = 0; i < reviewArray.length; i++){
    	var key = reviewArray[i];
    	var value = localStorage[key];
    	addReviewToDOM(value);
    }
    for (var i = 0; i < responseArray.length; i++){
    	var key = responseArray[i];
    	var value = localStorage[key];
    	addResponseToDOM(value);
    }
    for (var i = 0; i < deletedCommentArray.length; i++){
    	var key = deletedCommentArray[i];
    	var value = localStorage[key];
    	addDeletedCommentToDOM(value);
    }
    document.getElementById('identity').onchange = function() {
    	var i = 1;
    	var myDiv = document.getElementById("inputtype" + i);
    	while(myDiv) {
        	myDiv.style.display = 'none';
        	myDiv = document.getElementById("inputtype" + ++i);
    	}
    	document.getElementById(this.value).style.display = 'block';
    	var button1 = document.getElementById("button1");
    	var button2 = document.getElementById("button2");
 	}
}
function getReviewArray(value){
    var reviewArray = localStorage.getItem("reviewArray");
    if (!reviewArray){
    	reviewArray = [];
    	localStorage.setItem("reviewArray", JSON.stringify(reviewArray));
    }else{
    	reviewArray = JSON.parse(reviewArray);
    }
    return reviewArray;
}
function addReviewToDOM(value){
	var reviews = document.getElementById("reviews");
	var temp = document.createElement("div");
	temp.innerHTML = value;
	temp.setAttribute("class","review");
	reviews.insertBefore(temp, reviews.firstChild);
	initMap();
}
function getResponseArray(value){
    var responseArray = localStorage.getItem("responseArray");
    if (!responseArray){
    	responseArray = [];
    	localStorage.setItem("responseArray", JSON.stringify(responseArray));
    }else{
    	responseArray = JSON.parse(responseArray);
    }
    return responseArray;
}
function addResponseToDOM(value){
	var reviews = document.getElementById("reviews");
	var temp = document.createElement("div");
	temp.innerHTML = value;
	temp.setAttribute("class","response");
	reviews.insertBefore(temp, reviews.firstChild);
	initMap();
}
function getDeletedCommentArray(value){
    var deletedCommentArray = localStorage.getItem("deletedCommentArray");
    if (!deletedCommentArray){
    	deletedCommentArray = [];
    	localStorage.setItem("deletedCommentArray", JSON.stringify(deletedCommentArray));
    }else{
    	deletedCommentArray = JSON.parse(deletedCommentArray);
    }
    return deletedCommentArray;
}
function addDeletedCommentToDOM(value){
	var deletedArea = document.getElementById("deletedcomments");
	deletedArea.style.display = 'block';
	var deletedComment = document.createElement("div");
	deletedComment.innerHTML = value;
	deletedArea.insertBefore(deletedComment, deletedArea.firstChild);
}

function initMap(){
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.652414, lng: -79.379260},
    zoom: 13
  });
  var marker = new google.maps.Marker({
  	map: map,
  	title: "You are here"
  	});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

     	marker.setPosition(pos);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, marker, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, marker, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, marker, pos) {
  marker.setPosition(pos);
}
var commentTitleInput;
var commentTitle;
var customerNameInput;
var customerName;
var ratingInput;
var rating;
var reviewInput;
var review;
var managerReviewInput;
var managerReview;
function handleTravellerPost(){
	//function begins by taking in all the necessary fields, throwing alerts
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
	}
	
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
	
	var newReview = document.createElement("div");
	
	newReview.innerHTML = "<b><p><q>" + window.commentTitle + "</b></p></q>";
	
	newReview.innerHTML += "<font size = '2'><p>by " + window.customerName + ", Written " + today + "</p></font>";

	newReview.innerHTML += "<p> <b>Rating:</b> " + window.rating + "/5 </p>";
"Test"
	newReview.innerHTML += "<p>" + window.review + "</p>";
	
	newReview.innerHTML += "<div id='map'></div>";
	
	var rev = window.review;
	var reviewArray = getReviewArray();
	var key = "review_" + reviewArray.length;
	
	newReview.innerHTML += "<form><input type='button' id='" + key + "' onclick='handleDeleteTraveller(this.id, " + JSON.stringify(rev) + ");' value='Delete'></form>";
	
	newReview.setAttribute("class","review");
	
	localStorage.setItem(key, newReview.innerHTML);
	reviewArray.push(key);
	localStorage.setItem("reviewArray", JSON.stringify(reviewArray));
	addReviewToDOM(newReview.innerHTML);
}
function handleManagerPost(){
	//function begins by taking in all the necessary fields, throwing alerts
	// and returning out of the function if they are blank or invalid
	window.managerReviewInput = document.getElementById("managerreview");
	window.managerReview = window.managerReviewInput.value;
	if (window.managerReview == "" || window.managerReview == null){
		alert("Response to customer must not be blank");
		return;
	}
	
	var newResponse = document.createElement("div");
	
	newResponse.innerHTML = "<p><em>" + window.managerReview + "</em> -Great Escapes Crew</p>";
	
	newResponse.innerHTML += "<div id='map'></div>";
	
	var resp = window.managerReview;
	var responseArray = getResponseArray();
	var key = "response_" + responseArray.length;
	
	newResponse.innerHTML += "<form><input type='button' id='" + key + "' onclick='handleDeleteManager(this.id, " + JSON.stringify(resp) + ");' value='Delete'></form>";	
	
	newResponse.setAttribute("class","response");
	
	localStorage.setItem(key, newResponse.innerHTML);
	responseArray.push(key);
	localStorage.setItem("responseArray", JSON.stringify(responseArray));
	addResponseToDOM(newResponse.innerHTML);
}
function handleDeleteTraveller(key, rev){
	//function takes in the key of the review and deletes it.
	//function then takes the review itself on its own as an
	//input variable and creates a new comment in the deleted comment area.
	alert("Traveller's comment deleted!");
	localStorage.removeItem(key);
	var reviewArray = getReviewArray();
	if (reviewArray){
   	for (var i = 0; i < reviewArray.length; i++){
    		if (key == reviewArray[i]){
    			reviewArray.splice(i,1);
    		}
   	}
   }
   localStorage.setItem("reviewArray", JSON.stringify(reviewArray));
   var deletedComment = document.createElement("div");
	deletedComment.innerHTML = "<li>" + rev + "<br><br></li>";
   	
   var deletedCommentArray = getDeletedCommentArray();
   var newkey = "deleted_" + deletedCommentArray.length;
   localStorage.setItem(newkey, deletedComment.innerHTML);
   deletedCommentArray.push(newkey);
   localStorage.setItem("deletedCommentArray", JSON.stringify(deletedCommentArray));
   addDeletedCommentToDOM(deletedComment.innerHTML);
}
function handleDeleteManager(key, resp){
	//function is the same as handleDeleteTraveller except it takes
	//manager responses instead of customer reviews.
	alert("Manager's comment deleted!");
	localStorage.removeItem(key);
	var responseArray = getResponseArray();
	if (responseArray){
   	for (var i = 0; i < responseArray.length; i++){
    		if (key == responseArray[i]){
    			responseArray.splice(i,1);
    		}
   	}
   }
   localStorage.setItem("responseArray", JSON.stringify(responseArray));
   var deletedComment = document.createElement("div");
	deletedComment.innerHTML = "<li>" + resp + "<br><br></li>";
   	
   var deletedCommentArray = getDeletedCommentArray();
   var newkey = "deleted_" + deletedCommentArray.length;
   localStorage.setItem(newkey, deletedComment.innerHTML);
   deletedCommentArray.push(newkey);
   localStorage.setItem("deletedCommentArray", JSON.stringify(deletedCommentArray));
   addDeletedCommentToDOM(deletedComment.innerHTML);
}
function clearLocalStorage(){
	//The "Clear All Comments" button clears localStorage completely
	localStorage.clear();
	alert("All comments deleted!");
}