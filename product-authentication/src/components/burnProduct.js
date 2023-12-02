import React, { useState } from 'react';
import web3 from '../SC/web3';
import contract from '../SC/contract';
import { useNavigate } from 'react-router-dom';
import '../css_files/burn.css'

const BurnProductPage = () => {
    const [serial, setSerial] = useState('');
    const [result, setResult] = useState('');
    const navigate = useNavigate();

    const burnProduct = async (event) => {
        event.preventDefault();
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                setResult("No accessible accounts. Make sure MetaMask is connected.");
                return;
            }
            const userAddress = accounts[0];
            await contract.methods.burnProduct(userAddress, serial).send({ from: userAddress });
            setResult(`Product burned successfully`);

            //THIS FOLLOWING CODE IS FOR VIEWING THE INFORMATION OF THE BLOCK
            // const burnResult = await contract.methods.burnProduct(userAddress, serial).send({ from: userAddress });
            // const replacer = (key, value) => 
            //     typeof value === 'bigint' ? value.toString() : value;
            
            // setResult(`Product burned successfully: ${JSON.stringify(burnResult, replacer)}`);
        } catch (error) {
            console.error('Error burning product:', error);
            setResult(`Failed to burn product: ${error.message}`);
        }
    };

    const goToManufacturerDashboard = () => {
        navigate('/manufacturer-dashboard'); 
    };

    return (
        <div className="burn-container">
            <h2>Burn Product</h2>
            <form onSubmit={burnProduct}>
                <input className="input-field" type="text" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Serial Number" />
                <button className="button" type="submit">Burn Product</button>
            </form>
            {result && <p className="result">{result}</p>}
            <button className="button" onClick={goToManufacturerDashboard}>Back to Dashboard</button>
        </div>
    );
};

export default BurnProductPage;
