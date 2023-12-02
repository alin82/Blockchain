import React, { useState } from 'react';
import web3 from '../SC/web3';
import contract from '../SC/contract';
import { useNavigate } from 'react-router-dom';
import '../css_files/mint.css'

const MintProductPage = () => {
    const [serial, setSerial] = useState(''); 
    const [name, setName] = useState('');
    const [description, setDescription] = useState(''); 
    const [manufactureDate, setManufactureDate] = useState(''); 
    const [result, setResult] = useState('');
    const navigate = useNavigate();

    const mintProduct = async (event) => {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                setResult("No accessible accounts. Make sure MetaMask is connected.");
                return;
            }
            const userAddress = accounts[0];
            if (isNaN(serial)) {
                setResult("Invalid serial number. Please enter a numeric value.");
                return;
            }
            const product = {
                name: name,
                description: description,
                serialNumber: serial,
                manufactureDate: manufactureDate
            };
            await contract.methods.mintProduct(userAddress, serial, product).send({ from: userAddress });
            setResult(`Product minted successfully`);

            //THIS FOLLOWING CODE IS FOR VIEWING THE INFORMATION OF THE BLOCK
            // const mintResult = await contract.methods.mintProduct(userAddress, serial, product).send({ from: userAddress });   
            // const jsonHandler = (key, value) => 
            //     typeof value === 'bigint' ? value.toString() : value;          
            // setResult(`Product minted successfully: ${JSON.stringify(mintResult, jsonHandler)}`);
        } catch (error) {
            console.error('Error minting product:', error);
            setResult(`Failed to mint product: ${error.message}`);
        }
    };
    
    const goToManufacturerDashboard = () => {
        navigate('/manufacturer-dashboard'); 
    };

    return (
        <div className="mint-container">
            <h2>Mint Product</h2>
            <div className="form-container">
                <form onSubmit={mintProduct}>
                    <input className="input-field" type="text" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Serial Number" />
                    <input className="input-field" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" />
                    <input className="input-field" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product Description" />
                    <input className="input-field" type="text" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} placeholder="Manufacture Date" />
                    <button className="button" type="submit">Mint Product</button>
                </form>
            </div>
            {result && <p>{result}</p>}
            <button className="button" onClick={goToManufacturerDashboard}>Back to Dashboard</button>
        </div>
    );
};

export default MintProductPage;
