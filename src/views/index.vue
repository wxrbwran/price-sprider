<template>
  <div class="index">
    <div class="index-top">
      <div class="index-action">
        <Input v-model="path" placeholder="输入文件夹路径"></Input>
        <Button @click="loadNewData">处理</Button>
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
      path: '',
      keyword: null,
      isHidden: false,
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
          title: '名字',
          key: 'filename',
          // width: 200,
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
                  title: params.row.filename,
                },
              },
              this.isHidden ? '***' : params.row.filename,
            );
          },
        },
        {
          title: '地址',
          key: 'filendir',
          // width: 200,
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
                on: {},
              },
              params.row.filedir,
            );
          },
        },
        {
          title: '宽度',
          key: 'width',
          width: 100,
        },
        {
          title: '高度',
          key: 'height',
          width: 100,
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
                  'on-change': () => {
                    this.handleDelete([params.row.filedir]);
                  },
                },
              },
              '删除',
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
      const res = await util.ajax.post('/video/check', {
        path: this.path,
      });
      console.log('res', res);
      this.titles = res.list;
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
    handleDelete(dirs) {
      console.log(dirs);
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
