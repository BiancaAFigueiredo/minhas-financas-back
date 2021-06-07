const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CategorySchema = require("./categories")

const ItemSchema = new Schema ({
    categoryId:{
        type:Schema.Types.ObjectId,
        default:null
    },
    description: { type: String, required: true},
    expend: { type: Number, required: true },
    inserted: { type: Date, default: Date.now}
});


module.exports = mongoose.model("Item", ItemSchema);