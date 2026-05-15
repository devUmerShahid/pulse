// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './pages/auth/Login/index';
import Register from './pages/auth/Register/index';
import Feed from './pages/Feed/index';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Trends from './pages/Trends';
import HashtagDetail from './pages/HashtagDetail';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <SocketProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/feed" replace />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/feed" replace />} />

          {/* Protected Routes */}
          <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/login" replace />} />
          <Route path="/create-post" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" replace />} />
          <Route path="/post/:postId" element={isAuthenticated ? <PostDetail /> : <Navigate to="/login" replace />} />
          <Route path="/trends" element={isAuthenticated ? <Trends /> : <Navigate to="/login" replace />} />
          <Route path="/trending/:hashtag" element={isAuthenticated ? <HashtagDetail /> : <Navigate to="/login" replace />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} replace />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;








// // src/App.tsx
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import Login from './pages/auth/Login/index';
// import Register from './pages/auth/Register/index';
// import CreatePost from './pages/CreatePost';

// function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/feed" replace />} />
//         <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/feed" replace />} />

//         {/* Protected Route (placeholder for now) */}
//         <Route path="/feed" element={isAuthenticated ? <div className="p-8 text-white">Feed Page - Coming Soon</div> : <Navigate to="/login" replace />} />

//         {/* Default Route */}
//         <Route path="/" element={<Navigate to={isAuthenticated ? "/feed" : "/login"} replace />} />

//         <Route path="/create-post" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;