<template>
  <div class="report-container">
    <div id="myChart" :style="{width: '100%', height: '500px'}"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import settings from '@/settings'
export default {
    name: 'report',
    data() {
        return {}
    },
    components: {},
    created() {},
    mounted: function () {
        this.drawLine()
    },
    methods: {
        drawLine() {
            var myChart = echarts.init(document.getElementById('myChart'))
            myChart.setOption({
                title: {
                    text: 'DEMO',
                },
                tooltip: {},
                xAxis: {
                    data: [
                        '衬衫',
                        '羊毛衫',
                        '雪纺衫',
                        '裤子',
                        '高跟鞋',
                        '袜子',
                    ],
                },
                yAxis: {},
                series: [
                    {
                        name: '销量',
                        type: 'bar',
                        data: [5, 20, 36, 10, 10, 20],
                    },
                ],
            })
        },
    },
}
</script>

<style lang="stylus" scoped></style>