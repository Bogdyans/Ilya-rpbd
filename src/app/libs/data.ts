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
        console.log(result)
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
                    FOREIGN KEY (author_id) REFERENCES Author(id)
                );
        `;
            await client.sql`COMMIT`;
        } catch (e) {
            await client.sql`ROLLBACK`;
            console.error(e);
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
            DROP TABLE Book
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
