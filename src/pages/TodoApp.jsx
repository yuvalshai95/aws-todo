import React, { useEffect, useState } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { listTodos, todosByOwner } from '../graphql/queries.js';
import { onCreateTodo, onDeleteTodo, onUpdateTodo } from '../graphql/subscriptions';
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations'

// Cmps
import { Loader } from '../cmps/Loader.jsx'
import { TodoList } from '../cmps/TodoList.jsx';
import { AddTodo } from '../cmps/AddTodo.jsx';

export function TodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodoTxt, setNewTodoTxt] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nextToken, setNextToken] = useState(undefined)


  useEffect(() => {
    getLoggedInUser()
  }, [])

  useEffect(() => {
    onLoadTodos()
  }, [username])

  // onCreateTodo subscribe
  useEffect(() => {
    // Subscribe to creation of Todo
    const subscription = API.graphql(
      graphqlOperation(onCreateTodo)
    ).subscribe({
      next: (todoData) => {
        setTodos([todoData.value.data.onCreateTodo, ...todos])
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
      }
    });
    return () => {
      // Stop receiving data updates from the subscription
      subscription.unsubscribe();
    }
  }, [todos])

  const onLoadTodos = async () => {
    if (!username) return
    setIsLoading(true)
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

  if (isLoading) return <Loader />
  return (
    <section className="todo-app flex justify-center ">
      <div className="todo-card flex column">
        <h1 className="card-header"> Todo List</h1>
        <AddTodo
          newTodoTxt={newTodoTxt}
          setNewTodoTxt={setNewTodoTxt}
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
