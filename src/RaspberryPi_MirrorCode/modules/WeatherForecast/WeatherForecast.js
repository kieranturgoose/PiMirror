Module.register("WeatherForecast",{
	defaults: {
		location: false,
		appid: "",
		animationSpeed: 1000,
		
		iconTable: {
			"01d": "wi-day-sunny",
			"02d": "wi-day-cloudy",
			"03d": "wi-cloudy",
			"04d": "wi-cloudy-windy",
			"09d": "wi-showers",
			"10d": "wi-rain",
			"11d": "wi-thunderstorm",
			"13d": "wi-snow",
			"50d": "wi-fog",
			"01n": "wi-night-clear",
			"02n": "wi-night-cloudy",
			"03n": "wi-night-cloudy",
			"04n": "wi-night-cloudy",
			"09n": "wi-night-showers",
			"10n": "wi-night-rain",
			"11n": "wi-night-thunderstorm",
			"13n": "wi-night-snow",
			"50n": "wi-night-alt-cloudy-windy"
		},
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function() {
		return ["weather-icons.css"];
	},

	start: function() {
		Log.info("Starting module: " + this.name);

		moment.locale(config.language);
		this.windSpeed = null;
		this.sunriseSunsetTime = null;
		this.sunriseSunsetIcon = null;
		this.temperature = null;
		this.weatherType = null;
		
		this.forecast = [];
		this.loaded = false;
		this.scheduleUpdate(1000);

		this.updateTimer = null;
		
		var self = this;
		setInterval(function() {
			self.updateDom();
		}, 1000);

	},
	
	// add extra information of current weather, windDirection, sunrise and sunset
	addExtraInfoWeather: function(wrapper) {
		var currentWeather = document.createElement("div");
		currentWeather.className = "normal";

		var windIcon = document.createElement("span");
		windIcon.className = "wi wi-strong-wind";
		currentWeather.appendChild(windIcon);

		var windSpeed = document.createElement("span");
		windSpeed.innerHTML = " " + this.windSpeed + "km/h&nbsp;";
		currentWeather.appendChild(windSpeed);

		var sunriseSunsetIcon = document.createElement("span");
		sunriseSunsetIcon.className = "wi dimmed " + this.sunriseSunsetIcon;
		currentWeather.appendChild(sunriseSunsetIcon);

		var sunriseSunsetTime = document.createElement("span");
		sunriseSunsetTime.innerHTML = " " + this.sunriseSunsetTime;
		currentWeather.appendChild(sunriseSunsetTime);

		wrapper.appendChild(currentWeather);
	},
	
	getDom: function() {
		var wrapper = document.createElement("div");

		if (this.config.appid === "") {
			wrapper.innerHTML = "Please enter an API key from openweathermap.org for your weather module";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("Loading...");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		var dateWrapper = document.createElement("div");
		dateWrapper.className = "bright";
		var timeWrapper = document.createElement("div");
		timeWrapper.className = "bright";
		var secondsWrapper = document.createElement("sup");
		var periodWrapper = document.createElement("span");
		
		var now = moment();
		
		dateWrapper.innerHTML = now.format("dddd, LL");
		timeWrapper.innerHTML = now.format("h:mm");
		secondsWrapper.innerHTML = now.format("ss");
		periodWrapper.innerHTML = now.format("a");

		timeWrapper.appendChild(secondsWrapper);
		timeWrapper.appendChild(periodWrapper);


		//Combine wrappers
		wrapper.appendChild(dateWrapper);
		wrapper.appendChild(timeWrapper);

		this.addExtraInfoWeather(wrapper);

		var weatherAndTemp = document.createElement("div");
		weatherAndTemp.className = "large bright";

		var weatherIcon = document.createElement("span");
		weatherIcon.className = "wi weathericon " + this.weatherType;
		weatherAndTemp.appendChild(weatherIcon);

		var temperature = document.createElement("span");
		temperature.innerHTML = " " + this.temperature + "&deg;C";
		weatherAndTemp.appendChild(temperature);

		wrapper.appendChild(weatherAndTemp);


		var table = document.createElement("table");
		table.className = "small";

		var header = document.createElement("tr");
		table.appendChild(header);

		var dayHeader = document.createElement("td");
		dayHeader.innerHTML = "Day";
		header.appendChild(dayHeader);
		
		var weatherHeader = document.createElement("td");
		weatherHeader.innerHTML = "Weather";
		header.appendChild(weatherHeader);
		
		var maxTempHeader = document.createElement("td");
		maxTempHeader.className = "align-right";
		maxTempHeader.innerHTML = "Max";
		header.appendChild(maxTempHeader);
		
		var minTempHeader = document.createElement("td");
		minTempHeader.className = "align-right";
		minTempHeader.innerHTML = "Min";
		header.appendChild(minTempHeader);
		

		for (var f in this.forecast) {
			var forecast = this.forecast[f];
			var row = document.createElement("tr");

			table.appendChild(row);

			var dayCell = document.createElement("td");
			dayCell.className = "bright";
			dayCell.innerHTML = forecast.day;
			row.appendChild(dayCell);

			var iconCell = document.createElement("td");
			iconCell.className = "bright wi " + forecast.icon;
			row.appendChild(iconCell);

			var maxTempCell = document.createElement("td");
			maxTempCell.className = "align-right bright";
			maxTempCell.innerHTML = forecast.maxTemp + " &deg;C";
			row.appendChild(maxTempCell);

			var minTempCell = document.createElement("td");
			minTempCell.className = "align-right bright";
			minTempCell.innerHTML = forecast.minTemp + " &deg;C";
			row.appendChild(minTempCell);

		}
		wrapper.appendChild(table);
		return wrapper;
	},

	//Requests new data from openweather.org. Calls processWeather on succesfull response.
	updateWeather: function() {
		if (this.config.appid === "") {
			Log.error("WeatherForecast: APPID not set!");
			console.log("Please enter a valid APPID for your WeatherForecast module");
			return;
		}

		//Request for current day weather
		var currentUrl = "https://api.openweathermap.org/data/2.5/weather" + this.getParams();
		var self = this;
		var retry = true;

		var weatherRequest = new XMLHttpRequest();
		weatherRequest.open("GET", currentUrl, true);
		weatherRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processCurrentWeather(JSON.parse(this.response));
				} 
				else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					retry = true;
					Log.error("WeatherForecast: Incorrect APPID.");
				} 
				else {
					Log.error("WeatherForecast: Could not load weather.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : 2500);
				}
			}
		};
		weatherRequest.send();
				
		//Request for 5 day forecast		
		var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast" + this.getParams();

		var forecastRequest = new XMLHttpRequest();
		forecastRequest.open("GET", forecastUrl, true);
		forecastRequest.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processWeather(JSON.parse(this.response));
				} 
				else if (this.status === 401) {
					self.updateDom(self.config.animationSpeed);
					retry = true;
					Log.error("WeatherForecast: Incorrect APPID.");
				} 
				else {
					Log.error("WeatherForecast: Could not load weather.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : 2500);
				}
			}
		};
		forecastRequest.send();
	},

	//Generates an url with api parameters based on the config.
	getParams: function() {
		var params = "?q=" + this.config.location + "&units=" + config.units + "&lang=" + config.language + "&APPID=" + this.config.appid;
		return params;
	},


	//Use the parse to keep the same struct between daily and forecast from Openweather
	parserDataWeather: function(data) {
		return data["temp"] = {"min": data.main.temp_min, "max": data.main.temp_max}
	},

	//Uses the received data to set the various values.
	processCurrentWeather: function(data) {
		this.temperature = parseFloat(data.main.temp).toFixed(1);

		//Convert to km/h from m/s and make to 0 decimal places
		this.windSpeed = parseFloat((data.wind.speed) * 60 * 60 /1000).toFixed(0);

		this.weatherType = this.config.iconTable[data.weather[0].icon];

		var now = new Date();
		var sunrise = new Date(data.sys.sunrise * 1000);
		var sunset = new Date(data.sys.sunset * 1000);

		var sunriseSunsetDateObject = (sunrise < now && sunset > now) ? sunset : sunrise;

		this.sunriseSunsetTime = moment(sunriseSunsetDateObject).format("HH:mm");
		this.sunriseSunsetIcon = (sunrise < now && sunset > now) ? "wi-sunset" : "wi-sunrise";
	}, 
	 
	processWeather: function(data) {
		this.forecast = []; // So the forecast isnt added over and over
		var lastDay = null;
		var forecastData = {}
				
		for (var i = 0; i < data.list.length; i++) {
			var forecast = data.list[i];
			this.parserDataWeather(forecast);

			var day = moment(forecast.dt, "X").format("ddd");
			var hour = moment(forecast.dt, "X").format("H");

			if (day !== lastDay) {
				var forecastData = {
					day: day,
					icon: this.config.iconTable[forecast.weather[0].icon],
					maxTemp: parseFloat(forecast.temp.max).toFixed(0),
					minTemp: parseFloat(forecast.temp.min).toFixed(0),
				};
				this.forecast.push(forecastData);
				lastDay = day;
			} 
			else {
				forecastData.maxTemp = forecast.temp.max > parseFloat(forecastData.maxTemp) ? parseFloat(forecast.temp.max).toFixed(0) : forecastData.maxTemp;
				forecastData.minTemp = forecast.temp.min < parseFloat(forecastData.minTemp) ? parseFloat(forecast.temp.min).toFixed(0) : forecastData.minTemp;

				// Since we don't want an icon from the start of the day (in the middle of the night) we update the icon as long as it's somewhere during the daytime.
				if (hour >= 8 && hour <= 17) {
					forecastData.icon = this.config.iconTable[forecast.weather[0].icon];
				}
			}
		}

		this.show(this.config.animationSpeed, {lockString:this.identifier});
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	scheduleUpdate: function(delay) {
		var nextLoad = 10*60*1000; //Every 10 minutes
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		var self = this;
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(function() {
			self.updateWeather();
		}, nextLoad);
	}
});
