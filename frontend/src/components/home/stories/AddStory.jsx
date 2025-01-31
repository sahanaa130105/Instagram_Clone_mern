import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/Auth';
import { api } from '../../../Interceptor/apiCall';
import { url } from '../../../baseUrl';
import defaultImg from '../../../assets/default.png';

export default function AddStory() {
    const context = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleStoryUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setLoading(true);
            
            // Convert image to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = async () => {
                try {
                    const response = await api.post(`${url}/story`, {
                        data: reader.result
                    });
                    
                    if (response.data) {
                        // Optionally refresh stories or show success message
                        console.log('Story uploaded successfully');
                    }
                } catch (error) {
                    console.error('Error uploading story:', error);
                } finally {
                    setLoading(false);
                }
            };
        } catch (error) {
            console.error('Error preparing story upload:', error);
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            minWidth: '80px',
            position: 'relative'
        }}>
            <label 
                htmlFor="story-upload"
                style={{ 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%',
                    border: '2px dashed #0095f6',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    background: 'white'
                }}>
                    <img 
                        src={context?.auth?.avatar || defaultImg} 
                        alt="Your avatar"
                        style={{ 
                            width: '100%', 
                            height: '100%',
                            objectFit: 'cover',
                            opacity: loading ? 0.5 : 1
                        }} 
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: '#0095f6',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}>
                        +
                    </div>
                </div>
                <p style={{ 
                    fontSize: '12px', 
                    marginTop: '8px',
                    textAlign: 'center',
                    color: '#262626'
                }}>
                    Your story
                </p>
            </label>
            <input
                type="file"
                id="story-upload"
                accept="image/*"
                onChange={handleStoryUpload}
                style={{ display: 'none' }}
                disabled={loading}
            />
        </div>
    );
}
