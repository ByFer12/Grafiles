import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [rootFolder, setRootFolder] = useState(null);
  const [showModal3, setShowModal3] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRootFolder = localStorage.getItem('rootFolder');
    if (storedUser && storedRootFolder) {
      setUser(JSON.parse(storedUser));
      setRootFolder(JSON.parse(storedRootFolder));
    }
  }, []);

  const login = (userData, rootFolderData) => {
    setUser(userData);
    setRootFolder(rootFolderData);

    // Guardamos en localStorage para persistencia
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('rootFolder', JSON.stringify(rootFolderData));
  };

  const logout = () => {
    setUser(null);
    setRootFolder(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rootFolder');
  };

   // Funciones para controlar el modal
   const openModal3 = () => {setShowModal3(true); console.log("Abriendo")}
   const closeModal3 = () => setShowModal3(false);
 
   return (
     <UserContext.Provider
       value={{ user, rootFolder, login, logout, showModal3, openModal3, closeModal3 }}
     >
       {children}
     </UserContext.Provider>
   );
 };