import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="spinner-wrapper">
          <div className="spinner-primary"></div>
          <div className="spinner-secondary"></div>
        </div>
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    </div>
  );
}

export default Loading;