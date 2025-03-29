// import React, { useState } from 'react';
// import '../App.css'; // Import App.css for styling
// import axios from "axios";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate(); // Initialize the useNavigate hook

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(''); // Reset error state on new submission
    
//     try {
//       const response = await axios.post("http://localhost:5000/api/users/login", formData);
      
//       // Check for successful login and perform redirection
//       if (response.status === 200) { // Assuming 200 means success
//         // Optionally save the token or user information to localStorage
//         localStorage.setItem('token', response.data.token); // Store token if returned
//         navigate('/dashboard'); // Redirect to the dashboard
//       } else {
//         setError('Login failed. Please check your credentials.');
//       }
//     } catch (err) {
//       // Handle specific error messages based on server response
//       if (err.response && err.response.data && err.response.data.message) {
//         setError(err.response.data.message); // Show specific error message from the server
//       } else {
//         setError('Login failed. Please check your credentials.'); // Generic message for other errors
//       }
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       {error && <p className="error">{error}</p>}
//       <form onSubmit={handleSubmit} className="auth-form">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state on new submission

    try {
      const response = await axios.post("https://medicine-inventory-system.onrender.com/api/users/login", formData);

      // Check for successful login and perform redirection
      if (response.status === 200) { // Assuming 200 means success
        // Optionally save the token or user information to localStorage
        localStorage.setItem('token', response.data.token); 
        
        localStorage.setItem("email",response.data.email);// Store token if returned
        navigate('/dashboard'); // Redirect to the dashboard
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle specific error messages based on server response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Show specific error message from the server
      } else {
        setError('Login failed. Please check your credentials.'); // Generic message for other errors
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

