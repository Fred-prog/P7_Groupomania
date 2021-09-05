<template>
    <div class="overflow-auto border" style="max-height: 750px">
        <b-container>
            <b-card>
                <h1>Post récent</h1>
                <button 
                type="button" 
                class="btn btn-secondary" 
                data-toggle="tooltip" 
                data-placement="rigth" 
                title="Tooltip on bottom"
                aria-label="retour au mur"
                @click="backToWall()"
                >Retour <b-icon icon="back" scale = "1.5" aria-hidden = "true"></b-icon>
                </button>
            </b-card>        
            <b-card>
                <posts  
                    v-for="post of posts"
                    :key="post.id"
                    :post="post"
                    :id="post.id"
                    @deletePost="deletePost(post.id)"
                    @reloadpost="reloadpost()"
                    @comSubmit="comSubmit(post.id)"
                    @deleteComment="deleteComment(comment.id)"
                >
                </posts>
            </b-card>
        

        </b-container>
    </div>
</template>

<script>
import Posts from '../components/Posts.vue';
    export default {
        name: 'RecentPost',

        components: {
            Posts,
        },

        data() {
            return {

            }
        },

        computed: {
            posts() {
                return this.$store.getters.getUserPosts;
            },

            user() {
                console.log();
                return this.$store.getters.oneUser;
            },
        },

        beforeMount() {
            let id = this.$route.params.id;
            this.$store.dispatch("getRecentPost", id);
        },

        methods: {
            backToWall() {
                this.$router.push("/Wall");
            },  

             deletePost(id) {
                this.$store.dispatch("deletePost", id);
            },

            deleteComment(id) {
               this.$store.dispatch("deleteComment", id)
           },
        }
    }
</script>

<style lang="scss" scoped>

</style>