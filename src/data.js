// Initialize Firebase
var config = {
    apiKey: "AIzaSyDblgQKEDvEZWnkfqvDkKM1GXZtRkkwBrI",
    authDomain: "social-network-8a5ae.firebaseapp.com",
    databaseURL: "https://social-network-8a5ae.firebaseio.com",
    projectId: "social-network-8a5ae",
    storageBucket: "social-network-8a5ae.appspot.com",
    messagingSenderId: "451218277174"
};
firebase.initializeApp(config);

window.loadDataMuro = (userId) => {
    //console.log('entra a loadData de ' + userId);
    firebase.database().ref('user-posts/' + userId).on('child_added', function (snapshot) {
        //console.log(snapshot.val())
        var post = snapshot.val().body;
        var idPost = snapshot.val().id;
        //llamar funcion elementos
        crearElementos(userId, idPost, post);     
    });
}

window.loadDataPublic = () => {
    var ref = firebase.database().ref("posts");
    ref.orderByChild("status").equalTo('public').on("child_added", function (snapshot) {
        //console.log(snapshot.val());
        var post = snapshot.val().body;
        var idPost = snapshot.val().id;
        const userId = snapshot.val().uid;
        crearElementosPublic(userId, idPost, post);
    });
   
}

let userId=null;


window.onload = () => {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userId= user.uid;
            console.log(user.uid)
            login.classList.add("hidden");
            //wall.classList.remove("hidden");
            posts.classList.remove("hidden");
            logo.classList.add("hidden");
            navbar.classList.remove("hidden");
            sideBar.classList.remove("hidden")
            console.log("Usuario logueado");
            console.log(user.uid);
            //loadData(user.uid);
            posts.innerHTML=''//para q borre y pinte lo q haya
            loadDataPublic()
            
        } else {
            console.log("No esta logueado")
            login.classList.remove("hidden");
            wall.classList.add("hidden");
            posts.classList.add("hidden");
            logo.classList.remove("hidden");
            navbar.classList.add("hidden");
            sideBar.classList.add("hidden")
        }
    });

}



const btnPostsPublic = document.getElementById('publico')
btnPostsPublic.addEventListener('click', () => {
    console.log('hola')
    //posts.innerHTML='';
    //document.getElementById('wall').style.display = 'none';
    //muro = 0;
    //console.log('public: ' + muro);
    //loadDataPublic();
    location.reload();
})

const btnPostsMuro= document.getElementById('muro')
btnPostsMuro.addEventListener('click', () => {
    console.log('hola')
    posts.innerHTML='';
    document.getElementById('wall').style.display = 'block';
    loadDataMuro(userId)
})


window.writeUserData = (userId, name, nickName, email, imageUrl) => {
    firebase.database().ref('users/' + userId).set({
        username: name,
        userNickName: NickName,
        email: email,
        profile_picture: imageUrl,
        displayName: name
    });
}

window.writeNewPost = (uid, body, status) => {
    // A post entry.
    let postData = {
        uid: uid,
        body: body,
        likes: 0,
        status: status


    };

    // genera un id para la publicacion
    var newPostKey = firebase.database().ref().child('posts').push().key;

    // Registrar en el objeto posts y user-post la nueva publicación
    var updates = {};
    postData.id = newPostKey;

    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + postData.uid + '/' + newPostKey] = postData;


    firebase.database().ref().update(updates);
    return newPostKey

}





//funcion para eliminar posts
window.deletePost = (contPost, userId) => {
    //alert('hola ' + contPost); return false;
    console.log("userId", userId)
    console.log("contPost", contPost)
    firebase.database().ref().child('/user-posts/' + userId + '/' + contPost).remove();
    firebase.database().ref().child('posts/' + contPost).remove();
}
window.updatePost = (userId, newPost, nuevoPost) => {
    firebase.database().ref('/user-posts/' + userId + '/' + newPost).update(nuevoPost);
    firebase.database().ref('/posts/' + newPost).update(nuevoPost);
}