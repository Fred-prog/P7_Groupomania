import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import axios from "axios";


Vue.use(Vuex)

// const axios = require('axios')

const instanceAuth = axios.create({baseURL: 'http://localhost:3000/api/auth/'})
const instanceApi = axios.create({baseURL: 'http://localhost:3000/api/'})


let user = localStorage.getItem('user');
if (!user) {
  user = {
    userId: -1,
    token: '',
  }; 
} else {
  try {
    user = JSON.parse(user);
    instanceAuth.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}

let authHeader = function() {
  let user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    // for Node.js Express back-end
    return { authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
  
}



export default new Vuex.Store({
  // ELEMENT DU STATE 
  state: {
    status: '',
    user: user,
    isLoggedIn: false,
    userInfos: {
      email: '',
      username: '',
      avatar: '',
      // moderator: '',
    },
    authToken: authHeader(),
    userId: '',
    dataPosts: '',
    posts: [],
    post: {}, 
    users: [],
    oneUser: {},
    userPosts: {},

    message: "",
    error: "",

  },

  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],

// ---------------- LES GETTERS ------------------------ //


  getters: {

    posts(state) {
      return state.posts;
    },

    post(state) {
      return state.post;
    },

    commentPost: state => {
      return state.dataPosts.filter(dataPost => dataPost.comment)
    },

    oneUser(state) {
      return state.oneUser;
    },

    isLogged(state) {
      return state.isLoggedIn;
    },

    getUserPosts(state) {
      return state.userPosts;
    },

    getUsers(state) {
      return state.users;
    }
  },

// ----------------- LES MUTATIONS -----------------------//

  mutations: {

  // STATUS 
  setStatus: function (state, status) {
    state.status = status;
  },
  
  // LOG

  logUser: function (state, user) {
    console.log("voir user token avant", user.token);
    instanceAuth.defaults.headers.common['Authorization'] = user.token;
    localStorage.setItem('user', JSON.stringify(user));
    state.user = user;
    state.isLoggedIn = true;
  },

  logout: function (state) {
    state.user = {
      userId: -1,
      token: '',
    }
    localStorage.removeItem('user');
    state.isLoggedIn = false;
  },

// USER

  SET_USER(state, user) {
    state.oneUser = user;
  },

  GET_ALL_USERS: function (state, users) {
    state.users = users;
  },

  GET_ONE_USER: function (state, oneUser) {
    state.oneUser = oneUser;
  },
  
  GET_USER_POSTS: function (state, userPosts) {
    state.userPosts = userPosts
  },

  UPDATE_ACCOUNT(state, id, user) {
    Object.assign(
      state.users.find((element) => element.id === id),
      user
    );
    state.message = "compte modifié";
  },
  
  DELETE_ACCOUNT(state, id) {
    state.users = [...state.users.filter((element) => element.id !== id)];
    state.message = "compte supprimé";
  },

// POSTS 

    GET_POST(state, posts) {
      (state.posts = posts)
    },
    
    GET_POST_BY_ID(state, post) {
      state.post = post;
    },

    UPDATE_POST(state, id, post) {
      Object.assign(
        state.posts.find((element) => element.id === id),
        post
      );
      state.message = " post modifié";
    },

    DELETE_POST(state, id) {
      state.posts = [...state.posts.filter((element) => element.id !== id)];
      state.message = "post supprimé";
    },

// COMMENT

    COMMENT_POST(state, comment) {
      state.posts = [comment, ...state.posts];
      state.message = "post commenté";
    },

    DELETE_COMMENT(state, id) {
      state.posts = [...state.posts.filter((element) => element.id !== id)];
      state.message = "post commenté";
    },

    ALERT(state, id, post) {
      Object.assign(
        state.posts.find((element) => element.id === id),
        post
      );
    },

  },

// ------------------- LES ACTIONS ------------------- //


  actions: {

// Authentification ------------------- //

    login: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instanceAuth.post('/login', userInfos)
        .then(function (response) {
          commit('setStatus', '');
          commit('logUser', response.data);
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error_login');
          reject(error);
        });
      });
    },
    
    signup: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instanceAuth.post('/signup', userInfos)
        .then(function (response) {
          commit('setStatus', 'created');
          resolve(response);
        })
        .catch(function (error) {
          commit('setStatus', 'error_create');
          reject(error);
        });
      });
    },


// -------------- FIN Authentification ------------------- //

// -------------- GET USER ------------------------------- //

    setUser({ commit }, user) {
      commit("SET_USER", user);
    },

    getUsers({ commit }) {
      instanceAuth.get('/accounts', {headers: authHeader()})
          .then (function (response) {
            const AllUsers = response.data;
            commit('GET_ALL_USERS', AllUsers)
          })
    },

    getOneUser({ commit }) {
      let id = this.state.user.userId;
      instanceAuth.get("/accounts/" + id, {headers: authHeader()})
      .then((response) => {
        const oneUser = response.data;
        commit("GET_ONE_USER", oneUser);
    });
   },

   updateAccount({ commit }, data) {
    let id = this.state.user.userId;
    axios
      .put(`http://localhost:3000/api/auth/accounts/${id}`, data,
      {
        headers: authHeader()
      })
      .then((response) => {
        const updateUser = response.data;
        commit("UPDATE_ACCOUNT", id, updateUser);
      })
   },

   deleteAccount({ commit }, id) {
    instanceAuth.delete("/accounts/" + id)
      .then(() => {       
          commit("DELETE_ACCOUNT", id);
      })
      .then(() => {
        instanceAuth.get('/accounts', {headers: authHeader()})
          .then (function (response) {
            const AllUsers = response.data;
            commit('GET_ALL_USERS', AllUsers)
          })
      })

  },

// ACTION POST

  getRecentPost({ commit }, id) {
    instanceApi.get("/posts/" + id, {headers: authHeader()})
      .then((response) => {
        const userPosts = response.data;
        commit("GET_USER_POSTS", userPosts);
      });
  },


    //GET PUBLICATION
    getPosts ({ commit })  {
        instanceApi.get('/contents', {headers: authHeader()})
          .then (function (response) {
            const posts = response.data;
            commit('GET_POST', posts)
          })
    },

    getPostById({ commit }, id) {
      instanceApi.get('/contents/' + id, {headers: authHeader()})
          .then((response) => {
          const post = response.data;
          commit("GET_POST_BY_ID", post);
      });
    },

    createPublication: ({commit}) => {
        return new Promise((resolve, reject) => {
        commit;
        instanceApi.post('/contents', {headers: authHeader()})
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
      });
    },

    updatePost({commit}, data) {
      let id = this.state.post.id;
      axios
          .put(`http://localhost:3000/api/contents/${id}`,data,
          {headers: authHeader()})
            .then((response) => {
              const post = response.data;
              commit('UPDATE_POST', id, post);
            })
    },

    deletePost({ commit }, id) {
        instanceApi.delete('/contents/' + id, {headers: authHeader()})
        .then(() => {
          commit("DELETE_POST", id);
        })
        .then(() => {
          instanceApi.get('/contents', {headers: authHeader()})
          .then (function (response) {
            const posts = response.data;
            commit('GET_POST', posts)
          })
        })
    },

    //------------- ALERT -------------------------- //


    alertPost({commit}, data) {
      let id = this.state.post.id;
      axios
          .put(`http://localhost:3000/api/contents/${id}/alerts`,data,
          {headers: authHeader()})
            .then((response) => {
              const post = response.data;
              commit('ALERT', id, post);
            })
    },
    
    //------------- COMMENT ------------------------ //

    commentPost({ commit }, payload) {
      axios
        .post(
          `http://localhost:3000/api/contents/${payload.id}/comments`,
          payload.data,
          {headers: authHeader()})
        .then((response) => {
          const comment = response.data;
          commit("COMMENT_POST", comment);
        })
          .then(() => {
              instanceApi.get('/contents', {headers: authHeader()})
                .then((response) => {
                   const posts = response.data;
                  commit("GET_POSTS", posts);
              });
          });
    },

    deleteComment({ commit }, id) {
      instanceApi.delete('/contents/comments/' + id, {headers: authHeader()})
        .then(() => {
          commit("DELETE_COMMENT", id);
        })
          .then(() => {
            instanceApi.get('/contents', {headers: authHeader()})
            .then (function (response) {
              const posts = response.data;
              commit('GET_POST', posts)
            })
          })
    },
  
  },
})
