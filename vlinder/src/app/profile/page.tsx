import Hello from 'Components/hello';

const ProfilePage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-purple-100">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg w-11/12 sm:w-80 md:w-96 lg:w-1/4 text-center shadow-lg">
                <div className="bg-yellow-400 rounded-full w-16 h-16 flex items-center justify-center text-3xl">
                    👤
                </div>
                <div className="bg-yellow-400 w-full text-lg font-bold py-2 mt-4 rounded-lg text-gray-800">
                    John Johnson
                </div>
                <div className="bg-yellow-100 w-full py-2 mt-2 rounded-lg text-gray-800">
                    SEX: Male
                </div>
                <div className="bg-yellow-100 w-full py-2 mt-2 rounded-lg text-gray-800">
                    SMOKE: ❌
                </div>
                <div className="bg-yellow-100 w-full py-2 mt-2 rounded-lg text-gray-800">
                    AGE: 26
                </div>
                <div className="bg-yellow-100 w-full py-2 mt-2 rounded-lg text-gray-800">
                    HOBBY: ⚽ 🎵
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;