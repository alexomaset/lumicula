export default function TermsAndConditions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl text-black font-bold">Lumicula</h1>
          <div className="space-y-1">
            <div className="w-6 h-1 bg-gray-800"></div>
            <div className="w-6 h-1 bg-gray-800"></div>
            <div className="w-6 h-1 bg-gray-800"></div>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4">Privacy Policy</h2>
        <p className="text-gray-700 mb-6">
          All discussions are private between you and our healers. We store the
          conversations anonymously to help us all to improve the quality of our
          service with you.
        </p>
        <h2 className="text-xl font-semibold mb-4">Terms and Conditions</h2>
        <p className="text-gray-700 mb-6">
          Our service is being built up at the moment. Therefore, you are using
          our service as best effort service. We do not guarantee the accuracy
          of our healers advice as they are not accredited psychiatrists,
          psychologists, licensed social workers, licensed marriage and family
          therapists, but self-learned healers.
        </p>
        <footer className="text-center text-gray-600 mt-8">
          <p>Copyright 2024 Lumicula Inc</p>
          <p>Privacy policy | Terms of use</p>
        </footer>
      </div>
    </div>
  );
}
