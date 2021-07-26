Module.register("Gmail",{
	
	defaults:{
		host: "imap.gmail.com",
		port: 993,
		tls: true,
		authTimeout: 10000,
		numberOfEmails: 5,
		maxCharacters: 50,
	},
	
	payload: [],

    start : function(){
        this.sendSocketNotification('LISTEN_FOR_EMAIL',{config: this.config, payload: this.payload, loaded: this.loaded});
        this.loaded = false;
    },

    socketNotificationReceived: function(notification, payload){
        if (notification === 'EMAIL_RESPONSE'){
            if(payload){
                this.loaded = true;
                var self = this;
                console.log("NEW PAYLOAD: ", payload);
                payload.forEach(function(m){
                    if(self.payload.indexOf(m.id) == -1)
                        self.payload.push(m);
                });

                this.payload.sort(function(a,b) {
					return b.id - a.id; 
				});

                this.sendSocketNotification('LISTEN_FOR_EMAIL',{config: this.config, payload: this.payload, loaded: this.loaded});
                this.updateDom(2000);
            }
        }
    },


    getDom: function(){
        var wrapper = document.createElement("div");
        wrapper.className = "small";
        var self = this;
        if(this.payload.length > 0)
        {
			var indexToRemove = [];
			var maxNumEmails = this.config.numberOfEmails;
			var count = 0;
			for (var j = 0; j < this.payload.length; j++) {
				if (this.payload[j].host === this.config.user) {
					count++;
				}
				if (count > maxNumEmails) {
					indexToRemove.push(j);
				}
			}
			for (var j = 0; j < this.payload.length; j++) {
				if (indexToRemove.indexOf(j) > -1) {
					delete this.payload[j];
				}
			}

			this.payload.forEach(function (mailObj) {
				var host = mailObj.host.slice(0,1) + '@' + mailObj.host.substr(mailObj.host.indexOf('@') + 1)[0];

				var name = mailObj.sender[0].name;

				var subject = mailObj.subject;
				subject = subject.substring(0, self.config.maxCharacters);
				
				var address = mailObj.sender[0].address;

				var emailWrapper = document.createElement("div");
				
				var nameWrapper = document.createElement("span");
				nameWrapper.className = "small bright";
				nameWrapper.innerHTML = name + "&nbsp;&nbsp;&nbsp;&nbsp;";
				emailWrapper.appendChild(nameWrapper);
				
				var addressWrapper = document.createElement("span");
				addressWrapper.className = "address thin dimmed";
				addressWrapper.innerHTML = address;
				emailWrapper.appendChild(addressWrapper);

				var subjectWrapper = document.createElement("div");
				subjectWrapper.className = "small bold bright";
				subjectWrapper.innerHTML = subject;
				emailWrapper.appendChild(subjectWrapper);
				
				wrapper.appendChild(emailWrapper);
			});

        }
        else{
            wrapper.innerHTML = "NO MAIL";
            return wrapper;
        }

        return wrapper;
    }
});
