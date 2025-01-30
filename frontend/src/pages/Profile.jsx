import React, { useEffect, useState, useContext } from 'react';
import { api } from '../Interceptor/apiCall';
import { AuthContext } from '../context/Auth';
import { url } from '../baseUrl';

export const Profile = () => {
    const [user, setUser] = useState(null);
    const context = useContext(AuthContext);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get(`${url}/user/profile`);
                setUser(response.data);
                console.log('User profile data:', response.data); // Debug log
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile">
            <h1>{user.username}'s Profile</h1>
            <img src={user.avatar} alt="Profile" />
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <p><strong>Followers:</strong> {user.followers.length}</p>
            <p><strong>Following:</strong> {user.following.length}</p>
            {/* Add more user details as needed */}
        </div>
    );
};
