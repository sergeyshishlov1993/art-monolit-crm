<template>
  <div class="table__wrapper">
    <div class="settings">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="storeOwner.addRowRole"
      ></q-btn>
    </div>

    <div class="q-pa-md">
      <q-table
        title="Роли и разрешения"
        flat
        bordered
        :rows="storeOwner.rowsRole"
        :columns="storeOwner.columnRols"
        v-model:pagination="pagination"
        row-key="id"
      >
        <template v-slot:body-cell="props">
          <q-td :props="props">
            <template
              v-if="
                [
                  'arrival',
                  'calculation',
                  'orders',
                  'can_write_orders',
                  'defective',
                  'materials',
                  'warehouse',
                ].includes(props.col.name)
              "
            >
              <q-checkbox
                v-model="props.row[props.col.name]"
                dense
                color="primary"
              />
            </template>

            <template v-else>
              <q-input
                v-model="props.row[props.col.name]"
                input-class="text-left"
                type="string"
                dense
                borderless
              />
            </template>
          </q-td>
        </template>

        <template v-slot:body-cell-accountNumber="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ storeOwner.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <q-td :props="props" class="text-center">
            <div class="actions-btn">
              <q-btn
                round
                color="primary"
                icon="edit"
                dense
                @click="
                  storeOwner.createRoleWithPermissions(
                    props.row,
                    getPermissionIds(props.row)
                  )
                "
                v-if="props.row.isCreated"
              >
                <q-tooltip>Добавить</q-tooltip>
              </q-btn>

              <q-btn
                :disable="props.row.isChanged"
                icon="sync"
                round
                glossy
                color="teal"
                dense
                ripple
                @click="
                  storeOwner.handleCheckboxChange(
                    getPermissionIds(props.row),
                    props.row
                  )
                "
              >
                <q-tooltip>Изменить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                @click="storeOwner.handleDeleteRole(props.row)"
              >
                <q-tooltip>Удалить</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useOwner } from "@/stores/Owner";
const storeOwner = useOwner();
const pagination = ref({
  sortBy: "decr",
  descending: false,
  rowsPerPage: 10,
});

function getPermissionIds(row) {
  const permissionKeys = [
    "arrival",
    "calculation",
    "orders",
    "can_write_orders",
    "defective",
    "materials",
    "warehouse",
  ];

  return permissionKeys.filter((key) => row[key]);
}
</script>

<style lang="scss" scoped>
.table__wrapper {
  h1 {
    text-align: center;
    font-size: 34px;
    font-weight: 600;
  }
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;

  .input-search {
    width: 400px;
  }
}

.actions-btn {
  display: flex;
  gap: 10px;
}
</style>
