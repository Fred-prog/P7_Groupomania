<template>
     <div id="loginAuth">
         <b-container>
            <b-card>
                <b-card-title v-if="mode == 'login'">Connexion</b-card-title>
                <b-card-title v-else>Inscription</b-card-title>
                <b-card-text  v-if="mode == 'login'">Tu n'as pas encore de compte ? <b-link @click="switchToCreateAccount()">Créer un compte</b-link></b-card-text>
                <b-card-text  v-else>Tu as déjà un compte ? <b-link @click="switchToLogin()">Se connecter</b-link></b-card-text>
                <b-card class="form-row">
                <input v-model="email" class="form-row__input" type="text" placeholder="Adresse mail"/>
            </b-card>
            <b-card class="form-row" v-if="mode == 'create'">
                <input v-model="username" class="form-row__input" type="text" placeholder="Username"/>
            </b-card>
            <b-card class="form-row">
                <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe"/>
            </b-card>
            <b-card class="form-row" v-if="mode == 'login' && status == 'error_login'">
                Adresse mail et/ou mot de passe invalide
            </b-card>
            <b-card class="form-row" v-if="mode == 'create' && status == 'error_create'">
                Le compte n'a pas été créé !
            </b-card>
            <b-card class="form-row">
                <button @click="login()" class="button" :class="{'button--disabled' : !validatedFields}" v-if="mode == 'login'">
                    <span v-if="status == 'loading'">Connexion en cours...</span>
                    <span v-else>Connexion</span>
                </button>
                <button @click="signup()" class="button" :class="{'button--disabled' : !validatedFields}" v-else>
                    <span v-if="status == 'loading'">Création en cours...</span>
                    <span v-else>Créer mon compte</span>
                </button>
            </b-card>
            </b-card>
         </b-container>
    </div>
</template>

<script>
import { mapState } from 'vuex'


    export default {
        name: 'LoginAuth',

         data: function () {
            return {
            mode: 'login',
            email: '',
            username: '',
            password: '',
            }
        },
        mounted: function () {
            if (this.$store.state.user.userId != -1) {
            this.$router.push('/Wall');
            return ;
            }
        },
        
        computed: {
            validatedFields: function () {
            if (this.mode == 'create') {
                if (this.email != "" && this.username != "" && this.password != "") {
                return true;
                } else {
                return false;
                }
            } else {
                if (this.email != "" && this.password != "") {
                return true;
                } else {
                return false;
                }
            }
            },
            ...mapState(['status'])
        },
        methods: {
            switchToCreateAccount: function () {
            this.mode = 'create';
            },

            switchToLogin: function () {
            this.mode = 'login';
            },

            login: function () {
                const self = this;
                this.$store.dispatch('login', {
                    email: this.email,
                    password: this.password,
                }).then(function () {
                    self.$router.push('/Wall');
                }, function (error) {
                    console.log(error);
                })
            },

                signup: function () {
                const self = this;
                this.$store.dispatch('signup', {
                    email: this.email,
                    username: this.username,
                    password: this.password,
                }).then(function () {
                    self.login();
                }, function (error) {
                    console.log(error);
                })
            },
        }
}
</script>

<style lang="scss" scoped>

</style>