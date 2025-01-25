const Unauthorized = () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-500">You do not have permission to view this page.</p>
        <a href="/" className="mt-4 text-blue-500 underline">
          Go back to the homepage
        </a>
      </div>
    );
  };
  
  export default Unauthorized;
  