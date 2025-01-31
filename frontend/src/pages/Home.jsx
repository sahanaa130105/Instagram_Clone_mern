import React, { useContext, useEffect } from "react";
import Card from "../components/home/post/Card";
import '../components/home/home.css'
import Right from "../components/home/rightbar/Right";
import { api } from '../Interceptor/apiCall'
import { url } from "../baseUrl";
import { useState } from "react";
import { Spinner } from "../assets/Spinner";
import { AuthContext } from "../context/Auth";
import StoryContainer from "../components/home/stories/StoryContainer";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const context = useContext(AuthContext);

  useEffect(() => {
    // Fetch posts
    api.get(`${url}/post/get/home`).then((res) => {
      setPosts(res.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    });

    // Fetch stories
    api.get(`${url}/story/home`).then((res) => {
      console.log('Stories response:', res.data);
      setStories(res.data);
    }).catch(err => {
      console.log('Error fetching stories:', err);
    }).finally(() => {
      setLoadingStories(false);
    });

    return () => {
      setPosts([]);
      setStories([]);
    };
  }, []);

  useEffect(() => {
    context.handleActive("home");
  }, [context]);

  function filterPosts(id) {
    setPosts(posts => posts.filter(item => item._id !== id));
  }

  function filterUserPosts(uid) {
    setPosts(posts => posts.filter(item => item.owner !== uid));
  }

  function newPost(post) {
    setPosts(posts => [post, ...posts]);
  }

  context.newpost = newPost;

  return (
    <div className="home">
      <div className="left-home">
        <div className="stories">
          {loadingStories ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Spinner />
            </div>
          ) : (
            <StoryContainer stories={stories} />
          )}
        </div>
        <div className="posts">
          {posts?.length === 0 && loading && <Spinner />}
          {posts?.length === 0 && !loading && (
            <p style={{ textAlign: 'center', marginTop: '32px', width: '100%', fontWeight: 'bold', fontSize: '16px' }}>
              No posts to see
            </p>
          )}
          {posts.map(item => (
            <Card
              filterUserPosts={filterUserPosts}
              filterPosts={filterPosts}
              key={item._id}
              id={item._id}
              img={item.files[0].link}
              likes={item.likes}
              saved={item.saved}
              userId={item.owner._id}
              avatar={item.owner.avatar}
              username={item.owner.username}
              caption={item.caption}
              comments={item.comments}
              time={item.createdAt}
            />
          ))}
        </div>
      </div>
      <div className="right-home">
        <Right />
      </div>
    </div>
  );
}
