import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productModel from './src/models/product.model.js';

dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find all products with empty variants array
    const products = await productModel.find({ 
        $or: [
            { variants: { $exists: false } },
            { variants: { $size: 0 } }
        ]
    });
    
    console.log(`Found ${products.length} products with no variants.`);
    
    for (const product of products) {
        product.variants.push({
            images: product.images,
            price: {
                amount: product.price.amount,
                currency: product.price.currency
            },
            stock: 15, // default stock
            attributes: {}
        });
        await product.save();
        console.log(`Updated product ${product.title} (${product._id}) with a default variant.`);
    }
    
    await mongoose.disconnect();
}

run().catch(console.error);
