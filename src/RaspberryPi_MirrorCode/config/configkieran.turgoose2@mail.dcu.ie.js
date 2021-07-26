var config = {
	address: "localhost" , port: 8080, ipWhiteList: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], language: "en", timeFormat: 24, units: "metric", 
	modules: [ 
	
	{
		module: 'Clock',
		position: 'top_right',
	},
	
	{
		module: "ForecastWeather",
		position: "top_right",
		config: {
			location: "Dublin, Ireland",
			appid: "35074db805265bff7ff4288020f3b12d"
		}
	},
	
	{
		module: "Crypto",
		position: "bottom_right",
		config: {
			currency: ['bitcoin', 'bitcoin-cash','cardano','eos','ethereum','iota','litecoin','neo','ripple','stellar'],
		}
	},
	
	{
		module: "NewsHeadlines",
		position: "bottom_center",
		config: {
			feeds: [
				{
					title: "New York Times",
					url: "http://www.nytimes.com/services/xml/rss/nyt/HomePage.xml",
				},
			]
		}
	},
	
	{
		module: "Gmail",
		position: "top_left",
		config: {
			accounts: [
				{
					user: "kieranturgoose@gmail.com",
					password: "biffyclyro",
					host: "imap.gmail.com",
					port: 993,
					tls: true,
					authTimeout: 10000,
					numberOfEmails: 5,
				},
			],
			maxCharacters: 50,
		}
	},
	
	{
		module: "calendar",
		position: "bottom_left",
		config: {
			calendars: [
				{
					url: 'https://calendar.google.com/calendar/ical/fourthyearemail%40gmail.com/public/basic.ics',
				},
			],
		}
	},	
	
	/*
	{ 
		module: "DublinBus",
		position: "bottom_left",
		header: "Bus & Rail",
		config: { colored: true,
					stops: [{ id: "270"},
							{ id: "195"},
							{ id: "22"}]
		}
    },*/
	]
};

if(typeof module !== "undefined") {module.exports = config;}
