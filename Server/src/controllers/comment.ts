import { Request, Response } from 'express';
import { Comment } from '../models/comment';
import jwt from 'jsonwebtoken';
import { User } from "../models/user";
import {Ticket} from "../models/ticket";
import nodemailer from 'nodemailer';
import { Address } from 'nodemailer/lib/mailer';

export const getUser = async (req: Request) =>{
    const token:any = req.headers['authorization'];
    const decoded:any= jwt.decode(token.slice(7));
    const userExists:any = await User.findOne({ where: { username: decoded.username } }); 
    return JSON.stringify(userExists); 
}

export const getAdminEmail = async (req: Request) =>{
    const userExists:any = await User.findAll({ where: { tipo:'Admin' } }); 
    var records=JSON.stringify(userExists)
    var recordsJSON=JSON.parse(records)
    var emails =[];
    for(var i =0;i<recordsJSON.length;i++)
    {
        emails.push(recordsJSON[i].email);
    }
    return emails
}

export const getComments = async (req: Request, res: Response) => {
    const {id} = req.params;
    const commentsList = await Comment.findAll({
        where: { idTicket: id }
      });
    res.json(commentsList);
    
}

 async function sentEmailForUser(receiver:any, userId:any,name:any,correo:any,idTicket:any) {
    try {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ticketscaritas@gmail.com',
                pass: 'litrywbdefdfbyug',
            },
        });
          let info = await transporter.sendMail({
            from: 'ticketscaritas@gmail.com', // sender address
            to: receiver, // list of receivers
            subject: "Ticket " + idTicket + " ha recibido un comentario de un usuario", // Subject line
            html: "<p>Este correo es un aviso de que se ha agregado un comentario al ticket con ID <b>" + idTicket + "</b> por parte del usuario <b>"+ name +"</b>. Con el correo asociado <b>"+ correo +"</b> y ID de usuario <b>"+ userId +"</b>.<br><br> Favor de revisar el ticket para proceder con el procedimiento requerido para el id de ticket específicado</p><p>Atentamente, <br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>", // html body
          });
    } catch (error) {
        
    }
}

async function sentEmailForAdmin(receiver:any, userId:any,name:any,correo:any,idTicket:any) {
    try {
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ticketscaritas@gmail.com',
                pass: 'litrywbdefdfbyug',
            },
        });
          let info = await transporter.sendMail({
            from: 'ticketscaritas@gmail.com', // sender address
            to: receiver, // list of receivers
            subject: "Ticket " + idTicket + " ha recibido un comentario por parte de un administrador", // Subject line
            html: "<p>Este correo es un aviso de que se ha agregado un comentario al ticket con ID <b>" + idTicket + "</b> por parte del administrador <b>"+ name +"</b>. Dicho administrador tiene el correo asociado <b>"+ correo +"</b>. <br><br> En caso de tener algún comentario adicional, favor de agregarlo desde el portal de Tickets de Soporte de Caritas</p><p>Atentamente, <br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>", // html body
          });
    } catch (error) {
        
    }
}


//id de quien hace el comentario, username y el correo
//id de ticket
export const createComment = async (req: Request, res: Response) => {
    const { descripcion} = req.body;
    const UserLogged=JSON.parse(await getUser(req));
    const {id} = req.params;
    const emailsAdmins=(await getAdminEmail(req)).toString();

    const ticket:any = await Ticket.findOne({ where: { id: id } });

    const userid:any = await User.findOne({ where: { id: ticket.idUser }});

    userid.email


    try {
        // Guardamos usuario en la base de datos
        await Comment.create({
            descripcion: descripcion,
            idUser:UserLogged.id,
            idTicket:id
        });
        
        if(UserLogged.tipo.toLowerCase() == "admin")
            sentEmailForAdmin(userid.email,UserLogged.id, UserLogged.username, UserLogged.email, id);

        else
            sentEmailForUser(emailsAdmins,UserLogged.id,UserLogged.username,UserLogged.email,id);
        

        res.json({
            msg: `Comentario creado exitosamente!`
        });

    } catch (error) {
        res.status(400).json({
            msg: "Ha ocurrido un error",
            error
        });
    }
}
