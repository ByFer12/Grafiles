import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext'; // Asegúrate de que tienes tu contexto de usuario

function ProtectedRoute({ children, roleRequired }) {
  const { user } = useUser();

  if (!user) {
    console.log("Usuario no existeeeeeeeeeeeeeeeeeiiiiiiiiiiiiiiiiiiiiiiiii: ",user)
    return <Navigate to="/" />;
  }

  if (user.rol !== roleRequired) {

    console.log("Protectedddddddddddddddddddxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx: ",user);
    // Si el usuario no tiene el rol adecuado, redirige a una página de no autorizado
    return <Navigate to="/" />;
  }

  // Si el usuario tiene el rol adecuado, renderiza el componente
  return children;
}

export default ProtectedRoute;