Module.register("DublinBus", {

    defaults: {
        stops: []
    },

    getStyles: function () {
        return ["font-awesome.css"];
    },

    start: function () {
        Log.log("Starting module: " + this.name);
        for (var s in this.config.stops) {
            this.addStop(this.config.stops[s]);
        }

        this.stopData = {};
        this.loaded = false;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "RTPI_EVENTS") {
			this.stopData[payload.stopId] = payload.events;
			this.loaded = true;
        } 
        else if (notification === "FETCH_ERROR") {
            Log.error("DublinRTPI Error. Could not fetch stop: " + payload.stopId);
        } 
        else {
            Log.log("DublinRTPI received an unknown socket notification: " + notification);
        }

        this.updateDom(2000);
    },

    
    getDom: function () {

        var events = this.createEventList();
        var table = document.createElement("table");
        table.className = "small";

        if (events.length === 0) {
            table.innerHTML = (this.loaded) ? this.translate("EMPTY") : this.translate("LOADING");
            table.className = "small dimmed";
            return table;
        }

		var header = document.createElement("tr");
		table.appendChild(header);

		var dayHeader = document.createElement("td");
		header.appendChild(dayHeader);
		
		var weatherHeader = document.createElement("td");
		weatherHeader.innerHTML = "Stop";
		header.appendChild(weatherHeader);
		
		var maxTempHeader = document.createElement("td");
		maxTempHeader.className = "align-right";
		maxTempHeader.innerHTML = "Bus";
		header.appendChild(maxTempHeader);
		
		var minTempHeader = document.createElement("td");
		minTempHeader.className = "align-center";
		minTempHeader.innerHTML = "Route";
		header.appendChild(minTempHeader);

		var timeHeader = document.createElement("td");
		timeHeader.className = "align-left";
		timeHeader.innerHTML = "Time";
		header.appendChild(timeHeader);
		
		
        for (var e in events) {
            var event = events[e];
            var eventWrapper = document.createElement("tr");

            eventWrapper.className = "normal";

			var symbolWrapper = document.createElement("td");
			symbolWrapper.className = "fa fa-fw fa-bus";
			symbolWrapper.style.paddingLeft = "5px";
			eventWrapper.appendChild(symbolWrapper);

			var stopNameWrapper = document.createElement("td");
			stopNameWrapper.className = "stopname bright";
			stopNameWrapper.innerHTML = event.stopId + "  ";
			eventWrapper.appendChild(stopNameWrapper);

			var routeWrapper = document.createElement("td");
			routeWrapper.className = "route bright";
			routeWrapper.innerHTML = event.route;
			eventWrapper.appendChild(routeWrapper);

			var lineWrapper = document.createElement("td");
			lineWrapper.className = "destination bright";
			lineWrapper.innerHTML = event.destination;
			eventWrapper.appendChild(lineWrapper);

            var timeWrapper = document.createElement("td");
            timeWrapper.innerHTML = event.isDue ? "Due" : event.duetime + " min";
            timeWrapper.className = "time light";
            eventWrapper.appendChild(timeWrapper);

            table.appendChild(eventWrapper);
        }

        return table;
    },

    //Creates the sorted list of all events.
    createEventList: function () {
        var events = [];
        for (var s in this.stopData) {
            var stop = this.stopData[s];
            for (var e in stop) {
                events.push(stop[e]);
            }
        }

        events.sort(function (a, b) {
            return a.duetime - b.duetime;
        });

        return events.slice(0, 10);
    },

    //Requests node helper to add a stop.
    addStop: function (stopConfig) {
        Log.log("DublinRTPI adding stop id: " + stopConfig.id);
        this.sendSocketNotification("ADD_RTPI_STOP", {
            stopId: stopConfig.id
        });
    },
});
