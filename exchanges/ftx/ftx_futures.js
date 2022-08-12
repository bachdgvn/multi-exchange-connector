import axios from "axios";
import FtxConfig from './_config'

export class FtxFutures {
    constructor() {
        this.config = new FtxConfig()
        this.baseUrl = 'https://ftx.com/api';
        this.exchange = 'Ftx';
        this.requestInterval = null;
    }

    getExchangeServerTime() {
        return new Promise((fulfill) => {
            fulfill(new Date().getTime())
        })
    }

    getSymbols() {
        return this.request('/futures').then(res => res.result.map(item => {
            return {
                name: item.name,
                full_name: item.name,
                description: item.description,
                exchange: this.exchange,
                type: 'crypto',
                ticker: item.name,
                session: '24x7',
                minmov: 1,
                timezone: 'UTC',
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: true,
                currency_code: 'USDT'
            }
        }))
    }

    async getSearchableSymbols() {
        const rawSymbols = await this.getSymbols()

        return rawSymbols.map((s) => {
            return {
                symbol: s.name,
                full_name: s.name,
                description: s.description,
                exchange: this.exchange,
                type: 'crypto',
            };
        })
    }

    // https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
    getKlines({symbol, interval, from, to}) {
        const resolution = this.config.intervals[interval] // set interval

        return this.request(`/markets/${symbol.toUpperCase()}/candles`, {resolution, start_time: from, end_time: to})
            .then(({result}) => {
                return result.map(i => ({
                    time: parseFloat(i.time),
                    open: parseFloat(i.open),
                    high: parseFloat(i.high),
                    low: parseFloat(i.low),
                    close: parseFloat(i.close),
                    volume: parseFloat(i.volume),
                }))
            })
    }

    subscribeKline({symbol, interval, subscribeUID}, callback) {
        console.log('subscribeKline:: ', subscribeUID)
        const resolution = this.config.intervals[interval] // set interval
        if (this.requestInterval) {
            clearInterval(this.requestInterval)
        }
        this.requestInterval = setInterval(() => {
            this.request(`/markets/${symbol.toUpperCase()}/candles/last`, {resolution})
                .then(({result}) => {
                    const newBar = {
                        time: parseFloat(result.time),
                        open: parseFloat(result.open),
                        high: parseFloat(result.high),
                        low: parseFloat(result.low),
                        close: parseFloat(result.close),
                        volume: parseFloat(result.volume),
                    }
                    console.log('newBar:: ', newBar)
                    callback(newBar)
                })
        }, 500)
    }

    unsubscribeKline(subscribeUID) {
        console.log('unsubscribeKline:: ', subscribeUID)
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
}