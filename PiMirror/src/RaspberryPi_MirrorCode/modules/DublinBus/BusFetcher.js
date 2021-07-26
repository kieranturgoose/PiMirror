var request = require('request');

var RTPIFetcher = function(stopId) {
    var self = this;

    var reloadTimer = null;
    var events = [];

    var fetchFailedCallback = function() {};
    var eventsReceivedCallback = function() {};

    //fetches the data from RTPI API
    var fetchStop = function() {

        clearTimeout(reloadTimer);
        reloadTimer = null;

        var apiUrl = "https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=" + stopId;
        request(apiUrl, function (err, response, body) {
            var newEvents = [];
            var data = {};

            //handle HTTP errors
            if (err) {
                console.error("DublinRTPI error querying RTPI API for stop id: " + stopId);
                console.error(err);
                fetchFailedCallback(self, err);
                scheduleTimer();
                return;
            }

            //handle JSON errors
            try {
                data = JSON.parse(body);
            } 
            catch (e) {
                console.error("DublinRTPI Error parsing RTPI JSON response for stop id: " + stopId);
                console.error(e);
                console.log(body);
                fetchFailedCallback(self, e);
                scheduleTimer();
                return;
            }

            // handle RTPI errors
            switch (data.errorcode) {
            case "0":
                //no errors
                break;
            case "1":
                //valid request, but no data for the stop
                break;
            default:
                //error
                console.error("DublinRTPI RTPI API response has error for stop id: " + stopId + " - " + data.errormessage);
                console.error(data);
                console.log(data);
                fetchFailedCallback(self, e);
                scheduleTimer();
                return;
            }

			//store the event
            for (var e in data.results) {
                var event = data.results[e];
                event.stopId = data.stopid;
                event.isDue = event.duetime === "Due";
                event.duetime = event.isDue ? -1 : parseInt(event.duetime);

                newEvents.push(event);
            }


            // limit number of events
            events = newEvents

            // notify
            self.broadcastEvents();
            scheduleTimer();
        });
    };


    //schedule the timer for the next update
    var scheduleTimer = function() {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(function() {
            fetchStop();
        }, 60 * 1000);
    };

    //trigger fetching a stop
    this.startFetch = function() {
        fetchStop();
    };

    //Broadcast the existing events
    this.broadcastEvents = function() {
        eventsReceivedCallback(self);
    };

    //Sets the on success callback
    this.onReceive = function(callback) {
        eventsReceivedCallback = callback;
    };

    //Sets the on error callback
    this.onError = function(callback) {
        fetchFailedCallback = callback;
    };

    //Returns the stopId of this fetcher.
    this.stopId = function() {
        return stopId;
    };

    //Returns current available events for this fetcher.
    this.events = function() {
        return events;
    };
};


module.exports = RTPIFetcher;
