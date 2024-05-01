<template>
  <view class="tab-bar">
    <navigator url="/pages/commodity/commodity" class="tab-bar-item">
      <button class="tab-bar-button">商品</button>
    </navigator>
    <navigator url="/pages/shopping-trolley/shopping-trolley" class="tab-bar-item">
      <button class="tab-bar-button">购物车</button>
    </navigator>
    <navigator url="/pages/order/order" class="tab-bar-item">
      <button class="tab-bar-button">订单</button>
    </navigator>
  </view>
</template>

<style scoped>
.tab-bar {
  position: fixed;
  left: 0rpx;
  bottom: 0rpx;
  width: 100%;
  display: flex;
}

.tab-bar-item {
  flex: 1;
}
</style>