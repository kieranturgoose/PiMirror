Module.register("News", {
	start: function() {
		Log.info("Starting module: " + this.name);
		
		moment.locale(config.language);
		this.newsItems = [];

		this.loaded = false;
		this.activeItem = 0;
		this.scrollPosition = 0;
		
		for(var f in this.config.feeds){
			var feed = this.config.feeds[f];
			this.sendSocketNotification("ADD_FEED", {
				feed: feed,
				config: this.config
			});
		}	
	},

	socketNotificationReceived: function(notification, payload){
		if(notification === "NEWS_ITEMS"){
			var newsItems = [];
			for (var feed in payload) {
				var feedItems = payload[feed];
				for (var i in feedItems) {
					var feedItem = feedItems[i];
					feedItem.sourceTitle = this.getSource(feed);
					newsItems.push(feedItem);
				}
			}
			newsItems.sort(function(a,b) {
				var dateA = new Date(a.pubdate);
				var dateB = new Date(b.pubdate);
				return dateB - dateA;
			});
			
			this.newsItems = newsItems;
			
			if(!this.loaded){
				this.updateInterval();
			}
			this.loaded = true;
		}
	},
	
	getSource: function(feedUrl){
		for(var f in this.config.feeds){
			var feed = this.config.feeds[f];
			if(feed.url === feedUrl){
				return feed.source;
			}
		}
		return "";
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		
		//Reset the activeItem
		if(this.activeItem >= this.newsItems.length){
			this.activeItem = 0;
		}
		
		//If there's content to be shown
		if(this.newsItems.length > 0){
			
			//Get the news source and the time published
			var source = document.createElement("div");
			source.className = "light medium";
			source.innerHTML = this.newsItems[this.activeItem].sourceTitle + ", "; 
			
			var time = document.createElement("span");
			time.className = "light small dimmed";
			time.innerHTML = moment(new Date(this.newsItems[this.activeItem].pubdate)).fromNow() + ":";
			source.appendChild(time);
 
			wrapper.appendChild(source);
			
			//Get the headline for the news story
			var headline = document.createElement("div");
			headline.className = "bright light";
			headline.innerHTML = this.newsItems[this.activeItem].title;
			wrapper.appendChild(headline);
		}
		else{
			wrapper.innerHTML = this.translate("There are no headlines available from your sources. Please check their documentation");
			wrapper.className = "small dimmed";
		}
		
		return wrapper;
	},

	updateInterval: function(){
		var self = this;
		self.updateDom(2000);
		
		timer = setInterval(function() {
			self.activeItem++;
			self.updateDom(2000);
		}, 10*1000);
	},
	
	getScripts: function() {
		return ["moment.js"];
	},
});
