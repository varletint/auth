export const validateProductInput = (data, isUpdate = false) => {
    const { name, price, category, stock, images, description, sku, isActive } = data;

    if (!isUpdate) {
        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            return "Name is required, must be a string, and at least 3 characters long";
        }
        if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
            return "Price is required and must be a non-negative number";
        }
        if (!category || typeof category !== 'string') {
            return "Category is required and must be a string";
        }
    } else {
        if (name !== undefined && (typeof name !== 'string' || name.trim().length < 3)) {
            return "Name must be a string and at least 3 characters long";
        }
        if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
            return "Price must be a non-negative number";
        }
        if (category !== undefined && typeof category !== 'string') {
            return "Category must be a string";
        }
    }

    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
        return "Stock must be a non-negative number";
    }
    if (images !== undefined && !Array.isArray(images)) {
        return "Images must be an array";
    }
    if (description !== undefined && typeof description !== 'string') {
        return "Description must be a string";
    }
    if (sku !== undefined && typeof sku !== 'string') {
        return "SKU must be a string";
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
        return "isActive must be a boolean";
    }

    return null;
};

export const validateSigninInput = (data) => {
    const { email, password } = data;

    if (!email || typeof email !== 'string') {
        return "Email is required and must be a string";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    if (!password || typeof password !== 'string') {
        return "Password is required and must be a string";
    }

    return null;
};

export const validateSignupInput = (data) => {
    const { username, email, password, phone_no } = data;

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
        return "Username is required and must be at least 3 characters long";
    }

    if (!email || typeof email !== 'string') {
        return "Email is required and must be a string";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
        return "Password is required and must be at least 6 characters long";
    }

    if (!phone_no || isNaN(phone_no)) {
        return "Phone number is required and must be a number";
    }

    return null;
};
