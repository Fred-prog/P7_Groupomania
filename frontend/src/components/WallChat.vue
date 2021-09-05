<template>
    <div class="overflow-auto border" style="max-height: 760px">
        <b-container class=" py-2 fluid">
            <b-row>
                <b-col>
                    <a href="" @click="goProfil(USER)">PROFIL</a> <b-icon icon="person-circle" scale = "1.5" aria-hidden = "true"></b-icon>
                    
                </b-col>
                <b-col v-if="user.moderator == true">
                    <a href="" @click="goAllProfil()">
                        Tous les utilisateurs</a> <b-icon icon="people-fill" scale = "1.5" aria-hidden = "true"></b-icon>
                    
                </b-col>
            </b-row>
        </b-container>
        <b-container>
            <WallWrite />
        </b-container>
        <b-container class="py-1">
            <b-card-group class="d-flex flex-column border bg-secondary rounded py-2 px-2">
                <b-card>
                    <posts  
                        v-for="post of posts"
                        :key="post.id"
                        :post="post"
                        :id="post.id"
                        @deletePost="deletePost(post.id)"
                        @reloadpost="reloadpost()"
                        @reloadconnect="reloadconnect()"
                        @comSubmit="comSubmit(post.id)"
                        @deleteComment="deleteComment(comment.id)"
                    >
                    </posts>
                </b-card>
            </b-card-group>
        </b-container>
    </div>
</template>

<script>

import WallWrite from "../components/WallWrite.vue";
import Posts from './Posts.vue';
// import mapGetters from 'vuex'

export default {
    name: 'WallChat',
    components: {
        WallWrite,
        Posts,
    },

    computed: {
        posts() {
        return this.$store.getters.posts;
        },

        user() {
                return this.$store.getters.oneUser;
            },
    },

    data() {
        return {
            comms: null,
            a: false,
            USER: this.$store.state.tokenUser.userId,
            testU: this.$store.state.oneUser.moderator
        }
    },


    beforeMount() {
        this.$store.dispatch("getPosts");
        this.$store.dispatch("getOneUser");
    },
    

        methods: {

            off : function () {
                if(this.a == false){
                    // e.preventDefault()
                    this.a = true;
                } else {
                    this.a = false
                }
            },

            deletePost(id) {
                this.$store.dispatch("deletePost", id);
            },

            deleteComment(id) {
                this.$store.dispatch("deleteComment", id);
            },

            alertPost(id, data) {
                this.$store.dispatch('alertPost', id, data)
            },

            goProfil(id) {
                console.log("voir id: ", id);
                this.$router.push(`/Account/${id}`);
            },

            goAllProfil(id) {
                console.log("voir id: ", id);
                this.$router.push(`/AllAccounts`);
            },
        },


    mounted: function () {
    if (this.$store.state.user.userId == -1) {
        this.$router.push('/');
      return ;
    }


    // this.$store.dispatch('getPosts')
    // .then(response => {
    //     console.log(response.data);
    //     this.posts = this.$store.state.dataPost
    // });

},


}

</script>

<style lang="scss" scoped>

</style>