<template>
  <div id="app">
    <div style="height: 50px; display: flex; flex-direction: row; align-items: center;">
      <select v-model="currentExchange">
        <option v-for="option in exchanges" v-bind:value="option.value" :key="option.value">
          {{ option.text }}
        </option>
      </select>
      <select v-model="currentSymbol" style="margin-left: 20px;">
        <option v-for="option in symbols" v-bind:value="option.value" :key="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <TVChartContainer :symbol="currentSymbol" :exchange="currentExchange"/>
  </div>
</template>

<script>
import TVChartContainer from '@/components/chart-container/TVChartContainer.vue'

export default {
  name: 'App',
  components: {
    TVChartContainer
  },

  data() {
    return {
      // currentSymbol: 'BTCUSDT',
      // currentExchange: 'binance_futures',
      // currentSymbol: 'BTC-PERP',
      // currentExchange: 'ftx_futures',
      currentSymbol: 'BTC_USDT',
      currentExchange: 'mexc_futures',
      exchanges: [
        {
          value: 'binance_futures',
          text: 'Binance Futures'
        },
        {
          value: 'ftx_futures',
          text: 'FTX Futures'
        },
        {
          value: 'mexc_futures',
          text: 'MEXC Futures'
        },
      ]
    }
  },

  watch: {
    currentExchange: {
      handler() {
        this.currentSymbol = this.symbols[0].value
      }
    }
  },

  computed: {
    symbols() {
      if (this.currentExchange.includes('binance')) {
        return [
          {
            value: 'BTCUSDT',
            text: 'BTCUSDT'
          },
          {
            value: 'ADAUSDT',
            text: 'ADAUSDT'
          },
        ]
      }
      else if (this.currentExchange.includes('ftx')) {
        return [
          {
            value: 'BTC-PERP',
            text: 'BTC-PERP'
          },
          {
            value: 'ADA-PERP',
            text: 'ADA-PERP'
          },
        ]
      }
      else {
        return [
          {
            value: 'BTC_USDT',
            text: 'BTC_USDT'
          },
          {
            value: 'ADA_USDT',
            text: 'ADA_USDT'
          },
        ]
      }
    }
  }
}
</script>

