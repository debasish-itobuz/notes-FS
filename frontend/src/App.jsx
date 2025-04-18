import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Cover from './pages/Cover';
import Login from './pages/Login';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Home from './pages/Home';
import EditNote from './components/EditNote';
import CreateNote from './components/CreateNote';
function App() {


  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path='/' element={<Cover />} />
          <Route path='/register' element={<Register />} />
          <Route path='/user/verify/:token' element={<Verify />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/editNote' element={<EditNote />} />
          <Route path='/createNote' element={<CreateNote />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
