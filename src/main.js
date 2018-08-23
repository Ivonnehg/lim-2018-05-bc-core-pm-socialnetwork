const login = document.getElementById("login");
const logout = document.getElementById("logout")
const btnLogOut = document.getElementById("btnLogout");
const btnLogout2 = document.getElementById("btnLogout2");
const btnSignIn = document.getElementById("signinbtn");
const register = document.getElementById("register");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const emailSigned = document.getElementById("email-signed");
const passwordSigned = document.getElementById("password-signed");
const btnGoogle = document.getElementById("btnGoogle");
const btnFacebook = document.getElementById("btnFacebook");
const wall = document.getElementById("wall");
const btnPost = document.getElementById("btnPost");
const post = document.getElementById("post");
const posts = document.getElementById("posts");
const username = document.getElementById("user-name");
const logo = document.getElementById("logo");
const navbar = document.getElementById("navbar");
const sideBar = document.getElementById("side-bar");
let checkBox = document.getElementById("check-box");
const btnPublic = document.getElementById('btnpublic');
const btnPrivate = document.getElementById('btnprivate')


//es codigo relacionado al menu del css
$(document).ready(function () {
    $('.collapsible').collapsible();
    $(".dropdown-trigger").dropdown();
    //console.log(document);
});

let status = ''
btnPublic.addEventListener('click', () => {
    status = 'public';
    //alert("ingresa estado")
})
btnPrivate.addEventListener('click', () => {
    status = 'private';
    //alert("ingresa estado")
})

let muro = 0;
//funcionabilidad de potear    
btnPost.addEventListener('click', () => {
    if (post.value === "") {
        M.toast({ html: 'Mensaje vacio, intenta de nuevo' })
    }
    else {
        let userId = firebase.auth().currentUser.uid;
        console.log('estado: ' + status);
        muro = 1;
        console.log('muro: ' + muro);
        writeNewPost(userId, post.value, status);
        //crearElementos(userId,post.value);
        //,newPost
    }
})

register.addEventListener("click", () => {
    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
        .then(function () {
            //console.log("Se creo el usuario");
        })
        .catch(function (error) {
            //console.log(error.code, error.message);
        });
})

btnSignIn.addEventListener("click", () => {
    //console.log("hola")
    firebase.auth().signInWithEmailAndPassword(emailSigned.value, passwordSigned.value)

        .then(function (result) {
            //console.log("Inicia sesion");
            let user = result.user;
            writeUserData(user.uid, user.displayName, '', user.email, user.photoURL)
        })
        .catch(function (error) {
            //console.log(error.code, error.message);
            let errorCode = error.code;
            if (errorCode === 'auth/wrong-password') {
                M.toast({ html: 'Contraseña incorrecta, vuelve a intentarlo' })
              }
              else {
                M.toast({ html: 'Usuario incorrecto, vuelve a intentarlo' })
              }
        });
        
})

btnLogOut.addEventListener("click", () => {
    firebase.auth().signOut()
        .then(function () {
            console.log("Cerro Sesion");
            login.classList.remove("hidden");
            logout.classList.add("hidden");
        }).catch(function (error) {
            console.log("Error al cerrar sesion")
        });
})

btnGoogle.addEventListener("click", () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log("Sesion con Google");
            let user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL)
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);
        });
})

btnFacebook.addEventListener("click", () => {
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
        'display': 'popup'
    });
    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            console.log("Logueado con Facebook")
            let user = result.user;
            writeUserData(user.uid, user.displayName, user.email, user.photoURL)
        }).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
            console.log(error.email);
            console.log(error.credential);
        });
})

function crearElementos(userId, newPost, texto, privado) {
    console.log('entra a crear');
    let contador = 0;
    let nrolikes = document.createElement("span");
    nrolikes.innerHTML = contador;
    
    var btnlike = document.createElement("input");
    btnlike.setAttribute("value", "like");
    btnlike.setAttribute("type", "button");
    btnlike.setAttribute("id", "btnlike");
    btnlike.setAttribute("class", "btn waves-effect waves-light");

    var btnEdit = document.createElement("input");
    btnEdit.setAttribute("value", "Edite");
    btnEdit.setAttribute("type", "button");
    btnEdit.setAttribute("id", "btnEdit");
    btnEdit.setAttribute("class", "btn waves-effect waves-light");

    var btnSave = document.createElement("input");
    btnSave.setAttribute("value", "Save");
    btnSave.setAttribute("type", "button");
    btnSave.setAttribute("id", "btnSave");
    btnSave.setAttribute("class", "btn waves-effect waves-light teal darken-4 hide");

    var btnDelete = document.createElement("input");
    btnDelete.setAttribute("value", "Delete");
    btnDelete.setAttribute("type", "button");
    btnDelete.setAttribute("id", "btnDelete");
    btnDelete.setAttribute("class", "btn modal-trigger teal lighten-4");
    btnDelete.setAttribute("data-target", "modal1");
    
    var contPost = document.createElement('div');
    var textPost = document.createElement('input');
    textPost.value = texto;

    textPost.setAttribute("id", newPost);
    textPost.setAttribute("disabled", "disabled");
    

    

    btnDelete.addEventListener('click', () => {
        const opcion = confirm("Estas seguro que deseas eliminar este post");
        if (opcion == true) {
            while (contPost.firstChild) contPost.removeChild(contPost.firstChild);
            M.toast({ html: 'Tu publicacion ha sido eliminada' })
            //window.btnDelete(post.id)
            console.log("post a eliminar", post);
            deletePost(textPost.id, userId);

        }
        else {
            ;
        }
    });

    
    btnEdit.addEventListener('click', () => {
        
        textPost.removeAttribute("disabled");
        btnEdit.classList.add("hide");
        btnSave.classList.remove("hide");


        console.log("diste click " + newPost);

        btnSave.addEventListener('click', () => {
            
        const newUpdate = document.getElementById(newPost);
        const nuevoPost = {
            body: newUpdate.value
        };
        updatePost(userId, newPost, nuevoPost,textPost)
        btnEdit.classList.remove("hide");
        btnSave.classList.add("hide");

        })
        
    

        
    }

);


    btnlike.addEventListener('click', () => {
        contador ++;

        console.log(contador);
        nrolikes.innerHTML = contador;

        //const newUpdate = document.getElementById(newPost);
        // const nuevoLike = {

        // };
        // //agregar idusuario como clave dinamica
        // nuevoLike[userId] = 1;

        // firebase.database().ref('posts/' + newPost + "/likes/" + userId).once("value")
        //     .then(function (snapshot) {//evalua si existe la ruta y lo devuelve

        //         if (snapshot.exists()) {//metodo exists
        //             console.log("ya tiene like");
        //             //si el like del usuario ya existe lo elimina 
        //             firebase.database().ref().child('/user-posts/' + userId + '/' + newPost + "/likes/" + userId).remove();
        //             firebase.database().ref().child('posts/' + newPost + "/likes/" + userId).remove();
        //             btnlike.style.backgroundColor = "grey";


        //             return false;
        //         } else {
        //             console.log("no tiene like");
        //             //insertar like del usuario
        //             firebase.database().ref('/user-posts/' + userId + '/' + newPost + "/likes").update(nuevoLike);
        //             firebase.database().ref('/posts/' + newPost + "/likes").update(nuevoLike);
        //             btnlike.style.backgroundColor = "green";
        //             let contador = 0;
        //             //document.getElementById("btnlike").onclick = function () {
        //                 contador++;
        //                 alert(contador);

        //             }
        //             // return false;
        //         }

        //     });



    });

    contPost.appendChild(textPost);
    contPost.appendChild(nrolikes);
    contPost.appendChild(btnlike);    
    contPost.appendChild(btnEdit);
    contPost.appendChild(btnSave);
    contPost.appendChild(btnDelete);
    
    posts.appendChild(contPost);

}


function crearElementosPublic(userId, newPost, texto) {
    console.log('entra a crear public');
    let contadorPublic = 0;
    let likePublic = document.createElement("span");
    likePublic.innerHTML = contadorPublic;
       
    var btnlikepublic = document.createElement("input");
    btnlikepublic.setAttribute("value", "like");
    btnlikepublic.setAttribute("type", "button");
    btnlikepublic.setAttribute("id", "btnlikepublic");
    btnlikepublic.setAttribute("class", "btn waves-effect waves-light");

    var contPost = document.createElement('div');
    var textPost = document.createElement('div')
    textPost.setAttribute("id", newPost);
    textPost.setAttribute("class", "textPublic");

    textPost.innerHTML = texto;   
       
        //const newUpdate = document.getElementById(newPost);
        
        //agregar idusuario como clave dinamica
    

    firebase.database().ref('posts/' + newPost + "/likes/" + userId).once("value")
        .then(function (snapshot) {//evalua si existe la ruta y lo devuelve

            if (snapshot.exists()) {//metodo exists
                console.log("ya tiene like");
                //si el like del usuario ya existe lo elimina 
                firebase.database().ref().child('/user-posts/' + userId + '/' + newPost + "/likes/" + userId).remove();
                firebase.database().ref().child('posts/' + newPost + "/likes/" + userId).remove();
                btnlikepublic.style.backgroundColor = "grey";


                return false;
            } else {
                console.log("no tiene like");
                //insertar like del usuario
                firebase.database().ref('/user-posts/' + userId + '/' + newPost + "/likes").update(contadorPublic);
                firebase.database().ref('/posts/' + newPost + "/likes").update(contadorPublic);
                btnlikepublic.style.backgroundColor = "green";
                //var contador = 0;
                //document.getElementById("btnlikepublic").onclick = function () {
                    // contador++;
                    // alert(contador);

                //}
                // return false;
            }
    });

   
    
    console.log('func: ' + muro);
    if(muro == '0'){
    contPost.appendChild(textPost);
    contPost.appendChild(likePublic);
    contPost.appendChild(btnlikepublic);    
    posts.appendChild(contPost);
    }

    btnlikepublic.addEventListener('click', () => {
        contadorPublic++;
        likePublic.innerHTML = contadorPublic;
    });
}