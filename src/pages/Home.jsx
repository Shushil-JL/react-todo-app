import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Context, server } from '../main'
import Task from '../components/Task'
import { Navigate } from 'react-router-dom'

const Home = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tasks, setTasks] = useState([])
  const [btn, setBtn] = useState(false)

  const [refresh, setRefresh] = useState(false)

  const { isAuthenticated } = useContext(Context)


  const updateHandler = async (id) => {
    try {
      const { data } = await axios.put(`${server}/tasks/${id}`, {}, {
        withCredentials: true
      })
      setRefresh(prev => !prev)
      toast.success(data.message)

    } catch (error) {
      toast.error(error.response.data.message)
    }

  }
  const deleteHandler = async (id) => {
    try {
      const { data } = await axios.delete(`${server}/tasks/${id}`, {
        withCredentials: true
      },)
      setRefresh(prev => !prev)

      toast.success(data.message)

    } catch (error) {
      toast.error(error.response.data.message)

    }
  }
  const addTaskHandler = async (e) => {
    e.preventDefault()

    try {
      setBtn(true)
      const { data } = await axios.post(`${server}/tasks/new`, {
        title, description
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      setRefresh(prev => !prev)
      setTitle("")
      setDescription("")
      setBtn(false)
      toast.success(data.message)
    } catch (error) {
      setBtn(false)
      toast.error(error.response.data.message)

    }
  }

  useEffect(() => {
    if(isAuthenticated){
      axios.get(`${server}/tasks/my`, {
        withCredentials: true
      }).then((res) => {
        setTasks(res.data.tasks)
      }).catch((error) => {
        setTasks([])
        toast.error(error.response.data.message)
  
      })
    }
  }, [refresh])

  if (!isAuthenticated) return <Navigate to={"/login"} />

  return (
    <div className="container">

      <div className="login">
        <section>
          <form onSubmit={addTaskHandler} >
            <input type="text" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='Description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <button disabled={btn} type='submit'>Add Task</button>
          </form>
        </section>
      </div>
      <section className="todosContainer">
        {
          tasks.map(i => (
            <Task
              key={i._id}
              title={i.title}
              description={i.description}
              isCompleted={i.isCompleted}
              updateHandler={updateHandler}
              deleteHandler={deleteHandler}
              id={i._id}
            />

          ))
        }
      </section>
    </div>
  )
}

export default Home