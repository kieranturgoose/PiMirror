var config = {
	address: "localhost" , port: 8080, ipWhiteList: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], language: "en", timeFormat: 24, units: "metric", 
	modules: [ 
	{
		module: "DublinBus",
		position: "top_left",
		header:  "Dublin Bus",
		config: {
			stops: [
					{ id: "195" },
					{ id: "21" },
					{ id: "5" },
			]
		}
	},
	{
		module: "Crypto",
		position: "bottom_left",
		header: "CryptoCurrency",
		config: {
			currency: ['bitcoin', 'bitcoin-cash','cardano','eos']//,'ethereum','iota','litecoin','neo','ripple','stellar']
		}
	},
	{
		module: "GoogleCalendar",
		position: "top_center",
		header: "Calendar",
		config: {
			url: "https://calendar.google.com/calendar/ical/fourthyearemail%40gmail.com/public/basic.ics",
		}
	},
	{
		module: "WeatherForecast",
		position: "top_right",
		config: {
			location: "Dublin",
			appid: "35074db805265bff7ff4288020f3b12d",
		}
	},
	{
		module: "News",
		position: "bottom_bar",
		config: {
			feeds: [
				{
					source: "RTE",
					url: "https://www.rte.ie/news/rss/news-headlines.xml",
				},
				{
					source: "New York Times",
					url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
				},
				{
					source: "Sky News",
					url: "http://feeds.skynews.com/feeds/rss/home.xml",
				},
			]
		}
	},
	{
		module: "Gmail",
		position: "bottom_right",
		header: "Gmail",
		config: {
			user: "fourthyearemail@gmail.com",
			password: "Tadcaster1",
		}
	},
	]
};

if(typeof module !== "undefined") {module.exports = config;}
