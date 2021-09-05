<template>
    <header class="fluid">  
      <div id="nav">
        <b-navbar toggleable="lg" type="dark" variant="danger">
          <b-navbar-brand href="#" class="py-4 px-2">
          <b-img 
          width="180"
          :src="require('../assets/icon-left-font-monochrome-white.svg')"></b-img></b-navbar-brand>
          <b-collapse id="nav-collapse" is-nav>
          </b-collapse>
            <!-- <b-navbar-nav >
              <b-nav-item :to="'/'">PROFIL</b-nav-item>
            </b-navbar-nav> -->
            <b-navbar-nav v-if="logIn">
              <b-nav-item @click="logout()">Déconnexion</b-nav-item>
            </b-navbar-nav>
        </b-navbar>
      </div>
    </header>
</template>

<script>
// import { mapState } from 'vuex'

    export default {
      name:'Header',

      data() {
        return {
          logIn: true,
        }
      },

        changeHeader: function() {
          console.log(this.$store.state.user.userId);
          if (this.$store.state.isLoggedIn === true) {
            this.logIn = true
          } else {
            this.logIn = false
          }
        },
      

      computed: {
          
      },

      methods: {

        changeHeader: function() {
          console.log(this.$store.state.user.userId);
          if (this.$store.state.isLoggedIn == true) {
            this.logIn = true
          } else {
            this.logIn = false
          }
        },
        
        logout: function () {
          this.$store.commit('logout');
          this.$router.push('/');
        }
      }
}
</script>

<style lang="scss" scoped>

</style>