// frontend/src/pages/AdminPage/AdminPage.jsx

import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    const [pendingPurchases, setPendingPurchases] = useState([]);
    const [message, setMessage] = useState('');

    const fetchPending = () => {
        // Use the relative path for the Vite proxy
        fetch('/api/admin/pending')
            .then(res => res.json())
            .then(data => setPendingPurchases(data))
            .catch(err => console.error("Error fetching pending purchases:", err));
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = (purchaseId) => {
        // Use the relative path for the Vite proxy
        fetch(`/api/admin/approve/${purchaseId}`, {
            method: 'POST',
        })
        .then(res => res.json())
        .then(data => {
            setMessage(data.msg);
            fetchPending();
        })
        .catch(err => {
            console.error("Error approving purchase:", err);
            setMessage('Approval failed.');
        });
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', color: 'white', background: '#10101a' }}>
            <h1>Admin Panel</h1>
            <h3 style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>Pending Approvals</h3>
            {message && <p style={{ color: '#00bfff' }}>{message}</p>}
            
            {pendingPurchases.length > 0 ? (
                pendingPurchases.map(p => (
                    <div key={p.purchaseId} style={{ border: '1px solid #333', borderRadius: '8px', padding: '15px', margin: '10px' }}>
                        <p><strong>Purchase ID:</strong> {p.purchaseId}</p>
                        <p><strong>User ID:</strong> {p.userId}</p>
                        <p><strong>Beat ID:</strong> {p.beatId}</p>
                        <p><strong>Status:</strong> <span style={{color: 'orange'}}>{p.status}</span></p>
                        <button onClick={() => handleApprove(p.purchaseId)} style={{ backgroundColor: '#00bfff', color: 'black', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                            Approve Access
                        </button>
                    </div>
                ))
            ) : (
                <p>No pending purchases.</p>
            )}
        </div>
    );
};

export default AdminPage;