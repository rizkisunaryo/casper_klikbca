// casperjs --ignore-ssl-errors=true klikbca.js
var casper = require('casper').create();
casper.on('remote.message', function(msg) {
	this.echo('remote message caught: ' + msg);
});



casper.start('https://ibank.klikbca.com', function() {
	casper.evaluate(function() {
		document.getElementById('user_id').value = 'user_id';
		document.getElementById('pswd').value = 'pswd';
		document.querySelector("input[name='value(Submit)']").click();
		console.log("Login submitted!");
	});
});
casper.then(function() {
	this.capture('bca-login.png');
});



casper.then(function() {
	casper.evaluate(function() {
		var menu = document.getElementsByName("menu")[0];
		console.log(menu.getAttribute('src'));
		var menuContent = menu.contentWindow;

		if (typeof menuContent !== 'undefined' && menuContent != null) {
			console.log('masuk');
			var mutasiA = menuContent.document.getElementsByTagName("a")[4];
			mutasiA.click();
			console.log('berhasil');
		};
	});
});
casper.then(function() {
	this.capture('bca-informasi-rekening.png');
});



casper.then(function() {
	casper.evaluate(function() {
		var menu = document.getElementsByName("menu")[0];
		console.log(menu.getAttribute('src'));
		var menuContent = menu.contentWindow;
		if (typeof menuContent !== 'undefined' && menuContent != null) {
			console.log('masuk2');
			var mutasiA = menuContent.document.getElementsByTagName("a")[2];
			mutasiA.click();
			console.log('berhasil2');
		};
	});
});
casper.then(function() {
	this.capture('bca-mutasi.png');
});



casper.then(function() {
	var res = this.page.evaluate(function() {
		var res = {};
		res.post = null;

		var menu = document.getElementsByName("atm")[0];
		console.log(menu.getAttribute('src'));
		var menuContent = menu.contentWindow;
		if (typeof menuContent !== 'undefined' && menuContent != null) {
			console.log('masuk3');
			f = menuContent.document.iBankForm;
			console.log('masuk3.0.1');
			f.onsubmit = function() {
				console.log('masuk3.1');
				//iterate the form fields
				var post = {};
				for (i = 0; i < f.elements.length; i++) {
					post[f.elements[i].name] = f.elements[i].value;
				}
				res.action = f.action;
				console.log('masuk3.2');
				console.log('action: ', f.action);
				res.post = post;
				return false; //Stop form submission
			}

			console.log('masuk3.3');
			var mutasiA = menuContent.document.getElementsByName("value(submit2)")[0];
			console.log('masuk3.4');
			mutasiA.click();
			console.log('berhasil3');
		}
		return res; //Return the form data to casper
	});

	casper.download(res.action, "bca-mutasi.csv", "POST", res.post);
});



casper.wait(10000, function() {
	casper.evaluate(function() {
		window.location.href = '/authentication.do?value(actions)=logout';
	});
});
casper.then(function() {
	this.capture('bca-logout.png');
})



casper.run(function() {
	this.echo('Done.').exit();
});