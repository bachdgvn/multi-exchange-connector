/**
 * Creating a mock of the datafeed
 * Tutorial: https://github.com/tradingview/charting_library/wiki/JS-Api
 * Full implementation: https://github.com/tradingview/charting-library-tutorial/blob/master/src/datafeed.js
 */
import exchanges from "./exchanges";

const configurationData = {
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    supported_resolutions: [
        // '1', '3', '5', '15', '30', '60', '120', '240', '1D', '3D', '1W', '1M'
        '1', '5', '15', '30', '60', '120', '240', '1D'
    ]
};

function getConfigurationCallback(exchange_market) {
	const client = new exchanges[exchange_market]()

    return {
        // get a configuration of your datafeed (e.g. supported resolutions, exchanges and so on)
        onReady: (callback) => {
            // console.log('[onReady]: Method call');
            setTimeout(() => callback(configurationData)) // callback must be called asynchronously.
        },
        /*
         // NO need if not using search
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
            console.log('[searchSymbols]: Method call');
        },
         */
        searchSymbols: async (
            userInput,
            exchange,
            symbolType,
            onResultReadyCallback,
        ) => {
            // console.log('[searchSymbols]: Method call');
            const symbols = await client.getSearchableSymbols();

            const newSymbols = symbols.filter(symbol => {
                const isFullSymbolContainsInput = symbol['symbol']
                    .toLowerCase()
                    .indexOf(userInput.toLowerCase()) !== -1;
                return isFullSymbolContainsInput;
            });
            onResultReadyCallback(newSymbols);
        },
        // retrieve information about a specific symbol (exchange, price scale, full symbol etc.)
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            // console.log('[resolveSymbol]: Method call', symbolName);

            const comps = symbolName.split(':')
            symbolName = (comps.length > 1 ? comps[1] : symbolName).toUpperCase()

            // Get symbols
            client.getSymbols().then(symbols => {
                const symbol = symbols.find(i => i.name == symbolName)
                return symbol ? onSymbolResolvedCallback(symbol) : onResolveErrorCallback('[resolveSymbol]: symbol not found')
            })
        },
        // get historical data for the symbol
        // https://github.com/tradingview/charting_library/wiki/JS-Api#getbarssymbolinfo-resolution-periodparams-onhistorycallback-onerrorcallback
        getBars: async (symbolInfo, interval, periodParams, onHistoryCallback, onErrorCallback) => {
            console.log('[getBars] Method call', symbolInfo, interval)

            if (!client.checkInterval(interval)) {
                return onErrorCallback('[getBars] Invalid interval')
            }

            const klines = await client.getKlines({
                symbol: symbolInfo.name,
                interval,
                from: periodParams.from,
                to: periodParams.to
            })
            // console.log(klines)
            if (klines.length > 0) {
                return onHistoryCallback(klines)
            }

            onErrorCallback('Klines data error')

        },
        // subscription to real-time updates
        // subscribeBars: (symbolInfo, interval, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        // eslint-disable-next-line no-unused-vars
        subscribeBars: (symbolInfo, interval, onRealtimeCallback, subscribeUID) => {
            client.subscribeKline({symbol: symbolInfo.name, interval, subscribeUID}, cb => onRealtimeCallback(cb))
        },
        // eslint-disable-next-line no-unused-vars
        unsubscribeBars: (subscribeUID) => {
            client.unsubscribeKline(subscribeUID)
        },
        getServerTime: (callback) => {
            client.getExchangeServerTime().then(time => {
                callback(Math.floor(time / 1000))
            }).catch(err => {
                console.error(err)
            })
        }
    }
}

const api = {
    'binance_futures': getConfigurationCallback('binance_futures'),
    'ftx_futures': getConfigurationCallback('ftx_futures'),
    'mexc_futures': getConfigurationCallback('mexc_futures'),
}

export default api
