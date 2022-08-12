import {setupWebSocket, closeSocket} from './_utils'

class BinanceConfig {
    constructor(market) {
        this.market = market
        this.wsBaseEndpoints = {
          'spot': 'wss://stream.binance.com:9443/ws/',
          'margin': 'wss://stream.binance.com:9443/ws/',
          'isolatedMargin': 'wss://stream.binance.com:9443/ws/',
          'usdm': 'wss://fstream.binance.com/ws/',
          'usdmTestnet': 'wss://stream.binancefuture.com/ws/',
          'coinm': 'wss://dstream.binance.com/ws/',
          'coinmTestnet': 'wss://dstream.binancefuture.com/ws/',
          'options': 'wss://vstream.binance.com/ws/',
          'optionsTestnet': 'wss://testnetws.binanceops.com/ws/',
        };

        this.intervals = {
            '1': '1m',
            '3': '3m',
            '5': '5m',
            '15': '15m',
            '30': '30m',
            '60': '1h',
            '120': '2h',
            '240': '4h',
            '360': '6h',
            '480': '8h',
            '720': '12h',
            'D': '1d',
            '1D': '1d',
            '3D': '3d',
            'W': '1w',
            '1W': '1w',
            'M': '1M',
            '1M': '1M',
        }

        this.schema = {
            depth: ({ symbol, updateSpeed = 1000 }) => `${symbol.toLowerCase()}@depth@${updateSpeed}ms`, // updateSpeed: 100 or 1000
            depthLevel: ({ symbol, levels = 100, updateSpeed = 1000 }) => `${symbol.toLowerCase()}@depth${levels}@${updateSpeed}ms`,
            kline: ({ symbol, interval = '1h' }) => `${symbol.toLowerCase()}@kline_${interval}`,
            aggTrade: symbol => `${symbol.toLowerCase()}@aggTrade`,
            trade: symbol => `${symbol.toLowerCase()}@trade`,
            ticker: symbol => `${symbol.toLowerCase()}@ticker`,
            tickers: () => '!ticker@arr',
            miniTicker: symbol => `${symbol.toLowerCase()}@miniTicker`,
            miniTickers: () => '!miniTicker@arr',
            bookTicker: (symbol) => `${symbol.toLowerCase()}@bookTicker`, // Update Speed: Real-time
            bookTickers: () => `!bookTicker`, // Update Speed: Real-time
        }

        this.stream_api = {
            'open': this.build_api(),
            'close': this.buildCloseSocketApi(),
        }
    }

    build_api() {
        return Object.keys(this.schema).reduce((result, item) => {
            result[item] = (params, callback) => setupWebSocket({ url: this.wsBaseEndpoints[this.market], path: this.schema[item](params), ...params }, callback)
            return result
        }, {})
    }

    buildCloseSocketApi() {
        return Object.keys(this.schema).reduce((result, item) => {
            result[item] = (params) => {
                return (params && params.uniqueID) ? closeSocket(params.uniqueID) : closeSocket(this.schema[item](params))
            }
            return result
        }, {})
    }
}

export default BinanceConfig