<template>
  <div class="TVChartContainer" ref="chartContainer"/>
</template>

<script>
import api from 'multi-exchange-datafeeds'
import {widget} from '../../../public/charting_library';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export default {
  name: 'TVChartContainer',
  tvWidget: null,

  props: {
    symbol: {
      type: String,
    },
    exchange: {
      type: String,
    },
  },

  data() {
    return {}
  },

  watch: {
    symbol: {
      handler() {
        setTimeout(() => {
          this.generateChart();
        })
      },
      immediate: true,
    },
    exchange: {
      handler() {
        setTimeout(() => {
          this.generateChart();
        })
      },
      immediate: true,
    },
  },

  methods: {
    generateChart() {
      const container = this.$refs.chartContainer;

      const widgetOptions = {
        symbol: this.symbol,
        datafeed: api[this.exchange],
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
      this.tvWidget = tvWidget;
      tvWidget.onChartReady(() => {
      });
    }
  },

  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }
}
</script>

<style scoped>
.TVChartContainer {
  height: calc(100vh - 80px);
}
</style>