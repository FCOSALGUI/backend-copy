import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
    
    const { username, password, firstName, lastName, tipo, departamento, telefono,email } = req.body;

    // Validamos si el usuario ya existe en la base de datos
    const userExists = await User.findOne({ where: { username: username } });

    if (userExists) {
        return res.status(400).json({
            msg: `Ya existe un usuario con este nombre de usuario: ${username}`
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Guardamos usuario en la base de datos
        await User.create({
            username: username,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName,
            tipo: tipo,
            departamento: departamento,
            telefono: telefono,
            email:email
        });

        res.json({
            msg: `Usuario ${username} creado exitosamente!`
        });

    } catch (error) {
        res.status(400).json({
            msg: "Ha ocurrido un error",
            error
        });
    }
}

export const loginUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;

    // Validamos si el usuario existe en la base de datos
    const userExists: any = await User.findOne({ where: { username: username } });

    if(!userExists){
        return res.status(400).json({
            msg: `No existe un usuario ${username} en la base de datos`
        });
    }

    // Validamos Password
    const passwordValid = await bcrypt.compare(password, userExists.password);
    if(!passwordValid){
        return res.status(400).json({
            msg: `Password Incorrecta`
        });
    }
    
    // Se genera un Token
    const token = jwt.sign({
        username: username
    }, process.env.SECRET_KEY || 'Juanito123');
    console.log(token)
    res.json(token);
}

export const getUsers = async (req: Request, res: Response) => {
    const listUsers = await User.findAll();
    res.json(listUsers);
}

export const getUserInfo = async (req: Request, res: Response) =>{
    const token:any = req.headers['authorization'];
    const decoded:any= jwt.decode(token.slice(7));
    const userExists:any = await User.findOne({ where: { username: decoded.username } }); 
    res.json(userExists);
}

export const getUsernameById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const username: any = await User.findOne({ 
        attributes: ['username'],
        where: { id: id } 
    });
    res.json(username.username);
}

export const getType = async (req: Request,res:Response) => {
    const token:any = req.headers['authorization'];
    const decoded:any= jwt.decode(token.slice(7));
    const userExists: any = await User.findOne({ where: { username: decoded.username } });
    res.json(userExists.tipo);
}


export const editUserInfo = async (req: Request, res: Response) => {
    const { username,firstName,lastName,telefono } = req.body;
    const token: any = req.headers["authorization"];
    const decoded: any = jwt.decode(token.slice(7));
    console.log(decoded.username);
    const userExists: any = await User.findOne({ where: { username: decoded.username },});
    try{ 
        await User.update(
            {
            username: username,
            firstName: firstName,
            lastName: lastName,
            telefono:telefono
            },
            {
              where: { id: userExists.id },
            }
          );
      res.json({
        msg: `El usuario se ha modificado exitosamente!`,
      });
    } catch (error) {
        console.log(error);
      res.status(400).json({
        msg: "Ha ocurrido un error",
        error,
      });
    }
  }