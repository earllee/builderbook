import mongoose, { Schema } from 'mongoose';
import frontmatter from 'front-matter';

import generateSlug from '../utils/slugify';
import Chapter from './Chapter';
import { getCommits, getContent } from '../github';
import logger from '../logs';


const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  githubRepo: {
    type: String,
    required: true,
  },
  githubLastCommitSha: String,

  createdAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});


class BookClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const books = await this.find({})
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    return { books };
  }

  static async getBySlug({ slug }) {
    const bookDoc = await this.findOne({ slug });
    if (!bookDoc) {
      throw new Error('Book not found');
    }

    const book = bookDoc.toObject();

    book.chapters = (await Chapter.find({ bookId: book._id }, 'title slug')
      .sort({ order: 1 }))
      .map(chapter => chapter.toObject());
    return book;
  }

  static async add({ name, price, githubRepo }) {
    const slug = await generateSlug(this, name);
    if (!slug) {
      throw new Error('Error with slug generation');
    }
    return this.create({
      name,
      slug,
      price,
      githubRepo,
      createdAt: new Date(),
    });
  }

  static async edit({
    id, name, price, githubRepo,
  }) {
    const book = await this.findById(id, 'slug name');

    if (!book) {
      throw new Error('Book is not found by id');
    }

    const modifier = { price, githubRepo };

    if (name !== book.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    return this.updateOne({ _id: id }, { $set: modifier });
  }

  static async syncContent({ id, githubAccessToken }) {
    // 1. await find book by id
    const book = await this.findById(id, 'githubRepo githubLastCommitSha');

    // 2. throw error if there is no book
    if (!book) {
      throw new Error('Not found');
    }

    // 3. get last commit from Github using `getCommits()` API method
    const lastCommit = await getCommits({
      accessToken: githubAccessToken,
      repoName: book.githubRepo,
      limit: 1,
    });

    // 4. if there is no last commit on Github - no need to sync content, throw error
    if (!lastCommit || !lastCommit.data || !lastCommit.data[0]) {
      throw new Error('No change!');
    }

    // 5. if last commit's hash on Github's repo is the same as hash saved in database -
    // no need to extract content from repo, throw error
    const lastCommitSha = lastCommit.data[0].sha;
    if (lastCommitSha === book.githubLastCommitSha) {
      throw new Error('No change!');
    }

    // 6. define repo's main folder with `await` and `getContent()`
    const mainFolder = await getContent({
      accessToken: githubAccessToken,
      repoName: book.githubRepo,
      path: '',
    });

    await Promise.all(mainFolder.data.map(async (f) => {
      // 7. check if main folder has files, check title of files
      if (f.type !== 'file') {
        return;
      }
      if (f.path !== 'introduction.md' && !/chapter-(\[0-9]+)\.md/.test(f.path)) {
        return;
      }

      // 8. define `chapter` with `await` and `getContent()`
      const chapter = await getContent({
        accessToken: githubAccessToken,
        repoName: book.githubRepo,
        path: f.path,
      });

      // 9. Extract content from each qualifying file in repo
      const data = frontmatter(Buffer.from(chapter.data.content, 'base64').toString('utf8'));
      data.path = f.path;

      // 10. For each file, run `Chapter.syncContent({ book, data })`
      try {
        await Chapter.syncContent({ book, data });
        logger.info('Content is synced', { path: f.path });
      } catch (error) {
        logger.error('Content sync has error', { path: f.path, error });
      }
    }));

    // 11. Return book with updated `githubLastCommitSha`
    return book.update({ githubLastCommitSha: lastCommitSha });
  }
}

mongoSchema.loadClass(BookClass);

const Book = mongoose.model('Book', mongoSchema);

export default Book;
