<script setup>
import { computed, ref } from "vue";

const marketType = ref("stock");
const activeTab = ref("overview");
const searchKeyword = ref("");
const orderMarket = ref("stock");
const orderSymbol = ref("");
const orderSide = ref("buy");
const orderType = ref("limit");
const orderQuantity = ref(1);
const orderPrice = ref("");
const watchlist = ref(["600519", "IF2406"]);
const updateTime = ref(new Date().toLocaleString("zh-CN"));

const stockData = ref([
  { symbol: "600519", name: "贵州茅台", price: 1678.5, changePct: 1.82, turnover: "26.4亿" },
  { symbol: "000858", name: "五粮液", price: 146.2, changePct: -0.96, turnover: "13.8亿" },
  { symbol: "601318", name: "中国平安", price: 42.61, changePct: 0.51, turnover: "9.7亿" },
  { symbol: "300750", name: "宁德时代", price: 188.92, changePct: 2.14, turnover: "22.1亿" },
]);

const futuresData = ref([
  { symbol: "IF2406", name: "沪深300股指", price: 3624.8, changePct: 0.38, volume: "12.2万手" },
  { symbol: "IH2406", name: "上证50股指", price: 2482.6, changePct: -0.22, volume: "5.8万手" },
  { symbol: "AU2408", name: "沪金主力", price: 562.1, changePct: 1.31, volume: "31.4万手" },
  { symbol: "CU2407", name: "沪铜主力", price: 72840, changePct: -0.47, volume: "19.5万手" },
]);

const indexCards = computed(() => [
  { label: "上证指数", value: "3,091.82", changePct: 0.73 },
  { label: "深证成指", value: "9,511.13", changePct: -0.12 },
  { label: "沪深300", value: "3,624.80", changePct: 0.38 },
  { label: "IF 主力", value: "3,624.80", changePct: 0.38 },
]);

const tableData = computed(() => {
  const source = marketType.value === "stock" ? stockData.value : futuresData.value;
  if (!searchKeyword.value.trim()) return source;
  return source.filter((item) => `${item.symbol}${item.name}`.includes(searchKeyword.value.trim()));
});

const externalLinks = [
  { label: "东方财富", url: "https://www.eastmoney.com" },
  { label: "新浪财经", url: "https://finance.sina.com.cn" },
  { label: "同花顺期货", url: "https://stock.10jqka.com.cn" },
  { label: "上期所公告", url: "https://www.shfe.com.cn" },
];

const orderHistory = ref([]);

const formatChangeClass = (value) => (value >= 0 ? "text-success" : "text-danger");

const toFixedPrice = (value) => {
  if (typeof value !== "number") return value;
  return value >= 1000 ? value.toFixed(1) : value.toFixed(2);
};

const refreshQuotes = () => {
  const mutate = (arr) =>
    arr.map((item) => {
      const drift = (Math.random() - 0.5) * 0.015;
      const nextPrice = Number((item.price * (1 + drift)).toFixed(item.price > 1000 ? 1 : 2));
      return {
        ...item,
        price: nextPrice,
        changePct: Number((item.changePct + drift * 100).toFixed(2)),
      };
    });

  stockData.value = mutate(stockData.value);
  futuresData.value = mutate(futuresData.value);
  updateTime.value = new Date().toLocaleString("zh-CN");
};

const addToWatchlist = (symbol) => {
  if (!watchlist.value.includes(symbol)) watchlist.value.unshift(symbol);
};

const fillOrder = (row, side) => {
  orderMarket.value = marketType.value;
  orderSymbol.value = row.symbol;
  orderSide.value = side;
  orderType.value = "limit";
  orderPrice.value = row.price;
  orderQuantity.value = 1;
  activeTab.value = "trade";
};

const submitOrder = () => {
  if (!orderSymbol.value) return;
  const entry = {
    id: `${Date.now()}`,
    market: orderMarket.value === "stock" ? "股票" : "期货",
    symbol: orderSymbol.value,
    side: orderSide.value === "buy" ? "买入" : "卖出",
    type: orderType.value === "market" ? "市价" : "限价",
    quantity: Number(orderQuantity.value),
    price: orderType.value === "market" ? "市价成交" : orderPrice.value || "-",
    time: new Date().toLocaleTimeString("zh-CN"),
    status: "已提交",
  };
  orderHistory.value.unshift(entry);
  addToWatchlist(orderSymbol.value);
};
</script>

<template>
  <div class="market-page bg-gray-200 min-vh-100">
    <div class="container py-4">
      <div class="card shadow-lg border-0 mb-4">
        <div class="card-body p-4">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h3 class="mb-1">期货 / 股票行情交易面板</h3>
              <p class="text-sm text-muted mb-0">实时模拟数据 · 最近更新时间：{{ updateTime }}</p>
            </div>
            <div class="d-flex flex-wrap align-items-center gap-2">
              <button
                class="btn btn-sm mb-0"
                :class="marketType === 'stock' ? 'bg-gradient-success' : 'btn-outline-success'"
                @click="marketType = 'stock'"
              >
                股票
              </button>
              <button
                class="btn btn-sm mb-0"
                :class="marketType === 'futures' ? 'bg-gradient-dark' : 'btn-outline-dark'"
                @click="marketType = 'futures'"
              >
                期货
              </button>
              <button class="btn btn-sm bg-gradient-info mb-0" @click="refreshQuotes">
                刷新行情
              </button>
            </div>
          </div>
          <div class="d-flex flex-wrap gap-2 mt-3">
            <a
              v-for="item in externalLinks"
              :key="item.url"
              :href="item.url"
              target="_blank"
              rel="noreferrer"
              class="btn btn-sm btn-outline-secondary mb-0"
            >
              {{ item.label }}
            </a>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-4">
        <div v-for="card in indexCards" :key="card.label" class="col-12 col-md-6 col-xl-3">
          <div class="card shadow-sm h-100 border-0">
            <div class="card-body">
              <p class="text-sm text-secondary mb-1">{{ card.label }}</p>
              <h5 class="mb-1">{{ card.value }}</h5>
              <p class="text-sm mb-0" :class="formatChangeClass(card.changePct)">
                {{ card.changePct >= 0 ? "+" : "" }}{{ card.changePct }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white p-3 pb-0 border-0">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <ul class="nav nav-pills">
              <li class="nav-item">
                <button
                  class="nav-link mb-0"
                  :class="activeTab === 'overview' ? 'active' : ''"
                  @click="activeTab = 'overview'"
                >
                  行情总览
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link mb-0"
                  :class="activeTab === 'trade' ? 'active' : ''"
                  @click="activeTab = 'trade'"
                >
                  下单操作
                </button>
              </li>
              <li class="nav-item">
                <button
                  class="nav-link mb-0"
                  :class="activeTab === 'watch' ? 'active' : ''"
                  @click="activeTab = 'watch'"
                >
                  自选与委托
                </button>
              </li>
            </ul>
            <div class="input-group input-group-outline w-auto">
              <label class="form-label">搜索代码/名称</label>
              <input v-model="searchKeyword" type="text" class="form-control px-3" />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'overview'" class="card-body">
          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">代码</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">名称</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">最新价</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">涨跌幅</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                    {{ marketType === "stock" ? "成交额" : "成交量" }}
                  </th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 text-end">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in tableData" :key="row.symbol">
                  <td><p class="text-sm font-weight-bold mb-0">{{ row.symbol }}</p></td>
                  <td><p class="text-sm mb-0">{{ row.name }}</p></td>
                  <td><p class="text-sm mb-0">{{ toFixedPrice(row.price) }}</p></td>
                  <td>
                    <p class="text-sm font-weight-bold mb-0" :class="formatChangeClass(row.changePct)">
                      {{ row.changePct >= 0 ? "+" : "" }}{{ row.changePct }}%
                    </p>
                  </td>
                  <td>
                    <p class="text-sm mb-0">
                      {{ marketType === "stock" ? row.turnover : row.volume }}
                    </p>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-link text-info text-sm mb-0 me-2" @click="addToWatchlist(row.symbol)">
                      加自选
                    </button>
                    <button class="btn btn-link text-success text-sm mb-0 me-2" @click="fillOrder(row, 'buy')">
                      买入
                    </button>
                    <button class="btn btn-link text-danger text-sm mb-0" @click="fillOrder(row, 'sell')">
                      卖出
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else-if="activeTab === 'trade'" class="card-body">
          <div class="row g-3">
            <div class="col-12 col-lg-6">
              <div class="card border">
                <div class="card-body">
                  <h6 class="mb-3">模拟下单</h6>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label class="form-label">市场</label>
                      <select v-model="orderMarket" class="form-select">
                        <option value="stock">股票</option>
                        <option value="futures">期货</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">代码</label>
                      <input v-model="orderSymbol" type="text" class="form-control" placeholder="例如 IF2406" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">方向</label>
                      <select v-model="orderSide" class="form-select">
                        <option value="buy">买入</option>
                        <option value="sell">卖出</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">委托类型</label>
                      <select v-model="orderType" class="form-select">
                        <option value="limit">限价</option>
                        <option value="market">市价</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">数量</label>
                      <input v-model.number="orderQuantity" type="number" min="1" class="form-control" />
                    </div>
                    <div class="col-md-6">
                      <label class="form-label">价格</label>
                      <input
                        v-model="orderPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control"
                        :disabled="orderType === 'market'"
                      />
                    </div>
                  </div>
                  <button class="btn bg-gradient-primary w-100 mt-4 mb-0" @click="submitOrder">
                    提交委托
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="card border h-100">
                <div class="card-body">
                  <h6 class="mb-3">操作说明</h6>
                  <ul class="text-sm mb-0 ps-3">
                    <li class="mb-2">点击行情列表中的“买入/卖出”会自动填充委托单。</li>
                    <li class="mb-2">“刷新行情”将模拟行情波动并更新最新时间。</li>
                    <li class="mb-2">提交委托后会记录到“自选与委托”面板。</li>
                    <li class="mb-2">当前为演示界面，后续可接真实行情/API。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="card-body">
          <div class="row g-3">
            <div class="col-12 col-lg-4">
              <div class="card border h-100">
                <div class="card-body">
                  <h6 class="mb-3">自选列表</h6>
                  <div v-if="watchlist.length" class="d-flex flex-wrap gap-2">
                    <span v-for="item in watchlist" :key="item" class="badge bg-gradient-dark">
                      {{ item }}
                    </span>
                  </div>
                  <p v-else class="text-sm text-muted mb-0">暂无自选代码</p>
                </div>
              </div>
            </div>
            <div class="col-12 col-lg-8">
              <div class="card border h-100">
                <div class="card-body">
                  <h6 class="mb-3">最近委托</h6>
                  <div class="table-responsive">
                    <table class="table mb-0">
                      <thead>
                        <tr>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">时间</th>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">市场</th>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">代码</th>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">方向</th>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">数量/价格</th>
                          <th class="text-xxs text-secondary text-uppercase opacity-7">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="!orderHistory.length">
                          <td colspan="6" class="text-sm text-muted">暂无委托记录</td>
                        </tr>
                        <tr v-for="item in orderHistory" :key="item.id">
                          <td class="text-sm">{{ item.time }}</td>
                          <td class="text-sm">{{ item.market }}</td>
                          <td class="text-sm">{{ item.symbol }}</td>
                          <td class="text-sm">{{ item.side }}</td>
                          <td class="text-sm">{{ item.quantity }} / {{ item.price }}</td>
                          <td class="text-sm text-success">{{ item.status }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.market-page .nav-pills .nav-link.active {
  background: linear-gradient(195deg, #49a3f1, #1a73e8);
  color: #fff;
}

.market-page .table td,
.market-page .table th {
  vertical-align: middle;
}
</style>
