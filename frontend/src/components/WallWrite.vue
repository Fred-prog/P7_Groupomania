<template>
    <div class="my-3">
        <b-container class="border px-3 py-3 rounded">
            <b-row>
                <b-form id="form" @submit="monSubmit">
                <b-col cols="6">
                    <b-form-group>
                        <label for="content">Ecrivez votre message :</label>
                        <b-form-textarea 
                        id="textarea"
                        name="content"
                        placeholder="entrer votre message"
                        rows="1"
                        max-rows="1"
                        class="rounded-pill"
                        aria-label="zone de text"
                        v-model="content"></b-form-textarea>
                    </b-form-group>
                </b-col>
            <b-row class="py-2">
                <b-col sm="2">
                    <b-button
                    type="button" 
                    class="btn btn-secondary" 
                    data-toggle="tooltip" 
                    data-placement="rigth" 
                    title="Choisir liens"
                    aria-label="choisir un lien"
                    @click="btnLink">
                    Lien <b-icon icon="link" scale = "1.5" aria-hidden = "true"></b-icon></b-button>
                </b-col>
                <b-col sm="2">
                    <b-button
                    type="button" 
                    class="btn btn-secondary" 
                    data-toggle="tooltip" 
                    data-placement="rigth" 
                    title="Choisir une image"
                    aria-label="Choisir une image"
                    @click="btnImage">
                    Image <b-icon icon="image" scale = "1.5" aria-hidden = "true"></b-icon></b-button>
                </b-col>
                <b-col cols="2">
                    <b-button
                    type="button" 
                    class="btn btn-secondary" 
                    data-toggle="tooltip" 
                    data-placement="rigth" 
                    title="Double choix"
                    aria-label="Double choix"
                    @click="btnDouble"><b-icon icon="plus" scale = "1.5" aria-hidden = "true"></b-icon></b-button>
                </b-col>
                <b-row>
                    <b-col v-if="selectImage">
                        <div >
                            <b-card class="bg-secondary">
                                <b-form-group>
                                    <b-form-file 
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
                            </b-card>
                            
                        </div>
                    </b-col>
                    <b-col v-if="selectLink">
                        <div >
                            <b-card>
                                <b-form-group>
                                    <b-form-input 
                                        class="border border-info"
                                        name="link"
                                        label="lien media"
                                        v-model="link"
                                        >
                                    </b-form-input>
                                    <div class="mt-2">LIEN: "{{ link }}"</div>
                                </b-form-group>
                            </b-card>
                        </div>
                    </b-col>
                </b-row>
                    <b-col class="py-3" cols="10"></b-col>
                    <b-col class="py-3" col lg="2">
                        <b-form-group>
                        <input type="submit" value="ENVOYER" />
                        </b-form-group>
                    </b-col>
                        </b-row>
                </b-form>
            </b-row>
            <b-row>
                <b-col></b-col>
                <b-col>
                <!-- <b-bouton variant="outline-success">ENVOYER</b-bouton> -->
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
// import axios from 'axios';
import FormData from 'form-data';
// import fs from 'fs';

// import axios from 'axios'
    export default {
        name: 'WallWrite',

        data() {
            return {

                showLink: true,
                showImage: false,
                selectLink: false,
                selectImage: false,
                options: true,
                content: '',
                file: '',
                link: null,
                
                auth: this.$store.state.authToken,
                USER: this.$store.state.user.userId,
            }
        },

        mounted: function () {
             if (this.$store.state.user.userId == -1) {
                this.$router.push('/');
                return ;
            }
        },

        methods: {

                btnLink() {
                    (this.selectLink = true), (this.selectImage = false);                    
                },

                btnImage() {
                    (this.selectImage = true), (this.selectLink = false);
                },

                btnDouble() {
                    (this.selectImage = true), (this.selectLink = true);
                },


                onFileUpload (event) {
                    this.file = event.target.files[0]
                },
 

                monSubmit(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    console.log("voir USERID: ", this.USER);
                    formData.append('id', this.USER);
                    // if (this.file !== null) {
                    //     // formData.append('image', this.file)
                    // }
                    for (let cur of formData.entries())
                        console.log(cur[1]);
                    
                    fetch("http://localhost:3000/api/contents/", {
                        method: "POST",
                        body: formData, headers: {"authorization":  this.auth.authorization}} 
                    )
                    document.location.reload();
                },

        }
    }

</script>

<style lang="scss" scoped>

</style>