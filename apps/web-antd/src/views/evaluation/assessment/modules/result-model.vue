<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

const [ResultModel, resultModelApi] = useVbenModal({
  onCancel() {
    resultModelApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      return resultModelApi.getData<Record<string, any>>();
    }
  },
});
</script>

<template>
  <ResultModel />
</template>
