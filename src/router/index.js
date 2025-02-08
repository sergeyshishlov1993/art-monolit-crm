import { createRouter, createWebHistory } from "vue-router";
import TableOrders from "../pages/TableOrdersTest/index.vue";
import HelloPage from "../pages/HelloPage/index.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import { usePermissionStore } from "@/stores/PermissionStore";
import AuthLayout from "@/layouts/AuthLayout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "",
          component: HelloPage,
          name: "Hello",
        },

        {
          path: "/orders",
          component: TableOrders,
          name: "orders",
          meta: { requiresPermission: "orders" },
        },

        {
          path: "/create",
          name: "orders-create",
          component: () => import("../pages/TableCreateOrderTest/index.vue"),
          meta: { requiresPermission: "can_write_order" },
        },

        {
          path: "/read-order",
          name: "readOrder",
          component: () => import("../pages/TableReadOrderTest/index.vue"),
        },

        {
          path: "/owner",
          name: "owner",
          component: () => import("../pages/TableOwner/index.vue"),
        },

        {
          path: "/calculate",
          name: "calculate",
          component: () =>
            import("../pages/TablePreOrdersCalculationTest/index.vue"),
          meta: { requiresPermission: "calculation" },
        },

        {
          path: "/order-estimation",
          name: "calculate-create",
          component: () => import("../pages/TableCreatePreOrderTest/index.vue"),
          meta: { requiresPermission: "calculation" },
        },

        {
          path: "/warehouse",
          name: "warehouse",
          component: () => import("../pages/TableWarehouseTest/index.vue"),
          meta: { requiresPermission: "warehouse" },
        },

        {
          path: "/arrival",
          name: "arrival",
          component: () => import("../pages/TableArrivalTest/index.vue"),
          meta: { requiresPermission: "arrival" },
        },

        {
          path: "/defective",
          name: "defective",
          component: () => import("../pages/TableDefectiveTest/index.vue"),
          meta: { requiresPermission: "defective" },
        },

        {
          path: "/materials",
          name: "materials",
          component: () => import("../pages/TableMaterialsTest/index.vue"),
          meta: { requiresPermission: "materials" },
        },
      ],
    },

    {
      path: "/login",
      component: AuthLayout,
      children: [
        {
          path: "",
          name: "login",
          component: () => import("@/pages/Auth/index.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const permissionStore = usePermissionStore();

  if (to.name === "Hello") {
    if (permissionStore.isOwner) {
      next("/owner");
    } else if (permissionStore.permissions.length > 0) {
      next();
    } else {
      next("/login");
    }
    return;
  }

  if (to.path === "/owner") {
    if (permissionStore.isOwner) {
      next();
    } else {
      next("/");
    }
    return;
  }

  if (to.path === "/create") {
    if (permissionStore.hasPermission("can_write_orders")) {
      next();
    } else {
      next(`/read-order`);
    }
    return;
  }

  if (to.meta.requiresPermission) {
    const hasPermission = permissionStore.hasPermission(
      to.meta.requiresPermission
    );

    if (hasPermission) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
