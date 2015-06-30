Object.prototype.toQueryString1 = function(){
	var arr = [];
	for(var i in this){
		var p = i + '=' + this[i];
		arr.push(p);
	}
	arr.pop();
	return arr.join('&');
}