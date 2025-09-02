import {ExpiryMonth} from './constants/literals.js';
export const checkExpiry = (exp_date)=>{
    const minExpiryDate = new Date();
    minExpiryDate.setMonth(minExpiryDate.getMonth()+ExpiryMonth);
    if (exp_date <= minExpiryDate) {
        return false;
    }
    return true;
}