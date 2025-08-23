import {PrismaClient} from '@prisma/client'
import crypto from 'crypto';
const prisma = new PrismaClient()


const productMaster = async(req, res) =>{
    try{
        const {product_name,product_description,product_price,product_mrp,hsn_code,category,combination,unit_of_measure,status,product_last_purchase_price} = req.body;
        if(!product_name || !product_description || !product_price || !product_mrp || !hsn_code || !category || !combination || !unit_of_measure || !status || !product_last_purchase_price){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const UniqCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        const productCode = `prc-${UniqCode}`

        const newProduct = await prisma.productMaster.create({
            data:{
                product_code : productCode,
                product_name,
                product_description,
                product_price : parseFloat(product_price),
                product_mrp : parseFloat(product_mrp),
                hsn_code : parseInt(hsn_code),
                category,
                combination,
                unit_of_measure,
                status,
                product_last_purchase_price : parseFloat(product_last_purchase_price)
            }
        });

        if(!newProduct){
            return res.status(400).json({
                success: false,
                message: "Product creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: newProduct
        });
    }catch(error){
        console.error("Error in productManager controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const getAllProducts = async(req,res) =>{
    try {
        const products = await prisma.productMaster.findMany({
            orderBy:{
                updated_at : 'desc'
            }
        });
        if(!products || products.length === 0){
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error in getAllProducts controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { product_code } = req.body;
        if (!product_code) {
            return res.status(400).json({
                success: false,
                message: "Product code is required"
            });
        }
        const deletedProduct = await prisma.productMaster.delete({
            where: { product_code }
        });
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error) {
        console.error("Error in deleteProduct controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const updateProduct = async(req,res)=>{
    try {
        const {product_code,product_name,product_description,product_price,product_mrp,hsn_code,category,combination,unit_of_measure,status} = req.body;
        if(!product_code){
            return res.status(400).json({
                success: false,
                message: "Product code is required for Update Product"
            });
        }

        const existingProduct = await prisma.productMaster.findUnique({
            where: { product_code }
        });

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const updatedProduct = await prisma.productMaster.update({
            where: { product_code },
            data: {
                product_name: product_name || existingProduct.product_name,
                product_description: product_description || existingProduct.product_description,
                product_price: parseFloat(product_price) || existingProduct.product_price,
                product_mrp: parseFloat(product_mrp) || existingProduct.product_mrp,
                hsn_code: parseInt(hsn_code) || existingProduct.hsn_code,
                category: category || existingProduct.category,
                combination: combination || existingProduct.combination,
                unit_of_measure: unit_of_measure || existingProduct.unit_of_measure,
                status: status || existingProduct.status
            }
        });

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });
    } catch (error) {
        console.error("Error in updateProduct controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export {productMaster, getAllProducts,deleteProduct,updateProduct};