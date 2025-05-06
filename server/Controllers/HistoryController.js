import HistoryModel from "../Models/HistoryModel.js";

export const historycontroller = async(req,res)=>{
    const historydata = req.body;
    const addtohistory= new HistoryModel(historydata);
    try {
        await addtohistory.save()
        res.status(200).json({message:"added to history"})
    } catch (error) {
        res.status(400).json({ message: error?.message || "Something went wrong" });
        return
    } 
}

export const getallhistorycontroller = async(req,res)=>{
    try {
        const files = await HistoryModel.find()
        // console.log("Fetched history data:", files);
        res.status(200).send(files)
    } catch (error) {
        res.status(400).json({ message: error?.message || "Something went wrong" });
        return
    }
}

export const deletehistory = async(req,res)=>{
    const {userid: userid} = req.params;
    try {
        await HistoryModel.deleteMany()
        viewer:userid
        res.status(200).json({message:"History Removed Successfully"})
    } catch (error) {
        res.status(400).json({ message: error?.message || "Something went wrong" });
        return
    }
}