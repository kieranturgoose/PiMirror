var NodeHelper = require("node_helper");
var RTPIFetcher = require("./BusFetcher.js");

module.exports = NodeHelper.create({

    start: function() {
        var events = [];
        this.fetchers = [];
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "ADD_RTPI_STOP") {
            this.createFetcher(payload.stopId);
        }
    },

	createFetcher: function(stopId) {
        var self = this;
        var fetcher;
        if (typeof self.fetchers[stopId] === "undefined") {
            fetcher = new RTPIFetcher(stopId);

            fetcher.onReceive(function(fetcher) {

                self.sendSocketNotification("RTPI_EVENTS", {
                    stopId: fetcher.stopId(),
                    events: fetcher.events()
                });
            });

            fetcher.onError(function(fetcher, error) {
                self.sendSocketNotification("FETCH_ERROR", {
                    stopId: fetcher.stopId(),
                    error: error
                });
            });

            self.fetchers[stopId] = fetcher;
        } 
        else {
            fetcher = self.fetchers[stopId];
            fetcher.broadcastEvents();
        }

        fetcher.startFetch();
    }
});
