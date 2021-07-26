var NodeHelper = require("node_helper");
var validUrl = require("valid-url");
var CalendarFetcher = require("./CalendarFetcher.js");

module.exports = NodeHelper.create({
	start: function() {
		var events = [];
		this.fetchers = [];
		console.log("Starting node helper for: " + this.name);

	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_CALENDAR") {
			this.createFetcher(payload.url, payload.fetchInterval, payload.maximumEntries, payload.auth);
		}
	},
	
	createFetcher: function(url, fetchInterval, maximumEntries, auth) {
		var self = this;

		if (!validUrl.isUri(url)) {
			self.sendSocketNotification("INCORRECT_URL", {url: url});
			return;
		}

		var fetcher;
		if (typeof self.fetchers[url] === "undefined") {
			console.log("Create new calendar fetcher for url: " + url + " - Interval: " + fetchInterval);
			fetcher = new CalendarFetcher(url, fetchInterval, maximumEntries,  auth);

			fetcher.onReceive(function(fetcher) {
				self.sendSocketNotification("CALENDAR_EVENTS", {
					url: fetcher.url(),
					events: fetcher.events()
				});
			});

			fetcher.onError(function(fetcher, error) {
				self.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			self.fetchers[url] = fetcher;
		} else {
			fetcher = self.fetchers[url];
			fetcher.broadcastEvents();
		}

		fetcher.startFetch();
	}
});
