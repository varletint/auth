const base_url = "http://localhost:3000/api";
export const apiCall = async (url, options) => {
    try {
        const res = await fetch(`${base_url}${url}`,
            {
                ...options,
                credentials: "include",
                headers:
                {
                    ...options.headers,
                    "Content-Type": "application/json"
                }
            })
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Request failed");
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(error.message || "Network error");

    }
}


// const validateCreateProduct = (body) => {
//     const { name, price, category, stock, images, description, sku, isActive } = body;
//     const errors = [];

//     if (!name || typeof name !== 'string' || name.trim().length < 3) {
//         errors.push("Name is required, must be a string, and at least 3 characters long");
//     }
//     if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
//         errors.push("Price is required and must be a non-negative number");
//     }
//     if (!category || typeof category !== 'string') {
//         errors.push("Category is required and must be a string");
//     }
//     if (stock !== undefined && (isNaN(stock) || Number(stock) < 0)) {
//         errors.push("Stock must be a non-negative number");
//     }
//     if (images && !Array.isArray(images)) {
//         errors.push("Images must be an array");
//     }
//     if (description && typeof description !== 'string') {
//         errors.push("Description must be a string");
//     }
//     if (sku && typeof sku !== 'string') {
//         errors.push("SKU must be a string");
//     }
//     if (isActive !== undefined && typeof isActive !== 'boolean') {
//         errors.push("isActive must be a boolean");
//     }
//     return errors;
// };

// const runTests = () => {
//     console.log("Running validation tests...");

//     const tests = [
//         {
//             name: "Valid Product",
//             input: { name: "Test Product", price: 100, category: "Test", stock: 10 },
//             expectedErrors: 0
//         },
//         {
//             name: "Missing Name",
//             input: { price: 100, category: "Test" },
//             expectedErrors: 1
//         },
//         {
//             name: "Invalid Price (String)",
//             input: { name: "Test", price: "invalid", category: "Test" },
//             expectedErrors: 1
//         },
//         {
//             name: "Negative Price",
//             input: { name: "Test", price: -10, category: "Test" },
//             expectedErrors: 1
//         },
//         {
//             name: "Negative Stock",
//             input: { name: "Test", price: 10, category: "Test", stock: -5 },
//             expectedErrors: 1
//         },
//         {
//             name: "Invalid Images",
//             input: { name: "Test", price: '10', category: "Test", images: "not-an-array" },
//             expectedErrors: 2
//         }
//     ];

//     let passed = 0;
//     tests.forEach(test => {
//         const errors = validateCreateProduct(test.input);
//         if (errors.length === test.expectedErrors) {
//             console.log(`[PASS] ${test.name}`);
//             passed++;
//         } else {
//             console.log(`[FAIL] ${test.name}. Expected ${test.expectedErrors} errors, got ${errors.length}: ${JSON.stringify(errors)}`);
//         }
//     });

//     console.log(`\nPassed ${passed}/${tests.length} tests.`);
// };

// runTests();
