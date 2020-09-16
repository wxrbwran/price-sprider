<template>
  <div class="index">
    <div class="index-top">
      <div class="index-action">
        <Input placeholder="输入文件夹路径"></Input>
        <Button @click="toggleHide">处理</Button>
      </div>
      <div class="index-selections">
        <div class="index-search">
          <Input v-model="keyword" placeholder="搜索" @on-enter="handleSearchKeyword">
            <Button slot="append" icon="ios-search" @click="handleSearchKeyword"></Button>
          </Input>
        </div>
      </div>
      <div class="index-pager">
        <Page :total="total" :page-size="15" show-elevator @on-change="handleChangePage" />
        <Button @click="toggleHide">隐藏名字</Button>
      </div>
    </div>
    <div class="index-table">
      <Table border :columns="columns" :data="titles"></Table>
    </div>
  </div>
</template>
<script>
import util from '../libs/util';
import clipboard from 'clipboard-polyfill';

export default {
  data() {
    return {
      is_downloaded: null,
      keyword: null,
      isHidden: true,
      page_at: 1,
      total: 0,
      columns: [
        {
          title: '序号',
          key: 'month',
          width: 60,
          render: (h, params) => {
            return h('span', (this.page_at - 1) * 15 + params.row._index);
          },
        },
        {
          title: '页面',
          key: 'page_title',
          width: 185,
          render: (h, params) => {
            return h(
              'p',
              {
                style: {
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                },
                attrs: {
                  title: params.row.page_title,
                },
              },
              this.isHidden ? '***' : params.row.page_title,
            );
          },
        },
        {
          title: '名字',
          key: 'title',
          render: (h, params) => {
            return h(
              'h3',
              {
                style: {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  '-webkit-line-clamp': 2,
                },
                attrs: {
                  title: params.row.title,
                },
              },
              this.isHidden ? '***' : params.row.title,
            );
          },
        },
        {
          title: '链接',
          key: 'url',
          width: 75,
          render: (h, params) => {
            const self = this;
            return h(
              'a',
              {
                class: 'clip_title',
                attrs: {
                  'data-clipboard-text': `${params.row.title}.zip`,
                  // href: `http://${params.row.url}`,
                  // target: '_blank'
                },
                on: {
                  click() {
                    self.writeClicpboard(
                      `${params.row.title}.zip`,
                      `http://${params.row.url}`,
                    );
                  },
                },
              },
              '去下载',
            );
          },
        },
        {
          title: '年',
          key: 'year',
          width: 75,
        },
        {
          title: '月',
          key: 'month',
          width: 50,
        },
        {
          title: '季',
          key: 'season',
          width: 60,
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h(
              'Checkbox',
              {
                props: {
                  value: params.row.is_downloaded,
                },
                on: {
                  'on-change': () => {},
                },
              },
              params.row.is_downloaded ? '已下载' : '未下载',
            );
          },
        },
      ],
      titles: [],
    };
  },
  mounted() {},
  methods: {
    async loadNewData(e) {
      console.log(e);
    },
    toggleHide() {
      this.isHidden = !this.isHidden;
    },
    toggleModal() {
      this.isShowModal = !this.isShowModal;
    },
    writeClicpboard(text, url) {
      this.isShowModal = true;
      this.downloadTitle = text;
      clipboard.writeText(text);
      const win = window.open(url);
    },
    handleSearchKeyword() {
      this.fetchData();
    },
    fetchData(page_at) {},
    handleChangePage(page_at) {
      this.fetch91Data(page_at);
    },
    loading() {
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0,
      });
    },
  },
};
</script>
<style scoped>
.index {
  width: 100%;
  min-width: 1024px;
  padding: 15px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
}
.index h1 {
  height: 150px;
}
.index h1 img {
  height: 100%;
}
.index h2 {
  color: #666;
  margin-bottom: 200px;
}
.index h2 p {
  margin: 0 0 50px;
}
.index-top {
  margin-bottom: 10px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-between;
}
.index-action {
  display: flex;
}
.index-search {
  width: 150px;
  display: inline-block;
  vertical-align: middle;
}
.index-table {
  margin-top: 10px;
}
.index-pager {
  text-align: right;
  padding: 5px 0;
  display: flex;
}
.index .ivu-row-flex {
  height: 100%;
}
</style>
