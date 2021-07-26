var config = {
	address: "localhost" , port: 8080, ipWhiteList: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], language: "en", timeFormat: 24, units: "metric", 
	modules: [ 
	{
		module: "Gmail",
		position: "top_left",
		header: "Gmail",
		config: {
			user: "kieranturgoose@gmail.com",
			password: "biffyclyro",
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
		module: "DublinBus",
		position: "bottom_left",
		header:  "Dublin Bus",
		config: {
			stops: [
					{ id: "195" },
			]
		}
	},
	{
		module: "News",
		position: "bottom_bar",
		config: {
			feeds: [
				{
					source: "Sky News",
					url: "http://feeds.skynews.com/feeds/rss/home.xml",
				},
			]
		}
	},
	]
};

if(typeof module !== "undefined") {module.exports = config;}
