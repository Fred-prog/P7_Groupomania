<template>
    <div>
        <b-container class="mb-4 py-1 bg-light border border-dark ">
            <b-card-title class="py-2"> 
                        <span><b-icon icon="at" scale = "1.5" aria-hidden = "true"></b-icon></span>
                        <a href="" @click="goRecentPost(post.userId)"><span>{{ post.title }} </span></a>
                        
                        <span> {{ post.createdAt | moment("calendar") }} </span>
            </b-card-title>
            <div v-if="$store.state.user.userId == post.userId">
                <b-row>
                    <b-col sm="2">
                        <button 
                        type="button" 
                        class="btn btn-secondary" 
                        data-toggle="tooltip" 
                        data-placement="rigth" 
                        title="Tooltip on bottom"
                        aria-label="modifier le post"
                        @click="getOnePost(post.id)">
                        Modifier <b-icon icon="pencil-square" scale = "1.5" aria-hidden = "true"></b-icon>
                        </button>
                    </b-col>
                    <b-col sm="2" v-if="$store.state.user.userId == post.userId || this.$store.state.getUsers.moderator == true">
                        <button 
                        type="button" 
                        class="btn btn-danger" 
                        data-toggle="tooltip" 
                        data-placement="rigth" 
                        title="supprimer post"
                        aria-label="supprimer le post"
                        @click="deletePost(post.id)">
                        Supprimer<b-icon icon="trash" scale = "1.5" aria-hidden = "true"></b-icon>
                        </button>
                    </b-col>
                </b-row>
                <!-- bouton modification du post -->
            </div>
            <b-card-text>
                <p class="lead">
                    {{ post.content }}
                </p>
            </b-card-text>
            <div>
                
                <b-img 
                v-if="post.imageUrl"
                :src="post.imageUrl"
                fluid alt="fluid image"></b-img>
            </div>
            <div>
                <video v-if="post.mediaUrl"
                width="450"
                controls :src="post.mediaUrl"></video>
            </div>
            <div class="py-2" v-if="post.comments">
                <a v-on:click="showComment()" class="button">{{ post.comments.length }} commentaire</a> 
            </div>
            <div>
                <span>Alert :</span><span> {{ post.alert.length }} </span>
                <button>Signaler</button>
            </div>
            <div></div>
            <div v-show="showCom">
            <b-row>
            <b-list-group
                v-for="comment in post.comments"
                :key="comment.id"
                :comment="comment">
                <b-list-group-item>
                    <b-row>
                        <b-col sm="3" class="text-left">
                            <span> {{ comment.createdAt | moment("calendar") }} </span>
                        </b-col>
                    </b-row>
                    <div>
                        <b-row  class="border rounded-pill">
                        <b-col sm="3" class="py-2 bg-secondary text-white">
                            <span> {{ comment.title }} </span>
                        </b-col>
                        <b-col sm="4" class="py-2">
                            <span v-html="comment.content"></span>
                        </b-col>
                        <b-col v-if="$store.state.user.userId == comment.userId || testU == true">
                            <button 
                                type="button" 
                                class="btn btn-danger" 
                                data-toggle="tooltip" 
                                data-placement="rigth" 
                                title="Tooltip on bottom"
                                aria-label="supprimer le commentaire"
                                @click="deleteComment(comment.id)">
                                <b-icon icon="trash" scale = "1.5" aria-hidden = "true"></b-icon>
                            </button>
                        </b-col>
                        </b-row>
                    </div>
                </b-list-group-item>
            </b-list-group>
            </b-row>
            <b-row>
                <b-form >
                    <b-col sm="6">
                    <b-form-group>
                        <label for="content">ecrivez votre commentaire:</label>
                        <b-form-textarea 
                        id="textarea"
                        name="contentCom"
                        placeholder="entrer votre commentaire"
                        rows="1"
                        max-rows="1"
                        class="rounded-pill"
                        v-model="data.contentCom"></b-form-textarea>
                    </b-form-group>
                    </b-col>
                    <b-col cols="12">
                    <b-form-group>
                    <button
                    @click.prevent="comSubmit(post.id)">ENVOYER</button>
                    </b-form-group>
                </b-col>

                </b-form>
            </b-row>
            </div>
            
        </b-container>
    </div>
</template>

<script>
    export default {
        name: 'Posts',

        props: {
            post: {
                type: Object,
            },
        },

        data() {
            return {
                showCom : false,
                auth: this.$store.state.authToken,
                data: {
                    contentCom: '',
                    alert: 1,
                },
                errorMessage: '',
                testU: this.$store.state.oneUser.moderator
            }
        },

        computed: {
            user() {
                console.log();
                return this.$store.getters.oneUser;
            },
        },

        beforeMount() {
            this.$store.dispatch("getOneUser");
        },

        methods: {
            async reloadpost() {
                try {
                    const response = await this.$store.dispatch('getPosts')
    
                        console.log(response.data);
                        this.post = response.data

                } catch (error) {
                    this.errorMessage = error.response.data.error;
                }

            
             },
                
            getOnePost(id) {
                this.$router.push(`posts/${id}`);
            },

            goRecentPost(id) {
                console.log("voir id: ", id);
                this.$router.push(`/RecentPost/${id}`);
            },

            showComment() {
                if (this.showCom == false) {
                    this.showCom = true
                } else {
                    this.showCom = false
                }
            },

            deletePost() {
                console.log("voir ID: ", this.post.id);
                this.$emit("deletePost", this.post.id);
            },

           deleteComment(id) {
               this.$store.dispatch("deleteComment", id)
           },

            comSubmit(id) {
                console.log("voir ID: ", id);
                console.log("voir content du commentaire: ", this.data.contentCom);
                console.log("voir userID du commentaire: ", this.userIdCom);
                this.$store.dispatch("getPosts");
                this.$store.dispatch("commentPost", {
                    id: id,
                    data: this.data,
                });
                this.data.contentCom = "";
                document.location.reload();
            }
        },

        // alertSubmit() {
        //     this.$emit("alertPost", this.post.id, this.alert);
        // }

    }
</script>

<style lang="scss" scoped>

</style>