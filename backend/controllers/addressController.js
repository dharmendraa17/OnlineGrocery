import Address from "../models/Address.js"



//Add Address: /api/address/add
export const addAddress=async(req,res)=>{
     try {
        // authUser middleware sets req.userId; fall back to body if present
        const userId = req.userId || req.body?.userId;
        const address = req.body?.address;
        if (!userId || !address) {
          return res.status(400).json({ success: false, message: "Missing userId or address" });
        }
        await Address.create({ ...address, userId });
        res.json({success:true,message: "Address added successfully"})
     } catch (error) {
        console.log(error.message)
        res.json({success:false , message :error.message})
     }
}


// Get Address : /api/address/get

export const getAddress=async(req,res)=>{
     try {
        const userId = req.userId || req.body?.userId;
       if(!userId) return res.status(401).json({ success:false, message: 'Not authenticated' })
       const addresses= await Address.find({ userId })
        res.json({success:true,addresses})
     } catch (error) {
        console.log(error.message)
        res.json({success:false , message :error.message})
     }
}


// 