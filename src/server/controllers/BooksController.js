import Controller from './Controller';
import BooksModel from '../models/BooksModel';
import { Readable } from 'stream';
import { createGzip } from 'zlib';
import { load } from 'cheerio';
class BooksController extends Controller {
  constructor() {
    super();
  }
  async actionBooksList(ctx) {
    // const booksModel = new BooksModel();
    // const result = await booksModel.getBooksList();
    // ctx.body = await ctx.render('books/list',{
    //     data:result.data
    // })
    ctx.body = await ctx.render('books/pages/list');
  }
  async actionBooksCreate(ctx) {
    const html = await ctx.render('books/pages/create');
    if (ctx.request.header['x-pjax']) {
      console.log('站内切');
      const $ = load(html);
      ctx.status = 200;
      ctx.type = 'html';
      $('.pajaxcontent').each(function () {
        // console.log('🍌', $(this).html());
        ctx.res.write($(this).html());
      });
      $('.lazyload-js').each(function () {
        ctx.res.write(`<script src="${$(this).attr('src')}"></script>`);
      });
      // console.log('🍌', '站内切');
      ctx.res.end();
    } else {
      function createSSRStreamPromise() {
        return new Promise((resolve, reject) => {
          console.log('🍊落地页');
          const htmlStream = new Readable();
          htmlStream.push(html);
          htmlStream.push(null);
          ctx.status = 200;
          ctx.type = 'html';
          ctx.res.setHeader('content-encoding', 'gzip');
          // ctx.res.setHeader('Transfer-Encoding', 'chunked');
          //Transfer-Encoding: chunked
          const gz = createGzip();
          htmlStream
            .on('error', (err) => {
              reject(err);
            })
            .pipe(gz)
            .pipe(ctx.res);
        });
      }
      await createSSRStreamPromise();
    }
  }
}
export default BooksController;
