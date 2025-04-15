import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';
import Welcome from './Welcome'
import Quiz from './Quiz'

// Özel Route Bileşeni

function CheckNavigationGuard({ children, route }) {
    const nickname = useSelector(state => state.appVars.nickname)
    switch (route) {
        case '/':
            return !nickname ? children : <Navigate to="/quiz" />;
            break;
        case '/quiz':
            return nickname ? children : <Navigate to="/" />;
            break;
        default:
            break;
    }
}

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={
                    <CheckNavigationGuard route={'/'}>
                        <Welcome />
                    </CheckNavigationGuard>
                } />
            <Route 
                path="/quiz" 
                element={
                    <CheckNavigationGuard route={'/quiz'}>
                        <Quiz />
                    </CheckNavigationGuard>
                } 
            />

        </Routes>
    );
};

export default AppRoutes;