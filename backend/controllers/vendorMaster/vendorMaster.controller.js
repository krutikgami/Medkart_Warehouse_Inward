import {PrismaClient} from '@prisma/client'
import crypto from 'crypto';

const prisma = new PrismaClient()

const addVendorMaster = async(req,res)=>{
    try {
        const {vendor_name,contact_person,contact_number,gst_number,address,status,vendor_email} = req.body;
        console.log(req.body);
        if(!vendor_name || !contact_person || !contact_number || !gst_number || !address || !status || !vendor_email){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const UniqCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        const vendorCode = `VEN-${UniqCode}`

        const newVendor = await prisma.vendorMaster.create({
            data:{
                vendor_code: vendorCode,
                vendor_name,
                contact_person,
                contact_number,
                gst_number,
                address,
                status,
                vendor_email
            }
        });

        if(!newVendor){
            return res.status(400).json({
                success: false,
                message: "Vendor creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Vendor added successfully",
            data: newVendor
        });
    } catch (error) {
        console.log("Error creating in Vendor Master",error.message)
        return res.json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}


const getAllVendors = async(req,res) =>{
    try {
        const getAll = await prisma.vendorMaster.findMany({
            orderBy:{
                updated_at : 'desc'
            }
        });
        if(!getAll || getAll.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Vendors found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Vendors fetched successfully",
            data: getAll
        });
    } catch (error) {
        console.log("Error in getting All Vendors",error.message)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

const deleteVendor = async (req, res) => {
    try {
        const { vendor_code } = req.body;

        if (!vendor_code) {
            return res.status(400).json({
                success: false,
                message: "Vendor code is required"
            });
        }

        const deletedVendor = await prisma.vendorMaster.delete({
            where: { vendor_code }
        });
        if (!deletedVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
            data: deletedVendor
        });
    } catch (error) {
        console.log("Error in deleteVendor controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const updateVendor = async (req, res) => {
    try {
        const { vendor_code, vendor_name, contact_person, contact_number, gst_number, address, status } = req.body;
        if (!vendor_code) {
            return res.status(400).json({
                success: false,
                message: "Vendor code is required for Update Vendor"
            });
        }

        const existingVendor = await prisma.vendorMaster.findUnique({
            where: { vendor_code }
        });

        if (!existingVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        const updatedVendor = await prisma.vendorMaster.update({
            where: { vendor_code },
            data: {
                vendor_name : vendor_name || existingVendor.vendor_name,
                contact_person: contact_person || existingVendor.contact_person,
                contact_number: contact_number || existingVendor.contact_number,
                gst_number: gst_number || existingVendor.gst_number,
                address: address || existingVendor.address,
                status: status || existingVendor.status
            }
        });

        if (!updatedVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            data: updatedVendor
        });
    } catch (error) {
        console.log("Error in updateVendor controller:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export {addVendorMaster,getAllVendors,deleteVendor,updateVendor};