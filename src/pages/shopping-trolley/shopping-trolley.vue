<template>
  <view class="content">
    <view class="list">
      <template v-for="commodity of commodityStore.commodities" :key="commodity.id">
        <view v-if="isValid(commodity)" class="list-item">
          <view class="list-item-title">
            <text>{{ commodity.name }}</text>
          </view>
          <input class="list-item-input" type="number" v-model="commodity.purchaseQuantity"
            @input="handleInput($event, commodity)" />
          <button @click="clear(commodity)">清除</button>
        </view>
      </template>
    </view>
    <button class="settle-button" @click="settle">结算</button>
    <button @click="clearAll">全部取消</button>
  </view>
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from '@/components/tab-bar.vue';
import { useCommodityStore, type Commodity } from '@/stores/commodity';
import { toNumber } from '@/utils/general'

const commodityStore = useCommodityStore()

const isValid = (commodity: Commodity) => {
  if (commodity.purchaseQuantity === '') {
    return true
  }

  return toNumber(commodity.purchaseQuantity) > 0
}

const clear = (commodity: Commodity) => {
  commodityStore.clearPurchasedCommodity(commodity.id)
}

const clearAll = () => {
  commodityStore.clearAllPurchasedCommodity()
}

const handleInput = (event: any, commodity: Commodity) => {
  const { value } = event.detail
  commodityStore.purchaseCommodity(commodity.id, value)
}

const settle = () => {
  commodityStore.settle()
}
</script>

<style scoped>
.content {
  padding: 0rpx 30rpx;
}

.list {
  margin: 40rpx 0rpx;
}

.list-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.list-item-title {
  width: 150rpx;
}

.list-item-input {
  flex: 1;
}

.settle-button {
  margin-bottom: 40rpx;
}
</style>