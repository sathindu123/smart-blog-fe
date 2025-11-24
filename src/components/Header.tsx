import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";


export default function Header() {

    const navigate = useNavigate()
    const { user } = useAuth()

    const handleLogin = () => {
        navigate("/login")
    }

    return (
        <header className="bg-blue-500 text-white justfy-between items-center">
            <div className="flex space-x-4">
                <Link to="/home" className="hover: underline">Home</Link>
                <Link to="/post" className="hover: underline">Post</Link>
                {(user.roles?.includes("ADMIN") || user.roles?.includes("AUTHOR")) && <Link to="/mypost" className="hover: underline">My Post</Link>}
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={handleLogin} className="be-white text-blur">Logout</button>
            </div>
        </header>
    )
}