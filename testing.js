window.onload = function(){
	
	var url = "http://localhost:8081/test.JSON";
	var request = new XMLHttpRequest();

	request.onload = function(){
		if (request.status == 200){
			postComment(request.responseText);
		}
	};
	
	request.open("POST", url);
	request.send(null);
}

function postComment(responseText){
	
	var newReviews = document.getElementById("newReviews");
	var reviews = JSON.parse(responseText);
	for (var i=0; i<reviews.length; i++){
		var review = reviews[i];
		var div = document.createElement("div");
		//div.setAttribute
		div.innerHTML = review.title + ", by " + review.username;
		newReviews.appendChild(div);
	}
}