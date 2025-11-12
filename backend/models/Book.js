const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'Fiction',
        'Non-Fiction',
        'Science',
        'Technology',
        'Programming',
        'Business',
        'Finance',
        'Biography',
        'History',
        'Self-Help',
        'Fantasy',
        'Mystery',
        'Romance',
        'Motivation',
        'Psychology',
        'Productivity',
        'Spirituality',
        'Leadership',
        'Thriller',
        'Historical Fiction',
        'Children',
        'Philosophy',
        'Other',
        
      ],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x400?text=Book+Cover',
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: 0,
      default: 0,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Book', bookSchema);