import React, { useState, useEffect } from 'react';
import web3 from '../SC/web3';
import { useNavigate } from 'react-router-dom';
import '../css_files/manufacturer.css'

const ManufacturerDashboard = () => {
    const [userAddress, setUserAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccount = async () => {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setUserAddress(accounts[0]);
            } else {
                console.error("No accessible accounts. Make sure MetaMask is connected.");
            }
        };

        fetchAccount();
    }, []);

    const handleMintRedirect = () => {
        navigate('/mint-product');
    };

    const handleBurnRedirect = () => {
        navigate('/burn-product');
    };

    const handleUserPageRedirect = () => {
        navigate('/user-dashboard');
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Manufacturer Dashboard</h1>
            {userAddress && <p className="welcome-message">Welcome, {userAddress}</p>}
            <p className="action-prompt">What would you like to do?</p>
            <div className="button-container">
                <button className="button" onClick={handleMintRedirect}>Mint Product</button>
                <button className="button" onClick={handleBurnRedirect}>Burn Product</button>
                <button className="button" onClick={handleUserPageRedirect}>User Page</button>
            </div>
        </div>
    );
};

export default ManufacturerDashboard;
