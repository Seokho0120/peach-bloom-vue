import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useItemsDetailStore = defineStore('itemsDetail', () => {
  const itemDetail = ref();

  function setItemDetail(detail) {
    itemDetail.value = detail;
  }

  return { setItemDetail, itemDetail };
});
