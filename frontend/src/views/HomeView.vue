<template>
  <div class="home">
    <MainNavbar/>
    <HeroView/>
  </div>
</template>

<script>
import MainNavbar from '@/components/MainNavbar.vue'
import HeroView from '@/components/HeroView.vue'

export default {
  name: 'HomeView',
  components: {
    MainNavbar, 
    HeroView
  }
}
</script>
