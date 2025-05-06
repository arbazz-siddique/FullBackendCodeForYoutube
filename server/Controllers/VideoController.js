import videofile from "../Models/VideofileModel.js";

export const uploadvideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload an mp4 video file only" });
    }

    try {
        const file = new videofile({
            videotitle: req.body.title,
            filename: req.file.originalname,
            filepath: req.file.path.replace(/\\/g, "/"), // Ensure correct path format
            filetype: req.file.mimetype,
            filesize: req.file.size,
            videochanel: req.body.chanel,
            uploader: req.body.uploader,
        });

        await file.save();
        res.status(200).json({ message: "File uploaded successfully", file });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getallvideos=async(req,res)=>{
    try {
        const files=await videofile.find();
        res.status(200).send(files)
    } catch (error) {
        res.status(404).json(error.message)
            return
    }
}

export const getVideoById = async (id) => {
    try {
        const video = await videofile.findById(id);
        return video;
    } catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
};
