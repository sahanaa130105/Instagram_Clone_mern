import React, { useEffect, useState, useContext } from 'react';
import { api } from '../Interceptor/apiCall';
import { AuthContext } from '../context/Auth';
import { url } from '../baseUrl';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './profile.css';

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('posts');
    const context = useContext(AuthContext);
    const { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if user is authenticated
                if (!context.auth) {
                    navigate('/login');
                    return;
                }
                
                // If no username provided but we have auth user, redirect to their profile
                if (!username && context.auth) {
                    navigate(`/${context.auth.username}`);
                    return;
                }

                // Use the username from params, or fall back to auth user's username
                const targetUsername = username || context.auth?.username;
                
                if (!targetUsername) {
                    setError('No user specified');
                    return;
                }

                const response = await api.get(`${url}/user/${targetUsername}`);
                
                if (response.data && response.data.username) {
                    setUser(response.data);
                } else {
                    setError('User not found');
                    context.throwErr('User not found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                if (error.response?.status === 401) {
                    // If token is expired or invalid, redirect to login
                    localStorage.removeItem('user');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    navigate('/login');
                } else {
                    setError('Failed to load profile');
                    context.throwErr('Failed to load profile');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username, context.auth, navigate, context]);

    const getImageUrl = (path) => {
        if (!path) return 'https://i.imgur.com/6VBx3io.png';
        if (path.startsWith('http')) return path;
        return `${url}${path}`;
    };

    const getPostImage = (post) => {
        if (!post.files || post.files.length === 0) return null;
        const imageFile = post.files.find(file => file.fileType === 'image');
        return imageFile ? getImageUrl(imageFile.link) : null;
    };

    const renderPostGrid = (posts) => {
        if (!posts || posts.length === 0) {
            return (
                <div className="no-posts">
                    <div className="no-posts-content">
                        <div className="camera-icon">
                            <svg aria-label="Camera icon" color="rgb(142, 142, 142)" fill="rgb(142, 142, 142)" height="50" role="img" viewBox="0 0 24 24" width="50"><path d="M12 8.556a3.444 3.444 0 1 0 0 6.888 3.444 3.444 0 0 0 0-6.888Zm0-2a5.444 5.444 0 1 1 0 10.888A5.444 5.444 0 0 1 12 6.556Zm6.133-2.3h-12.266a6.3 6.3 0 0 0-6.3 6.3v7.488a6.3 6.3 0 0 0 6.3 6.3h12.266a6.3 6.3 0 0 0 6.3-6.3v-7.488a6.3 6.3 0 0 0-6.3-6.3Zm4.3 13.788a4.3 4.3 0 0 1-4.3 4.3h-12.266a4.3 4.3 0 0 1-4.3-4.3v-7.488a4.3 4.3 0 0 1 4.3-4.3h12.266a4.3 4.3 0 0 1 4.3 4.3v7.488Z"></path></svg>
                        </div>
                        <h2>No Posts Yet</h2>
                    </div>
                </div>
            );
        }

        return (
            <div className="profile-posts-grid">
                {posts.map(post => {
                    const imageUrl = getPostImage(post);
                    if (!imageUrl) return null;

                    return (
                        <div key={post._id} className="profile-post-item">
                            <img src={imageUrl} alt={post.caption || 'Post'} />
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!user) {
        return <div className="not-found">User not found</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    <img 
                        src={getImageUrl(user.avatar)}
                        alt={user.username} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://i.imgur.com/6VBx3io.png';
                        }}
                    />
                </div>
                <div className="profile-info">
                    <div className="profile-header-row">
                        <h2 className="username">{user.username}</h2>
                        {context.auth && context.auth.username === user.username ? (
                            <Link to="/accounts/edit" className="edit-profile-btn">Edit Profile</Link>
                        ) : null}
                    </div>
                    <div className="profile-stats">
                        <span><strong>{user.posts?.length || 0}</strong> posts</span>
                        <span><strong>{user.followers?.length || 0}</strong> followers</span>
                        <span><strong>{user.following?.length || 0}</strong> following</span>
                    </div>
                    <div className="profile-bio">
                        {user.name && <h1 className="full-name">{user.name}</h1>}
                        {user.bio && <p className="bio">{user.bio}</p>}
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        POSTS
                    </button>
                    {context.auth && context.auth.username === user.username ? (
                        <button 
                            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            SAVED
                        </button>
                    ) : null}
                </div>

                {activeTab === 'posts' ? (
                    renderPostGrid(user.posts)
                ) : (
                    renderPostGrid(user.saved)
                )}
            </div>
        </div>
    );
};
