export const examples = [
    {
        id: 'fetch-todo',
        label: 'Async fetch',
        language: 'javascript',
        code: `async function loadTodo() {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
  const todo = await response.json();
  return todo.title;
}`,
    },
    {
        id: 'react-counter',
        label: 'React counter',
        language: 'jsx',
        code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      Count: {count}
    </button>
  );
}`,
    },
    {
        id: 'python-loop',
        label: 'Python loop',
        language: 'python',
        code: `numbers = [1, 2, 3, 4]
squares = []

for number in numbers:
    squares.append(number * number)

print(squares)`
    },
];