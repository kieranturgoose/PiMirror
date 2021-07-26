
Module.register('Crypto', {
    defaults: {
        displayType: 'graphs',
    },
    
    graphId: {
        bitcoin: 1,
        'bitcoin-cash': 1831,
        cardano: 2010,
        eos: 1765,
        ethereum: 1027,
        iota: 1720,
        litecoin: 2,
        neo: 1376,
        ripple: 52,
        stellar: 512
    },
    
	result: {},

    start: function() {
        this.getTicker()
        this.scheduleUpdate()
        

    },

    getTicker: function() {
        var url = 'https://api.coinmarketcap.com/v1/ticker/?convert=EUR&limit=100'
        this.sendSocketNotification('get_ticker', url)
    },

    scheduleUpdate: function() {
        var self = this
        setInterval(function() {
            self.getTicker()
        }, 5 * 60 * 1000)
    },

    getDom: function() {
        if (this.config.displayType == 'graphs') {
            return this.buildGraphView()
        }
        var data = this.result

        var wrapper = document.createElement('table')
        wrapper.className = 'small'

        var tableHeader = document.createElement('tr')
        tableHeader.className = 'header'
	
        var tableHeaderNames = ['Currency', 'Price', '1Hour %', '24Hour %', '7Days %']
        for (var i = 0; i < tableHeaderNames.length; i++) {
            var tableHeading = document.createElement('td')
            tableHeading.style.marginLeft = '12px'
            tableHeading.style.marginRight = '12px'
            tableHeading.innerHTML = tableHeaderNames[i]
            tableHeader.appendChild(tableHeading)
        }
        wrapper.appendChild(tableHeader)

        for (i = 0; i < data.length; i++) {
            var crypto = data[i]
            var rowWrapper = document.createElement('tr')

            var columnValues = [
                crypto.name,
                "€" + crypto.price,
                crypto.percent_change_1h+'%',
                crypto.percent_change_24h+'%',
                crypto.percent_change_7d+'%',
            ]

            for (var j = 0; j < columnValues.length; j++) {
                var columnWrapper = document.createElement('td')
				columnWrapper.style.marginLeft = '12px'
				columnWrapper.style.marginRight = '12px'
                var currentValue = columnValues[j]
           
                if (currentValue.includes('%')) {
                    columnWrapper.style.color = this.colour(currentValue.slice(0,-1))
                }
                columnWrapper.innerHTML = currentValue
                rowWrapper.appendChild(columnWrapper)
            }
            wrapper.appendChild(rowWrapper)
        }
        return wrapper
    },

    //Creates the graph view type
    buildGraphView: function() {
		var data = this.result
		
        var wrapper = document.createElement('table')
        wrapper.className = 'medium'

        for (var i = 0; i < data.length; i++) {

            var rowWrapper = document.createElement('tr')
            var logoWrapper = document.createElement('td')

			var logo = new Image()
			logo.src = '/Crypto/coloured/' + data[i].id + '.png'
			logo.setAttribute('width', '40px')
			logo.setAttribute('height', '40px')
			logoWrapper.appendChild(logo)

            var priceWrapper = document.createElement('td')
            priceWrapper.style.fontSize = 'xx-large'
            priceWrapper.innerHTML = "€" + data[i].price
  			priceWrapper.style.marginRight = "12px" 
		
			var percentageWrapper = document.createElement('span')
			percentageWrapper.style.fontSize = "medium"
			
			var change_1h = document.createElement('change_1h')
			change_1h.style.marginLeft = '12px'
			change_1h.style.color = this.colour(data[i].percent_change_1h)
			change_1h.innerHTML = '1hr: ' + data[i].percent_change_1h + '%'
			change_1h.style.marginRight = '12px'

			var change_24h = document.createElement('change_24h')
			change_24h.style.color = this.colour(data[i].percent_change_24h)
			change_24h.innerHTML = '24hr: ' + data[i].percent_change_24h + '%'
			change_24h.style.marginRight = '12px'

			var change_7d = document.createElement('change_7d')
			change_7d.style.color = this.colour(data[i].percent_change_7d)
			change_7d.innerHTML = '7d: ' + data[i].percent_change_7d + '%'

			percentageWrapper.appendChild(change_1h)
			percentageWrapper.appendChild(change_24h)
			percentageWrapper.appendChild(change_7d)
			priceWrapper.appendChild(percentageWrapper)
            
            rowWrapper.appendChild(logoWrapper)
            rowWrapper.appendChild(priceWrapper)

			var graphWrapper = document.createElement('td')
			graphWrapper.className = 'graph'
			var graph = this.graphId[data[i].id]
			if (this.graphId[data[i].id]) {
				var graphImage = document.createElement('img')
				graphImage.src = 'https://s2.coinmarketcap.com/generated/sparklines/web/7d/usd/' + graph + '.png?cachePrevention=1'
				graphWrapper.appendChild(graphImage)
			}
			rowWrapper.appendChild(graphWrapper)

            wrapper.appendChild(rowWrapper)
        }

        return wrapper

    },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'got_result') {
            this.result = this.getCurrencies(this.config.currency, payload)
            this.updateDom()
        }
    },

    //Returns configured currencies
    getCurrencies: function(currency, data) {
        var currencies = []
        for (var i = 0; i < currency.length; i++) {
            for (var j = 0; j < data.length; j++) {
                var userCurrency = currency[i]
                var dataCurrency = data[j]
                if (userCurrency == dataCurrency.id) {
					dataCurrency['price'] = parseFloat(dataCurrency['price_eur']).toFixed(2)
                    currencies.push(dataCurrency)
                }
            }
        }
        return currencies
    },
    
    colour: function(change) {

        if (change < 0) {
            return 'Red'
        } else if (change > 0) {
            return 'Green'
        } else {
            return 'White'
        }
    },

})
