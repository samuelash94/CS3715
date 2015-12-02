window.onload = function(){

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
	var url = "";
	if (window.location.pathname == "/destinations/barbados.html"){
		url = "barbados.JSON";
	}else if (window.location.pathname == "/destinations/barcelona.html"){
		url = "barcelona.JSON";
	}else if (window.location.pathname == "/destinations/kualalumpur.html"){
		url = "kualalumpur.JSON";
	}else if (window.location.pathname == "/destinations/nyc.html"){
		url = "nyc.JSON";
	}
	var request = new XMLHttpRequest();

	request.onload = function(){
		if (request.status == 200){
			postComment(request.responseText);
		}
	};
	
	request.open("GET", url);
	request.send(null);
}

function postComment(responseText){
	
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
	
	var newReviews = document.getElementById("reviews");
	var reviews = JSON.parse(responseText);
	for (var i=0; i<reviews.length; i++){
		var review = reviews[i];
		var div = document.createElement("div");
		div.setAttribute("class", "review");
		div.innerHTML = "<b><p><q>" + review.title + "</b></p></q>";
		
		div.innerHTML += "<font size = '2'><p>by " + review.username + ", Written " + today + "</p></font>";

		div.innerHTML += "<p> <b>Rating:</b> " + review.rating + "/5 </p>";
		
		div.innerHTML += "<p>" + review.reviewtext + "</p>";
		
		div.innerHTML += "<div id='map'></div>";
		
		var rev = window.review;
		var key = "review_";
		
		div.innerHTML += "<form><input type='button' id='" + key + "' onclick='handleDeleteTraveller(this.id, " + JSON.stringify(rev) + ");' value='Delete'></form>";
		
		newReviews.insertBefore(div, newReviews.firstChild);
		
		initMap();
	}
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