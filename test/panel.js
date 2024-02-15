/*
Pequeño mensaje para el programador que herede este codigo:

Olvidate de las busnas practicas y del modelo cliente-servidor,
aqui la base de datos esta conectada al fronend,
y si no entiendes como funciona la base de datos no te preocupes
yo tampoco se simplemente revisa el codigo y ve cuales son los 
metodos para ver, agregar y eliminar,
si quieres actualizar algo en la db agrega un nuevo objeto y borra el anterior

Estos son valores que deberas entender:

 DB      HTML       UI
activo = ------   = ----    = Indicas si este jugador es un grupo
grupo  = grupo    = grupo   = Nombre del grupo, si es un grupo
first  = nombre   = nombre  = Indicas el nombre del jugador, nombre del jugador si es un jugador
last   = apellido = pibas   = Indicas las pibas del jugador
born   = fecha    = puntos  = Indicas los puntos del jugador

Este sistema es asi gracias al anterior programador, que no supo hacer una web
por favor actualice este contador:
var cantidad_de_horas_invertidas_por_40_dolares = 4;

*/

//botones


function aceptar() {
    document.getElementById("block").hidden = true;
    document.getElementById("message").hidden = true;
};

function rechazar() {
    alert("No has aceptado las condiciones para acceder al panel.");
};


firebase.initializeApp({
    apiKey: 'AIzaSyBojnsHjisbzlhmzzn5lAdsphhWGF4IAzA',
    authDomain: 'puntos-trabajo.firebaseapp.com',
    projectId: 'puntos-trabajo'
});

var db = firebase.firestore()
var seleccionado = undefined;

document.getElementById('nombre').hidden = true;
document.getElementById('apellido').hidden = true;
document.getElementById('fecha').hidden = true;
document.getElementById('boton').hidden = true;

function guardar() {
    //let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido').value;
    let fecha = document.getElementById('fecha').value;
    //document.getElementById('boton').hidden = false;

    /* db.collection("users").get()
     .then(function (docRef) {
         let docs = docRef.docs//[0].data();
 
         for (let index = 0; index < docs.length; index++) {
             const doc = docs[index];
             if (doc.id = id){*/
    db.collection("users").doc(seleccionado).get()
        .then(function (docuwu) {
            let nombre = docuwu.data().first;

            eliminar(seleccionado, true);

            db.collection("users").add({
                activo: false,
                first: nombre,
                last: apellido,
                born: fecha
            })
                .then(function (docRef) {
                    /*document.getElementById('nombre').value = '';
                    document.getElementById('apellido').value = '';
                    document.getElementById('fecha').value = '';*/
                    seleccionado = undefined;
                    cancelar()
                    pintar()
                })
                .catch(function (error) {
                    console.error(`error`)
                    seleccionado = undefined;
                    cancelar()
                    pintar()
                })

        }).catch(function (error) {
            console.error(error)
            seleccionado = undefined;
            cancelar()
            pintar()
        })


    return;
}
/*     }
 })
 .catch(function (error) {
     console.error(`error`)
 })*/
/*
db.collection("users").add({
    first: nombre,
    last: apellido,
    born: fecha
})
    .then(function (docRef) {
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('fecha').value = '';
    })
    .catch(function (error) {
        console.error(`error`)
    })
}*/

function eliminar(id, bypass = false) {

    let seguro;
    if (!bypass) {
        seguro = confirm("Estas seguro que quieres borrar este usuario?")
    } else {
        seguro = true;
    }


    if (seguro) {

        db.collection("users").doc(id).delete().then(function () {
            console.log("Documment")
            pintar()
        }).catch(function (error) {
            console.error(error)
        })

    }
}

function editar(id, first, last, born) {

    if (seleccionado != undefined) {
        document.getElementById('edit-' + seleccionado).hidden = false;
        document.getElementById('can-' + seleccionado).hidden = true;
    }

    document.getElementById('edit-' + id).hidden = true;
    document.getElementById('can-' + id).hidden = false;

    document.getElementById('nombrecito').hidden = false;
    document.getElementById('nombrecito').innerText = first;
    document.getElementById('boton').hidden = false;
    document.getElementById('apellido').hidden = false;
    //document.getElementById('apellido').placeholder = last;
    document.getElementById('fecha').hidden = false;
    //document.getElementById('fecha').placeholder = born;
    seleccionado = id;
}

function cancelar() {

    if (seleccionado != undefined) {
        document.getElementById('edit-' + seleccionado).hidden = false;
        document.getElementById('can-' + seleccionado).hidden = true;
    }

    document.getElementById('apellido').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('nombrecito').hidden = true;
    document.getElementById('nombrecito').innerText = "nombre";
    document.getElementById('boton').hidden = true;
    document.getElementById('apellido').hidden = true;
    document.getElementById('fecha').hidden = true;
    document.getElementById('apellido').value = "";
    document.getElementById('fecha').value = "";

}


function pintar() {
    let tabla = document.getElementById('tabla')
    db.collection("users").onSnapshot((querySnapshot) => {
        tabla.innerHTML = ""
        tabla.hidden = true;
        let documentos = [];

        querySnapshot.forEach((doc) => {
            //console.log(`${doc.id} => ${doc.data().first}`)
            if (!doc.data().activo) {
                documentos.push({
                    "id": doc.id,
                    "nombre": doc.data().first,
                    "pibas": doc.data().last,
                    "activo": doc.data().activo,
                    "puntos": doc.data().born
                })
            }
        })

        documentos.sort((a, b) => {
            return a.pibas - b.pibas
        })

        documentos.sort((a, b) => {
            return a.puntos - b.puntos
        })

        documentos.reverse()

        for (let index = 0; index < documentos.length; index++) {
            const doc = documentos[index];
            if (doc.activo) continue;
            tabla.innerHTML += `
            <tr style="gap:2rem; class="old first">
            <td class="top">#${index + 1}</td>
            <td>${doc.nombre}</td>
            <td class="min-wid-20">&nbsp;${doc.pibas}</td>
            <td class="min-wid-20">&nbsp;${doc.puntos}</td>
            
            <td><button class="btn btn-danger" style="max-width:6rem;" onclick="eliminar('${doc.id}')">Eliminar</button></td>
            <td><button id="edit-${doc.id}" style="max-width:6rem;" onclick="editar('${doc.id}', '${doc.nombre}', '${doc.pibas}', '${doc.puntos}')" class="btn btn-warning">Editar</button></td>
            <td><button id="can-${doc.id}" hidden style="max-width:6rem;background-color:grey;border-color:grey;" class="btn btn-danger" onclick="cancelar()">Cancelar</button></td>
            </tr><br>`

            console.log(`${doc.id} => ${doc.nombre}`)
        }
        //
        /*
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().first}`)
            tabla.innerHTML += `
            <tr style="gap:2rem; class="old first">
            <td class="top">#1</td>
            <td>${doc.data().first}</td>
            <td class="min-wid-20">&nbsp;${doc.data().last}</td>
            <td class="min-wid-20">&nbsp;${doc.data().born}</td>
            <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
            <td><button style="max-width:4rem;" onclick="editar('${doc.id}', '${doc.data().first}', '${doc.data().last}', '${doc.data().born}')" class="btn btn-warning">editar</button></td>
            </tr><br>`
        })*/


        tabla.hidden = false;
    })

}

pintar()

/*
Aqui empieza el panel 2, el que va por grupos
en serio no pierdas tiempo intentando usar buenas practicas
esto es imposible de corregir por tan poco dinero
seria rehacer todo el frontend, y hacer un backend
Att. El anterior programador
*/


var selecciona2 = undefined;

document.getElementById('nombre2').hidden = true;
document.getElementById('grupo2').hidden = true;
document.getElementById('apellido2').hidden = true;
document.getElementById('fecha2').hidden = true;
document.getElementById('boton2').hidden = true;

function guardar2() {
    //let nombre = document.getElementById('nombre').value;
    let apellido = document.getElementById('apellido2').value;
    let fecha = document.getElementById('fecha2').value;
    let grupo = document.getElementById('grupo2').value;
    //document.getElementById('boton2').hidden = false;

    /* db.collection("users").get()
     .then(function (docRef) {
         let docs = docRef.docs//[0].data();
 
         for (let index = 0; index < docs.length; index++) {
             const doc = docs[index];
             if (doc.id = id){*/
    db.collection("users").doc(selecciona2).get()
        .then(function (docuwu) {
            let nombre = docuwu.data().first;
            if (!grupo) grupo = docuwu.data().grupo;

            eliminar2(selecciona2, true);

            db.collection("users").add({
                activo: true,
                grupo: grupo,
                first: nombre,
                last: apellido,
                born: fecha
            })
                .then(function (docRef) {
                    /*document.getElementById('nombre').value = '';
                    document.getElementById('apellido').value = '';
                    document.getElementById('fecha').value = '';*/
                    selecciona2 = undefined;
                    cancelar2()
                    pintar2()///////aqui
                })
                .catch(function (error) {
                    console.error(`error`)
                    selecciona2 = undefined;
                    cancelar2()
                    pintar2()
                })

        }).catch(function (error) {
            console.error(error)
            selecciona2 = undefined;
            cancelar2()
            pintar2()
        })


    return;
}
/*     }
 })
 .catch(function (error) {
     console.error(`error`)
 })*/
/*
db.collection("users").add({
    first: nombre,
    last: apellido,
    born: fecha
})
    .then(function (docRef) {
        document.getElementById('nombre').value = '';
        document.getElementById('apellido').value = '';
        document.getElementById('fecha').value = '';
    })
    .catch(function (error) {
        console.error(`error`)
    })
}*/

function eliminar2(id, bypass = false) {

    let seguro;
    if (!bypass) {
        seguro = confirm("Estas seguro que quieres borrar este usuario?")
    } else {
        seguro = true;
    }


    if (seguro) {

        db.collection("users").doc(id).delete().then(function () {
            console.log("Documment")
            pintar2()
        }).catch(function (error) {
            console.error(error)
        })

    }
}

function editar2(id, first, last, born) {

    if (selecciona2 != undefined) {
        document.getElementById('edit-' + selecciona2).hidden = false;
        document.getElementById('can-' + selecciona2).hidden = true;
        document.getElementById('grupo2').value = '';
    }

    document.getElementById('edit-' + id).hidden = true;
    document.getElementById('can-' + id).hidden = false;

    document.getElementById('nombrecito2').hidden = false;
    document.getElementById('nombrecito2').innerText = first;
    document.getElementById('boton2').hidden = false;
    document.getElementById('apellido2').hidden = false;
    document.getElementById('grupo2').hidden = false;
    document.getElementById('grupo2').placeholder = first;
    //document.getElementById('apellido').placeholder = last;
    document.getElementById('fecha2').hidden = false;
    //document.getElementById('fecha').placeholder = born;
    selecciona2 = id;
}

function cancelar2() {

    if (selecciona2 != undefined) {
        document.getElementById('edit-' + selecciona2).hidden = false;
        document.getElementById('can-' + selecciona2).hidden = true;
    }

    document.getElementById('apellido2').value = '';
    document.getElementById('fecha2').value = '';
    document.getElementById('grupo2').value = '';
    document.getElementById('nombrecito2').hidden = true;
    document.getElementById('nombrecito2').innerText = "nombre";
    document.getElementById('boton2').hidden = true;
    document.getElementById('grupo2').hidden = true;
    document.getElementById('apellido2').hidden = true;
    document.getElementById('fecha2').hidden = true;
    document.getElementById('apellido2').value = "";
    document.getElementById('fecha2').value = "";

}


function pintar2() {
    let tabla = document.getElementById('tabla2')
    db.collection("users").onSnapshot((querySnapshot) => {
        tabla.innerHTML = ""
        tabla.hidden = true;
        let documentos = [];

        querySnapshot.forEach((doc) => {
            //console.log(`${doc.id} => ${doc.data().first}`)
            if (doc.data().activo) {
                documentos.push({
                    "id": doc.id,
                    "nombre": doc.data().first,
                    "activo": doc.data().activo,
                    "pibas": doc.data().last,
                    "grupo": doc.data().grupo,
                    "puntos": doc.data().born
                })
            };
        })

        documentos.sort((a, b) => {
            return a.pibas - b.pibas
        })

        documentos.sort((a, b) => {
            return a.puntos - b.puntos
        })

        documentos.reverse()

        for (let index = 0; index < documentos.length; index++) {
            const doc = documentos[index];
            let grupowo = doc.grupo;
            if (!grupowo) grupowo = "¡sin nombre!";
            tabla.innerHTML += `
            <tr style="gap:2rem; class="old first">
            <td class="top">#${index + 1}</td>
            <td>${grupowo}</td>
            <td class="min-wid-20">&nbsp;${doc.pibas}</td>
            <td class="min-wid-20">&nbsp;${doc.puntos}</td>

            <td><button class="btn btn-danger" style="max-width:6rem;" onclick="eliminar2('${doc.id}')">Eliminar</button></td>
            <td><button id="edit-${doc.id}" style="max-width:6rem;" onclick="editar2('${doc.id}', '${grupowo}', '${doc.pibas}', '${doc.puntos}')" class="btn btn-warning">Editar</button></td>
            <td><button id="can-${doc.id}" hidden style="max-width:6rem;background-color:grey;border-color:grey;" class="btn btn-danger" onclick="cancelar2()">Cancelar</button></td>
            </tr><br>`

            console.log(`${doc.id} => >${grupowo}`)

        }

        //
        /*
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().first}`)
            tabla.innerHTML += `
            <tr style="gap:2rem; class="old first">
            <td class="top">#1</td>
            <td>${doc.data().first}</td>
            <td class="min-wid-20">&nbsp;${doc.data().last}</td>
            <td class="min-wid-20">&nbsp;${doc.data().born}</td>
            <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
            <td><button style="max-width:4rem;" onclick="editar('${doc.id}', '${doc.data().first}', '${doc.data().last}', '${doc.data().born}')" class="btn btn-warning">editar</button></td>
            </tr><br>`
        })*/


        tabla.hidden = false;
    })


}

pintar2()