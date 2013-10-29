var request = require('request');
var cheerio = require('cheerio');

exports.scrape = function(username, password, callback) {
	var cookieJar = request.jar();
	var headers = {
	'Host': 'selfservice.brown.edu',
	'Origin': 'https://selfservice.brown.edu',
	'Referer': 'https://selfservice.brown.edu/ss/twbkwbis.P_WWWLogin',
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36',
}
	var r = request.defaults({jar: cookieJar, headers: headers, followRedirect: false});
	r.get('https://selfservice.brown.edu/ss/twbkwbis.P_WWWLogin', function() {
		r.post({
			url: 'https://selfservice.brown.edu/ss/twbkwbis.P_ValLogin',
			form: {sid: username, PIN: password}
		}, function() {
			r.get('https://selfservice.brown.edu/ss/hwwkmealplans.P_Display_Balances', function(err, result, body) {
				var results = {};
				var resultKeysForRowLabels = {
					'Meal Credits': 'mealCredits', 
					'Guest Meals': 'guestMeals', 
					'Flex Plus Points': 'flexPoints', 
					'Bear Bucks': 'bearBucks',
					'PawPrints': 'pawPrints'}
				var $ = cheerio.load(body);
				$('.datadisplaytable tr').each(function(i, row) {
					var children = $(row).children('td');
					if (children.length == 4) {
						var rowLabel = $(children[1]).text();
						var rowValue = $(children[3]).text();
						var resultKey = resultKeysForRowLabels[rowLabel];
						if (resultKey) {
							results[resultKey] = parseFloat(rowValue);
						}
					}
				})
				callback(results);
			})
		})
	})
}
 