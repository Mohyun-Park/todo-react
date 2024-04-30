/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
"use client";

import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore";

const todoCollection = collection(db, "todos");

// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const q = query(todoCollection);

    const results = await getDocs(q);
    const newTodos = [];
    
    results.docs.forEach((doc) => {
      newTodos.push({ id: doc.id, ...doc.data()});
    });
    setTodos(newTodos);
  };

  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = async (mydate) => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;
    
    // setTodos([...todos, { id: Date.now(), text: input, due: mydate, completed: false }]);
    const docRef = await addDoc(todoCollection,
      {text: input, due: mydate, completed: false}
    );
    
    setTodos([...todos, { id: docRef.id, text: input, due: mydate.toLocaleDateString(), completed: false}]);
    setInput("");
  };

  const complAll = (isDone) => {
    setTodos(
      todos.map((item) => {
        const todoDoc = doc(todoCollection, item.id);
        updateDoc(todoDoc, { completed: isDone });

        return {...item, completed: isDone};
      })
    );
  };

  const delAll = () => {
    todos.map((item) => {
      const todoDoc = doc(todoCollection, item.id);
      deleteDoc(todoDoc);
    })
    setTodos([]);
  };


  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
      // )
      // ...todo => id: 1, text: "할일1", completed: false
      todos.map((todo) => {
        if (todo.id === id) {
          const todoDoc = doc(todoCollection, id);
          updateDoc(todoDoc, { completed: !todo.completed });

          return { ...todo, completed: !todo.completed };
        } else {
          return todo;
        }
      })
    );
  };

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    
    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);
    
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  // 컴포넌트를 렌더링합니다.
  return (
    <div class="w-4/5 items-center justify-center mx-auto">
      <h1 class="w-full text-center text-2xl font-bold">SNU Todo List</h1>
      {/* 할 일을 입력받는 텍스트 필드입니다. */}

      <div class="flex w-6/7 items-center space-x-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Input type="text" placeholder="Name of job to do" value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={() => addTodo(date)}> Add Todo </Button>
      </div>
     <br>
     </br>
      <div class="flex justify-end mt-2">
        <Button variant="secondary" onClick={() => complAll(true)}>
          Complete All
        </Button>
        <Button variant="outline" onClick={() => complAll(false)}>
          Uncomplete All
        </Button>
        <Button variant="destructive" onClick={delAll}>
          Delete All
        </Button>
      </div>
      <br></br>
      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
