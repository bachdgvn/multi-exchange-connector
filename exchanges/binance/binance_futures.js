import axios from "axios";
import BinanceConfig from './_config'
import {rename} from "./_helpers";

export class BinanceFutures {
    constructor() {
        this.config = new BinanceConfig('usdm')
        this.baseUrl = 'https://fapi.binance.com/fapi/v1/';
    }

    getExchangeServerTime() {
        return this.request('/time').then(res => res.serverTime)
    }

    getSymbols() {
        return this.request('/exchangeInfo').then(({symbols}) => {
            const usableSymbols = symbols.filter(item => {
                return item.symbol.includes('USDT')
            }).map(item => {
                return {
                    name: item.symbol,
                    description: item.baseAsset + '/' + item.quoteAsset,
                    ticker: item.symbol,
                    session: '24x7',
                    minmov: 1,
                    timezone: 'UTC',
                    has_intraday: true,
                    has_daily: true,
                    has_weekly_and_monthly: true,
                    currency_code: item.quoteAsset
                }
            })

            return usableSymbols
        })
    }

    async getSearchableSymbols() {
        const rawSymbols = await this.getSymbols()
        // console.log("rawSymbols", rawSymbols);
        const exchange = 'Binance';

        return rawSymbols.map((s) => {
            return {
                symbol: s.symbol,
                full_name: s.symbol,
                description: s.symbol,
                exchange: exchange,
                type: 'crypto',
            };
        })
    }

    // https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
    getKlines({symbol, interval, from, to}) {
        interval = this.config.intervals[interval] // set interval

        from *= 1000
        to *= 1000

        return this.request('/klines', {symbol: symbol.toUpperCase(), interval, startTime: from, endTime: to})
            .then(res => {
                return res.map(i => ({
                    time: parseFloat(i[0]),
                    open: parseFloat(i[1]),
                    high: parseFloat(i[2]),
                    low: parseFloat(i[3]),
                    close: parseFloat(i[4]),
                    volume: parseFloat(i[5]),
                }))
            })
    }

    subscribeKline({symbol, interval, uniqueID}, callback) {
        interval = this.config.intervals[interval] // set interval
        return this.config.stream_api['open'].kline({symbol, interval, uniqueID}, res => {
            // Rename options
            const data = rename(res)
            const candle = this.formatingKline(data.kline)
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
        return {
            time: openTime,
            open,
            high,
            low,
            close,
            volume,
        }
    }
}