var util = require('util');
var	Imap = require('imap');
var	MailParser = require('mailparser').MailParser;
var	EventEmitter = require('events').EventEmitter;
	
var numberOfEmails;

function Notifier(options){
	EventEmitter.call(this);
	var self = this;
	self.options = options;
	numberOfEmails = options.numberOfEmails;

	self.options.box = 'INBOX';
}

util.inherits(Notifier, EventEmitter);

module.exports = function (options){
	return new Notifier(options);
};


Notifier.prototype.start = function(){
	var self = this;
	self.imap = new Imap(self.options);
	self.imap.once('end', function(){
		self.emit('end');
		
	});
	
	self.imap.once('error', function(error){
		self.emit('error', error);
		
	});
	
	self.imap.once('ready', function(){
		self.imap.openBox(self.options.box, false, function(error,box){
			if(error){
				dbg('unable to open box : %s', error);
				self.emit('error', error);
				return;
			}
			self.scan();
			self.imap.on('mail', function(id){
				self.scan();
			});
		});
		
	});
	self.imap.connect();
	return this;
};

Notifier.prototype.scan = function(){
	var self = this;
	var search = ['UNSEEN'];
	
	self.imap.search(search, function(error, searchResults) {
		if(error) {
			self.emit('error', error);
			return;
		}
		
		searchResults = searchResults.slice(Math.max(searchResults.length - numberOfEmails, 1));
		
		var fetch = self.imap.fetch(searchResults, {
			bodies: ''
		});
		
		fetch.on('message', function(message){
			var mailParse = new MailParser();
			var seqNo = null;
			mailParse.once('end', function(mail){
				self.emit('mail', mail, seqNo);
			});
			
			message.once('body', function(stream, info){
				stream.pipe(mailParse);
				seqNo = info.seqno;
			});
			
		});
		fetch.once('end', function(){
		});
		
		fetch.once('error', function(error){
			self.emit('error', error);
		});
	});
	return this;
};

Notifier.prototype.stop = function(){
	if(this.imap.state !== 'disconnected'){
		this.imap.end();
	}
	return this;
};
