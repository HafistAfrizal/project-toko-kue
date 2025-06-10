<template>
  <div class="about">
    <MainNavbar/>
    <h2>AboutView</h2>
  </div>
</template>

<script>
// @ is an alias to /src
import MainNavbar from '@/components/MainNavbar.vue'

export default {
  name: 'HomeView',
  components: {
    MainNavbar
  }
}
</script>