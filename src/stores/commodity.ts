import {
  fetchCommodity,
  fetchOrder,
  pay,
  searchOrder,
  settle,
} from "@/apis/commodity";
import { toNumber } from "@/utils/general";
import { defineStore, type _GettersTree } from "pinia";

export interface Commodity {
  id: number;
  name: string;
  imageUrl: string;
  tempPurchaseQuantity: string;
  purchaseQuantity: string;
}

export interface Order {
  id: number;
  commodityName: string;
  purchaseQuantity: number;
  timestamp: string;
  deliver: "false" | "true";
}

interface CommodityState {
  initialized: boolean;
  commodities: Commodity[];
  orders: Order[];
}

interface CommodityGetters extends _GettersTree<CommodityState> {}

interface CommodityActions {
  init(): Promise<void>;
  purchaseCommodity(id: number, quantity: string): void;
  clearPurchasedCommodity(id: number): void;
  clearAllPurchasedCommodity(): void;
  settle(): Promise<void>;
  searchOrder(query: string): Promise<void>;
  payOrder(orders: Order[]): Promise<void>;
}

export const useCommodityStore = defineStore<
  "commodity",
  CommodityState,
  CommodityGetters,
  CommodityActions
>("commodity", {
  state: () => {
    return {
      initialized: false,
      commodities: [],
      orders: [],
    };
  },
  getters: {},
  actions: {
    async init() {
      if (!this.initialized) {
        const commodities = await fetchCommodity();
        this.commodities = commodities.map((item) => ({
          ...item,
          tempPurchaseQuantity: "0",
          purchaseQuantity: "0",
        }));
        this.initialized = true;
      }
    },
    purchaseCommodity(id: number, quantity: string) {
      const commodity = this.commodities.find((item) => item.id === id);
      if (!commodity) {
        return;
      }

      commodity.purchaseQuantity = quantity;
      commodity.tempPurchaseQuantity = quantity;
    },
    clearPurchasedCommodity(id: number) {
      const commodity = this.commodities.find((item) => item.id === id);
      if (!commodity) {
        return;
      }

      commodity.purchaseQuantity = "0";
      commodity.tempPurchaseQuantity = "0";
    },
    clearAllPurchasedCommodity() {
      this.commodities.forEach((commodity) => {
        commodity.tempPurchaseQuantity = "0";
        commodity.purchaseQuantity = "0";
      });
    },
    async settle() {
      const purchasedCommodity = this.commodities.filter(
        (item) => toNumber(item.purchaseQuantity) > 0
      );
      if (purchasedCommodity.length === 0) {
        return;
      }

      const success = await settle(
        purchasedCommodity.map((item) => ({
          name: item.name,
          purchaseQuantity: toNumber(item.purchaseQuantity),
        }))
      );
      if (!success) {
        return;
      }

      this.orders = await fetchOrder();

      uni.navigateTo({
        url: "/pages/order/order",
      });

      this.clearAllPurchasedCommodity();
    },
    async searchOrder(query: string) {
      const orders =
        query === "" ? await fetchOrder() : await searchOrder(query);

      this.orders = orders;
    },
    async payOrder(orders: Order[]) {
      const filteredOrders = orders.filter(
        (order) => order.deliver === "false"
      );
      if (filteredOrders.length === 0) {
        return;
      }

      const isSuccess = await pay(filteredOrders);
      if (isSuccess) {
        this.orders = await fetchOrder();
      }
    },
  },
});
