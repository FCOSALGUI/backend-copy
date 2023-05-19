import { Request, Response } from "express";
import { Ticket } from "../models/ticket";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import nodemailer from "nodemailer";

export const getId = async (req: Request) => {
  const token: any = req.headers["authorization"];
  const decoded: any = jwt.decode(token.slice(7));
  const userExists: any = await User.findOne({
    where: { username: decoded.username },
  });
  return userExists.id;
};

export const getUser = async (req: Request) => {
  const token: any = req.headers["authorization"];
  const decoded: any = jwt.decode(token.slice(7));
  const userExists: any = await User.findOne({
    where: { username: decoded.username },
  });
  return JSON.stringify(userExists);
};

export const getTickets = async (req: Request, res: Response) => {
  const idUser = await getId(req);
  const listTickets = await Ticket.findAll({ where: { idUser: idUser } });
  res.json(listTickets);
};

//get admins emails
export const getAdminEmail = async (req: Request) => {
  const userExists: any = await User.findAll({ where: { tipo: "Admin" } });
  var records = JSON.stringify(userExists);
  var recordsJSON = JSON.parse(records);
  var emails = [];
  for (var i = 0; i < recordsJSON.length; i++) {
    emails.push(recordsJSON[i].email);
  }
  return emails;
};

//sent email
async function sentEmail(receiver: any, subject: any, html: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "ticketscaritas@gmail.com",
        pass: "litrywbdefdfbyug",
      },
    });
    let info = await transporter.sendMail({
      from: "ticketscaritas@gmail.com", // sender address
      to: receiver, // list of receivers
      subject: subject, // Subject line
      html: html,
    });
  } catch (error) {}
}

export const getAllTickets = async (req: Request, res: Response) => {
  const listTickets = await Ticket.findAll();
  res.json(listTickets);
};

export const createTicket = async (req: Request, res: Response) => {
  const { title, descripcion, tipo, evidencia } = req.body;
  const idUser = await getId(req);

  //emails
  const userLogged: any = await User.findOne({ where: { id: idUser } });
  const emailsAdmins = (await getAdminEmail(req)).toString();
  const prueba = "," + userLogged.email;
  const emails = emailsAdmins.concat(prueba);
  //emails

  try {
    // Guardamos usuario en la base de datos
    await Ticket.create({
      title: title,
      descripcion: descripcion,
      tipo: tipo,
      status: "creado",
      evidencia: evidencia,
      idUser: idUser,
    });
    const html: any =
      "<p>Este correo es un aviso de que se ha creado un nuevo Ticket con titulo <b>" +
      title +
      "</b> por parte del usuario <b>" +
      userLogged.firstName +
      "</b>. Con el correo asociado <b>" +
      userLogged.email +
      "</b> y ID de usuario <b>" +
      idUser +
      "</b>.<br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>";
    sentEmail(
      emails,
      "Ticket creado por usuario " + userLogged.firstName + "",
      html
    );

    res.json({
      msg: `Ticket con titulo ${title} creado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ha ocurrido un error",
      error,
    });
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  const { title, descripcion, tipo } = req.body;
  const { id } = req.params;
  try {
    // Guardamos usuario en la base de datos
    await Ticket.update(
      {
        title: title,
        descripcion: descripcion,
        tipo: tipo,
      },
      {
        where: { id: id },
      }
    );
    res.json({
      msg: `Ticket editado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ha ocurrido un error",
      error,
    });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  const idLogged = await getId(req);
  const ticketSelected: any = await Ticket.findOne({ where: { id: id } });
  const userTicket: any = await User.findOne({
    where: { id: ticketSelected.idUser },
  });
  const admin: any = await User.findOne({ where: { id: idLogged } });
  try {
    // Guardamos usuario en la base de datos
    await Ticket.update(
      {
        status: status,
      },
      {
        where: { id: id },
      }
    );
    const html: any =
      "<p>Este correo es un aviso de que se ha cambiado el status del ticket con titulo <b>" +
      ticketSelected.title +
      "</b> de <b>" +
      ticketSelected.status +
      "</b>  a <b>" +
      status +
      "</b> por el administrador <b>" +
      admin.firstName +
      "</b>. De ser necesario puede enviar al correo del adminsitrador el cual es <b>" +
      admin.email +
      "</b> y telefono <b>" +
      admin.telefono +
      "</b>.<br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>";
    sentEmail(
      userTicket.email,
      "Estatus cambiado en ticket de titulo " + ticketSelected.title + "",
      html
    );
    res.json({
      msg: `El status se ha modificado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ha ocurrido un error",
      error,
    });
  }
};

export const updateTicketPriority = async (req: Request, res: Response) => {
  const { priority } = req.body;
  const { id } = req.params;

  const idLogged = await getId(req);
  const ticketSelected: any = await Ticket.findOne({ where: { id: id } });
  const userTicket: any = await User.findOne({
    where: { id: ticketSelected.idUser },
  });
  const admin: any = await User.findOne({ where: { id: idLogged } });

  try {
    await Ticket.update(
      {
        prioridad: priority,
      },
      {
        where: { id: id },
      }
    );
    const html: any =
      "<p>Este correo es un aviso de que se ha cambiado la prioridad del ticket con titulo <b>" +
      ticketSelected.title +
      "</b> de <b>" +
      ticketSelected.prioridad +
      "</b>  a <b>" +
      priority +
      "</b> por el administrador <b>" +
      admin.firstName +
      "</b>. De ser necesario puede enviar al correo del adminsitrador el cual es <b>" +
      admin.email +
      "</b> y telefono <b>" +
      admin.telefono +
      "</b>.<br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>";
    sentEmail(
      userTicket.email,
      "Prioridad cambiada en ticket de titulo " + ticketSelected.title + "",
      html
    );
    res.json({
      msg: `El status se ha modificado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ha ocurrido un error",
      error,
    });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const { id } = req.params;
  const idUser = await getId(req);

  //ticket anterior
  const prevTicket: any = await Ticket.findOne({ where: { id: id } });

  //emails
  const userLogged: any = await User.findOne({ where: { id: idUser } });
  const emailsAdmins = (await getAdminEmail(req)).toString();
  const prueba = "," + userLogged.email;
  const emails = emailsAdmins.concat(prueba);
  //emails
  try {
    // Eliminamos ticket en la base de datos
    await Ticket.destroy({
      where: { id: id },
    });

    const html: any =
      "<p>Este correo es un aviso de que se ha <b>borrado</b> un ticket con titulo <b>" +
      prevTicket.title +
      "</b> por parte del usuario <b>" +
      userLogged.firstName +
      "</b>. Con el correo asociado <b>" +
      userLogged.email +
      "</b> y ID de usuario <b>" +
      idUser +
      "</b>.<br><b>Servicio de notificaciones de Sistema de Tickets de Caritas</b></p>";
    sentEmail(
      emails,
      "Ticket borrado por usuario " + userLogged.firstName + "",
      html
    );
    res.json({
      msg: `Ticket eliminado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Ha ocurrido un error",
      error,
    });
  }
};
