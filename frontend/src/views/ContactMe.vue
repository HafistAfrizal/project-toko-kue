<template>
  <div class="cotact">
    <MainNavbar/>
    <h2>Contact Me</h2>
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
