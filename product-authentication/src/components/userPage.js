import React, { useState, useEffect } from 'react';
import web3 from '../SC/web3';
import contract from '../SC/contract.js';
import '../css_files/userPage.css';

const UserPage = () => {
  const [userAddress, setUserAddress] = useState('');
  const [productId, setProductId] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
      }
    };

    fetchAccount();
  }, []);

  const verifyProduct = async () => {
    setVerificationAttempted(true);
    try {
      const result = await contract.methods.checkAuthenticity(productId).call();
      if (result && result.__length__ === 4 && result[0] !== '') {
        setProductInfo({
          name: result[0],
          description: result[1],
          serialNumber: result[2],
          manufactureDate: result[3]
        });
      } else {
        setProductInfo(null); 
      }
    } catch (error) {
      console.error(error);
      setProductInfo(null);
    }
  };

  return (
    <div className="user-container">
      <h2>User Dashboard</h2>
      {userAddress && <p className="welcome-message">Connected as: {userAddress}</p>}
      <p className="prompt-text">Please enter your serial number to check the authenticity of your product:</p>
      <div className="form-container">
        <input 
            className="input-field"
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Serial Number"
        />
        <button className="button" onClick={verifyProduct}>Verify Product</button>
        {verificationAttempted && productInfo && (
            <div>
                <div className="verification-message">
                    <strong>Your Product is Real, Here are its information:</strong>
                </div>
                <ul className="product-info">
                    <li><strong>Name:</strong> {productInfo.name}</li>
                    <li><strong>Description:</strong> {productInfo.description}</li>
                    <li><strong>Serial Number:</strong> {productInfo.serialNumber}</li>
                    <li><strong>Manufacture Date:</strong> {productInfo.manufactureDate}</li>
                </ul>
            </div>
        )}
        {verificationAttempted && !productInfo && <p className="result-text">Your Product is Fake</p>}
      </div>
    </div>
  );
};

export default UserPage;
