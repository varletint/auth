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
