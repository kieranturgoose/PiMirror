var FeedMe = require("feedme");
var request = require("request");
var iconv = require("iconv-lite");

var Fetcher = function(url, reloadInterval, encoding) {
	var self = this;
	
	var reloadTimer = null;
	var items = [];
	var fetchFailedCallback = function() {};
	var itemsReceivedCallback = function() {};

	var fetchNews = function() {
		clearTimeout(reloadTimer);
		reloadTimer = null;
		items = [];

		var parser = new FeedMe();

		parser.on("item", function(feedItem) {
			var title = feedItem.title;
			var pubdate = feedItem.pubdate;
			var url = feedItem.url;
			
			items.push({
				title: title,
				pubdate: pubdate,
				url: url,
			});
		});

		parser.on("end", function() {
			self.broadcastItems();
			scheduleTimer();
		});

		parser.on("error", function(error) {
			fetchFailedCallback(self, error);
			scheduleTimer();
		});

		request({uri: url}).pipe(parser);

	};

	var scheduleTimer = function() {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchNews();
		}, reloadInterval);
	};

	//Initiate fetchNews();
	this.startFetch = function() {
		fetchNews();
	};

	//Broadcast the existing items.
	this.broadcastItems = function() {
		if (items.length <= 0) {
			return;
		}
		itemsReceivedCallback(self);
	};

	this.onReceive = function(callback) {
		itemsReceivedCallback = callback;
	};

	this.onError = function(callback) {
		fetchFailedCallback = callback;
	};

	this.url = function() {
		return url;
	};

	this.items = function() {
		return items;
	};
};

module.exports = Fetcher;
