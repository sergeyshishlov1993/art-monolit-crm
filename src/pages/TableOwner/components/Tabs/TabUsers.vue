<template>
  <div class="table__wrapper">
    <div class="settings">
      <q-btn
        color="green"
        icon="add"
        round
        dense
        @click="storeOwner.addRowUser"
      ></q-btn>
    </div>

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Пользователи"
        :rows="storeOwner.rowsUser"
        :columns="storeOwner.columnsUser"
        v-model:pagination="pagination"
        row-key="id"
      >
        <template v-slot:body-cell-accountNumber="props">
          <q-td :props="props">
            {{ props.pageIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-select
              v-model="selectedRoles[props.row.id]"
              :options="storeOwner.optionsRole"
              outlined
              dense
              emit-value
              map-options
              option-value="id"
              option-label="name"
              @update:model-value="handleRoleChange(props.row.id, props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-address="props">
          <q-td :props="props">
            <q-select
              v-model="selectedStores[props.row.id]"
              :options="storeOwner.storeOptions"
              outlined
              dense
              emit-value
              map-options
              option-value="id"
              option-label="name"
              class="q-mt-sm"
              @update:model-value="handleStoreChange(props.row.id, props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            {{ storeOwner.formatDate(props.row.createdAt) }}
          </q-td>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            <q-input
              v-if="props.col.name !== 'createdAt'"
              v-model="props.row[props.col.name]"
              input-class="text-start"
              type="string"
              dense
              borderless
              :readonly="
                props.col.name === 'name' && props.row.name === 'Владелец'
              "
              @focus="touchInput(props.row)"
            ></q-input>
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
                  storeOwner.createUserAssignRole({
                    ...props.row,
                    selectedRoleId: selectedRoles[props.row.id],
                  })
                "
                v-if="props.row.isCreated"
              >
                <q-tooltip>Добавить</q-tooltip>
              </q-btn>

              <q-btn
                :disable="!props.row.isChanged"
                icon="sync"
                round
                glossy
                color="teal"
                dense
                ripple
                @click="
                  storeOwner.updateUser({
                    ...props.row,
                    selectedRoleId: selectedRoles[props.row.id],
                  })
                "
                v-if="!props.row.isCreated"
              >
                <q-tooltip>Изменить</q-tooltip>
              </q-btn>

              <q-btn
                color="red"
                icon="delete"
                round
                dense
                v-if="props.row.name !== 'Владелец'"
                @click="storeOwner.handleDeleteUser(props.row)"
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
import { ref, reactive, onMounted, computed } from "vue";
import { useOwner } from "@/stores/Owner";

const storeOwner = useOwner();
const pagination = ref({
  sortBy: "createdAt",
  descending: true,
  rowsPerPage: 10,
});

const selectedRoles = reactive({});
const selectedStores = reactive({});

const handleStoreChange = (userId, row) => {
  const storeId = selectedStores[userId];
  const store = storeOwner.storeOptions.find((s) => s.id === storeId);

  const user = storeOwner.rowsUser.find((u) => u.id === userId);

  touchInput(row);
  if (user) {
    user.address = store ? store.name : "";
  }
};

const initializeRoles = () => {
  storeOwner.rowsUser.forEach((user) => {
    selectedRoles[user.id] = user.roles?.[0]?.id || null;
  });
};

const initializeStores = () => {
  storeOwner.rowsUser.forEach((user) => {
    const store = storeOwner.storeOptions.find((s) => s.name === user.address);
    selectedStores[user.id] = store ? store.id : null;
  });
};

const handleRoleChange = (userId, row) => {
  const newRoleId = selectedRoles[userId];
  console.log(`Роль користувача ${userId} змінено на: ${newRoleId}`);
  touchInput(row);
};

onMounted(() => {
  storeOwner.getAllUsers().then(() => {
    initializeRoles();
    initializeStores();
  });

  storeOwner.getAllRows();
});

const touchInput = (row) => {
  row.isChanged = true;
};
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
