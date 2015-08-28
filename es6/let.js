var a = [];
for (let i = 0; i < 10; i++) {
  	a[i] = function () {
    console.log(i);
  };
}

a[6]();

var b = [];
for (var i = 0; i < 10; i++) {
	b[i] = function(){
		console.log(i);
	}
}
b[6]();