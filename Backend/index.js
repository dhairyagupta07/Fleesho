import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from "./routes/customer.routes.js"
import productRoutes from "./routes/product.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

mongoose.connect(process.env.dbURL).then(()=>{
    console.log('DB connected')
}).catch((err)=>{
    console.log(err);
})
const PORT = process.env.PORT || 8000;

app.use(express.json())
app.use(cookieParser())
app.use('/api/customers', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

if (process.env.VERCEL !== '1') {
    app.listen(PORT, ()=> {
        console.log(`Server started on port ${PORT}`);
    });
}

export default app;
