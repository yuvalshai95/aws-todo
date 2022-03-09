import React, { useEffect, useState } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { todosByOwner } from '../graphql/queries.js';
import { onCreateTodo, onDeleteTodo, onUpdateTodo } from '../graphql/subscriptions';
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'

// Cmps
import { Loader } from '../cmps/Loader.jsx'
import { TodoList } from '../cmps/TodoList.jsx';
import { AddTodo } from '../cmps/AddTodo.jsx';
import { ProgressBar } from '../cmps/ProgressBar.jsx'

// Services
import { showUserMsg } from '../services/event-bus.service.js'

export function TodoApp() {
  const [todos, setTodos] = useState([])
  const [username, setUsername] = useState('')
  const [nextToken, setNextToken] = useState(undefined)
  const [progress, setProgress] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getLoggedInUser()
  }, [])

  useEffect(() => {
    onLoadTodos()
  }, [username])

  useEffect(() => {
    onChangeProgressBar()
  }, [todos])

  // onCreateTodo subscribe
  useEffect(() => {
    // Subscribe to creation of Todo
    const subscription = API.graphql(
      graphqlOperation(onCreateTodo)
    ).subscribe({
      next: (todoData) => {
        // Get real time updates from loggedInUser only
        if (todoData.value.data.onCreateTodo.owner === username) {
          const updatedTodos = [todoData.value.data.onCreateTodo, ...todos]
          setTodos(updatedTodos)
          showUserMsg('Todo Added successfully!')
        }
      }
    });
    return () => {
      // Stop receiving data updates from the subscription
      subscription.unsubscribe();
    }
  }, [todos])

  // onDeleteTodo subscribe
  useEffect(() => {
    // Subscribe to deletion of Todo
    const subscription = API.graphql(
      graphqlOperation(onDeleteTodo)
    ).subscribe({
      next: (todoData) => {
        const deletedTodoId = todoData.value.data.onDeleteTodo.id
        const updatedTodos = todos.filter(curTodo => (curTodo.id !== deletedTodoId))
        setTodos(updatedTodos)
        showUserMsg('Todo Deleted successfully!')
      }
    });
    return () => {
      // Stop receiving data updates from the subscription
      subscription.unsubscribe();
    }
  }, [todos])

  // onUpdateTodo subscribe
  useEffect(() => {
    // Subscribe to update of Todo
    const subscription = API.graphql(
      graphqlOperation(onUpdateTodo)
    ).subscribe({
      next: (todoData) => {
        const updatedTodo = todoData.value.data.onUpdateTodo
        const updatedTodos = todos.map(curTodo => {
          if (curTodo.id === updatedTodo.id) return updatedTodo
          return curTodo
        })
        setTodos(updatedTodos)
        showUserMsg('Todo edit successfully!')
      }
    });
    return () => {
      // Stop receiving data updates from the subscription
      subscription.unsubscribe();
    }
  }, [todos])

  const onLoadTodos = async () => {
    setIsLoading(true)
    if (!username) return
    try {
      const variables = {
        owner: username,
        sortDirection: 'DESC',
        limit: 5,
      }
      const { data } = await API.graphql(graphqlOperation(todosByOwner, variables));
      const todos = data.todosByOwner.items
      setTodos(todos)
      setNextToken(data.todosByOwner.nextToken)
    } catch (err) {
      console.log('Could not get todos', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getLoggedInUser = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser()
      setUsername(user.username)
    } catch (err) {
      console.log('Could not get user', err)
    }
  }

  const onToggleTodo = async (todo) => {
    if (!todo) return
    const { id, isDone } = todo
    try {
      const variables = {
        input: {
          id,
          isDone: !isDone
        }
      }
      await API.graphql(graphqlOperation(updateTodo, variables));
    } catch (err) {
      console.log('Could not update todo', err)
    }
  }

  const onEditTodo = async (todo, txt) => {
    if (todo.txt === txt || !txt || todo.isDone) return
    try {
      const variables = {
        input: {
          id: todo.id,
          txt
        }
      }
      await API.graphql(graphqlOperation(updateTodo, variables));
    } catch (err) {
      console.log('Could not edit todo', err)
    }

  }

  const onAddTodo = async (todoToAdd) => {
    todoToAdd.owner = username
    try {
      const variables = {
        input: todoToAdd
      }
      await API.graphql(graphqlOperation(createTodo, variables))
    } catch (err) {
      console.log('Could not add todo', err)
    }
  }

  const onRemoveTodo = async (id) => {
    if (!id) return
    try {
      const variables = {
        input: {
          id
        }
      }
      await API.graphql(graphqlOperation(deleteTodo, variables))
    } catch (err) {
      console.log('Could not delete todo', err)
    }
  }

  const onGetNextTodos = async () => {
    if (!nextToken) return
    try {
      const variables = {
        owner: username,
        sortDirection: 'DESC',
        limit: 5,
        nextToken
      }
      const { data } = await API.graphql(graphqlOperation(todosByOwner, variables));
      const nextTodos = data.todosByOwner.items
      setTodos([...todos, ...nextTodos])
      setNextToken(data.todosByOwner.nextToken)

    } catch (err) {
      console.log('Could not get next todos', err)
    }
  }

  const onChangeProgressBar = () => {
    const totalTodos = todos.length
    const finishedTodos = todos.reduce((finishedTodos, todo) => {
      if (todo.isDone) finishedTodos++
      return finishedTodos
    }, 0)
    const progress = (finishedTodos / totalTodos) * 100
    setProgress(progress)
  }


  if (isLoading) return <Loader />

  return (
    <section className="todo-app flex justify-center ">
      <div className="todo-card flex column">
        <h1 className="card-header"> Todo List</h1>
        <ProgressBar progress={progress} />
        <AddTodo
          onAddTodo={onAddTodo}
        />
        <TodoList
          todos={todos}
          onToggleTodo={onToggleTodo}
          onRemoveTodo={onRemoveTodo}
          onEditTodo={onEditTodo}
        />
        {(nextToken) && <button className="show-more-btn primary-btn" onClick={onGetNextTodos}>Show more</button>}
      </div>
    </section>
  );
}
