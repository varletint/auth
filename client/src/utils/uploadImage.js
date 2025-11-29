import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";



/**
 * Upload image to Firebase Storage
 * @param {File} file - Image file to upload
 * @param {string} path - Storage path (e.g., 'products/productId')
 * @param {Function} onProgress - Optional callback for upload progress
 * @returns {Promise<string>} - Download URL of uploaded image
 */
export const uploadImage = (file, path, onProgress) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject(new Error("No file provided"));
            return;
        }

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const storageRef = ref(storage, `${path}/${filename}`);

        // Start upload
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Calculate progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                if (onProgress) {
                    onProgress(progress);
                }
            },
            (error) => {
                // Handle unsuccessful uploads
                console.error("Upload error:", error);
                reject(error);
            },
            async () => {
                // Handle successful uploads
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} files - Array of image files
 * @param {string} path - Storage path
 * @param {Function} onProgress - Optional callback for overall progress
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadMultipleImages = async (files, path, onProgress) => {
    if (!files || files.length === 0) {
        throw new Error("No files provided");
    }

    const uploadPromises = files.map((file, index) => {
        return uploadImage(file, path, (progress) => {
            if (onProgress) {
                // Calculate overall progress
                const overallProgress = ((index + progress / 100) / files.length) * 100;
                onProgress(overallProgress);
            }
        });
    });

    return Promise.all(uploadPromises);
};



/**
 * [MONGOOSE] Warning: Duplicate schema index on {"username":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:20276) [MONGOOSE] Warning: Duplicate schema index on {"email":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
(node:20276) [MONGOOSE] Warning: Duplicate schema index on {"phone_no":1} found. This is often due to declaring an index using both "index: true" and "schema.index()". Please remove the duplicate index definition.
 
*u dont have to delete configurations ok i might need in the coming days cus i have to read on it. just dont want to implement it yet. you can comment it instead of deleting


*/


