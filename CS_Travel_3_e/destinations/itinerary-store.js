function save(item){
	var reviewArray = getStoreArray("reviews");
	reviewArray.push(item);
	localStorage.setItem("reviews", JSON.stringify(reviewArray));
}
function loadReviews(){
	var reviewArray = getSavedReviews();
	var
	if (reviewArray != null){
		for (var i = 0; i < reviewArray.length; i++){
			var 
			
			
			
		}
	}	
}
function getSavedReviews(){
	return getStoreArray("reviews");
}
function getStoreArray(key){
	var reviewArray = localStorage.getItem(key);
	if (reviewArray == null || reviewArray == ""){
		reviewArray = new Array();
	}else{
		reviewArray = JSON.parse(reviewArray);
	}
	return reviewArray;
}