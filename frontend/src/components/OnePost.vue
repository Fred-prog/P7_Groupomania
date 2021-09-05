<template>
    <div class="overflow-auto" style="max-height: 750px">
        <b-container>
            <b-card>
                <b-card-title>
                    <h1>Modifier le post</h1>
                </b-card-title>
                <button
                @click="backToWall()"
                type="button" 
                class="btn btn-secondary" 
                data-toggle="tooltip" 
                data-placement="rigth" 
                title="Retour au mur"
                aria-label="Retour au mur">
                    Retour  <b-icon icon="back" scale = "1.5" aria-hidden = "true"></b-icon></button>
            </b-card>
            <b-card>
                <b-card-text v-if="showMessage">
                    <b-col>
                        <span>Le message du post:</span>
                        <span> {{ post.content }} </span>
                    </b-col>
                </b-card-text>
                <b-card-text v-if="NewMessage">
                    <b-textarea label="message"
                    v-model="content"
                    required>
                    </b-textarea>
                </b-card-text>
                <b-button
                @click="updateMessage">
                    modifier message
                </b-button>
            </b-card>
            <b-card>
                <b-form @submit="updateSubmit">
                    <b-card-body v-if="showLink">
                        <span>Lien du post:</span>
                        <video v-if="post.mediaUrl"
                        width="450"
                        controls :src="post.mediaUrl"></video>
                    </b-card-body>
                    <b-card-body v-if="NewLink">
                        <b-form-input 
                            class="border border-info"
                            name="link"
                            label="lien media"
                            v-model="link"
                            >
                        </b-form-input>
                    </b-card-body>
                    <b-button
                        @click="updateLink">
                            modifier lien
                    </b-button>
                    <b-card-body v-if="showImage">
                        <span>Image du post:</span>
                        <b-img
                            v-if="post.imageUrl"
                            :src="post.imageUrl"
                            fluid alt="fluid image"
                        ></b-img>
                    </b-card-body>
                    <b-card-body v-if="NewImage">
                        <b-form-group>
                                    <b-form-file 
                                        @change="uploadImage"
                                        type="file" 
                                        name="image"  
                                        id="file-input"
                                        accept="image/*" 
                                        ref="file" 
                                        webkitdirectory multiple>
                                    </b-form-file>
                                    <b-col id="preview">
                                    </b-col>
                                </b-form-group>
                    </b-card-body>
                    <b-button
                        @click="updateImage">
                            modifier image
                    </b-button>
                    <b-card-body>
                        <b-form-group>
                        <input type="submit" value="ENVOYER" />
                        </b-form-group>
                    </b-card-body>
                </b-form>
            </b-card>
        </b-container>
    </div>
</template>

<script>
import FormData from 'form-data';
    export default {
        name: 'OnePost',

        data() {
            return {
                showMessage: true,
                NewMessage: false,
                showLink: true,
                NewLink: false,
                showImage: true,
                NewImage: false,

                content: "",
                link: "",
                file:"",

                USER: this.$store.state.user.userId,
            }

        },

        computed: {
            post() {
                return this.$store.getters.post;
            },
        },

        beforeMount() {
            let id = this.$route.params.id;
            this.$store.dispatch("getPostById", id);
        },


        methods: {
            backToWall() {
                this.$router.push("/Wall");
            },

            updateMessage() {
                if (this.showMessage == true) {
                    this.showMessage = false;
                    this.NewMessage = true;
                } else {
                    this.showMessage = true;
                    this.NewMessage = false;
                }
            },

            updateLink() {
                if (this.showLink == true) {
                    this.showLink = false;
                    this.NewLink = true;
                } else {
                    this.showLink = true;
                    this.NewLink = false;
                }
            },

            updateImage() {
                if (this.showImage == true) {
                    this.showImage = false;
                    this.NewImage = true;
                } else {
                    this.showImage = true;
                    this.NewImage = false;
                }
            },

            uploadImage() {
                const file = this.$refs.file.files[0];
                this.file = file;
            },

            updateSubmit(e) {
                e.preventDefault();
                // let id = this.$route.params.id;
                const formData = new FormData(e.target);
                formData.append("userId", this.USER)
                if (this.content !== null) {
                    formData.append("content", this.content);
                }

                if (this.link !== null) {
                    formData.append("link", this.link);
                }
                
                formData.append("image", this.file);
                this.$store.dispatch("updatePost", formData)
                this.backToWall()
            }
        }    
    }
</script>

<style lang="scss" scoped>

</style>