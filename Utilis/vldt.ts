/**
 * Validation utilities with proper TypeScript patterns
 */

// ============ Type Definitions ============

export interface ProductInput {
    name?: string;
    price?: number;
    category?: string;
    stock?: number;
    images?: string[];
    description?: string;
    sku?: string;
    isActive?: boolean;
}

export interface SigninInput {
    username: string;
    password: string;
}

export interface SignupInput {
    username: string;
    password: string;
    phone_no: string | number;
    email?: string;
}

// Validation result type - either success or error with message
export type ValidationResult =
    | { success: true; error: null }
    | { success: false; error: string };

// Field-specific error for detailed validation feedback
export interface FieldError {
    field: string;
    message: string;
}

export type DetailedValidationResult =
    | { success: true; errors: null }
    | { success: false; errors: FieldError[] };

// ============ Helper Functions ============

const createSuccess = (): ValidationResult => ({ success: true, error: null });
const createError = (message: string): ValidationResult => ({ success: false, error: message });

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0;

const isValidNumber = (value: unknown): value is number =>
    typeof value === 'number' && !isNaN(value);

const isNonNegativeNumber = (value: unknown): boolean =>
    isValidNumber(value) && value >= 0;

const hasMinLength = (value: string, min: number): boolean =>
    value.trim().length >= min;

// ============ Validation Constants ============

const VALIDATION_RULES = {
    username: { minLength: 3 },
    password: { minLength: 6 },
    productName: { minLength: 3 },
} as const;

const ERROR_MESSAGES = {
    product: {
        nameRequired: "Name is required, must be a string, and at least 3 characters long",
        nameInvalid: "Name must be a string and at least 3 characters long",
        priceRequired: "Price is required and must be a non-negative number",
        priceInvalid: "Price must be a non-negative number",
        categoryRequired: "Category is required and must be a string",
        categoryInvalid: "Category must be a string",
        stockInvalid: "Stock must be a non-negative number",
        imagesInvalid: "Images must be an array",
        descriptionInvalid: "Description must be a string",
        skuInvalid: "SKU must be a string",
        isActiveInvalid: "isActive must be a boolean",
    },
    signin: {
        usernameRequired: "Username is required and must be a string",
        passwordRequired: "Password is required and must be a string",
    },
    signup: {
        usernameRequired: "Username is required and must be at least 3 characters long",
        passwordRequired: "Password is required and must be at least 6 characters long",
        phoneRequired: "Phone number is required and must be a number",
        emailInvalid: "Invalid email format",
    },
} as const;

// ============ Validators ============

/**
 * Validates product input for create or update operations
 * @param data - Product data to validate
 * @param isUpdate - If true, fields are optional (partial update)
 * @returns ValidationResult with success status or error message
 */
export const validateProductInput = (data: ProductInput, isUpdate: boolean = false): ValidationResult => {
    const { name, price, category, stock, images, description, isActive } = data;
    const msg = ERROR_MESSAGES.product;

    // Required field validation (only for create)
    if (!isUpdate) {
        if (!isNonEmptyString(name) || !hasMinLength(name, VALIDATION_RULES.productName.minLength)) {
            return createError(msg.nameRequired);
        }
        if (price === undefined || price === null || !isNonNegativeNumber(price)) {
            return createError(msg.priceRequired);
        }
        if (!isNonEmptyString(category)) {
            return createError(msg.categoryRequired);
        }
    } else {
        // Partial validation for updates
        if (name !== undefined && (!isNonEmptyString(name) || !hasMinLength(name, VALIDATION_RULES.productName.minLength))) {
            return createError(msg.nameInvalid);
        }
        if (price !== undefined && !isNonNegativeNumber(price)) {
            return createError(msg.priceInvalid);
        }
        if (category !== undefined && !isNonEmptyString(category)) {
            return createError(msg.categoryInvalid);
        }
    }

    // Optional field validation (applies to both create and update)
    if (stock !== undefined && !isNonNegativeNumber(stock)) {
        return createError(msg.stockInvalid);
    }
    if (images !== undefined && !Array.isArray(images)) {
        return createError(msg.imagesInvalid);
    }
    if (description !== undefined && typeof description !== 'string') {
        return createError(msg.descriptionInvalid);
    }
    if (isActive !== undefined && typeof isActive !== 'boolean') {
        return createError(msg.isActiveInvalid);
    }

    return createSuccess();
};

/**
 * Validates signin credentials
 * @param data - Signin credentials
 * @returns ValidationResult with success status or error message
 */
export const validateSigninInput = (data: SigninInput): ValidationResult => {
    const { username, password } = data;
    const msg = ERROR_MESSAGES.signin;

    if (!isNonEmptyString(username)) {
        return createError(msg.usernameRequired);
    }

    if (!isNonEmptyString(password)) {
        return createError(msg.passwordRequired);
    }

    return createSuccess();
};

/**
 * Validates signup data
 * @param data - Signup data including username, password, and phone
 * @returns ValidationResult with success status or error message
 */
export const validateSignupInput = (data: SignupInput): ValidationResult => {
    const { username, password, phone_no } = data;
    const msg = ERROR_MESSAGES.signup;

    if (!isNonEmptyString(username) || !hasMinLength(username, VALIDATION_RULES.username.minLength)) {
        return createError(msg.usernameRequired);
    }

    if (!isNonEmptyString(password) || !hasMinLength(password, VALIDATION_RULES.password.minLength)) {
        return createError(msg.passwordRequired);
    }

    const phoneAsNumber = typeof phone_no === 'string' ? Number(phone_no) : phone_no;
    if (!phone_no || isNaN(phoneAsNumber)) {
        return createError(msg.phoneRequired);
    }

    return createSuccess();
};

// ============ Legacy Compatibility ============
// These wrappers return string | null for backward compatibility

/**
 * @deprecated Use validateProductInput().error instead
 */
export const validateProductInputLegacy = (data: ProductInput, isUpdate: boolean = false): string | null => {
    const result = validateProductInput(data, isUpdate);
    return result.success ? null : result.error;
};

/**
 * @deprecated Use validateSigninInput().error instead
 */
export const validateSigninInputLegacy = (data: SigninInput): string | null => {
    const result = validateSigninInput(data);
    return result.success ? null : result.error;
};

/**
 * @deprecated Use validateSignupInput().error instead
 */
export const validateSignupInputLegacy = (data: SignupInput): string | null => {
    const result = validateSignupInput(data);
    return result.success ? null : result.error;
};

// ============ Type Guards ============

export const isProductInput = (data: unknown): data is ProductInput => {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;

    return (
        (obj.name === undefined || typeof obj.name === 'string') &&
        (obj.price === undefined || typeof obj.price === 'number') &&
        (obj.category === undefined || typeof obj.category === 'string') &&
        (obj.stock === undefined || typeof obj.stock === 'number') &&
        (obj.images === undefined || Array.isArray(obj.images)) &&
        (obj.description === undefined || typeof obj.description === 'string') &&
        (obj.isActive === undefined || typeof obj.isActive === 'boolean')
    );
};

export const isSigninInput = (data: unknown): data is SigninInput => {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;

    return typeof obj.username === 'string' && typeof obj.password === 'string';
};

export const isSignupInput = (data: unknown): data is SignupInput => {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;

    return (
        typeof obj.username === 'string' &&
        typeof obj.password === 'string' &&
        (typeof obj.phone_no === 'string' || typeof obj.phone_no === 'number')
    );
};
