import express, { Application } from 'express';
import cors from 'cors';
import routesTicket from '../routes/ticket';
import routesUser from '../routes/user';
import routesComments from '../routes/comments';
import routesHistorial from '../routes/historial';
import { Ticket } from './ticket';
import { User } from './user';
import { Comment } from './comment';
import { Historial } from './historial';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        this.app.use('/api/tickets', routesTicket);
        this.app.use('/api/users', routesUser);
        this.app.use('/api/comments', routesComments);
        this.app.use('/api/comments', routesComments);
        this.app.use('/api/history', routesHistorial)
    }

    midlewares() {
        // Parseo body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Ticket.sync();
            await User.sync();
            await Comment.sync();
            await Historial.sync();
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;