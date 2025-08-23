import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import ProductMaster from './routes/productMaster/productMaster.routes.js';
import VendorMaster from './routes/vendorMaster/vendorMaster.routes.js';
import PurchaseOrder from './routes/purchaseOrder/purchaseOrder.routes.js';
import TotalCounts from './routes/totalCounts.routes.js';
import Grn from './routes/goodsReceiptNote/grn.routes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/productMaster', ProductMaster);
app.use('/api/vendorMaster', VendorMaster);
app.use('/api/purchaseOrder', PurchaseOrder);
app.use('/api', TotalCounts);
app.use('/api/goodsReceiptNote', Grn);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
