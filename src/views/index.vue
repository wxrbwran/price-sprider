<template>
  <div class="index">
    <div class="index-top">
      <div class="index-action">
        <Button @click="loadNewData">加载数据</Button>
        <Button @click="toggleHide">切换</Button>
        <Button @click="toggleModal">下载框</Button>
      </div>
      <div class="index-selections">
        <Select v-model="month" clearable style="width:75px" placeholder="月份" @on-change="handleChangeMonth">
          <Option v-for="(item, idx) in months" :value="item" :key="idx">{{ item }}月</Option>
        </Select>
        <Select v-model="season" clearable style="width:75px" placeholder="季次" @on-change="handleChangeSeason">
          <Option v-for="(item, idx) in seasons" :value="item" :key="idx">{{ item }}季</Option>
        </Select>
        <Select v-model="is_downloaded" clearable style="width:95px" placeholder="状态" @on-change="handleChangeStatus">
          <Option :value="0">未下载</Option>
          <Option :value="1">已下载</Option>
        </Select>
        <div class="index-search">
          <Input v-model="keyword" placeholder="搜索" @on-enter="handleSearchKeyword">
          <Button slot="append" icon="ios-search" @click="handleSearchKeyword"></Button>
          </Input>
        </div>
      </div>
      <div class="index-pager">
        <Page :total="total" :page-size="15" show-elevator @on-change="handleChangePage" />
      </div>
    </div>
    <div class="index-table">
      <Table border :columns="columns" :data="titles"></Table>
    </div>
    <Modal
      v-model="isShowModal"
      title="下载选项"
      ok-text="下载"
      @on-ok="downloadFile">
      <Form :label-width="80">
        <FormItem label="提示">
          <strong>需开启Proxyee-down</strong>
        </FormItem>
        <FormItem label="标题">
          <Input v-model="downloadTitle"></Input>
        </FormItem>
        <FormItem label="链接">
          <Input v-model="downloadLink"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
  import util from '../libs/util'
  import clipboard from "clipboard-polyfill"

  export default {
    data () {
      return {
        is_downloaded: null,
        year: null,
        years: [],
        month: null,
        months: [],
        season: null,
        seasons: [],
        keyword: null,
        isHidden: true,
        isShowModal: false,
        downloadTitle: null,
        downloadLink: '',
        page_at: 1,
        total: 0,
        columns: [
          {
            title: '序号',
            key: 'month',
            width: 60,
            render: (h, params) => {
              return h('span', (this.page_at - 1) * 15 + params.row._index)
            }
          },
          {
            title: '页面',
            key: 'page_title',
            width: 185,
            render: (h, params) => {
              return h('p', {
                style: {
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                },
                attrs: {
                  title: params.row.page_title
                }
              }, this.isHidden ? '***' : params.row.page_title)
            }
          },
          {
            title: '名字',
            key: 'title',
            render: (h, params) => {
              return h('h3', {
                style: {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  '-webkit-line-clamp': 2
                },
                attrs: {
                  title: params.row.title
                }
              }, this.isHidden ? '***' : params.row.title)
            }
          },
          {
            title: '链接',
            key: 'url',
            width: 75,
            render: (h, params) => {
              const self = this
              return h('a', {
                'class': 'clip_title',
                attrs: {
                  'data-clipboard-text': `${params.row.title}.zip`,
                  // href: `http://${params.row.url}`,
                  // target: '_blank'
                },
                on: {
                  click() {
                    self.writeClicpboard(`${params.row.title}.zip`, `http://${params.row.url}`)
                  },
                }
              }, '去下载')
            }
          },
          {
            title: '年',
            key: 'year',
            width: 75
          },
          {
            title: '月',
            key: 'month',
            width: 50
          },
          {
            title: '季',
            key: 'season',
            width: 60
          },
          {
            title: '操作',
            key: 'action',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('Checkbox', {
                props: {
                  'value': params.row.is_downloaded
                },
                on: {
                  'on-change': () => {
                    this.toggleStatus(params.row.id)
                  }
                }
              }, params.row.is_downloaded ? '已下载' : '未下载')
            }
          }
        ],
        titles: []
      }
    },
    mounted () {
      this.fetchSelectionParams()
    },
    methods: {
      async loadNewData () {
        const data = await util.ajax.post('91data/handleYYBF')
        if (typeof data === 'string') {
          this.$Message.info({
            content: data
          })
        } else {
          this.$Message.info({
            content: '数据加载成功'
          })
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      },
      toggleHide () {
        this.isHidden = !this.isHidden;
      },
      toggleModal () {
        this.isShowModal = !this.isShowModal;
      },
      writeClicpboard(text, url) {
        this.isShowModal = true
        this.downloadTitle = text
        clipboard.writeText(text);
        const win = window.open(url)
      },
      downloadFile () {
        util.ajax.post('91data/downloadFile', {
          "request": {
            "url": this.downloadLink,
          },
          "fileName": this.downloadTitle,
          "filePath": '/Volumes/src/Download/zip',
          "connections": 32,
          "unzipFlag": 0,
        }).then(res => {
          console.log(res)
          this.downloadLink = ''
          this.downloadTitle = ''
        }).catch(err => {
          console.log(err)
        })
        setTimeout(() => {
          this.isShowModal = false;
        }, 2000);
      },
      fetchSelectionParams (param = 'month') {
        util.ajax.get('91data/getSelectionParams', {
          params: { param }
        }).then(res => {
          console.log(res)
          const firstMonth = res[`${param}s`][0];
          this[`${param}s`] = res[`${param}s`]
          this[param] = firstMonth;
          this.handleChangeMonth(firstMonth)
        }).catch(e => {
          this.$Message.error({ content: e })
        })
      },
      handleChangeMonth (month) {
        // console.log(month);
        if (!!month) {
          util.ajax.get('91data/getDistinctSeasonByMonth', {
            params: { month }
          }).then(res => {
            console.log(res)
            this.seasons = res.seasons
            this.season = res.seasons[0]
            this.fetch91Data(1)
          }).catch(e => {
            this.$Message.error({ content: e })
          })
        } else {
          this.seasons = []
          this.season = null;
        }
      },
      handleChangeSeason (season) {
        this.season = season
        this.fetch91Data(1)
      },
      handleChangeStatus (is_downloaded) {
        // console.log(is_downloaded);
        this.is_downloaded = is_downloaded
        this.fetch91Data(1)
      },
      handleSearchKeyword () {
        this.fetch91Data();
      },
      fetch91Data (page_at) {
        this.loading();
        const { month, season, is_downloaded, keyword } = this
        const params = { month, season, keyword }
        const self = this
        // console.log(is_downloaded)
        // console.log(typeof is_downloaded)
        if (typeof is_downloaded === 'number') {
          params.is_downloaded = !!is_downloaded
        }
        util.ajax.get('91data/getAllTitles', {
          params: {
            page_size: 15,
            page_at,
            ...params
          }
        }).then(res => {
          this.titles = res.titles;
          this.total = res.total;
          this.page_at = page_at;
          this.$Message.destroy()
          // window.setTimeout(self.go2Clip, 2500)
        }).catch(e => {
          this.$Message.destroy()
          this.$Message.error({ content: e })
        })
      },
      handleChangePage (page_at) {
        this.fetch91Data(page_at)
      },
      toggleStatus (id) {
        const { titles } = this
        let status = null
        let tmp = null;
        for (const t of titles) {
          if (t.id === id) {
            status = !t.is_downloaded
            tmp = t
          }
        }
        util.ajax.post('91data/editTitleStatusById', {
          id, is_downloaded: status
        }).then(res => {
          // console.log(res)
          tmp.is_downloaded = status
          this.titles = titles
        }).catch(e => {
          this.$Message.error({ content: e })
        })
      },
      loading () {
        this.$Message.loading({
          content: '数据加载中...',
          duration: 0
        });
      },
    }
  }
</script>
<style scoped lang="scss">
  .index {
    width: 100%;
    min-width: 1024px;
    padding: 15px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    &-top{
      margin-bottom: 10px;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: space-between;
    }
    &-search{
      width: 150px;
      display: inline-block;
      vertical-align: middle;
    }
    &-table{
      margin-top: 10px;
    }
    &-pager{
      text-align: right;
      padding: 5px 0 ;
    }
    h1 {
      height: 150px;
      img {
        height: 100%;
      }
    }
    h2 {
      color: #666;
      margin-bottom: 200px;
      p {
        margin: 0 0 50px;
      }
    }
  }
  .index .ivu-row-flex {
    height: 100%;
  }
</style>
