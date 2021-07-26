var notifier = require('./notifications');
var NodeHelper = require('node_helper');
var underscore = require('underscore');

module.exports = NodeHelper.create({
        start: function(){
            console.log(this.name + ' helper started ...');
        },
        socketNotificationReceived : function(notification, payload){
            if(notification === 'LISTEN_FOR_EMAIL'){
                console.log('listening for new emails..');
                this.config = payload.config;
                this.payload = payload.payload;
                this.loaded = payload.loaded;


                var self = this;
				final = [];
				imap = {
					user: this.config.user,
					password: this.config.password,
					host: this.config.host,
					port: this.config.port,
					tls: this.config.tls,
					authTimeout: this.config.authTimeout,
					numberOfEmails: this.config.numberOfEmails
				};

				var seqs = [];
				if (this.payload.length > 0)
					this.payload.forEach(function (o) {
						seqs.push(o.id);
					});

				var notify = notifier(imap);
				
				notify.on('mail', function (mail, id) {
					if (seqs.indexOf(id) == -1) {
						console.log('NEW MAIL');
						var sender = [{
							address: mail.from[0].address,
							name: mail.from[0].name
						}];
						var tmp = {
							sender: sender,
							subject: mail.subject,
							id: id,
							host: mail.to[0].address
						};
						final.push(tmp);
						notify.stop();
					}
				})
				
				notify.on('end', function () { // session closed
					final = underscore.sortBy(final, 'id').reverse();
					final = underscore.uniq(final, true, 'id');
					self.sendSocketNotification('EMAIL_RESPONSE', final);
					notify.stop();
				})
				
				notify.on('error', function (e) {
					console.log('Email notifier error: ', e);
					notify.start();
				})
				
				notify.start();
            }
        }
});

