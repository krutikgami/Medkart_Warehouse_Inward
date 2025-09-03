import { PrismaClient } from "@prisma/client";
import { dbcols, dbname } from "../../utilities/constants/dbMappings.js";
const prisma = new PrismaClient();

export const commonFilter = async (req, res) => {
  try {
    const { search = "", status = "All", db, page = 1, limit = 10 } = req.query;

    if (!db || !dbname[db]) {
      return res.status(400).json({
        success: false,
        message: "Invalid db parameter. Use one of: PM, VM, PO, PI, GRN",
      });
    }

    const modelName = dbname[db];
    const searchCols = dbcols[db] || [];

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNum - 1) * pageSize;

    const where = { deletedAt: null };

    if (search && searchCols.length > 0) {
      where.OR = searchCols.map((col) => ({
        [col]: { contains: search, mode: "insensitive" },
      }));
    }

    if (status !== "All") {
      where.status = status;
    }


    const totalRecords = await prisma[modelName].count({ where });
    const shouldIncludeItems = ["purchaseOrder", "purchaseInvoice", "grn"].includes(modelName);
    const data = await prisma[modelName].findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { created_at: "desc" }, 
      ...(shouldIncludeItems && {
          include: {
          items: true,
        },
      }),
    });

    return res.status(200).json({
      success: true,
      message: `${modelName} fetched successfully`,
      data,
      meta: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / pageSize),
        limit: pageSize,
        hasNextPage: pageNum * pageSize < totalRecords,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Error in commonFilter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
