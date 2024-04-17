/*
  각각의 할 일 항목을 렌더링하는 컴포넌트입니다.
  각 할 일의 완료 상태에 따라 체크박스와 텍스트 스타일을 동기화하며,
  삭제 버튼을 통해 해당 할 일을 삭제할 수 있습니다.
  이 컴포넌트는 `TodoList.js`에서 사용되어 할 일 목록을 구성합니다.
*/
import React from "react";
import styles from "@/styles/TodoList.module.css";

// TodoItem 컴포넌트를 정의합니다.
const TodoItem = ({ todo, onToggle, onDelete }) => {
  // 각 할 일 항목을 렌더링합니다.
  const d = new Date(todo.id)
  const datestring = d.toLocaleDateString()
  return (
    <li class="flex items-center justify-between mb-2 bg-gray-100 p-2 rounded shadow">
      {/* 체크박스를 렌더링하고, 체크박스의 상태를 할 일의 완료 상태와 동기화합니다.
          체크박스의 상태가 변경되면 onToggle 함수를 호출하여 완료 상태를 업데이트합니다. */}
      <input type="checkbox" checked={todo.completed} onChange={onToggle} />

      {/* 할 일의 텍스트를 렌더링하고, 완료 상태에 따라 텍스트에 취소선을 적용합니다. */}
      <div
        class="ml-2 w-2/5 overflow-hidden"
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </div>

      <div
        class="ml-2 w-1/5 text-center overflow-hidden"
      >
        {datestring}
      </div>

      {/* 삭제 버튼을 렌더링하고, 클릭 시 onDelete 함수를 호출하여 해당 할 일을 삭제합니다. */}
      <button class="border-black bg-slate-500 text-white rounded-md" onClick={onDelete}>Delete</button>
    </li>
  );
};

// TodoItem 컴포넌트를 내보냅니다.
export default TodoItem;
