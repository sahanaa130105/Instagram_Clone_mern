import React, { useState, useEffect, useContext } from 'react'
import { url } from '../../../baseUrl'
import { api } from '../../../Interceptor/apiCall'
import defaultImg from '../../../assets/default.png'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../context/Auth'

export default function Story({ seen, owner, id }) {
  const [user, setUser] = useState(null)
  const context = useContext(AuthContext)
  const hasUnseenStory = !seen?.includes(context?.auth?._id)

  useEffect(() => {
    if (owner) {
      api.get(`${url}/user/get/${owner}`).then(res => {
        console.log('Story user data:', res.data);
        setUser(res.data);
      }).catch(err => console.log('Error fetching user:', err));
    }
  }, [owner])

  if (!user) return null;

  return (
    <Link 
      to={`/story/${user._id}?id=${id}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        minWidth: '80px'
      }}
    >
      <div 
        className="story-ring" 
        style={{ 
          padding: '3px',
          background: hasUnseenStory ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' : '#dbdbdb',
          borderRadius: '50%',
          cursor: 'pointer'
        }}
      >
        <div 
          className="image" 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%',
            border: '2px solid white',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white'
          }}
        >
          <img 
            src={user?.avatar || defaultImg} 
            alt={user.username}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover'
            }} 
          />
        </div>
      </div>
      <p style={{ 
        fontSize: '12px', 
        marginTop: '8px',
        textAlign: 'center',
        maxWidth: '64px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {user.username}
      </p>
    </Link>
  )
}
