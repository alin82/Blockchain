import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import contract from '../SC/contract.js'; 
import UserPage from '../components/userPage.js'; 
import ManufacturerDashboard from '../components/manufacturerPage.js';
import NotFound from '../components/notFound.js';
import MintProduct from '../components/mintProduct.js';
import BurnProduct from '../components/burnProduct.js';
import '../css_files/App.css';
import web3 from '../SC/web3.js';

const App = () => {
    const [isManufacturer, setIsManufacturer] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const MANUFACTURER_ROLE = web3.utils.keccak256("MANUFACTURER_ROLE");
        const checkUserRole = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length === 0) {
                    console.error("No accessible accounts. Make sure MetaMask is connected.");
                    return;
                }
                const userAddress = accounts[0]; 
                const hasManufacturerRole = await contract.methods.hasRole(MANUFACTURER_ROLE, userAddress).call();
                setIsManufacturer(hasManufacturerRole);
            } catch (error) {
                console.error("Error checking user role:", error);
            } finally {
                setLoading(false);
            }
        };

        checkUserRole();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to={isManufacturer ? "/manufacturer-dashboard" : "/user-dashboard"} />} />
                <Route path="/manufacturer-dashboard" element={isManufacturer ? <ManufacturerDashboard /> : <Navigate to="/user-dashboard" />} />
                <Route path="/user-dashboard" element={<UserPage />} />
                <Route path="/mint-product" element={isManufacturer ? <MintProduct /> : <Navigate to="/dashboard" />} />
                <Route path="/burn-product" element={isManufacturer ? <BurnProduct /> : <Navigate to="/dashboard" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default App;