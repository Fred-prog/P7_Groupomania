<template>
        <div class="overflow-auto border" style="max-height: 600px">
        <b-container class="py-2">
            <b-card-group class="d-flex flex-column border border-info rounded">
                <b-card-text class="d-flex">
                    <p></p> 
                </b-card-text>
                <b-card-text  class="rounded-pill border">
                    Commentaire
                </b-card-text>
                <b-card-text class="border"> 
                </b-card-text>
                <b-card>
                    <b-row>
                        <b-col>
                        likes dislikes
                        </b-col> 
                    </b-row>
                </b-card>
                <b-card class="d-flex justify-content-end">
                    <!-- {{ this.id }} -->
                <!-- <b-bouton id="modify">MODIFIER</b-bouton>
                <b-bouton id="delete">SUPRIMER</b-bouton> -->
                </b-card>
            </b-card-group>
        </b-container>
        
    </div>
</template>

<script>
import axios from 'axios'

    export default {
        name: 'CommentChat',

        data() {
            return {
                comment: []
            } 
        },

        mounted() {
            console.log(this.$route.query.id)
               axios
                .get("http://localhost:3000/api/contents/")
                .then(response => (this.comment = response.data))
                .catch(error => console.log(error));

        }
    }
</script>

<style lang="scss" scoped>

</style>