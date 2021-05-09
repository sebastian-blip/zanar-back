
const database = {
    USER: process.env.DATABASE_USER || 'root',
    PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE: process.env.DATABASE_NAME,
    HOST: process.env.DATABASE_HOST || 'localhost',
    DIALECT: 'mysql'
}

export default database;