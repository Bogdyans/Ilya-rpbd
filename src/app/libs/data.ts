import { db, VercelPoolClient} from '@vercel/postgres';

function withDbClient<T>(operation: (client: VercelPoolClient) => Promise<T>): Promise<T> {
    return db.connect().then(async (client) => {
        try {
            return await operation(client);
        } finally {
            client.release();
        }
    });
}

////
//Query
////

export async function getUserByUsername(username: string) {
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT * FROM users WHERE username = ${username}
        `;

        console.log(`User ${username} selected`);
        return result.rows[0] || null;
    });
}

export async function createUser(username: string, hashedPassword: string) {
    return withDbClient(async (client) => {
        await client.sql`
            INSERT INTO users (username, hashed_pass, register_date)
            VALUES (${username}, ${hashedPassword}, CURRENT_DATE)
        `;

        console.log(`User ${username} created`);
        return { success: true };
    });
}
export async function getUserById(id: string) {
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT * FROM users WHERE id = ${id}
        `;

        return result.rows[0] || null;
    });
}


export async function getAuthorsForPage(user_id: string){
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT 
                a.id as id, 
                a.name as name, 
                a.photopath AS photo, 
                a.bdate AS birthdate, 
                a.bio AS liked, 
                CASE 
                    WHEN f.author_id IS NOT NULL THEN TRUE 
                    ELSE FALSE 
                END AS liked
            FROM 
                authors a
            LEFT JOIN 
                fav_authors f
            ON 
                a.id = f.author_id AND f.user_id = ${user_id};
        `;

        return result;
    });
}
export async function likeAuthor(user_id: string, author_id: string){
    return withDbClient(async (client) => {
        const result = await client.sql`
            INSERT INTO fav_authors (user_id, author_id)
            VALUES (${user_id}, ${author_id});
        `;

        return result;
    });
}
export async function unlikeAuthor(user_id: string, author_id: string){
    return withDbClient(async (client) => {
        const result = await client.sql`
            DELETE FROM fav_authors WHERE user_id = ${user_id} AND author_id = ${author_id};
        `;

        return result;
    });
}
export async function getFavAuthors(user_id: string){
    return withDbClient(async (client) => {
        const result = await client.sql`
            WITH numbered_rows AS (
                SELECT a.id as id, a.name as name, a.bdate as birthdate, a.photopath as photo,
                    ROW_NUMBER() OVER () as row_num
                FROM fav_authors f
                INNER JOIN authors a ON a.id = f.author_id
                WHERE f.user_id = ${user_id}
            )
            SELECT id, name, birthdate, photo
            FROM numbered_rows
            WHERE row_num > (SELECT COUNT(*) - 3 FROM numbered_rows);
        `;

        return result;
    });
}
export async function getFavAuthorsInNum(user_id: string){
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT count(*) as sum FROM fav_authors WHERE user_id = ${user_id};
        `;


        return result;
    });
}

export async function getBooksForPage(user_id: string, offset: number, limit: number){
    return withDbClient(async (client) => {
        try {
            const result = await client.sql`
                SELECT 
                    b.id as id,
                    b.title as title,
                    a.name as author_name,
                    b.cover_image as href,
                    b.date_of_release as release_date,
                    COALESCE(bs.status, 'on_hold') as status,
                    CASE 
                        WHEN f.book_id IS NOT NULL THEN TRUE 
                        ELSE FALSE 
                    END AS liked
                FROM books b
                JOIN authors a ON a.id = b.author_id
                LEFT JOIN book_stats bs ON b.id = bs.book_id AND bs.user_id = ${user_id}
                LEFT JOIN fav_books f ON b.id = f.book_id AND f.user_id = ${user_id}
                ORDER BY title
                LIMIT ${limit}
                OFFSET ${offset}
            `;

            return result.rows;
        } catch (error) {
            console.log(error);
            throw error;
        }
    })
}

export async function getTotalBooks() {
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT COUNT(*) FROM books
        `;
        return result.rows[0];
    })
}

export async function addBookStatus(user_id: string, book_id: string, status: string){
    return withDbClient(async (client) => {
        try {
            await client.sql`
            INSERT INTO book_stats(book_id, user_id, status)
            VALUES (${book_id}, ${user_id}, ${status});
        `
        } catch (e) {
            console.error(e);
            throw e;
        }
    })
}
export async function deleteBookStatus(user_id: string, book_id: string){
    return withDbClient(async (client) => {
        try {
            await client.sql`
            DELETE FROM book_stats
            WHERE user_id = ${user_id} AND book_id = ${book_id};
        `
        } catch (e) {
            console.error(e);
            throw e;
        }
    })
}
export async function changeBookStatus(user_id: string, book_id: string, status: string){
    return withDbClient(async (client) => {
        try {
            await client.sql`
            UPDATE book_stats
            SET status = ${status}
            WHERE user_id = ${user_id} AND book_id = ${book_id};
        `
        } catch (e) {
            console.error(e);
            throw e;
        }
    })
}

export async function likeBook(user_id: string, book_id: string){
    return withDbClient(async (client) => {
        try {
            await client.sql`
                INSERT INTO fav_books(user_id, book_id)
                VALUES (${user_id}, ${book_id});
            `;
        }catch (e) {
            console.error(e);
            throw e;
        }
    })
}
export async function unlikeBook(user_id: string, book_id: string){
    return withDbClient(async (client) => {
        try {
            await client.sql`
                DELETE FROM fav_books
                WHERE user_id = ${user_id} AND book_id = ${book_id});
            `;
        }catch (e) {
            console.error(e);
            throw e;
        }
    })
}

////
//Set Up
////

export async function createTableUsers() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
            await client.sql`
                CREATE TABLE IF NOT EXISTS users (
                        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                        username VARCHAR(255) NOT NULL UNIQUE,
                        hashed_pass VARCHAR(255) NOT NULL,
                        register_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
        `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
        }

    });
}
export async function createTableBooks() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
            await client.sql`
                CREATE TABLE books (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    author_id UUID,
                    num_of_words INTEGER,
                    date_of_release DATE,
                    cover_image VARCHAR(255),
                    FOREIGN KEY (author_id) REFERENCES authors(id)
                );
        `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
            throw e
        }

    });
}
export async function createTableAuthors() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
            await client.sql`
                CREATE TABLE authors (
                    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    bdate DATE,
                    country VARCHAR(100),
                    photopath VARCHAR(255),
                    bio TEXT
                );
        `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
        }

    });
}
export async function createTableFavAuthors() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`
                CREATE TABLE fav_authors (
                    user_id UUID,
                    author_id UUID,
                    PRIMARY KEY (user_id, author_id),
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (author_id) REFERENCES authors(id)
                );
            `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
        }

    });
}
export async function createTableStatusBooks() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN;`
            await client.sql`
                CREATE TABLE fav_books (
                    user_id UUID,
                    book_id UUID,
                    PRIMARY KEY (user_id, book_id),
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (book_id) REFERENCES books(id)
                );
            `;
            await client.sql`COMMIT;`;
        }catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
            throw e
        }
    })
}
export async function createTableFavBooks(){
    return withDbClient(async (client) => {
        await client.sql`BEGIN;`
        await client.sql`DROP TABLE fav_books`;
        await client.sql`
                CREATE TABLE fav_books (
                    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
                    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    PRIMARY KEY (book_id, user_id)
                );
            `;
        await client.sql`COMMIT;`;
    })
}


export async function seedTableAuthors() {
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`
                INSERT INTO authors (name, bdate, country, photopath, bio) VALUES
                    ('J.K. Rowling', '1965-07-31', 'United Kingdom', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnHVtY05QyUXpQUluNx7hWaV-vjE-8Jmqa8A&s', 'British author, best known for the Harry Potter series.'),
                    ('George Orwell', '1903-06-25', 'United Kingdom', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQhnZ7xvBo1HSQ7osuHY7fi1iNEqidixz6rg&s', 'English novelist, essayist, journalist, and critic.'),
                    ('Jane Austen', '1775-12-16', 'United Kingdom', 'https://cdn.britannica.com/12/172012-050-DAA7CE6B/Jane-Austen-Cassandra-engraving-portrait-1810.jpg', 'English novelist known for her romance novels.'),
                    ('Ernest Hemingway', '1899-07-21', 'United States', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDRnVFNcDh-RoLunQd6hFGEiC-ieixerFog&s', 'American novelist, short story writer, and journalist.'),
                    ('Agatha Christie', '1890-09-15', 'United Kingdom', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png', 'English writer known for her detective novels.'),
                    ('Gabriel García Márquez', '1927-03-06', 'Colombia', 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Gabriel_Garcia_Marquez.jpg', 'Colombian novelist, short-story writer, screenwriter and journalist.'),
                    ('Haruki Murakami', '1949-01-12', 'Japan', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW7ut2YioFaL5USMqpvv4Cd30vqyitAJzFNg&s', 'Japanese writer. His books and stories have been bestsellers in Japan and internationally.'),
                    ('Virginia Woolf', '1882-01-25', 'United Kingdom', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/George_Charles_Beresford_-_Virginia_Woolf_in_1902.jpg/640px-George_Charles_Beresford_-_Virginia_Woolf_in_1902.jpg', 'English writer, considered one of the most important modernist 20th-century authors.'),
                    ('Leo Tolstoy', '1828-09-09', 'Russia', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfdZIYSL5rldv9ugtFJhfsuhhIbgQMqiFzgA&s', 'Russian writer who is regarded as one of the greatest authors of all time.'),
                    ('Mark Twain', '1835-11-30', 'United States', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXdd4snjw2Ov8sMudL0vUQRKs1rK2itGkhng&s', 'American writer, humorist, entrepreneur, publisher, and lecturer.');

            `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
        }

    });
}
export async function seedBooks(){
    return withDbClient(async (client) => {
        try {
            await client.sql`BEGIN`;
            await client.sql`
                INSERT INTO books (title, author_id, num_of_words, date_of_release, cover_image) VALUES
                ('Harry Potter and the Philosopher''s Stone', (SELECT id FROM authors WHERE name = 'J.K. Rowling'), 76944, '1997-06-26', 'https://imo10.labirint.ru/books/692049/cover.jpg/363-0'),
                ('1984', (SELECT id FROM authors WHERE name = 'George Orwell'), 88942, '1949-06-08', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRaBZa1wtZO3h3uTJIjjJs3OH2UEWSuLrhsg&s'),
                ('Pride and Prejudice', (SELECT id FROM authors WHERE name = 'Jane Austen'), 122189, '1813-01-28', 'https://rukminim2.flixcart.com/image/850/1000/xif0q/book/f/s/1/pride-prejudice-original-imagy32ephewfga2.jpeg?q=20&crop=false'),
                ('The Old Man and the Sea', (SELECT id FROM authors WHERE name = 'Ernest Hemingway'), 26601, '1952-09-01', 'https://m.media-amazon.com/images/I/71RXc0OoEwL.jpg'),
                ('Murder on the Orient Express', (SELECT id FROM authors WHERE name = 'Agatha Christie'), 56000, '1934-01-01', 'https://lumiere-a.akamaihd.net/v1/images/image_37a1eab9.jpeg?region=0%2C0%2C1400%2C2100'),
                ('One Hundred Years of Solitude', (SELECT id FROM authors WHERE name = 'Gabriel García Márquez'), 144523, '1967-05-30', 'https://m.media-amazon.com/images/I/71WQQjgEhQL._AC_UF894,1000_QL80_.jpg'),
                ('Norwegian Wood', (SELECT id FROM authors WHERE name = 'Haruki Murakami'), 96356, '1987-08-04', 'https://m.media-amazon.com/images/I/81zqVhvbHbL.jpg'),
                ('Mrs Dalloway', (SELECT id FROM authors WHERE name = 'Virginia Woolf'), 63422, '1925-05-14', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXhTU_sIOJqMSSDtLrwwFeebSvknOItx05KQ&s'),
                ('War and Peace', (SELECT id FROM authors WHERE name = 'Leo Tolstoy'), 587287, '1869-01-01', 'https://m.media-amazon.com/images/I/81oHM-dzefL._AC_UF1000,1000_QL80_.jpg'),
                ('The Adventures of Huckleberry Finn', (SELECT id FROM authors WHERE name = 'Mark Twain'), 109571, '1884-12-10', 'https://ir.ozone.ru/s3/multimedia-t/c1000/6895260101.jpg'),
                ('Harry Potter and the Chamber of Secrets', (SELECT id FROM authors WHERE name = 'J.K. Rowling'), 85141, '1998-07-02', 'https://www.logobook.ru/make_nimage.php?uid=12618795'),
                ('Animal Farm', (SELECT id FROM authors WHERE name = 'George Orwell'), 29966, '1945-08-17', 'https://m.media-amazon.com/images/I/91Lbhwt5RzL._AC_UF1000,1000_QL80_.jpg'),
                ('Sense and Sensibility', (SELECT id FROM authors WHERE name = 'Jane Austen'), 119394, '1811-10-30', 'https://m.media-amazon.com/images/M/MV5BY2MyZWJhNjktMWQ2My00OTgwLWI1NjEtYjUzM2M2N2M4Mzc4XkEyXkFqcGc@._V1_.jpg'),
                ('A Farewell to Arms', (SELECT id FROM authors WHERE name = 'Ernest Hemingway'), 89066, '1929-09-27', 'https://m.media-amazon.com/images/I/719VFUyk9GL._AC_UF894,1000_QL80_.jpg'),
                ('And Then There Were None', (SELECT id FROM authors WHERE name = 'Agatha Christie'), 54821, '1939-11-06', 'https://www.moscowbooks.ru/image/book/716/orig/i716565.jpg?cu=20220529223500'),
                ('Love in the Time of Cholera', (SELECT id FROM authors WHERE name = 'Gabriel García Márquez'), 120000, '1985-03-10', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSICSDSnK1SQA90zlIjHy2PUsdDWW9Lpjzk0A&s'),
                ('Kafka on the Shore', (SELECT id FROM authors WHERE name = 'Haruki Murakami'), 132998, '2002-09-12', 'https://static.insales-cdn.com/images/products/1/3137/885296193/81tdbrewW0L._SL1500_.jpg'),
                ('To the Lighthouse', (SELECT id FROM authors WHERE name = 'Virginia Woolf'), 69000, '1927-05-05', 'https://jupiterbooks.ru/image/catalog/OWC/1/books-9780199536610.jpg'),
                ('Anna Karenina', (SELECT id FROM authors WHERE name = 'Leo Tolstoy'), 349736, '1877-01-01', 'https://m.media-amazon.com/images/I/71O3PTUA3vL.jpg'),
                ('The Adventures of Tom Sawyer', (SELECT id FROM authors WHERE name = 'Mark Twain'), 70570, '1876-12-01', 'https://imo10.labirint.ru/books/763685/cover.jpg/85-0'),
                ('Harry Potter and the Prisoner of Azkaban', (SELECT id FROM authors WHERE name = 'J.K. Rowling'), 107253, '1999-07-08', 'https://ir.ozone.ru/s3/multimedia-9/c1000/6794355285.jpg'),
                ('Homage to Catalonia', (SELECT id FROM authors WHERE name = 'George Orwell'), 87000, '1938-04-25', 'https://imo10.labirint.ru/books/965343/cover.jpg/85-0'),
                ('Emma', (SELECT id FROM authors WHERE name = 'Jane Austen'), 159852, '1815-12-23', 'https://upload.wikimedia.org/wikipedia/commons/f/f2/EmmaTitlePage.jpg'),
                ('For Whom the Bell Tolls', (SELECT id FROM authors WHERE name = 'Ernest Hemingway'), 174000, '1940-10-21', 'https://m.media-amazon.com/images/I/71tC6Us5sLL.jpg'),
                ('Death on the Nile', (SELECT id FROM authors WHERE name = 'Agatha Christie'), 66681, '1937-11-01', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL3j0xD-mQwtS6cSffnGlZhHddPLUiuCyC4g&s'),
                ('Chronicle of a Death Foretold', (SELECT id FROM authors WHERE name = 'Gabriel García Márquez'), 35000, '1981-01-01', 'https://upload.wikimedia.org/wikipedia/en/5/50/ChronicleOfADeathForetold.JPG'),
                ('1Q84', (SELECT id FROM authors WHERE name = 'Haruki Murakami'), 364153, '2009-05-29', 'https://www.litres.ru/pub/c/cover/8074387.jpg'),
                ('Orlando', (SELECT id FROM authors WHERE name = 'Virginia Woolf'), 80000, '1928-10-11', 'https://imo10.labirint.ru/books/994756/cover.jpg/85-0'),
                ('The Death of Ivan Ilyich', (SELECT id FROM authors WHERE name = 'Leo Tolstoy'), 22000, '1886-01-01', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHo4kGLdpVKQxjg0SQutCub-_CRhf9si6Ybg&s'),
                ('A Connecticut Yankee in King Arthur''s Court', (SELECT id FROM authors WHERE name = 'Mark Twain'), 119650, '1889-12-01', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348239402i/162898.jpg');
            `;
            await client.sql`COMMIT`
        }catch(e) {
            await client.sql`ROLLBACK`;
            console.error(e);
            throw e
        }
    })
}
////
//Debug
////

export async function getAllUsers() {
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT * FROM users
        `;

        return result;
    });
}
export async function getAllAuthors() {
    return withDbClient(async (client) => {
        const result = await client.sql`
            SELECT * FROM authors
        `;

        return result;
    });
}

export async function dropTableUsers(){
    return withDbClient(async (client) => {
        const result = await client.sql`
            DROP TABLE users
        `;

        return result;
    });
}
export async function dropTableBooks(){
    return withDbClient(async (client) => {
        const result = await client.sql`
            DROP TABLE books
        `;

        return result;
    });
}
export async function dropTableAuthors(){
    return withDbClient(async (client) => {
        const result = await client.sql`
            DROP TABLE Author
        `;

        return result;
    });
}
export async function dropTableFavAuthors(){
    return withDbClient(async (client) => {
        const result = await client.sql`
            DROP TABLE fav_authors
        `;

        return result;
    });
}
