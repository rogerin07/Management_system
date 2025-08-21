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
  const [addEditModal, setAddEditModal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [position, setPosition] = useState([-23.1791, -45.8872]);
  const searchTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    setLoading(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (value.length < 5) {
        setSearchResults([]);
        setLoading(false);
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
        setLoading(false);
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

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold"> Gerenciamento de Fornecedores</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Pesquisar"
          className="border p-1 bg-white rounded px-4"
        />
        <button
          className="px-4 py-1.5 bg-alta text-white rounded cursor-pointer hover:bg-altadark"
          onClick={() => setAddEditModal(1)}
        >
          Adicionar Fornecedor
        </button>
      </div>
      {addEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">Adicionar Fornecedor</h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg bg-red-500 px-2 cursor-pointer text-white hover:bg-red-800"
              onClick={() => setAddEditModal(null)}
            >
              X
            </button>
            <form className="flex flex-col gap-4 mt-4">
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Número do Fornecedor"
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

                {loading && (
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

              <button className="px-4 py-1.5 bg-alta text-white rounded cursor-pointer hover:bg-altadark">
                Adicionar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
