<template>
  <div class="pesan">
    <MainNavbar/>
    <h2>Pesan Kue Disini</h2>
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
