Module.register("GoogleCalendar", {
	defaults: {
		maximumEntries: 5,
	},

	getScripts: function () {
		return ["moment.js"];
	},

	start: function () {
		Log.log("Starting module: " + this.name);

		// Set locale.
		moment.locale(config.language);
		this.addCalendar(this.config.url, this.config.auth, this.config.maximumEntries);
		this.calendarData = {};
		this.loaded = false;
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "CALENDAR_EVENTS") {
			this.calendarData[payload.url] = payload.events;
			this.loaded = true;
		} 
		else if (notification === "FETCH_ERROR") {
			Log.error("Calendar Error. Could not fetch calendar: " + payload.url);
		} 
		else {
			Log.log("Calendar received an unknown socket notification: " + notification);
		}

		this.updateDom(2000);
	},

	getDom: function () {
		var events = [];
		var today = moment().startOf("day");
		for (var c in this.calendarData) {
			var calendar = this.calendarData[c];
			for (var e in calendar) {
				var event = calendar[e];
				event.url = c;
				events.push(event);
			}
		}

		events.sort(function (a, b) {
			return a.startDate - b.startDate;
		});

		events.slice(0, this.config.maximumEntries);
		
		var wrapper = document.createElement("table");
		wrapper.className = "small";

		if (events.length === 0) {
			wrapper.innerHTML = (this.loaded) ? this.translate("EMPTY") : this.translate("LOADING");
			wrapper.className = "small dimmed";
			return wrapper;
		}

		for (var e in events) {
			var event = events[e];
			var eventWrapper = document.createElement("tr");
			eventWrapper.className = "normal";

			var symbolWrapper = document.createElement("td");
			symbolWrapper.className = "fa fa-calendar";
			
			eventWrapper.appendChild(symbolWrapper);
		
			var titleWrapper = document.createElement("td");
			titleWrapper.innerHTML = event.title;
			titleWrapper.className = "title bright";

			eventWrapper.appendChild(titleWrapper);

			var timeWrapper = document.createElement("td");
			var now = new Date();
			var oneDay = 24 * 60 * 60 * 1000;
			//If no time and set for all day
			if (event.fullDayEvent) {
				if (event.today) {
					timeWrapper.innerHTML = "Today";
				} 
				else if (event.startDate - now < oneDay && event.startDate - now > 0) {
					timeWrapper.innerHTML = "Tomorrow";
				} 
				else {
					//Capitalise the first letter and append the rest
					timeWrapper.innerHTML = moment(event.startDate, "x").fromNow().charAt(0).toUpperCase() + moment(event.startDate, "x").fromNow().slice(1);
				}
			} 
			else {
				if (event.startDate >= new Date()) {
					//Day and Time
					timeWrapper.innerHTML = moment(event.startDate, "x").calendar();
				} 
				else {
					//If event is currently running
					timeWrapper.innerHTML = 
						this.translate("RUNNING", {
							fallback: this.translate("RUNNING") + " {timeUntilEnd}",
							timeUntilEnd: moment(event.endDate, "x").fromNow(true)
						});
				}
			}
			timeWrapper.className = "time light";
			eventWrapper.appendChild(timeWrapper);

			wrapper.appendChild(eventWrapper);
		}

		return wrapper;
	},

	//Requests node helper to add calendar url.
	addCalendar: function (url, auth, calendarConfig) {
		this.sendSocketNotification("ADD_CALENDAR", {
			url: url,
			maximumEntries: this.config.maximumEntries,
			fetchInterval: 1*30*1000, //Every 30 seconds
			auth: auth
		});
	},
});
