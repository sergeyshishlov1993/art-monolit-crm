import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { ApiUrl } from "@/services/api";

export function useOrderData(dataTable, totalPrice) {
  const route = useRoute();
  const isOrderCreated = ref(route.query.isCreated === "false");
  const isPublic = ref(route.query.isPublic === "true");
  const order = ref({});
  const selectedSource = ref("Магазин");
  const source = ["Google", "Facebook", "Instagram", "Рекомендация", "Магазин"];
  const accountNumber = ref(route.query.accountNumber);

  const finalPrice = ref(0);

  function selectSource(select) {
    selectSource.value = select;
  }

  async function getOrder() {
    const response = await axios.get(`${ApiUrl}/pre-orders/${route.query.id}`);

    order.value = response.data.order;

    const {
      address,
      comment,
      first_name,
      second_name,
      name,
      phone,
      totalPrice,
    } = order.value;

    dataTable.customer = {
      address,
      comment,
      first_name,
      second_name,
      name,
      phone,
    };
    dataTable.rowsMaterials = order.value.PreOrderMaterials;
    dataTable.rowsServices = order.value.PreOrderServices;
    dataTable.rowsWorks = order.value.PreOrderWorks;

    finalPrice.value = totalPrice;
  }

  return {
    isOrderCreated,
    order,
    selectedSource,
    selectSource,
    source,
    accountNumber,
    dataTable,
    getOrder,
    finalPrice,
    isPublic,
  };
}
