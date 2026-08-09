import crypto from 'node:crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; 
const ALGORITHM = 'aes-256-gcm';

export function encryptPrivateKey(privateKey: string) {
    // 1. Generate a random 16-byte initialization vector (IV) for this specific encryption
    const iv = crypto.randomBytes(16);
    
    // 2. Create the cipher
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

    // 3. Encrypt the private key
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // 4. Get the authentication tag
    const authTag = cipher.getAuthTag().toString('hex');

    // You must store all three of these values in your database
    return {
        iv: iv.toString('hex'),
        authTag: authTag,
        encryptedData: encrypted
    };
}

export function decryptPrivateKey(encryptedData: string, iv: string, authTag: string) {
    // 1. Rebuild the decipher using the master key and the stored IV
    const decipher = crypto.createDecipheriv(
        ALGORITHM,
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(iv, 'hex')
    );
    
    // 2. Pass in the auth tag to verify the data hasn't been tampered with
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    // 3. Decrypt the key
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}