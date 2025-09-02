export const checkExpiry = (mfg_date,exp_date)=>{
    const minExpiryDate = new Date(mfg_date)
    minExpiryDate.setMonth(minExpiryDate.getMonth()+3);
    if (exp_date <= minExpiryDate) {
        return false;
    }
    return true;
}