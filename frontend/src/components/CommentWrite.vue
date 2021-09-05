<template>
    <div class="my-3">
        <b-container class="border px-3 py-3 rounded">
            <b-row>
                <b-col cols="1">
                    <p>User</p>
                </b-col>
            </b-row>
            <b-row>
                <b-form id="form" @submit="comSubmit">
                    <b-col cols="6">
                    <b-form-group>
                        <label for="content">ecrivez votre commentaire:</label>
                        <b-form-textarea 
                        id="textarea"
                        name="content"
                        placeholder="entrer votre commentaire"
                        rows="1"
                        max-rows="1"
                        class="rounded-pill"
                        v-model="content"></b-form-textarea>
                    </b-form-group>
                    </b-col>
                    <b-col cols="6">
                    <b-form-group>
                    <input type="submit" value="ENVOYER" />
                    </b-form-group>
                </b-col>
                </b-form>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    import FormData from 'form-data';
    export default {
        name: 'commentWrite',

            data() {
                return {

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

            comSubmit(e) {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    formData.append('id', this.USER);

                    for (let cur of formData.entries())
                        console.log(cur[1]);
                    
                    fetch("http://localhost:3000/api/contents/", {
                        method: "POST",
                        body: formData, headers: {"authorization":  this.auth.authorization}} 
                    )
                },
    }
</script>

<style lang="scss" scoped>

</style>