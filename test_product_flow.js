import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/products';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('Starting Product Controller Tests...');

    let productId;

    // 1. Create Product
    try {
        console.log('\n1. Testing Create Product...');
        const productData = {
            name: "Test Product",
            description: "A product for testing",
            price: 99.99,
            category: "Electronics",
            stock: 10,
            sku: `TEST-${Date.now()}`
        };
        const res = await axios.post(BASE_URL, productData);
        console.log('✅ Create Success:', res.status === 201);
        productId = res.data._id;
    } catch (error) {
        console.error('❌ Create Failed:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
        } else if (error.request) {
            console.error('No response received. Request info:', error.code);
        }
        return;
    }

    // 2. Get Product (Uncached)
    try {
        console.log('\n2. Testing Get Product (Uncached)...');
        const start = Date.now();
        const res = await axios.get(`${BASE_URL}/${productId}`);
        const duration = Date.now() - start;
        console.log(`✅ Get Success: ${res.status === 200} (Time: ${duration}ms)`);
    } catch (error) {
        console.error('❌ Get Failed:', error.response?.data || error.message);
    }

    // 3. Get Product (Cached)
    try {
        console.log('\n3. Testing Get Product (Cached)...');
        const start = Date.now();
        const res = await axios.get(`${BASE_URL}/${productId}`);
        const duration = Date.now() - start;
        console.log(`✅ Get Cached Success: ${res.status === 200} (Time: ${duration}ms)`);
        if (duration > 50) console.warn('⚠️ Cache might not be working efficiently (Time > 50ms)');
    } catch (error) {
        console.error('❌ Get Cached Failed:', error.response?.data || error.message);
    }

    // 4. Update Product
    try {
        console.log('\n4. Testing Update Product...');
        const updateData = { price: 199.99 };
        const res = await axios.put(`${BASE_URL}/${productId}`, updateData);
        console.log('✅ Update Success:', res.status === 200 && res.data.price === 199.99);
    } catch (error) {
        console.error('❌ Update Failed:', error.response?.data || error.message);
    }

    // 5. Get Product (After Update - Should be fresh or invalidated)
    try {
        console.log('\n5. Testing Get Product (After Update)...');
        const res = await axios.get(`${BASE_URL}/${productId}`);
        console.log('✅ Get Updated Success:', res.data.price === 199.99);
    } catch (error) {
        console.error('❌ Get Updated Failed:', error.response?.data || error.message);
    }

    // 6. Get All Products (Pagination & Filtering)
    try {
        console.log('\n6. Testing Get All Products...');
        const res = await axios.get(`${BASE_URL}?category=Electronics&limit=5`);
        console.log('✅ List Success:', res.status === 200 && Array.isArray(res.data.products));
        console.log(`   Found ${res.data.products.length} products`);
    } catch (error) {
        console.error('❌ List Failed:', error.response?.data || error.message);
    }

    // 7. Delete Product
    try {
        console.log('\n7. Testing Delete Product...');
        const res = await axios.delete(`${BASE_URL}/${productId}`);
        console.log('✅ Delete Success:', res.status === 200);
    } catch (error) {
        console.error('❌ Delete Failed:', error.response?.data || error.message);
    }

    // 8. Rate Limiting (Optional - might trigger if run too fast, but let's try to trigger it intentionally)
    console.log('\n8. Testing Rate Limiting (Rapid Requests)...');
    let limitHit = false;
    try {
        const promises = [];
        for (let i = 0; i < 15; i++) {
            promises.push(axios.post(BASE_URL, {
                name: "Spam Product",
                price: 1,
                category: "Spam"
            }).catch(e => e)); // Catch locally to check status
        }
        const results = await Promise.all(promises);
        const tooManyRequests = results.find(r => r.response?.status === 429);
        if (tooManyRequests) {
            console.log('✅ Rate Limit Hit (429 received)');
            limitHit = true;
        } else {
            console.log('⚠️ Rate Limit Not Hit (Check configuration or limits)');
        }
    } catch (error) {
        console.log('Error during rate limit test:', error.message);
    }

    console.log('\nTests Completed.');
}

runTests();
