import db from '../db/mariadb';

async function listar() {
    try{
        return await db.query();
    }catch(e){
        console.log(e);
        throw new Error("Ha ocurrido un error ");
    }
}