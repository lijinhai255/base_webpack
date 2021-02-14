// import Router from '@koa/router';
import router from 'koa-simple-router';
import IndexController from './IndexController';
const indexController = new IndexController();
import ApiController from './ApiController';
const apiController = new ApiController();
import BooksController from './BooksController';
const booksController = new BooksController();
// const router = new Router();

function initController(app) {
  app.use(
    router((_) => {
      _.get('/', indexController.actionIndex);
      _.get('/api/getBooksList', apiController.actionBooksList);
      _.get('/books/list', booksController.actionBooksList);
      _.get('/books/create', booksController.actionBooksCreate);
      //   app.use(router.routes()).use(router.allowedMethods());
    })
  );
}
export default initController;
