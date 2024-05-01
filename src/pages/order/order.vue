<template>
  <view class="content">
    <view class="search-bar">
      <input class="search-bar-input" v-model="query" />
      <button @click="search">搜索</button>
    </view>
    <view v-for="order of commodityStore.orders" :key="order.id" class="list-item">
      <view class="list-item-left">
        <text>{{ order.id }}</text>
        <text>{{ order.commodityName }}</text>
        <text>{{ order.purchaseQuantity }}</text>
        <text>{{ order.timestamp }}</text>
        <text>{{ order.deliver }}</text>
      </view>
      <button @click="payOrder(order)">支付</button>
    </view>
  </view>
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/tab-bar.vue';
import type { Order } from '@/stores/commodity';
import { useCommodityStore } from '@/stores/commodity';
import { ref } from 'vue';

const commodityStore = useCommodityStore()

const query = ref('')

const search = async () => {
  await commodityStore.searchOrder(query.value)
}

const payOrder = async (order: Order) => {
  await commodityStore.payOrder([order])
}
</script>

<style scoped>
.content {
  padding: 0rpx 30rpx 100rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: 20rpx 0rpx;
}

.search-bar-input {
  flex: 1;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}
.list-item-left {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>