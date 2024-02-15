const label = document.getElementById("dark-change");
const darkmode = localStorage.getItem("mode");

if(darkmode === "true"){
  label.classList.toggle("active");
  document.body.classList.toggle("dark-mode");
}

firebase.initializeApp({
    apiKey: 'AIzaSyBojnsHjisbzlhmzzn5lAdsphhWGF4IAzA',
    authDomain: 'puntos-trabajo.firebaseapp.com',
    projectId: 'puntos-trabajo'
});

var db = firebase.firestore()

function pintar() {
    try {
        var tabla = document.getElementById('tablita')

        db.collection("users").onSnapshot((querySnapshot) => {
            tabla.innerHTML = "";
            let documentos = [];

            querySnapshot.forEach((doc) => {
                //console.log(`${doc.id} => ${doc.data().first}`)
                if (!doc.data().activo) {
                    documentos.push({
                        "nombre": doc.data().first,
                        "pibas": doc.data().last,
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
                const documento = documentos[index];
                if (index % 2 == 0) {
                    tabla.innerHTML += `<tr class="old first">
                    <td class="top">#${index + 1}</td>
                    <td>${documento.nombre}</td>
                    <td class="min-wid-20">&nbsp;${documento.pibas}</td>
                    <td class="min-wid-20">&nbsp;${documento.puntos}</td>
                    </tr>`
                } else {
                    tabla.innerHTML += `<tr class="even second">
                <td class="top">#${index + 1}</td>
                <td>${documento.nombre}</td>
                <td class="min-wid-20">&nbsp;${documento.pibas}</td>
                <td class="min-wid-20">&nbsp;${documento.puntos}</td>
                </tr>`
                }
            }

            console.log(documentos)
        })
    } catch (e) {
        console.log(e)
        setTimeout(() => {
            pintar();
        }, 1000);

    }

}

function pintarGrupos() {
    try {
        //var seccion = document.getElementById('porgrupos')
        //var seccionGenerada = false;
        var tablaGrupo = document.getElementById('tablita-grupo')

        db.collection("users").onSnapshot((querySnapshot) => {
            tablaGrupo.innerHTML = "";
            let documentos = [];
            let grupos = {};

            querySnapshot.forEach((doc) => {
                //console.log(`${doc.id} => ${doc.data().first}`)
                if (doc.data().activo) {
                    documentos.push({
                        "nombre": doc.data().first,
                        "pibas": doc.data().last,
                        "activo": doc.data().activo,
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
                const miembro = documentos[index];
                if (index % 2 == 0) {
                    tablaGrupo.innerHTML += `<tr class="old first">
                    <td class="top">#${index + 1}</td>
                    <td>${miembro.grupo}</td>
                    <td class="min-wid-20">&nbsp;${miembro.pibas}</td>
                    <td class="min-wid-20">&nbsp;${miembro.puntos}</td>
                    </tr>`
                } else {
                    tablaGrupo.innerHTML += `<tr class="even second">
                    <td class="top">#${index + 1}</td>
                    <td>${miembro.grupo}</td>
                    <td class="min-wid-20">&nbsp;${miembro.pibas}</td>
                    <td class="min-wid-20">&nbsp;${miembro.puntos}</td>
                    </tr>`
                }
            }
            /*
                        var pollitos = Object.keys(grupos);
                        for (let index = 0; index < pollitos.length; index++) {
                            const nombre = pollitos[index];
                            var miembros = grupos[nombre];
                            seccion.innerHTML += `>`;
            
                            var tablaGrupo = document.getElementById('tablita-' + nombre)
            
                            for (let index = 0; index < miembros.length; index++) {
                                const miembro = miembros[index];
                                
                            }
            
                        }*/

            console.log(documentos)
        })
    } catch (e) {
        console.log(e)
        setTimeout(() => {
            pintarGrupos();
        }, 1000);

    }

}

setTimeout(() => {
    pintarGrupos();
    pintar();
}, 1000);

label.onclick = function(){
  label.classList.toggle("active");
  document.body.classList.toggle("dark-mode");
  label.classList.contains("active") ? localStorage.setItem("mode", true) : localStorage.setItem("mode", false);
}