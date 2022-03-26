import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useHistory } from 'react-router-dom';
export default function Dashboard() {
    const [form, setForm] = useState({
        title: '',
        note: ''
    });
    let [loggedInUser, setLoggedInUser] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const history = useHistory();
    //Gathers users info
    useEffect(() => {
        axios.get("http://localhost:8000/api/users/getloggedinuser", { withCredentials: true })
            .then(res => {
                console.log("res when getting logged in user", res)
                if (res.data.results) {
                    // this means user is logged in, and can access the page
                    setLoggedInUser(res.data.results)
                }
            })
            .catch(err => {
                console.log('err when getting logged in user', err)
                console.log('User Not Found')
                history.push("/")
                alert("Please Sign In")
            })
    }, [history])

    const logout = () => {
        axios.get('http://localhost:8000/api/users/logout/', { withCredentials: true })
            .then(res => {
                history.push("/")
            })
            .catch(err => {
                console.log("err deleting user", err)
            })
    }


    //TO DO FORM
    const onChangeHandler = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const addTodo = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8000/api/users/addTodo/" + loggedInUser._id, form, { withCredentials: true })
            .then(res => {
                if (res.data.err) {
                    setFormErrors(res.data.err.errors.todos.errors)
                }
                else {
                    // loggedInUser.todos.push(form)
                    // setLoggedInUser
                    window.location.reload(false)
                }
                console.log("res after adding todo", res)
            })
            .catch(err => {
                let toDoError = err.errors.todos.errors
                setFormErrors(toDoError)
                console.log('err adding todo', err)
            })
    }
    const deleteTodo = (userID, todoID) => {
        console.log(userID, todoID)
        axios.put('http://localhost:8000/api/users/deleteTodo/' + userID + "/" + todoID, { withCredentials: true })
            .then(res => {
                window.location.reload(false)
            })
            .catch(err => {
                console.log("err deleting todo", err)
            })
    }

    const handleComplete = (idx) => {
        const updatedTodo = loggedInUser.todos?.map((todo, i) => {
            console.log("IIIIII", i)
            if (idx === i) {
                if (todo.complete === false) {
                    todo.complete = true
                    console.log("Made True")

                }
                else {
                    todo.complete = false
                    console.log("Made False")
                    //     return todo
                }
            } return todo
        })
        setLoggedInUser(updatedTodo)
        console.log("MAde it past the stuff")
        axios.patch('http://localhost:8000/api/users/update/' + loggedInUser._id,
            loggedInUser, { withCredentials: true })
            .then(res => {
                console.log("res after updating user todo", res)
                window.location.reload(false)
            })
            .catch(err => {
                console.log('err after updating user todos', err)
            })
    }

    // const sortArray = type => {
    //     const types = {
    //         All: 'All',
    //         Not_Complete: 'Not Complete',
    //         Complete: 'Complete',
    //     };
    //     const sortProperty = types[type];
    //     const sorted = loggedInUser.todos.sort((a, b) => b[sortProperty] - a[sortProperty]);
    //     console.log(sorted);
    //     setLoggedInUser(sorted);
    // };

    return (
        <div>
            <div className='d-flex navbar p-3'>
                <h2>Welcome {loggedInUser.firstName}</h2>
                <Link to={"/edit"}><button className="btn">Profile</button></Link>
                <button className="btn " onClick={logout}>Logout</button>
            </div>

            <form onSubmit={addTodo} className='todoForm container mb-3 p-3 w-50'>
                <h5>Add To do</h5>
                <input type="text" placeholder='Title' name='title' className='container' onChange={onChangeHandler} maxLength="10" />
                <p className="text-danger">{formErrors.title?.message}</p>
                <input type="text" placeholder='Note' name='note' className='container' onChange={onChangeHandler} maxLength="125" />
                <p className="text-danger">{formErrors.note?.message}</p>
                <button type='addTodo submit'>Add</button>
            </form>
            {/* <div className='mb-3'>
                <select onChange={(e) => sortArray(e.target.value)}>
                    <option value="complete">All</option>
                    <option value="members">Not Complete</option>
                    <option value="formed">Complete</option>
                </select>
            </div> */}
            <div className='d-flex flex-row flex-wrap justify-content-evenly container'>
                {
                    loggedInUser.todos?.map((todo, i) => {
                        const todoClasses = []
                        if (todo.complete) {
                            todoClasses.push("taskDone")
                        }
                        return (
                            <div key={i} className='container w-50 h-50 '>
                                <div className='todos container p-0 d-flex  flex-column '>
                                    <span className='title rounded-top p-2 '><span className={todoClasses.join("")}> Title:  {todo.title} </span><Link to={"/todo/" + [todo._id]}> Edit </Link></span>
                                    <span className={todoClasses.join("")}>Note: {todo.note} </span>
                                    <div className='d-flex justify-content-between p-1'>
                                        <div className='d-flex align-items-center gap-2 '>
                                            <label>Completed</label>
                                            <input type="checkbox" onChange={() => { handleComplete(i) }} checked={todo.complete} />
                                        </div>
                                        <span className="btn " onClick={() => deleteTodo(loggedInUser._id, loggedInUser.todos[i]._id)}>🗑️</span>
                                    </div>
                                </div>
                            </div>)
                    })}
            </div>
        </div>
    )
}
