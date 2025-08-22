import SupplierModel from "../models/Supplier.js";

const addSupplier = async (req, res) => {
  try {
    const { name, email, number, address } = req.body;

    const existingSupplier = await SupplierModel.findOne({ name });
    if (existingSupplier) {
      return res
        .status(400)
        .json({ success: false, message: "Fornecedor já existente" });
    }

    const newSupplier = new SupplierModel({
      name,
      email,
      number,
      address,
    });
    await newSupplier.save();
    return res.status(201).json({
      success: true,
      message: "Fornecedor adicionado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao adicionar o fornecedor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor" });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.find();
    return res.status(200).json({ success: true, suppliers });
  } catch (error) {
    console.error("Erro buscando os fornecedores", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor em getSuppliers" });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, number, address } = req.body;

    const existingSupplier = await SupplierModel.findById(id);
    if (!existingSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Fornecedor não foi encontrado" });
    }

    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id,
      { name, email, number, address },
      { new: true }
    );

    return res
      .status(200)
      .json({ success: true, message: "Fornecedor atualizado com sucesso" });
  } catch (error) {
    console.error("Erro atualizando o fornecedor:", error);
    return res.status(500).json({
      success: false,
      message: "Erro no servidor em updateSupplier",
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const existingSupplier = await SupplierModel.findById(id);
    if (!existingSupplier) {
      return res
        .status(404)
        .json({ success: false, message: "Fornecedor não encontrado" });
    }

    await SupplierModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Fornecedor deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar o fornecedor:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro no servidor em deleteSupplier" });
  }
};


export { addSupplier, getSuppliers, updateSupplier, deleteSupplier };
