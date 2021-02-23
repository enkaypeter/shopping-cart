import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../config';
import morgan from "morgan";

export default ({ app }) => {
  /**
   * Health Check endpoints
   * 
   */
  app.use(morgan("dev"));
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(bodyParser.json());
  app.use(config.api.prefix, routes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });
};