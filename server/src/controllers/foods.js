const Food = require('../models/food');  // Adjust the path as necessary
const uploads = require('../utils/cloudinaryUpload');
exports.addFood = async(req,res) =>{
    try {
        console.log("add food")
        console.log(req.body)
        const {name,isVeg,price,description,quantity} = req.body;
        let provider = req.provider._id;
        console.log(provider)
        let image = ""
        if(req.file){
            const location = req.file.buffer;
            const result = await uploads(location);
            console.log(result)
            image = result.url
        }
        const updatedData = {
            name,
            isVeg,
            price,
            provider,
            image,
            enteredQuantity:quantity,
            quantity,
            description
        }
        const food = await foodModel.create(updatedData);
        console.log("food",food)

        return res.status(200).json({food});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message});
    }
}
exports.getAllFoodsOfProvider = async (req, res) => {
    try {
        const { _id } = req.params;
        console.log(_id);

        // Query the Food model to get foods by provider ID
        const foods = await Food.find({ provider: _id }).populate("provider");
        console.log(foods);

        // Check if foods were found
        if (!foods || foods.length === 0) {
            console.log("array empty")
            return res.status(404).json({ message: "NO Food Found" });
        }

        // Return the list of foods
        return res.status(200).json({ foods });
    } catch (error) {
        // Handle any errors
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};

exports.getFoodById = async(req,res) =>{
    try {
        const {_id} = req.params;
        if(!_id)
            return res.status(400).json({message:"Unable to get Food"});
        
        const food = await foodModel.findById(_id).populate("provider");

        if(!food)
            return res.status(404).json({message:"No food Found"});

        return res.status(200).json({food})
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
exports.deleteFood = async(req,res) =>{
    try {
        const {_id} = req.params;

        if(!_id)
            return res.status(404).json({message:"Invalid Request"})
        
        const food = await foodModel.findByIdAndDelete(_id);

        return res.status(201).json({food});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}