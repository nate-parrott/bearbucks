var scrape = require('../scrape')
var fs = require('fs');

var analytics = '';
if (fs.existsSync('analytics.html')) {
	analytics = fs.readFileSync('analytics.html');
}


exports.index = function(req, res) {
	var error = req.query.error? req.query.error : '';
	res.render('index', {error: error, analytics: analytics});
};

exports.balances = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	scrape.scrape(username, password, function(balances) {
		if (balances.flexPoints != undefined) {
			var params = balances;
			params.username = username;
			params.analytics = analytics;
			res.render('balances', params);
		} else {
			res.redirect('/?error=login')
		}
	})
}
