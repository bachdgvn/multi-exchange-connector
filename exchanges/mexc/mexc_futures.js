import axios from "axios";
import MexcConfig from './_config'
import {rename} from "./_helpers";

export class MexcFutures {
    constructor() {
        this.config = new MexcConfig('usdm')
        this.baseUrl = 'https://contract.mexc.com/api/v1';
        this.exchange = 'Mexc';
        this.requestInterval = null;
    }

    getExchangeServerTime() {
        return new Promise((fulfill) => {
            fulfill(new Date().getTime())
        })
    }

    getSymbols() {
        return this.request('/contract/detail').then(res => res.data.map(item => {
            return {
                name: item.symbol,
                full_name: item.symbol,
                description: item.displayNameEn,
                exchange: this.exchange,
                type: 'crypto',
                ticker: item.symbol,
                session: '24x7',
                minmov: 1,
                timezone: 'UTC',
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: true,
                currency_code: item.quoteCoin,
                pricescale: 1 // it will not show number as float
            }
        }))
    }

    async getSearchableSymbols() {
        const rawSymbols = await this.getSymbols()

        return rawSymbols.map((s) => {
            return {
                symbol: s.symbol,
                full_name: s.symbol,
                description: s.displayNameEn,
                exchange: this.exchange,
                type: 'crypto',
            };
        })
    }

    // https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
    getKlines({symbol, interval, from, to}) {
        interval = this.config.intervals[interval] // set interval

        return this.request(`/contract/kline/${symbol.toUpperCase()}`, {interval, start: from, end: to})
            .then(({data}) => {
                const tmp = []
                data.time.forEach(function (value, i) {
                    tmp.push({
                        'time': value,
                        'open': data.open[i],
                        'close': data.close[i],
                        'high': data.high[i],
                        'low': data.low[i],
                        'volume': data.vol[i],
                    })
                });
                console.log('tmp:: ', tmp)

                return tmp.map(i => ({
                    time: parseFloat(i.time) * 1000,
                    open: parseFloat(i.open),
                    high: parseFloat(i.high),
                    low: parseFloat(i.low),
                    close: parseFloat(i.close),
                    volume: parseFloat(i.volume),
                }))
            })
    }

    subscribeKline({symbol, interval, uniqueID}, callback) {
        interval = this.config.intervals[interval] // set interval
        const send_data =  {
          "method": "sub.kline",
          "param": {
            "symbol": symbol,
            "interval": interval
          }
        }
        console.log('uniqueID:: ', uniqueID)

        return this.config.stream_api['open'].kline({symbol, interval, uniqueID, send_data}, ({msg, socket}) => {
            if (!msg || !msg['data'] || typeof (msg['data']) != 'object') {
                return
            }
            const data = rename(msg)
            const candle = this.formatingKline(data)
            const ping_msg = JSON.stringify({
              "method": "ping"
            })
            socket.send(ping_msg)
            callback(candle)
        })
    }

    unsubscribeKline(uniqueID) {
        return this.config.stream_api['close'].kline({uniqueID})
    }

    checkInterval(interval) {
        return !!this.config.intervals[interval]
    }

    request(url, params = {}) {
        return axios({
            baseURL: this.baseUrl,
            method: 'get',
            url,
            params
        })
            .then(res => res.data)
            .catch(res => console.log(res))
    }

    formatingKline({openTime, open, high, low, close, volume}) {
        const kline = {
            time: openTime * 1000,
            open,
            high,
            low,
            close,
            volume,
        }
        return kline;
    }
}