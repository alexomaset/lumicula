// pages/chat.tsx
export default function Chat() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      <header className="text-center text-black p-4">
        <div className="text-2xl font-bold">Lumicula</div>
        <p className="mt-2">On going chat</p>
      </header>

      <div className="flex-grow p-4">
        <div className="flex flex-col space-y-4">
          <div className="self-start bg-blue-300 p-3 rounded-md">
            <p>Hello, whats on your mind today?</p>
          </div>
          <div className="self-end bg-yellow-400 p-3 rounded-md">
            <p>All well here. Can you help me with clearing my thoughts?</p>
          </div>
          <div className="self-start bg-blue-300 p-3 rounded-md">
            <p>Whats on top of your mind right now?</p>
          </div>
          <div className="self-end bg-yellow-400 p-3 rounded-md">
            <p>I cannot really tell... difficult</p>
          </div>
        </div>
      </div>

      <footer className="flex items-center p-4">
        <input
          type="text"
          placeholder="Write"
          className="flex-grow p-2 border border-gray-300 rounded-md"
        />
        <button className="ml-2 bg-black text-white p-2 rounded-md">
          Send
        </button>
      </footer>

      <footer className="text-center text-sm mt-4">
        <p>Copyright 2024 Lumicula Inc</p>
        <p>Privacy policy | Terms of use</p>
      </footer>
    </div>
  );
}
