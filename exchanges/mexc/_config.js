import {closeSocket, setupWebSocket} from "../utils";

class MexcConfig {
    constructor(market) {
        this.market = market
        this.wsBaseEndpoints = {
          'usdm': 'wss://contract.mexc.com/ws',
        };

        this.intervals = {
            '1': 'Min1',
            '5': 'Min5',
            '15': 'Min15',
            '30': 'Min30',
            '60': 'Min60',
            '120': 'Min60',
            '240': 'Hour4',
            '480': 'Hour8',
            'D': 'Day1',
            '1D': 'Day1',
            '3D': 'Day1',
            'W': 'Week1',
            '1W': 'Week1',
            'M': 'Month1',
            '1M': 'Month1',
        }

        this.schema = {
            kline: ({ symbol, interval = '1h' }) => `${symbol.toLowerCase()}@kline_${interval}`,
        }

        this.stream_api = {
            'open': this.build_api(),
            'close': this.buildCloseSocketApi(),
        }
    }

    build_api() {
        return Object.keys(this.schema).reduce((result, item) => {
            result[item] = (params, callback) => setupWebSocket({ url: this.wsBaseEndpoints[this.market], path: '', ...params }, callback)
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

export default MexcConfig