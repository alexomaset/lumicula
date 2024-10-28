export default function Feedback() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-amber-50 p-4">
      <section className="w-full max-w-lg text-center text-black mt-8">
        <h2 className="text-xl font-semibold">Feedback</h2>
        <p className="mt-2">To give you the best possible support, please provide feedback on your experience.</p>
        <textarea
          className="w-full p-2 mt-4 border border-gray-300 rounded-md"
          placeholder="Write your feedback here and submit it."
        ></textarea>

        <input
          type="email"
          className="w-full p-2 mt-4 border border-gray-300 rounded-md"
          placeholder="Your email address"
        />
        
        <button className="mt-4 px-6 py-2 bg-black text-white rounded-md">
          Submit
        </button>
      </section>

      <section className="w-full max-w-lg text-center mt-8">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="mt-4 text-gray-700">
          We are here together. We all want to make our lives worth living. We are at your service to support you and help you.
          Sometimes, we just need deep discussions to analyze what we need to fix in our lives. We hope we can help you.
        </p>
      </section>
    </div>
  );
}
