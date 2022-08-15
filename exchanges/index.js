import {BinanceFutures} from './binance/binance_futures'
import {FtxFutures} from './ftx/ftx_futures'
import {MexcFutures} from './mexc/mexc_futures'

const helpers = {
    'binance_futures': BinanceFutures,
    'ftx_futures': FtxFutures,
    'mexc_futures': MexcFutures,
}

export default helpers