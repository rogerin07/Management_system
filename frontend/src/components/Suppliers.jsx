import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

function SetViewOnClick({ onPositionChange }) {
  const map = useMapEvents({
    click(e) {
      map.setView(e.latlng, map.getZoom(), {
        animate: true,
      });
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const Suppliers = () => {
  const [addModal, setAddModal] = useState(null);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [position, setPosition] = useState([-23.1791, -45.8872]);
  const searchTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/supplier", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setSuppliers(response.data.suppliers);
      setFilteredSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
    });
    setEditSupplier(supplier._id);
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
    });
    setEditSupplier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editSupplier) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/supplier/${editSupplier}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          fetchSuppliers();
          alert("Fornecedor editado com sucesso!");
          setAddModal(false);
          setEditSupplier(null);
          setFormData({
            name: "",
            email: "",
            number: "",
            address: "",
          });
        } else {
          console.error("Erro ao editar fornecedor:", response.data.message);
          alert("Erro ao editar fornecedor. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao editar fornecedor:", error);
        alert("Erro ao editar o fornecedor. Tente novamente.");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          fetchSuppliers();
          alert("Fornecedor adicionado com sucesso!");
          setAddModal(false);
          setFormData({
            name: "",
            email: "",
            number: "",
            address: "",
          });
        } else {
          console.error("Erro ao adicionar fornecedor:", response.data.message);
          alert("Erro ao adicionar fornecedor. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao enviar dados do fornecedor:", error);
        alert("Erro ao adicionar o fornecedor. Tente novamente.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja deletar este fornecedor?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/supplier/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          fetchSuppliers();
          alert("Fornecedor deletado com sucesso!");
        } else {
          console.error("Erro ao deletar fornecedor:", response.data.message);
          alert("Erro ao deletar fornecedor. Tente novamente.");
        }
      } catch (error) {
        console.error("Erro ao deletar fornecedor:", error);
        alert("Erro ao deletar o fornecedor. Tente novamente.");
      }
    }
  };

  const handleMapClick = (newPosition) => {
    setPosition(newPosition);
  };

  const handleAddresChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
    setLoadingAddress(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (value.length < 5) {
        setSearchResults([]);
        setLoadingAddress(false);
        return;
      }
      try {
        const res = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              format: "json",
              q: value,
              limit: 5,
            },
          }
        );
        setSearchResults(res.data);
      } catch (error) {
        console.error("Erro ao buscar a localização", error);
      } finally {
        setLoadingAddress(false);
      }
    }, 1000);
  };

  const handleResultClick = (result) => {
    setFormData((prev) => ({
      ...prev,
      address: result.display_name,
    }));
    setPosition([parseFloat(result.lat), parseFloat(result.lon)]);
    setSearchResults([]);
  };

  const handleSearch = (e) => {
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold"> Gerenciamento de Fornecedores</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar"
          className="border p-1 bg-white rounded px-4"
          onChange={handleSearch}
        />
        <button
          className="px-4 py-1.5 bg-alta text-white rounded cursor-pointer hover:bg-altadark"
          onClick={() => setAddModal(true)}
        >
          Adicionar Fornecedor
        </button>
      </div>

      {loading ? (
        <div>Carregando ... </div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nome</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Telefone</th>
                <th className="border border-gray-300 p-2">Endereço</th>
                <th className="border border-gray-300 p-2">Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {supplier.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.email}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.number}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {supplier.address}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      className="px-2 py-1 bg-alta text-white rounded cursor-pointer mr-2 hover:bg-altadark"
                      onClick={() => handleEdit(supplier)}
                    >
                      Editar
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded cursor-pointer hover:bg-red-700/40 hover:text-black"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSuppliers.length === 0 && (
            <div>Nenhum fornecedor encontrado.</div>
          )}
        </div>
      )}

      {addModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-auto">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">Adicionar Fornecedor</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg bg-red-500 px-2 cursor-pointer text-white hover:bg-red-800"
              onClick={closeModal}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do Fornecedor"
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email do Fornecedor"
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Telefone/celular do Fornecedor"
                className="border p-1 bg-white rounded px-4"
              />
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleAddresChange}
                  placeholder="Endereço do Fornecedor(sem o número)"
                  className="border p-1 bg-white rounded px-4 w-full"
                />

                {loadingAddress && (
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                    <span className="h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-gray-500"></span>
                    buscando ...
                  </div>
                )}
                {searchResults.length > 0 && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto mt-1 z-[1000]">
                    {searchResults.map((result) => (
                      <li
                        key={result.place_id}
                        onClick={() => handleResultClick(result)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {result.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="w-full h-[300px] rounded overflow-hidden shadow relative z-0">
                <MapContainer
                  center={position}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position}>
                    <Popup>
                      {formData.address || "Localização do fornecedor"}
                    </Popup>
                  </Marker>
                  <MapUpdater position={position} />
                  <SetViewOnClick onPositionChange={handleMapClick} />
                </MapContainer>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-alta text-white p-3 cursor-pointer hover:bg-altadark"
                >
                  {editSupplier ? "Salvar Mudanças" : "Adicionar"}
                </button>
                {editSupplier && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600/25"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
