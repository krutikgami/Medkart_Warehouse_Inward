import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import { productSchema , updateProductSchema} from '../../zodValidations/productMaster.js'
import { success, z } from 'zod'
import { ZodError } from '../../utilities/zodError.js'
const prisma = new PrismaClient()

const productMaster = async (req, res) => {
  try {
    const validations = productSchema.parse(req.body)

    if (validations.product_mrp < validations.product_price) {
      return res.status(400).json({
        success: false,
        message: 'MRP should be greater than or equal to Product Price',
      })
    }

    const UniqCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const productCode = `prc-${UniqCode}`

    const exist_productCode = await prisma.productMaster.findFirst({
      where:{
        product_code : productCode
      }
    })

    if(exist_productCode){
      return res.status(400).json({
        success : false,
        message : "Product Code already Exists"
      })
    }

    const newProduct = await prisma.productMaster.create({
      data: {
        product_code: productCode,
        ...validations
      },
    })

    if (!newProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product creation failed',
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: newProduct,
    })
  } catch (error) {
    if(error instanceof z.ZodError){
        const res = ZodError(error);
        return res.status(400).json({
          success : false,
          message: "Validation failed",
          errors: res,
        })
    }
    console.error('Error in productManager controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

const getAllProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const totalRecords = await prisma.productMaster.count({
      where: {
        deletedAt: null,
      },
    });

    const products = await prisma.productMaster.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: limit,
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      meta: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        limit,
        hasNextPage: page * limit < totalRecords,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllProducts controller:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { product_code } = req.body
    if (!product_code) {
      return res.status(400).json({
        success: false,
        message: 'Product code is required',
      })
    }

    const deletedProduct = await prisma.productMaster.update({
      where: { product_code },
      data :{
        deletedAt : new Date()
      }
    })
    
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not Deleted',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: deletedProduct,
    })
  } catch (error) {
    console.error('Error in deleteProduct controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

const updateProduct = async (req, res) => {
  try {
      const validations = updateProductSchema.parse(req.body);

    if (!validations.product_code) {
      return res.status(400).json({
        success: false,
        message: 'Product code is required for Update Product',
      })
    }

    if (validations.product_mrp < validations.product_price) {
      return res.status(400).json({
        success: false,
        message: 'MRP should be greater than or equal to Product Price',
      })
    }

    const existingProduct = await prisma.productMaster.findUnique({
      where: { product_code: validations.product_code },
    })

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    const updatedProduct = await prisma.productMaster.update({
      where: { product_code: validations.product_code  },
      data: {
        product_name: validations.product_name || existingProduct.product_name,
        product_description:
          validations.product_description || existingProduct.product_description,
        product_price:
          validations.product_price || existingProduct.product_price,
        product_mrp: validations.product_mrp || existingProduct.product_mrp,
        hsn_code: validations.hsn_code || existingProduct.hsn_code,
        gst_percent: validations.gst_percent || existingProduct.gst_percent,
        category: validations.category || existingProduct.category,
        combination: validations.combination || existingProduct.combination,
        unit_of_measure: validations.unit_of_measure || existingProduct.unit_of_measure,
        status: validations.status || existingProduct.status,
        product_last_purchase_price : validations.product_last_purchase_price || existingProduct.product_last_purchase_price
      },
    })

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    })
  } catch (error) {
    if(error instanceof z.ZodError){
        const res = ZodError(error);
        return res.status(400).json({
          success : false,
          message: "Validation failed",
          errors: res,
        })
    }
    console.error('Error in updateProduct controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export { productMaster, getAllProducts, deleteProduct, updateProduct }
