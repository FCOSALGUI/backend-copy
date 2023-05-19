import { Request, Response } from 'express';
import { Historial } from '../models/historial';
import jwt from 'jsonwebtoken';
import { User } from "../models/user";

export const getUser = async (req: Request) =>{
    const token:any = req.headers['authorization'];
    const decoded:any= jwt.decode(token.slice(7));
    const userExists:any = await User.findOne({ where: { username: decoded.username } }); 
    return JSON.stringify(userExists); 
}

export const getHistoriales = async (req: Request, res: Response) => {
    const {id} = req.params;
    const historialList = await Historial.findAll({
        where: { idTicket: id }
      });
    res.json(historialList);
}

//id de quien hace el comentario, username y el correo
//id de ticket
export const createHistorial = async (req: Request, res: Response) => {
    const { tipo } = req.body;
    const UserLogged=JSON.parse(await getUser(req));
    const {id} = req.params;

    try {
        // Guardamos usuario en la base de datos
        await Historial.create({
            tipo: tipo,
            idUser:UserLogged.id,
            idTicket:id
        });
        
        res.json({
            msg: `Historial creado exitosamente!`
        });

    } catch (error) {
        res.status(400).json({
            msg: "Ha ocurrido un error",
            error
        });
    }
}
