import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";
import TableOrders from "../pages/TableOrders/index.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          component: TableOrders,
        },

        {
          path: "/create",
          component: () => import("../pages/TableCreateOrder/index.vue"),
        },

        {
          path: "/warehouse",
          component: () => import("../pages/TableWarehouse/index.vue"),
        },

        {
          path: "/arrival",
          component: () => import("../pages/TableArrival/index.vue"),
        },
        {
          path: "/defective",
          component: () => import("../pages/TableDefective/index.vue"),
        },

        {
          path: "/materials",
          component: () => import("../pages/TableMaterials/index.vue"),
        },
      ],
    },
  ],
});

export default router;
