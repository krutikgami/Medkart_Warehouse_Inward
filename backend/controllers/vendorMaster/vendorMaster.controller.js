import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import {updateVendorSchema,vendorSchema} from '../../zodValidations/vendorMaster.js'
import { ZodError } from '../../utilities/zodError.js'

const prisma = new PrismaClient()

const addVendorMaster = async (req, res) => {
  try {
    
    const validations = vendorSchema.parse(req.body)

    const UniqCode = crypto.randomBytes(3).toString('hex').toUpperCase()
    const vendorCode = `VEN-${UniqCode}`

    const exist_VendorCode = await prisma.vendorMaster.findFirst({
      where:{
        vendor_code: vendorCode,
      }
    })

    if(exist_VendorCode){
        return res.status(400).json({
        success : false,
        message : "Vendor Code already exists"
      })
    }
    
    const newVendor = await prisma.vendorMaster.create({
      data: {
        vendor_code: vendorCode,
        ...validations
      },
    })

    if (!newVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor creation failed',
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Vendor added successfully',
      data: newVendor,
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
    console.log('Error creating in Vendor Master', error.message)
    return res.json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}
const getAllVendors = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const totalRecords = await prisma.vendorMaster.count({
      where: {
        deletedAt: null,
      },
    });

    const vendors = await prisma.vendorMaster.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        updated_at: "desc",
      },
      skip,
      take: limit,
    });

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Vendors found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vendors fetched successfully",
      data: vendors,
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
    console.log("Error in getting All Vendors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { vendor_code } = req.body

    if (!vendor_code) {
      return res.status(400).json({
        success: false,
        message: 'Vendor code is required',
      })
    }

    const deletedVendor = await prisma.vendorMaster.update({
      where: { vendor_code },
      data:{
        deletedAt : new Date()
      }
    })
    if (!deletedVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not Deleted',
      })
    }
    return res.status(200).json({
      success: true,
      message: 'Vendor deleted successfully',
      data: deletedVendor,
    })
  } catch (error) {
    console.log('Error in deleteVendor controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

const updateVendor = async (req, res) => {
  try {
    
    const validations = updateVendorSchema.parse(req.body)
    const existingVendor = await prisma.vendorMaster.findUnique({
      where: { vendor_code : validations.vendor_code },
    })

    if (!existingVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      })
    }

    const updatedVendor = await prisma.vendorMaster.update({
      where: { vendor_code: validations.vendor_code },
      data: {
        vendor_name: validations.vendor_name || existingVendor.vendor_name,
        contact_person: validations.contact_person || existingVendor.contact_person,
        contact_number: validations.contact_number || existingVendor.contact_number,
        gst_number: validations.gst_number || existingVendor.gst_number,
        address: validations.address || existingVendor.address,
        status: validations.status || existingVendor.status,
      },
    })

    if (!updatedVendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Vendor updated successfully',
      data: updatedVendor,
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
    console.log('Error in updateVendor controller:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    })
  }
}

export { addVendorMaster, getAllVendors, deleteVendor, updateVendor }
