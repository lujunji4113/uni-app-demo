<template>
  <view class="content">
    <view class="product-list-item" v-for="commodity in commodityStore.commodities" :key="commodity.id">
      <view class="product-card">
        <image class="product-image" :src="commodity.imageUrl" alt="Product Image" />
        <text>{{ commodity.name }}</text>
      </view>
      <input class="quantity-input" type="number" v-model="commodity.tempPurchaseQuantity" />
      <button @click="confirm(commodity)">确定</button>
    </view>
  </view>
  <TabBar />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TabBar from "@/components/tab-bar.vue";
import { useCommodityStore } from "@/stores/commodity";
import type { Commodity } from "@/stores/commodity";

const commodityStore = useCommodityStore()

const confirm = (commodity: Commodity) => {
  const { id, tempPurchaseQuantity } = commodity

  commodityStore.purchaseCommodity(id, tempPurchaseQuantity)
}

onMounted(() => {
  commodityStore.init()
})

</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.product-list-item {
  display: flex;
  align-items: center;
}

.product-card {
  border: 1rpx solid #ccc;
  border-radius: 5rpx;
  padding: 10rpx;
  margin: 10rpx;
  width: 200rpx;
  text-align: center;
}

.product-image {
  height: 200rpx;
  width: 200rpx;
}
</style>
