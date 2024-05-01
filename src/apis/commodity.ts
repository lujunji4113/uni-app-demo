import type { Commodity, Order } from "@/stores/commodity";

const token = "6c62fc196f323dcfdf6bc4ba8fa078a6";

export const fetchCommodity = async (): Promise<
  Pick<Commodity, "id" | "name" | "imageUrl">[]
> => {
  const response = await uni.request({
    url: "/api/showpro?cmd=showpronormal",
    method: "POST",
    data: {
      count: 5,
      start: 0,
      token,
      user: "customer",
    },
    dataType: "json",
  });

  return response.data.showpro.map((item) => ({
    id: item.showpro_id,
    name: item.showpro_name,
    imageUrl: item.showpro_url,
  }));
};

export const settle = async (
  purchasedCommodity: { name: string; purchaseQuantity: number }[]
): Promise<boolean> => {
  const response = await uni.request({
    url: "/api/showpro?cmd=upload",
    method: "POST",
    data: {
      customer: 9999,
      ...Object.fromEntries(
        purchasedCommodity.map((item) => [item.name, item.purchaseQuantity])
      ),
    },
    dataType: "json",
  });
  return response.data.code === "033";
};

export const fetchOrder = async (): Promise<Order[]> => {
  const response = await uni.request({
    url: "/api/UserInterface?cmd=UserInterfaceNormal",
    method: "POST",
    data: {
      count: 100,
      start: 0,
      token,
      user: "customer",
    },
    dataType: "json",
  });
  return response.data.UserInterface.map((item) => ({
    id: item.OrderID,
    commodityName: item.ProductName,
    purchaseQuantity: item.count,
    timestamp: item.timestamp,
    deliver: item.deliver,
  }));
};

export const searchOrderCount = async (query: string): Promise<number> => {
  const encodeQuery = btoa(encodeURIComponent(query));

  const response = await uni.request({
    url: `/api/UserInterface?cmd=UserInterfaceSearch=${encodeQuery}`,
    method: "POST",
    data: {
      token,
      user: "customer",
    },
  });
  return parseInt(response.data.num, 10);
};

export const searchOrder = async (query: string): Promise<Order[]> => {
  const count = await searchOrderCount(query);

  const response = await uni.request({
    url: "/api/UserInterface?cmd=UserInterfaceResult",
    method: "POST",
    data: {
      count,
      start: 0,
      token,
      user: "customer",
    },
  });

  return response.data.UserInterface.map((item) => ({
    id: item.OrderID,
    commodityName: item.ProductName,
    purchaseQuantity: item.count,
    timestamp: item.timestamp,
    deliver: item.deliver,
  }));
};

export const pay = async (orders: Order[]): Promise<boolean> => {
  const responses = await Promise.all(
    orders.map((order) =>
      uni.request({
        url: "/api/UserInterface?cmd=UserInterfaceUpdate",
        method: "POST",
        data: {
          OrderID: order.id,
          ProductName: order.commodityName,
          count: order.purchaseQuantity,
          timestamp: order.timestamp,
          deliver: "true",
        },
      })
    )
  );
  return responses.every((item) => item.data.code === "020");
};
