import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/Auth';
import { api } from '../Interceptor/apiCall';
import { url } from '../baseUrl';
import { useNavigate } from 'react-router-dom';
import '../styles/EditProfile.css';

const EditProfile = () => {
    const context = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        avatar: null
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!context.auth) {
            navigate('/login');
            return;
        }
        // Load current user data
        setFormData({
            name: context.auth.name || '',
            bio: context.auth.bio || '',
        });
        setPreviewUrl(context.auth.avatar ? `${url}${context.auth.avatar}` : 'https://i.imgur.com/6VBx3io.png');
    }, [context.auth, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            if (formData.avatar) {
                data.append('avatar', formData.avatar);
            }
            data.append('name', formData.name);
            data.append('bio', formData.bio);

            const response = await api.put(`${url}/user`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data && response.data.success) {
                // Update context with new user data
                context.setAuth(response.data.user);
                context.throwSuccess('Profile updated successfully');
                navigate(`/${context.auth.username}`);
            } else {
                throw new Error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            context.throwErr(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="profile-picture-section">
                    <img src={previewUrl} alt="Profile" className="profile-preview" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="avatar-input"
                        className="file-input"
                    />
                    <label htmlFor="avatar-input" className="change-photo-btn">
                        Change Profile Photo
                    </label>
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        maxLength="50"
                    />
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Bio"
                        maxLength="150"
                        rows="3"
                    />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;