<template>
  <div class="header flex items-center justify-between mb-12">
    <div class="title text-lg font-semibold">Bussines Units</div>
    <div class="group-button">
      <button
        class="btn-create bg-blue-600 text-white px-4 py-1 rounded"
        @click="$emit('create')"
      >
        Create
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BusinessUnitsHeader',
}
</script>
