var NodeHelper = require("node_helper");
var Fetcher = require("./NewsFetcher.js");

module.exports = NodeHelper.create({
	start: function() {
		console.log("Starting module: " + this.name);
		this.fetchers = [];
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_FEED") {
			this.createNewsFetcher(payload.feed, payload.config);
			return;
		}
	},

	createNewsFetcher: function(feed, config) {
		var self = this;

		var url = feed.url;
		var encoding = "UTF-8";
		var reloadInterval = 5 * 60 * 1000;
		
		var fetcher = new Fetcher(url, reloadInterval, encoding);

		fetcher.onReceive(function(fetcher) {
			self.broadcastFeeds();
		});

		fetcher.onError(function(fetcher, error) {
			self.sendSocketNotification("FETCH_ERROR", {
				url: fetcher.url(),
				error: error
			});
		});

		self.fetchers[url] = fetcher;
		fetcher.startFetch();
	},

	//Send the feeds and their info back to News.js
	broadcastFeeds: function() {
		var feeds = {};
		for (var f in this.fetchers) {
			feeds[f] = this.fetchers[f].items();
		}
		this.sendSocketNotification("NEWS_ITEMS", feeds);
	}
});
