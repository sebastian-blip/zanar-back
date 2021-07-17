import bcrypt from 'bcrypt';

const transform2YTo2B = hash => {
    return hash.replace(/^(\$2y\$)/,"$2b$");
};

export class Encryption {
    static compare(plainText, hash){
        let bHash = transform2YTo2B(hash);
        return bcrypt.compareSync(plainText, bHash);
    }

    static encrypt(plainText){
        const cost = 10;
        const hashPassword = bcrypt.hashSync(plainText, cost);
        return hashPassword;
    }
}