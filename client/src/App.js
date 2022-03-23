import './App.css';
import Signin from './components/Signin';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Edit from './components/Edit';
import EditTodo from './components/EditTodo';
function App() {
    return (
        <div className="App">
            <BrowserRouter>

                <Switch>

                    <Route exact path='/'>
                        <h1 className="pt-3 pb-3">Create a To Do List</h1>
                        <Signin />
                    </Route>

                    <Route exact path='/dashboard'>
                        <Dashboard />
                    </Route>


                    <Route exact path='/edit'>
                        <Edit />
                    </Route>


                    <Route exact path='/todo/:_id'>
                        <EditTodo />
                    </Route>

                    <Route path="*" >
                        <h1>There's nothing here: 404!</h1>
                        <Link to={"/"}><button>Sign IN</button></Link>
                    </Route>
                </Switch>

            </BrowserRouter>
        </div>
    );
}

export default App;
