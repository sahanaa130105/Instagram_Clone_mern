import React from 'react'
import Story from './Story'
import AddStory from './AddStory'

export default function StoryContainer({ stories }) {
    console.log('Stories in container:', stories);
    return (
        <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            padding: '20px 0',
            gap: '15px',
            width: '100%',
            alignItems: 'center',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #dbdbdb',
            marginBottom: '24px'
        }}>
            <AddStory />
            
            {stories?.length === 0 ? (
                <p style={{ 
                    margin: 'auto', 
                    textAlign: 'center',
                    color: '#8e8e8e',
                    fontSize: '14px'
                }}>
                    No stories yet
                </p>
            ) : (
                stories?.map(storyGroup => {
                    if (!storyGroup || !storyGroup[0]) return null;
                    return (
                        <Story 
                            key={storyGroup[0]?.id || Math.random()} 
                            id={storyGroup[0]?.id} 
                            owner={storyGroup[0]?.owner} 
                            seen={storyGroup[0]?.seen || []} 
                        />
                    );
                })
            )}
        </div>
    )
}
