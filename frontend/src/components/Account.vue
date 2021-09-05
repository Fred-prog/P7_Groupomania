<template>
    <div class="overflow-auto" style="max-height: 750px">
        <b-container>
            <!-- retour au mur -->
            <b-card>
                <b-card-title>
                    <h1>Modifier votre profil</h1>
                </b-card-title>
                <button
                type="button" 
                class="btn btn-secondary" 
                data-toggle="tooltip" 
                data-placement="rigth" 
                title="Retour au mur"
                aria-label="retour au mur"
                @click="backToWall()">
                Retour  <b-icon icon="back" scale = "1.5" aria-hidden = "true"></b-icon>
                </button>
            </b-card>
            <b-card>
                <b-card-title>
                    <span>Bonjour {{ user.username }} ! </span>
                </b-card-title>
                <b-card-text>
                    <b-row>
                        <b-col v-if="ShowUsername">
                            <span>Nom de l'utilisateur : </span>
                            <span> {{ user.username }} </span>
                        </b-col>
                        <b-col>
                        <button
                        type="button" 
                        class="btn btn-secondary" 
                        data-toggle="tooltip" 
                        data-placement="rigth" 
                        title="Tooltip on bottom"
                        aria-label="modifier l'username"
                            @click="updateUsername"
                            >Modifier  <b-icon icon="pencil-square" scale = "1.5" aria-hidden = "true"></b-icon>
                            </button>
                        </b-col>
                    </b-row>
                </b-card-text>
            </b-card>
            <b-card>
                <b-card-text v-if="NewUsername">
                    <b-textarea label="username"
                    v-model="userName"
                    required>
                    </b-textarea>
                </b-card-text>
            </b-card>
            <b-card>
                <b-card-title>
                    <span>Avatar</span>
                </b-card-title>
                <b-card-body>
                    <b-col cols="6">
                    <b-img class="rounded-circle" fluid alt="Responsive image" v-if="user.avatar" :src="user.avatar" data-holder-rendered="true">
                    </b-img>

                    <b-img v-else class="rounded-circle bg-secondary" atl="10x10" ser="#">
                    </b-img>
                    </b-col>
                </b-card-body>
                    <button
                    type="button" 
                    class="btn btn-secondary" 
                    data-toggle="tooltip" 
                    data-placement="rigth" 
                    title="Tooltip on bottom"
                    aria-label="modifier l'avatar"
                        @click="updateAvatar">
                        Modifier <b-icon icon="pencil-square" scale = "1.5" aria-hidden = "true"></b-icon>
                    </button>
            </b-card>
            <b-card v-if="NewAvatar">
                <b-card-body>
                    <b-form  @submit="updateProfil">
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
                        </b-form-group>
                        <b-card-body>
                            <b-form-group>
                                <input type="submit" value="ENVOYER" />
                            </b-form-group>
                        </b-card-body>
                    </b-form>
                </b-card-body>
            </b-card>
        </b-container>
    </div>
</template>

<script>
    export default {
        name: 'Account',

        data() {
            return {
                ShowUsername: true,
                NewUsername: false,
                ShowAvatar: true,
                NewAvatar: false,

                userName: "",
                file: "",
                USER: this.$store.state.user.userId,
            }
        },

        computed: {
            user() {
                return this.$store.getters.oneUser;
            },
        },

        beforeMount() {
            this.$store.dispatch("getOneUser");
        },

        methods: {
            backToWall() {
                this.$router.push("/Wall");
            },

            updateUsername() {
                if (this.ShowUsername == true) {
                    this.ShowUsername = false;
                    this.NewUsername = true;
                } else {
                    this.ShowUsername = true;
                    this.NewUsername = false;
                }
            },

            updateAvatar() {
                if (this.ShowAvatar == true) {
                    this.ShowAvatar = false;
                    this.NewAvatar = true;
                } else {
                    this.ShowAvatar = true;
                    this.NewAvatar = false;
                }
            },

            uploadImage() {
                const file = this.$refs.file.files[0];
                this.file = file;
            },

            updateProfil(e) {
                e.preventDefault();
                // let id = this.$route.params.id;
                const formData = new FormData(e.target);
                // formData.append("userId", this.USER)
                if (this.userName !== null) {
                    formData.append("username", this.userName);
                }
                
                formData.append("image", this.file);
                this.$store.dispatch("updateAccount", formData)
                this.$store.dispatch("getOneUser");
            },

            deleteAccount(id) {
                this.$store.dispatch("deleteAccount", id);
                this.$store.dispatch("logOut");
                this.$store.commit('logout');
                this.$router.push('/');
                // setTimeout(() => {
                //     this.getBackHome();
                // }, 2000);
    },

        },
    }
</script>

<style lang="scss" scoped>

</style>