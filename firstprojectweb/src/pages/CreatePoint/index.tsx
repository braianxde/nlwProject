import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import './styles.css';
import logo from "../../assets/logo.svg";
import {Link} from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import Dropzone from '../../components/Dropzone';

import api from '../../services/api';

import { Map, TileLayer, Marker} from 'react-leaflet'
import {LeafletMouseEvent } from 'leaflet';

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface ibgeuf {
    sigla: string;
}

interface ibgecity {
    nome: string;
}

const CreatePoint = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [citys, setCitys] = useState<string[]>([]);

    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        axios.get<ibgeuf[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {

        if(selectedUf === '0'){
            return;
        }
        axios.get<ibgecity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);
            setCitys(cityNames);
        })
    }, [selectedUf]);
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);
        })
        
    }, []);

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat, 
            event.latlng.lng
        ]);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const {name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const items = selectedItems;
        const [latitude, longitude] = selectedPosition;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('items', items.join(","));

        if(selectedFile){
            data.append('image', selectedFile);
        }
        

        await api.post('points', data);

        alert("Ponto cadastrado com sucesso!");
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value} = event.target;

        setFormData({...formData, [name]: value });
    }

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        }else{
            setSelectedItems([...selectedItems, id]);
        }        
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"></img>
                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para a Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br />ponto de coleta</h1>

                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input type="text" id="name" name="name" onChange={handleInputChange}/>
                        </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <input type="text" id="email" name="email" onChange={handleInputChange}/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" id="whatsapp" name="whatsapp" onChange={handleInputChange}/>
                        </div>
                    </div>
    
                </fieldset>
                <fieldset>
                    <legend>
                        <h2>Endereco</h2>
                        <span>Selecione um endereco no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                    <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition} />
                    </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">UF</label>
                            <select id="uf" name="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select id="city" name="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {citys.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais items abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem (item.id)} className={selectedItems.includes(item.id)?'selected': ''}>
                                <img src={item.image_url} alt={item.title}></img>
                                <span>{item.title}</span>
                            </li>
                         ))}
                    </ul>
                </fieldset>

                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;