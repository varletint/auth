import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// Uses environment variables for configuration (recommended for production)

let bucket = null;
let isInitialized = false;

// Check if required environment variables are present
const hasRequiredEnvVars =
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET;

if (!hasRequiredEnvVars) {
    console.warn('⚠️ Firebase Admin SDK: Missing environment variables. Image deletion will be skipped.');
    console.warn('   Required: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_STORAGE_BUCKET');
} else if (!admin.apps.length) {
    try {
        const firebaseConfig = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // The private key comes as a string with escaped newlines, we need to convert them
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        };

        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });

        bucket = admin.storage().bucket();
        isInitialized = true;
        console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    }
}

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - The full Firebase Storage URL of the file
 * @returns {Promise<boolean>} - True if deleted successfully, false otherwise
 */
export const deleteFileFromStorage = async (fileUrl) => {
    try {
        if (!fileUrl) return false;

        // Skip if Firebase is not initialized
        if (!isInitialized || !bucket) {
            console.warn('Firebase Admin SDK not initialized. Skipping image deletion.');
            return false;
        }

        // Extract file path from Firebase Storage URL
        // URL format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/PATH?token=...
        const filePath = extractFilePathFromUrl(fileUrl);

        if (!filePath) {
            console.warn('Could not extract file path from URL:', fileUrl);
            return false;
        }

        await bucket.file(filePath).delete();
        console.log(`✅ Deleted file: ${filePath}`);
        return true;
    } catch (error) {
        // File might not exist, which is okay
        if (error.code === 404) {
            console.warn(`File not found (already deleted?): ${fileUrl}`);
            return true;
        }
        console.error(`❌ Failed to delete file: ${fileUrl}`, error.message);
        return false;
    }
};

/**
 * Delete multiple files from Firebase Storage
 * @param {string[]} fileUrls - Array of Firebase Storage URLs
 * @returns {Promise<{success: number, failed: number}>}
 */
export const deleteMultipleFilesFromStorage = async (fileUrls) => {
    if (!fileUrls || fileUrls.length === 0) {
        return { success: 0, failed: 0 };
    }

    let success = 0;
    let failed = 0;

    for (const url of fileUrls) {
        const result = await deleteFileFromStorage(url);
        if (result) {
            success++;
        } else {
            failed++;
        }
    }

    return { success, failed };
};

/**
 * Extract file path from Firebase Storage URL
 * @param {string} url - Firebase Storage URL
 * @returns {string|null} - File path or null if extraction failed
 */
function extractFilePathFromUrl(url) {
    try {
        if (!url) return null;

        // Firebase Storage URL format:
        // https://firebasestorage.googleapis.com/v0/b/bucket-name/o/path%2Fto%2Ffile.jpg?alt=media&token=...
        const match = url.match(/\/o\/(.+?)\?/);

        if (match && match[1]) {
            // Decode the URL-encoded path
            return decodeURIComponent(match[1]);
        }

        // Alternative format: gs://bucket-name/path/to/file.jpg
        if (url.startsWith('gs://')) {
            const gsMatch = url.match(/gs:\/\/[^/]+\/(.+)/);
            if (gsMatch && gsMatch[1]) {
                return gsMatch[1];
            }
        }

        return null;
    } catch (error) {
        console.error('Error extracting file path:', error.message);
        return null;
    }
}

export { admin, bucket };
export default admin;
