import { VercelRequest, VercelResponse } from '@vercel/node';
import { generateSecureSignature } from '@uploadcare/signed-uploads';

export default (req: VercelRequest, res: VercelResponse) => {
    // Get the secret key from environment variables
    const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;

    // Ensure the secret key is available
    if (!UPLOADCARE_SECRET_KEY) {
        return res.status(500).json({ error: "UPLOADCARE_SECRET_KEY is not set in the environment." });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Generate signature set to expire in 30 minutes
    const { secureSignature, secureExpire } = generateSecureSignature(UPLOADCARE_SECRET_KEY, {
        lifetime: 60 * 30 * 1000 // expire in 30 minutes
    });

    res.json({
        signature: secureSignature,
        expire: secureExpire
    });
};