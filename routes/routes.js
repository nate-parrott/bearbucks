var scrape = require('../scrape')

exports.index = function(req, res) {
	var error = req.query.error? req.query.error : '';
	res.render('index', {error: error});
};

exports.balances = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	scrape.scrape(username, password, function(balances) {
		if (balances.flexPoints != undefined) {
			var params = balances;
			params.username = username;
			res.render('balances', params);
		} else {
			res.redirect('/?error=login')
		}
	})
}
