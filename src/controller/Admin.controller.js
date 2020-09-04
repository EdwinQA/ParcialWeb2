const { firebase, admin } = require('../configfirebase');
const { database } = require('firebase-admin');
const controlador = {};

const db = firebase.firestore();

const getProyectosDelUsuario = (user) => db.collection('proyectos')
    .where("fk_usuario", "==", user).get();

const getTrabajosDelUsuario = (user) => db.collection('trabajos')
    .where("fk_usuario", "==", user).get();

controlador.inicio = (req, res) => {
    console.log('-------------- entro al controlador.inicio --------------')

    var user = 'edwin';
    var clave = 'edwin';
    db.collection("usuario").where("usuario", "==", user).where("contrasena", "==", clave)
        .get()
        .then(function (querySnapshot) {
            var validacion = 0;
            querySnapshot.forEach(function (doc) {

                console.log('ALERT : HA INICIADO CORRECTAMENTE');
                console.log('datos del usuario logueado');
                console.log(doc.data());
                validacion = 1;
                _cargarproyectosytrabajosdelusuario(res, req, doc.data().usuario, 1, doc.data());
            });
            if (validacion == 0) {
                console.log('ALERT : USUARIO O CONTRASEÑA INCORRECTA');
                console.log('CONSOLE : validación de usuario rechazada');
            }

        })
        .catch(function (error) {
            console.log("ALERT : ALGO A FALLADO, INTENTALO NUEVAMENTE ");
            console.log("CONSOLE : hubo un fallo al validar usuario: ", error);
        });

}

controlador.admin = async (req, res) => {
    console.log('-------------- entro al controlador.admin --------------')
    var user = req.query.user;
    if (!user) {
        user = 'edwin'
    }
    await _cargarproyectosytrabajosdelusuario(res, req, user, 2, null);
    // res.render('./admin',{user:user});
}

async function _cargarproyectosytrabajosdelusuario(res, req, user, vienede, datosuser) {

    console.log('comenzo carga de proyectos del usuario')
    const querySnapshot = await getProyectosDelUsuario(user);
    const documents = [];
    querySnapshot.forEach(doc => {
        const document = {
            id: doc.id,
            nombre: doc.data().nombre,
            descripcion: doc.data().descripcion,
            fk_usuario: doc.data().fk_usuario,
        };
        documents.push(document);
    })
    console.log('proyectos cargados')
    console.log(documents)

    console.log('comenzo carga de trabajos del usuario')
    const querySnapshot2 = await getTrabajosDelUsuario(user);
    const documents2 = [];
    querySnapshot2.forEach(doc2 => {
        const document2 = {
            id: doc2.id,
            empresa: doc2.data().empresa,
            cargo: doc2.data().cargo,
            descripcion: doc2.data().descripcion,
            fk_usuario: doc2.data().fk_usuario,
        };
        documents2.push(document2);
    })
    console.log('trabajos cargados')
    console.log(documents2)

    if (vienede == 1) {
        res.render('index', { user: datosuser, proyectos: documents, trabajos: documents2 });
    } else {
        if (req.query.idproyecto) {
            res.render('./admin', { proyectos: documents, trabajos: documents2, user: user, idproyecto: req.query.idproyecto });
        } else if (req.query.idtrabajo) {
            res.render('./admin', { proyectos: documents, trabajos: documents2, user: user, idtrabajo: req.query.idtrabajo });
        } else {
            res.render('./admin', { proyectos: documents, trabajos: documents2, user: user });
        }
    }


}

controlador.nuevo_proyecto = (req, res) => {
    console.log('-------------- Presiono el post controlador.nuevo_proyecto --------------')
    console.log('datos enviados al body')
    console.log(req.body)
    console.log('usuario enviado')
    console.log(req.query.user)
    var user = req.query.user;

    var Nombre = req.body.nombre;
    var Descripcion = req.body.descripcion;

    if (req.query.idproyecto) {
        console.log('Se va modificar el proyecto :' + req.query.idproyecto)
        var id = req.query.idproyecto;

        db.collection("proyectos").doc(id).update({
            nombre: Nombre,
            descripcion: Descripcion,
        })
            .then(function (docRef) {
                console.log('Se modifico exitosamente el proyecto');
                var us = encodeURIComponent(user);
                res.redirect('/admin?user=' + us);
            })
            .catch(function (error) {
                console.log("CONSOLE: Error registrando proyecto: ", error);
                var us = encodeURIComponent(user);
                res.redirect('/admin?user=' + us);
            });


    } else {

        if (ValidarCamposVaciosProyectoNuevo(Nombre, Descripcion)) {

            db.collection("proyectos").doc().set({
                nombre: Nombre,
                descripcion: Descripcion,
                fk_usuario: user
            })
                .then(function (docRef) {
                    console.log('ALERT : REGISTRO EXITOSO');
                    console.log("CONSOLE: Proyecto registrado: ");
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                })
                .catch(function (error) {
                    console.log("CONSOLE: Error registrando Proyecto: ", error);
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                });

        } else {
            console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
        }

    }

}

controlador.nuevo_trabajo = (req, res) => {
    console.log('-------------- Presiono el post controlador.nuevo_trabajo ---------------')
    console.log('datos enviados')
    console.log(req.body)
    console.log('usuario enviado')
    console.log(req.query.user)
    var user = req.query.user;

    var Empresa = req.body.empresa;
    var Cargo = req.body.cargo;
    var Descripcion = req.body.descripcion;


    if (req.query.idtrabajo) {
        console.log('Se va modificar el trabajo :' + req.query.idtrabajo)
        var id = req.query.idtrabajo;

        if (ValidarCamposVaciosTrabajoNuevo(Empresa, Cargo, Descripcion)) {
            db.collection("trabajos").doc(id).update({
                empresa: Empresa,
                cargo: Cargo,
                descripcion: Descripcion,
            })
                .then(function (docRef) {
                    console.log('Se modifico exitosamente el trabajo');
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                })
                .catch(function (error) {
                    console.log("CONSOLE: Error registrando trabajo: ", error);
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                });
        } else {
            console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
        }

    } else {

        if (ValidarCamposVaciosTrabajoNuevo(Empresa, Cargo, Descripcion)) {

            db.collection("trabajos").doc().set({
                empresa: Empresa,
                cargo: Cargo,
                descripcion: Descripcion,
                fk_usuario: user
            })
                .then(function (docRef) {
                    console.log('ALERT : REGISTRO EXITOSO');
                    console.log("CONSOLE: Trabajo registrado: ");
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                })
                .catch(function (error) {
                    console.log("CONSOLE: Error registrando Trabajo: ", error);
                    var us = encodeURIComponent(user);
                    res.redirect('/admin?user=' + us);
                });

        } else {
            console.log("ALERT: NO SE VALIDO BIEN LOS CAMPOS: ");
        }

    }
}

controlador.modificar_proyecto = (req, res) => {
    console.log('-------------- Presiono el post controlador.modificar_proyecto ---------------')
    console.log('proyecto a modificar')
    console.log(req.query.idproyecto)
    console.log('usuario enviado')
    console.log(req.query.user)
    res.redirect('/admin?user=' + req.query.user + '&idproyecto=' + req.query.idproyecto);
    /*  */
}

controlador.modificar_trabajo = (req, res) => {
    console.log('-------------- Presiono el post controlador.modificar_trabajo ---------------')
    console.log('trabajo a modificar')
    console.log(req.query.idtrabajo)
    console.log('usuario enviado')
    console.log(req.query.user)
    res.redirect('/admin?user=' + req.query.user + '&idtrabajo=' + req.query.idtrabajo);
    /*  */
}

controlador.eliminar_proyecto = (req, res) => {
    console.log('-------------- Presiono el post controlador.eliminar_proyecto ---------------')
    console.log('id del peoyecto enviado')
    console.log(req.query.idproyecto)
    var id = req.query.idproyecto;

    db.collection("proyectos").doc(id).delete()
        .then(function (docRef) {
            console.log('Se elimino exitosamente el proyecto');
            res.redirect('back');
        })
        .catch(function (error) {
            console.log("CONSOLE: Error registrando Trabajo: ", error);
            res.redirect('back');
        });

}

controlador.eliminar_trabajo = (req, res) => {
    console.log('-------------- Presiono el post controlador.eliminar_trabajo ---------------')
    console.log('id del trabajo enviado')
    console.log(req.query.idtrabajo)
    var id = req.query.idtrabajo;

    db.collection("trabajos").doc(id).delete()
        .then(function (docRef) {
            console.log('Se elimino exitosamente el trabajo');
            res.redirect('back');
        })
        .catch(function (error) {
            console.log("CONSOLE: Error registrando Trabajo: ", error);
            res.redirect('back');
        });

}

function ValidarCamposVaciosProyectoNuevo(Nombre, Descripcion) {
    var Comprobar = true;
    if (Nombre.length == 0) {
        console.log("Debe Ingresar el Nombre del proyecto");
        Comprobar = false;
    } else {
        if (Descripcion.length == 0) {
            console.log("Debe Ingresar una Descripcion al proyecto");
            Comprobar = false;
        }
    }
    return Comprobar;
}

function ValidarCamposVaciosTrabajoNuevo(Empresa, Cargo, Descripcion) {
    var Comprobar = true;
    if (Empresa.length == 0) {
        console.log("Debe Ingresar el Nombre de la Empresa");
        Comprobar = false;
    } else {
        if (Cargo.length == 0) {
            console.log("Debe Ingresar el Cargo asignado");
            Comprobar = false;
        } else {
            if (Descripcion.length == 0) {
                console.log("Debe Ingresar una Descripcion al trabajo");
                Comprobar = false;
            }
        }
    }
    return Comprobar;
}

module.exports = controlador;