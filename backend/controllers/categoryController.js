import CategoryModel from "../models/Category.js";

const addCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;

    const existingCategory = await CategoryModel.findOne({ categoryName });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Categoria já existente" });
    }

    const newCategory = new CategoryModel({
      categoryName,
      categoryDescription,
    });
    await newCategory.save();
    return res.status(201).json({
      success: true,
      message: "Categoria adicionada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao adicionar a categoria:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Erro buscando as categorias", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor em getCategories" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;

    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Categoria não foi encontrada" });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Categoria atualizada com sucesso" });
  } catch (error) {
    console.error("Erro atualizando a categoria:", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor em updateCategories",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Categoria não encontrada" });
    }

    await CategoryModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar a categoria:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor em deleteCategory" });
  }
};

export { addCategory, getCategories, updateCategory, deleteCategory };
