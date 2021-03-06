<template>
  <div>
    <transition name="slide-right">
      <div
        v-if="active"
        class="drawer fixed flex flex-col shadow bg-white top-0 z-20 px-4 py-8"
      >
        <div class="header h-12">
          <slot name="header"></slot>
        </div>
        <div class="body flex-1">
          <slot name="body"></slot>
        </div>
        <div class="footer h-12">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div
        v-if="active"
        class="overlay fixed top-0 right-0 w-full h-full bg-black opacity-40"
        @click="$emit('hide')"
      ></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Drawer',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.drawer {
  width: 40vw;
  height: 100vh;
  right: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s;
}
.slide-right-enter,
.slide-right-leave-to {
  transform: translateX(40vw);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
