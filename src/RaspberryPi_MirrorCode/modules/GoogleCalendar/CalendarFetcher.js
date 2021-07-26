var ical = require("./vendor/ical.js");
var moment = require("moment");

var CalendarFetcher = function(url, reloadInterval, maximumEntries, auth) {
	var self = this;

	var reloadTimer = null;
	var events = [];

	//Initiates calendar fetch.
	var fetchCalendar = function() {
		clearTimeout(reloadTimer);
		reloadTimer = null;

		var opts = {};
		ical.fromURL(url, opts, function(error, data) {
			if (error) {
				fetchFailedCallback(self, error);
				scheduleTimer();
				return;
			}

			newEvents = [];
			var limitFunction = function(date, i) {return i < maximumEntries;};
			var eventDate = function(event, time) {
				return (event[time].length === 8) ? moment(event[time], "YYYYMMDD") : moment(new Date(event[time]));
			};

			for (var e in data) {
				var event = data[e];
				var now = new Date();
				var today = moment().startOf("day").toDate();

				if (event.type === "VEVENT") {
					var startDate = eventDate(event, "start");
					var endDate = eventDate(event, "end");

					if (isFullDayEvent(event)) {
						startDate = startDate.startOf("day");
					}

					var title = event.summary;

					if (typeof event.rrule != "undefined") {
						var rule = event.rrule;
						var dates = rule.between(today, true, limitFunction);

						for (var d in dates) {
							startDate = moment(new Date(dates[d]));
							endDate  = moment(parseInt(startDate.format("x")), "x");
							if (endDate.format("x") > now) {
								newEvents.push({
									title: title,
									startDate: startDate.format("x"),
									endDate: endDate.format("x"),
									fullDayEvent: isFullDayEvent(event),
								});
							}
						}
					} 
					else {
						// Single event.
						var fullDayEvent = isFullDayEvent(event);

						if (endDate < new Date()) {
							//It's in the past. So skip
							continue;
						}

						// Every thing is good. Add it to the list.
						newEvents.push({
							title: title,
							startDate: startDate.format("x"),
							endDate: endDate.format("x"),
							fullDayEvent: fullDayEvent,
						});

					}
				}
			}

			newEvents.sort(function(a, b) {
				return a.startDate - b.startDate;
			});


			events = newEvents.slice(0, maximumEntries);

			self.broadcastEvents();
			scheduleTimer();
		});
	};

	var scheduleTimer = function() {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchCalendar();
		}, reloadInterval);
	};

	//Checks if an event is a fullday event.
	var isFullDayEvent = function(event) {
		if (event.start.length === 8) {
			return true;
		}

		var start = event.start;
		var startDate = new Date(start);
		var end = event.end;

		// Is 24 hours, and starts on the middle of the night.
		if (end - start === 24 * 60 * 60 * 1000 && startDate.getHours() === 0 && startDate.getMinutes() === 0) {
			return true;
		}

		return false;
	};

	//Initiate fetchCalendar();
	this.startFetch = function() {
		fetchCalendar();
	};

	//Broadcast the existing events.
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

	//Returns the url of this fetcher.
	this.url = function() {
		return url;
	};

	//Returns current available events for this fetcher.
	this.events = function() {
		return events;
	};

};

module.exports = CalendarFetcher;
