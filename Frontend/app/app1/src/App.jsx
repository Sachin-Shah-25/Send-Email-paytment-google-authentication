import {BrowserRouter ,Routes,Route} from 'react-router-dom'
import Home from './Home'
import Signup from './Signup'
import SignIn from './SignIn'
import Payment from './Payment'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<Home></Home>} ></Route>
        <Route path='/signup' element={<Signup></Signup>} ></Route>
        <Route path='/signin' element={<SignIn></SignIn>} ></Route>
        <Route path='/payment' element={<Payment></Payment>} ></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
