import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { url } from '../../../baseUrl'
import { api } from '../../../Interceptor/apiCall'
import defaultImg from '../../../assets/default.png'

export function UserCard({ avatar, username, name, userId, followersCount }) {
    const [iFollow, setIFollow] = useState(false)
    
    async function handleFollow() {
        api.get(`${url}/user/handlefollow/${userId}`).then((res) => {
            if (res.data) {
                setIFollow(prev => !prev)
            }
        })
    }
    
    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '19px' }}>
            <div className="left" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <div className="user-img" style={{ marginRight: '14px' }}>
                    <Link to={`/${username}`}>
                        <img src={avatar ?? defaultImg} style={{ width: '39px', borderRadius: '50%', height: '39px', objectFit: 'cover' }} alt="" />
                    </Link>
                </div>
                <div className="username" style={{ display: 'flex', flexDirection: 'column', marginTop: '-4px' }}>
                    <Link to={`/${username}`} style={{ fontSize: '13px', marginLeft: '9px', marginTop: '0px', fontWeight: 'bold', textDecoration: 'none' }}>
                        {username}
                    </Link>
                    <Link to={`/${username}`} style={{ fontSize: '12px', marginLeft: '9px', color: 'gray', marginTop: '3.7px', textDecoration: 'none' }}>
                        {name}
                    </Link>
                    <span style={{ fontSize: '11px', marginLeft: '9px', color: '#666', marginTop: '2px' }}>
                        {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
                    </span>
                </div>
            </div>
            <div className="follow-btn">
                <button 
                    onClick={handleFollow} 
                    className='no-style'
                    style={{
                        padding: '5px 15px',
                        borderRadius: '4px',
                        backgroundColor: !iFollow ? '#0095F6' : 'transparent',
                        border: !iFollow ? 'none' : '1px solid #dbdbdb',
                        cursor: 'pointer'
                    }}
                >
                    <span style={{ 
                        color: !iFollow ? 'white' : '#262626', 
                        fontSize: '13.25px',
                        fontWeight: '600'
                    }}>
                        {iFollow ? "Following" : "Follow"}
                    </span>
                </button>
            </div>
        </div>
    )
}
