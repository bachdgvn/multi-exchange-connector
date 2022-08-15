# multi-exchange-datafeeds

charting_library's datafeeds multi-exchange. This library will connect Binance, FTX, MEXC gets candlestick data and help you show the candles likes TradingView.

If you need to write code to provide data to display like TradingView. You don't need to write datafeeds for each crypto exchange anymore. This library is perfect because it solves every problem you need for a full-features datafeeds.

![Example](https://i.imgur.com/CPTOv0b.png)

## Install

```
npm i multi-exchange-datafeeds
```

## Usage

Example with Vuejs 2x

Firstly, import 'multi-exchange-datafeeds' into TVChartContainer.vue

```
import api from 'multi-exchange-datafeeds'
```

Then, set api as value for datafeed property

```
      const widgetOptions = {
        symbol: this.symbol,
        
        // add this
        datafeed: api[exchange],
        
        interval: '15',
        container: container,
        library_path: '/charting_library/',
        locale: getLanguageFromURL() || 'en',
        disabled_features: ['use_localstorage_for_settings'],
        enabled_features: ['study_templates'],
        charts_storage_url: 'https://saveload.thecryptobox.io',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_id',
        fullscreen: true,
        autosize: true,
        load_last_chart: true,
      };

      const tvWidget = new widget(widgetOptions);
```

with **exchange** is one of ['binance_futures', 'ftx_futures', 'mexc_futures']

Do the same if you want to use this library with Reactjs.

## Note
This library needs to come with TradingView's charting_library so you need to have charting_library first.
Check that you can view https://github.com/tradingview/charting_library/.
If you do not have access then you can request access to [this repository here](https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/).