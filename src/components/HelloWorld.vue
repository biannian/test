<template>
  <div>
    <a-layout>
      <a-layout-header class="header">
        <div class="header"> 面试题测试
          <a-button style="float: right;margin-top: 15px" type="primary" @click="logout"> logout
          </a-button>
        </div>

      </a-layout-header>
      <a-layout>
        <a-layout style="padding: 24px">
          <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: height }">
            <a-card :title="server['alias']" :key="index" style="width: 300px;float: left;margin: 5px"
                    v-for="(server,index) in servers">
              <template #extra><a href="#" @click="showMore(server['endpt'])">more</a></template>
              <p>服务唯一标签:{{server['endpt']}}</p>
              <p>服务所在主机地址{{server['host']}}</p>
              <p>初次连接时间{{resolveTime(server['reporttm'])}}</p>
              <p>最近连接时间{{resolveNewTime(server['endpt'])}}</p>
            </a-card>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
    <a-modal v-model:visible="showDetail" title="Detail" width="1000px" @ok="showDetail=false">
      <a-form layout="inline" v-if="refreshFlag">
        <a-form-item :label="item.name" :key="key" v-for="(item,key) in openServerDetail['params']">
          {{resolveForm(item)}}
        </a-form-item>
      </a-form>
<!--      <div id="service"></div>-->
    </a-modal>
  </div>

</template>

<script>
  import {message} from 'ant-design-vue';
  import api from "../api/api";
  import * as echarts from 'echarts'
  import {notification} from 'ant-design-vue';
  import dateFormat from "../utils/time";

  export default {
    name: 'HelloWorld',
    data() {
      return {
        ws_url: 'wss://localhost:9888',
        height: '',
        serverMap: new Map(),//存储数据
        servers: [],//服务数组
        openServerEndpt: '',//打开的服务名称
        openServerDetail: '',//打开的最新服务详情
        openServerDetails: '',//打开的历史服务详情
        showDetail: false,
        refreshFlag: true,
        echartData: [],
      }
    },
    watch: {},
    mounted() {
      this.height = (document.body.clientHeight - 164) + 'px'
      api.service().then(res => {
        if (res && res.data.code === 0) {
          message.success("loading services success")
          if (res.data.data && res.data.data.url) {
            this.initWS(res.data.data.url);
          }
        } else {
          message.error(res.data.msg)
        }
      })
    },
    methods: {
      initWS(url) {
        this.ws = new WebSocket(this.ws_url + url)
        this.ws.onopen = (res) => {
          message.success('服务地址' + url + '连接成功')
          console.log("onopen", res)
        }
        this.ws.onclose = (res) => {
          message.error('服务地址' + url + '连接关闭')
          console.log("onclose", res)
        }
        this.ws.onerror = (res) => {
          message.error('服务地址' + url + '连接出错')
          console.log("onerror", res)
        }
        this.ws.onmessage = (res) => {
          this.resolvePackage(JSON.parse(res.data));
        }

      },
      /**
       * 解析websocker包
       */
      resolvePackage(data) {
        if (this.serverMap.get(data.endpt)) {
          this.serverMap.get(data.endpt).push(data)
        } else {
          //尚未添加过的服务
          this.servers.push(data)
          let arr = [];
          arr.push(data)
          this.serverMap.set(data.endpt, arr);
        }
        console.log(this.serverMap)
        //触发监听
        this.servers.push("");
        this.servers.pop()
        this.refreshFlag = false;
        if (this.showDetail) {
          this.openServerDetails = this.serverMap.get(this.openServerEndpt);
          this.openServerDetail = this.openServerDetails[this.openServerDetails.length - 1]
        }
        this.refreshFlag = true
      },
      /**
       * 解析时间
       */
      resolveTime(date) {
        return dateFormat("YYYY-mm-dd HH:MM:SS ", new Date(date))
      },
      /**
       * 解析时间
       */
      resolveNewTime(endpt) {
        let arr = this.serverMap.get(endpt)
        if (arr.length !== 0) {
          let date = arr[arr.length - 1]['reporttm']
          return dateFormat("YYYY-mm-dd HH:MM:SS ", new Date(date))
        }
      },
      showMore(alias) {
        this.openServerEndpt = alias;
        this.showDetail = true;
        this.openServerDetails = this.serverMap.get(this.openServerEndpt);
        this.openServerDetail = this.openServerDetails[this.openServerDetails.length - 1]

      },
      resolveForm(item) {
        let objKey = Object.keys(item.Value);
        let returnStr = '';
        switch (objKey[0]) {
          case "U64":
            returnStr = Object.values(item.Value)[0]
            break;
          case "I64":
            returnStr = Object.values(item.Value)[0]
            break;
          case "U32":
            returnStr = Object.values(item.Value)[0]
            break;
          case "I32":
            returnStr = Object.values(item.Value)[0]
            break;
          case "F64":
            returnStr = Object.values(item.Value)[0]
            break;
          case "F32":
            returnStr = Object.values(item.Value)[0]
            break;
          case "BOL":
            returnStr = Object.values(item.Value)[0]
            break;
          case "Str":
            returnStr = Object.values(item.Value)[0]
            break;
        }
        returnStr += item.unit ? item.unit : ""
        return returnStr
      },

      initEcharts() {
        let chartDom = document.getElementById('service');
        let myChart = echarts.init(chartDom);

        let option = {
          title: {
            text: 'test'
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              params = params[0];
              var date = new Date(params.name);
              return (
                date.getDate() +
                '/' +
                (date.getMonth() + 1) +
                '/' +
                date.getFullYear() +
                ' : ' +
                params.value[1]
              );
            },
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: 'Fake Data',
              type: 'line',
              showSymbol: false,
              data: this.echartData
            }
          ]
        };

        option && myChart.setOption(option);
      },
      logout() {
        api.sign_out().then(res => {
          if (res && res.data.code === 0) {
            message.success("logout success")
            this.$router.push({path: '/'});
          } else {
            message.error(res.data.msg)
          }
        })
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    padding-left: 30px;
    color: white;
    font-size: 20px;
  }

  #service {
    height: 150px;
  }
</style>
