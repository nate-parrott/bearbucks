var scrape = require('../scrape')

exports.index = function(req, res) {
  res.render('index', {});
};

exports.balances = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	console.log(username)
	scrape.scrape(username, password, function(balances) {
		if (balances.flexPoints != undefined) {
			var params = balances;
			params.username = username;
			res.render('balances', params);
		} else {
			res.redirect('/#fail')
		}
	})
}
