import mongoose, { Schema } from 'mongoose';
import Book from './Book';

import logger from '../logs';

const mongoSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  isFree: {
    type: Boolean,
    required: true,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: '',
    required: true,
  },
  htmlContent: {
    type: String,
    default: '',
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  htmlExcerpt: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  githubFilePath: {
    type: String,
    unique: true,
  },
  order: {
    type: Number,
    required: true,
  },
  seoTitle: String,
  seoDescription: String,
  sections: [
    {
      text: String,
      level: Number,
      escapedText: String,
    },
  ],
});

class ChapterClass {
  static async getBySlug({ bookSlug, chapterSlug }) {
    logger.info('In getBySlug...');
    logger.info('Getting book...');
    const book = await Book.getBySlug({ slug: bookSlug });
    if (!book) throw new Error('Not found');
    logger.info('Got book...');
    logger.info(book);
    logger.info('Getting chapter...');

    const chapter = await this.findOne({ bookId: book._id, slug: chapterSlug });
    if (!chapter) throw new Error('Not found');

    logger.info('Got chapter...');
    logger.info(chapter);

    const chapterObj = chapter.toObject();
    chapterObj.book = book;

    return chapterObj;
  }
}

mongoSchema.loadClass(ChapterClass);

mongoSchema.index({ bookId: 1, slug: 1 }, { unique: true });
mongoSchema.index({ bookId: 1, githubFilePath: 1 }, { unique: true });

const Chapter = mongoose.model('Chapter', mongoSchema);

export default Chapter;
