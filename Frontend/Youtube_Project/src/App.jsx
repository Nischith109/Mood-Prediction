import { useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [text, setText] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedMood, setDetectedMood] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const getVideos = async () => {
    if (!text.trim()) {
      setError("Please enter your mood first!");
      return;
    }

    setLoading(true);
    setError("");
    setVideos([]);
    setDetectedMood("");
    setIsFallback(false);

    try {
      console.log("Sending request with text:", text);
      const res = await axios.post("http://localhost:5000/api/mood", {
        text: text
      }, {
        timeout: 10000 // 10 second timeout
      });
      console.log("Received response:", res.data);
      setVideos(res.data.videos || []);
      setDetectedMood(res.data.mood || "");
      setIsFallback(res.data.fallback || false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(`Failed to fetch videos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getVideos();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>🎥 MoodVibes</h1>
        <p>Discover videos that match your current mood</p>
      </div>

      <div className="mood-input-section">
        <input
          type="text"
          className="mood-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="How are you feeling today? (e.g., happy, sad, relaxed)"
        />
        <button
          className="get-videos-btn"
          onClick={getVideos}
          disabled={loading}
        >
          {loading ? "Discovering videos..." : "🎥 Discover Videos"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">� Analyzing your mood and finding the perfect videos...</div>}

      {!loading && videos.length === 0 && !error && text && (
        <div className="no-videos">
          <h3>Ready to discover your mood videos!</h3>
          <p>Enter how you're feeling and click "Discover Videos" to see personalized recommendations.</p>
        </div>
      )}

      {detectedMood && (
        <div className="detected-mood">
          <h3>🎭 Detected Mood: <span className="mood-text">{detectedMood}</span></h3>
        </div>
      )}

      {isFallback && (
        <div className="fallback-notice">
          <p>⚠️ Using demo videos - YouTube API not available</p>
        </div>
      )}

      <div className="videos-container">
        {videos.map((video, index) => (
          <div key={video.id.videoId || index} className="video-card">
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="video-thumbnail"
            />
            <div className="video-info">
              <h3 className="video-title">{video.snippet.title}</h3>
              <p className="video-description">{video.snippet.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-link"
              >
                ▶️ Watch on YouTube
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;