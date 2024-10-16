export const searchContacts = async(req, res, next)=>{
    try{
        
        const {searchTerm} = req.body;

        if(searchTerm === undefined || searchTerm === null){
            return res.status(400).send("Search Term is required");
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
          
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
          $and: [
            { _id: { $ne: req.userId } },
            {
              $or: [
                { firstname: regex },
                { lastname: regex },
                { email: regex },
              ],
            },
          ],
        });

        return res.status(200).json({contacts});

    } catch(err){
        console.log(err);
        return res.status(500).send("Internal Server Error")
    }
}