export function useOrderHelpers() {
  function sortPhotos(orderPhotoLinks, dataTable) {
    orderPhotoLinks.forEach((photo) => {
      if (!dataTable.rowsPhotos[photo.type]) {
        dataTable.rowsPhotos[photo.type] = [];
      }
      dataTable.rowsPhotos[photo.type].push(photo);
    });
  }

  function sortDataOrder(store, dataTable) {
    dataTable.rowsDead = store.oneOrder.OrderDeads;
    dataTable.rowsMaterials = store.oneOrder.OrderMaterials;
    dataTable.rowsServices = store.oneOrder.OrderServices;
    dataTable.rowsWorks = store.oneOrder.OrderWorks;
    sortPhotos(store.oneOrder.OrderPhotoLinks, dataTable);

    dataTable.rowsCustomer = {
      id: store.oneOrder.id,
      firstName: store.oneOrder.first_name,
      secondName: store.oneOrder.second_name,
      phone: store.oneOrder.phone,
      address: store.oneOrder.address,
      comment: store.oneOrder.comment,
      createdAt: new Date(store.oneOrder.createdAt),
    };
  }

  return {
    sortPhotos,
    sortDataOrder,
  };
}
