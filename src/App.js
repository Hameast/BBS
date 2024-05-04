import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Top from './components/Top';
import { Container } from 'react-bootstrap';
import Bottom from './components/Bottom';
import About from './components/About';
import Menu from './components/Menu';
import Books from './components/book/Books';

function App() {
  return (
    <Container>
      <Top />
      <Menu />
      <Bottom />
    </Container>
  );
}

export default App;
