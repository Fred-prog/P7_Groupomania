<template>
    <div class="overflow-auto border" style="max-height: 750px">
        <b-container>
            <h1>Tous les profils</h1>
            <b-col class="py-2">
                <button @click="backToWall()"
                type="button" 
                class="btn btn-secondary" 
                data-toggle="tooltip" 
                data-placement="rigth" 
                title="Retour au mur"
                aria-label="Retour au mur">
                    Retour  <b-icon icon="back" scale = "1.5" aria-hidden = "true"></b-icon>
                    </button>
            </b-col>
        </b-container>
        <b-container>
            <b-card >
                <users
                    v-for="user of users"
                    :key="user.id"
                    :user="user"
                    @deleteAccount="deleteAccount(user.id)"
                >
                </users>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import Users from './Users.vue';

    export default {
        name: 'AllAccount',
        components: {
            Users,
        },

        data() {
            return {

            }
        },

        computed: {
            users() {
                return this.$store.getters.getUsers;
            },
        },

        beforeMount() {
            this.$store.dispatch("getUsers");
        },

        methods: {
            backToWall() {
                this.$router.push("/Wall");
            },
            
            deleteAccount(id) {
                this.$store.dispatch("deleteAccount", id);
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>