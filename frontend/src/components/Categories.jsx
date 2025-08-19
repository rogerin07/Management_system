import axios from "axios";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      console.log(response.data.categories);
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCategory) {
      const response = await axios.put(
        `http://localhost:5000/api/category/${editCategory}`,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setEditCategory(null);
        setCategoryName("");
        setCategoryDescription("");
        alert("Categoria atualizada com sucesso!");
        fetchCategories();
      } else {
        console.error("erro ao atualizar");
        alert("Erro ao atualizar categoria. Tente novamente.");
      }
    } else {
      const response = await axios.post(
        "http://localhost:5000/api/category/add",
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategoryName("");
        setCategoryDescription("");
        alert("Categoria adicionada com sucesso!");
        fetchCategories();
      } else {
        console.error("erro ao editar");
        alert("Erro ao editar categoria. Tente novamente.");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar esta categoria?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/category/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Categoria excluida com sucesso!");
          fetchCategories();
        } else {
          console.error("erro ao deletar");
          alert("Erro ao deletar categoria. Tente novamente.");
        }
      } catch (error) { 
        console.error("Erro ao deletar categoria:", error);
        alert("Erro ao deletar categoria. Tente novamente.");
      }
    }
  };

  const handleEdit = async (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Gerenciamento de Categorias</h1>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">
              {editCategory ? "Editar categoria" : "Adicionar Categoria"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Nome da Categoria"
                  value={categoryName}
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Descrição da Categoria"
                  value={categoryDescription}
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-alta text-white p-3 cursor-pointer hover:bg-altadark"
                >
                  {editCategory ? "Salvar Mudanças" : "Adicionar"}
                </button>
                {editCategory && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600/25"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">ID</th>
                  <th className="border border-gray-200 p-2">
                    Nome da categoria
                  </th>
                  <th className="border border-gray-200 p-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={index}>
                    <td className="border border-gray-200 p-2">{index + 1}</td>
                    <td className="border border-gray-200 p-2">
                      {category.categoryName}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <button
                        className="bg-alta text-white p-2 rounded-md hover:bg-altadark/40 hover:text-black mr-2"
                        onClick={() => handleEdit(category)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700/40 hover:text-black"
                        onClick={() => handleDelete(category._id)}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
