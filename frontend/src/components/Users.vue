<template>
    <div>
        <b-container class="py-2">
                <b-card style="width: 15rem;">
                    <b-img class="card-img-top" :src="user.avatar" ></b-img>
                    <b-card-title>
                        {{ user.username }}
                    </b-card-title>
                    <b-card-body>
                        <b-card-text>
                            {{ user.email }}
                        </b-card-text>
                        <button
                        type="button" 
                        class="btn btn-danger" 
                        data-toggle="tooltip" 
                        data-placement="rigth" 
                        title="supprimer post"
                        aria-label="supprimer le compte"
                         @click="deleteAccount(user.id)">
                         Supprimer <b-icon icon="trash" scale = "1.5" aria-hidden = "true"></b-icon>
                         </button>
                    </b-card-body>
                </b-card>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: 'Users',

        props: {
            user: {
                type: Object,
            },
        },

        methods: {
            async reloaduser() {
                try {
                    const response = await this.$store.dispatch('getUsers')
    
                        console.log(response.data);
                        this.user = response.data

                } catch (error) {
                    this.errorMessage = error.response.data.error;
                }
             },

             deleteAccount() {
                console.log("voir ID: ", this.user.id);
                this.$emit("deleteAccount", this.user.id);
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>