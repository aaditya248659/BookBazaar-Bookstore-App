require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book');

// Map of Amazon URLs to working image URLs (Open Library, direct URLs)
const imageMap = {
  "https://i.imgur.com/5K9zHJK.jpg": "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", // Atomic Habits
  "https://i.imgur.com/7yZqXqW.jpg": "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", // Psychology of Money
  "https://i.imgur.com/yMxZK5L.jpg": "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg", // Rich Dad Poor Dad
  "https://i.imgur.com/pZ8dqJE.jpg": "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg", // The Alchemist
  "https://i.imgur.com/D9qvqk7.jpg": "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", // Clean Code
  "https://i.imgur.com/4L8xczx.jpg": "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", // Sapiens
  "https://i.imgur.com/NhF9gKe.jpg": "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg", // Deep Work
  "https://i.imgur.com/bvqwGpY.jpg": "https://covers.openlibrary.org/b/isbn/9781484286425-L.jpg", // You Don't Know JS
  "https://i.imgur.com/8f7K3tP.jpg": "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg", // The Lean Startup
  "https://i.imgur.com/q1cE7hM.jpg": "https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg", // Start with Why
  "https://i.imgur.com/G5hLm7R.jpg": "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg", // Pragmatic Programmer
  "https://i.imgur.com/bLwM2Zx.jpg": "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg", // Subtle Art
  "https://covers.openlibrary.org/b/id/8257129-L.jpg": "https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg", // Power of Now
  "https://covers.openlibrary.org/b/id/10440483-L.jpg": "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg", // Zero to One
  "https://covers.openlibrary.org/b/id/12526418-L.jpg": "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg", // Intelligent Investor
  "https://covers.openlibrary.org/b/id/12593664-L.jpg": "https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg", // Eloquent JavaScript
  "https://covers.openlibrary.org/b/id/12844862-L.jpg": "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg", // Designing Data-Intensive Apps
  "https://covers.openlibrary.org/b/id/8228691-L.jpg": "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", // To Kill a Mockingbird
  "https://covers.openlibrary.org/b/id/7222246-L.jpg": "https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg", // 1984
  "https://covers.openlibrary.org/b/id/8257506-L.jpg": "https://covers.openlibrary.org/b/isbn/9781501111112-L.jpg", // Grit
  "https://covers.openlibrary.org/b/id/7895280-L.jpg": "https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg", // Thinking Fast and Slow
  "https://covers.openlibrary.org/b/id/7222424-L.jpg": "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", // Great Gatsby
  "https://covers.openlibrary.org/b/id/12615168-L.jpg": "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg", // Brief History of Time
  "https://covers.openlibrary.org/b/id/10351401-L.jpg": "https://covers.openlibrary.org/b/isbn/9780345539434-L.jpg", // Cosmos
  "https://covers.openlibrary.org/b/id/8462109-L.jpg": "https://covers.openlibrary.org/b/isbn/9780198788607-L.jpg", // Selfish Gene
  "https://covers.openlibrary.org/b/id/8300504-L.jpg": "https://covers.openlibrary.org/b/isbn/9780393609394-L.jpg", // Astrophysics
  "https://covers.openlibrary.org/b/id/8739441-L.jpg": "https://covers.openlibrary.org/b/isbn/9781982137274-L.jpg", // 7 Habits
  "https://covers.openlibrary.org/b/id/10452766-L.jpg": "https://covers.openlibrary.org/b/isbn/9780062457714-L.jpg", // Monk Who Sold Ferrari
  "https://covers.openlibrary.org/b/id/8254664-L.jpg": "https://covers.openlibrary.org/b/isbn/9781590302255-L.jpg", // Art of War
  "https://covers.openlibrary.org/b/id/8747370-L.jpg": "https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg", // Can't Hurt Me
};

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const books = await Book.find();
    let updatedCount = 0;

    for (const book of books) {
      if (imageMap[book.image]) {
        book.image = imageMap[book.image];
        await book.save({ validateBeforeSave: false });
        console.log(`✓ Updated: ${book.title}`);
        updatedCount++;
      } else {
        console.log(`⚠ No mapping found for: ${book.title}`);
      }
    }

    console.log(`\n✅ Updated ${updatedCount} book images!`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateImages();
