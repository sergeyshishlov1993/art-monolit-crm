<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :rows="data"
      :columns="columns"
      row-key="id"
      hide-bottom
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width></q-th>
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-btn
              size="sm"
              color="accent"
              round
              dense
              @click.stop="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            ></q-btn>
          </q-td>

          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <template v-if="col.name === 'accountNumber'">
              {{ props.pageIndex + 1 }}
            </template>
            <template v-else>
              {{ props.row[col.field] }}
            </template>
          </q-td>
        </q-tr>

        <q-tr v-show="props.expand" :props="props">
          <q-td :colspan="columns.length + 1">
            <div class="q-px-md">
              <p><strong>Детали заказа:</strong></p>
              <p>Имя: {{ props.row.first_name }} {{ props.row.second_name }}</p>
              <p>Телефон: {{ props.row.phone }}</p>
              <p>Адрес: {{ props.row.address }}</p>
              <p class="comment">Комментарий: {{ props.row.comment }}</p>
              <p>Дата создания: {{ props.row.createdAt }}</p>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  rows: Object,
});

const columns = ref([
  {
    name: "firstName",
    align: "left",
    label: "Имя",
    field: "firstName",
  },
  {
    name: "secondName",
    align: "left",
    label: "Фамилия",
    field: "secondName",
  },
  {
    name: "phone",
    align: "left",
    label: "Телефон",
    field: "phone",
  },
  {
    name: "address",
    align: "left",
    label: "Адрес",
    field: "address",
  },
  {
    name: "comment",
    align: "left",
    label: "Комментарий",
    field: "comment",
    classes: "comment-cell",
  },
  {
    name: "createdAt",
    align: "left",
    label: "Дата создания",
    field: "createdAt",
  },
]);

const data = computed(() => {
  return [
    {
      id: props.rows.id,
      firstName: props.rows.firstName,
      secondName: props.rows.secondName,
      phone: props.rows.phone,
      address: props.rows.address,
      comment: props.rows.comment,
      createdAt: new Date(props.rows.createdAt).toLocaleString("ru-RU"),
    },
  ];
});
</script>

<style lang="scss" scoped>
.q-td.comment-cell {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.comment {
  white-space: normal;
  overflow: visible;
}
</style>
