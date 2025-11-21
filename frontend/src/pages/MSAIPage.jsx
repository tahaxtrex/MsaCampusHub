import ChatInterface from "../components/msai/ChatInterface";

const MSAIPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        MSAI Assistant
                    </h1>
                    <p className="mt-3 text-xl text-gray-500">
                        Your intelligent companion for Islamic knowledge and campus life
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 h-[600px]">
                    <ChatInterface />
                </div>
            </div>
        </div>
    );
};

export default MSAIPage;
